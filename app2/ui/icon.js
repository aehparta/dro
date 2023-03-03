export default {
  template: '<i class="icon fa" :class="[`fa-${id}`]" :style="{ color }"></i>',
  props: {
    id: String,
    color: String,
  },
};
