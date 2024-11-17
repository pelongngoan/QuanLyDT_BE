import { Request, Response, NextFunction } from "express";
import { Assignment } from "../database/models/Assignment";
import { Submission } from "../database/models/Submission";
import { ROLE } from "../database/enum/enum";
import { Grade } from "../database/models/Grade";
import { v4 as uuidv4 } from "uuid";

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
  const { assignmentId } = req.params;
  const { title, description, dueDate } = req.body;
  const userRole = req.user?.role;

  if (userRole !== ROLE.TEACHER) {
    res
      .status(403)
      .json({ message: "Access denied. Only teachers can edit assignments." });
    return;
  }

  try {
    const assignment = await Assignment.findOne({
      where: { id: assignmentId },
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
  const { assignmentId } = req.params;
  const userRole = req.user?.role;

  if (userRole !== ROLE.TEACHER) {
    res.status(403).json({
      message: "Access denied. Only teachers can delete assignments.",
    });
    return;
  }

  try {
    const assignment = await Assignment.findOne({
      where: { id: assignmentId },
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
  const { assignmentId } = req.params;
  const { fileUrl } = req.body;
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
  const { submissionId } = req.params;
  const { grade, comments } = req.body;
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

    const [gradeEntry, created] = await Grade.findOrCreate({
      where: {
        assignmentId: submission.assignmentId,
        studentId: submission.studentId,
      },
      defaults: {
        id: uuidv4(),
        grade,
        assignmentId: submission.assignmentId,
        studentId: submission.studentId,
        comments,
      },
    });

    if (!created) {
      gradeEntry.grade = grade;
      gradeEntry.comments = comments;
      await gradeEntry.save();
    }

    res.status(200).json({
      message: created
        ? "Assignment graded successfully!"
        : "Grade updated successfully!",
      grade: gradeEntry,
    });
  } catch (error) {
    next(error);
  }
}

async function get_assignment_info(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { assignmentId } = req.params;

  try {
    const assignment = await Assignment.findOne({
      where: { id: assignmentId },
    });

    if (!assignment) {
      res.status(404).json({ message: "Assignment not found." });
      return;
    }

    res
      .status(200)
      .json({ message: "Assignment retrieved successfully!", assignment });
  } catch (error) {
    next(error);
  }
}

async function get_assignment_list(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { classId } = req.query;

  try {
    const assignments = await Assignment.findAll({
      where: { classId },
    });

    if (assignments.length === 0) {
      res.status(404).json({ message: "No assignments found for this class." });
      return;
    }

    res
      .status(200)
      .json({ message: "Assignments retrieved successfully!", assignments });
  } catch (error) {
    next(error);
  }
}
export {
  submit_assignment,
  create_assignment,
  delete_assignment,
  edit_assignment,
  grade_assignment,
  get_assignment_info,
  get_assignment_list,
};
