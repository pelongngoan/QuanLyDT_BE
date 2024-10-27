import { Request, Response, NextFunction } from "express";
import { Account, ROLE, STATE } from "../database/models/Account";
import { Class } from "../database/models/Class";
// import { ROLE, STATE } from "../database/enum/enum";

async function get_user_info(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;

  try {
    const user = await Account.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

async function set_user_info(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const { firstName, lastName, avatar } = req.body;

  try {
    const user = await Account.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      avatar: avatar || user.avatar,
    });

    res.status(200).json({ message: "User info updated successfully!", user });
  } catch (error) {
    next(error);
  }
}

async function get_user_classes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id;

  try {
    const classes = await Class.findAll({ where: { teacherId: userId } });
    res.status(200).json({ classes });
  } catch (error) {
    next(error);
  }
}

async function set_user_role(req: Request, res: Response, next: NextFunction) {
  const adminRole = req.user?.role;
  const { userId, role } = req.body;

  if (adminRole !== ROLE.ADMIN) {
    res
      .status(403)
      .json({ message: "Access denied. Only admin can set roles." });
    return;
  }

  try {
    const user = await Account.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await user.update({ role });
    res.status(200).json({ message: "User role updated successfully!" });
  } catch (error) {
    next(error);
  }
}
async function deactivate_user(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const adminRole = req.user?.role;
  const { userId } = req.body;

  if (adminRole !== ROLE.ADMIN) {
    res
      .status(403)
      .json({ message: "Access denied. Only admin can deactivate users." });
    return;
  }

  try {
    const user = await Account.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await user.update({ state: STATE.LOCKED });
    res.status(200).json({ message: "User deactivated successfully!" });
  } catch (error) {
    next(error);
  }
}
async function reactivate_user(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const adminRole = req.user?.role;
  const { userId } = req.body;

  if (adminRole !== ROLE.ADMIN) {
    res
      .status(403)
      .json({ message: "Access denied. Only admin can reactivate users." });
    return;
  }

  try {
    const user = await Account.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await user.update({ state: STATE.ACTIVE });
    res.status(200).json({ message: "User reactivated successfully!" });
  } catch (error) {
    next(error);
  }
}
export {
  deactivate_user,
  get_user_classes,
  get_user_info,
  reactivate_user,
  set_user_info,
  set_user_role,
};
