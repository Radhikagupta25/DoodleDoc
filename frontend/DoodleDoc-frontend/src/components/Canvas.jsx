import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";

function Canvas() {
    const containerRef = useRef();
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });

    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const resize = () => {
            if (containerRef.current) {
                setSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        resize();
        window.addEventListener("resize", resize);

        return () =>
            window.removeEventListener("resize", resize);
    }, []);

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const pos = e.target
            .getStage()
            .getPointerPosition();

        setLines([
            ...lines,
            {
                points: [pos.x, pos.y],
            },
        ]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const stage = e.target.getStage();

        const point = stage.getPointerPosition();

        const lastLine = lines[lines.length - 1];

        lastLine.points = lastLine.points.concat([
            point.x,
            point.y,
        ]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
        >
            <Stage
                width={size.width}
                height={size.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
                    {lines.map((line, index) => (
                        <Line
                            key={index}
                            points={line.points}
                            stroke="#3E627B"
                            strokeWidth={4}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
}

export default Canvas;