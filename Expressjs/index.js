const Express = require('express');
const path = require('path');
const app = Express();
const port = 3000;

app.get('/', (req, res) => {
    
    res.json({ message: 'Hello World' });
});

app.get('/about', (req, res) => {
    res.send('about');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});