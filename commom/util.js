/**
 * APP 工具类
 */
import Vue from 'vue'
/**
 * 获取有层级关系的部门数组  
 * （应用场景：人事接口返回的部门数组为一维数组，需要根据dpt_code自行分层）
 * @param {Object} dptList
 */
function getDptTree(dptList) {
	const map = {};
	const val = [];
	dptList.forEach((item) => {
		map[item.dpt_code] = item;
	});
	dptList.forEach((item) => {
		const parent = map[item.pcode];
		if (parent) {
			(parent.children || (parent.children = [])).push(item);
		} else {
			val.push(item);
		}
	});
	return val
}

//设置登录用户的信息
function setPersonal(data) {
	uni.setStorageSync(Vue.prototype.personal + Vue.prototype.globaData.APPCODE + Vue.prototype.globaData.EnvKey, JSON
		.stringify(data))
}
//获取登录用户的信息
function getPersonal() {
	const _value = uni.getStorageSync(Vue.prototype.personal + Vue.prototype.globaData.APPCODE + Vue.prototype.globaData
		.EnvKey)
	if (_value) {
		return JSON.parse(_value)
	} else {
		return {}
	}
}
//清除登录用户的信息
function removePersonal() {
	uni.removeStorageSync(Vue.prototype.personal + Vue.prototype.globaData.APPCODE + Vue.prototype.globaData.EnvKey);
}

//设置登录用户的菜单信息
function setMenu(data) {
	uni.setStorageSync(Vue.prototype.meunList, JSON.stringify(data))
}
//获取登录用户的菜单信息
function getMenu() {
	const _value = uni.getStorageSync(Vue.prototype.meunList)
	if (_value) {
		return JSON.parse(_value)
	} else {
		return {}
	}
}

//设置登录用户的菜单信息
function setMenuMore(data) {
	uni.setStorageSync(Vue.prototype.meunListMore, JSON.stringify(data))
}
//获取登录用户的菜单信息
function getMenuMore() {
	const _value = uni.getStorageSync(Vue.prototype.meunListMore)
	if (_value) {
		return JSON.parse(_value)
	} else {
		return {}
	}
}

//设置切换tabbar时菜单信息
function setTabbarMenu(data) {
	uni.setStorageSync(Vue.prototype.tabbarMenu, JSON.stringify(data))
}
//获取切换tabbar时菜单信息
function getTabbarMenu() {
	const _value = uni.getStorageSync(Vue.prototype.tabbarMenu)
	if (_value) {
		return JSON.parse(_value)
	} else {
		return {}
	}
}

//清除登录用户的菜单信息
function removeMenu() {
	uni.removeStorageSync(Vue.prototype.meunList);
	uni.removeStorageSync(Vue.prototype.meunListMore);
}

//清除本地所有storage缓存
function clearStorage() {
	try {
		uni.clearStorageSync();
	} catch (e) {
		console.log(e);
	}
}

/**
 * 获取设备唯一识别码
 * 注意：官网文档解释——非 App 端由 uni-app 框架生成并存储，清空 Storage 会导致改变
 */
function getDeviceId() {
	const res = uni.getSystemInfoSync();
	return res.deviceId
}
//获取浏览器识别码
function getBroswerId() {
	const res = uni.getSystemInfoSync();
	let system = res.system
	return system.replace(/\s*/g, "");

}

/**
 * 跳转页面 页面刷新
 * @param {Object} url 页面路径
 * @param {Object} data 传参
 * @param {Object} _events 页面监听，用于子页面向父页面传值
 */
function openwithData(url, data = {}, _events = {}) {
	uni.navigateTo({
		url: url + '?pagedata=' + encodeURIComponent(JSON.stringify(data)),
		animationType: 'pop-in',
		events: {
			..._events
		},
		success: function(res) {
			// res.eventChannel.emit('pagedata', data)
		}
	});

}

/**
 * 获取父页面传过来的参数
 * @param {Object} option
 */
function getPageData(option) {
	try {
		return JSON.parse(option.pagedata)
	} catch (e) {
		console.log(e);
		return {}
	}

}

