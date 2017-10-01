# Educatopia

The goal of this website is to build an extensive library of exercises
from a variety of scientific topics such as Math, Digital Electronics,
Modelling, Computer Science, Biology, Chemistry, Physics, …


## Related

- [abi-mathe.de](http://abi-mathe.de)
- [abi-physik.de](http://abi-physik.de)
- [abi-chemie.de](http://abi-chemie.de)
- [idodi.org](http://idodi.org)
- [serlo.org](http://serlo.org)


## Restore Backup

- `scp ./edu.tgz 53cb8db74382ec6076000a34@educatopia-adius.rhcloud.com:/var/lib/openshift/53cb8db74382ec6076000a34/app-root/data/`
- `mongorestore -u admin -p 4RdZcLdbA1et --port $OPENSHIFT_MONGODB_DB_PORT -h $OPENSHIFT_MONGODB_DB_HOST educatopia/`
