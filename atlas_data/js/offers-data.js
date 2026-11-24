// Atlas Data — PFE 2027 programme data.
// Atlas Data is a fictional company made for the Open Agentic Web Challenge demo.

export const COMPANY = {
  name: "Atlas Data",
  tagline: "Data & AI consultancy",
  city: "Casablanca",
  address: "Tour CFC, Casablanca Finance City, Casablanca",
  teamSize: 42,
  internshipsEmail: "pfe@atlasdata.example",
  applicationDeadline: "2026-12-20",
  responseTime: "within 10 working days of the deadline",
  process: [
    "Online application (CV + a few lines on why this subject)",
    "30-minute call with the team lead",
    "Small take-home case (2–3 hours, no rush)",
    "Final chat with the team and offer"
  ]
};

// stipendMAD: monthly stipend in Moroccan dirhams, 0 when unpaid.
// workMode: "on-site" | "hybrid" | "remote"; officeDays: days per week at the office.
// preHire: "yes" | "possible" | "no".
export const OFFERS = [
  {
    id: "AD-DE-01",
    title: "Data Engineer — Lakehouse pipelines",
    team: "Data Platform",
    summary: "Help us move a retail client's sales data from nightly CSV exports to a clean, tested lakehouse.",
    missions: [
      "Build ingestion pipelines with Python and Apache Spark",
      "Orchestrate jobs with Airflow and add data-quality checks",
      "Model clean tables for the analytics team",
      "Document the platform so the next engineer can run it"
    ],
    skills: ["Python", "SQL", "Spark", "Airflow", "Git"],
    niceToHave: ["Docker", "Any cloud (AWS / Azure)"],
    startDate: "2027-02-01",
    durationMonths: 6,
    workMode: "hybrid",
    officeDays: 3,
    stipendMAD: 3000,
    perks: ["Laptop provided", "Lunch tickets"],
    preHire: "yes",
    preHireNote: "Last two PFE interns in this team were hired.",
    openings: 2,
    language: "French and English",
    mentor: { name: "Yasmine El Idrissi", role: "Lead Data Engineer, joined as a PFE intern in 2021" }
  },
  {
    id: "AD-GA-02",
    title: "Generative AI — RAG assistant for customer support",
    team: "AI Lab",
    summary: "Build an assistant that answers support agents' questions from 3,000 internal documents, with sources.",
    missions: [
      "Build a retrieval-augmented generation (RAG) pipeline",
      "Compare embedding models and chunking strategies",
      "Measure answer quality with a small evaluation set",
      "Ship a simple web interface for the support team"
    ],
    skills: ["Python", "LLMs / RAG", "Vector databases", "NLP"],
    niceToHave: ["LangChain or LlamaIndex", "FastAPI"],
    startDate: "2027-02-15",
    durationMonths: 6,
    workMode: "on-site",
    officeDays: 5,
    stipendMAD: 2500,
    perks: ["Laptop provided", "Transport allowance included in stipend"],
    preHire: "possible",
    preHireNote: "Decided at month 4, depending on project and team needs.",
    openings: 1,
    language: "French and English",
    mentor: { name: "Karim Benjelloun", role: "Head of the AI Lab" }
  },
  {
    id: "AD-BI-03",
    title: "BI & Analytics — Executive dashboards",
    team: "Analytics",
    summary: "Turn a logistics client's operations data into clear weekly dashboards for its management.",
    missions: [
      "Gather KPI needs with the client",
      "Write SQL transformations",
      "Build Power BI dashboards and a short user guide"
    ],
    skills: ["SQL", "Power BI", "Excel"],
    niceToHave: ["DAX", "Python"],
    startDate: "2027-03-01",
    durationMonths: 4,
    workMode: "hybrid",
    officeDays: 2,
    stipendMAD: 0,
    perks: ["Transport allowance: 800 MAD / month"],
    preHire: "no",
    preHireNote: "No hiring planned in this team for 2027.",
    openings: 1,
    language: "French",
    mentor: { name: "Salma Tazi", role: "Analytics Manager" }
  }
];
