<template>
  <el-dialog
    append-to-body
    width="660px"
    custom-class="member-dialog"
    style="padding: 0"
    :visible="dialogVisible"
    title="选择员工"
    @open="handleDialogOpen"
    @close="handleDialogClose"
    body-style="padding: 1px;"
  >
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card" shadow="never" body-style="padding: 10px; min-height: 300px;">
          <div slot="header" class="clearfix">
            <span>选择员工</span>
          </div>
          <div v-loading="treeLoading">
            <el-input
              placeholder="请输入姓名搜索"
              v-model="dialogFilterVal"
              style="margin-bottom: 10px"
              clearable
              @clear="handleSearch"
              @keyup.enter.native="handleSearch"
            >
              <el-button slot="append" icon="el-icon-search" type="primary" @click="handleSearch"></el-button>
            </el-input>
            <div style="max-height: 450px; overflow-y: auto">
              <el-tree
                @node-click="showtreerule = false"
                ref="memberTree"
                :data="memberTreeData"
                show-checkbox
                node-key="empNo"
                :default-expanded-keys="memberExpandedKey"
                :default-checked-keys="memberExpandedKey"
                :props="defaultProps"
                @check="handleChecked"
                :filter-node-method="handleFilterNodeMethod"
                :empty-text="'暂无数据'"
                :default-expand-all="expandAll"
              >
              </el-tree>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="never" body-style="padding: 10px; min-height: 300px; max-height: 516px; overflow-y: auto">
          <div slot="header" class="clearfix">
            <span>已选员工：{{ currentSelObj.length }}人</span>
          </div>
          <el-tag closable v-for="(item, index) in currentSelObj" :key="item.empNo + index" @close="handleCloseTag(item, $event)">{{
            item.empName
          }}</el-tag>
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">取 消</el-button>
      <el-button type="primary" @click="handleSaveMember">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { loopchildren } from '../../../utils/'

export default {
  name: 'SelectMemberModal',
  props: {
    // 弹窗展示
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 回显选中树节点
    memberExpandedKey: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    // 展开所有
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 树默认字段属性
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      dialogFilterVal: '', // 弹窗过滤条件
      treeLoading: false, // 树形数据加载
      // 权限树数组
      memberTreeData: [],
      // 当前选择对象
      currentSelObj: []
    }
  },
  mounted() {
    // 监听获取树形数据
    this.$bus.$on('bindTreeList', this.handleBindTreeList)
    this.$bus.$on('bindMemberTags', this.handleBindMemberTags)
  },
  methods: {
    // 处理弹框打开
    handleDialogOpen() {
      this.handleFetchTreeList()
    },
    // 获取树列表
    handleFetchTreeList() {
      this.treeLoading = true
      // 发起获取数据通信
      this.$emit('fetchTreeData', this.dialogFilterVal)
    },
    // 绑定树形数据
    handleBindTreeList(data) {
      if (data) {
        let _tempData = JSON.parse(JSON.stringify(data))
        loopchildren(_tempData, 'childList', 'empInfo')
        this.treeLoading = false
        this.memberTreeData = _tempData
      }
    },
    // 处理弹窗关闭
    handleDialogClose() {
      this.$emit('closeDialog')
      // 清空数据
      this.dialogFilterVal = ''
      this.currentSelObj = []
      this.memberTreeData = []
      this.$refs.memberTree.setCheckedKeys([])
    },
    // 保存选择员工
    handleSaveMember() {
      if (this.currentSelObj.length > 0) {
        let empNos = this.currentSelObj.map(m => m.empNo)
        this.$emit('saveSelMember', { empNos, emps: JSON.parse(JSON.stringify(this.currentSelObj)) })
      } else {
        this.$message({
          message: '请选择员工',
          type: 'warning'
        })
      }
    },
    // 弹窗搜索
    handleSearch() {
      this.$refs.memberTree.filter(this.dialogFilterVal)
    },
    // 处理选中
    handleChecked(node, { checkedKeys, checkedNodes }) {
      this.handleBindSelectNodes(node, checkedKeys, checkedNodes)
    },
    // 筛选
    handleFilterNodeMethod(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取并绑定角色对应员工
    handleBindMemberTags(emps) {
      this.currentSelObj = emps
    },
    // 处理重新绑定选中节点
    handleBindSelectNodes(node, checkedKeys, checkedNodes) {
      let _newObj = []
      for (let i = 0; i < checkedKeys.length; i++) {
        const empNo = checkedKeys[i]
        if (empNo == undefined) continue
        _newObj.push({
          empNo,
          empName: checkedNodes[i]['empName']
        })
      }
      this.currentSelObj = _newObj
    },
    // 处理节点
    handleExpandedKeyChange(filerNode) {
      let _currentSelObj = [...this.currentSelObj]
      if (filerNode) {
        _currentSelObj = _currentSelObj.filter(m => m.empNo != filerNode.empNo)
      }
      let _temp = _currentSelObj.map(m => m.empNo)
      this.currentSelObj = _currentSelObj
      this.$refs.memberTree.setCheckedKeys([..._temp])
    },
    // 关闭标签
    handleCloseTag(node, e) {
      this.handleExpandedKeyChange({ ...node })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 15px;
}

::v-deep .el-dialog__body {
  max-height: 590px;
  padding: 10px;
}

::v-deep .el-dialog__footer {
  padding: 20px;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-top: 1px solid gainsboro;
}

::v-deep .el-tag {
  margin-left: 6px;
  margin-bottom: 6px;
}
</style>
