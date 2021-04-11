# Docker Vacuum

DockerVacuum is a utility container that will help keep a clean Docker in your
production server or development machine.

DockerVacuums prunes your system and programmatically deletes images that are not
in use, with a retention policy based on the tags.

```bash
docker run --rm \
--name docker-vacuum \
-e VACUUM_RULES="[{\"match\":\"(.*)\",\"retain\":1}]" \
-e VACUUM_DELAY=1000 \
-v /var/run/docker.sock:/var/run/docker.sock \
marcopeg/docker-vacuum
```

## Settings

Take a look at `.env.example` for a clear view how to configure it.

### VACUUM_DELAY

Delay to the first run after the container has started.

This option is useful to give time to existing containers to start, making sure that associated images and volumes don't get deleted due to racing conditions at boot time.

> By default DockerVacuum awaits 10 minutes before the first run.

### VACUUM_INTERVAL

# Cleanup interval in milliseconds

> By default DockerVacuum runs every 10 minutes.

### VACUUM_RULES

This is a JSON list of rules to customize the retention plan.

Each rule has a `match` regular expression that will target a group of image names
and a `retain` amount that is the number of most recent tags to keep on the disk.

> By default DockerVacuum try to cleanup everything, keeping the last 2 versions.

Example (JSON):

```json
[
  {
    "match": "(.*)",
    "retain": 2
  },
  {
    "match": "something-(.*)",
    "retain": 0
  }
]
```

Example (BASH):

```bash
VACUUM_RULES="[{"match":"(.*)","retain":2},{"match": "something-(.*)", "retain":0}]"
```

### VACUUM_SYSTEM_PRUNE

Tells DockerVacuum to run a `docker system prune`.  
_disabled by default_

```bash
VACUUM_SYSTEM_PRUNE=true
```

### VACUUM_SYSTEM_PRUNE_VOLUMES

Tells DockerVacuum to prune all unused volumes.  
_disabled by default_

```bash
VACUUM_SYSTEM_PRUNE_VOLUMES=false
```

## Collaboration

Please feel free to open [Issues](https://github.com/marcopeg/docker-vacuum/issues) & [Pull Requests](https://github.com/marcopeg/docker-vacuum/pulls).
