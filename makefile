.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


node_modules: package.json
	if test ! -d $@; then bun install; fi


.PHONY: type-check
type-check: node_modules
	bunx tsc


.PHONY: lint  # Lint all JavaScript files with ESLint
lint: node_modules
	bunx eslint --max-warnings 0 .


.PHONY: format  # Auto-fix lint issues with ESLint
format: node_modules
	bunx eslint --fix .


.PHONY: test
test: type-check lint
	bun test api/ routes/ public/


.PHONY: start
start: node_modules
	bun run server.ts


.PHONY: docker-build  # Build docker image "adius/educatopia"
docker-build:
	docker build \
		--tag adius/educatopia \
		.


.PHONY: docker-start
docker-start: docker-build
	docker run \
		--rm \
		--name educatopia \
		-p 3470:3470 \
		adius/educatopia


.PHONY: docker-push  # Push image "adius/educatopia" to docker hub
docker-push: docker-build
	docker push adius/educatopia


.PHONY: deploy  # Pull latest code on the production server (cloud.feram.io) and rebuild
deploy:
	ssh cloud.feram.io '\
		cd /home/admin/Docker/educatopia && \
		git pull && \
		docker compose up -d --build'
