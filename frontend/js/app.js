// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global state
let currentUser = null;
let authToken = localStorage.getItem('authToken');
let currentFilter = 'all';

// DOM Elements
const elements = {
    // Navigation
    navButtons: document.getElementById('nav-buttons'),
    userMenu: document.getElementById('user-menu'),
    userName: document.getElementById('user-name'),
    loginBtn: document.getElementById('login-btn'),
    registerBtn: document.getElementById('register-btn'),
    logoutBtn: document.getElementById('logout-btn'),

    // Auth Forms
    authForms: document.getElementById('auth-forms'),
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    forgotPasswordForm: document.getElementById('forgot-password-form'),
    resetPasswordForm: document.getElementById('reset-password-form'),
    loginFormElement: document.getElementById('login-form-element'),
    registerFormElement: document.getElementById('register-form-element'),
    forgotPasswordFormElement: document.getElementById('forgot-password-form-element'),
    resetPasswordFormElement: document.getElementById('reset-password-form-element'),

    // Dashboard
    dashboard: document.getElementById('dashboard'),
    addTaskForm: document.getElementById('add-task-form'),
    tasksContainer: document.getElementById('tasks-container'),
    
    // Stats
    totalTasks: document.getElementById('total-tasks'),
    pendingTasks: document.getElementById('pending-tasks'),
    completedTasks: document.getElementById('completed-tasks'),
    cancelledTasks: document.getElementById('cancelled-tasks'),

    // Filters
    filterAll: document.getElementById('filter-all'),
    filterPending: document.getElementById('filter-pending'),
    filterCompleted: document.getElementById('filter-completed'),
    filterCancelled: document.getElementById('filter-cancelled'),

    // Loading
    loading: document.getElementById('loading'),
    toastContainer: document.getElementById('toast-container'),

    // Profile Modal
    profileBtn: document.getElementById('profile-btn'),
    profileModal: document.getElementById('profile-modal'),
    profileForm: document.getElementById('profile-form'),
    closeProfile: document.getElementById('close-profile'),

    // Edit Task Modal
    editTaskModal: document.getElementById('edit-task-modal'),
    editTaskForm: document.getElementById('edit-task-form'),
    closeEditTask: document.getElementById('close-edit-task')
};

// Utility Functions
const utils = {
    showLoading() {
        elements.loading.classList.remove('hidden');
    },

    hideLoading() {
        elements.loading.classList.add('hidden');
    },

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `mb-4 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        toast.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        elements.toastContainer.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.remove('translate-x-full'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getStatusColor(status) {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    getStatusIcon(status) {
        switch (status) {
            case 'pending': return 'fas fa-clock';
            case 'completed': return 'fas fa-check';
            case 'cancelled': return 'fas fa-times';
            default: return 'fas fa-circle';
        }
    }
};

// Auth Management
const auth = {
    setToken(token) {
        authToken = token;
        localStorage.setItem('authToken', token);
    },

    clearToken() {
        authToken = null;
        localStorage.removeItem('authToken');
    },

    isAuthenticated() {
        return !!authToken;
    },

    async checkAuth() {
        if (!this.isAuthenticated()) {
            return false;
        }

        try {
            const response = await api.getProfileDetails();
            currentUser = response.Data;
            return true;
        } catch (error) {
            this.clearToken();
            return false;
        }
    },

    async login(email, password) {
        utils.showLoading();
        try {
            const response = await api.login({ email, password });
            this.setToken(response.Token);
            await this.checkAuth();
            utils.showToast('Login successful!', 'success');
            this.showDashboard();
        } catch (error) {
            utils.showToast(error.message, 'error');
        } finally {
            utils.hideLoading();
        }
    },

    async register(userData) {
        utils.showLoading();
        try {
            await api.register(userData);
            utils.showToast('Registration successful! Please login.', 'success');
            this.showLoginForm();
        } catch (error) {
            utils.showToast(error.message, 'error');
        } finally {
            utils.hideLoading();
        }
    },

    async forgotPassword(email) {
        utils.showLoading();
        try {
            await api.emailVerify(email);
            utils.showToast('Reset code sent to your email!', 'success');
            this.showResetPasswordForm(email);
        } catch (error) {
            utils.showToast(error.message, 'error');
        } finally {
            utils.hideLoading();
        }
    },

    async resetPassword(email, code, newPassword) {
        utils.showLoading();
        try {
            await api.resetPassword({ email, code, password: newPassword });
            utils.showToast('Password reset successful! Please login.', 'success');
            this.showLoginForm();
        } catch (error) {
            utils.showToast(error.message, 'error');
        } finally {
            utils.hideLoading();
        }
    },

    logout() {
        this.clearToken();
        currentUser = null;
        this.showAuthForms();
        utils.showToast('Logged out successfully', 'success');
    },

    showAuthForms() {
        elements.dashboard.classList.add('hidden');
        elements.authForms.classList.remove('hidden');
        elements.navButtons.classList.remove('hidden');
        elements.userMenu.classList.add('hidden');
        this.showLoginForm();
    },

    showDashboard() {
        elements.authForms.classList.add('hidden');
        elements.dashboard.classList.remove('hidden');
        elements.navButtons.classList.add('hidden');
        elements.userMenu.classList.remove('hidden');
        elements.userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        tasks.loadTasks();
        tasks.loadTaskCount();
    },

    showLoginForm() {
        elements.registerForm.classList.add('hidden');
        elements.forgotPasswordForm.classList.add('hidden');
        elements.resetPasswordForm.classList.add('hidden');
        elements.loginForm.classList.remove('hidden');
    },

    showRegisterForm() {
        elements.loginForm.classList.add('hidden');
        elements.forgotPasswordForm.classList.add('hidden');
        elements.resetPasswordForm.classList.add('hidden');
        elements.registerForm.classList.remove('hidden');
    },

    showForgotPasswordForm() {
        elements.loginForm.classList.add('hidden');
        elements.registerForm.classList.add('hidden');
        elements.resetPasswordForm.classList.add('hidden');
        elements.forgotPasswordForm.classList.remove('hidden');
    },

    showResetPasswordForm(email) {
        elements.loginForm.classList.add('hidden');
        elements.registerForm.classList.add('hidden');
        elements.forgotPasswordForm.classList.add('hidden');
        elements.resetPasswordForm.classList.remove('hidden');
        document.getElementById('reset-password-form-element').dataset.email = email;
    },

    showProfileModal() {
        // Populate form with current user data
        document.getElementById('profile-firstname').value = currentUser.firstName;
        document.getElementById('profile-lastname').value = currentUser.lastName;
        document.getElementById('profile-email').value = currentUser.email;
        document.getElementById('profile-mobile').value = currentUser.mobile;
        elements.profileModal.classList.remove('hidden');
    },

    hideProfileModal() {
        elements.profileModal.classList.add('hidden');
    },

    async updateProfile(profileData) {
        utils.showLoading();
        try {
            const response = await api.updateProfile(profileData);
            currentUser = response.Data;
            elements.userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            utils.showToast('Profile updated successfully!', 'success');
            this.hideProfileModal();
        } catch (error) {
            utils.showToast(error.message, 'error');
        } finally {
            utils.hideLoading();
        }
    }
};
// API Functions
const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.Message || 'Something went wrong');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    },

    // Auth APIs
    async register(userData) {
        return this.request('/Registration', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async login(credentials) {
        return this.request('/Login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    async emailVerify(email) {
        return this.request(`/EmailVerify/${email}`, {
            method: 'GET'
        });
    },

    async codeVerify(email, code) {
        return this.request(`/CodeVerify/${email}/${code}`, {
            method: 'GET'
        });
    },

    async resetPassword(resetData) {
        return this.request('/ResetPassword', {
            method: 'POST',
            body: JSON.stringify(resetData)
        });
    },

    async getProfileDetails() {
        return this.request('/ProfileDetails', {
            method: 'GET'
        });
    },

    async updateProfile(profileData) {
        return this.request('/ProfileUpdate', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },

    // Task APIs
    async createTask(taskData) {
        return this.request('/CreateTask', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    },

    async updateTaskStatus(taskId, status) {
        return this.request(`/UpdateTaskStatus/${taskId}/${status}`, {
            method: 'PATCH'
        });
    },

    async updateTask(taskId, taskData) {
        return this.request(`/UpdateTask/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    },

    async getTasksByStatus(status) {
        return this.request(`/TaskListByStatus/${status}`, {
            method: 'GET'
        });
    },

    async deleteTask(taskId) {
        return this.request(`/DeleteTask/${taskId}`, {
            method: 'DELETE'
        });
    },

    async getTaskCount() {
        return this.request('/CountTask', {
            method: 'GET'
        });
    }
};

