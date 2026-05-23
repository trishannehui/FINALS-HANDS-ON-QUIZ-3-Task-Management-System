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
      setTasks(data);
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
      setTasks([newTask, ...tasks]);
      setTitle("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Task was not added. Please check the Django API and CORS settings.");
    } finally {
      setIsAdding(false);
    }
  };

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

        {/* Task list removed — you can add your new component here later */}
      </div>
    </div>
  );
}

export default App;
