<template>
  <div>
    <c-title :text="title" :hide="true"></c-title>
    <h1>{{MESSAGE}}</h1>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import cTitle from 'components/title';
  export default {
    data () {
      return {
        title: 'ERROR!',
        MESSAGE:  '404 Not Found！'
      }
    },
    components: {cTitle}
  }
</script>
