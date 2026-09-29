"use client";

import dynamic from "next/dynamic";

const NvlGraph = dynamic(() => import("./NvlGraph"), { ssr: false });

export default function NvlGraphClient() {
  return <NvlGraph />;
}
