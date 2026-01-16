<template>
<div>
    <screen :types="13" :selectType2="true" @selectChange2="selectChange2" :select4="selectList" :title="title" @handleBack="handleBack"/>
    <router-view :key="$route.fullPath"/>
</div>
</template>

<script>
  import screen from '../../components/ScreenFrame'
  export default {
    components: { screen },
    data(){
        return{
            title: '',
            selectList: [
                {id: 1, title: '作业'},
                // {id: 2, title: '问答'},
                // {id: 3, title: '课程'},
            ],
        }
    },
    computed: {
        types(){
            return this.$route.query
        }
    },
    methods: {
        setHeadData(url, title){
            this.$router.push({path: '/tutor/'+url, query: this.types})
            this.title = title
            this.$forceUpdate()
        },
        selectChange2(v){
            switch(v){
                case 1:
                this.setHeadData('job-list', this.types.title)
                break;
                case 3:
                this.setHeadData('curriculum', this.types.title)
                break;
            }
        },
        handleBack() {
            this.$router.push('/dashboard/tutor-course')
        },
    },
    mounted() {
        $MakeAppointment.$on('MakeAppointment', (n) => {
            if(n) this.title = this.types.title + '（' + n + '）'
        } )
        this.title = this.types.title
        // if(!this.types.homework_count) this.selectList = []
        if(this.types.curriculum_type == 'offline_concentrate') this.selectList.push({id: 3, title: '课程'})
    }
  }
</script>
<style lang="less" scoped>

</style>

