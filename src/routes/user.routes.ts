import { Router } from "express";
import { linkedAccount } from "../controllers/oauth.controller.js";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/users.controller.js";
import { requireAuth } from "../middlewares/auth.middlware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { userUpdateValidation } from "../validations/user.validation.js";

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/linked/:userId', linkedAccount);
router.post('/update/:userId', requireAuth, validate(userUpdateValidation), updateUser);
router.delete('/delete/:userId', requireAuth, deleteUser);


export default router;