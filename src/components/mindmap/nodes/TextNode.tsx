import { memo, useState } from "react";
import {
  Delete,
  FormatBold,
  InsertEmoticon,
  Link as LinkIcon,
  LinkOff,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  IconButton,
  InputBase,
  Paper,
  Popover,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Icon,
  InputAdornment,
  Link,
} from "@mui/material";
import {
  Handle,
  HandleType,
  NodeProps,
  NodeToolbar,
  Position,
  useNodeId,
} from "reactflow";
import { muiIconOptions } from "@/consts/icon";

export const TextNode = memo<NodeProps>(({ data, isConnectable, selected }) => {
  const nodeId = useNodeId();
  const [editing, setEditing] = useState(false);
  const [linkAnchorEl, setLinkAnchorEl] = useState<HTMLElement | null>(null);
  const [draftLink, setDraftLink] = useState<string>("");
  const [iconAnchorEl, setIconAnchorEl] = useState<HTMLElement | null>(null);
  const [draftIcon, setDraftIcon] = useState<string>("");
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
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          left: 8,
        }}
      >
        {data?.icon ? <Icon sx={{ mr: 2 }}>{draftIcon}</Icon> : null}
      </Box>
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
          {data?.formats?.includes("link") ? (
            <Link href={data?.href} target={"_blank"}>
              {data?.label}
            </Link>
          ) : (
            <>{data?.label}</>
          )}
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
            {/* ===== リンク設定 ===== */}
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
              <LinkIcon />
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
            {/* ===== アイコン設定 ===== */}
            <ToggleButton
              disableRipple
              value={"icon"}
              onClick={(e) => {
                setIconAnchorEl(e.currentTarget);
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <InsertEmoticon />
            </ToggleButton>
            <Popover
              open={Boolean(iconAnchorEl)}
              anchorEl={iconAnchorEl}
              onClose={() => {
                const hasFormatRegistered = (data.formats ?? []).includes(
                  "icon",
                );
                data?.onChange(nodeId, {
                  icon: draftIcon,
                  formats: hasFormatRegistered
                    ? data.formats
                    : [...(data.formats ?? []), "icon"],
                });
                setIconAnchorEl(null);
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
                      "icon",
                    );
                    data?.onChange(nodeId, {
                      icon: draftIcon,
                      formats: hasFormatRegistered
                        ? data.formats
                        : [...(data.formats ?? []), "icon"],
                    });
                    setIconAnchorEl(null);
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }}
              >
                <Autocomplete
                  sx={{ minWidth: 300 }}
                  onInputChange={(_, value) => {
                    setDraftIcon(value);
                  }}
                  defaultValue={data?.icon}
                  isOptionEqualToValue={(option, value) =>
                    option.code === value.code
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size={"small"}
                      variant={"outlined"}
                      value={draftLink}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <Icon>{draftIcon}</Icon>
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{ "& > span": { mr: 2, flexShrink: 0 } }}
                      {...props}
                      key={option.code}
                    >
                      <Icon>{option.code}</Icon>
                      {option.label}
                    </Box>
                  )}
                  options={muiIconOptions}
                />
                <IconButton
                  size={"small"}
                  color={"error"}
                  onClick={() => {
                    setDraftIcon("");
                    setIconAnchorEl(null);
                    data?.onChange(nodeId, {
                      icon: null,
                      formats: (data.formats ?? []).filter(
                        (v: string) => v !== "icon",
                      ),
                    });
                  }}
                >
                  <Delete fontSize={"small"} />
                </IconButton>
              </Stack>
            </Popover>
            <ToggleButton disableRipple value={"bold"}>
              <FormatBold />
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      </NodeToolbar>
      {(["source"] as HandleType[]).map((type) => {
        return [Position.Bottom, Position.Right].map((position) => (
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
      {(["target"] as HandleType[]).map((type) => {
        return [Position.Top, Position.Left].map((position) => (
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
