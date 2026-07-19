/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import Column from './Column';
import LeadCard from './LeadCard';
import { api } from '@/lib/api';

export default function PipelinePage() {
  const [data, setData] = useState<{
    stages: Record<string, any>;
    leads: Record<string, any>;
    stageOrder: string[];
    stageLeads: Record<string, string[]>;
  }>({
    stages: {},
    leads: {},
    stageOrder: [],
    stageLeads: {}
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    try {
      const [stagesRes, entriesRes] = await Promise.all([
        api.get('/pipeline/stages'),
        api.get('/pipeline/entries')
      ]);

      const stages = stagesRes.data;
      const entries = entriesRes.data;

      const formattedStages: Record<string, any> = {};
      const stageOrder: string[] = [];
      const stageLeads: Record<string, string[]> = {};
      const leads: Record<string, any> = {};

      // Map stages
      stages.forEach((stage: any) => {
        const stageId = stage.id;
        formattedStages[stageId] = {
          id: stageId,
          title: stage.name,
          color: stage.color || 'blue' // Fallback color
        };
        stageOrder.push(stageId);
        stageLeads[stageId] = [];
      });

      // Map entries to stages and lead objects
      entries.forEach((entry: any) => {
        const lead = entry.lead;
        const stageId = entry.stage.id;
        
        leads[lead.id] = {
          id: lead.id,
          company: lead.company?.name || 'Unknown',
          contact: `${lead.firstName} ${lead.lastName}`,
          value: lead.dealValue || 0,
        };

        if (stageLeads[stageId]) {
          stageLeads[stageId].push(lead.id);
        }
      });

      // Sort leads inside stages if needed based on entry.positionInStage

      setData({
        stages: formattedStages,
        leads,
        stageOrder,
        stageLeads
      });

    } catch (err) {
      console.error('Failed to fetch pipeline data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeContainer = Object.keys(data.stageLeads).find(key => 
      data.stageLeads[key].includes(activeId)
    );
    const overContainer = Object.keys(data.stageLeads).find(key => 
      data.stageLeads[key].includes(overId)
    ) || (Object.keys(data.stages).includes(overId) ? overId : null);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setData((prev) => {
      const activeItems = [...prev.stageLeads[activeContainer]];
      const overItems = [...prev.stageLeads[overContainer]];
      const activeIndex = activeItems.indexOf(activeId);
      const overIndex = overId in prev.stages 
        ? overItems.length + 1 
        : overItems.indexOf(overId);

      activeItems.splice(activeIndex, 1);
      overItems.splice(overIndex, 0, activeId);

      return {
        ...prev,
        stageLeads: {
          ...prev.stageLeads,
          [activeContainer]: activeItems,
          [overContainer]: overItems,
        }
      };
    });
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id;
    
    // Find where the item currently is after DragOver state updates
    const currentContainer = Object.keys(data.stageLeads).find(key => 
      data.stageLeads[key].includes(activeId)
    );

    if (!currentContainer) return;

    const newPosition = data.stageLeads[currentContainer].indexOf(activeId);

    // Call API to persist state
    try {
      await api.post('/pipeline/update-stage', null, {
        params: {
          leadId: activeId,
          newStageId: currentContainer,
          newPosition: newPosition
        }
      });
    } catch (err) {
      console.error('Failed to sync pipeline state', err);
      // Optional: rollback state on failure
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-tight">Sales Pipeline</h2>
        <p className="text-slate-400 text-sm mt-1">Drag and drop leads to progress them through the sales cycle.</p>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-6 px-1">
            {data.stageOrder.map((stageId) => {
              const stage = data.stages[stageId];
              const leadIds = data.stageLeads[stageId] || [];
              const leads = leadIds.map(id => data.leads[id]);

              return (
                <Column key={stage.id} stage={stage} leads={leads} />
              );
            })}
          </div>

          <DragOverlay>
            {activeId ? (
              <LeadCard lead={data.leads[activeId]} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
