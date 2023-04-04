import Vue from 'vue/dist/vue.esm.js';
import AsyncComputed from 'vue-async-computed';
import { marked } from 'marked';
// Only load the parts of semver we need
import clean from 'semver/functions/clean';
import inc from 'semver/functions/inc';
const semver = { clean, inc };

Vue.use(AsyncComputed);

const hashArgs = window.location.hash.substr(1).split('|');

const currentVersion = semver.clean(hashArgs[0]);

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
    preview() {
      return marked.parse(this.markdown || '');
    },
  },
  asyncComputed: {
    markdown() {
      return fetch('/json2markdown', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          changes: this.filteredChanges,
          version: this.computedVersion,
        }),
      })
        .then((res) => res.text())
        .catch(console.error);
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
