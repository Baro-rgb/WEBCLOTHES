import userModel from "../models/userModel.js";

// thêm sản phẩm tới giỏ hàng
const addToCart = async (req, res) => {
  try {
    // Lấy thông tin từ body của request
    const { itemId, size } = req.body;
    const { userId } = res.user;
    // Tìm dữ liệu người dùng từ database
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData; // Lấy dữ liệu giỏ hàng của người dùng

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    if (cartData[itemId]) {
      // Nếu đã có sản phẩm, kiểm tra size
      if (cartData[itemId][size]) {
        // Nếu size đã có trong sản phẩm, tăng số lượng lên
        cartData[itemId][size] += 1;
      } else {
        // Nếu size chưa có, thêm size mới vào giỏ hàng
        cartData[itemId][size] = 1;
      }
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới sản phẩm
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // Cập nhật lại giỏ hàng trong database
    await userModel.findByIdAndUpdate(userId, { cartData });

    // Trả về thông báo thành công
    return res.json({
      success: true,
      message: "Sản phẩm đã được thêm vào giỏ hàng",
    });
  } catch (error) {
    // Nếu có lỗi, ghi lại lỗi và trả về thông báo lỗi
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// cập nhật sản phẩm trong giỏ hàng
const updateCart = async (req, res) => {
  try {
    // Lấy thông tin từ body của request
    const { itemId, size, quantity } = req.body;
    const { userId } = res.user;

    // Tìm dữ liệu người dùng từ database
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    cartData[itemId][size] = quantity;

    // Cập nhật lại giỏ hàng trong database
    await userModel.findByIdAndUpdate(userId, { cartData });

    // Trả về thông báo thành công
    return res.json({ success: true, message: "Giỏ hàng đã được cập nhật" });
  } catch (error) {
    // Nếu có lỗi, ghi lại lỗi và trả về thông báo lỗi
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// lấy sản phẩm trong giỏ hàng của người dùng
const getUserCart = async (req, res) => {
  try {
    // Lấy userId từ body của request
    const { userId } = req.user;

    // Tìm dữ liệu người dùng từ database
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    // Trả về giỏ hàng của người dùng
    return res.json({ success: true, cartData });
  } catch (error) {
    // Nếu có lỗi, ghi lại lỗi và trả về thông báo lỗi
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
