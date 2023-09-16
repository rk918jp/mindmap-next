import { FC, useState } from "react";
import styled from "@emotion/styled";
import { Icon } from "@iconify/react";
import { Menu, MenuItem, ToggleButton } from "@mui/material";
import { ToolType } from "@/consts/mindmap";

const TransitionIcon = styled(Icon)`
  transition: margin-top 0.2s;
  margin-bottom: 0;
  &:hover {
    margin-top: 4px;
    margin-bottom: -4px;
    transition: margin-top 0.2s;
  }
`;

export const SelectComponentButton: FC<{
  onAddNode: (type: string) => void;
}> = ({ onAddNode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  return (
    <>
      <ToggleButton value={ToolType.component}>
        <Icon icon={"iconamoon:component-fill"} style={{ fontSize: 24 }} />
        <TransitionIcon
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget.parentElement);
          }}
          icon={"iconamoon:arrow-down-2-light"}
          style={{
            fontSize: 20,
          }}
        />
      </ToggleButton>
      <Menu
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            elevation: 2,
            sx: {
              borderRadius: 0,
              minWidth: 200,
            },
          },
        }}
        MenuListProps={{
          dense: true,
          disablePadding: true,
        }}
      >
        <MenuItem
          onClick={() => {
            onAddNode("text");
            setAnchorEl(null);
          }}
        >
          Text
        </MenuItem>
      </Menu>
    </>
  );
};
