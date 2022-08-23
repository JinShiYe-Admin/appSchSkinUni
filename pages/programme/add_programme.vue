<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="定位" :textClick="textClick">
		</mynavBar>
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">日程时间</view>
			</uni-col>
			<uni-col :span="18">
				<input type="text" class="rightView" v-model="todayDate" disabled placeholder="请输入日程时间" />
			</uni-col>
		</uni-row>
		<view class="line"></view>
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">工作地点</view>
			</uni-col>
			<uni-col :span="18">
				<view class="rightView">{{workAddress}}</view>
				<!-- <input type="text" class="rightView" v-model="workAddress" disabled placeholder="请输入工作地点" /> -->
			</uni-col>
		</uni-row>
		<view class="line"></view>
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">开始时间</view>
			</uni-col>
			<uni-col :span="18">
				<picker mode="multiSelector" ref="picker" @change="valueChangeStart" :value="multiIndexStart"
					:range="multiArray">
					<view class="uni-input">{{multiArray[0][multiIndexStart[0]]}}:{{multiArray[1][multiIndexStart[1]]}}
					</view>
				</picker>
			</uni-col>
		</uni-row>
		<view class="line"></view>
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">结束时间</view>
			</uni-col>
			<uni-col :span="18">
				<picker mode="multiSelector" ref="picker" @change="valueChangeEnd" :value="multiIndexEnd"
					:range="multiArray">
					<view class="uni-input">{{multiArray[0][multiIndexEnd[0]]}}:{{multiArray[1][multiIndexEnd[1]]}}
					</view>
				</picker>
			</uni-col>
		</uni-row>
		<view class="line"></view>
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">日程内容</view>
			</uni-col>
			<uni-col :span="18">
				<textarea class="rightView" placeholder="请输入日程内容" v-model="workContent" maxlength="100"></textarea>
			</uni-col>
		</uni-row>
		<view class="line"></view>
		<view class="uni-padding-wrap uni-common-mt">
			<button size="mini" style="width: 80%;margin-left: 10%;background: #00CFBD;color: white;"
				@click="submitData()">确定</button>
		</view>
		<uni-popup :show="type === 'showpopup'" mode="fixed" @hidePopup="togglePopup('')">
			<view class="popup-view">
				<text class="popup-title">需要用户授权位置权限</text>
				<view class="uni-flex popup-buttons">
					<button class="uni-flex-item" type="primary" open-type="openSetting" @tap="openSetting">设置</button>
					<button class="uni-flex-item" @tap="togglePopup('')">取消</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	// #ifdef APP-PLUS
	import permision from "@/commom/permission.js"
	// #endif
	let _this;
	const leftArray = [],
		rightArray = [];
	for (var i = 0; i < 24; i++) {
		if (i < 10) {
			i = '0' + i;
		}
		leftArray.push(i)
	}
	for (var i = 0; i < 60; i++) {
		if (i < 10) {
			i = '0' + i;
		}
		rightArray.push(i)
	}
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				type: '',
				canClick: true, //防止提交按钮多次点击
				todayDate: '',
				begintime: '09:00',
				endtime: '17:00',
				workAddress: '请输入工作地点',
				workContent: '',
				longitude: '',
				latitude: '',
				multiArray: [ //多列选择器内容
					leftArray,
					rightArray
				],
				multiIndexStart: [9, 0], //多列选择器初始值
				multiIndexEnd: [17, 0], //多列选择器初始值
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
			this.todayDate = this.getNowFormatDate();
			// 
			this.getLocation();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			valueChangeStart(e) {
				this.multiIndexStart = e.detail.value;
				this.begintime = this.multiArray[0][this.multiIndexStart[0]] + ':' + this.multiArray[1][this
					.multiIndexStart[1]
				];
				this.$forceUpdate();
			},
			valueChangeEnd(e) {
				this.multiIndexEnd = e.detail.value;
				this.endtime = this.multiArray[0][this.multiIndexEnd[0]] + ':' + this.multiArray[1][this.multiIndexEnd[1]];
				this.$forceUpdate();
			},
			submitData: function() {
				if (this.canClick) {
					if (this.workAddress == '') {
						this.showToast('请输入工作地点')
					} else if (this.workContent == '') {
						this.showToast('请输入日程内容')
					} else if (this.compareTime(this.begintime, this.endtime) == 1) {
						this.showToast("开始时间不能晚于结束时间", "cancel");
					} else {
						this.canClick = false;
						this.submitDataLast();
					}
				}
			},
			//判断当前选择时间是否小于是指定时间
			compareTime(beginTime, endTime) {
				beginTime = beginTime.replace(/-/g, '');
				beginTime = beginTime.replace(/ /g, '');
				beginTime = beginTime.replace(/:/g, '');
				endTime = endTime.replace(/-/g, '');
				endTime = endTime.replace(/ /g, '');
				endTime = endTime.replace(/:/g, '');
				if (parseFloat(beginTime) < parseFloat(endTime)) {
					return 0;
				}
				return 1;
			},
			submitDataLast() {
				this.showLoading();
				let comData = {
					user_code: this.personInfo.user_code, //用户Code
					user_name: this.personInfo.user_name, //用户名称
					note_note: this.workContent, //日程内容
					note_addr: this.workAddress, //日程地点
					note_date: this.todayDate, //日程日期
					begin_time: this.begintime, //开始时间
					end_time: this.endtime, //结束时间
					op_code: 'add', //
					index_code: this.navItem.index_code, //
				}
				console.log("comData: " + JSON.stringify(comData));
				this.post(this.globaData.INTERFACE_PROGRAMME + 'note/addNote', comData, (data0, data) => {
					this.canClick = true
					if (data.code == 0) {
						this.showToast('保存成功');
						const eventChannel = this.getOpenerEventChannel();
						eventChannel.emit('refreshMyProgrammeList');
						uni.navigateBack();
					} else {
						this.canClick = true
						this.showToast(data.msg);
					}
					this.hideLoading();
				});
			},
			getNowFormatDate() {
				var date = new Date();
				var seperator1 = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = year + seperator1 + month + seperator1 + strDate;
				return currentdate;
			},
			togglePopup(type) {
				this.type = type;
			},
			showConfirm() {
				this.type = 'showpopup';
			},
			hideConfirm() {
				this.type = '';
			},
			textClick() {
				_this.getLocation();
			},
			async getLocation() {
				// #ifdef APP-PLUS
				console.log('getLocation1111111');
				let status = await this.checkPermission();
				if (status !== 1) {
					return;
				}
				// #endif
				// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ
				console.log('getLocation222222');
				let status2 = await this.getSetting();
				if (status2 === 2) {
					this.showConfirm();
					return;
				}
				// #endif

				this.doGetLocation();
			},
			doGetLocation() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					// altitude:true,
					success: function(res) {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						//#ifdef APP-PLUS
						_this.workAddress = (res.address.province ? res.address.province : '') +
							(res.address.city ? res.address.city : '') +
							(res.address.district ? res.address.district : '') +
							(res.address.street ? res.address.street : '') +
							(res.address.streetNum ? res.address.streetNum : '') +
							(res.address.poiName ? res.address.poiName : '');
						//#endif

						_this.longitude = res.longitude
						_this.latitude = res.latitude
					},
					fail() {
						// #ifdef H5
						_this.showToast('请开启位置服务')
						// #endif
						// #ifdef APP-PLUS
						_this.openGps();
						// #endif
						console.log("获取位置失败");
					},
					complete: () => {
						//#ifdef H5
						_this.$jsonp("https://apis.map.qq.com/ws/geocoder/v1/", {
								key: "3BSBZ-L7MLV-S2QPR-ULWG7-MKT3E-M5BDW",
								callbackName: "getJsonData",
								output: 'jsonp',
								location: _this.latitude + "," + _this.longitude
							})
							.then(json => {
								// 请求成功的返回数据
								console.log(json);
								_this.workAddress = json.result.address;
							})
							.catch(err => {
								// 请求失败的返回数据 
								console.log(err)
							})
						//#endif
					}
				})
				// uni.getLocation({
				// 	success: (res) => {
				// 		console.log('doGetLocation-----success:' + JSON.stringify(res));
				// 		this.hasLocation = true;
				// 		this.location = formatLocation(res.longitude, res.latitude);
				// 	},
				// 	fail: (err) => {
				// 		console.log('doGetLocation-----fail:' + JSON.stringify(err));
				// 		// #ifdef MP-BAIDU
				// 		if (err.errCode === 202 || err.errCode === 10003) { // 202模拟器 10003真机 user deny
				// 			this.showConfirm();
				// 		}
				// 		// #endif
				// 		// #ifndef MP-BAIDU
				// 		if (err.errMsg.indexOf("auth deny") >= 0) {
				// 			uni.showToast({
				// 				title: "访问位置被拒绝"
				// 			})
				// 		} else {
				// 			uni.showToast({
				// 				title: err.errMsg
				// 			})
				// 		}
				// 		// #endif
				// 	}
				// })
			},
			openGps() {
				let system = uni.getSystemInfoSync(); // 获取系统信息
				if (system.platform === 'android') { // 判断平台
					var context = plus.android.importClass("android.content.Context");
					var locationManager = plus.android.importClass("android.location.LocationManager");
					var main = plus.android.runtimeMainActivity();
					var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
					if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
						uni.showModal({
							title: '提示',
							content: '请打开定位服务功能',
							showCancel: false, // 不显示取消按钮
							success() {
								var Intent = plus.android.importClass('android.content.Intent');
								var Settings = plus.android.importClass('android.provider.Settings');
								var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
								main.startActivity(intent); // 打开系统设置GPS服务页面
							}
						});
					}
				} else if (system.platform === 'ios') {
					var cllocationManger = plus.ios.import("CLLocationManager");
					var enable = cllocationManger.locationServicesEnabled();
					var status = cllocationManger.authorizationStatus();
					plus.ios.deleteObject(cllocationManger);
					uni.showModal({
						title: '提示',
						content: '请打开定位服务功能',
						showCancel: false, // 不显示取消按钮
						success() {
							var UIApplication = plus.ios.import("UIApplication");
							var application2 = UIApplication.sharedApplication();
							var NSURL2 = plus.ios.import("NSURL");
							var setting2 = NSURL2.URLWithString("App-Prefs:root=Privacy&path=LOCATION");
							application2.openURL(setting2);
							plus.ios.deleteObject(setting2);
							plus.ios.deleteObject(NSURL2);
							plus.ios.deleteObject(application2);
						}
					});
				}
			},
			getSetting: function() {
				return new Promise((resolve, reject) => {
					uni.getSetting({
						success: (res) => {
							if (res.authSetting['scope.userLocation'] === undefined) {
								resolve(0);
								return;
							}
							if (res.authSetting['scope.userLocation']) {
								resolve(1);
							} else {
								resolve(2);
							}
						}
					});
				});
			},
			openSetting: function() {
				this.hideConfirm();
				uni.openSetting({
					success: (res) => {
						if (res.authSetting && res.authSetting['scope.userLocation']) {
							this.doGetLocation();
						}
					},
					fail: (err) => {}
				})
			},
			async checkPermission() {
				let status = permision.isIOS ? await permision.requestIOS('location') :
					await permision.requestAndroid('android.permission.ACCESS_FINE_LOCATION');

				if (status === null || status === 1) {
					status = 1;
				} else if (status === 2) {
					uni.showModal({
						content: "系统定位已关闭",
						confirmText: "确定",
						showCancel: false,
						success: function(res) {}
					})
				} else if (status.code) {
					uni.showModal({
						content: status.message
					})
				} else {
					uni.showModal({
						content: "需要定位权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}

				return status;
			}
		}
	}
</script>

<style>
	.leftView {
		text-align: center;
		margin-top: 10px;
		font-size: 14px;
	}

	.rightView {
		word-break: break-all;
		padding: 10px 10px;
		font-size: 14px;
		color: gray;
	}

	.line {
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}

	.line-green {
		background-color: #00CFBD;
		margin-bottom: 0.3125rem;
		height: 1px;
	}

	.double-line {
		height: 5px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}

	.form-view {
		padding: 0px 15px;
	}

	.form-left {
		font-size: 14px;
		/* width: 200rpx; */
		color: #3F3F3F;
	}

	.form-left-textarea {
		margin-top: 5px;
		align-self: flex-start;
	}

	.form-right {
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
		text-align: right;
	}

	::v-deep .form-right .placeholder {
		color: grey;
		font-size: 14px;
		padding-right: 10px;
	}

	.uni-flex {
		min-height: 40px;
		align-items: center;
	}

	textarea {
		width: 270px;
		font-size: 13px;
		height: 80px;
		padding: 5px;
	}

	.form-left-approve {
		margin: 5px 0;
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
	}
</style>
