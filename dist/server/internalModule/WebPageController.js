"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BackendService_1 = require("../BackendService");
class WebPageController {
    start() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    deleteWebPage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return BackendService_1.BackendService.instance.webPageManager.remove(id);
        });
    }
    getWebPages() {
        return __awaiter(this, void 0, void 0, function* () {
            return BackendService_1.BackendService.instance.webPageManager.getAll();
        });
    }
    setWebPage(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return BackendService_1.BackendService.instance.webPageManager.createOrUpdate(options);
        });
    }
}
exports.WebPageController = WebPageController;
//# sourceMappingURL=WebPageController.js.map