import { useState, useCallback, useEffect, useRef } from "react";

/* ─── Shipt Brand Tokens ─────────────────────────────────────── */
const B = {
  black: "#212121",
  white: "#FFFFFF",
  totemeal: "#F1E8DA",
  red: "#CC0000",
  redDark: "#A00000",
  teal: "#428579",
  tealDark: "#2F5F56",
  sky: "#B5E1F7",
  skyDark: "#1A5C8A",
  yellow: "#F5B800",
  yellowDk: "#7A5C00",
  pink: "#F05672",
  pinkDark: "#A0213A",
  gray100: "#F7F4EF",
  gray200: "#EDE8E0",
  gray300: "#D4CFC6",
  gray400: "#9E9990",
  gray600: "#5C5750",
  gray800: "#2E2B27",
};

const FONT =
  "'Euclid Circular A','Euclid Circular B',system-ui,-apple-system,sans-serif";
const SERIF = "'SangBleu Kingdom','SangBleu Republic',Georgia,serif";

/* ─── Data ───────────────────────────────────────────────────── */
const SURFACES = [
  { id: "member_app", label: "Member App", sub: "iOS & Android" },
  { id: "dotcom", label: ".com Marketplace", sub: "Web" },
  { id: "admin_orders", label: "Admin", sub: "Orders, Members, Shoppers" },
  { id: "catalog_tooling", label: "Catalog Tooling", sub: "Internal" },
  { id: "martech_tooling", label: "MarTech Tooling", sub: "Internal" },
  { id: "admin_coverage", label: "Admin — Coverage", sub: "Internal" },
  { id: "partnerships", label: "Partnerships", sub: "Internal" },
  { id: "dev_portal", label: "Shipt Dev Portal", sub: "Web" },
  { id: "lmd", label: "LMD", sub: "Pre & Post-claim" },
  { id: "gigx", label: "GigX", sub: "Pre & Post-claim" },
  { id: "delivery_tracker", label: "Delivery Tracker", sub: "Web" },
];

const DIMENSIONS = [
  {
    id: "brand_fidelity",
    num: "01",
    label: "Brand Fidelity",
    layer: "Foundation Layer",
    question: "Does this feel unmistakably Shipt at the core level?",
    accent: B.red,
    accentDark: B.redDark,
    accentBg: "#FFF0F0",
    evaluate: [
      "Color usage (primary, secondary, semantic alignment)",
      "Typography hierarchy & tone",
      "Iconography & illustration style",
      "Voice & microcopy tone",
      "Motion principles (if applicable)",
    ],
    gaps: [
      "Off-brand but not obviously broken",
      "Legacy visual language lingering",
      "Inconsistent tone across touchpoints",
    ],
    anchors: {
      1: "Off-brand / fragmented",
      3: "Mostly aligned but inconsistent",
      5: "Fully aligned with latest refresh",
    },
  },
  {
    id: "design_system",
    num: "02",
    label: "Design System Compliance",
    layer: "UI Consistency",
    question: "Are we using our system, or designing around it?",
    accent: B.teal,
    accentDark: B.tealDark,
    accentBg: "#EAF4F2",
    evaluate: [
      "Use of canonical components vs custom one-offs",
      "Pattern reuse (navigation, cards, lists, forms)",
      "Token usage (spacing, type scale, color tokens)",
      "Variants used correctly (states, responsiveness)",
    ],
    gaps: [
      "Near-matches to components (danger zone)",
      "Duplicate patterns solving the same problem",
      "Teams inventing instead of composing",
    ],
    anchors: {
      1: "Mostly custom / fragmented",
      3: "Mixed system + custom",
      5: "Clean, intentional system usage",
    },
  },
  {
    id: "interaction_quality",
    num: "03",
    label: "Interaction Quality & Usability",
    layer: "Behavior Layer",
    question: "Does it behave in a way users expect and that reduces effort?",
    accent: B.skyDark,
    accentDark: "#0F3D5E",
    accentBg: "#EAF4FB",
    evaluate: [
      "Familiar interaction patterns (platform conventions)",
      "Clarity of actions & feedback (system status, error states)",
      "Cognitive load / simplicity",
      "Accessibility basics (contrast, tap targets)",
    ],
    gaps: [
      "Friction in core flows (search, add to cart, checkout, picking)",
      "Inconsistent behaviors across surfaces",
      "Looks right, feels wrong",
    ],
    anchors: {
      1: "Confusing / high friction",
      3: "Usable but inconsistent",
      5: "Intuitive, low-friction, predictable",
    },
  },
  {
    id: "modernity_craft",
    num: "04",
    label: "Modernity & Craft",
    layer: "Expression Layer",
    question: "Does this feel like today's Shipt, or 3 years ago?",
    accent: "#7A5C00",
    accentDark: "#5A4400",
    accentBg: "#FFFAE8",
    evaluate: [
      "Visual polish (spacing, alignment, density)",
      "Motion & transitions (where relevant)",
      "Perceived performance & responsiveness",
      "Comparative best-in-class feel (Instacart, Amazon, Apple)",
    ],
    gaps: [
      "Functional but dated",
      "Overly dense / under-designed layouts",
      "Lack of hierarchy or visual rhythm",
    ],
    anchors: {
      1: "Dated / clunky",
      3: "Acceptable but not standout",
      5: "Best-in-class, refined, intentional",
    },
  },
  {
    id: "experience_cohesion",
    num: "05",
    label: "Experience Cohesion",
    layer: "Cross-Surface",
    question: "Does this connect into a unified Shipt experience across roles?",
    accent: B.pinkDark,
    accentDark: "#780018",
    accentBg: "#FFF0F3",
    evaluate: [
      "Cross-surface pattern alignment (Member, Shopper, Internal)",
      "Conceptual consistency (carts, orders, substitutions)",
      "Shared mental models (terminology, flows)",
      "Brand + system translation across user types",
    ],
    gaps: [
      "Same concept solved differently per surface",
      "Shopper vs Member feels like different companies",
      "Internal tools completely detached from brand/system",
    ],
    anchors: {
      1: "Fragmented ecosystems",
      3: "Partial alignment",
      5: "Coherent, role-adapted but unified",
    },
  },
  {
    id: "coverage_fitness",
    num: "06",
    label: "Coverage & System Fitness",
    layer: "Strategic Layer",
    question:
      "Does our system actually support the use cases we ask teams to solve?",
    accent: "#5A4400",
    accentDark: "#3A2C00",
    accentBg: "#FDF8EE",
    evaluate: [
      "Missing components for real workflows (shopper / internal)",
      "Over-reliance on workarounds",
      "Domain-specific needs (ops tools vs consumer marketplace)",
      "Extensibility of system primitives",
    ],
    gaps: [
      "Teams forced to hack solutions",
      "Internal tools feel second-class vs consumer apps",
      "Lack of patterns for complex workflows (bulk actions, scanning)",
    ],
    anchors: {
      1: "System is a blocker",
      3: "Works with effort",
      5: "System accelerates teams",
    },
  },
];

