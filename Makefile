#
# Simple interface to run Docker!
#


# Running container's name
organization?=marcopeg
name:=$(shell node -p "require('./package.json').name")
version:= $(shell node -p "require('./package.json').version")

# Docker image tag name
tag?=${organization}/${name}

# Mish
nodeEnv?=development
loglevel?=info
vacuumInterval?=5000
vacuumRules?="[{\"match\":\"(.*)\",\"retain\":2},{\"match\":\"hello-world\",\"retain\":0}]"

# Build the project using cache
image:
	docker build -t ${tag} -t ${tag}:${version} .
	
# Spins up a container from the latest available image
# this is useful to test locally
run:
	docker run \
		--rm \
		--name ${name} \
		-e NODE_ENV=${nodeEnv} \
		-e LOG_LEVEL=${loglevel} \
		-e VACUUM_INTERVAL=${vacuumInterval} \
		-e VACUUM_RULES=${vacuumRules} \
		-v /var/run/docker.sock:/var/run/docker.sock \
		${tag}

stop:
	docker stop ${name}

remove:
	docker rm ${name}

publish:
	docker tag ${tag}:${version} ${tag}:${version}
	docker tag ${tag}:${version} ${tag}:latest
	docker push ${tag}:${version}
	docker push ${tag}:latest

release: image publish
