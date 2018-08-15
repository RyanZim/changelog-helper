'use strict';
// NOTE: This loads the development version of Vue.js; consider changing
const Vue = require('vue');
const semver = require('semver');
const timestamp = require('time-stamp');
const marked = require('marked');

const hashArgs = window.location.hash.substr(1).split('|');

const currentVersion = semver.clean(hashArgs[0]);
const githubUrl = hashArgs[1];

const versionOptions = ['patch', 'minor', 'major'].map((upgradeType) => {
  return semver.inc(currentVersion, upgradeType);
});
versionOptions.unshift(currentVersion);
versionOptions.push('other');

new Vue({
  el: '#app',
  data: {
    newVersion: currentVersion,
    versionOptions,
    customVersion: '',
    changes: [{}],
    error: '',
    isDone: false,
  },
  computed: {
    computedVersion() {
      return this.newVersion === 'other'
        ? semver.clean(this.customVersion)
        : this.newVersion;
    },
    filteredChanges() {
      return this.changes.filter((i) => i.description && i.description.trim());
    },
    markdown() {
      const list = !this.filteredChanges.length
        ? ''
        : `- ${this.filteredChanges.map(changeToString).join('\n- ')}\n`;

      return `# ${this.computedVersion} / ${timestamp()}\n\n${list}\n`;
    },
    preview() {
      return marked(this.markdown);
    },
  },
  methods: {
    submit() {
      if (!this.computedVersion) {
        this.error = `Invalid version "${this.customVersion}"`;
        return;
      }
      if (!this.filteredChanges.length) {
        this.error = 'No release notes written; aborting.';
        return;
      }
      this.error = '';

      fetch('/', {
        method: 'post',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: this.markdown,
      })
        .then(() => (this.isDone = true))
        .catch(console.error);
    },
  },
});

function changeToString(change) {
  let str = change.description.trim();
  const issue = issuePrToLink(change.issue, 'issue');
  const pr = issuePrToLink(change.pr, 'pr');
  if (issue || pr) str += ' (';
  if (issue) str += issue;
  if (issue && pr) str += ', ';
  if (pr) str += pr;
  if (issue || pr) str += ')';

  return str;
}

function issuePrToLink(item, type) {
  const typeMap = {
    issue: 'issues',
    pr: 'pull',
  };

  if (!item) return;
  if (item.startsWith('#')) item = item.slice(1);
  return `[#${item}](${githubUrl}/${typeMap[type]}/${item})`;
}
