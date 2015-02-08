
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

inputs.down.on( 'move-left',  function(){showOutput('move-left pressed')} )
inputs.down.on( 'move-right', function(){showOutput('move-right pressed')} )
inputs.down.on( 'fire',       function(){showOutput('fire pressed')} )
inputs.up.on( 'move-left',  function(){showOutput('move-left released')} )
inputs.up.on( 'move-right', function(){showOutput('move-right released')} )
inputs.up.on( 'fire',       function(){showOutput('fire released')} )

var bindingNames = inputs.getBindings()





// HTML stuff
function addDiv(txt) {
  var div = document.createElement('div')
  div.textContent = txt
  document.body.appendChild(div)
}
addDiv('The following keys are bound:')
addDiv( bindingNames.sort().join(', ') )
addDiv('Try pressing them now!')
var textarea = document.createElement('textarea')
textarea.style.width = "300px"
textarea.style.height = "40px"
document.body.appendChild(textarea)
addDiv('Or open the console and inspect "inputs.state".')
function showOutput(txt) {
  textarea.value = txt
}