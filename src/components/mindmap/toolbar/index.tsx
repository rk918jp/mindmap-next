import { FC, useState } from "react";
import { Icon } from "@iconify/react";
import { AppBar, ToggleButton, ToggleButtonGroup, Toolbar } from "@mui/material";
import { SelectComponentButton } from "@/components/mindmap/toolbar/SelectComponentButton";
import { ToolbarVariant } from "@/consts/app";
import { ToolType } from "@/consts/mindmap";


export const MindmapToolbar: FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.cursor);
  return (
    <AppBar color={"inherit"}>
      <Toolbar variant={ToolbarVariant}>
        <ToggleButtonGroup
          value={activeTool}
          exclusive
          onChange={(_, value) => setActiveTool(value)}
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
            <Icon
              icon={"iconamoon:cursor-fill"}
              style={{ fontSize: 24 }}
            />
          </ToggleButton>
          <ToggleButton value={ToolType.edge}>
            <Icon
              icon={"ph:flow-arrow-fill"}
              style={{ fontSize: 24 }}
            />
          </ToggleButton>
          <SelectComponentButton />
        </ToggleButtonGroup>
      </Toolbar>
    </AppBar>
  )
}