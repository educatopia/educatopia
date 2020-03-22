# Development

## V-Server (Ubuntu 18.04)

- Database: MongoDB
- Backend: Express server running on Node.js
- Orchestration: PM2


### Deployment

```sh
apt update
```

Install and start MongoDB 3:

```sh
apt install mongodb
```

Install Node.js 12 and its package manager npm:

```sh
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
apt-get install -y nodejs
```

```sh
git clone https://github.com/educatopia/educatopia
cd educatopia
```

Install all dependencies:

```sh
npm install --production
```

Install production process manager:

```sh
npm install --global pm2
```

Start server in production mode:

```sh
pm2 start ecosystem.config.js
```


### Development

Start app in development watch mode:

```sh
pm2 start ecosystem.config.js --env development --watch
```

Forward port to your local machine:

```sh
ssh -N -L 3000:localhost:3000 netcup
```

Install FUSE for macOS:

```sh
brew cask install osxfuse
```

Mount `educatopia` directory on server locally:

```sh
sshfs netcup:/educatopia ./educatopia
```
