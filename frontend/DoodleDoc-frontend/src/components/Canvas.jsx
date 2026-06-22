import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Arrow, RegularPolygon, Transformer, Text, } from "react-konva";
import useWhiteboardStore from "../store/useWhiteboardStore";

function Canvas() {
    const containerRef = useRef();
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });
    const { tool, color, brushSize, fontSize, fontFamily, isBold, isItalic, isUnderline, } = useWhiteboardStore();
    const [lines, setLines] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [startPos, setStartPos] = useState(null);
    const [previewShape, setPreviewShape] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const transformerRef = useRef();
    const selectedNodeRef = useRef();
    const [texts, setTexts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [selectedTextId, setSelectedTextId] = useState(null);
    const [textInput, setTextInput] = useState(null);

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
    useEffect(() => {
        if (
            transformerRef.current &&
            selectedNodeRef.current
        ) {
            transformerRef.current.nodes([
                selectedNodeRef.current,
            ]);

            transformerRef.current
                .getLayer()
                ?.batchDraw();
        }
    }, [selectedId, selectedTextId]);
    useEffect(() => {
        if (!selectedTextId) return;

        setTexts((prev) =>
            prev.map((text) =>
                text.id === selectedTextId
                    ? {
                        ...text,
                        fontFamily,
                        fontSize,
                    }
                    : text
            )
        );
    }, [fontFamily, fontSize]);

    const updateShapePosition = (shapeId, x, y) => {
        setShapes(
            shapes.map((s) =>
                s.id === shapeId
                    ? {
                        ...s,
                        x,
                        y,
                    }
                    : s
            )
        );
    };

    const handleMouseDown = (e) => {
        const pos = e.target
            .getStage()
            .getPointerPosition();

        if (tool === "pen" || tool === "eraser") {
            setIsDrawing(true);

            setLines([
                ...lines,
                {
                    tool, color, brushSize,
                    points: [pos.x, pos.y],
                },
            ]);
        }
        if (tool === "text") {
            setTextInput({
                x: pos.x,
                y: pos.y,
                value: "",
            });

            return;
        }
        else {
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
            className="w-full h-full relative"
        >
            <Stage
                width={size.width}
                height={size.height}
                onMouseDown={(e) => {
                    if (e.target === e.target.getStage()) {
                        setSelectedId(null);
                        setSelectedTextId(null);
                    }
                    handleMouseDown(e);
                }}
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
                                    : line.color
                            }
                            strokeWidth={
                                line.tool === "eraser"
                                    ? 20
                                    : line.brushSize
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
                                    ref={selectedId === shape.id ? selectedNodeRef : null}
                                    x={shape.x}
                                    y={shape.y}
                                    width={shape.width}
                                    height={shape.height}
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                    draggable
                                    onClick={() => setSelectedId(shape.id)}
                                    onTap={() => setSelectedId(shape.id)}
                                    onDragEnd={(e) => {
                                        const updatedShapes = shapes.map((s) =>
                                            s.id === shape.id
                                                ? {
                                                    ...s,
                                                    x: e.target.x(),
                                                    y: e.target.y(),
                                                }
                                                : s
                                        );

                                        setShapes(updatedShapes);
                                    }}
                                />
                            );
                        }
                        if (shape.type === "circle") {
                            return (
                                <Circle
                                    key={shape.id}
                                    ref={selectedId === shape.id ? selectedNodeRef : null}
                                    x={shape.x}
                                    y={shape.y}
                                    radius={Math.abs(shape.radius)}
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                    draggable
                                    onClick={() => setSelectedId(shape.id)}
                                    onTap={() => setSelectedId(shape.id)}
                                    onDragEnd={(e) =>
                                        updateShapePosition(
                                            shape.id,
                                            e.target.x(),
                                            e.target.y()
                                        )
                                    }
                                />
                            );
                        }
                        if (shape.type === "line") {
                            return (
                                <Line
                                    key={shape.id}
                                    ref={selectedId === shape.id ? selectedNodeRef : null}
                                    points={shape.points}
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                    draggable
                                    onClick={() => setSelectedId(shape.id)}
                                    onTap={() => setSelectedId(shape.id)}
                                />
                            );
                        }
                        if (shape.type === "arrow") {
                            return (
                                <Arrow
                                    key={shape.id}
                                    ref={selectedId === shape.id ? selectedNodeRef : null}
                                    points={shape.points}
                                    stroke="#D4AF37"
                                    fill="#D4AF37"
                                    strokeWidth={3}
                                    draggable
                                    onClick={() => setSelectedId(shape.id)}
                                    onTap={() => setSelectedId(shape.id)}
                                />
                            );
                        }
                        if (shape.type === "diamond") {
                            const centerX = shape.x + shape.width / 2;
                            const centerY = shape.y + shape.height / 2;

                            return (
                                <Line
                                    key={shape.id}
                                    ref={selectedId === shape.id ? selectedNodeRef : null}
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
                                    draggable
                                    onClick={() => setSelectedId(shape.id)}
                                    onTap={() => setSelectedId(shape.id)}
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
                    {texts.map((textObj) => (
                        <Text
                            key={textObj.id}

                            x={textObj.x}
                            y={textObj.y}

                            text={textObj.text}

                            fill={textObj.color}

                            fontSize={textObj.fontSize}

                            fontFamily={textObj.fontFamily}

                            fontStyle={`
    ${textObj.isBold ? "bold" : ""}
    ${textObj.isItalic ? "italic" : ""}
  `}

                            textDecoration={
                                textObj.isUnderline
                                    ? "underline"
                                    : ""
                            }

                            draggable
                            onDblClick={() => {
                                const newText = prompt(
                                    "Edit Text",
                                    textObj.text
                                );

                                if (!newText) return;

                                setTexts(
                                    texts.map((t) =>
                                        t.id === textObj.id
                                            ? {
                                                ...t,
                                                text: newText,
                                            }
                                            : t
                                    )
                                );
                            }}
                            onDragEnd={(e) => {
                                setTexts(
                                    texts.map((t) =>
                                        t.id === textObj.id
                                            ? {
                                                ...t,
                                                x: e.target.x(),
                                                y: e.target.y(),
                                            }
                                            : t
                                    )
                                );
                            }}
                            onClick={() =>
                                setSelectedTextId(textObj.id)
                            }
                            onTap={() =>
                                setSelectedTextId(textObj.id)
                            }
                            ref={
                                selectedTextId === textObj.id
                                    ? selectedNodeRef
                                    : null
                            }
                            onTransformEnd={(e) => {
                                const node = e.target;

                                const scaleX = node.scaleX();

                                setTexts(
                                    texts.map((t) =>
                                        t.id === textObj.id
                                            ? {
                                                ...t,
                                                fontSize: Math.max(
                                                    8,
                                                    t.fontSize * scaleX
                                                ),
                                            }
                                            : t
                                    )
                                );

                                node.scaleX(1);
                                node.scaleY(1);
                            }}
                        />
                    ))}
                    {(selectedId || selectedTextId) && (
                        <Transformer
                            ref={transformerRef}
                            enabledAnchors={[
                                "middle-left",
                                "middle-right",
                            ]}
                        />
                    )}
                </Layer>
            </Stage>
            {textInput && (
                <input
                    autoFocus
                    placeholder="Enter text..."
                    value={textInput.value}
                    onChange={(e) =>
                        setTextInput({
                            ...textInput,
                            value: e.target.value,
                        })
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (!textInput.value.trim()) {
                                setTextInput(null);
                                return;
                            }

                            setTexts([
                                ...texts,
                                {
                                    id: Date.now(),

                                    x: textInput.x,
                                    y: textInput.y,

                                    text: textInput.value,

                                    color,
                                    fontSize,
                                    fontFamily,

                                    isBold,
                                    isItalic,
                                    isUnderline,
                                },
                            ]);

                            setTextInput(null);
                        }
                    }}
                    className="absolute border rounded px-2 py-1 bg-white"
                    style={{
                        left: textInput.x,
                        top: textInput.y,
                    }}
                />
            )}
        </div>
    );
}

export default Canvas;