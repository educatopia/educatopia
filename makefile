.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


node_modules: package.json
	if test ! -d $@; then bun install; fi


.PHONY: type-check
type-check: node_modules
	bunx tsc


.PHONY: lint
# Lint all JavaScript files with ESLint
lint: node_modules
	bunx eslint --max-warnings 0 .


.PHONY: test
test: type-check lint
	bun test api/ routes/ public/


.PHONY: start
start: node_modules
	bun run server.ts


.PHONY: docker-build
# Build docker image "adius/educatopia"
docker-build:
	docker build \
		--tag adius/educatopia \
		--tag gcr.io/deploy-219812/educatopia \
		.


.PHONY: docker-start
docker-start: docker-build
	docker run \
		--rm \
		--name educatopia \
		-p 3470:3470 \
		adius/educatopia


.PHONY: docker-push
# Push image "adius/educatopia" to docker hub
docker-push: docker-build
	docker push adius/educatopia


.PHONY: docker-push-gcp
# Push image to private Google Cloud Platform registry
docker-push-gcp: docker-build
	docker push gcr.io/deploy-219812/educatopia


.PHONY: deploy
# Redeploy on Google Cloud Platform
deploy: docker-push-gcp
	kubectl replace -f k8s/app-deployment.yaml


# Make backup of educatopia database
db-dump:
	mongodump \
		--db educatopia \
		--out $@
