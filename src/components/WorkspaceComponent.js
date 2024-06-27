// src/components/WorkspaceComponent.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import GridComponent from "./GridComponent";
import KardRenderer from "./KardRenderer";
import useKards from "../hooks/useKards";
import { useKollection } from '../contexts/KollectionContext';

const WorkspaceComponent = () => {
  const { activeKollectionUUID } = useKollection();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const { kards, loadKards } = useKards(activeKollectionUUID);

  useEffect(() => {
    if (activeKollectionUUID) {
      loadKards(activeKollectionUUID);
    }
  }, [activeKollectionUUID, loadKards]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const zoom = useCallback((clientX, clientY, factor) => {
    setScale(prevScale => {
      const newScale = Math.max(0.1, Math.min(prevScale * factor, 5));
      const containerRect = containerRef.current.getBoundingClientRect();

      const zoomX = (clientX - containerRect.left) / prevScale + position.x;
      const zoomY = (clientY - containerRect.top) / prevScale + position.y;

      const newX = zoomX - (clientX - containerRect.left) / newScale;
      const newY = zoomY - (clientY - containerRect.top) / newScale;

      setPosition({ x: newX, y: newY });
      return newScale;
    });
  }, [position.x, position.y]);

  useEffect(() => {
    const container = containerRef.current;

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

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scale, zoom]);

  return (
    <div className="interactive-viewport">
      <div ref={containerRef} className="viewport-container">
        <GridComponent 
          scale={scale} 
          position={position} 
          width={dimensions.width} 
          height={dimensions.height}
        />
        {kards.map(kard => (
          <KardRenderer 
            key={kard.uuid}
            kard={kard}
            scale={scale}
            position={position}
          />
        ))}
        <div className="viewport-info">
          Scale: {scale.toFixed(2)}x | X: {position.x.toFixed(0)} Y: {position.y.toFixed(0)}
          <br />
          Active Kollection: {activeKollectionUUID}
          <br />
          Number of Kards: {kards.length}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceComponent;
