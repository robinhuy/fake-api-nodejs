module.exports = function (socket, io) {
  console.log("An user connected");

  socket.on("emit", (msg) => {
    console.log("on emit:", msg);
    socket.emit("broadcast", msg);
  });

  socket.on("broadcast", (msg) => {
    console.log("on broadcast:", msg);
    socket.broadcast.emit("broadcast", msg);
  });

  socket.on("broadcast-all", (msg) => {
    console.log("on broadcast-all:", msg);
    io.emit("broadcast-all", msg);
  });

  socket.on("disconnect", () => {
    console.log("An user disconnected");
  });
};