/**
 * Toast弹窗
 * @param {Object} title
 */
var timeTask = null

function showToast(title) {
	if (timeTask) {
		clearTimeout(timeTask)
	}
	timeTask = setTimeout(() => {
		//#ifdef APP-PLUS
		plus.nativeUI.toast(title);
		//#endif
		//#ifndef APP-PLUS
		uni.showToast({
			icon: 'none',
			title: title,
			position: 'bottom',
			duration: 2000,
		});
		//#endif
	}, 50)
}

/**
 * 获取按钮权限
 */

function getPermissionByPosition(op_codes, index_code, callback) {
	let personal = getPersonal();
	var comData = {
		platform_code: personal.platform_code, //平台代码
		app_code: personal.app_code, //应用系统代码
		unit_code: personal.unit_code, //单位代码
		index_code: index_code, //页面码,页面对应的权限码:index结尾的页面码,必传,由前端从皮得到
		op_code: op_codes, //操作码,操作码,如add,edit,delete等功能操作码
		grd_code: 0, //年级代码，全部年级则传-1,不需要判断年级则传0
		cls_code: 0, //班级代码，年级下全部班级则传-1，不需要判断班级则传0
		stu_code: 0, //学生代码，全部学生则传-1，不需要判断学生则传0
		sub_code: 0, //科目代码，全部科目则传“-1”，不需要判断年级则传“0”
		access_token: personal.access_token //用户令牌
	};
	Vue.prototype.post(Vue.prototype.globaData.INTERFACE_SSO_SUB + 'acl/permissionByPosition', comData, response => {
		console.log("response: ", response);
		let ins = op_codes.split(",");
		let outs = response.result.split(",");
		let result = []
		ins.map((initem, index) => {
			result.push(outs[index] == "0" ? false : true)
		})
		callback(result)
	}, error => {
		console.log("error: ", error);
		let ins = op_codes.split(",");
		let result = []
		ins.map((initem, index) => {
			result.push(false)
		})
		callback(result)
	})
}

// 获取未读数
function getUnReadCut(index_code, url, callback) {
	let personal = getPersonal();
	var comData = {
		platform_code: personal.platform_code, //平台代码
		app_code: personal.app_code, //应用系统代码
		index_code: index_code.split("#")[1], //页面码,页面对应的权限码:index结尾的页面码,必传,由前端从皮得到
		unit_code: personal.unit_code, //单位代码
		user_code: personal.user_code, //用户代码
		access_token: personal.access_token,
		numtp: 0,
	};
	Vue.prototype.post(url, comData, response => {
		callback(response.list);
	}, error => {
		console.log("error: ", error);
		callback([]);
	})
}

