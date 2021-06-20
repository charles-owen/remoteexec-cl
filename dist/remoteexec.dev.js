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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb3Vyc2VsaWIvLi92ZW5kb3IvY2wvcmVtb3RlZXhlYy9qcy9BY3Rpb25zL1JlbW90ZUV4ZWNBY3Rpb24uanMiLCJ3ZWJwYWNrOi8vY291cnNlbGliLy4vdmVuZG9yL2NsL3JlbW90ZWV4ZWMvanMvQWN0aW9ucy9SZW1vdGVRdWl6QWN0aW9uLmpzIiwid2VicGFjazovL2NvdXJzZWxpYi8uL3ZlbmRvci9jbC9yZW1vdGVleGVjL2pzL1JlbW90ZUV4ZWNGYWN0b3J5LmpzIiwid2VicGFjazovL2NvdXJzZWxpYi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jb3Vyc2VsaWIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NvdXJzZWxpYi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NvdXJzZWxpYi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NvdXJzZWxpYi8uL3ZlbmRvci9jbC9yZW1vdGVleGVjL2luZGV4LmpzIl0sIm5hbWVzIjpbIkFjdGlvbiIsIlNpdGUiLCJQbGF5Z3JvdW5kIiwiUmVtb3RlRXhlY0FjdGlvbiIsInNpdGUiLCJvcHRpb25zIiwiY2FsbCIsIm1haW4iLCJwcm90b3R5cGUiLCJzb3VyY2VzIiwiZ2V0U291cmNlcyIsInBhcmFtcyIsImNvbW1hbmQiLCJzc2giLCJhZGRpdGlvbmFsIiwibW9kYWwiLCJvdXRwdXQiLCJnZXRUYWIiLCJzZXQiLCJhcGkiLCJwb3N0IiwidGhlbiIsInJlc3BvbnNlIiwiaGFzRXJyb3IiLCJkYXRhIiwiZ2V0RGF0YSIsImF0dHJpYnV0ZXMiLCJwcm9jZXNzIiwidG9hc3QiLCJlcnJvciIsIk9iamVjdCIsImNyZWF0ZSIsImNvbnN0cnVjdG9yIiwidGFnIiwiUmVtb3RlUXVpekFjdGlvbiIsImFwcFRhZyIsIm5hbWUiLCJzdWNjZXNzIiwiZmFpbCIsImFuc3dlciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNvZGUiLCJSZWdFeHAiLCJyZXN1bHQiLCJtYXRjaCIsInZhbHVlIiwicmUiLCJSZW1vdGVFeGVjRmFjdG9yeSIsImFkZEFjdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsVUFBTCxDQUFnQkYsTUFBL0I7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ08sSUFBTUcsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQixDQUFTQyxJQUFULEVBQWVDLE9BQWYsRUFBd0I7QUFDdkRMLFFBQU0sQ0FBQ00sSUFBUCxDQUFZLElBQVosRUFBa0JGLElBQWxCLEVBQXdCQyxPQUF4Qjs7QUFFQSxlQUFVLFVBQVNFLElBQVQsRUFBZTtBQUFBOztBQUN4QlAsVUFBTSxDQUFDUSxTQUFQLE9BQW9CRixJQUFwQixDQUF5QixJQUF6QixFQUErQkMsSUFBL0IsRUFEd0IsQ0FHeEI7O0FBQ0EsUUFBTUUsT0FBTyxHQUFHLEtBQUtDLFVBQUwsRUFBaEI7QUFFQSxRQUFNQyxNQUFNLEdBQUc7QUFDZEYsYUFBTyxFQUFFQSxPQURLO0FBRWRHLGFBQU8sRUFBRVAsT0FBTyxDQUFDTyxPQUZIO0FBR2RDLFNBQUcsRUFBRVIsT0FBTyxDQUFDUTtBQUhDLEtBQWYsQ0FOd0IsQ0FZeEI7O0FBQ0EsU0FBS0MsVUFBTCxDQUFnQkgsTUFBaEI7QUFHQUosUUFBSSxDQUFDUSxLQUFMLENBQVcsSUFBWDtBQUNBLFFBQU1DLE1BQU0sR0FBR1QsSUFBSSxDQUFDVSxNQUFMLENBQVksUUFBWixDQUFmOztBQUNBLFFBQUdELE1BQU0sS0FBSyxJQUFkLEVBQW9CO0FBQ25CQSxZQUFNLENBQUNFLEdBQVAsQ0FBVyxFQUFYO0FBQ0E7O0FBRURkLFFBQUksQ0FBQ2UsR0FBTCxDQUFTQyxJQUFULENBQWMsc0JBQWQsRUFBc0NULE1BQXRDLEVBQ0VVLElBREYsQ0FDTyxVQUFDQyxRQUFELEVBQWM7QUFDbkJmLFVBQUksQ0FBQ1EsS0FBTCxDQUFXLEtBQVg7O0FBQ0EsVUFBSSxDQUFDTyxRQUFRLENBQUNDLFFBQVQsRUFBTCxFQUEwQjtBQUN6QixZQUFNQyxJQUFJLEdBQUdGLFFBQVEsQ0FBQ0csT0FBVCxDQUFpQixtQkFBakIsRUFBc0NDLFVBQW5EOztBQUNBLFlBQUdWLE1BQU0sS0FBSyxJQUFkLEVBQW9CO0FBQ25CQSxnQkFBTSxDQUFDRSxHQUFQLENBQVdNLElBQVg7QUFDQTs7QUFFRCxhQUFJLENBQUNHLE9BQUwsQ0FBYUgsSUFBYjtBQUNBLE9BUEQsTUFPTztBQUNOcEIsWUFBSSxDQUFDd0IsS0FBTCxDQUFXLEtBQVgsRUFBaUJOLFFBQWpCO0FBQ0E7QUFFRCxLQWRGLFdBZVEsVUFBQ08sS0FBRCxFQUFXO0FBQ2pCdEIsVUFBSSxDQUFDUSxLQUFMLENBQVcsS0FBWDtBQUVBWCxVQUFJLENBQUN3QixLQUFMLENBQVcsS0FBWCxFQUFpQkMsS0FBakI7QUFDQSxLQW5CRjtBQW9CQSxHQTFDRDs7QUE0Q0EsT0FBS2YsVUFBTCxHQUFrQixVQUFTSCxNQUFULEVBQWlCLENBQUUsQ0FBckM7O0FBQ0EsT0FBS2dCLE9BQUwsR0FBZSxVQUFTWCxNQUFULEVBQWlCLENBQUUsQ0FBbEM7QUFFQSxDQWxETTtBQW9EUGIsZ0JBQWdCLENBQUNLLFNBQWpCLEdBQTZCc0IsTUFBTSxDQUFDQyxNQUFQLENBQWMvQixNQUFNLENBQUNRLFNBQXJCLENBQTdCO0FBQ0FMLGdCQUFnQixDQUFDSyxTQUFqQixDQUEyQndCLFdBQTNCLEdBQXlDN0IsZ0JBQXpDO0FBRUFBLGdCQUFnQixDQUFDOEIsR0FBakIsR0FBdUIsWUFBdkIsQzs7Ozs7Ozs7Ozs7Ozs7O0FDL0RBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNPLElBQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUIsQ0FBUzlCLElBQVQsRUFBZUMsT0FBZixFQUF3QjtBQUN2REYsc0VBQUEsQ0FBc0IsSUFBdEIsRUFBNEJDLElBQTVCLEVBQWtDQyxPQUFsQzs7QUFFQSxPQUFLUyxVQUFMLEdBQWtCLFVBQVNILE1BQVQsRUFBaUI7QUFDbENBLFVBQU0sQ0FBQ3dCLE1BQVAsR0FBZ0I5QixPQUFPLENBQUM4QixNQUF4QjtBQUNBeEIsVUFBTSxDQUFDeUIsSUFBUCxHQUFjL0IsT0FBTyxDQUFDK0IsSUFBdEI7QUFDQXpCLFVBQU0sQ0FBQzBCLE9BQVAsR0FBaUJoQyxPQUFPLENBQUNnQyxPQUF6QjtBQUNBMUIsVUFBTSxDQUFDMkIsSUFBUCxHQUFjakMsT0FBTyxDQUFDaUMsSUFBdEI7QUFDQSxHQUxEOztBQU9BLE9BQUtYLE9BQUwsR0FBZSxVQUFTSCxJQUFULEVBQWU7QUFDN0IsUUFBTWUsTUFBTSxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsb0NBQXZCLENBQWY7QUFDQSxRQUFNQyxJQUFJLEdBQUdGLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixrQ0FBdkIsQ0FBYjs7QUFDQSxRQUFHRixNQUFNLEtBQUssSUFBWCxJQUFtQkcsSUFBSSxLQUFLLElBQS9CLEVBQXFDO0FBQ3BDO0FBQ0EsS0FMNEIsQ0FPN0I7OztBQUNBLFFBQUdyQyxPQUFPLENBQUNpQyxJQUFSLEtBQWlCLElBQXBCLEVBQTBCO0FBQ3pCLFVBQU1BLElBQUksR0FBR0ssTUFBTSxDQUFDdEMsT0FBTyxDQUFDaUMsSUFBVCxDQUFuQjs7QUFDQSxVQUFNTSxPQUFNLEdBQUdwQixJQUFJLENBQUNxQixLQUFMLENBQVdQLElBQVgsQ0FBZjs7QUFDQSxVQUFHTSxPQUFNLEtBQUssSUFBZCxFQUFvQjtBQUNuQkwsY0FBTSxDQUFDTyxLQUFQLEdBQWUsTUFBZjtBQUNBSixZQUFJLENBQUNJLEtBQUwsR0FBYXRCLElBQWI7QUFDQTtBQUNBO0FBQ0QsS0FoQjRCLENBa0I3Qjs7O0FBQ0EsUUFBTXVCLEVBQUUsR0FBRyxJQUFJSixNQUFKLENBQVd0QyxPQUFPLENBQUNnQyxPQUFuQixDQUFYO0FBQ0EsUUFBTU8sTUFBTSxHQUFHcEIsSUFBSSxDQUFDcUIsS0FBTCxDQUFXRSxFQUFYLENBQWY7O0FBQ0EsUUFBR0gsTUFBTSxLQUFLLElBQWQsRUFBb0I7QUFDbkI7QUFDQUwsWUFBTSxDQUFDTyxLQUFQLEdBQWVGLE1BQU0sQ0FBQyxDQUFELENBQXJCO0FBQ0EsS0FIRCxNQUdPO0FBQ047QUFDQUwsWUFBTSxDQUFDTyxLQUFQLEdBQWUsTUFBZjtBQUNBOztBQUVESixRQUFJLENBQUNJLEtBQUwsR0FBYXRCLElBQWI7QUFDQSxHQTlCRDtBQWdDQSxDQTFDTTtBQTRDUFUsZ0JBQWdCLENBQUMxQixTQUFqQixHQUE2QnNCLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjNUIseUVBQWQsQ0FBN0I7QUFDQStCLGdCQUFnQixDQUFDMUIsU0FBakIsQ0FBMkJ3QixXQUEzQixHQUF5Q0UsZ0JBQXpDO0FBRUFBLGdCQUFnQixDQUFDRCxHQUFqQixHQUF1QixZQUF2QixDOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkRBO0FBQ0E7QUFFTyxJQUFNZSxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CLEdBQVcsQ0FBRSxDQUF2Qzs7QUFFUEEsaUJBQWlCLENBQUNqQixNQUFsQixHQUEyQixVQUFTM0IsSUFBVCxFQUFlO0FBRXpDLE1BQU1GLFVBQVUsR0FBR0UsSUFBSSxDQUFDRixVQUF4QjtBQUVBQSxZQUFVLENBQUMrQyxTQUFYLENBQXFCOUMsdUVBQXJCO0FBQ0FELFlBQVUsQ0FBQytDLFNBQVgsQ0FBcUJmLHVFQUFyQjtBQUNBLENBTkQsQzs7Ozs7O1VDTEE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNMQTtBQUVBYywyRUFBQSxDQUF5Qi9DLElBQUksQ0FBQ0csSUFBOUIsRSIsImZpbGUiOiJyZW1vdGVleGVjLmRldi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFjdGlvbiA9IFNpdGUuUGxheWdyb3VuZC5BY3Rpb247XHJcblxyXG4vKipcclxuICogUGxheWdyb3VuZCBhY3Rpb24gdGhhdCBleGVjdXRlcyBjb2RlIG9uIGEgcmVtb3RlIHN5c3RlbSBhbmQgZGlzcGxheXMgcmVzdWx0XHJcbiAqIEBwYXJhbSBzaXRlIFRoZSBzaXRlIG9iamVjdFxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGFzIHBhc3NlZCB0byB0aGUgY2xpZW50XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFJlbW90ZUV4ZWNBY3Rpb24gPSBmdW5jdGlvbihzaXRlLCBvcHRpb25zKSB7XHJcblx0QWN0aW9uLmNhbGwodGhpcywgc2l0ZSwgb3B0aW9ucyk7XHJcblxyXG5cdHRoaXMuZG8gPSBmdW5jdGlvbihtYWluKSB7XHJcblx0XHRBY3Rpb24ucHJvdG90eXBlLmRvLmNhbGwodGhpcywgbWFpbik7XHJcblxyXG5cdFx0Ly8gR2V0IHRoZSByZXF1aXNpdGUgdGFiIGNvbnRlbnRzXHJcblx0XHRjb25zdCBzb3VyY2VzID0gdGhpcy5nZXRTb3VyY2VzKCk7XHJcblxyXG5cdFx0Y29uc3QgcGFyYW1zID0ge1xyXG5cdFx0XHRzb3VyY2VzOiBzb3VyY2VzLFxyXG5cdFx0XHRjb21tYW5kOiBvcHRpb25zLmNvbW1hbmQsXHJcblx0XHRcdHNzaDogb3B0aW9ucy5zc2hcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gQW55dGhpbmcgYWRkZWQgYnkgYSBkZXJpdmVkIGNsYXNzP1xyXG5cdFx0dGhpcy5hZGRpdGlvbmFsKHBhcmFtcyk7XHJcblxyXG5cclxuXHRcdG1haW4ubW9kYWwodHJ1ZSk7XHJcblx0XHRjb25zdCBvdXRwdXQgPSBtYWluLmdldFRhYignb3V0cHV0Jyk7XHJcblx0XHRpZihvdXRwdXQgIT09IG51bGwpIHtcclxuXHRcdFx0b3V0cHV0LnNldCgnJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2l0ZS5hcGkucG9zdCgnL2FwaS9yZW1vdGVleGVjL2V4ZWMnLCBwYXJhbXMpXHJcblx0XHRcdC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG5cdFx0XHRcdG1haW4ubW9kYWwoZmFsc2UpO1xyXG5cdFx0XHRcdGlmICghcmVzcG9uc2UuaGFzRXJyb3IoKSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgZGF0YSA9IHJlc3BvbnNlLmdldERhdGEoJ3JlbW90ZWV4ZWMtcmVzdWx0JykuYXR0cmlidXRlcztcclxuXHRcdFx0XHRcdGlmKG91dHB1dCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRvdXRwdXQuc2V0KGRhdGEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRoaXMucHJvY2VzcyhkYXRhKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2l0ZS50b2FzdCh0aGlzLCByZXNwb25zZSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSlcclxuXHRcdFx0LmNhdGNoKChlcnJvcikgPT4ge1xyXG5cdFx0XHRcdG1haW4ubW9kYWwoZmFsc2UpO1xyXG5cclxuXHRcdFx0XHRzaXRlLnRvYXN0KHRoaXMsIGVycm9yKTtcclxuXHRcdFx0fSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLmFkZGl0aW9uYWwgPSBmdW5jdGlvbihwYXJhbXMpIHt9XHJcblx0dGhpcy5wcm9jZXNzID0gZnVuY3Rpb24ob3V0cHV0KSB7fVxyXG5cclxufVxyXG5cclxuUmVtb3RlRXhlY0FjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFjdGlvbi5wcm90b3R5cGUpO1xyXG5SZW1vdGVFeGVjQWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlbW90ZUV4ZWNBY3Rpb247XHJcblxyXG5SZW1vdGVFeGVjQWN0aW9uLnRhZyA9ICdyZW1vdGVleGVjJzsiLCJpbXBvcnQge1JlbW90ZUV4ZWNBY3Rpb259IGZyb20gJy4vUmVtb3RlRXhlY0FjdGlvbic7XHJcblxyXG4vKipcclxuICogUGxheWdyb3VuZCBhY3Rpb24gdGhhdCBleGVjdXRlcyBjb2RlIGZvciBhIHF1aXogb24gYSByZW1vdGUgc3lzdGVtIGFuZCBkaXNwbGF5cyByZXN1bHRcclxuICogQHBhcmFtIHNpdGUgVGhlIHNpdGUgb2JqZWN0XHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgYXMgcGFzc2VkIHRvIHRoZSBjbGllbnRcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgUmVtb3RlUXVpekFjdGlvbiA9IGZ1bmN0aW9uKHNpdGUsIG9wdGlvbnMpIHtcclxuXHRSZW1vdGVFeGVjQWN0aW9uLmNhbGwodGhpcywgc2l0ZSwgb3B0aW9ucyk7XHJcblxyXG5cdHRoaXMuYWRkaXRpb25hbCA9IGZ1bmN0aW9uKHBhcmFtcykge1xyXG5cdFx0cGFyYW1zLmFwcFRhZyA9IG9wdGlvbnMuYXBwVGFnO1xyXG5cdFx0cGFyYW1zLm5hbWUgPSBvcHRpb25zLm5hbWU7XHJcblx0XHRwYXJhbXMuc3VjY2VzcyA9IG9wdGlvbnMuc3VjY2VzcztcclxuXHRcdHBhcmFtcy5mYWlsID0gb3B0aW9ucy5mYWlsO1xyXG5cdH1cclxuXHJcblx0dGhpcy5wcm9jZXNzID0gZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0Y29uc3QgYW5zd2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImNsLXBsYXlncm91bmQtYW5zd2VyXCJdJyk7XHJcblx0XHRjb25zdCBjb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cImNsLXBsYXlncm91bmQtY29kZVwiXScpO1xyXG5cdFx0aWYoYW5zd2VyID09PSBudWxsIHx8IGNvZGUgPT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIERvZXMgaXQgaGF2ZSBhIGZhaWx1cmUgbWF0Y2hcclxuXHRcdGlmKG9wdGlvbnMuZmFpbCAhPT0gbnVsbCkge1xyXG5cdFx0XHRjb25zdCBmYWlsID0gUmVnRXhwKG9wdGlvbnMuZmFpbCk7XHJcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGRhdGEubWF0Y2goZmFpbCk7XHJcblx0XHRcdGlmKHJlc3VsdCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdGFuc3dlci52YWx1ZSA9ICdmYWlsJztcclxuXHRcdFx0XHRjb2RlLnZhbHVlID0gZGF0YTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBEb2VzIGl0IGhhdmUgdGhlIHN1Y2Nlc3Mgc3RyaW5nIGluIGl0P1xyXG5cdFx0Y29uc3QgcmUgPSBuZXcgUmVnRXhwKG9wdGlvbnMuc3VjY2Vzcyk7XHJcblx0XHRjb25zdCByZXN1bHQgPSBkYXRhLm1hdGNoKHJlKTtcclxuXHRcdGlmKHJlc3VsdCAhPT0gbnVsbCkge1xyXG5cdFx0XHQvLyBTdWNjZXNzXHJcblx0XHRcdGFuc3dlci52YWx1ZSA9IHJlc3VsdFsxXTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIEZhaWx1cmUhXHJcblx0XHRcdGFuc3dlci52YWx1ZSA9ICdmYWlsJztcclxuXHRcdH1cclxuXHJcblx0XHRjb2RlLnZhbHVlID0gZGF0YTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5SZW1vdGVRdWl6QWN0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUmVtb3RlRXhlY0FjdGlvbi5wcm90b3R5cGUpO1xyXG5SZW1vdGVRdWl6QWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlbW90ZVF1aXpBY3Rpb247XHJcblxyXG5SZW1vdGVRdWl6QWN0aW9uLnRhZyA9ICdyZW1vdGVxdWl6JzsiLCJpbXBvcnQge1JlbW90ZUV4ZWNBY3Rpb259IGZyb20gJy4vQWN0aW9ucy9SZW1vdGVFeGVjQWN0aW9uJztcclxuaW1wb3J0IHtSZW1vdGVRdWl6QWN0aW9ufSBmcm9tICcuL0FjdGlvbnMvUmVtb3RlUXVpekFjdGlvbic7XHJcblxyXG5leHBvcnQgY29uc3QgUmVtb3RlRXhlY0ZhY3RvcnkgPSBmdW5jdGlvbigpIHt9XHJcblxyXG5SZW1vdGVFeGVjRmFjdG9yeS5jcmVhdGUgPSBmdW5jdGlvbihzaXRlKSB7XHJcblxyXG5cdGNvbnN0IFBsYXlncm91bmQgPSBzaXRlLlBsYXlncm91bmQ7XHJcblxyXG5cdFBsYXlncm91bmQuYWRkQWN0aW9uKFJlbW90ZUV4ZWNBY3Rpb24pO1xyXG5cdFBsYXlncm91bmQuYWRkQWN0aW9uKFJlbW90ZVF1aXpBY3Rpb24pO1xyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJcclxuaW1wb3J0IHtSZW1vdGVFeGVjRmFjdG9yeX0gZnJvbSAnLi9qcy9SZW1vdGVFeGVjRmFjdG9yeSc7XHJcblxyXG5SZW1vdGVFeGVjRmFjdG9yeS5jcmVhdGUoU2l0ZS5zaXRlKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==