test: lint


.PHONY: lint
# Lint all JavaScript files with ESLint
lint:
	eslint --max-warnings 0 .


.PHONY: docker-build
# Build docker image "adius/educatopia"
docker-build:
	docker build \
		--tag adius/educatopia \
		--tag gcr.io/deploy-219812/educatopia \
		.


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
