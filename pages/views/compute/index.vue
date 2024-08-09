<template>
  <view style="width: 100%;height: 100%">
    <view class="the-home">
      <component :is="component" ref="childrenPage" @returnFunc="getAllTodoNum"></component>
    </view>
    <u-tabbar
      :value="component"
      @change="handlChange"
      :safeAreaInsetBottom="false"
      activeColor="#20B1AA"
    >
      <u-tabbar-item
        text="消息待办"
        icon="chat"
        :badge="badge"
        name="Message"
      ></u-tabbar-item>
			<u-tabbar-item text="统计看板" icon="grid" name="StatisticalDashboard"></u-tabbar-item>
      <u-tabbar-item text="工作台" icon="grid" name="WorkBench"></u-tabbar-item>
      <u-tabbar-item text="我的" icon="account" name="My"></u-tabbar-item>
    </u-tabbar>
  </view>
</template>

<script>
import Vue from 'vue'
// import DatePicker from "../inspect/components/date-picker/index";
// Vue.component("DatePicker", DatePicker);
// //文本域输入组件
// import InputBox from "../inspect/components/input-box/index";
// Vue.component("InputBox", InputBox);
//
// import UserPicker from "../inspect/components/user-picker/index";
// Vue.component("UserPicker", UserPicker);
//
// //单选组件
// import SinglePicker from "../inspect/components/singleChoice/index";
// Vue.component("SinglePicker", SinglePicker);
//
// //单选组件
// import AreaProjectPicker from "../inspect/components/area-project-picker/index";
// Vue.component("AreaProjectPicker", AreaProjectPicker);
//
// //工程选择组件
// import EngineeringPicker from "../inspect/components/engineering-picker/index";
// Vue.component("EngineeringPicker", EngineeringPicker);
//
// //图片上传组件
// import UploadImage from "./components/upload/upload-image";
// Vue.component("UploadImage", UploadImage);
//
// // 附件上传组件
// import UploadFile from "../inspect/components/upload/upload-file";
// Vue.component("UploadFile", UploadFile);

