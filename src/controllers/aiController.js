const genAI = require('../config/gemini');
const asyncHandler = require('../middleware/asyncHandler');
const { ApiError } = require('../middleware/errorHandler');

// @route  POST /api/ai/generate-tasks  (protected)
// Takes a project title/description and returns 3-5 AI-suggested tasks.
// Does NOT save anything to the database - just returns suggestions the
// user can review and create manually via POST /api/tasks.
const generateTasks = asyncHandler(async (req, res) => {
  const { projectTitle, projectDescription } = req.body;

  if (!projectTitle) {
    throw new ApiError(400, 'projectTitle is required');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

  const prompt = `You are a project management assistant. Given a software project's title and description, suggest 4-5 concrete, actionable development tasks to get started.

Project title: ${projectTitle}
Project description: ${projectDescription || 'No description provided'}

Respond ONLY with a valid JSON array, no extra text, no markdown formatting. Each item must have exactly this shape:
{ "title": "short task title", "priority": "low" | "medium" | "high" }

Example response format:
[{"title":"Set up project repository","priority":"high"}]`;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  // Gemini sometimes wraps JSON in ```json ... ``` fences - strip those if present
  const cleaned = rawText.replace(/```json|```/g, '').trim();

  let suggestedTasks;
  try {
    suggestedTasks = JSON.parse(cleaned);
  } catch (err) {
    throw new ApiError(502, 'AI response could not be parsed. Please try again.');
  }

  res.status(200).json({
    success: true,
    data: suggestedTasks,
  });
});

module.exports = { generateTasks };
