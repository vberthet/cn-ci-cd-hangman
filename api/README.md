# Hangman API

Backend of the Hangman online demo app: Spring Boot 4.1, Java 25, MySQL 8.4.

## Run the tests

```bash
./mvnw verify
```

Tests use an in-memory H2 database (MySQL mode): no MySQL or Docker needed.
JUnit reports are written to `target/surefire-reports/`.

## Run locally

Start a MySQL 8.4 database (the devcontainer provides one), then:

```bash
./mvnw spring-boot:run
```

The API listens on http://localhost:8080. Flyway creates the schema and seeds ~150 words at startup.

- `GET /api/info` — deployed version and environment
- `GET /actuator/health` — health check
- `POST /api/games` — start a game

## Build the jar

```bash
./mvnw package          # runs the tests too; add -DskipTests to skip them
java -jar target/hangman-api-0.0.1-SNAPSHOT.jar
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/hangman` | JDBC URL of the MySQL database |
| `SPRING_DATASOURCE_USERNAME` | `hangman` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | `hangman` | Database password |
| `APP_VERSION` | `dev` | Version shown by `/api/info` and sent to Sentry as the release |
| `APP_ENVIRONMENT` | `development` | Environment name shown by `/api/info` and sent to Sentry |
| `SENTRY_DSN` | _(empty)_ | Sentry project DSN. Empty = Sentry disabled |
| `ADMIN_TOKEN` | _(empty)_ | When set, `POST`/`DELETE /api/words` require the header `X-Admin-Token: <token>` |

`GET /api/debug/error` fails on purpose to check that errors reach Sentry.
