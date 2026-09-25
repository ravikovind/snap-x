export const FONTS = [{ family: "Nunito", weights: [400, 700, 900] }];
export const C = { bg: "#0E3B2C", panel: "#17513C", panel2: "#1F6248", orange: "#FF8A1F", cream: "#FFF3DE", muted: "#A9CDB8", ink: "#0E3B2C" };

const d = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const t = (style, text) => d({ whiteSpace: "nowrap", ...style }, [text]);

export const check = (s, color = C.ink) => ({ type: "svg", props: { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 3.5,
  strokeLinecap: "round", strokeLinejoin: "round", children: [{ type: "path", props: { d: "M5 12.5l4.5 4.5L19 7" } }] } });

// sun + hills decoration
export const scenery = (w, h, sun = true) => ({ type: "svg", props: { width: w, height: h, viewBox: "0 0 1000 400", children: [
  ...(sun ? [{ type: "circle", props: { cx: 700, cy: 230, r: 150, fill: C.orange } }] : []),
  { type: "path", props: { d: "M0 400 L0 300 Q150 180 320 290 Q470 380 600 260 Q780 120 1000 300 L1000 400 Z", fill: "#17513C" } },
  { type: "path", props: { d: "M0 400 L0 350 Q200 270 400 350 Q650 430 1000 330 L1000 400 Z", fill: "#1F6248" } },
] } });

export const wordmark = (size) => d({ alignItems: "center", gap: size * 0.3 }, [
  d({ width: size, height: size, borderRadius: size * 0.32, background: C.orange, alignItems: "center", justifyContent: "center" }, [
    t({ fontSize: size * 0.68, fontWeight: 900, color: C.ink, fontFamily: "Nunito" }, "K")]),
  t({ fontSize: size * 0.8, fontWeight: 900, color: C.cream, fontFamily: "Nunito" }, "Kite"),
]);

const avatar = (s, color) => d({ width: s, height: s, borderRadius: 999, background: color, border: `${s * 0.1}px solid #fff` });
const bar = (w, h, color = "#D9E6DD") => d({ width: w, height: h, borderRadius: 999, background: color });

