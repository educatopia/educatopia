FROM oven/bun:latest

# `make` is needed to run the makefile targets (e.g. the client build);
# the bun base image doesn't ship it.
RUN apt-get update \
  && apt-get install -y --no-install-recommends make \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package.json
COPY bun.lock bun.lock
RUN bun install

# Sorted with increasing likelihood of change
COPY makefile makefile
COPY migrate.ts migrate.ts
COPY server.ts server.ts
COPY migrations migrations
COPY routes routes
COPY views views
COPY api api
COPY client client
COPY public public

# Bundle client-side TypeScript into public/js (gitignored, so built here).
RUN make build

EXPOSE 3470

CMD ["bun", "run", "server.ts"]
