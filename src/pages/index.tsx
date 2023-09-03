import {
  Box,
  Toolbar,
} from "@mui/material";
import { Resizable } from "re-resizable";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { MindmapToolbar } from "@/components/mindmap/toolbar";
import { ToolbarVariant } from "@/consts/app";
import { initialEdges, initialNodes } from "@/consts/mindmap";

export default function Home() {
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, _setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex" }}>
      <Resizable
        defaultSize={{
          width: 300,
          height: "calc(100vh -  5px)",
        }}
        enable={{
          right: true
        }}
      >
        <Box sx={{
          width: "100%",
          height: "100%",
          borderRight: 1,
          borderColor: "divider",
        }}>
          <Toolbar variant={ToolbarVariant}/>
        </Box>
      </Resizable>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
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
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </Box>
  );
}
