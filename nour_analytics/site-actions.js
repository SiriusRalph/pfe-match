// Registers Nour Analytics' careers operations with the agent runtime.
// agent-manifest.json loads this module through "actions.module". Only the names in
// "actions.agentTools" become model tools, called website_<name>.
// It wraps the same functions the page's own filters and form use (js/careers.js).
import { App } from "./js/app.js";

class SiteActions {
  static registerActions(actions) {
    actions.register(SiteActions.readOffersAction());
    actions.register(SiteActions.submitApplicationAction());
  }

  static readOffersAction() {
    return {
      name: "get_pfe_offers",
      description: "Read Nour Analytics' PFE (final-year internship) offers for 2027 and the company's facts: for each offer the subject, team, missions, skills, start date, length in months, work mode (on-site, hybrid or remote) with office days per week and remote details, monthly stipend in MAD (0 means unpaid), perks, pre-hire outlook, places and language; plus the office address, application deadline, recruiting steps and contact email. Also the visitor's latest application on this page, if any. Changes nothing. Call it before answering any question about offers, conditions or how to apply, and again in each turn that needs it.",
      effect: "read",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      execute: SiteActions.readOffers,
    };
  }

  static readOffers() {
    return App.page.getState();
  }

  static submitApplicationAction() {
    return {
      name: "submit_application",
      description: "Send the visitor's application to one PFE offer, through the page's own application form. Call it only when the visitor asks to apply. First ask for their full name, email and school, and which offer (use an id from website_get_pfe_offers); a short message on why this subject is optional, written by the visitor. The browser asks the visitor to confirm. Returns a reference, or ok false with the site's reason, such as an earlier application to the same offer.",
      effect: "irreversible",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["offerId", "fullName", "email", "school"],
        properties: {
          offerId: { type: "string", enum: App.page.offerIds(), description: "Offer id from website_get_pfe_offers." },
          fullName: { type: "string", minLength: 3, maxLength: 80, description: "The visitor's full name, as they gave it." },
          email: { type: "string", minLength: 5, maxLength: 120, description: "The visitor's email, as they gave it." },
          school: { type: "string", minLength: 2, maxLength: 120, description: "The visitor's school, as they gave it." },
          message: { type: "string", maxLength: 1000, description: "Optional: why this subject, in the visitor's own words." },
        },
      },
      execute: SiteActions.submitApplication,
    };
  }

  static submitApplication(args) {
    return App.page.submitApplication(args);
  }
}

export const registerActions = SiteActions.registerActions;
