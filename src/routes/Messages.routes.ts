import { Router } from "express";
import {
  getMessagesByWaId
} from '../controllers/Message.controller.ts'



const router = Router();


router.route('/messages/:wa_id').get(getMessagesByWaId);



export default router; 