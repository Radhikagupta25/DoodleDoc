import React from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import bg from "../assets/pastel-simple-background-free-vector.jpg";
import Buttons from "../components/Buttons";

function Home() {
  const navigate = useNavigate();

  function createRoom() {
    const roomId = nanoid(8);
    navigate(`/room/${roomId}`);
  }

  function existingRoom() {
    navigate("/existinRoomLogin");
  }

  function userLogin() {
    navigate("/userLogin");
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
        <Buttons variant="blue" onClick={userLogin}>
          Login
        </Buttons>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#3E627B] tracking-wide drop-shadow-md">
          DoodleDoc
        </h1>

        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-[#6E879B] font-medium max-w-xl">
          Capture Ideas Before They Fade.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-10 w-full sm:w-auto items-center">
          <Buttons variant="blue" onClick={createRoom}>
            Create Room
          </Buttons>

          <Buttons variant="white" onClick={existingRoom}>
            Join Room
          </Buttons>
        </div>
      </div>
    </div>
  );
}

export default Home;