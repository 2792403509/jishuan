<script>
    // import {appConfig} from '@/common/config/appConfig.js'
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
      uni.removeStorageSync('engineeringInfo')
    console.log('App Hide')
  },
  created() {
    this.loadJS()
  },
  methods: {
    loadJS() {
      // console.log(1)
      let head = document.head || document.getElementsByTagName('head')[0]
      let script = document.createElement('script')
      script.src = './static/jweixin-1.0.0.js'
      head.appendChild(script)
      // console.log(script)
      let that = this
      script.addEventListener('load', (e) => {
        this.init()
      })
    },

    init() {
        wx.config({
            beta: true,// 调用wx.invoke形式的接口值时，该值必须为true。
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appConfig.codeAppid, // 必填，政务微信的cropID
            timestamp: '1608692903', // 必填，生成签名的时间戳
            nonceStr: 'XKIvykvwOuAeIbl', // 必填，生成签名的随机串
            signature: 'ad0c077e6b5fbfe0c9e5394703d8262a3bc21fc3',// 必填，签名，见附录1
            jsApiList: ['multiWindows_open', 'multiWindows_close', 'multiWindows_subscribe', 'multiWindows_publish',
                'multiWindows_finish','ext_FileManager_Remove','ext_unzip_compression','ext_screenControl_direction',
                'ext_ISCP_Init', 'ext_ISCP_ConnectService', 'ext_ISCP_Close','ext_zipFile_Zip','ext_unzip_untie',
                'ext_ISCP_GetLocalPort', 'ext_ISCP_AnalyseUrl', 'ext_ISCP_Status', 'ext_ISCP_ResetConnect',
                'openEnterpriseApp', 'ext_SGMap_init', 'ext_SGMap_Operation', 'ext_Popover_Open', 'ext_Popover_Close',
                'ext_DataCache_Get', 'ext_DataCache_Save',
                'ext_WeMeet_Join', 'ext_WeMeet_Login', 'ext_WeMeet_Init', 'selectEnterpriseContact', 'openChatWithMsg',
                'changeNaviColor', 'getLocalResPath', 'shareWechatMessage', 'shareAppMessage', 'ext_wxlog_setLogOpen',
                'ext_wxlog_getLogFile', 'scanQRCode', 'chooseImage', 'previewImage', 'openLocation', 'ext_Net_Upload',
                'ext_Net_CancelUpload', 'ext_Net_Download', 'onHistoryBack',
                'ext_Etas_List', 'ext_Etas_Init', 'ext_Etas_Reg', 'ext_Etas_UnReg', 'ext_Etas_checkStatus', 'ext_Etas_Verify',
                'ext_Etas_SaveData', 'ext_Etas_GetData', 'previewFile', 'ext_SGMap_Location', 'startRecord',
                'translateVoice', 'stopRecord', 'ocr', 'chooseVideo', 'getLocalImgData', 'getZipAppDirectory',
                'openBluetoothAdapter','startBluetoothDevicesDiscovery','stopBluetoothDevicesDiscovery','getBluetoothDevices',
                'createBLEConnection','getBLEDeviceServices','getBLEDeviceCharacteristics','notifyBLECharacteristicValueChange','onBLECharacteristicValueChange',
                'getAuthCode', 'getLocation','ext_FileManager_Write',
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
      wx.invoke('ext_screenControl_Slider', {
        data: {
          enable: 'NO',
        },
      })
    },
  },
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
/*每个页面公共css */
@import 'uview-ui/index.scss';
// @import 'static/css/base.scss';
[type='search']::-webkit-search-decoration {
  display: none;
}

page {
  height: 100vh;
}
// 处理popup弹窗中的picker下拉选层级不够,手动提升层级
/deep/ .uni-picker-container {
  z-index: 10076 !important;
}
</style>
