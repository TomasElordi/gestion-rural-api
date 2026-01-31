# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS API for "Gestión Rural" - a comprehensive farm and grazing management system. The application manages organizations, farms, paddocks, water points, herd groups, and grazing events using PostgreSQL with PostGIS for geospatial data.

## Development Commands

```bash
# Install dependencies
npm install

# Development
npm run start:dev          # Watch mode (recommended for development)
npm run start              # Standard start
npm run start:debug        # Debug mode with watch

# Building
npm run build

# Code quality
npm run lint               # ESLint with auto-fix
npm run format             # Prettier formatting

# Testing
npm run test               # Run unit tests
npm run test:watch         # Watch mode for tests
npm run test:cov           # Coverage report
npm run test:e2e           # End-to-end tests
```

## Database Management

The project uses Prisma ORM with PostgreSQL and PostGIS extension:

```bash
# Generate Prisma client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Architecture

This project follows **Clean Architecture** with a modular structure. Each feature module is organized into distinct layers:

### Module Structure

Each module (auth, farms, organizations, etc.) follows this pattern:

```
src/modules/<module-name>/
├── domain/              # Business entities and repository interfaces
│   └── repositories/    # Repository abstracts (interfaces)
├── application/         # Use cases and business logic
│   ├── use-cases/      # Individual use cases (one per file)
│   └── services/       # Application services
├── infrastructure/      # External dependencies implementation
│   ├── repositories/   # Prisma repository implementations
│   └── strategies/     # Passport strategies (for auth)
└── presentation/        # HTTP layer
    ├── controllers/    # NestJS controllers
    └── dto/           # Data Transfer Objects with validation
```

### Key Architectural Patterns

1. **Dependency Inversion**: Domain layer defines repository interfaces; infrastructure layer implements them. Modules use dependency injection to bind interfaces to implementations:

   ```typescript
   { provide: UserRepository, useClass: PrismaUserRepository }
   ```

2. **Use Case Pattern**: Each business operation is a separate use case class in `application/use-cases/`. Controllers inject and execute use cases, keeping HTTP concerns separate from business logic.

3. **Repository Pattern**: Database access is abstracted through repository interfaces defined in `domain/` and implemented in `infrastructure/repositories/` using Prisma.

4. **Global Modules**:
   - `PrismaModule` is global (available everywhere without re-importing)
   - `ConfigModule` is global for environment variables

### Authentication & Authorization

- JWT-based authentication with separate access and refresh tokens
- Two strategies: `jwt` (access tokens) and `jwt-refresh` (refresh tokens)
- Password hashing with argon2
- Global JWT guard (`JwtAuthGuard`) is applied via `APP_GUARD` in main.ts
- Use `@Public()` decorator to bypass authentication on specific endpoints
- `@CurrentUser()` decorator extracts authenticated user from request
- Refresh tokens are hashed and stored in database for security

### Multi-tenancy

The system uses organization-based multi-tenancy:

- Users belong to organizations through `Membership` model
- Memberships have roles: `owner`, `admin`, `advisor`, `operator`, `viewer`
- Each farm belongs to an organization
- All farm-related data (paddocks, water points, herd groups, grazing events) cascade from farms

### Geospatial Data

The project uses PostGIS for spatial data:

- Farm centers: `geometry(Point, 4326)`
- Paddock polygons: `geometry(Polygon, 4326)`
- Water point locations: `geometry(Point, 4326)`
- In Prisma schema, these are marked as `Unsupported("geometry")`
- When working with geospatial data, you'll need to use raw SQL or PostGIS functions

## Swagger Documentation

API documentation is auto-generated and available at `/docs` when the server is running. Controllers use decorators like `@ApiTags()`, `@ApiBearerAuth()`, `@ApiOperation()` to enhance documentation.

## Environment Variables

Required environment variables (see `.env`):

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (defaults to 3000)
- `JWT_ACCESS_SECRET`: Secret for access token signing
- `JWT_REFRESH_SECRET`: Secret for refresh token signing
- `JWT_ACCESS_TTL`: Access token expiration (e.g., "15m")
- `JWT_REFRESH_TTL`: Refresh token expiration (e.g., "30d")

## Common Patterns

### Creating a New Module

1. Generate module: `nest g module modules/<name>`
2. Create layer directories: `domain/`, `application/use-cases/`, `infrastructure/repositories/`, `presentation/`
3. Define repository interface in `domain/repositories/`
4. Implement repository in `infrastructure/repositories/`
5. Create use cases in `application/use-cases/`
6. Create DTOs in `presentation/dto/` with `class-validator` decorators
7. Create controller in `presentation/`
8. Register providers in module with dependency injection bindings

### Validation

DTOs use `class-validator` and `class-transformer`:

- Global `ValidationPipe` is configured with `whitelist: true` and `transform: true`
- Always define DTOs with proper decorators (`@IsString()`, `@IsEmail()`, etc.)
- The pipeline automatically strips unknown properties and transforms types

### Error Handling

Use NestJS built-in HTTP exceptions:

- `NotFoundException` for missing resources
- `UnauthorizedException` for auth failures
- `ForbiddenException` for permission issues
- `BadRequestException` for validation errors

## Common Mistakes to Avoid

**IMPORTANT**: These are recurring errors that MUST be avoided when creating new modules:

### 1. PrismaService Import Path

**❌ WRONG:**

```typescript
import { PrismaService } from '../../../../prisma/prisma.service';
```

**✅ CORRECT:**

```typescript
import { PrismaService } from '@prisma/prisma.service';
```

**Rule**: ALWAYS use `'prisma/prisma.service'` (no relative path) because PrismaModule is global.

### 2. JwtUser Type Import

**❌ WRONG:**

```typescript
import {
  CurrentUser,
  JwtUser,
} from '../../../common/decorators/current-user.decorator';
```

**✅ CORRECT:**

```typescript
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../common/decorators/current-user.decorator';
```

**Rule**: `JwtUser` is a TYPE, not a class. It must be imported with `import type` to avoid `isolatedModules` errors with `emitDecoratorMetadata`.

### 3. Use Case File Structure

**Rule**: Every use case must:

- Import `PrismaService` correctly (see #1)
- Validate farm ownership before operations:
  ```typescript
  const farm = await this.prisma.farm.findFirst({
    where: { id: farmId, organizationId, deletedAt: null },
  });
  if (!farm) {
    throw new NotFoundException('Farm not found or access denied');
  }
  ```
- Delegate actual DB operations to the repository

### 4. Controller Patterns

**Rule**: Controllers must:

- Import `JwtUser` as a type (see #2)
- Use `@CurrentUser() user: JwtUser` to get authenticated user
- Pass `user.orgId!` to use cases for authorization
- Use `ParseUUIDPipe` for UUID params
