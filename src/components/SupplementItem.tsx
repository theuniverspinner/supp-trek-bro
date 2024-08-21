// components/SupplementItem.tsx
import { createSignal } from 'solid-js';
import { FaSolidJedi as FaSolidEdit, FaSolidTrash } from 'solid-icons/fa';
import { Supplement } from '../types';
import { useAutoFocus } from '../hooks/useAutoFocus';

interface SupplementItemProps {
  item: Supplement;
  updateSupplement: (id: number, newName: string) => void;
  deleteSupplement: (id: number) => void;
}

const SupplementItem = (props: SupplementItemProps) => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [editValue, setEditValue] = createSignal(props.item.name);
  const autoFocus = useAutoFocus();

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(props.item.name);
  };

  const handleUpdate = () => {
    if (editValue().trim() === '') {
      props.deleteSupplement(props.item.id);
    } else {
      props.updateSupplement(props.item.id, editValue().trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(props.item.name);
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
        <span class="flex-grow">{props.item.name} - {new Date(props.item.date).toLocaleTimeString()}</span>
      )}
      <div class="flex space-x-2">
        <button
          onClick={handleEdit}
          class="text-blue-500 hover:text-blue-700 transition duration-200"
        >
          <FaSolidEdit />
        </button>
        <button
          onClick={() => props.deleteSupplement(props.item.id)}
          class="text-red-500 hover:text-red-700 transition duration-200"
        >
          <FaSolidTrash />
        </button>
      </div>
    </li>
  );
};

export default SupplementItem;