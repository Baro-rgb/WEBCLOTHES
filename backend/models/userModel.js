import mongoose from "mongoose";

// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên người dùng (bắt buộc)
    email: { type: String, required: true, unique: true }, // Email người dùng (bắt buộc, duy nhất)
    password: { type: String, required: true }, // Mật khẩu người dùng (bắt buộc)
    cartData: { type: Object, default: {} }, // Dữ liệu giỏ hàng của người dùng (mặc định là một object rỗng)
    address: { type: String, default: null },
    phone: { type: Number, default: null },
    avatar: { type: String, default: null },
  },
  { minimize: false }
); // Tùy chọn để không tự động xóa các field trống trong object

// Tạo mô hình (model) người dùng, nếu chưa có thì tạo mới, nếu có rồi thì sử dụng lại
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel; // Xuất mô hình người dùng để sử dụng ở các nơi khác
