// Registers PFE Match's operations with the student's agent runtime.
// agent-manifest.json loads this module through "actions.module". Only the names in
// "actions.agentTools" become model tools, called website_<name>.
// They wrap the same functions the page's own controls use (js/student.js).
import { App } from "./js/app.js";

class SiteActions {
  static registerActions(actions) {
    actions.register(SiteActions.readProfileAction());
    actions.register(SiteActions.updateNeedsAction());
    actions.register(SiteActions.saveAction());
    actions.register(SiteActions.removeAction());
  }

  static readProfileAction() {
    return {
      name: "get_my_profile",
      description: "Read the student's profile and needs on this page: first name, school, field, date available from, length in months, skills; needs (paid, minStipendMAD, workModes accepted among on-site/hybrid/remote, startBy as the latest start date, preHire as must/would-like/dont-mind); the companies that have a PFE agent (id, name, city, careers page link, agent tool name); and the shortlist of saved offers. Changes nothing. Call it at the start of every turn that searches, compares or saves offers.",
      effect: "read",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      execute: () => App.page.getState(),
    };
  }

  static updateNeedsAction() {
    return {
      name: "update_my_needs",
      description: "Change the student's needs on this page when they say what they need in the chat, such as only paid PFEs, a minimum stipend, accepted work modes or the latest start date. Send only the fields that change. The page shows the change. Returns the new needs, or ok false with the reason.",
      effect: "write",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          paid: { type: "boolean", description: "True when the student needs a stipend." },
          minStipendMAD: { type: "integer", minimum: 0, maximum: 20000, description: "Lowest monthly stipend the student accepts, in MAD." },
          workModes: { type: "array", minItems: 1, items: { type: "string", enum: ["on-site", "hybrid", "remote"] }, description: "Every work mode the student accepts." },
          startBy: { type: "string", description: "Latest start date the student accepts, as YYYY-MM-DD, or an empty string for any date." },
          preHire: { type: "string", enum: ["must", "would-like", "dont-mind"], description: "How much the student needs a job offer after the PFE." },
        },
      },
      execute: (args) => App.page.updateNeeds(args),
    };
  }

  static saveAction() {
    return {
      name: "save_to_shortlist",
      description: "Save one offer to the student's shortlist on this page, with the facts a company agent gave. Use only values from a company agent's answer; leave a field out when the answer did not give it. companyId is the company's id from website_get_my_profile. The page shows the offer and which needs it meets. Returns the saved offer, or ok false with the reason, such as an offer already saved.",
      effect: "write",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["companyId", "title"],
        properties: {
          companyId: { type: "string", enum: ["atlas", "nour"], description: "Company id from website_get_my_profile." },
          offerId: { type: "string", maxLength: 40, description: "The company's offer id, such as AD-DE-01, when its agent gave one." },
          title: { type: "string", minLength: 3, maxLength: 120, description: "The offer's title." },
          stipendMAD: { type: "integer", minimum: 0, maximum: 50000, description: "Monthly stipend in MAD; 0 when unpaid." },
          workMode: { type: "string", enum: ["on-site", "hybrid", "remote"] },
          officeDays: { type: "integer", minimum: 0, maximum: 5, description: "Office days per week." },
          startDate: { type: "string", description: "Start date as YYYY-MM-DD." },
          durationMonths: { type: "integer", minimum: 1, maximum: 12 },
          preHire: { type: "string", enum: ["yes", "possible", "no"], description: "Whether hiring after the PFE is planned, possible or not planned." },
          note: { type: "string", maxLength: 200, description: "One short line on why it fits or what to check." },
        },
      },
      execute: (args) => App.page.saveToShortlist(args),
    };
  }

  static removeAction() {
    return {
      name: "remove_from_shortlist",
      description: "Remove one saved offer from the student's shortlist on this page, by companyId and offerId as website_get_my_profile shows them. Returns ok, or ok false with the reason.",
      effect: "write",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["companyId", "offerId"],
        properties: {
          companyId: { type: "string", enum: ["atlas", "nour"] },
          offerId: { type: "string", maxLength: 120 },
        },
      },
      execute: (args) => App.page.removeFromShortlist(args),
    };
  }
}

export const registerActions = SiteActions.registerActions;
