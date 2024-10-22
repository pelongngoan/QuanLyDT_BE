import { NextFunction, Request, Response } from "express";
import { decode_access, decode_refresh, sign_access } from "../utils/jwt";
import { AccountDecode, AccountSign } from "../types";
import { Account } from "../database/models/Account";
import { ROLE } from "../database/enum/enum";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.headers["authorization"];
    const refreshToken = req.cookies["refreshToken"];

    const handleTokens = async (token: string, isRefresh: boolean) => {
      const decode = isRefresh ? decode_refresh(token) : decode_access(token);

      if (typeof decode === "string") {
        throw new Error("Invalid token format");
      }

      const accountSign: AccountSign = {
        id: decode.id,
        role: decode.role,
      };

      const account = await Account.findOne({ where: { id: decode.id } });
      if (!account) {
        throw new Error("Account not found");
      }

      if (isRefresh && account.token !== token) {
        throw new Error("Invalid refresh token");
      }

      return accountSign;
    };

    if (accessToken) {
      try {
        const accountSign = await handleTokens(accessToken, false);
        // req.user = accountSign; // Attach user info to the request
        next(); // Call next() to proceed to the next middleware
      } catch (err: any) {
        if (!refreshToken) {
          res.status(401).json({ message: "Access denied. No token provided" });
        }
        // Handle refresh token logic
        try {
          const accountSign = await handleTokens(refreshToken, true);
          const newAccessToken = sign_access(accountSign);
          res
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              sameSite: "strict",
            })
            .header("authorization", newAccessToken)
            .send({ message: "Refresh token successfully" });
        } catch (err: any) {
          res.status(400).json({
            message: "Invalid Token",
            error: err.message,
          });
        }
      }
    } else {
      if (!refreshToken) {
        res.status(401).json({ message: "Access denied. No token provided" });
      }
      try {
        const accountSign = await handleTokens(refreshToken, true);
        const newAccessToken = sign_access(accountSign);
        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .header("authorization", newAccessToken)
          .send({ message: "Refresh token successfully" });
      } catch (err: any) {
        res.status(400).json({
          message: "Invalid Token",
          error: err.message,
        });
      }
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Could not validate token",
      error: err.message,
    });
  }
}

function isTeacher(req: Request, res: Response, next: NextFunction) {
  // const user = req.user;

  // if (!user || user.role !== ROLE.TEACHER) {
  //   res.status(403).json({
  //     message: "Access denied. Only lecturers can perform this action.",
  //   });
  // }

  next(); // Continue to the next middleware or route handler
}

export { authenticate, isTeacher };
