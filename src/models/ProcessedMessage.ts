import mongoose, { Schema, Document } from "mongoose";

export interface IProcessedMessage extends Document {
  name: string;
  wa_id: string;
  text: string;
  status: "sent" | "delivered" | "read";
  timestamp: Date;
  meta_msg_id?: string;
  direction: "incoming" | "outgoing";
}

const ProcessedMessageSchema = new Schema<IProcessedMessage>({
  name: String,
  wa_id: String,
  text: String,
  status: { type: String, enum: ["sent", "delivered", "read"] },
  timestamp: Date,
  meta_msg_id: String,
  direction: { type: String, enum: ["incoming", "outgoing"], required: true }
});

export default mongoose.model<IProcessedMessage>(
  "processed_messages",
  ProcessedMessageSchema
);
