export const ToolType = {
  cursor: "cursor",
  edge: "edge",
  component: "component",
} as const;

export type ToolType = (typeof ToolType)[keyof typeof ToolType];

export const initialNodes = [
  { id: "1", position: { x: 100, y: 100 }, data: { label: "1" } },
  { id: "2", position: { x: 100, y: 200 }, data: { label: "2" } },
  { id: "3", position: { x: 100, y: 300 }, data: { label: "3" }, type: "text" },
];

export const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