function getPageArray() {
	let tempAAA = '';
	//#ifndef APP-PLUS
	var tempUrl = window.location.href;
	console.log('getPageArray.tempUrl:' + tempUrl);
	var tempArr = tempUrl.split('/');
	console.log('tempArr:' + JSON.stringify(tempArr));
	let urlFlag = 0;
	for (var a = 0; a < tempArr.length; a++) {
		if (tempArr[a].indexOf("wx") != -1) {
			urlFlag = a;
		}
	}
	urlFlag = urlFlag + 2;
	let tempUrl1 = [];
	for (var a = 0; a < urlFlag; a++) {
		tempUrl1.push(tempArr[a]);
	}
	tempAAA = tempUrl1.join('/');
	//#endif 
	console.log('tempAAA:' + tempAAA);
	let tempArray = [{
		// 非凸起按钮未激活的图标，可以是uView内置图标名或自定义扩展图标库的图标
		// 或者png图标的【绝对路径】，建议尺寸为80px * 80px
		// 如果是中间凸起的按钮，只能使用图片，且建议为120px * 120px的png图片
		iconPath: tempAAA + "/static/tabbar/practive.png",
		// 激活(选中)的图标，同上
		selectedIconPath: tempAAA + "/static/tabbar/practive_select.png",
		// 显示的提示文字
		text: '学生请假', //学生请假
		// 红色角标显示的数字，如果需要移除角标，配置此参数为0即可
		count: 0,
		// 如果配置此值为true，那么角标将会以红点的形式显示
		isDot: false,
		// 如果使用自定义扩展的图标库字体，需配置此值为true
		// 自定义字体图标库教程：https://www.uviewui.com/guide/customIcon.html
		customIcon: false,
		// 如果是凸起按钮项，需配置此值为true
		midButton: false,
		// 点击某一个item时，跳转的路径，此路径必须是pagees.json中tabBar字段中定义的路径
		pagePath: '/pages/leave/stuLeaveIndex', // 1.5.6新增，路径需要以"/"开头
		img_href: tempAAA + "/static/tabbar/stuLeave.png",
		url: 'schapp_stuLeave',
		childList: []
	}, {
		text: "家长代请假", //家长代请假
		pagePath: "/pages/leave/parLeaveIndex",
		iconPath: tempAAA + '/static/tabbar/study.png',
		selectedIconPath: tempAAA + '/static/tabbar/study_select.png',
		count: 0,
		isDot: false,
		customIcon: false,
		img_href: tempAAA + "/static/tabbar/parLeave.png",
		url: 'schapp_parLeave',
		childList: []
	}, {
		text: "教师代请假", //教师代请假
		pagePath: "/pages/leave/teaLeaveIndex",
		iconPath: tempAAA + "/static/tabbar/study.png",
		selectedIconPath: tempAAA + "/static/tabbar/study_select.png",
		count: 0,
		isDot: false,
		customIcon: false,
		img_href: tempAAA + "/static/tabbar/tecLeave.png",
		url: 'schapp_teaLeave',
		childList: [{
				name: '教师代请假',
				icon: tempAAA + "/static/images/leave/tecLeave.png",
				pagePath: "/pages/leave/teaLeaveAsk",
				url: 'schapp_teaLeave_askForLeave'
			},
			{
				name: '请假查询',
				icon: tempAAA + "/static/images/leave/leavequery.png",
				pagePath: "/pages/leave/teaLeaveQuery",
				url: 'schapp_teaLeave_leaveSelect'
			}
		]
	}, {
		text: "学生行为", //学生行为，教师
		pagePath: "/pages/stu_behavior/index",
		iconPath: tempAAA + "/static/tabbar/study.png",
		selectedIconPath: tempAAA + "/static/tabbar/study_select.png",
		count: 0,
		isDot: false,
		customIcon: false,
		img_href: tempAAA + "/static/tabbar/behavior_tab.png",
		url: 'schapp_Behavior',
		childList: [{
				name: '课堂行为',
				icon: tempAAA + "/static/images/stu_behavior/class_behavior.png",
				pagePath: "/pages/stu_behavior/class_behavior_index",
				url: 'schapp_Behavior_classroom'
			},
			{
				name: '课外行为',
				icon: tempAAA + "/static/images/stu_behavior/extra_behavior.png",
				pagePath: "/pages/stu_behavior/extra_behavior_index",
				url: 'schapp_Behavior_extracurricula'
			},
			{
				name: '学生谈话',
				icon: tempAAA + "/static/images/stu_behavior/stu_talk.png",
				pagePath: "/pages/stu_behavior/stu_talk_index",
				url: 'schapp_Behaviorn_conversation'
			}
		]
	}, {
		text: "阅卷", //阅卷--老师
		pagePath: "/pages/markingPapers/index",
		iconPath: tempAAA + '/static/tabbar/study.png',
		selectedIconPath: tempAAA + '/static/tabbar/study_select.png',
		count: 0,
		isDot: false,
		customIcon: false,
		img_href: tempAAA + "/static/tabbar/markingPapers_tab.png",
		url: 'schapp_markingPapers',
		childList: [{
				name: '周测',
				icon: tempAAA + '/static/tabbar/zhouce.png',
				pagePath: "/pages/markingPapers/weekTest_index",
				url: 'schapp_markingPapers_weekTest'
			},
			{
				name: '月考',
				icon: tempAAA + '/static/tabbar/yuekao.png',
				pagePath: "/pages/markingPapers/monthTest_index",
				url: 'schapp_markingPapers_monthTest'
			},
			{
				name: '期中期末',
				icon: tempAAA + '/static/tabbar/qizhongqimo.png',
				pagePath: "/pages/markingPapers/termTest_index",
				url: 'schapp_markingPapers_termTest'
			}
		]
	}, {
		text: "考务", //考务
		pagePath: "/pages/examination/index",
		iconPath: tempAAA + '/static/tabbar/exam.png',
		selectedIconPath: tempAAA + '/static/tabbar/exam_select.png',
		count: 0,
		isDot: false,
		customIcon: false,
		img_href: tempAAA + "/static/tabbar/kaowu_tab.png",
		url: 'schapp_Examination',
		childList: [{
			name: '成绩分析',
			icon: tempAAA + '/static/images/schapp_examination/form.png',
			pagePath: "/pages/examination/form",
			url: 'schapp_Examination_form'
		}, {
			name: '班级成绩趋势',
			icon: tempAAA + '/static/images/schapp_examination/clsScoreDiff.png',
			pagePath: "/pages/examination/clsScoreDiff",
			url: 'schapp_Examination_clsScoreDiff'
		}]
	}, {
		text: "学生考勤", //学生考勤
		pagePath: "/pages/parents_attendance/index",
		iconPath: tempAAA + '/static/tabbar/study.png',
		selectedIconPath: tempAAA + '/static/tabbar/study_select.png',
		count: 0,
		isDot: false,
		customIcon: false,
		img_href: tempAAA + "/static/tabbar/parLeave.png",
		url: 'schapp_ParentAttence',
		childList: []
	}, {
		text: "oa", //oa
		pagePath: "/pages/oa/index",
		iconPath: tempAAA + '/static/tabbar/study.png',
		selectedIconPath: tempAAA + '/static/tabbar/study_select.png',
		count: 0,
		isDot: false,
		customIcon: false,
		img_href: tempAAA + "/static/tabbar/parLeave.png",
		url: 'schapp_OA',
		childList: [{
			name: '公告',
			icon: tempAAA + '/static/images/oa/gonggao.png',
			pagePath: "/pages/oa/gonggaoIndex",
			type: 1,
			url: 'schapp_OA_Notify'
		}, {
			name: '通知',
			icon: tempAAA + '/static/images/oa/tongzhi.png',
			pagePath: "/pages/oa/noticeIndex",
			url: 'schapp_OA_Notice'
		}, {
			name: '事务',
			icon: tempAAA + '/static/images/oa/shiwu.png',
			pagePath: "/pages/oa/shiwuIndex",
			url: 'schapp_OA_CooperateNotice'
		}, {
			name: '工作流',
			icon: tempAAA + '/static/images/oa/gongzuoliu.png',
			pagePath: "/pages/oa/workflowIndex",
			url: 'schapp_OA_Approve'
		}, {
			name: '资料收集',
			icon: tempAAA + '/static/images/oa/ziliaoshouji.png',
			pagePath: "/pages/oa/collectionDataIndex",
			url: 'schapp_OA_DataCollection'
		}, {
			name: '校历',
			icon: tempAAA + '/static/images/oa/xiaoli.png',
			pagePath: "/pages/oa/gonggaoIndex",
			type: 3,
			url: 'schapp_OA_Xiaoli'
		}, {
			name: '周程',
			icon: tempAAA + '/static/images/oa/zhoucheng.png',
			pagePath: "/pages/oa/gonggaoIndex",
			type: 2,
			url: 'schapp_OA_Zhoucheng'
		}, {
			name: '工资条',
			icon: tempAAA + '/static/images/oa/gongzitiao.png',
			pagePath: "/pages/oa/gongziIndex",
			url: 'schapp_OA_Payment'
		}, ]

	},
	{
		text: "学生考勤", //学生考勤
		pagePath: "/pages/schapp_work/index",
		iconPath: tempAAA + '/static/tabbar/study.png',
		selectedIconPath: tempAAA + '/static/tabbar/study_select.png',
		count: 0,
		isDot: false,
		customIcon: false,
		img_href: tempAAA + "/static/tabbar/kaoqin_tab.png",
		url: 'schapp_Work',
		childList: [{
			name: '请假记录',
			icon: tempAAA + '/static/images/schapp_work/qingjiajilu.png',
			pagePath: "/pages/schapp_work/qingjiaIndex",
			url: 'schapp_Work_leave'
		}, {
			name: '课堂考勤',
			icon: tempAAA + '/static/images/schapp_work/ketangkaoqin.png',
			pagePath: "/pages/schapp_work/ketangIndex",
			url: 'schapp_Work_classroom'
		}, {
			name: '课外考勤',
			icon: tempAAA + '/static/images/schapp_work/kewaikaoqin.png',
			pagePath: "/pages/schapp_work/kewaiIndex",
			url: 'schapp_Work_extracurricular'
		}, {
			name: '出入校报表',
			icon: tempAAA + '/static/images/schapp_work/churuxiaokaoqin.png',
			pagePath: "/pages/schapp_work/jinchuxiaoForm",
			url: 'schapp_Work_inoutschool_form'
		}, {
			name: '课堂报表',
			icon: tempAAA + '/static/images/schapp_work/ketangbaobiao.png',
			pagePath: "/pages/schapp_work/ketangForm",
			url: 'schapp_Work_classroom_form'
		}, {
			name: '课外报表',
			icon: tempAAA + '/static/images/schapp_work/kewaibaobiao.png',
			pagePath: "/pages/schapp_work/kewaiForm",
			url: 'schapp_Work_extracurricular_form'
		}, {
			name: '班级报表',
			icon: tempAAA + '/static/images/schapp_work/banjibaobiao.png',
			pagePath: "/pages/schapp_work/banjiForm",
			url: 'schapp_Work_class_form'
		}, {
			name: '学生报表',
			icon: tempAAA + '/static/images/schapp_work/xueshengbaobiao.png',
			pagePath: "/pages/schapp_work/xueshengForm",
			url: 'schapp_Work_students_form'
		}, ]
	
	},{//学生评语
		name: "学生评语", //评语
		pagePath: "/pages/stu_comment/index",
		iconPath: tempAAA + '/static/tabbar/study.png',
		selectedIconPath: tempAAA + '/static/tabbar/study_select.png',
		count: 0,
		isDot: false,
		customIcon: false,
		img_href: tempAAA + "/static/tabbar/kaoqin_tab.png",
		url: 'schapp_Comment',
		childList: []
	},{
		name: "行为与评语", //行为与评语，学生/家长端
		pagePath: "/pages/stu_actionComment/index",
		iconPath: tempAAA + '/static/tabbar/study.png',
		selectedIconPath: tempAAA + '/static/tabbar/study_select.png',
		count: 0,
		isDot: false,
		customIcon: false,
		img_href: tempAAA + "/static/tabbar/xingweiyupingyu_tab.png",
		url: 'schapp_actionComment',
		childList: []
	}];
	return tempArray;
}

//获取设备
module.exports = {
	getDptTree: getDptTree,
	setPersonal: setPersonal,
	getPersonal: getPersonal,
	removePersonal: removePersonal,
	setMenu: setMenu,
	getMenu: getMenu,
	removeMenu: removeMenu,
	setMenuMore: setMenuMore,
	getMenuMore: getMenuMore,
	setTabbarMenu: setTabbarMenu,
	getTabbarMenu: getTabbarMenu,
	clearStorage: clearStorage,
	getDeviceId: getDeviceId,
	getBroswerId: getBroswerId,
	openwithData: openwithData,
	getPageData: getPageData,
	showToast: showToast,
	getPermissionByPosition: getPermissionByPosition,
	getPageArray: getPageArray,
	getUnReadCut: getUnReadCut
}
