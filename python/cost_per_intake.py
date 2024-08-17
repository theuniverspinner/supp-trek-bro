import json
import re

# Load the supplements data from the JSON file
with open('supplements.json', 'r') as file:
    supplements = json.load(file)

def calculate_cost_per_intake(supplement):
    # Check if 'costPerBottle' and 'dosesPerBottle' exist
    if 'costPerBottle' in supplement and 'dosesPerBottle' in supplement:
        return supplement['costPerBottle'] / supplement['dosesPerBottle'] * supplement.get('dosesPerIntake', 1)
    # Check if 'costPerAmount' and 'dosagePerIntake' exist (for supplements priced per unit weight or volume)
    elif 'costPerAmount' in supplement and 'dosagePerIntake' in supplement:
        # Extract the numeric value from 'costPerAmount' using regex
        match = re.search(r'(\d+)', supplement['costPerAmount'])
        if match:
            cost_per_amount = float(match.group(1))
            # Example calculation, adapt based on your needs
            return cost_per_amount * supplement['dosagePerIntake'] / 100  # Example calculation
        else:
            print(f"Could not extract numeric value from costPerAmount for {supplement['name']}")
            return None
    else:
        # Return None or handle other cases
        return None

def calculate_all_costs(supplements):
    costs = {}
    for key, supplement in supplements.items():
        cost_per_intake = calculate_cost_per_intake(supplement)
        if cost_per_intake is not None:
            costs[key] = cost_per_intake
        else:
            print(f"Missing or invalid data for {supplement['name']} ({key})")
    return costs


def print_costs(costs):
    for key, cost in costs.items():
        print(f"{cost['name']} costs {cost['costPerIntake']:.2f} {cost['costPerIntakeCurrency']} per intake")

if __name__ == "__main__":
    costs = calculate_all_costs(supplements)
    print_costs(costs)
