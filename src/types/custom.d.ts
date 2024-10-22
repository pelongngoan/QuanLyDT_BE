import { AccountDecode } from "../type/index"; // Adjust this path based on where your AccountDecode type is located

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace AccountDecode with the type of your decoded JWT object
    }
  }
}
