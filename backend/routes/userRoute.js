import express from "express";
import { loginUser, registerUser, adminLogin, profile, uploadAvatar } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import multer from "multer";
import path from "path";

// Cấu hình lưu trữ của Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/profile", authUser, profile);
userRouter.put("/upload-avatar", authUser, upload.single("avatar"), uploadAvatar);

export default userRouter;
