# PFE Match · the student's own internship agent

A student-side agent site for the Open Agentic Web Challenge. The student sets their needs
(stipend, work mode, start date, hiring after the PFE). Their agent asks each company's own
PFE agent, on the company's own site, compares the answers with the needs and saves the best
offers to a shortlist. No platform in the middle.

## Live
- PFE Match: https://siriusralph.github.io/pfe-match/
- Atlas Data: https://atlas-data-pfe.netlify.app/
- Nour Analytics: https://nour-analytics-pfe.netlify.app/

Open PFE Match, open **⚙ AI model settings** in the chat, paste your LLM key (e.g. Otari),
select **Save and start**, then press "Find PFEs that match my needs".

## Linked sites
- `https://atlas-data-pfe.netlify.app/atlas_data_pfe` (Atlas Data careers agent)
- `https://nour-analytics-pfe.netlify.app/nour_analytics_pfe` (Nour Analytics careers agent)

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

## Run locally instead
Serve the company sites locally (see the root README) and swap the two partner URLs above for
`http://localhost:8081/atlas_data_pfe` and `http://[::1]:8082/nour_analytics_pfe` in `pfe_match.hocon`
(`tools`, `link_labels`), `agent-manifest.json` (`allowed_peers`) and `js/student.js` (`DIRECTORY`), then rebuild:
`node <agentic-web>/skills/agentify-website/scripts/build_network.mjs pfe_match.hocon --manifest agent-manifest.json`
