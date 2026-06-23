import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Arrow, RegularPolygon, Transformer, Text, } from "react-konva";
import useWhiteboardStore from "../store/useWhiteboardStore";

function Canvas({ roomId }) {
    const containerRef = useRef();
    const [size, setSize] = useState({
        width: 0,
        height: 0,
    });
    const { tool, color, brushSize, fontSize, fontFamily, isBold, isItalic, isUnderline, setTool, } = useWhiteboardStore();
    const [lines, setLines] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [startPos, setStartPos] = useState(null);
    const [previewShape, setPreviewShape] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const transformerRef = useRef();
    const selectedNodeRef = useRef();
    const [texts, setTexts] = useState([]);
    const [selectedTextId, setSelectedTextId] = useState(null);
    const [textInput, setTextInput] = useState(null);
    const { deleteSelected, setDeleteSelected, setHasSelection, setRedo, setUndo, setSaveBoard } = useWhiteboardStore();
    const [isLoaded, setIsLoaded] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const stageRef = useRef();
    const undo = () => {
        if (historyIndex <= 0) return;

        const newIndex = historyIndex - 1;

        setHistoryIndex(newIndex);

        setLines(history[newIndex].lines);
        setShapes(history[newIndex].shapes);
        setTexts(history[newIndex].texts);
    };

    const redo = () => {
        if (historyIndex >= history.length - 1)
            return;

        const next =
            history[historyIndex + 1];

        setLines(next.lines);
        setShapes(next.shapes);
        setTexts(next.texts);

        setHistoryIndex(historyIndex + 1);
    };

    useEffect(() => {
        setUndo(undo);
        setRedo(redo);
    }, [historyIndex]);

    useEffect(() => {
        const savedLines =
            JSON.parse(
                localStorage.getItem(
                    `whiteboardLines-${roomId}`
                )
            ) || [];

        const savedShapes =
            JSON.parse(
                localStorage.getItem(
                    `whiteboardShapes-${roomId}`
                )
            ) || [];

        const savedTexts =
            JSON.parse(
                localStorage.getItem(
                    `whiteboardTexts-${roomId}`
                )
            ) || [];

        setLines(savedLines);
        setShapes(savedShapes);
        setTexts(savedTexts);
        const initialSnapshot = {
            lines: savedLines,
            shapes: savedShapes,
            texts: savedTexts,
        };

        setHistory([initialSnapshot]);
        setHistoryIndex(0);

        setIsLoaded(true);
    }, [roomId]);

    useEffect(() => {
        if (!isLoaded) return;

        localStorage.setItem(
            `whiteboardLines-${roomId}`,
            JSON.stringify(lines)
        );

        localStorage.setItem(
            `whiteboardShapes-${roomId}`,
            JSON.stringify(shapes)
        );

        localStorage.setItem(
            `whiteboardTexts-${roomId}`,
            JSON.stringify(texts)
        );
    }, [lines, shapes, texts, isLoaded, roomId]);

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

    useEffect(() => {
        setDeleteSelected(handleDeleteSelected);
    }, [
        selectedId,
        selectedTextId,
        shapes,
        texts,
    ]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Delete") {
                deleteSelected();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
    }, [deleteSelected]);

    const saveBoard = () => {

        const oldShape = selectedId;
        const oldText = selectedTextId;

        setSelectedId(null);
        setSelectedTextId(null);

        setTimeout(() => {

            const uri =
                stageRef.current.toDataURL({
                    pixelRatio: 2,
                    mimeType: "image/jpeg",
                });

            const link =
                document.createElement("a");

            link.download =
                `DoodleDoc-${Date.now()}.jpeg`;

            link.href = uri;

            link.click();

            setSelectedId(oldShape);
            setSelectedTextId(oldText);

        }, 100);
    };

    useEffect(() => {
        setSaveBoard(saveBoard);
    }, []);

    const saveToHistory = (
        newLines = lines,
        newShapes = shapes,
        newTexts = texts
    ) => {
        const snapshot = {
            lines: JSON.parse(JSON.stringify(newLines)),
            shapes: JSON.parse(JSON.stringify(newShapes)),
            texts: JSON.parse(JSON.stringify(newTexts)),
        };

        const newHistory =
            history.slice(0, historyIndex + 1);

        newHistory.push(snapshot);

        setHistory(newHistory);

        setHistoryIndex(
            newHistory.length - 1
        );
    };

    const handleDeleteSelected = () => {

        saveToHistory(lines, shapes, texts);
        const updatedShapes =
            shapes.filter(
                shape => shape.id !== selectedId
            );


        const updatedTexts =
            texts.filter(
                text => text.id !== selectedTextId
            );
        setShapes(updatedShapes);
        setTexts(updatedTexts);
        setSelectedId(null);
        setSelectedTextId(null);
        setHasSelection(false);
    };

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
            saveToHistory(lines, shapes, texts);
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
            tool === "pen" ||
            tool === "eraser"
        ) {
            saveToHistory(
                lines,
                shapes,
                texts
            );
        }
        if (
            previewShape &&
            !["pen", "eraser"].includes(tool)
        ) {
            const newShape = {
                id: Date.now(),
                ...previewShape,
            };

            saveToHistory(
                lines,
                shapes,
                texts
            );

            const updatedShapes = [
                ...shapes,
                newShape,
            ];

            setShapes(updatedShapes);
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
                ref={stageRef}
                width={size.width}
                height={size.height}
                onMouseDown={(e) => {
                    if (e.target === e.target.getStage()) {
                        setSelectedId(null);
                        setSelectedTextId(null);
                        setHasSelection(false);
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
                            stroke={line.color}
                            strokeWidth={
                                line.tool === "eraser"
                                    ? 20
                                    : line.brushSize
                            }
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={
                                line.tool === "eraser"
                                    ? "destination-out"
                                    : "source-over"
                            }
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
                                    onClick={() => {
                                        setSelectedId(shape.id);
                                        setHasSelection(true);
                                    }}
                                    onTap={() => setSelectedId(shape.id)}
                                    onDragEnd={(e) => {
                                        saveToHistory(lines, shapes, texts);
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
                                    onClick={() => {
                                        setSelectedId(shape.id);
                                        setHasSelection(true);
                                    }}
                                    onTap={() => setSelectedId(shape.id)}
                                    onDragEnd={(e) => {
                                        saveToHistory(lines, shapes, texts);
                                        updateShapePosition(
                                            shape.id,
                                            e.target.x(),
                                            e.target.y()
                                        )
                                    }}
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
                                    onClick={() => {
                                        setSelectedId(shape.id);
                                        setHasSelection(true);
                                    }}
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
                                    onClick={() => {
                                        setSelectedId(shape.id);
                                        setHasSelection(true);
                                    }}
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
                                    onClick={() => {
                                        setSelectedId(shape.id);
                                        setHasSelection(true);
                                    }}
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
                                saveToHistory(lines, shapes, texts);
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
                            onClick={() => {
                                setSelectedTextId(textObj.id);
                                setHasSelection(true);
                            }}
                            onTap={() =>
                                setSelectedTextId(textObj.id)
                            }
                            ref={
                                selectedTextId === textObj.id
                                    ? selectedNodeRef
                                    : null
                            }
                            onTransformEnd={(e) => {
                                saveToHistory(lines, shapes, texts);
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
                                setTool("pen");
                                return;
                            }
                            const newText = {
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
                            };

                            const updatedTexts = [
                                ...texts,
                                newText,
                            ];

                            setTexts(updatedTexts);

                            saveToHistory(
                                lines,
                                shapes,
                                updatedTexts
                            );

                            setTextInput(null);

                            setTool("pen");
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