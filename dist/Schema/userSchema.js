"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema2 = void 0;
const zod_1 = require("zod");
exports.userSchema2 = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: zod_1.z.string().email({ message: "Valid email is required" }),
    mobile: zod_1.z.string().min(10, { message: "Mobile number must be at least 10 digits" }).max(12, { message: "Mobile number must be at most 12 digits" }),
    // age: z.number().min(1, { message: "Age must be at least 1" }), 
    address: zod_1.z.string().min(2, { message: "Address must be at least 2 characters" }),
    city: zod_1.z.enum(["Jalna", "Sambhajinagar", "Pune", "Mumbai", "Delhi", "Ambad"], {
        message: "Please select a valid city",
    }),
    gender: zod_1.z.enum(["Male", "Female"], { message: "Gender is required" }),
    date: zod_1.z.preprocess((val) => new Date(val), zod_1.z.date()),
    // maritalStatus: z.boolean().default(false),
    terms: zod_1.z.boolean().refine((val) => val === true, {
        message: "You must accept the terms",
    }),
    language: zod_1.z.array(zod_1.z.enum(["JavaScript", "HTML", "React", "Redux", "Node.js"])).min(1, {
        message: "Please select at least one language",
    }),
    profile: zod_1.z.object({
        avatar: zod_1.z.string().url({ message: "Invalid avatar URL" }).optional(),
    }).optional(),
});
