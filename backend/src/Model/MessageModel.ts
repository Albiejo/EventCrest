import { Document, Schema, model } from "mongoose";

export interface MessageDocument extends Document {
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: Date;
}

const MessageSchema = new Schema<MessageDocument>(
    {
        conversationId: String,
        senderId: String,
        text: String
    },
    {
        timestamps: true
    }
);

export default model<MessageDocument>("Message", MessageSchema);

