import { Request, Response } from "express";
import { Account, ROLE, STATE } from "../database/models/Account";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";

async function signup(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Invalid email format." });
      return;
    }

    const existingUser = await Account.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = await Account.create({
      email,
      password: hashedPassword,
      role,
      state: STATE.LOCKED,
      id: uuidv4(),
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: newAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email, password are required." });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Invalid email format." });
      return;
    }

    const account = await Account.findOne({ where: { email } });

    if (!account) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      console.error("Missing SECRET_KEY in environment");
      res.status(500).json({ message: "Internal server error." });
      return;
    }

    const token = jwt.sign({ id: account.id, role: account.role }, secretKey, {
      expiresIn: "1h",
    });

    let classList = [];
    if (account.role === ROLE.STUDENT) {
      classList = await getStudentClassList(account.id);
    } else if (account.role === ROLE.TEACHER) {
      classList = await getLecturerClassList(account.id);
    }

    res.status(200).json({
      message: "Login successful!",
      id: account.id,
      token,
      avatar: account.avatar,
      active: account.state === STATE.ACTIVE,
      role: account.role,
      class_list: classList,
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Server error." });
  }
}

async function logout(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ message: "Token is required." });
    return;
  }
  try {
    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Logout error: ", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function get_verify_code(req: Request, res: Response) {
  const { email } = req.body;
  if (
    !email ||
    !validator.isEmail(email) ||
    !email.endsWith("@sis.hust.edu.vn")
  ) {
    res.status(400).json({ message: "Invalid email. Must be a HUST email." });
    return;
  }

  try {
    const verificationCode = crypto.randomBytes(3).toString("hex");
    await Account.update({ verificationCode }, { where: { email } });
    await sendVerificationCode(email, verificationCode);
    res.status(200).json({ message: "Verification code sent successfully!" });
  } catch (error) {
    console.error("Error generating verification code: ", error);
    res.status(500).json({ message: "Server error." });
  }
}

async function check_verify_code(req: Request, res: Response) {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    res
      .status(400)
      .json({ message: "Email and verification code are required." });
    return;
  }

  try {
    const user = await Account.findOne({ where: { email, verificationCode } });

    if (!user) {
      res.status(401).json({ message: "Invalid email or verification code." });
      return;
    }

    if (user.state === STATE.LOCKED) {
      await Account.update({ state: STATE.ACTIVE }, { where: { email } });
    }

    res.status(200).json({
      message: "Verification successful!",
      id: user.id,
    });
  } catch (error) {
    console.error("Verification error: ", error);
    res.status(500).json({ message: "Server error." });
  }
}

async function changeInfoAfterSignup(req: Request, res: Response) {
  const { token, username, avatar } = req.body;

  try {
    if (!token || !username || !avatar) {
      res
        .status(400)
        .json({ message: "Token, username, and avatar are required." });
      return;
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      console.error("Missing SECRET_KEY in environment");
      res.status(500).json({ message: "Internal server error." });
      return;
    }

    const decoded: any = jwt.verify(token, secretKey);
    const userId = decoded.id;

    const user = await Account.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    user.avatar = avatar;
    await user.save();

    res.status(200).json({
      message: "Information updated successfully!",
      id: user.id,
      email: user.email,
      avatar: user.avatar,
    });
    return;
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid token." });
      return;
    }
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired." });
      return;
    }
    console.error("Error updating user information: ", error);
    res.status(500).json({ message: "Server error." });
    return;
  }
}

const getStudentClassList = async (userId: string): Promise<any[]> => {
  // Replace with actual database call
  return [
    { classId: 1, className: "Math 101" },
    { classId: 2, className: "Science 101" },
  ];
};

const getLecturerClassList = async (userId: string): Promise<any[]> => {
  // Replace with actual database call
  return [{ classId: 3, className: "Physics 201" }];
};

const sendVerificationCode = async (
  email: string,
  code: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

async function auth(req: Request, res: Response) {
  try {
    const id = res.locals.id;
    const role = res.locals.role;
    if (!id || !role) {
      return res.status(401).json({ message: "Invalid id or role" });
    }
    const account: Account | null = await Account.findOne({
      attributes: { exclude: ["token", "password"] },
      where: { id: id },
    });
    if (!account) {
      return res.status(404).json({ message: "Id does not exist" });
    }
    const { password, ...accountWithoutPassword } = account.dataValues;
    res.status(200).json({ account: accountWithoutPassword });
  } catch (error: any) {
    console.error("Authentication error:", error);
    res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
}

export {
  signup,
  login,
  logout,
  get_verify_code,
  check_verify_code,
  changeInfoAfterSignup,
  auth,
};
