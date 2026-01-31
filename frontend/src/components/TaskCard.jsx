export default function TaskCard({ task, onEdit, onStatusChange, onDelete, style = {} }) {
  const priority = task.priority || "medium";
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const created = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  const statusClass = statusColors[task.status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

  return (
    <div
      className={`animate-fade-in border-l-4 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow priority-${priority}`}
      style={style}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
              {task.status?.charAt(0).toUpperCase() + (task.status?.slice(1) || "")}
            </span>
            {task.priority && (
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{task.priority}</span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">{created}</span>
            {dueDate && (
              <span className="text-xs text-orange-600 dark:text-orange-400">Due: {dueDate}</span>
            )}
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{task.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit()}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          {task.status === "pending" && (
            <>
              <button
                onClick={() => onStatusChange(task._id, "completed")}
                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                title="Complete"
              >
                ✅
              </button>
              <button
                onClick={() => onStatusChange(task._id, "cancelled")}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Cancel"
              >
                ❌
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
