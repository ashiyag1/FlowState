import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, X, Circle, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react'
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
    <div 
      className="transition-all duration-300"
      style={{
        background: dark ? 'rgba(20, 15, 10, 0.45)' : '#fdf6ec',
        border: dark ? '1px solid rgba(201, 168, 76, 0.16)' : '1px solid #e8d5b0',
        borderRadius: '24px',
        padding: '1.25rem',
        boxShadow: dark ? '0 12px 36px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3 border-b border-gold/10 pb-2">
        <h3 
          className="font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1 rounded-lg border"
          style={{ 
            backgroundColor: dark ? 'rgba(201, 147, 58, 0.18)' : 'rgba(201, 147, 58, 0.12)',
            borderColor: dark ? 'rgba(201, 147, 58, 0.35)' : 'rgba(201, 147, 58, 0.25)',
            color: dark ? '#ffeab8' : '#8B6914'
          }}
        >
          <CheckCircle2 size={14} className="text-gold" />
          Daily One-Off Tasks
        </h3>
        {isPastOrToday && (
          <button
            onClick={() => {
              const input = document.getElementById('daily-task-input')
              if (input) input.focus()
            }}
            className="text-[10px] text-gold border border-gold/30 hover:bg-gold/15 py-1 px-3 rounded-full transition-all font-semibold"
            style={{ color: dark ? '#ffeab8' : '#8B6914', borderColor: dark ? 'rgba(201,168,76,0.3)' : 'rgba(139,105,20,0.3)' }}
          >
            Add task
          </button>
        )}
      </div>

      <p className="text-[10.5px] italic mt-0 mb-3 opacity-80 leading-relaxed font-sans" style={{ color: dark ? '#ffdca3' : '#8B6914' }}>
        Karmasu Kaushalam — finding peace in daily actions. Take it one task at a time.
      </p>

      {/* Input box inside card */}
      {isPastOrToday && (
        <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
          <input
            id="daily-task-input"
            type="text"
            placeholder="Add a specific task for today..."
            value={newTaskName}
            onChange={e => setNewTaskName(e.target.value)}
            aria-label="New daily task"
            className="flex-1 rounded-xl border border-gold/20 bg-white/5 px-3 py-2 text-xs text-ink dark:text-ivory outline-none focus:border-gold shadow-inner"
          />
          <button
            type="submit"
            disabled={!newTaskName.trim()}
            className="p-2 bg-gold hover:bg-gold-lt text-white rounded-xl disabled:opacity-50 transition-colors"
            aria-label="Add task"
          >
            <Plus size={14} />
          </button>
        </form>
      )}

      {/* Tasks List */}
      <div className="flex flex-col gap-1.5">
        {tasksForDay.length === 0 ? (
          <p className="text-[11px] text-ink-soft/40 dark:text-ivory/40 italic py-2 text-center">
            No tasks yet today. Keep it light.
          </p>
        ) : (
          tasksForDay.map(task => (
            <div key={task.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 group">
                <button 
                  onClick={() => toggleExpand(task.id)} 
                  className="p-0.5 text-gold/60 hover:text-gold transition-colors"
                  aria-expanded={expandedTasks[task.id]}
                  aria-label="Toggle subtasks"
                >
                  {task.subtasks?.length > 0 || addingSubtaskTo === task.id ? (
                    expandedTasks[task.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />
                  ) : <span className="w-[12px] inline-block" />}
                </button>
                <button
                  onClick={() => isPastOrToday && toggleDailyTask(selectedIso, task.id)}
                  aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                  disabled={!isPastOrToday}
                  className={`flex-1 flex items-center gap-2 p-2 rounded-xl transition-all border text-xs text-left ${
                    task.done
                      ? 'bg-gold/5 border-gold/15 text-ink-soft dark:text-ivory/60 line-through'
                      : 'bg-white/[0.02] border-white/5 text-ink dark:text-ivory hover:bg-white/[0.04]'
                  } ${!isPastOrToday ? 'cursor-not-allowed' : ''}`}
                  style={{ opacity: isPastOrToday ? 1 : 0.6 }}
                >
                  {task.done ? <CheckCircle2 size={14} className="text-gold" /> : <Circle size={14} className="text-gold/50" />}
                  <span className="flex-1 truncate font-display font-medium">{task.name}</span>
                </button>
                {isPastOrToday && (
                  <div className="flex items-center gap-0.5 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setAddingSubtaskTo(task.id); setExpandedTasks(prev => ({...prev, [task.id]: true})) }}
                      className="p-1 rounded-lg text-gold/60 hover:text-gold hover:bg-white/5 transition-colors"
                      title="Add Subtask"
                      aria-label="Add subtask"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this task?")) {
                          deleteDailyTask(selectedIso, task.id)
                        }
                      }}
                      className="p-1 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-white/5 transition-colors"
                      aria-label="Delete task"
                    >
                      <X size={12} />
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
                    className="overflow-hidden pl-5 pr-2"
                  >
                    <div className="flex flex-col gap-1 border-l border-gold/20 pl-2 py-0.5">
                      {task.subtasks?.map(sub => (
                        <div key={sub.id} className="flex items-center gap-2 group/sub">
                          <button
                            onClick={() => isPastOrToday && toggleSubtask(selectedIso, task.id, sub.id)}
                            aria-label={sub.done ? "Mark subtask incomplete" : "Mark subtask complete"}
                            disabled={!isPastOrToday}
                            className={`flex-1 flex items-center gap-2 p-1 rounded-lg transition-all text-[10px] text-left ${
                              sub.done
                                ? 'text-ink-soft/60 dark:text-ivory/40 line-through'
                                : 'text-ink/80 dark:text-ivory/80 hover:bg-white/[0.03]'
                            } ${!isPastOrToday ? 'cursor-not-allowed' : ''}`}
                          >
                            {sub.done ? <Check size={10} className="text-gold" /> : <div className="w-2.5 h-2.5 rounded-sm border border-gold/50" />}
                            <span className="flex-1 truncate">{sub.name}</span>
                          </button>
                          {isPastOrToday && (
                            <button
                              onClick={() => deleteSubtask(selectedIso, task.id, sub.id)}
                              aria-label="Delete subtask"
                              className="p-0.5 opacity-60 sm:opacity-0 group-hover/sub:opacity-100 rounded text-rose-400/40 hover:text-rose-400 hover:bg-white/5 transition-all"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </div>
                      ))}

                      {addingSubtaskTo === task.id && (
                        <form onSubmit={(e) => handleAddSubtask(e, task.id)} className="flex items-center gap-2 mt-0.5">
                          <div className="w-2.5 h-2.5 rounded-sm border border-gold/30 shrink-0 ml-1.5" />
                          <label htmlFor={`subtask-input-${task.id}`} className="sr-only">New subtask name</label>
                          <input
                            id={`subtask-input-${task.id}`}
                            autoFocus
                            type="text"
                            placeholder="Type subtask..."
                            value={newSubtaskName}
                            onChange={e => setNewSubtaskName(e.target.value)}
                            className="flex-1 bg-transparent border-none text-[10px] text-ink dark:text-ivory focus:outline-none placeholder-gold/30"
                          />
                          <button
                            type="submit"
                            disabled={!newSubtaskName.trim()}
                            aria-label="Submit new subtask"
                            className="text-[10px] bg-gold hover:bg-gold-lt text-white px-2 py-0.5 rounded transition-colors disabled:opacity-50"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => { setAddingSubtaskTo(null); setNewSubtaskName(''); }}
                            aria-label="Cancel subtask"
                            className="text-rose-400 opacity-60 hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
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
    </div>
  )
}
