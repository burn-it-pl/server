
## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## Migrations

```bash
# Create new Migration
npx prisma migrate dev --name migration_name

# Run Migrations
npx prisma migrate deploy

# Generate Schemas
npx prisma generate
```

## Seed

```bash
# Run the seed
npx prisma db seed

# Reinitialize the database with seed data.
npx prisma migrate reset
```

## Test

```bash
# unit tests
npm run test
```
