# PFE Match — your own internship agent, on the open agentic web

**Open Agentic Web Challenge (Devpost) entry by Sara Bouras, HESTIM Casablanca.**

Final-year engineering students in Morocco send dozens of applications for their PFE (6-month
end-of-studies internship) and rarely learn the basics up front: *Is it paid? Can I work from home?
When does it start? Will they hire me after?*

PFE Match flips the usual model. Instead of one central job platform, **each company publishes its
own PFE agent on its own careers site**, and **each student has their own agent** that visits those
sites, asks the company agents directly, and compares the answers with the student's needs.

| Site | What it is | Live |
|---|---|---|
| `pfe_match/` | The student's own agent: needs, agent chat, shortlist board | https://siriusralph.github.io/pfe-match/ |
| `atlas_data/` | Fictional data & AI consultancy (Casablanca) with its own careers agent | https://atlas-data-pfe.netlify.app/ |
| `nour_analytics/` | Fictional ML company (Rabat) with its own careers agent | https://nour-analytics-pfe.netlify.app/ |

**Try it:** open PFE Match, add your LLM key in the chat's **AI model settings**, press
"Find PFEs that match my needs" and allow each company on its card.

## How it works
1. The student sets their needs (stipend, work mode, latest start, hiring after).
2. Their agent calls each company's agent network across sites. The student approves each company on
   a consent card. Requests are short questions; the student's name and email are never sent.
3. Each company's agent answers from its own offers data (shared through its action bridge, read-only).
4. The student's agent compares, saves the best offers to a shortlist, and links to apply on the
   company's own site, where that site's assistant can send the application with the visitor's confirmation.

Built with the [Open Agentic Web](https://github.com/cognizant-ai-labs/agentic-web) browser runtime
(agent networks run in the visitor's browser on their own LLM key, e.g. via Otari).

## Run locally
```
python serve.py atlas_data 8081 localhost
python serve.py nour_analytics 8082 ::1
python serve.py pfe_match 8080 127.0.0.1
```
Open http://127.0.0.1:8080/ and add your LLM key in **AI model settings**.
(Locally, PFE Match needs the localhost partner addresses; see `pfe_match/README.md`.)

## Reusable piece: a PFE agent for any company
`atlas_data/` and `nour_analytics/` share the same structure: replace `js/offers-data.js` with your
own offers and you have a careers page whose agent other agents can query (`get_pfe_offers`).

Atlas Data and Nour Analytics are fictional companies made for this demo.

## License
MIT for this project's own code. Each `runtime/` folder is the Open Agentic Web runtime by Cognizant AI Labs, under Apache 2.0 (license file inside). Fonts are under the SIL Open Font License (see each `fonts/` folder).
