const dictionary = {
  en: {
    "nav.docs": "Docs",
    "nav.research": "Publication",
    "nav.projects": "Projects",
    "nav.notes": "Technical Notes",
    "nav.contact": "Contact",
    "ui.lang": "中文",
    "hero.eyebrow": "Microelectronics / Embedded / AI Engineering",
    "hero.title": "Ziyu Zhao",
    "hero.text": "I work across embedded systems, robotics control, digital design, biomedical computing, and AI engineering tools. My projects include STM32 display engines, ROS2 control, LLM agent benchmarking, CAE validation, and parametric CAD generation.",
    "hero.cnResume": "Chinese CV PDF",
    "hero.enResume": "English CV PDF",
    "hero.metric1": "conference paper, CCF-B",
    "hero.metric2": "embedded systems to digital design",
    "hero.metric3": "AI tools and engineering validation",
    "docs.eyebrow": "Prominent Access",
    "docs.title": "Documents & Blog",
    "docs.text": "Resume PDFs, source documents, and technical notes are collected here. Both Chinese and English versions are available for reading or download.",
    "docs.cnPdf": "Chinese CV",
    "docs.cnPdfDesc": "Two-page version for Chinese applications",
    "docs.enPdf": "English CV",
    "docs.enPdfDesc": "Two-page version for international applications",
    "docs.cnMd": "Chinese CV Source",
    "docs.mdDesc": "Editable Markdown source",
    "docs.enMd": "English CV Source",
    "docs.mdDescEn": "Readable Markdown source",
    "docs.tex": "LaTeX Source",
    "docs.texDesc": "For continued TeX compilation",
    "docs.blog": "Technical Blog",
    "docs.blogDesc": "Architecture, interfaces, and validation notes",
    "research.eyebrow": "Research",
    "research.title": "Publication",
    "projects.eyebrow": "Selected Work",
    "projects.title": "Projects & Repositories",
    "projects.text": "Organized by capability layers: AI engineering tools, embedded systems, digital design, simulation validation, and biomedical devices.",
    "projects.lcd": "Character LCD rendering, timer interrupts, EXTI input, CGRAM resource management, and 3D / particle / character-video effects on STM32F446xx.",
    "projects.rtl": "AXI-Stream packet-header insertion, valid/ready handshake, keep/last signals, byte counting, and STM32 OpenOCD/CMake/GCC workflow wrappers.",
    "projects.ai": "Natural-language to parametric CAD, FastAPI services, CadQuery modeling, catalog/ephemeris computation, structured JSON, and LLM-ready context generation.",
    "notes.eyebrow": "Technical Notes",
    "notes.title": "Readable Technical Blog",
    "notes.text": "Each note focuses on one engineering problem: inputs, constraints, implementation path, and validation points.",
    "note.lcd.title": "Real-time Rendering on Character LCD: CGRAM, State Machines, and Interrupts",
    "note.lcd.p1": "The core limit of a character LCD is not only resolution, but also the number of custom glyphs and command timing. LCD1602/2004 modules can keep only a small set of CGRAM glyphs, so animation is a trade-off between reusable graphics and refresh rate.",
    "note.lcd.li1": "Input: PC13 button input is handled through EXTI rather than blocking polling in the main loop.",
    "note.lcd.li2": "Timing: timer interrupts advance the game tick; the main loop handles state update and display commit.",
    "note.lcd.li3": "Rendering: dynamic graphics are decomposed into reusable character blocks, while a state machine controls player, obstacles, and scrolling window.",
    "note.lcd.li4": "Validation: check input latency, animation jitter, CGRAM update rate, and LCD command delay.",
    "note.axi.title": "How to Validate an AXI-Stream Header Insertion Module",
    "note.axi.p1": "The main risks are boundary timing: alignment between header and payload, keep byte masks, last propagation, and buffer consistency under ready backpressure.",
    "note.axi.li1": "Interface: valid/ready determines transfer; keep marks valid bytes; last marks packet end.",
    "note.axi.li2": "State: inserting_header, byte_cnt, and buffer_valid track insertion phase and buffered payload.",
    "note.axi.li3": "Tests: cover zero-length, non-aligned, aligned, multi-beat headers, and ready_out deassertion.",
    "note.axi.li4": "Output checks: data_out order, keep_out mask, last_out timing, and ready_in backpressure.",
    "note.cae.title": "CAE Validation Beyond File Existence",
    "note.cae.p1": "Simulation automation deliverables should check solve state and result objects, not only whether a Workbench project was saved. A reviewable Mechanical result includes mesh, loads, boundary conditions, solved status, and postprocessing values.",
    "note.cae.li1": "Preprocess: geometry units, material, constraints, load direction, and contact settings.",
    "note.cae.li2": "Solve: solver state, error/warning logs, convergence or static equilibrium information.",
    "note.cae.li3": "Postprocess: contour, legend, Min/Max values, and evaluated result-object state.",
    "note.cae.li4": "Delivery: project file, screenshots, result summary, and repeatable script entry.",
    "note.sky.title": "Sky Monitor API Data Flow: Catalogs, Ephemerides, and Star Charts",
    "note.sky.p1": "Sky Monitor API separates astronomy computation into local catalog query, planetary ephemeris computation, and frontend polar projection. The frontend consumes chart_x, chart_y, radius, and explanation text without implementing celestial mechanics.",
    "note.sky.li1": "Catalog: HYG Database builds a SQLite index and filters by magnitude and altitude.",
    "note.sky.li2": "Planets: Skyfield reads JPL DE421 ephemerides and computes altitude / azimuth for the observation time.",
    "note.sky.li3": "Deep sky: Messier / NGC metadata adds type, names, and observation notes.",
    "note.sky.li4": "Output: JSON serves both star-chart rendering and LLM observation-advice generation."
  }
};

const zhText = new Map();
document.querySelectorAll("[data-i18n]").forEach((el) => {
  zhText.set(el.dataset.i18n, el.textContent);
});

let lang = localStorage.getItem("site-lang") || "zh";

function applyLang(next) {
  lang = next;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = lang === "en" ? dictionary.en[key] || el.textContent : zhText.get(key) || el.textContent;
  });
  localStorage.setItem("site-lang", lang);
}

document.querySelector(".lang-toggle").addEventListener("click", () => {
  applyLang(lang === "zh" ? "en" : "zh");
});

applyLang(lang);

document.querySelectorAll(".note-title").forEach((button, index) => {
  const note = button.closest(".note");
  if (index === 0) note.classList.add("open");
  button.addEventListener("click", () => note.classList.toggle("open"));
});

const progress = document.querySelector(".progress");
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
}, { passive: true });

const revealTargets = document.querySelectorAll(".doc-card, .project-card, .note, .publication");
revealTargets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("in-view"));
}

document.querySelectorAll(".project-card img").forEach((img) => {
  img.addEventListener("error", () => {
    const fallback = document.createElement("div");
    fallback.className = "image-fallback";
    fallback.textContent = img.alt || "Project figure";
    img.replaceWith(fallback);
  }, { once: true });
});
