const SocketIOServer = (socket, io) => {
  console.log("An user connected");

  socket.on("emit", (msg) => {
    socket.emit("emit", msg);
  });

  socket.on("broadcast", (msg) => {
    socket.broadcast.emit("broadcast", msg);
  });

  socket.on("broadcast-all", (msg) => {
    io.emit("broadcast-all", msg);
  });

  socket.on("join-room", (roomName) => {
    socket.join(roomName);
  });

  socket.on("emit-in-room", ({ room, event, msg }) => {
    socket.to(room).emit(event, msg);
  });

  socket.on("disconnect", () => {
    console.log("An user disconnected");
  });
};

export default SocketIOServer;
