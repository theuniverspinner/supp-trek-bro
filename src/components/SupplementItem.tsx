// components/SupplementItem.tsx
import { createSignal } from 'solid-js';
import { FaSolidJedi as FaSolidEdit, FaSolidTrash } from 'solid-icons/fa';

const SupplementItem = ({ item, updateSupplement, deleteSupplement, autoFocus }) => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [editValue, setEditValue] = createSignal(item.name);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(item.name);
  };

  const handleUpdate = () => {
    if (editValue().trim() === '') {
      deleteSupplement(item.id);
    } else {
      updateSupplement(item.id, editValue().trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Delete') {
      deleteSupplement(item.id);
    }
  };

  return (
    <li class="p-3 flex items-center justify-between hover:bg-gray-50 transition duration-200">
      {isEditing() ? (
        <input
          type="text"
          value={editValue()}
          onInput={(e) => setEditValue(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
          onBlur={handleUpdate}
          class="border-b border-gray-300 p-1 mr-2 focus:outline-none focus:border-blue-500"
          ref={autoFocus}
        />
      ) : (
        <span class="flex-grow">{item.name} - {new Date(item.date).toLocaleTimeString()}</span>
      )}
      <div class="flex space-x-2">
        <button
          onClick={handleEdit}
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
  );
};

export default SupplementItem;