import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/pastel-simple-background-free-vector.jpg";
import Buttons from "../components/Buttons";
import { motion } from "framer-motion";

function ExistingRoom() {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    setError("");
    navigate(`/room/${roomId}`);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-3 sm:px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 90,
          damping: 14,
        }}
        className="w-[92%] max-w-md p-5 sm:p-8 rounded-3xl bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-center text-[#3E627B]">
          Join Room
        </h1>

        <p className="text-center text-sm sm:text-base text-[#6E879B] mt-2 mb-6 sm:mb-8">
          Enter a Room ID to continue
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label className="block mb-2 text-[#3E627B] font-medium">
              Room ID
            </label>
            <input
              type="text"
              placeholder="e.g. aBcD1234"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/70 border border-white/40 outline-none focus:border-[#6D8FAF]"
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <Buttons variant="blue" type="submit">
              Join Room
            </Buttons>
          </div>
        </form>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="font-semibold text-[#C86B85] hover:text-[#D4AF37] transition"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ExistingRoom;