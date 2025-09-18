import mongoose from 'mongoose'

// Định nghĩa schema cho đơn hàng
const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true}, // ID của người dùng
    items: {type: Array, required: true}, // Danh sách các sản phẩm trong đơn hàng
    amount: {type: Number, required: true}, // Tổng số tiền của đơn hàng
    address: {type: Object, required: true}, // Địa chỉ giao hàng
    status: {type: String, required: true, default: 'Đơn hàng đã được đặt'}, // Trạng thái của đơn hàng, mặc định là 'Order Placed'
    paymentMethod: {type: String, required: true}, // Phương thức thanh toán (COD, Stripe, v.v.)
    payment: {type: Boolean, required: true, default: false}, // Trạng thái thanh toán, mặc định là chưa thanh toán
    date: {type: Number, required: true} // Ngày đặt hàng (dạng timestamp)
})

// Tạo model cho đơn hàng, nếu model chưa tồn tại thì tạo mới
const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel
