const { createApp } = Vue;

// Get API URL from config (supports both local and Docker environments)
const API_BASE_URL = window.API_CONFIG ? window.API_CONFIG.BASE_URL : 'http://localhost:3000';

createApp({
    data() {
        return {
            tasks: [],
            newTaskTitle: '',
            isLoading: false,
            error: null
        };
    },
    computed: {
        completedTasksCount() {
            return this.tasks.filter(task => task.status === 'completed').length;
        }
    },
    async mounted() {
        await this.fetchTasks();
    },
    methods: {
        async fetchTasks() {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await fetch(`${API_BASE_URL}/tasks`);
                const result = await response.json();
                
                if (result.success) {
                    this.tasks = result.data;
                } else {
                    this.error = 'Failed to fetch tasks';
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                this.error = 'Failed to connect to server. Make sure the backend is running.';
            } finally {
                this.isLoading = false;
            }
        },

        async addTask() {
            if (!this.newTaskTitle.trim()) return;

            this.isLoading = true;
            this.error = null;
            try {
                const response = await fetch(`${API_BASE_URL}/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: this.newTaskTitle
                    })
                });

                const result = await response.json();

                if (result.success) {
                    this.tasks.push(result.data);
                    this.newTaskTitle = '';
                } else {
                    this.error = result.message || 'Failed to add task';
                }
            } catch (error) {
                console.error('Error adding task:', error);
                this.error = 'Failed to add task. Please try again.';
            } finally {
                this.isLoading = false;
            }
        },

        async toggleTaskStatus(task) {
            const newStatus = task.status;
            console.log('Toggling status to:', newStatus);
            try {
                // if (newStatus === 'completed' || newStatus === 'progress' || newStatus === 'pending') {
                    const response = await fetch(`${API_BASE_URL}/tasks/${task.id}/${newStatus}`, {
                        method: 'PATCH'
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        task.status = newStatus;
                    }
                // }
            } catch (error) {
                console.error('Error updating task:', error);
                this.error = 'Failed to update task status';
            }
        },
        async editTask(taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (!task) return;
            task.isEditing = true;
        },

        async cancelTaskEdit(task) {
            task.isEditing = false;
        },

        async saveTaskEdit(task) {
            const newTitle = task.editTitle;
        
            const response = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: newTitle
                })
            });

            const result = await response.json();

            if (result.success) {
                task.title = newTitle;
                task.isEditing = false;
            } else {
                this.error = result.message || 'Failed to edit task';
            }            
        },

        async deleteTask(taskId) {
            if (!confirm('Are you sure you want to delete this task?')) return;

            try {
                const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    this.tasks = this.tasks.filter(task => task.id !== taskId);
                } else {
                    this.error = result.message || 'Failed to delete task';
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                this.error = 'Failed to delete task. Please try again.';
            }
        }
    }
}).mount('#app');