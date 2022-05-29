const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json())

const posts = {};

app.get('/posts',(req,res)=>{
    res.send(posts);
});

app.post('/events',(req,res)=>{

    const {type,data} = req.body;

    if(type === 'PostCreated'){
        posts[data.id] = {id:data.id,title:data.title,comments:[]};
    }
    else if(type === 'CommentCreated'){
        posts[data.postId].comments.push({id:data.id,content:data.content});
    }
    res.send({});

});


const PORT = 4002;

function start(){
    app.listen(PORT,()=>{
        console.log(`QueryService starts on port ${PORT}`);
    })
}

start();


