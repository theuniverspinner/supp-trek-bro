import { createSignal, createEffect, For } from 'solid-js';
import { useAutoFocus } from './hooks/useAutoFocus';

interface Supplement {
  id: number;
  name: string;
  date: string;
}

const SupplementTracker = () => {
  const [supplement, setSupplement] = createSignal('');
  const [intake, setIntake] = createSignal<Supplement[]>([]);
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const autoFocus = useAutoFocus();

  const migrateData = (data: any[]): Supplement[] => {
    return data.map((item, index) => ({
      id: item.id || Date.now() + index,
      name: item.name,
      date: item.date
    }));
  };

  const addOrUpdateSupplement = (e: Event) => {
    e.preventDefault();
    if (supplement()) {
      if (editingId() !== null) {
        setIntake(intake().map(item =>
          item.id === editingId()
            ? { ...item, name: supplement(), date: new Date().toISOString() }
            : item
        ));
        setEditingId(null);
      } else {
        setIntake([...intake(), {
          id: Date.now(),
          name: supplement(),
          date: new Date().toISOString()
        }]);
      }
      setSupplement('');
      localStorage.setItem('supplementIntake', JSON.stringify(intake()));
    }
  };

  const startEditing = (id: number) => {
    const item = intake().find(item => item.id === id);
    if (item) {
      setSupplement(item.name);
      setEditingId(id);
    }
  };

  const cancelEditing = () => {
    setSupplement('');
    setEditingId(null);
  };

  createEffect(() => {
    const storedIntake = localStorage.getItem('supplementIntake');
    if (storedIntake) {
      const parsedIntake = JSON.parse(storedIntake);
      const migratedIntake = migrateData(parsedIntake);
      setIntake(migratedIntake);

      // Save migrated data back to localStorage
      localStorage.setItem('supplementIntake', JSON.stringify(migratedIntake));
    }
  });

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Supplement Tracker</h1>
      <form onSubmit={addOrUpdateSupplement} class="mb-4">
        <input
          type="text"
          value={supplement()}
          onInput={(e) => setSupplement(e.currentTarget.value)}
          placeholder="Enter supplement name"
          class="border p-2 mr-2"
          ref={autoFocus}
        />
        <button type="submit" class="bg-blue-500 text-white p-2 rounded mr-2">
          {editingId() !== null ? 'Update' : 'Add'} Supplement
        </button>
        {editingId() !== null && (
          <button
            type="button"
            onClick={cancelEditing}
            class="bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>
      <ul>
        <For each={intake()}>
          {(item) => (
            <li class="mb-2">
              {`${item.name} - ${new Date(item.date).toLocaleString()}`}
              <button
                onClick={() => startEditing(item.id)}
                class="ml-2 bg-yellow-500 text-white p-1 rounded text-sm"
              >
                Edit
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default SupplementTracker;