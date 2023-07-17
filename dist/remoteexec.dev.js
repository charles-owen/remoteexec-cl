"use strict";
(self["webpackChunkcourselib"] = self["webpackChunkcourselib"] || []).push([["RemoteExec"],{

/***/ "./vendor/cl/remoteexec/index.js":
/*!***************************************!*\
  !*** ./vendor/cl/remoteexec/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_RemoteExecFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/RemoteExecFactory */ "./vendor/cl/remoteexec/js/RemoteExecFactory.js");

_js_RemoteExecFactory__WEBPACK_IMPORTED_MODULE_0__.RemoteExecFactory.create(Site.site);

/***/ }),

/***/ "./vendor/cl/remoteexec/js/Actions/RemoteExecAction.js":
/*!*************************************************************!*\
  !*** ./vendor/cl/remoteexec/js/Actions/RemoteExecAction.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoteExecAction: () => (/* binding */ RemoteExecAction)
/* harmony export */ });
var Action = Site.Playground.Action;

/**
 * Playground action that executes code on a remote system and displays result
 * @param site The site object
 * @param options Options as passed to the client
 * @constructor
 */
var RemoteExecAction = function RemoteExecAction(site, options) {
  Action.call(this, site, options);
  this["do"] = function (main) {
    var _this = this;
    Action.prototype["do"].call(this, main);

    // Get the requisite tab contents
    var sources = this.getSources();
    var params = {
      sources: sources,
      command: options.command,
      ssh: options.ssh
    };

    // Anything added by a derived class?
    this.additional(params);
    main.modal(true);
    var output = main.getTab('output');
    if (output !== null) {
      output.set('');
    }
    site.api.post('/api/remoteexec/exec', params).then(function (response) {
      main.modal(false);
      if (!response.hasError()) {
        var data = response.getData('remoteexec-result').attributes;
        if (output !== null) {
          output.set(data);
        }
        _this.process(data);
      } else {
        site.toast(_this, response);
      }
    })["catch"](function (error) {
      main.modal(false);
      site.toast(_this, error);
    });
  };
  this.additional = function (params) {};
  this.process = function (output) {};
};
RemoteExecAction.prototype = Object.create(Action.prototype);
RemoteExecAction.prototype.constructor = RemoteExecAction;
RemoteExecAction.tag = 'remoteexec';

/***/ }),

/***/ "./vendor/cl/remoteexec/js/Actions/RemoteQuizAction.js":
/*!*************************************************************!*\
  !*** ./vendor/cl/remoteexec/js/Actions/RemoteQuizAction.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoteQuizAction: () => (/* binding */ RemoteQuizAction)
/* harmony export */ });
/* harmony import */ var _RemoteExecAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RemoteExecAction */ "./vendor/cl/remoteexec/js/Actions/RemoteExecAction.js");


/**
 * Playground action that executes code for a quiz on a remote system and displays result
 * @param site The site object
 * @param options Options as passed to the client
 * @constructor
 */
var RemoteQuizAction = function RemoteQuizAction(site, options) {
  _RemoteExecAction__WEBPACK_IMPORTED_MODULE_0__.RemoteExecAction.call(this, site, options);
  this.additional = function (params) {
    params.appTag = options.appTag;
    params.name = options.name;
    params.success = options.success;
    params.fail = options.fail;
  };
  this.process = function (data) {
    var answer = document.querySelector('input[name="cl-playground-answer"]');
    var code = document.querySelector('input[name="cl-playground-code"]');
    if (answer === null || code === null) {
      return;
    }

    // Does it have a failure match
    if (options.fail !== null) {
      var fail = RegExp(options.fail);
      var _result = data.match(fail);
      if (_result !== null) {
        answer.value = 'fail';
        code.value = data;
        return;
      }
    }

    // Does it have the success string in it?
    var re = new RegExp(options.success);
    var result = data.match(re);
    if (result !== null) {
      // Success
      answer.value = result[1];
    } else {
      // Failure!
      answer.value = 'fail';
    }
    code.value = data;
  };
};
RemoteQuizAction.prototype = Object.create(_RemoteExecAction__WEBPACK_IMPORTED_MODULE_0__.RemoteExecAction.prototype);
RemoteQuizAction.prototype.constructor = RemoteQuizAction;
RemoteQuizAction.tag = 'remotequiz';

