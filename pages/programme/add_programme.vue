<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' :icon="rightIcon" :iconClick="iconClick">
		</mynavBar>
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">日程时间</view>
			</uni-col>
			<uni-col :span="18">
				<!-- <view class="rightView">大佬设计里的科教</view> -->
				<input type="text" class="rightView" disabled placeholder="请输入内容" />
			</uni-col>
		</uni-row>
		<view class="line"></view>
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">工作地点</view>
			</uni-col>
			<uni-col :span="18">
				<view class="rightView">大佬设计里的科教</view>
			</uni-col>
		</uni-row>
		<view class="line"></view>
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">开始时间</view>
			</uni-col>
			<uni-col :span="18">
				<view class="rightView">大佬设计里的科教</view>
			</uni-col>
		</uni-row>
		<view class="line"></view>
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">结束时间</view>
			</uni-col>
			<uni-col :span="18">
				<view class="rightView">大佬设计里的科教</view>
			</uni-col>
		</uni-row>
		<view class="line"></view>
		<uni-row>
			<uni-col :span="6" style="min-height: 40px;">
				<view class="leftView">日程内容</view>
			</uni-col>
			<uni-col :span="18">
				<textarea placeholder="请输入" v-model="workContent" maxlength="100" ></textarea>
			</uni-col>
		</uni-row>
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
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				type: '',
				rightIcon: '', //add按钮权限
				todayDate: '',
				begintime: '09:00',
				endtime: '17:00',
				workAddress: '',
				workContent: 'sdsdfsd',
				longitude: '',
				latitude: ''
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.index = 100;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//4.获取某人日程列表
			// this.getPageList();

			uni.getLocation({
				type: 'gcj02',
				geocode:true,
				// altitude:true,
				success: function (res) {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					console.log('address：' + JSON.stringify(res.address));
					_this.longitude =res.longitude
					_this.latitude = res.latitude
				},
				fail() {
					console.log("获取位置失败");
				},
				complete:()=> {
					//#ifdef H5
					_this.$jsonp("https://apis.map.qq.com/ws/geocoder/v1/", {
						key: "3BSBZ-L7MLV-S2QPR-ULWG7-MKT3E-M5BDW",
						callbackName: "getJsonData",
						output: 'jsonp',
						location: _this.latitude+","+_this.longitude
					})
					.then(json => {
						// 请求成功的返回数据
						 console.log(json)
					})
					.catch(err => {
						// 请求失败的返回数据 
						console.log(err)
					})
					//#endif
				}									
			})

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
			iconClick() {
				console.log('iconClick');
				// let model = {};
				// let index_code = this.itemData.access.split('#')[1]
				// model.index_code = index_code;
				// model.text = '新增日程';
				// util.openwithData("/pages/programme/add_programme", model);
			},
			//4.获取某人日程列表
			getPageList() {
				var comData = {
					user_code: this.personInfo.user_code, //用户Code
					note_addr: '', //日程地点
					begin_time: '20170101', //查询开始时间
					end_time: '30180127', //查询结束时间
					page_number: this.pageIndex, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.itemData.access.split('#')[1],
					op_code: 'index'
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_PROGRAMME + 'note/getNotes', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {

					} else {
						this.showToast(data.msg);
					}
				});
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
					success: (res) => {
						console.log('doGetLocation-----success:' + JSON.stringify(res));
						this.hasLocation = true;
						this.location = formatLocation(res.longitude, res.latitude);
					},
					fail: (err) => {
						console.log('doGetLocation-----fail:' + JSON.stringify(err));
						// #ifdef MP-BAIDU
						if (err.errCode === 202 || err.errCode === 10003) { // 202模拟器 10003真机 user deny
							this.showConfirm();
						}
						// #endif
						// #ifndef MP-BAIDU
						if (err.errMsg.indexOf("auth deny") >= 0) {
							uni.showToast({
								title: "访问位置被拒绝"
							})
						} else {
							uni.showToast({
								title: err.errMsg
							})
						}
						// #endif
					}
				})
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
	.leftView{
		text-align: center;margin-top: 10px;font-size: 14px;
	}
	.rightView{
		word-break: break-all;padding: 10px 10px;font-size: 14px;color: gray;
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
		/* width: 200rpx; */
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
		min-height: 40px;
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
