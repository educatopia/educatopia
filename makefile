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


.PHONY: hyper-deploy
# Deploy docker composition to hyper.sh
hyper-deploy: docker-push
	hyper compose pull --file=hyper-compose.yaml
	hyper compose up --file=hyper-compose.yaml --detach


# FIXME: Blocked by https://github.com/hyperhq/hypercli/issues/242
# .PHONY: hyper-redeploy
# # Only redeploy express app
# hyper-redeploy: docker-push
# 	hyper compose pull --file=hyper-compose.yaml
# 	hyper compose up \
# 		--file=hyper-compose.yaml \
# 		--no-deps \
# 		--detach \
# 		adius/educatopia


.PHONY: hyper-redeploy
# Only redeploy express app
hyper-redeploy: docker-push
	hyper rm --force educatopia-app-1
	hyper run \
		--detach \
		--name educatopia-app-1 \
		--link educatopia-mongo-1:mongo \
		--publish 80:3000 \
		--env-file secrets.env \
		adius/educatopia
	hyper fip attach educatopia-ip educatopia-app-1


.PHONY: hyper-clean
# Shut down and remove docker containers on hyper.sh
hyper-clean:
	hyper compose down


# Make backup of educatopia database
db-dump:
	mongodump \
		--db educatopia \
		--out $@
