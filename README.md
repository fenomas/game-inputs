game-inputs
==========
A simple library for abstracting key/mouse input for games. 

Does stuff like:

* Virtual key bindings (i.e. map one or more physical keys to a single action)
* Emits down/up events for each binding (not each key)
* Handles annoying edge cases, like overlapping events from two keys bound to the same action, or the browser losing focus while a key is pressed, etc.
* Exposes objects with the current state of each binding, the number of press/release events since the last tick, etc.
* Also tracks mouse/pointer events and scroll/wheel inputs

Canonical names for physical keys are as specified by [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code). To check key codes, try the [live demo](http://fenomas.github.io/game-inputs/).


## Sample usage:

```js
import { GameInputs } from 'game-inputs'

// instantiate
var domElement = document.querySelector('...')
var inputs = new GameInputs(domElement, {
  preventDefaults: true, 
  allowContextMenu: false,
})

// bind an arbitrary event name to one or more physical key codes
inputs.bind( 'move-fwd',  'KeyW' )
inputs.bind( 'move-left', 'KeyA', 'ArrowLeft' )

// listen to that event name for press/release events
inputs.down.on( 'move-fwd', (ev) => { startMovingFwd() } )
inputs.up.on( 'move-fwd', (ev) => { stopMovingFwd() } )

// mouse/pointer buttons are bindable as `Mouse1`, `Mouse2`, ...
inputs.bind( 'shoot', 'Mouse1' )
inputs.bind( 'RMB', 'Mouse3' )

// you can also query various input states in the game loop
function myGameLoop() {
  // current boolean state of a key or mouse button
  var leftCurrentlyPressed = inputs.state['move-left']
  var shootButtonPressed = inputs.state['shoot']

  // pointer movement and scroll/wheel data
  var mouseMovedBy = [inputs.pointerState.dx, inputs.pointerState.dy]
  var scrolledBy = inputs.pointerState.scrolly

  // accumulated number of presses/releases since the last tick
  var fwdPresses = inputs.pressCount['move-fwd']
  var fwdReleases = inputs.releaseCount['move-fwd']

  // calling tick() zeroes out cumulative mouse/scroll/press/release values
  inputs.tick()
}

// you can optionally filter events before they occur - e.g. if you want
// keyboard events not to fire if control keys are pressed
inputs.filterEvents = (ev, bindingName) => {
    if (/^Key/.test(ev.code) && ev.ctrlKey) return false
    return true
}
```

Here's the [interactive demo](http://fenomas.github.io/game-inputs/).


## Installation

```shell
npm install game-inputs
```


## API

The various methods and properties are documented via doc comments, so in a 
modern editor you should hopefully see them as tooltips.

Otherwise, please see the source ;)


## Notes:

* When you specify a `domElement`, this module will only track **pointer** inputs (movement, clicks, and scrolls) inside that element. However **keyboard** inputs will be tracked globally at the document level.
* If you don't specify a DOM element, `document` will be used.
* For several reasons, this module doesn't call `preventDefault` or `stopPropagation` on mouse or scroll events, even if those properties are set. If you want to prevent parts of your page from scrolling or panning, it's more performant to do so via CSS.



<br>

----

## History

 * `0.7.0` Adds `filterEvents()`
 * `0.6.0` Modernization pass - adopts real physical key codes, Pointer events (still fallback to mouse), etc. Also adds proper docs/types.  
 Breaking changes:
   * now an ES module exporting a named `class`, not a factory function
   * Key binding names now use [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) strings (e.g. `KeyA`, `Space`)
   * Bindings for mouse buttons are now `Mouse1`, `Mouse2`..
   * Mouse/scroll values (`dx,dy,scrollx,scrolly`) moved from `inputs.state` to `inputs.pointerState`
 * `0.5.0` Minor features and dependency updates
 * `0.3.0` Stable release


----

## By

Made with 🍺 by [Andy Hall](https://fenomas.com).

License is ISC.

Originally modeled after 
[game-shell](https://github.com/mikolalysenko/game-shell), but probably doesn't resemble it much anymore.
