game-inputs
==========
A simple module for abstracting key/mouse input for games. 
Does stuff like:

* Virtual key bindings (i.e. map 'W' to 'move-forward')
* Sends up/down events for each binding
* Correctly handles edge cases, like two keys bound to the same action being pressed at once
* Exposes a `state` object with booleans for each binding, and mouse dx/dy values

This module is inspired by, and where possible steals code from, 
[game-shell](https://github.com/mikolalysenko/game-shell). But it's much more minimal. 
Canonical names for keycodes are as specified by [vkey](https://github.com/chrisdickinson/vkey/blob/master/index.js).

## Sample usage:

```javascript
var inputs = require('game-inputs')( myDomElement )

// bind movement keys to WASD and arrow keys
inputs.bind( 'move-up',   'W', '<up>' )
inputs.bind( 'move-left', 'A', '<left>' ) // etc...

// bind left mouse to "fire"
inputs.bind( 'fire',  '<mouse 1>' )

// catch down/up events
inputs.down.on( 'fire',  myFunction( binding, event) {/* ... */}  )
inputs.up.on( 'fire',  myFunction( binding, event) {/* ... */}  )

function myGameLoop() {
  
  // query state of bindings in game loop
  if ( inputs.state['move-left'] )  { goLeft() } // etc..
  
  // handle mouse inputs
  handleMouse( inputs.state.dx, inputs.state.dy ) // mouse dx/dy
  handleScroll( inputs.state.scrolly ) // or scrollx/scrollz
  // calling tick() clears cumulative mouse movement vars
  inputs.tick()
}
```

Here's the [interactive demo](http://andyhall.github.io/game-inputs/).

## Installation

```shell
npm install game-inputs
```

To test locally (with [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)):

```shell
cd game-inputs
npm install
npm test
```

## API

#### `var inputs = require("game-inputs")( element, options )`

* `element` - DOM element to attach mouse listeners to. Defaults to `document`.
* `options` - Optional object with two possible parameters: `preventDefaults` and `stopPropagation`. If set, the module will call the corresponding function after handling DOM events.

#### `inputs.bind( "bindName", "keycode", "keycode2", .. )`

* `bindName` - Virtual keycode for the action being bound (e.g. `move-left`)
* `keyCode` - one or more keycodes as specified by [vkey](https://github.com/chrisdickinson/vkey/blob/master/index.js) (e.g. `W`, `<tab>`, `<mouse 1>`)

#### `inputs.unbind( "bindName" )`

Removes all key bindings for the given name.

#### `inputs.state`

State object populated with these properties:
* a boolean for whether each keybinding is currently pressed. E.g. `inputs.state.jump` is a boolean for whether a key (or keys) bound to the `jump` action are currently pressed.
* `dx`, `dy` - How far the mouse has (cumulatively) moved since `inputs#tick` was last called.
* `scrollx`, `scrolly`, `scrollz` - accumulated scroll amounts (scaled to pixel values) since `inputs#tick` was last called.

#### `inputs.tick()`

Resets (cumulative) `state.dx`/`state.dy` values. Call this in your game loop (after checking inputs) 
if you want to use this module to track inputs each frame.

## Events

#### `inputs.down.on(binding, myFunction)`

Emits events when a bound key is pressed. E.g. `inputs.down.on('jump', fcn..)` will emit an event when *any* key bound to `jump` is pressed. Redundant events are not sent, so if two keys are bound to the same thing and pressed at the same time, only one event will be sent. The event handler will be passed two arguments:
* `binding` - the name of the binding that's been triggered
* `event` - the original (DOM) mouse event

#### `inputs.up.on(binding, myFunction)`

Exactly as previous but for key release events.

## Todo:

* Doesn't yet try to handle edge cases where the user clicks out of the browser while a key is pressed, or similar.
* The state object could usefully report a number of press events since the last tick, rather than just a boolean. 

