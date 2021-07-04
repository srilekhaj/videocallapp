const button = document.getElementById('button');

//get the local video and display with permission
function getLVideo (callbacks){
    navigator.getUserMedia = navigator.getUserMedia|| navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;   
    var constraints = {
        video:true,audio:true
    }
    navigator.getUserMedia(constraints, callbacks.success,callbacks.error)
}    
function recStream(stream,elemid){
        var video = document.getElementById(elemid);
        video.srcObject = stream;
        window.peer_stream = stream;
}  
getLVideo({
        success: function(stream){
            window.localstream = stream;
            recStream(stream,'lVideo');
        },
        error: function(err){
            alert("cannot access your camera");
            console.log(err);
        }    
    
})
//create a peer connection
var conn;
var peer_id;
console.log("Peer client started");
var PEER_SERVER = 'my-peer.herokuapp.com';
var PORT = 443;

var peer = new Peer(peer_id, { host: PEER_SERVER, port: PORT, path: '/', secure: true }); 

//display the peerid
    peer.on('open',function(){
        document.getElementById("displayId").innerHTML = peer.id
    })

    peer.on('connection',function(connection){
        conn = connection;
        peer_id= connection.peer;

        document.getElementById('connId').value = peer_id;
});

     peer.on('error', function(err){
        alert("an error has happened" + err);
        console.log(err);
    })
    document.getElementById('conn_button').addEventListener('click',function(){
        peer_id = document.getElementById("connId").value;
    
        if(peer_id){
            conn = peer.connect('peer_id');
        }else{
            alert("enter an id");
            return false;
        
        }
    })

//call on click 
    peer.on('call',function(call){
            var acceptCall = confirm("Do you want answer this call?");
            if(acceptCall){
                call.answer(window.localstream);
                call.on('stream', function(stream){        
                window.peer_stream = stream;
                recStream(stream,'rVideo')
                });
                call.on('close', function(){
                    alert("The call is behind");
                })
            } else{
                console.log('call denied');
            }
        });

//ask to call
    document.getElementById('call_button').addEventListener('click',function(){
        console.log('calling a peer:' + peer_id);
        console.log(peer);

        var call = peer.call(peer_id,window.localstream);
        call.on('stream', function(stream){
            window.peer_stream = stream;
            recStream(stream,'rVideo');
        })
    })   
