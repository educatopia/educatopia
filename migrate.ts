import fs from "node:fs"
import path from "node:path"
import { Database } from "bun:sqlite"

const migrationsDir = path.join(__dirname, "migrations")

type MigrateOptions = {
  // Directory holding the numbered `<n>.sql` files. Defaults to ./migrations.
  dir?: string
  // Where progress is reported. Defaults to console.info; pass `() => {}` to silence.
  log?: (_message: string) => void
}

// List of `<n>.sql` migration files sorted by their numeric prefix.
// The prefix must equal the file's position (0.sql, 1.sql, …) so that
// `PRAGMA user_version` can be used as a simple "migrations applied" counter.
function listMigrations(dir: string): { version: number; file: string }[] {
  const migrations = fs
    .readdirSync(dir)
    .filter((name) => /^\d+\.sql$/.test(name))
    .map((file) => ({ version: parseInt(file, 10), file }))
    .sort((a, b) => a.version - b.version)

  migrations.forEach((migration, index) => {
    if (migration.version !== index) {
      throw new Error(
        `Migration files must be numbered contiguously from 0. ` +
          `Expected ${index}.sql but found ${migration.file}.`,
      )
    }
  })

  return migrations
}

// Apply every migration whose version is >= the database's current
// `user_version`, each inside its own transaction together with the
// `user_version` bump so a failure leaves the version untouched.
// `user_version` therefore equals the number of migrations applied.
export function migrate(database: Database, options: MigrateOptions = {}): number {
  const dir = options.dir ?? migrationsDir
  const log = options.log ?? ((message: string) => console.info(message))

  const migrations = listMigrations(dir)
  const { user_version: currentVersion } = database
    .query("PRAGMA user_version")
    .get() as { user_version: number }

  const pending = migrations.filter((m) => m.version >= currentVersion)

  if (pending.length === 0) {
    log(`Database schema up to date (version ${currentVersion}).`)
    return currentVersion
  }

  for (const { version, file } of pending) {
    const sql = fs.readFileSync(path.join(dir, file), "utf8")
    log(`Applying migration ${file} …`)
    database.transaction(() => {
      database.exec(sql)
      database.exec(`PRAGMA user_version = ${version + 1}`)
    })()
  }

  const newVersion = pending[pending.length - 1].version + 1
  log(`Migrated database to version ${newVersion}.`)
  return newVersion
}
