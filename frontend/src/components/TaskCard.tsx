type Task = {
  id: number
  title: string
  description: string
  status: string
}

type TaskCardProps = {
  task: Task
  onMove: (task: Task, status: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

function TaskCard({
  task,
  onMove,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
   <div className={`task-card ${task.status}`}>
      <h3>{task.title}</h3>

      <p>{task.description}</p>

      <div className="task-actions">
        {task.status !== 'todo' && (
          <button
            onClick={() =>
              onMove(
                task,
                task.status === 'done' ? 'in_progress' : 'todo'
              )
            }
          >
            ← Voltar
          </button>
        )}

        {task.status !== 'done' && (
          <button
            onClick={() =>
              onMove(
                task,
                task.status === 'todo' ? 'in_progress' : 'done'
              )
            }
          >
            Avançar →
          </button>
        )}

        <button onClick={() => onEdit(task)}>
          Editar
        </button>

        <button onClick={() => onDelete(task.id)}>
          Excluir
        </button>
      </div>
    </div>
  )
}

export default TaskCard