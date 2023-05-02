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
exports.checkProject = exports.setProject = void 0;
const sdk_1 = require("@cinerino/sdk");
/**
 * プロジェクト設定
 */
function setProject(req, _res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        req.project = {
            typeOf: sdk_1.factory.organizationType.Project,
            id: req.params.id,
        };
        next();
    });
}
exports.setProject = setProject;
/**
 * プロジェクト確認
 */
function checkProject(req, _res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // プロジェクト未指定は拒否
        if (typeof ((_a = req.project) === null || _a === void 0 ? void 0 : _a.id) !== 'string') {
            next(new Error('project not specified'));
        }
        next();
    });
}
exports.checkProject = checkProject;
