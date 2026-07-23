import { test, suite } from 'node:test';
import githubNumberToLink from './github-number-to-link.js';

const repo = 'https://github.com/RyanZim/changelog-helper';

suite('issue', () => {
  test('works with numbers', (t) =>
    t.assert.snapshot(githubNumberToLink(repo, 'issue', 123)));
  test('works with strings', (t) =>
    t.assert.snapshot(githubNumberToLink(repo, 'issue', '123')));
  test('works with strings including hash', (t) =>
    t.assert.snapshot(githubNumberToLink(repo, 'issue', '#123')));
});

suite('pull request', () => {
  test('works with numbers', (t) =>
    t.assert.snapshot(githubNumberToLink(repo, 'pr', 123)));
  test('works with strings', (t) =>
    t.assert.snapshot(githubNumberToLink(repo, 'pr', '123')));
  test('works with strings including hash', (t) =>
    t.assert.snapshot(githubNumberToLink(repo, 'pr', '#123')));
});
