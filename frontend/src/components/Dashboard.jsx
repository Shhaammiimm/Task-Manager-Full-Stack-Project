import { useState, useEffect, useMemo } from "react";
import { useToast } from "../context/ToastContext";
import * as api from "../api/client";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";
import EditTaskModal from "./EditTaskModal";

export default function Dashboard() {
  const { show } = useToast();
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, completed: 0, cancelled: 0 });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt"); // createdAt | title | status | priority | dueDate
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      if (filter === "all") {
        const [p, c, x] = await Promise.all([
          api.getTasksByStatus("pending"),
          api.getTasksByStatus("completed"),
          api.getTasksByStatus("cancelled"),
        ]);
        setTasks([...(p.Data || []), ...(c.Data || []), ...(x.Data || [])]);
      } else {
        const res = await api.getTasksByStatus(filter);
        setTasks(res.Data || []);
      }
    } catch (err) {
      show(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadCounts = async () => {
    try {
      const res = await api.getTaskCount();
      const data = res.Data || [];
      const obj = { total: 0, pending: 0, completed: 0, cancelled: 0 };
      data.forEach((item) => {
        obj[item._id] = item.count;
        obj.total += item.count;
      });
      setCounts(obj);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  useEffect(() => {
    loadCounts();
  }, [tasks]);

  const filteredAndSorted = useMemo(() => {
    let list = [...tasks];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === "createdAt") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
      if (sortBy === "priority") {
        const order = { high: 0, medium: 1, low: 2 };
        return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
      }
      if (sortBy === "dueDate") {
        const da = a.dueDate ? new Date(a.dueDate) : new Date(0);
        const db = b.dueDate ? new Date(b.dueDate) : new Date(0);
        return da - db;
      }
      return 0;
    });
    return list;
  }, [tasks, search, sortBy]);

  const handleCreate = async (body) => {
    try {
      await api.createTask(body);
      show("Task created!", "success");
      setShowAdd(false);
      loadTasks();
      loadCounts();
    } catch (err) {
      show(err.message, "error");
    }
  };

  const handleUpdate = async (id, body) => {
    try {
      await api.updateTask(id, body);
      show("Task updated!", "success");
      setEditingTask(null);
      loadTasks();
      loadCounts();
    } catch (err) {
      show(err.message, "error");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateTaskStatus(id, status);
      show(`Task marked as ${status}!`, "success");
      loadTasks();
      loadCounts();
    } catch (err) {
      show(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.deleteTask(id);
      show("Task deleted!", "success");
      loadTasks();
      loadCounts();
    } catch (err) {
      show(err.message, "error");
    }
  };

  const stats = [
    { label: "Total", value: counts.total, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", icon: "📋" },
    { label: "Pending", value: counts.pending, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", icon: "⏳" },
    { label: "Completed", value: counts.completed, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", icon: "✅" },
    { label: "Cancelled", value: counts.cancelled, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", icon: "❌" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4 animate-fade-in`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar: search, sort, filter, add */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="createdAt">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="status">Sort by Status</option>
          <option value="priority">Sort by Priority</option>
          <option value="dueDate">Sort by Due Date</option>
        </select>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-medium transition-colors"
        >
          + Add Task
        </button>
      </div>

      {/* Task list */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Tasks</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 skeleton" />
            ))}
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p>No tasks found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSorted.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                style={{ animationDelay: `${i * 0.03}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} onSubmit={handleCreate} />}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(body) => handleUpdate(editingTask._id, body)}
        />
      )}
    </div>
  );
}
