"""Make browser-compatible copies of the supported official PDF forms.

The original DMV PDFs use legacy encryption. The website keeps those originals
under forms/ and uses the copies in forms/prefill/ only to generate local draft
prefills. This script removes encryption without changing the visual pages or
form fields, then verifies the expected page and field counts.
"""

from __future__ import annotations

from pathlib import Path

import pikepdf
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
FORMS = {
    "03-ol-12-original-occupational-license.pdf": (1, 43),
    "04-ol-21a-original-occupational-license.pdf": (2, 68),
    "07-ol-53-financial-information-release.pdf": (1, 13),
    "09-adm-9050-agent-for-service-of-process.pdf": (1, 6),
    "11-thousand-oaks-home-business-tax-and-home-occupation-permit.pdf": (4, 80),
}


def main() -> None:
    target_dir = ROOT / "forms" / "prefill"
    target_dir.mkdir(parents=True, exist_ok=True)

    for filename, (expected_pages, expected_fields) in FORMS.items():
        source = ROOT / "forms" / filename
        target = target_dir / filename
        if not source.exists():
            raise FileNotFoundError(source)

        with pikepdf.Pdf.open(source, password="") as pdf:
            pdf.save(target, encryption=False)

        reader = PdfReader(target)
        pages = len(reader.pages)
        fields = len(reader.get_fields() or {})
        if reader.is_encrypted or (pages, fields) != (expected_pages, expected_fields):
            raise ValueError(
                f"{filename}: expected {expected_pages} pages and {expected_fields} fields; "
                f"got {pages} pages, {fields} fields, encrypted={reader.is_encrypted}"
            )
        print(f"OK {filename}: {pages} pages, {fields} fields")


if __name__ == "__main__":
    main()
