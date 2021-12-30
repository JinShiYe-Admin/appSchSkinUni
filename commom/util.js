/**
 * APP 工具类
 */
import Vue from 'vue'
import uniCopy from '@/js_sdk/xb-copy/uni-copy.js'

// 刚登录，或者收到推送时，获取推送
function getPushCut(){
	var tempMenu = this.getMenu();
	let sendCount0 = 0;
	let sendCount1 = 0;
	for (var i = 0; i < tempMenu.length; i++) {
		let tempModel = tempMenu[i];
		for (var a = 0; a < tempModel.childList.length; a++) {
			let tempChildModel = tempModel.childList[a];
			if (tempChildModel.redspot_url != null && tempChildModel.redspot_url.length > 0) {
				sendCount0++;
				// 获取未读数
				this.getUnReadCut(tempChildModel.access, tempChildModel.redspot_url, (data) => {
					sendCount1++;
					this.setPushCut(tempMenu,tempChildModel.access,data[0].dotnum,sendCount0,sendCount1);
				});
			}
		}
	}
	var tempMoreMenu = this.getMenuMore();
	console.log('tempMoreMenu:'+JSON.stringify(tempMoreMenu));
	let sendMoreCount0 = 0;
	let sendMoreCount1 = 0;
	for (var i = 0; i < tempMoreMenu.length; i++) {
		let tempModel = tempMoreMenu[i];
		for (var a = 0; a < tempModel.childList.length; a++) {
			let tempChildModel = tempModel.childList[a];
			if (tempChildModel.redspot_url != null && tempChildModel.redspot_url.length > 0) {
				sendMoreCount0++;
				// 获取未读数
				this.getUnReadCut(tempChildModel.access, tempChildModel.redspot_url, (data) => {
					sendMoreCount1++;
					this.setPushCutMore(tempMoreMenu,tempChildModel.access,data[0].dotnum,sendMoreCount0,sendMoreCount1);
				});
			}
		}
	}
}

function setPushCutMore(tempMenu,access,num,sendCount0,sendCount1){
	for (var i = 0; i < tempMenu.length; i++) {
		let tempModel = tempMenu[i];
		let tempCount = 0;
		for (var a = 0; a < tempModel.childList.length; a++) {
			let tempChildModel = tempModel.childList[a];
			if (tempChildModel.access == access) {
				tempChildModel.noReadCut = num;
			}
			tempCount = tempCount + tempChildModel.noReadCut;
		}
		tempModel.count = tempCount;
	}
	if(sendCount0 == sendCount1){
		console.log('tempMenu:'+JSON.stringify(tempMenu));
		let tempCount = 0;
		for (var i = 0; i < tempMenu.length; i++) {
			let tempM1 = tempMenu[i];
			tempCount = tempCount+tempM1.count;
		}
		this.setMenuMore(tempMenu);
		setTimeout(()=>{
			let tempNumber = 0;
			var tempM0 = this.getMenu();
			for (var i = 0; i < tempM0.length; i++) {
				let tempM1 = tempM0[i];
				if(tempM1.url == 'schappUni_CoursePractice'){
					tempM1.count = tempCount;
				}
				tempNumber = tempNumber + tempM1.count;
			}
			// #ifdef APP-PLUS
			plus.runtime.setBadgeNumber(tempNumber);
			// #endif
			this.setMenu(tempM0);
			uni.$emit('setPushCount',{});
		},1000);
	}
}

function setPushCut(tempMenu,access,num,sendCount0,sendCount1){
	for (var i = 0; i < tempMenu.length; i++) {
		let tempModel = tempMenu[i];
		let tempCount = 0;
		for (var a = 0; a < tempModel.childList.length; a++) {
			let tempChildModel = tempModel.childList[a];
			if (tempChildModel.access == access) {
				tempChildModel.noReadCut = num;
			}
			tempCount = tempCount + tempChildModel.noReadCut;
		}
		tempModel.count = tempCount;
	}
	if(sendCount0 == sendCount1){
		this.setMenu(tempMenu);
		let tempMoreMenu = this.getMenuMore();
		if(tempMoreMenu.length>0){
			
		}else{
			let tempNumber = 0;
			for (var i = 0; i < tempMenu.length; i++) {
				let tempM1 = tempMenu[i];
				tempNumber = tempNumber + tempM.count;
			}
			// #ifdef APP-PLUS
			plus.runtime.setBadgeNumber(tempNumber);
			// #endif
			uni.$emit('setPushCount',{});
		}
	}
}

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

