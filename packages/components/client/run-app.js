/* global process */
/* global __dirname */
var path = require('path');
var fs = require('fs');
var sys = require('sys');
var spawn = require('child_process').spawn;

var appPath = path.join(__dirname, 'app');
var appPackagesPath = path.join(appPath, 'packages');
var packagesPath = path.join(__dirname, 'packages');

if (!fs.existsSync(appPackagesPath)) {
	fs.mkdir(appPackagesPath);
}

/**
 * Get all directories at path.
 */
var getDirectories = function (srcpath) {
	if (!fs.existsSync(srcpath))
		return [];

  return fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};

var linkPackage = function (srcPath, dstPath, packageName) {
	fs.symlinkSync(srcPath, dstPath, 'dir');
	// fs.symlink(srcPath, dstPath, 'dir', function (err) {
	// 	if (err) {
	// 		console.log('[ERROR] ' + err);
	// 		console.log('must run with admin priviliges');
	// 	}
	// 	else {
	// 		console.log('linked package ' + packageName);
	// 	}
	// });
	console.log('linked package ' + packageName);
};

var packages = getDirectories(packagesPath);

for (var i = 0; i < packages.length; i++) {
	var packageName = packages[i];

	var srcPath = path.join(packagesPath, packageName);
	var dstPath = path.join(appPackagesPath, packageName);

	if (!fs.existsSync(dstPath)) {
		console.log('linking ' + srcPath + ' to ' + dstPath);
		linkPackage(srcPath, dstPath, packageName);
	}
	else {
		console.log('dest path ' + dstPath + ' exists. skip linking');
	}
}

// start meteor server

var meteorCmd = process.platform === 'win32' ? 'meteor.bat' : 'meteor';
// var args = ['--port', '4444'];
var args = [];

var cmd = spawn(meteorCmd, args, {
	cwd: appPath,
	env: process.env
});

cmd.stdout.on('data', function (data) {
	console.log(data.toString().trim());
});

//Error handling
cmd.stderr.on('data', function (err) {
	console.log(err);
});

cmd.on('close', function () {
	console.log('Finished');
});

cmd.on('error', function (err) {
	console.log(err);
});
