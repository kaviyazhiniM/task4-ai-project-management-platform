const Project = require('../models/Project');
const asyncHandler = require('../middleware/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

// @route  POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const { title, description, owner, status } = req.body;
  const project = await Project.create({ title, description, owner, status });
  res.status(201).json({ success: true, data: project });
});

// @route  GET /api/projects
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find()
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: projects.length, data: projects });
});

// @route  GET /api/projects/:id
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('owner', 'name email');
  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json({ success: true, data: project });
});

// @route  PUT /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json({ success: true, data: project });
});

// @route  DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  res.status(200).json({ success: true, message: 'Project deleted' });
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
