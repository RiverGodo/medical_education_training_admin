<template>
  <AllScholar :permissionItemAll="permissionItem6" scholar-title="学管" :role="3" />
</template>

<script>
import AllScholar from '../AllScholar/index';
export default {
  props: {
      permissionItem6: {
        type: Object,
        default: null
      }
  },
  components: { AllScholar }
}
</script>
