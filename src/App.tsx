import { createSignal, createEffect, For, Show } from 'solid-js';
import { useAutoFocus } from './hooks/useAutoFocus';
import { FaSolidTrash, FaSolidJedi as FaSolidEdit, FaSolidChevronDown, FaSolidChevronUp, FaSolidEllipsis as FaSolidEllipsisV } from 'solid-icons/fa';
import "./index.css";

interface Supplement {
  id: number;
  name: string;
  date: string;
}

const SupplementTracker = () => {
  const [supplements, setSupplements] = createSignal<Supplement[]>([]);
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [editingValue, setEditingValue] = createSignal('');
  const [expandedDay, setExpandedDay] = createSignal<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const autoFocus = useAutoFocus();

  const migrateData = (data: any[]): Supplement[] => {
    return data.map((item, index) => ({
      id: item.id || Date.now() + index,
      name: item.name,
      date: item.date,
    }));
  };

  createEffect(() => {
    const storedSupplements = localStorage.getItem('supplementIntake');
    if (storedSupplements) {
      const parsedSupplements = JSON.parse(storedSupplements);
      const migratedSupplements = migrateData(parsedSupplements);
      setSupplements(migratedSupplements);
      localStorage.setItem('supplementIntake', JSON.stringify(migratedSupplements));
    }
    const today = new Date().toDateString();
    setExpandedDay(today);
  });

  const addSupplement = (e: Event) => {
    e.preventDefault();
    const newSupplement = {
      id: Date.now(),
      name: editingValue(),
      date: new Date().toISOString(),
    };
    setSupplements([...supplements(), newSupplement]);
    setEditingValue('');
    localStorage.setItem('supplementIntake', JSON.stringify(supplements()));
  };

  const updateSupplement = (id: number, newName: string) => {
    setSupplements(supplements().map(item =>
      item.id === id
        ? { ...item, name: newName, date: new Date().toISOString() }
        : item
    ));
    setEditingId(null);
    localStorage.setItem('supplementIntake', JSON.stringify(supplements()));
  };

  const deleteSupplement = (id: number) => {
    setSupplements(supplements().filter(item => item.id !== id));
    localStorage.setItem('supplementIntake', JSON.stringify(supplements()));
  };

  const handleItemClick = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingValue(currentName);
  };

  const handleItemKeyPress = (e: KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      updateSupplement(id, editingValue());
    } else if (e.key === 'Delete') {
      deleteSupplement(id);
    }
  };

  const handleEditBlur = (id: number) => {
    if (editingValue().trim() === '') {
      deleteSupplement(id);
    } else {
      updateSupplement(id, editingValue());
    }
  };

  const exportData = () => {
    const data = supplements();
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supplements.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsMenuOpen(false);
  };

  const Menu = () => (
    <div class="relative inline-block text-left">
      <div>
        <button
          type="button"
          class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          onClick={() => setIsMenuOpen(!isMenuOpen())}
        >
          <FaSolidEllipsisV />
        </button>
      </div>

      <Show when={isMenuOpen()}>
        <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
              onClick={exportData}
            >
              Export Data
            </button>
            {/* Add more menu items here if needed */}
          </div>
        </div>
      </Show>
    </div>
  );

  const groupSupplementsByDay = () => {
    const groups: { [key: string]: Supplement[] } = {};
    supplements().forEach(item => {
      const day = new Date(item.date).toDateString();
      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(item);
    });
    return groups;
  };

  const sortedDays = () => {
    const groups = groupSupplementsByDay();
    return Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  };

  const formatDate = (dateString: string) => {
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

  return (
    <div class="p-4 relative max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Supplement Tracker</h1>
        <Menu />
      </div>
      <form onSubmit={addSupplement} class="mb-6 flex">
        <input
          type="text"
          value={editingValue()}
          onInput={(e) => setEditingValue(e.currentTarget.value)}
          placeholder="Enter supplement name"
          class="flex-grow border border-gray-300 p-2 mr-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          ref={autoFocus}
        />
        <button type="submit" class="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition duration-200">
          Add Supplement
        </button>
      </form>
      <div class="space-y-4">
        <For each={sortedDays()}>
          {(day) => (
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                class="bg-gray-100 p-3 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition duration-200"
                onClick={() => setExpandedDay(expandedDay() === day ? null : day)}
              >
                <h2 class="font-semibold text-lg text-gray-700">{formatDate(day)}</h2>
                {expandedDay() === day ? <FaSolidChevronUp /> : <FaSolidChevronDown />}
              </div>
              {expandedDay() === day && (
                <ul class="divide-y divide-gray-200">
                  <For each={groupSupplementsByDay()[day]}>
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
    </div>
  );
};

export default SupplementTracker;

