// UI组件 - 图标组件
import AdminIcon from './components/ui/AdminIcon/index'
// 业务组件 - 登录面板
import LoginPanel from './components/business/LoginPanel/index'
// 业务组件 - 选择员工组件
import SelectMemberModal from './components/business/SelectMemberModal/index'
// 业务组件 - 关联选择器
import RelatedSelect from './components/business/RelatedSelect/index'

export default function (Vue) {
  Vue.use(AdminIcon)
  Vue.use(LoginPanel)
  Vue.use(SelectMemberModal)
  Vue.use(RelatedSelect)
}
