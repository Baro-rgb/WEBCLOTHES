import  { useState } from 'react' // Import React và useState hook để quản lý trạng thái
import { assets } from '../assets/assets'; // Import các tài nguyên (assets) như icon và hình ảnh
import axios from 'axios'; // Import axios để gửi yêu cầu HTTP
import { backendUrl } from '../App'; // Import URL backend từ App.js
import { toast } from 'react-toastify'; // Import thư viện thông báo toast


const Add = ({token}) => { // Component Add nhận token từ props

  const [loading, setLoading] = useState(false);


  // Các trạng thái quản lý hình ảnh
  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  // Các trạng thái quản lý thông tin sản phẩm
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]); // Trạng thái lưu trữ kích cỡ sản phẩm

  const onSubmitHandler = async (e) => { // Hàm xử lý khi gửi form
    e.preventDefault(); // Ngừng hành động mặc định của form
    setLoading(true); // Bật trạng thái loading

    try {
      
      const formData = new FormData(); // Tạo FormData để gửi dữ liệu

      // Thêm các trường thông tin vào FormData
      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes", JSON.stringify(sizes)) // Mảng sizes chuyển thành chuỗi JSON
      
      // Kiểm tra xem hình ảnh có được chọn không và thêm vào FormData
      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4", image4)
      
      const response = await axios.post(backendUrl + "/api/product/add", formData,{headers:{token}}) // Gửi yêu cầu POST tới backend để thêm sản phẩm
      
      if (response.data.success) {
        toast.success(response.data.message); // Hiển thị thông báo thành công
        setName('') // Reset các giá trị sau khi thêm sản phẩm thành công
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      } else {
        toast.error(response.data.message) // Hiển thị thông báo lỗi
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message) // Hiển thị thông báo lỗi khi có lỗi
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi hoàn tất
    }
  }


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'> {/* Form nhập thông tin sản phẩm */}
      <div>
        <p className='mb-2'>Upload Image</p>

        <div className='flex gap-2'>
          {/* Các ô để chọn hình ảnh sản phẩm */}
          <label htmlFor="image1">
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file"  id="image1" hidden /> {/* Đặt sự kiện để chọn file */}
          </label>
          <label htmlFor="image2">
            <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file"  id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file"  id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file"  id="image4" hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập ở đây' required/>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='ghi nội dung ở đây' required/>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'> {/* Phân chia các trường chọn cho category, subCategory và price */}
        <div>
          <p className='mb-2 '>Product category</p>
          <select onChange={(e)=>setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2 '>Sub category</p>
          <select onChange={(e)=> setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
        </div>

      </div>

      <div>
        <p className='mb-2 '>Poduct Sizes</p>
        <div className='flex gap-3'>
          {/* Các ô chọn kích cỡ sản phẩm */}
          <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev,"S"])} >
            <p className={` ${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
          </div>

          <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev,"M"])} >
            <p className={` ${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
          </div>

          <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev,"L"])} >
            <p className={` ${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
          </div>

          <div onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev,"XL"])} >
            <p className={` ${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
          </div>

          <div onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev,"XXL"])} >
            <p className={` ${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
          </div>
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        {/* Checkbox chọn xem sản phẩm có phải là bestseller hay không */}
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>
      
      <button type="submit" className={`w-28 py-3 mt-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white'}`} disabled={loading} > {/* Vô hiệu hóa nút khi loading */}
      {loading ? 'Loading...' : 'ADD'}
      </button>  
    </form>
  )
}

export default Add; // Xuất component Add để sử dụng ở nơi khác
