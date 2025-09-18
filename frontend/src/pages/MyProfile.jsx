import axios from "axios"; // Thư viện gửi yêu cầu HTTP
import React, { useEffect, useState } from "react"; // Import React hooks
import { toast } from "react-toastify"; // Thư viện hiển thị thông báo

const MyProfile = () => {
  const [user, setUser] = useState({}); // Lưu thông tin người dùng
  const [avatar, setAvatar] = useState(null); // Lưu file ảnh tạm thời
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  const backendUrl = "http://localhost:4000"; // URL backend (thay đổi tùy theo cấu hình)

  // Lấy thông tin người dùng khi component được tải
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token qua header
          },
        });

        if (response.data.success) {
          setUser(response.data.user); // Cập nhật thông tin người dùng
          console.log(response.data.user);
        } else {
          toast.error(response.data.message); // Hiển thị lỗi từ backend
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        toast.error("Không thể tải thông tin người dùng.");
      }
    };

    fetchProfile();
  }, [token]);

  // Xử lý khi tải ảnh đại diện lên
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]; // Lấy file người dùng tải lên
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file); // Đưa file vào FormData
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/upload-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật ảnh đại diện thành công!");
        setUser((prevUser) => ({ ...prevUser, avatar: response.data.avatar })); // Cập nhật ảnh đại diện mới
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh đại diện:", error);
      toast.error("Không thể cập nhật ảnh đại diện.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Thông tin cá nhân
        </h1>
        <div className="mb-4 flex flex-col items-center">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 rounded-full mb-2 border border-gray-300 object-cover"
          />
          <label className="block text-sm font-medium text-gray-700 mt-2">
            Đổi ảnh đại diện:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="mt-2 text-sm"
          />
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Tên:</p>
          <p className="text-lg font-semibold text-gray-900">
            {user.name || "Chưa cập nhật"}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Email:</p>
          <p className="text-lg font-semibold text-gray-900">
            {user.email || "Chưa cập nhật"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
