
import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const TaskManager = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get("/api/tasks", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(res.data);
      } catch (error) {
        toast.error("Could not fetch tasks.");
      }
    };

    fetchTasks();
  }, [user.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.warning("Task title is required.");
      return;
    }

    try {
      if (editingTask) {
        const res = await axiosInstance.put(
          `/api/tasks/${editingTask._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setTasks(tasks.map((t) => (t._id === res.data._id ? res.data : t)));
        toast.success("Task updated!");
      } else {
        const res = await axiosInstance.post(
          "/api/tasks",
          { ...formData, completed: false },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setTasks([...tasks, res.data]);
        toast.success("Task added!");
      }

      setFormData({ title: "", description: "", deadline: "" });
      setEditingTask(null);
    } catch (error) {
      toast.error("Failed to save task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success("Task deleted.");
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
    });
  };

  const handleClone = async (task) => {
    try {
      const newTask = {
        title: task.title + " (Copy)",
        description: task.description,
        deadline: task.deadline,
        completed: false,
      };

      const res = await axiosInstance.post("/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setTasks([...tasks, res.data]);
      toast.success("Task cloned.");
    } catch (error) {
      toast.error("Failed to clone task.");
    }
  };

  const toggleDone = async (task) => {
    try {
      const res = await axiosInstance.put(
        `/api/tasks/${task._id}`,
        { ...task, completed: !task.completed },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setTasks(tasks.map((t) => (t._id === res.data._id ? res.data : t)));
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "done") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-6 rounded-lg shadow space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800">
          {editingTask ? "Edit Task" : "Add New Task"}
        </h2>
        <input
          type="text"
          placeholder="Task Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded ${filter === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("done")}
            className={`px-3 py-1 rounded ${filter === "done" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Done
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center text-gray-500 italic py-10 border rounded shadow bg-white">
            You haven’t added any tasks yet.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`flex justify-between items-start p-4 rounded-lg shadow bg-white border ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <div className="w-full">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleDone(task)}
                    className="mr-3"
                  />
                  <h3
                    className={`text-lg font-medium ${
                      task.completed
                        ? "line-through text-gray-600"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </h3>
                </div>
                <p
                  className={`text-sm ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-700"
                  }`}
                >
                  {task.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-4 flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleClone(task)}
                  className="text-sm text-green-600 hover:underline"
                >
                  Clone
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
