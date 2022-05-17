module.exports = (io, Room) => {
  io.on("connection", (socket) => {
    socket.on("initialjoin", (data) => {
      let roomarrset = async () => {
        try {
          let roomarray = await Room.find({ members: data.email });
          let roomcode = [];
          for (obj of roomarray) {
            roomcode = [...roomcode, obj.invitecode];
          }

          if (roomarray.length !== 0) {
            socket.join(roomcode);
            // console.log("joined rooms" + JSON.stringify(roomcode));
          }
        } catch (err) {
          console.log(err);
        }
      };
      roomarrset();
    });
    socket.on("join", (data) => {
      socket.join(data.no);
    });

    socket.on("send", (data) => {
      io.to(data.invitecode).emit("text", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
