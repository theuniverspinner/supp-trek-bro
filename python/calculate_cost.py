import json
from datetime import datetime, timedelta
import re

# Load data from JSON files
with open('supplements.json', 'r') as supp_file:
    supplements = json.load(supp_file)

with open('intakes_db.json', 'r') as intake_file:
    intakes_db = json.load(intake_file)

def parse_cost_per_amount(cost_string):
    match = re.match(r'(\d+)\s+(\w+)\s+per\s+(\d+)(\w+)', cost_string)
    if match:
        cost, currency, amount, unit = match.groups()
        return float(cost), float(amount), unit
    return None

def calculate_cost(intakes_db, supplements):
    total_cost = 0
    total_cost_rub = 0

    for entry in intakes_db:
        supplement_names = entry['name'].lower().split(', ')
        for name in supplement_names:
            supplement, dose = name.split(':') if ':' in name else (name, '1')
            supplement = supplement.strip()
            try:
                dose = float(dose)
            except ValueError:
                dose = 1

            if supplement in supplements:
                supp_info = supplements[supplement]
                try:
                    if 'costPerBottle' in supp_info and 'dosesPerBottle' in supp_info:
                        cost_per_intake = float(supp_info['costPerBottle']) / float(supp_info['dosesPerBottle'])
                        if supp_info['costPerBottleCurrency'] == 'VND':
                            total_cost += cost_per_intake * dose
                        elif supp_info['costPerBottleCurrency'] == 'RUB':
                            total_cost_rub += cost_per_intake * dose
                    elif 'costPerAmount' in supp_info:
                        cost_info = parse_cost_per_amount(supp_info['costPerAmount'])
                        if cost_info:
                            cost, amount, unit = cost_info
                            dosage_per_intake = float(supp_info.get('dosagePerIntake', 1))
                            cost_per_intake = (cost / amount) * dosage_per_intake
                            total_cost_rub += cost_per_intake * dose
                    else:
                        print(f"Warning: Could not calculate cost for {supplement}. Unsupported price structure.")
                except (KeyError, ValueError, TypeError) as e:
                    print(f"Warning: Could not calculate cost for {supplement}. Error: {e}")

    return total_cost, total_cost_rub

def filter_entries_by_week(intakes_db, start_date, end_date):
    filtered_entries = []
    for entry in intakes_db:
        entry_date = datetime.fromisoformat(entry['date'].replace('Z', ''))
        entry_date = entry_date.replace(tzinfo=None)
        if start_date <= entry_date <= end_date:
            filtered_entries.append(entry)
    return filtered_entries

# Set the date range for the week (Monday to now)
today = datetime.now()
start_of_week = today - timedelta(days=today.weekday())
start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

# Filter entries within the week
weekly_entries = filter_entries_by_week(intakes_db, start_of_week, today)

# Calculate the weekly cost
weekly_cost_vnd, weekly_cost_rub = calculate_cost(weekly_entries, supplements)

print(f'Total cost for the week (from {start_of_week.strftime("%Y-%m-%d")} to {today.strftime("%Y-%m-%d")}):')
print(f'VND: {weekly_cost_vnd:.2f}')
print(f'RUB: {weekly_cost_rub:.2f}')

# Print the supplements taken this week
print("\nSupplements taken this week:")
for entry in weekly_entries:
    print(f"{entry['date']}: {entry['name']}")