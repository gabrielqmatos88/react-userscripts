const chalk = require('chalk');
const concat = require('concat-files');
const mkdirp = require('mkdirp');
const files = ['src/userscript-header.js', 'build/static/js/main.js',];
// return value is a Promise resolving to the first directory created
mkdirp('../dist').then(made => {
    console.log('created dist');
    console.log('concatening files',);
    concat(files, '../dist/react-userscripts.user.js', function (err) {
        if (err) {
            console.log(chalk.red('fail to concatenate the files'), err);
            process.exit(1);
        }
        console.log(chalk.green('generated file dist/react-userscripts.user.js'));
    });
});
