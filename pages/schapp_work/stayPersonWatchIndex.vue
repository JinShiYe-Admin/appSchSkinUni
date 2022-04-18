<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view style="display: flex;">
				<picker style="flex: 1;" @change="locationTypeClick" :value="locationTypeIndex"
					:range="locationTypeArray" range-key="text">
					<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
						:value="locationTypeArray[locationTypeIndex].text"></uni-easyinput-select>
				</picker>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<view style="color: #939393;text-align: center;margin-top: 40px;" v-if="deviceList.length==0">暂无数据</view>
			<uni-list>
				<uni-list-item showArrow v-for="(model,index) in deviceList" :key='index' direction='column' clickable
					@click="clickItem(model)">
					<view slot="body">
						<view class="rightView">
							<view :span="12" class='title' style="font-size: 15px;">
								设备地点：{{model.attendance_location}}
							</view>
							<view v-if="model.watchFlag == 0" :span="12" class='nameTime' style=''>
								没有滞留人员
							</view>
							<view v-else-if="model.watchFlag == 1" :span="12" class='nameTime' style='color: #FAA666;'>
								有滞留人员
							</view>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
			<!-- <uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" /> -->
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
				pageSize: 15,
				pageobj0: {
					loadFlag: 0, //0 刷新 1加载更多
					page_number: 1, //页码
					status: 'more', //加载更多的状态
					contentText: {
						contentdown: '', //上滑加载更多
						contentrefresh: '加载中',
						contentnomore: '' //没有更多
					},
					canload: true, //是否加载更多
				},
				btime: '',
				timeFun:'',
				deviceList: [], //设备位置数组
				//顶部筛选框相关内容
				locationTypeIndex: 0,
				locationTypeArray: [{
					text: '全部',
					value: '-1'
				}, {
					text: '教室',
					value: '1'
				}, {
					text: '宿舍',
					value: '2'
				}, {
					text: '室外',
					value: '3'
				}, {
					text: '其他',
					value: '4'
				}, ],
			}
		},
		components: {
			mynavBar
		},
		methods: {
			clickItem: function(item) {
				if (item.watchFlag == 0) {
					this.showToast('没有监测到滞留人员');
				} else {
					clearInterval(this.timeFun);
					item.btime = this.btime;
					item.index_code = this.index_code;
					util.openwithData('/pages/schapp_work/stayPersonWatchDetail', item);
				}
			},
			locationTypeClick: function(e) {
				if (this.locationTypeIndex !== e.detail.value) {
					this.locationTypeIndex = e.detail.value
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getDeviceList();
				}
			},
			getDeviceList() { //108.定位监测设备列表
				let comData = {
					mach_type: 8, //设备类型,-1全部
					location_type: this.locationTypeArray[this.locationTypeIndex].value, //地点类型,-1全部
					pageNumber: 1,
					pageSize: 999,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK + 'LocationAttendance/list', comData, data => {
					this.hideLoading();
					for (var i = 0; i < data.list.length; i++) {
						var tempM = data.list[i];
						tempM.watchFlag = 0;
					}
					this.deviceList = [].concat(data.list);
					this.getList0();
				})
			},
			getList0() { //获取页面数据
				let tempId = [];
				for (var i = 0; i < this.deviceList.length; i++) {
					let tempM = this.deviceList[i];
					if (tempM.mach_id) {
						tempId.push(tempM.mach_id);
					}
				}
				if (tempId.length == 0) {
					return;
				}
				this.btime = this.moment().format('YYYY-MM-DD HH:mm:ss');
				let comData = {
					machids: tempId.join(','), //蓝牙设备ID串,多个用逗号分隔
					mtp: 8, //机器类型,8,蓝牙识别
					btime: this.btime,
					timespan: 60,
					page_number: 1, //当前页数
					page_size: 999, //每页记录数
					index_code: this.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_UCARD + 'blemachpersonmovep', comData, response => {
					this.hideLoading();
					uni.stopPullDownRefresh();
					let tempArray = [];
					for (var i = 0; i < this.deviceList.length; i++) {
						let tempM0 = this.deviceList[i];
						if (response) {
							for (var a = 0; a < response.list.length; a++) {
								let tempM1 = response.list[a];
								if (tempM0.mach_id == tempM1.mach_id) {
									tempM0.watchFlag = 1;
								}
							}
						}
					}
				})
			}
		},
		onLoad(options) {
			_this = this;
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			this.tabBarItem = util.getPageData(options);
			this.tabBarItem.index = 100;
			this.index_code = this.tabBarItem.access.split("#")[1];
			// 108.定位监测设备列表
			this.getDeviceList();
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			uni.$on('clickLeft',(data) =>{
				console.log('clearInterval');
				clearInterval(this.timeFun);
			})
		},
		onPullDownRefresh() {
			// this.pageobj0.loadFlag=0
			// this.pageobj0.canload=true
			// this.pageobj0.page_number=1
			this.getDeviceList()
			// setTimeout(function () {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		// onReachBottom() {
		// 	if(this.pageobj0.canload){
		// 		this.pageobj0.loadFlag=1
		// 		this.pageobj0.status = 'loading';
		// 		this.pageobj0.page_number=this.pageobj0.page_number+1
		// 		this.getList0()
		// 	}
		// },
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			this.timeFun = setInterval(function(){_this.getDeviceList();},60000);
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
	}
</script>

<style>
	.moreImg {
		width: 35px;
		height: 35px;
	}

	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.content {
		margin: 2px 0;
	}

	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
	}

	.line {
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}

	.title-text {
		display: flex;
		align-items: center;
		width: 80vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.detail-text {
		color: #939393;
		font-size: 12px;
		margin: 3px 0;
	}

	.tow-line {
		overflow: hidden;
		width: 85vw;
		text-overflow: ellipsis;
		white-space: nowrap;
		/* 		 text-overflow: -o-ellipsis-lastline;
		 overflow: hidden;
		 text-overflow: ellipsis;
		 display: -webkit-box;
		 -webkit-line-clamp: 2;
		 -webkit-box-orient: vertical; */
	}

	.leaveType {
		font-size: 12px;
		width: 48px;
		color: #EFAD44;
		padding: 0px 3px;
		border-radius: 4px;
		margin-right: 3px;
		border: 1px solid #EFAD44;
	}

	.uni-input-input {
		font-size: 13px;
	}

	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100%);
	}

	.title {
		font-size: 13px;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 5px;
	}

	.nameTime {
		margin-top: 5px;
		font-size: 13px;
		color: gray;
	}

	::v-deep .uni-list--border-top {
		height: 0px;
	}

	::v-deep .uni-list--border-bottom {
		height: 0px;
	}

	::v-deep .uni-easyinput {
		width: 150px;
	}
</style>
