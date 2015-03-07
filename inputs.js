'use strict';

var vkey = require('vkey')
var EventEmitter = require('events').EventEmitter;
// mousewheel polyfill borrowed directly from game-shell
var addMouseWheel = require("./lib/mousewheel-polyfill.js")

module.exports = function(domElement, options) {
  return new Inputs(domElement, options)
}


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
  this._keyStates = {}        // { 'vkeycode' : boolean }
  this._bindPressCounts = {}  // { 'binding' : int }

  // register for dom events
  this.initEvents()
}


/*
 *
 *   PUBLIC API 
 *
*/ 

Inputs.prototype.initEvents = function() {
  // keys
  window.addEventListener( 'keydown', onKeyEvent.bind(undefined,this,true), false )
  window.addEventListener( 'keyup', onKeyEvent.bind(undefined,this,false), false )
  // mouse buttons
  this.element.addEventListener("mousedown", onMouseEvent.bind(undefined,this,true), false)
  this.element.addEventListener("mouseup", onMouseEvent.bind(undefined,this,false), false)
  this.element.oncontextmenu = onContextMenu.bind(undefined,this)
  // mouse other
  this.element.addEventListener("mousemove", onMouseMove.bind(undefined,this), false)
  addMouseWheel(this.element, onMouseWheel.bind(undefined,this), false)
}


// Usage:  bind( bindingName, vkeyCode, vkeyCode.. )
//    Note that inputs._keybindmap maps vkey codes to binding names
//    e.g. this._keybindmap['a'] = 'move-left'
Inputs.prototype.bind = function(binding) {
  for (var i=1; i<arguments.length; ++i) {
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
Inputs.prototype.unbind = function(binding) {
  for (var b in this._keybindmap) {
    var arr = this._keybindmap[b]
    var i = arr.indexOf(binding)
    if (i>-1) { arr.splice(i,1) }
  }
}

// tick function - clears out cumulative mouse movement state variables
Inputs.prototype.tick = function() {
  this.state.dx = this.state.dy = 0
  this.state.scrollx = this.state.scrolly = this.state.scrollz = 0
}



Inputs.prototype.getBoundKeys = function() {
  var arr = []
  for (var b in this._keybindmap) { arr.push(b) }
  return arr
}



/*
 *   INTERNALS - DOM EVENT HANDLERS
*/ 


function onKeyEvent(inputs, wasDown, ev) {
  handleKeyEvent( ev.keyCode, vkey[ev.keyCode], wasDown, inputs, ev )
}

function onMouseEvent(inputs, wasDown, ev) {
  // simulate a code out of range of vkey
  var keycode = -1 - ev.button
  var vkeycode = '<mouse '+ (ev.button+1) +'>' 
  handleKeyEvent( keycode, vkeycode, wasDown, inputs, ev )
  return false
}

function onContextMenu(inputs) {
  // cancel context menu if there's a binding for right mousebutton
  var arr = inputs._keybindmap['<mouse 3>']
  if (arr) { return false }
}

function onMouseMove(inputs, ev) {
  // for now, just populate the state object with mouse movement
  var dx = ev.movementX || ev.mozMovementX || ev.webkitMovementX || 0,
      dy = ev.movementY || ev.mozMovementY || ev.webkitMovementY || 0
  inputs.state.dx += dx
  inputs.state.dy += dy
  // TODO: verify if this is working/useful during pointerlock?
}

function onMouseWheel(inputs, ev) {
  // basically borrowed from game-shell
  var scale = 1
  switch(ev.deltaMode) {
    case 0: scale=1;   break;  // Pixel
    case 1: scale=12;  break;  // Line
    case 2:  // page
      // TODO: investigagte when this happens, what correct handling is
      scale = inputs.element.clientHeight || window.innerHeight
      break;
  }
  // accumulate state
  inputs.state.scrollx += ev.deltaX * scale
  inputs.state.scrolly += ev.deltaY * scale
  inputs.state.scrollz +=(ev.deltaZ * scale) || 0
  return false
}


/*
 *   KEY BIND HANDLING
*/ 


function handleKeyEvent(keycode, vcode, wasDown, inputs, ev) {
  var arr = inputs._keybindmap[vcode]
  // don't prevent defaults if there's no binding
  if (!arr) { return }
  if (inputs.preventDefaults) ev.preventDefault()
  if (inputs.stopPropagation) ev.stopPropagation()

  // if the key's state has changed, handle an event for all bindings
  var currstate = inputs._keyStates[keycode]
  if ( XOR(currstate, wasDown) ) {
    // for each binding: emit an event, and update cached state information
    for (var i=0; i<arr.length; ++i) {
      handleBindingEvent( arr[i], wasDown, inputs, ev )
    }
  }
  inputs._keyStates[keycode] = wasDown
}


function handleBindingEvent(binding, wasDown, inputs, ev) {
  // keep count of presses mapped by binding
  // (to handle two keys with the same binding pressed at once)
  var ct = inputs._bindPressCounts[binding] || 0
  ct += wasDown ? 1 : -1
  if (ct<0) { ct = 0 } // shouldn't happen
  inputs._bindPressCounts[binding] = ct

  // emit event if binding's state has changed
  var currstate = inputs.state[binding]
  if ( XOR(currstate, ct) ) {
    var emitter = wasDown ? inputs.down : inputs.up
    emitter.emit( binding, ev )
  }
  inputs.state[binding] = !!ct
}


/*
 *    HELPERS
 *
*/


// how is this not part of Javascript?
function XOR(a,b) {
  return a ? !b : b
}




