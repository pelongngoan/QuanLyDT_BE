import { Request, Response, NextFunction } from "express";
import { Assignment } from "../database/models/Assignment";
import { ROLE } from "../database/enum/enum";
import { Submission } from "../database/models/Submission";

async function create_assignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { classId, title, description, dueDate } = req.body;
  const userRole = req.user?.role;

  if (userRole !== ROLE.TEACHER) {
    res.status(403).json({
      message: "Access denied. Only teachers can create assignments.",
    });
    return;
  }

  try {
    const assignment = await Assignment.create({
      classId,
      title,
      description,
      dueDate,
      createdBy: req.user?.id,
    });

    res
      .status(201)
      .json({ message: "Assignment created successfully!", assignment });
  } catch (error) {
    next(error);
  }
}
async function edit_assignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { assignmentId, title, description, dueDate } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (userRole !== ROLE.TEACHER) {
    res
      .status(403)
      .json({ message: "Access denied. Only teachers can edit assignments." });
    return;
  }

  try {
    const assignment = await Assignment.findOne({
      where: { id: assignmentId, createdBy: userId },
    });
    if (!assignment) {
      res.status(404).json({
        message:
          "Assignment not found or you do not have permission to edit this assignment.",
      });
      return;
    }

    await assignment.update({ title, description, dueDate });
    res
      .status(200)
      .json({ message: "Assignment updated successfully!", assignment });
  } catch (error) {
    next(error);
  }
}
async function delete_assignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { assignmentId } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (userRole !== ROLE.TEACHER) {
    res.status(403).json({
      message: "Access denied. Only teachers can delete assignments.",
    });
    return;
  }

  try {
    const assignment = await Assignment.findOne({
      where: { id: assignmentId, createdBy: userId },
    });
    if (!assignment) {
      res.status(404).json({
        message:
          "Assignment not found or you do not have permission to delete this assignment.",
      });
      return;
    }

    await assignment.destroy();
    res.status(200).json({ message: "Assignment deleted successfully!" });
  } catch (error) {
    next(error);
  }
}

async function submit_assignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { assignmentId, fileUrl } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (userRole !== ROLE.STUDENT) {
    res.status(403).json({
      message: "Access denied. Only students can submit assignments.",
    });
    return;
  }

  try {
    const submission = await Submission.create({
      assignmentId,
      studentId: userId,
      fileUrl,
      submittedAt: new Date(),
    });

    res
      .status(201)
      .json({ message: "Assignment submitted successfully!", submission });
  } catch (error) {
    next(error);
  }
}
async function grade_assignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { submissionId, grade } = req.body;
  const userRole = req.user?.role;

  if (userRole !== ROLE.TEACHER) {
    res
      .status(403)
      .json({ message: "Access denied. Only teachers can grade assignments." });
    return;
  }

  try {
    const submission = await Submission.findOne({
      where: { id: submissionId },
    });
    if (!submission) {
      res.status(404).json({ message: "Submission not found." });
      return;
    }

    await submission.update({ grade, gradedAt: new Date() });
    res
      .status(200)
      .json({ message: "Assignment graded successfully!", submission });
  } catch (error) {
    next(error);
  }
}
