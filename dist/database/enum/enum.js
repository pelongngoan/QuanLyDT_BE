"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ATTENDANCESTATUS = exports.STATE = exports.ROLE = void 0;
var ROLE;
(function (ROLE) {
    ROLE["ADMIN"] = "ADMIN";
    ROLE["STUDENT"] = "STUDENT";
    ROLE["TEACHER"] = "TEACHER";
})(ROLE || (exports.ROLE = ROLE = {}));
var STATE;
(function (STATE) {
    STATE["ACTIVE"] = "ACTIVE";
    STATE["INACTIVE"] = "INACTIVE";
})(STATE || (exports.STATE = STATE = {}));
var ATTENDANCESTATUS;
(function (ATTENDANCESTATUS) {
    ATTENDANCESTATUS["PRESENT"] = "PRESENT";
    ATTENDANCESTATUS["ABSENT"] = "ABSENT";
})(ATTENDANCESTATUS || (exports.ATTENDANCESTATUS = ATTENDANCESTATUS = {}));
