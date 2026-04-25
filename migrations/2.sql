-- Add a timestamp for when the current confirmation code was issued,
-- so the application can expire stale codes (see issue #38).
-- Existing unconfirmed users get the column backfilled from createdAt
-- so their codes immediately have an age and will expire as expected.

BEGIN;

ALTER TABLE users ADD COLUMN confirmationCodeCreatedAt TEXT;

UPDATE users
  SET confirmationCodeCreatedAt = createdAt
  WHERE confirmationCode IS NOT NULL;

COMMIT;
