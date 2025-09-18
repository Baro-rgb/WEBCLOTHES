import jwt from 'jsonwebtoken' // Import thư viện jsonwebtoken để xử lý mã hóa và giải mã token

// Middleware kiểm tra và xác thực người dùng
const authUser = async (req, res, next) => { 
    const authHeader = req.headers.authorization; // Lấy token từ Authorization header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ success: false, message: 'không được phép vui lòng đăng nhập lại' });
    }

    const token = authHeader.split(' ')[1]; // Tách token từ chuỗi "Bearer <token>"

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: token_decode.id }; // Lưu userId vào req.user
        next();
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


export default authUser // Xuất middleware authUser để sử dụng trong các route yêu cầu xác thực người dùng
