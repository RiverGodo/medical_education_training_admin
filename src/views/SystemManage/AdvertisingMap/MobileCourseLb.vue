<template>
    <lb :show="show" :type=4 @close="close" />
</template>
<script>
import lbMixins from './lbMixins'
export default {
  mixins: [ lbMixins ]
}
</script>
