import json
from datetime import datetime

# Load data from JSON files
with open('supplements.json', 'r') as supp_file:
    supplements = json.load(supp_file)

with open('intakes_db.json', 'r') as intake_file:
    intakes_db = json.load(intake_file)

# Function to calculate the cost per intake based on the intake database
def calculate_cost(intakes_db, supplements):
    total_cost = 0

    for entry in intakes_db:
        supplement_names = entry['name'].split(', ')
        for name in supplement_names:
            supplement, dose = name.split(':') if ':' in name else (name, 1)
            dose = int(dose)

            # Calculate cost based on supplement information
            if supplement in supplements:
                supp_info = supplements[supplement]
                cost_per_intake = supp_info['costPerBottle'] / supp_info['dosesPerBottle']
                total_cost += cost_per_intake * dose

    return total_cost

# Function to filter entries based on the week range
def filter_entries_by_week(intakes_db, start_date, end_date):
    filtered_entries = []
    for entry in intakes_db:
        entry_date = datetime.fromisoformat(entry['date'].replace('Z', ''))  # Remove the timezone information
        entry_date = entry_date.replace(tzinfo=None)  # Make it naive
        if start_date <= entry_date <= end_date:
            filtered_entries.append(entry)
    return filtered_entries

# Set the date range for the week
week_start = datetime(2024, 8, 14)
week_end = datetime(2024, 8, 17)

# Filter entries within the week
weekly_entries = filter_entries_by_week(intakes_db, week_start, week_end)

# Calculate the weekly cost
weekly_cost = calculate_cost(weekly_entries, supplements)

print(f'Total cost for the week: {weekly_cost} VND')
