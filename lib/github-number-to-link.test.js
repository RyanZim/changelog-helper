import test from 'ava';
import githubNumberToLink from './github-number-to-link.js';

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
