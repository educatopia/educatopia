from node:8

run mkdir -p /usr/src/app
workdir /usr/src/app

copy package.json package.json
copy package-lock.json package-lock.json
run npm install

# Sorted with increasing likelihood of change
copy jakefile jakefile
copy server.js server.js
copy routes routes
copy views views
copy api api
copy public public

expose 3000

cmd npm start
