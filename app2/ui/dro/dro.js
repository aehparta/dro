import { projects, machines, ui, materials } from '../store.js';
import Materials from '../materials/materials.js';
import Material from '../materials/material.js';
import Machines from '../machines/machines.js';
import Machine from '../machines/machine.js';
import Sidebar from '../sidebar/sidebar.js';
import Projects from '../projects/projects.js';
import Project from '../projects/project.js';
import Axis from './axis.js';
import Offset from './offset.js';

export default {
  template: '#tmpl-dro-dro',
  components: {
    Axis,
    Materials,
    Material,
    Machines,
    Machine,
    Sidebar,
    Projects,
    Project,
    Offset,
  },
  data() {
    return {
      projects,
      project: undefined,
      project_id: undefined,
      machines,
      machine: undefined,
      machine_id: undefined,
      ui,
      decimals: 3,
      materials,
      material: undefined,
      material_id: undefined,
      show: 'default',
      offset_ids: { G54: 0, G55: 0, G56: 0, G57: 0, G58: 0, G59: 0 },
      offsets: undefined,
      offset_id: 'G54',
    };
  },
  created() {
    // this.$watch('projects', () => this.select('project', this.project_id));
    // this.select('machine');
    // this.$watch('machines', () => this.select('machine'));
    setTimeout(() => {
      const id = localStorage.getItem('project');
      if (this.projects[id]) {
        this.selectProject(id);
      }
    }, 500);
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
    selectProject(id) {
      this.select('project', id);
      localStorage.setItem('project', id);
    },
    selectMachine(id) {
      this.select('machine', id);
    },
    selectMaterial(id) {
      this.select('material', id);
    },
    select(name, id) {
      this[`${name}_id`] = id;
      this[name] = this[`${name}s`]?.[this[`${name}_id`]];

      if (name === 'project') {
        this.select('machine', this.project.machine_id);
        this.select('material', this.project.material_id);
        this.selectOffset(this.project.offset_id);
      } else {
        this.projects[this.project_id][`${name}_id`] = id;
      }

      this.show = 'default';
    },
    selectOffset(id) {
      if (!id) {
        id = 'G54';
      }
      this.offset_id = id;
      this.offsets = this.project?.offsets?.[this.machine_id];
      this.projects[this.project_id].offset_id = id;
    },
    setOffset(machine_id, axis_id, offset) {
      const offsets = this.project?.offsets || {};
      this.projects[this.project_id].offsets = {
        ...offsets,
        [this.machine_id]: {
          ...(offsets?.[this.machine_id] || {}),
          [this.offset_id]: {
            ...(offsets?.[this.machine_id]?.[this.offset_id] || {}),
            [axis_id]: offset,
          },
        },
      };
      this.offsets = this.projects[this.project_id]?.offsets?.[this.machine_id];
    },
  },
};
