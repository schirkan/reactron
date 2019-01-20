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
const apiRoutes_1 = require("../../common/apiRoutes");
class WebComponentController {
    start(context) {
        return __awaiter(this, void 0, void 0, function* () {
            context.registerRoute(apiRoutes_1.routes.getWebComponentOptions, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const result = context.backendService.webComponentsManager.getAll();
                res.send(result);
            }));
            context.registerRoute(apiRoutes_1.routes.setWebComponentOptions, (req, res) => __awaiter(this, void 0, void 0, function* () {
                const item = context.backendService.webComponentsManager.createOrUpdate(req.body);
                res.send(item);
            }));
            context.registerRoute(apiRoutes_1.routes.deleteWebComponentOptions, (req, res) => __awaiter(this, void 0, void 0, function* () {
                context.backendService.webComponentsManager.remove(req.params.id);
                res.sendStatus(204);
            }));
        });
    }
}
exports.WebComponentController = WebComponentController;
//# sourceMappingURL=WebComponentController.js.map