/***/ }),

/***/ "./vendor/cl/remoteexec/js/RemoteExecFactory.js":
/*!******************************************************!*\
  !*** ./vendor/cl/remoteexec/js/RemoteExecFactory.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoteExecFactory: () => (/* binding */ RemoteExecFactory)
/* harmony export */ });
/* harmony import */ var _Actions_RemoteExecAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Actions/RemoteExecAction */ "./vendor/cl/remoteexec/js/Actions/RemoteExecAction.js");
/* harmony import */ var _Actions_RemoteQuizAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Actions/RemoteQuizAction */ "./vendor/cl/remoteexec/js/Actions/RemoteQuizAction.js");


var RemoteExecFactory = function RemoteExecFactory() {};
RemoteExecFactory.create = function (site) {
  var Playground = site.Playground;
  Playground.addAction(_Actions_RemoteExecAction__WEBPACK_IMPORTED_MODULE_0__.RemoteExecAction);
  Playground.addAction(_Actions_RemoteQuizAction__WEBPACK_IMPORTED_MODULE_1__.RemoteQuizAction);
};

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor","Course","Users","common"], () => (__webpack_exec__("./vendor/cl/remoteexec/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNnQyxPQUFPLENBQUM7SUFDdEMsSUFBTU8sTUFBTSxHQUFHbkIsSUFBSSxDQUFDb0IsS0FBSyxDQUFDRSxFQUFFLENBQUM7SUFDN0IsSUFBR0gsTUFBTSxLQUFLLElBQUksRUFBRTtNQUNuQjtNQUNBTCxNQUFNLENBQUNPLEtBQUssR0FBR0YsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN6QixDQUFDLE1BQU07TUFDTjtNQUNBTCxNQUFNLENBQUNPLEtBQUssR0FBRyxNQUFNO0lBQ3RCO0lBRUFKLElBQUksQ0FBQ0ksS0FBSyxHQUFHckIsSUFBSTtFQUNsQixDQUFDO0FBRUYsQ0FBQztBQUVEUyxnQkFBZ0IsQ0FBQ3pCLFNBQVMsR0FBR3NCLE1BQU0sQ0FBQ2hDLE1BQU0sQ0FBQ0ssK0RBQWdCLENBQUNLLFNBQVMsQ0FBQztBQUN0RXlCLGdCQUFnQixDQUFDekIsU0FBUyxDQUFDdUIsV0FBVyxHQUFHRSxnQkFBZ0I7QUFFekRBLGdCQUFnQixDQUFDRCxHQUFHLEdBQUcsWUFBWTs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZEeUI7QUFDQTtBQUVyRCxJQUFNbkMsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFpQkEsQ0FBQSxFQUFjLENBQUMsQ0FBQztBQUU5Q0EsaUJBQWlCLENBQUNDLE1BQU0sR0FBRyxVQUFTRSxJQUFJLEVBQUU7RUFFekMsSUFBTUUsVUFBVSxHQUFHRixJQUFJLENBQUNFLFVBQVU7RUFFbENBLFVBQVUsQ0FBQzZDLFNBQVMsQ0FBQzVDLHVFQUFnQixDQUFDO0VBQ3RDRCxVQUFVLENBQUM2QyxTQUFTLENBQUNkLHVFQUFnQixDQUFDO0FBQ3ZDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb3Vyc2VsaWIvLi92ZW5kb3IvY2wvcmVtb3RlZXhlYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9jb3Vyc2VsaWIvLi92ZW5kb3IvY2wvcmVtb3RlZXhlYy9qcy9BY3Rpb25zL1JlbW90ZUV4ZWNBY3Rpb24uanMiLCJ3ZWJwYWNrOi8vY291cnNlbGliLy4vdmVuZG9yL2NsL3JlbW90ZWV4ZWMvanMvQWN0aW9ucy9SZW1vdGVRdWl6QWN0aW9uLmpzIiwid2VicGFjazovL2NvdXJzZWxpYi8uL3ZlbmRvci9jbC9yZW1vdGVleGVjL2pzL1JlbW90ZUV4ZWNGYWN0b3J5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtSZW1vdGVFeGVjRmFjdG9yeX0gZnJvbSAnLi9qcy9SZW1vdGVFeGVjRmFjdG9yeSc7XG5cblJlbW90ZUV4ZWNGYWN0b3J5LmNyZWF0ZShTaXRlLnNpdGUpO1xuIiwiY29uc3QgQWN0aW9uID0gU2l0ZS5QbGF5Z3JvdW5kLkFjdGlvbjtcblxuLyoqXG4gKiBQbGF5Z3JvdW5kIGFjdGlvbiB0aGF0IGV4ZWN1dGVzIGNvZGUgb24gYSByZW1vdGUgc3lzdGVtIGFuZCBkaXNwbGF5cyByZXN1bHRcbiAqIEBwYXJhbSBzaXRlIFRoZSBzaXRlIG9iamVjdFxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBhcyBwYXNzZWQgdG8gdGhlIGNsaWVudFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjb25zdCBSZW1vdGVFeGVjQWN0aW9uID0gZnVuY3Rpb24oc2l0ZSwgb3B0aW9ucykge1xuXHRBY3Rpb24uY2FsbCh0aGlzLCBzaXRlLCBvcHRpb25zKTtcblxuXHR0aGlzLmRvID0gZnVuY3Rpb24obWFpbikge1xuXHRcdEFjdGlvbi5wcm90b3R5cGUuZG8uY2FsbCh0aGlzLCBtYWluKTtcblxuXHRcdC8vIEdldCB0aGUgcmVxdWlzaXRlIHRhYiBjb250ZW50c1xuXHRcdGNvbnN0IHNvdXJjZXMgPSB0aGlzLmdldFNvdXJjZXMoKTtcblxuXHRcdGNvbnN0IHBhcmFtcyA9IHtcblx0XHRcdHNvdXJjZXM6IHNvdXJjZXMsXG5cdFx0XHRjb21tYW5kOiBvcHRpb25zLmNvbW1hbmQsXG5cdFx0XHRzc2g6IG9wdGlvbnMuc3NoXG5cdFx0fTtcblxuXHRcdC8vIEFueXRoaW5nIGFkZGVkIGJ5IGEgZGVyaXZlZCBjbGFzcz9cblx0XHR0aGlzLmFkZGl0aW9uYWwocGFyYW1zKTtcblxuXG5cdFx0bWFpbi5tb2RhbCh0cnVlKTtcblx0XHRjb25zdCBvdXRwdXQgPSBtYWluLmdldFRhYignb3V0cHV0Jyk7XG5cdFx0aWYob3V0cHV0ICE9PSBudWxsKSB7XG5cdFx0XHRvdXRwdXQuc2V0KCcnKTtcblx0XHR9XG5cblx0XHRzaXRlLmFwaS5wb3N0KCcvYXBpL3JlbW90ZWV4ZWMvZXhlYycsIHBhcmFtcylcblx0XHRcdC50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRtYWluLm1vZGFsKGZhbHNlKTtcblx0XHRcdFx0aWYgKCFyZXNwb25zZS5oYXNFcnJvcigpKSB7XG5cdFx0XHRcdFx0Y29uc3QgZGF0YSA9IHJlc3BvbnNlLmdldERhdGEoJ3JlbW90ZWV4ZWMtcmVzdWx0JykuYXR0cmlidXRlcztcblx0XHRcdFx0XHRpZihvdXRwdXQgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdG91dHB1dC5zZXQoZGF0YSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dGhpcy5wcm9jZXNzKGRhdGEpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNpdGUudG9hc3QodGhpcywgcmVzcG9uc2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goKGVycm9yKSA9PiB7XG5cdFx0XHRcdG1haW4ubW9kYWwoZmFsc2UpO1xuXG5cdFx0XHRcdHNpdGUudG9hc3QodGhpcywgZXJyb3IpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHR0aGlzLmFkZGl0aW9uYWwgPSBmdW5jdGlvbihwYXJhbXMpIHt9XG5cdHRoaXMucHJvY2VzcyA9IGZ1bmN0aW9uKG91dHB1dCkge31cblxufVxuXG5SZW1vdGVFeGVjQWN0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQWN0aW9uLnByb3RvdHlwZSk7XG5SZW1vdGVFeGVjQWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlbW90ZUV4ZWNBY3Rpb247XG5cblJlbW90ZUV4ZWNBY3Rpb24udGFnID0gJ3JlbW90ZWV4ZWMnOyIsImltcG9ydCB7UmVtb3RlRXhlY0FjdGlvbn0gZnJvbSAnLi9SZW1vdGVFeGVjQWN0aW9uJztcblxuLyoqXG4gKiBQbGF5Z3JvdW5kIGFjdGlvbiB0aGF0IGV4ZWN1dGVzIGNvZGUgZm9yIGEgcXVpeiBvbiBhIHJlbW90ZSBzeXN0ZW0gYW5kIGRpc3BsYXlzIHJlc3VsdFxuICogQHBhcmFtIHNpdGUgVGhlIHNpdGUgb2JqZWN0XG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGFzIHBhc3NlZCB0byB0aGUgY2xpZW50XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNvbnN0IFJlbW90ZVF1aXpBY3Rpb24gPSBmdW5jdGlvbihzaXRlLCBvcHRpb25zKSB7XG5cdFJlbW90ZUV4ZWNBY3Rpb24uY2FsbCh0aGlzLCBzaXRlLCBvcHRpb25zKTtcblxuXHR0aGlzLmFkZGl0aW9uYWwgPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0XHRwYXJhbXMuYXBwVGFnID0gb3B0aW9ucy5hcHBUYWc7XG5cdFx0cGFyYW1zLm5hbWUgPSBvcHRpb25zLm5hbWU7XG5cdFx0cGFyYW1zLnN1Y2Nlc3MgPSBvcHRpb25zLnN1Y2Nlc3M7XG5cdFx0cGFyYW1zLmZhaWwgPSBvcHRpb25zLmZhaWw7XG5cdH1cblxuXHR0aGlzLnByb2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG5cdFx0Y29uc3QgYW5zd2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImNsLXBsYXlncm91bmQtYW5zd2VyXCJdJyk7XG5cdFx0Y29uc3QgY29kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJjbC1wbGF5Z3JvdW5kLWNvZGVcIl0nKTtcblx0XHRpZihhbnN3ZXIgPT09IG51bGwgfHwgY29kZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIERvZXMgaXQgaGF2ZSBhIGZhaWx1cmUgbWF0Y2hcblx0XHRpZihvcHRpb25zLmZhaWwgIT09IG51bGwpIHtcblx0XHRcdGNvbnN0IGZhaWwgPSBSZWdFeHAob3B0aW9ucy5mYWlsKTtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGRhdGEubWF0Y2goZmFpbCk7XG5cdFx0XHRpZihyZXN1bHQgIT09IG51bGwpIHtcblx0XHRcdFx0YW5zd2VyLnZhbHVlID0gJ2ZhaWwnO1xuXHRcdFx0XHRjb2RlLnZhbHVlID0gZGF0YTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIERvZXMgaXQgaGF2ZSB0aGUgc3VjY2VzcyBzdHJpbmcgaW4gaXQ/XG5cdFx0Y29uc3QgcmUgPSBuZXcgUmVnRXhwKG9wdGlvbnMuc3VjY2Vzcyk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gZGF0YS5tYXRjaChyZSk7XG5cdFx0aWYocmVzdWx0ICE9PSBudWxsKSB7XG5cdFx0XHQvLyBTdWNjZXNzXG5cdFx0XHRhbnN3ZXIudmFsdWUgPSByZXN1bHRbMV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEZhaWx1cmUhXG5cdFx0XHRhbnN3ZXIudmFsdWUgPSAnZmFpbCc7XG5cdFx0fVxuXG5cdFx0Y29kZS52YWx1ZSA9IGRhdGE7XG5cdH1cblxufVxuXG5SZW1vdGVRdWl6QWN0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUmVtb3RlRXhlY0FjdGlvbi5wcm90b3R5cGUpO1xuUmVtb3RlUXVpekFjdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSZW1vdGVRdWl6QWN0aW9uO1xuXG5SZW1vdGVRdWl6QWN0aW9uLnRhZyA9ICdyZW1vdGVxdWl6JzsiLCJpbXBvcnQge1JlbW90ZUV4ZWNBY3Rpb259IGZyb20gJy4vQWN0aW9ucy9SZW1vdGVFeGVjQWN0aW9uJztcbmltcG9ydCB7UmVtb3RlUXVpekFjdGlvbn0gZnJvbSAnLi9BY3Rpb25zL1JlbW90ZVF1aXpBY3Rpb24nO1xuXG5leHBvcnQgY29uc3QgUmVtb3RlRXhlY0ZhY3RvcnkgPSBmdW5jdGlvbigpIHt9XG5cblJlbW90ZUV4ZWNGYWN0b3J5LmNyZWF0ZSA9IGZ1bmN0aW9uKHNpdGUpIHtcblxuXHRjb25zdCBQbGF5Z3JvdW5kID0gc2l0ZS5QbGF5Z3JvdW5kO1xuXG5cdFBsYXlncm91bmQuYWRkQWN0aW9uKFJlbW90ZUV4ZWNBY3Rpb24pO1xuXHRQbGF5Z3JvdW5kLmFkZEFjdGlvbihSZW1vdGVRdWl6QWN0aW9uKTtcbn0iXSwibmFtZXMiOlsiUmVtb3RlRXhlY0ZhY3RvcnkiLCJjcmVhdGUiLCJTaXRlIiwic2l0ZSIsIkFjdGlvbiIsIlBsYXlncm91bmQiLCJSZW1vdGVFeGVjQWN0aW9uIiwib3B0aW9ucyIsImNhbGwiLCJtYWluIiwiX3RoaXMiLCJwcm90b3R5cGUiLCJzb3VyY2VzIiwiZ2V0U291cmNlcyIsInBhcmFtcyIsImNvbW1hbmQiLCJzc2giLCJhZGRpdGlvbmFsIiwibW9kYWwiLCJvdXRwdXQiLCJnZXRUYWIiLCJzZXQiLCJhcGkiLCJwb3N0IiwidGhlbiIsInJlc3BvbnNlIiwiaGFzRXJyb3IiLCJkYXRhIiwiZ2V0RGF0YSIsImF0dHJpYnV0ZXMiLCJwcm9jZXNzIiwidG9hc3QiLCJlcnJvciIsIk9iamVjdCIsImNvbnN0cnVjdG9yIiwidGFnIiwiUmVtb3RlUXVpekFjdGlvbiIsImFwcFRhZyIsIm5hbWUiLCJzdWNjZXNzIiwiZmFpbCIsImFuc3dlciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNvZGUiLCJSZWdFeHAiLCJyZXN1bHQiLCJtYXRjaCIsInZhbHVlIiwicmUiLCJhZGRBY3Rpb24iXSwic291cmNlUm9vdCI6IiJ9