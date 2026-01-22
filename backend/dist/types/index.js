"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementType = exports.ActivityStatus = exports.GameDifficulty = exports.InstitutionType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["TUTOR"] = "TUTOR";
    UserRole["CHILD"] = "CHILD";
})(UserRole || (exports.UserRole = UserRole = {}));
var InstitutionType;
(function (InstitutionType) {
    InstitutionType["SCHOOL"] = "SCHOOL";
    InstitutionType["HOME"] = "HOME";
})(InstitutionType || (exports.InstitutionType = InstitutionType = {}));
var GameDifficulty;
(function (GameDifficulty) {
    GameDifficulty["EASY"] = "EASY";
    GameDifficulty["MEDIUM"] = "MEDIUM";
    GameDifficulty["HARD"] = "HARD";
})(GameDifficulty || (exports.GameDifficulty = GameDifficulty = {}));
var ActivityStatus;
(function (ActivityStatus) {
    ActivityStatus["PENDING"] = "PENDING";
    ActivityStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ActivityStatus["COMPLETED"] = "COMPLETED";
    ActivityStatus["CANCELLED"] = "CANCELLED";
})(ActivityStatus || (exports.ActivityStatus = ActivityStatus = {}));
var AchievementType;
(function (AchievementType) {
    AchievementType["COMPLETION"] = "COMPLETION";
    AchievementType["PERFORMANCE"] = "PERFORMANCE";
    AchievementType["CONSISTENCY"] = "CONSISTENCY";
    AchievementType["SPECIAL"] = "SPECIAL";
})(AchievementType || (exports.AchievementType = AchievementType = {}));
//# sourceMappingURL=index.js.map