
var element = document
var options = {
  preventDefaults: false,
  stopPropagation: false
}

var inputs = require('../')( element, options )
window.inputs = inputs


inputs.bind( 'move-left',  'A', '<left>' )
inputs.bind( 'move-right', 'D', '<right>' )
inputs.bind( 'fire',  '<mouse 1>' )
inputs.bind( 'RMB',  '<mouse 3>' )

inputs.down.on( 'move-left',  function(){showOutput('move-left pressed')} )
inputs.down.on( 'move-right', function(){showOutput('move-right pressed')} )
inputs.down.on( 'fire',       function(){showOutput('fire pressed')} )
inputs.down.on( 'RMB',        function(){showOutput('RMB pressed')} )
inputs.up.on( 'move-left',  function(){showOutput('move-left released')} )
inputs.up.on( 'move-right', function(){showOutput('move-right released')} )
inputs.up.on( 'fire',       function(){showOutput('fire released')} )
inputs.up.on( 'RMB',        function(){showOutput('RMB released')} )

var bindingNames = inputs.getBindings()  






// Example page HTML stuff
function addDiv(txt, html) {
  var div = document.createElement('div')
  if (html) div.innerHTML = txt
  else div.textContent = txt
  document.body.appendChild(div)
  return div
}
addDiv('The following keys are bound:')
addDiv(bindingNames.sort().join(', '))
addDiv('<p />Event output:', true)
var textarea = document.createElement('textarea')
textarea.style.width = "300px"
textarea.style.height = "40px"
document.body.appendChild(textarea)
addDiv('Or open the console and inspect "inputs".<p />', true)
addDiv('Current values in "inputs.state" object:<p />', true)
var stateDiv = addDiv('',true)
function showOutput(txt) {
  textarea.value = txt
}
var ct = 0
function showState() {
  var s = inputs.state
  var a = []
  for (var name in s) a.push(name)
  var str = ''
  for (var i=0; i<a.length; ++i) {
    str += a[i] + ': ' + s[a[i]] + '<br>'
  }
  stateDiv.innerHTML = str
  inputs.tick()
}
setInterval( showState, 200 )