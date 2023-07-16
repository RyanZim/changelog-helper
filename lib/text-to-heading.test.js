import test from 'ava';
import textToHeading from './text-to-heading.js';

test('normal headings', (t) => {
  for (let i = 1; i <= 6; i++) {
    t.snapshot(textToHeading('Hello World!', { level: i, style: 'normal' }));
  }
});

test('alt headings', (t) => {
  for (let i = 1; i <= 2; i++) {
    const heading = textToHeading('Hello World!', { level: i, style: 'alt' });
    t.true(
      heading
        .split('\n')
        .splice(0, 2)
        .map((i) => i.length)
        .reduce((prev, len) => (prev ? prev === len : len)),
      'heading and underline are the same length',
    );
    t.snapshot(heading);
  }
});
