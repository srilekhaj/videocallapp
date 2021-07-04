const express  = require('express');
const app = express();
const http = require('http').createServer(app);
const PeerServer = require('peer');
const PORT = process.env.PORT || 8000;

var options ={
    debug:true
}

http.listen(PORT,() => {
    console.log("listening to port" + PORT);
})

app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html")
})
app.use(express.static('public'))

