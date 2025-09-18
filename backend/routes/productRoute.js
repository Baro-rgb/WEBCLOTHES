import express from 'express';  // Nhập module express để tạo ra các route cho API
import { listProduct, addProduct, removeProduct, singleProduct, updateProduct } from '../controllers/productController.js';  // Nhập các controller để xử lý logic của các route
import upload from '../middleware/multer.js';  // Nhập middleware multer để xử lý việc tải lên file (ảnh)
import adminAuth from '../middleware/adminAuth.js';

// Khởi tạo router cho sản phẩm
const productRouter = express.Router();

// Route thêm sản phẩm mới (POST /add)
// Sử dụng multer để xử lý các file ảnh được tải lên, với tối đa 1 file cho mỗi trường ảnh (image1, image2, image3, image4)
productRouter.post('/add', adminAuth,upload.fields([
    { name: 'image1', maxCount: 1 },  // Tải lên 1 ảnh cho trường image1
    { name: 'image2', maxCount: 1 },  // Tải lên 1 ảnh cho trường image2
    { name: 'image3', maxCount: 1 },  // Tải lên 1 ảnh cho trường image3
    { name: 'image4', maxCount: 1 }   // Tải lên 1 ảnh cho trường image4
]), addProduct);  // Sau khi ảnh được tải lên, gọi hàm addProduct để thêm sản phẩm mới

// Route xóa sản phẩm (POST /remove)
productRouter.post('/remove', adminAuth,removeProduct);  // Gọi hàm removeProduct để xóa sản phẩm (logic xóa sản phẩm chưa thực hiện)

// Route lấy thông tin chi tiết của một sản phẩm (POST /single)
productRouter.post('/single', singleProduct);  // Gọi hàm singleProduct để lấy thông tin chi tiết sản phẩm (logic chưa thực hiện)

// Route lấy danh sách tất cả sản phẩm (GET /list)
productRouter.get('/list', listProduct);  // Gọi hàm listProduct để lấy danh sách tất cả sản phẩm (chưa gọi hàm singleProduct)

// Định nghĩa tuyến đường sửa sản phẩm
productRouter.put('/update/:id', adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), updateProduct);



export default productRouter;  // Xuất router ra để sử dụng ở nơi khác (ví dụ app.js)
