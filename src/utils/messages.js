import MessagesModel from "../models/messages.js"

export const saveMessage = async (message, roomName) => {
  try {
    // save message in messages collection
    const newMessage = new MessagesModel({
      text: message.text,
      sender: message.sender,
    })
    const savedMessage = await newMessage.save()
    return savedMessage
  } catch (error) {
    console.log(error)
  }
}
