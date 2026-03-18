import { useState, useCallback, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Home, FileText, Layers, GitCompare, Cpu, Zap, BookOpen, Network, Brain, Shield,
  BarChart3, Database, Settings, ChevronRight, ChevronDown, ChevronLeft, Upload, Copy,
  Plus, Search, X, AlertTriangle, Info, ArrowRight, ArrowLeft, Trash2,
  Download, Save, Eye, RotateCcw, FileUp, Filter, Edit3,
  CheckCircle2, Sparkles, RefreshCw, ExternalLink,
  Building2, Box, Workflow, Terminal, Lock, Unlock, TrendingUp
} from "lucide-react";

// ─── ICONS MAP ───
const IM = { Zap, Layers, Brain, GitCompare, Cpu, Shield, BookOpen, BarChart3, Network, Database, Box };

// ─── THEMES ───
const THEMES = {
  midnight: { name: "Midnight", bg: "#06080f", surf: "#0c1019", glass: "rgba(20,27,45,0.55)", glass2: "rgba(15,20,40,0.8)", bdr: "rgba(56,78,134,0.2)", t1: "#e8ecf4", t2: "#7b8bb2", t3: "#4a5578", sidebar: "linear-gradient(180deg,#080c18,#0a0e1a)", isDark: true },
  obsidian: { name: "Obsidian", bg: "#0a0a0f", surf: "#111118", glass: "rgba(25,25,40,0.6)", glass2: "rgba(18,18,30,0.85)", bdr: "rgba(80,70,120,0.2)", t1: "#e4e0f0", t2: "#8b82b0", t3: "#554f78", sidebar: "linear-gradient(180deg,#0c0c14,#0e0e18)", isDark: true },
  ocean: { name: "Deep Ocean", bg: "#03090f", surf: "#081420", glass: "rgba(10,30,50,0.6)", glass2: "rgba(8,22,40,0.85)", bdr: "rgba(40,90,140,0.25)", t1: "#daeaf8", t2: "#6a9cc0", t3: "#3a6585", sidebar: "linear-gradient(180deg,#051018,#071420)", isDark: true },
  light: { name: "Daylight", bg: "#f4f6fb", surf: "#ffffff", glass: "rgba(255,255,255,0.75)", glass2: "rgba(255,255,255,0.9)", bdr: "rgba(99,120,180,0.15)", t1: "#1a2035", t2: "#5a6580", t3: "#9aa3b8", sidebar: "linear-gradient(180deg,#f0f2f8,#e8ecf4)", isDark: false },
  cream: { name: "Warm Light", bg: "#faf8f4", surf: "#ffffff", glass: "rgba(255,253,248,0.8)", glass2: "rgba(255,254,250,0.92)", bdr: "rgba(160,140,100,0.15)", t1: "#2a2418", t2: "#6b6050", t3: "#a89e8a", sidebar: "linear-gradient(180deg,#f5f0e8,#ede6da)", isDark: false },
};

const ACCENTS = [
  { id: "indigo", color: "#6366f1", name: "Indigo" },
  { id: "cyan", color: "#06b6d4", name: "Cyan" },
  { id: "emerald", color: "#10b981", name: "Emerald" },
  { id: "rose", color: "#f43f5e", name: "Rose" },
  { id: "amber", color: "#f59e0b", name: "Amber" },
  { id: "violet", color: "#8b5cf6", name: "Violet" },
  { id: "sky", color: "#0ea5e9", name: "Sky" },
  { id: "orange", color: "#f97316", name: "Orange" },
];

