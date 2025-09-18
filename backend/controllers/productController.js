import { v2 as cloudinary } from "cloudinary"; // Nhập module cloudinary để xử lý việc tải lên ảnh lên Cloudinary
import productModel from "../models/productModel.js"; // Nhập model sản phẩm để thao tác với cơ sở dữ liệu MongoDB

// Function thêm sản phẩm mới
const addProduct = async (req, res) => { 
    try {
        // Lấy thông tin từ request body (dữ liệu sản phẩm từ frontend gửi lên)
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        
        // Kiểm tra và lấy các ảnh từ request. Dữ liệu ảnh sẽ có trong req.files
        // Mỗi ảnh sẽ được lưu vào một biến riêng biệt
        const image1 = req.files.image1 && req.files.image1[0]; // Lấy ảnh thứ 1 nếu tồn tại
        const image2 = req.files.image2 && req.files.image2[0]; // Lấy ảnh thứ 2 nếu tồn tại
        const image3 = req.files.image3 && req.files.image3[0]; // Lấy ảnh thứ 3 nếu tồn tại
        const image4 = req.files.image4 && req.files.image4[0]; // Lấy ảnh thứ 4 nếu tồn tại
        
        // Lọc ra các ảnh không undefined và lưu vào mảng images
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Tải ảnh lên Cloudinary và lấy URL của mỗi ảnh
        let imagesUrl = await Promise.all(
            images.map(async (image) => { 
                let result = await cloudinary.uploader.upload(image.path, { resource_type: "image" }); // Tải ảnh lên Cloudinary
                return result.secure_url; // Trả về URL an toàn của ảnh
            })
        );

        // In ra console các thông tin đã lấy từ frontend để kiểm tra
        console.log(name, description, price, category, subCategory, sizes, bestseller);
        console.log(imagesUrl);

        // Tạo đối tượng productData chứa dữ liệu sản phẩm cần thêm vào cơ sở dữ liệu
        const productData = {
            name, // Tên sản phẩm
            description, // Mô tả sản phẩm
            category, // Danh mục sản phẩm
            price: Number(price), // Chuyển giá từ chuỗi sang số
            subCategory, // Danh mục phụ
            bestseller: bestseller === "true" ? true : false, // Chuyển giá trị bestseller từ chuỗi sang boolean
            sizes: JSON.parse(sizes), // Chuyển kích thước từ chuỗi JSON thành đối tượng
            image: imagesUrl, // Danh sách URL ảnh sau khi tải lên Cloudinary
            date: Date.now(), // Thời gian hiện tại
        };
        console.log(productData); // In ra console để kiểm tra dữ liệu sản phẩm

        // Tạo một đối tượng sản phẩm mới từ productData
        const product = new productModel(productData);
        await product.save(); // Lưu sản phẩm vào cơ sở dữ liệu MongoDB

        // Trả về phản hồi cho frontend khi thêm sản phẩm thành công
        return res.json({ success: true, message: "Sản phẩm đã được thêm" });
    } catch (error) {
        console.log(error); // Nếu có lỗi, in lỗi ra console
        return res.json({ success: false, message: error.message }); // Trả về thông báo lỗi cho frontend
    }
};

// Function lấy danh sách tất cả sản phẩm
const listProduct = async (req, res) => { 
    try {
        // Tìm tất cả các sản phẩm trong cơ sở dữ liệu
        const products = await productModel.find({});
        // Trả về danh sách sản phẩm dưới dạng JSON
        return res.json({ success: true, products });
    } catch (error) {
        // Nếu có lỗi, in ra console (không có xử lý lỗi cụ thể ở đây)
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Function xóa sản phẩm (chưa thực hiện trong code)
const removeProduct = async (req, res) => { 
    // Logic xóa sản phẩm sẽ được thêm vào đây
    try {
        // Xóa sản phẩm theo ID được gửi từ frontend (trong req.body.id)
        await productModel.findByIdAndDelete(req.body.id);
        // Trả về thông báo xóa thành công
        return res.json({ success: true, message: "Sản phẩm đã được xóa" });
    } catch (error) {
        console.log(error); // Nếu có lỗi, in lỗi ra console
        return res.json({ success: false, message: error.message }); // Trả về thông báo lỗi cho frontend
    }
};

// Function lấy thông tin chi tiết của một sản phẩm (chưa thực hiện trong code)
const singleProduct = async (req, res) => { 
    // Logic lấy thông tin sản phẩm theo ID hoặc các tiêu chí sẽ được thêm vào đây
    try {
        // Lấy thông tin sản phẩm theo ID được gửi từ frontend
        const { productId } = req.body;
        const product = await productModel.findById(productId); // Tìm sản phẩm theo ID trong cơ sở dữ liệu
        // Trả về thông tin chi tiết của sản phẩm
        return res.json({ success: true, product });
    } catch (error) {
        console.log(error); // Nếu có lỗi, in lỗi ra console
        return res.json({ success: false, message: error.message }); // Trả về thông báo lỗi cho frontend
    }
};
// API cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
      // Lấy `id` của sản phẩm cần sửa từ params
      const { id } = req.params;

      // Lấy thông tin từ request body
      const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

      // Lấy các file ảnh từ request
      const image1 = req.files.image1 && req.files.image1[0];
      const image2 = req.files.image2 && req.files.image2[0];
      const image3 = req.files.image3 && req.files.image3[0];
      const image4 = req.files.image4 && req.files.image4[0];
      const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

      // Tải ảnh lên Cloudinary nếu có
      let imagesUrl = [];
      if (images.length > 0) {
          imagesUrl = await Promise.all(
              images.map(async (image) => {
                  const result = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
                  return result.secure_url;
              })
          );
      }

      // Lấy sản phẩm hiện tại từ database
      const product = await productModel.findById(id);
      if (!product) {
          return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
      }

      // Cập nhật dữ liệu sản phẩm
      const updatedData = {
          name: name || product.name,
          description: description || product.description,
          category: category || product.category,
          price: price ? Number(price) : product.price,
          subCategory: subCategory || product.subCategory,
          bestseller: bestseller ? bestseller === "true" : product.bestseller,
          sizes: sizes ? JSON.parse(sizes) : product.sizes,
          image: imagesUrl.length > 0 ? imagesUrl : product.image, // Cập nhật ảnh nếu có ảnh mới
          date: Date.now(), // Thời gian cập nhật
      };

      // Lưu thay đổi vào database
      await productModel.findByIdAndUpdate(id, updatedData, { new: true });

      return res.json({ success: true, message: "Sản phẩm đã được cập nhật", data: updatedData });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
  }
};
  
// Xuất các function ra để sử dụng ở nơi khác (ví dụ router)
export { listProduct, addProduct, removeProduct, singleProduct, updateProduct };
