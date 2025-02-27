"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    city: { type: String, enum: ["Jalna", "Sambhajinagar", "Pune", "Mumbai", "Delhi", "Ambad"], required: true },
    address: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    language: { type: [String], enum: ["JavaScript", "HTML", "React", "Redux", "Node.js"], required: true },
    profile: { type: String, required: false }, // ✅ Store Cloudinary image URL
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
// import mongoose, { Schema, Document } from "mongoose";
// interface IUser extends Document {
//     name: string;
//     email: string;
//     mobile: string;
//     date: Date;
//     city: string;
//     address: string;
//     gender: "Male" | "Female";
//     term: boolean; // ✅ Changed from string to boolean
//     language: string[];
//     profile?: string; // ✅ Optional profile image path
// }
// const userSchema: Schema<IUser> = new Schema(
//     {
//         name: { type: String, required: true },
//         email: { type: String, required: true, unique: true },
//         mobile: { type: String, required: true, unique: true },
//         date: { type: Date, required: true },
//         city: { type: String, required: true },
//         address: { type: String, required: true },
//         gender: { type: String, enum: ["Male", "Female"], required: true },
//         term: { type: Boolean, required: true }, // ✅ Fixed type
//         language: {
//             type: [String],
//             enum: ["JavaScript", "HTML", "React", "Redux", "Node.js"],
//             required: true,
//         },
//         profile: { type: String, required: false }, // ✅ Profile image path
//     },
//     { timestamps: true }
// );
// const User = mongoose.model<IUser>("User", userSchema);
// export default User;
