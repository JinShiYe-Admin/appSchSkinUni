<template>
	<view>
		<dates-slider v-model="selectedDate" :end="today" style="height: 88px;"></dates-slider>
		
		<view class="content-scroll" :style="`height:${contentHeiht}px;`">
			<uni-card style="margin: 5px 0;">
				<view style="font-size: 12px;">
					<text style="margin-right: 3rem;">班次：{{attendData.cl_name}}</text>
					<text>打卡次数：{{attendData.clocks}}/{{attendData.attends}}</text>
				</view>
				<uni-card style="background: #f2f2f2;margin: 6px 0 0;" :border="false">
					<view v-if="attendData.list&&attendData.list.length" class="attend-list">
						<uni-row v-for="(item,i) in attendData.list" :key="i" class="attend-list-item">
							<uni-col :span="8">
								<text style="font-weight: bold;margin-right: 12px;">{{item.ctype}}</text>
								<text style="color: #7f7f7f; font-size: 12px;">{{item.ctime}}</text>
							</uni-col>
							<uni-col :span="8" style="text-align: center;">
								<view v-if="item.attend_time">
									<uni-icons type="checkbox-filled" color="#2c96bd"></uni-icons>
									<text style="display: inline-block;width: 45px;">{{item.attend_time}}</text>
								</view>
								<view v-else>{{item.status===null?'':'--'}}</view>
							</uni-col>
							<uni-col :span="7" style="text-align: center;">
								<uni-tag :circle="true" size="small" :inverted="true" :text="item.status_cn" :type="item.status===1||item.status===null?undefined:'warning'" />
							</uni-col>
							<!-- <uni-col :span="5" style="color: #2c96bd;text-align: right;">
								<view v-if="!(item.status===1||item.status===null)" @click="showManagePopup">
									处理<uni-icons type="right" color="#2c96bd" bold></uni-icons>
								</view>
							</uni-col> -->
						</uni-row>
					</view>
					<view v-else style="text-align: center;">
						<text class="uni-h6">暂无打卡数据</text>
					</view>
				</uni-card>
			</uni-card>
			<uni-card v-if="isClock" style="margin: 5px 0;">
				<view style="margin-bottom: 6px;font-size: 14px;">照片：</view>
				<view style="margin-bottom: 24px;">
					<g-upload ref='gUpload' :mode="imgList" :control='true' :deleteBtn='true' @chooseFile='chooseFile'
						@imgDelete='imgDelete' :maxCount="maxCount" :columnNum="3" :showMaxCount="showMaxCount">
					</g-upload>
				</view>
				<view style="margin-bottom: 24px;">
					<button type="primary" class="clock-btn" @click="addrClock">
						<text style="font-size: 18px;font-weight: bold;">打卡</text><br/>
						<text style="font-size: 14px;">{{curTime}}</text>
					</button>
				</view>
				<view style="margin-bottom: 24px; font-size: 14px; display: inline-block;" @click="getLocation">
					<uni-icons type="location" color="#2c96bd" :size="20"></uni-icons>{{address}}
				</view>
			</uni-card>
		</view>
		
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="popup-content">
				<view style="font-size: 16px;text-align: center;margin-bottom: 24px;">请选择需要提交的申请</view>
				<button type="default" @click="goApply(0)">补卡</button>
				<button type="default" @click="goApply(1)">出差</button>
				<button type="default" @click="goApply(2)">外出</button>
				<button type="default" @click="goApply(4)">请假</button>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment';
	// 七牛上传相关
	import gUpload from "@/components/g-upload/g-upload.vue"
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	import permision from "@/commom/permission.js"
	let _this;
	let timer;
	const curDate = moment().format("YYYY-MM-DD");
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				today: curDate,
				selectedDate: curDate,
				contentHeiht: 600,
				imgList: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				maxCount: 9,//单次选择最大数量
				showMaxCount: 9,//单次上传最大数量
				attendData: {
					cl_name: '',
					attends: 0,//需打卡次数
					clocks: 0,//已打卡次数
					allowattr: false, //是否允许地点打卡
					list: []
				},
				curTime: '',
				latitude: '',
				longitude: '',
				address: '',
				loading: false,
			}
		},
		components: {
			mynavBar,
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			this.navItem = util.getPageData(option);
			this.navItem.index = 100;
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			
			this.$nextTick(() => {
				const windowInfo = uni.getWindowInfo();
				this.contentHeiht = windowInfo.windowHeight-88;
			})
			// 获取数据
			this.getClockRecord();

			// 获取权限
			// this.getPermissionByPosition('add', this.navItem.access.split('#')[1], result => {
			// 	if (result[0]) {
			// 		// this.rightIcon = 'plusempty';
			// 	}
			// })
			//#ifdef H5
			document.title = "";
			//#endif
			//
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		computed: {
			isClock() {
				return this.selectedDate===this.today && this.attendData && this.attendData.allowattr
			}
		},
		watch: {
			selectedDate() {
				this.getClockRecord();
			},
		},
		methods: {
			showManagePopup() {
				this.$refs.popup.open();
			},
			goApply(type) {
				if(type>3) {
					util.openwithData('/pages/khfw/teaLeaveApply_add', {
						index_code: this.navItem.access.split("#")[1],
					}, {
						refreshteaLeaveApply(data) { //子页面调用父页面需要的方法
							_this.$refs.popup.close();
						}
					})
				}else{
					util.openwithData('/pages/teachercAttendance/ApplyAdd', {
						index_code: this.navItem.access.split("#")[1],
						type,
					}, {
						refreshPage(data) { //子页面调用父页面需要的方法
							_this.$refs.popup.close();
						}
					})
				}
				
			},
			getClockRecord(onlyData=false) {
				// 获取考勤数据
				// this.showLoading();
				this.post(this.globaData.INTERFACE_TECKQ+'kqAttend/getUserDaysAttend', {
					user_code: this.personInfo.user_code,
					days: this.selectedDate,
					index_code: this.navItem.access.split("#")[1],
				}, (data, res) => {
					// this.hideLoading();
					if(data){
						this.attendData = data;
						if(!onlyData) {
							//实时显示时间
							timer && clearInterval(timer)
							if(this.isClock) {
								timer = setInterval(() => {
									this.curTime = moment().format('HH:mm:ss')
								}, 1000)
								// 获取地址
								this.getLocation();
							}
						}
					}
				})
			},
			// 打卡
			async addrClock() {
				if(this.loading) return;
				this.loading = true;
				setTimeout(() => {
					this.loading = false;
				},1000);
				this.showLoading('打卡中');
				//获取地理位置
			 	const loc = await this.getLocation();
				// console.log(JSON.stringify(loc))
				if(!loc) {
					this.showToast('获取位置失败');
					this.hideLoading();
					return false
				}
				// 上传图片
				let imgArray = [];
				if(this.imgList.length>0){
					await new Promise((resolve,reject) => {
						cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PB_NAME, this.QN_JSKQ_KQDK, (encName,
							encAddrStr) => {
							if (encName.length > 0) {
								for (var i = 0; i < encName.length; i++) {
									imgArray.push({
										name: encName[i],
										url: encAddrStr[i],
									})
								}
							}
							resolve();
						});
					})
				}
				// gcj02转百度地图坐标bd09
				const x = this.longitude;
				const y = this.latitude;
				const x_pi = 3.14159265358979324 * 3000.0 / 180.0; 
				const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
				const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
				const tempLon = z * Math.cos(theta) + 0.0065;
				const tempLat = z * Math.sin(theta) + 0.006;
				// 保存打卡记录
				this.post(this.globaData.INTERFACE_TECKQ+'kqAttend/addrClock', {
					index_code: this.navItem.access.split("#")[1],
					user_code: this.personInfo.user_code,
					latitude: tempLat,
					longitude: tempLon,
					address: this.address,
					files: imgArray
				}, (data, res) => {
					// console.log(JSON.stringify(res))
					this.hideLoading();
					if(res.state==='ok') {
						uni.showToast({
							title: '打卡成功',
							duration: 1000
						});
						this.getClockRecord(true);
						this.imgFiles = [];
						this.imgList = [];
						this.maxCount = 9;
					}
				})
				
			},
			//附件上传相关👇
			chooseFile(list, v, f) {
				this.imgList = list
				this.imgFiles = this.imgFiles.concat(f)
				this.maxCount = this.showMaxCount - list.length
			},
			imgDelete(list, eq, fileeq) {
				this.imgList = list
				// this.imgFiles.splice(fileeq, 1); //删除临时路径
				// this.imgNames.splice(eq, 1); //删除文件名
				this.maxCount = this.showMaxCount - list.length
			},
			// 获取位置
			async getLocation() {
				// #ifdef APP-PLUS
				const status = permision.isIOS ? await permision.requestIOS('location') : await permision.requestAndroid('android.permission.ACCESS_FINE_LOCATION');
				if (status === null || status === 1) {
					
				} else {
					if (status === 2) {
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
							content: "请打开定位服务功能",
							confirmText: "去设置",
							success: function(res) {
								if (res.confirm) {
									permision.gotoAppSetting();
								}
							}
						})
					}
					return;
				} 
				// #endif
				// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ
				await uni.getSetting({
					success: (res) => {
						if (res.authSetting['scope.userLocation'] === undefined) {
							return;
						} else if(!res.authSetting['scope.userLocation']) {
							uni.showModal({
								content: '需要用户授权位置权限',
								success: function (re) {
									if (re.confirm) {
										uni.openSetting({
											success: (r) => {
												if (r.authSetting && r.authSetting['scope.userLocation']) {
													this.doGetLocation();
												}
											},
										})
									} 
								}
							});
							return;
						}
					}
				});
				// #endif

				return new Promise(resolve => uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(res) {
						// console.log('当前位置：' + JSON.stringify(res));
						//#ifdef APP-PLUS
						_this.address = (res.address.province?res.address.province:'')
						+(res.address.city?res.address.city:'')
						+(res.address.district?res.address.district:'')
						+(res.address.street?res.address.street:'')
						+(res.address.streetNum?res.address.streetNum:'')
						+(res.address.poiName?res.address.poiName:'');
						//#endif
						_this.longitude = res.longitude;
						_this.latitude = res.latitude;
						resolve(true);
					},
					fail() {
						// #ifdef H5
							_this.showToast('请开启位置服务')
						// #endif
						// #ifdef APP-PLUS
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
								_this.address = json.result.address;
							})
							.catch(err => {
								console.log(err)
							})
						//#endif
					}
				})
				)
			}
		}
	}
</script>

<style lang='scss'>
	.content-scroll {
		background-color: #f2f2f2;
		overflow-y: auto;
	}
	.attend-list {
		margin-bottom: -16px;
		font-size: 14px;
		.attend-list-item {
			margin-bottom: 16px;
			.uni-tag {
				font-size: 12px;
			}
			.uni-tag--default {
				border-color: #7f7f7f;
			}
			.uni-col {
				min-height: 18px;
			}
		}
	}
	uni-button.clock-btn {
		background-color: #00cfbd!important;
		width: 120px;
		height: 120px;
		border-radius: 60px;
		padding: 30px 6px;
		text-align: center;
		line-height: 28px;
		box-shadow: 0px 0px 8px rgba(0,0,0,.35);
		&::after {
			border: none;
		}
	}
	
	.popup-content {
		padding: 24px 24px 60px;
		uni-button {
			font-size: 14px;
		}
		uni-button + uni-button {
			margin-top: 14px;
		}
	}
</style>