# Educatopia

The goal of this website is to build an extensive library of exercises
from a variety of scientific topics such as Math, Digital Electronics,
Modelling, Computer Science, Biology, Chemistry, Physics, …


## Development

Check out the [makefile] for all build steps.

[makefile]: ./makefile


### Load Backup

1. Install curl in MongoDB container:
    ```sh
    apt-get update && \
    apt-get install curl
    ```
1. Load backup into Dropbox
1. Download backup into MongoDB container
    ```sh
    curl \
        --location \
        --remote-name \
        https://www.dropbox.com/s/0iklx9xn4vwy1oz/dump.tgz?dl=1
    ```
1. Unpack database directory: `tar -xzf dump.tgz`
1. Load backup
    ```sh
    mongorestore \
        --db educatopia \
        ./dump
    ```


## Related

- [abi-mathe.de](http://abi-mathe.de)
- [abi-physik.de](http://abi-physik.de)
- [abi-chemie.de](http://abi-chemie.de)
- [idodi.org](http://idodi.org)
- [serlo.org](http://serlo.org)
