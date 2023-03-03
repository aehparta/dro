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
      for (; this.projects?.[`Project ${i}`]; i++);
      this.projects[`Project ${i}`] = {};
      this.select(`Project ${i}`);
    },
    select(id) {
      this.$emit('select', id);
    },
  },
};
