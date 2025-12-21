"use client";

import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";
import config from "@/config";

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  return (
    <Puck
      config={config}
      data={data}
      viewports={[
        { width: 750, height: "auto", label: ">40rem (750px)", icon: "Smartphone" },
        { width: 900, height: "auto", label: ">48rem (900px)", icon: "Tablet" },
        { width: 1200, height: "auto", label: ">64rem (1200px)", icon: "Monitor" },
        { width: 1440, height: "auto", label: ">80rem (1440px)", icon: "Monitor" },
        { width: 1680, height: "auto", label: ">96rem (1680px)", icon: "Monitor" },
      ]}
      onPublish={async (data) => {
        await fetch("/puck/api", {
          method: "post",
          body: JSON.stringify({ data, path }),
        });
      }}
    />
  );
}
