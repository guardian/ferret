"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Permission;
(function (Permission) {
    Permission["SystemUser"] = "system_user";
    Permission["ManageUsers"] = "manage_users";
    Permission["ManageProjects"] = "manage_projects";
    Permission["ManageMonitors"] = "manage_monitors";
})(Permission = exports.Permission || (exports.Permission = {}));
var User = /** @class */ (function () {
    function User(id, username, displayName, permissions) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.permissions = permissions;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map