import { getValueByDictCodeMore } from '@/https/inspect/common/commonUtils'
import My from './supervision/my/index'
import Message from './supervision/message/index'
import WorkBench from './supervision/workbench/workbench'
import StatisticalDashboard from './supervision/statistical/index'
import { getButtonResource } from '@/https/inspect/api/menu.js'
import ListMixins from '@/pages/views/inspect/mixins/listMixins'
import { getCurrent, getToken,getJwt } from '@/https/inspect/api/public'
import {
  actBusinessInstanceList,
} from '@/https/inspect/api/message/index.js'
export default {
  name: 'home',
  mixins: [ListMixins],
  components: {
    My,
    Message,
		StatisticalDashboard,
    WorkBench,
  },
  data() {
    return {
      badge: null,
      component: 'WorkBench',
      tarList: {
        Message: '消息待办',
				StatisticalDashboard: '统计看板',
        WorkBench: '工作台',
        My: '',
      },
      websocket: null,
      userId: '2',
    }
  },
  onLoad(opt) {
    //监理jwt认证
    this.getNowUser(opt.name);

		// this.initWebsocket()
  },
  mounted() {
    wx.onHistoryBack(function () {
      return false
    })
  },
  methods: {
    //提前加载字典
    getAllDict(){
      getValueByDictCodeMore([
        'sysDicts_risk_level',
        'sysDicts_dict_type',
        'sysDicts_problem_violation_type',
        'sysDicts_problem_level',
        'sysDicts_is_closed_loop',
        'sysDicts_problem_is_att',
        'sysDicts_assigned_type',
        'sysDicts_problem_category',
        'sysDicts_violation_level',
        'sysDicts_problem_level',
        'sysDicts_task_project_type',
        'sysDicts_construction_nature', //建设性质
        'sysDicts_contract_planNature', //计划性质
        // 'sysDicts_construction_projectStatus', //工程状态
        'sysDicts_construction_projectType', //合同模块工程类型
        'sysDicts_construction_voltageLevel', //电压等级
        'sysDicts_project_phase', //工程阶段
        'sysDicts_engineering_type', //单项工程类型
        'sysDicts_project_construction_classes', //合同工程类型
        'sysDicts_plan_nature', //合同状态
        'sysDicts_item_status', //工程状态
        'sysDicts_epidemic_type', //防疫管理-涉疫区类型
        'sysDicts_project_classification', //工程类型
        'sysDicts_risk_status', //风险状态
        'sysDicts_approval_status', //审核状态
        'sysDicts_clock_result', //打卡结果
        'sysDicts_leave_type', //请假类型
        'sysDicts_work_whether', //是否出境
        'sysDicts_person_job', //人员任职岗位
        'sysDicts_person_category', //人员分类
        'sysDicts_person_sex', //人员性别
        'sysDicts_person_education', //人员学历
        'sysDicts_person_approve', //人员双准入资格
        'sysDicts_person_do_type', //人员专业类型
        'sysDicts_person_major', //人员从事专业
        'sysDicts_person_is_check', //人员统计标识
        'sysDicts_terminate_leave_status', //销假状态
        'sysDicts_card_replenishment_period', //补卡时间段
        'sysDicts_contract_engineering_type', //非基建合同工程类型
        'sysDicts_contract_engineering_status', //非基建合同工程状态
        'sysDicts_contract_appointment_book', //一本账---总监任命书
        'sysDicts_contract_engineer_change_letter', //一本账---总监变更函
        'sysDicts_risk_level', // 风险等级
        'sysDicts_problem_category', // 问题大类
        'sysDicts_is_closed_loop', // 是否闭环
        'sysDicts_project_type', // 工程类型
        'sysDicts_violation_level ', // 违章等级
        'sysDicts_violation_type', // 违章类型
        'sysDicts_violation_nature', // 违章性质
        'sysDicts_construction_stage', //到岗到位打卡---施工阶段
        'sysDicts_teams_type', //施工班组----班组类型
        'sysDicts_problem_level', // 问题层级
        'sysDicts_supervision_journal_data_type', //监理日记----项目类型
        'sysDicts_has_been_completed', //监理日记----总监任务交办是否完成
        'sysDicts_diary_items', //总监日记----项目类型
        'sysDicts_contract_engineering_type', //非基建----合同工程类型
        'sysDicts_construction_projectStatus', //非基建----合同状态
        'sysDicts_people_type', //关键人员动态跟踪-人员类别
        'sysDicts_work_group', //关键人员动态跟踪-岗位/类别
        'sysDicts_special_group', //关键人员动态跟踪-岗位/类别
        'sysDicts_manage_group', //关键人员动态跟踪-岗位/类别
        'sysDicts_online_result', //关键人员动态跟踪-网上核实结果
        'sysDicts_equipment_type', //机械类别
        'sysDicts_security_tools', //施工机械名称
        'sysDicts_testing_instrument', //施工机械名称
        'sysDicts_construction_equipment', //施工机械名称
        'sysDicts_plan_type', //方案类型
        'sysDicts_cost_type', //造价管理-造价管理类别
        'sysDicts_audit_status', //造价管理-审核结果
        'sysDicts_problem_level', //问题台账-问题层级
        // 'sysDicts_project_classification', // 项目类型
        'sysDicts_assigned_type', //总监任务交办完成情况
        'sysDicts_person_job', // 登陆人员岗位
        'sysDicts_item_status', // 工程状态（一本账--项目名称）
        'sysDicts_item_status_package', // 工程状态
        'sysDicts_quality_material_name', // 质量管理-材料名称
        'sysDicts_inoculation_nature', // 接种类型
        'sysDicts_first_nucleic_results', // 核酸结果
        'sysDicts_health_code_color', // 健康码
      ])
    },
    /* @bugNo:96 @author ly @date 2023.2.5 start */
    //获取全部的代办数量
    getAllTodoNum(){
      let data = {
        page:1,
        limit:99,
        processState: '1',
        timeSearchInfo: '0',
        userId: uni.getStorageSync("userInfo").userId,
      }
      actBusinessInstanceList(data).then(res=>{
        if(res.data){
          this.badge = res.data.total > 99 ? '99+' : res.data.total
        }
      })
    },
    /* @bugNo:96 @author ly @date 2023.2.5 end */
    db() {
      this.$nextTick(() => {
        this.$refs.childrenPage.getInstance()
      })
    },
    async getNowUser(optName) {
			uni.removeStorageSync("token");
			var userInfo = uni.getStorageSync("userInfo")
      //获取token
      await getJwt(userInfo.userId,userInfo.roleId,userInfo.roleCode).then((res) => {
        if (res.code == 200) {
          uni.setStorageSync('token',res.data)
        }else {
					uni.showToast({
						title:"token获取失败",
						icon:'none',
						duration: 1500
					});
				}
      })
      this.component = ''
      let that = this
      setTimeout(function () {
        if (optName === 'Message') {
          that.component = 'Message'
        } else if (optName === 'StatisticalDashboard') {
          that.component = 'StatisticalDashboard'
        } else if (optName === 'WorkBench') {
          that.component = 'WorkBench'
        } else if (optName === 'My') {
          that.component = 'My'
        }
      },100)
			await this.getAllDict()
			this.getAllTodoNum()
			getCurrent().then((res) => {
			  if (res.code === 200) {
					res.data.gwName = this.formatterDict('personJob', res.data.personJob)
			    let dataArray = {
			      ...res.data,
			      userId: res.data.id,
			      userName: res.data.personName,
			      roleCode: userInfo.roleCode,
			      zh: 'jl',
			    }
					uni.setStorageSync('UserMsg', dataArray)
			  }
			})
      getButtonResource(userInfo.userId).then((res) => {
          if (res.code === 200) {
            uni.setStorage({
              key: 'permissions',
              data: res.data,
            })
          }
        })
        .catch((error) => {})
    },
    initWebsocket() {
      let that = this
      // that.$api.baseUrl = that.$api.baseUrl
      //   ? that.$api.baseUrl
      //   : window.location.origin
      // let tempUrl = that.$api.baseUrl.substr(that.$api.baseUrl.indexOf('//'))
      // let storeId = that.user.storeId
      let url = ''
      // 如果协议是https使用wss，http使用ws
      // if (that.$api.baseUrl.indexOf('https') != -1) {
      // TODO
      // userId为死值
      url = `ws://10.10.0.102:18008/jlapp/api/websocket/` + `${this.userId}`
      // } else {
      // url = `ws:${tempUrl}/pgApi/v1/websocket/poolRemain?storeId=${storeId}&userId=${that.user.id}`
      // }
      // 创建websocket
      that.websocket = uni.connectSocket({
        url: url,
        success(data) {},
      })
      // 建立websocket连接
      that.websocket.onOpen((res) => {
        // 注：只有连接正常打开中 ，才能正常成功发送消息
        that.websocket.send({
          data: 'uni-app发送一条消息',
          async success() {},
        })
        // 注：只有连接正常打开中 ，才能正常收到消息
        that.websocket.onMessage((res) => {
          if (res.data.includes('{')) {
            let dataList = res.data
            let user = this.userId
            this.badge = new Function('return ' + dataList)()[user]
          }
        })
      })
      // 监听webscket关闭的事件
      that.websocket.onClose(() => {})
      // 监听发生错误时的时间
      that.websocket.onError(() => {})
    },
    handlChange(name) {
      this.component = name
      const title = this.tarList[name]
      // 切换tabbar时，动态设置导航栏的文字
      uni.setNavigationBarTitle({
        title: title,
      })
    },
  },
}
</script>

<style lang="scss">
.none-box {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
  font-size: 14px;
}

.the-home {
  width: 100%;
  height:100%;
  ::v-deep .uni-navbar {
    ::v-deep .uni-navbar--border {
      border-bottom: 0 !important;
    }
  }
}
</style>
