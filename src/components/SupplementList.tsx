// components/SupplementList.tsx
import { For } from 'solid-js';
import { FaSolidChevronDown, FaSolidChevronUp } from 'solid-icons/fa';
import { formatDate } from '../utils';
import SupplementItem from './SupplementItem';
import { Supplement } from '../types';

interface SupplementListProps {
  groupedSupplements: { [key: string]: Supplement[] };
  sortedDays: string[];
  expandedDay: string | null;
  setExpandedDay: (day: string | null) => void;
  updateSupplement: (id: number, newName: string) => void;
  deleteSupplement: (id: number) => void;
}

const SupplementList = (props: SupplementListProps) => {
  return (
    <div class="space-y-4">
      <For each={props.sortedDays}>
        {(day) => (
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              class="bg-gray-100 p-3 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition duration-200"
              onClick={() => props.setExpandedDay(props.expandedDay === day ? null : day)}
            >
              <h2 class="font-semibold text-lg text-gray-700">{formatDate(day)}</h2>
              {props.expandedDay === day ? <FaSolidChevronUp /> : <FaSolidChevronDown />}
            </div>
            {props.expandedDay === day && (
              <ul class="divide-y divide-gray-200">
                <For each={props.groupedSupplements[day]}>
                  {(item) => (
                    <SupplementItem
                      item={item}
                      updateSupplement={props.updateSupplement}
                      deleteSupplement={props.deleteSupplement}
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