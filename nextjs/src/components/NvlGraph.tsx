"use client";

import { useState } from "react";
import { InteractiveNvlWrapper } from "@neo4j-nvl/react";
import type { Node, Relationship } from "@neo4j-nvl/base";

export default function NvlGraph() {
  const [nodes] = useState<Node[]>([
    { id: "0", caption: "graphs" },
    { id: "1", caption: "everywhere" },
  ]);
  const [relationships] = useState<Relationship[]>([
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
}
