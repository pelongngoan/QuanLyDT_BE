import { Request, Response } from "express";
import { Class } from "../database/models/Class";
import jwt from "jsonwebtoken";
import { ROLE } from "../database/enum/enum";
import { Teacher } from "../database/models/Teacher"; // Import Teacher model

async function create_class(req: Request, res: Response) {
  const { token, name, description, max_students, start_date, end_date } =
    req.body;

  if (!token || !name || !max_students || !start_date || !end_date) {
    res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
    if (decoded.role !== ROLE.TEACHER) {
      res
        .status(403)
        .json({ message: "Access denied. Only lecturers can create classes." });
    }
    console.log(decoded);

    // Find the teacher by the accountId
    const teacher = await Teacher.findOne({
      where: { accountId: decoded.id },
    });
    if (!teacher) {
      throw new Error("Teacher not found with the given accountId");
    }

    // Create the new class with the correct teacherId
    const newClass = await Class.create({
      teacherId: teacher.id, // Use teacher.id here
      name,
      description,
      maxStudents: max_students,
      startDate: start_date,
      endDate: end_date,
    });

    res
      .status(201)
      .json({ message: "Class created successfully!", class: newClass });
  } catch (error) {
    console.error("Error creating class: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export { create_class };
