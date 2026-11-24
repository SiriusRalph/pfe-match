# PFE Match · the student's own internship agent

A student-side agent site for the Open Agentic Web Challenge. The student sets their needs
(stipend, work mode, start date, hiring after the PFE). Their agent asks each company's own
PFE agent, on the company's own site, compares the answers with the needs and saves the best
offers to a shortlist. No platform in the middle.

## Run the three sites on one computer
Each site needs its own host name, so the agents talk across sites as they would on the web.
From the project folder, in three terminals:
```
python serve.py atlas_data 8081 localhost
python serve.py nour_analytics 8082 ::1
python serve.py pfe_match 8080 127.0.0.1
```
Open http://127.0.0.1:8080/, open **⚙ AI model settings** in the chat, paste your Otari key,
select **Save and start**, then press "Find PFEs that match my needs".

## Linked sites
- `http://localhost:8081/atlas_data_pfe` (Atlas Data careers agent)
- `http://[::1]:8082/nour_analytics_pfe` (Nour Analytics careers agent)

Before any contact, a card shows the company's name, host and the first 140 characters of the
request. **Always allow** skips the card for that host until the page is reloaded. A request is
one short question about offers; the agent is told never to include the student's name, school,
email or skills (the runtime does not filter it, so the student checks it on the card).
The company's network runs in this browser on the student's own key, with only the read that
the company's bridge shares (`get_pfe_offers`). A call costs more tokens than the card's estimate.
Applying happens on the company's own careers page, through its own assistant or form.

## Page actions
`get_my_profile` (read) · `update_my_needs`, `save_to_shortlist`, `remove_from_shortlist` (write).
Profile and shortlist stay in this browser (localStorage).

## Before hosting
Replace the two localhost URLs with the companies' https network URLs in `pfe_match.hocon`
(`tools`, `link_labels`), in `agent-manifest.json` (`allowed_peers`) and in `js/student.js`
(`DIRECTORY` pages), then rebuild:
`node <agentic-web>/skills/agentify-website/scripts/build_network.mjs pfe_match.hocon --manifest agent-manifest.json`
