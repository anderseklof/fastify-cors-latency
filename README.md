# fastify-cors-latency

**IMPORTANT: Only occuring in rare situations in Windows with WSL**

With this repo you can test if you have a rare latency/status code `400` problem with `@fastify/cors` and `fastify`. The problem has occured in my setup (Windows 10, WSL Ubuntu 20.04) when using large JWT tokens in request header. The exact cause and fix to this problem is unknown at this point.

The repo contains both a web client and a Fastify server.

## Installation

1. Clone repo in WSL.

2. `npm install`

## How to reproduce problems

Run `npm run server` in WSL.

### OK usage

1. Run `curl` both from WSL and Windows with 500 bytes JWT token to do simulate a server-to-server request (no CORS involved). This will not add any latency.

```
curl --request POST \
  --url http://localhost:2090/test-route \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' \
  --header 'Content-Type: application/json' \
  --data '[{
    "someKey": "someValue",
    "anotherKey": "anotherValue"
  }]'
```

2. Run `curl` both from WSL and Windows with a 1kB JWT token to do simulate a server-to-server request (no CORS involved). This will not add any latency.

```
curl --request POST \
  --url http://localhost:2090/test-route \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' \
  --header 'Content-Type: application/json' \
  --data '[{
    "someKey": "someValue",
    "anotherKey": "anotherValue"
  }]'
```

3. Open `client.html`. Press the "Request OK" button. This will do a request with 500 bytes of JWT token and activate CORS. This will not add any latency to the request.

### Latency problem

Open `client.html`. Press the "Request latency" button. This will do a request with a 1kB JWT token and activate CORS. This will add about ~50 ms of latency to the request.

### `400` status code

Open `client.html`. Press the "Request 400" button. This will do a request with a 3,5kB JWT token and activate CORS. This will cause the server to return `400` with the following error:

```
{
  "level": 30,
  "time": 1672583836064,
  "pid": 16113,
  "reqId": "req-19",
  "res": { "statusCode": 400 },
  "err": {
    "type": "SyntaxError",
    "message": "Expected ',' or ']' after array element in JSON at position 53",
    "stack": "SyntaxError: Expected ',' or ']' after array element in JSON at position 53\n    at JSON.parse (<anonymous>)\n    at Function.parse (/home/xxx/development/fastify-cors-latency/node_modules/secure-json-parse/index.js:26:20)\n    at Parser.defaultJsonParser [as fn] (/home/xxx/development/fastify-cors-latency/node_modules/fastify/lib/contentTypeParser.js:285:25)\n    at IncomingMessage.onEnd (/home/xxx/development/fastify-cors-latency/node_modules/fastify/lib/contentTypeParser.js:269:27)\n    at IncomingMessage.emit (node:events:513:28)\n    at endReadableNT (node:internal/streams/readable:1359:12)\n    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)",
    "statusCode": 400
  },
  "msg": "Expected ',' or ']' after array element in JSON at position 53"
}
```