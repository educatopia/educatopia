# Development

Check out the [makefile] for all build steps.

[makefile]: ./makefile


## Production Server

### Setup

- Host: `cloud.feram.io`
- Database: SQLite (`educatopia.sqlite`, bind-mounted into the container)
- Backend: Express server running on Bun.js, in a Docker container
- Orchestration: Docker Compose (`docker-compose.yml`)
- Edge Router: Traefik (shared `http_network`, handles TLS for `educatopia.org`)

The repository is checked out on the server at
`/home/admin/Docker/educatopia`.
Production environment variables (`SESSION_SECRET`,
`LETTERMINT_API_TOKEN`, `EDUCATOPIA_FEATURED_EXERCISES`, …)
are set in the `environment` block of `docker-compose.yml` on the server.


### Deployment

Deploy the latest code from your machine with:

```sh
make deploy
```

This SSHes into `cloud.feram.io`, pulls the latest code, and rebuilds and
restarts the container. Equivalent to running on the server:

```sh
cd /home/admin/Docker/educatopia
git pull
docker compose up -d --build
```

`--build` rebuilds the image from the updated code and `-d` restarts the
container in detached mode. Traefik keeps routing `educatopia.org` to the new
container automatically.


### Sanity checks

After deploying, verify the container started and the site is serving:

```sh
docker compose logs -f --tail=50 educatopia   # watch startup
curl -I https://educatopia.org                # verify it's serving
```
