import { saveMessage } from "../utils/messages.js"

let onlineUsers = []

const connectionHandler = (socket) => {
  // We have established a connection with a client
  socket.emit("welcome", { message: `Hello ${socket.id}!` })

  // FE is emitting setUsername event --> BE should listen for that

  socket.on("setUsername", (payload) => {
    // When a new client connects to the chat and sets a username, BE should keep track of that socketId & username
    onlineUsers.push({
      username: payload.username,
      socketId: socket.id,
      room: payload.room,
    })
    console.log("ONLINE USERS: ", onlineUsers)

    // To join a specific room we can use socket.join
    socket.join(payload.room)

    console.log("ROOMS ", socket.rooms)

    // FE is waiting for an event called loggedIn, we gonna emit that and send the list of online users
    socket.emit("loggedIn", onlineUsers)
    // Also the other connected users should receive the list of current online users
    socket.broadcast.emit("newConnection", onlineUsers) // We want to emit this event to every connected socket but not the current one
  })

  socket.on("sendMessage", async ({ message }) => {
    // we should broadcast that message to everybody but not to the sender of the message (otherwise he would see a duplicated message on the chat)
    // socket.broadcast.emit("message", message)

    // we would like to save the message in db
    await saveMessage(message)

    // we would like to emit to everybody who is in the room
    socket.emit("message", message)
  })

  socket.on("disconnect", () => {
    // event automatically emitted by the FE when user closes the browser/tab
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
    socket.broadcast.emit("newConnection", onlineUsers)
  })
}

export default connectionHandler
