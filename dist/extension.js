/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const regexp = /{{([_a-z\d]+)}}/gi;
const createComponentPart = ({ url, wsedit, fileContent, fileName, componentName }) => __awaiter(void 0, void 0, void 0, function* () {
    const path = `${url}/${componentName}/${fileName}`;
    const filePath = vscode.Uri.file(path);
    wsedit.createFile(filePath, { ignoreIfExists: true });
    yield vscode.workspace.applyEdit(wsedit);
    vscode.workspace.openTextDocument(path).then((a) => {
        vscode.window.showTextDocument(a, 1, false).then(e => {
            e.edit(edit => {
                edit.insert(new vscode.Position(0, 0), fileContent);
            });
        });
    }, (error) => {
        console.error(error);
    });
});
const replaceTemplateText = (file, componentName) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield vscode.workspace.openTextDocument(file);
    const [fileNameWithoutTemplateExtension] = document.uri.path.split('/').reverse()[0].split('.template');
    return {
        fileContent: document.getText().replace(regexp, componentName),
        fileName: fileNameWithoutTemplateExtension.replace(regexp, componentName)
    };
});
const getTemplates = (componentName) => __awaiter(void 0, void 0, void 0, function* () {
    const templates = yield vscode.workspace.findFiles('templates/*.template');
    const promises = templates.map(document => replaceTemplateText(document, componentName));
    return promises;
});
function activate(context) {
    let createFile = vscode.commands.registerCommand('file-creator.helloWorld', (folder) => __awaiter(this, void 0, void 0, function* () {
        let newUri = folder;
        if (!folder) {
            yield vscode.commands.executeCommand('copyFilePath');
            folder = yield vscode.env.clipboard.readText();
            newUri = vscode.Uri.file(folder);
        }
        let options = {
            prompt: "Component name: ",
            placeHolder: "(placeholder)"
        };
        vscode.window.showInputBox(options).then((value) => __awaiter(this, void 0, void 0, function* () {
            if (value) {
                const wsedit = new vscode.WorkspaceEdit();
                const componentsParts = yield getTemplates(value);
                for (const component of componentsParts) {
                    const comp = yield component;
                    yield createComponentPart({
                        url: newUri._fsPath,
                        fileName: comp.fileName,
                        componentName: value,
                        wsedit: wsedit,
                        fileContent: comp.fileContent
                    });
                }
            }
            ;
        }));
    }));
    context.subscriptions.push(createFile);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map