"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLASSSTATE = exports.STATE = exports.ROLE = void 0;
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
var CLASSSTATE;
(function (CLASSSTATE) {
    CLASSSTATE["OPEN"] = "active";
    CLASSSTATE["CLOSE"] = "locked";
    CLASSSTATE["INPROGRESS"] = "pending";
})(CLASSSTATE || (exports.CLASSSTATE = CLASSSTATE = {}));
