import { Request, Response } from "express";
import { Account } from "../database/models/Account";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { decode_refresh, sign_access, sign_refresh } from "../utils/jwt";
import { AccountSign } from "../types";
import { ROLE, STATE } from "../database/enum/enum";
import { Teacher } from "../database/models/Teacher";
import { Student } from "../database/models/Student";

async function signup(req: Request, res: Response) {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    res
      .status(400)
      .json({ message: "Email, password, and role are required." });
    return;
  }
  try {
    if (!validator.isEmail(email) || !email.endsWith("@sis.hust.edu.vn")) {
      res.status(400).json({ message: "Invalid email. Must be a HUST email." });
      return;
    }

    if (!Object.values(ROLE).includes(role)) {
      res.status(400).json({
        message: `Invalid role. Allowed roles are: ${Object.values(ROLE).join(
          ", "
        )}`,
      });
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
      return;
    }
    // Check if user already exists
    const existingUser = await Account.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = await Account.create({
      id: uuidv4(),
      email,
      password: hashedPassword,
      role,
      state: STATE.LOCKED,
    });

    if (role === ROLE.TEACHER) {
      await Teacher.create({
        id: uuidv4(),
        accountId: newAccount.id,
      });
    } else if (role === ROLE.STUDENT) {
      await Student.create({
        id: uuidv4(),
        accountId: newAccount.id,
      });
    }

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newAccount.id,
        email: newAccount.email,
        role: newAccount.role,
        state: newAccount.state,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email, password are required." });
    return;
  }
  try {
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
    const accountInfo: AccountSign = {
      id: account.id,
      role: account.role,
    };

    const accessToken = sign_access(accountInfo);
    const refreshToken = sign_refresh(accountInfo);
    account.set({
      token: refreshToken,
    });

    let classList = [];
    if (account.role === ROLE.STUDENT) {
      classList = await getStudentClassList(account.id);
    } else if (account.role === ROLE.TEACHER) {
      classList = await getLecturerClassList(account.id);
    }
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .header("authorization", accessToken)
      .send({
        message: "Login successfully!",
        account: account,
      });

    // res.status(200).json({
    //   message: "Login successful!",
    //   id: account.id,
    //   avatar: account.avatar,
    //   active: account.state === STATE.ACTIVE,
    //   role: account.role,
    //   class_list: classList,
    // });
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

async function getVerifyCode(req: Request, res: Response) {
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

async function checkVerifyCode(req: Request, res: Response) {
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
  const { token, firstName, lastName, avatar } = req.body;

  if (!token || !firstName || !lastName || !avatar) {
    res
      .status(400)
      .json({ message: "Token, username, and avatar are required." });
    return;
  }
  try {
    const decoded: any = decode_refresh(token);
    const userId = decoded.id;
    const user = await Account.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    user.avatar = avatar;
    user.firstName = firstName;
    user.lastName = lastName;
    user.token = token;
    await user.save();

    res.status(200).json({
      message: "Information updated successfully!",
      id: user.id,
      email: user.email,
      avatar: user.avatar,
    });
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

// async function auth(req: Request, res: Response) {
//   try {
//     const id = res.locals.id;
//     const role = res.locals.role;
//     if (!id || !role) {
//       return res.status(401).json({ message: "Invalid id or role" });
//     }
//     const account: Account | null = await Account.findOne({
//       attributes: { exclude: ["token", "password"] },
//       where: { id: id },
//     });
//     if (!account) {
//       return res.status(404).json({ message: "Id does not exist" });
//     }
//     const { password, ...accountWithoutPassword } = account.dataValues;
//     res.status(200).json({ account: accountWithoutPassword });
//   } catch (error: any) {
//     console.error("Authentication error:", error);
//     res
//       .status(500)
//       .json({ message: "Authentication failed", error: error.message });
//   }
// }

export {
  signup,
  login,
  logout,
  getVerifyCode,
  checkVerifyCode,
  changeInfoAfterSignup,
};
