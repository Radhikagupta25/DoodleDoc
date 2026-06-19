import React from "react";

function Buttons({
    children,
    onClick,
    variant = "blue",
    type = "button",
}) {
    const styles = {
        blue:
            "px-7 py-3 rounded-xl bg-[#6D8FAF] text-white font-semibold shadow-lg hover:bg-[#5A7E9E] hover:scale-105 transition duration-300",

        white:
            "px-7 py-3 rounded-xl bg-white/80 backdrop-blur-md text-[#3E627B] font-semibold shadow-lg hover:bg-white hover:scale-105 transition duration-300",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={styles[variant]}
        >
            {children}
        </button>
    );
}

export default Buttons;