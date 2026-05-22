import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://kinerz707.pythonanywhere.com/api/tasks/";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks.");
      }

      const data = await response.json();
      setTasks(data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Cannot connect to Django API. Make sure backend is running.");
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      alert("Please enter a task title.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          is_completed: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const newTask = await response.json();

      setTasks([newTask, ...tasks]);
      setTitle("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Task was not added. Check your Django API and CORS settings.");
    }
  };

  const markAsComplete = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}${taskId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_completed: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const updatedTask = await response.json();

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        )
      );

      setError("");
    } catch (error) {
      console.error(error);
      setError("Task was not updated. Check your Django API.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1>Task Management System</h1>
        <p className="subtitle">
          Simple task tracker using Django REST Framework and ReactJS
        </p>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Enter new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button type="submit">Add Task</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet.</p>
          ) : (
            tasks.map((task) => (
              <div className="task-item" key={task.id}>
                <span
                  className={
                    task.is_completed
                      ? "task-title completed-title"
                      : "task-title"
                  }
                >
                  {task.title}
                </span>

                {task.is_completed ? (
                  <span className="done">Completed</span>
                ) : (
                  <button
                    className="complete-btn"
                    onClick={() => markAsComplete(task.id)}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;