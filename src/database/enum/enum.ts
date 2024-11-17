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
export enum ROLE {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

export enum STATE {
  ACTIVE = "active",
  LOCKED = "locked",
  PENDING = "pending",
}
