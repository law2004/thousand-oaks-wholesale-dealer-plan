# California wholesale dealer starter form library

These local PDFs are convenience copies downloaded from the official sources on August 12, 2026. Check the official source again immediately before completing or filing a form. DMV and City requirements, revisions, and portals can change.

The companion `prefill/` folder contains browser-compatible copies of the five protected forms supported by the safe draft tool. They were converted only to remove legacy PDF encryption that prevents ordinary browser libraries from writing the original interactive forms. They preserve the original form pages and fields, but the authoritative reference remains the matching top-level official source copy and its official URL. The two additional City packets are not encrypted, so the safe draft tool uses their local official copies directly.

For the five browser-compatible copies, verify page count and AcroForm field count against the source before replacing either set: OL 12 (1 page, 43 fields), OL 21A (2 pages, 68 fields), OL 53 (1 page, 13 fields), ADM 9050 (1 page, 6 fields), and the Thousand Oaks packet (4 pages, 80 fields).

To refresh the browser-compatible copies after downloading a new official form, install `pikepdf` in your Python environment and run `python tools/refresh_prefill_copies.py`. To run the PDF round trip test, install `pdf-lib` and run `node tools/verify_prefill_drafts.cjs`.

## Required core packet

| Local file | Purpose | Official source |
| --- | --- | --- |
| `01-ol-248b-used-dealer-wholesale-only-checklist.pdf` | DMV checklist and packet order | [OL 248B](https://www.dmv.ca.gov/portal/file/used-dealer-or-dealer-wholesale-only-application-checklist-ol-248b-pdf/) |
| `02-ol-248u-used-dealer-forms-packet.pdf` | DMV PDF portfolio reference packet | [OL 248U](https://qr.dmv.ca.gov/portal/file/used-dealer-applications-forms-packet-ol-248u-pdf/) |
| `03-ol-12-original-occupational-license.pdf` | Original occupational license ownership and entity section | [OL 12](https://qr.dmv.ca.gov/portal/file/application-for-original-occupational-license-ol-12-pdf/) |
| `04-ol-21a-original-occupational-license.pdf` | Primary occupational license application | [OL 21A](https://www.dmv.ca.gov/portal/file/original-application-for-occupational-licensing-part-a-ol-21a-pdf/) |
| `07-ol-53-financial-information-release.pdf` | Authorization to release dealership financial information | [OL 53](https://www.dmv.ca.gov/portal/form/authorization-to-release-financial-information-ol-53/) |
| `08-ol-29b-personal-history-questionnaire.pdf` | Personal history questionnaire, one for each person under ownership | [OL 29B](https://www.dmv.ca.gov/portal/file/personnel-history-questionnaire-ol-29b-pdf/) |
| `09-adm-9050-agent-for-service-of-process.pdf` | Agent for service of process, one for each person under ownership | [ADM 9050](https://www.dmv.ca.gov/portal/file/appointment-of-director-as-agent-for-service-of-process-adm-9050-pdf/) |
| `10-dmv-8016-live-scan-service.pdf` | Live Scan service form and applicant receipt, one for each owner | [DMV 8016](https://qr.dmv.ca.gov/portal/file/request-for-live-scan-clearance-receipt-dmv-8016-pdf/) |

The following required items are evidence or records, not generic PDFs: current dealer education certificate, written exam evidence, current Statement of Information for an LLC or corporation if applicable, fictitious name statement if applicable, seller permit, and business location photos.

## California LLC setup for a Thousand Oaks office

There is no separate Thousand Oaks LLC filing. Form a California domestic LLC with the Secretary of State, then separately obtain the local Business Tax Certificate and the home or commercial approval route that matches the physical office when it is inside Thousand Oaks city limits.

The Secretary of State currently lists both domestic LLC formation and the LLC Statement of Information as **online only** through [bizfile](https://bizfileonline.sos.ca.gov/), so this library does not include stale or unofficial LLC PDFs to prefill. The official State page lists a $70 formation fee. The initial Statement of Information is due within 90 days of registration, costs $20, and is due every two years after that. Save the accepted formation record, entity number, and current Statement of Information for the DMV packet.

Apply for an EIN only after the State accepts the LLC, using the free [IRS EIN service](https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number). The [Franchise Tax Board LLC page](https://www.ftb.ca.gov/file/business/types/limited-liability-company/index.html) explains the ongoing California $800 annual LLC tax and related filings.

## Choose one security route

| Local file | When to use it | Official source |
| --- | --- | --- |
| `05-ol-25-dealer-surety-bond-50000.pdf` | Standard $50,000 dealer bond | [OL 25](https://www.dmv.ca.gov/portal/file/surety-bond-ol-25-pdf/) |
| `06-ol-25b-wholesale-only-bond-under-25-vehicles.pdf` | Wholesale only dealer selling fewer than 25 vehicles a year, if eligible | [OL 25B](https://www.dmv.ca.gov/portal/file/surety-bond-of-motorcycle-dealer-motorcycle-lessor-retailer-or-wholesale-only-dealer-less-than-25-vehicles-per-year-ol-25b-pdf/) |
| `12-ol-25e-deposit-agreement-and-assignment.pdf` and `13-std-204-payee-data-record.pdf` | Deposit agreement alternative | [OL 25E](https://www.dmv.ca.gov/portal/file/deposit-agreement-and-assignment-ol-25e-pdf/) and [STD 204](https://www.documents.dgs.ca.gov/dgs/fmc/pdf/std204.pdf) |

## Local Thousand Oaks approval

The local packet is based on the **physical office location**, not simply a Thousand Oaks mailing address. A City Business Tax Certificate is separate from California LLC formation and separate from DMV dealer licensing. Confirm the correct local route in writing before filing.

| Local file | When to use it | Official source |
| --- | --- | --- |
| `11-thousand-oaks-home-business-tax-and-home-occupation-permit.pdf` | Physical office is a home inside Thousand Oaks city limits | [City home business packet](https://toaks.gov/corecode/storage/uber_resource/uploaded_pdfs/Business%20Address%20in%20a%20Home%20Within%20the%20City%20Limits%20of%20Thousand%20Oaks_1754953517.pdf) |
| `14-thousand-oaks-commercial-business-tax-packet.pdf` | Physical office is a commercial or industrial location inside Thousand Oaks city limits; City clearance can include Business Tax Certificate, Certificate of Occupancy or waiver, and zoning clearance | [City commercial business packet](https://toaks.gov/corecode/storage/uber_resource/uploaded_pdfs/Business%20Address%20in%20a%20Commercial%20Zone%20Within%20the%20City%20Limits%20of%20Thousand%20Oaks_1754953491.pdf) |
| `15-thousand-oaks-outside-city-business-tax-packet.pdf` | Physical office is outside City limits, but the City tells you its Business Tax Certificate is required for the activity | [City outside limits packet](https://toaks.gov/corecode/storage/uber_resource/uploaded_pdfs/Business%20Address%20Located%20Outside%20the%20City%20Limits%20of%20Thousand%20Oaks_1754953543.pdf) |

The safe draft tool can add only basic business identity and contact fields to the matching City packet. It does not decide whether a City form is needed, select licensing categories, complete clearances, or fill signatures, tax IDs, dates of birth, driver license data, or City official fields.

## Privacy and completion rules

The browser draft tool only fills limited, reusable business identity fields. It intentionally leaves signatures, notarization, surety fields, DMV official fields, Social Security numbers, dates of birth, driver license numbers, bank data, personal history answers, and Live Scan operator fields blank. Review every output PDF, complete it personally, and use original signatures where DMV requires them.
