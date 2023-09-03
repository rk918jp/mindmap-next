import { useCallback, useEffect } from "react";
import { Box, Toolbar } from "@mui/material";
import { Resizable } from "re-resizable";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { TextNode } from "@/components/mindmap/nodes/TextNode";
import { MindmapToolbar } from "@/components/mindmap/toolbar";
import { ToolbarVariant } from "@/consts/app";
import { initialEdges, initialNodes } from "@/consts/mindmap";

const nodeTypes = {
  text: TextNode,
};
export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(
      initialNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onChange: (id: Node["id"], data: any) => {
            setNodes((nodes) => {
              const index = nodes.findIndex((node) => node.id === id);
              const newNodes = [...nodes];
              newNodes[index].data = {
                ...newNodes[index].data,
                ...data,
              };
              return newNodes;
            });
          },
        },
      })),
    );
  }, []);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [],
  );

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex" }}>
      <Resizable
        defaultSize={{
          width: 300,
          height: "calc(100vh -  5px)",
        }}
        enable={{
          right: true,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar variant={ToolbarVariant} />
        </Box>
      </Resizable>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Panel
          position={"top-left"}
          style={{
            margin: 0,
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <MindmapToolbar />
          </Box>
        </Panel>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={10} size={1} />
      </ReactFlow>
    </Box>
  );
}
