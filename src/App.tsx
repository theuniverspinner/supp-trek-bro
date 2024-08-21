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

  createEffect(() => {
    const storedSupplements = localStorage.getItem('supplementIntake');
    if (storedSupplements) {
      try {
        const parsedSupplements = JSON.parse(storedSupplements);
        setSupplements(parsedSupplements);
      } catch (error) {
        console.error('Error parsing stored supplements:', error);
      }
    } else {
      console.log('No stored supplements found');
    }
    
    const today = new Date().toDateString();
    setExpandedDay(today);
    setIsLoading(false);
  });

  createEffect(() => {
    console.log('Effect: Supplements updated', supplements());
  });

  const addSupplement = (name: string) => {
    const newSupplement = {
      id: Date.now(),
      name,
      date: new Date().toISOString(),
    };
    setSupplements([...supplements(), newSupplement]);
    localStorage.setItem('supplementIntake', JSON.stringify(supplements()));
  };

  const updateSupplement = (id: number, newName: string) => {
    setSupplements(supplements().map(item =>
      item.id === id
        ? { ...item, name: newName, date: new Date().toISOString() }
        : item
    ));
    localStorage.setItem('supplementIntake', JSON.stringify(supplements()));
  };

  const deleteSupplement = (id: number) => {
    setSupplements(supplements().filter(item => item.id !== id));
    localStorage.setItem('supplementIntake', JSON.stringify(supplements()));
  };

  return (
    <div class="p-4 relative max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Supplement Tracker</h1>
        <Menu supplements={supplements()} />
      </div>
      <SupplementForm addSupplement={addSupplement} autoFocus={autoFocus} />
      {isLoading() ? (
        <p>Loading supplements...</p>
      ) : (
        <SupplementList
          groupedSupplements={groupSupplementsByDay(supplements())}
          sortedDays={sortedDays(supplements())}
          expandedDay={expandedDay()}
          setExpandedDay={setExpandedDay}
          updateSupplement={updateSupplement}
          deleteSupplement={deleteSupplement}
          autoFocus={autoFocus}
        />
      )}
    </div>
  );
};

export default SupplementTracker;