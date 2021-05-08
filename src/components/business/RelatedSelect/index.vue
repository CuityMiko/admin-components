<template>
  <div class="wrapper">
    <el-select v-model="selectVal1" :placeholder="placeholder1" size="large" filterable clearable @change="changeSelect1">
      <el-option v-for="(item, index) in optionsList1" :key="'opt1' + index" :label="item.name" :value="item.id"></el-option>
    </el-select>
    <el-select
      clearable
      filterable
      multiple
      collapse-tags
      size="large"
      :placeholder="placeholderText2"
      remote
      :remote-method="getOptionsList2"
      @clear="getOptionsList2('clear')"
      @change="changeSelect2"
      v-loadmore="getOptionsList2"
      v-model="selectVal2"
    >
      <el-option v-for="(item, index) in optionsList2" :key="'opt2' + index" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
/**
 * 组件为动态选择框，二级支持滚动加载更多，多选
 * 传入两个数据数组，数组需要处理，内部结构以id和name作为逻辑操作值，需要外部进行数据处理后传入
 * changeSelect1：第一个select值改变
 * changeSelect2: 第二个select值改变
 * getOptionsList2：二级数据请求（远程搜索、清空、加载更多）
 */
export default {
  name: 'RelatedSelect',
  props: {
    placeholderText1: {
      type: String,
      default: '项目名称'
    },
    placeholderText2: {
      type: String,
      default: '请选择小区'
    },
    dataList1: {
      type: Array,
      default: () => []
    },
    dataList2: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectVal1: '',
      selectVal2: '',
      placeholder1: this.placeholderText1,
      placeholder2: this.placeholderText2
    }
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const selectDom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap, .el-card__body')
        selectDom.addEventListener('scroll', function () {
          const isEnd = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (isEnd) {
            binding.value()
          }
        })
      }
    }
  },
  computed: {
    optionsList1() {
      return this.dataList1
    },
    optionsList2() {
      return this.dataList2
    }
  },
  watch: {
    dataList1(n, o) {
      if (n && n.length) {
        this.selectVal1 = n[0].id
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    changeSelect1(val) {
      let _name = ''
      if (val) {
        let idx = this.dataList1.findIndex(item => {
          return item.id === val
        })
        _name = this.dataList1[idx].name
      }
      this.$emit('RSChange1', { id: val, name: _name })
    },
    changeSelect2(val) {
      this.$emit('RSChange2', val)
    },
    // 二级数据请求 emit
    getOptionsList2(val) {
      this.$emit('RSDataFetch', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: inline-block;
  .el-select {
    margin: 0 10px 8px 0;
  }
}
</style>
