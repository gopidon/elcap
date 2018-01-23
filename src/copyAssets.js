/**
 * Created by udemy.don on 3/3/17.
 */
/* eslint-disable no-console */
let ncp = require('ncp').ncp;
let chalk = require('chalk');

ncp.limit = 16;

console.log(chalk.green('Starting in production mode ...'));

ncp('./src/views', './dist/views', function (err) {
	if (err) {
		return console.error(err);
	}
	console.log(chalk.green('done copying views folder (index.ejs file)'));
});


