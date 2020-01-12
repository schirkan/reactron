"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BackendService_1 = require("../BackendService");
class LogController {
    start() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getLogEntries(source) {
        return __awaiter(this, void 0, void 0, function* () {
            return BackendService_1.BackendService.instance.logManager.readLog(source);
        });
    }
}
exports.LogController = LogController;
//# sourceMappingURL=LogController.js.map