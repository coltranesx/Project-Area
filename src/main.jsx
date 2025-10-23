// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 1. ÖNCE React Flow stilleri
import 'reactflow/dist/style.css'; 
// 2. SONRA bizim kendi stillerimiz (onları ezebilmek için)
import './App.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)