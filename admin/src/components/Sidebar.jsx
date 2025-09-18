import React from 'react' // Import React để sử dụng JSX
import {NavLink} from 'react-router-dom' // Import NavLink để tạo liên kết mà không reload trang
import { assets } from '../assets/assets' // Import các tài nguyên (icon) từ thư mục assets

const Sidebar = () => { // Component Sidebar
  return (
    <div className='w-[18%] min-h-screen border-r-2'> {/* Cấu hình Sidebar có chiều rộng 18% và chiều cao toàn màn hình */}
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'> {/* Chia Sidebar thành các item theo chiều dọc */}
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/add">
                {/* Link "Add Items" với icon và text */}
                <img className='w-5 h-5' src={assets.add_icon} alt="" /> {/* Thêm icon từ assets */}
                <p className='hidden md:block'>Add Items</p> {/* Ẩn text trên các màn hình nhỏ, chỉ hiển thị trên màn hình lớn */}
            </NavLink>
              
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/list">
                {/* Link "List Items" với icon và text */}
                <img className='w-5 h-5' src={assets.order_icon} alt="" /> {/* Thêm icon từ assets */}
                <p className='hidden md:block'>List Items</p> {/* Ẩn text trên các màn hình nhỏ, chỉ hiển thị trên màn hình lớn */}
            </NavLink>
            
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/orders">
                {/* Link "Orders" với icon và text */}
                <img className='w-5 h-5' src={assets.order_icon} alt="" /> {/* Thêm icon từ assets */}
                <p className='hidden md:block'>Orders</p> {/* Ẩn text trên các màn hình nhỏ, chỉ hiển thị trên màn hình lớn */}
            </NavLink>  

        </div>
    </div>
  )
}

export default Sidebar // Xuất component Sidebar để sử dụng ở nơi khác
