const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(bodyParser.json())

const posts = {};

app.get('/posts',(req,res)=>{
    res.send(posts);
});

app.post('/events',(req,res)=>{

    const {type,data} = req.body;
    handleEvent(type,data);

    res.send({});

});

function handleEvent(type,data){
    if(type === 'PostCreated'){
        posts[data.id] = {id:data.id,title:data.title,comments:[]};
    }
    else if(type === 'CommentCreated'){
        posts[data.postId].comments.push({id:data.id,content:data.content});
    }
    else if(type === 'CommentUpdated'){
        const comment=posts[data.postId].comments.find((comment)=>{
            return comment.id === data.id;
        });
        comment.status=data.status;
        comment.content=data.content;
    }
}

const PORT = 4002;

function start(){
    app.listen(PORT,()=>{
        console.log(`QueryService starts on port ${PORT}`);
        try {
            const res = await axios.get("http://localhost:4005/events");
        
            for (let event of res.data) {
              console.log("Processing event:", event.type);
        
              handleEvent(event.type, event.data);
            }
          } catch (error) {
            console.log(error.message);
          }
    })
}

start();


