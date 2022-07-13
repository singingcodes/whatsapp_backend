import express from "express"
import { createServer } from "http"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import userRouter from "./apis/users/index.js"
import roomsRouter from "./apis/rooms/index.js"
import { Server } from "socket.io"
import { connectionHandler, router } from "./socket/index.js"

import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
  unAuthorizedHandler,
} from "./errorHandlers.js"

const server = express()
const port = process.env.PORT || 3001
const httpServer = createServer(server)

// Middleware
server.use(cors())
server.use(express.json())

// Routes
server.use("/users", userRouter)
server.use("/rooms", roomsRouter)
server.use("/", router)

//error handling
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(unAuthorizedHandler)
server.use(genericErrorHandler)
// Start server
const io = new Server(httpServer)
io.on("connection", connectionHandler)

mongoose.connect(process.env.MONGO_CONNECTION_URL)
mongoose.connection.on("connected", () => {
  console.log("Successfully Connected to MongoDB")
  httpServer.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server listening on port ${port}`)
  })
})
