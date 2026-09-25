export const FORMAT = { width: 1200, height: 630, name: "og.png" };
export const FONTS = [{ family: "Poppins", weights: [400, 600, 700, 800] }];

const VIOLET = "#7f81ff";
const INK = "#ffffff";
const MUTED = "rgba(255,255,255,0.62)";
const PANEL = "#181925";
const BORDER = "#31313e";

const box = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (text, style) => box(style, [text]);

const AV = ["#7f81ff", "#3474db", "#ff6a39", "#31c48d", "#f5ce59", "#f54768"];
const avatar = (i, initial, size = 44, overlap = true) => box({
  width: size, height: size, borderRadius: 999, background: AV[i % AV.length], border: "3px solid #0e1425",
  alignItems: "center", justifyContent: "center", marginLeft: overlap && i > 0 ? -12 : 0,
  fontSize: size * 0.4, fontWeight: 700, color: "#0e1425",
}, [initial]);

const pill = (label, color, bg) => txt(label, { padding: "5px 14px", borderRadius: 8, background: bg, color, fontSize: 15, fontWeight: 600 });

const node = (icon, title, sub, hot) => box({ alignItems: "center", gap: 16, padding: "14px 18px", background: PANEL, border: `1px solid ${hot ? VIOLET : BORDER}`, borderRadius: 14 }, [
  box({ width: 40, height: 40, borderRadius: 10, background: hot ? VIOLET : "rgba(127,129,255,0.16)", alignItems: "center", justifyContent: "center", color: hot ? "#0e1425" : VIOLET, fontSize: 18, fontWeight: 800 }, [icon]),
  box({ flexDirection: "column" }, [
    txt(title, { fontSize: 19, fontWeight: 600, color: INK }),
    txt(sub, { fontSize: 14, color: MUTED }),
  ]),
]);

const link = (label, tone) => box({ alignItems: "center", gap: 10, marginLeft: 38, height: 30 }, [
  box({ width: 2, height: 30, background: BORDER }),
  txt(label, { fontSize: 13, fontWeight: 600, padding: "3px 10px", borderRadius: 999, color: tone === "ok" ? "#31c48d" : MUTED, background: tone === "ok" ? "rgba(49,196,141,0.14)" : "rgba(255,255,255,0.06)" }),
]);

export default function () {
  return box({ width: 1200, height: 630, background: "#07071c", fontFamily: "Poppins", position: "relative", overflow: "hidden", padding: "50px 64px", justifyContent: "space-between" }, [
    box({ position: "absolute", top: -260, right: -120, width: 900, height: 900, background: "radial-gradient(circle, rgba(127,129,255,0.34) 0%, rgba(127,129,255,0) 62%)" }),
    box({ position: "absolute", bottom: -340, left: -260, width: 800, height: 800, background: "radial-gradient(circle, rgba(245,71,104,0.16) 0%, rgba(245,71,104,0) 62%)" }),

    box({ flexDirection: "column", justifyContent: "space-between", width: 540 }, [
      txt("heyreach", { fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", color: INK }),
      box({ flexDirection: "column", gap: 20 }, [
        box({ flexDirection: "column" }, [
          txt("10x your", { fontSize: 66, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.03em", color: INK, whiteSpace: "nowrap" }),
          txt("LinkedIn", { fontSize: 66, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.03em", color: INK, whiteSpace: "nowrap" }),
          txt("outbound.", { fontSize: 66, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.03em", color: VIOLET, whiteSpace: "nowrap" }),
        ]),
        txt("Unlimited senders. One fixed cost.", { fontSize: 24, fontWeight: 600, color: INK }),
      ]),
      box({ alignItems: "center", gap: 10 }, [
        pill("agencies", "#a6d3ff", "rgba(52,116,219,0.28)"),
        pill("sales teams", "#ff875f", "rgba(255,106,57,0.22)"),
        pill("GTM", "#31c48d", "rgba(49,196,141,0.20)"),
      ]),
    ]),

    box({ flexDirection: "column", justifyContent: "center", width: 480, gap: 0 }, [
      box({ alignItems: "center", justifyContent: "space-between", padding: "12px 16px", marginBottom: 22, borderRadius: 16, border: `1px solid ${VIOLET}`, background: "rgba(127,129,255,0.08)" }, [
        box({ flexDirection: "column" }, [txt("LinkedIn senders", { fontSize: 15, fontWeight: 600, color: INK }), txt("auto-rotating", { fontSize: 12, color: MUTED })]),
        box({ alignItems: "center" }, [avatar(0, "S"), avatar(1, "M"), avatar(2, "A"), avatar(3, "J"), avatar(4, "R"), txt("+54", { marginLeft: -12, width: 44, height: 44, borderRadius: 999, background: "#0e1425", border: `3px solid ${VIOLET}`, alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: INK })]),
      ]),
      node("1", "Connection request", "Send a connection request"),
      link("Accepted", "ok"),
      node("2", "Wait 1 day", "then continue the sequence"),
      link("Not replied yet"),
      node("3", "Send message", "Personalised LinkedIn message", true),
    ]),
  ]);
}
