import { config, set_secret } from '../store.js';

export default {
  template: '#tmpl-config-backup',
  data() {
    return {
      config,
    };
  },
  methods: {
    set(key, value) {
      if (_.get(this.config, key) != value) {
        _.set(this.config, key, value);
        switch (key) {
          case 'backup.git.url':
            this.$toast.info('Git backup URL saved.');
            break;
          case 'backup.git.branch':
            this.$toast.info('Git backup branch saved.');
            break;
          case 'backup.git.username':
            this.$toast.info('Git backup username saved.');
            break;
        }
      }
    },
    setSecret(key, value) {
      if (value) {
        set_secret(key, value);
        this.$refs.password.value = '';
        this.$toast.info('Git backup password saved.');
      }
    },
  },
};
