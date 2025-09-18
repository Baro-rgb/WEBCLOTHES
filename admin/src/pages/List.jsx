import axios from 'axios';
import  { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import './stylelist.css'

const List = ({token}) => {

  const [list, setList] = useState([]);
  const [editProduct, setEditProduct] = useState(null); // Sản phẩm đang chỉnh sửa
  const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.products) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const removeProduct = async (id) => { 
    try {
      
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } });
      
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  const handleEdit = (product) => {
    setEditProduct(product);
    setImages({
      image1: product.image?.[0] || null,
      image2: product.image?.[1] || null,
      image3: product.image?.[2] || null,
      image4: product.image?.[3] || null,
    });
  };
  const updateProduct = async () => {
    try {
      setLoading(true); // Bắt đầu loading
      const formData = new FormData();
      formData.append('name', editProduct.name);
      formData.append('description', editProduct.description);
      formData.append('price', editProduct.price);
      formData.append('category', editProduct.category);
      formData.append('subCategory', editProduct.subCategory);

      // Append ảnh
      images.image1 && formData.append('image1', images.image1);
      images.image2 && formData.append('image2', images.image2);
      images.image3 && formData.append('image3', images.image3);
      images.image4 && formData.append('image4', images.image4);

      const response = await axios.put(`${backendUrl}/api/product/update/${editProduct._id}`, formData, {
        headers: { token, 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Product updated successfully');
        setEditProduct(null); // Đóng modal
        fetchList(); // Refresh danh sách
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    fetchList()
  },[])

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Hình ảnh</b>
          <b>Tên sản phẩm</b>
          <b>Loại</b>
          <b>Giá</b>
          <b className="text-center">Hành động</b>
        </div>
        {list.map((item) => (
          <div
          className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          key={item._id}
        >
          <img className="w-12" src={item.image[0]} alt="" />
          <p>{item.name}</p>
          <p>{item.category}</p>
          <p>
            {currency}
            {item.price}
          </p>
          <div className="flex justify-between">
            <button onClick={() => removeProduct(item._id)} className="text-red-500">
              Delete
            </button>
            <button onClick={() => handleEdit(item)} className="text-blue-500">
              Edit
            </button>
          </div>
        </div>
        ))}
      </div>
      {editProduct && (
        <Modal isOpen={!!editProduct} onRequestClose={() => setEditProduct(null)} ariaHideApp={false} className="modal-edit-product">
          <h3>Edit Product</h3>
          <input
            type="text"
            value={editProduct.name}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            placeholder="Product Name"
          />
          <input
            type="number"
            value={editProduct.price}
            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
            placeholder="Product Price"
          />
          <textarea
            value={editProduct.description}
            onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
            placeholder="Product Description"
          />
          <label>
            <input type="file" onChange={(e) => setImages({ ...images, image1: e.target.files[0] })} />
            Upload Image 1
          </label>
          <label>
            <input type="file" onChange={(e) => setImages({ ...images, image2: e.target.files[0] })} />
            Upload Image 2
          </label>
          <label>
            <input type="file" onChange={(e) => setImages({ ...images, image3: e.target.files[0] })} />
            Upload Image 3
          </label>
          <label>
            <input type="file" onChange={(e) => setImages({ ...images, image4: e.target.files[0] })} />
            Upload Image 4
          </label>
          <button 
  onClick={updateProduct} 
  className={`bg-blue-500 text-white px-4 py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={loading}
>
  {loading ? 'Updating...' : 'Update'}
</button>
          <button onClick={() => setEditProduct(null)} className="bg-red-500 text-white px-4 py-2">
            Cancel
          </button>
        </Modal>
      )}
    </>
  );
};

export default List;