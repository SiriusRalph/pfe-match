// Nour Analytics — PFE 2027 programme data.
// Nour Analytics is a fictional company made for the Open Agentic Web Challenge demo.

export const COMPANY = {
  name: "Nour Analytics",
  tagline: "Machine learning for finance & retail",
  city: "Rabat",
  address: "Technopolis, Rabat-Salé",
  teamSize: 28,
  internshipsEmail: "stages@nouranalytics.example",
  applicationDeadline: "2027-01-10",
  responseTime: "within 7 working days of receiving your application",
  process: [
    "Online application (CV + GitHub or a project you're proud of)",
    "45-minute technical chat about your project",
    "Meet the team (remote or in Rabat)",
    "Offer within a week"
  ]
};

// stipendMAD: monthly stipend in Moroccan dirhams, 0 when unpaid.
// workMode: "on-site" | "hybrid" | "remote"; officeDays: days per week at the office (0 when remote).
// preHire: "yes" | "possible" | "no".
export const OFFERS = [
  {
    id: "NA-ML-01",
    title: "Machine Learning Engineer — Credit risk models",
    team: "ML Engineering",
    summary: "Improve the credit-scoring models a Moroccan microfinance client uses to approve small business loans.",
    missions: [
      "Build and compare gradient-boosting and neural models in Python",
      "Explain model decisions with SHAP for the client's risk team",
      "Check the models for unfair bias across regions and genders",
      "Package the best model behind a small API"
    ],
    skills: ["Python", "scikit-learn", "Pandas", "Statistics", "SQL"],
    niceToHave: ["XGBoost or LightGBM", "FastAPI"],
    startDate: "2027-02-08",
    durationMonths: 6,
    workMode: "remote",
    officeDays: 0,
    remoteNote: "Remote, with one required team day in Rabat every month (travel paid by Nour)",
    stipendMAD: 4000,
    perks: ["Laptop provided", "Monthly train ticket to Rabat for the team day"],
    preHire: "possible",
    preHireNote: "Two of our last four PFE interns were hired; decided at month 5.",
    openings: 2,
    language: "English and French",
    mentor: { name: "Omar Alaoui", role: "Machine Learning Lead" }
  },
  {
    id: "NA-MO-02",
    title: "MLOps — Model monitoring platform",
    team: "MLOps",
    summary: "Build the platform that warns us when a model in production starts to drift or make worse predictions.",
    missions: [
      "Track model versions and metrics with MLflow",
      "Detect data and prediction drift on live traffic",
      "Ship alerts and a small monitoring dashboard",
      "Automate retraining with a CI/CD pipeline and Docker"
    ],
    skills: ["Python", "Docker", "Git", "CI/CD", "Linux"],
    niceToHave: ["MLflow", "Kubernetes", "Any cloud"],
    startDate: "2027-02-01",
    durationMonths: 6,
    workMode: "hybrid",
    officeDays: 2,
    remoteNote: "",
    stipendMAD: 3500,
    perks: ["Laptop provided", "Lunch at the office"],
    preHire: "yes",
    preHireNote: "We are growing the MLOps team in 2027 and plan to hire this intern.",
    openings: 1,
    language: "English and French",
    mentor: { name: "Imane Berrada", role: "MLOps Engineer" }
  },
  {
    id: "NA-NL-03",
    title: "NLP — Darija customer reviews",
    team: "NLP Lab",
    summary: "Teach a model to understand customer reviews written in Darija, French and Arabizi for a retail client.",
    missions: [
      "Collect and label a small dataset of reviews",
      "Fine-tune a multilingual language model for sentiment and topics",
      "Measure where the model fails, especially on Arabizi",
      "Write a short report the client can read"
    ],
    skills: ["Python", "NLP", "Transformers", "Data labelling"],
    niceToHave: ["Hugging Face", "Speaking Darija"],
    startDate: "2027-03-01",
    durationMonths: 5,
    workMode: "hybrid",
    officeDays: 1,
    remoteNote: "",
    stipendMAD: 2000,
    perks: ["GPU access for training"],
    preHire: "no",
    preHireNote: "Research project; no hiring planned in this team for 2027.",
    openings: 1,
    language: "French, Darija or English",
    mentor: { name: "Youssef Chraibi", role: "NLP Researcher" }
  }
];
