const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(bodyParser.json())

const posts ={};

app.get('/posts',(req,res)=>{
    res.send(posts);
    
});

app.post('/posts',async (req,res)=>{
    const {title} = req.body;
    const id = randomBytes(4).toString('hex');
    posts[id] = {id,title};

    const event = {
        type:"PostCreated",
        data:{
            id,
            title:title,
            comments:[],
        }
    }
    await axios.post('http://localhost:4005/events',event).catch( (error)=> {console.log(error)});

    res.status(201).send(posts[id]);
});

app.post('/events', (req,res)=>{
    
    console.log(req.body.type);
    res.send({});
});



module.exports = app;


