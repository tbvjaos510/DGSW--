/**
 * 
 * @param {SocketIO.Server} io 
 */

module.exports=function(io){
    io.on('connection',function(socket){
        socket.inroom = 'room1';
        socket.on('room', function(data){
            socket.leave(socket.inroom);
            console.log('inroom ' + data);
            socket.inroom = data;
            socket.join(data);
        });

        socket.on('data',function(data){
            console.log('room [' + socket.inroom +'] Socket ID:'+this.id+' data :'+data);
            io.to(socket.inroom).emit('data', data);
            
        });
    
    });
};