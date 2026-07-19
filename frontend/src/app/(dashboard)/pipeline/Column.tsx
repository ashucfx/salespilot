import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import LeadCard from './LeadCard';

interface ColumnProps {
  stage: { id: string; title: string; color: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leads: any[];
}

export default function Column({ stage, leads }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  });

  return (
    <div className="flex flex-col w-80 shrink-0 h-full max-h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-${stage.color}-500`} />
          {stage.title}
        </h3>
        <span className="text-xs font-medium bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
          {leads.length}
        </span>
      </div>

      <div 
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto glass-panel rounded-2xl p-3 flex flex-col gap-3 min-h-[150px] border-t-4 border-t-${stage.color}-500/50`}
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
