test: lint


.PHONY: lint
# Lint all JavaScript files with ESLint
lint:
	eslint --max-warnings 0 .


.PHONY: docker-build
# Build docker image "adius/educatopia"
docker-build:
	docker build --tag adius/educatopia .


.PHONY: docker-push
# Push image "adius/educatopia" to docker hub
docker-push: docker-build
	docker push adius/educatopia


# Make backup of educatopia database
db-dump:
	mongodump \
		--db educatopia \
		--out $@
