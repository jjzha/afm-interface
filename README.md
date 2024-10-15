# afm-interface


## How to run

We ran the application on Ubuntu 22.04 with 4 T4 GPUs.

1. Run the following:

```
bash install_dependencies.sh
```

2. Simply run:

```
docker compose up --build
```

As we assumed 4 GPUs. Feel free to change `"--tensor_parallel_size=4"` inside of the docker compose yaml.
