import { createSignal, createEffect, onMount } from 'solid-js';
import { useAutoFocus } from './hooks/useAutoFocus';
import { Supplement } from './types';
import SupplementForm from './components/SupplementForm';
import SupplementList from './components/SupplementList';
import Menu from './components/Menu';
import { groupSupplementsByDay, sortedDays } from './utils';
import "./index.css";

const SupplementTracker = () => {
  const [supplements, setSupplements] = createSignal<Supplement[]>([]);
  const [expandedDay, setExpandedDay] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const autoFocus = useAutoFocus();

  // Extract localStorage operations into separate functions
  const loadSupplements = () => {
    const storedSupplements = localStorage.getItem('supplementIntake');
    if (storedSupplements) {
      try {
        setSupplements(JSON.parse(storedSupplements));
      } catch (error) {
        console.error('Error parsing stored supplements:', error);
      }
    }
    setIsLoading(false);
  };

  const saveSupplements = (newSupplements: Supplement[]) => {
    localStorage.setItem('supplementIntake', JSON.stringify(newSupplements));
  };

  // Use onMount instead of createEffect for initial load
  onMount(() => {
    loadSupplements();
    setExpandedDay(new Date().toDateString());
  });

  // Simplified supplement operations
  const supplementOperations = {
    add: (name: string) => {
      const newSupplement = {
        id: Date.now(),
        name,
        date: new Date().toISOString(),
      };
      const updatedSupplements = [...supplements(), newSupplement];
      setSupplements(updatedSupplements);
      saveSupplements(updatedSupplements);
    },
    update: (id: number, newName: string) => {
      const updatedSupplements = supplements().map(item =>
        item.id === id ? { ...item, name: newName, date: new Date().toISOString() } : item
      );
      console.log(updatedSupplements)
      setSupplements(updatedSupplements);
      saveSupplements(updatedSupplements);
    },
    delete: (id: number) => {
      const updatedSupplements = supplements().filter(item => item.id !== id);
      setSupplements(updatedSupplements);
      saveSupplements(updatedSupplements);
    },
  };

  return (
    <div class="p-4 relative max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Supplement Tracker</h1>
        <Menu supplements={supplements()} />
      </header>
      <SupplementForm addSupplement={supplementOperations.add} autoFocus={autoFocus} />
      {isLoading() ? (
        <p>Loading supplements...</p>
      ) : (
        <SupplementList
          groupedSupplements={groupSupplementsByDay(supplements())}
          sortedDays={sortedDays(supplements())}
          expandedDay={expandedDay()}
          setExpandedDay={setExpandedDay}
          updateSupplement={supplementOperations.update}
          deleteSupplement={supplementOperations.delete}
          autoFocus={autoFocus}
        />
      )}
    </div>
  );
};

export default SupplementTracker;