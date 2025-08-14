import { Router } from "express";
import {
  getUsers
} from '../controllers/Users.controller.js'



const router = Router();


router.route('/users').get(getUsers);



export default router; 