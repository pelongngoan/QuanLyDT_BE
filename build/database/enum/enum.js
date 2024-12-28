"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATE = exports.ROLE = void 0;
// enum ROLE {
//   ADMIN = "ADMIN",
//   STUDENT = "STUDENT",
//   TEACHER = "TEACHER",
// }
// enum STATE {
//   ACTIVE = "ACTIVE",
//   INACTIVE = "INACTIVE",
// }
// enum ATTENDANCESTATUS {
//   PRESENT = "PRESENT",
//   ABSENT = "ABSENT",
// }
// export { ROLE, STATE, ATTENDANCESTATUS };
var ROLE;
(function (ROLE) {
    ROLE["ADMIN"] = "admin";
    ROLE["TEACHER"] = "teacher";
    ROLE["STUDENT"] = "student";
})(ROLE || (exports.ROLE = ROLE = {}));
var STATE;
(function (STATE) {
    STATE["ACTIVE"] = "active";
    STATE["LOCKED"] = "locked";
    STATE["PENDING"] = "pending";
})(STATE || (exports.STATE = STATE = {}));
