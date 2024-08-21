// components/Menu.tsx
import { createSignal, Show } from 'solid-js';
import { FaSolidEllipsis as FaSolidEllipsisV } from 'solid-icons/fa';

const Menu = ({ supplements }) => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const exportData = () => {
    const jsonData = JSON.stringify(supplements, null, 2);
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

  return (
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
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Menu;