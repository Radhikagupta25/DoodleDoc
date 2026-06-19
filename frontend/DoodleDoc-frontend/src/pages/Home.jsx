import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import bg from "../assets/pastel-simple-background-free-vector.jpg";
import Buttons from "../components/Buttons";
import { motion } from "framer-motion";
import CursorTrail from "../components/CursorTrail";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState("");
  const title = "DoodleDoc";
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.name);
    }
  }, []);

  function createRoom() {
    setLoading("create");
    setTimeout(() => {
      const roomId = nanoid(8);
      navigate(`/room/${roomId}`);
    }, 400);
  }

  function existingRoom() {
    setLoading("join");
    setTimeout(() => {
      navigate("/existinRoomLogin");
    }, 400);
  }

  function userLogin() {
    navigate("/userLogin");
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <CursorTrail />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
        <Buttons variant="blue" onClick={userLogin}>
          {username ? `Hi, ${username}` : "Login"}
        </Buttons>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#3E627B] tracking-wide drop-shadow-md">
          {title.split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: index * 0.12,
                duration: 0.6,
                type: "spring",
                stiffness: 80,
                damping: 15,
              }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-[#6E879B] font-medium max-w-xl">
          Capture Ideas Before They Fade.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-10 w-full sm:w-auto items-center">
          <Buttons variant="blue" onClick={createRoom} loading={loading === "create"}>
            Create Room
          </Buttons>

          <Buttons variant="white" onClick={existingRoom} loading={loading === "join"}>
            Join Room
          </Buttons>
        </div>
      </div>
    </div>
  );
}

export default Home;