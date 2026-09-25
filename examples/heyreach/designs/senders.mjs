import fs from "fs/promises";
import { fileURLToPath } from "url";

// Resolve assets relative to THIS file (not the cwd), so `snap-x render` works from anywhere.
const asset = async (rel, mime) =>
  `data:${mime};base64,${(await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)))).toString("base64")}`;

export const FORMAT = { width: 1080, height: 1350, name: "senders.png" };
export const FONTS = [{ family: "Poppins", weights: [400, 600, 700, 800] }];

const VIOLET = "#7f81ff";
const INK = "#ffffff";
const MUTED = "rgba(255,255,255,0.62)";
const PANEL = "#181925";
const BORDER = "#31313e";
const AV = ["#7f81ff", "#3474db", "#ff6a39", "#31c48d", "#f5ce59", "#f54768"];

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

const avatar = (i, initial, size) => box({ width: size, height: size, borderRadius: 999, background: AV[i % AV.length], alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 700, color: "#0e1425" }, [initial]);

const tag = (label, color, bg) => txt(label, { padding: "5px 14px", borderRadius: 999, background: bg, color, fontSize: 15, fontWeight: 600 });

const msg = (i, name, text, label, color, bg) => box({ alignItems: "center", gap: 18, padding: "16px 22px", borderTop: `1px solid ${BORDER}` }, [
  avatar(i, name[0], 46),
  box({ flexDirection: "column", flex: 1 }, [
    txt(name, { fontSize: 20, fontWeight: 600, color: INK }),
    txt(text, { fontSize: 16, color: MUTED }),
  ]),
  tag(label, color, bg),
]);

const stat = (value, label) => box({ flexDirection: "column", alignItems: "center", flex: 1 }, [
  txt(value, { fontSize: 40, fontWeight: 800, color: INK, letterSpacing: "-0.02em" }),
  txt(label, { fontSize: 15, color: MUTED }),
]);

export default async function () {
  const logo = await asset("../assets/logo-primary-light.png", "image/png");
  const senders = ["S", "M", "A", "J", "R", "K", "L", "D", "N", "T", "E", "P"];
  return box({ width: 1080, height: 1350, background: "#07071c", fontFamily: "Poppins", position: "relative", overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "64px 80px 60px" }, [
    box({ position: "absolute", top: -320, right: -300, width: 1100, height: 1100, background: "radial-gradient(circle, rgba(127,129,255,0.34) 0%, rgba(127,129,255,0) 62%)" }),
    box({ position: "absolute", bottom: -420, left: -320, width: 900, height: 900, background: "radial-gradient(circle, rgba(245,71,104,0.15) 0%, rgba(245,71,104,0) 62%)" }),

    box({ alignItems: "center", justifyContent: "space-between" }, [
      { type: "img", props: { src: logo, width: 283, height: 54, style: { display: "flex" } } },
      txt("heyreach.io", { fontSize: 18, color: MUTED }),
    ]),

    box({ flexDirection: "column" }, [
      txt("Unlimited senders.", { fontSize: 76, fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.03em", color: INK, whiteSpace: "nowrap" }),
      txt("One fixed cost.", { fontSize: 76, fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.03em", color: VIOLET, whiteSpace: "nowrap" }),
    ]),

    box({ flexDirection: "column", alignItems: "center", gap: 0 }, [
      box({ flexDirection: "column", width: 920, padding: "22px 26px", background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 22, gap: 16 }, [
        box({ alignItems: "center", justifyContent: "space-between" }, [
          txt("LinkedIn senders", { fontSize: 20, fontWeight: 600, color: INK }),
          txt("+54 more · auto-rotate", { fontSize: 16, color: VIOLET, fontWeight: 600 }),
        ]),
        box({ gap: 14, justifyContent: "space-between" }, senders.map((s, i) => avatar(i, s, 62))),
      ]),
      box({ flexDirection: "column", alignItems: "center", height: 58, justifyContent: "center" }, [
        box({ width: 2, height: 22, background: VIOLET }),
        { type: "svg", props: { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: VIOLET, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", style: { display: "flex", marginTop: -6 }, children: [{ type: "path", props: { d: "M6 9l6 6 6-6" } }] } },
      ]),
      box({ flexDirection: "column", width: 920, background: PANEL, border: `1px solid ${VIOLET}`, borderRadius: 22, overflow: "hidden" }, [
        box({ alignItems: "center", justifyContent: "space-between", padding: "18px 26px" }, [
          txt("One unified inbox", { fontSize: 20, fontWeight: 600, color: INK }),
          txt("all senders · one place", { fontSize: 16, color: MUTED }),
        ]),
        msg(0, "Sofia R.", "That sounds great, can we talk Thursday?", "Interested", "#31c48d", "rgba(49,196,141,0.16)"),
        msg(1, "Daniel K.", "Booked the demo for next week.", "Meeting booked", "#b4c6fc", "rgba(127,129,255,0.20)"),
        msg(2, "Priya N.", "Send me pricing when you have a sec.", "Warm lead", "#ff875f", "rgba(255,106,57,0.18)"),
      ]),
    ]),

    box({ flexDirection: "column", gap: 26 }, [
      box({ padding: "22px 0", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }, [
        stat("7,000+", "companies"), stat("4.7", "rating on G2"), stat("1000+", "leads a week"),
      ]),
      box({ alignItems: "center", justifyContent: "space-between" }, [
        txt("Start building for free", { padding: "18px 34px", borderRadius: 14, background: VIOLET, color: "#0e1425", fontSize: 24, fontWeight: 700 }),
        txt("No card required", { fontSize: 18, color: MUTED }),
      ]),
    ]),
  ]);
}
