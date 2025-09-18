import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'; // Đảm bảo đã import BrowserRouter
import React from 'react'; // Đảm bảo đã import React
import ReactDOM from 'react-dom/client'; // Đảm bảo đã import ReactDOM từ react-dom/client

import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  
    <App />
   
  </BrowserRouter>,
)
