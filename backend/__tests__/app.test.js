const request = require('supertest');
const { app, resetTasks, getTasks, setTasks } = require('../src/app');

describe('Task Manager API', () => {
  // Reset tasks before each test to ensure test isolation
  beforeEach(() => {
    resetTasks();
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Server is healthy'
      });
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks with success status', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return tasks with correct structure', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(200);

      const task = response.body.data[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('status');
    });

    it('should return empty array when no tasks exist', async () => {
      setTasks([]);

      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.body.data).toEqual([]);
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task with valid data', async () => {
      const newTask = {
        title: 'New Test Task'
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('New Test Task');
      expect(response.body.data.status).toBe('pending');
    });

    it('should trim whitespace from task title', async () => {
      const newTask = {
        title: '  Task with spaces  '
      };

      const response = await request(app)
        .post('/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body.data.title).toBe('Task with spaces');
    });

    it('should generate unique IDs for each task', async () => {
      const task1 = await request(app)
        .post('/tasks')
        .send({ title: 'Task 1' })
        .expect(201);

      const task2 = await request(app)
        .post('/tasks')
        .send({ title: 'Task 2' })
        .expect(201);

      expect(task1.body.data.id).not.toBe(task2.body.data.id);
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title is required');
    });

    it('should return 400 when title is empty string', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title is required');
    });

    it('should return 400 when title is only whitespace', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: '   ' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title is required');
    });

    it('should add task to the tasks list', async () => {
      const initialLength = getTasks().length;

      await request(app)
        .post('/tasks')
        .send({ title: 'New Task' })
        .expect(201);

      expect(getTasks()).toHaveLength(initialLength + 1);
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    it('should mark a task as completed', async () => {
      const tasks = getTasks();
      const taskId = tasks[0].id;

      const response = await request(app)
        .patch(`/tasks/${taskId}/complete`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.id).toBe(taskId);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/tasks/non-existent-id/complete')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should update task status in the tasks list', async () => {
      const tasks = getTasks();
      const taskId = tasks[0].id;
      const initialStatus = tasks[0].status;

      await request(app)
        .patch(`/tasks/${taskId}/complete`)
        .expect(200);

      const updatedTasks = getTasks();
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      
      expect(updatedTask.status).toBe('completed');
      expect(updatedTask.status).not.toBe(initialStatus);
    });

    it('should not affect other tasks', async () => {
      const tasks = getTasks();
      const taskId = tasks[0].id;
      const otherTaskId = tasks[1].id;

      await request(app)
        .patch(`/tasks/${taskId}/complete`)
        .expect(200);

      const updatedTasks = getTasks();
      const otherTask = updatedTasks.find(t => t.id === otherTaskId);
      
      expect(otherTask.status).toBe('completed'); // This was already completed
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task by id', async () => {
      const tasks = getTasks();
      const taskId = tasks[0].id;
      const initialLength = tasks.length;

      const response = await request(app)
        .delete(`/tasks/${taskId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');
      expect(getTasks()).toHaveLength(initialLength - 1);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/tasks/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    it('should remove task from the tasks list', async () => {
      const tasks = getTasks();
      const taskId = tasks[0].id;

      await request(app)
        .delete(`/tasks/${taskId}`)
        .expect(200);

      const remainingTasks = getTasks();
      const deletedTask = remainingTasks.find(t => t.id === taskId);
      
      expect(deletedTask).toBeUndefined();
    });

    it('should not affect other tasks when deleting', async () => {
      const tasks = getTasks();
      const taskToDelete = tasks[0].id;
      const taskToKeep = tasks[1];

      await request(app)
        .delete(`/tasks/${taskToDelete}`)
        .expect(200);

      const remainingTasks = getTasks();
      const keptTask = remainingTasks.find(t => t.id === taskToKeep.id);
      
      expect(keptTask).toEqual(taskToKeep);
    });

    it('should handle multiple deletions', async () => {
      const tasks = getTasks();
      const firstTaskId = tasks[0].id;
      const secondTaskId = tasks[1].id;

      await request(app)
        .delete(`/tasks/${firstTaskId}`)
        .expect(200);

      await request(app)
        .delete(`/tasks/${secondTaskId}`)
        .expect(200);

      expect(getTasks()).toHaveLength(0);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete task lifecycle', async () => {
      // Create a task
      const createResponse = await request(app)
        .post('/tasks')
        .send({ title: 'Lifecycle Task' })
        .expect(201);

      const taskId = createResponse.body.data.id;

      // Verify it exists
      const getResponse = await request(app)
        .get('/tasks')
        .expect(200);

      expect(getResponse.body.data.some(t => t.id === taskId)).toBe(true);

      // Complete the task
      await request(app)
        .patch(`/tasks/${taskId}/complete`)
        .expect(200);

      // Verify it's completed
      const getResponse2 = await request(app)
        .get('/tasks')
        .expect(200);

      const completedTask = getResponse2.body.data.find(t => t.id === taskId);
      expect(completedTask.status).toBe('completed');

      // Delete the task
      await request(app)
        .delete(`/tasks/${taskId}`)
        .expect(200);

      // Verify it's deleted
      const getResponse3 = await request(app)
        .get('/tasks')
        .expect(200);

      expect(getResponse3.body.data.some(t => t.id === taskId)).toBe(false);
    });

    it('should handle concurrent task creation', async () => {
      const promises = Array(5).fill(null).map((_, i) => 
        request(app)
          .post('/tasks')
          .send({ title: `Concurrent Task ${i}` })
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      const tasks = getTasks();
      expect(tasks.length).toBeGreaterThanOrEqual(7); // 2 initial + 5 new
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    it('should return 404 for unknown routes', async () => {
      await request(app)
        .get('/unknown-route')
        .expect(404);
    });
  });
});

