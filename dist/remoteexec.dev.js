/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./vendor/cl/remoteexec/js/Actions/RemoteExecAction.js":
/*!*************************************************************!*\
  !*** ./vendor/cl/remoteexec/js/Actions/RemoteExecAction.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RemoteExecAction": () => (/* binding */ RemoteExecAction)
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

    Action.prototype["do"].call(this, main); // Get the requisite tab contents

    var sources = this.getSources();
    var params = {
      sources: sources,
      command: options.command,
      ssh: options.ssh
    }; // Anything added by a derived class?

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
/* harmony export */   "RemoteQuizAction": () => (/* binding */ RemoteQuizAction)
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
    } // Does it have a failure match


    if (options.fail !== null) {
      var fail = RegExp(options.fail);

      var _result = data.match(fail);

      if (_result !== null) {
        answer.value = 'fail';
        code.value = data;
        return;
      }
    } // Does it have the success string in it?


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
/* harmony export */   "RemoteExecFactory": () => (/* binding */ RemoteExecFactory)
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

/******/ 	});
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************************!*\
  !*** ./vendor/cl/remoteexec/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_RemoteExecFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/RemoteExecFactory */ "./vendor/cl/remoteexec/js/RemoteExecFactory.js");

_js_RemoteExecFactory__WEBPACK_IMPORTED_MODULE_0__.RemoteExecFactory.create(Site.site);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bW90ZUV4ZWNBY3Rpb24uanMiLCJ3ZWJwYWNrOi8vY291cnNlbGliLy4vdmVuZG9yL2NsL3JlbW90ZWV4ZWMvanMvQWN0aW9ucy9SZW1vdGVRdWl6QWN0aW9uLmpzIiwid2VicGFjazovL2NvdXJzZWxpYi8uL3ZlbmRvci9jbC9yZW1vdGVleGVjL2pzL1JlbW90ZUV4ZWNGYWN0b3J5LmpzIiwid2VicGFjazovL2NvdXJzZWxpYi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jb3Vyc2VsaWIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NvdXJzZWxpYi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NvdXJzZWxpYi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NvdXJzZWxpYi8uL3ZlbmRvci9jbC9yZW1vdGVleGVjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFjdGlvbiA9IFNpdGUuUGxheWdyb3VuZC5BY3Rpb247XG5cbi8qKlxuICogUGxheWdyb3VuZCBhY3Rpb24gdGhhdCBleGVjdXRlcyBjb2RlIG9uIGEgcmVtb3RlIHN5c3RlbSBhbmQgZGlzcGxheXMgcmVzdWx0XG4gKiBAcGFyYW0gc2l0ZSBUaGUgc2l0ZSBvYmplY3RcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgYXMgcGFzc2VkIHRvIHRoZSBjbGllbnRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY29uc3QgUmVtb3RlRXhlY0FjdGlvbiA9IGZ1bmN0aW9uKHNpdGUsIG9wdGlvbnMpIHtcblx0QWN0aW9uLmNhbGwodGhpcywgc2l0ZSwgb3B0aW9ucyk7XG5cblx0dGhpcy5kbyA9IGZ1bmN0aW9uKG1haW4pIHtcblx0XHRBY3Rpb24ucHJvdG90eXBlLmRvLmNhbGwodGhpcywgbWFpbik7XG5cblx0XHQvLyBHZXQgdGhlIHJlcXVpc2l0ZSB0YWIgY29udGVudHNcblx0XHRjb25zdCBzb3VyY2VzID0gdGhpcy5nZXRTb3VyY2VzKCk7XG5cblx0XHRjb25zdCBwYXJhbXMgPSB7XG5cdFx0XHRzb3VyY2VzOiBzb3VyY2VzLFxuXHRcdFx0Y29tbWFuZDogb3B0aW9ucy5jb21tYW5kLFxuXHRcdFx0c3NoOiBvcHRpb25zLnNzaFxuXHRcdH07XG5cblx0XHQvLyBBbnl0aGluZyBhZGRlZCBieSBhIGRlcml2ZWQgY2xhc3M/XG5cdFx0dGhpcy5hZGRpdGlvbmFsKHBhcmFtcyk7XG5cblxuXHRcdG1haW4ubW9kYWwodHJ1ZSk7XG5cdFx0Y29uc3Qgb3V0cHV0ID0gbWFpbi5nZXRUYWIoJ291dHB1dCcpO1xuXHRcdGlmKG91dHB1dCAhPT0gbnVsbCkge1xuXHRcdFx0b3V0cHV0LnNldCgnJyk7XG5cdFx0fVxuXG5cdFx0c2l0ZS5hcGkucG9zdCgnL2FwaS9yZW1vdGVleGVjL2V4ZWMnLCBwYXJhbXMpXG5cdFx0XHQudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdFx0bWFpbi5tb2RhbChmYWxzZSk7XG5cdFx0XHRcdGlmICghcmVzcG9uc2UuaGFzRXJyb3IoKSkge1xuXHRcdFx0XHRcdGNvbnN0IGRhdGEgPSByZXNwb25zZS5nZXREYXRhKCdyZW1vdGVleGVjLXJlc3VsdCcpLmF0dHJpYnV0ZXM7XG5cdFx0XHRcdFx0aWYob3V0cHV0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRvdXRwdXQuc2V0KGRhdGEpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMucHJvY2VzcyhkYXRhKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzaXRlLnRvYXN0KHRoaXMsIHJlc3BvbnNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKChlcnJvcikgPT4ge1xuXHRcdFx0XHRtYWluLm1vZGFsKGZhbHNlKTtcblxuXHRcdFx0XHRzaXRlLnRvYXN0KHRoaXMsIGVycm9yKTtcblx0XHRcdH0pO1xuXHR9XG5cblx0dGhpcy5hZGRpdGlvbmFsID0gZnVuY3Rpb24ocGFyYW1zKSB7fVxuXHR0aGlzLnByb2Nlc3MgPSBmdW5jdGlvbihvdXRwdXQpIHt9XG5cbn1cblxuUmVtb3RlRXhlY0FjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFjdGlvbi5wcm90b3R5cGUpO1xuUmVtb3RlRXhlY0FjdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSZW1vdGVFeGVjQWN0aW9uO1xuXG5SZW1vdGVFeGVjQWN0aW9uLnRhZyA9ICdyZW1vdGVleGVjJzsiLCJpbXBvcnQge1JlbW90ZUV4ZWNBY3Rpb259IGZyb20gJy4vUmVtb3RlRXhlY0FjdGlvbic7XG5cbi8qKlxuICogUGxheWdyb3VuZCBhY3Rpb24gdGhhdCBleGVjdXRlcyBjb2RlIGZvciBhIHF1aXogb24gYSByZW1vdGUgc3lzdGVtIGFuZCBkaXNwbGF5cyByZXN1bHRcbiAqIEBwYXJhbSBzaXRlIFRoZSBzaXRlIG9iamVjdFxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBhcyBwYXNzZWQgdG8gdGhlIGNsaWVudFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjb25zdCBSZW1vdGVRdWl6QWN0aW9uID0gZnVuY3Rpb24oc2l0ZSwgb3B0aW9ucykge1xuXHRSZW1vdGVFeGVjQWN0aW9uLmNhbGwodGhpcywgc2l0ZSwgb3B0aW9ucyk7XG5cblx0dGhpcy5hZGRpdGlvbmFsID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cdFx0cGFyYW1zLmFwcFRhZyA9IG9wdGlvbnMuYXBwVGFnO1xuXHRcdHBhcmFtcy5uYW1lID0gb3B0aW9ucy5uYW1lO1xuXHRcdHBhcmFtcy5zdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xuXHRcdHBhcmFtcy5mYWlsID0gb3B0aW9ucy5mYWlsO1xuXHR9XG5cblx0dGhpcy5wcm9jZXNzID0gZnVuY3Rpb24oZGF0YSkge1xuXHRcdGNvbnN0IGFuc3dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJjbC1wbGF5Z3JvdW5kLWFuc3dlclwiXScpO1xuXHRcdGNvbnN0IGNvZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwiY2wtcGxheWdyb3VuZC1jb2RlXCJdJyk7XG5cdFx0aWYoYW5zd2VyID09PSBudWxsIHx8IGNvZGUgPT09IG51bGwpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBEb2VzIGl0IGhhdmUgYSBmYWlsdXJlIG1hdGNoXG5cdFx0aWYob3B0aW9ucy5mYWlsICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCBmYWlsID0gUmVnRXhwKG9wdGlvbnMuZmFpbCk7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBkYXRhLm1hdGNoKGZhaWwpO1xuXHRcdFx0aWYocmVzdWx0ICE9PSBudWxsKSB7XG5cdFx0XHRcdGFuc3dlci52YWx1ZSA9ICdmYWlsJztcblx0XHRcdFx0Y29kZS52YWx1ZSA9IGRhdGE7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBEb2VzIGl0IGhhdmUgdGhlIHN1Y2Nlc3Mgc3RyaW5nIGluIGl0P1xuXHRcdGNvbnN0IHJlID0gbmV3IFJlZ0V4cChvcHRpb25zLnN1Y2Nlc3MpO1xuXHRcdGNvbnN0IHJlc3VsdCA9IGRhdGEubWF0Y2gocmUpO1xuXHRcdGlmKHJlc3VsdCAhPT0gbnVsbCkge1xuXHRcdFx0Ly8gU3VjY2Vzc1xuXHRcdFx0YW5zd2VyLnZhbHVlID0gcmVzdWx0WzFdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBGYWlsdXJlIVxuXHRcdFx0YW5zd2VyLnZhbHVlID0gJ2ZhaWwnO1xuXHRcdH1cblxuXHRcdGNvZGUudmFsdWUgPSBkYXRhO1xuXHR9XG5cbn1cblxuUmVtb3RlUXVpekFjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFJlbW90ZUV4ZWNBY3Rpb24ucHJvdG90eXBlKTtcblJlbW90ZVF1aXpBY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmVtb3RlUXVpekFjdGlvbjtcblxuUmVtb3RlUXVpekFjdGlvbi50YWcgPSAncmVtb3RlcXVpeic7IiwiaW1wb3J0IHtSZW1vdGVFeGVjQWN0aW9ufSBmcm9tICcuL0FjdGlvbnMvUmVtb3RlRXhlY0FjdGlvbic7XG5pbXBvcnQge1JlbW90ZVF1aXpBY3Rpb259IGZyb20gJy4vQWN0aW9ucy9SZW1vdGVRdWl6QWN0aW9uJztcblxuZXhwb3J0IGNvbnN0IFJlbW90ZUV4ZWNGYWN0b3J5ID0gZnVuY3Rpb24oKSB7fVxuXG5SZW1vdGVFeGVjRmFjdG9yeS5jcmVhdGUgPSBmdW5jdGlvbihzaXRlKSB7XG5cblx0Y29uc3QgUGxheWdyb3VuZCA9IHNpdGUuUGxheWdyb3VuZDtcblxuXHRQbGF5Z3JvdW5kLmFkZEFjdGlvbihSZW1vdGVFeGVjQWN0aW9uKTtcblx0UGxheWdyb3VuZC5hZGRBY3Rpb24oUmVtb3RlUXVpekFjdGlvbik7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJcbmltcG9ydCB7UmVtb3RlRXhlY0ZhY3Rvcnl9IGZyb20gJy4vanMvUmVtb3RlRXhlY0ZhY3RvcnknO1xuXG5SZW1vdGVFeGVjRmFjdG9yeS5jcmVhdGUoU2l0ZS5zaXRlKTtcbiJdLCJuYW1lcyI6WyJBY3Rpb24iLCJTaXRlIiwiUGxheWdyb3VuZCIsIlJlbW90ZUV4ZWNBY3Rpb24iLCJzaXRlIiwib3B0aW9ucyIsImNhbGwiLCJtYWluIiwicHJvdG90eXBlIiwic291cmNlcyIsImdldFNvdXJjZXMiLCJwYXJhbXMiLCJjb21tYW5kIiwic3NoIiwiYWRkaXRpb25hbCIsIm1vZGFsIiwib3V0cHV0IiwiZ2V0VGFiIiwic2V0IiwiYXBpIiwicG9zdCIsInRoZW4iLCJyZXNwb25zZSIsImhhc0Vycm9yIiwiZGF0YSIsImdldERhdGEiLCJhdHRyaWJ1dGVzIiwicHJvY2VzcyIsInRvYXN0IiwiZXJyb3IiLCJPYmplY3QiLCJjcmVhdGUiLCJjb25zdHJ1Y3RvciIsInRhZyIsIlJlbW90ZVF1aXpBY3Rpb24iLCJhcHBUYWciLCJuYW1lIiwic3VjY2VzcyIsImZhaWwiLCJhbnN3ZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjb2RlIiwiUmVnRXhwIiwicmVzdWx0IiwibWF0Y2giLCJ2YWx1ZSIsInJlIiwiUmVtb3RlRXhlY0ZhY3RvcnkiLCJhZGRBY3Rpb24iXSwic291cmNlUm9vdCI6IiJ9