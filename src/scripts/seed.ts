import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import connectDB from "../db/index"; // remove .ts extension
import ProcessedMessage from "../models/ProcessedMessage"; // remove .ts extension

dotenv.config();

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "../../payloads");

async function seed() {
  await connectDB();

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    let record: any = {
      name: "",
      wa_id: "",
      text: "",
      status: "delivered",
      timestamp: new Date(),
      direction: "incoming" // default, will update below
    };

    // If it's a user message webhook
    if (jsonData.metaData?.entry?.[0]?.changes?.[0]?.value?.messages) {
      const msg = jsonData.metaData.entry[0].changes[0].value.messages[0];
      const contact = jsonData.metaData.entry[0].changes[0].value.contacts[0];
      record.name = contact.profile.name;
      record.wa_id = contact.wa_id;
      record.text = msg.text.body;
      record.status = msg.from === contact.wa_id ? "delivered" : "sent";
      record.timestamp = new Date(parseInt(msg.timestamp) * 1000);
      record.meta_msg_id = msg.id;
      record.direction = msg.from === contact.wa_id ? "incoming" : "outgoing";
    }

    // If it's a status webhook
    if (jsonData.metaData?.entry?.[0]?.changes?.[0]?.value?.statuses) {
      const statusObj = jsonData.metaData.entry[0].changes[0].value.statuses[0];
      record.wa_id = statusObj.recipient_id;
      record.status = statusObj.status as "sent" | "read";
      record.timestamp = new Date(parseInt(statusObj.timestamp) * 1000);
      record.meta_msg_id = statusObj.meta_msg_id;
      // direction stays whatever it was from the original
    }

    await ProcessedMessage.create(record);
    console.log(`✅ Inserted from ${file}`);
  }

  console.log("🎉 Seeding complete");
  process.exit(0);
}

seed();
