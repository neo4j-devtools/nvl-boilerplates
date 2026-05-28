import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Neo4j NVL</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
