var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

http.createServer(function(req, res) {
    var q = url.parse(req.url, true);
    var pathname = q.pathname;
    
    // Handle root path
    if (pathname === '/') {
        pathname = '/summer.html'; // Default to summer.html
    }
    
    // Security: prevent path traversal attacks
    var filename = path.join(__dirname, pathname);
    
    // Only allow .html files
    if (!filename.endsWith('.html')) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found - Only HTML files allowed");
    }
    
    fs.readFile(filename, function(err, data) {
        if (err) {
            console.log('Error reading file:', filename, err.message);
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found - File does not exist");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8080, function() {
    console.log('Server running on http://localhost:8080');
    console.log('Try: http://localhost:8080/summer.html');
    console.log('Try: http://localhost:8080/winter.html');
});