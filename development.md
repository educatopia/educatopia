# Development

Check out the [makefile] for all build steps.

[makefile]: ./makefile


## Create and Load Database Backup

1. Create backup with `mongodump`
1. Gzip directory: `tar -czf dump.tgz dump`
1. Encrypt file for secure transmission: `openssl des3 < dump.tgz > dump.bin`
1. Upload to transfer.sh:
    `curl --upload-file ./dump.bin https://transfer.sh/dump.bin`
1. Install curl in MongoDB container:
    ```sh
    apt update && \
    apt install curl
    ```
1. Download backup into MongoDB container
    ```sh
    curl \
        --location \
        --remote-name \
        https://transfer.sh/<id>/dump.bin
    ```
1. Decrypt file: `openssl des3 -d < dump.bin > dump.tgz`
1. Unpack database directory: `tar -xzf dump.tgz`
1. Load backup
    ```sh
    mongorestore \
        --db educatopia \
        ./dump/educatopia
    ```
1. Delete files `rm -rf dump.bin dump.tgz dump`


## Local

Start MongoDB server:

```sh
docker run --rm -p 27017:27017 mongo:3
```


## V-Server

### Setup

- OS: Ubuntu 24.04
- Database: SQLite
- Backend: Express server running on Bun.js
- Orchestration: PM2
- Edge Router: Caddy


### Deployment

```sh
apt update
apt upgrade
```

Set timezone of server to UTC:

```sh
timedatectl set-timezone UTC
```

Configure and enable firewall:

```sh
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

Install Bun:

```sh
curl -fsSL https://bun.sh/install | bash
```

```sh
git clone https://github.com/educatopia/educatopia
cd educatopia
```

Install all dependencies:

```sh
bun install --production
```

For process management we use Ubuntu's default `systemd`.
As an alternative you could also use PM2.
Check out the appendix for instructions.

Create a `/etc/systemd/system/educatopia.service` file
with following content:

```txt
[Unit]
Description=Educatopia Server
After=mongodb.service
After=network.target

[Service]
ExecStart=/home/root/.bun/bin/bun /root/educatopia/server.js
WorkingDirectory=/root/educatopia
Restart=always
RestartSec=5

StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=educatopia-server

User=root
# Group=<alternate group>
Environment=NODE_ENV=development
Environment=EDUCATOPIA_FEATURED_EXERCISES=5720f7386fcd760ac5ac889f,5e7a81fcff317963cd06cec1,5e7a77b7ff317963cd06cec0,57210d136fcd760ac5ac88b7

[Install]
WantedBy=multi-user.target
```

Enable the service and start it:

```sh
systemctl enable educatopia.service
systemctl start educatopia.service
systemctl status educatopia.service
```

Use `journalctl -u educatopia` for logging.

Now create a CNAME redirection to the v-server host for each domain
(e.g. v2202003116344111398.powersrv.de),
as the HTTP challenge is used for verifying the TLS certificates.

Install and set up Caddy.

Wait a few minutes until TLS certificates are obtained and
then the website should be reachable at <https://educatopia.org>.

When everything works as expected, it's time to switch to production mode.
Run `systemctl edit educatopia`
and update the environment variables for production:

```txt
[Service]
Environment=NODE_ENV=production
Environment=EDUCATOPIA_FEATURED_EXERCISES=<todo>
Environment=SESSION_SECRET=<todo>
Environment=SENDGRID_API_KEY=<todo>
```

Finally, restart the server with the new configuration:

```sh
systemctl restart educatopia.service
```


## Appendix

### Use PM2

Install production process manager:

```sh
npm install --global pm2
```

Start server in production mode:

```sh
pm2 start ./ecosystem.config.js
```
