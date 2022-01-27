
var vkey = require('vkey')
var EventEmitter = require('events').EventEmitter
// mousewheel polyfill borrowed directly from game-shell
var addMouseWheel = require("./lib/mousewheel-polyfill.js")

module.exports = function (domElement, options) {
    return new Inputs(domElement, options)
}
module.exports.Inputs = Inputs

/*
 *   Simple inputs manager to abstract key/mouse inputs.
 *        Inspired by (and where applicable stealing code from) 
 *        game-shell: https://github.com/mikolalysenko/game-shell
 *  
 *  inputs.bind( 'move-right', 'D', '<right>' )
 *  inputs.bind( 'move-left',  'A' )
 *  inputs.unbind( 'move-left' )
 *  
 *  inputs.down.on( 'move-right',  function( binding, event ) {})
 *  inputs.up.on(   'move-right',  function( binding, event ) {})
 *
 *  inputs.state['move-right']  // true when corresponding keys are down
 *  inputs.state.dx             // mouse x movement since tick() was last called
 *  inputs.getBindings()        // [ 'move-right', 'move-left', ... ]
*/


function Inputs(element, opts) {

    // settings
    this.element = element || document
    opts = opts || {}
    this.preventDefaults = !!opts.preventDefaults
    this.stopPropagation = !!opts.stopPropagation
    this.allowContextMenu = !!opts.allowContextMenu
    this.disabled = !!opts.disabled

    // emitters
    this.down = new EventEmitter()
    this.up = new EventEmitter()

    // state object to be queried
    this.state = {
        dx: 0, dy: 0,
        scrollx: 0, scrolly: 0, scrollz: 0
    }

    // internal state
    this._keybindmap = {}       // { 'vkeycode' : [ 'binding', 'binding2' ] }
    this._keyStates = {}        // { 'code' : boolean }
    this._bindPressCounts = {}  // { 'binding' : int }

    // needed to work around a bug in Mac Chrome 75
    // https://bugs.chromium.org/p/chromium/issues/detail?id=977093
    this._ignoreMousemoveOnce = false

    // register for dom events
    this.initEvents()
}


/*
 *
 *   PUBLIC API 
 *
*/

Inputs.prototype.initEvents = function () {
    // keys
    window.addEventListener('keydown', onKeyEvent.bind(undefined, this, true), false)
    window.addEventListener('keyup', onKeyEvent.bind(undefined, this, false), false)
    // mouse buttons
    this.element.addEventListener("mousedown", onMouseEvent.bind(undefined, this, true), false)
    window.document.addEventListener("mouseup", onMouseEvent.bind(undefined, this, false), false)
    this.element.oncontextmenu = onContextMenu.bind(undefined, this)
    // treat dragstart like mouseup - idiotically, mouseup doesn't fire after a drag starts (!)
    this.element.addEventListener("dragstart", onMouseEvent.bind(undefined, this, false), false)
    // touch/mouse movement
    this.element.addEventListener("mousemove", onMouseMove.bind(undefined, this), false)
    this.element.addEventListener("touchmove", onMouseMove.bind(undefined, this), false)
    this.element.addEventListener("touchstart", onTouchStart.bind(undefined, this), false)
    this.element.addEventListener("touchend", onTouchEnd.bind(undefined, this), false)
    // scroll/mousewheel
    addMouseWheel(this.element, onMouseWheel.bind(undefined, this), false)
    // temp bug workaround, see above
    document.addEventListener("pointerlockchange", onLockChange.bind(undefined, this), false)
    document.addEventListener("mozpointerlockchange", onLockChange.bind(undefined, this), false)
}


// Usage:  bind( bindingName, vkeyCode, vkeyCode.. )
//    Note that inputs._keybindmap maps vkey codes to binding names
//    e.g. this._keybindmap['a'] = 'move-left'
Inputs.prototype.bind = function (binding) {
    for (var i = 1; i < arguments.length; ++i) {
        var vkeyCode = arguments[i]
        var arr = this._keybindmap[vkeyCode] || []
        if (arr.indexOf(binding) == -1) {
            arr.push(binding)
        }
        this._keybindmap[vkeyCode] = arr
    }
    this.state[binding] = !!this.state[binding]
}

// search out and remove all keycodes bound to a given binding
Inputs.prototype.unbind = function (binding) {
    for (var b in this._keybindmap) {
        var arr = this._keybindmap[b]
        var i = arr.indexOf(binding)
        if (i > -1) { arr.splice(i, 1) }
    }
}

// tick function - clears out cumulative mouse movement state variables
Inputs.prototype.tick = function () {
    this.state.dx = this.state.dy = 0
    this.state.scrollx = this.state.scrolly = this.state.scrollz = 0
}



Inputs.prototype.getBoundKeys = function () {
    var arr = []
    for (var b in this._keybindmap) { arr.push(b) }
    return arr
}



/*
 *
 *
 *      INTERNALS - DOM EVENT HANDLERS
 *
 *
*/


