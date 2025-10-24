import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTaskManager } from '../../src/composables/useTasks.js';
import * as taskService from '../../src/services/taskService.js';

// Mock the task service
vi.mock('../../src/services/taskService.js', () => ({
  fetchTasks: vi.fn(),
  createTask: vi.fn(),
  completeTask: vi.fn(),
  deleteTask: vi.fn()
}));

describe('useTasks Composable', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = createTaskManager();
    vi.clearAllMocks();
  });

  describe('getCompletedCount', () => {
    it('should return 0 for empty array', () => {
      expect(taskManager.getCompletedCount([])).toBe(0);
    });

    it('should count completed tasks correctly', () => {
      const tasks = [
        { id: '1', status: 'pending' },
        { id: '2', status: 'completed' },
        { id: '3', status: 'completed' },
        { id: '4', status: 'pending' }
      ];

      expect(taskManager.getCompletedCount(tasks)).toBe(2);
    });

    it('should return 0 when no tasks are completed', () => {
      const tasks = [
        { id: '1', status: 'pending' },
        { id: '2', status: 'pending' }
      ];

      expect(taskManager.getCompletedCount(tasks)).toBe(0);
    });

    it('should return count when all tasks are completed', () => {
      const tasks = [
        { id: '1', status: 'completed' },
        { id: '2', status: 'completed' }
      ];

      expect(taskManager.getCompletedCount(tasks)).toBe(2);
    });
  });

  describe('isValidTitle', () => {
    it('should return true for valid titles', () => {
      expect(taskManager.isValidTitle('Valid Task')).toBe(true);
      expect(taskManager.isValidTitle('A')).toBe(true);
      expect(taskManager.isValidTitle('   With Spaces   ')).toBe(true);
    });

    it('should return false for invalid titles', () => {
      expect(taskManager.isValidTitle('')).toBe(false);
      expect(taskManager.isValidTitle('   ')).toBe(false);
      expect(taskManager.isValidTitle(null)).toBe(false);
      expect(taskManager.isValidTitle(undefined)).toBe(false);
    });
  });

  describe('toggleTaskStatus', () => {
    it('should toggle from pending to completed', () => {
      const task = { id: '1', status: 'pending' };
      expect(taskManager.toggleTaskStatus(task)).toBe('completed');
    });

    it('should toggle from completed to pending', () => {
      const task = { id: '1', status: 'completed' };
      expect(taskManager.toggleTaskStatus(task)).toBe('pending');
    });
  });

  describe('fetchTasks', () => {
    it('should call taskService.fetchTasks', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'pending' }
      ];

      taskService.fetchTasks.mockResolvedValue(mockTasks);

      const result = await taskManager.fetchTasks();

      expect(taskService.fetchTasks).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTasks);
    });

    it('should propagate errors from taskService', async () => {
      taskService.fetchTasks.mockRejectedValue(new Error('Network error'));

      await expect(taskManager.fetchTasks()).rejects.toThrow('Network error');
    });
  });

  describe('createTask', () => {
    it('should create task with valid title', async () => {
      const newTask = { id: '2', title: 'New Task', status: 'pending' };

      taskService.createTask.mockResolvedValue(newTask);

      const result = await taskManager.createTask('New Task');

      expect(taskService.createTask).toHaveBeenCalledWith('New Task');
      expect(result).toEqual(newTask);
    });

    it('should trim title before creating', async () => {
      const newTask = { id: '2', title: 'Trimmed', status: 'pending' };

      taskService.createTask.mockResolvedValue(newTask);

      await taskManager.createTask('  Trimmed  ');

      expect(taskService.createTask).toHaveBeenCalledWith('Trimmed');
    });

    it('should throw error for invalid title', async () => {
      await expect(taskManager.createTask('')).rejects.toThrow('Title is required');
      await expect(taskManager.createTask('   ')).rejects.toThrow('Title is required');
      await expect(taskManager.createTask(null)).rejects.toThrow('Title is required');

      expect(taskService.createTask).not.toHaveBeenCalled();
    });

    it('should propagate errors from taskService', async () => {
      taskService.createTask.mockRejectedValue(new Error('Server error'));

      await expect(taskManager.createTask('Valid Title')).rejects.toThrow('Server error');
    });
  });

  describe('completeTask', () => {
    it('should call taskService.completeTask with task ID', async () => {
      const completedTask = { id: '1', title: 'Task 1', status: 'completed' };

      taskService.completeTask.mockResolvedValue(completedTask);

      const result = await taskManager.completeTask('1');

      expect(taskService.completeTask).toHaveBeenCalledWith('1');
      expect(result).toEqual(completedTask);
    });

    it('should propagate errors from taskService', async () => {
      taskService.completeTask.mockRejectedValue(new Error('Task not found'));

      await expect(taskManager.completeTask('999')).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('should call taskService.deleteTask with task ID', async () => {
      const deleteResponse = { success: true, message: 'Task deleted' };

      taskService.deleteTask.mockResolvedValue(deleteResponse);

      const result = await taskManager.deleteTask('1');

      expect(taskService.deleteTask).toHaveBeenCalledWith('1');
      expect(result).toEqual(deleteResponse);
    });

    it('should propagate errors from taskService', async () => {
      taskService.deleteTask.mockRejectedValue(new Error('Task not found'));

      await expect(taskManager.deleteTask('999')).rejects.toThrow('Task not found');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete task workflow', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'pending' }
      ];
      const newTask = { id: '2', title: 'New Task', status: 'pending' };
      const completedTask = { id: '2', title: 'New Task', status: 'completed' };

      taskService.fetchTasks.mockResolvedValue(mockTasks);
      taskService.createTask.mockResolvedValue(newTask);
      taskService.completeTask.mockResolvedValue(completedTask);
      taskService.deleteTask.mockResolvedValue({ success: true });

      // Fetch initial tasks
      let tasks = await taskManager.fetchTasks();
      expect(tasks).toHaveLength(1);
      expect(taskManager.getCompletedCount(tasks)).toBe(0);

      // Create new task
      const created = await taskManager.createTask('New Task');
      expect(created.status).toBe('pending');

      // Complete the task
      const completed = await taskManager.completeTask(created.id);
      expect(completed.status).toBe('completed');

      // Delete the task
      await taskManager.deleteTask(completed.id);
      expect(taskService.deleteTask).toHaveBeenCalledWith(completed.id);
    });

    it('should handle validation before API calls', async () => {
      // Invalid title should not reach the API
      await expect(taskManager.createTask('')).rejects.toThrow();
      expect(taskService.createTask).not.toHaveBeenCalled();

      // Valid title should reach the API
      taskService.createTask.mockResolvedValue({ id: '1', title: 'Valid', status: 'pending' });
      await taskManager.createTask('Valid');
      expect(taskService.createTask).toHaveBeenCalledTimes(1);
    });
  });
});

