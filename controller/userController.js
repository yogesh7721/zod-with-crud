"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const radisClient_1 = __importDefault(require("../utils/radisClient"));
const user_1 = __importDefault(require("../model/user"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = (0, multer_1.default)().single("profile");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("Request body:", req.body);
        // console.log("Uploaded file:", req.file);
        let profileImageUrl = "";
        if (req.file) {
            try {
                const cloudinaryResponse = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                    folder: "profile_uploads",
                });
                profileImageUrl = cloudinaryResponse.secure_url;
            }
            catch (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ message: "File upload failed", error });
            }
        }
        let languages = [];
        if (typeof req.body.language === "string") {
            try {
                languages = JSON.parse(req.body.language);
            }
            catch (err) {
                languages = req.body.language.split(",").map((lang) => lang.trim());
            }
        }
        else if (Array.isArray(req.body.language)) {
            languages = req.body.language;
        }
        const userData = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,
            city: req.body.city,
            gender: req.body.gender,
            date: req.body.date,
            terms: req.body.terms === "true",
            language: languages,
            profile: profileImageUrl,
        };
        console.log("User data before saving:", userData);
        const newUser = new user_1.default(userData);
        yield newUser.save();
        yield radisClient_1.default.setex(`user:${newUser._id}`, 3600, JSON.stringify(newUser));
        res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { result } = req.params;
        // if (cachedUser) {
        //     return res.status(200).json({ message: "Data fetched from cache", result: JSON.parse(cachedUser) });
        // }
        const result = yield user_1.default.find();
        if (!result) {
            return res.status(404).json({ message: "User not found", result });
        }
        const cachedUser = yield radisClient_1.default.get(`result:${result}`);
        yield radisClient_1.default.set(`result:${result}`, JSON.stringify(result));
        return res.status(200).json({ message: "Data fetched from DB", result });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error", error });
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        console.log(id);
        const existingUser = yield user_1.default.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "user not found" });
        }
        let profileImageUrl = existingUser.profile;
        if (req.file) {
            try {
                if (existingUser.profile) {
                    const oldImageId = (_a = existingUser.profile.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
                    if (oldImageId) {
                        yield cloudinary_1.v2.uploader.destroy(`profile_uploas${oldImageId}`);
                    }
                }
                const cloudinaryResponse = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                    folder: 'profile_uploas'
                });
                profileImageUrl = cloudinaryResponse.secure_url;
            }
            catch (error) {
                return res.status(500).json({ message: "file upload failed", error });
            }
        }
        let languages = [];
        if (typeof req.body.language === "string") {
            try {
                languages = JSON.parse(req.body.language);
            }
            catch (error) {
                languages = req.body.language.split("/").map((lang) => lang.trim());
            }
        }
        else if (Array.isArray(req.body.language)) {
            languages = req.body.language;
        }
        const updateUser = yield user_1.default.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,
            city: req.body.city,
            gender: req.body.gender,
            date: req.body.date,
            terms: req.body.terms === "true",
            language: languages,
            profile: profileImageUrl,
        }, { new: true });
        //-----------Update Cache
        yield radisClient_1.default.setex(`user:${id}`, 3600, JSON.stringify(user_1.default));
        res.status(200).json({ message: "user update successfully", user: updateUser });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server Error", error });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_1.default.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "User not found" }); // Added return here
        }
        if (result.profile) {
            yield cloudinary_1.v2.uploader.destroy(path_1.default.basename(result.profile));
        }
        yield user_1.default.findByIdAndDelete(req.params.id);
        /////----------
        yield radisClient_1.default.del(`~:${req.params.id}`);
        res.json({ message: "User delete success" });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
// export const getUser = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const result = await User.find(req.body)
//         await redisClient.set("user", JSON.stringify(result), "EX", 3600);
//         res.status(200).json({ message: "Data fetch success", result })
//         // console.log(result);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Server Error" })
//     }
// }
