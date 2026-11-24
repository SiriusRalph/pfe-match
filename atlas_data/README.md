# Atlas Data · PFE 2027 careers site (agentified)

Fictional data & AI consultancy careers page, built for the Open Agentic Web Challenge
as the first company site of **PFE Match**.

## Run it
```
python -m http.server 8081 --directory atlas_data
```
Open http://127.0.0.1:8081/, go to **Ask Atlas**, open **⚙ AI model settings**, paste your
Otari key and select **Save and start**. The Provider URL defaults to the Otari EU router
(`https://eu.api.otari.ai/api/v1`); change it under Advanced settings for a US key.

## What the assistant can do
- `get_pfe_offers` (read): offers, stipend, work mode, dates, pre-hire outlook, process.
- `submit_application` (irreversible): sends an application through the page's own form
  logic, after the visitor confirms in a dialog.
- It declines what the site cannot do: interviews, negotiating, CV upload, status after refresh.

## For other agent sites
Network URL: `<site>/atlas_data_pfe`. Its bridge shares `get_pfe_offers` with any site
(`callerOrigins: ["*"]`) — public facts only, nothing personal.

## Files
- `js/offers-data.js` the offers (with mentors) · `js/careers.js` the operations · `js/app.js` the page
- `site-actions.js` page actions for the agent · `bridge/bridge-actions.js` shared reads
- `atlas_data_pfe.hocon` the agent network (source) → `atlas_data_pfe.network.json` (built)
- `agent-manifest.json`, `links.json`, `agent-mcp.json`, `.well-known/` discovery files
- `runtime/` the browser runtime from cognizant-ai-labs/agentic-web (unchanged)

Rebuild after editing the .hocon:
`node <agentic-web>/skills/agentify-website/scripts/build_network.mjs atlas_data_pfe.hocon --manifest agent-manifest.json`
