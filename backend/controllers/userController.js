import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary"; // Nhập module cloudinary để xử lý việc tải lên ảnh lên Cloudinary
import fs from "fs";

// Tạo token cho user
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Đảm bảo payload chứa { id }
};

// Route đăng nhập người dùng
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            return res.json({
                success: true,
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                }
            });
        } else {
            return res.json({ success: false, message: 'Thông tin đăng nhập không hợp lệ.' });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Route đăng ký người dùng
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra user đã tồn tại hay chưa
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Người dùng đã tồn tại" });
        }

        // Xác thực email và độ mạnh của mật khẩu
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Hãy nhập đúng email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Hãy nhập mật khẩu mạnh hơn (ít nhất 8 ký tự)" });
        }

        // Hash mật khẩu người dùng
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        // Lưu user vào database
        const user = await newUser.save();

        // Tạo token cho user
        const token = createToken(user._id);

        // Trả về kết quả thành công
        return res.json({
            success: true,
            token,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            }
        });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Route thông tin người dùng
const profile = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy userId từ req.user

        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại" });
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar, // Đảm bảo rằng avatar được trả về cùng với các thông tin người dùng
            },
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        res.json({ success: false, message: "Đã xảy ra lỗi khi tải thông tin người dùng" });
    }
};

// Route tải ảnh đại diện
const uploadAvatar = async (req, res) => {
    try {
        // Kiểm tra nếu không có file được tải lên
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Không có file nào được tải lên" });
        }

        // Lấy userId từ body
        const userId = req.user.id; // Lấy userId từ req.user
        if (!userId) {
            return res.status(400).json({ success: false, message: "Thiếu userId" });
        }

        // Tải file lên Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'avatars', // Tên folder trong Cloudinary
            use_filename: true,
        });
        // Xóa file local sau khi upload thành công
        fs.unlinkSync(req.file.path);

        // Lưu URL ảnh vào cơ sở dữ liệu
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            { avatar: result.secure_url },
            { new: true } // Trả về bản ghi sau khi cập nhật
        );

        if (!updatedUser) {
            return res.status(400).json({
                success: false,
                message: "Không tìm thấy user hoặc không thể cập nhật",
            });
        }

        res.json({
            success: true,
            message: "Cập nhật ảnh đại diện thành công",
            avatar: updatedUser.avatar,
        });
    } catch (error) {
        console.error("Lỗi khi tải ảnh đại diện:", error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi tải ảnh đại diện" });
    }
};

// Route đăng nhập admin
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Email hoặc mật khẩu không đúng" });
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, profile, uploadAvatar };
