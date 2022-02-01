import { GameInputs } from '../src/inputs.js'


var container = document.querySelector('#registeredElement')
var inputs = new GameInputs(container, {
    preventDefaults: true,
    stopPropagation: true,
})
window.inputs = inputs



// example bindings
inputs.bind('move-left', 'KeyA', 'ArrowLeft')
inputs.bind('move-right', 'KeyD', 'ArrowRight')
inputs.bind('fire', 'Mouse1', 'Space')
inputs.bind('alt-fire', 'Mouse3')



var allBindings = inputs.getBindings()
var allKeys = []
for (var bindingName in allBindings) {
    inputs.down.on(bindingName, ev => showOutput(bindingName, true))
    inputs.up.on(bindingName, ev => showOutput(bindingName, false))
    allBindings[bindingName].forEach(key => {
        if (!(allKeys.includes(key))) allKeys.push(key)
    })
}

// in real game code you'd do something like:
// inputs.down.on('move-left', () => movePlayerLeft())





// Example page HTML stuff
function addDiv(txt, html, className) {
    var div = document.createElement('div')
    if (html) div.innerHTML = txt
    else div.textContent = txt
    container.appendChild(div)
    div.classList.add(className || '')
    return div
}

addDiv('The following keys are bound:', true, 'heading')
var lockKeys = addDiv('', true, 'content')
lockKeys.innerHTML = allKeys.join(', ')

addDiv('Pointer lock element:', false, 'heading')
var lockTarget = addDiv('click to lock', false, 'content')
lockTarget.classList.add('pointer-lock-target')

addDiv('Most recent event:', true, 'heading')
var textarea = document.createElement('textarea')
textarea.style.width = "350px"
textarea.style.height = "30px"
textarea.classList.add('content')
container.appendChild(textarea)

addDiv('Current values in "inputs.state" object:', true, 'heading')
var stateDiv = addDiv('', true, 'content')

addDiv('Current values in "inputs.pointerState" object:', true, 'heading')
var pointerStateDiv = addDiv('', true, 'content')

function showOutput(bindingName, pressed) {
    var state = pressed ? 'pressed' : 'released'
    textarea.value = `Binding "${bindingName}" -> ${state}`
    showState()
}

function stateObjToDiv(obj, div) {
    div.innerHTML = Object.keys(obj).map(key => {
        var val = obj[key]
        if (!(val === 0 || val === false)) val = `<span class="highlight">${val}</span>`
        return `${key}: ${val}`
    }).join('<br>')
}

function showState() {
    stateObjToDiv(inputs.state, stateDiv)
    stateObjToDiv(inputs.pointerState, pointerStateDiv)
    inputs.tick()
}
setInterval(showState, 250)


// pointer lock stuff
var locked = false
document.addEventListener('pointerlockchange', function (ev) {
    locked = document.pointerLockElement === lockTarget
    lockTarget.textContent = (locked) ? '(locked)' : 'click to lock'
})
lockTarget.addEventListener('mousedown', function (ev) {
    if (!locked) lockTarget.requestPointerLock()
    else document.exitPointerLock
})


// for grabbing key code strings

addDiv('Info - last physical key event code:', true, 'heading')
var keyCodeDiv = addDiv('&nbsp;', true, 'content')
document.onkeydown = (ev => {
    keyCodeDiv.innerHTML = ev.code
})


