export default {
    data() {
        return {
            isSuper: false,
            states: 'all',
            select: [{id: 'all', title: '全部机构'}],
            valueSelect1: 'all',
        }
    },
    computed: {
        select2(){
            return [{id: 'all', title: "全部状态"}, ...this.formList[2].selectList]
        },
        getOrganizationId(){
            return this.isSuper ? (this.valueSelect1 == 'all' ? null : this.valueSelect1) : +sessionStorage.getItem('organizationId')
        },
        pageDataCounts() {
            return {
              current: this.current,
              pageSize: this.pageSize,
              isSerial: false
            }
        }
    },
    methods: {
        setInit(){
            this.isSuper = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1 ? true : false
            PostData('components/getOrganization').then((res) => {
                this.select = [...this.select, ...res.data]
                this.valueSelect1 = this.select[0].id
                const INDEX = this.$route.name == 'pop-up-notification' ? 2 : this.$route.name === 'instructions' ? 0 : 1
                this.formList[INDEX].selectList = res.data
                if(!this.isSuper) this.formList[INDEX].disable = true
                console.log(this.formList,'this.formList');
            })
        },
        selChange(){
            this.current = 1
            this.getList()
        }
    },
    mounted() {
        this.setInit()
    },
}