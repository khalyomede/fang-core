'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = require('os');
var cluster = require('cluster');
var util = require('util');
var fs = require('fs');
var path = require('path');
var glob = _interopDefault(require('glob'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

var asyncReadFile = util.promisify(fs.readFile);
var asyncGlob = util.promisify(glob);
var asyncExists = util.promisify(fs.exists);
var getBaseDirectory = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var subDirectoryLookup, matches, exists_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                subDirectoryLookup = /(.*)\*\*\//;
                if (!subDirectoryLookup.test(filePath)) return [3 /*break*/, 1];
                matches = filePath.match(subDirectoryLookup);
                if (matches === null) {
                    throw new Error("unable to get the directory before your subdirectory lookup (**/), if you are using **/, you should add a directory before");
                }
                if (matches.length < 2) {
                    throw new Error("unable to catch the directory before your sub directory lookup (**/)");
                }
                return [2 /*return*/, matches[1]];
            case 1: return [4 /*yield*/, asyncExists(filePath)];
            case 2:
                exists_1 = _a.sent();
                if (!exists_1) {
                    throw new Error("the file does not exists");
                }
                return [2 /*return*/, path.dirname(filePath)];
        }
    });
}); };
var run = function (tasks) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, taskIndex_1, task, inputExists, _d, _e, _f, callableIndex, callable, e_1_1, numberOfCpus, numberOfTasks, numberOfUsedCpus, numberOfTasksToRunOnTheFirstRun, numberOfRemainingTasks_1, taskIndex_2, index, task, worker_1;
    var e_1, _g, e_2, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                if (!cluster.isMaster) return [3 /*break*/, 9];
                if (!Array.isArray(tasks)) {
                    throw new Error("\"tasks\" must be an array");
                }
                _j.label = 1;
            case 1:
                _j.trys.push([1, 6, 7, 8]);
                _a = __values(tasks.entries()), _b = _a.next();
                _j.label = 2;
            case 2:
                if (!!_b.done) return [3 /*break*/, 5];
                _c = __read(_b.value, 2), taskIndex_1 = _c[0], task = _c[1];
                if (!(task instanceof Object)) {
                    throw new TypeError("\"task[" + taskIndex_1 + "]\" must be an object");
                }
                if (!("name" in task)) {
                    throw new Error("\"task[" + taskIndex_1 + "].name\" must be present");
                }
                if (!("tasks" in task)) {
                    throw new Error("\"task[" + taskIndex_1 + "].tasks\" must be present");
                }
                if (!("input" in task)) {
                    throw new Error("\"task[" + taskIndex_1 + "].input\" must be present");
                }
                if (typeof task.name !== "string") {
                    throw new TypeError("\"task[" + taskIndex_1 + "].name\" must be a string");
                }
                if (typeof task.input !== "string") {
                    throw new TypeError("\"task[" + taskIndex_1 + "].input\" must be a string");
                }
                if (!Array.isArray(task.tasks)) {
                    throw new TypeError("\"task[" + taskIndex_1 + "].tasks\" must be an array");
                }
                if (task.name.trim().length === 0) {
                    throw new Error("\"task[" + taskIndex_1 + "].name\" must be filled");
                }
                if (task.input.trim().length === 0) {
                    throw new Error("\"task[" + taskIndex_1 + "].input\" must be filled");
                }
                if (task.tasks.length === 0) {
                    throw new Error("\"task[" + taskIndex_1 + "].tasks\" must be filled");
                }
                return [4 /*yield*/, asyncExists(task.input)];
            case 3:
                inputExists = _j.sent();
                if (!inputExists) {
                    throw new Error("\"task[" + taskIndex_1 + "].input\" must be an existing file");
                }
                try {
                    for (_d = (e_2 = void 0, __values(task.tasks.entries())), _e = _d.next(); !_e.done; _e = _d.next()) {
                        _f = __read(_e.value, 2), callableIndex = _f[0], callable = _f[1];
                        if (!(callable instanceof Function)) {
                            throw new TypeError("\"task[" + taskIndex_1 + "].tasks[" + callableIndex + "]\" must be a function");
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_h = _d.return)) _h.call(_d);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                _j.label = 4;
            case 4:
                _b = _a.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_1_1 = _j.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 8:
                console.time("fang");
                console.log("fang: start");
                numberOfCpus = os.cpus().length;
                numberOfTasks = tasks.length;
                numberOfUsedCpus = numberOfCpus;
                numberOfTasksToRunOnTheFirstRun = numberOfTasks > numberOfUsedCpus ? numberOfUsedCpus : numberOfTasks;
                numberOfRemainingTasks_1 = tasks.length;
                taskIndex_2 = 0;
                console.log(numberOfCpus + " CPUs core(s)");
                console.log(numberOfTasks + " tasks to run");
                for (index = 0; index < numberOfTasksToRunOnTheFirstRun; index++) {
                    task = tasks[taskIndex_2];
                    if (!(task instanceof Object)) {
                        throw new TypeError("\"task\" must be an object");
                    }
                    worker_1 = cluster.fork();
                    worker_1.send(__assign(__assign({}, task), { taskIndex: taskIndex_2 }));
                    taskIndex_2++;
                }
                cluster.on("message", function (worker) {
                    numberOfRemainingTasks_1--;
                    if (numberOfRemainingTasks_1 < 1) {
                        console.timeEnd("fang");
                        process.exit(0);
                    }
                    else {
                        var task = tasks[taskIndex_2];
                        if (typeof task !== "undefined") {
                            worker.send(__assign(__assign({}, task), { taskIndex: taskIndex_2 }));
                            taskIndex_2++;
                        }
                    }
                });
                return [3 /*break*/, 10];
            case 9:
                if (cluster.isWorker) {
                    process.on("message", function (workerTask) { return __awaiter(void 0, void 0, void 0, function () {
                        var baseDirectory, baseFilePaths, files, baseFilePaths_1, baseFilePaths_1_1, baseFilePath, content, relativeFilePath, e_3_1, taskList, taskList_1, taskList_1_1, task, e_4_1;
                        var e_3, _a, e_4, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    console.time(workerTask.name);
                                    console.log(workerTask.name + ": start");
                                    return [4 /*yield*/, getBaseDirectory(workerTask.input)];
                                case 1:
                                    baseDirectory = _c.sent();
                                    return [4 /*yield*/, asyncGlob(workerTask.input)];
                                case 2:
                                    baseFilePaths = _c.sent();
                                    files = [];
                                    _c.label = 3;
                                case 3:
                                    _c.trys.push([3, 8, 9, 10]);
                                    baseFilePaths_1 = __values(baseFilePaths), baseFilePaths_1_1 = baseFilePaths_1.next();
                                    _c.label = 4;
                                case 4:
                                    if (!!baseFilePaths_1_1.done) return [3 /*break*/, 7];
                                    baseFilePath = baseFilePaths_1_1.value;
                                    return [4 /*yield*/, asyncReadFile(baseFilePath)];
                                case 5:
                                    content = _c.sent();
                                    relativeFilePath = baseFilePath.replace(baseDirectory, "");
                                    files.push({
                                        path: relativeFilePath,
                                        content: content,
                                    });
                                    _c.label = 6;
                                case 6:
                                    baseFilePaths_1_1 = baseFilePaths_1.next();
                                    return [3 /*break*/, 4];
                                case 7: return [3 /*break*/, 10];
                                case 8:
                                    e_3_1 = _c.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 10];
                                case 9:
                                    try {
                                        if (baseFilePaths_1_1 && !baseFilePaths_1_1.done && (_a = baseFilePaths_1.return)) _a.call(baseFilePaths_1);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                    return [7 /*endfinally*/];
                                case 10:
                                    taskList = tasks[workerTask.taskIndex].tasks;
                                    _c.label = 11;
                                case 11:
                                    _c.trys.push([11, 16, 17, 18]);
                                    taskList_1 = __values(taskList), taskList_1_1 = taskList_1.next();
                                    _c.label = 12;
                                case 12:
                                    if (!!taskList_1_1.done) return [3 /*break*/, 15];
                                    task = taskList_1_1.value;
                                    return [4 /*yield*/, task(files)];
                                case 13:
                                    files = _c.sent();
                                    _c.label = 14;
                                case 14:
                                    taskList_1_1 = taskList_1.next();
                                    return [3 /*break*/, 12];
                                case 15: return [3 /*break*/, 18];
                                case 16:
                                    e_4_1 = _c.sent();
                                    e_4 = { error: e_4_1 };
                                    return [3 /*break*/, 18];
                                case 17:
                                    try {
                                        if (taskList_1_1 && !taskList_1_1.done && (_b = taskList_1.return)) _b.call(taskList_1);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                    return [7 /*endfinally*/];
                                case 18:
                                    console.timeEnd(workerTask.name);
                                    // @ts-ignore
                                    process.send("finished");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                _j.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };

exports.run = run;
