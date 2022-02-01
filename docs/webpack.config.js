
var path = require('path')


module.exports = {
	mode: 'development',
	entry: './demo.js',
	output: {
		path: path.resolve('.'),
		filename: 'bundle.js',
	},
    stats: "minimal",
	devServer: {
        static: '.',
	},
}
