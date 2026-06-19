import React, { useState } from "react";
import bg from "../assets/pastel-simple-background-free-vector.jpg";
import Buttons from "../components/Buttons";
import { useNavigate } from "react-router-dom";
import CursorTrail from "../components/CursorTrail";
import { motion } from "framer-motion";


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    function handleSubmit(e) {
        e.preventDefault();

        const newErrors = {
            email: "",
            password: "",
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password =
                "Password must contain at least 8 characters";
        }

        setErrors(newErrors);

        if (!newErrors.email && !newErrors.password) {
            console.log({
                email,
                password,
            });
        }
    }

    function userSignup() {
        navigate("/userSignup");
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-3 sm:px-4 bg-cover bg-center"
            style={{
                backgroundImage: `url(${bg})`,
            }}
        >
            <CursorTrail />
            <motion.div
                initial={{
                    opacity: 0,
                    y: 60,
                    scale: 0.9,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 90,
                    damping: 14,
                }}
                className="w-[92%] max-w-md p-5 sm:p-8 rounded-3xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl"
            >                <h1 className="text-3xl sm:text-4xl font-black text-center text-[#3E627B]">
                    DoodleDoc
                </h1>

                <p className="text-center text-sm sm:text-base text-[#6E879B] mt-2 mb-6 sm:mb-8">
                    Welcome Back
                </p>

                <form onSubmit={handleSubmit} noValidate>

                    <div className="mb-5">
                        <label className="block mb-2 text-[#3E627B] font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border border-white/40 outline-none focus:border-[#6D8FAF]"
                        />

                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-[#3E627B] font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/40 outline-none focus:border-[#6D8FAF]"
                        />

                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <Buttons variant="blue" type="submit">
                            Login
                        </Buttons>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[#6E879B]">
                        Don't have an account?
                    </p>

                    <button onClick={userSignup}
                        className="mt-2 font-semibold text-[#C86B85] hover:text-[#D4AF37] transition"
                    >
                        Sign Up
                    </button>
                </div>
            </motion.div>
        </div >
    );
}

export default Login;