/**
 * 数组排序
 * @param {Object} propertyName key 字段名
 * @param {Object} order  1从小到大  正序  0从大到小 倒序
 */
function compare(propertyName, order) {
	return function(object1, object2) {
		var value1 = object1[propertyName];
		var value2 = object2[propertyName];
		if (order == 0) {
			if (value2 < value1) {
				return -1;
			} else if (value2 > value1) {
				return 1;
			} else {
				return 0;
			}
		}
		if (order == 1) {
			if (value2 > value1) {
				return -1;
			} else if (value2 < value1) {
				return 1;
			} else {
				return 0;
			}
		}

	}
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

//设置登录用户的菜单信息
function setStore(key,data) {
	uni.setStorageSync(Vue.prototype.personal + Vue.prototype.globaData.APPCODE +key, JSON.stringify(data));
}
//获取登录用户的菜单信息
function getStore(key) {
	const _value = uni.getStorageSync(Vue.prototype.personal + Vue.prototype.globaData.APPCODE+key);
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

// 打开附件
function openFile(fileUrl) {
	var urlStr = encodeURI(fileUrl);
	// #ifdef APP-PLUS
	uni.showLoading('加载中...');
	uni.downloadFile({
		url: urlStr,
		success: function(res) {
			var filePath = res.tempFilePath;
			uni.openDocument({
				filePath: filePath,
				success: function(res) {
					uni.hideLoading();
					console.log('打开文档成功');
				},
				fail() {
					uni.hideLoading();
					uni.showToast({
						title: '当前附件打开失败'
					})
				}
			});
		}
	});
	// #endif
	// #ifndef APP-PLUS
	console.log('urlStr:' + urlStr)
	var tempArr0 = urlStr.split('?');
	var urlStrTemp = tempArr0[0];
	var tempArr = urlStrTemp.split('.');
	var tempStr = tempArr[tempArr.length - 1];
	if (tempStr == 'png' || tempStr == 'jpg' || tempStr == 'jpeg' || tempStr == 'gif' || tempStr == 'bmp' ) {
		var tempArray = [];
		tempArray.push(urlStr);
		uni.previewImage({
			urls: tempArray,
		});
	} else {
		uniCopy({
			content: urlStr,
			success: (res) => {
				uni.showToast({
					title: '已复制该附件链接，请在系统浏览器中粘贴并打开',
					duration: 3000,
				})
				console.log('uniCopy-success');
			},
			error: (e) => {
				console.log('uniCopy-error');
			}
		})
	}
	// #endif
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
			iconPath: tempAAA + "/static/tabbar/stuLeave.png",
			// 激活(选中)的图标，同上
			selectedIconPath: tempAAA + "/static/tabbar/stuLeave_select.png",
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
			pagePath1: '/pages/leave/stuLeaveIndex1', // 1.5.6新增，路径需要以"/"开头
			img_href: tempAAA + "/static/tabbar/stuLeave_img.png",
			url: 'schapp_stuLeave',
			childList: []
		}, {
			text: "家长代请假", //家长代请假
			pagePath: "/pages/leave/parLeaveIndex",
			pagePath1: "/pages/leave/parLeaveIndex1",
			iconPath: tempAAA + '/static/tabbar/parLeave.png',
			selectedIconPath: tempAAA + '/static/tabbar/parLeave_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/parLeave_img.png",
			url: 'schapp_parLeave',
			childList: []
		}, {
			text: "教师代请假", //教师代请假
			pagePath: "/pages/leave/teaLeaveIndex",
			iconPath: tempAAA + "/static/tabbar/tecLeave.png",
			selectedIconPath: tempAAA + "/static/tabbar/tecLeave_select.png",
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/tecLeave_img.png",
			url: 'schapp_teaLeave',
			childList: [{
					name: '教师代请假',
					icon: tempAAA + "/static/images/leave/tecLeave.png",
					pagePath: "/pages/leave/teaLeaveAsk",
					url: 'schapp_teaLeave_askForLeave',
					noReadCut:0
				},
				{
					name: '请假查询',
					icon: tempAAA + "/static/images/leave/leavequery.png",
					pagePath: "/pages/leave/teaLeaveQuery",
					url: 'schapp_teaLeave_leaveSelect',
					noReadCut:0
				}
			]
		}, {
			text: "学生行为", //学生行为，教师
			pagePath: "/pages/stu_behavior/index",
			iconPath: tempAAA + "/static/tabbar/behavior.png",
			selectedIconPath: tempAAA + "/static/tabbar/behavior_select.png",
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/behavior_img.png",
			url: 'schapp_Behavior',
			childList: [{
					name: '课堂行为',
					icon: tempAAA + "/static/images/stu_behavior/class_behavior.png",
					pagePath: "/pages/stu_behavior/class_behavior_index",
					url: 'schapp_Behavior_classroom',
					noReadCut:0
				},
				{
					name: '课外行为',
					icon: tempAAA + "/static/images/stu_behavior/extra_behavior.png",
					pagePath: "/pages/stu_behavior/extra_behavior_index",
					url: 'schapp_Behavior_extracurricula',
					noReadCut:0
				},
				{
					name: '学生谈话',
					icon: tempAAA + "/static/images/stu_behavior/stu_talk.png",
					pagePath: "/pages/stu_behavior/stu_talk_index",
					url: 'schapp_Behaviorn_conversation',
					noReadCut:0
				}
			]
		}, {
			text: "阅卷", //阅卷--老师
			pagePath: "/pages/markingPapers/index",
			iconPath: tempAAA + '/static/tabbar/markingPapers.png',
			selectedIconPath: tempAAA + '/static/tabbar/markingPapers_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/markingPapers_img.png",
			url: 'schapp_markingPapers',
			childList: [
				// {
				// 	name: '周测',
				// 	icon: tempAAA + '/static/images/markingPapers/zhouce.png',
				// 	pagePath: "/pages/markingPapers/weekTest_index",
				// 	url: 'schapp_markingPapers_weekTest',
				// 	noReadCut:0
				// },
				{
					name: '月考',
					icon: tempAAA + '/static/images/markingPapers/yuekao.png',
					pagePath: "/pages/markingPapers/monthTest_index",
					url: 'schapp_markingPapers_monthTest',
					noReadCut:0
				},
				{
					name: '期中期末',
					icon: tempAAA + '/static/images/markingPapers/qizhongqimo.png',
					pagePath: "/pages/markingPapers/termTest_index",
					url: 'schapp_markingPapers_termTest',
					noReadCut:0
				}
			]
		}, {
			text: "考务", //考务
			pagePath: "/pages/examination/index",
			iconPath: tempAAA + '/static/tabbar/examination.png',
			selectedIconPath: tempAAA + '/static/tabbar/examination_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/examination_img.png",
			url: 'schapp_Examination',
			childList: [{
				name: '成绩分析',
				icon: tempAAA + '/static/images/schapp_examination/form.png',
				pagePath: "/pages/examination/form",
				url: 'schapp_Examination_form',
				noReadCut:0
			}, {
				name: '班级成绩趋势',
				icon: tempAAA + '/static/images/schapp_examination/clsScoreDiff.png',
				pagePath: "/pages/examination/clsScoreDiff",
				url: 'schapp_Examination_clsScoreDiff',
				noReadCut:0
			}]
		}, {
			text: "学生考勤", //学生考勤
			pagePath: "/pages/parents_attendance/index",
			pagePath1: "/pages/parents_attendance/index1",
			iconPath: tempAAA + '/static/tabbar/parentAttence.png',
			selectedIconPath: tempAAA + '/static/tabbar/parentAttence_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/parentAttence_img.png",
			url: 'schapp_ParentAttence',
			childList: []
		}, {
			text: "oa", //oa
			pagePath: "/pages/oa/index",
			iconPath: tempAAA + '/static/tabbar/oa.png',
			selectedIconPath: tempAAA + '/static/tabbar/oa_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/oa_img.png",
			url: 'schapp_OA',
			childList: [{
				name: '公告',
				icon: tempAAA + '/static/images/oa/gonggao.png',
				pagePath: "/pages/oa/gonggaoIndex",
				type: 1,
				url: 'schapp_OA_Notify',
				noReadCut:0
			}, {
				name: '通知',
				icon: tempAAA + '/static/images/oa/tongzhi.png',
				pagePath: "/pages/oa/noticeIndex",
				url: 'schapp_OA_Notice',
				noReadCut:0
			}, {
				name: '事务',
				icon: tempAAA + '/static/images/oa/shiwu.png',
				pagePath: "/pages/oa/shiwuIndex",
				url: 'schapp_OA_CooperateNotice',
				noReadCut:0
			}, {
				name: '工作流',
				icon: tempAAA + '/static/images/oa/gongzuoliu.png',
				pagePath: "/pages/oa/workflowIndex",
				url: 'schapp_OA_Approve',
				noReadCut:0
			}, {
				name: '资料收集',
				icon: tempAAA + '/static/images/oa/ziliaoshouji.png',
				pagePath: "/pages/oa/collectionDataIndex",
				url: 'schapp_OA_DataCollection',
				noReadCut:0
			}, {
				name: '校历',
				icon: tempAAA + '/static/images/oa/xiaoli.png',
				pagePath: "/pages/oa/gonggaoIndex",
				type: 3,
				url: 'schapp_OA_Xiaoli',
				noReadCut:0
			}, {
				name: '周程',
				icon: tempAAA + '/static/images/oa/zhoucheng.png',
				pagePath: "/pages/oa/gonggaoIndex",
				type: 2,
				url: 'schapp_OA_Zhoucheng',
				noReadCut:0
			}, {
				name: '工资条',
				icon: tempAAA + '/static/images/oa/gongzitiao.png',
				pagePath: "/pages/oa/gongziIndex",
				url: 'schapp_OA_Payment',
				noReadCut:0
			}, ]

		},
		{
			text: "学生考勤", //学生考勤
			pagePath: "/pages/schapp_work/index",
			iconPath: tempAAA + '/static/tabbar/work.png',
			selectedIconPath: tempAAA + '/static/tabbar/work_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/work_img.png",
			url: 'schapp_Work',
			childList: [{
				name: '请假记录',
				icon: tempAAA + '/static/images/schapp_work/qingjiajilu.png',
				pagePath: "/pages/schapp_work/qingjiaIndex",
				url: 'schapp_Work_leave',
				noReadCut:0
			}, {
				name: '课堂考勤',
				icon: tempAAA + '/static/images/schapp_work/ketangkaoqin.png',
				pagePath: "/pages/schapp_work/ketangIndex",
				url: 'schapp_Work_classroom',
				noReadCut:0
			}, {
				name: '课外考勤',
				icon: tempAAA + '/static/images/schapp_work/kewaikaoqin.png',
				pagePath: "/pages/schapp_work/kewaiIndex",
				url: 'schapp_Work_extracurricular',
				noReadCut:0
			}, {
				name: '出入校报表',
				icon: tempAAA + '/static/images/schapp_work/churuxiaokaoqin.png',
				pagePath: "/pages/schapp_work/jinchuxiaoForm",
				url: 'schapp_Work_inoutschool_form',
				noReadCut:0
			}, {
				name: '课堂报表',
				icon: tempAAA + '/static/images/schapp_work/ketangbaobiao.png',
				pagePath: "/pages/schapp_work/ketangForm",
				url: 'schapp_Work_classroom_form',
				noReadCut:0
			}, {
				name: '课外报表',
				icon: tempAAA + '/static/images/schapp_work/kewaibaobiao.png',
				pagePath: "/pages/schapp_work/kewaiForm",
				url: 'schapp_Work_extracurricular_form',
				noReadCut:0
			}, {
				name: '班级报表',
				icon: tempAAA + '/static/images/schapp_work/banjibaobiao.png',
				pagePath: "/pages/schapp_work/banjiForm",
				url: 'schapp_Work_class_form',
				noReadCut:0
			}, {
				name: '学生报表',
				icon: tempAAA + '/static/images/schapp_work/xueshengbaobiao.png',
				pagePath: "/pages/schapp_work/xueshengForm",
				url: 'schapp_Work_students_form',
				noReadCut:0
			}, ]
		},
		{
			text: "家校互动", //家校互动
			pagePath: "/pages/schhome/index",
			iconPath: tempAAA + '/static/tabbar/schhome.png',
			selectedIconPath: tempAAA + '/static/tabbar/schhome_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/schhome_img.png",
			url: 'schapp_SchHome',
			childList: [{
					name: '学校通知',
					icon: tempAAA + '/static/images/schhome/school_notice.png',
					pagePath: "/pages/schhome/school_notice_index",
					url: 'schapp_SchHome_SchSms',
					noReadCut:0
				},
				{
					name: '年级通知',
					icon: tempAAA + '/static/images/schhome/grade_notice.png',
					pagePath: "/pages/schhome/grade_notice_index",
					url: 'schapp_SchHome_Grade',
					noReadCut:0
				},
				{
					name: '班级通知',
					icon: tempAAA + '/static/images/schhome/class_notice.png',
					pagePath: "/pages/schhome/classes_notice_index",
					url: 'schapp_SchHome_ClsSms',
					noReadCut:0
				},
				{
					name: '班级作业',
					icon: tempAAA + '/static/images/schhome/class_homework.png',
					pagePath: "/pages/schhome/classes_homework_index",
					url: 'schapp_SchHome_ClsWorkSms',
					noReadCut:0
				},
				{
					name: '在校表现',
					icon: tempAAA + '/static/images/schhome/school_programme.png',
					pagePath: "/pages/schhome/performance_index",
					url: 'schapp_SchHome_StuPerson',
					noReadCut:0
				},
			]
		},
		{
			text: "家校互动", //家校互动
			pagePath: "/pages/schhome_stu/index",
			pagePath1: "/pages/schhome_stu/index1",
			iconPath: tempAAA + '/static/tabbar/schhome.png',
			selectedIconPath: tempAAA + '/static/tabbar/schhome_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/schhome_img.png",
			url: 'schapp_SchHomeStu', //
			childList: []
		},
		{ //学生评语
			name: "学生评语", //评语
			pagePath: "/pages/stu_comment/index",
			pagePath1: "/pages/stu_comment/index1",
			iconPath: tempAAA + '/static/tabbar/stuComment.png',
			selectedIconPath: tempAAA + '/static/tabbar/stuComment_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/stuComment_img.png",
			url: 'schapp_Comment',
			childList: []
		}, {
			name: "行为与评语", //行为与评语，学生/家长端
			pagePath: "/pages/stu_actionComment/index",
			pagePath1: "/pages/stu_actionComment/index1",
			iconPath: tempAAA + '/static/tabbar/actionComment.png',
			selectedIconPath: tempAAA + '/static/tabbar/actionComment_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/actionComment_img.png",
			url: 'schapp_actionComment',
			childList: []
		},{
			name: "学生成绩", //学生成绩
			pagePath: "/pages/student_performance/index",
			pagePath1: "/pages/student_performance/index1",
			iconPath: tempAAA + '/static/tabbar/stuScore.png',
			selectedIconPath: tempAAA + '/static/tabbar/stuScore_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/stuScore_img.png",
			url: 'schapp_StuScore',
			childList: []
		},
		{
			name: "学生宿舍", //
			pagePath: "/pages/stu_dorm/index",
			iconPath: tempAAA + '/static/tabbar/stuDorm.png',
			selectedIconPath: tempAAA + '/static/tabbar/stuDorm_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/stuDorm_img.png",
			url: 'schapp_Dorm',
			childList: [{
					name: '基本信息',
					icon:  tempAAA + '/static/images/stu_dorm/info_dorm.png',
					pagePath: "/pages/stu_dorm/base_info_index",
					url: 'schapp_Dorm_Info',
					noReadCut:0
				},
				{
					name: '班级宿舍',
					icon: tempAAA + '/static/images/stu_dorm/classes_dorm.png',
					pagePath: "/pages/stu_dorm/classes_dorm_index",
					url: 'schapp_Dorm_Classes',
					noReadCut:0
				},
				{
					name: '宿舍查询',
					icon: tempAAA + '/static/images/stu_dorm/select_dorm.png',
					pagePath: "/pages/stu_dorm/select_dorm_index",
					url: 'schapp_Dorm_Select',
					noReadCut:0
				},
				{
					name: '空床查询',
					icon: tempAAA + '/static/images/stu_dorm/emptybed_dorm.png',
					pagePath: "/pages/stu_dorm/emptybed_dorm_index",
					url: 'schapp_Dorm_EmptyBed',
					noReadCut:0
				},
				{
					name: '空房查询',
					icon: tempAAA + '/static/images/stu_dorm/vacantroom_dorm.png',
					pagePath: "/pages/stu_dorm/vacantroom_dorm_index",
					url: 'schapp_Dorm_EmptyRoom',
					noReadCut:0
				},
				{
					name: '访客登记',
					icon: tempAAA + '/static/images/stu_dorm/calle_dorm.png',
					pagePath: "/pages/stu_dorm/calle_dorm_index",
					url: 'schapp_Dorm_Calle',
					noReadCut:0
				},
				{
					name: '宿舍考勤',
					icon: tempAAA + '/static/images/stu_dorm/attendance_dorm.png',
					pagePath: "/pages/stu_dorm/attendance_dorm_index",
					url: 'schapp_Dorm_Attendance',
					noReadCut:0
				},
				{
					name: '宿舍行为',
					icon: tempAAA + '/static/images/stu_dorm/action_dorm.png',
					pagePath: "/pages/stu_dorm/action_dorm_index",
					url: 'schapp_Dorm_Action',
					noReadCut:0
				},
				{
					name: '宿舍卫生',
					icon: tempAAA + '/static/images/stu_dorm/health_dorm.png',
					pagePath: "/pages/stu_dorm/health_dorm_index",
					url: 'schapp_Dorm_Health',
					noReadCut:0
				},
				{
					name: '宿舍考评',
					icon: tempAAA + '/static/images/stu_dorm/evaluation_dorm.png',
					pagePath: "/pages/stu_dorm/evaluation_dorm_index",
					url: 'schapp_Dorm_Evaluation',
					noReadCut:0
				},
			]
		},
		{
			name: "物品管理", //物品管理
			pagePath: "/pages/schapp_item/index",
			iconPath: tempAAA + '/static/tabbar/item.png',
			selectedIconPath: tempAAA + '/static/tabbar/item_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/item_img.png",
			url: 'schapp_Item',
			childList: [{
				name: '物品入库',
				icon: tempAAA + '/static/images/schapp_item/wupinruku.png',
				pagePath: "/pages/schapp_item/item_in_index",
				url: 'schapp_Item_warehouse',
				noReadCut:0
			}, {
				name: '物品出库',
				icon: tempAAA + '/static/images/schapp_item/wupinchuku.png',
				pagePath: "/pages/schapp_item/item_out_index",
				url: 'schapp_Item_outbound',
				noReadCut:0
			}, {
				name: '库存查询',
				icon: tempAAA + '/static/images/schapp_item/kucunchaxun.png',
				pagePath: "/pages/schapp_item/item_select_index",
				url: 'schapp_Item_stock',
				noReadCut:0
			}, ]
		},
		{
			name: "richeng", //日程
			pagePath: "/pages/programme/index",
			iconPath: tempAAA + '/static/tabbar/programme.png',
			selectedIconPath: tempAAA + '/static/tabbar/programme_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/programme_img.png",
			url: 'schapp_Programme',
			childList: [{
				name: '我的日程',
				icon: tempAAA + '/static/images/programme/programme_my.png',
				pagePath: "/pages/programme/myProgramme",
				url: 'schapp_Programme_My',
				noReadCut:0
			}, {
				name: '部门日程',
				icon: tempAAA + '/static/images/programme/programme_dpt.png',
				pagePath: "/pages/programme/dptProgramme",
				url: 'schapp_Programme_Dpt',
				noReadCut:0
			} ]
		},
		{
			name: "teacherkaoqin", //教师考勤
			pagePath: "/pages/teachercAttendance/index",
			iconPath: tempAAA + '/static/tabbar/tecAttendance.png',
			selectedIconPath: tempAAA + '/static/tabbar/tecAttendance_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/tecAttendance_img.png",
			url: 'schapp_Attendance',
			childList: [{
				name: '我的考勤',
				icon: tempAAA + '/static/images/teachercAttendance/my_attendance.png',
				pagePath: "/pages/teachercAttendance/myAttendance",
				url: 'schapp_Attendance_My',
				noReadCut:0
			}, {
				name: '考勤查询',
				icon: tempAAA + '/static/images/teachercAttendance/attendance_search.png',
				pagePath: "/pages/teachercAttendance/attendanceSearch",
				url: 'schapp_Attendance_Search',
				noReadCut:0
			}, {
				name: '考勤报表',
				icon: tempAAA + '/static/images/teachercAttendance/attendance_form.png',
				pagePath: "/pages/teachercAttendance/attendanceForm",
				url: 'schapp_Attendance_Form',
				noReadCut:0
			}]
		},
		{
			name: "parents_zhixueKeTang", //智学课堂
			pagePath: "/pages/zhiXueKeTang/index",
			iconPath: tempAAA + '/static/tabbar/zhixueketang.png',
			selectedIconPath: tempAAA + '/static/tabbar/zhixueketang_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/zhixueketang_img.png",
			url: 'schapp_zhixueKeTang',
			childList: [{
				name: '智学资源',
				icon: tempAAA + '/static/images/zhiXueKeTang/zhixueziyuan.png',
				pagePath: "/pages/zhiXueKeTang/zhixuezy_index",
				url: 'schapp_zhixueKeTang_zxzy',
				noReadCut:0
			}, {
				name: '组卷测试',
				icon: tempAAA + '/static/images/zhiXueKeTang/zujuanceshi.png',
				pagePath: "/pages/zhiXueKeTang/zujuancs_index",
				url: 'schapp_zhixueKeTang_zjcs',
				noReadCut:0
			}, {
				name: '历史测试',
				icon: tempAAA + '/static/images/zhiXueKeTang/lishiceshi.png',
				pagePath: "/pages/zhiXueKeTang/lishics_index",
				url: 'schapp_zhixueKeTang_lscs',
				noReadCut:0
			}, {
				name: '错题本',
				icon: tempAAA + '/static/images/zhiXueKeTang/cuotiben.png',
				pagePath: "/pages/zhiXueKeTang/cuotiben_index",
				url: 'schapp_zhixueKeTang_ctb',
				noReadCut:0
			}, {
				name: '学情分析',
				icon: tempAAA + '/static/images/zhiXueKeTang/xueqingfenxi.png',
				pagePath: "/pages/zhiXueKeTang/xueqingfx_index",
				url: 'schapp_zhixueKeTang_xqfx',
				noReadCut:0
			}]
		},
		{
			name: "kouYuCePing", //口语测评
			pagePath: "/pages/kouYuCePing/index",
			pagePath1: "/pages/kouYuCePing/index1",
			iconPath: tempAAA + '/static/tabbar/kouYuCePing.png',
			selectedIconPath: tempAAA + '/static/tabbar/kouYuCePing_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/kouYuCePing_img.png",
			url: 'schapp_kouYuCePing',
			childList: []
		},
		{
			name: "stuLocationPath", //学生位置及轨迹
			pagePath: "/pages/stuLocationPath/index",
			pagePath1: "/pages/stuLocationPath/index1",
			iconPath: tempAAA + '/static/tabbar/stuLocationPath.png',
			selectedIconPath: tempAAA + '/static/tabbar/stuLocationPath_select.png',
			count: 0,
			isDot: false,
			customIcon: false,
			img_href: tempAAA + "/static/tabbar/stuLocationPath_img.png",
			url: 'schapp_stuLocationPath',
			childList: []
		},
	];
	return tempArray;
}

//获取设备
module.exports = {
	compare: compare,
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
	getUnReadCut: getUnReadCut,
	openFile: openFile,
	setStore:setStore,
	getStore:getStore,
	getPushCut:getPushCut,
	setPushCut:setPushCut,
	setPushCutMore:setPushCutMore
}
