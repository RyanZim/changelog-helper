'use strict';
const fs = require('fs');
const path = require('path');
const readPkgUp = require('read-pkg-up');
const githubUrlFromGit = require('github-url-from-git');
const opn = require('opn');
const startServer = require('./server');

const { pkg, path: pkgPath } = readPkgUp.sync();
const github = githubUrlFromGit(pkg.repository.url);

if (!github) {
  console.error('Error: Must have GitHub repository in package.json');
  process.exit(1);
}

startServer(handleData);

const url = `http://localhost:3000/#${pkg.version}|${github}`;

console.log(`Server running on ${url}`);
console.log(
  "Your browser should open shortly; if it doesn't, click on the link above"
);

opn(url);

function handleData(data) {
  console.log();
  // TODO: Allow HISTORY.md, etc.
  const changelogPath = path.join(pkgPath, '../CHANGELOG.md');

  fs.readFile(changelogPath, 'utf8', (err, oldMarkdown = '') => {
    if (err && err.code === 'ENOENT') {
      console.log(`Creating new file: ${changelogPath}`);
    } else if (err) return console.error(err);
    else console.log(`Prepending to ${changelogPath}`);

    console.log();
    console.log(ensureTrailingNewline(data));

    fs.writeFile(
      changelogPath,
      ensureTrailingNewline(data + oldMarkdown),
      (err) => err && console.error(err)
    );
  });
}

function ensureTrailingNewline(text) {
  return `${text.trim()}\n`;
}
