<template>
    <lb :show="show" :type=3 @close="close" />
</template>
<script>
import lbMixins from './lbMixins'
export default {
  mixins: [ lbMixins ]
}
</script>
