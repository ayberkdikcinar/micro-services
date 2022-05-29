const app = require('./app');

const PORT = 4001;

function start(){
    app.listen(PORT,()=>{
        console.log(`server starts on port ${PORT}`);
    })
}

start();