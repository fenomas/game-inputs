/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./demo.js":
/*!*****************!*\
  !*** ./demo.js ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_inputs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/inputs.js */ \"../src/inputs.js\");\n\n\n\nvar container = document.querySelector('#registeredElement')\nvar inputs = new _src_inputs_js__WEBPACK_IMPORTED_MODULE_0__.GameInputs(container, {\n    preventDefaults: true,\n    stopPropagation: true,\n})\nwindow.inputs = inputs\n\n\n\n// example bindings\ninputs.bind('move-left', 'KeyA', 'ArrowLeft')\ninputs.bind('move-right', 'KeyD', 'ArrowRight')\ninputs.bind('fire', 'Mouse1', 'Space')\ninputs.bind('alt-fire', 'Mouse3')\n\n\n\nvar allBindings = inputs.getBindings()\nvar allKeys = []\nfor (var bindingName in allBindings) {\n    inputs.down.on(bindingName, ev => showOutput(bindingName, true))\n    inputs.up.on(bindingName, ev => showOutput(bindingName, false))\n    allBindings[bindingName].forEach(key => {\n        if (!(allKeys.includes(key))) allKeys.push(key)\n    })\n}\n\n// in real game code you'd do something like:\n// inputs.down.on('move-left', () => movePlayerLeft())\n\n\n\n\n\n// Example page HTML stuff\nfunction addDiv(txt, html, className) {\n    var div = document.createElement('div')\n    if (html) div.innerHTML = txt\n    else div.textContent = txt\n    container.appendChild(div)\n    div.classList.add(className || '')\n    return div\n}\n\naddDiv('The following keys are bound:', true, 'heading')\nvar lockKeys = addDiv('', true, 'content')\nlockKeys.innerHTML = allKeys.join(', ')\n\naddDiv('Pointer lock element:', false, 'heading')\nvar lockTarget = addDiv('click to lock', false, 'content')\nlockTarget.classList.add('pointer-lock-target')\n\naddDiv('Most recent event:', true, 'heading')\nvar textarea = document.createElement('textarea')\ntextarea.style.width = \"350px\"\ntextarea.style.height = \"30px\"\ntextarea.classList.add('content')\ncontainer.appendChild(textarea)\n\naddDiv('Current values in \"inputs.state\" object:', true, 'heading')\nvar stateDiv = addDiv('', true, 'content')\n\naddDiv('Current values in \"inputs.pointerState\" object:', true, 'heading')\nvar pointerStateDiv = addDiv('', true, 'content')\n\nfunction showOutput(bindingName, pressed) {\n    var state = pressed ? 'pressed' : 'released'\n    textarea.value = `Binding \"${bindingName}\" -> ${state}`\n    showState()\n}\n\nfunction stateObjToDiv(obj, div) {\n    div.innerHTML = Object.keys(obj).map(key => {\n        var val = obj[key]\n        if (!(val === 0 || val === false)) val = `<span class=\"highlight\">${val}</span>`\n        return `${key}: ${val}`\n    }).join('<br>')\n}\n\nfunction showState() {\n    stateObjToDiv(inputs.state, stateDiv)\n    stateObjToDiv(inputs.pointerState, pointerStateDiv)\n    inputs.tick()\n}\nsetInterval(showState, 250)\n\n\n// pointer lock stuff\nvar locked = false\ndocument.addEventListener('pointerlockchange', function (ev) {\n    locked = document.pointerLockElement === lockTarget\n    lockTarget.textContent = (locked) ? '(locked)' : 'click to lock'\n})\nlockTarget.addEventListener('mousedown', function (ev) {\n    if (!locked) lockTarget.requestPointerLock()\n    else document.exitPointerLock\n})\n\n\n// for grabbing key code strings\n\naddDiv('Info - last physical key event code:', true, 'heading')\nvar keyCodeDiv = addDiv('&nbsp;', true, 'content')\ndocument.onkeydown = (ev => {\n    keyCodeDiv.innerHTML = ev.code\n})\n\n\n\n\n//# sourceURL=webpack:///./demo.js?");