/* ─── Types ──────────────────────────────────────────────────── */
type CellData = { score: number | null; note: string };
type DataState = Record<string, Record<string, CellData>>;
type Dimension = typeof DIMENSIONS[number];

// ─── Paste your Apps Script Web App URL here ──────────────────
const SHEET_URL = process.env.REACT_APP_SHEET_URL ?? "";
const SHEET_TOKEN = process.env.REACT_APP_SHEET_TOKEN ?? "";

/* ─── Score helpers ──────────────────────────────────────────── */
// All combos pass WCAG AA 4.5:1
const SCORE_STYLES = {
  null: {
    bg: "transparent",
    text: B.gray400,
    border: B.gray300,
    bar: B.gray300,
  },
  1: { bg: "#FFDCDC", text: "#8B0000", border: "#F5AAAA", bar: "#CC0000" },
  2: { bg: "#FFF0CC", text: "#6B4400", border: "#F5D080", bar: "#C07800" },
  3: { bg: "#FFFACC", text: "#5A4400", border: "#EBD840", bar: "#A08000" },
  4: { bg: "#DCF0FB", text: "#0F3D5E", border: "#80C8EE", bar: "#1A5C8A" },
  5: { bg: "#D4EDE9", text: "#1E3D38", border: "#80C4B8", bar: "#2F5F56" },
};

const SCORE_LABELS = {
  null: "—",
  1: "Off-brand / broken",
  2: "Significant gaps",
  3: "Inconsistent",
  4: "Mostly aligned",
  5: "Exemplary",
};

const sc = (s: number | null): { bg: string; text: string; border: string; bar: string } => {
  const styles = SCORE_STYLES as Record<string, { bg: string; text: string; border: string; bar: string }>;
  return styles[String(s)] ?? styles["null"];
};
const sl = (s: number | null) => SCORE_LABELS[(s ?? null) as keyof typeof SCORE_LABELS] ?? "—";

const avg = (nums: (number | null)[]) => {
  const v = (nums.filter((n) => n !== null && n !== undefined) as number[]);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};

const fmtAvg = (v: number | null) => (v === null ? "—" : (Math.round(v * 10) / 10).toFixed(1));

