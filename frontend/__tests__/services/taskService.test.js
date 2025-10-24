import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchTasks, createTask, completeTask, deleteTask } from '../../src/services/taskService.js';
import { mockFetchResponse } from '../../test-setup.js';

describe('TaskService', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  describe('fetchTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'pending' },
        { id: '2', title: 'Task 2', status: 'completed' }
      ];

      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: true,
        data: mockTasks
      }));

      const result = await fetchTasks();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/tasks');
      expect(result).toEqual(mockTasks);
    });

    it('should throw error when fetch fails', async () => {
      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: false,
        message: 'Server error'
      }));

      await expect(fetchTasks()).rejects.toThrow('Server error');
    });

    it('should throw default error message when no message provided', async () => {
      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: false
      }));

      await expect(fetchTasks()).rejects.toThrow('Failed to fetch tasks');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchTasks()).rejects.toThrow('Network error');
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const newTask = { id: '3', title: 'New Task', status: 'pending' };

      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: true,
        data: newTask
      }));

      const result = await createTask('New Task');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/tasks',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'New Task' })
        })
      );
      expect(result).toEqual(newTask);
    });

    it('should throw error when creation fails', async () => {
      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: false,
        message: 'Title is required'
      }));

      await expect(createTask('')).rejects.toThrow('Title is required');
    });

    it('should throw default error message when no message provided', async () => {
      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: false
      }));

      await expect(createTask('Test')).rejects.toThrow('Failed to create task');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(createTask('Test')).rejects.toThrow('Network error');
    });
  });

  describe('completeTask', () => {
    it('should mark task as completed successfully', async () => {
      const completedTask = { id: '1', title: 'Task 1', status: 'completed' };

      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: true,
        data: completedTask
      }));

      const result = await completeTask('1');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/tasks/1/complete',
        expect.objectContaining({
          method: 'PATCH'
        })
      );
      expect(result).toEqual(completedTask);
    });

    it('should throw error when task not found', async () => {
      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: false,
        message: 'Task not found'
      }));

      await expect(completeTask('999')).rejects.toThrow('Task not found');
    });

    it('should throw default error message when no message provided', async () => {
      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: false
      }));

      await expect(completeTask('1')).rejects.toThrow('Failed to complete task');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(completeTask('1')).rejects.toThrow('Network error');
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: true,
        message: 'Task deleted successfully'
      }));

      const result = await deleteTask('1');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/tasks/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result.success).toBe(true);
    });

    it('should throw error when deletion fails', async () => {
      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: false,
        message: 'Task not found'
      }));

      await expect(deleteTask('999')).rejects.toThrow('Task not found');
    });

    it('should throw default error message when no message provided', async () => {
      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: false
      }));

      await expect(deleteTask('1')).rejects.toThrow('Failed to delete task');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(deleteTask('1')).rejects.toThrow('Network error');
    });
  });

  describe('API Base URL', () => {
    it('should use API_CONFIG.BASE_URL when available', async () => {
      const originalConfig = window.API_CONFIG;
      window.API_CONFIG = { BASE_URL: 'http://custom-api.com' };

      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: true,
        data: []
      }));

      await fetchTasks();

      expect(fetch).toHaveBeenCalledWith('http://custom-api.com/tasks');

      // Restore
      window.API_CONFIG = originalConfig;
    });

    it('should fallback to localhost when API_CONFIG is not available', async () => {
      const originalConfig = window.API_CONFIG;
      window.API_CONFIG = null;

      fetch.mockResolvedValueOnce(mockFetchResponse({
        success: true,
        data: []
      }));

      await fetchTasks();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/tasks');

      // Restore
      window.API_CONFIG = originalConfig;
    });
  });
});

