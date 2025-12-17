

import os
import zipfile
import csv

DOCS_ZIP = os.path.normpath(r"C:\Users\16479\Desktop\Simcoe Stone\simcoe-stone-frontend\docs\98-401-X2021001_eng_CSV.zip")
EXTRACT_DIR = os.path.join(os.path.dirname(__file__), "census_data")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "census_province_wide.csv")

# Step 1: Unzip the census data
if not os.path.exists(EXTRACT_DIR):
    os.makedirs(EXTRACT_DIR)
with zipfile.ZipFile(DOCS_ZIP, "r") as zip_ref:
    zip_ref.extractall(EXTRACT_DIR)

# Step 2: Find the main CSV file (usually the largest or most recent)
csv_files = [f for f in os.listdir(EXTRACT_DIR) if f.endswith('.csv')]
if not csv_files:
    print("No CSV files found in census data zip.")
    exit(1)
main_csv = max(csv_files, key=lambda f: os.path.getsize(os.path.join(EXTRACT_DIR, f)))
main_csv_path = os.path.join(EXTRACT_DIR, main_csv)

# Step 3: Parse and clean the census data for province/territory-level variables
province_data = {}
all_variables = set()
with open(main_csv_path, "r", encoding="latin1") as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        if len(row) < 12:
            continue
        geo_level = row[3].strip()
        geo_name = row[4].strip()
        char_name = row[9].strip()
        value = row[11].strip()
        if geo_level in ["Province", "Territory"]:
            all_variables.add(char_name)
            if geo_name not in province_data:
                province_data[geo_name] = {}
            province_data[geo_name][char_name] = value

# Step 4: Write wide CSV with all actionable variables
columns = ["province_territory"] + sorted(all_variables)
with open(OUTPUT_FILE, "w", newline='', encoding="utf-8") as out:
    writer = csv.writer(out)
    writer.writerow(columns)
    for province, data in province_data.items():
        row = [province] + [data.get(col, "") for col in columns[1:]]
        writer.writerow(row)
print(f"Extracted wide province/territory census data to {OUTPUT_FILE}")
