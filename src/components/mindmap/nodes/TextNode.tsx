import { memo, useState } from "react";
import { Box, InputBase } from "@mui/material";
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
          }}
        >
          {data?.label}
        </Box>
      )}
      <NodeToolbar isVisible={selected}></NodeToolbar>
      {(["source", "target"] as HandleType[]).map((type) => {
        return [
          Position.Top,
          Position.Bottom,
          Position.Left,
          Position.Right,
        ].map((position) => (
          <Handle
            key={`${position}-${type}`}
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
