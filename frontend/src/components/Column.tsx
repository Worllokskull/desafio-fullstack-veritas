import TaskCard from './TaskCard'

type Task = {
  id: number
  title: string
  description: string
  status: string
}

type ColumnProps = {
  title: string
  status: string
  tasks: Task[]
  onMove: (task: Task, status: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

function Column({
  title,
  status,
  tasks,
  onMove,
  onEdit,
  onDelete,
}: ColumnProps) {
  const filteredTasks = tasks.filter((task) => task.status === status)

return (
  <div className="column">
      <h2>
        {title} ({filteredTasks.length})
      </h2>

      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onMove={onMove}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default Column