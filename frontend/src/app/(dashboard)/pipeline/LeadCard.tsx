import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatCurrency } from '@/lib/utils';
import { Building2, GripVertical } from 'lucide-react';

interface LeadCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lead: any;
  isOverlay?: boolean;
}

export default function LeadCard({ lead, isOverlay }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-slate-900/80 backdrop-blur-md border border-indigo-500/20 rounded-xl p-4 shadow-lg hover:border-indigo-500/50 transition-colors group relative ${
        isOverlay ? 'scale-105 shadow-2xl z-50 ring-2 ring-indigo-500' : ''
      } ${isDragging ? 'border-dashed border-indigo-500 bg-indigo-500/10' : ''}`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-3 right-3 text-slate-500 cursor-grab hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm truncate max-w-[150px]">
            {lead.company}
          </h4>
          <p className="text-xs text-slate-400 truncate max-w-[150px]">
            {lead.contact}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-indigo-500/10">
        <div className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
          {formatCurrency(lead.value)}
        </div>
        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-300 font-medium border border-indigo-500/30">
          {lead.contact.charAt(0)}
        </div>
      </div>
    </div>
  );
}
