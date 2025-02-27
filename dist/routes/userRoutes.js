"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validationRequest_1 = require("../middlewares/validationRequest");
const userController_1 = require("../controller/userController");
const userSchema_1 = require("../Schema/userSchema");
const Uploads_1 = require("../utils/Uploads");
const router = express_1.default.Router();
// const upload = multer().single("profile"); // ✅ Ensure multer runs before validation
router.post("/add", Uploads_1.upload, (0, validationRequest_1.validateRequest)(userSchema_1.userSchema2), userController_1.createUser);
router.get("/getdata", userController_1.getUser);
router.put("/updateUser/:id", Uploads_1.upload, (0, validationRequest_1.validateRequest)(userSchema_1.userSchema2), userController_1.updateUser);
router.delete("/deleteUser/:id", userController_1.deleteUser);
exports.default = router;
