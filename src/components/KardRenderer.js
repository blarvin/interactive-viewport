// src/components/KardRenderer.js
import React from 'react';
import useKardActions from '../hooks/useKardActions';

const KardRenderer = ({ kard, scale, position }) => {
  const { updateKard, deleteKard } = useKardActions();

  const style = {
    position: 'absolute',
    left: (kard.x - position.x) * scale,
    top: (kard.y - position.y) * scale,
    transform: `scale(${scale})`,
    // Add more styling as needed
  };

  const handleUpdate = () => {
    // Implement update logic
    const updatedKard = { ...kard, title: "Updated Title" };
    updateKard(updatedKard);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this kard?')) {
      deleteKard(kard.uuid);
    }
  };

  return (
    <div className="kard" style={style}>
      <img src={kard.image} alt={kard.title} />
      <h3>{kard.title}</h3>
      <p>{kard.text}</p>
      <button onClick={handleUpdate}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default KardRenderer;
