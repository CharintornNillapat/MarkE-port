import { ImageResponse } from "next/og";
import { identity } from "@/content/site";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: the logo's first letter (M), generated at build. An image can't read CSS variables, so these are the
// DESIGN.MD §2 token values hard-coded: --bg #09090b, --text #f4f4f5.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: "#09090b",
          color: "#f4f4f5",
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: -0.5,
        }}
      >
        {identity.logo[0]}
      </div>
    ),
    size,
  );
}
