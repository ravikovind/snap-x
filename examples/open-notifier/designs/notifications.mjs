import fs from "fs/promises";
import { fileURLToPath } from "url";

// Resolve assets relative to THIS file (not the cwd), so `snap-x render` works from anywhere.
const asset = async (rel, mime) =>
  `data:${mime};base64,${(await fs.readFile(fileURLToPath(new URL(rel, import.meta.url)))).toString("base64")}`;

export const FORMAT = { width: 1080, height: 1350, name: "notifications.png" };
export const FONTS = [
  { family: "Saira", weights: [400, 700, 900] },
  { family: "JetBrains Mono", weights: [400, 700] },
];

const GREEN = "#0b9444";
const GREEN_HI = "#10b981";
const INK = "#f5f5f5";
const MUTED = "rgba(255,255,255,0.55)";
const CARD = "#141414";
const BORDER = "rgba(11,148,68,0.28)";

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);
const mono = (text, style) => txt(text, { fontFamily: "JetBrains Mono", ...style });

const wordmark = (size, icon) => box({ alignItems: "center", gap: 18 }, [
  box({ width: size * 3.4, height: size * 3.4, borderRadius: 999, border: `2px solid rgba(11,148,68,0.55)`, overflow: "hidden" }, [
    { type: "img", props: { src: icon, width: size * 3.4 - 4, height: size * 3.4 - 4, style: { display: "flex" } } },
  ]),
  box({ flexDirection: "column", gap: 2 }, [
    txt("Open Notifier", { fontSize: size, fontWeight: 900, letterSpacing: "-0.02em", color: INK }),
    txt("open-notifier.io", { fontSize: 17, color: MUTED, letterSpacing: "0.04em" }),
  ]),
]);

const toast = (channel, title, body, when, hot) => box({ alignItems: "center", gap: 22, padding: "18px 28px", background: CARD, borderRadius: 20, border: `1px solid ${hot ? GREEN : BORDER}` }, [
  box({ width: 58, height: 58, borderRadius: 14, background: hot ? GREEN : "rgba(11,148,68,0.16)", alignItems: "center", justifyContent: "center" }, [
    txt(channel[0], { fontSize: 32, fontWeight: 900, color: hot ? "#fff" : GREEN_HI }),
  ]),
  box({ flexDirection: "column", gap: 4, flex: 1 }, [
    mono(channel.toUpperCase(), { fontSize: 15, fontWeight: 700, color: GREEN_HI, letterSpacing: "0.12em" }),
    txt(title, { fontSize: 32, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }),
    txt(body, { fontSize: 22, color: MUTED }),
  ]),
  mono(when, { fontSize: 16, color: MUTED }),
]);

const stat = (value, label) => box({ flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }, [
  txt(value, { fontSize: 46, fontWeight: 900, color: GREEN_HI, letterSpacing: "-0.03em" }),
  txt(label, { fontSize: 15, fontWeight: 700, color: MUTED, letterSpacing: "0.14em" }),
]);

export default async function () {
  const icon = await asset("../assets/icon.png", "image/png");
  return box({ width: 1080, height: 1350, background: "#000", fontFamily: "Saira", position: "relative", overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "76px 80px 64px" }, [
    box({ position: "absolute", top: -300, right: -320, width: 1100, height: 1100, background: "radial-gradient(circle, rgba(11,148,68,0.26) 0%, rgba(11,148,68,0) 62%)" }),
    box({ position: "absolute", left: 0, top: 0, right: 0, height: 6, background: GREEN }),

    box({ alignItems: "center", justifyContent: "space-between" }, [
      wordmark(32, icon),
    ]),

    box({ flexDirection: "column" }, [
      txt("Your agents work.", { fontSize: 92, fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.045em", color: INK, whiteSpace: "nowrap" }),
      txt("You stay informed.", { fontSize: 92, fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.045em", color: GREEN_HI, whiteSpace: "nowrap" }),
    ]),

    box({ flexDirection: "column", gap: 16 }, [
      toast("Push", "Review done", "3 issues found in PR #482", "now", true),
      toast("Telegram", "Deploy finished", "prod · v2.4.1 · 0 errors", "2s"),
      toast("WhatsApp", "Backup complete", "14.2 GB uploaded in 3 min", "9s"),
      toast("Claude", "Agent needs you", "Approve the schema migration?", "14s"),
    ]),

    box({ flexDirection: "column", gap: 30 }, [
      box({ padding: "26px 0", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }, [
        stat("< 200 ms", "AVG DELIVERY"), stat("90 days", "HISTORY"), stat("Free", "FOREVER ON PUSH"),
      ]),
      box({ alignItems: "center", justifyContent: "space-between" }, [
        mono("$ curl api.open-notifier.io", { fontSize: 20, color: INK }),
        txt("Built by Workrush", { fontSize: 18, color: MUTED }),
      ]),
    ]),
  ]);
}
