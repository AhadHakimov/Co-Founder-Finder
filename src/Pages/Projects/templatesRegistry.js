import Template01 from "./templates/Template01";
import Template02 from "./templates/Template02";
import Template03 from "./templates/Template03";
import Template04 from "./templates/Template04";
import Template05 from "./templates/Template05";
import Template06 from "./templates/Template06";
import Template07 from "./templates/Template07";
import Template08 from "./templates/Template08";
import Template09 from "./templates/Template09";
import Template10 from "./templates/Template10";

/* ============================================================
   TEMPLATE THUMBNAIL GENERATOR
   ============================================================ */

const escapeSvg = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const createThumbnail = ({
  primary = "#2563eb",
  background = "#ffffff",
  sidebar = null,
  dark = false,
  style = "minimal",
}) => {
  const width = 300;
  const height = 400;

  const paper = background;
  const text = dark ? "#f8fafc" : "#17202A";
  const muted = dark ? "#94a3b8" : "#64748b";
  const line = dark ? "#334155" : "#e2e8f0";

  let content = "";

  /* ----------------------------------------------------------
     MODERN MINIMAL
  ---------------------------------------------------------- */
  if (style === "minimal") {
    content = `
      <rect x="0" y="0" width="300" height="400" rx="10" fill="${paper}"/>

      <circle cx="46" cy="50" r="23" fill="${primary}" opacity=".14"/>
      <circle cx="46" cy="50" r="15" fill="${primary}" opacity=".78"/>

      <rect x="78" y="30" width="125" height="10" rx="5" fill="${text}" opacity=".92"/>
      <rect x="78" y="48" width="85" height="6" rx="3" fill="${primary}" opacity=".8"/>

      <rect x="25" y="88" width="250" height="2" fill="${line}"/>

      <rect x="25" y="108" width="75" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="126" width="230" height="5" rx="2.5" fill="${muted}" opacity=".45"/>
      <rect x="25" y="138" width="210" height="5" rx="2.5" fill="${muted}" opacity=".3"/>

      <rect x="25" y="170" width="80" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="190" width="225" height="5" rx="2.5" fill="${muted}" opacity=".42"/>
      <rect x="25" y="202" width="205" height="5" rx="2.5" fill="${muted}" opacity=".28"/>
      <rect x="25" y="214" width="185" height="5" rx="2.5" fill="${muted}" opacity=".24"/>

      <rect x="25" y="250" width="80" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="270" width="110" height="6" rx="3" fill="${primary}" opacity=".18"/>
      <rect x="25" y="284" width="150" height="6" rx="3" fill="${primary}" opacity=".18"/>
      <rect x="25" y="298" width="125" height="6" rx="3" fill="${primary}" opacity=".18"/>

      <rect x="25" y="335" width="245" height="35" rx="8" fill="${primary}" opacity=".08"/>
    `;
  }

  /* ----------------------------------------------------------
     CLASSIC CORPORATE
  ---------------------------------------------------------- */
  if (style === "corporate") {
    content = `
      <rect width="300" height="400" rx="10" fill="${paper}"/>

      <rect x="0" y="0" width="300" height="78" fill="${primary}"/>

      <circle cx="45" cy="39" r="22" fill="#ffffff" opacity=".2"/>
      <circle cx="45" cy="39" r="14" fill="#ffffff" opacity=".75"/>

      <rect x="78" y="25" width="130" height="9" rx="4" fill="#ffffff"/>
      <rect x="78" y="43" width="94" height="6" rx="3" fill="#ffffff" opacity=".65"/>

      <rect x="25" y="98" width="90" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="117" width="240" height="5" rx="2.5" fill="${muted}" opacity=".4"/>
      <rect x="25" y="129" width="220" height="5" rx="2.5" fill="${muted}" opacity=".25"/>

      <rect x="25" y="160" width="100" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="180" width="235" height="5" rx="2.5" fill="${line}"/>
      <rect x="25" y="193" width="225" height="5" rx="2.5" fill="${line}"/>
      <rect x="25" y="206" width="190" height="5" rx="2.5" fill="${line}"/>

      <rect x="25" y="240" width="100" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="260" width="238" height="5" rx="2.5" fill="${line}"/>
      <rect x="25" y="273" width="198" height="5" rx="2.5" fill="${line}"/>

      <rect x="25" y="310" width="85" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="330" width="62" height="17" rx="8.5" fill="${primary}" opacity=".12"/>
      <rect x="95" y="330" width="65" height="17" rx="8.5" fill="${primary}" opacity=".12"/>
      <rect x="168" y="330" width="58" height="17" rx="8.5" fill="${primary}" opacity=".12"/>
    `;
  }

  /* ----------------------------------------------------------
     CLEAN MINIMALIST
  ---------------------------------------------------------- */
  if (style === "clean") {
    content = `
      <rect width="300" height="400" rx="10" fill="${paper}"/>

      <rect x="25" y="28" width="105" height="11" rx="5.5" fill="${text}"/>
      <rect x="25" y="48" width="78" height="5" rx="2.5" fill="${primary}"/>

      <rect x="25" y="78" width="250" height="1.5" fill="${primary}"/>

      <rect x="25" y="100" width="70" height="6" rx="3" fill="${primary}"/>
      <rect x="25" y="118" width="215" height="5" rx="2.5" fill="${muted}" opacity=".36"/>
      <rect x="25" y="131" width="202" height="5" rx="2.5" fill="${muted}" opacity=".26"/>

      <rect x="25" y="162" width="70" height="6" rx="3" fill="${primary}"/>
      <rect x="25" y="180" width="230" height="5" rx="2.5" fill="${muted}" opacity=".33"/>
      <rect x="25" y="193" width="190" height="5" rx="2.5" fill="${muted}" opacity=".25"/>
      <rect x="25" y="206" width="205" height="5" rx="2.5" fill="${muted}" opacity=".23"/>

      <rect x="25" y="238" width="70" height="6" rx="3" fill="${primary}"/>
      <circle cx="35" cy="265" r="5" fill="${primary}" opacity=".75"/>
      <rect x="48" y="261" width="76" height="7" rx="3" fill="${muted}" opacity=".3"/>
      <circle cx="145" cy="265" r="5" fill="${primary}" opacity=".75"/>
      <rect x="158" y="261" width="76" height="7" rx="3" fill="${muted}" opacity=".3"/>

      <rect x="25" y="300" width="70" height="6" rx="3" fill="${primary}"/>
      <rect x="25" y="318" width="230" height="5" rx="2.5" fill="${muted}" opacity=".3"/>
      <rect x="25" y="331" width="185" height="5" rx="2.5" fill="${muted}" opacity=".22"/>
    `;
  }

  /* ----------------------------------------------------------
     DARK SIDEBAR EXECUTIVE
  ---------------------------------------------------------- */
  if (style === "sidebar") {
    const side = sidebar || primary;

    content = `
      <rect width="300" height="400" rx="10" fill="#ffffff"/>

      <rect x="0" y="0" width="88" height="400" fill="${side}"/>

      <circle cx="44" cy="52" r="25" fill="#ffffff" opacity=".16"/>
      <circle cx="44" cy="52" r="16" fill="#ffffff" opacity=".7"/>

      <rect x="18" y="96" width="51" height="5" rx="2.5" fill="#ffffff" opacity=".8"/>
      <rect x="18" y="112" width="42" height="4" rx="2" fill="#ffffff" opacity=".45"/>
      <rect x="18" y="128" width="58" height="4" rx="2" fill="#ffffff" opacity=".35"/>

      <rect x="112" y="28" width="125" height="11" rx="5.5" fill="#17202A"/>
      <rect x="112" y="48" width="92" height="6" rx="3" fill="${primary}"/>

      <rect x="112" y="82" width="73" height="7" rx="3" fill="${primary}"/>
      <rect x="112" y="101" width="145" height="5" rx="2.5" fill="#64748b" opacity=".34"/>
      <rect x="112" y="114" width="130" height="5" rx="2.5" fill="#64748b" opacity=".26"/>

      <rect x="112" y="146" width="73" height="7" rx="3" fill="${primary}"/>
      <rect x="112" y="166" width="143" height="5" rx="2.5" fill="#64748b" opacity=".34"/>
      <rect x="112" y="179" width="136" height="5" rx="2.5" fill="#64748b" opacity=".25"/>
      <rect x="112" y="192" width="122" height="5" rx="2.5" fill="#64748b" opacity=".22"/>

      <rect x="112" y="226" width="73" height="7" rx="3" fill="${primary}"/>
      <rect x="112" y="246" width="55" height="14" rx="7" fill="${primary}" opacity=".13"/>
      <rect x="174" y="246" width="60" height="14" rx="7" fill="${primary}" opacity=".13"/>
      <rect x="112" y="269" width="68" height="14" rx="7" fill="${primary}" opacity=".13"/>
    `;
  }

  /* ----------------------------------------------------------
     ELEGANT HEADER
  ---------------------------------------------------------- */
  if (style === "elegant") {
    content = `
      <rect width="300" height="400" rx="10" fill="${paper}"/>

      <rect x="0" y="0" width="300" height="96" fill="${primary}"/>
      <circle cx="45" cy="48" r="25" fill="#ffffff" opacity=".18"/>
      <circle cx="45" cy="48" r="15" fill="#ffffff" opacity=".8"/>

      <rect x="83" y="28" width="132" height="10" rx="5" fill="#fff"/>
      <rect x="83" y="47" width="95" height="6" rx="3" fill="#fff" opacity=".65"/>

      <rect x="25" y="120" width="75" height="7" rx="3.5" fill="${primary}"/>
      <rect x="25" y="139" width="230" height="5" rx="2.5" fill="${muted}" opacity=".35"/>
      <rect x="25" y="151" width="210" height="5" rx="2.5" fill="${muted}" opacity=".24"/>

      <rect x="25" y="180" width="75" height="7" rx="3.5" fill="${primary}"/>
      <rect x="25" y="199" width="220" height="5" rx="2.5" fill="${muted}" opacity=".32"/>
      <rect x="25" y="212" width="205" height="5" rx="2.5" fill="${muted}" opacity=".23"/>

      <rect x="25" y="242" width="75" height="7" rx="3.5" fill="${primary}"/>
      <rect x="25" y="261" width="235" height="5" rx="2.5" fill="${muted}" opacity=".3"/>
      <rect x="25" y="274" width="190" height="5" rx="2.5" fill="${muted}" opacity=".2"/>

      <rect x="25" y="306" width="250" height="52" rx="9" fill="${primary}" opacity=".07"/>
    `;
  }

  /* ----------------------------------------------------------
     CREATIVE VIBRANT
  ---------------------------------------------------------- */
  if (style === "creative") {
    content = `
      <rect width="300" height="400" rx="10" fill="${paper}"/>

      <circle cx="265" cy="25" r="55" fill="${primary}" opacity=".16"/>
      <circle cx="285" cy="50" r="32" fill="${primary}" opacity=".13"/>

      <rect x="25" y="28" width="115" height="13" rx="6.5" fill="${text}"/>
      <rect x="25" y="50" width="80" height="7" rx="3.5" fill="${primary}"/>

      <rect x="25" y="84" width="250" height="4" rx="2" fill="${primary}" opacity=".55"/>

      <rect x="25" y="107" width="110" height="74" rx="13" fill="${primary}" opacity=".09"/>
      <rect x="145" y="107" width="130" height="74" rx="13" fill="${primary}" opacity=".15"/>

      <rect x="25" y="200" width="80" height="7" rx="3.5" fill="${primary}"/>
      <rect x="25" y="219" width="230" height="5" rx="2.5" fill="${muted}" opacity=".32"/>
      <rect x="25" y="232" width="190" height="5" rx="2.5" fill="${muted}" opacity=".23"/>

      <rect x="25" y="264" width="80" height="7" rx="3.5" fill="${primary}"/>
      <rect x="25" y="283" width="225" height="5" rx="2.5" fill="${muted}" opacity=".32"/>
      <rect x="25" y="296" width="205" height="5" rx="2.5" fill="${muted}" opacity=".23"/>

      <circle cx="37" cy="340" r="7" fill="${primary}" opacity=".8"/>
      <circle cx="63" cy="340" r="7" fill="${primary}" opacity=".45"/>
      <circle cx="89" cy="340" r="7" fill="${primary}" opacity=".25"/>
    `;
  }

  /* ----------------------------------------------------------
     EXECUTIVE LEADERSHIP
  ---------------------------------------------------------- */
  if (style === "executive") {
    content = `
      <rect width="300" height="400" rx="10" fill="${paper}"/>

      <rect x="25" y="25" width="250" height="65" rx="10" fill="${primary}"/>

      <circle cx="57" cy="58" r="20" fill="#ffffff" opacity=".17"/>
      <circle cx="57" cy="58" r="12" fill="#ffffff" opacity=".75"/>

      <rect x="88" y="43" width="120" height="9" rx="4.5" fill="#ffffff"/>
      <rect x="88" y="59" width="88" height="5" rx="2.5" fill="#ffffff" opacity=".6"/>

      <rect x="25" y="112" width="84" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="132" width="225" height="5" rx="2.5" fill="${muted}" opacity=".33"/>
      <rect x="25" y="145" width="204" height="5" rx="2.5" fill="${muted}" opacity=".24"/>

      <rect x="25" y="176" width="84" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="196" width="238" height="5" rx="2.5" fill="${line}"/>
      <rect x="25" y="209" width="215" height="5" rx="2.5" fill="${line}"/>
      <rect x="25" y="222" width="198" height="5" rx="2.5" fill="${line}"/>

      <rect x="25" y="252" width="84" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="272" width="238" height="5" rx="2.5" fill="${line}"/>
      <rect x="25" y="285" width="206" height="5" rx="2.5" fill="${line}"/>

      <rect x="25" y="318" width="250" height="42" rx="8" fill="${primary}" opacity=".07"/>
    `;
  }

  /* ----------------------------------------------------------
     STREAMLINED
  ---------------------------------------------------------- */
  if (style === "streamlined") {
    content = `
      <rect width="300" height="400" rx="10" fill="${paper}"/>

      <rect x="25" y="25" width="7" height="48" rx="3.5" fill="${primary}"/>
      <rect x="48" y="28" width="125" height="10" rx="5" fill="${text}"/>
      <rect x="48" y="48" width="90" height="5" rx="2.5" fill="${primary}"/>

      <rect x="25" y="95" width="250" height="1.5" fill="${line}"/>

      <rect x="25" y="116" width="72" height="6" rx="3" fill="${primary}"/>
      <rect x="25" y="136" width="220" height="5" rx="2.5" fill="${muted}" opacity=".33"/>

      <rect x="25" y="166" width="72" height="6" rx="3" fill="${primary}"/>
      <rect x="25" y="186" width="228" height="5" rx="2.5" fill="${muted}" opacity=".3"/>
      <rect x="25" y="199" width="204" height="5" rx="2.5" fill="${muted}" opacity=".2"/>

      <rect x="25" y="230" width="72" height="6" rx="3" fill="${primary}"/>
      <rect x="25" y="250" width="225" height="5" rx="2.5" fill="${muted}" opacity=".3"/>
      <rect x="25" y="263" width="180" height="5" rx="2.5" fill="${muted}" opacity=".2"/>

      <rect x="25" y="296" width="72" height="6" rx="3" fill="${primary}"/>
      <rect x="25" y="316" width="70" height="16" rx="8" fill="${primary}" opacity=".11"/>
      <rect x="103" y="316" width="85" height="16" rx="8" fill="${primary}" opacity=".11"/>
      <rect x="196" y="316" width="62" height="16" rx="8" fill="${primary}" opacity=".11"/>
    `;
  }

  /* ----------------------------------------------------------
     CORPORATE STRUCTURED
  ---------------------------------------------------------- */
  if (style === "structured") {
    content = `
      <rect width="300" height="400" rx="10" fill="${paper}"/>

      <rect x="0" y="0" width="300" height="22" fill="${primary}"/>

      <rect x="25" y="46" width="135" height="11" rx="5.5" fill="${text}"/>
      <rect x="25" y="66" width="95" height="6" rx="3" fill="${primary}"/>

      <rect x="25" y="94" width="250" height="1" fill="${line}"/>

      <rect x="25" y="114" width="78" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="133" width="232" height="5" rx="2.5" fill="${line}"/>
      <rect x="25" y="146" width="220" height="5" rx="2.5" fill="${line}"/>

      <rect x="25" y="176" width="78" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="195" width="240" height="5" rx="2.5" fill="${line}"/>
      <rect x="25" y="208" width="214" height="5" rx="2.5" fill="${line}"/>
      <rect x="25" y="221" width="196" height="5" rx="2.5" fill="${line}"/>

      <rect x="25" y="251" width="78" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="270" width="232" height="5" rx="2.5" fill="${line}"/>
      <rect x="25" y="283" width="207" height="5" rx="2.5" fill="${line}"/>

      <rect x="25" y="313" width="78" height="7" rx="3" fill="${primary}"/>
      <rect x="25" y="332" width="50" height="17" rx="8.5" fill="${primary}" opacity=".13"/>
      <rect x="82" y="332" width="58" height="17" rx="8.5" fill="${primary}" opacity=".13"/>
      <rect x="147" y="332" width="65" height="17" rx="8.5" fill="${primary}" opacity=".13"/>
    `;
  }

  /* ----------------------------------------------------------
     COMPACT DENSE
  ---------------------------------------------------------- */
  if (style === "compact") {
    content = `
      <rect width="300" height="400" rx="10" fill="${paper}"/>

      <rect x="20" y="20" width="260" height="50" rx="7" fill="${primary}" opacity=".09"/>
      <rect x="35" y="34" width="105" height="9" rx="4.5" fill="${text}"/>
      <rect x="35" y="50" width="78" height="5" rx="2.5" fill="${primary}"/>

      <rect x="20" y="86" width="74" height="6" rx="3" fill="${primary}"/>
      <rect x="20" y="102" width="252" height="4" rx="2" fill="${line}"/>
      <rect x="20" y="113" width="238" height="4" rx="2" fill="${line}"/>
      <rect x="20" y="124" width="220" height="4" rx="2" fill="${line}"/>

      <rect x="20" y="148" width="74" height="6" rx="3" fill="${primary}"/>
      <rect x="20" y="164" width="250" height="4" rx="2" fill="${line}"/>
      <rect x="20" y="175" width="240" height="4" rx="2" fill="${line}"/>
      <rect x="20" y="186" width="228" height="4" rx="2" fill="${line}"/>
      <rect x="20" y="197" width="217" height="4" rx="2" fill="${line}"/>

      <rect x="20" y="221" width="74" height="6" rx="3" fill="${primary}"/>
      <rect x="20" y="237" width="252" height="4" rx="2" fill="${line}"/>
      <rect x="20" y="248" width="233" height="4" rx="2" fill="${line}"/>
      <rect x="20" y="259" width="218" height="4" rx="2" fill="${line}"/>

      <rect x="20" y="283" width="74" height="6" rx="3" fill="${primary}"/>
      <rect x="20" y="299" width="252" height="4" rx="2" fill="${line}"/>
      <rect x="20" y="310" width="230" height="4" rx="2" fill="${line}"/>

      <rect x="20" y="338" width="54" height="14" rx="7" fill="${primary}" opacity=".12"/>
      <rect x="80" y="338" width="63" height="14" rx="7" fill="${primary}" opacity=".12"/>
      <rect x="149" y="338" width="58" height="14" rx="7" fill="${primary}" opacity=".12"/>
    `;
  }

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >
      ${content}
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};


