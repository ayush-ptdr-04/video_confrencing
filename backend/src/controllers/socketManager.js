import { Server } from "socket.io";

let connesctions = {}; // har room/path pr kis-kis user ka socket.id hai , wo store hoga.
let messages = {}; // har room ke chat messages isme store honge.
let timeOnline = {}; // user kitne der online raha.

// main function
export const connectToSocket = (server) => {
  // create socket.io server
  const io = new Server(server, {
    // socket can connect anywher using CORS
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  // it triggerd everyTime, when browser connect(socket)
  io.on("connection", (socket) => {
    console.log("SOMETHING CONNECTED");
    // when user join the room(path is meetingID)
    socket.on("join-call", (path) => {
      if (connesctions[path] === undefined) {
        connesctions[path] = [];
      }

      // newUser ke socket.id ko room me add krna && save time
      connesctions[path].push(socket.id);
      timeOnline[socket.id] = new Date();

      // already-joined users ko batana(msg) newUser Joined
      for (let a = 0; a < connesctions[path].length; a++) {
        io.to(connesctions[path][a]).emit(
          "user-joined",
          socket.id,
          connesctions[path]
        );
      }

      // old messages(chat-history) , newUser ko send krna
      if (messages[path] != undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"]
          );
        }
      }
    });

    // signal handler
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connesctions).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false]
      );
      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }
        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        console.log("message", matchingRoom, ":", sender, data);
        connesctions[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    // user kitni der online tha
    socket.on("disconnect", () => {
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());

      // baki saare users ko message user-left, also remove to room-list and check room is empty or not, &delete the room
      var key;
      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connesctions))
      )) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;
            for (let a = 0; a < connesctions[key].length; ++a) {
              io.to(connesctions[key][a]).emit("user-left", socket.id);
            }

            var index = connesctions[key].indexOf(socket.id);

            connesctions[key].splice(index, 1);

            if (connesctions[key].length === 0) {
              delete connesctions[key];
            }
          }
        }
      }
    });
  });

  return io;
};

// .emit() :- yaha se message ja raha hai client ke pass
// .on() :- yaha se msg reciev ho raha hai
// io.to()=>particular ID ko .emit()=>msg send krna
