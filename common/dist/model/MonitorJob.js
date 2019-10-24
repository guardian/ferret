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
//# sourceMappingURL=MonitorJob.js.map