/* ============================================================
   TEMPLATE REGISTRY
   ============================================================ */

export const TEMPLATES_REGISTRY = [
  // ==========================================================
  // VERTICAL — 10 TA
  // ==========================================================

  {
    id: "tpl-01",
    name: "01. Modern Minimal",
    orientation: "portrait",
    component: Template01,
    defaultColor: "#2563eb",
    thumbnail: createThumbnail({
      primary: "#2563eb",
      style: "minimal",
    }),
  },

  {
    id: "tpl-02",
    name: "02. Classic Corporate",
    orientation: "portrait",
    component: Template02,
    defaultColor: "#0f172a",
    thumbnail: createThumbnail({
      primary: "#0f172a",
      style: "corporate",
    }),
  },

  {
    id: "tpl-03",
    name: "03. Clean Minimalist",
    orientation: "portrait",
    component: Template03,
    defaultColor: "#10b981",
    thumbnail: createThumbnail({
      primary: "#10b981",
      style: "clean",
    }),
  },

  {
    id: "tpl-04",
    name: "04. Dark Sidebar Executive",
    orientation: "portrait",
    component: Template04,
    defaultColor: "#1e293b",
    thumbnail: createThumbnail({
      primary: "#94a3b8",
      sidebar: "#1e293b",
      style: "sidebar",
    }),
  },

  {
    id: "tpl-05",
    name: "05. Elegant Header",
    orientation: "portrait",
    component: Template05,
    defaultColor: "#7c3aed",
    thumbnail: createThumbnail({
      primary: "#7c3aed",
      style: "elegant",
    }),
  },

  {
    id: "tpl-06",
    name: "06. Creative Vibrant",
    orientation: "portrait",
    component: Template06,
    defaultColor: "#ec4899",
    thumbnail: createThumbnail({
      primary: "#ec4899",
      style: "creative",
    }),
  },

  {
    id: "tpl-07",
    name: "07. Executive Leadership",
    orientation: "portrait",
    component: Template07,
    defaultColor: "#0f172a",
    thumbnail: createThumbnail({
      primary: "#0f172a",
      style: "executive",
    }),
  },

  {
    id: "tpl-08",
    name: "08. Simple Streamlined",
    orientation: "portrait",
    component: Template08,
    defaultColor: "#2563eb",
    thumbnail: createThumbnail({
      primary: "#2563eb",
      style: "streamlined",
    }),
  },

  {
    id: "tpl-09",
    name: "09. Corporate Structured",
    orientation: "portrait",
    component: Template09,
    defaultColor: "#0284c7",
    thumbnail: createThumbnail({
      primary: "#0284c7",
      style: "structured",
    }),
  },

  {
    id: "tpl-10",
    name: "10. Compact Dense",
    orientation: "portrait",
    component: Template10,
    defaultColor: "#475569",
    thumbnail: createThumbnail({
      primary: "#475569",
      style: "compact",
    }),
  },
];