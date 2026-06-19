import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/pastel-simple-background-free-vector.jpg";
import Buttons from "../components/Buttons";
import CursorTrail from "../components/CursorTrail";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password =
                "Password must contain at least 8 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword =
                "Please confirm your password";
        } else if (
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword =
                "Passwords do not match";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            localStorage.setItem(
                "user",
                JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                })
            );

            navigate("/");
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-3 sm:px-4 bg-cover bg-center"
            style={{
                backgroundImage: `url(${bg})`,
            }}
        >
            <CursorTrail />
            <div className="w-[92%] max-w-md p-5 sm:p-8 rounded-3xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl">

                <h1 className="text-3xl sm:text-4xl font-black text-center text-[#3E627B]">
                    DoodleDoc
                </h1>

                <p className="text-center text-sm sm:text-base text-[#6E879B] mt-2 mb-6 sm:mb-8">
                    Create your account
                </p>

                <form onSubmit={handleSubmit} noValidate>

                    <div className="mb-4">
                        <label className="block mb-2 text-[#3E627B] font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border border-white/40 outline-none focus:border-[#6D8FAF]"
                        />

                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-[#3E627B] font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border border-white/40 outline-none focus:border-[#6D8FAF]"
                        />

                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-[#3E627B] font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border border-white/40 outline-none focus:border-[#6D8FAF]"
                        />

                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-[#3E627B] font-medium">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border border-white/40 outline-none focus:border-[#6D8FAF]"
                        />

                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <Buttons variant="blue" type="submit">
                            Sign Up
                        </Buttons>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[#6E879B]">
                        Already have an account?
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/userLogin")}
                        className="mt-2 font-semibold text-[#C86B85] hover:text-[#D4AF37] transition"
                    >
                        Login
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Signup;