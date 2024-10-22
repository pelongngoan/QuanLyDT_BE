import { Request, Response } from "express";
import { Class } from "../database/models/Class";
import { Teacher } from "../database/models/Teacher";

async function create_class(req: Request, res: Response) {
  const { name, description, max_students, start_date, end_date, accountId } =
    req.body;
  if (!name || !max_students || !start_date || !end_date || accountId) {
    res.status(1002).json({ message: "Missing required fields." });
    return;
  }

  try {
    // Find the teacher by the accountId from req.user
    const teacher = await Teacher.findOne({
      where: { accountId: accountId },
    });
    if (!teacher) {
      res.status(9994).json({ message: "Teacher not found." });
      return;
    }

    // Create the new class with the correct teacherId
    const newClass = await Class.create({
      teacherId: teacher.id, // Use teacher.id
      name,
      description,
      maxStudents: max_students,
      startDate: start_date,
      endDate: end_date,
    });

    res
      .status(1000)
      .json({ message: "Class created successfully!", class: newClass });
  } catch (error) {
    console.error("Error creating class: ", error);
    res.status(9999).json({ message: "Internal server error." });
  }
}

async function edit_class(req: Request, res: Response) {
  const {
    classId,
    name,
    description,
    max_students,
    start_date,
    end_date,
    accountId,
  } = req.body;

  if (!classId) {
    res.status(1002).json({ message: "Missing required fields." });
    return;
  }

  try {
    const classToUpdate = await Class.findOne({
      where: { id: classId, accountId },
    });

    if (!classToUpdate) {
      res.status(9994).json({
        message:
          "Class not found or you do not have permission to edit this class.",
      });
      return;
    }

    // Update class fields
    await classToUpdate.update({
      name: name || classToUpdate.name,
      description: description || classToUpdate.description,
      maxStudents: max_students || classToUpdate.maxStudents,
      startDate: start_date || classToUpdate.startDate,
      endDate: end_date || classToUpdate.endDate,
    });

    res
      .status(1000)
      .json({ message: "Class updated successfully!", class: classToUpdate });
  } catch (error) {
    console.error("Error editing class: ", error);
    res.status(9999).json({ message: "Internal server error." });
  }
}

async function delete_class(req: Request, res: Response) {
  const { classId, accountId } = req.body;

  if (!classId) {
    res.status(1002).json({ message: "Missing required fields." });
    return;
  }

  try {
    const classToDelete = await Class.findOne({
      where: { id: classId, teacherId: accountId },
    });

    if (!classToDelete) {
      res.status(9994).json({
        message:
          "Class not found or you do not have permission to delete this class.",
      });
      return;
    }

    await classToDelete.destroy();
    res.status(1000).json({ message: "Class deleted successfully!" });
  } catch (error) {
    console.error("Error deleting class: ", error);
    res.status(9999).json({ message: "Internal server error." });
  }
}

async function get_class_info(req: Request, res: Response) {
  const { classId } = req.body;

  if (!classId) {
    res.status(1002).json({ message: "Missing required fields." });
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

async function get_class_list(req: Request, res: Response) {
  try {
    const classList = await Class.findAll({
      where: { teacherId: req.body.accountId },
    });
    res.status(200).json({ classList });
  } catch (error) {
    console.error("Error fetching class list: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function get_class_schedule(req: Request, res: Response) {
  const { classId } = req.body;

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
  create_class,
  edit_class,
  delete_class,
  get_class_info,
  get_class_list,
  get_class_schedule,
};
