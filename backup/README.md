# Managing Database Backups from Heroku

This document describes how to manage database backups from Heroku.

## Downloading from Heroku

Reference: <https://devcenter.heroku.com/articles/heroku-postgres-import-export>

1. Run Postgres Docker Container:

   ```bash
   docker run -it --rm --entrypoint bash -v $PWD:/mnt/esg-remake postgres
   ```

2. Run the `pg_dump` command:

   ```bash
   pg_dump -Fp --no-acl --no-owner $DATABASE_CONNECTION_STRING > esg.dump
   ```

   _PS: Get $DATABASE_CONNECTION_STRING from Heroku Dashboard._

3. Import into local database:

   ```bash
   pg_restore --verbose --clean --no-acl --no-owner -h localhost -U myuser -d mydb esg.dump
   ```

4. To import into Supabase:

   ```bash
   pg_restore -d "postgresql://postgres.[YOUR-USERNAME]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" esg.dump
   ```
