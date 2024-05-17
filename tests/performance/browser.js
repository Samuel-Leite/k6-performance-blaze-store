import { browser } from "k6/experimental/browser";
import { LoginPage } from "../pages/loginPage.js";
import { SharedArray } from 'k6/data';

export const options = {
  scenarios: {
    ui: {
      executor: "constant-vus",
      vus: 3,
      duration: "10s",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
  thresholds: {
    checks: ["rate==1.0"],
    browser_web_vital_fid: ["p(75) <= 100"],
    browser_web_vital_lcp: ["p(75) <= 2500"],
  },
  summaryTrendStats: ["min", "med", "avg", "max", "p(75)", "p(95)", "p(99)"],
};

export default async function () {
  const page = browser.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.navigateTo();
  await loginPage.checkLoginHeader();

  await loginPage.login("admin", "123");

  await loginPage.checkHomePageHeader();
}