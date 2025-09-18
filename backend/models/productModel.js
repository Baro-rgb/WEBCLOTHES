import mongoose from "mongoose";

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên sản phẩm (bắt buộc)
    description: { type: String, required: true }, // Mô tả sản phẩm (bắt buộc)
    price: { type: Number, required: true }, // Giá sản phẩm (bắt buộc)
    image: { type: Array, required: true }, // Hình ảnh sản phẩm (dạng mảng, bắt buộc)
    category: { type: String, required: true }, // Danh mục sản phẩm (bắt buộc)
    subCategory: { type: String, required: true }, // Danh mục con của sản phẩm (bắt buộc)
    sizes: { type: Array, required: true }, // Các kích cỡ của sản phẩm (dạng mảng, bắt buộc)
    bestseller: { type: Boolean }, // Cờ đánh dấu sản phẩm bán chạy (không bắt buộc)
    date: { type: Number, required: true } // Ngày tạo sản phẩm (bắt buộc)
});

// Tạo mô hình (model) sản phẩm, nếu chưa có thì tạo mới, nếu có rồi thì sử dụng lại
const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel; // Xuất mô hình sản phẩm để sử dụng ở các nơi khác
