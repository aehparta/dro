import { projects } from '../store.js';
import Project from './project.js';

export default {
  template: '#tmpl-projects-projects',
  components: { Project },
  data() {
    return { projects };
  },
  methods: {
    create() {
      let i = 1;
      for (; this.projects.find((p) => p.id === `Project ${i}`); i++);
      this.projects.push({ id: `Project ${i}` });
      this.$emit('select', `Project ${i}`);
    },
  },
};
