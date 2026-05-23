import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://trishannehui.pythonanywhere.com/api/tasks/";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks.");
      }

      const data = await response.json();

      // ✅ Only keep Assignment 1 initially
      const filtered = data.filter((task) => task.title === "Assignment 1");
      setTasks(filtered);

      setError("");
    } catch (error) {
      console.error(error);
      setError("Cannot connect to the Django API. Please check the backend link.");
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    const taskTitle = title.trim();

    if (taskTitle === "") {
      alert("Please enter a task title.");
      return;
    }

    try {
      setIsAdding(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskTitle, is_completed: false }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const newTask = await response.json();
      setTasks([newTask, ...tasks]); // ✅ Add new task to list
      setTitle("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Task was not added. Please check the Django API and CORS settings.");
    } finally {
      setIsAdding(false);
    }
  };

  const markAsComplete = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}${taskId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: true }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const updatedTask = await response.json();
      // ✅ Keep completed tasks visible
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
      setError("");
    } catch (error) {
      console.error(error);
      setError("Task was not updated. Please check the Django API.");
    }
  };

  // ✅ Delete all tasks
  const deleteAllTasks = async () => {
    try {
      for (const task of tasks) {
        await fetch(`${API_URL}${task.id}/`, { method: "DELETE" });
      }
      setTasks([]); // clear state
      setError("");
    } catch (error) {
      console.error(error);
      setError("Tasks were not deleted. Please check the Django API.");
    }
  };

  const pendingCount = tasks.filter((task) => !task.is_completed).length;
  const completedCount = tasks.filter((task) => task.is_completed).length;

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <div className="badge">Django REST Framework + ReactJS</div>

        <h1>Task Management System</h1>
        <p className="subtitle">
          Add, view, and complete tasks using a Django API and React frontend.
        </p>

        <div className="summary">
          <div>
            <strong>{tasks.length}</strong>
            <span>Total Tasks</span>
          </div>
          <div>
            <strong>{pendingCount}</strong>
            <span>Pending</span>
          </div>
          <div>
            <strong>{completedCount}</strong>
            <span>Completed</span>
          </div>
        </div>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Type a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit" disabled={isAdding}>
            {isAdding ? "Adding..." : "Add Task"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="task-list">
          {isLoading ? (
            <p className="empty">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty">No tasks yet. Add your first task above.</p>
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

                {!task.is_completed && (
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

        {/* ✅ Delete button at bottom */}
        <button onClick={deleteAllTasks}>
          Delete All Tasks
        </button>
      </div>
    </div>
  );
}

export default App;
