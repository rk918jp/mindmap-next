import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Add, Check, Delete, Redo, Undo } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  List,
  ListItemButton,
  ListSubheader,
  Paper,
  Toolbar,
} from "@mui/material";
import { SVG } from "@svgdotjs/svg.js";
import { Resizable } from "re-resizable";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
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
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { TextNode } from "@/components/mindmap/nodes/TextNode";
import { MindmapToolbar } from "@/components/mindmap/toolbar";
import { ToolbarVariant } from "@/consts/app";
import { initialEdges, initialNodes, ToolType } from "@/consts/mindmap";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  addPage,
  pagesSelector,
  selectPage,
  updatePage,
} from "@/store/mindmap";

const nodeTypes = {
  text: TextNode,
};
export default function Home() {
  const dispatch = useAppDispatch();
  // canvas
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState<boolean>(false);

  const pages = useAppSelector((state) => pagesSelector.selectAll(state));
  const activeTool = useAppSelector((state) => state.mindmap.activeTool);
  const selectedPageId = useAppSelector(
    (state) => state.mindmap.selectedPageId,
  );
  const selectedPage = useAppSelector((state) =>
    selectedPageId
      ? pagesSelector.selectById(state, selectedPageId)
      : undefined,
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeChange = (id: Node["id"], data: any) => {
    setNodes((nodes) => {
      const index = nodes.findIndex((node) => node.id === id);
      const newNodes = [...nodes];
      newNodes[index].data = {
        ...newNodes[index].data,
        ...data,
      };
      return newNodes;
    });
  };

  useEffect(() => {
    if (selectedPage) {
      // 各Nodeにハンドラを登録
      setNodes(
        selectedPage.nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onChange: handleNodeChange,
          },
        })),
      );
      setEdges(selectedPage.edges);
    }
  }, [selectedPage]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [],
  );

  // react-flowのstateをreduxに反映
  const applyState = useCallback(() => {
    if (selectedPageId) {
      dispatch(
        updatePage({
          id: selectedPageId,
          changes: {
            nodes,
            edges,
          },
        }),
      );
    }
  }, [nodes, edges, selectedPageId]);

  return (
    <ReactFlowProvider>
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
            <List
              sx={{ mt: 2 }}
              subheader={
                <ListSubheader
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  Pages
                  <Box>
                    <IconButton
                      size={"small"}
                      onClick={() => {
                        dispatch(addPage());
                      }}
                    >
                      <Add fontSize={"inherit"} />
                    </IconButton>
                  </Box>
                </ListSubheader>
              }
              dense
            >
              {pages.map((page) => (
                <ListItemButton
                  key={page.id}
                  selected={page.id === selectedPageId}
                  onClick={() => {
                    applyState();
                    dispatch(selectPage(page.id));
                  }}
                >
                  {page.name}
                </ListItemButton>
              ))}
            </List>
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
              <MindmapToolbar
                onAddNode={(type) => {
                  setNodes((nodes) => [
                    ...nodes,
                    {
                      id: crypto.randomUUID(),
                      type,
                      position: {
                        x: 250,
                        y: 250,
                      },
                      data: {
                        label: "Text",
                        onChange: handleNodeChange,
                      },
                    },
                  ]);
                }}
              />
            </Box>
          </Panel>
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={10} size={1} />
          {activeTool === ToolType.sketch && (
            <ReactSketchCanvas
              ref={canvasRef}
              style={{
                position: "absolute",
                zIndex: 4,
              }}
              canvasColor={"transparent"}
              width={"100%"}
              height={"100%"}
            />
          )}
          {activeTool === ToolType.sketch && (
            <Panel position={"bottom-center"}>
              <Paper>
                <ButtonGroup color={"inherit"}>
                  <Button
                    onClick={() => {
                      canvasRef.current?.undo();
                    }}
                  >
                    <Undo />
                  </Button>
                  <Button
                    onClick={() => {
                      canvasRef.current?.redo();
                    }}
                  >
                    <Redo />
                  </Button>
                  <Button
                    onClick={() => {
                      canvasRef.current?.clearCanvas();
                    }}
                  >
                    <Delete />
                  </Button>
                  <Button
                    onClick={() => {
                      canvasRef.current?.eraseMode(!eraseMode);
                      setEraseMode(!eraseMode);
                    }}
                  >
                    <Icon icon={"mdi:eraser"} fontSize={24} />
                  </Button>
                  <Button
                    onClick={async () => {
                      const svgStr = await canvasRef.current?.exportSvg();
                      if (svgStr) {
                        const draw = SVG(svgStr);
                        // TODO: svgのトリミング(各子要素のbboxの最小最大を抜き出して、SVG全体のviewboxを設定)
                        // TODO: SVGNodeの追加
                      }
                    }}
                  >
                    <Check />
                  </Button>
                </ButtonGroup>
              </Paper>
            </Panel>
          )}
        </ReactFlow>
      </Box>
    </ReactFlowProvider>
  );
}
