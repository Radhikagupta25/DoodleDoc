import React from "react";

function Buttons({
    children,
    onClick,
    variant = "blue",
    type = "button",
    loading = false,
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
            disabled={loading}
            className={styles[variant]}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
                children
            )}
        </button>
    );
}

export default Buttons;