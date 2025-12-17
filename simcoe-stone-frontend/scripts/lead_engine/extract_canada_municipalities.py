"""
Extract all Canadian municipalities from the official GeoNames dataset and generate canada_municipalities.txt

Instructions:
1. Place the file 'CA.zip' in the docs folder: C:/Users/16479/Desktop/Simcoe Stone/simcoe-stone-frontend/docs/CA.zip
2. Run this script in your venv: python extract_canada_municipalities.py
3. The output file 'canada_municipalities.txt' will contain every city/town/village/hamlet in Canada, one per line.
"""
import os
import zipfile

DOCS_ZIP = os.path.normpath(r"C:\Users\16479\Desktop\Simcoe Stone\simcoe-stone-frontend\docs\CA.zip")
INPUT_FILE = os.path.join(os.path.dirname(__file__), "CA.txt")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "canada_municipalities.txt")

# GeoNames feature codes for populated places
FEATURE_CODES = {"PPL", "PPLA", "PPLA2", "PPLA3", "PPLA4", "PPLC", "PPLF", "PPLG", "PPLL", "PPLR", "PPLS", "PPLX", "STLMT"}

def unzip_ca_zip():
    if not os.path.exists(DOCS_ZIP):
        print(f"Missing CA.zip in docs folder: {DOCS_ZIP}")
        return False
    with zipfile.ZipFile(DOCS_ZIP, "r") as zip_ref:
        zip_ref.extract("CA.txt", os.path.dirname(__file__))
    print(f"Extracted CA.txt from CA.zip to {os.path.dirname(__file__)}")
    return True

def extract_municipalities():
    if not os.path.exists(INPUT_FILE):
        print(f"CA.txt not found, attempting to unzip CA.zip...")
        if not unzip_ca_zip():
            print("Failed to extract CA.txt. Please ensure CA.zip is present in the docs folder.")
            return
    names = set()
    population_rows = []
    total_lines = 0
    ppl_count = 0
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        for line in f:
            total_lines += 1
            parts = line.strip().split("\t")
            if len(parts) < 15:
                continue
            name = parts[1]
            feature_code = parts[7]
            population = parts[14] if parts[14] else "0"
            if feature_code == "PPL":
                ppl_count += 1
                names.add(name)
                population_rows.append((name, population))
    print(f"Processed {total_lines} lines. Found {ppl_count} PPL features.")
    print(f"Sample extracted rows: {population_rows[:5]}")
    sorted_names = sorted(names)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write("# All Canadian municipalities (GeoNames)\n")
        for name in sorted_names:
            out.write(f"{name}\n")
    # Write population CSV
    population_csv_path = os.path.join(os.path.dirname(__file__), "canada_municipalities_population.csv")
    import csv
    with open(population_csv_path, "w", newline='', encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["municipality", "population"])
        for row in population_rows:
            writer.writerow(row)
    print(f"Extracted {len(sorted_names)} municipalities to {OUTPUT_FILE}")
    print(f"Extracted {len(population_rows)} municipalities with population to {population_csv_path}")

if __name__ == "__main__":
    extract_municipalities()
