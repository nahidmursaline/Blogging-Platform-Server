const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> {
    res.send('Blogging Site is running');
})

app.listen(port, ()=> {
    console.log(`Blogging Site is running on port: ${port}`)
})