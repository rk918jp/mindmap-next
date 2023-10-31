import { FC } from "react";
import { Icon } from "@iconify/react";
import {
  AppBar,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from "@mui/material";
import { toPng } from "html-to-image";
import * as jspdf from "jspdf";
import { getRectOfNodes, getTransformForBounds, useReactFlow } from "reactflow";
import { SelectComponentButton } from "@/components/mindmap/toolbar/SelectComponentButton";
import { ToolbarVariant } from "@/consts/app";
import { ToolType } from "@/consts/mindmap";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { changeActiveTool } from "@/store/mindmap";

export const MindmapToolbar: FC<{
  onAddNode: (type: string) => void;
}> = ({ onAddNode }) => {
  const dispatch = useAppDispatch();
  const reactFlowInstance = useReactFlow();
  const activeTool = useAppSelector((state) => state.mindmap.activeTool);
  return (
    <AppBar color={"inherit"}>
      <Toolbar
        variant={ToolbarVariant}
        sx={{ justifyContent: "space-between" }}
      >
        <ToggleButtonGroup
          value={activeTool}
          exclusive
          onChange={(_, value) => dispatch(changeActiveTool(value))}
          sx={{
            height: 48,
            borderRadius: 0,
            "& .MuiToggleButton-root": {
              minWidth: 48,
              borderRadius: 0,
              px: 1,
            },
          }}
        >
          <ToggleButton value={ToolType.cursor}>
            <Icon icon={"iconamoon:cursor-fill"} style={{ fontSize: 24 }} />
          </ToggleButton>
          <ToggleButton value={ToolType.edge}>
            <Icon icon={"ph:flow-arrow-fill"} style={{ fontSize: 24 }} />
          </ToggleButton>
          <SelectComponentButton onAddNode={onAddNode} />
          <ToggleButton value={ToolType.sketch}>
            <Icon icon={"mdi:draw"} style={{ fontSize: 24 }} />
          </ToggleButton>
        </ToggleButtonGroup>
        <Button
          onClick={async () => {
            reactFlowInstance.fitView();
            const imageWidth = 1920;
            const imageHeight = 1080;
            const nodesBounds = getRectOfNodes(reactFlowInstance.getNodes());
            const [transformX, transformY, scale] = getTransformForBounds(
              nodesBounds,
              imageWidth,
              imageHeight,
              0.5,
              2,
            );

            const image = await toPng(
              document.querySelector(".react-flow__viewport") as HTMLElement,
              {
                backgroundColor: "#fff",
                width: imageWidth,
                height: imageHeight,
                style: {
                  width: String(imageWidth),
                  height: String(imageHeight),
                  transform: `translate(${transformX}px, ${transformY}px) scale(${scale})`,
                },
              },
            );
            const pdf = new jspdf.jsPDF({
              orientation: "landscape",
              unit: "px",
              format: [imageWidth, imageHeight],
            });
            pdf.addImage(image, "PNG", 0, 0, imageWidth, imageHeight);
            pdf.save("flow.pdf");
          }}
        >
          Export
        </Button>
      </Toolbar>
    </AppBar>
  );
};
