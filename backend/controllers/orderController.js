import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Các biến toàn cục
const currency = "inr"; // Đơn vị tiền tệ
const deliveryCharge = 10; // Phí giao hàng

// Khởi tạo cổng thanh toán Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Đặt hàng bằng phương thức thanh toán COD (Thanh toán khi nhận hàng)
const placeOrder = async (req, res) => {
  try {
    // Lấy thông tin từ yêu cầu
    const { items, amount, address } = req.body;
    const userId = req.user.id; // Lấy userId từ req.user
    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(), // Lưu ngày đặt hàng
    };

    // Tạo đơn hàng mới trong cơ sở dữ liệu
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Xóa dữ liệu giỏ hàng của người dùng
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Gửi phản hồi thành công
    res.json({ success: true, message: "Đặt hàng thành công !" });
  } catch (error) {
    // Xử lý lỗi
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Đặt hàng bằng phương thức thanh toán Stripe
const placeOrderStripe = async (req, res) => {
  try {
    // Lấy thông tin từ yêu cầu
    const { items, amount, address } = req.body;
    const { origin } = req.headers; // Lấy URL gốc của trang web
    const userId = req.user.id; // Lấy userId từ req.user

    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    // Tạo đơn hàng mới trong cơ sở dữ liệu
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Chuẩn bị danh sách sản phẩm cho phiên thanh toán Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency, // Đơn vị tiền tệ
        product_data: {
          name: item.name, // Tên sản phẩm
        },
        unit_amount: item.price * 100, // Giá sản phẩm (chuyển sang đơn vị nhỏ nhất)
      },
      quantity: item.quantity, // Số lượng sản phẩm
    }));

    // Thêm phí giao hàng vào danh sách sản phẩm
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges", // Tên sản phẩm là phí giao hàng
        },
        unit_amount: deliveryCharge * 100, // Phí giao hàng (chuyển sang đơn vị nhỏ nhất)
      },
      quantity: 1,
    });

    // Tạo phiên thanh toán Stripe
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`, // URL thành công
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`, // URL hủy
      line_items, // Danh sách sản phẩm
      mode: "payment", // Chế độ thanh toán
    });

    // Gửi phản hồi với URL phiên thanh toán
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    // Xử lý lỗi
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Xác minh thanh toán Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  const { userId } = req.user.id;

  try {
    if (success === "true") {
      // Nếu thanh toán thành công, cập nhật trạng thái thanh toán của đơn hàng
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      // Xóa dữ liệu giỏ hàng của người dùng
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      // Nếu thanh toán thất bại, xóa đơn hàng
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    // Xử lý lỗi
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Đặt hàng bằng phương thức thanh toán Razorpay (chưa triển khai)
const placeOrderRazorpay = async (req, res) => {};

// Lấy tất cả đơn hàng cho Admin
const allOrders = async (req, res) => {
  try {
    // Truy vấn tất cả đơn hàng từ cơ sở dữ liệu
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    // Xử lý lỗi
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Lấy dữ liệu đơn hàng của người dùng
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id; 
    console.log(userId)
    // Truy vấn tất cả đơn hàng theo userId
    const orders = await orderModel.find({ userId });
    return res.json({ success: true, orders });
  } catch (error) {
    // Xử lý lỗi
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng từ Admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Cập nhật trạng thái đơn hàng
    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công!",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Xuất các hàm
export {
  verifyStripe,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
};
