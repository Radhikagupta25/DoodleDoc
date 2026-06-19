import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'react-dom'
import 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './pages/Home.jsx'
import Home from './pages/Home.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider/>
    </React.StrictMode>
)
const router=createBrowserRouter(
    [
        {
            path:'/',
            element:<Home/>
        }
    ]
)
