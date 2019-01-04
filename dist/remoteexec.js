(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RemoteExec"] = factory();
	else
		root["RemoteExec"] = factory();
})(window, function() {
return (window["webpackJsonp_name_"] = window["webpackJsonp_name_"] || []).push([["RemoteExec"],{

/***/ "./vendor/cl/remoteexec/index.js":
/*!***************************************!*\
  !*** ./vendor/cl/remoteexec/index.js ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_RemoteExecFactory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/RemoteExecFactory */ "./vendor/cl/remoteexec/js/RemoteExecFactory.js");

_js_RemoteExecFactory__WEBPACK_IMPORTED_MODULE_0__["RemoteExecFactory"].create(Site.site);

/***/ }),

/***/ "./vendor/cl/remoteexec/js/Actions/RemoteExecAction.js":
/*!*************************************************************!*\
  !*** ./vendor/cl/remoteexec/js/Actions/RemoteExecAction.js ***!
  \*************************************************************/
/*! exports provided: RemoteExecAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RemoteExecAction", function() { return RemoteExecAction; });
var Action = Site.Playground.Action;
var RemoteExecAction = function RemoteExecAction(site, options) {
  Action.call(this, site, options);

  this.click = function (main) {
    var _this = this;

    // Get the requisite tab contents
    var sources = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = options.sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var source = _step.value;
        var tab = main.getTab(source);

        if (tab !== null) {
          sources[source] = tab.get();
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var params = {
      sources: sources,
      ssh: options.ssh
    };
    site.api.post('/api/remoteexec/exec', params).then(function (response) {
      console.log(response);

      if (!response.hasError()) {
        var data = response.getData('remoteexec-result').attributes;
        var output = main.getTab('output');

        if (output !== null) {
          output.set(data);
        }
      } else {
        site.toast(_this, response);
      }
    }).catch(function (error) {
      site.toast(_this, error);
    });
  };
};
RemoteExecAction.prototype = Object.create(Action.prototype);
RemoteExecAction.prototype.constructor = RemoteExecAction;
RemoteExecAction.tag = 'remoteexec';

/***/ }),

/***/ "./vendor/cl/remoteexec/js/RemoteExecFactory.js":
/*!******************************************************!*\
  !*** ./vendor/cl/remoteexec/js/RemoteExecFactory.js ***!
  \******************************************************/
/*! exports provided: RemoteExecFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RemoteExecFactory", function() { return RemoteExecFactory; });
/* harmony import */ var _Actions_RemoteExecAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Actions/RemoteExecAction */ "./vendor/cl/remoteexec/js/Actions/RemoteExecAction.js");

var RemoteExecFactory = function RemoteExecFactory() {};

RemoteExecFactory.create = function (site) {
  var Playground = site.Playground;
  Playground.addAction(_Actions_RemoteExecAction__WEBPACK_IMPORTED_MODULE_0__["RemoteExecAction"]);
};

