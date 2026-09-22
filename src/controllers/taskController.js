const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

// @route  POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, project, assignee, status, priority, dueDate } = req.body;
  const task = await Task.create({
    title,
    description,
    project,
    assignee,
    status,
    priority,
    dueDate,
  });
  res.status(201).json({ success: true, data: task });
});

// @route  GET /api/tasks
// Supports optional query filters: ?project=<id>&status=<status>&assignee=<id>
const getTasks = asyncHandler(async (req, res) => {
  const { project, status, assignee } = req.query;
  const filter = {};
  if (project) filter.project = project;
  if (status) filter.status = status;
  if (assignee) filter.assignee = assignee;

  const tasks = await Task.find(filter)
    .populate('project', 'title')
    .populate('assignee', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

// @route  GET /api/tasks/:id
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('project', 'title')
    .populate('assignee', 'name email');
  if (!task) throw new ApiError(404, 'Task not found');
  res.status(200).json({ success: true, data: task });
});

// @route  PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) throw new ApiError(404, 'Task not found');
  res.status(200).json({ success: true, data: task });
});

// @route  PATCH /api/tasks/:id/status
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!task) throw new ApiError(404, 'Task not found');
  res.status(200).json({ success: true, data: task });
});

// @route  DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');
  res.status(200).json({ success: true, message: 'Task deleted' });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
