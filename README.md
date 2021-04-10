# Docker Vacuum

DockerVacuum is a utility container that will help keep a clean Docker in your
production server or development machine.

DockerVacuums prunes your system and programmatically deletes images that are not
in use, with a retention policy based on the tags.

    docker run \
    	--rm \
    	--name docker-vacuum \
    	-e VACUUM_RULES="[{\"match\":\"(.*)\",\"retain\":2}]" \
    	-v /var/run/docker.sock:/var/run/docker.sock \
    	marcopeg/docker-vacuum:0.1.0

## Settings

#### VACUUM_INTERVAL

DockerVacuum will keep quiet for that amount of **milliseconds** before it cleans
your system up again.

> By default DockerVacuum runs every 10 minutes.

#### VACUUM_RULES

This is a JSON list of rules to customize the retention plan.

Each rule has a `match` regular expression that will target a group of image names
and a `retain` amount that is the number of most recent tags to keep on the disk.

> By default DockerVacuum try to cleanup everything, keeping the last 2 versions.

#### VACUUM_SYSTEM_PRUNE

Tells DockerVacuum to run a system prune before running the images drop.

## Collaborations

Please feel free to open Pull Requests
