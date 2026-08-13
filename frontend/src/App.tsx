import { useEffect, useState } from 'react'
// import TaskCard from './components/TaskCard'
import Column from './components/Column'
import './App.css'

type Task = {
  id: number
  title: string
  description: string
  status: string
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/tasks')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao buscar tarefas')
        }

        return response.json()
      })
      .then((data) => {
        setTasks(data)
      })
      .catch(() => {
        setError('Não foi possível carregar as tarefas.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  function createTask() {
    fetch('http://localhost:8080/tasks', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        title: title,
        description: description,
        status: 'todo',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao criar tarefa')
        }

        return response.json()
      })
      .then((newTask) => {
        setTasks([...tasks, newTask])
        setTitle('')
        setDescription('')
      })
      .catch(() => {
        setError('Não foi possível criar a tarefa.')
      })
  }
  function moveTask(task: Task, newStatus: string) {
    fetch(`http://localhost:8080/tasks/${task.id}`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status: newStatus,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao mover tarefa')
        }

        return response.json()
      })
      .then((updatedTask) => {
        setTasks(
          tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        )
      })
      .catch(() => {
        setError('Não foi possível mover a tarefa.')
      })
  }
  function deleteTask(id: number) {
      fetch(`http://localhost:8080/tasks/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Erro ao excluir tarefa')
          }

          setTasks(tasks.filter((task) => task.id !== id))
        })
        .catch(() => {
          setError('Não foi possível excluir a tarefa.')
        })
  }
  function startEditing(task: Task) {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description)
  }

  function saveEdit() {
    if (!editingTask) {
      return
    }

    fetch(`http://localhost:8080/tasks/${editingTask.id}`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        title: title,
        description: description,
        status: editingTask.status,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao editar tarefa')
        }

        return response.json()
      })
      .then((updatedTask) => {
        setTasks(
          tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        )

        setTitle('')
        setDescription('')
        setEditingTask(null)
      })
      .catch(() => {
        setError('Não foi possível editar a tarefa.')
      })
  }
  function cancelEdit() {
    setEditingTask(null)
    setTitle('')
    setDescription('')
  }
  return (
  <div className="app">
        <h1>Mini Kanban</h1>
        <p>Desafio Fullstack Veritas</p>
        {loading && <p>Carregando tarefas...</p>}
        {error && <p>{error}</p>}
        <div className="task-form">
          <input
            type="text"
            placeholder="Título da tarefa"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          {editingTask ? (
            <>
              <button onClick={saveEdit}>
                Salvar edição
              </button>

              <button onClick={cancelEdit}>
                Cancelar
              </button>
            </>
          ) : (
            <button onClick={createTask}>
              Adicionar tarefa
            </button>
          )}
        </div>
      <div className="board">
        <Column
          title="A Fazer"
          status="todo"
          tasks={tasks}
          onMove={moveTask}
          onEdit={startEditing}
          onDelete={deleteTask}
        />
        <Column
          title="Em Progresso"
          status="in_progress"
          tasks={tasks}
          onMove={moveTask}
          onEdit={startEditing}
          onDelete={deleteTask}
        />
          <Column
            title="Concluídas"
            status="done"
            tasks={tasks}
            onMove={moveTask}
            onEdit={startEditing}
            onDelete={deleteTask}
          />
        </div>
    </div>
  )
}

export default App