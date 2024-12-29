import { NextFunction, Request, Response } from "express";
import { decode_access, decode_refresh, sign_access } from "../utils/jwt"; // Only keep necessary imports
import { Account } from "../database/models/Account";
import { AccountDecode, AccountSign } from "../types";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    const refreshToken = req.cookies["refreshToken"];

    if (accessToken) {
      try {
        const decode = decode_access(accessToken) as AccountDecode;
        res.locals.id = decode.id;
        res.locals.role = decode.role;
        req.user = { id: decode.id, role: decode.role };
        next();
      } catch (err: any) {
        console.error("Error decoding access token: ", err);
        if (!refreshToken) {
          res.status(401).json({ message: "Access denied. No token provided" });
          return;
        }
        try {
          const decode = decode_refresh(refreshToken) as AccountDecode;
          const accountSign: AccountSign = { id: decode.id, role: decode.role };
          const account: Account | null = await Account.findOne({
            where: { id: decode.id },
          });

          if (!account) {
            res.status(401).json({ message: "Invalid refresh token" });
            return;
          }

          if (account.token !== refreshToken) {
            res.status(401).json({ message: "Invalid refresh token" });
            return;
          }

          const newAccessToken = sign_access(accountSign);
          res
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              sameSite: "strict",
            })
            .header("authorization", newAccessToken)
            .send({ message: "Refresh token successfully" });
        } catch (err: any) {
          res
            .status(400)
            .json({ message: "Invalid Token", error: err.message });
        }
      }
    } else {
      if (!refreshToken) {
        res.status(401).json({ message: "Access denied. No token provided" });
        return;
      }
      try {
        const decode = decode_refresh(refreshToken) as AccountDecode;
        const accountSign: AccountSign = { id: decode.id, role: decode.role };
        const newAccessToken = sign_access(accountSign);
        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .header("authorization", newAccessToken)
          .send({ message: "Refresh token successfully" });
      } catch (err: any) {
        res.status(400).json({ message: "Invalid Token", error: err.message });
      }
    }
  } catch (err: any) {
    const statusCode = res.statusCode === 200 ? 404 : res.statusCode;
    res
      .status(statusCode)
      .json({ message: "Could not validate token", error: err.message });
  }
}

export { authenticate };
