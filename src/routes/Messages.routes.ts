import { Router } from "express";
import {
  getMessagesByWaId,addMessage
} from '../controllers/Message.controller'



const router = Router();


router.route('/messages/:wa_id').get(getMessagesByWaId);

router.route('/send-message').post(addMessage);


export default router; 