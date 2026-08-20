"use client";

import NextTopLoader from "nextjs-toploader";

export function TopProgressBar() {
  return (
    <NextTopLoader
      color="#00f0ff"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 15px rgba(0, 240, 255, 0.5)"
      zIndex={1001}
    />
  );
}
