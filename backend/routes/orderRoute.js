import express from 'express';
import { placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router()

// các tính năng dành cho admin
orderRouter.post('/list',adminAuth,allOrders) // Lấy danh sách tất cả đơn hàng (chỉ admin được phép)
orderRouter.post('/status', adminAuth, updateStatus) // Cập nhật trạng thái của đơn hàng (chỉ admin được phép)

// các tính năng thanh toán
orderRouter.post('/place', authUser, placeOrder) // Đặt hàng cho người dùng (cần đăng nhập)
orderRouter.post('/stripe', authUser, placeOrderStripe) // Thanh toán qua Stripe (cần đăng nhập)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay) // Thanh toán qua Razorpay (cần đăng nhập)

// các tính năng dành cho người dùng
orderRouter.get('/userorders', authUser, userOrders) // Lấy đơn hàng của người dùng (cần đăng nhập)

// verify payment
orderRouter.post('/verifyStripe', authUser,verifyStripe) // Verify payment (cần đăng nhập

export default orderRouter
