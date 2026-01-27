import { Router } from "express";
import { linkedAccount } from "../controllers/oauth.controller.js";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/users.controller.js";

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/linked/:userId', linkedAccount);
router.post('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);


export default router;