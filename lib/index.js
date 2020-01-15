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
    var numberOfCpus, numberOfTasks, numberOfUsedCpus, numberOfTasksToRunOnTheFirstRun, numberOfRemainingTasks_1, taskIndex_1, index, task, worker;
    return __generator(this, function (_a) {
        if (cluster.isMaster) {
            console.time("fang");
            console.log("fang: start");
            numberOfCpus = os.cpus().length;
            numberOfTasks = tasks.length;
            numberOfUsedCpus = numberOfCpus;
            numberOfTasksToRunOnTheFirstRun = numberOfTasks > numberOfUsedCpus ? numberOfUsedCpus : numberOfTasks;
            numberOfRemainingTasks_1 = tasks.length;
            taskIndex_1 = 0;
            console.log(numberOfCpus + " CPUs core(s)");
            console.log(numberOfTasks + " tasks to run");
            for (index = 0; index < numberOfTasksToRunOnTheFirstRun; index++) {
                task = tasks[taskIndex_1];
                worker = cluster.fork();
                worker.send(__assign(__assign({}, task), { taskIndex: taskIndex_1 }));
                taskIndex_1++;
            }
            cluster.on("message", function (worker) {
                numberOfRemainingTasks_1--;
                if (numberOfRemainingTasks_1 < 1) {
                    console.timeEnd("fang");
                    process.exit(0);
                }
                else {
                    var task = tasks[taskIndex_1];
                    if (typeof task !== "undefined") {
                        worker.send(__assign(__assign({}, task), { taskIndex: taskIndex_1 }));
                        taskIndex_1++;
                    }
                }
            });
        }
        else if (cluster.isWorker) {
            process.on("message", function (workerTask) { return __awaiter(void 0, void 0, void 0, function () {
                var baseDirectory, baseFilePaths, files, _i, baseFilePaths_1, baseFilePath, content, relativeFilePath, taskList, _a, taskList_1, task;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.time(workerTask.name);
                            console.log(workerTask.name + ": start");
                            return [4 /*yield*/, getBaseDirectory(workerTask.input)];
                        case 1:
                            baseDirectory = _b.sent();
                            return [4 /*yield*/, asyncGlob(workerTask.input)];
                        case 2:
                            baseFilePaths = _b.sent();
                            files = [];
                            _i = 0, baseFilePaths_1 = baseFilePaths;
                            _b.label = 3;
                        case 3:
                            if (!(_i < baseFilePaths_1.length)) return [3 /*break*/, 6];
                            baseFilePath = baseFilePaths_1[_i];
                            return [4 /*yield*/, asyncReadFile(baseFilePath)];
                        case 4:
                            content = _b.sent();
                            relativeFilePath = baseFilePath.replace(baseDirectory, "");
                            files.push({
                                path: relativeFilePath,
                                content: content,
                            });
                            _b.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            taskList = tasks[workerTask.taskIndex].tasks;
                            _a = 0, taskList_1 = taskList;
                            _b.label = 7;
                        case 7:
                            if (!(_a < taskList_1.length)) return [3 /*break*/, 10];
                            task = taskList_1[_a];
                            return [4 /*yield*/, task(files)];
                        case 8:
                            files = _b.sent();
                            _b.label = 9;
                        case 9:
                            _a++;
                            return [3 /*break*/, 7];
                        case 10:
                            console.timeEnd(workerTask.name);
                            // @ts-ignore
                            process.send("finished");
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        return [2 /*return*/];
    });
}); };

exports.run = run;
