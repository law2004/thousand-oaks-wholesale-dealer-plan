"use strict";

const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts } = require("pdf-lib");

const root = path.resolve(__dirname, "..");

async function load(relativePath) {
  return PDFDocument.load(fs.readFileSync(path.join(root, relativePath)));
}

async function saveAndReopen(document) {
  const form = document.getForm();
  const font = await document.embedFont(StandardFonts.Helvetica);
  form.updateFieldAppearances(font);
  return PDFDocument.load(await document.save());
}

async function verifyOl21a() {
  const pdf = await load("forms/prefill/04-ol-21a-original-occupational-license.pdf");
  const form = pdf.getForm();
  form.getTextField("True full name of sole owner").setText("Test Wholesale LLC");
  form.getTextField("Firm Name").setText("Test Wholesale");
  form.getTextField("Firm City").setText("Thousand Oaks");
  form.getCheckBox("Used Auto-Commercial").check();
  const result = (await saveAndReopen(pdf)).getForm();
  if (
    result.getTextField("True full name of sole owner").getText() !== "Test Wholesale LLC" ||
    result.getTextField("Firm Name").getText() !== "Test Wholesale" ||
    result.getTextField("Firm City").getText() !== "Thousand Oaks" ||
    !result.getCheckBox("Used Auto-Commercial").isChecked()
  ) {
    throw new Error("OL 21A prefill values did not survive reopening.");
  }
  console.log("OK OL 21A prefill values survive reopening");
}

async function verifyTextForm(relativePath, fieldName, value) {
  const pdf = await load(relativePath);
  pdf.getForm().getTextField(fieldName).setText(value);
  const result = (await saveAndReopen(pdf)).getForm();
  if (result.getTextField(fieldName).getText() !== value) {
    throw new Error(`${relativePath}: ${fieldName} did not survive reopening.`);
  }
  console.log(`OK ${path.basename(relativePath)} prefill value survives reopening`);
}

async function verifyCountyHome() {
  const pdf = await load("forms/16-ventura-county-home-occupation-zoning-clearance-packet.pdf");
  const form = pdf.getForm();
  form.getTextField("Site Address").setText("1030 Calle Rey, Thousand Oaks, CA 91360");
  form.getTextField("Text43").setText("663-0-021-125");
  form.getTextField("Text45").setText("Test Wholesale LLC");
  const result = (await saveAndReopen(pdf)).getForm();
  if (
    result.getTextField("Site Address").getText() !== "1030 Calle Rey, Thousand Oaks, CA 91360" ||
    result.getTextField("Text43").getText() !== "663-0-021-125" ||
    result.getTextField("Text45").getText() !== "Test Wholesale LLC"
  ) {
    throw new Error("Ventura County Home Occupation prefill values did not survive reopening.");
  }
  console.log("OK Ventura County Home Occupation prefill values survive reopening");
}

(async () => {
  await verifyOl21a();
  await verifyTextForm("forms/prefill/03-ol-12-original-occupational-license.pdf", "Name- Last, First, Mid-1", "Tester, Taylor M");
  await verifyTextForm("forms/prefill/07-ol-53-financial-information-release.pdf", "Licensee Name-Page 07A", "Test Wholesale LLC");
  await verifyTextForm("forms/prefill/09-adm-9050-agent-for-service-of-process.pdf", "principal names", "Test Wholesale LLC");
  await verifyTextForm("forms/prefill/11-thousand-oaks-home-business-tax-and-home-occupation-permit.pdf", "DBA", "Test Wholesale");
  await verifyCountyHome();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
