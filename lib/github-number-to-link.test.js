'use strict';
const test = require('ava');
const githubNumberToLink = require('./github-number-to-link');

const repo = 'https://github.com/RyanZim/changelog-helper';

test('issue', (t) => {
  t.snapshot(githubNumberToLink(repo, 'issue', 123), 'works with numbers');
  t.snapshot(githubNumberToLink(repo, 'issue', '123'), 'works with strings');
  t.snapshot(
    githubNumberToLink(repo, 'issue', '#123'),
    'works with strings including hash'
  );
});

test('pull request', (t) => {
  t.snapshot(githubNumberToLink(repo, 'pr', 123), 'works with numbers');
  t.snapshot(githubNumberToLink(repo, 'pr', '123'), 'works with strings');
  t.snapshot(
    githubNumberToLink(repo, 'pr', '#123'),
    'works with strings including hash'
  );
});
