# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **Node.js/Express REST API** for an e-commerce clothing shop backed by **MySQL 8**. There is no frontend — all interaction is via HTTP/JSON endpoints. See `package.json` scripts and `README.md` for basics.

### Services

| Service | How to start | Default port |
|---------|-------------|-------------|
| MySQL 8 | `sudo mysqld --user=mysql --datadir=/var/lib/mysql &` | 3306 |
| Express API | `npm run dev` (uses nodemon) | 3000 |

### MySQL setup (one-time)

MySQL must be installed and running before the API can start. After installing, you need to:

1. Start mysqld: `sudo mysqld --user=mysql --datadir=/var/lib/mysql &`
2. Fix socket dir permissions: `sudo chmod 755 /var/run/mysqld/`
3. Set the root password to match the `DB_PASSWORD` secret: `sudo mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>'; FLUSH PRIVILEGES;"`
4. Create the database: `mysql -u root -p<password> -e "CREATE DATABASE IF NOT EXISTS ecommerce_cloth_shop;"`
5. Apply the schema: `mysql -u root -p<password> ecommerce_cloth_shop < schema.sql`

### Environment variables

DB credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) are injected via Cursor Cloud secrets. The app also reads from `.env` via dotenv, but **dotenv v17 does not override existing env vars** — so Cursor Cloud secrets always take precedence. A `.env` file is still needed as a fallback for local dev; copy `.env.example` and fill in values.

### Gotchas

- The `systemctl` service manager is not available in the Cloud VM — start `mysqld` directly as shown above.
- `/var/run/mysqld/` directory permissions default to `drwx------` (mysql-only); you must `chmod 755` it so the Node process can access the socket.
- There are no automated tests in this project (`npm test` is a placeholder that exits with error).
- There is no lint configuration (no ESLint/Prettier). No lint checks to run.
- There is no build step — the project runs plain CommonJS directly with Node.
