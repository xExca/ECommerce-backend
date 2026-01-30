import { Router } from "express";
import multer from "multer";
import { linkedAccount } from "../controllers/oauth.controller.js";
import { deleteUser, getUser, getUsers, updateAvatar, updateUser } from "../controllers/users.controller.js";
import { requireAuth } from "../middlewares/auth.middlware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateAvatarValidation, userUpdateValidation } from "../validations/user.validation.js";
import { parseCropArea } from "../middlewares/parseCropArea.middleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/linked/:userId', linkedAccount);
router.post('/update/:userId', requireAuth, validate(userUpdateValidation), updateUser);
router.delete('/delete/:userId', requireAuth, deleteUser);
router.post('/avatar', requireAuth,upload.single("profilePicture"), parseCropArea, validate(updateAvatarValidation), updateAvatar);
router.get('/avatar', requireAuth, getUser);


export default router;