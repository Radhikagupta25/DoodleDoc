import { useEffect, useState } from "react";
import { IoSparkles } from "react-icons/io5";

function CursorTrail() {
    const [trail, setTrail] = useState([]);

    useEffect(() => {
        let lastX = 0;
        let lastY = 0;

        const handleMove = (e) => {
            const distance = Math.sqrt(
                (e.clientX - lastX) ** 2 +
                (e.clientY - lastY) ** 2
            );

            if (distance < 60) return;

            lastX = e.clientX;
            lastY = e.clientY;

            const point = {
                id: Date.now() + Math.random(),
                x: e.clientX,
                y: e.clientY,
            };

            setTrail((prev) => [...prev.slice(-6), point]);
        };

        window.addEventListener("mousemove", handleMove);

        return () => {
            window.removeEventListener("mousemove", handleMove);
        };
    }, []);

    return (
        <>
            {trail.map((point, index) => (
                <div
                    key={point.id}
                    className="pointer-events-none fixed"
                    style={{
                        left: point.x,
                        top: point.y,
                        transform: "translate(-50%, -50%)",
                        zIndex: 9999,
                        opacity: (index + 1) / trail.length,
                    }}
                >
                    <IoSparkles
                        size={20 - index}
                        color={index % 2 === 0 ? "#C86B85" : "#D4AF37"}
                    />
                </div>
            ))}
        </>
    );
}

export default CursorTrail;