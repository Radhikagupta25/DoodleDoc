import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import ExistingRoom from './pages/ExistingRoom'
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/room/:id",
        element: <Room />,
    },
    ,
    {
        path: "/existingRoomLogin",
        element: <ExistingRoom />,
    },
    ,
    {
        path: "/userLogin",
        element: <Login />,
    },
    ,
    {
        path: "/userSignup",
        element: <Signup/>,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);