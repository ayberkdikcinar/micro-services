const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json())


app.post('/events',(req,res)=>{

    const {type,data} = req.body;

    if(type === 'CommentCreated'){
        
        const status = data.content.includes('forbid') ? 'rejected' : 'approved';
        await axios.post('http://localhost:4005/events',
        {
            type:'CommentModerated',
            data:{
                id:data.id,
                postId:data.postId,
                status,
                content:data.content,
            }
        });
    }
    res.send({});

});


const PORT = 4003;

function start(){
    app.listen(PORT,()=>{
        console.log(`QueryService starts on port ${PORT}`);
    })
}

start();


