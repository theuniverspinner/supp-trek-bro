interface Supplement {
  id: number;
  name: string;
  date: string;
}

interface SupplementsDB {
  supplements: Supplement[];
}

const supplementsDB: SupplementsDB = {
  supplements: JSON.parse(localStorage.getItem('supplementIntake') || '[]'),
};

export function getSupplements(): Supplement[] {
  return supplementsDB.supplements;
}

export function addSupplement(supplement: Supplement) {
  supplementsDB.supplements.push(supplement);
  localStorage.setItem('supplementIntake', JSON.stringify(supplementsDB.supplements));
}

export function updateSupplement(id: number, newName: string) {
  const supplementIndex = supplementsDB.supplements.findIndex((supplement) => supplement.id === id);
  if (supplementIndex !== -1) {
    supplementsDB.supplements[supplementIndex].name = newName;
    supplementsDB.supplements[supplementIndex].date = new Date().toISOString();
    localStorage.setItem('supplementIntake', JSON.stringify(supplementsDB.supplements));
  }
}

export function deleteSupplement(id: number) {
  supplementsDB.supplements = supplementsDB.supplements.filter((supplement) => supplement.id !== id);
  localStorage.setItem('supplementIntake', JSON.stringify(supplementsDB.supplements));
}

export function exportData() {
  const data = supplementsDB.supplements.map((supplement) => ({
    name: supplement.name,
    date: supplement.date,
  }));
  const csv = data.map((row) => Object.values(row).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'supplements.csv';
  a.click();
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }
}