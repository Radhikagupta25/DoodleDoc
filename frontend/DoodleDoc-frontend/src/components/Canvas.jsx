import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Arrow, RegularPolygon, } from "react-konva";
import useWhiteboardStore from "../store/useWhiteboardStore";

function Canvas() {
    const containerRef = useRef();
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });
    const { tool } = useWhiteboardStore();
    const [lines, setLines] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [startPos, setStartPos] = useState(null);
    const [previewShape, setPreviewShape] = useState(null);
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
        const pos = e.target
            .getStage()
            .getPointerPosition();

        if (tool === "pen" || tool === "eraser") {
            setIsDrawing(true);

            setLines([
                ...lines,
                {
                    tool,
                    points: [pos.x, pos.y],
                },
            ]);
        } else {
            setStartPos(pos);
        }
    };

    const handleMouseMove = (e) => {
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        if (tool === "pen" || tool === "eraser") {
            if (!isDrawing) return;
            const lastLine = lines[lines.length - 1];
            lastLine.points = lastLine.points.concat([
                point.x,
                point.y,
            ]);

            lines.splice(lines.length - 1, 1, lastLine);
            setLines(lines.concat());
            return;
        }

        if (!startPos) return;

        setPreviewShape({
            type: tool,
            x: startPos.x,
            y: startPos.y,
            width: point.x - startPos.x,
            height: point.y - startPos.y,

            radius: Math.sqrt(
                Math.pow(point.x - startPos.x, 2) +
                Math.pow(point.y - startPos.y, 2)
            ),

            points: [
                startPos.x,
                startPos.y,
                point.x,
                point.y,
            ],
        });
    };

    const handleMouseUp = () => {
        if (
            previewShape &&
            !["pen", "eraser"].includes(tool)
        ) {
            setShapes([
                ...shapes,
                {
                    id: Date.now(),
                    ...previewShape,
                },
            ]);
        }

        setPreviewShape(null);
        setStartPos(null);
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
                            stroke={
                                line.tool === "eraser"
                                    ? "#ffffff"
                                    : "#3E627B"
                            }
                            strokeWidth={
                                line.tool === "eraser"
                                    ? 20
                                    : 4
                            }
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                        />
                    ))}
                    {shapes.map((shape) => {
                        if (shape.type === "rectangle") {
                            return (
                                <Rect
                                    key={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    width={shape.width}
                                    height={shape.height}
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                />
                            );
                        }
                        if (shape.type === "circle") {
                            return (
                                <Circle
                                    key={shape.id}
                                    x={shape.x}
                                    y={shape.y}
                                    radius={Math.abs(shape.radius)}
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                />
                            );
                        }
                        if (shape.type === "line") {
                            return (
                                <Line
                                    key={shape.id}
                                    points={shape.points}
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                />
                            );
                        }
                        if (shape.type === "arrow") {
                            return (
                                <Arrow
                                    key={shape.id}
                                    points={shape.points}
                                    stroke="#D4AF37"
                                    fill="#D4AF37"
                                    strokeWidth={3}
                                />
                            );
                        }
                        if (shape.type === "diamond") {
                            const centerX = shape.x + shape.width / 2;
                            const centerY = shape.y + shape.height / 2;

                            return (
                                <Line
                                    key={shape.id}
                                    points={[
                                        centerX,
                                        shape.y,

                                        shape.x + shape.width,
                                        centerY,

                                        centerX,
                                        shape.y + shape.height,

                                        shape.x,
                                        centerY,

                                        centerX,
                                        shape.y,
                                    ]}
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                    closed
                                />
                            );
                        }
                        return null;
                    })}
                    {previewShape &&
                        previewShape.type === "rectangle" && (
                            <Rect
                                x={previewShape.x}
                                y={previewShape.y}
                                width={previewShape.width}
                                height={previewShape.height}
                                stroke="#D4AF37"
                                dash={[8, 4]}
                            />
                        )}
                    {previewShape &&
                        previewShape.type === "line" && (
                            <Line
                                points={previewShape.points}
                                stroke="#D4AF37"
                                strokeWidth={3}
                                dash={[8, 4]}
                            />
                        )}
                    {previewShape &&
                        previewShape.type === "arrow" && (
                            <Arrow
                                points={previewShape.points}
                                stroke="#D4AF37"
                                fill="#D4AF37"
                                strokeWidth={3}
                                dash={[8, 4]}
                            />
                        )}
                    {previewShape &&
                        previewShape.type === "circle" && (
                            <Circle
                                x={previewShape.x}
                                y={previewShape.y}
                                radius={previewShape.radius}
                                stroke="#D4AF37"
                                dash={[8, 4]}
                            />
                        )}
                    {previewShape &&
                        previewShape.type === "diamond" && (
                            <Line
                                points={[
                                    previewShape.x + previewShape.width / 2,
                                    previewShape.y,

                                    previewShape.x + previewShape.width,
                                    previewShape.y + previewShape.height / 2,

                                    previewShape.x + previewShape.width / 2,
                                    previewShape.y + previewShape.height,

                                    previewShape.x,
                                    previewShape.y + previewShape.height / 2,

                                    previewShape.x + previewShape.width / 2,
                                    previewShape.y,
                                ]}
                                stroke="#D4AF37"
                                strokeWidth={3}
                                dash={[8, 4]}
                                closed
                            />
                        )}
                </Layer>
            </Stage>
        </div>
    );
}

export default Canvas;