<!-- 
打包说明
1、按需修改mainfest.json 里的版本号
3、修改main.js 文件的以下内容：
	EnvKey
 -->

#### 页面方法
```javascript
//showLoading  hideLoading  showToast
this.showLoading(title:String = "加载中...");
this.showToast(title:String = "")
this.hideLoading();

//时间格式化
this.moment().format('YYYY-MM-DD HH:mm:sss')

//获取全局公共参数
const globaData = this.globaData

//获取登录用户信息
const personal =util.getPersonal();

//获取tabbar
this.tabbar = util.getMenu();

//获取当前tab的菜单参数，主要是获取index_code
let tempMenu;
if (util.getMenuMore().length==0) {
	tempMenu = util.getTabbarMenu();
} else{
	tempMenu = util.getPageData(option);
}

//对象数组排序
let yearArray=[{text:"2019-2020",value:"2019-2020"},{text:"2020-2021",value:"2020-2021"}]
yearArray.sort(util.compare('value',0));

//页面跳转
util.openwithData(pageUrl,data,{
	refresh(data){//子页面调用父页面需要的方法
		console.log(data)
	}
})

//子页面给父页面传值
const eventChannel = this.getOpenerEventChannel()
eventChannel.emit('refresh', {data: 'test'});

//子页面获取父页面传入的data数据
onLoad: function(option) {
	const itemData = util.getPageData(option);
	console.log(itemData)
},

/**
 * post 请求
 * 注：responseData 为返回的对象 {"msg":"成功","code":"0000","data":{},"state":"ok"} data一层里面的内容
 * 如果想获取data外层整个返回参数，请使用response
 */

let comData={
	stu_code:personal.user_code,
	index_code:this.index_code,
}
this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'web/sub/termList',comData,(responseData,response)=>{
	console.log(response)
},error=>{
	console.log(error)
})

//获取按钮权限
this.getPermissionByPosition("add,delete",tempMenu.access.split("#")[1],response=>{
	console.log("response: ",response);
})

//获取Vue 环境变量
process.env.NODE_ENV  "development":"production"

//使用原生navbar 新建页面style 下拉刷新配置参数
 "style" :                                                                                    
{
	"navigationBarTitleText": "",
	"enablePullDownRefresh": true,
	"app-plus": {
		"pullToRefresh": {
			"support": true,
			"style": "circle",
			"offset":"0px"
		}
	},
	"h5":{
		"pullToRefresh":{
			"offset":"0px"
		}
	}
}
//使用自定义navbar时  新建页面style 下拉刷新配置参数
 "style" :                                                                                    
{
	"navigationStyle": "custom", // 隐藏系统导航栏
	"navigationBarTitleText": "",
	"enablePullDownRefresh": true,
	"app-plus": {
		"pullToRefresh": {
			"support": true,
			"style": "circle",
			"offset":"76px"
		}
	},
	"h5":{
		"pullToRefresh":{
			"offset":"44px"
		}
	}
}

```

#### 模块说明
包名|说明|App|Api|流程
-|-|-|-|-
examination|考务系统-成绩分析|Liu|Meng(广西)|开发
examination|考务系统-班级成绩趋势|Zhao|Meng(广西)|开发
leave|学生请假管理|Liu|Kong|开发
stu_behavior|学生行为|Liu|Ruan(广西)|开发
schapp_work|学生考勤|Liu|Ruan(广西)|开发
stu_comment|学生评语|Liu|Ruan(广西)|开发
stu_actionComment|行为与评语(学生/家长端)|Liu|Ruan(广西)|开发
schhome|家校互动 教师端|Liu|meng(广西)|开发 
schhome_stu|家校互动 学生端|Liu|Gu|开发