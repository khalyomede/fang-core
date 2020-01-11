'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var os = require('os');
var cluster = require('cluster');
var util = require('util');
var fs = require('fs');
var path = require('path');

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
var asyncWriteFile = util.promisify(fs.writeFile);
var asyncMkdir = util.promisify(fs.mkdir);
var run = function (tasks) { return __awaiter(void 0, void 0, void 0, function () {
    var numberOfCpus, remainingTaskCount_1, taskIndex, task, worker;
    return __generator(this, function (_a) {
        if (cluster.isMaster) {
            console.time("fang");
            console.log("fang: start");
            numberOfCpus = os.cpus().length;
            remainingTaskCount_1 = tasks.length;
            console.log(numberOfCpus + " CPUs core(s)");
            console.log(remainingTaskCount_1 + " tasks to run");
            for (taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
                task = tasks[taskIndex];
                worker = cluster.fork();
                worker.send(__assign(__assign({}, task), { taskIndex: taskIndex }));
            }
            cluster.on("exit", function () {
                remainingTaskCount_1--;
                if (remainingTaskCount_1 === 0) {
                    console.timeEnd("fang");
                    process.exit(0);
                }
            });
        }
        else if (cluster.isWorker) {
            process.on("message", function (workerTask) { return __awaiter(void 0, void 0, void 0, function () {
                var content, taskList, _i, taskList_1, task;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.time(workerTask.name);
                            console.log(workerTask.name + ": start");
                            return [4 /*yield*/, asyncReadFile(workerTask.inputFilePath)];
                        case 1:
                            content = _a.sent();
                            taskList = tasks[workerTask.taskIndex].tasks;
                            _i = 0, taskList_1 = taskList;
                            _a.label = 2;
                        case 2:
                            if (!(_i < taskList_1.length)) return [3 /*break*/, 5];
                            task = taskList_1[_i];
                            return [4 /*yield*/, task(content)];
                        case 3:
                            content = _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [4 /*yield*/, asyncMkdir(workerTask.outputDir, {
                                recursive: true,
                            })];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, asyncWriteFile(workerTask.outputDir + "/" + path.basename(workerTask.inputFilePath), content)];
                        case 7:
                            _a.sent();
                            console.timeEnd(workerTask.name);
                            process.exit(0);
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        return [2 /*return*/];
    });
}); };

exports.run = run;
