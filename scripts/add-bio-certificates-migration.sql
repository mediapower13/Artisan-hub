-- Migration to add bio and certificates fields to providers table
-- This should be run in your Supabase SQL Editor or via the CLI

-- Add bio column to providers table
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add certificates column to providers table (array of text for storing URLs)
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS certificates TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add comment for documentation
COMMENT ON COLUMN providers.bio IS 'Professional bio/background of the artisan provider';
COMMENT ON COLUMN providers.certificates IS 'Array of URLs pointing to uploaded certificate files';

-- Update existing providers to have empty certificates array if null
UPDATE providers 
SET certificates = ARRAY[]::TEXT[] 
WHERE certificates IS NULL;

-- Create index for better performance on certificate searches
CREATE INDEX IF NOT EXISTS idx_providers_certificates 
ON providers USING GIN (certificates);

-- Create index for bio text search
CREATE INDEX IF NOT EXISTS idx_providers_bio_search 
ON providers USING GIN (to_tsvector('english', bio));
