from pathlib import Path
import pickle
import re
from pypdf import PdfReader


# PROJECT ROOT
BASE_DIR = Path(__file__).resolve().parents[2]

RAW_DIR = BASE_DIR / "data" / "raw" / "gale"
OUT_DIR = BASE_DIR / "data" / "processed"
OUT_FILE = OUT_DIR / "medical_docs.pkl"

OUT_DIR.mkdir(parents=True, exist_ok=True)


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    return text.strip()


docs = []

print("📚 Reading PDFs from:", RAW_DIR)

for pdf_path in RAW_DIR.glob("*.pdf"):
    print(f"➡ Processing: {pdf_path.name}")

    reader = PdfReader(pdf_path)
    full_text = ""

    for page in reader.pages:
        text = page.extract_text()
        if text:
            full_text += text + "\n"

    cleaned = clean_text(full_text)

    if len(cleaned) > 500:  # ignore junk
        docs.append({
            "text": cleaned,
            "source": pdf_path.name
        })


print(f"✅ Total documents collected: {len(docs)}")

with open(OUT_FILE, "wb") as f:
    pickle.dump(docs, f)

print(f"💾 Saved processed docs to: {OUT_FILE}")
