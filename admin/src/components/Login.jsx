import axios from "axios"; // Import thư viện axios để gửi yêu cầu HTTP
import React, { useState } from "react"; // Import useState từ React để quản lý trạng thái
import { backendUrl } from "../App"; // Import đường dẫn backend từ App.js
import { toast } from "react-toastify"; // Import thư viện để hiển thị thông báo toast

const Login = ({ setToken }) => { // Hàm Login nhận prop setToken để lưu token
  const [email, setEmail] = useState(""); // Khởi tạo trạng thái email
  const [password, setPassword] = useState(""); // Khởi tạo trạng thái password

  const onSubmitHandler = async (e) => { // Hàm xử lý khi form được submit
    try {
      e.preventDefault(); // Ngừng hành động mặc định của form (reload trang)
      
      // Gửi yêu cầu POST đến API với thông tin email và password
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      // Kiểm tra nếu đăng nhập thành công, lưu token vào state
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        // Nếu không thành công, hiển thị thông báo lỗi
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error); // Log lỗi ra console
      toast.error(error.message); // Hiển thị thông báo lỗi nếu có lỗi xảy ra
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}> {/* Xử lý sự kiện khi submit form */}
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)} // Cập nhật trạng thái email
              value={email} // Hiển thị giá trị email trong input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="email" // Định dạng input là email
              placeholder="your@email.com" // Placeholder cho input email
              required // Bắt buộc nhập
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)} // Cập nhật trạng thái password
              value={password} // Hiển thị giá trị password trong input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="password" // Định dạng input là password
              placeholder="Nhập mật khẩu của bạn" // Placeholder cho input password
              required // Bắt buộc nhập
            />
          </div>
          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
            type="submit" // Gửi form khi nhấn nút
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; // Xuất component Login để sử dụng ở nơi khác
