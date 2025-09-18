import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middleware 
app.use(express.json());
app.use(cors());

//api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.send("API WORKING");
});

// Xử lý đường dẫn thư mục uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tạo thư mục uploads nếu nó không tồn tại
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Cung cấp tệp tin tĩnh từ thư mục uploads
app.use("/uploads", express.static(uploadDir));

// Start server
app.listen(port, () => console.log('Server started on PORT : ' + port));
