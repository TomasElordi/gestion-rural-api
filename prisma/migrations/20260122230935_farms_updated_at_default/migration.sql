-- This is an empty migration.
ALTER TABLE farms
  ALTER COLUMN updated_at SET DEFAULT now();


CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_farms_updated_at') THEN
    CREATE TRIGGER trg_farms_updated_at
    BEFORE UPDATE ON farms
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;
