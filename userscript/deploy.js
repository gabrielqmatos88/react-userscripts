const { Octokit } = require('@octokit/core');
const chalk = require('chalk');
const config = {
    secret: '75ae07bde6c62df654868f73739437916e2e418c',
    gist_id: '0264be5e8696b24838d9ba31010ecab2'
}
const octokit = new Octokit({ auth: config.secret });
const fs = require('fs');
const updateGist = async (content) => {
   return new Promise(async (resolve, reject) => {
    try {
        const resp = await octokit.request('PATCH /gists/{gist_id}', {
            gist_id: config.gist_id,
            'files': {
                'react-userscripts.user.js': {
                    'content': content
                }
            }
        });
        resolve(resp);
    } catch (error) {
        reject(error);
    }
   });
};
const readScriptJs = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile('../dist/react-userscripts.user.js', { encoding: 'utf8'}, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
};
(async function(){
    try {
        console.log(chalk.green('loading scripting'));
        const content = await readScriptJs();
        console.log(chalk.yellow(content.split('\n')[3]).replace(/[\/@]/g, ''));
        console.log(`uploading content to ${config.gist_id}`);
        await updateGist(content);
        console.log(chalk.green('upload - ok'));
    } catch (err) {
        console.log(chalk.red('failed to update gist file', err));
    }
}());
