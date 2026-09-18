import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#07090F",
        color: "#F4F5FA",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 4,
          color: "#AAB0C3",
        }}
      >
        <span>TAHA.</span>
        <span>{site.statusLine}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 128,
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: -6,
        }}
      >
        <span>I BUILD</span>
        <span style={{ color: "#FF6B3D" }}>DIGITAL</span>
        <span>EXPERIENCES</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          color: "#AAB0C3",
        }}
      >
        <span>{site.name}</span>
        <span>{site.role}</span>
      </div>
    </div>,
    size,
  );
}
