const http = require('http');

const port = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
    res.statusCode=200;
    res.setHeader('Content-type', 'text/html')
    console.log(req.url);
    if(req.url == '/'){
        res.statusCode=200;
        res.end('<h1> This is Palak Jain </h1> <p> Hello to my world </p>')
    }
    else if(req.url == '/about'){
        res.statusCode=200;
        res.end('<h1> This is about page </h1> <p> Hello to my about page </p>')
    }
    else{
        res.statusCode=404;
        res.end('<h1> Page not found </h1> <p> Hello to my error page </p>')
    }
    
})

server.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
});

