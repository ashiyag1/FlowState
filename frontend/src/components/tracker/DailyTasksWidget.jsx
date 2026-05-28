import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, X, Circle, CheckCircle2, ChevronDown, ChevronRight, GripVertical } from 'lucide-react'
import { useWellness } from '../../context/WellnessContext'
import { useTheme } from '../../context/ThemeContext'
import { today as getToday } from '../../utils'

export default function DailyTasksWidget({ selectedIso }) {
  const { dark } = useTheme()
  const { dailyTasks, addDailyTask, toggleDailyTask, deleteDailyTask, addSubtask, toggleSubtask, deleteSubtask } = useWellness()
  
  const todayStr = getToday()
  const isPastOrToday = selectedIso <= todayStr
  const tasksForDay = dailyTasks[selectedIso] || []

  const [newTaskName, setNewTaskName] = useState('')
  const [addingSubtaskTo, setAddingSubtaskTo] = useState(null)
  const [newSubtaskName, setNewSubtaskName] = useState('')
  const [expandedTasks, setExpandedTasks] = useState({})

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTaskName.trim() || !isPastOrToday) return
    addDailyTask(selectedIso, { name: newTaskName.trim() })
    setNewTaskName('')
  }

  const handleAddSubtask = (e, taskId) => {
    e.preventDefault()
    if (!newSubtaskName.trim() || !isPastOrToday) return
    addSubtask(selectedIso, taskId, newSubtaskName.trim())
    setNewSubtaskName('')
    setAddingSubtaskTo(null)
    setExpandedTasks(prev => ({ ...prev, [taskId]: true }))
  }

  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  return (
    <div style={{
      background: dark ? 'rgba(20, 15, 10, 0.4)' : 'rgba(255, 252, 246, 0.65)',
      border: dark ? '1px solid rgba(201, 168, 76, 0.16)' : '1px solid rgba(201, 168, 76, 0.22)',
      borderRadius: '24px',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      backdropFilter: 'blur(16px)',
    }}>
      <h3 className="font-display text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: dark ? '#e8d9b5' : '#5C3D1E' }}>
        <CheckCircle2 size={16} className="text-gold" />
        Daily One-Off Tasks
      </h3>

      <div className="flex flex-col gap-2 mb-4">
        {tasksForDay.length === 0 ? (
          <p className="text-[11px] text-ink-soft/60 dark:text-ivory/50 italic py-2 text-center">
            No specific tasks for this day.
          </p>
        ) : (
          tasksForDay.map(task => (
            <div key={task.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 group">
                <button onClick={() => toggleExpand(task.id)} className="p-0.5 text-gold/60 hover:text-gold transition-colors">
                  {task.subtasks?.length > 0 || addingSubtaskTo === task.id ? (
                    expandedTasks[task.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                  ) : <span className="w-[14px] inline-block" />}
                </button>
                <button
                  onClick={() => isPastOrToday && toggleDailyTask(selectedIso, task.id)}
                  className={`flex-1 flex items-center gap-2 p-2 rounded-xl transition-all border text-xs text-left ${
                    task.done
                      ? 'bg-gold/5 border-gold/25 text-ink-soft dark:text-ivory/60 line-through'
                      : 'bg-white/[0.02] border-white/5 text-ink dark:text-ivory hover:bg-white/[0.04]'
                  }`}
                  style={{ opacity: isPastOrToday ? 1 : 0.6 }}
                >
                  {task.done ? <CheckCircle2 size={16} className="text-gold" /> : <Circle size={16} className="text-gold/50" />}
                  <span className="flex-1 truncate">{task.name}</span>
                </button>
                {isPastOrToday && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setAddingSubtaskTo(task.id); setExpandedTasks(prev => ({...prev, [task.id]: true})) }}
                      className="p-1.5 rounded-lg text-gold/60 hover:text-gold hover:bg-white/5 transition-colors"
                      title="Add Subtask"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => deleteDailyTask(selectedIso, task.id)}
                      className="p-1.5 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-white/5 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Subtasks block */}
              <AnimatePresence>
                {expandedTasks[task.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-7 pr-2"
                  >
                    <div className="flex flex-col gap-1 border-l border-gold/20 pl-2 py-1">
                      {task.subtasks?.map(sub => (
                        <div key={sub.id} className="flex items-center gap-2 group/sub">
                          <button
                            onClick={() => isPastOrToday && toggleSubtask(selectedIso, task.id, sub.id)}
                            className={`flex-1 flex items-center gap-2 p-1.5 rounded-lg transition-all text-[11px] text-left ${
                              sub.done
                                ? 'text-ink-soft/60 dark:text-ivory/40 line-through'
                                : 'text-ink/80 dark:text-ivory/80 hover:bg-white/[0.03]'
                            }`}
                          >
                            {sub.done ? <Check size={12} className="text-gold" /> : <div className="w-3 h-3 rounded-sm border border-gold/50" />}
                            <span className="flex-1 truncate">{sub.name}</span>
                          </button>
                          {isPastOrToday && (
                            <button
                              onClick={() => deleteSubtask(selectedIso, task.id, sub.id)}
                              className="p-1 opacity-0 group-hover/sub:opacity-100 rounded text-rose-400/40 hover:text-rose-400 hover:bg-white/5 transition-all"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      ))}

                      {addingSubtaskTo === task.id && (
                        <form onSubmit={(e) => handleAddSubtask(e, task.id)} className="flex items-center gap-2 mt-1">
                          <div className="w-3 h-3 rounded-sm border border-gold/30 shrink-0 ml-1.5" />
                          <input
                            autoFocus
                            type="text"
                            placeholder="Type subtask and hit Enter..."
                            value={newSubtaskName}
                            onChange={e => setNewSubtaskName(e.target.value)}
                            onBlur={() => {
                              if (!newSubtaskName.trim()) setAddingSubtaskTo(null)
                            }}
                            className="flex-1 bg-transparent border-none text-[11px] text-ink dark:text-ivory focus:outline-none placeholder-gold/30"
                          />
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {isPastOrToday && (
        <form onSubmit={handleAddTask} className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-xl border border-white/5 focus-within:border-gold/30 transition-colors">
          <button type="submit" disabled={!newTaskName.trim()} className="p-1.5 text-gold/60 hover:text-gold disabled:opacity-30 rounded-lg">
            <Plus size={16} />
          </button>
          <input
            type="text"
            placeholder="Add a specific task for today..."
            value={newTaskName}
            onChange={e => setNewTaskName(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs text-ink dark:text-ivory focus:outline-none placeholder-ink-soft/40 dark:placeholder-ivory/30"
          />
        </form>
      )}
    </div>
  )
}
