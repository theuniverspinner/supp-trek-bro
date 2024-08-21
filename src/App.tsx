import { createSignal, createEffect, For } from 'solid-js';
import { useAutoFocus } from './hooks/useAutoFocus';
import { FaSolidTrash, FaSolidJedi as FaSolidEdit, FaSolidChevronDown, FaSolidChevronUp } from 'solid-icons/fa';
import "./index.css";

interface Supplement {
  id: number;
  name: string;
  date: string;
}

const SupplementTracker = () => {
  const [supplement, setSupplement] = createSignal('');
  const [intake, setIntake] = createSignal<Supplement[]>([]);
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [editingValue, setEditingValue] = createSignal('');
  const [expandedDay, setExpandedDay] = createSignal<string | null>(null);
  const autoFocus = useAutoFocus();

  const migrateData = (data: any[]): Supplement[] => {
    return data.map((item, index) => ({
      id: item.id || Date.now() + index,
      name: item.name,
      date: item.date,
    }));
  };

  const addSupplement = (e: Event) => {
    e.preventDefault();
    if (supplement()) {
      setIntake([...intake(), {
        id: Date.now(),
        name: supplement(),
        date: new Date().toISOString(),
      }]);
      setSupplement('');
      localStorage.setItem('supplementIntake', JSON.stringify(intake()));
    }
  };

  const updateSupplement = (id: number, newName: string) => {
    setIntake(intake().map(item =>
      item.id === id
        ? { ...item, name: newName, date: new Date().toISOString() }
        : item
    ));
    setEditingId(null);
    localStorage.setItem('supplementIntake', JSON.stringify(intake()));
  };

  const deleteSupplement = (id: number) => {
    setIntake(intake().filter(item => item.id !== id));
    localStorage.setItem('supplementIntake', JSON.stringify(intake()));
  };

  const handleItemClick = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingValue(currentName);
  };

  const handleItemKeyPress = (e: KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      updateSupplement(id, editingValue());
    }
  };

  const handleEditBlur = (id: number) => {
    updateSupplement(id, editingValue());
  };

  const exportData = () => {
    const data = intake();
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supplements.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleDayExpansion = (day: string) => {
    setExpandedDay(expandedDay() === day ? null : day);
  };

  const groupIntakeByDay = () => {
    const groups: { [key: string]: Supplement[] } = {};
    intake().forEach(item => {
      const day = new Date(item.date).toDateString();
      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(item);
    });
    return groups;
  };

  createEffect(() => {
    const storedIntake = localStorage.getItem('supplementIntake');
    if (storedIntake) {
      const parsedIntake = JSON.parse(storedIntake);
      const migratedIntake = migrateData(parsedIntake);
      setIntake(migratedIntake);
      localStorage.setItem('supplementIntake', JSON.stringify(migratedIntake));
    }
  });

  return (
    <div class="p-4 relative max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Supplement Tracker</h1>
      <form onSubmit={addSupplement} class="mb-6 flex">
        <input
          type="text"
          value={supplement()}
          onInput={(e) => setSupplement(e.currentTarget.value)}
          placeholder="Enter supplement name"
          class="flex-grow border border-gray-300 p-2 mr-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          ref={autoFocus}
        />
        <button type="submit" class="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition duration-200">
          Add Supplement
        </button>
      </form>
      <div class="space-y-4">
        <For each={Object.entries(groupIntakeByDay())}>
          {([day, items]) => (
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                class="bg-gray-100 p-3 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition duration-200"
                onClick={() => toggleDayExpansion(day)}
              >
                <h2 class="font-semibold text-lg text-gray-700">{day}</h2>
                {expandedDay() === day ? <FaSolidChevronUp /> : <FaSolidChevronDown />}
              </div>
              {expandedDay() === day && (
                <ul class="divide-y divide-gray-200">
                  <For each={items}>
                    {(item) => (
                      <li class="p-3 flex items-center justify-between hover:bg-gray-50 transition duration-200">
                        {editingId() === item.id ? (
                          <input
                            type="text"
                            value={editingValue()}
                            onInput={(e) => setEditingValue(e.currentTarget.value)}
                            onKeyPress={(e) => handleItemKeyPress(e, item.id)}
                            onBlur={() => handleEditBlur(item.id)}
                            class="border-b border-gray-300 p-1 mr-2 focus:outline-none focus:border-blue-500"
                            ref={autoFocus}
                          />
                        ) : (
                          <span class="flex-grow">{item.name} - {new Date(item.date).toLocaleTimeString()}</span>
                        )}
                        <div class="flex space-x-2">
                          <button
                            onClick={() => handleItemClick(item.id, item.name)}
                            class="text-blue-500 hover:text-blue-700 transition duration-200"
                          >
                            <FaSolidEdit />
                          </button>
                          <button
                            onClick={() => deleteSupplement(item.id)}
                            class="text-red-500 hover:text-red-700 transition duration-200"
                          >
                            <FaSolidTrash />
                          </button>
                        </div>
                      </li>
                    )}
                  </For>
                </ul>
              )}
            </div>
          )}
        </For>
      </div>
      <button
        onClick={exportData}
        class="bg-green-500 text-white p-2 rounded mt-6 hover:bg-green-600 transition duration-200 w-full"
      >
        Export Data
      </button>
    </div>
  );
};

export default SupplementTracker;