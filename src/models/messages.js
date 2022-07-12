import mongoose from "mongoose"

const { Schema, model } = mongoose

const MessagesSchema = new Schema(
  {
    text: { type: String, required: true },
    sender: { type: String, required: true },
  },
  { timestamps: true }
)

export default model("Message", MessagesSchema)
