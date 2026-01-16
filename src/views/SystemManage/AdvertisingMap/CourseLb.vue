<template>
    <lb :show="show" :type=2 @close="close" />
</template>
<script>
import lbMixins from './lbMixins'
export default {
  mixins: [ lbMixins ]
}
</script>
