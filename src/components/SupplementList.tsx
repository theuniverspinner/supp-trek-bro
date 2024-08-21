// components/SupplementList.tsx
import { For } from 'solid-js';
import { FaSolidChevronDown, FaSolidChevronUp } from 'solid-icons/fa';
import { formatDate } from '../utils';
import SupplementItem from './SupplementItem';

const SupplementList = ({ groupedSupplements, sortedDays, expandedDay, setExpandedDay, updateSupplement, deleteSupplement, autoFocus }) => {
  return (
    <div class="space-y-4">
      <For each={sortedDays}>
        {(day) => (
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              class="bg-gray-100 p-3 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition duration-200"
              onClick={() => setExpandedDay(expandedDay === day ? null : day)}
            >
              <h2 class="font-semibold text-lg text-gray-700">{formatDate(day)}</h2>
              {expandedDay === day ? <FaSolidChevronUp /> : <FaSolidChevronDown />}
            </div>
            {expandedDay === day && (
              <ul class="divide-y divide-gray-200">
                <For each={groupedSupplements[day]}>
                  {(item) => (
                    <SupplementItem
                      item={item}
                      updateSupplement={updateSupplement}
                      deleteSupplement={deleteSupplement}
                      autoFocus={autoFocus}
                    />
                  )}
                </For>
              </ul>
            )}
          </div>
        )}
      </For>
    </div>
  );
};

export default SupplementList;