// Task Management
const tasks = {
    async loadTasks() {
        utils.showLoading();
        try {
            let tasksData = [];
            
            if (currentFilter === 'all') {
                const [pending, completed, cancelled] = await Promise.all([
                    api.getTasksByStatus('pending'),
                    api.getTasksByStatus('completed'),
                    api.getTasksByStatus('cancelled')
                ]);
                tasksData = [
                    ...(pending.Data || []),
                    ...(completed.Data || []),
                    ...(cancelled.Data || [])
                ];
            } else {
                const response = await api.getTasksByStatus(currentFilter);
                tasksData = response.Data || [];
            }

            this.renderTasks(tasksData);
        } catch (error) {
            utils.showToast(error.message, 'error');
        } finally {
            utils.hideLoading();
        }
    },

    async loadTaskCount() {
        try {
            const response = await api.getTaskCount();
            const counts = response.Data || [];
            
            let total = 0, pending = 0, completed = 0, cancelled = 0;
            
            counts.forEach(item => {
                total += item.count;
                switch (item._id) {
                    case 'pending': pending = item.count; break;
                    case 'completed': completed = item.count; break;
                    case 'cancelled': cancelled = item.count; break;
                }
            });

            elements.totalTasks.textContent = total;
            elements.pendingTasks.textContent = pending;
            elements.completedTasks.textContent = completed;
            elements.cancelledTasks.textContent = cancelled;
        } catch (error) {
            console.error('Error loading task count:', error);
        }
    },

    renderTasks(tasksData) {
        if (tasksData.length === 0) {
            elements.tasksContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>No tasks found</p>
                </div>
            `;
            return;
        }

        elements.tasksContainer.innerHTML = tasksData.map(task => `
            <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${utils.getStatusColor(task.status)}">
                                <i class="${utils.getStatusIcon(task.status)} mr-1"></i>
                                ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </span>
                            <span class="text-xs text-gray-500 ml-2">
                                ${utils.formatDate(task.createdAt)}
                            </span>
                        </div>
                        <h4 class="font-semibold text-gray-900 mb-1">${task.title}</h4>
                        <p class="text-gray-600 text-sm">${task.description}</p>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                        <button onclick="tasks.showEditTaskModal(${JSON.stringify(task).replace(/"/g, '&quot;')})" 
                            class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" 
                            title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${task.status === 'pending' ? `
                            <button onclick="tasks.updateStatus('${task._id}', 'completed')" 
                                class="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" 
                                title="Mark as completed">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        ${task.status === 'pending' ? `
                            <button onclick="tasks.updateStatus('${task._id}', 'cancelled')" 
                                class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                                title="Mark as cancelled">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                        <button onclick="tasks.deleteTask('${task._id}')" 
                            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                            title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    async createTask(taskData) {
        utils.showLoading();
        try {
            await api.createTask(taskData);
            utils.showToast('Task created successfully!', 'success');
            document.getElementById('add-task-form').reset();
            this.loadTasks();
            this.loadTaskCount();
        } catch (error) {
            utils.showToast(error.message, 'error');
        } finally {
            utils.hideLoading();
        }
    },

    async updateStatus(taskId, status) {
        utils.showLoading();
        try {
            await api.updateTaskStatus(taskId, status);
            utils.showToast(`Task marked as ${status}!`, 'success');
            this.loadTasks();
            this.loadTaskCount();
        } catch (error) {
            utils.showToast(error.message, 'error');
        } finally {
            utils.hideLoading();
        }
    },

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        utils.showLoading();
        try {
            await api.deleteTask(taskId);
            utils.showToast('Task deleted successfully!', 'success');
            this.loadTasks();
            this.loadTaskCount();
        } catch (error) {
            utils.showToast(error.message, 'error');
        } finally {
            utils.hideLoading();
        }
    },

    setFilter(filter) {
        currentFilter = filter;
        
        // Update filter button styles
        [elements.filterAll, elements.filterPending, elements.filterCompleted, elements.filterCancelled].forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });

        const activeButton = {
            'all': elements.filterAll,
            'pending': elements.filterPending,
            'completed': elements.filterCompleted,
            'cancelled': elements.filterCancelled
        }[filter];

        if (activeButton) {
            activeButton.classList.remove('bg-gray-200', 'text-gray-700');
            activeButton.classList.add('bg-primary', 'text-white');
        }

        this.loadTasks();
    },

    showEditTaskModal(task) {
        document.getElementById('edit-task-id').value = task._id;
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-description').value = task.description;
        document.getElementById('edit-task-status').value = task.status;
        elements.editTaskModal.classList.remove('hidden');
    },

    hideEditTaskModal() {
        elements.editTaskModal.classList.add('hidden');
    },

    async editTask(taskId, taskData) {
        utils.showLoading();
        try {
            await api.updateTask(taskId, taskData);
            utils.showToast('Task updated successfully!', 'success');
            this.hideEditTaskModal();
            this.loadTasks();
            this.loadTaskCount();
        } catch (error) {
            utils.showToast(error.message, 'error');
        } finally {
            utils.hideLoading();
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication status on page load
    const isAuthenticated = await auth.checkAuth();
    if (isAuthenticated) {
        auth.showDashboard();
    } else {
        auth.showAuthForms();
    }

    // Navigation events
    elements.loginBtn.addEventListener('click', () => auth.showLoginForm());
    elements.registerBtn.addEventListener('click', () => auth.showRegisterForm());
    elements.logoutBtn.addEventListener('click', () => auth.logout());
    elements.profileBtn.addEventListener('click', () => auth.showProfileModal());

    // Auth form events
    elements.loginFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        await auth.login(email, password);
    });

    elements.registerFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userData = {
            firstName: document.getElementById('register-firstname').value,
            lastName: document.getElementById('register-lastname').value,
            email: document.getElementById('register-email').value,
            mobile: document.getElementById('register-mobile').value,
            password: document.getElementById('register-password').value
        };
        await auth.register(userData);
    });

    elements.forgotPasswordFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        await auth.forgotPassword(email);
    });

    elements.resetPasswordFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.dataset.email;
        const code = document.getElementById('reset-code').value;
        const newPassword = document.getElementById('reset-new-password').value;
        await auth.resetPassword(email, code, newPassword);
    });

    // Form navigation events
    document.getElementById('show-register').addEventListener('click', () => auth.showRegisterForm());
    document.getElementById('show-login').addEventListener('click', () => auth.showLoginForm());
    document.getElementById('show-forgot-password').addEventListener('click', () => auth.showForgotPasswordForm());
    document.getElementById('show-login-from-forgot').addEventListener('click', () => auth.showLoginForm());

    // Task form events
    elements.addTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            status: document.getElementById('task-status').value
        };
        await tasks.createTask(taskData);
    });

    // Filter events
    elements.filterAll.addEventListener('click', () => tasks.setFilter('all'));
    elements.filterPending.addEventListener('click', () => tasks.setFilter('pending'));
    elements.filterCompleted.addEventListener('click', () => tasks.setFilter('completed'));
    elements.filterCancelled.addEventListener('click', () => tasks.setFilter('cancelled'));

    // Profile modal events
    elements.closeProfile.addEventListener('click', () => auth.hideProfileModal());
    elements.profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const profileData = {
            firstName: document.getElementById('profile-firstname').value,
            lastName: document.getElementById('profile-lastname').value,
            mobile: document.getElementById('profile-mobile').value
        };
        await auth.updateProfile(profileData);
    });

    // Edit task modal events
    elements.closeEditTask.addEventListener('click', () => tasks.hideEditTaskModal());
    elements.editTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskId = document.getElementById('edit-task-id').value;
        const taskData = {
            title: document.getElementById('edit-task-title').value,
            description: document.getElementById('edit-task-description').value,
            status: document.getElementById('edit-task-status').value
        };
        await tasks.editTask(taskId, taskData);
    });

    // Close modals when clicking outside
    elements.profileModal.addEventListener('click', (e) => {
        if (e.target === elements.profileModal) {
            auth.hideProfileModal();
        }
    });

    elements.editTaskModal.addEventListener('click', (e) => {
        if (e.target === elements.editTaskModal) {
            tasks.hideEditTaskModal();
        }
    });
});