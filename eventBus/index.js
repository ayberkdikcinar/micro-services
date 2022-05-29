const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.json())


app.post('/events',async (req,res)=>{

    const data = req.body;
    
    await axios.post('http://localhost:4000/events',data).catch( (error)=> {console.log(error)}); //post service
    await axios.post('http://localhost:4001/events',data).catch( (error)=> {console.log(error)});//comment service
    await axios.post('http://localhost:4002/events',data).catch( (error)=> {console.log(error)}); //query service
    
    res.send({});
});


const PORT = 4005;

function start(){
    app.listen(PORT,()=>{
        console.log(`EventBus starts on port ${PORT}`);
    })
}

start();


