<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="rightIcon" :iconClick="iconClick"></mynavBar>
		<uni-card isShadow style="margin: 20px 5px 0;" @click="gotoDetail(item)" v-for="(item,index) in pagedata" :key="index">
			<view style="font-size: 14px;text-align: right;" :style="{color:item.vacation_type==0?'#b8741a':'#70b603'}">{{item.vacation_type==0?'未审批':'已审批'}}</view>
			<view class="card-line" :style="{color:item.vacation_type==0?'#aaaaaa':item.vacation_type==1?'#70b603':''}">{{item.vacation_type_name}}</view>
			<view style="font-size: 12px;text-align: center;margin-top: 5px;">审批意见</view>
			<uni-row style="margin-top: 15px;">
				<uni-col :span="6">
					<view class="rowStyle">请假类别：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{item.type_code=='absenceLeave'?'事假':'病假'}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">开始时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{item.start_time}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">结束时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{item.end_time}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">请假时长：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{parseInt(item.vacation_day / 24)}}天{{(item.vacation_day % 24).toFixed(1)}}小时</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">请假事由：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{item.explanation}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">申请时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{item.create_time}}</view>
				</uni-col>
			</uni-row>
		</uni-card>
		<view v-if="pagedata.length==0" style="text-align: center;margin: 20px 0 10px 0;font-size: 13px;">暂无</view>
		<!-- <view style="height: 50px;background: #f2f2f2;"></view> -->
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		<!-- index界面保留，index1界面屏蔽 -->
		<!-- <u-tabbar-my v-if='navItem.index<5' :list="tabbar"></u-tabbar-my> -->
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
				navItem: {},
				rightIcon:'',
				pageSize:15,
				pagedata:[],
				flagRef: 0, //0刷新1加载更多
				pageIndex: 1,
				total_page: 0, //总页数
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			// index1界面用这个
			this.navItem = util.getPageData(option);
			// index界面用这个
			// this.navItem = util.getTabbarMenu();
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			this.getList0();
			// 获取权限
			this.getPermissionByPosition('add', this.navItem.access.split('#')[1], result => {
				if (result[0]) {
					this.rightIcon = 'plusempty';
				}
			})
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
		methods: {
			iconClick(){
				util.openwithData('/pages/leave1/add', {
					index_code: _this.navItem.access.split("#")[1],
				}, {
					refreshLeave1Index(data) { //子页面调用父页面需要的方法
						_this.loadMoreText = "加载中..."
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.getList0();
					}
				})
			},
			gotoDetail(model){
				util.openwithData('/pages/leave1/detail', {
					index_code:_this.navItem.access.split("#")[1],
					id: model.id
				}, {
					refreshLeave1Index(data) { //子页面调用父页面需要的方法
						_this.loadMoreText = "加载中..."
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.getList0();
					}
				})
			},
			getList0(){
				let comData = {
					stu_code:this.personInfo.stu_code,
					page_size:10,
					page_number:this.pageIndex,
					index_code: this.navItem.access.split("#")[1],
				}
				// 6.1.学生请假列表
				this.post(this.globaData.INTERFACE_KHFW + 'stuVacation/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							if(tempM.vacation_type == 0){
								tempM.vacation_type_name = '--';
							}else if(tempM.vacation_type == 1){
								tempM.vacation_type_name = '同意';
							}else if(tempM.vacation_type == 2){
								tempM.vacation_type_name = '不同意';
							}
							if(tempM.type == 1){
								tempM.type_name = '因公';
							}else if(tempM.type == 0){
								tempM.type_name = '因私';
							}
							tempM.start_time = tempM.start_time.slice(0,16);
							tempM.end_time = tempM.end_time.slice(0,16);
							tempM.create_time = tempM.create_time.slice(0,16);
						}
							this.pageIndex++;
							this.total_page = data.data.total_page;
							if (this.flagRef == 0) {
								if (data.data.list.length == 0) {
									this.showToast('暂无数据');
								}
								this.pagedata = [].concat(data.data.list);
								uni.stopPullDownRefresh();
							} else {
								this.pagedata = this.pagedata.concat(data.data.list);
							}
					} else {
						this.showToast(data.msg);
					}
				});
			},
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.getList0();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getList0();
		},
	}
</script>

<style>
	.card-line {
		text-align: center;
		font-size: 24px;
		color: #d9001b;
		font-weight: 500;
		margin-top: -15px;
		border-bottom: 2px solid #aaaaaa;
		width: 100px;
		margin-left: calc((100% - 100px)/2);
	}
	
	.rowStyle{
		font-size: 14px;
		height: 30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
