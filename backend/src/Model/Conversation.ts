import { Document, Schema, model } from "mongoose";

export interface conversationDocument extends Document {
    members: string[];
    createdAt: Date;
}

const ConversationSchema = new Schema<conversationDocument>(
    {
        members: [String]
    },
    {
        timestamps: true
    }
);

export default model<conversationDocument>("conversation", ConversationSchema);
