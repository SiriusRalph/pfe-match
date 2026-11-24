# Nour Analytics · PFE 2027 careers site (agentified)

Fictional machine learning company in Rabat, built for the Open Agentic Web Challenge
as the second company site of **PFE Match**. Same structure as Atlas Data, its own look and offers
(including a fully remote subject).

## Run it
```
python -m http.server 8082 --directory nour_analytics
```
Open the page, go to **Ask Nour**, open **⚙ AI model settings**, paste your Otari key and select
**Save and start**. The Provider URL defaults to the Otari EU router.

## What the assistant can do
- `get_pfe_offers` (read) · `submit_application` (irreversible, confirmed by the visitor).

## For other agent sites
Network URL: `<site>/nour_analytics_pfe`. Its bridge shares `get_pfe_offers` with any site — public facts only.
