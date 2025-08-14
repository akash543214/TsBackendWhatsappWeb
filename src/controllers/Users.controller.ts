import type { Request, Response } from "express";
import ProcessedMessage from "../models/ProcessedMessage.ts";


const getUsers = async (req: Request, res: Response) => {
  try {
    const uniqueUsers = await ProcessedMessage.aggregate([
      {
        $group: {
          _id: "$wa_id", // group by wa_id
          doc: { $first: "$$ROOT" } // pick the first document for each wa_id
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" } // replace _id with the original doc
      }
    ]);

    res.status(200).json(uniqueUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};



const createUsers = async (req: Request, res: Response) => {
  
};

export { createUsers,getUsers };