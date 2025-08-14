import type { Request, Response } from "express";
import ProcessedMessage from "../models/ProcessedMessage.ts";

const getMessagesByWaId = async (req: Request, res: Response) => {
  try {
    const { wa_id } = req.params;

    if (!wa_id) {
      return res.status(400).json({ message: "wa_id is required" });
    }

    const messages = await ProcessedMessage.find({ wa_id }).sort({ timestamp: 1 }); 
    // timestamp: 1 → oldest first; use -1 for newest first

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const addMessage = async (req: Request, res: Response) => {
  try {
   
    const message = req.body;
    const msg = await ProcessedMessage.create(message);

    res.status(200).json(msg);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export {
    getMessagesByWaId,addMessage
}