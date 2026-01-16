<template>
    <div class='base-list-container'>
        <Row type='flex' justify='space-between' align='middle'>
            <div class='tab-bar'>
                <slot name='tabBar'></slot>
            </div>
            <div class='control-bar'>
                <slot name='controlBar'></slot>
            </div>
        </Row>
        <Table @on-selection-change='selectionChangeHandler' :row-class-name="tableRowClassName"
               :highlight-row='canSelect' :show-header='showHeader'
               :columns="headerData" :data="tableData" :height="tableHeight" @on-expand="rowExpandHandler"
               @on-row-click='rowClickHandler'>
             <template slot-scope="{ column, row, index }" slot="sort-index">
               <span>{{$config.addZero(index+1)}}</span>
            </template>
             <template slot-scope="{ column, row, index }" slot="test-set-score">
               <InputNumber @on-change="testScoreChange($event, row, index)" :disabled="row.disableScore" v-model="row.score_count" :max="100" :min="0"></InputNumber>
            </template>
            <template slot-scope="{ column, row, index }" slot="badge">
                <Badge class="mark" :count="+(showBadgeCount(column.prop,row))"></Badge>
            </template>
            <template slot-scope="{ column, row, index }" slot="normalHeader">
                <Tooltip :transfer=true
                         v-if="column.tooltip && column.mixColumn && !column.isBtn && !column.limit && !column.useCombo && !column.useTimePicker &&!column.useMark && (doMix(column,row) || doMix(column,row) === 0)"
                         :content="doMix(column,row)" max-width="400" theme="light">
                    <span>{{doMix(column,row)}} 1121</span>
                </Tooltip>
                <span v-if="!column.tooltip && column.mixColumn && !column.isBtn && !column.limit && !column.useCombo && !column.useTimePicker &&!column.useMark">
                   {{doMix(column,row)}}1111
                 </span>
                <Tooltip :transfer=true
                         v-if="column.tooltip && !column.mixColumn && !column.isBtn && !column.limit && !column.useCombo && !column.isLink &&!column.useTimePicker &&!column.useMark && (showPropValue(column.prop,row) || showPropValue(column.prop,row) === 0)"
                         :content="showPropValue(column.prop,row)" max-width="auto" theme="light">
                   <p>
                      <span>{{showPropValue(column.prop,row)}}</span>
                      <span @click="toBarrage(row)" class="barrage-text" v-if="column.prop == 'group_type_title'&&row.type === 0">弹幕管理（{{row.barrage_num}}）</span>
                   </p>
                </Tooltip>
                <span v-if="!column.tooltip && !column.mixColumn && !column.isBtn && !column.limit && !column.useCombo && !column.isLink &&!column.useTimePicker &&!column.useMark">
                    {{showPropValue(column.prop,row)}}
                 </span>
                <a target="_blank" class="a-link" :href="showPropValue(column.prop,row)"
                   v-if="!column.mixColumn && !column.isBtn && !column.limit && column.isLink && !column.useCombo && !column.useTimePicker &&!column.useMark">
                    {{showPropValue(column.prop,row)}}
                </a>
                <p v-if='!column.mixColumn && !column.isBtn && column.limit  && !column.useCombo && !column.useTimePicker'>
                    {{showLimiteValue(column.prop,row,column.limit,column.actionName)}}
                    <span class='ellipsis' v-if='row.needLimit && !row.showAll'>...</span>
                    <Button type='text' class='show-all' v-if='row.needLimit && !row.showAll'
                            @click='showLimitText(row,column.actionName)'>显示全部
                    </Button>
                    <Button type='text' class='fold' v-if='row.needLimit && row.showAll'
                            @click='hideLimitText(row,column.actionName)'>折叠
                    </Button>
                </p>
                <Button :class="{'prop-btn':true}" type='text'
                        v-if="!column.mixColumn && column.isBtn && !column.useCombo && !column.useTimePicker"
                        @click="handleBtnClick(index,row,column.param)">
                    {{showPropValue(column.prop,row)}}
                </Button>
                <Select :transfer='true' v-if='column.useCombo&&columnComboData&&comboDataList'
                        v-model="comboDataList[index]" :multiple='!comboIsSelect' placeholder="请选择"
                        @on-open-change="selectOpenChange(row,column.comboListIndex)"
                        @on-change='comboChangeHandler(row,index,column.actionName,column.prop)'
                        :disabled="column.disabledFunc?column.disabledFunc(row):false">
                    <Option v-for="(c,k) in columnComboData[column.comboListIndex]" :key="k"
                            :label="c[column.listLabel]" :value="c[column.listValue]"></Option>
                </Select>
                <DatePicker v-if='column.useTimePicker&&comboDataList' v-model="comboDataList[index]" type="datetime"
                            placeholder="选择日期时间" :transfer="true"
                            @on-change='changeTimeSelect(row,index,column.actionName,column.prop,column.param)'>
                </DatePicker>
                <span v-if='column.useMark'>
                  <Icon type="md-checkmark" v-if='row[column.prop] === 1'/>
                </span>
            </template>
            <template slot-scope="{ column, row, index }" slot="operation">
                <div style="display:flex; justify-content: center">
                    <div class='handle-component' v-for='btn in column.groupBtn' :key="btn.id" v-if='btn.showFunc?btn.showFunc(row):true'>
                        <Button :type="btn.canDisabled?'text':'text'"
                                :class="[{'hover-show':btn.hoverShow},btn.btnClass]"
                                @click="handleBtnClick(index,row,btn.param,orderNum)"
                                v-if='!btn.isSwitch && !btn.useCheckBox && btn.disabledText || btn.text'
                                :disabled="btn.canDisabled?btn.disabeldFunc(row):false">
                            <Icon class="btn-icon" :type='btn.text' v-if='btn.isIcon'/>
                            <span v-if='!btn.isIcon'>{{btn.canDisabled?btn.disabeldFunc(row)?btn.disabledText:btn.text:btn.text}}</span>
                        </Button>
                        <Switch :value='row[btn.switchKey]' :disabled="checkSwitchDisabled(row,btn.disabledFuc)"
                                @on-change='changeSwitchValue(row,btn.switchKey,btn.actionName,btn.param)'
                                v-if='btn.isSwitch'>
                            <span slot="open">{{checkSwitchDisabled(row,btn.disabledFuc)?btn.disableText:btn.onText}}</span>
                            <span slot="close">{{checkSwitchDisabled(row,btn.disabledFuc)?btn.disableText:btn.offText}}</span>
                        </Switch>
                        <Checkbox v-model='row[btn.switchKey]'
                                  @on-change='changeSwitchValue(row,btn.switchKey,btn.actionName,btn.param)'
                                  v-if='btn.useCheckBox'>{{btn.text}}
                        </Checkbox>
                    </div>
                </div>
            </template>
        </Table>
        <slot name="pager"></slot>
    </div>
