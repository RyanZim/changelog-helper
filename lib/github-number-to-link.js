const typeMap = {
  issue: 'issues',
  pr: 'pull',
};

export default function issuePrToLink(github, type, number) {
  number = number.toString().trim();
  if (number.startsWith('#')) number = number.slice(1);
  return `[#${number}](${github}/${typeMap[type]}/${number})`;
}
