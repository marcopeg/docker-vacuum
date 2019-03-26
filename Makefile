
#
# Releases the production images to DockerHUB
#
release:
	(cd services/gatsby-deploy && make release)



#
# Development
#

dev:
	HUMBLE_ENV=dev humble build
	HUMBLE_ENV=dev humble up -d
	HUMBLE_ENV=dev humble logs -f

undev:
	HUMBLE_ENV=dev humble down



#
# Production Commands
#

build-prod:
	HUMBLE_ENV=prod humble build --no-cache

prod:
	HUMBLE_ENV=prod humble build
	HUMBLE_ENV=prod humble up -d
	HUMBLE_ENV=prod humble logs -f

unprod:
	HUMBLE_ENV=prod humble down

