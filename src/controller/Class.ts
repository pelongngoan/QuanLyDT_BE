import { Request, Response } from "express";
import { Class } from "../database/models/Class";
import { v4 as uuidv4 } from "uuid";

function validateRole(req: Request, res: Response): boolean {
  const allowedRoles = ["admin", "teacher"];
  if (!allowedRoles.includes(req.user?.role)) {
    res
      .status(403)
      .json({ message: "Access denied. Insufficient permissions." });
    return false;
  }
  return true;
}

async function createClass(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  try {
    const { className, semester, maxStudents, startDate, endDate, teacherId } =
      req.body;

    if (
      !className ||
      !semester ||
      !maxStudents ||
      !startDate ||
      !endDate ||
      !teacherId
    ) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const newClass = await Class.create({
      id: uuidv4(),
      className,
      semester,
      maxStudents,
      startDate,
      endDate,
      teacherId,
    });

    res.status(201).json({
      message: "Class created successfully.",
      class: newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
}

async function editClass(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  const { classId } = req.params;
  const { name, max_students, start_date, end_date } = req.body;

  if (!classId) {
    res.status(400).json({ message: "Class ID is required." });
    return;
  }

  try {
    const classToUpdate = await Class.findOne({
      where: { id: classId },
    });

    if (!classToUpdate) {
      res.status(404).json({
        message:
          "Class not found or you do not have permission to edit this class.",
      });
      return;
    }

    await classToUpdate.update({
      className: name || classToUpdate.className,
      maxStudents: max_students || classToUpdate.maxStudents,
      startDate: start_date || classToUpdate.startDate,
      endDate: end_date || classToUpdate.endDate,
    });

    res
      .status(200)
      .json({ message: "Class updated successfully!", class: classToUpdate });
  } catch (error) {
    console.error("Error editing class: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function deleteClass(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  const { classId } = req.params; // Use params to get the classId from the URL

  if (!classId) {
    res.status(400).json({ message: "Class ID is required." });
    return;
  }

  try {
    const classToDelete = await Class.findOne({
      where: { id: classId },
    });

    if (!classToDelete) {
      res.status(404).json({
        message:
          "Class not found or you do not have permission to delete this class.",
      });
      return;
    }

    await classToDelete.destroy();
    res.status(200).json({ message: "Class deleted successfully!" });
  } catch (error) {
    console.error("Error deleting class: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function getClassInfo(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  const { classId } = req.params; // Use params to get the classId from the URL

  if (!classId) {
    res.status(400).json({ message: "Class ID is required." });
    return;
  }

  try {
    const classInfo = await Class.findOne({ where: { id: classId } });

    if (!classInfo) {
      res.status(404).json({ message: "Class not found." });
      return;
    }

    res.status(200).json({ class: classInfo });
  } catch (error) {
    console.error("Error fetching class info: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function getClassList(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  try {
    const classList = await Class.findAll({
      where: { teacherId: req.user?.id },
    });
    res.status(200).json({ classList });
  } catch (error) {
    console.error("Error fetching class list: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function getClassSchedule(req: Request, res: Response) {
  if (!validateRole(req, res)) return;

  const { classId } = req.params;

  if (!classId) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const classSchedule = await Class.findOne({
      where: { id: classId },
      attributes: ["startDate", "endDate"],
    });

    if (!classSchedule) {
      res.status(404).json({ message: "Class schedule not found." });
      return;
    }

    res.status(200).json({ schedule: classSchedule });
  } catch (error) {
    console.error("Error fetching class schedule: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export {
  createClass,
  editClass,
  deleteClass,
  getClassInfo,
  getClassList,
  getClassSchedule,
};