</template>
<script>
  import baseList from './BaseList.vue'

  export default {
    name: 'baseList',
    data() {
      return {
        dataChange: false,
        comboDataList: null,
        selectList: this.columnComboData
      }
    },
    props: {
      tableData: { //表格数据
        type: Array,
        required: true
      },
      headerData: { //header数据
        type: Array,
        required: true,
        default: ([]) => { [] }
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      columnFormatter: {
        type: Array
      },
      columnFormatterData: {type: Array},
      columnComboData: {
        type: Array
      },
      comboModelList: {
        type: Array
      },
      isStripe: {
        type: Boolean,
        default: true
      },
      parentData: {
        type: Object
      },
      tableHeight: {
        type: Number
      },
      canSelect: {
        type: Boolean,
        default: false
      },
      rowClassName: {
        default: 'base-list-row'
      },
      comboIsSelect: {
        type: Boolean,
        default: false
      },
      comboAddDir: {
        type: Number,
        default: 1
      },
      orderNum: {
        type: Number
      }
    },
    created() {
      this.handleHeaderData()
    },
    watch: {
      headerData(val) {
        this.handleHeaderData()
      },
      tableData(val) {
        this.dataChange = true;
        var vm = this;
        setTimeout(function () {
          vm.dataChange = false;
        }, 500);
      },
      comboModelList(val) {
        var i, j;
        if (!this.comboDataList) {
          this.comboDataList = [];
          if (this.comboModelList) {
            for (i = 0; i < this.comboModelList.length; i++) {
              this.comboDataList.push(this.comboModelList[i]);
            }
          }
        } else {
          var foundDeferent;
          if (this.dataChange) {
            this.comboDataList = [];
            for (i = 0; i < val.length; i++) {
              this.comboDataList.push(val[i]);
            }
          } else if (val.length !== this.comboDataList.length) {
            if (val.length > this.comboDataList.length) {
              let item = this.comboIsSelect ? null : [];
              if (this.comboAddDir) this.comboDataList.push(item);
              else this.comboDataList.unshift(item);
            } else {
              if (val.length === this.comboDataList.length - 1) {
                for (i = 0; i < this.comboDataList.length.length; i++) {
                  if (this.comboIsSelect) {
                    if (this.comboDataList[i] != val[i]) {
                      this.comboDataList.splice.splice(i, 1);
                      break;
                    }
                  } else {
                    if (this.comboDataList[i].length != val[i].length) {
                      this.comboDataList.splice.splice(i, 1);
                      break;
                    } else {
                      foundDeferent = false;
                      for (j = 0; j < this.comboDataList[i].length; j++) {
                        if (val.indexOf(this.comboDataList[i][j]) < 0) {
                          this.comboDataList.splice.splice(i, 1);
                          foundDeferent = true;
                          break;
                        }
                      }
                      if (!foundDeferent) {
                        for (j = 0; j < val.length; j++) {
                          if (this.comboDataList[i].indexOf(val[j]) < 0) {
                            this.comboDataList.splice.splice(i, 1);
                            foundDeferent = true;
                            break;
                          }
                        }
                      }
                      if (foundDeferent)
                        break;
                    }
                  }
                }
              } else {
                this.comboDataList = [];
                for (i = 0; i < val.length; i++) {
                  this.comboDataList.push(val[i]);
                }
              }
            }
          }
        }
      }
    },
    mounted() {
      // 资料管理来回切换报异常
      if (this.comboModelList && this.comboModelList.length > 0) {
        this.comboDataList = [];
        for (var i = 0; i < this.comboModelList.length; i++) {
          this.comboDataList.push(this.comboModelList[i]);
        }
      }
    },
    computed: {
      //  selectList(){
      //    return JSON.parse(JSON.stringify(this.columnComboData))
      //  }
    },
    methods: {
      toBarrage(row){
        if(row.barrage_num){
          this.$router.push({name: 'barrage-management', query: {catalog_id: row.id}})
        }else this.$Message.info('当前视频暂无弹幕');
      },
      testScoreChange(val, row, index){
        this.$emit('testScoreChange', val, row, index)
      },
      isbaseType(d) {
        if (d instanceof Array && d instanceof Object) return d
        else return ''
      },
      tableRowClassName() {
        return this.rowClassName
      },
      handleHeaderData() {
        if(this.headerData[1].label == '资料名称'){
        }
        this.headerData.map((it) => {
          it.title = it.label
          it.align && it.align == 'left' ? it.align = 'left' : it.align = 'center'
          if (it.prop) it.key = it.prop || ''
          if (it.minwidth) it.minWidth = it.minwidth
          if (!it.isFree && it.groupBtn) {
            it.slot = 'operation'
            it.title = this.getHeaderLabel(it)
            it.ellipsis = true
            it.tooltip = true
          }
          if (it.sort) {
            it.slot = 'sort-index'
            it.title = this.getHeaderLabel(it)
            it.width = 100
          }
          if (it.useCombo && it.key === 'pre_curriculum') it.width = 300
          if (it.isFree || !it.groupBtn && !it.selection && !it.sort && !it.listExpand && !it.badge) {
            it.slot = 'normalHeader'
            it.ellipsis = true
            it.tooltip = true
            it.title = this.getHeaderLabel(it)
            if (it.useFilter) {
              let d = this.getFilters(it.prop);
              d.map((t) => {
                t.label = t.text
                t.value = t.value.value
              })
              it.filters = d
              it.filterMethod = (value, row) => {
                return row[it.key] === value;
              }
            }
          }
          if (it.badge) {
            it.slot = 'badge'
            it.title = this.getHeaderLabel(it)
          }
          if (it.selection) {
            it.type = 'selection'
            it.width = 60
            it.align = 'center'
          }
          if(it.testSetScore){
            it.slot = 'test-set-score'
          }
          if (it.listExpand) {
            it.slot = 'listExpand'
            it.type = 'expand'
            it.width = 120
            it.childHeader.map((t) => {
              t.title = t.label
              t.key = t.prop
            })
            it.render = (h, params) => {
              return h('div', {style:{display:'flex',justifyContent:'center',flexDirection: 'column',flexWrap: 'nowrap'}},[
                h(baseList, {
                  props: {
                    tableData: params.row.childData,
                    headerData: it.childHeader,
                    isStripe: false,
                    parentData: params.row,
                    columnFormatter: it.listColumnFormatter
                  },
                  on: {
                    childBtnClick: (param, index, parentData) => {
                      this.$nextTick(() => {
                        this.childBtnClickHandler(param, index, parentData)
                      })
                    }
                  }
                }),
                it.listExpandBtn ? h('div',{style:{display:'flex',justifyContent:'center',flexWrap: 'nowrap',alignItems: 'center', color: '#4098FF',marginTop: '10px' }},[
                  h('Icon',{props: { type: 'md-add', size: 30},
                  on: {
                        click: () => {  this.$emit('add-off-line-courses', params.row) }
                  }}),
                  h('span',{
                      on: {
                          click: () => {  this.$emit('add-off-line-courses', params.row) }
                      }
                    },'添加课程')
                 ]) : ''
              ]);

            }
          }
        })
      },
      getHeaderLabel(item) {
        return item.ruleCount ? item.label + '(' + item.ruleCount + ')' : item.label;
      },
      selectionChangeHandler(selection) {
        this.$emit('selectionChange', selection);
      },
      changeTimeSelect(row, index, actionName, key, param) {
        this.$store.dispatch(actionName, {id: row.id, key: key, value: this.comboDataList[index]});
        if (!this.dataChange) this.$emit(param, row);
      },
      showBadgeCount(propname, row) {
        return row[propname];
      },
      selectOpenChange(row, index) {
        this.selectList = this.$config.copy(this.columnComboData, [])
        let list = this.selectList[index]
        if (row && row.title && list && list.length > 0) {
          list.map((it, k) => {
            if (it.title === row.title) {
              list.splice(k, 1)
            }
          })
        }
      },
      comboChangeHandler(row, index, actionName, key) {
        if (actionName) {
          this.$store.dispatch(actionName, {id: row.id, key: key, value: this.comboDataList[index]})
        }
      },
      getComboModel(prop, row) {
        return row[prop];
      },
      checkSwitchValue(row, key) {
        return row[key];
      },
      checkSwitchDisabled(row, disFunc) {
        if (disFunc) return disFunc(row);
        return false;
      },
      changeSwitchValue(row, key, actionName, param) {
        if (actionName) this.$store.dispatch(actionName, {id: row.id, key: key, value: !row[key]});
        if (param) this.$emit(param, row);
      },
      rowExpandHandler(row, expanded) {
        if (expanded) this.$emit('expandOpen', row);
        this.tableData.map((it) => {
          if (it.id == row.id) it._expanded = expanded
        })
      },
      rowClickHandler(row, event, column) {
        this.$emit('rowClick', row);
      },
      childBtnClickHandler(param, index, parentData) {
        this.$emit('childBtnClick', param, index, parentData);
      },
      handleBtnClick(index, row, param, i) {
        if (this.parentData) this.$emit('childBtnClick', param, index, this.parentData);
        else {
          if(param == 'moveUp' || 'moveDown') this.$emit(param, index, row, i);
          else this.$emit(param, index, row);
        }
      },
      formatter(row, propname) {
      },
      doMix(headerData, row) {
        if (headerData.mixFunc) {
          var value = (headerData.mixFunc(row));
          if (headerData.useFormatter) {
            for (var i = 0; i < this.columnFormatter.length; i++) {
              if (this.columnFormatter[i].columnName == headerData.mixprop) {
                for (var j = 0; j < this.columnFormatterData[this.columnFormatter[i].dataIndex].length; j++) {
                  if (value instanceof Array) {
                    var str = [], list = this.columnFormatterData[this.columnFormatter[i].dataIndex];
                    value.map((item, index) => {
                      list.map((_item, _index) => {
                        if (_item.role_id == item) str.push(_item.role_name);
                      })
                    })
                    if (str.length > 0) return str.toString();
                    else return ''
                  } else {
                    if (this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataProp] == value) {
                      return this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataValue];
                    }
                  }
                }
              }
            }
          } else return this.isEmptyArray(value)
        }
      },
      isEmptyArray(arr) {
        return arr instanceof Array ? '' : arr
      },
      showPropValue(propname, row) {
        if (this.columnFormatter) {
          for (var i = 0; i < this.columnFormatter.length; i++) {
            if (this.columnFormatter[i].columnName == propname) {
              if (this.columnFormatter[i].doFormat) {
                if (this.columnFormatter[i].doFormat(row[propname])&&this.columnFormatter[i].doFormat(row[propname]).length > 0) return this.columnFormatter[i].doFormat(row[propname]);
              } else {
                for (var j = 0; j < this.columnFormatterData[this.columnFormatter[i].dataIndex].length; j++) {
                  if (row[propname] instanceof Array) {
                    var str = [], list = this.columnFormatterData[this.columnFormatter[i].dataIndex];
                    row[propname].map((item, index) => {
                      list.map((_item, _index) => {
                        if (_item.role_id == item) str.push(_item.role_name)
                        else if (_item.special_id == item) str.push(_item.name)
                      })
                    })
                    if (str.length > 0) return str.toString();
                  } else {
                    if (this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataProp] == row[propname]) {
                      return this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataValue];
                    }
                  }
                }
              }
            }
          }
        }
        return this.isEmptyArray(row[propname])
      },
      showLimiteValue(propname, row, limit, actionName) {
        var v = this.showPropValue(propname, row);
        if (!row.needLimit && v.length > limit) {
          this.$store.dispatch(actionName + 'need_limit', {id: row.id, needLimit: true});
          this.$store.dispatch(actionName + 'show_all', {id: row.id, showAll: false})
        }
        if (row.showAll || !row.needLimit) return v;
        else return v.substring(0, limit);
      },
      showLimitText(row, actionName) {
        this.$store.dispatch(actionName + 'show_all', {id: row.id, showAll: true})
      },
      hideLimitText(row, actionName) {
        this.$store.dispatch(actionName + 'show_all', {id: row.id, showAll: false})
      },
      getChildData(row, headerData) {
        return row.childData;
      },
      getFilters(propname) {
        if (this.columnFormatter) {
          for (var i = 0; i < this.columnFormatter.length; i++) {
            if (this.columnFormatter[i].columnName == propname) {
              if (this.columnFormatter[i].doFormat) {
                break;
              } else {
                var result = [];
                for (var j = 0; j < this.columnFormatterData[this.columnFormatter[i].dataIndex].length; j++) {
                  result.push({
                    text: this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataValue],
                    value: {
                      prop: propname,
                      value: this.columnFormatterData[this.columnFormatter[i].dataIndex][j][this.columnFormatter[i].dataProp]
                    }
                  })
                }
                return result;
              }
            }
          }
        }
        return null;
      },
      doColumnFilter(value, row) {
        return row[value.prop] === value.value;
      }
    }
  }