/***/ }),

/***/ "../node_modules/events/events.js":
/*!****************************************!*\
  !*** ../node_modules/events/events.js ***!
  \****************************************/
/***/ ((module) => {

eval("// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\n\n\nvar R = typeof Reflect === 'object' ? Reflect : null\nvar ReflectApply = R && typeof R.apply === 'function'\n  ? R.apply\n  : function ReflectApply(target, receiver, args) {\n    return Function.prototype.apply.call(target, receiver, args);\n  }\n\nvar ReflectOwnKeys\nif (R && typeof R.ownKeys === 'function') {\n  ReflectOwnKeys = R.ownKeys\n} else if (Object.getOwnPropertySymbols) {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target)\n      .concat(Object.getOwnPropertySymbols(target));\n  };\n} else {\n  ReflectOwnKeys = function ReflectOwnKeys(target) {\n    return Object.getOwnPropertyNames(target);\n  };\n}\n\nfunction ProcessEmitWarning(warning) {\n  if (console && console.warn) console.warn(warning);\n}\n\nvar NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {\n  return value !== value;\n}\n\nfunction EventEmitter() {\n  EventEmitter.init.call(this);\n}\nmodule.exports = EventEmitter;\nmodule.exports.once = once;\n\n// Backwards-compat with node 0.10.x\nEventEmitter.EventEmitter = EventEmitter;\n\nEventEmitter.prototype._events = undefined;\nEventEmitter.prototype._eventsCount = 0;\nEventEmitter.prototype._maxListeners = undefined;\n\n// By default EventEmitters will print a warning if more than 10 listeners are\n// added to it. This is a useful default which helps finding memory leaks.\nvar defaultMaxListeners = 10;\n\nfunction checkListener(listener) {\n  if (typeof listener !== 'function') {\n    throw new TypeError('The \"listener\" argument must be of type Function. Received type ' + typeof listener);\n  }\n}\n\nObject.defineProperty(EventEmitter, 'defaultMaxListeners', {\n  enumerable: true,\n  get: function() {\n    return defaultMaxListeners;\n  },\n  set: function(arg) {\n    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {\n      throw new RangeError('The value of \"defaultMaxListeners\" is out of range. It must be a non-negative number. Received ' + arg + '.');\n    }\n    defaultMaxListeners = arg;\n  }\n});\n\nEventEmitter.init = function() {\n\n  if (this._events === undefined ||\n      this._events === Object.getPrototypeOf(this)._events) {\n    this._events = Object.create(null);\n    this._eventsCount = 0;\n  }\n\n  this._maxListeners = this._maxListeners || undefined;\n};\n\n// Obviously not all Emitters should be limited to 10. This function allows\n// that to be increased. Set to zero for unlimited.\nEventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {\n  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {\n    throw new RangeError('The value of \"n\" is out of range. It must be a non-negative number. Received ' + n + '.');\n  }\n  this._maxListeners = n;\n  return this;\n};\n\nfunction _getMaxListeners(that) {\n  if (that._maxListeners === undefined)\n    return EventEmitter.defaultMaxListeners;\n  return that._maxListeners;\n}\n\nEventEmitter.prototype.getMaxListeners = function getMaxListeners() {\n  return _getMaxListeners(this);\n};\n\nEventEmitter.prototype.emit = function emit(type) {\n  var args = [];\n  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);\n  var doError = (type === 'error');\n\n  var events = this._events;\n  if (events !== undefined)\n    doError = (doError && events.error === undefined);\n  else if (!doError)\n    return false;\n\n  // If there is no 'error' event listener then throw.\n  if (doError) {\n    var er;\n    if (args.length > 0)\n      er = args[0];\n    if (er instanceof Error) {\n      // Note: The comments on the `throw` lines are intentional, they show\n      // up in Node's output if this results in an unhandled exception.\n      throw er; // Unhandled 'error' event\n    }\n    // At least give some kind of context to the user\n    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));\n    err.context = er;\n    throw err; // Unhandled 'error' event\n  }\n\n  var handler = events[type];\n\n  if (handler === undefined)\n    return false;\n\n  if (typeof handler === 'function') {\n    ReflectApply(handler, this, args);\n  } else {\n    var len = handler.length;\n    var listeners = arrayClone(handler, len);\n    for (var i = 0; i < len; ++i)\n      ReflectApply(listeners[i], this, args);\n  }\n\n  return true;\n};\n\nfunction _addListener(target, type, listener, prepend) {\n  var m;\n  var events;\n  var existing;\n\n  checkListener(listener);\n\n  events = target._events;\n  if (events === undefined) {\n    events = target._events = Object.create(null);\n    target._eventsCount = 0;\n  } else {\n    // To avoid recursion in the case that type === \"newListener\"! Before\n    // adding it to the listeners, first emit \"newListener\".\n    if (events.newListener !== undefined) {\n      target.emit('newListener', type,\n                  listener.listener ? listener.listener : listener);\n\n      // Re-assign `events` because a newListener handler could have caused the\n      // this._events to be assigned to a new object\n      events = target._events;\n    }\n    existing = events[type];\n  }\n\n  if (existing === undefined) {\n    // Optimize the case of one listener. Don't need the extra array object.\n    existing = events[type] = listener;\n    ++target._eventsCount;\n  } else {\n    if (typeof existing === 'function') {\n      // Adding the second element, need to change to array.\n      existing = events[type] =\n        prepend ? [listener, existing] : [existing, listener];\n      // If we've already got an array, just append.\n    } else if (prepend) {\n      existing.unshift(listener);\n    } else {\n      existing.push(listener);\n    }\n\n    // Check for listener leak\n    m = _getMaxListeners(target);\n    if (m > 0 && existing.length > m && !existing.warned) {\n      existing.warned = true;\n      // No error code for this since it is a Warning\n      // eslint-disable-next-line no-restricted-syntax\n      var w = new Error('Possible EventEmitter memory leak detected. ' +\n                          existing.length + ' ' + String(type) + ' listeners ' +\n                          'added. Use emitter.setMaxListeners() to ' +\n                          'increase limit');\n      w.name = 'MaxListenersExceededWarning';\n      w.emitter = target;\n      w.type = type;\n      w.count = existing.length;\n      ProcessEmitWarning(w);\n    }\n  }\n\n  return target;\n}\n\nEventEmitter.prototype.addListener = function addListener(type, listener) {\n  return _addListener(this, type, listener, false);\n};\n\nEventEmitter.prototype.on = EventEmitter.prototype.addListener;\n\nEventEmitter.prototype.prependListener =\n    function prependListener(type, listener) {\n      return _addListener(this, type, listener, true);\n    };\n\nfunction onceWrapper() {\n  if (!this.fired) {\n    this.target.removeListener(this.type, this.wrapFn);\n    this.fired = true;\n    if (arguments.length === 0)\n      return this.listener.call(this.target);\n    return this.listener.apply(this.target, arguments);\n  }\n}\n\nfunction _onceWrap(target, type, listener) {\n  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };\n  var wrapped = onceWrapper.bind(state);\n  wrapped.listener = listener;\n  state.wrapFn = wrapped;\n  return wrapped;\n}\n\nEventEmitter.prototype.once = function once(type, listener) {\n  checkListener(listener);\n  this.on(type, _onceWrap(this, type, listener));\n  return this;\n};\n\nEventEmitter.prototype.prependOnceListener =\n    function prependOnceListener(type, listener) {\n      checkListener(listener);\n      this.prependListener(type, _onceWrap(this, type, listener));\n      return this;\n    };\n\n// Emits a 'removeListener' event if and only if the listener was removed.\nEventEmitter.prototype.removeListener =\n    function removeListener(type, listener) {\n      var list, events, position, i, originalListener;\n\n      checkListener(listener);\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      list = events[type];\n      if (list === undefined)\n        return this;\n\n      if (list === listener || list.listener === listener) {\n        if (--this._eventsCount === 0)\n          this._events = Object.create(null);\n        else {\n          delete events[type];\n          if (events.removeListener)\n            this.emit('removeListener', type, list.listener || listener);\n        }\n      } else if (typeof list !== 'function') {\n        position = -1;\n\n        for (i = list.length - 1; i >= 0; i--) {\n          if (list[i] === listener || list[i].listener === listener) {\n            originalListener = list[i].listener;\n            position = i;\n            break;\n          }\n        }\n\n        if (position < 0)\n          return this;\n\n        if (position === 0)\n          list.shift();\n        else {\n          spliceOne(list, position);\n        }\n\n        if (list.length === 1)\n          events[type] = list[0];\n\n        if (events.removeListener !== undefined)\n          this.emit('removeListener', type, originalListener || listener);\n      }\n\n      return this;\n    };\n\nEventEmitter.prototype.off = EventEmitter.prototype.removeListener;\n\nEventEmitter.prototype.removeAllListeners =\n    function removeAllListeners(type) {\n      var listeners, events, i;\n\n      events = this._events;\n      if (events === undefined)\n        return this;\n\n      // not listening for removeListener, no need to emit\n      if (events.removeListener === undefined) {\n        if (arguments.length === 0) {\n          this._events = Object.create(null);\n          this._eventsCount = 0;\n        } else if (events[type] !== undefined) {\n          if (--this._eventsCount === 0)\n            this._events = Object.create(null);\n          else\n            delete events[type];\n        }\n        return this;\n      }\n\n      // emit removeListener for all listeners on all events\n      if (arguments.length === 0) {\n        var keys = Object.keys(events);\n        var key;\n        for (i = 0; i < keys.length; ++i) {\n          key = keys[i];\n          if (key === 'removeListener') continue;\n          this.removeAllListeners(key);\n        }\n        this.removeAllListeners('removeListener');\n        this._events = Object.create(null);\n        this._eventsCount = 0;\n        return this;\n      }\n\n      listeners = events[type];\n\n      if (typeof listeners === 'function') {\n        this.removeListener(type, listeners);\n      } else if (listeners !== undefined) {\n        // LIFO order\n        for (i = listeners.length - 1; i >= 0; i--) {\n          this.removeListener(type, listeners[i]);\n        }\n      }\n\n      return this;\n    };\n\nfunction _listeners(target, type, unwrap) {\n  var events = target._events;\n\n  if (events === undefined)\n    return [];\n\n  var evlistener = events[type];\n  if (evlistener === undefined)\n    return [];\n\n  if (typeof evlistener === 'function')\n    return unwrap ? [evlistener.listener || evlistener] : [evlistener];\n\n  return unwrap ?\n    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);\n}\n\nEventEmitter.prototype.listeners = function listeners(type) {\n  return _listeners(this, type, true);\n};\n\nEventEmitter.prototype.rawListeners = function rawListeners(type) {\n  return _listeners(this, type, false);\n};\n\nEventEmitter.listenerCount = function(emitter, type) {\n  if (typeof emitter.listenerCount === 'function') {\n    return emitter.listenerCount(type);\n  } else {\n    return listenerCount.call(emitter, type);\n  }\n};\n\nEventEmitter.prototype.listenerCount = listenerCount;\nfunction listenerCount(type) {\n  var events = this._events;\n\n  if (events !== undefined) {\n    var evlistener = events[type];\n\n    if (typeof evlistener === 'function') {\n      return 1;\n    } else if (evlistener !== undefined) {\n      return evlistener.length;\n    }\n  }\n\n  return 0;\n}\n\nEventEmitter.prototype.eventNames = function eventNames() {\n  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];\n};\n\nfunction arrayClone(arr, n) {\n  var copy = new Array(n);\n  for (var i = 0; i < n; ++i)\n    copy[i] = arr[i];\n  return copy;\n}\n\nfunction spliceOne(list, index) {\n  for (; index + 1 < list.length; index++)\n    list[index] = list[index + 1];\n  list.pop();\n}\n\nfunction unwrapListeners(arr) {\n  var ret = new Array(arr.length);\n  for (var i = 0; i < ret.length; ++i) {\n    ret[i] = arr[i].listener || arr[i];\n  }\n  return ret;\n}\n\nfunction once(emitter, name) {\n  return new Promise(function (resolve, reject) {\n    function errorListener(err) {\n      emitter.removeListener(name, resolver);\n      reject(err);\n    }\n\n    function resolver() {\n      if (typeof emitter.removeListener === 'function') {\n        emitter.removeListener('error', errorListener);\n      }\n      resolve([].slice.call(arguments));\n    };\n\n    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });\n    if (name !== 'error') {\n      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });\n    }\n  });\n}\n\nfunction addErrorHandlerIfEventEmitter(emitter, handler, flags) {\n  if (typeof emitter.on === 'function') {\n    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);\n  }\n}\n\nfunction eventTargetAgnosticAddListener(emitter, name, listener, flags) {\n  if (typeof emitter.on === 'function') {\n    if (flags.once) {\n      emitter.once(name, listener);\n    } else {\n      emitter.on(name, listener);\n    }\n  } else if (typeof emitter.addEventListener === 'function') {\n    // EventTarget does not have `error` event semantics like Node\n    // EventEmitters, we do not listen for `error` events here.\n    emitter.addEventListener(name, function wrapListener(arg) {\n      // IE does not have builtin `{ once: true }` support so we\n      // have to do it manually.\n      if (flags.once) {\n        emitter.removeEventListener(name, wrapListener);\n      }\n      listener(arg);\n    });\n  } else {\n    throw new TypeError('The \"emitter\" argument must be of type EventEmitter. Received type ' + typeof emitter);\n  }\n}\n\n\n//# sourceURL=webpack:///../node_modules/events/events.js?");

/***/ }),

