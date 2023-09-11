import { memo, useState } from "react";
import { FormatBold, Link, LinkOff } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Popover,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Handle,
  HandleType,
  NodeProps,
  NodeToolbar,
  Position,
  useNodeId,
} from "reactflow";

export const TextNode = memo<NodeProps>(({ data, isConnectable, selected }) => {
  const nodeId = useNodeId();
  const [editing, setEditing] = useState(false);
  const [linkAnchorEl, setLinkAnchorEl] = useState<HTMLElement | null>(null);
  const [draftLink, setDraftLink] = useState<string>("");
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        minHeight: 40,
        minWidth: 150,
        maxWidth: 150,
        borderColor: "#000",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: "3px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
      }}
    >
      {editing ? (
        <Box>
          <InputBase
            fullWidth
            autoFocus
            size={"small"}
            defaultValue={data?.label ?? ""}
            inputProps={{
              style: {
                fontSize: 12,
                textAlign: "center",
                paddingBottom: 0,
                width: "100%",
              },
            }}
            onBlur={(e) => {
              data?.onChange(nodeId, { label: e.target.value });
              setEditing(false);
            }}
          />
        </Box>
      ) : (
        <Box
          onDoubleClick={() => {
            setEditing(true);
          }}
          sx={{
            width: "100%",
            minHeight: 18,
            textAlign: "center",
            fontWeight: data?.formats?.includes("bold") ? "bold" : "normal",
          }}
        >
          {data?.label}
        </Box>
      )}
      <NodeToolbar isVisible={selected} offset={8}>
        <Paper>
          <ToggleButtonGroup
            sx={{ backgroundColor: "#fff" }}
            size={"small"}
            value={data?.formats ?? []}
            onChange={(e, value) => data?.onChange(nodeId, { formats: value })}
          >
            <ToggleButton
              disableRipple
              value={"link"}
              onClick={(e) => {
                setLinkAnchorEl(e.currentTarget);
                setDraftLink(data?.href ?? "");
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Link />
            </ToggleButton>
            <Popover
              open={Boolean(linkAnchorEl)}
              anchorEl={linkAnchorEl}
              onClose={() => {
                const hasFormatRegistered = (data.formats ?? []).includes(
                  "link",
                );
                data?.onChange(nodeId, {
                  href: draftLink,
                  formats: hasFormatRegistered
                    ? data.formats
                    : [...(data.formats ?? []), "link"],
                });
                setLinkAnchorEl(null);
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Stack
                direction={"row"}
                spacing={1}
                sx={{
                  p: 1,
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    const hasFormatRegistered = (data.formats ?? []).includes(
                      "link",
                    );
                    data?.onChange(nodeId, {
                      href: draftLink,
                      formats: hasFormatRegistered
                        ? data.formats
                        : [...(data.formats ?? []), "link"],
                    });
                    setLinkAnchorEl(null);
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }}
              >
                <TextField
                  size={"small"}
                  variant={"outlined"}
                  value={draftLink}
                  onChange={(e) => {
                    setDraftLink(e.target.value);
                  }}
                  placeholder={"https://"}
                />
                <IconButton
                  size={"small"}
                  color={"error"}
                  onClick={() => {
                    setDraftLink("");
                    setLinkAnchorEl(null);
                    data?.onChange(nodeId, {
                      href: null,
                      formats: (data.formats ?? []).filter(
                        (v: string) => v !== "link",
                      ),
                    });
                  }}
                >
                  <LinkOff fontSize={"small"} />
                </IconButton>
              </Stack>
            </Popover>
            <ToggleButton disableRipple value={"bold"}>
              <FormatBold />
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </NodeToolbar>
      {(["source", "target"] as HandleType[]).map((type) => {
        return [
          Position.Top,
          Position.Bottom,
          Position.Left,
          Position.Right,
        ].map((position) => (
          <Handle
            key={`${position}-${type}`}
            id={`${position}-${type}`}
            type={type}
            position={position}
            style={{ background: "#555" }}
            isConnectable={isConnectable}
          />
        ));
      })}
    </Box>
  );
});

TextNode.displayName = "TextNode";
