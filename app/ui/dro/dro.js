import { ui, projects, machines, materials, tools } from '../store.js';
import {
  project,
  material,
  machine,
  tool,
  offsets,
  offset,
} from '../projects/store.js';
import Projects from '../projects/projects.js';
import Project from '../projects/project.js';
import Materials from '../materials/materials.js';
import Material from '../materials/material.js';
import Machines from '../machines/machines.js';
import Machine from '../machines/machine.js';
import Tools from '../tools/tools.js';
import Tool from '../tools/tool.js';
import Sidebar from '../sidebar/sidebar.js';
import Axis from './axis.js';
import Composition from './composition.js';
import OffsetSidebar from './offset/sidebar.js';

export default {
  template: '#tmpl-dro-dro',
  components: {
    Projects,
    Project,
    Materials,
    Material,
    Machines,
    Machine,
    Tools,
    Tool,
    Sidebar,
    Axis,
    Composition,
    OffsetSidebar,
  },
  data() {
    return {
      projects,
      project,
      materials,
      material,
      machines,
      machine,
      tools,
      tool,
      offsets,
      offset,
      ui,
      show: 'default',
    };
  },
  mounted() {
    on('cancel', this.cancel);
  },
  unmounted() {
    off('cancel', this.cancel);
  },
  methods: {
    toggle(show) {
      this.show = this.show !== show ? show : 'default';
    },
    cancel() {
      this.show = 'default';
    },
  },
};
