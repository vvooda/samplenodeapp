var http = require("http");
var fs = require("fs");
var ejs = require('ejs');
var path = require('path');
var url = require("url");

http.createServer(function (request, response) {

var filePath = request.url;
if (filePath == '/' || filePath == '/ind')
  filePath = '/templates/index.html';
else if (filePath == '/env')
  filePath = '/templates/environment.html';

filePath = __dirname+filePath;
var extname = path.extname(filePath);
var contentType = 'text/html';

	var queryObject = url.parse(request.url,true).query;
	var flag=queryObject.testFlag;
	if(flag==1)
	{
		response.writeHead(200,{"Content-type":"text/plain"});
		response.end("Hello from Node!" + process.env.APAAS_CONTAINER_NAME);
	}

switch (extname) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
}

fs.exists(filePath, function(exists) {
	
    if (exists) {
	if(extname!='.html'){
		fs.readFile(filePath, function(error, content) {
		    if (error) {
			response.writeHead(500);
			response.end();
		    }
		    else {
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(content, 'utf-8');
			}
		});
	}
	if (extname == '.html'){
		fs.readFile(filePath,'utf-8',function(error, content) {
		    if (error) {
			response.writeHead(500);
			response.end();
		    }
		    else {
			response.writeHead(200, { 'Content-Type': contentType });
			var renderedHtml = ejs.render(content,{data:process.env});  //get redered HTML code
			response.end(renderedHtml);
			}
		});
	}
	
    }

 }); //end of fs.exists func
}).listen(8080,"0.0.0.0");

// Console will print the message
console.log('Server running at http://0.0.0.0:8080/');
