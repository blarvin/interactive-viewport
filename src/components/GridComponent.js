import React, { useCallback, useRef, useEffect } from 'react';

const GridComponent = ({ scale, position, width, height }) => {
  const GRID_SIZE = 50; // Size of one grid square in pixels
  const GRID_COLOR = "#cccccc";
  const LABEL_COLOR = "#999999";

  const canvasRef = useRef(null);

  const createGridPattern = useCallback((ctx) => {
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = GRID_SIZE;
    patternCanvas.height = GRID_SIZE;
    const patternCtx = patternCanvas.getContext("2d");

    // Draw grid lines
    patternCtx.strokeStyle = GRID_COLOR;
    patternCtx.lineWidth = 2;
    patternCtx.beginPath();
    patternCtx.moveTo(0, 0);
    patternCtx.lineTo(GRID_SIZE, 0);
    patternCtx.moveTo(0, 0);
    patternCtx.lineTo(0, GRID_SIZE);
    patternCtx.stroke();

    // Create pattern
    return ctx.createPattern(patternCanvas, "repeat");
  }, []);

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(-position.x, -position.y);

    // Fill with grid pattern
    const pattern = createGridPattern(ctx);
    ctx.fillStyle = pattern;
    ctx.fillRect(position.x, position.y, width / scale, height / scale);

    // Draw labels
    ctx.fillStyle = LABEL_COLOR;
    const fontSize = Math.max(10, Math.min(14, 12 / scale));
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const startX = Math.floor(position.x / GRID_SIZE);
    const startY = Math.floor(position.y / GRID_SIZE);
    const endX = Math.ceil((position.x + width / scale) / GRID_SIZE);
    const endY = Math.ceil((position.y + height / scale) / GRID_SIZE);

    for (let x = startX; x < endX; x++) {
      for (let y = startY; y < endY; y++) {
        const centerX = x * GRID_SIZE + GRID_SIZE / 2;
        const centerY = y * GRID_SIZE + GRID_SIZE / 2;

        // Only draw label if it will be large enough to be legible
        if (fontSize * scale >= 6) {
          ctx.fillText(`${x},${y}`, centerX, centerY);
        }
      }
    }

    ctx.restore();
  }, [scale, position, width, height, createGridPattern]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  return (
    <canvas
      ref={canvasRef}
      className="viewport-canvas"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default GridComponent;
