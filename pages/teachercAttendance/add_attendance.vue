<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' icon="location-filled" :iconClick="iconClick"></mynavBar>
		<!-- <view class="uni-flex uni-row form-view">
			<view class="form-left">考勤地点</view>
			<input class="uni-input form-right"  :value="workAddress"  placeholder="点击右上角按钮获取考勤地点" disabled/>
		</view> -->
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">工作地点</view>
			</uni-col>
			<uni-col :span="18">
				<view class="rightView">{{workAddress}}</view>
			</uni-col>
		</uni-row>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view choose-file">
			<view class="choose-file-text">附件<view class="file-des">{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}</view></view>
			<g-upload ref='gUpload' :sourceType="['camera']" :mode="imgList" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile' @imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount"></g-upload>
		</view>
		<view class="line"></view>
		<uni-popup :show="type === 'showpopup'" mode="fixed" @hidePopup="togglePopup('')">
			<view class="popup-view">
				<text class="popup-title">需要用户授权位置权限</text>
				<view class="uni-flex popup-buttons">
					<button class="uni-flex-item" type="primary" open-type="openSetting" @tap="openSetting">设置</button>
					<button class="uni-flex-item" @tap="togglePopup('')">取消</button>
				</view>
			</view>
		</uni-popup>
		<view style="padding: 10px 15px 0;display: flex;">
			<button type="default" class="sure-button" size="mini" @click="upLoadImg">确定</button>
		</view>
	</view>
</template> 

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	// 七牛上传相关
	 import gUpload from "@/components/g-upload/g-upload.vue"
	 import cloudFileUtil from '../../commom/uploadFiles/CloudFileUtil.js';
	 // #ifdef APP-PLUS
	 import permision from "@/commom/permission.js"
	 // #endif
	 let _this;
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				navItem: {},
				canSub:true,
				type: '',
				workAddress: '',
				longitude: '',
				latitude: '',
				
				// 附件上传相关👇
				control:true,//是否显示上传 + 按钮 一般用于显示
				deleteBtn:true,//是否显示删除 按钮 一般用于显示
				
				maxCount:1,//单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount:1,//单次上传最大数量
				
				columnNum:1,//每行显示的图片数量
				imgNames: [],//服务器回传的图片名称
				imgList: [],//选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles:[],//选择的文件对象，用于上传时获取文件名  不需要改动
					wxTips:'',//如果是H5，需要提示该内容
			}
		},
		components: {
			mynavBar,
			 gUpload
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新增考勤'
			this.navItem = itemData;
			this.index_code=itemData.index_code
			let that =this
			setTimeout(()=>{
				that.getLocation();
			},100)
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
		methods: {
			togglePopup(type) {
				this.type = type;
			},
			showConfirm() {
				this.type = 'showpopup';
			},
			hideConfirm() {
				this.type = '';
			},
			iconClick(){//获取定位地址
				// if(this.canSub){
				// 	this.canSub=false
				// 	this.upLoadImg();
				// }
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
						_this.workAddress = (res.address.province?res.address.province:'')
						+(res.address.city?res.address.city:'')
						+(res.address.district?res.address.district:'')
						+(res.address.street?res.address.street:'')
						+(res.address.streetNum?res.address.streetNum:'')
						+(res.address.poiName?res.address.poiName:'');
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
			},
			//附件上传相关👇
			chooseFile(list, v,f) {
			  // console.log("上传图片_list：", list)
			  // console.log("上传图片_v：", v);
			  //  console.log("上传图片_f：", f);
			  this.imgList=list
			  this.imgFiles=this.imgFiles.concat(f)
			  this.maxCount=this.showMaxCount-list.length
			},
			imgDelete(list, eq,fileeq) {
			  // console.log("删除图片_list：", list)
			  // console.log("删除图片_eq：", eq)
			  // console.log("删除图片_fileeq：", fileeq)
			  this.imgList=list
			  this.imgFiles.splice(fileeq, 1); //删除临时路径
			  this.imgNames.splice(eq, 1); //删除文件名
			  this.maxCount=this.showMaxCount-list.length
			  // console.log("删除图片_fileeq：", JSON.stringify(this.imgNames))
			},
			upLoadImg(){
				if(this.workAddress==''){
					this.showToast('考勤地点信息为空')
				}else{
					let names=[]
					this.showLoading('正在上传文件...')
					cloudFileUtil.uploadFiles(this,'1',this.imgList,this.QN_PV_NAME,this.QN_OA_SHIW,(encName,encAddrStr)=>{
						console.log("encAddrStr: " + JSON.stringify(encAddrStr));
						console.log("names: " + JSON.stringify(encName));
						this.submitData(encName,encAddrStr)
					})
				}
			},
			//附件上传相关👆
			submitData(encNameStr,encAddrStr){
				this.showLoading()
				let comData={
					user_code: this.personInfo.user_code, //用户Code
					user_name: this.personInfo.user_name, //用户名称
					attend_addr: this.workAddress, //考勤地点
					attend_addr_x: this.longitude.toString(), //签到地点X坐标
					attend_addr_y: this.latitude.toString(), //签到地点Y坐标
					attend_pic: encAddrStr.length>0?encAddrStr[0]:'', //签到拍照
					index_code:this.index_code,
					op_code: 'add'
				}
				 this.hideLoading()
				 console.log("comData: " + JSON.stringify(comData));
				this.post(this.globaData.INTERFACE_ATTENDAND+'attend/addAttend',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
				    this.hideLoading()
				    this.showToast(response.msg);
				    const eventChannel = this.getOpenerEventChannel()
				    eventChannel.emit('refreshList', {data: 1});
				    uni.navigateBack();
				},()=>{
						this.canSub=true
				})
			},
		},
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
	.sure-button{
		border-color:#00CFBD !important;
		background: #00CFBD !important;
		color: #FFFFFF !important;
		font-size: 14px !important;
		flex:1 !important;
	}
	.line{
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.line-green{
		background-color: #00CFBD;
		margin-bottom: 0.3125rem;
		height: 1px;
	}
	.double-line{
		height: 5px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.form-view{
		padding: 0px 15px;
	}
	.form-left{
		font-size: 14px;
		width: 200rpx;
		color: #3F3F3F;
	}
	.form-left-textarea{
		margin-top: 5px;
		align-self: flex-start;
	}
	.form-right{
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
		text-align: right;
	}
	::v-deep .form-right .placeholder{
		color: grey;
		font-size: 14px;
		padding-right: 10px;
	}
	.uni-flex{
		align-items: center;
	}
	
	textarea{
		font-size: 13px;
		height: 80px;
		padding: 5px;
	}
	
	.form-left-approve{
		margin: 5px 0;
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
	}
</style>