</script>

<style lang="less" scoped>
    .barrage-text{
      color: #2d8cf0;
      margin-left: 10px;
      cursor: pointer;
    }
    /deep/ .ivu-table-cell-expand>.ivu-icon-ios-arrow-forward{
      display: none;
    }
    /deep/ .ivu-table-cell-expand{transform: none}
     /deep/ .ivu-table-cell-expand::after{
      content: '展开'
     }
     /deep/.ivu-table-cell-expand-expanded::after{
      content: '收起'
     }
    /deep/ td.ivu-table-expanded-cell{ padding: 0; padding-bottom: 10px;}
    /deep/ .ivu-icon-md-add{ margin-right: 5px; }
    /deep/ .ivu-table{
        font-size: 16px !important;
    }
    /deep/ .ivu-icon-ios-trash-outline {
        font-size: 18px
    }

    /deep/ .btn-icon {
        font-size: 24px
    }

    /deep/ .ivu-switch-checked:after {
        left: 36px;
    }

    /deep/ .ivu-select-selection > div {
        overflow: hidden;
    }

    /deep/ .ivu-switch {
        margin-top: 7px;
        width: 60px
    }

    /deep/ .ivu-table-header > table, /deep/ .ivu-table-body > table {
        min-width: 100%;
    }

    /deep/ .ivu-btn-text:focus, /deep/ .ivu-btn:focus {
        box-shadow: none !important;
        outline: none
    }

    /deep/ .ivu-btn-text {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
    }

    /deep/ .ivu-table-cell-ellipsis > div {
        display: inline-block;
        width: 100%;
    }

    /deep/ .ivu-table-cell-ellipsis > div > .ivu-tooltip, /deep/ .ivu-table-cell-ellipsis > div > .ivu-tooltip > .ivu-tooltip-rel {
        width: 100%
    }

    /deep/ .ivu-table-cell-ellipsis > div > .ivu-tooltip > .ivu-tooltip-rel {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
    }

    /deep/ th, td > .ivu-table-cell > div > span {
        /*font-size: 14px*/
    }

    /deep/ .ivu-table th {
        height: 50px;
    }

    /deep/ .ivu-tooltip-rel {
        /*font-size: 14px*/
    }

    .base-list-container {
        .tab-bar {
            display: inline-block;

            span {
                padding: 10px 15px;
                cursor: pointer;
            }
        }

        .control-bar {
            display: inline-block;
        }

        thead {
            tr {
                th {
                    .cell {
                        font-weight: 200;
                    }
                }
            }
        }

        &.light-header {
            thead {
                tr {
                    height: 50px;

                    th {
                        background-color: #ffffff;

                        .cell {
                            background-color: #ffffff;
                            font-weight: 400;
                            /*font-size: 14px;*/
                            color: #757575;
                            letter-spacing: 0;
                        }
                    }
                }
            }
        }

        .base-list-row {
            .cell {
                /*font-size: 14px;*/
                color: #141111;
                letter-spacing: 0;

                .handle-component {
                    display: inline-block
                }

                .Button {
                    margin: 0;

                    span {
                        /*font-size: 14px;*/
                        color: #141111;

                        i {
                            color: #757575;
                        }
                    }

                    &:hover {
                        span {
                            color: #3DAAFF;

                            i {
                                color: #3DAAFF;
                            }
                        }
                    }

                    &.Button--primary {
                        background-color: #3DAAFF;
                        border: 0;

                        span {
                            color: #ffffff;

                            i {
                                color: #ffffff;
                            }
                        }

                        &:hover {
                            span {
                                color: #ffffff;

                                i {
                                    color: #ffffff;
                                }
                            }
                        }

                        &.is-disabled {
                            background-color: #757575;
                        }
                    }
                }

                .handle-component {
                    margin-right: 30px;

                    &.prop-btn {
                        margin: 0;
                    }
                }
            }

            .hover-show {
                display: none;
            }

            &:hover {
                .hover-show {
                    display: inline-block;
                }
            }

            .show-divider {
                border-right: 1px solid #979797;
                padding-left: 14px;
                margin-right: 14px;
            }

            .a-link {
                color: #428bca;
            }

            .a-link:hover {
                text-decoration: underline !important;
            }
        }
    }
</style>