function onKeyEvent(inputs, wasDown, ev) {
    handleKeyEvent(ev.code, vkey[ev.keyCode], wasDown, inputs, ev)
}

function onMouseEvent(inputs, wasDown, ev) {
    var vkeycode = '<mouse ' + (ev.button + 1) + '>'
    handleKeyEvent('Mouse' + (ev.button + 1), vkeycode, wasDown, inputs, ev)
    return false
}

function onContextMenu(inputs) {
    if (!inputs.allowContextMenu) return false
}

function onMouseMove(inputs, ev) {
    // bug workaround, see top of file
    if (inputs._ignoreMousemoveOnce) {
        inputs._ignoreMousemoveOnce = false
        return
    }
    // for now, just populate the state object with mouse movement
    var dx = ev.movementX || ev.mozMovementX || 0,
        dy = ev.movementY || ev.mozMovementY || 0
    // ad-hoc experimental touch support
    if (ev.touches && (dx | dy) === 0) {
        var xy = getTouchMovement(ev)
        dx = xy[0]
        dy = xy[1]
    }
    inputs.state.dx += dx
    inputs.state.dy += dy
}

// experimental - for touch events, extract useful dx/dy
var lastTouchX = 0
var lastTouchY = 0
var lastTouchID = null

function onTouchStart(inputs, ev) {
    // Only start a new touch if there isn't one ongoing
    if (lastTouchID === null) {
        var touch = ev.changedTouches[0]
        lastTouchX = touch.clientX
        lastTouchY = touch.clientY
        lastTouchID = touch.identifier
    }
}

function onTouchEnd(inputs, ev) {
    // For the touchend event, changedTouches is a list of the touch points that have been removed from the surface
    var touches = ev.changedTouches
    for (var i = 0; i < touches.length; ++i) {
        if (touches[i].identifier === lastTouchID) {
            lastTouchID = null
        }
    }
}

function getTouchMovement(ev) {
    var touch
    var touches = ev.changedTouches
    for (var i = 0; i < touches.length; ++i) {
        if (touches[i].identifier == lastTouchID) touch = touches[i]
    }
    if (!touch) return [0, 0]
    var res = [touch.clientX - lastTouchX, touch.clientY - lastTouchY]
    lastTouchX = touch.clientX
    lastTouchY = touch.clientY
    return res
}

function onMouseWheel(inputs, ev) {
    // basically borrowed from game-shell
    var scale = 1
    switch (ev.deltaMode) {
        case 0: scale = 1; break  // Pixel
        case 1: scale = 12; break  // Line
        case 2:  // page
            // TODO: investigate when this happens, what correct handling is
            scale = inputs.element.clientHeight || window.innerHeight
            break
    }
    // accumulate state
    inputs.state.scrollx += ev.deltaX * scale
    inputs.state.scrolly += ev.deltaY * scale
    inputs.state.scrollz += (ev.deltaZ * scale) || 0
    return false
}

function onLockChange(inputs, ev) {
    var locked = document.pointerLockElement
        || document.mozPointerLockElement
        || null
    if (locked) inputs._ignoreMousemoveOnce = true
}




/*
 *
 *
 *   KEY BIND HANDLING
 *
 *
*/


function handleKeyEvent(code, vcode, wasDown, inputs, ev) {
    var arr = inputs._keybindmap[vcode]
    var arr2 = inputs._keybindmap[code]
    // don't prevent defaults if there's no binding
    if (!arr && !arr2) { return }
    if (inputs.preventDefaults) ev.preventDefault()
    if (inputs.stopPropagation) ev.stopPropagation()

    // if the key's state has changed, handle an event for all bindings
    var currstate = inputs._keyStates[code]
    if (XOR(currstate, wasDown)) {
        // for each binding: emit an event, and update cached state information
        if (arr)
            for (var i = 0; i < arr.length; ++i) {
                handleBindingEvent(arr[i], wasDown, inputs, ev)
            }
        if (arr2)
            for (var i = 0; i < arr2.length; ++i) {
                handleBindingEvent(arr2[i], wasDown, inputs, ev)
            }
    }
    inputs._keyStates[code] = wasDown
}


function handleBindingEvent(binding, wasDown, inputs, ev) {
    // keep count of presses mapped by binding
    // (to handle two keys with the same binding pressed at once)
    var ct = inputs._bindPressCounts[binding] || 0
    ct += wasDown ? 1 : -1
    if (ct < 0) { ct = 0 } // shouldn't happen
    inputs._bindPressCounts[binding] = ct

    // emit event if binding's state has changed
    var currstate = inputs.state[binding]
    if (XOR(currstate, ct)) {
        var emitter = wasDown ? inputs.down : inputs.up
        if (!inputs.disabled) emitter.emit(binding, ev)
    }
    inputs.state[binding] = !!ct
}




/*
 *
 *
 *    HELPERS
 *
 *
*/


// how is this not part of Javascript?
function XOR(a, b) {
    return a ? !b : b
}




