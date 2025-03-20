import React, { useState } from "react";
import { InteractiveNvlWrapper } from "@neo4j-nvl/react";
import { Node, Relationship } from "@neo4j-nvl/base";

export const App = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "0", caption: "graphs" },
    { id: "1", caption: "everywhere" },
  ]);
  const [relationships, setRelationships] = useState<Relationship[]>([
    { from: "0", to: "1", id: "10", caption: "are" },
  ]);

  return (
    <div style={{ width: "100%", height: "75vh" }}>
      <InteractiveNvlWrapper
        nvlOptions={{ initialZoom: 3 }}
        nodes={nodes}
        rels={relationships}
        mouseEventCallbacks={{
          onZoom: true,
          onPan: true,
        }}
      />
    </div>
  );
};
