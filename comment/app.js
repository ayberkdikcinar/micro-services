const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.json())

const commentsByPostID={};

app.get('/posts/:id/comments',(req,res)=>{
    const comments = commentsByPostID[req.params.id] || [];
    res.send(comments); 
});

app.post('/posts/:id/comments',async (req,res)=>{
    const {content} = req.body;
    const id = req.params.id;
    const commentId = randomBytes(4).toString('hex');

    const comments = commentsByPostID[id] || [];

    comments.push({id:commentId,content,status:'pending'});
    commentsByPostID[id]=comments;
    
    const event = {
        type:"CommentCreated",
        data:{
            postId:id,
            content:content,
            id:commentId,
            status:'pending'
        }
    }
    await axios.post('http://localhost:4005/events',event).catch( (error)=> {console.log(error)});

    res.status(201).send(commentsByPostID[id]);
});

app.post('/events', (req,res)=>{
    
    const {data,type} = req.body;

    if(type === 'CommentModerated'){
        
        const comment = commentsByPostID[data.postId].comments.filter(
            (comment)=>{
                return comment.id==data.id;
            })
        comment.status = data.status;
    
        await axios.post('http://localhost:4005/events',{
            type:'CommentUpdated',
            data:{
                id:data.id,
                status:data.status,
                postId:data.postId,
                content:data.content,     
            },
        })
    }
    res.send({});
});



module.exports = app;


