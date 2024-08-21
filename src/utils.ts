// utils.ts
import { Supplement } from './types';

export const migrateData = (data: any[]): Supplement[] => {
  return data.map((item, index) => ({
    id: item.id || Date.now() + index,
    name: item.name,
    date: item.date,
  }));
};

export const groupSupplementsByDay = (supplements: Supplement[]) => {
  const groups: { [key: string]: Supplement[] } = {};
  supplements.forEach(item => {
    const day = new Date(item.date).toDateString();
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(item);
  });
  return groups;
};

export const sortedDays = (supplements: Supplement[]) => {
  const groups = groupSupplementsByDay(supplements);
  return Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
};

export const formatDate = (dateString: string) => {
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
};