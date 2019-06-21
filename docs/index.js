
var element = document
var options = {
    preventDefaults: false,
    stopPropagation: false
}

var inputs = require('../inputs')(element, options)
window.inputs = inputs


inputs.bind('move-left', 'A', '<left>')
inputs.bind('move-right', 'D', '<right>')
inputs.bind('fire', '<mouse 1>')
inputs.bind('RMB', '<mouse 3>')

inputs.down.on('move-left', function () { showOutput('move-left pressed') })
inputs.down.on('move-right', function () { showOutput('move-right pressed') })
inputs.down.on('fire', function () { showOutput('fire pressed') })
inputs.down.on('RMB', function () { showOutput('RMB pressed') })
inputs.up.on('move-left', function () { showOutput('move-left released') })
inputs.up.on('move-right', function () { showOutput('move-right released') })
inputs.up.on('fire', function () { showOutput('fire released') })
inputs.up.on('RMB', function () { showOutput('RMB released') })

var boundKeys = inputs.getBoundKeys()






// Example page HTML stuff
function addDiv(txt, html, className) {
    var div = document.createElement('div')
    if (html) div.innerHTML = txt
    else div.textContent = txt
    document.body.appendChild(div)
    div.classList.add(className || '')
    return div
}
addDiv('The following keys are bound:', 0, 'heading')
addDiv(boundKeys.sort().join(', '), 0, 'content')

addDiv('Pointer lock element:', 0, 'heading')
var lockTarget = addDiv('click to lock', 0, 'content')
lockTarget.classList.add('pointer-lock-target')

addDiv('Event output: <br>(or open the console and inspect "inputs")', true, 'heading')
var textarea = document.createElement('textarea')
textarea.style.width = "300px"
textarea.style.height = "40px"
textarea.classList.add('content')
document.body.appendChild(textarea)

addDiv('Current values in "inputs.state" object:', true, 'heading')
var stateDiv = addDiv('', true, 'content')

function showOutput(txt) {
    textarea.value = txt
}

function showState() {
    var s = inputs.state
    var a = []
    for (var name in s) a.push(name)
    var str = ''
    for (var i = 0; i < a.length; ++i) {
        str += a[i] + ': ' + s[a[i]] + '<br>'
    }
    stateDiv.innerHTML = str
    inputs.tick()
}
setInterval(showState, 200)


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
