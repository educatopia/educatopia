.PHONY: docker-build
# Build docker image "adius/educatopia"
docker-build:
	docker build --tag adius/educatopia .


.PHONY: docker-push
# Push image "adius/educatopia" to docker hub
docker-push:
	docker push adius/educatopia


.PHONY: hyper-deploy
# Deploy docker composition to hyper.sh
hyper-deploy:
	hyper compose pull --file=hyper-compose.yaml
	hyper compose up --file=hyper-compose.yaml


.PHONY: hyper-clean
# Shut down and remove docker containers on hyper.sh
hyper-clean:
	hyper compose down


# Make backup of educatopia database
db-dump:
	mongodump \
		--db educatopia \
		--out $@