function buildCSS(theme, accent) {
  const t = THEMES[theme] || THEMES.midnight;
  const ac = ACCENTS.find(a => a.id === accent) || ACCENTS[0];
  const acHex = ac.color;
  const acR = parseInt(acHex.slice(1, 3), 16);
  const acG = parseInt(acHex.slice(3, 5), 16);
  const acB = parseInt(acHex.slice(5, 7), 16);
  const acRgba = (a) => "rgba(" + acR + "," + acG + "," + acB + "," + a + ")";

  return `
:root{--bg:${t.bg};--glass:${t.glass};--glass2:${t.glass2};--bdr:${t.bdr};--bdr2:${acRgba(0.3)};--acc:${acHex};--t1:${t.t1};--t2:${t.t2};--t3:${t.t3}}
.dapp{font-family:'Outfit',system-ui,sans-serif;background:var(--bg);color:var(--t1)}.dapp *{box-sizing:border-box}.mono{font-family:'JetBrains Mono',monospace}
.gl{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--bdr)}.gl2{background:var(--glass2);backdrop-filter:blur(30px);border:1px solid var(--bdr)}
.glow{border-color:var(--bdr2);box-shadow:0 0 20px ${acRgba(0.08)}}
.chov{transition:all .3s ease}.chov:hover{transform:translateY(-2px);border-color:var(--bdr2);box-shadow:0 8px 40px ${acRgba(0.12)}}
@keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pg{0%,100%{box-shadow:0 0 20px ${acRgba(0.15)}}50%{box-shadow:0 0 40px ${acRgba(0.3)}}}
.au{animation:fu .5s ease-out both}
.hero{background:linear-gradient(135deg,${acRgba(0.12)},rgba(6,182,212,.08),rgba(245,158,11,.05))}
.mesh{background:radial-gradient(ellipse at 20% 50%,${acRgba(0.08)},transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(6,182,212,.06),transparent 50%)}
.tg{background:linear-gradient(135deg,${acHex},#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.row-se{background:rgba(16,185,129,.04)}.row-ee{background:rgba(239,68,68,.04)}.row-gw{background:rgba(245,158,11,.04)}.row-lc{background:rgba(167,139,250,.04)}
.cell-req{background:rgba(239,68,68,.03)}
.acc-bg{background:${acHex}}.acc-bg-10{background:${acRgba(0.1)}}.acc-text{color:${acHex}}.acc-border{border-color:${acRgba(0.3)}}
${t.isDark ? "" : `.dapp .text-white{color:#1a2035}.dapp .text-slate-200{color:#2a3045}.dapp .text-slate-300{color:#3a4560}.dapp .text-slate-400{color:#5a6580}.dapp .text-slate-500{color:#7a8598}.dapp .text-slate-600{color:#9aa3b8}.dapp .text-slate-700{color:#b8becc}.dapp .border-white\\/5{border-color:rgba(0,0,0,0.06)}.dapp .border-white\\/3{border-color:rgba(0,0,0,0.04)}.dapp .bg-white\\/5{background:rgba(0,0,0,0.03)}.dapp .bg-white\\/3{background:rgba(0,0,0,0.02)}.dapp .hover\\:bg-white\\/5:hover{background:rgba(0,0,0,0.04)}.dapp .hover\\:bg-white\\/2:hover{background:rgba(0,0,0,0.03)}`}
`;
}

function useLoadFont() {
  useEffect(() => {
    if (!document.getElementById("df")) {
      const l = document.createElement("link");
      l.id = "df"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
      document.head.appendChild(l);
    }
  }, []);
}

// ─── MODULES ───
const MODS = [
  { g: "Build", c: "#818cf8", i: [
    { id: "structure-builder", n: "Process Structure Builder", ic: "Layers", d: "Convert raw input to BPMN" },
    { id: "quick-builder", n: "Quick Process Builder", ic: "Zap", d: "Interactive creation" },
    { id: "ai-generator", n: "AI Process Generator", ic: "Brain", d: "Generate from prompt" },
  ]},
  { g: "Analyze", c: "#06b6d4", i: [
    { id: "sap-analyzer", n: "SAP Best Practice Analyzer", ic: "GitCompare", d: "Compare with SAP" },
    { id: "automation-lab", n: "Automation Lab", ic: "Cpu", d: "Find automation" },
    { id: "compare-studio", n: "Compare Studio", ic: "GitCompare", d: "Compare processes" },
    { id: "compliance", n: "Compliance Analyzer", ic: "Shield", d: "Check gaps" },
  ]},
  { g: "Operate", c: "#f59e0b", i: [
    { id: "work-instruction", n: "Work Instructions", ic: "BookOpen", d: "Build L5" },
    { id: "report-generator", n: "Report Generator", ic: "BarChart3", d: "Reports" },
    { id: "hierarchy", n: "Hierarchy Builder", ic: "Network", d: "L0-L5" },
  ]},
  { g: "Govern", c: "#10b981", i: [
    { id: "vault", n: "Vault", ic: "Database", d: "Repository" },
    { id: "dashboard", n: "Dashboard", ic: "BarChart3", d: "Analytics" },
  ]},
];

// ─── RAG SYSTEM ───
const DEFAULT_RAGS = [
  { id: "client", n: "Client RAG", desc: "Client SOPs, existing processes, terminology, IT landscape", color: "#6366f1" },
  { id: "bpmn", n: "BPMN RAG", desc: "BPMN table guidelines, naming conventions, formatting standards", color: "#06b6d4" },
  { id: "as-is", n: "AS-IS RAG", desc: "Industry As-Is process templates and benchmarks", color: "#f59e0b" },
  { id: "best-tobe", n: "BEST TO-BE RAG", desc: "Best practice To-Be process templates", color: "#10b981" },
  { id: "sap-bp", n: "SAP Best Practices", desc: "SAP standard process flows, scope items", color: "#8b5cf6" },
  { id: "sap-knowledge", n: "SAP Knowledge", desc: "T-Codes, Fiori apps, SAP configuration, screen references", color: "#f43f5e" },
  { id: "retail", n: "Retail RAG (YRC)", desc: "YRC retail-specific processes. Only for Retail clients, not Enterprise/SAP", color: "#f97316" },
];

const ALL_MODULES = [
  { id: "structure-builder", n: "Process Structure Builder", modes: ["Build As-Is", "Build To-Be"] },
  { id: "quick-builder", n: "Quick Process Builder", modes: ["Build As-Is", "Build To-Be"] },
  { id: "ai-generator", n: "AI Process Generator", modes: ["Build As-Is", "Build To-Be"] },
  { id: "sap-analyzer", n: "SAP Best Practice Analyzer", modes: ["Analyze"] },
  { id: "automation-lab", n: "Automation Lab", modes: ["Analyze"] },
  { id: "compare-studio", n: "Compare Studio", modes: ["Compare"] },
  { id: "compliance", n: "Compliance Analyzer", modes: ["Analyze"] },
  { id: "work-instruction", n: "Work Instructions", modes: ["Generate"] },
  { id: "report-generator", n: "Report Generator", modes: ["Generate"] },
  { id: "hierarchy", n: "Hierarchy Builder", modes: ["Generate"] },
];

const DEFAULT_ORCH = {
  "structure-builder|Build As-Is": [
    { ragId: "client", mandatory: true, role: "Context" },
    { ragId: "bpmn", mandatory: true, role: "Guidelines" },
    { ragId: "as-is", mandatory: false, role: "Reference" },
  ],
  "structure-builder|Build To-Be": [
    { ragId: "bpmn", mandatory: true, role: "Guidelines" },
    { ragId: "sap-bp", mandatory: true, role: "Reference" },
    { ragId: "sap-knowledge", mandatory: false, role: "Enrichment" },
    { ragId: "client", mandatory: true, role: "Context" },
  ],
  "quick-builder|Build As-Is": [
    { ragId: "client", mandatory: true, role: "Context" },
    { ragId: "bpmn", mandatory: true, role: "Guidelines" },
  ],
  "quick-builder|Build To-Be": [
    { ragId: "bpmn", mandatory: true, role: "Guidelines" },
    { ragId: "best-tobe", mandatory: true, role: "Reference" },
    { ragId: "client", mandatory: false, role: "Context" },
  ],
  "ai-generator|Build As-Is": [
    { ragId: "bpmn", mandatory: true, role: "Guidelines" },
    { ragId: "as-is", mandatory: false, role: "Reference" },
  ],
  "ai-generator|Build To-Be": [
    { ragId: "bpmn", mandatory: true, role: "Guidelines" },
    { ragId: "sap-bp", mandatory: true, role: "Reference" },
    { ragId: "best-tobe", mandatory: false, role: "Reference" },
  ],
  "sap-analyzer|Analyze": [
    { ragId: "sap-bp", mandatory: true, role: "Reference" },
    { ragId: "sap-knowledge", mandatory: true, role: "Enrichment" },
    { ragId: "client", mandatory: false, role: "Context" },
  ],
  "automation-lab|Analyze": [
    { ragId: "client", mandatory: true, role: "Context" },
    { ragId: "bpmn", mandatory: false, role: "Guidelines" },
    { ragId: "sap-knowledge", mandatory: false, role: "Enrichment" },
  ],
  "compare-studio|Compare": [
    { ragId: "client", mandatory: true, role: "Context" },
    { ragId: "sap-bp", mandatory: false, role: "Reference" },
    { ragId: "bpmn", mandatory: true, role: "Guidelines" },
  ],
  "compliance|Analyze": [
    { ragId: "client", mandatory: true, role: "Context" },
    { ragId: "bpmn", mandatory: true, role: "Guidelines" },
    { ragId: "sap-bp", mandatory: false, role: "Reference" },
  ],
  "work-instruction|Generate": [
    { ragId: "client", mandatory: true, role: "Context" },
    { ragId: "bpmn", mandatory: true, role: "Guidelines" },
  ],
  "report-generator|Generate": [
    { ragId: "client", mandatory: true, role: "Context" },
    { ragId: "bpmn", mandatory: false, role: "Guidelines" },
  ],
  "hierarchy|Generate": [
    { ragId: "client", mandatory: true, role: "Context" },
    { ragId: "bpmn", mandatory: true, role: "Guidelines" },
    { ragId: "sap-bp", mandatory: false, role: "Reference" },
  ],
};

const DEFAULT_GUIDELINES = {
  bpmn: "- All BPMN tables must follow the 29-column format defined in the BPMN Prompt\n- Milestone text must be copied exactly from source — no paraphrasing\n- Decision gateways must use G# with helper rows G1A/G1B for branches\n- Loop connectors use LC# with Milestone = dash\n- Control IDs follow C01, C02, C03 format\n- L5 UIDs follow Module-TCODE-Screen_Name-Suffix pattern\n- Empty is always better than guessed for metadata columns",
  client: "",
  "as-is": "",
  "best-tobe": "",
  "sap-bp": "- Reference SAP Best Practice Explorer scope items where applicable\n- Map standard SAP process flows to BPMN structure\n- Include relevant T-Codes and Fiori Apps from SAP standard",
  "sap-knowledge": "- T-Code references must be real SAP transaction codes\n- Fiori App names must reference actual SAP Fiori library entries\n- Do not fabricate T-Codes or Fiori Apps",
  retail: "- Retail-specific processes follow YRC standards\n- Not applicable for Enterprise/SAP transformation clients",
};

// Mutable state holders (modified by Admin)
let ragSources = [...DEFAULT_RAGS];
let ragOrch = JSON.parse(JSON.stringify(DEFAULT_ORCH));
let ragGuidelines = { ...DEFAULT_GUIDELINES };
let ragDocs = {}; // ragId -> [{name, size}] placeholder for uploaded docs

const SAMPLE = "Accounts Payable - Invoice Processing\n\n1. Invoice received from vendor via email or portal\n2. AP Clerk verifies invoice (3-way match: PO, GRN, Invoice) in SAP using MIRO. TAT: 1 day.\n3. Decision: Does invoice match PO and GRN?\n   - Yes: Proceed to posting\n   - No: Return to vendor (Email). TAT: 2 days. Loop back to step 2.\n4. AP Clerk posts invoice in SAP (FB60)\n5. Submit for payment approval per DOA\n6. Decision: Is payment approved?\n   - Yes: Execute payment run (F110)\n   - No: Invoice rejected\n7. End: Payment completed\n\nControls:\n- C01: 3-way match validation\n- C02: Posting authorization\n- C03: DOA approval routing";

// ─── API ───
let BPMN_PROMPT = [
"You are my BPMN-to-Signavio table generator.",
"",
"I will paste a process description in raw text, semi-structured text, or a messy table.",
"Your job is to convert it into ONE single markdown table using EXACTLY these columns in EXACTLY this order:",
"",
"| Seq | Milestone | Connect to | Color Key / Execution Mode | BPMN Element Type | Responsible | Annotation | TAT | IT System | Documentation | Input Data | Output Data | Task Type | T-Code | Fiori App | Control ID | L5 Details (Yes/No) | L5 UID (T-Code) | L5 UID (Fiori App) | Department | Ref SOP | Accountable | Consulted | Informed | Risk | API Integration | Non Value Added | Measurable Efficiency | Measurable Effectiveness |",
"",
"STRICT RULES",
"0. Critical review priority rule: I will mainly review Seq, Milestone, Connect to. Be extra strict with all other columns. If uncertain, blank is always better than wrong. Never park uncertain text in Annotation, Input Data, Output Data, Documentation.",
"",
"1. Milestone: Copy source text exactly. Do not rewrite, simplify, paraphrase, correct grammar, or standardize wording.",
"",
"2. Allowed Seq formats: S# = Start Event, T# = Task / Sub-Process, G# = XOR Gateway, LC# = Loop Connector, E# = End Event. Every Connect to reference must point to an existing Seq. For decision branches, helper rows G1A, G1B, G2A, G2B may be used.",
"",
"3. Allowed BPMN Element Type values ONLY: Start Event, Task, Sub-Process, XOR Gateway, Loop Connector, End Event.",
"",
"4. Classification logic:",
"A. Real work step: Put exact source text into Milestone. Use Task or Sub-Process. Fill metadata only if clearly available.",
"B. Start triggers: Create separate S# rows.",
"C. XOR decision gateway: Use G#, BPMN Element Type = XOR Gateway. Put gateway question in Milestone. Use helper rows G1A/G1B with branch text (Yes/No/Approved/Rejected) in Milestone. Put only next target Seq in Connect to.",
"D. Loop / return flow: Create LC# row, Milestone = dash, Connect to = return target, BPMN Element Type = Loop Connector. Leave Annotation blank. Do not write loop to T4 or return to T4 in any column.",
"E. End-state: Convert to E# row, BPMN Element Type = End Event.",
"",
"5. Connect to rules: Every value must reference valid existing Seq. No explanatory text. Do not invent missing nodes.",
"",
"6. Column isolation rule (very strict): A text fragment must go ONLY into its correct column. Never copy same detail into wrong column. Do not place input lists in Annotation. Do not place annotation notes in Input Data. Do not use Annotation as a dump field. If uncertain, leave blank.",
"",
"7. Annotation: Only for validations, control logic, business rules, dependency notes. Keep concise. Do not duplicate Milestone.",
"",
"8. TAT: Only for actual turnaround time / SLA if explicitly provided.",
"",
"9. Color Key / Execution Mode: Allowed values ONLY: Manual, Semi-Automatic, Automatic, AI. Fill only for Task/Sub-Process rows. Leave blank for events and gateways.",
"",
"10. Documentation: Populate only when source clearly provides document name, template name, SOP reference.",
"",
"11. Input Data: Only actual input documents, triggers, forms, records consumed by that step. Do not copy into Annotation.",
"",
"12. Output Data: Only immediate output of that specific step. Do not put future downstream outcomes.",
"",
"13. IT System: Populate only if explicitly stated or strongly implied.",
"",
"14. Task Type: User, Manual, Script when logical. If unclear, leave blank.",
"",
"15. AI-enhanced L5 columns: T-Code, Fiori App, L5 Details (Yes/No), L5 UID (T-Code), L5 UID (Fiori App).",
"A. SAP GUI: Populate T-Code, L5 Details = Yes, L5 UID (T-Code) format: FI/MM/SD-TCODE-Screen_Name-C001/R001/E001",
"B. SAP Fiori: Populate Fiori App, L5 Details = Yes, L5 UID (Fiori App) format: FI/MM/SD-App_Name-C001/R001/E001",
"C. Conceptual/business step: L5 Details = No, leave T-Code/Fiori/UIDs blank.",
"D. Do not guess unrealistic T-Codes or Fiori Apps.",
"",
"16. L5 UID format: Module-TCODE-Screen_Name-Suffix. C001=create, R001=reporting, E001=edit/display.",
"",
"17. Control ID: Format C01, C02, C03. Unique per control. Same control = same ID. If no clear control, leave blank.",
"",
"18. Other metadata: Department, Ref SOP, Accountable, Consulted, Informed, Risk, API Integration, Non Value Added, Measurable Efficiency, Measurable Effectiveness. Populate only if clearly available. Do not invent.",
"",
"19. No-duplication rule: Do not duplicate same text across Annotation, Documentation, Input Data, Output Data.",
"",
"20. Final validation: Milestone unchanged from source. Column order unchanged. No fake tasks/end events. All Connect to references exist. Seq flow coherent. Loop Connector Milestone = dash. If L5 Details = No then T-Code/Fiori/UIDs must be blank. Only allowed BPMN Element Types.",
"",
"24. Control ID generation: C01, C02, C03 format. Sequential. Each control appears once in control table. Reuse same ID if control repeats.",
"",
"25. Built-in Process Controls table: After main table, output Process Controls (Built-In) with columns: | Control ID | Control Area (risk) | Built-In Control | How it's enforced in TO-BE |",
"",
"26. Control table linkage: Every Control ID in BPMN table must appear in Controls table and vice versa.",
"",
"27. Control Area (risk) = short risk phrase. Built-In Control = short control statement. Enforcement must reference exact Milestone text.",
"",
"28. Derive controls only from explicit control statements in source or unavoidable implied controls.",
"",
"29. Final Output Order (Mandatory - exactly 4 sections, nothing else):",
"1. Process Metadata Table (Horizontal, Row 1 = field names, Row 2 = values) with columns:",
"| Document Name | Document Type | Reference Category | Status | Last Updated | Version | Document Owner Code | Keywords (5-10) | Alternate Names | Process Family ID | Process Role | Base Process ID | Variant Reason | Replaced By Process ID | Industry | Vertical | Applicability | Business Size | E2E Process Group | Process Level | Process Area (L2) | Function | Start of Process | Start Excludes (previous 3 steps / areas) | End of Process | End Excludes (next 3 steps / areas) | ERP Product | SAP Applications | Non-SAP Applications | Automation Tools | Target BPM Maturity Level | Automation Level (Human Intervention to Trigger Activities) | Regulatory Context | Geography | Country | Original Doc Link | Final Content Link | Excel Doc Link | Docx Doc Link | Related Documents | Links to Other Processes | Q&A |",
"",
"2. Process Mapping Table (BPMN Table) with the 29 columns listed above.",
"",
"3. Process Controls (Built-In) table.",
"",
"4. Customers: customer 1, customer 2, ... (business functions/teams who receive/use/benefit from the process output, internal first)",
"",
"30. No text before, between, or after these sections.",
"31. Metadata: Row 1 = field names, Row 2 = values. No vertical tables. Start of Process must match first trigger. End of Process must match End Event.",
"32. BPMN graph integrity: Every Connect to must reference existing Seq. No orphan nodes. Start Events connect forward. End Events do not connect onward. Gateways must split into helper rows.",
"33. Loop Connector: Milestone = dash. Annotation blank. Loop description never written.",
"34. Control IDs sequential. Each appears once in control table.",
"35. SAP T-Codes and Fiori Apps only when clearly implied. Never fabricate.",
"36. Automation Mode: Manual (human only), Semi-Automatic (human+system), Automatic (system triggered), AI (AI decision). Gateways/events blank.",
"37. Metadata content must never appear in BPMN columns.",
"38. Column leakage validation: Check each row Milestone/Annotation/Input/Output/Documentation contain only correct type.",
"39. Customers: business roles only, no person names, comma separated, internal first.",
"40. Pre-output validation: Metadata = 2 rows, BPMN = correct column order, Control IDs match both tables, Seq flow coherent, no invented SAP artifacts, loops use LC#, no explanation text."
].join("\n");

function parseMd(md) {
  const ls = md.trim().split("\n").filter(l => l.trim().startsWith("|"));
  if (ls.length < 2) return [];
  const pr = l => l.split("|").slice(1, -1).map(c => c.trim());
  const h = pr(ls[0]);
  const si = ls[1] && ls[1].includes("---") ? 2 : 1;
  const rows = [];
  for (let i = si; i < ls.length; i++) {
    const c = pr(ls[i]);
    if (c.length && !c.every(x => !x || x.includes("---"))) {
      const o = {};
      h.forEach((hh, j) => { o[hh] = c[j] || ""; });
      rows.push(o);
    }
  }
  return rows;
}

function parseAI(rt) {
  const res = { meta: {}, bpmn: [], controls: [], customers: [] };
  const ls = rt.split("\n");
  const ts = [];
  let ct = [];
  let it = false;
  for (const l of ls) {
    const t = l.trim();
    if (t.startsWith("|")) { ct.push(t); it = true; }
    else {
      if (it && ct.length) { ts.push(ct.join("\n")); ct = []; }
      it = false;
      if (t.startsWith("Customers:")) res.customers = t.replace("Customers:", "").split(",").map(c => c.trim()).filter(Boolean);
    }
  }
  if (ct.length) ts.push(ct.join("\n"));
  if (ts[0]) { const m = parseMd(ts[0]); if (m.length) res.meta = m[0]; }
  if (ts[1]) {
    res.bpmn = parseMd(ts[1]).map(r => ({
      Seq: r.Seq || "", Milestone: r.Milestone || "", ConnectTo: r["Connect to"] || "",
      Mode: r["Color Key / Execution Mode"] || "", Type: r["BPMN Element Type"] || "",
      Responsible: r.Responsible || "", Annotation: r.Annotation || "", TAT: r.TAT || "",
      System: r["IT System"] || "", Input: r["Input Data"] || "", Output: r["Output Data"] || "",
      TCode: r["T-Code"] || "", Fiori: r["Fiori App"] || "", ControlID: r["Control ID"] || "",
      L5: r["L5 Details (Yes/No)"] || "", Doc: r.Documentation || "",
      Department: r.Department || "", Risk: r.Risk || "",
    }));
  }
  if (ts[2]) {
    res.controls = parseMd(ts[2]).map(r => ({
      id: r["Control ID"] || "", risk: r["Control Area (risk)"] || "",
      control: r["Built-In Control"] || "", enforcement: r["How it's enforced in TO-BE"] || r["How enforced"] || "",
    }));
  }
  return res;
}

// Gather active guidelines for a module+mode combination
function getActiveGuidelines(moduleId, mode) {
  const key = moduleId + "|" + mode;
  const pipeline = ragOrch[key] || [];
  const parts = [];
  pipeline.forEach(item => {
    const gl = ragGuidelines[item.ragId];
    if (gl && gl.trim()) {
      const rag = ragSources.find(r => r.id === item.ragId);
      parts.push("--- " + (rag ? rag.n : item.ragId) + " Guidelines (Role: " + item.role + ") ---\n" + gl.trim());
    }
  });
  return parts.length > 0 ? "\n\n=== ACTIVE RAG GUIDELINES ===\n" + parts.join("\n\n") + "\n=== END GUIDELINES ===" : "";
}

async function callAPI(input, mode, guidelinesText) {
  const userMsg = "Process Mode: " + mode + "\n\nConvert:\n\n" + input + (guidelinesText || "");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 8000, system: BPMN_PROMPT,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error("API " + r.status + ": " + (e.error?.message || r.statusText));
  }
  const d = await r.json();
  return d.content.filter(i => i.type === "text").map(i => i.text).join("\n");
}

// ─── BPMN TYPES & MODES (configurable) ───
let BPMN_TYPES = [
  { id: "Start Event", prefix: "S", shape: "circle", color: "#16a34a", modeDefault: "" },
  { id: "Timer Start Event", prefix: "TS", shape: "circle-clock", color: "#059669", modeDefault: "" },
  { id: "Message Start Event", prefix: "MS", shape: "circle-envelope", color: "#0d9488", modeDefault: "" },
  { id: "Task", prefix: "T", shape: "rect", color: "#0ea5e9", modeDefault: "" },
  { id: "User Task", prefix: "T", shape: "rect-person", color: "#2563eb", modeDefault: "User" },
  { id: "Manual Task", prefix: "T", shape: "rect-hand", color: "#4f46e5", modeDefault: "Manual" },
  { id: "Service Task", prefix: "T", shape: "rect-gear", color: "#7c3aed", modeDefault: "Automatic" },
  { id: "Script Task", prefix: "T", shape: "rect-script", color: "#9333ea", modeDefault: "Automatic" },
  { id: "Sub-Process", prefix: "T", shape: "rect-double", color: "#3b82f6", modeDefault: "" },
  { id: "Call Activity", prefix: "T", shape: "rect-bold", color: "#1d4ed8", modeDefault: "" },
  { id: "XOR Gateway", prefix: "G", shape: "diamond", color: "#f59e0b", modeDefault: "" },
  { id: "AND Gateway", prefix: "PG", shape: "diamond-plus", color: "#3b82f6", modeDefault: "" },
  { id: "OR Gateway", prefix: "OG", shape: "diamond-circle", color: "#8b5cf6", modeDefault: "" },
  { id: "Event-Based Gateway", prefix: "EG", shape: "diamond-penta", color: "#6366f1", modeDefault: "" },
  { id: "Intermediate Timer Event", prefix: "IT", shape: "double-circle-clock", color: "#d97706", modeDefault: "" },
  { id: "Intermediate Message Event", prefix: "IM", shape: "double-circle-env", color: "#0891b2", modeDefault: "" },
  { id: "Loop Connector", prefix: "LC", shape: "circle-arrow", color: "#8b5cf6", modeDefault: "" },
  { id: "End Event", prefix: "E", shape: "circle-bold", color: "#ef4444", modeDefault: "" },
  { id: "Error End Event", prefix: "EE", shape: "circle-lightning", color: "#dc2626", modeDefault: "" },
  { id: "Terminate End Event", prefix: "TE", shape: "circle-filled", color: "#991b1b", modeDefault: "" },
  { id: "Condition Expression", prefix: "CE", shape: "pill", color: "#64748b", modeDefault: "" },
];

let EXEC_MODES = [
  { id: "Manual", typeDefault: "Manual Task" },
  { id: "User", typeDefault: "User Task" },
  { id: "Automatic", typeDefault: "Script Task" },
  { id: "Semi-Automatic", typeDefault: "Script Task" },
  { id: "AI", typeDefault: "Script Task" },
];

const modeToType = (mode) => { const m = EXEC_MODES.find(x => x.id === mode); return m ? m.typeDefault : ""; };
const typeToMode = (type) => { const t = BPMN_TYPES.find(x => x.id === type); return t ? t.modeDefault : ""; };
const typePrefix = (type) => { const t = BPMN_TYPES.find(x => x.id === type); return t ? t.prefix : "T"; };
const typeColor = (type) => { const t = BPMN_TYPES.find(x => x.id === type); return t ? t.color : "#666"; };

// ─── ROW COLORS (grouped by category) ───
const _RC_GREEN = { light: "200,237,200", dark: "rgba(16,185,129,.07)", excel: "#C6EFCE" };
const _RC_RED = { light: "252,210,220", dark: "rgba(239,68,68,.07)", excel: "#F4CCCC" };
const _RC_ORANGE = { light: "255,235,210", dark: "rgba(245,158,11,.07)", excel: "#FFE699" };
const _RC_GREY = { light: "235,235,235", dark: "rgba(150,150,150,.06)", excel: "#F0F0F0" };
const _RC_WHITE = { light: null, dark: null, excel: null };

const ROW_COLORS = {};
BPMN_TYPES.forEach(t => {
  const id = t.id;
  let rc;
  // White: generic Task only
  if (id === "Task") rc = _RC_WHITE;
  // Light grey: specific task types
  else if (["Manual Task", "User Task", "Service Task", "Script Task", "Sub-Process", "Call Activity"].includes(id)) rc = _RC_GREY;
  // Soft green: all start events
  else if (id.includes("Start Event")) rc = _RC_GREEN;
  // Soft red: all end events
  else if (id.includes("End Event")) rc = _RC_RED;
  // Soft orange: gateways, conditions, intermediates, loop connector
  else if (id.includes("Gateway") || id === "Condition Expression" || id.includes("Intermediate") || id === "Loop Connector") rc = _RC_ORANGE;
  // Fallback
  else rc = _RC_WHITE;

  ROW_COLORS[id] = { light: rc.light, dark: rc.dark, excel: rc.excel, badge: t.color };
});

// ─── EXPORT ───
function exportBpmnExcel(bpmn) {
  var CL = "<" + "/";
  var cols = Object.keys(bpmn[0] || {});
  var html = "<table><thead><tr>" + cols.map(function(c) { return "<th style='font-weight:bold;background:#f0f0f0'>" + c + CL + "th>"; }).join("") + CL + "tr>" + CL + "thead><tbody>";
  bpmn.forEach(function(r) {
    var rc = ROW_COLORS[r.Type];
    var bg = rc && rc.excel ? "background:" + rc.excel : "";
    html += "<tr>" + cols.map(function(c) { return "<td style='" + bg + "'>" + (r[c] || "") + CL + "td>"; }).join("") + CL + "tr>";
  });
  html += CL + "tbody>" + CL + "table>";
  var div = document.createElement("div"); div.innerHTML = html;
  var ws = XLSX.utils.table_to_sheet(div.querySelector("table"));
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BPMN Table");
  XLSX.writeFile(wb, "Delta_BPMN_Table.xlsx");
}

function exportAllExcel(result) {
  var CL = "<" + "/";
  var wb = XLSX.utils.book_new();
  if (result.meta && Object.keys(result.meta).length > 0) {
    var metaRows = Object.entries(result.meta).map(function(e) { return { Field: e[0], Value: e[1] || "" }; });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(metaRows), "Metadata");
  }
  if (result.bpmn && result.bpmn.length > 0) {
    var cols = Object.keys(result.bpmn[0] || {});
    var html = "<table><thead><tr>" + cols.map(function(c) { return "<th style='font-weight:bold;background:#f0f0f0'>" + c + CL + "th>"; }).join("") + CL + "tr>" + CL + "thead><tbody>";
    result.bpmn.forEach(function(r) {
      var rc = ROW_COLORS[r.Type];
      var bg = rc && rc.excel ? "background:" + rc.excel : "";
      html += "<tr>" + cols.map(function(c) { return "<td style='" + bg + "'>" + (r[c] || "") + CL + "td>"; }).join("") + CL + "tr>";
    });
    html += CL + "tbody>" + CL + "table>";
    var div = document.createElement("div"); div.innerHTML = html;
    XLSX.utils.book_append_sheet(wb, XLSX.utils.table_to_sheet(div.querySelector("table")), "BPMN Table");
  }
  if (result.controls && result.controls.length > 0) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(result.controls), "Controls");
  }
  if (result.customers && result.customers.length > 0) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(result.customers.map(function(c) { return { Customer: c }; })), "Customers");
  }
  XLSX.writeFile(wb, "Delta_Process_Complete.xlsx");
}

function doValidate(b, c) {
  const v = [];
  const seqs = new Set(b.map(r => r.Seq));

  // Build incoming/outgoing counts
  const outgoing = {}; const incoming = {};
  b.forEach(r => { outgoing[r.Seq] = 0; incoming[r.Seq] = 0; });
  b.forEach(r => {
    if (!r.ConnectTo) return;
    const targets = r.ConnectTo.split(",").map(s => s.trim()).filter(Boolean);
    outgoing[r.Seq] = targets.length;
    targets.forEach(t => {
      if (seqs.has(t)) incoming[t] = (incoming[t] || 0) + 1;
      else v.push({ t: "danger", m: r.Seq + ": connects to non-existent " + t });
    });
  });

  // 1. No floating nodes
  b.forEach(r => {
    if ((outgoing[r.Seq] || 0) === 0 && (incoming[r.Seq] || 0) === 0 && b.length > 1) {
      v.push({ t: "danger", m: r.Seq + " (" + r.Type + "): Floating node — not connected to any flow" });
    }
  });

  // 2. Start Event: 0 incoming, 1 outgoing
  b.filter(r => r.Type.includes("Start")).forEach(r => {
    if (incoming[r.Seq] > 0) v.push({ t: "warning", m: r.Seq + ": Start Event has " + incoming[r.Seq] + " incoming flows (should be 0)" });
    if (outgoing[r.Seq] !== 1) v.push({ t: "warning", m: r.Seq + ": Start Event has " + (outgoing[r.Seq] || 0) + " outgoing flows (should be 1)" });
  });

  // 3. Task types: exactly 1 incoming and 1 outgoing
  const taskTypes = ["Task", "User Task", "Manual Task", "Service Task", "Script Task", "Sub-Process", "Call Activity"];
  b.filter(r => taskTypes.includes(r.Type)).forEach(r => {
    if ((incoming[r.Seq] || 0) !== 1) v.push({ t: "warning", m: r.Seq + ": " + r.Type + " has " + (incoming[r.Seq] || 0) + " incoming (should be 1)" });
    if ((outgoing[r.Seq] || 0) !== 1) v.push({ t: "warning", m: r.Seq + ": " + r.Type + " has " + (outgoing[r.Seq] || 0) + " outgoing (should be 1)" });
  });

  // 4. Gateways: 1-in/N-out (split) OR N-in/1-out (merge)
  b.filter(r => r.Type.includes("Gateway")).forEach(r => {
    const inc = incoming[r.Seq] || 0, out = outgoing[r.Seq] || 0;
    const isSplit = inc === 1 && out >= 2;
    const isMerge = inc >= 2 && out === 1;
    const isSingle = inc === 1 && out === 1;
    if (!isSplit && !isMerge && !isSingle) {
      v.push({ t: "warning", m: r.Seq + ": Gateway has " + inc + " in / " + out + " out — should be 1:N (split) or N:1 (merge)" });
    }
  });

  // 5. End Event: 1 incoming, 0 outgoing
  b.filter(r => r.Type.includes("End")).forEach(r => {
    if ((incoming[r.Seq] || 0) < 1) v.push({ t: "warning", m: r.Seq + ": End Event has 0 incoming (should be at least 1)" });
    if ((outgoing[r.Seq] || 0) > 0) v.push({ t: "warning", m: r.Seq + ": End Event has " + outgoing[r.Seq] + " outgoing flows (should be 0)" });
  });

  // 6. Only gateways should split (tasks with >1 outgoing)
  b.filter(r => !r.Type.includes("Gateway") && !r.Type.includes("Start") && (outgoing[r.Seq] || 0) > 1).forEach(r => {
    v.push({ t: "warning", m: r.Seq + ": " + r.Type + " has " + outgoing[r.Seq] + " outgoing — only Gateways should split flow" });
  });

  // 7. Check for balanced gateways (each split should have a matching merge)
  const splitGWs = b.filter(r => r.Type.includes("Gateway") && (outgoing[r.Seq] || 0) >= 2);
  const mergeGWs = b.filter(r => r.Type.includes("Gateway") && (incoming[r.Seq] || 0) >= 2);
  if (splitGWs.length > 0 && mergeGWs.length === 0) {
    v.push({ t: "info", m: splitGWs.length + " split gateway(s) found but no merge gateways — branches should reconverge or end at separate End Events" });
  }

  // Summary
  const dangers = v.filter(x => x.t === "danger").length;
  const warnings = v.filter(x => x.t === "warning").length;
  if (dangers === 0 && warnings === 0) v.push({ t: "success", m: "All BPMN flow rules pass" });
  if (dangers === 0 && v.every(x => x.t !== "danger")) v.push({ t: "success", m: "All Connect-to refs valid" });
  v.push({ t: "info", m: b.length + " rows, " + b.filter(r => taskTypes.includes(r.Type)).length + " tasks, " + b.filter(r => r.Type.includes("Gateway")).length + " gateways, " + c.length + " controls" });
  return v;
}

// ─── PRIMITIVES ───
function Bg({ children, v = "default", c = "" }) {
  const s = { default: "bg-white/5 text-slate-300 border border-white/10", success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20", info: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20", primary: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20", ghost: "bg-transparent text-slate-500 border border-white/5", danger: "bg-red-500/10 text-red-400 border border-red-500/20" };
  return <span className={"inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium " + (s[v] || s.default) + " " + c}>{children}</span>;
}
function Bt({ children, v = "primary", sz = "md", onClick, disabled, c = "", icon: I }) {
  const st = { primary: "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-900/20", secondary: "gl text-slate-200 hover:border-indigo-500/30", ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white" };
  const szz = { sm: "px-2.5 py-1 text-[11px]", md: "px-4 py-2 text-sm", lg: "px-7 py-3 text-base" };
  return <button onClick={onClick} disabled={disabled} className={"inline-flex items-center gap-2 rounded-xl font-medium transition-all " + (st[v] || st.primary) + " " + (szz[sz] || szz.md) + " " + (disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer") + " " + c}>{I && <I size={sz === "sm" ? 13 : 16} />}{children}</button>;
}
function Cd({ children, c = "", onClick, hover, glow }) {
  return <div onClick={onClick} className={"rounded-2xl gl " + (hover ? "chov cursor-pointer " : "") + (glow ? "glow " : "") + c}>{children}</div>;
}
function SB({ steps, current, onStep }) {
  return (
    <div className="flex items-center gap-1.5 px-6 py-3 gl2 border-b border-white/5 overflow-x-auto">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => onStep && i <= current && onStep(i)}
            className={"flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all " +
              (i === current ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white" :
               i < current ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
               "bg-white/3 text-slate-500 border border-white/5")}>
            {i < current ? <CheckCircle2 size={13} /> : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">{i + 1}</span>}
            {s}
          </button>
          {i < steps.length - 1 && <ChevronRight size={11} className="text-slate-700 shrink-0" />}
        </div>
      ))}
    </div>
  );
}
function TB({ tabs, active, onChange }) {
  return (
    <div className="flex px-5 overflow-x-auto border-b border-white/5">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={"px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap shrink-0 " +
            (active === t.id ? "border-indigo-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300")}>
          {t.label}
          {t.count != null && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/5">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

// ─── SIDEBAR ───
function Side({ cur, set, col, tog, theme, accent, setTheme, setAccent }) {
  const [op, setOp] = useState({ Build: true, Analyze: true, Operate: true, Govern: true });
  const [showTheme, setShowTheme] = useState(false);
  const t = THEMES[theme] || THEMES.midnight;
  const ac = ACCENTS.find(a => a.id === accent) || ACCENTS[0];
  return (
    <div className={"h-screen flex flex-col border-r border-white/5 transition-all shrink-0 " + (col ? "w-16" : "w-64")} style={{ background: t.sidebar }}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0" style={{ background: "linear-gradient(135deg," + ac.color + ",#06b6d4)" }}>D</div>
        {!col && <div><span className={"text-base font-bold " + (t.isDark ? "text-white" : "text-slate-800")}>Delta</span><p className="text-[9px] text-slate-500 uppercase">BPM Workbench</p></div>}
        <button onClick={tog} className="ml-auto text-slate-600 hover:text-white">{col ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}</button>
      </div>
      <div className="px-2 py-2 border-b border-white/5">
        {[{ id: "home", n: "Home", I: Home }, { id: "clients", n: "Clients", I: Building2 }].map(x => (
          <button key={x.id} onClick={() => set(x.id)} className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all " + (cur === x.id ? "acc-bg-10 acc-text" : "text-slate-400 hover:text-white hover:bg-white/5")}>
            <x.I size={18} className="shrink-0" />{!col && <span className="font-medium">{x.n}</span>}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {MODS.map(g => (
          <div key={g.g} className="mb-1">
            {!col && <button onClick={() => setOp(p => ({ ...p, [g.g]: !p[g.g] }))} className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600 hover:text-slate-400"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: g.c }} />{g.g}<ChevronDown size={10} className={"ml-auto transition-transform " + (op[g.g] ? "" : "-rotate-90")} /></button>}
            {(col || op[g.g]) && g.i.map(m => {
              const Ic = IM[m.ic] || Box;
              return <button key={m.id} onClick={() => set(m.id)} title={col ? m.n : undefined} className={"w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all " + (cur === m.id ? "acc-bg-10 acc-text" : "text-slate-500 hover:text-slate-200 hover:bg-white/3")}><Ic size={16} className="shrink-0" />{!col && <span className="truncate">{m.n}</span>}</button>;
            })}
          </div>
        ))}
      </div>
      {/* Theme + Admin footer */}
      <div className="px-2 py-2 border-t border-white/5 space-y-1">
        {/* Theme toggle */}
        <div className="relative">
          <button onClick={() => setShowTheme(!showTheme)} className={"w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all " + (showTheme ? "acc-bg-10 acc-text" : "text-slate-500 hover:text-white hover:bg-white/5")}>
            <span className="shrink-0 text-base">{t.isDark ? "\u263E" : "\u2600"}</span>
            {!col && <span className="font-medium">Theme</span>}
            {!col && <div className="ml-auto w-3 h-3 rounded-full acc-border" style={{ background: ac.color }} />}
          </button>
          {showTheme && !col && (
            <div className="absolute bottom-full left-0 mb-2 w-60 gl2 rounded-2xl shadow-2xl p-4 z-50">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Mode</p>
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {Object.entries(THEMES).map(([k, v]) => (
                  <button key={k} onClick={() => setTheme(k)}
                    className={"flex items-center gap-2 px-2.5 py-2 rounded-xl text-[11px] font-medium transition-all border " +
                      (theme === k ? "acc-bg-10 acc-text acc-border" : "border-white/5 text-slate-400 hover:text-white hover:border-white/10")}>
                    <span className="text-sm">{v.isDark ? "\u263E" : "\u2600"}</span>
                    {v.name}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Accent Color</p>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map(a => (
                  <button key={a.id} onClick={() => setAccent(a.id)} title={a.name}
                    className={"w-7 h-7 rounded-lg transition-all " + (accent === a.id ? "ring-2 ring-white/30 scale-110" : "hover:scale-110")}
                    style={{ background: a.color }} />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Admin */}
        <button onClick={() => set("admin")} className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all " + (cur === "admin" ? "acc-bg-10 acc-text" : "text-slate-500 hover:text-white hover:bg-white/5")}><Lock size={16} className="shrink-0" />{!col && <span className="font-medium">Admin</span>}</button>
      </div>
    </div>
  );
}

// ─── HOME ───
function HP({ go }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="hero px-8 pt-8 pb-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto au">
          <p className="text-sm text-indigo-400 font-medium mb-2">DELTA BPM WORKBENCH</p>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Your AI-powered process engineering command center</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[{ l: "Processes", v: "24", I: Workflow, c: "#6366f1" }, { l: "In Vault", v: "18", I: Database, c: "#06b6d4" }, { l: "AI Runs", v: "142", I: Sparkles, c: "#f59e0b" }, { l: "Modules", v: "11", I: Box, c: "#10b981" }].map(s => (
              <div key={s.l} className="gl rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.c + "15" }}><s.I size={20} style={{ color: s.c }} /></div><TrendingUp size={14} className="text-emerald-500" /></div>
                <p className="text-2xl font-bold text-white">{s.v}</p>
                <p className="text-xs text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-8 py-8 max-w-6xl mx-auto">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[{ n: "New Process", ic: Plus, gr: "from-indigo-600 to-violet-600", to: "structure-builder" }, { n: "AI Generate", ic: Brain, gr: "from-cyan-600 to-blue-600", to: "ai-generator" }, { n: "Compare", ic: GitCompare, gr: "from-amber-600 to-orange-600", to: "compare-studio" }, { n: "Vault", ic: Database, gr: "from-emerald-600 to-teal-600", to: "vault" }].map(a => (
            <Cd key={a.n} hover onClick={() => go(a.to)} c="p-5 group">
              <div className={"w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 transition-transform group-hover:scale-110 " + a.gr}><a.ic size={20} className="text-white" /></div>
              <h3 className="font-semibold text-white text-sm">{a.n}</h3>
              <ArrowRight size={14} className="text-slate-600 mt-3 transition-transform group-hover:translate-x-1 group-hover:text-indigo-400" />
            </Cd>
          ))}
        </div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">All Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {MODS.flatMap(g => g.i).map(m => {
            const Ic = IM[m.ic] || Box;
            return (
              <Cd key={m.id} hover onClick={() => go(m.id)} c="p-3 flex items-center gap-3 group">
                <Ic size={16} className="text-indigo-400 shrink-0" />
                <div><p className="text-sm text-slate-300 group-hover:text-white">{m.n}</p><p className="text-[10px] text-slate-600">{m.d}</p></div>
              </Cd>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── EDITABLE BPMN TABLE ───

const COLS = [
  { k: "Seq", l: "Seq", d: true, w: 55 }, { k: "Milestone", l: "Milestone", d: true, w: 280 },
  { k: "ConnectTo", l: "Connect To", d: true, w: 90 }, { k: "Mode", l: "Mode", d: true, w: 115 },
  { k: "Type", l: "BPMN Type", d: true, w: 110 }, { k: "Responsible", l: "Who", d: true, w: 110 },
  { k: "Friction", l: "Friction", d: true, w: 160 },
  { k: "PathType", l: "Path Type", d: true, w: 110 },
  { k: "Annotation", l: "Annotation", d: true, w: 180 }, { k: "System", l: "System", d: true, w: 85 },
  { k: "Input", l: "Input Data", d: true, w: 160 }, { k: "Output", l: "Output Data", d: true, w: 160 },
  { k: "TCode", l: "T-Code", d: true, w: 80 }, { k: "ControlID", l: "Ctrl ID", d: true, w: 70 },
  { k: "TAT", l: "TAT", d: false, w: 65 }, { k: "Doc", l: "Docs", d: false, w: 140 },
  { k: "Fiori", l: "Fiori", d: false, w: 100 }, { k: "L5", l: "L5", d: false, w: 50 },
  { k: "Department", l: "Dept", d: false, w: 100 }, { k: "Risk", l: "Risk", d: false, w: 110 },
];

const FRICTION_TYPES = [
  { id: "Manual", color: "#6366f1", icon: "\u270B" },
  { id: "Approval", color: "#f59e0b", icon: "\u2714" },
  { id: "Handoff", color: "#3b82f6", icon: "\u21C4" },
  { id: "External Dependency", color: "#ef4444", icon: "\u26A0" },
  { id: "Rework Loop", color: "#8b5cf6", icon: "\u21BB" },
  { id: "System Integration", color: "#06b6d4", icon: "\u2699" },
];

const PATH_TYPES = [
  { id: "Happy Path", icon: "\uD83D\uDE42", color: "#10b981" },
];

// ─── BPMN TABLE THEMES ───
const TBL_THEMES = {
  warmlight: { name: "Warmlight", bg: "#faf8f2", headerBg: "#f0ece0", text: "#2a2418", textSec: "#6b6050", textMuted: "#a89e8a", border: "rgba(160,140,100,.12)", hoverBg: "rgba(160,140,100,.06)", focusRing: "#b8860b", isDark: false },
  daylight: { name: "Daylight", bg: "#ffffff", headerBg: "#f5f7fa", text: "#1a2035", textSec: "#5a6580", textMuted: "#9aa3b8", border: "rgba(99,120,180,.1)", hoverBg: "rgba(99,120,180,.04)", focusRing: "#4f46e5", isDark: false },
  night: { name: "Night", bg: "#0a0e1a", headerBg: "rgba(10,14,26,.95)", text: "#e8ecf4", textSec: "#7b8bb2", textMuted: "#4a5578", border: "rgba(56,78,134,.15)", hoverBg: "rgba(255,255,255,.02)", focusRing: "#6366f1", isDark: true },
};
const TBL_FONTS = [
  { id: "outfit", n: "Outfit", css: "'Outfit',system-ui,sans-serif" },
  { id: "system", n: "System", css: "system-ui,-apple-system,sans-serif" },
  { id: "georgia", n: "Georgia", css: "Georgia,'Times New Roman',serif" },
  { id: "palatino", n: "Palatino", css: "'Palatino Linotype','Book Antiqua',Palatino,serif" },
  { id: "mono", n: "Mono", css: "'JetBrains Mono',monospace" },
];
const TBL_FSIZES = [{ id: "sm", n: "S", px: 11 }, { id: "md", n: "M", px: 13 }, { id: "lg", n: "L", px: 15 }];

function BpmnTbl({ data, onChange, prefs, onPrefs }) {
  const [rows, setRows] = useState(data);
  const [cw, setCw] = useState(() => { const w = {}; COLS.forEach(c => { w[c.k] = c.w; }); return w; });
  const [vis, setVis] = useState(() => COLS.filter(c => c.d).map(c => c.k));
  const [editing, setEditing] = useState(false);
  const [focus, setFocus] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [origVal, setOrigVal] = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [fs, setFs] = useState(false);
  const [srch, setSrch] = useState("");
  const [srchHL, setSrchHL] = useState(false);
  const [colPick, setColPick] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [valErr, setValErr] = useState(null);
  const [copyMsg, setCopyMsg] = useState(null);
  const [iClip, setIClip] = useState("");

  // Preferences from parent (persisted in SBuilder, no flash on tab switch)
  const tt = prefs.tt; const ci2State = prefs.ci; const fsz = prefs.fsz; const ff = prefs.ff; const grid = prefs.grid;
  const setTt = (v) => { const p = { ...prefs, tt: v }; onPrefs(p); try { localStorage.setItem("bpmn-table-prefs", JSON.stringify(p)); } catch(e) {} };
  const setCi = (v) => { const p = { ...prefs, ci: v }; onPrefs(p); try { localStorage.setItem("bpmn-table-prefs", JSON.stringify(p)); } catch(e) {} };
  const setFsz = (v) => { const p = { ...prefs, fsz: v }; onPrefs(p); try { localStorage.setItem("bpmn-table-prefs", JSON.stringify(p)); } catch(e) {} };
  const setFf = (v) => { const p = { ...prefs, ff: v }; onPrefs(p); try { localStorage.setItem("bpmn-table-prefs", JSON.stringify(p)); } catch(e) {} };
  const setGrid = (v) => { const p = { ...prefs, grid: v }; onPrefs(p); try { localStorage.setItem("bpmn-table-prefs", JSON.stringify(p)); } catch(e) {} };
  const ci = ci2State;
  const tblRef = useRef(null);
  const editRef = useRef(null);
  const sxR = useRef(0); const swR = useRef(0);

  useEffect(() => { setRows(data); }, [data]);
  const active = COLS.filter(c => vis.includes(c.k));
  const th = TBL_THEMES[tt];
  const fpx = (TBL_FSIZES.find(f => f.id === fsz) || TBL_FSIZES[1]).px;
  const fcss = (TBL_FONTS.find(f => f.id === ff) || TBL_FONTS[0]).css;

  const rowBg = (type) => {
    const rc = ROW_COLORS[type];
    if (!rc || !rc.light) return "transparent";
    if (th.isDark) return rc.dark || "transparent";
    return "rgba(" + rc.light + "," + (ci / 100) + ")";
  };

  // History (10 levels)
  const pushH = (nr) => { const nh = [...history.slice(0, histIdx + 1), JSON.parse(JSON.stringify(rows))].slice(-10); setHistory(nh); setHistIdx(nh.length - 1); setRows(nr); if (onChange) onChange(nr); };
  const undo = () => { if (histIdx >= 0) { const prev = history[histIdx]; setRows(prev); if (onChange) onChange(prev); setHistIdx(histIdx - 1); } };
  const redo = () => { if (histIdx < history.length - 1) { setHistIdx(histIdx + 1); } };
  const getCellVal = (ri, ci2) => { const col = active[ci2]; return col ? (rows[ri]?.[col.k] || "") : ""; };
  const setCellVal = (ri, ci2, val) => {
    const col = active[ci2]; if (!col) return;
    let nr = rows.map((r, i) => i === ri ? { ...r, [col.k]: val } : r);
    // Bidirectional auto-mapping
    if (col.k === "Mode" && val) { const sugType = modeToType(val); if (sugType) nr = nr.map((r, i) => i === ri ? { ...r, Type: sugType } : r); }
    if (col.k === "Type" && val) { const sugMode = typeToMode(val); if (sugMode) nr = nr.map((r, i) => i === ri ? { ...r, Mode: sugMode } : r); }
    pushH(nr);
  };
  const addRow = (after) => { const nr = [...rows]; nr.splice(after + 1, 0, { Seq: "", Milestone: "", ConnectTo: "", Mode: "", Type: "Task", Responsible: "", Friction: "", PathType: "", Annotation: "", TAT: "", System: "", Input: "", Output: "", TCode: "", Fiori: "", ControlID: "", L5: "", Doc: "", Department: "", Risk: "" }); pushH(nr); setFocus({ r: after + 1, c: focus ? focus.c : 0 }); };
  const delRow = (idx) => { if (rows.length <= 1) return; const nr = rows.filter((_, i) => i !== idx); pushH(nr); const newR = Math.min(idx, nr.length - 1); setFocus({ r: newR, c: focus ? focus.c : 0 }); };
  const dupRow = (idx) => { const nr = [...rows]; nr.splice(idx + 1, 0, { ...rows[idx], Seq: "" }); pushH(nr); setFocus({ r: idx + 1, c: focus ? focus.c : 0 }); };
  const moveRow = (idx, dir) => { const ni = idx + dir; if (ni < 0 || ni >= rows.length) return; const nr = [...rows]; const t = nr[idx]; nr[idx] = nr[ni]; nr[ni] = t; pushH(nr); if (focus) setFocus({ ...focus, r: ni }); };
  // Update Seq: renumber all rows by position and type, update ConnectTo refs
  const updateSeq = () => {
    const counters = {}; const seqMap = {};
    const nr = rows.map(r => {
      const pfx = typePrefix(r.Type);
      counters[pfx] = (counters[pfx] || 0) + 1;
      const newSeq = pfx + counters[pfx];
      if (r.Seq) seqMap[r.Seq] = newSeq;
      return { ...r, Seq: newSeq };
    });
    // Update ConnectTo references
    const final = nr.map(r => {
      if (!r.ConnectTo) return r;
      const updated = r.ConnectTo.split(",").map(s => { const t = s.trim(); return seqMap[t] || t; }).join(",");
      return { ...r, ConnectTo: updated };
    });
    pushH(final);
  };

  const commitEdit = () => {
    if (editMode && focus) {
      const col = active[focus.c];
      // Validate ConnectTo: all values must exist in current Seq list
      if (col && col.k === "ConnectTo" && editVal.trim()) {
        const allSeqs = new Set(rows.map(r => r.Seq).filter(Boolean));
        const parts = editVal.split(",").map(s => s.trim()).filter(Boolean);
        const invalid = parts.filter(p => !allSeqs.has(p));
        if (invalid.length > 0) {
          setValErr("Invalid Seq: " + invalid.join(", ") + " not found");
          setTimeout(() => setValErr(null), 3000);
          setEditMode(null);
          setTimeout(() => { if (tblRef.current) tblRef.current.focus(); }, 0);
          return; // reject — keep original value
        }
      }
      setCellVal(focus.r, focus.c, editVal);
    }
    setEditMode(null);
    setTimeout(() => { if (tblRef.current) tblRef.current.focus(); }, 0);
  };
  const cancelEdit = () => { setEditMode(null); setEditVal(origVal); setTimeout(() => { if (tblRef.current) tblRef.current.focus(); }, 0); };
  const startReplace = (r, c, ch) => { if (!editing) return; setFocus({ r, c }); setOrigVal(getCellVal(r, c)); setEditVal(ch || ""); setEditMode("replace"); };
  const startAppend = (r, c) => { if (!editing) return; const v = getCellVal(r, c); setOrigVal(v); setEditVal(v); setEditMode("append"); };
  const onResize = (k, e) => { e.preventDefault(); sxR.current = e.clientX; swR.current = cw[k]; const mv = ev => setCw(p => ({ ...p, [k]: Math.max(40, swR.current + ev.clientX - sxR.current) })); const up = () => { document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); }; document.addEventListener("mousemove", mv); document.addEventListener("mouseup", up); };

  useEffect(() => {
    const el = tblRef.current; if (!el) return;
    const h = (e) => {
      if (!focus && !editing) return;
      const { r, c } = focus || { r: 0, c: 0 };
      const mR = rows.length - 1, mC = active.length - 1;
      if (editMode) {
        if (e.key === "Escape") { e.preventDefault(); cancelEdit(); return; }
        if (e.key === "Enter") { e.preventDefault(); commitEdit(); setFocus({ r: Math.min(r + 1, mR), c }); return; }
        if (e.key === "Tab") { e.preventDefault(); commitEdit(); setFocus({ r: c >= mC ? Math.min(r + 1, mR) : r, c: c >= mC ? 0 : c + 1 }); return; }
        // Allow Ctrl+C/V/Z/Y even in edit mode
        if ((e.ctrlKey || e.metaKey) && e.key === "v") {
          e.preventDefault();
          if (iClip) { setEditVal(function(prev) { return prev + iClip; }); }
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
          e.preventDefault();
          setEditVal(origVal); // revert to value before F2 was pressed, stay in edit mode
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "y") {
          e.preventDefault(); // let browser handle redo in input natively
          return;
        }
        return;
      }
      if (e.key === "ArrowUp") { e.preventDefault(); if (e.shiftKey && editing) moveRow(r, -1); else setFocus({ r: Math.max(0, r - 1), c }); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); if (e.shiftKey && editing) moveRow(r, 1); else setFocus({ r: Math.min(mR, r + 1), c }); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); setFocus({ r, c: Math.max(0, c - 1) }); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); setFocus({ r, c: Math.min(mC, c + 1) }); return; }
      if (e.key === "Tab") { e.preventDefault(); setFocus({ r: c >= mC ? Math.min(r + 1, mR) : r, c: c >= mC ? 0 : c + 1 }); return; }
      if (e.key === "Enter") { e.preventDefault(); if (editing) startAppend(r, c); else setFocus({ r: Math.min(mR, r + 1), c }); return; }
      if (e.key === "F2") { e.preventDefault(); if (!editing) setEditing(true); startAppend(r, c); return; }
      if (e.key === "Delete") { e.preventDefault(); if (editing) setCellVal(r, c, ""); return; }
      if (e.key === "Escape") { e.preventDefault(); if (fs) setFs(false); else setFocus(null); return; }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") { e.preventDefault(); undo(); return; }
        if (e.key === "y") { e.preventDefault(); redo(); return; }
        if (e.key === "c") {
          e.preventDefault();
          var val = getCellVal(r, c);
          if (val) {
            setIClip(val); // always store in internal clipboard
            try { navigator.clipboard.writeText(val); } catch(ex) {}
            setCopyMsg(active[c] ? active[c].l + ": " + (val.length > 30 ? val.substring(0, 28) + ".." : val) : "Copied");
            setTimeout(function() { setCopyMsg(null); }, 2000);
          }
          return;
        }
        if (e.key === "v") {
          e.preventDefault();
          // Paste works with any focused cell — no need for F2/edit mode
          if (!focus) return;
          try {
            navigator.clipboard.readText().then(function(t2) {
              if (t2) setCellVal(r, c, t2);
              else if (iClip) setCellVal(r, c, iClip);
            }).catch(function() { if (iClip) setCellVal(r, c, iClip); });
          } catch(ex) { if (iClip) setCellVal(r, c, iClip); }
          return;
        }
        return;
      }
      if (editing && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); startReplace(r, c, e.key); }
    };
    el.addEventListener("keydown", h); return () => el.removeEventListener("keydown", h);
  });
  useEffect(() => { if (editMode && editRef.current) editRef.current.focus(); }, [editMode]);
  useEffect(() => { if (!focus || !tblRef.current) return; const tb = tblRef.current.querySelector("tbody"); if (!tb) return; const row = tb.children[focus.r]; if (!row) return; const cell = row.children[focus.c + 1]; if (cell) cell.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [focus]);

  const tot = active.reduce((s, c) => s + cw[c.k], 0) + 38;
  const reqK = new Set(["Seq", "Milestone", "ConnectTo", "Type"]);
  let filtered = rows;
  if (srch && !srchHL) { const s = srch.toLowerCase(); filtered = rows.filter(r => Object.values(r).some(v => v && v.toLowerCase().includes(s))); }

  // Highlight helper: wraps matched text in a yellow span
  const hlText = (text) => {
    if (!srch || !text) return text;
    const s = srch.toLowerCase();
    const idx = text.toLowerCase().indexOf(s);
    if (idx < 0) return text;
    return <>{text.substring(0, idx)}<span style={{ background: th.isDark ? "rgba(250,204,21,.3)" : "rgba(250,204,21,.5)", borderRadius: 2, padding: "0 1px" }}>{text.substring(idx, idx + srch.length)}</span>{text.substring(idx + srch.length)}</>;
  };
  const onCellClick = (ri, c2, e) => { if (e.detail === 2 && editing) { startAppend(ri, c2); return; } setFocus({ r: ri, c: c2 }); if (editMode) commitEdit(); };
  const onCtx = (e, ri) => { if (!editing) return; e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY, r: ri }); };

  return (
    <div ref={tblRef} tabIndex={0} className={"outline-none flex flex-col h-full " + (fs ? "fixed inset-0 z-50" : "")} style={{ background: th.bg, fontFamily: fcss, fontSize: fpx, minHeight: 0 }}>
      {/* TOOLBAR */}
      <div className="flex items-center justify-between px-3 py-2 flex-wrap gap-1.5 shrink-0" style={{ background: th.isDark ? "rgba(10,14,26,.85)" : th.headerBg, borderBottom: "1px solid " + th.border }}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Bg v="info">{rows.length}</Bg>
          <button onClick={() => { setEditing(!editing); if (editing) { setEditMode(null); setFocus(null); } }} className={"flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all " + (editing ? "bg-indigo-600 text-white" : "text-slate-500")} style={!editing ? { border: "1px solid " + th.border } : {}}><Edit3 size={12} />{editing ? "Editing" : "View"}</button>
          {editing && <>
            <button onClick={undo} disabled={histIdx < 0} className="p-1.5 rounded-lg disabled:opacity-20" style={{ color: th.textMuted }} title="Ctrl+Z"><RotateCcw size={12} /></button>
            <button onClick={redo} disabled={histIdx >= history.length - 1} className="p-1.5 rounded-lg disabled:opacity-20" style={{ color: th.textMuted }} title="Ctrl+Y"><RefreshCw size={12} /></button>
            <button onClick={() => addRow(focus ? focus.r : rows.length - 1)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-emerald-500"><Plus size={11} />Row</button>
            <button onClick={updateSeq} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] text-amber-400 font-semibold" style={{ border: "1px solid rgba(245,158,11,.3)" }} title="Renumber all Seq by position and type"><RefreshCw size={11} />Update Seq</button>
            {focus && <>
              <button onClick={() => moveRow(focus.r, -1)} className="p-1 rounded-lg" style={{ color: th.textMuted }}><ChevronDown size={12} className="rotate-180" /></button>
              <button onClick={() => moveRow(focus.r, 1)} className="p-1 rounded-lg" style={{ color: th.textMuted }}><ChevronDown size={12} /></button>
              <button onClick={() => dupRow(focus.r)} className="p-1 rounded-lg text-cyan-500"><Copy size={11} /></button>
              <button onClick={() => { delRow(focus.r); setFocus(null); }} className="p-1 rounded-lg text-red-400"><Trash2 size={11} /></button>
            </>}
          </>}
          <span style={{ color: th.border }}>|</span>
          {Object.entries(TBL_THEMES).map(([k, t2]) => <button key={k} onClick={() => setTt(k)} className={"px-2 py-1 rounded-lg text-[10px] font-medium " + (tt === k ? "bg-indigo-500/20 text-indigo-400" : "")} style={{ color: tt !== k ? th.textMuted : undefined }}>{t2.isDark ? "\u263E" : "\u2600"}{t2.name}</button>)}
          <span style={{ color: th.border }}>|</span>
          <span style={{ color: th.textMuted, fontSize: 10 }}>Color</span>
          <input type="range" min={0} max={100} value={ci} onChange={e => setCi(Number(e.target.value))} className="w-14 h-1 accent-indigo-500" />
        </div>
        <div className="flex items-center gap-1.5">
          {TBL_FSIZES.map(f => <button key={f.id} onClick={() => setFsz(f.id)} className={"w-6 h-6 rounded-lg text-[10px] font-bold " + (fsz === f.id ? "bg-indigo-500/20 text-indigo-400" : "")} style={{ color: fsz !== f.id ? th.textMuted : undefined }}>{f.n}</button>)}
          <select value={ff} onChange={e => setFf(e.target.value)} className="px-1.5 py-1 rounded-lg text-[10px] bg-transparent appearance-none cursor-pointer" style={{ border: "1px solid " + th.border, color: th.textSec, maxWidth: 85 }}>
            {TBL_FONTS.map(f => <option key={f.id} value={f.id} style={{ background: th.isDark ? "#0c1019" : "#fff" }}>{f.n}</option>)}
          </select>
          <span style={{ color: th.border }}>|</span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ border: "1px solid " + th.border }}><Search size={11} style={{ color: th.textMuted }} /><input value={srch} onChange={e => setSrch(e.target.value)} placeholder="Search" className="bg-transparent w-20 outline-none" style={{ color: th.text, fontSize: 11 }} />{srch && <button onClick={() => setSrch("")}><X size={10} style={{ color: th.textMuted }} /></button>}</div>
          <button onClick={() => setSrchHL(!srchHL)} className={"p-1.5 rounded-lg " + (srchHL ? "bg-amber-500/20 text-amber-400" : "")} style={{ color: !srchHL ? th.textMuted : undefined }} title={srchHL ? "Filter mode (hide non-matching)" : "Highlight mode (show all, highlight matches)"}><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12h5" /><path d="M4.5 12V5l3-3h0l4.5 4.5h0l-3 3" /><path d="M7 7l3 3" />{srchHL && <rect x="1" y="14" width="14" height="2" rx="1" fill="currentColor" stroke="none" opacity="0.5" />}</svg></button>
          <button onClick={() => setGrid(!grid)} className={"p-1.5 rounded-lg " + (grid ? "bg-indigo-500/20 text-indigo-400" : "")} style={{ color: !grid ? th.textMuted : undefined }} title={grid ? "Hide grid lines" : "Show grid lines"}><svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="14" height="14" rx="1.5" /><line x1="1" y1="5.5" x2="15" y2="5.5" /><line x1="1" y1="10.5" x2="15" y2="10.5" /><line x1="5.5" y1="1" x2="5.5" y2="15" /><line x1="10.5" y1="1" x2="10.5" y2="15" /></svg></button>
          <button onClick={() => setFs(!fs)} className="p-1.5 rounded-lg" style={{ color: th.textMuted }} title={fs ? "Exit Fullscreen" : "Fullscreen"}>{fs ? <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="6,1 1,1 1,6" /><polyline points="10,15 15,15 15,10" /><line x1="1" y1="1" x2="6" y2="6" /><line x1="15" y1="15" x2="10" y2="10" /></svg> : <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="10,1 15,1 15,6" /><polyline points="6,15 1,15 1,10" /><line x1="15" y1="1" x2="10" y2="6" /><line x1="1" y1="15" x2="6" y2="10" /></svg>}</button>
          <div className="relative"><button onClick={() => setColPick(!colPick)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px]" style={{ border: "1px solid " + th.border, color: th.textSec }}><Eye size={11} />{vis.length}</button>
          {colPick && <div className="absolute right-0 top-8 z-30 w-48 rounded-2xl shadow-2xl p-3 max-h-64 overflow-y-auto" style={{ background: th.isDark ? "#0c1019" : "#fff", border: "1px solid " + th.border }}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold" style={{ color: th.text }}>Columns</span><button onClick={() => setColPick(false)}><X size={11} style={{ color: th.textMuted }} /></button></div>
            <div className="flex gap-1 mb-2"><button onClick={() => setVis(COLS.map(c => c.k))} className="px-2 py-0.5 text-[10px] rounded-lg" style={{ color: th.textSec, border: "1px solid " + th.border }}>All</button><button onClick={() => setVis(COLS.filter(c => c.d).map(c => c.k))} className="px-2 py-0.5 text-[10px] rounded-lg" style={{ color: th.textSec, border: "1px solid " + th.border }}>Default</button></div>
            {COLS.map(c => <label key={c.k} className="flex items-center gap-2 py-0.5 text-xs cursor-pointer" style={{ color: th.textSec }}><input type="checkbox" checked={vis.includes(c.k)} onChange={() => setVis(p => p.includes(c.k) ? p.filter(x => x !== c.k) : [...p, c.k])} className="accent-indigo-500 w-3 h-3" />{c.l}</label>)}
          </div>}</div>
        </div>
      </div>
      {editing && <div className="flex items-center gap-3 px-3 py-1 flex-wrap shrink-0" style={{ background: th.isDark ? "rgba(10,14,26,.6)" : "rgba(240,236,224,.4)", fontSize: 9, color: th.textMuted }}>Arrow:Navigate | Tab:Next | Enter:Down | Type:Replace | F2:Edit | Esc:Cancel | Shift+Arrow:Move | Del:Clear | Ctrl+Z/Y | Ctrl+C/V | Right-click:Menu</div>}
      {!editing && focus && <div className="flex items-center gap-3 px-3 py-1 flex-wrap shrink-0" style={{ background: th.isDark ? "rgba(10,14,26,.4)" : "rgba(240,236,224,.3)", fontSize: 9, color: th.textMuted }}>Arrow:Navigate | Ctrl+C:Copy | Ctrl+V:Paste | Click:Select | Esc:Deselect</div>}
      {valErr && <div className="flex items-center gap-2 px-3 py-2 shrink-0" style={{ background: "rgba(239,68,68,.1)", borderBottom: "1px solid rgba(239,68,68,.2)" }}><AlertTriangle size={13} style={{ color: "#ef4444" }} /><span style={{ color: "#ef4444", fontSize: 12, fontWeight: 600 }}>{valErr}</span></div>}
      {copyMsg && <div className="flex items-center gap-2 px-3 py-1.5 shrink-0" style={{ background: "rgba(16,185,129,.1)", borderBottom: "1px solid rgba(16,185,129,.2)" }}><Copy size={12} style={{ color: "#10b981" }} /><span style={{ color: "#10b981", fontSize: 11, fontWeight: 600 }}>Copied: {copyMsg}</span></div>}

      {/* TABLE */}
      <div className="flex-1 overflow-auto" style={{ background: th.bg, minHeight: 0 }}>
        <table className="border-collapse w-full" style={{ minWidth: tot, tableLayout: "fixed", fontFamily: fcss, fontSize: fpx }}>
          <colgroup><col style={{ width: 38 }} />{active.map(c => <col key={c.k} style={{ width: cw[c.k] }} />)}</colgroup>
          <thead className="sticky top-0 z-10"><tr style={{ background: th.headerBg }}>
            <th className="px-1 py-2 text-center" style={{ borderBottom: "2px solid " + th.border, borderRight: grid ? "1px solid " + (th.isDark ? "rgba(100,120,180,.25)" : "rgba(120,120,120,.25)") : "none", color: th.textMuted, fontSize: 10 }}>#</th>
            {active.map(c => <th key={c.k} className="text-left font-semibold relative select-none" style={{ borderBottom: "2px solid " + th.border, borderRight: grid ? "1px solid " + (th.isDark ? "rgba(100,120,180,.25)" : "rgba(120,120,120,.25)") : "none", color: th.textSec, fontSize: 10 }}><div className="px-3 py-2 uppercase tracking-wider">{c.l}</div><div onMouseDown={e => onResize(c.k, e)} className="absolute right-0 top-0 w-1.5 h-full cursor-col-resize hover:bg-indigo-500/30" /></th>)}
          </tr></thead>
          <tbody>{filtered.map((r, fi) => {
            const ri = rows.indexOf(r);
            const bg = rowBg(r.Type);
            const rf = focus && focus.r === ri;
            return (
              <tr key={ri} style={{ background: bg, borderBottom: "1px solid " + th.border }} onContextMenu={e => onCtx(e, ri)}>
                <td className="px-1 py-1 text-center select-none" style={{ color: rf ? th.focusRing : th.textMuted, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: rf ? 700 : 400, borderRight: grid ? "1px solid " + (th.isDark ? "rgba(100,120,180,.25)" : "rgba(120,120,120,.25)") : "none" }}>{ri + 1}</td>
                {active.map((col, c2i) => {
                  const val = r[col.k] || "";
                  const foc = focus && focus.r === ri && focus.c === c2i;
                  const isEmpty = reqK.has(col.k) && !val;
                  var gB = grid ? "1px solid " + (th.isDark ? "rgba(100,120,180,.25)" : "rgba(120,120,120,.25)") : "none";
                  if (foc && editMode) {
                    const ddStyle = { outline: "2px solid " + th.focusRing, outlineOffset: -1, borderRadius: 3, padding: 0, borderRight: gB };
                    const inpStyle = { background: "transparent", color: th.text, fontFamily: fcss, fontSize: fpx, minHeight: 26 };
                    // Dropdown for BPMN Type
                    if (col.k === "Type") return <td key={col.k} style={ddStyle}><select ref={editRef} value={editVal} onChange={e => { setEditVal(e.target.value); const sm = typeToMode(e.target.value); if (sm) { const mci = active.findIndex(c2 => c2.k === "Mode"); if (mci >= 0) { /* auto-map handled on commit via setCellVal */ } } }} onBlur={() => setTimeout(() => commitEdit(), 10)} className="w-full px-2 py-1 outline-none appearance-none cursor-pointer" style={inpStyle}><option value="" style={{ background: th.isDark ? "#0c1019" : "#fff" }}>-- Select --</option>{BPMN_TYPES.map(t => <option key={t.id} value={t.id} style={{ background: th.isDark ? "#0c1019" : "#fff" }}>{t.id}</option>)}</select></td>;
                    // Dropdown for Mode
                    if (col.k === "Mode") return <td key={col.k} style={ddStyle}><select ref={editRef} value={editVal} onChange={e => setEditVal(e.target.value)} onBlur={() => setTimeout(() => commitEdit(), 10)} className="w-full px-2 py-1 outline-none appearance-none cursor-pointer" style={inpStyle}><option value="" style={{ background: th.isDark ? "#0c1019" : "#fff" }}>-- Select --</option>{EXEC_MODES.map(m => <option key={m.id} value={m.id} style={{ background: th.isDark ? "#0c1019" : "#fff" }}>{m.id}</option>)}</select></td>;
                    // Dropdown for ConnectTo (multi-select via comma typing + suggestions)
                    if (col.k === "ConnectTo") {
                      const allSeqs = rows.map(r => r.Seq).filter(Boolean);
                      const curParts = editVal.split(",");
                      const lastPart = (curParts[curParts.length - 1] || "").trim().toLowerCase();
                      const suggestions = lastPart ? allSeqs.filter(s => s.toLowerCase().startsWith(lastPart) && s !== rows[ri]?.Seq) : allSeqs.filter(s => s !== rows[ri]?.Seq);
                      return <td key={col.k} style={ddStyle}><div className="relative"><input ref={editRef} value={editVal} onChange={e => setEditVal(e.target.value)} onBlur={() => setTimeout(() => commitEdit(), 10)} className="w-full px-2 py-1 outline-none" style={inpStyle} placeholder="e.g. T2,G1" />
                        {lastPart && suggestions.length > 0 && <div className="absolute left-0 top-full z-30 w-full rounded-lg shadow-xl py-1 max-h-32 overflow-y-auto" style={{ background: th.isDark ? "#0c1019" : "#fff", border: "1px solid " + th.border }}>
                          {suggestions.slice(0, 8).map(s => <button key={s} onMouseDown={e => { e.preventDefault(); const before = curParts.slice(0, -1).join(","); setEditVal((before ? before + "," : "") + s); }} className="w-full text-left px-2 py-1 text-xs hover:opacity-80" style={{ color: th.text }}><span className="mono font-bold" style={{ color: typeColor(rows.find(r => r.Seq === s)?.Type || "") }}>{s}</span> <span style={{ color: th.textMuted, fontSize: 10 }}>{(rows.find(r => r.Seq === s)?.Milestone || "").substring(0, 30)}</span></button>)}
                        </div>}
                      </div></td>;
                    }
                    // Friction multi-select (checkbox dropdown)
                    if (col.k === "Friction") {
                      const selected = editVal ? editVal.split(",").map(function(s) { return s.trim(); }).filter(Boolean) : [];
                      const toggleF = function(fid) {
                        var nv = selected.includes(fid) ? selected.filter(function(x) { return x !== fid; }) : selected.concat([fid]);
                        setEditVal(nv.join(","));
                      };
                      return <td key={col.k} style={ddStyle}><div className="relative">
                        <div ref={editRef} tabIndex={0} className="px-2 py-1 min-h-[26px] flex flex-wrap gap-1" style={inpStyle} onBlur={function(e) { if (!e.currentTarget.contains(e.relatedTarget)) setTimeout(function() { commitEdit(); }, 10); }}>
                          {selected.length === 0 && <span style={{ color: th.textMuted, fontSize: 10 }}>Select frictions...</span>}
                          {selected.map(function(f) { var ft = FRICTION_TYPES.find(function(t) { return t.id === f; }); return <span key={f} className="inline-flex items-center gap-0.5 px-1.5 py-0 rounded-full text-[9px] font-medium" style={{ background: (ft ? ft.color : "#666") + "20", color: ft ? ft.color : "#666" }}>{ft ? ft.icon : ""}{f}</span>; })}
                        </div>
                        <div className="absolute left-0 top-full z-30 w-full rounded-lg shadow-xl py-1 max-h-40 overflow-y-auto" style={{ background: th.isDark ? "#0c1019" : "#fff", border: "1px solid " + th.border }}>
                          {FRICTION_TYPES.map(function(ft) { var isOn = selected.includes(ft.id); return <button key={ft.id} onMouseDown={function(e) { e.preventDefault(); toggleF(ft.id); }} className="w-full text-left px-2 py-1.5 text-xs flex items-center gap-2 hover:opacity-80" style={{ color: th.text }}>
                            <span className="w-4 h-4 rounded border flex items-center justify-center text-[10px]" style={{ borderColor: ft.color, background: isOn ? ft.color + "30" : "transparent", color: ft.color }}>{isOn ? "\u2713" : ""}</span>
                            <span>{ft.icon} {ft.id}</span>
                          </button>; })}
                        </div>
                      </div></td>;
                    }
                    // PathType dropdown (Happy Path)
                    if (col.k === "PathType") return <td key={col.k} style={{ ...ddStyle, textAlign: "center", cursor: "pointer" }} onClick={() => { setEditVal(editVal === "Happy Path" ? "" : "Happy Path"); setTimeout(() => commitEdit(), 10); }}><span style={{ fontSize: 18, opacity: editVal === "Happy Path" ? 1 : 0.2 }}>{"\uD83D\uDE42"}</span></td>;
                    // Default text input
                    return <td key={col.k} style={ddStyle}><input ref={editRef} value={editVal} onChange={e => setEditVal(e.target.value)} onBlur={() => setTimeout(() => commitEdit(), 10)} className="w-full px-2 py-1 outline-none" style={inpStyle} /></td>;
                  }
                  const cs = { padding: "4px 10px", color: th.text, cursor: "default", verticalAlign: "top", borderRight: gB };
                  if (foc) { cs.outline = "2px solid " + th.focusRing; cs.outlineOffset = -1; cs.borderRadius = 3; }
                  if (isEmpty) cs.background = th.isDark ? "rgba(239,68,68,.04)" : "rgba(239,68,68,.06)";
                  if (col.k === "Seq") return <td key={col.k} style={{ ...cs, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: th.isDark ? "#818cf8" : "#4f46e5" }} onClick={e => onCellClick(ri, c2i, e)}>{srch ? hlText(val) : val}</td>;
                  if (col.k === "Type") { const b = typeColor(val); return <td key={col.k} style={cs} onClick={e => onCellClick(ri, c2i, e)}><span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: b }} /><span style={{ fontWeight: 600, color: b }}>{srch ? hlText(val) : val}</span></span></td>; }
                  if (col.k === "Mode" && val && !foc) return <td key={col.k} style={cs} onClick={e => onCellClick(ri, c2i, e)}><Bg v={val === "Automatic" ? "success" : val === "Manual" ? "warning" : val === "AI" ? "primary" : "info"}>{srch ? hlText(val) : val}</Bg></td>;
                  if (col.k === "Friction" && val) {
                    var frList = val.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
                    return <td key={col.k} style={cs} onClick={e => onCellClick(ri, c2i, e)}><div className="flex flex-wrap gap-0.5">{frList.map(function(f, fi) { var ft = FRICTION_TYPES.find(function(t) { return t.id === f; }); return <span key={fi} className="inline-flex items-center gap-0.5 px-1.5 py-0 rounded-full text-[9px] font-medium" style={{ background: (ft ? ft.color : "#666") + "20", color: ft ? ft.color : "#666" }}>{ft ? ft.icon : ""}{f}</span>; })}</div></td>;
                  }
                  if (col.k === "PathType") {
                    var isHappy = val === "Happy Path";
                    return <td key={col.k} style={{ ...cs, textAlign: "center", cursor: "pointer" }} onClick={() => { var nr = rows.map(function(row, idx) { return idx === ri ? { ...row, PathType: isHappy ? "" : "Happy Path" } : row; }); pushH(nr); }}><span style={{ fontSize: 18, opacity: isHappy ? 1 : 0.15, transition: "opacity 0.2s" }}>{"\uD83D\uDE42"}</span></td>;
                  }
                  if (col.k === "TCode") return <td key={col.k} style={{ ...cs, fontFamily: "'JetBrains Mono',monospace", color: th.isDark ? "#34d399" : "#047857" }} onClick={e => onCellClick(ri, c2i, e)}>{srch ? hlText(val) : val}</td>;
                  if (col.k === "ControlID") return <td key={col.k} style={{ ...cs, fontFamily: "'JetBrains Mono',monospace", color: th.isDark ? "#fbbf24" : "#b45309" }} onClick={e => onCellClick(ri, c2i, e)}>{srch ? hlText(val) : val}</td>;
                  return <td key={col.k} style={{ ...cs, color: val ? th.textSec : th.textMuted }} onClick={e => onCellClick(ri, c2i, e)}><div style={{ wordWrap: "break-word", overflowWrap: "break-word", whiteSpace: "pre-wrap" }}>{val ? (srch ? hlText(val) : val) : (isEmpty ? <span style={{ color: "rgba(239,68,68,.3)", fontStyle: "italic", fontSize: 10 }}>required</span> : "\u2014")}</div></td>;
                })}
              </tr>);
          })}</tbody>
        </table>
      </div>

      {/* CONTEXT MENU */}
      {ctx && <>
        <div className="fixed inset-0 z-50" onClick={() => setCtx(null)} />
        <div className="fixed z-50 w-52 rounded-xl shadow-2xl py-1" style={{ left: ctx.x, top: ctx.y, background: th.isDark ? "#0c1019" : "#fff", border: "1px solid " + th.border }}>
          <button onClick={() => { addRow(ctx.r); setCtx(null); }} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:opacity-80" style={{ color: th.textSec }}><Plus size={12} />Insert Below <span className="ml-auto" style={{ color: th.textMuted, fontSize: 9 }}>+</span></button>
          <button onClick={() => { dupRow(ctx.r); setCtx(null); }} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:opacity-80" style={{ color: th.textSec }}><Copy size={12} />Duplicate</button>
          <button onClick={() => { moveRow(ctx.r, -1); setCtx(null); }} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:opacity-80" style={{ color: th.textSec }}><ChevronDown size={12} className="rotate-180" />Move Up <span className="ml-auto" style={{ color: th.textMuted, fontSize: 9 }}>Shift+Up</span></button>
          <button onClick={() => { moveRow(ctx.r, 1); setCtx(null); }} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:opacity-80" style={{ color: th.textSec }}><ChevronDown size={12} />Move Down <span className="ml-auto" style={{ color: th.textMuted, fontSize: 9 }}>Shift+Dn</span></button>
          <div style={{ borderTop: "1px solid " + th.border, margin: "4px 0" }} />
          <button onClick={() => { var v = getCellVal(ctx.r, focus ? focus.c : 0); setIClip(v); try { navigator.clipboard.writeText(v); } catch(ex) {} setCopyMsg(v ? (v.length > 25 ? v.substring(0, 23) + ".." : v) : ""); setTimeout(function() { setCopyMsg(null); }, 2000); setCtx(null); }} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:opacity-80" style={{ color: th.textSec }}><Copy size={12} />Copy <span className="ml-auto" style={{ color: th.textMuted, fontSize: 9 }}>Ctrl+C</span></button>
          <button onClick={() => { if (iClip && focus) setCellVal(ctx.r, focus.c, iClip); setCtx(null); }} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:opacity-80" style={{ color: th.textSec }}><Copy size={12} />Paste <span className="ml-auto" style={{ color: th.textMuted, fontSize: 9 }}>Ctrl+V</span></button>
          <div style={{ borderTop: "1px solid " + th.border, margin: "4px 0" }} />
          <button onClick={() => { delRow(ctx.r); setCtx(null); setFocus(null); }} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:opacity-80" style={{ color: "#ef4444" }}><Trash2 size={12} />Delete <span className="ml-auto" style={{ color: th.textMuted, fontSize: 9 }}>Del</span></button>
        </div>
      </>}
    </div>
  );
}

// ─── EDITABLE METADATA ───
function MetaTbl({ data, onChange }) {
  const [editing, setEditing] = useState(false);
  const [meta, setMeta] = useState(data);
  useEffect(() => setMeta(data), [data]);
  const upd = (k, v) => { const n = { ...meta, [k]: v }; setMeta(n); if (onChange) onChange(n); };
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Bg v="info">{Object.keys(meta).length} fields</Bg>
        <button onClick={() => setEditing(!editing)} className={"flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all " + (editing ? "bg-indigo-600 text-white" : "gl text-slate-400")}><Edit3 size={13} />{editing ? "Editing ON" : "View Only"}</button>
      </div>
      <Cd c="overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(meta).map(([k, v]) => (
              <tr key={k} className="border-b border-white/3 hover:bg-white/2">
                <td className="px-5 py-3 font-medium text-slate-500 w-52">{k}</td>
                <td className="px-5 py-3">
                  {editing ? <input value={v || ""} onChange={e => upd(k, e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-slate-200" /> : <span className="text-slate-200">{v || "\u2014"}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Cd>
    </div>
  );
}

// ─── EDITABLE CONTROLS ───
function CtrlTbl({ data, onChange }) {
  const [editing, setEditing] = useState(false);
  const [rows, setRows] = useState(data);
  useEffect(() => setRows(data), [data]);
  const upd = (i, f, v) => { const n = rows.map((r, j) => j === i ? { ...r, [f]: v } : r); setRows(n); if (onChange) onChange(n); };
  const add = () => { const n = [...rows, { id: "C" + String(rows.length + 1).padStart(2, "0"), risk: "", control: "", enforcement: "" }]; setRows(n); if (onChange) onChange(n); };
  const del = (i) => { const n = rows.filter((_, j) => j !== i); setRows(n); if (onChange) onChange(n); };
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Bg v="info">{rows.length} controls</Bg>
        <button onClick={() => setEditing(!editing)} className={"flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all " + (editing ? "bg-indigo-600 text-white" : "gl text-slate-400")}><Edit3 size={13} />{editing ? "Editing ON" : "View Only"}</button>
        {editing && <button onClick={add} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] gl text-emerald-400"><Plus size={12} />Add</button>}
      </div>
      <Cd c="overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr style={{ background: "rgba(10,14,26,.8)" }}>{["ID", "Risk", "Control", "Enforcement"].map(h => <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-white/5">{h}</th>)}{editing && <th className="w-10 border-b border-white/5" />}</tr></thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={i} className="border-b border-white/3">
                {editing ? (
                  <>
                    <td className="px-4 py-2"><input value={c.id} onChange={e => upd(i, "id", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-amber-400 mono" /></td>
                    <td className="px-4 py-2"><input value={c.risk} onChange={e => upd(i, "risk", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-slate-200" /></td>
                    <td className="px-4 py-2"><input value={c.control} onChange={e => upd(i, "control", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-slate-200" /></td>
                    <td className="px-4 py-2"><input value={c.enforcement} onChange={e => upd(i, "enforcement", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-slate-200" /></td>
                    <td className="px-2"><button onClick={() => del(i)} className="text-red-500/40 hover:text-red-400"><Trash2 size={13} /></button></td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-3 mono font-bold text-amber-400">{c.id}</td>
                    <td className="px-5 py-3 text-red-400">{c.risk}</td>
                    <td className="px-5 py-3 text-slate-200">{c.control}</td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{c.enforcement}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Cd>
    </div>
  );
}

// ─── EDITABLE CUSTOMERS ───
function CustEdit({ data, onChange }) {
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState(data);
  const [newC, setNewC] = useState("");
  useEffect(() => setItems(data), [data]);
  const add = () => { if (!newC.trim()) return; const n = [...items, newC.trim()]; setItems(n); setNewC(""); if (onChange) onChange(n); };
  const del = (i) => { const n = items.filter((_, j) => j !== i); setItems(n); if (onChange) onChange(n); };
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Bg v="info">{items.length} customers</Bg>
        <button onClick={() => setEditing(!editing)} className={"flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all " + (editing ? "bg-indigo-600 text-white" : "gl text-slate-400")}><Edit3 size={13} />{editing ? "Editing ON" : "View Only"}</button>
      </div>
      <Cd c="p-5">
        <div className="flex flex-wrap gap-2">
          {items.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-sm">
              {c}{editing && <button onClick={() => del(i)} className="text-cyan-600 hover:text-red-400 ml-1"><X size={12} /></button>}
            </div>
          ))}
        </div>
        {editing && (
          <div className="flex items-center gap-2 mt-4">
            <input value={newC} onChange={e => setNewC(e.target.value)} onKeyDown={e => { if (e.key === "Enter") add(); }} placeholder="Add customer..." className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white flex-1" />
            <Bt sz="sm" onClick={add} icon={Plus}>Add</Bt>
          </div>
        )}
      </Cd>
    </div>
  );
}

// ─── SOURCE DOCUMENT ───
function SrcDoc({ text, onRegen }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(text);
  useEffect(() => setVal(text), [text]);
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Bg v="ghost">{val.length} chars</Bg>
        <button onClick={() => setEditing(!editing)} className={"flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all " + (editing ? "bg-indigo-600 text-white" : "gl text-slate-400")}><Edit3 size={13} />{editing ? "Editing ON" : "View Only"}</button>
        {editing && <Bt sz="sm" v="secondary" onClick={() => onRegen && onRegen(val)} icon={RefreshCw}>Re-generate</Bt>}
      </div>
      <Cd c="overflow-hidden">
        {editing
          ? <textarea value={val} onChange={e => setVal(e.target.value)} className="w-full min-h-[300px] bg-transparent text-slate-200 text-sm mono p-5 leading-relaxed resize-none" spellCheck={false} />
          : <pre className="p-5 text-sm text-slate-300 mono whitespace-pre-wrap leading-relaxed">{val}</pre>}
      </Cd>
    </div>
  );
}

// ─── BPMN DIAGRAM ───
function BpmnDiag({ data, onChange }) {
  const [nodes, setNodes] = useState({});
  const [selId, setSelId] = useState(null);
  const [dragSt, setDragSt] = useState(null);
  const [conn, setConn] = useState(null);
  const [mp, setMp] = useState({ x: 0, y: 0 });
  const [horiz, setHoriz] = useState(true);
  const [showFric, setShowFric] = useState(true);
  const [showHP, setShowHP] = useState(false);
  const [hpFocusId, setHpFocusId] = useState(null);
  const [hovDim, setHovDim] = useState(null);
  const [hovRisk, setHovRisk] = useState(null); // hovered risk gateway — shows diversion lines // hovered dimmed node — shows its connections
  const [layoutVer, setLayoutVer] = useState(0);
  const svgRef = useRef(null);
  const scrRef = useRef(null);

  const nW = 160, nH = 56, PAD = 60, LANE_HDR = 130, GAP_X = 260, GAP_Y = 110;

  // ── SMART LAYOUT ENGINE ──
  const doLayout = useCallback(() => {
    if (!data || !data.length) return {};

    // Helper: get role from Responsible, empty = "Unassigned"
    const getRole = (r) => (r.Responsible && r.Responsible.trim()) ? r.Responsible.trim() : "Unassigned";

    // 1. Column = table row index
    const col = {};
    data.forEach((r, i) => { col[r.Seq] = i; });

    // 2. Swim lanes from actual Responsible values
    const roles = []; const roleIdx = {};
    data.forEach(r => {
      const role = getRole(r);
      if (roleIdx[role] === undefined) { roleIdx[role] = roles.length; roles.push(role); }
    });
    const numRoles = roles.length;
    const LANE_PAD = 35; // padding inside each lane top/bottom
    const LANE_GAP = 30; // gap between lanes

    // 3. Group by column, sort by original data order
    const dataIdx = {}; data.forEach((r, i) => { dataIdx[r.Seq] = i; });
    const colGroups = {};
    data.forEach(r => {
      const c = col[r.Seq];
      if (!colGroups[c]) colGroups[c] = [];
      colGroups[c].push(r);
    });
    Object.keys(colGroups).forEach(c => {
      colGroups[c].sort((a, b) => dataIdx[a.Seq] - dataIdx[b.Seq]);
    });

    // 4. Position nodes
    const positions = {};
    const CE_SPREAD = nH + 70;
    let laneTop = {}, laneHeight = {};

    if (horiz) {
      // Pass 1: count max items per lane (across all columns)
      const laneItemCount = {};
      roles.forEach(r => { laneItemCount[r] = 0; });
      Object.keys(colGroups).forEach(c => {
        const perRole = {};
        colGroups[c].forEach(r => {
          const role = getRole(r);
          perRole[role] = (perRole[role] || 0) + 1;
        });
        Object.keys(perRole).forEach(role => {
          laneItemCount[role] = Math.max(laneItemCount[role] || 0, perRole[role]);
        });
      });

      // Pass 2: compute actual lane heights and Y offsets
      laneTop = {}; // role -> Y start of lane content area
      laneHeight = {}; // role -> total height of lane
      let currentY = PAD;
      roles.forEach(role => {
        const items = Math.max(1, laneItemCount[role] || 1);
        const contentH = items * (nH + 30) - 30; // height needed for stacked nodes
        const totalH = contentH + LANE_PAD * 2;
        laneTop[role] = currentY + LANE_PAD;
        laneHeight[role] = totalH;
        currentY += totalH + LANE_GAP;
      });

      // Pass 3: place nodes using lane Y positions
      const cellCount = {};
      Object.keys(colGroups).forEach(c => {
        colGroups[c].forEach(r => {
          const role = getRole(r);
          const cellKey = c + "|" + role;
          cellCount[cellKey] = (cellCount[cellKey] || 0);
          const subIdx = cellCount[cellKey];
          cellCount[cellKey]++;
          const x = LANE_HDR + parseInt(c) * GAP_X + PAD;
          const y = laneTop[role] + subIdx * (nH + 30);
          positions[r.Seq] = { x, y };
        });
      });
    } else {
      // Vertical mode: similar but lanes go left-right
      const laneItemCount = {};
      roles.forEach(r => { laneItemCount[r] = 0; });
      Object.keys(colGroups).forEach(c => {
        const perRole = {};
        colGroups[c].forEach(r => {
          const role = getRole(r);
          perRole[role] = (perRole[role] || 0) + 1;
        });
        Object.keys(perRole).forEach(role => {
          laneItemCount[role] = Math.max(laneItemCount[role] || 0, perRole[role]);
        });
      });

      const laneLeft = {};
      const laneWidth = {};
      let currentX = PAD + 80;
      roles.forEach(role => {
        const items = Math.max(1, laneItemCount[role] || 1);
        const contentW = items * (nW + 20) - 20;
        const totalW = contentW + LANE_PAD * 2;
        laneLeft[role] = currentX + LANE_PAD;
        laneWidth[role] = totalW;
        currentX += totalW + LANE_GAP;
      });

      const cellCount = {};
      Object.keys(colGroups).forEach(c => {
        colGroups[c].forEach(r => {
          const role = getRole(r);
          const cellKey = c + "|" + role;
          cellCount[cellKey] = (cellCount[cellKey] || 0);
          const subIdx = cellCount[cellKey];
          cellCount[cellKey]++;
          const x = laneLeft[role] + subIdx * (nW + 20);
          const y = PAD + 30 + parseInt(c) * (nH + GAP_Y);
          positions[r.Seq] = { x, y };
        });
      });
    }

    // Build node map — include effective role for rendering
    const result = {};
    data.forEach(r => {
      const p = positions[r.Seq] || { x: PAD, y: PAD };
      result[r.Seq] = { ...r, x: p.x, y: p.y, _eRole: getRole(r) };
    });
    // Return nodes + lane layout info
    return { nodes: result, laneInfo: horiz ? { roles, laneTop, laneHeight } : { roles } };
  }, [data, horiz]);

  // Initialize and re-layout
  const [laneLayout, setLaneLayout] = useState({ roles: [], laneTop: {}, laneHeight: {} });
  useEffect(() => { const r = doLayout(); if (r && r.nodes) { setNodes(r.nodes); setLaneLayout(r.laneInfo || {}); } }, [doLayout, layoutVer]);

  // Cascade: enforce non-overlapping lanes after any resize
  // Top lane stays fixed (only expands down). Lower lanes get pushed.
  const LANE_SEP = 20;
  const cascadeLanes = (prev) => {
    const rl = prev.roles || [];
    if (rl.length < 2) return prev;
    const nlt = { ...prev.laneTop };
    const nlh = { ...prev.laneHeight };
    // Top lane: cannot move up. Its top is fixed at its current position.
    for (let i = 1; i < rl.length; i++) {
      const prevRole = rl[i - 1];
      const thisRole = rl[i];
      if (nlt[prevRole] === undefined || nlh[prevRole] === undefined) continue;
      if (nlt[thisRole] === undefined || nlh[thisRole] === undefined) continue;
      const prevBottom = nlt[prevRole] - 35 + nlh[prevRole]; // lane visual bottom
      const thisTop = nlt[thisRole] - 35; // lane visual top
      if (thisTop < prevBottom + LANE_SEP) {
        // Push this lane down
        const shift = prevBottom + LANE_SEP - thisTop;
        nlt[thisRole] = nlt[thisRole] + shift;
      }
    }
    return { ...prev, laneTop: nlt, laneHeight: nlh };
  };

  const reLayout = () => { setLayoutVer(v => v + 1); };

  // Align Lanes: tidy swimlanes to fit content without moving shapes horizontally
  const alignLanes = () => {
    const rl = laneLayout.roles || [];
    if (rl.length === 0) return;
    const MIN_LANE_H = nH + 80; // minimum lane height for routing space
    const LANE_PAD_A = 35;
    const LANE_GAP_A = 25;

    // 1. For each role, find actual min/max Y of nodes in that lane
    const roleBounds = {};
    rl.forEach(role => { roleBounds[role] = { minY: Infinity, maxY: -Infinity, count: 0 }; });
    Object.values(nodes).forEach(n => {
      const role = n._eRole || "Unassigned";
      if (!roleBounds[role]) return;
      roleBounds[role].minY = Math.min(roleBounds[role].minY, n.y);
      roleBounds[role].maxY = Math.max(roleBounds[role].maxY, n.y + nH);
      roleBounds[role].count++;
    });

    // 2. Compute tight lane heights from actual content
    const newLaneTop = {};
    const newLaneHeight = {};
    let curY = PAD;

    rl.forEach(role => {
      const rb = roleBounds[role];
      let contentH;
      if (rb.count === 0 || rb.minY === Infinity) {
        contentH = MIN_LANE_H - LANE_PAD_A * 2;
      } else {
        contentH = Math.max(rb.maxY - rb.minY, MIN_LANE_H - LANE_PAD_A * 2);
      }
      const totalH = contentH + LANE_PAD_A * 2;
      newLaneTop[role] = curY + LANE_PAD_A;
      newLaneHeight[role] = totalH;
      curY += totalH + LANE_GAP_A;
    });

    // 3. Reposition nodes vertically to center within their new lane, preserving relative order
    const newNodes = { ...nodes };
    rl.forEach(role => {
      const roleNodes = Object.values(nodes).filter(n => (n._eRole || "Unassigned") === role);
      if (roleNodes.length === 0) return;

      const rb = roleBounds[role];
      const oldCenter = (rb.minY + rb.maxY) / 2;
      const newLaneCenter = newLaneTop[role] + (newLaneHeight[role] - LANE_PAD_A * 2) / 2;
      const shift = newLaneCenter - oldCenter;

      roleNodes.forEach(n => {
        let newY = n.y + shift;
        // Clamp within new lane bounds
        const laneMin = newLaneTop[role] - LANE_PAD_A;
        const laneMax = newLaneTop[role] - LANE_PAD_A + newLaneHeight[role] - nH;
        newY = Math.max(laneMin, Math.min(laneMax, newY));
        newNodes[n.Seq] = { ...newNodes[n.Seq], y: newY };
      });
    });

    setNodes(newNodes);
    setLaneLayout(prev => ({ ...prev, laneTop: newLaneTop, laneHeight: newLaneHeight }));
  };

  if (!data || !data.length) return <div className="text-center py-12 text-slate-500">No data</div>;

  const nl = Object.values(nodes);
  const syncBack = (ns) => { if (onChange) onChange(Object.values(ns).map(({ x, y, ...rest }) => rest)); };
  const svgPt = e => { const r = scrRef.current.getBoundingClientRect(); return { x: e.clientX - r.left + scrRef.current.scrollLeft, y: e.clientY - r.top + scrRef.current.scrollTop }; };

  const onND = (id, e) => {
    e.stopPropagation();
    if (conn) { if (conn !== id) { setNodes(p => { const s = p[conn]; if (!s) return p; const ex = s.ConnectTo ? s.ConnectTo.split(",").map(x => x.trim()) : []; if (!ex.includes(id)) { const n = { ...p, [conn]: { ...s, ConnectTo: [...ex, id].join(",") } }; syncBack(n); return n; } return p; }); } setConn(null); return; }
    setSelId(id); const pt = svgPt(e); setDragSt({ id, sx: pt.x, sy: pt.y, ox: nodes[id].x, oy: nodes[id].y });
  };
  const onMv = e => {
    const pt = svgPt(e); setMp(pt); if (!dragSt) return;
    const newX = dragSt.ox + pt.x - dragSt.sx;
    let newY = dragSt.oy + pt.y - dragSt.sy;

    if (horiz) {
      const nd = nodes[dragSt.id];
      if (nd) {
        const role = nd._eRole || "Unassigned";
        const lt2 = laneLayout.laneTop || {};
        const lh2 = laneLayout.laneHeight || {};
        if (lt2[role] !== undefined && lh2[role] !== undefined) {
          const laneVisualTop = lt2[role] - 35;
          const laneVisualBot = laneVisualTop + lh2[role];
          const rl = laneLayout.roles || [];
          const ri = rl.indexOf(role);

          if (newY < laneVisualTop) {
            // Trying to go above lane top
            if (ri === 0) {
              // Top lane: expand downward only (push content area down, grow height)
              newY = laneVisualTop; // can't go above
            } else {
              // Expand upward + cascade push lanes above
              setLaneLayout(prev => {
                const nlt = { ...prev.laneTop, [role]: prev.laneTop[role] - 20 };
                const nlh = { ...prev.laneHeight, [role]: prev.laneHeight[role] + 20 };
                return cascadeLanes({ ...prev, laneTop: nlt, laneHeight: nlh });
              });
            }
          } else if (newY + nH > laneVisualBot) {
            // Trying to go below lane bottom: expand downward + push lanes below
            setLaneLayout(prev => {
              const nlh = { ...prev.laneHeight, [role]: prev.laneHeight[role] + 20 };
              return cascadeLanes({ ...prev, laneHeight: nlh });
            });
          }

          // Re-read after potential update and clamp
          const curTop = laneLayout.laneTop[role] - 35;
          const curBot = curTop + laneLayout.laneHeight[role];
          newY = Math.max(curTop, Math.min(curBot - nH, newY));
        }
      }
    }
    setNodes(p => ({ ...p, [dragSt.id]: { ...p[dragSt.id], x: newX, y: newY } }));
  };
  const onUp = () => setDragSt(null);
  const upd = (id, f, v) => { setNodes(p => { const n = { ...p, [id]: { ...p[id], [f]: v } }; syncBack(n); return n; }); };

  const addN = t => {
    const allKeys = Object.keys(nodes);
    const countPfx = (pfx) => allKeys.filter(k => k.startsWith(pfx)).length;
    let sq, ml, bt;
    if (t === "start") { sq = "S" + (countPfx("S") + 1); ml = "New Start"; bt = "Start Event"; }
    else if (t === "task") { sq = "T" + (countPfx("T") + 1); ml = "New Task"; bt = "Task"; }
    else if (t === "gateway") { sq = "G" + (countPfx("G") + 1); ml = "Decision?"; bt = "XOR Gateway"; }
    else if (t === "condition") { sq = "CE" + (countPfx("CE") + 1); ml = "Yes"; bt = "Condition Expression"; }
    else { sq = "E" + (countPfx("E") + 1); ml = "End"; bt = "End Event"; }
    setNodes(p => { const n = { ...p, [sq]: { Seq: sq, Milestone: ml, ConnectTo: "", Mode: "", Type: bt, Responsible: "", Friction: "", PathType: "", Annotation: "", TAT: "", System: "", Input: "", Output: "", TCode: "", Fiori: "", ControlID: "", L5: "", Doc: "", Department: "", Risk: "", x: 250, y: 200 } }; syncBack(n); return n; });
    setSelId(sq);
  };
  const delN = id => {
    setNodes(p => { const n = { ...p }; delete n[id]; Object.keys(n).forEach(k => { if (n[k].ConnectTo) n[k] = { ...n[k], ConnectTo: n[k].ConnectTo.split(",").map(s => s.trim()).filter(s => s !== id).join(",") }; }); syncBack(n); return n; });
    if (selId === id) setSelId(null);
  };

  // ── SWIM LANES (from layout engine — deterministic, non-overlapping) ──
  const roles = laneLayout.roles || [];
  const roleMap = {};
  roles.forEach((r, i) => { roleMap[r] = i; });
  // Fallback: if nodes have roles not in laneLayout (e.g. after drag), detect them
  nl.forEach(n => { const r = n._eRole || "Unassigned"; if (!roleMap[r] && roleMap[r] !== 0) { roleMap[r] = roles.length; roles.push(r); } });

  // Build laneBounds from layout engine data
  const laneBounds = {};
  const lt = laneLayout.laneTop || {};
  const lh = laneLayout.laneHeight || {};
  roles.forEach(role => {
    if (lt[role] !== undefined && lh[role] !== undefined) {
      const top = lt[role] - 35; // LANE_PAD
      laneBounds[role] = { minY: top, maxY: top + lh[role], minX: 0, maxX: 9999 };
    } else {
      // Fallback: compute from node positions
      let minY = Infinity, maxY = -Infinity;
      nl.forEach(n => { if ((n._eRole || "Unassigned") === role) { minY = Math.min(minY, n.y - 25); maxY = Math.max(maxY, n.y + nH + 25); } });
      if (minY !== Infinity) laneBounds[role] = { minY, maxY, minX: 0, maxX: 9999 };
    }
  });

  // ── HAPPY PATH COMPUTATION ──
  const hpNodes = new Set();
  const hpEdges = new Set();
  const riskGateways = new Set();
  nl.forEach(function(n) { if (n.PathType === "Happy Path") hpNodes.add(n.Seq); });
  // Mark edges between HP nodes as HP edges, detect risk gateways
  nl.forEach(function(n) {
    if (!n.ConnectTo) return;
    var targets = n.ConnectTo.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
    targets.forEach(function(t) {
      if (hpNodes.has(n.Seq) && hpNodes.has(t)) hpEdges.add(n.Seq + "-" + t);
      // Risk gateway: HP node with some targets HP and some not
      if (n.Type && n.Type.includes("Gateway") && hpNodes.has(n.Seq)) {
        var hpCount = targets.filter(function(tg) { return hpNodes.has(tg); }).length;
        if (hpCount > 0 && hpCount < targets.length) riskGateways.add(n.Seq);
      }
    });
  });

  // Focus mode: trace upstream + downstream of focused HP node
  const hpFocusSet = new Set();
  if (hpFocusId && hpNodes.has(hpFocusId)) {
    hpFocusSet.add(hpFocusId);
    // Trace downstream
    var queue = [hpFocusId]; var visited = new Set([hpFocusId]);
    while (queue.length > 0) {
      var cur = queue.shift();
      var curNode = nodes[cur];
      if (curNode && curNode.ConnectTo) {
        curNode.ConnectTo.split(",").map(function(s) { return s.trim(); }).filter(Boolean).forEach(function(t) {
          if (hpNodes.has(t) && !visited.has(t)) { visited.add(t); hpFocusSet.add(t); queue.push(t); }
        });
      }
    }
    // Trace upstream
    queue = [hpFocusId]; visited = new Set([hpFocusId]);
    while (queue.length > 0) {
      var cur2 = queue.shift();
      nl.forEach(function(n) {
        if (!n.ConnectTo) return;
        if (n.ConnectTo.split(",").map(function(s) { return s.trim(); }).includes(cur2) && hpNodes.has(n.Seq) && !visited.has(n.Seq)) {
          visited.add(n.Seq); hpFocusSet.add(n.Seq); queue.push(n.Seq);
        }
      });
    }
  }

  // HP Metrics
  var hpMetrics = { total: 0, hp: 0, hpFriction: 0, totalFriction: 0, hpDigit: 0, totalDigit: 0, hpAutoScore: 0, totalAutoScore: 0, hpAI: 0, totalAI: 0, hpManual: 0, totalManual: 0 };
  var taskTypes = ["Task", "User Task", "Manual Task", "Service Task", "Script Task", "Sub-Process", "Call Activity"];
  nl.forEach(function(n) {
    if (!taskTypes.includes(n.Type)) return;
    hpMetrics.total++;
    var isHP = hpNodes.has(n.Seq);
    if (isHP) hpMetrics.hp++;
    var frCount = n.Friction ? n.Friction.split(",").filter(Boolean).length : 0;
    hpMetrics.totalFriction += frCount;
    if (isHP) hpMetrics.hpFriction += frCount;
    var mode = n.Mode || "";
    if (mode !== "Manual" && mode !== "") { hpMetrics.totalDigit++; if (isHP) hpMetrics.hpDigit++; }
    if (mode === "Automatic") { hpMetrics.totalAutoScore += 1; if (isHP) hpMetrics.hpAutoScore += 1; }
    if (mode === "Semi-Automatic") { hpMetrics.totalAutoScore += 0.5; if (isHP) hpMetrics.hpAutoScore += 0.5; }
    if (mode === "AI") { hpMetrics.totalAI++; if (isHP) hpMetrics.hpAI++; }
    if (mode === "Manual") { hpMetrics.totalManual++; if (isHP) hpMetrics.hpManual++; }
  });
  var pct = function(n, d) { return d > 0 ? Math.round(n / d * 100) : 0; };

  // Edges — Full obstacle-aware routing
  // BOTH horizontal and vertical segments checked for box collisions
  // Priority: 1.No line through shapes 2.No overlap 3.Route around 4.Move boxes 5.Alignment last
  const edges = [];
  const portCount = {};
  const OFS = 10;
  const RM = 35; // route margin from box edges

  const getPort = (node, side, idx) => {
    const cx = node.x + nW / 2, cy = node.y + nH / 2;
    const off = (idx - 0.5) * OFS;
    if (side === "R") return { x: node.x + nW, y: cy + off };
    if (side === "L") return { x: node.x, y: cy + off };
    if (side === "B") return { x: cx + off, y: node.y + nH };
    if (side === "T") return { x: cx + off, y: node.y };
    return { x: cx, y: cy };
  };
  const usePort = (seq, side) => { const k = seq + "|" + side; const c = portCount[k] || 0; portCount[k] = c + 1; return c; };

  // All node bounding boxes with margin
  const boxes = nl.map(nd => ({ x1: nd.x - 10, y1: nd.y - 10, x2: nd.x + nW + 10, y2: nd.y + nH + 10, seq: nd.Seq }));

  // Check if horizontal line at Y from x1→x2 hits any box (except skip)
  const hHits = (y, xa, xb, skipA, skipB) => {
    const mnX = Math.min(xa, xb), mxX = Math.max(xa, xb);
    return boxes.filter(b => b.seq !== skipA && b.seq !== skipB && y > b.y1 && y < b.y2 && mxX > b.x1 && mnX < b.x2);
  };

  // Check if vertical line at X from y1→y2 hits any box
  const vHits = (x, ya, yb, skipA, skipB) => {
    const mnY = Math.min(ya, yb), mxY = Math.max(ya, yb);
    return boxes.filter(b => b.seq !== skipA && b.seq !== skipB && x > b.x1 && x < b.x2 && mxY > b.y1 && mnY < b.y2);
  };

  // Find safe Y to route around blocking boxes (go above or below)
  const findSafeY = (blockers, srcY, skipA, skipB) => {
    // Try above the highest blocker
    const minBlockY = Math.min(...blockers.map(b => b.y1));
    const aboveY = minBlockY - RM;
    // Try below the lowest blocker
    const maxBlockY = Math.max(...blockers.map(b => b.y2));
    const belowY = maxBlockY + RM;
    // Pick whichever is closer to source Y
    return Math.abs(aboveY - srcY) < Math.abs(belowY - srcY) ? aboveY : belowY;
  };

  // Find safe X for vertical segment
  const findSafeX = (srcX, tgtX, ya, yb, skipA, skipB) => {
    const candidates = [tgtX - RM, srcX + nW + RM, (srcX + nW + tgtX) / 2];
    for (const x of candidates) { if (vHits(x, ya, yb, skipA, skipB).length === 0) return x; }
    for (let x = srcX + nW + 15; x < tgtX - 10; x += 15) { if (vHits(x, ya, yb, skipA, skipB).length === 0) return x; }
    return Math.max(srcX + nW, tgtX + nW) + RM * 2;
  };

  // Used route Ys to offset parallel horizontal segments
  const usedRouteYs = {};
  const getUniqueRouteY = (y) => {
    const key = Math.round(y / 5) * 5;
    const count = usedRouteYs[key] || 0;
    usedRouteYs[key] = count + 1;
    return y + count * OFS;
  };

  nl.forEach(nd => {
    if (!nd.ConnectTo) return;
    const targets = nd.ConnectTo.split(",").map(s => s.trim()).filter(Boolean);
    targets.forEach(t => {
      const to = nodes[t];
      if (!to) return;
      const dx = to.x - nd.x;
      const sameRole = (nd._eRole || "Unassigned") === (to._eRole || "Unassigned");
      const isMsg = !sameRole && roles.length > 1;
      let pts;

      if (dx > 0) {
        // FORWARD: target is to the right
        const exitIdx = usePort(nd.Seq, "R");
        const enterIdx = usePort(to.Seq, "L");
        const p1 = getPort(nd, "R", exitIdx);
        const p2 = getPort(to, "L", enterIdx);

        // Check if direct horizontal path is clear
        const hBlockers = hHits(p1.y, p1.x, p2.x, nd.Seq, to.Seq);

        if (Math.abs(p1.y - p2.y) < 4 && hBlockers.length === 0) {
          // Same height AND path clear: straight line
          pts = [p1, p2];
        } else if (hBlockers.length === 0 && Math.abs(p1.y - p2.y) >= 4) {
          // Different height, no horizontal blockers: find safe vertical corridor
          const safeX = findSafeX(nd.x, to.x, p1.y, p2.y, nd.Seq, to.Seq);
          pts = [p1, { x: safeX, y: p1.y }, { x: safeX, y: p2.y }, p2];
        } else {
          // Horizontal path BLOCKED: route around
          // Go up or down to clear route, then horizontal, then vertical to target
          const routeY = getUniqueRouteY(findSafeY(hBlockers, p1.y, nd.Seq, to.Seq));
          const safeX = findSafeX(nd.x, to.x, routeY, p2.y, nd.Seq, to.Seq);

          if (Math.abs(routeY - p2.y) < 4) {
            // Route Y is close to target Y: 3-segment path
            pts = [p1, { x: p1.x + RM, y: p1.y }, { x: p1.x + RM, y: routeY }, { x: p2.x, y: routeY }, p2];
          } else {
            // Full 5-segment detour
            pts = [
              p1,
              { x: p1.x + RM, y: p1.y },
              { x: p1.x + RM, y: routeY },
              { x: safeX, y: routeY },
              { x: safeX, y: p2.y },
              p2,
            ];
          }
        }
      } else {
        // BACKWARD: target is to the left (loop/return)
        const exitIdx = usePort(nd.Seq, "B");
        const enterIdx = usePort(to.Seq, "T");
        const p1 = getPort(nd, "B", exitIdx);
        const p2 = getPort(to, "T", enterIdx);
        let lowestY = 0;
        boxes.forEach(b => { lowestY = Math.max(lowestY, b.y2); });
        const routeY = getUniqueRouteY(lowestY + 40);
        pts = [p1, { x: p1.x, y: routeY }, { x: p2.x, y: routeY }, p2];
      }

      edges.push({ key: nd.Seq + "-" + t, pts, isMsg, isHP: hpEdges.has(nd.Seq + "-" + t) });
    });
  });

  let mxX = 900, mxY = 500;
  nl.forEach(n => { mxX = Math.max(mxX, n.x + nW + 100); mxY = Math.max(mxY, n.y + nH + 100); });
  const selN = selId ? nodes[selId] : null;

  // Lane colors
  const laneColors = ["rgba(99,102,241,.04)", "rgba(6,182,212,.04)", "rgba(245,158,11,.04)", "rgba(16,185,129,.04)", "rgba(139,92,246,.04)", "rgba(244,63,94,.04)"];

  return (
    <div className="flex" style={{ height: "100%", minHeight: 480 }}>
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 gl2 border-b border-white/5 shrink-0 flex-wrap gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white">BPMN Editor</span>
            {[{ t: "start", l: "Start", c: "#10b981" }, { t: "task", l: "Task", c: "#3b82f6" }, { t: "gateway", l: "GW", c: "#f59e0b" }, { t: "condition", l: "Cond", c: "#64748b" }, { t: "end", l: "End", c: "#ef4444" }].map(b => (
              <button key={b.t} onClick={() => addN(b.t)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] gl text-slate-300 hover:text-white"><span className="w-2 h-2 rounded-sm" style={{ background: b.c }} />{b.l}</button>
            ))}
            <button onClick={() => { if (conn) setConn(null); else if (selId) setConn(selId); }} className={"px-2 py-1 rounded-lg text-[11px] transition-all " + (conn ? "bg-amber-600 text-white" : "gl text-slate-300 hover:text-white")}>{conn ? "Click target..." : "Connect"}</button>
            {selId && <button onClick={() => delN(selId)} className="px-2 py-1 rounded-lg text-[11px] bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">Delete</button>}
          </div>
          <div className="flex items-center gap-1.5">
            {/* Layout direction toggle */}
            <button onClick={() => setHoriz(true)} className={"px-2 py-1 rounded-lg text-[10px] font-medium " + (horiz ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-white")} title="Horizontal: flow left-to-right">Horizontal</button>
            <button onClick={() => setHoriz(false)} className={"px-2 py-1 rounded-lg text-[10px] font-medium " + (!horiz ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 hover:text-white")} title="Vertical: flow top-to-bottom">Vertical</button>
            <span className="text-slate-700">|</span>
            <button onClick={reLayout} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] gl text-amber-400 hover:text-white" title="Re-arrange all nodes"><RotateCcw size={11} />Re-layout</button>
            <button onClick={alignLanes} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] gl text-emerald-400 hover:text-white" title="Tidy swimlanes to fit content"><Layers size={11} />Align Lanes</button>
            <button onClick={() => setShowFric(!showFric)} className={"flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] " + (showFric ? "bg-rose-500/15 text-rose-400" : "gl text-slate-500")} title={showFric ? "Hide friction bubbles" : "Show friction bubbles"}><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" opacity="0.7"><circle cx="5" cy="10" r="5" /><circle cx="11" cy="6" r="4" /><circle cx="8" cy="13" r="2.5" /></svg>{showFric ? "Frictions" : "Frictions"}</button>
            <button onClick={() => { setShowHP(!showHP); if (showHP) { setHpFocusId(null); } }} className={"flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all " + (showHP ? "bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-900/20" : "gl text-slate-500 hover:text-slate-300")} title={showHP ? "Hide Happy Path" : "Show Happy Path"}><span style={{ fontSize: 16, transition: "transform 0.3s", transform: showHP ? "scale(1.2)" : "scale(1)" }}>{"\uD83D\uDE42"}</span>{showHP ? "ON" : "OFF"}</button>
            {/* Legend */}
            {roles.length > 1 && <span className="text-[10px] text-slate-500 ml-2">{roles.length} lanes</span>}
            {roles.length > 1 && <><span className="text-slate-700 ml-1">|</span><span className="flex items-center gap-1 text-[9px] text-slate-500"><span style={{ width: 16, height: 2, background: "#384e86", display: "inline-block" }} />Sequence</span><span className="flex items-center gap-1 text-[9px] text-cyan-500"><span style={{ width: 16, height: 0, borderTop: "2px dashed #06b6d4", display: "inline-block" }} />Message</span></>}
          </div>
        </div>
        {/* Canvas */}
        {/* Happy Path Metrics Panel */}
        {showHP && hpMetrics.total > 0 && (
          <div className="px-4 py-2 shrink-0 flex items-center gap-4 flex-wrap" style={{ background: "rgba(16,185,129,.05)", borderBottom: "1px solid rgba(16,185,129,.15)" }}>
            <span className="text-[10px] font-semibold text-emerald-400">{"\uD83D\uDE42"} Happy Path</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span style={{ color: "#94a3b8" }}>Steps: <strong style={{ color: "#e2e8f0" }}>{hpMetrics.hp}/{hpMetrics.total}</strong></span>
              <span style={{ color: "#94a3b8" }}>Coverage: <strong style={{ color: "#34d399" }}>{pct(hpMetrics.hp, hpMetrics.total)}%</strong></span>
              <span style={{ color: "#94a3b8" }}>Friction: <strong style={{ color: hpMetrics.hpFriction > 0 ? "#fbbf24" : "#34d399" }}>{hpMetrics.hpFriction}</strong></span>
              <span style={{ color: "#94a3b8" }}>Digitization: <strong style={{ color: "#38bdf8" }}>{pct(hpMetrics.hpDigit, hpMetrics.hp)}%</strong></span>
              <span style={{ color: "#94a3b8" }}>Automation: <strong style={{ color: "#818cf8" }}>{pct(hpMetrics.hpAutoScore, hpMetrics.hp)}%</strong></span>
              <span style={{ color: "#94a3b8" }}>AI: <strong style={{ color: "#c084fc" }}>{pct(hpMetrics.hpAI, hpMetrics.hp)}%</strong></span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span style={{ color: "#64748b" }}>Overall:</span>
              <span style={{ color: "#94a3b8" }}>Digit: <strong>{pct(hpMetrics.totalDigit, hpMetrics.total)}%</strong></span>
              <span style={{ color: "#94a3b8" }}>Auto: <strong>{pct(hpMetrics.totalAutoScore, hpMetrics.total)}%</strong></span>
              <span style={{ color: "#94a3b8" }}>AI: <strong>{pct(hpMetrics.totalAI, hpMetrics.total)}%</strong></span>
              <span style={{ color: "#94a3b8" }}>Friction: <strong>{hpMetrics.totalFriction}</strong></span>
            </div>
            {hpFocusId && <button onClick={() => setHpFocusId(null)} className="ml-auto px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">Clear Focus</button>}
          </div>
        )}
        <div ref={scrRef} className="flex-1 overflow-auto" style={{ background: "var(--bg)" }} onMouseMove={onMv} onMouseUp={onUp} onMouseLeave={() => setDragSt(null)}>
          <svg ref={svgRef} width={mxX} height={mxY} style={{ minWidth: mxX, minHeight: mxY }} onClick={e => { if (e.target === svgRef.current && !conn) setSelId(null); }}>
            <defs>
              <marker id="ah3" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0L10,4L0,8Z" fill="#4a5578" /></marker>
              {/* Soap bubble gradients — ultra-light, translucent, iridescent */}
              <radialGradient id="bub-green" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="70%" stopColor="#86efac" stopOpacity="0.08" />
                <stop offset="90%" stopColor="#4ade80" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.25" />
              </radialGradient>
              <radialGradient id="bub-yellow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="70%" stopColor="#fde047" stopOpacity="0.08" />
                <stop offset="90%" stopColor="#facc15" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0.25" />
              </radialGradient>
              <radialGradient id="bub-orange" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="70%" stopColor="#fdba74" stopOpacity="0.08" />
                <stop offset="90%" stopColor="#fb923c" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.25" />
              </radialGradient>
              <radialGradient id="bub-red" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="70%" stopColor="#fda4af" stopOpacity="0.08" />
                <stop offset="90%" stopColor="#fb7185" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.25" />
              </radialGradient>
              {/* Iridescent rainbow shimmer on edge */}
              <linearGradient id="bub-iris" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2" />
                <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#4ade80" stopOpacity="0.12" />
                <stop offset="75%" stopColor="#fbbf24" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="0.2" />
              </linearGradient>
              {/* Top-left highlight — crisp light reflection */}
              <radialGradient id="bub-shine" cx="32%" cy="28%" r="25%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              {/* Bottom-right secondary highlight */}
              <radialGradient id="bub-shine2" cx="68%" cy="72%" r="20%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <filter id="bub-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.06" />
              </filter>
              <filter id="hp-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.5" />
              </filter>
              <style>{[
                "@keyframes bfloat1 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }",
                "@keyframes bfloat2 { 0%,100% { transform: translateY(-1px); } 50% { transform: translateY(-7px); } }",
                "@keyframes bfloat3 { 0%,100% { transform: translateY(-2px); } 50% { transform: translateY(-9px); } }",
                "@keyframes bshimmer { 0%,100% { opacity: 0.12; } 50% { opacity: 0.22; } }",
                "@keyframes bpulse { 0%,100% { opacity: 0.8; } 50% { opacity: 1; } }",
                ".hp-dim { opacity: 0.15; transition: opacity 0.3s; }",
                ".hp-dim:hover { opacity: 0.85 !important; }",
                ".hp-dim-edge { opacity: 0.12; transition: opacity 0.3s, stroke-width 0.3s; }",
                ".hp-dim-edge:hover { opacity: 0.7 !important; stroke-width: 2 !important; }",
              ].join("\n")}</style>
              <pattern id="grd2" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0L0 0 0 40" fill="none" stroke="rgba(56,78,134,.06)" strokeWidth=".5" /></pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grd2)" />

            {/* Swim lanes */}
            {roles.length > 1 && roles.map((role, ri) => {
              const b = laneBounds[role];
              if (!b || b.minY === undefined) return null;
              const laneY = b.minY - 10;
              const laneH2 = b.maxY - b.minY + 20;
              const laneX = 0;
              const laneW2 = mxX;
              return (
                <g key={role}>
                  <rect x={laneX} y={laneY} width={laneW2} height={laneH2} fill={laneColors[ri % laneColors.length]} rx={8} />
                  <line x1={laneX} y1={laneY} x2={laneW2} y2={laneY} stroke="rgba(99,102,241,.12)" strokeWidth={1} />
                  <line x1={laneX} y1={laneY + laneH2} x2={laneW2} y2={laneY + laneH2} stroke="rgba(99,102,241,.12)" strokeWidth={1} />
                  <rect x={laneX + 4} y={laneY + 4} width={110} height={22} rx={6} fill="rgba(15,20,40,.7)" />
                  <text x={laneX + 59} y={laneY + 18} textAnchor="middle" fill="rgba(99,102,241,.7)" fontSize={9} fontWeight="600">{role}</text>
                </g>
              );
            })}

            {/* Edges */}
            {edges.map(e => {
              const d = e.pts.map((p, i) => (i === 0 ? "M" : "L") + p.x + "," + p.y).join(" ");
              var eColor = e.isMsg ? "#06b6d4" : "#384e86";
              var eDash = e.isMsg ? "6,4" : "none";
              var eWidth = 1.5;
              var eFilter = "";
              var eDimmed = false;
              if (showHP) {
                if (e.isHP) { eColor = "#34d399"; eWidth = 2.5; eFilter = "url(#hp-glow)"; }
                else { eDimmed = true; }
              }
              if (hpFocusId && hpFocusSet.size > 0) {
                var parts = e.key.split("-"); var eSrc = parts[0]; var eTgt = parts.slice(1).join("-");
                if (hpFocusSet.has(eSrc) && hpFocusSet.has(eTgt)) { eColor = "#10b981"; eWidth = 3; eFilter = "url(#hp-glow)"; eDimmed = false; }
                else { eDimmed = true; }
              }
              // Un-dim edges connected to hovered dimmed node
              if (hovDim && eDimmed) {
                var eParts = e.key.split("-"); var eS = eParts[0]; var eT = eParts.slice(1).join("-");
                if (eS === hovDim || eT === hovDim) { eDimmed = false; eColor = "#94a3b8"; eWidth = 2; }
              }
              // Hover on risk badge — show diversion (non-HP) lines from that gateway in red
              if (hovRisk && eDimmed) {
                var rParts = e.key.split("-"); var rS = rParts[0]; var rT = rParts.slice(1).join("-");
                if (rS === hovRisk && !hpNodes.has(rT)) { eDimmed = false; eColor = "#f87171"; eWidth = 2.5; }
              }
              return <path key={e.key} className={eDimmed ? "hp-dim-edge" : ""} d={d} fill="none" stroke={eColor} strokeWidth={eWidth} strokeDasharray={eDash} markerEnd="url(#ah3)" opacity={eDimmed ? undefined : (e.isHP && showHP ? 0.9 : 0.7)} filter={eFilter} style={{ transition: "opacity 0.4s, stroke 0.4s", pointerEvents: "stroke" }} />;
            })}
            {conn && nodes[conn] && <line x1={nodes[conn].x + nW / 2} y1={nodes[conn].y + nH / 2} x2={mp.x} y2={mp.y} stroke="#f59e0b" strokeWidth={2} strokeDasharray="6,4" />}

            {/* Nodes */}
            {nl.map(n => {
              const cx = n.x + nW / 2, cy = n.y + nH / 2, sel = selId === n.Seq;
              const sg = sel ? <rect x={n.x - 4} y={n.y - 4} width={nW + 8} height={nH + 8} rx={14} fill="none" stroke="#6366f1" strokeWidth={2} strokeDasharray="5,3" opacity={0.5} /> : null;
              const tc = typeColor(n.Type);
              const lbl = n.Milestone ? (n.Milestone.length > 24 ? n.Milestone.substring(0, 22) + ".." : n.Milestone) : "";
              const seqLbl = <text x={cx} y={n.y + nH + 12} textAnchor="middle" fill="#4a5578" fontSize={7} fontWeight="bold">{n.Seq}</text>;
              const grab = { cursor: dragSt ? "grabbing" : "grab" };
              const bt = BPMN_TYPES.find(t => t.id === n.Type);
              const shape = bt ? bt.shape : "rect";

              // Happy Path styling
              var nIsHP = hpNodes.has(n.Seq);
              var nOpacity = 1;
              var hpBorder = null;
              if (showHP && !hpFocusId) { nOpacity = nIsHP ? 1 : 0.2; }
              if (hpFocusId && hpFocusSet.size > 0) { nOpacity = hpFocusSet.has(n.Seq) ? 1 : 0.1; }
              if (showHP && nIsHP && !sel) { hpBorder = <rect x={n.x - 3} y={n.y - 3} width={nW + 6} height={nH + 6} rx={13} fill="none" stroke="#34d399" strokeWidth={1.5} opacity={0.5} />; }
              // Risk gateway indicator — bottom of node, hover-only, non-clickable
              var riskBadge = null;
              if (showHP && riskGateways.has(n.Seq)) {
                riskBadge = <g onMouseEnter={function() { setHovRisk(n.Seq); }} onMouseLeave={function() { setHovRisk(null); }} style={{ cursor: "default" }}>
                  <circle cx={n.x + nW + 6} cy={n.y + nH + 6} r={10} fill="rgba(239,68,68,.12)" stroke="#f87171" strokeWidth={1.5} />
                  <text x={n.x + nW + 6} y={n.y + nH + 7} textAnchor="middle" dominantBaseline="middle" fill="#ef4444" fontSize={12} fontWeight="bold">{"\u26A0"}</text>
                  <title>{"Diversion to Unhappy Path"}</title>
                </g>;
              }
              var isDimmed = (showHP && !nIsHP && !hpFocusId) || (hpFocusId && hpFocusSet.size > 0 && !hpFocusSet.has(n.Seq));
              // Un-dim if this node is the diversion target of a hovered risk gateway
              if (isDimmed && hovRisk && nodes[hovRisk]) {
                var rvTargets = (nodes[hovRisk].ConnectTo || "").split(",").map(function(s) { return s.trim(); }).filter(Boolean);
                if (rvTargets.includes(n.Seq) && !hpNodes.has(n.Seq)) isDimmed = false;
              }
              var nodeWrap = function(inner) {
                return <g key={n.Seq} className={isDimmed ? "hp-dim" : ""} onMouseDown={e => { if (showHP && nIsHP) setHpFocusId(hpFocusId === n.Seq ? null : n.Seq); onND(n.Seq, e); }} onMouseEnter={isDimmed ? function() { setHovDim(n.Seq); } : undefined} onMouseLeave={isDimmed ? function() { setHovDim(null); } : undefined} style={{ ...grab, opacity: isDimmed ? undefined : nOpacity, transition: "opacity 0.4s" }}>{hpBorder}{inner}{riskBadge}</g>;
              };

              // Start events (circles) — show activity name above
              if (shape.startsWith("circle") && !shape.includes("bold") && !shape.includes("filled") && !shape.includes("lightning") && !shape.includes("arrow") && !shape.includes("double")) {
                return nodeWrap(<>{sg}<circle cx={cx} cy={cy} r={22} fill={tc + "20"} stroke={sel ? "#6366f1" : tc} strokeWidth={2.5} /><text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={tc} fontSize={9} fontWeight="bold">{n.Type.replace(" Event", "").replace("Message Start", "MSG").replace("Timer Start", "TMR").toUpperCase().substring(0, 5)}</text><text x={cx} y={n.y - 8} textAnchor="middle" fill={tc} fontSize={8} fontWeight="500">{lbl}</text>{seqLbl}</>);
              }
              // End events — show activity name above
              if (shape.startsWith("circle-bold") || shape === "circle-lightning" || shape === "circle-filled") {
                const icon = shape === "circle-lightning" ? "\u26A1" : shape === "circle-filled" ? "\u25CF" : "";
                return nodeWrap(<>{sg}<circle cx={cx} cy={cy} r={22} fill={tc + "20"} stroke={sel ? "#6366f1" : tc} strokeWidth={3.5} /><text x={cx} y={cy + (icon ? -3 : 0)} textAnchor="middle" dominantBaseline="middle" fill={tc} fontSize={9} fontWeight="bold">END</text>{icon && <text x={cx} y={cy + 10} textAnchor="middle" fontSize={10}>{icon}</text>}<text x={cx} y={n.y - 8} textAnchor="middle" fill={tc} fontSize={8} fontWeight="500">{lbl}</text>{seqLbl}</>);
              }
              // Loop connector
              if (shape === "circle-arrow") {
                return nodeWrap(<>{sg}<circle cx={cx} cy={cy} r={18} fill={tc + "20"} stroke={sel ? "#6366f1" : tc} strokeWidth={2} strokeDasharray="4,3" /><text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill={tc} fontSize={14}>{"\u21BB"}</text>{seqLbl}</>);
              }
              // Intermediate events
              if (shape.startsWith("double-circle")) {
                const icon = shape.includes("clock") ? "\u23F1" : shape.includes("env") ? "\u2709" : "";
                return nodeWrap(<>{sg}<circle cx={cx} cy={cy} r={22} fill={tc + "10"} stroke={sel ? "#6366f1" : tc} strokeWidth={2} /><circle cx={cx} cy={cy} r={17} fill="none" stroke={tc} strokeWidth={1.5} /><text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill={tc} fontSize={12}>{icon || "!"}</text>{seqLbl}<text x={cx} y={n.y - 6} textAnchor="middle" fill={tc} fontSize={8}>{lbl}</text></>);
              }
              // Gateways
              if (shape.startsWith("diamond")) {
                const icon = shape === "diamond-plus" ? "+" : shape === "diamond-circle" ? "O" : shape === "diamond-penta" ? "\u2B23" : "X";
                return nodeWrap(<>{sg}<polygon points={cx + "," + (cy - 26) + " " + (cx + 26) + "," + cy + " " + cx + "," + (cy + 26) + " " + (cx - 26) + "," + cy} fill={tc + "20"} stroke={sel ? "#6366f1" : tc} strokeWidth={2} /><text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill={tc} fontSize={13} fontWeight="bold">{icon}</text><text x={cx} y={n.y - 6} textAnchor="middle" fill={tc} fontSize={8}>{lbl}</text>{seqLbl}</>);
              }
              // Condition expression (pill)
              if (shape === "pill") {
                const pw = Math.max(60, lbl.length * 7 + 20), ph = 24;
                return nodeWrap(<>{sg}<rect x={cx - pw / 2} y={cy - ph / 2} width={pw} height={ph} rx={ph / 2} fill="rgba(100,116,139,.15)" stroke={sel ? "#6366f1" : tc} strokeWidth={1.5} strokeDasharray="4,2" /><text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill={tc} fontSize={9} fontWeight="600" fontStyle="italic">{lbl || "?"}</text>{seqLbl}</>);
              }
              // Tasks / activities (rectangles)
              const icon2 = shape === "rect-person" ? "\u{1F464}" : shape === "rect-hand" ? "\u270B" : shape === "rect-gear" ? "\u2699" : shape === "rect-script" ? "\u{1F4DC}" : "";
              return nodeWrap(<>{sg}<rect x={n.x} y={n.y} width={nW} height={nH} rx={10} fill="rgba(15,25,50,.9)" stroke={sel ? "#6366f1" : tc} strokeWidth={shape === "rect-bold" ? 3.5 : 2} />{shape === "rect-double" && <rect x={n.x + 4} y={n.y + 4} width={nW - 8} height={nH - 8} rx={7} fill="none" stroke={tc} strokeWidth={1} opacity={0.4} />}{n.Mode && <rect x={n.x + 1} y={n.y + 6} width={3} height={nH - 12} rx={2} fill={tc} />}<text x={n.x + (icon2 ? 22 : 10)} y={n.y + 18} fill="#e8ecf4" fontSize={9} fontWeight="600">{lbl}</text>{icon2 && <text x={n.x + 10} y={n.y + 19} fontSize={10}>{icon2}</text>}<text x={n.x + 10} y={n.y + 32} fill="#7b8bb2" fontSize={8}>{n.Responsible}</text>{n.TCode && <text x={n.x + 10} y={n.y + 44} fill="#34d399" fontSize={7}>{n.TCode}</text>}{seqLbl}</>);
            })}

            {/* 3D Friction bubbles — animated, gradient-shaded, with reflections */}
            {showFric && (() => {
              // Collect all bubble data first for collision detection
              var bubbles = [];
              nl.forEach(function(n) {
                if (!n.Friction) return;
                var frList = n.Friction.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
                var count = frList.length;
                if (count === 0) return;
                var rad = count === 1 ? 16 : count === 2 ? 20 : count === 3 ? 26 : count === 4 ? 32 : count === 5 ? 38 : 44;
                var bx = n.x + nW + rad * 0.3, by = n.y - rad * 0.4;
                bubbles.push({ seq: n.Seq, cx: bx, cy: by, r: rad, count: count, names: frList });
              });
              // Collision resolution — push overlapping bubbles apart
              for (var pass = 0; pass < 5; pass++) {
                for (var i = 0; i < bubbles.length; i++) {
                  for (var j = i + 1; j < bubbles.length; j++) {
                    var dx = bubbles[j].cx - bubbles[i].cx;
                    var dy = bubbles[j].cy - bubbles[i].cy;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var minD = bubbles[i].r + bubbles[j].r + 6;
                    if (dist < minD && dist > 0) {
                      var push = (minD - dist) / 2;
                      var nx = dx / dist, ny = dy / dist;
                      bubbles[i].cx -= nx * push; bubbles[i].cy -= ny * push;
                      bubbles[j].cx += nx * push; bubbles[j].cy += ny * push;
                    }
                  }
                }
              }
              return bubbles.map(function(b, bi) {
                var gradId = b.count <= 1 ? "bub-green" : b.count <= 3 ? "bub-yellow" : b.count <= 5 ? "bub-orange" : "bub-red";
                var edgeColor = b.count <= 1 ? "rgba(34,197,94,.3)" : b.count <= 3 ? "rgba(234,179,8,.3)" : b.count <= 5 ? "rgba(249,115,22,.3)" : "rgba(244,63,94,.35)";
                var textCol = b.count <= 1 ? "rgba(21,128,61,.7)" : b.count <= 3 ? "rgba(161,98,7,.7)" : b.count <= 5 ? "rgba(194,65,12,.7)" : "rgba(190,18,60,.8)";
                var anim = "bfloat" + ((bi % 3) + 1) + " " + (4 + (bi % 5)) + "s ease-in-out infinite";
                var isPulse = b.count >= 6;
                return <g key={"fb-" + b.seq} filter="url(#bub-shadow)" style={{ animation: anim, transformOrigin: b.cx + "px " + b.cy + "px" }}>
                  {/* Outer ring — thin translucent colored edge */}
                  <circle cx={b.cx} cy={b.cy} r={b.r} fill="none" stroke={edgeColor} strokeWidth={1.5} style={isPulse ? { animation: "bpulse 2.5s ease-in-out infinite" } : {}} />
                  {/* Transparent tinted body — nearly invisible center */}
                  <circle cx={b.cx} cy={b.cy} r={b.r - 1} fill={"url(#" + gradId + ")"} />
                  {/* Iridescent rainbow film overlay */}
                  <circle cx={b.cx} cy={b.cy} r={b.r - 1} fill="url(#bub-iris)" style={{ animation: "bshimmer " + (3 + bi % 4) + "s ease-in-out infinite" }} />
                  {/* Secondary soft glow bottom-right */}
                  <circle cx={b.cx + b.r * 0.2} cy={b.cy + b.r * 0.2} r={b.r * 0.35} fill="url(#bub-shine2)" />
                  {/* Number — subtle, semi-transparent */}
                  <text x={b.cx} y={b.cy + 1} textAnchor="middle" dominantBaseline="middle" fill={textCol} fontSize={b.r > 28 ? 18 : b.r > 20 ? 15 : 12} fontWeight="700" opacity={0.85}>{b.count}</text>
                  <title>{"Frictions (" + b.count + "): " + b.names.join(", ")}</title>
                </g>;
              });
            })()}
          </svg>
        </div>
      </div>
      {/* Properties panel */}
      {selId && selN && !conn && (
        <div className="w-56 gl2 border-l border-white/5 overflow-y-auto shrink-0">
          <div className="px-3 py-2.5 border-b border-white/5 flex items-center justify-between sticky top-0 z-10" style={{ background: "rgba(10,14,26,.95)" }}>
            <span className="text-xs font-semibold text-white">Properties</span>
            <button onClick={() => setSelId(null)} className="text-slate-500 hover:text-white"><X size={14} /></button>
          </div>
          <div className="p-3 space-y-2">
            <div><label className="text-[10px] font-semibold text-slate-600 uppercase">Seq</label><div className="mt-0.5 px-2 py-1.5 rounded-lg bg-white/5 text-sm acc-text mono">{selN.Seq}</div></div>
            <div><label className="text-[10px] font-semibold text-slate-600 uppercase">Type</label><select value={selN.Type} onChange={e => upd(selId, "Type", e.target.value)} className="mt-0.5 w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 appearance-none cursor-pointer">{BPMN_TYPES.map(t => <option key={t.id} value={t.id} style={{ background: "#0c1019" }}>{t.id}</option>)}</select></div>
            <div><label className="text-[10px] font-semibold text-slate-600 uppercase">Milestone</label><textarea value={selN.Milestone} onChange={e => upd(selId, "Milestone", e.target.value)} rows={2} className="mt-0.5 w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 resize-none" /></div>
            <div><label className="text-[10px] font-semibold text-slate-600 uppercase">Connect To</label><input value={selN.ConnectTo || ""} onChange={e => upd(selId, "ConnectTo", e.target.value)} className="mt-0.5 w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 mono" /></div>
            <div><label className="text-[10px] font-semibold text-slate-600 uppercase">Responsible</label><input value={selN.Responsible || ""} onChange={e => upd(selId, "Responsible", e.target.value)} className="mt-0.5 w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200" /></div>
            <div><label className="text-[10px] font-semibold text-slate-600 uppercase">Mode</label><select value={selN.Mode || ""} onChange={e => upd(selId, "Mode", e.target.value)} className="mt-0.5 w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 appearance-none cursor-pointer"><option value="" style={{ background: "#0c1019" }}>--</option>{EXEC_MODES.map(m => <option key={m.id} value={m.id} style={{ background: "#0c1019" }}>{m.id}</option>)}</select></div>
            <div><label className="text-[10px] font-semibold text-slate-600 uppercase">System</label><input value={selN.System || ""} onChange={e => upd(selId, "System", e.target.value)} className="mt-0.5 w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200" /></div>
            <div><label className="text-[10px] font-semibold text-slate-600 uppercase">T-Code</label><input value={selN.TCode || ""} onChange={e => upd(selId, "TCode", e.target.value)} className="mt-0.5 w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-emerald-400 mono" /></div>
            <div><label className="text-[10px] font-semibold text-slate-600 uppercase">Control ID</label><input value={selN.ControlID || ""} onChange={e => upd(selId, "ControlID", e.target.value)} className="mt-0.5 w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-amber-400 mono" /></div>
            <div><label className="text-[10px] font-semibold text-slate-600 uppercase">Annotation</label><textarea value={selN.Annotation || ""} onChange={e => upd(selId, "Annotation", e.target.value)} rows={2} className="mt-0.5 w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 resize-none" /></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROCESSING SCREEN ───
const WARM_MSGS = [
  "Good things take time. Delta is crafting something great.",
  "Behind the scenes, AI is reading between the lines of your process.",
  "Your process is being transformed into structured BPMN magic.",
  "Almost there... precision takes a moment.",
  "Your data stays private. Delta's AI runs in a secure, isolated environment \u2014 never shared with public models.",
  "Enterprise-grade security. Your process data is encrypted and never used to train external AI.",
  "Your intellectual property is protected. Nothing leaves your environment.",
  "Confidential by design. Delta never stores, shares, or learns from your process data.",
  "Delta follows 40 strict BPMN rules \u2014 no hallucination, no guesswork, just structured precision.",
  "Every output is validated against BPMN 2.0 standards before it reaches you.",
  "AI-assisted, human-controlled. You review, edit, and approve everything Delta generates.",
  "Delta doesn't guess. If uncertain, it leaves fields blank rather than risk inaccuracy.",
];

const FEATURES = [
  { title: "Auto-detect Gateways", desc: "Delta identifies decision points, Yes/No branches, and loop patterns automatically from your raw text." },
  { title: "40-Rule Validation Engine", desc: "Every output passes through strict BPMN validation \u2014 checking flow integrity, control linkage, and column isolation." },
  { title: "Inline Table Editing", desc: "After generation, click any cell to edit. Shift+Arrow to move rows. Add, duplicate, or delete with one click." },
  { title: "Full Process Lifecycle", desc: "Your generated process flows into SAP Analyzer, Automation Lab, Report Generator \u2014 all connected." },
  { title: "Version-Controlled Vault", desc: "Save every version. Compare changes. Restore older versions. Full audit trail for your process assets." },
  { title: "SAP-Aware Intelligence", desc: "Delta enriches your process with T-Codes, Fiori Apps, and L5 UIDs when SAP context is detected." },
];

const STAGES = [
  { label: "Reading your input", from: 0 },
  { label: "Identifying process steps and actors", from: 4 },
  { label: "Building BPMN structure with gateways and loops", from: 9 },
  { label: "Generating metadata and controls", from: 15 },
  { label: "Running 40-rule validation engine", from: 21 },
  { label: "Polishing the output", from: 26 },
];

function ProcessingScreen() {
  const [elapsed, setElapsed] = useState(0);
  const [msgIdx] = useState(() => Math.floor(Math.random() * WARM_MSGS.length));
  const [featIdx, setFeatIdx] = useState(() => Math.floor(Math.random() * FEATURES.length));

  useEffect(() => {
    const t = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setFeatIdx(p => (p + 1) % FEATURES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const currentStage = [...STAGES].reverse().find(s => elapsed >= s.from) || STAGES[0];
  const stageIdx = STAGES.indexOf(currentStage);
  const warmMsg = WARM_MSGS[(msgIdx + Math.floor(elapsed / 7)) % WARM_MSGS.length];
  const feat = FEATURES[featIdx];

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return (m > 0 ? m + "m " : "") + sec + "s";
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 max-w-lg mx-auto">
      {/* Timer */}
      <div className="flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full gl text-[11px]">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <span className="text-slate-400">Elapsed</span>
        <span className="mono acc-text font-semibold">{formatTime(elapsed)}</span>
      </div>

      {/* Spinner */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <RefreshCw size={28} className="acc-text animate-spin" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-white mb-2">Delta is working</h2>

      {/* Stage indicators */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 justify-center mb-3">
          {STAGES.map((s, i) => (
            <div key={i} className={"w-2 h-2 rounded-full transition-all duration-500 " + (i <= stageIdx ? "acc-bg scale-110" : "bg-white/10")} />
          ))}
        </div>
        <p className="text-sm acc-text font-medium text-center">{currentStage.label}...</p>
      </div>

      {/* Warm message */}
      <div className="gl rounded-2xl px-5 py-3 mb-5 text-center max-w-md" key={warmMsg}>
        <p className="text-sm text-slate-300 leading-relaxed italic">{"\u201C"}{warmMsg}{"\u201D"}</p>
      </div>

      {/* Feature highlight card */}
      <div className="w-full max-w-md gl rounded-2xl p-4 mb-5" key={feat.title}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="acc-text" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Did you know?</span>
        </div>
        <h4 className="text-sm font-semibold text-white mb-1">{feat.title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
      </div>

      {/* Trust badge - always visible */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full gl text-[10px]">
        <Lock size={11} className="text-emerald-400" />
        <span className="text-emerald-400 font-medium">Private AI</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-500">Your data never leaves your secure environment</span>
      </div>
    </div>
  );
}

// ─── STRUCTURE BUILDER ───
// ─── BPMN 2.0 XML EXPORT ───
function generateBpmnXml(bpmn, nodes, laneLayout) {
  try {
  var CL = "<" + "/"; // closing tag prefix — split to avoid JSX parser confusion
  var mkId = function(p, i) { return p + "_" + (i || "").replace(/[^a-zA-Z0-9]/g, "_"); };
  var esc = function(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };

  var typeMap = {
    "Start Event": "bpmn:startEvent", "Timer Start Event": "bpmn:startEvent", "Message Start Event": "bpmn:startEvent",
    "Task": "bpmn:task", "User Task": "bpmn:userTask", "Manual Task": "bpmn:manualTask",
    "Service Task": "bpmn:serviceTask", "Script Task": "bpmn:scriptTask",
    "Sub-Process": "bpmn:subProcess", "Call Activity": "bpmn:callActivity",
    "XOR Gateway": "bpmn:exclusiveGateway", "AND Gateway": "bpmn:parallelGateway",
    "OR Gateway": "bpmn:inclusiveGateway", "Event-Based Gateway": "bpmn:eventBasedGateway",
    "End Event": "bpmn:endEvent", "Error End Event": "bpmn:endEvent", "Terminate End Event": "bpmn:endEvent",
    "Intermediate Timer Event": "bpmn:intermediateCatchEvent", "Intermediate Message Event": "bpmn:intermediateCatchEvent",
    "Loop Connector": "bpmn:task", "Condition Expression": null,
  };

  if (!bpmn || !bpmn.length) return "";

  var roles = (laneLayout && laneLayout.roles) ? laneLayout.roles : [];
  var getRole = function(r) { return (r.Responsible && r.Responsible.trim()) || "Unassigned"; };

  var flows = [];
  bpmn.forEach(function(r) {
    if (!r.ConnectTo) return;
    r.ConnectTo.split(",").map(function(s) { return s.trim(); }).filter(Boolean).forEach(function(tgt) {
      var tgtRow = bpmn.find(function(b) { return b.Seq === tgt; });
      var isCE = tgtRow && tgtRow.Type === "Condition Expression";
      flows.push({ id: mkId("Flow", r.Seq + "_" + tgt), src: mkId("Node", r.Seq), tgt: mkId("Node", tgt), name: isCE ? (tgtRow.Milestone || "") : "" });
    });
  });

  var elements = "";
  bpmn.forEach(function(r) {
    var tag = typeMap[r.Type];
    if (!tag) return;
    var nid = mkId("Node", r.Seq);
    var inc = flows.filter(function(f) { return f.tgt === nid; }).map(function(f) { return f.id; });
    var out = flows.filter(function(f) { return f.src === nid; }).map(function(f) { return f.id; });
    elements += "    <" + tag + " id=\"" + nid + "\" name=\"" + esc(r.Milestone) + "\">\n";
    inc.forEach(function(i2) { elements += "      <bpmn:incoming>" + i2 + CL + "bpmn:incoming>\n"; });
    out.forEach(function(o) { elements += "      <bpmn:outgoing>" + o + CL + "bpmn:outgoing>\n"; });
    elements += "    " + CL + tag + ">\n";
  });

  var flowXml = "";
  flows.forEach(function(f) {
    flowXml += "    <bpmn:sequenceFlow id=\"" + f.id + "\" sourceRef=\"" + f.src + "\" targetRef=\"" + f.tgt + "\"";
    if (f.name) flowXml += " name=\"" + esc(f.name) + "\"";
    flowXml += " />\n";
  });

  var laneXml = "";
  if (roles.length > 0) {
    laneXml = "    <bpmn:laneSet id=\"LaneSet_1\">\n";
    roles.forEach(function(role) {
      var laneNodes = bpmn.filter(function(r) { return getRole(r) === role && typeMap[r.Type]; });
      laneXml += "      <bpmn:lane id=\"" + mkId("Lane", role) + "\" name=\"" + esc(role) + "\">\n";
      laneNodes.forEach(function(r) { laneXml += "        <bpmn:flowNodeRef>" + mkId("Node", r.Seq) + CL + "bpmn:flowNodeRef>\n"; });
      laneXml += "      " + CL + "bpmn:lane>\n";
    });
    laneXml += "    " + CL + "bpmn:laneSet>\n";
  }

  var diXml = "  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1\">\n";
  if (nodes && typeof nodes === "object") {
    Object.values(nodes).forEach(function(n) {
      if (!n || !typeMap[n.Type]) return;
      diXml += "      <bpmndi:BPMNShape id=\"" + mkId("Shape", n.Seq) + "\" bpmnElement=\"" + mkId("Node", n.Seq) + "\">\n";
      diXml += "        <dc:Bounds x=\"" + Math.round(n.x || 0) + "\" y=\"" + Math.round(n.y || 0) + "\" width=\"160\" height=\"56\" />\n";
      diXml += "      " + CL + "bpmndi:BPMNShape>\n";
    });
  }
  flows.forEach(function(f) {
    diXml += "      <bpmndi:BPMNEdge id=\"" + mkId("Edge", f.id) + "\" bpmnElement=\"" + f.id + "\" />\n";
  });
  diXml += "    " + CL + "bpmndi:BPMNPlane>\n  " + CL + "bpmndi:BPMNDiagram>\n";

  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
    "<bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\"\n" +
    "  xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\"\n" +
    "  xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\"\n" +
    "  xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\"\n" +
    "  id=\"Definitions_1\" targetNamespace=\"http://bpmn.io/schema/bpmn\">\n" +
    "  <bpmn:process id=\"Process_1\" isExecutable=\"false\">\n" +
    laneXml + elements + flowXml +
    "  " + CL + "bpmn:process>\n" + diXml +
    CL + "bpmn:definitions>\n";
  } catch (e) { console.error("BPMN export error:", e); return ""; }
}

// ─── DIAGRAM IMAGE EXPORT ───

// ─── DIAGRAM IMAGE EXPORT (data URI, no Blob) ───
function exportDiagramImage(svgEl, format, filename) {
  try {
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const w = parseInt(svgEl.getAttribute("width")) || 1200;
    const h = parseInt(svgEl.getAttribute("height")) || 800;
    canvas.width = w * 2; canvas.height = h * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2); ctx.fillStyle = "#0a0e1a"; ctx.fillRect(0, 0, w, h);
    const img = new Image();
    const svgB64 = btoa(unescape(encodeURIComponent(svgData)));
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      const mime = format === "jpeg" ? "image/jpeg" : "image/png";
      const dataUrl = canvas.toDataURL(mime, 0.95);
      const a = document.createElement("a");
      a.href = dataUrl; a.download = filename + "." + format;
      a.style.display = "none"; document.body.appendChild(a);
      a.click();
      setTimeout(() => { try { document.body.removeChild(a); } catch(x){} }, 300);
    };
    img.src = "data:image/svg+xml;base64," + svgB64;
  } catch (e) { console.error("Image export error:", e); }
}

// ─── EXPORT MENU (data URI downloads — no Blob/createObjectURL) ───
function ExportMenu({ result }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  // Download text content via data URI — safe in iframes/artifacts
  const dlText = (content, name) => {
    try {
      const b64 = btoa(unescape(encodeURIComponent(content)));
      const a = document.createElement("a");
      a.href = "data:application/octet-stream;base64," + b64;
      a.download = name;
      a.style.display = "none"; document.body.appendChild(a);
      a.click();
      setTimeout(() => { try { document.body.removeChild(a); } catch(x){} }, 300);
    } catch (e) {
      // Fallback: show content in copy modal
      setPreview({ name, content });
    }
  };

  const expBpmn = (ext) => {
    try {
      const xml = generateBpmnXml(result.bpmn, null, { roles: [] });
      dlText(xml, "Delta_Process." + ext);
    } catch (e) { console.error("BPMN export error:", e); setPreview({ name: "Error", content: "Export failed: " + (e.message || "") }); }
  };

  return (
    <div className="relative">
      <Bt v="secondary" sz="sm" icon={Download} onClick={() => setOpen(!open)}>Export</Bt>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-72 gl2 rounded-2xl shadow-2xl p-2 z-50">
          <div className="px-3 py-1 text-[10px] uppercase text-slate-600 font-semibold">Data</div>
          <button onClick={() => { exportBpmnExcel(result.bpmn); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-slate-300 hover:bg-white/5">
            <Download size={13} className="text-emerald-400 shrink-0" /><div><span className="font-medium">BPMN Table (.xlsx)</span></div>
          </button>
          <button onClick={() => { exportAllExcel(result); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-slate-300 hover:bg-white/5">
            <Download size={13} className="acc-text shrink-0" /><div><span className="font-medium">Complete Process (.xlsx)</span></div>
          </button>
          <button onClick={() => { dlText(JSON.stringify(result, null, 2), "Delta_Process.json"); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-slate-300 hover:bg-white/5">
            <Download size={13} className="text-cyan-400 shrink-0" /><div><span className="font-medium">JSON Export</span></div>
          </button>
          <div className="px-3 py-1 mt-1 text-[10px] uppercase text-slate-600 font-semibold border-t border-white/5">BPMN Standard</div>
          <button onClick={() => { expBpmn("bpmn"); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-slate-300 hover:bg-white/5">
            <Download size={13} className="text-violet-400 shrink-0" /><div><span className="font-medium">BPMN 2.0 (.bpmn)</span><span className="text-[10px] text-slate-500 ml-2">Camunda, Signavio</span></div>
          </button>
          <button onClick={() => { expBpmn("xml"); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-slate-300 hover:bg-white/5">
            <Download size={13} className="text-violet-400 shrink-0" /><div><span className="font-medium">BPMN XML (.xml)</span></div>
          </button>
          <div className="px-3 py-1 mt-1 text-[10px] uppercase text-slate-600 font-semibold border-t border-white/5">Diagram Image</div>
          <button onClick={() => { const svg = document.querySelector("svg[width]"); exportDiagramImage(svg, "png", "Delta_Diagram"); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-slate-300 hover:bg-white/5">
            <Download size={13} className="text-amber-400 shrink-0" /><div><span className="font-medium">PNG Image</span></div>
          </button>
          <button onClick={() => { const svg = document.querySelector("svg[width]"); exportDiagramImage(svg, "jpeg", "Delta_Diagram"); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-slate-300 hover:bg-white/5">
            <Download size={13} className="text-amber-400 shrink-0" /><div><span className="font-medium">JPEG Image</span></div>
          </button>
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,.7)" }}>
          <div className="w-full max-w-2xl gl2 rounded-2xl shadow-2xl p-5 m-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">{preview.name}</span>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(preview.content); }} className="px-3 py-1 rounded-lg text-xs bg-indigo-600 text-white">Copy All</button>
                <button onClick={() => setPreview(null)} className="px-3 py-1 rounded-lg text-xs gl text-slate-400">Close</button>
              </div>
            </div>
            <textarea value={preview.content} readOnly className="w-full h-64 bg-black/30 text-xs text-slate-300 mono p-3 rounded-xl border border-white/10 resize-none" />
          </div>
        </div>
      )}
    </div>
  );
}

function SBuilder() {
  const [step, setStep] = useState(0);
  const [flt, setFlt] = useState({ mode: "", rags: ["client", "bpmn"], src: "", out: "both" });
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("bpmn");
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState(null);
  const [stage, setStage] = useState("");

  // Table preferences — loaded once at SBuilder level, persists across tab switches
  const [tblPrefs, setTblPrefs] = useState({ tt: "warmlight", ci: 40, fsz: "md", ff: "outfit", grid: false });
  useEffect(() => {
    (async () => {
      try {
        const r = { value: localStorage.getItem("bpmn-table-prefs") };
        if (r && r.value) { const p = JSON.parse(r.value); setTblPrefs(prev => ({ ...prev, ...p })); }
      } catch (e) {}
    })();
  }, []);

  const steps = ["Setup", "Input", "Generate", "Review", "Save"];
  const okS = flt.mode && flt.src && flt.rags.length > 0;
  const okI = text.length > 20;

  const gen = useCallback(async (override) => {
    setLoading(true); setErr(null); setStage("Sending...");
    try {
      setStage("AI analyzing...");
      const gl = getActiveGuidelines("structure-builder", flt.mode);
      const raw = await callAPI(override || text, flt.mode, gl);
      setStage("Parsing...");
      const p = parseAI(raw);
      if (!p.bpmn || !p.bpmn.length) throw new Error("No BPMN table returned.");
      setResult({ meta: p.meta, bpmn: p.bpmn, controls: p.controls, customers: p.customers, raw, src: override || text });
      setLoading(false); setStep(3);
    } catch (e) { setErr(e.message); setLoading(false); }
  }, [text, flt.mode]);

  const vals = result ? doValidate(result.bpmn, result.controls) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-white/5 gl2">
        <div className="flex items-center gap-2 mb-0.5"><Layers size={18} className="text-indigo-400" /><h1 className="text-lg font-bold text-white">Process Structure Builder</h1>{result && <Bg v="success">Generated</Bg>}{saved && <Bg v="info">Vault</Bg>}</div>
        <p className="text-xs text-slate-500">Convert raw notes into structured BPMN</p>
      </div>
      <SB steps={steps} current={step} onStep={setStep} />
      <div className="flex-1 overflow-auto">
        {/* Step 0: Setup */}
        {step === 0 && (
          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-base font-semibold text-white mb-5">Generation Setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Cd c="p-5"><p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2"><Workflow size={14} className="text-indigo-400" />Mode</p><div className="grid grid-cols-2 gap-2">{["Build As-Is", "Build To-Be"].map(m => <button key={m} onClick={() => setFlt(f => ({ ...f, mode: m }))} className={"px-4 py-3 rounded-xl text-sm font-medium border transition-all " + (flt.mode === m ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" : "gl text-slate-400 hover:text-white")}>{m}</button>)}</div></Cd>
              <Cd c="p-5"><p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2"><Brain size={14} className="text-cyan-400" />Knowledge Sources</p><p className="text-[10px] text-slate-600 mb-2">Auto-configured from Admin RAG Orchestration. Toggle to override.</p>{ragSources.map(r => { const orchKey = "structure-builder|" + flt.mode; const pipeline = ragOrch[orchKey] || []; const inPipeline = pipeline.find(p => p.ragId === r.id); return <label key={r.id} className="flex items-center gap-2.5 text-sm text-slate-400 py-1 cursor-pointer hover:text-white"><input type="checkbox" checked={flt.rags.includes(r.id)} onChange={() => setFlt(f => ({ ...f, rags: f.rags.includes(r.id) ? f.rags.filter(x => x !== r.id) : [...f.rags, r.id] }))} className="accent-indigo-500 rounded" /><span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />{r.n}{inPipeline && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-auto">{inPipeline.mandatory ? "Required" : "Suggested"}</span>}</label> })}</Cd>
              <Cd c="p-5"><p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2"><FileUp size={14} className="text-amber-400" />Source</p>{[{ id: "paste", l: "Paste text", I: Copy }, { id: "upload", l: "Upload file", I: Upload }, { id: "vault", l: "From Vault", I: Database }].map(s => <button key={s.id} onClick={() => setFlt(f => ({ ...f, src: s.id }))} className={"w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm border mb-2 transition-all " + (flt.src === s.id ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" : "gl text-slate-400")}><s.I size={16} />{s.l}</button>)}</Cd>
              <Cd c="p-5"><p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2"><FileText size={14} className="text-emerald-400" />Output</p><div className="grid grid-cols-3 gap-2">{[["bpmn-excel", "Excel"], ["diagram", "Diagram"], ["both", "Both"]].map(([v, l]) => <button key={v} onClick={() => setFlt(f => ({ ...f, out: v }))} className={"px-3 py-2 rounded-xl text-xs border transition-all " + (flt.out === v ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" : "gl text-slate-500")}>{l}</button>)}</div></Cd>
            </div>
            <div className="flex items-center justify-between mt-8">
              {!okS ? <span className="flex items-center gap-2 text-amber-400 text-xs"><AlertTriangle size={14} />Complete setup</span> : <span />}
              <Bt onClick={() => setStep(1)} disabled={!okS} icon={ArrowRight}>Continue</Bt>
            </div>
          </div>
        )}
        {/* Step 1: Input */}
        {step === 1 && (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-5"><h2 className="text-base font-semibold text-white">Input</h2><Bg v="info">{flt.mode}</Bg></div>
            {flt.src === "paste" && (
              <Cd c="overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between"><span className="text-xs text-slate-500">Process Notes</span><Bt v="ghost" sz="sm" icon={Sparkles} onClick={() => setText(SAMPLE)}>Sample</Bt></div>
                <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste process description..." className="w-full h-72 bg-transparent text-slate-200 text-sm p-4 resize-none mono leading-relaxed placeholder:text-slate-700" spellCheck={false} />
                <div className="px-4 py-2 border-t border-white/5 text-[11px] text-slate-600">{text.length} chars</div>
              </Cd>
            )}
            {flt.src === "upload" && <Cd c="p-14 text-center" glow><Upload size={40} className="text-slate-600 mx-auto mb-4" /><p className="text-slate-300">Drop file</p></Cd>}
            <div className="flex justify-between mt-8"><Bt v="ghost" onClick={() => setStep(0)} icon={ArrowLeft}>Back</Bt><Bt onClick={() => setStep(2)} disabled={!okI} icon={ArrowRight}>Continue</Bt></div>
          </div>
        )}
        {/* Step 2: Generate */}
        {step === 2 && (
          <div className="p-6 max-w-3xl mx-auto text-center py-12 mesh rounded-3xl mx-6 my-6">
            {!loading && !result && !err && (
              <div className="au"><div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6" style={{ animation: "pg 3s infinite" }}><Sparkles size={32} className="text-indigo-400" /></div><h2 className="text-2xl font-bold text-white mb-2">Ready to Generate</h2><p className="text-sm text-slate-400 mb-6">AI will process your input</p><Bt sz="lg" onClick={() => gen()} icon={Sparkles}>Generate</Bt></div>
            )}
            {loading && (
              <ProcessingScreen />
            )}
            {err && (
              <div><AlertTriangle size={32} className="text-red-400 mx-auto mb-4" /><h2 className="text-lg font-bold text-white mb-2">Failed</h2><p className="text-sm text-red-400 mb-6">{err}</p><div className="flex gap-3 justify-center"><Bt v="ghost" onClick={() => setStep(1)} icon={ArrowLeft}>Edit</Bt><Bt onClick={() => { setErr(null); gen(); }} icon={RefreshCw}>Retry</Bt></div></div>
            )}
          </div>
        )}
        {/* Step 3: Review */}
        {step === 3 && result && (
          <div className="flex flex-col" style={{ height: "calc(100vh - 170px)" }}>
            <TB tabs={[
              { id: "bpmn", label: "BPMN Table", count: result.bpmn.length },
              { id: "meta", label: "Metadata" },
              { id: "ctrl", label: "Controls", count: result.controls.length },
              { id: "cust", label: "Customers", count: result.customers.length },
              { id: "diag", label: "Diagram" },
              { id: "val", label: "Validation", count: vals.length },
              { id: "src", label: "Source Document" },
            ]} active={tab} onChange={setTab} />
            <div className={"flex-1 " + (tab === "bpmn" || tab === "diag" ? "overflow-hidden" : "overflow-auto p-5")} style={{ minHeight: 0 }}>
              {tab === "bpmn" && <BpmnTbl data={result.bpmn} onChange={nb => setResult(p => ({ ...p, bpmn: nb }))} prefs={tblPrefs} onPrefs={setTblPrefs} />}
              {tab === "meta" && <MetaTbl data={result.meta} onChange={nm => setResult(p => ({ ...p, meta: nm }))} />}
              {tab === "ctrl" && <CtrlTbl data={result.controls} onChange={nc => setResult(p => ({ ...p, controls: nc }))} />}
              {tab === "cust" && <CustEdit data={result.customers} onChange={nc => setResult(p => ({ ...p, customers: nc }))} />}
              {tab === "diag" && <BpmnDiag data={result.bpmn} onChange={nb => setResult(p => ({ ...p, bpmn: nb }))} />}
              {tab === "val" && (
                <div className="space-y-2">
                  <Cd c="p-5 mb-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[["Rows", result.bpmn.length], ["Tasks", result.bpmn.filter(r => r.Type === "Task").length], ["Controls", result.controls.length], ["Issues", vals.filter(v => v.t === "warning" || v.t === "danger").length]].map(([l, s]) => (
                        <div key={l} className="text-center"><div className="text-2xl font-bold tg">{s}</div><div className="text-[10px] text-slate-500">{l}</div></div>
                      ))}
                    </div>
                  </Cd>
                  {vals.map((v, i) => (
                    <Cd key={i} c="p-3 flex items-start gap-3">
                      {v.t === "success" && <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />}
                      {v.t === "warning" && <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />}
                      {v.t === "info" && <Info size={15} className="text-cyan-400 shrink-0 mt-0.5" />}
                      {v.t === "danger" && <X size={15} className="text-red-400 shrink-0 mt-0.5" />}
                      <span className="text-sm text-slate-300">{v.m}</span>
                    </Cd>
                  ))}
                </div>
              )}
              {tab === "src" && <SrcDoc text={result.src || text} onRegen={ns => gen(ns)} />}
            </div>
            <div className="px-5 py-3 border-t border-white/5 gl2 flex items-center justify-between shrink-0">
              <Bt v="ghost" sz="sm" onClick={() => { setResult(null); setStep(2); }} icon={ArrowLeft}>Back</Bt>
              <div className="flex gap-2">
                <ExportMenu result={result} />
                <Bt sz="sm" icon={Save} onClick={() => { setSaved(true); setStep(4); }}>Save to Vault</Bt>
              </div>
            </div>
          </div>
        )}
        {/* Step 4: Saved */}
        {step === 4 && (
          <div className="flex items-center justify-center h-full mesh">
            <div className="text-center au"><div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={36} className="text-emerald-400" /></div><h2 className="text-2xl font-bold text-white mb-2">Saved</h2><p className="text-slate-400 text-sm mb-8">Open in other modules</p><div className="flex gap-3 justify-center"><Bt v="secondary" icon={ExternalLink}>SAP Analyzer</Bt><Bt v="secondary" icon={ExternalLink}>Automation Lab</Bt></div></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN ───
function AP() {
  const [auth, setAuth] = useState(false);
  const [pw, setPw] = useState("");
  const [pwE, setPwE] = useState("");
  const [aT, setAT] = useState("prompt");
  const [pr, setPr] = useState(BPMN_PROMPT);
  const [ps, setPs] = useState(false);
  const [sPw, setSPw] = useState(false);
  // RAG Orchestration
  const [rags, setRags] = useState(ragSources);
  const [orch, setOrch] = useState(ragOrch);
  const [guidelines, setGuidelines] = useState(ragGuidelines);
  const [orchMod, setOrchMod] = useState(ALL_MODULES[0].id);
  const [orchMode, setOrchMode] = useState(ALL_MODULES[0].modes[0]);
  const [orchSaved, setOrchSaved] = useState(false);
  // RAG Sources
  const [selRag, setSelRag] = useState(null);
  const [glSaved, setGlSaved] = useState(false);
  const [newRagName, setNewRagName] = useState("");
  const [newRagDesc, setNewRagDesc] = useState("");
  const [showAddRag, setShowAddRag] = useState(false);

  const login = () => { if (pw === "delta@admin") { setAuth(true); setPwE(""); } else setPwE("Incorrect password"); };
  const saveP = () => { BPMN_PROMPT = pr; setPs(true); setTimeout(() => setPs(false), 3000); };

  // Orchestration helpers
  const orchKey = orchMod + "|" + orchMode;
  const currentPipeline = orch[orchKey] || [];
  const curModule = ALL_MODULES.find(m => m.id === orchMod);

  const toggleRagInPipeline = (ragId) => {
    const exists = currentPipeline.find(r => r.ragId === ragId);
    let updated;
    if (exists) {
      updated = currentPipeline.filter(r => r.ragId !== ragId);
    } else {
      updated = [...currentPipeline, { ragId, mandatory: false, role: "Reference" }];
    }
    setOrch(prev => ({ ...prev, [orchKey]: updated }));
  };

  const updatePipelineItem = (ragId, field, value) => {
    const updated = currentPipeline.map(r => r.ragId === ragId ? { ...r, [field]: value } : r);
    setOrch(prev => ({ ...prev, [orchKey]: updated }));
  };

  const movePipelineItem = (idx, dir) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= currentPipeline.length) return;
    const updated = [...currentPipeline];
    const tmp = updated[idx]; updated[idx] = updated[ni]; updated[ni] = tmp;
    setOrch(prev => ({ ...prev, [orchKey]: updated }));
  };

  const saveOrch = () => {
    ragOrch = JSON.parse(JSON.stringify(orch));
    ragSources = [...rags];
    setOrchSaved(true);
    setTimeout(() => setOrchSaved(false), 3000);
  };

  const saveGuidelines = () => {
    ragGuidelines = { ...guidelines };
    setGlSaved(true);
    setTimeout(() => setGlSaved(false), 3000);
  };

  const addNewRag = () => {
    if (!newRagName.trim()) return;
    const id = newRagName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (rags.find(r => r.id === id)) return;
    const colors = ["#6366f1", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6", "#f43f5e", "#f97316", "#0ea5e9"];
    const newRag = { id, n: newRagName.trim(), desc: newRagDesc.trim() || "Custom RAG source", color: colors[rags.length % colors.length] };
    setRags(prev => [...prev, newRag]);
    setGuidelines(prev => ({ ...prev, [id]: "" }));
    setNewRagName(""); setNewRagDesc(""); setShowAddRag(false);
  };

  const deleteRag = (ragId) => {
    if (["client", "bpmn"].includes(ragId)) return; // protect core RAGs
    setRags(prev => prev.filter(r => r.id !== ragId));
    // Remove from all pipelines
    const newOrch = { ...orch };
    Object.keys(newOrch).forEach(k => { newOrch[k] = newOrch[k].filter(r => r.ragId !== ragId); });
    setOrch(newOrch);
  };

  if (!auth) return (
    <div className="flex items-center justify-center h-full mesh">
      <Cd glow c="p-8 w-96 au">
        <div className="text-center mb-6"><div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4"><Lock size={24} className="text-indigo-400" /></div><h2 className="text-xl font-bold text-white mb-1">Admin</h2><p className="text-sm text-slate-500">Enter password</p></div>
        <div className="mb-4">
          <div className="relative"><input type={sPw ? "text" : "password"} value={pw} onChange={e => { setPw(e.target.value); setPwE(""); }} onKeyDown={e => { if (e.key === "Enter") login(); }} placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white pr-10" autoFocus /><button onClick={() => setSPw(!sPw)} className="absolute right-3 top-3 text-slate-600 hover:text-white">{sPw ? <Unlock size={16} /> : <Eye size={16} />}</button></div>
          {pwE && <p className="text-xs text-red-400 mt-1.5">{pwE}</p>}
        </div>
        <Bt c="w-full justify-center" onClick={login} icon={Lock}>Unlock</Bt>
        <p className="text-[10px] text-slate-700 text-center mt-4">Default: delta@admin</p>
      </Cd>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-white/5 gl2 flex items-center justify-between"><div className="flex items-center gap-2"><Settings size={18} className="text-indigo-400" /><h1 className="text-lg font-bold text-white">Admin</h1><Bg v="success">Auth</Bg></div><Bt v="ghost" sz="sm" onClick={() => setAuth(false)} icon={Lock}>Lock</Bt></div>
      <TB tabs={[{ id: "prompt", label: "BPMN Prompt" }, { id: "orch", label: "RAG Orchestration" }, { id: "sources", label: "RAG Sources & Guidelines" }]} active={aT} onChange={setAT} />
      <div className="flex-1 overflow-auto p-5">

        {/* ── BPMN PROMPT TAB ── */}
        {aT === "prompt" && (
          <Cd c="overflow-hidden max-w-5xl mx-auto">
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between"><div className="flex items-center gap-3"><Terminal size={16} className="text-indigo-400" /><span className="text-sm font-semibold text-white">BPMN Prompt</span><Bg v="primary">Core Engine</Bg></div><div className="flex items-center gap-2">{ps && <Bg v="success">Saved</Bg>}<Bt v="ghost" sz="sm" onClick={() => setPr(BPMN_PROMPT)} icon={RotateCcw}>Reset</Bt><Bt sz="sm" icon={Save} onClick={saveP}>Save</Bt></div></div>
            <textarea value={pr} onChange={e => { setPr(e.target.value); setPs(false); }} className="w-full text-slate-300 text-xs mono p-5 resize-none leading-relaxed" style={{ minHeight: "55vh", background: "rgba(6,8,15,.8)" }} spellCheck={false} />
            <div className="px-5 py-2 border-t border-white/5 text-[11px] text-slate-600">{pr.length} chars</div>
          </Cd>
        )}

        {/* ── RAG ORCHESTRATION TAB ── */}
        {aT === "orch" && (
          <div className="max-w-5xl mx-auto">
            {/* Module + Mode selectors */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Module</label>
                <select value={orchMod} onChange={e => { setOrchMod(e.target.value); const m = ALL_MODULES.find(x => x.id === e.target.value); if (m) setOrchMode(m.modes[0]); }}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white appearance-none cursor-pointer">
                  {ALL_MODULES.map(m => <option key={m.id} value={m.id} style={{ background: "#0c1019" }}>{m.n}</option>)}
                </select>
              </div>
              <div className="w-48">
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Mode</label>
                <select value={orchMode} onChange={e => setOrchMode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white appearance-none cursor-pointer">
                  {curModule && curModule.modes.map(m => <option key={m} value={m} style={{ background: "#0c1019" }}>{m}</option>)}
                </select>
              </div>
              <div className="pt-5 flex gap-2">
                {orchSaved && <Bg v="success">Saved</Bg>}
                <Bt sz="sm" icon={Save} onClick={saveOrch}>Save All</Bt>
              </div>
            </div>

            {/* Pipeline config */}
            <Cd c="overflow-hidden mb-5">
              <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-indigo-400" />
                  <span className="text-sm font-semibold text-white">RAG Pipeline</span>
                  <Bg v="ghost">{orchKey}</Bg>
                </div>
                <span className="text-[10px] text-slate-500">{currentPipeline.length} sources active | Sequence = priority order (top = highest)</span>
              </div>

              {/* Active pipeline items */}
              {currentPipeline.length === 0 && (
                <div className="px-5 py-8 text-center text-slate-500 text-sm">No RAG sources configured for this module + mode. Add sources below.</div>
              )}
              {currentPipeline.map((item, idx) => {
                const rag = rags.find(r => r.id === item.ragId);
                if (!rag) return null;
                return (
                  <div key={item.ragId} className="flex items-center gap-3 px-5 py-3 border-b border-white/3 hover:bg-white/2 transition-colors">
                    {/* Priority number + reorder */}
                    <div className="flex flex-col items-center gap-0.5 w-8">
                      <button onClick={() => movePipelineItem(idx, -1)} className="text-slate-700 hover:text-white p-0.5"><ChevronDown size={12} className="rotate-180" /></button>
                      <span className="text-xs mono font-bold acc-text">{idx + 1}</span>
                      <button onClick={() => movePipelineItem(idx, 1)} className="text-slate-700 hover:text-white p-0.5"><ChevronDown size={12} /></button>
                    </div>
                    {/* Color dot + name */}
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: rag.color }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-white">{rag.n}</span>
                      <p className="text-[10px] text-slate-500 truncate">{rag.desc}</p>
                    </div>
                    {/* Role */}
                    <select value={item.role} onChange={e => updatePipelineItem(item.ragId, "role", e.target.value)}
                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300 appearance-none cursor-pointer">
                      {["Context", "Guidelines", "Reference", "Enrichment"].map(r => <option key={r} value={r} style={{ background: "#0c1019" }}>{r}</option>)}
                    </select>
                    {/* Mandatory toggle */}
                    <button onClick={() => updatePipelineItem(item.ragId, "mandatory", !item.mandatory)}
                      className={"px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all " + (item.mandatory ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-slate-500 border border-white/10")}>
                      {item.mandatory ? "Mandatory" : "Optional"}
                    </button>
                    {/* Remove */}
                    <button onClick={() => toggleRagInPipeline(item.ragId)} className="text-slate-700 hover:text-red-400 p-1"><X size={14} /></button>
                  </div>
                );
              })}
            </Cd>

            {/* Available RAGs to add */}
            <Cd c="p-5">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Available RAG Sources</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {rags.map(r => {
                  const inPipeline = currentPipeline.some(p => p.ragId === r.id);
                  return (
                    <button key={r.id} onClick={() => toggleRagInPipeline(r.id)}
                      className={"flex items-center gap-2 px-3 py-2.5 rounded-xl text-left border transition-all " +
                        (inPipeline ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "gl text-slate-400 hover:text-white hover:border-white/20")}>
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
                      <div className="min-w-0">
                        <span className="text-[11px] font-medium block truncate">{r.n}</span>
                        {inPipeline && <span className="text-[9px] text-emerald-500">Active</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Cd>

            {/* Quick copy config */}
            <div className="mt-4 p-4 rounded-2xl gl">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Config Summary</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {Object.entries(orch).map(([key, pipeline]) => {
                  if (!pipeline.length) return null;
                  return (
                    <div key={key} className={"flex items-start gap-2 p-2 rounded-lg " + (key === orchKey ? "bg-white/5 border border-white/10" : "")}>
                      <span className={"mono text-[10px] shrink-0 " + (key === orchKey ? "acc-text font-bold" : "text-slate-600")}>{key}</span>
                      <div className="flex flex-wrap gap-1">
                        {pipeline.map((p, i) => {
                          const rag = rags.find(r => r.id === p.ragId);
                          return <span key={i} className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: (rag?.color || "#666") + "20", color: rag?.color || "#666" }}>{rag?.n || p.ragId}</span>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── RAG SOURCES & GUIDELINES TAB ── */}
        {aT === "sources" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">RAG Sources</h3>
                <Bg v="ghost">{rags.length} sources</Bg>
              </div>
              <div className="flex items-center gap-2">
                {glSaved && <Bg v="success">Guidelines Saved</Bg>}
                <Bt sz="sm" v="secondary" onClick={() => setShowAddRag(true)} icon={Plus}>Add New RAG</Bt>
                <Bt sz="sm" icon={Save} onClick={saveGuidelines}>Save Guidelines</Bt>
              </div>
            </div>

            {/* Add New RAG modal */}
            {showAddRag && (
              <Cd c="p-5 mb-5 glow">
                <h4 className="text-sm font-semibold text-white mb-3">Add New RAG Source</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase mb-1 block">Name</label>
                    <input value={newRagName} onChange={e => setNewRagName(e.target.value)} placeholder="e.g. Compliance RAG" className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase mb-1 block">Description</label>
                    <input value={newRagDesc} onChange={e => setNewRagDesc(e.target.value)} placeholder="What this RAG contains..." className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Bt sz="sm" onClick={addNewRag} icon={Plus}>Create</Bt>
                  <Bt sz="sm" v="ghost" onClick={() => { setShowAddRag(false); setNewRagName(""); setNewRagDesc(""); }}>Cancel</Bt>
                </div>
                <p className="text-[10px] text-slate-600 mt-2">New RAG will appear in all module orchestration configs and can be added to any pipeline.</p>
              </Cd>
            )}

            {/* RAG source list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Source list */}
              <div className="space-y-2">
                {rags.map(r => (
                  <button key={r.id} onClick={() => setSelRag(r.id)}
                    className={"w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border " +
                      (selRag === r.id ? "gl glow" : "gl border-transparent hover:border-white/10")}>
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: r.color }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-white block truncate">{r.n}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{r.desc}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Bg v={guidelines[r.id] ? "success" : "ghost"}>{guidelines[r.id] ? "Has guidelines" : "Empty"}</Bg>
                    </div>
                  </button>
                ))}
              </div>

              {/* Guidelines editor */}
              <div className="lg:col-span-2">
                {selRag ? (() => {
                  const rag = rags.find(r => r.id === selRag);
                  if (!rag) return null;
                  return (
                    <Cd c="overflow-hidden">
                      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: rag.color }} />
                          <span className="text-sm font-semibold text-white">{rag.n}</span>
                          <Bg v="primary">Guidelines</Bg>
                        </div>
                        <div className="flex items-center gap-2">
                          {!["client", "bpmn"].includes(rag.id) && (
                            <button onClick={() => { deleteRag(rag.id); setSelRag(null); }} className="text-[11px] text-red-400/50 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/10">Delete RAG</button>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] text-slate-500 mb-2">These guidelines are injected into the AI call when this RAG source is active. Write rules, standards, and constraints.</p>
                        <textarea value={guidelines[selRag] || ""} onChange={e => setGuidelines(prev => ({ ...prev, [selRag]: e.target.value }))}
                          placeholder={"Write guidelines for " + rag.n + "...\n\nExample:\n- All processes must include SOX control points\n- Use standard department codes from client master\n- Minimum 3 controls per process"}
                          className="w-full min-h-[200px] bg-white/3 border border-white/10 rounded-xl text-sm text-slate-200 mono p-4 leading-relaxed resize-none" spellCheck={false} />
                        <div className="mt-2 text-[10px] text-slate-600">{(guidelines[selRag] || "").length} chars | {(guidelines[selRag] || "").split("\n").filter(Boolean).length} rules</div>
                      </div>
                      {/* Document uploads placeholder */}
                      <div className="px-4 pb-4">
                        <div className="border-t border-white/5 pt-3">
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Reference Documents</p>
                          <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-white/10 hover:border-white/20 transition-colors cursor-pointer text-center">
                            <Upload size={18} className="text-slate-600 mx-auto" />
                            <div>
                              <p className="text-xs text-slate-400">Drop files or click to upload</p>
                              <p className="text-[10px] text-slate-600">PDF, DOCX, TXT, CSV — will be indexed into this RAG source</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-600 mt-2 italic">Document upload requires vector DB connection (Pinecone/Weaviate). Currently using manual guidelines above.</p>
                        </div>
                      </div>
                    </Cd>
                  );
                })() : (
                  <div className="flex items-center justify-center h-full py-16">
                    <div className="text-center text-slate-600">
                      <Database size={32} className="mx-auto mb-3 text-slate-700" />
                      <p className="text-sm">Select a RAG source to view and edit guidelines</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── PLACEHOLDER PAGES ───
function VP() { return <div className="p-6 max-w-5xl mx-auto h-full overflow-auto"><h1 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><Database size={20} className="text-indigo-400" />Vault</h1><Cd c="p-10 text-center"><Database size={36} className="text-slate-500 mx-auto mb-3" /><p className="text-slate-300 text-sm">Vault repository - processes will appear here after saving</p></Cd></div>; }
function CP() { return <div className="flex items-center justify-center h-full mesh"><Cd glow c="p-10 text-center max-w-sm au"><Building2 size={40} className="text-indigo-400 mx-auto mb-4" /><h2 className="text-lg font-bold text-white mb-1">Client Master</h2><p className="text-sm text-slate-500 mb-5">Create client for RAG</p><Bt icon={Plus}>Create</Bt></Cd></div>; }
function PP({ id }) { const m = MODS.flatMap(g => g.i).find(x => x.id === id); const Ic = m ? (IM[m.ic] || Box) : Box; return <div className="flex items-center justify-center h-full mesh"><div className="text-center au"><Ic size={32} className="text-indigo-400 mx-auto mb-4" /><h2 className="text-xl font-bold text-white mb-1">{m?.n || "Module"}</h2><p className="text-slate-500 text-sm mb-4">{m?.d}</p><Bg v="ghost">Coming soon</Bg></div></div>; }

// ─── MAIN APP ───
export default function DeltaApp() {
  useLoadFont();
  const [pg, setPg] = useState("home");
  const [col, setCol] = useState(false);
  const [theme, setTheme] = useState("midnight");
  const [accent, setAccent] = useState("indigo");

  const css = buildCSS(theme, accent);

  const vw = () => {
    switch (pg) {
      case "home": return <HP go={setPg} />;
      case "structure-builder": return <SBuilder />;
      case "vault": return <VP />;
      case "admin": return <AP />;
      case "clients": return <CP />;
      default: return <PP id={pg} />;
    }
  };
  return (
    <div className="dapp flex h-screen overflow-hidden" style={{ background: "var(--bg)", color: "var(--t1)" }}>
      <style>{css}</style>
      <Side cur={pg} set={setPg} col={col} tog={() => setCol(!col)} theme={theme} accent={accent} setTheme={setTheme} setAccent={setAccent} />
      <main className="flex-1 flex flex-col overflow-hidden">{vw()}</main>
    </div>
  );
}
