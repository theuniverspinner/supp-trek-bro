// components/SupplementForm.tsx
import { createSignal } from 'solid-js';
import { useAutoFocus } from '../hooks/useAutoFocus';

interface SupplementFormProps {
  addSupplement: (name: string) => void;
}

const SupplementForm = (props: SupplementFormProps) => {
  const [supplementName, setSupplementName] = createSignal('');
  const autoFocus = useAutoFocus();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (supplementName().trim()) {
      props.addSupplement(supplementName().trim());
      setSupplementName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} class="mb-6 flex">
      <input
        type="text"
        value={supplementName()}
        onInput={(e) => setSupplementName(e.currentTarget.value)}
        placeholder="Enter supplement name"
        class="flex-grow border border-gray-300 p-2 mr-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        ref={autoFocus}
      />
      <button type="submit" class="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition duration-200">
        Add Supplement
      </button>
    </form>
  );
};

export default SupplementForm;