// mock screens; u = screen width / 940
const screens = {
  itinerary: (u) => [
    t({ fontSize: 60 * u, fontWeight: 900, color: C.ink }, "Our trip"),
    ...["Saturday", "Sunday"].flatMap((day, di) => [
      t({ fontSize: 36 * u, fontWeight: 700, color: "#B85F00", marginTop: 48 * u }, day),
      ...[0, 1, 2, 0].slice(0, di === 0 ? 4 : 3).map((i) => d({ alignItems: "center", gap: 26 * u, background: "#fff", borderRadius: 34 * u, padding: `${44 * u}px ${34 * u}px`, marginTop: 26 * u }, [
        d({ width: 46 * u, height: 46 * u, borderRadius: 999, background: C.orange }),
        d({ flexDirection: "column", gap: 12 * u }, [bar(380 * u, 22 * u, "#2B6B52"), bar(240 * u, 18 * u)]),
        d({ flexGrow: 1 }),
        avatar(56 * u, ["#5FAE8A", "#F4B26B", "#7FA6D6"][i % 3]),
      ])),
    ]),
  ],
  vote: (u) => [
    t({ fontSize: 60 * u, fontWeight: 900, color: C.ink }, "Pick a trail"),
    ...[["Trail A", 0.62, false], ["Trail B", 0.86, true], ["Trail C", 0.4, false], ["Trail D", 0.3, false]].map(([name, f, win]) =>
      d({ flexDirection: "column", gap: 30 * u, background: win ? "#FFE8CC" : "#fff", border: `${5 * u}px solid ${win ? C.orange : "#fff"}`, borderRadius: 40 * u, padding: `${46 * u}px ${40 * u}px`, marginTop: 34 * u }, [
        d({ alignItems: "center", gap: 20 * u }, [
          t({ fontSize: 44 * u, fontWeight: 900, color: C.ink }, name),
          d({ flexGrow: 1 }),
          win ? d({ width: 60 * u, height: 60 * u, borderRadius: 999, background: C.orange, alignItems: "center", justifyContent: "center" }, [check(38 * u)]) : d({ width: 60 * u, height: 60 * u, borderRadius: 999, border: `${5 * u}px solid #C9D8CE` }),
        ]),
        d({ width: "100%", height: 26 * u, borderRadius: 999, background: "#E4EDE7" }, [d({ width: 780 * u * f, height: 26 * u, borderRadius: 999, background: win ? C.orange : "#5FAE8A" })]),
        d({ gap: -10 * u }, [avatar(52 * u, "#5FAE8A"), avatar(52 * u, "#F4B26B"), avatar(52 * u, "#7FA6D6")].slice(0, win ? 3 : 2)),
      ])),
    d({ flexGrow: 1 }),
    d({ alignItems: "center", justifyContent: "center", background: C.orange, borderRadius: 40 * u, padding: `${46 * u}px`, marginBottom: 70 * u }, [
      t({ fontSize: 48 * u, fontWeight: 900, color: C.ink }, "Vote for Trail B")]),
  ],
  packing: (u) => [
    t({ fontSize: 60 * u, fontWeight: 900, color: C.ink }, "Packing list"),
    ...[["Water", true, "#5FAE8A"], ["Snacks", true, "#F4B26B"], ["Rain jacket", false, "#7FA6D6"], ["First aid kit", true, "#5FAE8A"], ["Headlamp", false, "#F4B26B"], ["Sunscreen", true, "#7FA6D6"], ["Trail map", false, "#5FAE8A"], ["Camp stove", true, "#F4B26B"], ["Warm layer", false, "#7FA6D6"]].map(([name, on, col]) =>
      d({ alignItems: "center", gap: 28 * u, background: "#fff", borderRadius: 34 * u, padding: `${38 * u}px ${34 * u}px`, marginTop: 26 * u }, [
        d({ width: 62 * u, height: 62 * u, borderRadius: 18 * u, alignItems: "center", justifyContent: "center", background: on ? C.orange : "#fff", border: `${5 * u}px solid ${on ? C.orange : "#C9D8CE"}` }, on ? [check(40 * u)] : []),
        t({ fontSize: 44 * u, fontWeight: 700, color: on ? "#7A9A88" : C.ink, textDecoration: on ? "line-through" : "none" }, name),
        d({ flexGrow: 1 }),
        avatar(56 * u, col),
      ])),
  ],
};

// phone frame of outer width w (screen = w minus borders)
export const phone = (w, kind) => {
  const bw = w * 0.03, sw = w - 2 * bw, u = sw / 940, h = w * 2.05;
  return d({ width: w, height: h, borderRadius: w * 0.14, border: `${bw}px solid #06231A`, background: "#F6EFE2", overflow: "hidden", flexDirection: "column", fontFamily: "Nunito" }, [
    d({ height: 150 * u, alignItems: "center", justifyContent: "center", paddingTop: 30 * u }, [
      d({ width: 260 * u, height: 62 * u, borderRadius: 999, background: "#06231A" })]),
    d({ flexDirection: "column", padding: `${10 * u}px ${50 * u}px`, flexGrow: 1 }, screens[kind](u)),
  ]);
};

// App Store screenshot builder
export const shot = (kind, line1, line2) => ({ type: "div", props: { style: { display: "flex", flexDirection: "column", alignItems: "center", width: 1320, height: 2868, background: C.bg, fontFamily: "Nunito", position: "relative", overflow: "hidden" }, children: [
  d({ position: "absolute", right: 90, top: 60, width: 150, height: 150, borderRadius: 999, background: C.orange }),
  d({ position: "absolute", left: 0, bottom: 0 }, [scenery(1320, 528, false)]),
  d({ flexDirection: "column", alignItems: "center", marginTop: 130, gap: 0 }, [
    t({ fontSize: 132, fontWeight: 900, color: C.cream, lineHeight: 1.05 }, line1),
    t({ fontSize: 132, fontWeight: 900, color: C.orange, lineHeight: 1.05 }, line2),
  ]),
  d({ marginTop: 130 }, [phone(1000, kind)]),
] } });
