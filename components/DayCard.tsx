import React from 'react';
import { DayPlan, Theme } from '../types';

interface DayCardProps {
  dayPlan: DayPlan;
  completedTasks: Set<string>;
  toggleTask: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  theme: Theme;
}

const DayCard: React.FC<DayCardProps> = ({ 
  dayPlan, 
  completedTasks, 
  toggleTask, 
  isExpanded,
  onToggleExpand,
  theme
}) => {
  const isDark = theme === 'dark';
  const completedCount = dayPlan.tasks.filter(t => completedTasks.has(t.id)).length;
  const totalCount = dayPlan.tasks.length;
  const progress = (completedCount / totalCount) * 100;
  const isComplete = completedCount === totalCount;

  // Dynamic classes based on theme
  const cardBase = isDark 
    ? (isComplete ? 'border-green-800/30 bg-green-900/5' : 'border-zinc-800 bg-zinc-900') 
    : (isComplete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white shadow-sm');
  
  const hoverClass = isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-gray-500';
  const textAccent = isDark ? 'text-zinc-200' : 'text-gray-700';
  
  return (
    <div className={`mb-4 border rounded-2xl overflow-hidden transition-all duration-300 ${cardBase}`}>
      {/* Header / Summary */}
      <div 
        onClick={onToggleExpand}
        className={`p-4 cursor-pointer flex items-center justify-between transition-colors ${hoverClass}`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
             <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isDark ? 'text-purple-400 bg-purple-900/20' : 'text-purple-600 bg-purple-100'}`}>
                Day {dayPlan.day}
             </span>
             {isComplete && (
                 <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     Completed
                 </span>
             )}
          </div>
          <h3 className={`text-lg font-semibold ${textPrimary}`}>{dayPlan.title}</h3>
          <p className={`text-sm ${textSecondary}`}>Plugin: <span className={textAccent}>{dayPlan.pluginFocus}</span></p>
        </div>
        
        <div className="flex items-center gap-4">
             {/* Circular Progress (Mini) */}
             <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="none" className={isDark ? "text-zinc-800" : "text-gray-200"} />
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="none" 
                        strokeDasharray={100} 
                        strokeDashoffset={100 - progress} 
                        className={`${isComplete ? 'text-green-500' : 'text-purple-500'} transition-all duration-500`} 
                    />
                </svg>
             </div>
             
             {/* Chevron */}
             <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
             >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`px-4 pb-6 pt-0 border-t ${isDark ? 'border-zinc-800/50' : 'border-gray-100'}`}>
            <p className={`text-sm mt-4 mb-4 italic border-l-2 pl-3 ${isDark ? 'text-zinc-400 border-zinc-700' : 'text-gray-600 border-purple-200'}`}>
                "{dayPlan.description}"
            </p>
            
            <div className="space-y-3">
                {dayPlan.tasks.map((task) => {
                    const isChecked = completedTasks.has(task.id);
                    // Task styles
                    const taskBg = isDark 
                         ? (isChecked ? 'bg-zinc-800/40 opacity-70' : 'bg-zinc-800 hover:bg-zinc-750') 
                         : (isChecked ? 'bg-gray-100 opacity-70' : 'bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm');
                    
                    const taskText = isDark
                        ? (isChecked ? 'text-zinc-500 line-through' : 'text-zinc-200')
                        : (isChecked ? 'text-gray-400 line-through' : 'text-gray-700');

                    const boxClass = isDark
                        ? (isChecked ? 'bg-purple-600 border-purple-600' : 'border-zinc-500 group-hover:border-purple-400')
                        : (isChecked ? 'bg-purple-500 border-purple-500' : 'border-gray-400 group-hover:border-purple-500 bg-white');

                    return (
                        <div 
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${taskBg}`}
                        >
                            <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${boxClass}`}>
                                {isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={`text-sm ${taskText}`}>
                                {task.text}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DayCard;