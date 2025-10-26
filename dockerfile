FROM oven/bun:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package.json
COPY bun.lock bun.lock
RUN bun install

# Sorted with increasing likelihood of change
COPY makefile makefile
COPY server.ts server.ts
COPY routes routes
COPY views views
COPY api api
COPY public public

TODO: Initialize the database via migrations

EXPOSE 3470

CMD ["bun", "run", "server.ts"]
