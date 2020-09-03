'use strict';
const fs = require('fs');
const path = require('path');
const readPkgUp = require('read-pkg-up');
const githubUrlFromGit = require('github-url-from-git');
const open = require('open');
const timestamp = require('time-stamp');
const startServer = require('./server');
const githubNumberToLink = require('./lib/github-number-to-link');
const textToHeading = require('./lib/text-to-heading');

const pkg = readPkgUp.sync();

const github = githubUrlFromGit(pkg.packageJson.repository.url);
if (!github) {
  console.error('Error: Must have GitHub repository in package.json');
  process.exit(1);
}

// TODO: Allow HISTORY.md, etc.
const changelogPath = path.join(pkg.path, '../CHANGELOG.md');
let changelogContents = '';
try {
  changelogContents = fs.readFileSync(changelogPath, 'utf8');
} catch (err) {
  if (err.code !== 'ENOENT') {
    console.error(err);
    process.exit(1);
  }
}

const headingType = getHeadingType(changelogContents);

const port = startServer({ handleData, json2markdown });

const url = `http://localhost:${port}/#${pkg.packageJson.version}`;

console.log(`Server running on ${url}`);
console.log(
  "Your browser should open shortly; if it doesn't, click on the link above"
);

open(url);

function handleData(data) {
  console.log();

  if (!changelogContents) console.log(`Creating new file: ${changelogPath}`);
  else console.log(`Prepending to ${changelogPath}`);

  console.log();
  console.log(ensureTrailingNewline(data));

  fs.writeFile(
    changelogPath,
    ensureTrailingNewline(data + changelogContents),
    (err) => err && console.error(err)
  );
}

function json2markdown(data) {
  const { changes, version } = data;

  const heading = textToHeading(`${version} / ${timestamp()}`, headingType);

  const list = !changes.length
    ? ''
    : `- ${changes.map(changeToString).join('\n- ')}\n\n`;

  return heading + list;
}

function getHeadingType(markdown) {
  let headingType = { level: 1, style: 'normal' };
  const lines = markdown.split('\n');
  // match pound sign headings
  const normalHeadingMatch = lines[0].match(
    /(#{1,6}) \d+(\.\d+){2}.* \/ \d{4}(-\d{2}){2}/
  );
  if (normalHeadingMatch) headingType.level = normalHeadingMatch[1].length;
  // match underline headings
  if (lines[0].match(/\d+(\.\d+){2}.* \/ \d{4}(-\d{2}){2}/)) {
    if (lines[1].indexOf('=') === 0) headingType.style = 'alt';
    if (lines[1].indexOf('-') === 0) headingType = { level: 2, style: 'alt' };
  }
  return headingType;
}

function changeToString(change) {
  let str = change.description.trim();

  const arr = [];
  if (change.issue) arr.push(githubNumberToLink(github, 'issue', change.issue));
  if (change.pr) arr.push(githubNumberToLink(github, 'pr', change.pr));
  const numbers = arr.join(', ');
  if (numbers) str += ` (${numbers})`;

  return str;
}

function ensureTrailingNewline(text) {
  return `${text.trim()}\n`;
}
