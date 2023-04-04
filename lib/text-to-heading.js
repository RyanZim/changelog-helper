const repeat = (str, n) => {
  return Array(n).fill(str).join('');
};

export default function textToHeading(text, opts) {
  let str = '';
  text = text.trim();

  if (opts.style === 'alt') {
    str += `${text}\n${repeat(opts.level === 1 ? '=' : '-', text.length)}\n\n`;
  } else str += `${repeat('#', opts.level)} ${text}\n\n`;

  return str;
}
