import jwt from 'jsonwebtoken' // Import thư viện jsonwebtoken để xử lý mã hóa và giải mã token

// Middleware kiểm tra quyền admin
const adminAuth = async (req, res, next) => {
    try {
        // Lấy token từ header của request
        const { token } = req.headers
        // Kiểm tra nếu không có token thì trả về thông báo lỗi
        if (!token) {
            return res.json({ success: false, message: "không được phép truy cập, vui lòng đăng nhập lại" })
        }
        // Giải mã token và kiểm tra thông tin
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kiểm tra nếu token giải mã không khớp với email và mật khẩu admin thì không cho phép truy cập
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "không được phép truy cập, vui lòng đăng nhập lại" })
        }
        // Nếu kiểm tra thành công, gọi tiếp hàm tiếp theo trong pipeline (tiếp tục xử lý request)
        next()
    } catch (error) {
        // Nếu có lỗi xảy ra trong quá trình xác thực, trả về thông báo lỗi
        console.log(error)
        return res.json({ success: false, message: error.message });
    }
}

export default adminAuth; // Xuất middleware adminAuth để sử dụng trong các route cần xác thực quyền admin
