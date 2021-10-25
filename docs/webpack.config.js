
var path = require('path')


module.exports = {
	mode: 'development',
	entry: './index.js',
	output: {
		path: path.resolve('.'),
		filename: 'bundle.js',
	},
    stats: "minimal",
	devServer: {
        static: '.',
	},
}
