import { Request, Response } from "express";
import { Account, ROLE, STATE } from "../database/models/Account";
// import { ROLE, STATE } from "../database/enum/enum";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Teacher } from "../database/models/Teacher";

async function signup(req: Request, res: Response) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({ message: "All fields are required." });
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Invalid email format." });
    }

    const existingUser = await Account.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = await Account.create({
      email,
      password: hashedPassword,
      role,
      state: STATE.LOCKED,
      id: uuidv4(),
    });
    console.log(role === ROLE.TEACHER);

    // Check if the role is Teacher, then create a corresponding Teacher record
    if (role === ROLE.TEACHER) {
      console.log("first");

      Teacher.create({
        accountId: newAccount.id,
        classList: [], // Initial empty array
        assignmentsCreated: [], // Initial empty array
      });
    }

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
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Invalid email format." });
    }

    const account = await Account.findOne({ where: { email } });

    if (!account) {
      res.status(401).json({ message: "Invalid email or password." });
      throw new Error("Error");
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: account.id, role: account.role },
      process.env.SECRET_KEY!,
      { expiresIn: "1h" }
    );

    let classList = [];
    if (account.role === ROLE.STUDENT) {
      classList = await getStudentClassList(account.id);
    } else if (account.role === ROLE.TEACHER) {
      classList = await getLecturerClassList(account.id);
    }

    res.status(200).json({
      message: "Login successful!",
      id: account.id,
      // accountname: account.username,
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

  // Validate the email and verification code
  if (!email || !verificationCode) {
    res
      .status(400)
      .json({ message: "Email and verification code are required." });
  }

  try {
    // Look up the user by email and verify the code
    const user = await Account.findOne({ where: { email, verificationCode } });

    // If user or verification code doesn't match, return an error
    if (!user) {
      res.status(401).json({ message: "Invalid email or verification code." });
      throw new Error("Error");
    }

    // Update user status to active, if applicable, and return user details
    if (user.state === STATE.LOCKED) {
      console.log("first");

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
    // Validate inputs
    if (!token || !username || !avatar) {
      return res
        .status(400)
        .json({ message: "Token, username, and avatar are required." });
    }

    // Verify and decode the token to get the user ID
    const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
    const userId = decoded.id;

    // Find the user by ID
    const user = await Account.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user info
    // user.username = username;
    user.avatar = avatar;
    await user.save();

    // Respond with the updated user information
    return res.status(200).json({
      message: "Information updated successfully!",
      id: user.id,
      // username: user.username,
      email: user.email,
      // created: user.createdAt,
      avatar: user.avatar,
    });
  } catch (error) {
    if (error === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    console.error("Error updating user information: ", error);
    return res.status(500).json({ message: "Server error." });
  }
}

const getStudentClassList = async (userId: string): Promise<any[]> => {
  // Replace this with your actual implementation
  return [
    { classId: 1, className: "Math 101" },
    { classId: 2, className: "Science 101" },
  ];
};

const getLecturerClassList = async (userId: string): Promise<any[]> => {
  // Replace this with your actual implementation
  return [{ classId: 3, className: "Physics 201" }];
};

const sendVerificationCode = async (
  email: string,
  code: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "long.tl446@gmail.com",
      pass: "sdaf gqnf odps aqab",
    },
  });

  const mailOptions = {
    from: "long.tl446@gmail.com",
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
      res.status(401);
      throw new Error("invalid id or role");
    }
    const account: Account | null = await Account.findOne({
      attributes: { exclude: ["token", "password"] },
      where: { id: id },
    });
    if (!account) {
      res.status(404);
      throw new Error("Id does not exist");
    }
    const { password, ...accountWithoutPassword } = account.dataValues;
    res.status(200).send({
      account: accountWithoutPassword,
    });
  } catch (err: any) {
    var statusCode = res.statusCode == 200 ? null : res.statusCode;
    statusCode = statusCode || 404;
    res.status(statusCode).json({
      message: "Authentication failed",
      error: <Error>err.message,
    });
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
