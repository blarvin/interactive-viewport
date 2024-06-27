// src/data/defaultData.js

export const defaultKollection = {
  uuid: "default-kollection-uuid",
  name: "My First Kollection",
  description: "This is your default kollection",
  createdAt: new Date().toISOString(),
};

export const defaultKards = [
  {
    uuid: "kard-1-uuid",
    kollectionUUID: "default-kollection-uuid",
    title: "Welcome to Your Pinterest Clone",
    text: "This is your first kard. You can edit or delete it, or add new kards to your kollection.",
    image: "https://via.placeholder.com/300x200?text=Welcome",
    x: 100,
    y: 100,
    z: 0,
    createdAt: new Date().toISOString(),
  },
  {
    uuid: "kard-2-uuid",
    kollectionUUID: "default-kollection-uuid",
    title: "How to Use",
    text: "Click and drag to move kards around. Use the mouse wheel to zoom in and out.",
    image: "https://via.placeholder.com/300x200?text=How+to+Use",
    x: 450,
    y: 100,
    z: 1,
    createdAt: new Date().toISOString(),
  },
  {
    uuid: "kard-3-uuid",
    kollectionUUID: "default-kollection-uuid",
    title: "Start Creating",
    text: "Add your own kards and kollections to personalize your space.",
    image: "https://via.placeholder.com/300x200?text=Start+Creating",
    x: 100,
    y: 400,
    z: 2,
    createdAt: new Date().toISOString(),
  },
];