/***/ })

},[["./vendor/cl/remoteexec/index.js","runtime"]]]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC9yZW1vdGVleGVjL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8uL3ZlbmRvci9jbC9yZW1vdGVleGVjL2pzL0FjdGlvbnMvUmVtb3RlRXhlY0FjdGlvbi5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi92ZW5kb3IvY2wvcmVtb3RlZXhlYy9qcy9SZW1vdGVFeGVjRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJSZW1vdGVFeGVjRmFjdG9yeSIsImNyZWF0ZSIsIlNpdGUiLCJzaXRlIiwiQWN0aW9uIiwiUGxheWdyb3VuZCIsIlJlbW90ZUV4ZWNBY3Rpb24iLCJvcHRpb25zIiwiY2FsbCIsImNsaWNrIiwibWFpbiIsInNvdXJjZXMiLCJzb3VyY2UiLCJ0YWIiLCJnZXRUYWIiLCJnZXQiLCJwYXJhbXMiLCJzc2giLCJhcGkiLCJwb3N0IiwidGhlbiIsInJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsImhhc0Vycm9yIiwiZGF0YSIsImdldERhdGEiLCJhdHRyaWJ1dGVzIiwib3V0cHV0Iiwic2V0IiwidG9hc3QiLCJjYXRjaCIsImVycm9yIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY29uc3RydWN0b3IiLCJ0YWciLCJhZGRBY3Rpb24iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7O0FDVEE7QUFBQTtBQUFBO0FBRUFBLHVFQUFpQixDQUFDQyxNQUFsQixDQUF5QkMsSUFBSSxDQUFDQyxJQUE5QixFOzs7Ozs7Ozs7Ozs7QUNIQTtBQUFBO0FBQUEsSUFBTUMsTUFBTSxHQUFHRixJQUFJLENBQUNHLFVBQUwsQ0FBZ0JELE1BQS9CO0FBRU8sSUFBTUUsZ0JBQWdCLEdBQUcsU0FBbkJBLGdCQUFtQixDQUFTSCxJQUFULEVBQWVJLE9BQWYsRUFBd0I7QUFDdkRILFFBQU0sQ0FBQ0ksSUFBUCxDQUFZLElBQVosRUFBa0JMLElBQWxCLEVBQXdCSSxPQUF4Qjs7QUFFQSxPQUFLRSxLQUFMLEdBQWEsVUFBU0MsSUFBVCxFQUFlO0FBQUE7O0FBQzNCO0FBQ0EsUUFBTUMsT0FBTyxHQUFHLEVBQWhCO0FBRjJCO0FBQUE7QUFBQTs7QUFBQTtBQUkzQiwyQkFBb0JKLE9BQU8sQ0FBQ0ksT0FBNUIsOEhBQXFDO0FBQUEsWUFBM0JDLE1BQTJCO0FBQ3BDLFlBQU1DLEdBQUcsR0FBR0gsSUFBSSxDQUFDSSxNQUFMLENBQVlGLE1BQVosQ0FBWjs7QUFDQSxZQUFHQyxHQUFHLEtBQUssSUFBWCxFQUFpQjtBQUNoQkYsaUJBQU8sQ0FBQ0MsTUFBRCxDQUFQLEdBQWtCQyxHQUFHLENBQUNFLEdBQUosRUFBbEI7QUFDQTtBQUNEO0FBVDBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBVzNCLFFBQU1DLE1BQU0sR0FBRztBQUNkTCxhQUFPLEVBQUVBLE9BREs7QUFFZE0sU0FBRyxFQUFFVixPQUFPLENBQUNVO0FBRkMsS0FBZjtBQUtBZCxRQUFJLENBQUNlLEdBQUwsQ0FBU0MsSUFBVCxDQUFjLHNCQUFkLEVBQXNDSCxNQUF0QyxFQUNFSSxJQURGLENBQ08sVUFBQ0MsUUFBRCxFQUFjO0FBQ25CQyxhQUFPLENBQUNDLEdBQVIsQ0FBWUYsUUFBWjs7QUFDQSxVQUFJLENBQUNBLFFBQVEsQ0FBQ0csUUFBVCxFQUFMLEVBQTBCO0FBQ3pCLFlBQU1DLElBQUksR0FBR0osUUFBUSxDQUFDSyxPQUFULENBQWlCLG1CQUFqQixFQUFzQ0MsVUFBbkQ7QUFDQSxZQUFNQyxNQUFNLEdBQUdsQixJQUFJLENBQUNJLE1BQUwsQ0FBWSxRQUFaLENBQWY7O0FBQ0EsWUFBR2MsTUFBTSxLQUFLLElBQWQsRUFBb0I7QUFDbkJBLGdCQUFNLENBQUNDLEdBQVAsQ0FBV0osSUFBWDtBQUNBO0FBQ0QsT0FORCxNQU1PO0FBQ050QixZQUFJLENBQUMyQixLQUFMLENBQVcsS0FBWCxFQUFpQlQsUUFBakI7QUFDQTtBQUVELEtBYkYsRUFjRVUsS0FkRixDQWNRLFVBQUNDLEtBQUQsRUFBVztBQUNqQjdCLFVBQUksQ0FBQzJCLEtBQUwsQ0FBVyxLQUFYLEVBQWlCRSxLQUFqQjtBQUNBLEtBaEJGO0FBaUJBLEdBakNEO0FBa0NBLENBckNNO0FBdUNQMUIsZ0JBQWdCLENBQUMyQixTQUFqQixHQUE2QkMsTUFBTSxDQUFDakMsTUFBUCxDQUFjRyxNQUFNLENBQUM2QixTQUFyQixDQUE3QjtBQUNBM0IsZ0JBQWdCLENBQUMyQixTQUFqQixDQUEyQkUsV0FBM0IsR0FBeUM3QixnQkFBekM7QUFFQUEsZ0JBQWdCLENBQUM4QixHQUFqQixHQUF1QixZQUF2QixDOzs7Ozs7Ozs7Ozs7QUM1Q0E7QUFBQTtBQUFBO0FBQUE7QUFFTyxJQUFNcEMsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFvQixHQUFXLENBQUUsQ0FBdkM7O0FBRVBBLGlCQUFpQixDQUFDQyxNQUFsQixHQUEyQixVQUFTRSxJQUFULEVBQWU7QUFFekMsTUFBTUUsVUFBVSxHQUFHRixJQUFJLENBQUNFLFVBQXhCO0FBQ0FBLFlBQVUsQ0FBQ2dDLFNBQVgsQ0FBcUIvQiwwRUFBckI7QUFDQSxDQUpELEMiLCJmaWxlIjoicmVtb3RlZXhlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlJlbW90ZUV4ZWNcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiUmVtb3RlRXhlY1wiXSA9IGZhY3RvcnkoKTtcbn0pKHdpbmRvdywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiXHJcbmltcG9ydCB7UmVtb3RlRXhlY0ZhY3Rvcnl9IGZyb20gJy4vanMvUmVtb3RlRXhlY0ZhY3RvcnknO1xyXG5cclxuUmVtb3RlRXhlY0ZhY3RvcnkuY3JlYXRlKFNpdGUuc2l0ZSk7XHJcbiIsImNvbnN0IEFjdGlvbiA9IFNpdGUuUGxheWdyb3VuZC5BY3Rpb247XHJcblxyXG5leHBvcnQgY29uc3QgUmVtb3RlRXhlY0FjdGlvbiA9IGZ1bmN0aW9uKHNpdGUsIG9wdGlvbnMpIHtcclxuXHRBY3Rpb24uY2FsbCh0aGlzLCBzaXRlLCBvcHRpb25zKTtcclxuXHJcblx0dGhpcy5jbGljayA9IGZ1bmN0aW9uKG1haW4pIHtcclxuXHRcdC8vIEdldCB0aGUgcmVxdWlzaXRlIHRhYiBjb250ZW50c1xyXG5cdFx0Y29uc3Qgc291cmNlcyA9IHt9O1xyXG5cclxuXHRcdGZvcihjb25zdCBzb3VyY2Ugb2Ygb3B0aW9ucy5zb3VyY2VzKSB7XHJcblx0XHRcdGNvbnN0IHRhYiA9IG1haW4uZ2V0VGFiKHNvdXJjZSk7XHJcblx0XHRcdGlmKHRhYiAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdHNvdXJjZXNbc291cmNlXSA9IHRhYi5nZXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHBhcmFtcyA9IHtcclxuXHRcdFx0c291cmNlczogc291cmNlcyxcclxuXHRcdFx0c3NoOiBvcHRpb25zLnNzaFxyXG5cdFx0fTtcclxuXHJcblx0XHRzaXRlLmFwaS5wb3N0KCcvYXBpL3JlbW90ZWV4ZWMvZXhlYycsIHBhcmFtcylcclxuXHRcdFx0LnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0XHRcdGlmICghcmVzcG9uc2UuaGFzRXJyb3IoKSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgZGF0YSA9IHJlc3BvbnNlLmdldERhdGEoJ3JlbW90ZWV4ZWMtcmVzdWx0JykuYXR0cmlidXRlcztcclxuXHRcdFx0XHRcdGNvbnN0IG91dHB1dCA9IG1haW4uZ2V0VGFiKCdvdXRwdXQnKTtcclxuXHRcdFx0XHRcdGlmKG91dHB1dCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRvdXRwdXQuc2V0KGRhdGEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzaXRlLnRvYXN0KHRoaXMsIHJlc3BvbnNlKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9KVxyXG5cdFx0XHQuY2F0Y2goKGVycm9yKSA9PiB7XHJcblx0XHRcdFx0c2l0ZS50b2FzdCh0aGlzLCBlcnJvcik7XHJcblx0XHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxuUmVtb3RlRXhlY0FjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFjdGlvbi5wcm90b3R5cGUpO1xyXG5SZW1vdGVFeGVjQWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlbW90ZUV4ZWNBY3Rpb247XHJcblxyXG5SZW1vdGVFeGVjQWN0aW9uLnRhZyA9ICdyZW1vdGVleGVjJzsiLCJpbXBvcnQge1JlbW90ZUV4ZWNBY3Rpb259IGZyb20gJy4vQWN0aW9ucy9SZW1vdGVFeGVjQWN0aW9uJztcclxuXHJcbmV4cG9ydCBjb25zdCBSZW1vdGVFeGVjRmFjdG9yeSA9IGZ1bmN0aW9uKCkge31cclxuXHJcblJlbW90ZUV4ZWNGYWN0b3J5LmNyZWF0ZSA9IGZ1bmN0aW9uKHNpdGUpIHtcclxuXHJcblx0Y29uc3QgUGxheWdyb3VuZCA9IHNpdGUuUGxheWdyb3VuZDtcclxuXHRQbGF5Z3JvdW5kLmFkZEFjdGlvbihSZW1vdGVFeGVjQWN0aW9uKTtcclxufSJdLCJzb3VyY2VSb290IjoiIn0=