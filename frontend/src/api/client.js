const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("authToken");
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.Message || "Something went wrong");
  return data;
}

// Auth
export const register = (body) => request("/Registration", { method: "POST", body: JSON.stringify(body) });
export const login = (body) => request("/Login", { method: "POST", body: JSON.stringify(body) });
export const emailVerify = (email) => request(`/EmailVerify/${email}`, { method: "GET" });
export const resetPassword = (body) => request("/ResetPassword", { method: "POST", body: JSON.stringify(body) });
export const getProfile = () => request("/ProfileDetails", { method: "GET" });
export const updateProfile = (body) => request("/ProfileUpdate", { method: "PUT", body: JSON.stringify(body) });

// Tasks
export const createTask = (body) => request("/CreateTask", { method: "POST", body: JSON.stringify(body) });
export const updateTask = (id, body) => request(`/UpdateTask/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const updateTaskStatus = (id, status) =>
  request(`/UpdateTaskStatus/${id}/${status}`, { method: "PATCH" });
export const getTasksByStatus = (status) => request(`/TaskListByStatus/${status}`, { method: "GET" });
export const deleteTask = (id) => request(`/DeleteTask/${id}`, { method: "DELETE" });
export const getTaskCount = () => request("/CountTask", { method: "GET" });