const initState = (): DataState => {
  const s: DataState = {};
  SURFACES.forEach((surf) => {
    s[surf.id] = {};
    DIMENSIONS.forEach((dim) => {
      s[surf.id][dim.id] = { score: null, note: "" };
    });
  });
  return s;
};

/* ─── Sub-components ─────────────────────────────────────────── */

const AvgBadge = ({ value }: { value: number | null }) => {
  if (value === null) return null;
  const c = sc(Math.round(value));
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: 13,
        fontWeight: 600,
        fontFamily: FONT,
        minWidth: 40,
        letterSpacing: "0.01em",
      }}
    >
      {fmtAvg(value)}
    </span>
  );
};

// Score buttons with full 44×44 hit area (WCAG 2.5.5)
const ScoreRow = ({ score, onSelect, dimAccent }: { score: number | null; onSelect: (v: number | null) => void; dimAccent: string }) => (
  <div
    style={{ display: "flex", gap: 3 }}
    role="group"
    aria-label="Score selector"
  >
    {[1, 2, 3, 4, 5].map((v) => {
      const active = score === v;
      const c = sc(v);
      return (
        <button
          key={v}
          onClick={() => onSelect(score === v ? null : v)}
          aria-label={`Score ${v}: ${sl(v)}`}
          aria-pressed={active}
          style={{
            width: 36,
            height: 44,
            borderRadius: 8,
            border: active ? `2px solid ${c.text}` : `1px solid ${B.gray300}`,
            background: active ? c.bg : "transparent",
            color: active ? c.text : B.gray400,
            fontSize: 14,
            fontWeight: active ? 700 : 400,
            cursor: "pointer",
            transition: "all 0.12s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            flexShrink: 0,
            outline: "none",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow = `0 0 0 3px ${dimAccent}55`)
          }
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          onMouseEnter={(e) => {
            if (!active) {
              e.currentTarget.style.background = B.gray100;
              e.currentTarget.style.borderColor = B.gray400;
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = B.gray300;
            }
          }}
        >
          {v}
        </button>
      );
    })}
  </div>
);

