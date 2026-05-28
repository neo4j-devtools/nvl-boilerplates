"use client";

import React from "react";
import dynamic from "next/dynamic";

const NvlGraph = dynamic(() => import("@/components/NvlGraph"), { ssr: false });

export default function Home() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <NvlGraph />
    </div>
  );
}
