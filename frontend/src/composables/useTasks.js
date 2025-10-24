/**
 * Composable for task management
 * Encapsulates task-related logic and state
 */
import { fetchTasks, createTask, completeTask, deleteTask } from '../services/taskService.js';

export const createTaskManager = () => {
  return {
    /**
     * Compute completed tasks count
     * @param {Array} tasks - Array of tasks
     * @returns {number} Count of completed tasks
     */
    getCompletedCount(tasks) {
      return tasks.filter(task => task.status === 'completed').length;
    },

    /**
     * Validate task title
     * @param {string} title - Task title
     * @returns {boolean} Whether title is valid
     */
    isValidTitle(title) {
      return Boolean(title && title.trim().length > 0);
    },

    /**
     * Toggle task status between pending and completed
     * @param {Object} task - Task object
     * @returns {string} New status
     */
    toggleTaskStatus(task) {
      return task.status === 'completed' ? 'pending' : 'completed';
    },

    /**
     * Fetch all tasks
     * @returns {Promise<Array>} Array of tasks
     */
    async fetchTasks() {
      return await fetchTasks();
    },

    /**
     * Create a new task
     * @param {string} title - Task title
     * @returns {Promise<Object>} Created task
     */
    async createTask(title) {
      if (!this.isValidTitle(title)) {
        throw new Error('Title is required');
      }
      return await createTask(title.trim());
    },

    /**
     * Mark task as completed
     * @param {string} taskId - Task ID
     * @returns {Promise<Object>} Updated task
     */
    async completeTask(taskId) {
      return await completeTask(taskId);
    },

    /**
     * Delete a task
     * @param {string} taskId - Task ID
     * @returns {Promise<void>}
     */
    async deleteTask(taskId) {
      return await deleteTask(taskId);
    }
  };
};

