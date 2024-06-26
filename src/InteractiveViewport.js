import React, {
  useState,
  useRef,
  useEffect,
  //   useMemo,
  useCallback,
} from "react";

const InteractiveViewport = () => {
  const GRID_SIZE = 100; // Size of one grid square in pixels
  const GRID_COLOR = "#cccccc";
  const LABEL_COLOR = "#999999";

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({
    x: -window.innerWidth / 2,
    y: -window.innerHeight / 2,
  });
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const lastTouchRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const createGridPattern = useCallback((ctx) => {
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = GRID_SIZE;
    patternCanvas.height = GRID_SIZE;
    const patternCtx = patternCanvas.getContext("2d");

    // Draw grid lines
    patternCtx.strokeStyle = GRID_COLOR;
    patternCtx.lineWidth = 1;
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
    const { width, height } = canvas.getBoundingClientRect();

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
    ctx.font = `${12 / scale}px Arial`;
    for (
      let x = Math.floor(position.x / GRID_SIZE);
      x < (position.x + width / scale) / GRID_SIZE;
      x++
    ) {
      for (
        let y = Math.floor(position.y / GRID_SIZE);
        y < (position.y + height / scale) / GRID_SIZE;
        y++
      ) {
        ctx.fillText(`${x},${y}`, x * GRID_SIZE + 5, y * GRID_SIZE + 15);
      }
    }

    ctx.restore();
  }, [scale, position, createGridPattern]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  const zoom = useCallback(
    (clientX, clientY, factor) => {
      setScale((prevScale) => {
        const newScale = Math.max(0.1, Math.min(prevScale * factor, 5));
        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate the position of the zoom point relative to the content
        const zoomX = (clientX - containerRect.left) / prevScale + position.x;
        const zoomY = (clientY - containerRect.top) / prevScale + position.y;

        // Calculate new position to keep the zoom point stationary
        const newX = zoomX - (clientX - containerRect.left) / newScale;
        const newY = zoomY - (clientY - containerRect.top) / newScale;

        setPosition({ x: newX, y: newY });
        return newScale;
      });
    },
    [position.x, position.y]
  ); // Only recreate if position changes

  useEffect(() => {
    const container = containerRef.current;

    const handleTouchStart = (e) => {
      e.preventDefault();
      lastTouchRef.current = e.touches;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches;

      if (
        lastTouchRef.current &&
        lastTouchRef.current.length === touch.length
      ) {
        if (touch.length === 1) {
          // Pan
          const deltaX =
            (touch[0].clientX - lastTouchRef.current[0].clientX) / scale;
          const deltaY =
            (touch[0].clientY - lastTouchRef.current[0].clientY) / scale;
          setPosition((prev) => ({
            x: prev.x - deltaX,
            y: prev.y - deltaY,
          }));
        } else if (touch.length === 2) {
          // Zoom
          const prevDist = getDistance(
            lastTouchRef.current[0],
            lastTouchRef.current[1]
          );
          const currentDist = getDistance(touch[0], touch[1]);
          const factor = currentDist / prevDist;

          const midpoint = getMidpoint(touch[0], touch[1]);
          zoom(midpoint.x, midpoint.y, factor);
        }
      }
      lastTouchRef.current = touch;
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      lastTouchRef.current = null;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const factor = Math.pow(0.999, e.deltaY);
      zoom(e.clientX, e.clientY, factor);
    };

    const handleMouseDown = (e) => {
      e.preventDefault();
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (isDraggingRef.current) {
        const deltaX = (e.clientX - lastMousePosRef.current.x) / scale;
        const deltaY = (e.clientY - lastMousePosRef.current.y) / scale;
        setPosition((prev) => ({
          x: prev.x - deltaX,
          y: prev.y - deltaY,
        }));
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scale, position, zoom]);

  const getDistance = (touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getMidpoint = (touch1, touch2) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };


  return (
    <div className="interactive-viewport">
      <div ref={containerRef} className="viewport-container">
        <canvas
          ref={canvasRef}
          className="viewport-canvas"
          style={{ width: "100%", height: "100%" }}
        />
        <div className="viewport-info">
          Scale: {scale.toFixed(2)}x | X: {position.x.toFixed(0)} Y:{" "}
          {position.y.toFixed(0)}
        </div>
      </div>
      Scale: {scale.toFixed(2)}x | X: {position.x.toFixed(0)} Y:{" "}
      {position.y.toFixed(0)}
    </div>
  );
};

export default InteractiveViewport;
