(() => {
  "use strict";

  const FORM_PATHS = {
    ol12: "forms/prefill/03-ol-12-original-occupational-license.pdf",
    ol21a: "forms/prefill/04-ol-21a-original-occupational-license.pdf",
    ol53: "forms/prefill/07-ol-53-financial-information-release.pdf",
    adm9050: "forms/prefill/09-adm-9050-agent-for-service-of-process.pdf",
    city: "forms/prefill/11-thousand-oaks-home-business-tax-and-home-occupation-permit.pdf"
  };

  const profileForm = document.querySelector("#profile-form");
  const statusNode = document.querySelector("#pdf-status");
  const cityDraftButton = document.querySelector('[data-generate="city"]');

  function getValue(id) {
    return document.querySelector(`#${id}`).value.trim();
  }

  function updateStatus(message, state = "") {
    statusNode.textContent = message;
    statusNode.dataset.state = state;
  }

  function normalFirmName(profile) {
    return profile.dba || profile.legalName;
  }

  function phoneParts(phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
      return { areaCode: digits.slice(0, 3), number: digits.slice(3) };
    }
    return { areaCode: "", number: phone };
  }

  function officeAddress(profile) {
    return [profile.businessAddress, profile.businessCity, `${profile.businessState} ${profile.businessZip}`].filter(Boolean).join(", ");
  }

  function safeSetText(form, fieldName, value) {
    if (!value) return;
    try {
      form.getTextField(fieldName).setText(value);
    } catch (error) {
      console.warn(`Could not set ${fieldName}.`, error);
    }
  }

  function safeCheck(form, fieldName) {
    try {
      form.getCheckBox(fieldName).check();
    } catch (error) {
      console.warn(`Could not check ${fieldName}.`, error);
    }
  }

  function getProfile() {
    if (!profileForm.reportValidity()) {
      updateStatus("Complete the required profile fields before creating a draft.", "error");
      return null;
    }

    return {
      jurisdiction: getValue("jurisdiction"),
      annualVolume: getValue("annual-volume"),
      entityType: getValue("entity-type"),
      legalName: getValue("legal-name"),
      dba: getValue("dba"),
      entityNumber: getValue("entity-number"),
      businessPhone: getValue("business-phone"),
      businessEmail: getValue("business-email"),
      businessAddress: getValue("business-address"),
      businessCity: getValue("business-city"),
      businessState: getValue("business-state").toUpperCase(),
      businessZip: getValue("business-zip"),
      ownerName: getValue("owner-name"),
      ownerTitle: getValue("owner-title"),
      ownerEmail: getValue("owner-email")
    };
  }

  async function openPdf(path) {
    if (!window.PDFLib) {
      throw new Error("The PDF tool did not load. Check your internet connection, then reload the page.");
    }

    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load the local official PDF (${response.status}).`);
    }

    return window.PDFLib.PDFDocument.load(await response.arrayBuffer(), { ignoreEncryption: true });
  }

  async function saveDraft(pdfDocument, filename) {
    const form = pdfDocument.getForm();
    const font = await pdfDocument.embedFont(window.PDFLib.StandardFonts.Helvetica);
    form.updateFieldAppearances(font);
    const bytes = await pdfDocument.save();
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function addOl12EntityFields(form, profile) {
    if (profile.entityType === "llc") {
      safeSetText(form, "firm name-LLC", profile.legalName);
      safeSetText(form, "States2", "California");
      safeSetText(form, "number-LLC", profile.entityNumber);
      safeSetText(form, "title-LLC", profile.ownerTitle);
    } else if (profile.entityType === "corporation") {
      safeSetText(form, "firm name-corporation", profile.legalName);
      safeSetText(form, "States1", "California");
      safeSetText(form, "number-corporate", profile.entityNumber);
      safeSetText(form, "title-corporation", profile.ownerTitle);
    } else {
      safeSetText(form, "firm name-individual", profile.legalName);
      safeSetText(form, "I. Individual Title", profile.ownerTitle);
    }
  }

  async function makeOl12(profile) {
    const pdfDocument = await openPdf(FORM_PATHS.ol12);
    const form = pdfDocument.getForm();
    safeSetText(form, "Name- Last, First, Mid-1", profile.ownerName);
    safeSetText(form, "Email", profile.ownerEmail);
    safeSetText(form, "Title-1", profile.ownerTitle);
    addOl12EntityFields(form, profile);
    await saveDraft(pdfDocument, "draft-ol-12.pdf");
  }

  async function makeOl21a(profile) {
    const pdfDocument = await openPdf(FORM_PATHS.ol21a);
    const form = pdfDocument.getForm();
    const phone = phoneParts(profile.businessPhone);

    safeSetText(form, "True full name of sole owner", profile.legalName);
    safeSetText(form, "Firm Name", normalFirmName(profile));
    safeSetText(form, "Area Code", phone.areaCode);
    safeSetText(form, "Phone number", phone.number);
    safeSetText(form, "Firm Address", profile.businessAddress);
    safeSetText(form, "Firm City", profile.businessCity);
    safeSetText(form, "States1", profile.businessState);
    safeSetText(form, "Zip", profile.businessZip);
    safeCheck(form, "Used Auto-Commercial");
    safeSetText(form, "Printed name of sole owner", profile.ownerName);
    safeSetText(form, "Sole Owners Title", profile.ownerTitle);

    await saveDraft(pdfDocument, "draft-ol-21a.pdf");
  }

  async function makeAdm9050(profile) {
    const pdfDocument = await openPdf(FORM_PATHS.adm9050);
    const form = pdfDocument.getForm();
    safeSetText(form, "principal names", [profile.legalName, profile.dba].filter(Boolean).join(" DBA "));
    safeSetText(form, "type of license", "Wholesale only dealer");
    await saveDraft(pdfDocument, "draft-adm-9050.pdf");
  }

  async function makeOl53(profile) {
    const pdfDocument = await openPdf(FORM_PATHS.ol53);
    const form = pdfDocument.getForm();
    safeSetText(form, "Licensee Name-Page 07A", profile.legalName);
    await saveDraft(pdfDocument, "draft-ol-53.pdf");
  }

  async function makeCityPacket(profile) {
    if (profile.jurisdiction !== "thousand-oaks") {
      throw new Error("The Thousand Oaks draft is available only when the physical office is inside Thousand Oaks city limits.");
    }

    const pdfDocument = await openPdf(FORM_PATHS.city);
    const form = pdfDocument.getForm();
    const firmName = normalFirmName(profile);
    const mailingAddress = officeAddress(profile);

    safeSetText(form, "DBA", firmName);
    if (profile.entityType !== "sole") safeSetText(form, "Corp Name", profile.legalName);
    safeSetText(form, "Bus Addr 1", profile.businessAddress);
    safeSetText(form, "Bus Adr City", profile.businessCity);
    safeSetText(form, "Bus Adr State", profile.businessState);
    safeSetText(form, "Bus Zip Code", profile.businessZip);
    safeSetText(form, "Mlg Adr 1", profile.businessAddress);
    safeSetText(form, "Mlg Adr City", profile.businessCity);
    safeSetText(form, "Mlg Adr State", profile.businessState);
    safeSetText(form, "Mlg Zip Code", profile.businessZip);
    safeSetText(form, "Bus Phone #", profile.businessPhone);
    safeSetText(form, "Bus Email", profile.businessEmail);
    safeSetText(form, "Owner1", profile.ownerName);
    safeSetText(form, "Title1", profile.ownerTitle);
    safeSetText(form, "Email Address", profile.ownerEmail);
    safeSetText(form, "Name of Business", firmName);
    safeSetText(form, "Business Address must be the residential location of the business", mailingAddress);
    safeSetText(form, "Phone Number", profile.businessPhone);
    safeSetText(form, "Mailing Address if different from Business Address", mailingAddress);
    safeSetText(form, "Name of Applicant", profile.ownerName);

    await saveDraft(pdfDocument, "draft-thousand-oaks-home-business-packet.pdf");
  }

  const generators = { ol12: makeOl12, ol21a: makeOl21a, adm9050: makeAdm9050, ol53: makeOl53, city: makeCityPacket };

  async function generateDraft(type) {
    const profile = getProfile();
    if (!profile) return;
    const generator = generators[type];
    if (!generator) return;

    const buttons = [...document.querySelectorAll("[data-generate]")];
    buttons.forEach((button) => { button.disabled = true; });
    updateStatus("Creating your editable local PDF draft. Nothing is being uploaded.", "working");
    try {
      await generator(profile);
      updateStatus("Draft downloaded. Review every field, then complete signatures and all remaining official fields.", "success");
    } catch (error) {
      console.error(error);
      updateStatus(error.message || "Could not create the PDF draft. Download the blank official form and try again.", "error");
    } finally {
      buttons.forEach((button) => { button.disabled = false; });
    }
  }

  document.querySelectorAll("[data-generate]").forEach((button) => {
    button.addEventListener("click", () => generateDraft(button.dataset.generate));
  });

  document.querySelector("#clear-profile").addEventListener("click", () => {
    window.setTimeout(() => updateStatus("Local profile cleared. Nothing was saved by this page."), 0);
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const source = document.querySelector(`#${button.dataset.copy}`);
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(source.textContent.trim());
        button.textContent = "Copied";
      } catch (error) {
        updateStatus("Could not copy automatically. Select and copy the message text instead.", "error");
      }
      window.setTimeout(() => { button.textContent = original; }, 1800);
    });
  });

  function updateCityDraftAvailability() {
    cityDraftButton.disabled = document.querySelector("#jurisdiction").value !== "thousand-oaks";
  }

  function updateBondRouteHint() {
    const value = document.querySelector("#annual-volume").value;
    const hint = document.querySelector("#bond-route-hint");
    if (value === "under-25") {
      hint.textContent = "Possible security route: OL 25B may be available only for a wholesale only dealer selling fewer than 25 vehicles in a year. Confirm eligibility before ordering a bond.";
    } else if (value === "25-or-more") {
      hint.textContent = "Likely security route: use the standard $50,000 OL 25 dealer surety bond. Give the producer the exact legal entity name and DBA.";
    } else if (value === "unsure") {
      hint.textContent = "Do not order a bond yet. Confirm your annual volume estimate and the correct security route with DMV or a qualified bond producer.";
    } else {
      hint.textContent = "Choose your first year volume to see which security route to discuss with DMV and the bond producer.";
    }
  }

  document.querySelector("#jurisdiction").addEventListener("change", updateCityDraftAvailability);
  document.querySelector("#annual-volume").addEventListener("change", updateBondRouteHint);
  updateCityDraftAvailability();
  updateBondRouteHint();
})();
