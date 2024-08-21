import { createSignal, createEffect, For } from 'solid-js';
import { useAutoFocus } from './hooks/useAutoFocus';
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
    <div class="p-4 relative">
      <h1 class="text-2xl font-bold mb-4">Supplement Tracker</h1>
      <form onSubmit={addSupplement} class="mb-4">
        <input
          type="text"
          value={supplement()}
          onInput={(e) => setSupplement(e.currentTarget.value)}
          placeholder="Enter supplement name"
          class="border p-2 mr-2"
          ref={autoFocus}
        />
        <button type="submit" class="bg-blue-500 text-white p-2 rounded">
          Add Supplement
        </button>
      </form>
      <ul>
        <For each={intake()}>
          {(item) => (
            <li class="mb-2">
              {editingId() === item.id ? (
                <input
                  type="text"
                  value={editingValue()}
                  onInput={(e) => setEditingValue(e.currentTarget.value)}
                  onKeyPress={(e) => handleItemKeyPress(e, item.id)}
                  onBlur={() => handleEditBlur(item.id)}
                  class="border p-1"
                  ref={autoFocus}
                />
              ) : (
                <span
                  onClick={() => handleItemClick(item.id, item.name)}
                  class="cursor-pointer hover:bg-gray-100 p-1"
                >
                  {item.name} - {new Date(item.date).toLocaleString()}
                </span>
              )}
            </li>
          )}
        </For>
      </ul>
      <button
        onClick={exportData}
        class="bg-green-500 text-white p-2 rounded mt-4 block absolute right-0"
      >
        Export Data
      </button>
    </div>
  );
};

export default SupplementTracker;
