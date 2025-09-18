import express from 'express'; 
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js'; // Import các controller xử lý logic cho giỏ hàng
import authUser from '../middleware/auth.js'; // Import middleware để xác thực người dùng

const cartRouter = express.Router(); // Tạo đối tượng router cho các endpoint liên quan đến giỏ hàng

// Định nghĩa route để lấy dữ liệu giỏ hàng của người dùng
cartRouter.post('/get', authUser, getUserCart); 
// Xác thực người dùng (authUser), nếu thành công thì gọi hàm `getUserCart` trong controller

// Định nghĩa route để thêm sản phẩm vào giỏ hàng
cartRouter.post('/add', authUser, addToCart); 
// Xác thực người dùng (authUser), nếu thành công thì gọi hàm `addToCart` trong controller

// Định nghĩa route để cập nhật giỏ hàng
cartRouter.post('/update', authUser, updateCart); 
// Xác thực người dùng (authUser), nếu thành công thì gọi hàm `updateCart` trong controller

export default cartRouter; // Xuất đối tượng router để sử dụng trong file chính của ứng dụng
