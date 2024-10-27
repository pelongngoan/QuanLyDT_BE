// import { ROLE } from "../database/enum/enum";

import { ROLE } from "../database/models/Account";

interface AccountSign {
  id: string;
  role: ROLE;
}
interface AccountDecode {
  id: string; // Unique identifier for the account
  role: ROLE; // User's role (e.g., TEACHER, STUDENT, etc.)
  iat?: number; // Issued at timestamp (optional)
  exp?: number; // Expiration timestamp (optional)
}

export { AccountSign, AccountDecode };
