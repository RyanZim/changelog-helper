'use strict';
// NOTE: This loads the development version of Vue.js; consider changing
const Vue = require('vue');
const semver = require('semver');
const marked = require('marked');

const currentVersion = semver.clean(window.location.hash.substr(1));

new Vue({
  el: '#app',
  data: {
    releaseType: '',
    changes: [''],
    isDone: false,
  },
  computed: {
    filteredChanges() {
      return this.changes.filter((i) => !!i);
    },
    markdown() {
      const list = !this.filteredChanges.length
        ? ''
        : `- ${this.filteredChanges.join('\n- ')}\n`;

      const newVersion = this.releaseType
        ? semver.inc(currentVersion, this.releaseType)
        : currentVersion;
      const isoDate = new Date().toISOString().substr(0, 10);
      return `# ${newVersion} / ${isoDate}\n\n${list}\n`;
    },
    preview() {
      return marked(this.markdown);
    },
  },
  methods: {
    submit() {
      if (!this.releaseType) {
        return alert('No Release Type Selected; aborting.');
      }
      if (!this.filteredChanges.length) {
        return alert('No release notes written; aborting.');
      }

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
