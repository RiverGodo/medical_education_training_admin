
import lb from '../lb/ManageLb'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    components: { lb }, 
    methods:{
        close(){
            this.$emit('close')
        }
    }
}