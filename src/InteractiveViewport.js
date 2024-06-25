import React, { useState, useRef, useEffect, useMemo } from 'react';

const InteractiveViewport = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const lastTouchRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const fixedCircles = useMemo(() => {
    const circles = [];
    for (let i = 0; i < 200; i++) {
      const size = Math.random() * 80 + 20;
      const x = Math.random() * 4000;
      const y = Math.random() * 4000;
      const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
      circles.push({ size, x, y, color });
    }
    return circles;
  }, []);

  const zoom = (clientX, clientY, factor) => {
    setScale(prevScale => {
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
  };

  useEffect(() => {
    const container = containerRef.current;

    const handleTouchStart = (e) => {
      e.preventDefault();
      lastTouchRef.current = e.touches;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches;
      
      if (lastTouchRef.current && lastTouchRef.current.length === touch.length) {
        if (touch.length === 1) {
          // Pan
          const deltaX = (touch[0].clientX - lastTouchRef.current[0].clientX) / scale;
          const deltaY = (touch[0].clientY - lastTouchRef.current[0].clientY) / scale;
          setPosition(prev => ({
            x: prev.x - deltaX,
            y: prev.y - deltaY,
          }));
        } else if (touch.length === 2) {
          // Zoom
          const prevDist = getDistance(lastTouchRef.current[0], lastTouchRef.current[1]);
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
        setPosition(prev => ({
          x: prev.x - deltaX,
          y: prev.y - deltaY,
        }));
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [scale, position]);

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
    <div className="relative w-full h-[400px] overflow-hidden border-2 border-gray-300 rounded-lg">
      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden touch-none cursor-move"
        style={{ backgroundColor: '#f0f0f0' }}
      >
        <div
          ref={contentRef}
          style={{
            transform: `scale(${scale}) translate(${-position.x}px, ${-position.y}px)`,
            transformOrigin: '0 0',
            width: '4000px',
            height: '4000px',
            position: 'relative',
            backgroundColor: 'white',
          }}
        >
          {fixedCircles.map((circle, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${circle.x}px`,
                top: `${circle.y}px`,
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                backgroundColor: circle.color,
                borderRadius: '50%',
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow">
        Scale: {scale.toFixed(2)}x | X: {position.x.toFixed(0)} Y: {position.y.toFixed(0)}
      </div>
    </div>
  );
};

export default InteractiveViewport;