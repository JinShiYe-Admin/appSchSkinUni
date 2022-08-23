<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view>
			<view class="nameTime">地点：<span class='nameContent'>{{navItem.attendance_location}}</span>
			</view>
			<view class="nameTime">识别人数：<span class='nameContent'>{{pageData.length}}</span>
			</view>
			<view class="nameTime">时间：<span class='nameContent'>{{navItem.btime}}</span>
			</view>
			<view class="card-line" style="margin: 10px 0;"></view>
			<uni-row style="margin: 10px 10px 0 10px;background-color: #00aba1;border-radius: 10px;height: 40px;">
				<uni-col style="" :span="10">
					<p class="scoreDetail">校徽ID</p>
				</uni-col>
				<uni-col style="" :span="4">
					<p class="scoreDetail">年级</p>
				</uni-col>
				<uni-col style="" :span="4">
					<p class="scoreDetail">班级</p>
				</uni-col>
				<uni-col style="" :span="6">
					<p class="scoreDetail">姓名</p>
				</uni-col>
			</uni-row>
			<uni-row v-for="(model,index) in pageData" :key="index" style="margin: 10px 10px 0 10px;">
				<uni-col :span="10" style="height: 40px;">
					<view class="stuScoreDetail">{{model.card_id}}</view>
				</uni-col>
				<uni-col :span="4">
					<view class="stuScoreDetail">{{model.grd_name}}</view>
				</uni-col>
				<uni-col :span="4">
					<view class="stuScoreDetail">{{model.cls_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="stuScoreDetail">{{model.uname}}</view>
				</uni-col>
				<view class="card-line" style="margin: 40px 5px 0 5px;"></view>
			</uni-row>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				showLook: '',
				pageData:[],
				pageIndex: 1,
				total_page: 0,
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '滞留人员识别情况';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '滞留人员识别情况'
			});
			//#ifdef H5
			document.title = ""
			//#endif
			//
			this.getPageData();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			this.getPageData();
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getPageData();
		},
		methods: {
			getPageDataArray() {
				let comData = {
					card_id: "",
					card_tp: 8,
					cls_code: "-1",
					grd_code: "-1",
					is_card: 1,
					page_number: 1,
					page_size: 999999,
					uname: "",
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				//2.1.学生普通卡
				this.post(this.globaData.INTERFACE_UCARD + 'HrStuCardP', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < this.pageData.length; i++) {
							let tempM0 = this.pageData[i];
							if (data.data.list) {
								for (var a = 0; a < data.data.list.length; a++) {
									let tempM1 = data.data.list[a];
									if (tempM0.card_id == tempM1.card_id) {
										tempM0.grd_name = tempM1.grd_name;
										tempM0.cls_name = tempM1.cls_name;
										tempM0.uname = tempM1.uname;
									}
								}
							}
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getPageData() {
				let comData = {
					machid: this.navItem.mach_id, //蓝牙设备ID
					mtp: 8, //机器类型,8,蓝牙识别
					btime: this.navItem.btime,
					timespan:60,
					page_number: this.pageIndex, //当前页数
					page_size: 20, //每页记录数
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				//2.19.学校蓝牙设备监测人员
				this.post(this.globaData.INTERFACE_UCARD + 'blemachmovepersonp', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							tempM.grd_name = '未知';
							tempM.cls_name = '未知';
							tempM.uname = '未知';
						}
						
						this.pageIndex++;
						this.total_page = data.data.total_page;
						if (this.flagRef == 0) {
							if(data.data.list.length==0){
								this.showToast('暂无数据');
							}
							this.pageData = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.pageData = this.pageData.concat(data.data.list);
						}
						this.getPageDataArray();
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.tabs {
		width: 100vw;
		position: fixed;
		background-color: #FFFFFF;
		padding: 3px 3px 0;
		z-index: 10;
		/* #ifndef APP-PLUS */
		top: 44px;
		/* #endif */
		/* #ifdef APP-PLUS */
		right: 3px;
		/* #endif */
	}

	.leaveSum {
		margin-top: 10px;
		margin-left: 20px;
		margin-bottom: 0px;
		font-size: 14px;
		color: #505050;
	}

	.scoreDetail {
		font-size: 14px;
		color: white;
		text-align: center;
		margin-top: 10px;
	}

	.stuScoreDetail {
		font-size: 14px;
		color: #505050;
		text-align: center;
		padding-top: 5px;
		/* background-color: #e5e5e5;
		border-radius: 5px;
		margin-left: 2px;
		margin-right: 2px; */
	}

	.nameTime {
		font-size: 14px;
		margin: 10px 0 0 20px;
	}

	.nameContent {
		color: gray;
		font-size: 14px;
	}

	.card-line {
		height: 1px;
		background-color: #e5e5e5;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.card-title {
		font-size: 15px;
		text-align: center;
		margin-top: 8px;
	}
</style>