/***/ "../src/inputs.js":
/*!************************!*\
  !*** ../src/inputs.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameInputs\": () => (/* binding */ GameInputs)\n/* harmony export */ });\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ \"../node_modules/events/events.js\");\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../package.json */ \"../package.json\");\n\n\n\n\nvar version = _package_json__WEBPACK_IMPORTED_MODULE_1__.version\n\n\nfunction DefaultOptions() {\n    this.preventDefaults = false\n    this.stopPropagation = false\n    this.allowContextMenu = false\n    this.disabled = false\n}\n\n\nclass GameInputs {\n\n    /**\n     *   Simple inputs manager to abstract key/mouse inputs.\n     * \n     * @param {HTMLElement} domElement\n     * @param {DefaultOptions} options\n    */\n\n    constructor(domElement, options) {\n        var opts = Object.assign({}, new DefaultOptions(), options || {})\n\n        // settings\n        /** The HTMLElement that `inputs` is bound to. */\n        this.element = domElement || document\n        /** When true, all key events with bindings will call `preventDefaults`. */\n        this.preventDefaults = !!opts.preventDefaults\n        /** When true, all key events with bindings will call `stopPropagation`. */\n        this.stopPropagation = !!opts.stopPropagation\n        /** When this is false, the context menu will be prevented from opening if there is a binding to the right mouse button. */\n        this.allowContextMenu = !!opts.allowContextMenu\n        /** When disabled, no binding events will fire. */\n        this.disabled = !!opts.disabled\n\n        this.version = version\n\n        // emitters\n        /** \n         * Event emitter for binding **press** events.  \n         * The original mouse or key event will be passed as an argument.\n        */\n        this.down = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter()\n        /** \n         * Event emitter for binding **release** events.  \n         * The original mouse or key event will be passed as an argument.\n         */\n        this.up = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter()\n\n        /** \n         * The boolean state of whether each binding is currently pressed.\n         * \n         * `inputs.state['move-left'] // true if a bound key is pressed`\n         * @type {Object.<string, boolean>} \n        */\n        this.state = {}\n\n        /** \n         * Numeric counters representing accumulated pointer/scroll inputs \n         * since the last time `tick` was called.\n        */\n        this.pointerState = {\n            dx: 0,\n            dy: 0,\n            scrollx: 0,\n            scrolly: 0,\n            scrollz: 0,\n        }\n\n        /** \n         * How many times each binding has been **pressed** \n         * since the last time `tick` was called.\n         * @type {Object.<string, number>}\n        */\n        this.pressCount = {}\n\n        /** \n         * How many times each binding has been **released** \n         * since the last time `tick` was called.\n         * @type {Object.<string, number>}\n        */\n        this.releaseCount = {}\n\n\n\n        // internal state\n        /** @private @type {Object.<string, string[]>}   code -> [...binding names] */\n        this._keyBindmap = {}\n        /** @private @type {Object.<string, boolean>} code -> isDown */\n        this._keyStates = {}\n        /** @private @type {Object.<string, number>}  bindingName -> currCt */\n        this._bindPressCount = {}\n        /** @private */\n        this._touches = { lastX: 0, lastY: 0, currID: null }\n\n\n        // register for ALL THE dom events\n        if (document.readyState === 'complete') {\n            initEvents(this)\n        } else {\n            document.addEventListener('DOMContentLoaded', ev => {\n                initEvents(this)\n            }, { once: true })\n        }\n    }\n\n\n    /**\n     * Binds one or more physical keys to an arbitrary binding name.\n     * Key strings should align to `KeyboardEvent.code` strings - \n     * e.g. `KeyA`, `ArrowDown`, etc.\n     * \n     * `inputs.bind('move-player-left', 'KeyW', 'ArrowLeft')\n     * \n     * @param {string} bindingName \n     * @param {...string} keys \n     */\n    bind(bindingName, ...keys) {\n        keys.forEach(code => {\n            var bindings = this._keyBindmap[code] || []\n            if (bindings.includes(bindingName)) return\n            bindings.push(bindingName)\n            this._keyBindmap[code] = bindings\n        })\n        this.state[bindingName] = !!this.state[bindingName]\n        this.pressCount[bindingName] = this.pressCount[bindingName] || 0\n        this.releaseCount[bindingName] = this.releaseCount[bindingName] || 0\n    }\n\n\n    /**\n     * Removes all key bindings for a given binding name.\n     * \n     * `inputs.unbind('move-player-left')\n     */\n    unbind(bindingName) {\n        for (var code in this._keyBindmap) {\n            var bindings = this._keyBindmap[code]\n            var i = bindings.indexOf(bindingName)\n            if (i > -1) { bindings.splice(i, 1) }\n        }\n    }\n\n    /**\n     * Returns a copy of all existing bindings, in the format:\n     * ```js\n     *   {\n     *      bindingName: [ keyCode1, keyCode2, ... ]\n     *      ...\n     *   }\n     * ```\n     */\n    getBindings() {\n        var res = {}\n        for (var code in this._keyBindmap) {\n            var bindings = this._keyBindmap[code]\n            bindings.forEach(bindingName => {\n                res[bindingName] = res[bindingName] || []\n                res[bindingName].push(code)\n            })\n        }\n        return res\n    }\n\n\n    /**\n     * Tick function - clears out all cumulative counters\n    */\n    tick() {\n        zeroAllProperties(this.pointerState)\n        zeroAllProperties(this.pressCount)\n        zeroAllProperties(this.releaseCount)\n    }\n}\n\nfunction zeroAllProperties(obj) {\n    for (var key in obj) obj[key] = 0\n}\n\n\n\n\n\n\n/*\n *\n *   PRIVATE FUNCTIONS\n *\n*/\n\n/** @param {GameInputs} inputs */\nfunction initEvents(inputs) {\n    // keys\n    window.addEventListener('keydown', onKeyEvent.bind(null, inputs, true), false)\n    window.addEventListener('keyup', onKeyEvent.bind(null, inputs, false), false)\n\n    // pointer/mouse events\n    var pointerOpts = { passive: true }\n    if (window.PointerEvent) {\n        inputs.element.addEventListener(\"pointerdown\", onPointerEvent.bind(null, inputs, true), pointerOpts)\n        window.document.addEventListener(\"pointerup\", onPointerEvent.bind(null, inputs, false), pointerOpts)\n        inputs.element.addEventListener(\"pointermove\", onPointerMove.bind(null, inputs), pointerOpts)\n    } else {\n        inputs.element.addEventListener(\"mousedown\", onPointerEvent.bind(null, inputs, true), pointerOpts)\n        window.document.addEventListener(\"mouseup\", onPointerEvent.bind(null, inputs, false), pointerOpts)\n        inputs.element.addEventListener(\"mousemove\", onPointerMove.bind(null, inputs), pointerOpts)\n    }\n    inputs.element.addEventListener(\"wheel\", onWheelEvent.bind(null, inputs), pointerOpts)\n    inputs.element.addEventListener(\"contextmenu\", onContextMenu.bind(null, inputs), false)\n\n    // doc-level blur event for edge cases\n    window.addEventListener(\"blur\", onWindowBlur.bind(null, inputs), false)\n}\n\n\n\n\n\n/*\n *\n *\n *      INTERNALS - DOM EVENT HANDLERS\n *\n *\n*/\n\nfunction onKeyEvent(inputs, nowDown, ev) {\n    handleKeyEvent(ev.code, nowDown, inputs, ev)\n}\n\nfunction onPointerEvent(inputs, nowDown, ev) {\n    // if pointer events supported, only track the first\n    if ('pointerId' in ev) {\n        if (nowDown) {\n            if (inputs._touches.currID !== null) return\n            inputs._touches.currID = ev.pointerId\n        } else {\n            if (inputs._touches.currID !== ev.pointerId) return\n            inputs._touches.currID = null\n        }\n    }\n    var button = ('button' in ev) ? (ev.button + 1) : 1\n    handleKeyEvent('Mouse' + button, nowDown, inputs, ev)\n    return false\n}\n\nfunction onPointerMove(inputs, ev) {\n    // if a touch exists, ignore movement of other touches\n    if ('pointerId' in ev && inputs._touches.currID !== null) {\n        if (inputs._touches.currID !== ev.pointerId) return\n    }\n    // fire no events, just expose the state data\n    var dx = ev.movementX || ev.mozMovementX || 0,\n        dy = ev.movementY || ev.mozMovementY || 0\n    inputs.pointerState.dx += dx\n    inputs.pointerState.dy += dy\n}\n\n\n\n\n/*\n * \n *      mousewheel / scroll handling...\n * \n */\n\nfunction onWheelEvent(inputs, ev) {\n    var scale = 1\n    switch (ev.deltaMode) {\n        case 0: scale = 1; break  // Pixel\n        case 1: scale = 12; break  // Line\n        case 2:  // page\n            // TODO: investigate when this happens, what correct handling is\n            scale = inputs.element.clientHeight || window.innerHeight\n            break\n    }\n    // accumulate state\n    inputs.pointerState.scrollx += (ev.deltaX || 0) * scale\n    inputs.pointerState.scrolly += (ev.deltaY || 0) * scale\n    inputs.pointerState.scrollz += (ev.deltaZ || 0) * scale\n}\n\n\n/*\n *\n *          Edge cases...\n *\n*/\n\nfunction onContextMenu(inputs, ev) {\n    if (!inputs.allowContextMenu) {\n        ev.preventDefault()\n        return false\n    }\n}\n\nfunction onWindowBlur(inputs) {\n    // at least some browsers handle mouse events correctly here\n    // but not keys, so on window blur simulate a keyUp for all pressed keys\n    // there may be a better way to handle this someday..\n    for (var code in inputs._keyStates) {\n        if (!inputs._keyStates[code]) continue\n        if (/^Mouse\\d/.test(code)) continue\n        handleKeyEvent(code, false, inputs, {\n            code: code,\n            note: `This is a mocked KeyboardEvent made by the 'game-inputs' module`,\n            preventDefault: () => { },\n            stopPropagation: () => { },\n        })\n    }\n}\n\n\n\n\n/*\n *\n *\n *          FINAL KEY BIND HANDLING\n *\n *\n*/\n\n// tracks the state/counts of individual physical keys\nfunction handleKeyEvent(code, nowDown, inputs, ev) {\n    var bindings = inputs._keyBindmap[code]\n    if (!bindings) return\n    // prevent/stop only for non-mouse events\n    if (!('button' in ev)) {\n        if (inputs.preventDefaults) ev.preventDefault()\n        if (inputs.stopPropagation) ev.stopPropagation()\n    }\n\n    // if the key's state has changed, handle an event for all bindings\n    var prevState = inputs._keyStates[code]\n    if (XOR(prevState, nowDown)) {\n        inputs._keyStates[code] = nowDown\n        // for each binding: emit an event, and update cached state information\n        bindings.forEach(bindingName => {\n            handleBindingEvent(bindingName, nowDown, inputs, ev)\n        })\n    }\n}\n\n\n// tracks the state/counts of virtual bindings\nfunction handleBindingEvent(bindingName, pressed, inputs, ev) {\n    // externally, track *cumulative* press/release counts\n    var counter = (pressed) ? inputs.pressCount : inputs.releaseCount\n    counter[bindingName] = (counter[bindingName] || 0) + 1\n    // internally, track *current* press count (to handle overlapping keybinds)\n    var ct = inputs._bindPressCount[bindingName] || 0\n    ct += pressed ? 1 : -1\n    if (ct < 0) { ct = 0 } // shouldn't happen\n    inputs._bindPressCount[bindingName] = ct\n\n    // emit event if binding's state has changed\n    var currstate = inputs.state[bindingName]\n    if (XOR(currstate, ct)) {\n        inputs.state[bindingName] = (ct > 0)\n        var emitter = pressed ? inputs.down : inputs.up\n        if (!inputs.disabled) emitter.emit(bindingName, ev)\n    }\n}\n\n\n\n\n/*\n *\n *\n *    HELPERS\n *\n *\n*/\n\n\n// how is this not part of Javascript?\nfunction XOR(a, b) {\n    return a ? !b : b\n}\n\n\n\n\n\n\n//# sourceURL=webpack:///../src/inputs.js?");

/***/ }),

/***/ "../package.json":
/*!***********************!*\
  !*** ../package.json ***!
  \***********************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"name\":\"game-inputs\",\"version\":\"0.6.0\",\"description\":\"Simple library to abstract key/mouse events for games.\",\"main\":\"src/inputs.js\",\"typings\":\"dist/src/inputs.d.ts\",\"files\":[\"/src\",\"/dist\"],\"scripts\":{\"start\":\"cd docs/ && webpack serve\",\"build\":\"tsc; cd docs/ && webpack\"},\"author\":\"Andy Hall\",\"license\":\"ISC\",\"keywords\":[\"game\",\"inputs\",\"key\",\"mouse\",\"events\"],\"dependencies\":{\"events\":\"^3.3.0\"},\"repository\":{\"type\":\"git\",\"url\":\"https://github.com/fenomas/game-inputs\"},\"bugs\":{\"url\":\"https://github.com/fenomas/game-inputs/issues\"}}');\n\n//# sourceURL=webpack:///../package.json?");

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./demo.js");
/******/ 	
/******/ })()
;