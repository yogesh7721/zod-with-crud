import express from "express";
import { validateRequest } from "../middlewares/validationRequest";
import { createUser, deleteUser, getUser, updateUser, } from "../controller/userController";
import { userSchema2 } from "../Schema/userSchema";
import multer from "multer";
import { upload } from "../utils/Uploads";

const router = express.Router();
// const upload = multer().single("profile"); // ✅ Ensure multer runs before validation

router.post("/add", upload, validateRequest(userSchema2), createUser);
router.get("/getdata", getUser);
router.put("/updateUser/:id", upload, validateRequest(userSchema2), updateUser)
router.delete("/deleteUser/:id", deleteUser)

export default router;
