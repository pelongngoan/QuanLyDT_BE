import { Request, Response } from "express";
import { Session } from "../database/models/Session";
import { Class } from "../database/models/Class";

// Record attendance
async function createSession(req: Request, res: Response) {
  const { classId, date, topic } = req.body;

  if (!classId || !date || !topic) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    const classExist = await Class.findOne({
      where: { id: classId },
    });
    if (!classExist) {
      res.status(400).json({ message: "Không tồn tại lớp học" });
      return;
    }
    const session = await Session.create({
      classId: classId,
      date: date,
      topic: topic,
    });

    res.status(201).json({
      message: "Session create successfully!",
      session: session,
    });
  } catch (error) {
    console.error("Error recording session: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function getSession(req: Request, res: Response) {
  const { sessionId } = req.params;

  try {
    const session = await Session.findOne({
      where: { sessionId },
    });

    res.status(201).json({
      session: session,
    });
  } catch (error) {
    console.error("Error recording session: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
async function getAllSessionByClassId(req: Request, res: Response) {
  const { classId } = req.params;
  try {
    const classExist = await Class.findOne({
      where: { id: classId },
    });
    if (!classExist) {
      res.status(400).json({ message: "Không tồn tại lớp học" });
      return;
    }
    const sessionList = await Session.findAll({
      where: { classId },
    });
    res.status(201).json({
      sessionList: sessionList,
    });
  } catch (error) {
    console.error("Error recording session: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
export { createSession, getAllSessionByClassId, getSession };
