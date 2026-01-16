<template>
    <div class="student-learning-period">
        <div class="echarts-view2" style="width: 100%" id="time-interval"></div>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                
            }
        },
        mounted(){
            this.echerts3()
        },
        methods: {
             echerts3(){
                let myChart = echarts.init(document.getElementById('time-interval'))
                let option = {
                    title: this.setEchertsTitle('学员学习时段'),
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    legend: {
                        orient: 'vertical',
                        right: '30%',
                        top: '30%',
                        data: [
                            {name: '0-4'},
                            {name: '4-8'},
                            { name: '8-12'},
                            { name: '12-16'},
                            { name: '16-20'},
                            { name: '20-24'},
                        ]
                        // icon: 'circle',
                        // formatter: ' {name}'
                    },
                    xAxis : [   //这里有很多的show，必须都设置成不显示
                        {
                            type : 'category',
                            data : [],
                            axisLine: {
                                show: false
                            },
                            splitLine:{
                                show: false
                            },
                            splitArea: {
                                interval: 'auto',
                                show: false
                            }
                        }
                    ],
                    yAxis : [ //这里有很多的show，必须都设置成不显示
                        {
                            type : 'value',
                            axisLine: {
                                show: false
                            },
                            splitLine:{
                                show: false
                            },
                        }
                    ],
                    toolbox: {   
                        show: false,
                    },
                    series: [
                        {
                            name: '学习时段',
                            type: 'gauge',
                            center: ['30%','55%'],
                            radius: '80%',
                            splitNumber: 6,
                            // max: 96,
                            detail: {
                                formatter: '{value}%',
                                textStyle: { fontSize: 16 }
                            },
                            axisLine: {
                                lineStyle: { 
                                    width: 15,
                                    color: [[1/6, '#6666C6'], [2/6, '#FFB94B'],[3/6, '#FFB94B'],
                                    [4/6, '#5A92FF'], [5/6, '#5A92FF'], [1, '#6666C6']]
                                },
                            },
                            splitLine: {
                                length: 15,
                                lineStyle: {
                                    width: 5,
                                    color: '#eff1f9'
                                }
                            },
                            axisTick: { show: false },
                            axisLabel: {
                                distance: -40,
                                formatter:  function (value){
                                    let arr = ['0%','5%', '14%', '24%', '40%', "60%", "96%"]
                                    switch(Number.parseInt(value)) {
                                        case 0:
                                        return arr[0];
                                        break;
                                        case Number.parseInt(100/6):
                                        return arr[1];
                                        break;
                                        case Number.parseInt(200/6):
                                        return arr[2];
                                        break;
                                        case Number.parseInt(300/6):
                                        return arr[3];
                                        break;
                                        case Number.parseInt(400/6):
                                        return arr[4];
                                        break;
                                        case Number.parseInt(500/6):
                                        return arr[5];
                                        break;
                                        case 100:
                                        return arr[6];
                                        break;
                                    }
                                },
                                color: '#8489A1',
                                fontSize: 10,
                            },
                            pointer: {
                                length: 70,
                                width: 3,
                            },
                            data: [
                                // {value: 5, name: '0-4'},
                                // {value: 9, name: '4-8'},
                                // {value: 10, name: '8-12'},
                                // {value: 16, name: '12-16'},
                                {value: 60, name: '16-20'},
                                // {value: 36, name: '20-24'},
                            ]
                        },
                    ]
                };
                myChart.setOption(option);
            },
        }
    }
</script>

<style lang="less" scoped>
    .student-learning-period{
        background-color: #fff;
        height: 260px;
        border-radius: 4px;
        .echarts-view2{
            height: 240px;
            margin: 20px 0 0 0;
        }
    }
</style>