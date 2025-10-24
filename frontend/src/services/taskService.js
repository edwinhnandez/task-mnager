/**
 * Task Service
 * Handles all API interactions for tasks
 */

const getApiBaseUrl = () => {
  return (window.API_CONFIG && window.API_CONFIG.BASE_URL) || 'http://localhost:3000';
};

/**
 * Fetch all tasks from the API
 * @returns {Promise<Array>} Array of tasks
 * @throws {Error} If the request fails
 */
export const fetchTasks = async () => {
  const response = await fetch(`${getApiBaseUrl()}/tasks`);
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch tasks');
  }
  
  return result.data;
};

/**
 * Create a new task
 * @param {string} title - The task title
 * @returns {Promise<Object>} The created task
 * @throws {Error} If the request fails
 */
export const createTask = async (title) => {
  const response = await fetch(`${getApiBaseUrl()}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title })
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to create task');
  }
  
  return result.data;
};

/**
 * Mark a task as completed
 * @param {string} taskId - The task ID
 * @returns {Promise<Object>} The updated task
 * @throws {Error} If the request fails
 */
export const completeTask = async (taskId) => {
  const response = await fetch(`${getApiBaseUrl()}/tasks/${taskId}/complete`, {
    method: 'PATCH'
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to complete task');
  }
  
  return result.data;
};

/**
 * Delete a task
 * @param {string} taskId - The task ID
 * @returns {Promise<void>}
 * @throws {Error} If the request fails
 */
export const deleteTask = async (taskId) => {
  const response = await fetch(`${getApiBaseUrl()}/tasks/${taskId}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to delete task');
  }
  
  return result;
};

