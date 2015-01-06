var http = require('http');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var fs = require('fs');
var port = process.argv[2] || 7823;

var uploadDir = '/uploads';

http.createServer(function(req, res) {

  console.log(req.method)

  if (req.method === 'POST') {
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function () {

      var filename = generateFilename();

      var filepath = __dirname + uploadDir + '/' + filename;

      var params = qs.parse(body);

      if (!params.base64) {
        return errResponse('base64 parameter required');
      }

      base64ToFile(params.base64, filepath, function(err, filepath) {
        if (err) {
          errResponse(err);
          return;
        }

        var imageurl = 'http://localhost:' + port + uploadDir + '/' + filename;

        successResponse({image_url: imageurl});
      });
    });
  } else {
    var file = __dirname + req.url;

    var ext = file.split('.');
    ext = ext[ext.length-1];
    if (/png/gi.test(ext)) {
      var filename = path.basename(file);
      var mimetype = 'image/' + ext;

      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      var filestream = fs.createReadStream(file);
      filestream.pipe(res);
    }
  }


  var headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
      'Content-Type': 'application/json'
  };

  function successResponse(data) {
    res.writeHead(200, headers);
    res.write(JSON.stringify(data));
    res.end();
  }


  function errResponse(err) {
    console.log(err);
    res.writeHead(500, headers);
    res.write(JSON.stringify({error: err}));
    res.end();
  }

}).listen(port, 10);

function base64ToFile(base64, filename, callback) {
  var buff = new Buffer(base64.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');

  fs.writeFile(filename, buff, function(err) {
    callback(err, filename);
  });
}

function generateFilename() {
  return Date.now() + '.png';
}
