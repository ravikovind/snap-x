import fs from "fs/promises";
import { fileURLToPath } from "url";

export const FORMAT = { width: 1200, height: 630, name: "grihahomes-og.png" };
export const FONTS = [
  { family: "Lato", weights: [400, 700] },
  { family: "Playfair Display", weights: [700] },
];

const colors = {
  green: "#1B4D1C",
  green2: "#2D6A2E",
  gold: "#C5A930",
  cream: "#F5F1E3",
  ink: "#18351B",
  muted: "#466249",
};

export default async function () {
  const logo = `data:image/png;base64,${(await fs.readFile(fileURLToPath(new URL("../assets/logo.png", import.meta.url)))).toString("base64")}`;
  const propertyPhoto = `data:image/jpeg;base64,${(await fs.readFile(fileURLToPath(new URL("../assets/property-reference.jpg", import.meta.url)))).toString("base64")}`;
  return {
    type: "div",
    props: {
      style: {
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "row",
        position: "relative",
        overflow: "hidden",
        background: colors.cream,
        fontFamily: "Lato",
      },
      children: [
        {
          type: "div",
          props: {
            style: { width: 720, height: 630, display: "flex", flexDirection: "column", justifyContent: "center", padding: "52px 0 52px 76px", boxSizing: "border-box" },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 36 },
                  children: [
                    { type: "img", props: { src: logo, width: 54, height: 54, style: { display: "flex", borderRadius: 8 } } },
                    { type: "div", props: { style: { display: "flex", fontSize: 26, lineHeight: 1, fontWeight: 700, color: colors.green }, children: ["GrihaHomes"] } },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", color: colors.ink, fontFamily: "Playfair Display", fontWeight: 700, fontSize: 58, lineHeight: 1.12, letterSpacing: -1.2 },
                  children: [
                    { type: "div", props: { style: { display: "flex", whiteSpace: "nowrap" }, children: ["Find your perfect"] } },
                    { type: "div", props: { style: { display: "flex", whiteSpace: "nowrap", color: colors.green2 }, children: ["home in Bangalore"] } },
                  ],
                },
              },
              { type: "div", props: { style: { display: "flex", marginTop: 22, maxWidth: 540, fontSize: 23, lineHeight: 1.35, color: colors.muted }, children: ["Verified properties. End-to-end support from search to move-in."] } },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "row", gap: 12, marginTop: 26 },
                  children: ["Verified Properties", "100+ Localities"].map((label) => ({
                    type: "div",
                    props: { style: { display: "flex", padding: "10px 15px", borderRadius: 20, background: "#E4EBD9", color: colors.green, fontWeight: 700, fontSize: 16 }, children: [label] },
                  })),
                },
              },
              { type: "div", props: { style: { display: "flex", marginTop: 28, color: colors.green, fontSize: 17, fontWeight: 700 }, children: ["grihahomes.com"] } },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { width: 480, height: 630, display: "flex", overflow: "hidden", background: colors.green },
            children: [
              { type: "img", props: { src: propertyPhoto, width: 480, height: 630, style: { display: "flex", width: 480, height: 630, objectFit: "cover" } } },
            ],
          },
        },
      ],
    },
  };
}
