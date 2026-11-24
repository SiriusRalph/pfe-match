// The read Atlas Data shares with other agent sites, through its action bridge.
// A student's agent on another site (such as PFE Match) can read the public offers.
// Nothing personal is shared: no applications, no form, no page state.
import { getCompany, listOffers } from "../js/careers.js";

class BridgeActions {
  // The offers are public facts the page already shows, so any agent site may read them.
  static CALLERS = ["*"];

  static registerActions(actions) {
    actions.register(BridgeActions.readOffersAction());
  }

  static readOffersAction() {
    return {
      name: "get_pfe_offers",
      description: "Read Atlas Data's PFE (final-year internship) offers for 2027 and the company's facts: for each offer the subject, team, missions, skills, start date, length in months, work mode and office days per week, monthly stipend in MAD (0 means unpaid), perks, pre-hire outlook, places and language; plus the office address, application deadline, recruiting steps and contact email. Changes nothing. Call it before answering any question about offers, conditions or how to apply.",
      effect: "read",
      availability: "bridge",
      callerOrigins: BridgeActions.CALLERS,
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      execute: BridgeActions.readOffers,
    };
  }

  static readOffers() {
    return {
      company: getCompany(),
      offers: listOffers().offers,
      applyAt: new URL("../index.html#apply", import.meta.url).href,
    };
  }
}

export const registerActions = BridgeActions.registerActions;
