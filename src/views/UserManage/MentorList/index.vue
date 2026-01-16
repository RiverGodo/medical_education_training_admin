<template>
  <AllScholar :permissionItemAll="permissionItem3" scholar-title="导师" :role="4" />
</template>

<script>
import AllScholar from '../AllScholar/index';
export default {
  props: {
      permissionItem3: {
        type: Object,
        default: null
      }
  },
  components: { AllScholar }
}
</script>
