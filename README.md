# getUserMedia demo

Taking screenshots with [getUserMedia](https://developer.mozilla.org/en-US/docs/NavigatorUserMedia.getUserMedia) API.

This a demo of how to use getUserMedia to access your webcam and capture a screenshot by drawing a frame to a canvas element and creating a base64 string from it which we then send it over to the node server to write to a file.

# Demo

[http://lab.moogs.io/getusermedia-demo](http://lab.moogs.io/getusermedia-demo)

# Usage

```bash
node server/server.js
```

```bash
cd client/

python -m SimpleHTTPServer 9999
```

Navigate to demo at `http://localhost:9999`

# License

MIT
