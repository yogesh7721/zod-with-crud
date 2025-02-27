import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { Request, Response } from "express";
import path from "path";
import { any } from "zod";
import redisClient from "../utils/radisClient";
import User from "../model/user"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer().single("profile");

export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        // console.log("Request body:", req.body);
        // console.log("Uploaded file:", req.file);

        let profileImageUrl = "";

        if (req.file) {
            try {
                const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
                    folder: "profile_uploads",
                });
                profileImageUrl = cloudinaryResponse.secure_url;
            } catch (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ message: "File upload failed", error });
            }
        }

        let languages: string[] = [];
        if (typeof req.body.language === "string") {
            try {
                languages = JSON.parse(req.body.language);
            } catch (err) {
                languages = req.body.language.split(",").map((lang: string) => lang.trim());
            }
        } else if (Array.isArray(req.body.language)) {
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

        const newUser = new User(userData);
        await newUser.save();

        await redisClient.setex(`user:${newUser._id}`, 3600, JSON.stringify(newUser));

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};




export const getUser = async (req: Request, res: Response): Promise<any> => {
    try {
        // const { result } = req.params;
        // if (cachedUser) {
        //     return res.status(200).json({ message: "Data fetched from cache", result: JSON.parse(cachedUser) });
        // }

        const result = await User.find();
        if (!result) {
            return res.status(404).json({ message: "User not found", result });
        }
        const cachedUser = await redisClient.get(`result:${result}`);
        await redisClient.set(`result:${result}`, JSON.stringify(result));

        return res.status(200).json({ message: "Data fetched from DB", result });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error });
    }
};


export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params
        console.log(id)
        const existingUser = await User.findById(id)
        if (!existingUser) {
            return res.status(404).json({ message: "user not found" })
        }

        let profileImageUrl = existingUser.profile
        if (req.file) {
            try {
                if (existingUser.profile) {
                    const oldImageId = existingUser.profile.split("/").pop()?.split(".")[0]
                    if (oldImageId) {
                        await cloudinary.uploader.destroy(`profile_uploas${oldImageId}`)
                    }
                }
                const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'profile_uploas'
                })
                profileImageUrl = cloudinaryResponse.secure_url
            } catch (error) {
                return res.status(500).json({ message: "file upload failed", error })
            }
        }
        let languages: string[] = []
        if (typeof req.body.language === "string") {
            try {
                languages = JSON.parse(req.body.language)
            } catch (error) {
                languages = req.body.language.split("/").map((lang: string) => lang.trim())
            }
        } else if (Array.isArray(req.body.language)) {
            languages = req.body.language
        }

        const updateUser = await User.findByIdAndUpdate(
            id,
            {
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
            },
            { new: true }
        )
        //-----------Update Cache
        await redisClient.setex(`user:${id}`, 3600, JSON.stringify(User));

        res.status(200).json({ message: "user update successfully", user: updateUser })
    } catch (error) {
        res.status(500).json({ message: "Internal server Error", error })
    }
}



export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await User.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ message: "User not found" }); // Added return here
        }

    
        if (result.profile) {
            await cloudinary.uploader.destroy(path.basename(result.profile));
        }

        await User.findByIdAndDelete(req.params.id);

        /////----------

        await redisClient.del(`~:${req.params.id}`);
        
        res.json({ message: "User delete success" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};








        
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