const DimPanel = ({ dim, onClose }: { dim: Dimension; onClose: () => void }) => (
  <div
    role="dialog"
    aria-label={`${dim.label} criteria`}
    onClick={(e) => e.stopPropagation()}
    style={{
      position: "absolute",
      top: 0,
      left: "calc(100% + 12px)",
      zIndex: 200,
      width: 320,
      background: B.white,
      border: `1.5px solid ${dim.accent}`,
      borderRadius: 12,
      padding: "18px 20px",
      boxShadow: "0 8px 32px rgba(33,33,33,0.12)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
      }}
    >
      <div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: dim.accentDark,
            background: dim.accentBg,
            padding: "3px 8px",
            borderRadius: 4,
            fontFamily: FONT,
          }}
        >
          {dim.layer}
        </span>
        <p
          style={{
            fontSize: 14,
            color: B.black,
            margin: "8px 0 0",
            lineHeight: 1.5,
            fontFamily: SERIF,
            fontStyle: "italic",
          }}
        >
          {dim.question}
        </p>
      </div>
      <button
        onClick={onClose}
        aria-label="Close criteria panel"
        style={{
          width: 44,
          height: 44,
          flexShrink: 0,
          marginTop: -8,
          marginRight: -8,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: B.gray600,
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = B.gray100)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        ×
      </button>
    </div>

    <div style={{ marginBottom: 14 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: B.gray600,
          margin: "0 0 8px",
          fontFamily: FONT,
        }}
      >
        What to evaluate
      </p>
      {dim.evaluate.map((e, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <span
            style={{
              color: dim.accent,
              fontSize: 10,
              marginTop: 4,
              flexShrink: 0,
            }}
          >
            ▸
          </span>
          <span
            style={{
              fontSize: 13,
              color: B.gray800,
              lineHeight: 1.5,
              fontFamily: FONT,
            }}
          >
            {e}
          </span>
        </div>
      ))}
    </div>

    <div style={{ marginBottom: 14 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: B.gray600,
          margin: "0 0 8px",
          fontFamily: FONT,
        }}
      >
        Signals of gaps
      </p>
      {dim.gaps.map((g, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          <span
            style={{
              color: B.yellow,
              fontSize: 12,
              marginTop: 2,
              flexShrink: 0,
            }}
          >
            ⚠
          </span>
          <span
            style={{
              fontSize: 13,
              color: B.gray800,
              lineHeight: 1.5,
              fontFamily: FONT,
            }}
          >
            {g}
          </span>
        </div>
      ))}
    </div>

    <div
      style={{
        background: B.totemeal,
        borderRadius: 8,
        padding: "12px 14px",
        border: `1px solid ${B.gray200}`,
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: B.gray600,
          margin: "0 0 8px",
          fontFamily: FONT,
        }}
      >
        Score anchors
      </p>
      {Object.entries(dim.anchors).map(([k, v]: [string, string]) => {
        const c = sc(parseInt(k));
        return (
          <div
            key={k}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                flexShrink: 0,
                background: c.bg,
                color: c.text,
                border: `1px solid ${c.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: FONT,
              }}
            >
              {k}
            </span>
            <span style={{ fontSize: 13, color: B.gray800, fontFamily: FONT }}>
              {v}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

/* ─── Main component ─────────────────────────────────────────── */
export default function AuditMatrix() {
  const [data, setData] = useState<DataState>(initState);
  const [activeNote, setActiveNote] = useState<{ surfId: string; dimId: string } | null>(null);
  const [openDetail, setOpenDetail] = useState<string | null>(null);
  const [view, setView] = useState("matrix");
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error">("idle");
  const noteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeNoteRef = useRef(activeNote);
  useEffect(() => { activeNoteRef.current = activeNote; }, [activeNote]);

  // Helper: merge remote sheet data into local state, skipping the active note cell
  const mergeRemote = useCallback((remote: DataState) => {
    setData((prev) => {
      const next = { ...prev };
      Object.keys(remote).forEach((surfId) => {
        if (!next[surfId]) return;
        Object.keys(remote[surfId]).forEach((dimId) => {
          if (!next[surfId][dimId]) return;
          const editing =
            activeNoteRef.current?.surfId === surfId &&
            activeNoteRef.current?.dimId === dimId;
          if (!editing) {
            next[surfId] = { ...next[surfId], [dimId]: remote[surfId][dimId] };
          }
        });
      });
      return next;
    });
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!SHEET_URL) { setLoading(false); return; }
    fetch(`${SHEET_URL}?token=${encodeURIComponent(SHEET_TOKEN)}`)
      .then((r) => r.json())
      .then((remote: DataState) => mergeRemote(remote))
      .catch(() => setSyncStatus("error"))
      .finally(() => setLoading(false));
  }, [mergeRemote]);

  // Poll every 5s
  useEffect(() => {
    if (!SHEET_URL) return;
    const id = setInterval(() => {
      fetch(`${SHEET_URL}?token=${encodeURIComponent(SHEET_TOKEN)}`)
        .then((r) => r.json())
        .then((remote: DataState) => mergeRemote(remote))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(id);
  }, [mergeRemote]);

  const postToSheet = useCallback((payload: { surfId: string; dimId: string; score?: number | null; note?: string }) => {
    if (!SHEET_URL) return;
    setSyncStatus("syncing");
    fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ ...payload, token: SHEET_TOKEN }),
      redirect: "follow",
    })
      .then(() => setSyncStatus("idle"))
      .catch(() => setSyncStatus("error"));
  }, []);

  const setScore = useCallback((surfId: string, dimId: string, score: number | null) => {
    setData((p) => ({
      ...p,
      [surfId]: { ...p[surfId], [dimId]: { ...p[surfId][dimId], score } },
    }));
    postToSheet({ surfId, dimId, score });
  }, [postToSheet]);

  const setNote = useCallback((surfId: string, dimId: string, note: string) => {
    setData((p) => ({
      ...p,
      [surfId]: { ...p[surfId], [dimId]: { ...p[surfId][dimId], note } },
    }));
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    noteTimerRef.current = setTimeout(() => postToSheet({ surfId, dimId, note }), 1000);
  }, [postToSheet]);

  const dimAvg = (id: string) => avg(SURFACES.map((s) => data[s.id][id].score));
  const surfAvg = (id: string) => avg(DIMENSIONS.map((d) => data[id][d.id].score));

  const totalScored = SURFACES.reduce(
    (acc, s) =>
      acc + DIMENSIONS.filter((d) => data[s.id][d.id].score !== null).length,
    0
  );
  const totalCells = SURFACES.length * DIMENSIONS.length;

  return (
    <div
      style={{ fontFamily: FONT, background: B.totemeal, minHeight: "100vh" }}
      onClick={() => setOpenDetail(null)}
    >
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        button:focus-visible{outline:3px solid ${B.teal};outline-offset:2px;}
        textarea:focus{outline:2px solid ${B.teal};border-color:transparent!important;}
        .row-alt-even{background:${B.white};}
        .row-alt-odd{background:${B.gray100};}
        .score-cell:hover{filter:brightness(0.97);}
        .note-btn{opacity:0;transition:opacity 0.12s;}
        .drow:hover .note-btn{opacity:1;}
        .note-btn.has-note{opacity:1!important;}
      `}</style>

      {/* ── Sync status bar ────────────────────────────────────── */}
      {syncStatus === "error" && (
        <div style={{ background: "#CC0000", color: "#fff", fontSize: 12, fontFamily: FONT, padding: "6px 16px", textAlign: "center" }}>
          Could not sync with Google Sheets. Changes are saved locally only.
        </div>
      )}
      {loading && (
        <div style={{ background: B.teal, color: "#fff", fontSize: 12, fontFamily: FONT, padding: "6px 16px", textAlign: "center" }}>
          Loading from Google Sheets…
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{ background: B.black, padding: "20px 28px 18px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: B.red,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: B.gray400,
                  textTransform: "uppercase",
                  fontFamily: FONT,
                }}
              >
                Shipt UXDR
              </span>
            </div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 400,
                color: B.white,
                lineHeight: 1.2,
                fontFamily: SERIF,
                marginBottom: 4,
              }}
            >
              Experience Coherence Audit
            </h1>
            <p style={{ fontSize: 13, color: B.gray400, fontFamily: FONT }}>
              6-dimension heuristic &nbsp;·&nbsp; 1–5 scale &nbsp;·&nbsp;{" "}
              {SURFACES.length} touchpoints
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ textAlign: "right", marginRight: 4 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: B.white,
                  lineHeight: 1,
                  fontFamily: FONT,
                }}
              >
                {totalScored}
                <span style={{ color: B.gray600, fontWeight: 300 }}>
                  /{totalCells}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: B.gray600,
                  marginBottom: 4,
                  fontFamily: FONT,
                }}
              >
                cells scored
              </div>
              <div
                style={{
                  height: 3,
                  width: 56,
                  background: B.gray600,
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(totalScored / totalCells) * 100}%`,
                    background: B.red,
                    borderRadius: 2,
                    transition: "width 0.3s",
                  }}
                />
              </div>
            </div>
            {["matrix", "summary"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                style={{
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 8,
                  border: `1.5px solid ${view === v ? B.white : B.gray600}`,
                  background: view === v ? B.white : "transparent",
                  color: view === v ? B.black : B.gray400,
                  fontSize: 13,
                  fontWeight: view === v ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: FONT,
                  textTransform: "capitalize",
                  transition: "all 0.12s",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </header>

      {view === "matrix" ? (
        <main style={{ padding: "24px 28px" }}>
          <div
            style={{
              overflowX: "auto",
              borderRadius: 12,
              border: `1px solid ${B.gray300}`,
              background: B.gray300,
            }}
          >
            <div style={{ minWidth: "max-content" }}>
              {/* Surface header row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `260px repeat(${SURFACES.length}, 228px)`,
                  columnGap: "1px",
                  background: B.black,
                  borderRadius: "12px 12px 0 0",
                }}
              >
                <div
                  style={{
                    padding: "14px 16px 14px 20px",
                    background: B.black,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: B.gray400,
                      fontFamily: FONT,
                    }}
                  >
                    Dimension
                  </span>
                </div>
                {SURFACES.map((s) => {
                  const a = surfAvg(s.id);
                  return (
                    <div
                      key={s.id}
                      style={{
                        padding: "14px 10px 14px 16px",
                        background: B.black,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: B.white,
                          lineHeight: 1.3,
                          marginBottom: 2,
                          fontFamily: FONT,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: B.gray400,
                          marginBottom: 10,
                          lineHeight: 1.3,
                          fontFamily: FONT,
                        }}
                      >
                        {s.sub}
                      </div>
                      <AvgBadge value={a} />
                    </div>
                  );
                })}
              </div>

              {/* Dimension rows */}
              {DIMENSIONS.map((dim, di) => (
                <div
                  key={dim.id}
                  className={`drow ${
                    di % 2 === 0 ? "row-alt-even" : "row-alt-odd"
                  }`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `260px repeat(${SURFACES.length}, 228px)`,
                    columnGap: "1px",
                    background: B.gray300,
                    borderBottom:
                      di < DIMENSIONS.length - 1
                        ? `1px solid ${B.gray300}`
                        : "none",
                  }}
                >
                  {/* Dimension label */}
                  <div
                    style={{
                      padding: "16px 16px 16px 20px",
                      position: "relative",
                      background: di % 2 === 0 ? B.white : B.gray100,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          color: B.gray300,
                          fontWeight: 600,
                          fontFamily: FONT,
                        }}
                      >
                        {dim.num}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          color: dim.accentDark,
                          background: dim.accentBg,
                          padding: "2px 7px",
                          borderRadius: 4,
                          fontFamily: FONT,
                        }}
                      >
                        {dim.layer}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: B.black,
                        marginBottom: 3,
                        lineHeight: 1.3,
                        fontFamily: FONT,
                      }}
                    >
                      {dim.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: B.gray600,
                        lineHeight: 1.5,
                        marginBottom: 10,
                        fontFamily: SERIF,
                        fontStyle: "italic",
                      }}
                    >
                      {dim.question}
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <AvgBadge value={dimAvg(dim.id)} />
                      <div
                        style={{
                          flex: 1,
                          height: 4,
                          background: B.gray200,
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        {dimAvg(dim.id) !== null && (
                          <div
                            style={{
                              height: "100%",
                              width: `${(((dimAvg(dim.id) as number) - 1) / 4) * 100}%`,
                              background: dim.accent,
                              borderRadius: 2,
                              transition: "width 0.35s ease",
                            }}
                          />
                        )}
                      </div>
                      <button
                        className="crit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDetail(openDetail === dim.id ? null : dim.id);
                        }}
                        aria-expanded={openDetail === dim.id}
                        aria-label={`View ${dim.label} criteria`}
                        style={{
                          height: 28,
                          padding: "0 10px",
                          borderRadius: 6,
                          border: `1px solid ${dim.accent}`,
                          background:
                            openDetail === dim.id
                              ? dim.accentBg
                              : "transparent",
                          cursor: "pointer",
                          fontSize: 12,
                          color: dim.accentDark,
                          fontFamily: FONT,
                          whiteSpace: "nowrap",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = dim.accentBg)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        criteria ›
                      </button>
                    </div>
                    {openDetail === dim.id && (
                      <DimPanel dim={dim} onClose={() => setOpenDetail(null)} />
                    )}
                  </div>

                  {/* Score cells */}
                  {SURFACES.map((surf) => {
                    const cell = data[surf.id][dim.id];
                    const isNoteOpen =
                      activeNote?.surfId === surf.id &&
                      activeNote?.dimId === dim.id;
                    const c = sc(cell.score);
                    return (
                      <div
                        key={surf.id}
                        className="score-cell"
                        style={{
                          padding: "12px 16px 12px 16px",
                          background:
                            cell.score !== null
                              ? `${c.bg}88`
                              : di % 2 === 0
                              ? B.white
                              : B.gray100,
                          transition: "background 0.12s",
                        }}
                      >
                        {cell.score !== null && (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              background: c.bg,
                              color: c.text,
                              border: `1px solid ${c.border}`,
                              borderRadius: 6,
                              padding: "4px 10px",
                              fontSize: 12,
                              fontWeight: 500,
                              marginBottom: 8,
                              fontFamily: FONT,
                              lineHeight: 1,
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>
                              {cell.score}
                            </span>
                            <span style={{ opacity: 0.8 }}>
                              {sl(cell.score)}
                            </span>
                          </div>
                        )}

                        <ScoreRow
                          score={cell.score}
                          onSelect={(s) => setScore(surf.id, dim.id, s)}
                          dimAccent={dim.accent}
                        />

                        {/* Note button — 44px tall hit area */}
                        <button
                          className={`note-btn${
                            cell.note || isNoteOpen ? " has-note" : ""
                          }`}
                          onClick={() =>
                            setActiveNote(
                              isNoteOpen
                                ? null
                                : { surfId: surf.id, dimId: dim.id }
                            )
                          }
                          aria-expanded={isNoteOpen}
                          aria-label={cell.note ? "Edit note" : "Add note"}
                          style={{
                            height: 44,
                            padding: "0 4px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 12,
                            color: cell.note ? B.tealDark : B.gray600,
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontFamily: FONT,
                            fontWeight: cell.note ? 500 : 400,
                            borderRadius: 6,
                            transition: "color 0.1s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = B.teal)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = cell.note
                              ? B.tealDark
                              : B.gray600)
                          }
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <rect
                              x="1"
                              y="1"
                              width="12"
                              height="12"
                              rx="2.5"
                              stroke="currentColor"
                              strokeWidth="1.2"
                            />
                            <line
                              x1="4"
                              y1="4.5"
                              x2="10"
                              y2="4.5"
                              stroke="currentColor"
                              strokeWidth="1.1"
                            />
                            <line
                              x1="4"
                              y1="7"
                              x2="10"
                              y2="7"
                              stroke="currentColor"
                              strokeWidth="1.1"
                            />
                            <line
                              x1="4"
                              y1="9.5"
                              x2="7.5"
                              y2="9.5"
                              stroke="currentColor"
                              strokeWidth="1.1"
                            />
                          </svg>
                          {cell.note ? "edit note" : "add note"}
                        </button>

                        {isNoteOpen && (
                          <div style={{ marginTop: 4 }}>
                            <label
                              htmlFor={`note-${surf.id}-${dim.id}`}
                              style={{
                                fontSize: 11,
                                color: B.gray600,
                                display: "block",
                                marginBottom: 4,
                                fontFamily: FONT,
                              }}
                            >
                              Findings for {surf.label}
                            </label>
                            <textarea
                              id={`note-${surf.id}-${dim.id}`}
                              autoFocus
                              placeholder="Screen, observation, impact..."
                              value={cell.note}
                              onChange={(e) =>
                                setNote(surf.id, dim.id, e.target.value)
                              }
                              style={{
                                width: "100%",
                                minHeight: 72,
                                fontSize: 13,
                                color: B.black,
                                background: B.white,
                                border: `1.5px solid ${dim.accent}`,
                                borderRadius: 8,
                                padding: "8px 10px",
                                resize: "vertical",
                                lineHeight: 1.5,
                                fontFamily: FONT,
                              }}
                            />
                            <button
                              onClick={() => setActiveNote(null)}
                              style={{
                                height: 36,
                                padding: "0 14px",
                                marginTop: 6,
                                background: dim.accent,
                                color: B.white,
                                border: "none",
                                borderRadius: 6,
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 500,
                                fontFamily: FONT,
                                transition: "background 0.12s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                  dim.accentDark)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = dim.accent)
                              }
                            >
                              Save note
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Scale legend */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: B.gray600,
                fontFamily: FONT,
              }}
            >
              Scale
            </span>
            {[1, 2, 3, 4, 5].map((v) => {
              const c = sc(v);
              return (
                <div
                  key={v}
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: c.text,
                      fontFamily: FONT,
                    }}
                  >
                    {v}
                  </span>
                  <span
                    style={{ fontSize: 13, color: B.gray600, fontFamily: FONT }}
                  >
                    {sl(v)}
                  </span>
                </div>
              );
            })}
          </div>
        </main>
      ) : (
        /* ── Summary view ──────────────────────────────────────── */
        <main style={{ padding: "24px 28px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0,1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            {/* By surface */}
            <section
              aria-label="Scores by surface"
              style={{
                background: B.white,
                border: `1px solid ${B.gray200}`,
                borderRadius: 12,
                padding: "20px 24px",
              }}
            >
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: B.gray600,
                  margin: "0 0 16px",
                  fontFamily: FONT,
                }}
              >
                Score by surface
              </h2>
              {SURFACES.map((s) => {
                const a = surfAvg(s.id);
                const c = sc(a === null ? null : Math.round(a));
                return (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ width: 120, flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: B.black,
                          fontFamily: FONT,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: B.gray600,
                          fontFamily: FONT,
                        }}
                      >
                        {s.sub}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: B.gray200,
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: a !== null ? `${((a - 1) / 4) * 100}%` : "0%",
                          background: c.bar,
                          borderRadius: 4,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                    <div style={{ width: 44, textAlign: "right" }}>
                      <AvgBadge value={a} />
                    </div>
                  </div>
                );
              })}
            </section>

            {/* By dimension */}
            <section
              aria-label="Scores by dimension"
              style={{
                background: B.white,
                border: `1px solid ${B.gray200}`,
                borderRadius: 12,
                padding: "20px 24px",
              }}
            >
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: B.gray600,
                  margin: "0 0 16px",
                  fontFamily: FONT,
                }}
              >
                Score by dimension
              </h2>
              {DIMENSIONS.map((d) => {
                const a = dimAvg(d.id);
                return (
                  <div
                    key={d.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ width: 120, flexShrink: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: B.black,
                          fontFamily: FONT,
                          lineHeight: 1.3,
                        }}
                      >
                        {d.label}
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: d.accentDark,
                          background: d.accentBg,
                          padding: "1px 6px",
                          borderRadius: 3,
                          fontFamily: FONT,
                        }}
                      >
                        {d.layer}
                      </span>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: B.gray200,
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: a !== null ? `${((a - 1) / 4) * 100}%` : "0%",
                          background: d.accent,
                          borderRadius: 4,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                    <div style={{ width: 44, textAlign: "right" }}>
                      <AvgBadge value={a} />
                    </div>
                  </div>
                );
              })}
            </section>
          </div>

          {/* Heatmap */}
          <section
            aria-label="Score heatmap"
            style={{
              background: B.white,
              border: `1px solid ${B.gray200}`,
              borderRadius: 12,
              padding: "20px 24px",
              marginBottom: 20,
              overflowX: "auto",
            }}
          >
            <h2
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: B.gray600,
                margin: "0 0 16px",
                fontFamily: FONT,
              }}
            >
              Heatmap
            </h2>
            <table
              style={{ borderCollapse: "collapse", minWidth: "max-content" }}
              role="grid"
              aria-label="Score heatmap"
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: 160,
                      textAlign: "left",
                      paddingBottom: 10,
                      fontSize: 12,
                      color: B.gray600,
                      fontWeight: 400,
                      fontFamily: FONT,
                    }}
                    scope="col"
                  />
                  {SURFACES.map((s) => (
                    <th
                      key={s.id}
                      scope="col"
                      style={{
                        width: 88,
                        textAlign: "center",
                        paddingBottom: 10,
                        fontFamily: FONT,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: B.black,
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: B.gray600,
                          fontWeight: 400,
                        }}
                      >
                        {s.sub}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DIMENSIONS.map((d) => (
                  <tr key={d.id}>
                    <th
                      scope="row"
                      style={{
                        padding: "4px 12px 4px 0",
                        fontSize: 13,
                        color: B.black,
                        fontWeight: 500,
                        textAlign: "left",
                        fontFamily: FONT,
                      }}
                    >
                      {d.label}
                    </th>
                    {SURFACES.map((s) => {
                      const sv = data[s.id][d.id].score;
                      const c = sc(sv);
                      return (
                        <td
                          key={s.id}
                          style={{ padding: 3, textAlign: "center" }}
                        >
                          <div
                            style={{
                              height: 36,
                              width: 80,
                              borderRadius: 8,
                              margin: "0 auto",
                              background: sv !== null ? c.bg : B.gray100,
                              border: `1px solid ${
                                sv !== null ? c.border : B.gray200
                              }`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 14,
                              fontWeight: sv ? 700 : 400,
                              color: sv !== null ? c.text : B.gray300,
                              fontFamily: FONT,
                            }}
                          >
                            {sv !== null ? sv : "·"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Findings */}
          {(() => {
            const findings: { surf: typeof SURFACES[number]; dim: typeof DIMENSIONS[number]; cell: CellData }[] = [];
            SURFACES.forEach((s) =>
              DIMENSIONS.forEach((d) => {
                const c = data[s.id][d.id];
                if (c.note || c.score !== null)
                  findings.push({ surf: s, dim: d, cell: c });
              })
            );
            if (!findings.length)
              return (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: B.gray400,
                    fontSize: 14,
                    fontFamily: FONT,
                  }}
                >
                  Score cells in the matrix view to populate findings here.
                </div>
              );
            return (
              <section
                aria-label="All findings"
                style={{
                  background: B.white,
                  border: `1px solid ${B.gray200}`,
                  borderRadius: 12,
                  padding: "20px 24px",
                }}
              >
                <h2
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: B.gray600,
                    margin: "0 0 16px",
                    fontFamily: FONT,
                  }}
                >
                  All findings & notes
                </h2>
                <div style={{ display: "grid", gap: 10 }}>
                  {findings.map(({ surf, dim, cell }, i) => {
                    const c = sc(cell.score);
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 16,
                          padding: "14px 16px",
                          background: B.gray100,
                          borderRadius: 10,
                          border: `1px solid ${B.gray200}`,
                        }}
                      >
                        <div
                          style={{
                            flexShrink: 0,
                            minWidth: 130,
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                            alignItems: "flex-start",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: B.black,
                              fontFamily: FONT,
                            }}
                          >
                            {surf.label}
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              color: dim.accentDark,
                              background: dim.accentBg,
                              padding: "2px 6px",
                              borderRadius: 3,
                              fontFamily: FONT,
                            }}
                          >
                            {dim.layer}
                          </span>
                          {cell.score !== null && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                background: c.bg,
                                color: c.text,
                                border: `1px solid ${c.border}`,
                                borderRadius: 5,
                                padding: "3px 8px",
                                fontSize: 12,
                                fontWeight: 600,
                                fontFamily: FONT,
                              }}
                            >
                              {cell.score} · {sl(cell.score)}
                            </span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: B.black,
                              marginBottom: 4,
                              fontFamily: FONT,
                            }}
                          >
                            {dim.label}
                          </div>
                          {cell.note ? (
                            <p
                              style={{
                                fontSize: 13,
                                color: B.gray800,
                                lineHeight: 1.6,
                                fontFamily: FONT,
                                margin: 0,
                              }}
                            >
                              {cell.note}
                            </p>
                          ) : (
                            <p
                              style={{
                                fontSize: 13,
                                color: B.gray300,
                                fontFamily: SERIF,
                                fontStyle: "italic",
                                margin: 0,
                              }}
                            >
                              No note added.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })()}
        </main>
      )}
    </div>
  );
}
