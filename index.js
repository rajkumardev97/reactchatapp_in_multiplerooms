const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 3000;

server.listen(port, () => {
  console.log(`Server is listening on port : ${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/javascript", (req, res) => {
  res.sendFile(__dirname + "/public/javascript.html");
});

app.get("/python", (req, res) => {
  res.sendFile(__dirname + "/public/python.html");
});

app.get("/swift", (req, res) => {
  res.sendFile(__dirname + "/public/swift.html");
});

const tech = io.of("/tech");

tech.on("connection", socket => {
  //connection event which is the listener of socket coming from client(/javascript and /python or /swift)

  // console.log("A User Connected");

  socket.on("join", data => {
    //once socket is get connected then it will grab the data and it will check the room and then it will emit the message and it will take the message from the room
    socket.join(data.room);
    tech.in(data.room).emit("message", `New User Joined ${data.room} root!`);
  });

  socket.on("message", data => {
    tech.in(data.room).emit("message", data.msg);
  });

  io.on("disconnect", () => {
    console.log("A User Disconnected");
    tech.emit("message", "User Disconnected");
  });
});
