const path = require('path');

module.exports = {
	entry: {
    RemoteExec: {
      import: path.resolve(__dirname, 'index.js'),
      dependOn: ['Course', 'Users', 'Site']
    }
	}
}
