export const FORMAT = { width: 1200, height: 630, name: "og.png" };
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

const wordmark = (size) => box({ alignItems: "center", gap: 10, fontSize: size, fontWeight: 900, letterSpacing: "-0.02em" }, [
  box({ width: size * 0.36, height: size * 0.36, borderRadius: 999, background: GREEN }),
  box({}, [txt("open", { color: INK }), txt("notifier", { color: GREEN_HI })]),
]);

const chip = (label) => txt(label, { padding: "6px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, color: GREEN_HI, fontSize: 14, fontWeight: 700, letterSpacing: "0.06em" });

export default function () {
  return box({ width: 1200, height: 630, background: "#000", fontFamily: "Saira", position: "relative", overflow: "hidden", flexDirection: "column", justifyContent: "space-between", padding: "52px 64px 56px" }, [
    box({ position: "absolute", top: -260, right: -180, width: 820, height: 820, background: "radial-gradient(circle, rgba(11,148,68,0.28) 0%, rgba(11,148,68,0) 62%)" }),
    box({ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: GREEN }),

    box({ alignItems: "center", justifyContent: "space-between" }, [
      wordmark(30),
      txt("open-notifier.io", { fontSize: 16, color: MUTED, letterSpacing: "0.04em" }),
    ]),

    box({ flexDirection: "column" }, [
      txt("Your agents work.", { fontSize: 100, fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.045em", color: INK, whiteSpace: "nowrap" }),
      txt("You stay informed.", { fontSize: 100, fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.045em", color: GREEN_HI, whiteSpace: "nowrap" }),
    ]),

    box({ alignItems: "flex-end", justifyContent: "space-between", gap: 40 }, [
      box({ flexDirection: "column", gap: 22, width: 470 }, [
        txt("Push, Telegram, WhatsApp and email from one simple API. Built for developers and AI agents.", { fontSize: 22, lineHeight: 1.4, color: MUTED, flexWrap: "wrap" }),
        box({ gap: 10 }, [chip("MCP-NATIVE"), chip("< 200 MS"), chip("FREE TO START")]),
      ]),
      box({ flexDirection: "column", width: 560, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }, [
        box({ flexDirection: "column", gap: 5, padding: "18px 22px", fontSize: 14 }, [
          mono("$ curl -X POST api.open-notifier.io/api/v1/notifications", { color: INK, fontWeight: 700 }),
          mono('    -H "X-Api-Key: onk_••••••••"', { color: MUTED }),
          mono(`    -d '{"title":"Review done","body":"3 issues"}'`, { color: MUTED }),
        ]),
        box({ alignItems: "center", justifyContent: "space-between", padding: "12px 22px", background: "rgba(11,148,68,0.14)", borderTop: `1px solid ${BORDER}` }, [
          box({ alignItems: "center", gap: 10 }, [
            box({ width: 9, height: 9, borderRadius: 999, background: GREEN_HI }),
            mono("delivered · push", { fontSize: 14, color: GREEN_HI, fontWeight: 700 }),
          ]),
          mono("142 ms", { fontSize: 14, color: INK, fontWeight: 700 }),
        ]),
      ]),
    ]),
  ]);
}
