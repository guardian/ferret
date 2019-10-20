"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JobType;
(function (JobType) {
    // Refreshing to get new content
    JobType["TwitterRefresh"] = "twitter::refresh";
    // Searching back in time for old content
    JobType["TwitterBackfill"] = "twitter::backfill";
})(JobType = exports.JobType || (exports.JobType = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["Ready"] = "ready";
    JobStatus["Done"] = "done";
    JobStatus["Failed"] = "failed";
})(JobStatus = exports.JobStatus || (exports.JobStatus = {}));
var MonitorJob = /** @class */ (function () {
    function MonitorJob(monitorId, jobType, status, submitttedAt, executeAt) {
        var _this = this;
        // Priority of tasks is a number, higher is more important
        this.priority = function () {
            switch (_this.jobType) {
                case JobType.TwitterRefresh:
                    return 10;
                case JobType.TwitterBackfill:
                    return 1;
            }
        };
        this.monitorId = monitorId;
        this.jobType = jobType;
        this.status = status;
        this.submittedAt = submitttedAt;
        this.executeAt = executeAt;
    }
    return MonitorJob;
}());
exports.MonitorJob = MonitorJob;
//# sourceMappingURL=MonitorJob.js.map