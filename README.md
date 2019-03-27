Docker Vacuum?
=================

Docker Vacuum is a utility container that will help keep a clean Docker in your
production server or development machine.

Docker Vacuums prunes your system and programmatically deletes images that are not
in use, with a retention policy based on the tags.

    docker run \
		--rm \
		--name docker-vacuum \
		-e VACUUM_INTERVAL=5000 \
		-e VACUUM_RULES="[{\"match\":\"(.*)\",\"retain\":2}]" \
		-v /var/run/docker.sock:/var/run/docker.sock \
		docker-vacuum:latest

## Settings

#### VACUUM_INTERVAL

Docker Vacuum will keep quiet for that amount of **milliseconds** before it cleans
your system up again.

> By default Docker Vacuum runs every 10 minutes.

#### VACUUM_RULES

This is a JSON list of rules to customize the retention plan.

Each rule has a `match` regular expression that will target a group of image names
and a `retain` amount that is the number of most recent tags to keep on the disk.

> By default Docker Vacuum try to cleanup everything, keeping the last 2 versions.

