import React, { useState } from "react";
import { useParams } from "react-router-dom";
import bg from "../assets/pastel-simple-background-free-vector.jpg";

import {Pencil,Eraser,Palette,Type,Bold,Italic,Underline,Square,Circle,Diamond,Minus,MoveRight,Undo2,Redo2,Save,Trash2} from "lucide-react";

function Room() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("draw");

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center p-2 sm:p-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="h-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-[#E7EEF5] bg-white">
          <h1 className="text-2xl sm:text-3xl font-black text-[#3E627B]">
            DoodleDoc
          </h1>
          <div className="px-4 py-2 rounded-full bg-[#EEF6FC] text-[#5E88A5] text-sm font-semibold">
            Room: {id}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto p-3 border-b border-[#E7EEF5] bg-[#FAFCFE]">
          {[
            ["draw", "Draw"],
            ["text", "Text"],
            ["shapes", "Shapes"],
            ["actions", "Actions"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium transition ${activeTab === key
                  ? "bg-[#6D8FAF] text-white shadow"
                  : "bg-[#EEF6FC] text-[#3E627B]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="px-3 py-2 border-b border-[#E7EEF5] bg-white min-h-17.5 flex items-center">
          {activeTab === "draw" && (
            <div className="flex gap-2 overflow-x-auto">
              <button className="p-3 rounded-xl bg-[#EEF6FC] text-[#5E88A5] hover:scale-105 transition">
                <Pencil size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#FFF4F7] text-[#C86B85] hover:scale-105 transition">
                <Eraser size={20} />
              </button>

              <div className="flex items-center gap-2 px-3 rounded-xl bg-[#FFF8E8]">
                <Palette size={18} className="text-[#D4AF37]" />
                <input type="color" />
              </div>

              <select className="px-3 rounded-xl bg-[#EEF6FC] text-[#3E627B]">
                <option>2px</option>
                <option>4px</option>
                <option>6px</option>
                <option>8px</option>
              </select>

            </div>
          )}

          {activeTab === "text" && (
            <div className="flex gap-2 overflow-x-auto">

              <button className="p-3 rounded-xl bg-[#FFF4F7] text-[#C86B85]">
                <Type size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#FFF4F7] text-[#C86B85]">
                <Bold size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#FFF4F7] text-[#C86B85]">
                <Italic size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#FFF4F7] text-[#C86B85]">
                <Underline size={20} />
              </button>

              <select className="px-3 rounded-xl bg-[#FFF4F7] text-[#C86B85]">
                <option>Inter</option>
                <option>Poppins</option>
                <option>Roboto</option>
              </select>

              <select className="px-3 rounded-xl bg-[#FFF4F7] text-[#C86B85]">
                <option>16</option>
                <option>20</option>
                <option>24</option>
                <option>32</option>
              </select>

            </div>
          )}

          {activeTab === "shapes" && (
            <div className="flex gap-2 overflow-x-auto">

              <button className="p-3 rounded-xl bg-[#FFF8E8] text-[#D4AF37]">
                <Square size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#FFF8E8] text-[#D4AF37]">
                <Circle size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#FFF8E8] text-[#D4AF37]">
                <Diamond size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#FFF8E8] text-[#D4AF37]">
                <Minus size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#FFF8E8] text-[#D4AF37]">
                <MoveRight size={20} />
              </button>

            </div>
          )}

          {activeTab === "actions" && (
            <div className="flex gap-2 overflow-x-auto">

              <button className="p-3 rounded-xl bg-[#EDF9F1] text-[#4E9B68]">
                <Undo2 size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#EDF9F1] text-[#4E9B68]">
                <Redo2 size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#EDF9F1] text-[#4E9B68]">
                <Save size={20} />
              </button>

              <button className="p-3 rounded-xl bg-[#FFE7EE] text-[#D55A7A]">
                <Trash2 size={20} />
              </button>

            </div>
          )}

        </div>
        <div className="flex-1 p-3 sm:p-4 bg-[#F7FBFF]">

          <div className="w-full h-full rounded-3xl bg-white border-2 border-[#E7EEF5] shadow-inner flex items-center justify-center">

            <div className="text-center">

              <h2 className="text-3xl font-bold text-[#3E627B]">
                Sample Canvas
              </h2>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Room;