<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="text"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<view class="content" style="margin-top: 60px;">
			<view v-show="semFlag == 0">
				<view>
					<m-steps v-for="(item, index) in semFlag0Data.attenceList" :item='item' :key="index" :index='index'>
						<view slot="dateTop" style="width: 100px;text-align: center;font-size: 14px;color: #808080;">
							{{item.create_time}}
						</view>
						<template v-if="item.attendance_type=='inOutCls'">
							<view slot="status" class="viewFlag" style="background-color: #ff9900;">{{item.item_txt}}
							</view>
							<view slot="content" class="viewNode">{{item.attendance_time}} {{item.day}}
								{{item.class_node}}
								{{item.sub_name}}
							</view>
							<view slot="content" class="viewNode">{{item.comment}}</view>
						</template>
						<template v-if="item.attendance_type=='leave'">
							<view slot="status" class="viewFlag" style="background-color: #ff9900;">{{item.item_txt}}
							</view>
							<view slot="content" class="viewNode">{{item.time_range}}</view>
							<view slot="content" class="viewNode">{{item.comment}}</view>
						</template>
						<template
							v-if="item.attendance_type=='inOutSchoolAttendance' || item.attendance_type=='inOutDormAttendance'">
							<view slot="content" class="viewNode">{{item.attendance_location}}</view>
							<view slot="status" class="viewFlag" style="width: 40px;">{{item.card_dir_txt}}</view>
							<view slot="content" class="viewNode"><image v-if="item.card_url" style="width: 100px;height: 100px;margin-top: 20px;" @click="clickImg(item.card_url)"
								:src="item.card_url"></image></view>
						</template>
					</m-steps>
				</view>
			</view>
			<view v-show="semFlag == 1">
				<view style="margin: -10px 0 0 20px;color: #00CFBD;">
					<dy-Date :childValue='semFlag1Data.startTime' timeType="month"
						:dateMore="' ~ '+semFlag1Data.endTime" v-on:getData='getSem1Date' minSelect='2020-01'
						:maxSelect='dateEndTime'></dy-Date>
				</view>
				<view style="text-align: center;margin-top: 10px;">请假总次数：<span
						style="color: red;font-size: 20px;">{{semFlag1Data.total_count}}</span></view>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 10px;">各月对比</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 0 15px;width: 60px;"></view>
				<view class="charts-box" style="margin-left: 10px;">
					<qiun-data-charts type="column" :chartData="semFlag1Data.monthCountArray" />
				</view>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 15px;">请假记录</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 0 15px;width: 60px;"></view>
				<uni-list>
					<uni-list-item showArrow clickable @click="clickLeaveDetail(item)"
						v-for="(item,index) in semFlag1Data.leaveList" :key='index'>
						<view slot="body">
							<span class='leaveDetail' style="margin-left: 15px;">{{index+1}}</span>
							<span class='leaveDetail' style="margin-left: 15px;">{{item.item_txt}}</span>
							<span class='leaveDetail'
								style="margin-left: 15px;">{{item.begintime.split(':')[0]}}:{{item.begintime.split(':')[1]}}~{{item.endtime.split(':')[0]}}:{{item.endtime.split(':')[1]}}</span>
						</view>
					</uni-list-item>
				</uni-list>
				<view class="uni-loadmore" v-if="semFlag1Data.showLoadMore">{{semFlag1Data.loadMoreText}}</view>
			</view>
			<view v-show="semFlag == 2">
				<view style="margin: -10px 0 0 20px;color: #00CFBD;">
					<dy-Date :childValue='semFlag2Data.startTime' timeType="month"
						:dateMore="' ~ '+semFlag2Data.endTime" v-on:getData='getSem2Date' minSelect='2020-01'
						:maxSelect='dateEndTime'></dy-Date>
				</view>
				<h4 class="spaceLine">一、出入校</h4>
				<uni-list>
					<uni-list-item showArrow clickable @click="churuxiao()">
						<view slot="body">
							<span style="margin-left: 40px;">出入校记录</span>
							<span style="margin-left: 40px;">{{semFlag2Data.total_count}}条</span>
						</view>
					</uni-list-item>
				</uni-list>
				<h4 class="spaceLine">二、考勤统计</h4>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 15px;">各月对比</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 0 15px;width: 60px;"></view>
				<view class="charts-box" style="margin-left: 10px;">
					<qiun-data-charts type="column" :chartData="semFlag2Data.monthCountArray" />
				</view>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 15px;">考勤项目统计</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 0 15px;width: 80px;"></view>
				<uni-list>
					<uni-list-item showArrow clickable @click="clickAttenceDetail(item)"
						v-for="(item,index) in semFlag2Data.leaveList" :key='index'>
						<view slot="body">
							<span class='leaveDetail' style="margin-left: 15px;">{{index+1}}</span>
							<span class='leaveDetail' style="margin-left: 15px;">{{item.item_txt}}</span>
							<span class='leaveDetail' style="margin-left: 15px;">{{item.num}}次</span>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
		</view>
		<u-tabbar-my v-if='tabBarItem.index<5' :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import mSteps from '@/components/m-steps/m-steps.vue'
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
				pageSize: 10,
				semValuesArray: ['考勤记录', '请假统计', '考勤统计'],
				dateEndTime: '',
				semFlag: 0, //点击的seg索引
				semFlag0Data: { //考勤记录
					pageIndex: 1,
					total_page: 0,
					flagRef: 0, //是刷新0，还是加载更多1
					loadMoreText: "加载中...",
					showLoadMore: false,
					attenceList: [] //考勤记录列表
				},
				semFlag1Data: { //请假统计
					flagRef: 0, //0刷新1加载更多
					pageIndex: 1,
					startTime: '',
					endTime: '',
					total_page: 0, //总页数
					total_count: '', //请假总次数
					monthCountArray: {},
					loadMoreText: "加载中...",
					showLoadMore: false,
					leaveList: []
				},
				semFlag2Data: {
					// refrushFlag: 0, //0刷新1加载更多
					// pageNumber: 1,
					startTime: '',
					endTime: '',
					// total_page: 0, //总页数
					total_count: '', //出入量总次数
					monthCountArray: {},
					knowData: {},
					leaveList: []
				}
			}
		},
		components: {
			mynavBar,
			mSteps
		},
		onLoad() {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			})
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			console.log('personInfo:' + JSON.stringify(this.personInfo));
			this.tabBarItem = util.getTabbarMenu();
			console.log('this.tabBarItem:' + JSON.stringify(this.tabBarItem));
			//获取考勤记录
			this.getAttendancePage();;
			let end_month = this.moment().format('YYYY-MM')
			let start_month = this.moment().subtract(5, 'M').format('YYYY-MM');
			this.semFlag1Data.startTime = start_month;
			this.semFlag1Data.endTime = end_month;
			this.semFlag2Data.startTime = start_month;
			this.semFlag2Data.endTime = end_month;
			this.dateEndTime = end_month;
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
		},
		onReachBottom() {
			if (this.semFlag == 0) {
				this.semFlag0Data.flagRef = 1;
				if (this.semFlag0Data.total_page < this.semFlag0Data.pageIndex) {
					this.semFlag0Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.semFlag0Data.showLoadMore = true;
				setTimeout(() => {
					this.getAttendancePage();
				}, 300);
			} else if (this.semFlag == 1) {
				this.semFlag1Data.flagRef = 1;
				if (this.semFlag1Data.total_page < this.semFlag1Data.pageIndex) {
					this.semFlag1Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.semFlag1Data.showLoadMore = true;
				setTimeout(() => {
					this.getLeaveStatistics();
					this.getLeavePage();
				}, 300);
			}
		},
		onPullDownRefresh() {
			if (this.semFlag == 0) {
				this.semFlag0Data.loadMoreText = "加载中..."
				this.semFlag0Data.flagRef = 0;
				this.semFlag0Data.pageIndex = 1;
				this.getAttendancePage();
			} else if (this.semFlag == 1) {
				this.semFlag1Data.loadMoreText = "加载中..."
				this.semFlag1Data.flagRef = 0;
				this.semFlag1Data.pageIndex = 1;
				this.getLeaveStatistics();
				this.getLeavePage();
			}else{
				uni.stopPullDownRefresh();
			}
		},
		methods: {
			clickImg(img){
				let tempArray = [];
				tempArray.push(img);
				uni.previewImage({
					urls: tempArray,
				});
			},
			getSem1Date(sureDtae) {
				if (sureDtae != this.semFlag1Data.startTime) {
					let end_month = this.moment(sureDtae).add(5, 'M').format('YYYY-MM');
					this.semFlag1Data.startTime = sureDtae;
					this.semFlag1Data.endTime = end_month;
					this.semFlag1Data.loadMoreText = "加载中..."
					this.semFlag1Data.flagRef = 0;
					this.semFlag1Data.pageIndex = 1;
					this.getLeaveStatistics();
					this.getLeavePage();
				}
			},
			getSem2Date(sureDtae) {
				if (sureDtae != this.semFlag2Data.startTime) {
					let end_month = this.moment(sureDtae).add(5, 'M').format('YYYY-MM');
					this.semFlag2Data.startTime = sureDtae;
					this.semFlag2Data.endTime = end_month;
					this.getInOutCount();
					this.getAttendanceCountByMonth();
					this.getPageAttendanceStatistics();
				}
			},
			clickSeg: function(e) {
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					console.log('this.semFlag:' + e.currentIndex);
					if (this.semFlag == 0) {
						if (this.semFlag0Data.attenceList.length == 0) {
							this.getAttendancePage();
						}
					} else if (this.semFlag == 1) {
						if (this.semFlag1Data.total_count == 0) {
							this.getLeaveStatistics();
						}
						if (this.semFlag1Data.leaveList.length == 0) {
							this.getLeavePage();
						}
					} else if (this.semFlag == 2) {
						if (this.semFlag2Data.total_count == 0) {
							this.getInOutCount();
						}
						if(!this.semFlag2Data.monthCountArray.categories){
							this.getAttendanceCountByMonth();
						}
						if(this.semFlag2Data.leaveList.length == 0){
							this.getPageAttendanceStatistics();
						}
					}
				}
			},
			clickLeaveDetail: function(model) {
				util.openwithData("/pages/parents_attendance/leaveDetail", model);
			},
			clickAttenceDetail: function(model) {
				console.log('clickAttenceDetail');
				model.access = this.tabBarItem.access
				util.openwithData("/pages/parents_attendance/attenceDetail", model);
			},
			churuxiao: function() {
				this.tabBarItem.count = this.semFlag2Data.total_count;
				if (this.tabBarItem.count == 0) {
					return;
				}
				util.openwithData("/pages/parents_attendance/churuxiao", this.tabBarItem);
			},
			//获取考勤记录
			getAttendancePage() {
				let user_code = this.personInfo.user_code;
				if (this.personInfo.type_code == 'YHLX0004') {
					user_code = this.personInfo.stu_code;
				}
				let comData = {
					stu_code: user_code,
					page_size: this.pageSize,
					page_number: this.semFlag0Data.pageIndex,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.PARENTS_ATTENDANCE + 'attendance/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag0Data.pageIndex++;
						this.semFlag0Data.total_page = data.data.total_page;
						if (this.semFlag0Data.flagRef == 0) {
							if(data.data.list.length==0){
								this.showToast('暂无数据');
							}
							this.semFlag0Data.attenceList = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.semFlag0Data.attenceList = this.semFlag0Data.attenceList.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//获取请假统计
			getLeaveStatistics() {
				let user_code = this.personInfo.user_code;
				if (this.personInfo.type_code == 'YHLX0004') {
					user_code = this.personInfo.stu_code;
				}
				let comData = {
					stu_code: user_code,
					begintime: this.semFlag1Data.startTime,
					endtime: this.semFlag1Data.endTime,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.PARENTS_ATTENDANCE + 'leave/statistics', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag1Data.total_count = data.data.total_count
						let month_data_array = data.data.month_data_array;
						let months = [];
						let counts = [];
						month_data_array.map(item => {
							months.push(item.month)
							counts.push(item.count)
						})
						this.semFlag1Data.monthCountArray = {
							categories: months,
							series: [{
								name: "各月请假次数",
								data: counts
							}]
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//获取请假记录
			getLeavePage() {
				let user_code = this.personInfo.user_code;
				if (this.personInfo.type_code == 'YHLX0004') {
					user_code = this.personInfo.stu_code;
				}
				let comData = {
					stu_code: user_code,
					begintime: this.semFlag1Data.startTime,
					endtime: this.semFlag1Data.endTime,
					page_size: this.pageSize,
					page_number: this.semFlag1Data.pageNumber,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.PARENTS_ATTENDANCE + 'leave/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag1Data.pageIndex++;
						this.semFlag1Data.total_page = data.data.total_page;
						if (this.semFlag1Data.flagRef == 0) {
							if(data.data.list.length==0){
								this.showToast('暂无数据');
							}
							this.semFlag1Data.leaveList = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.semFlag1Data.leaveList = this.semFlag1Data.leaveList.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//获取统计出入数量
			getInOutCount() {
				let user_code = this.personInfo.user_code;
				if (this.personInfo.type_code == 'YHLX0004') {
					user_code = this.personInfo.stu_code;
				}
				let comData = {
					stu_code: user_code,
					begintime: this.semFlag2Data.startTime,
					endtime: this.semFlag2Data.endTime,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.PARENTS_ATTENDANCE + 'attendance/inOutCount', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag2Data.total_count = data.data.count;
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//按月统计考勤项目
			getAttendanceCountByMonth() {
				let user_code = this.personInfo.user_code;
				if (this.personInfo.type_code == 'YHLX0004') {
					user_code = this.personInfo.stu_code;
				}
				let comData = {
					stu_code: user_code,
					begintime: this.semFlag2Data.startTime,
					endtime: this.semFlag2Data.endTime,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.PARENTS_ATTENDANCE + 'attendance/attendanceCountByMonth', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						let month_data_array = data.data.list
						let months = [];
						let counts = [];
						month_data_array.map(item => {
							months.push(item.month)
							counts.push(item.count)
						})
						this.semFlag2Data.monthCountArray = {
							categories: months,
							series: [{
								name: "各月考勤次数",
								data: counts
							}]
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//分页查询考勤项目统计
			getPageAttendanceStatistics() {
				let user_code = this.personInfo.user_code;
				if (this.personInfo.type_code == 'YHLX0004') {
					user_code = this.personInfo.stu_code;
				}
				let comData = {
					begintime: this.semFlag2Data.startTime,
					endtime: this.semFlag2Data.endTime,
					page_size: this.pageSize,
					stu_code: user_code,
					page_number: this.semFlag2Data.pageNumber,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.PARENTS_ATTENDANCE + 'attendance/pageAttendanceStatistics', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag2Data.pageIndex++;
						this.semFlag2Data.total_page = data.data.total_page;
						if (this.semFlag2Data.flagRef == 0) {
							if(data.data.list.length==0){
								this.showToast('暂无数据');
							}
							this.semFlag2Data.leaveList = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.semFlag2Data.leaveList = this.semFlag2Data.leaveList.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.viewFlag {
		height: 30px !important;
		width: 70px;
		text-align: center;
		padding-top: 5px;
		background: #3aca3a;
		border-radius: 5px;
		color: white;
		font-size: 15px;
	}

	.viewNode {
		font-size: 14px;
		color: #333;
	}

	.leaveDetail {
		font-size: 12px;
		color: #505050;
	}

	/* 间隔 */
	.spaceLine {
		padding-left: 15px;
		text-align: left;
		padding-top: 15px;
		padding-bottom: 15px;
		background: #f8efef;
		font-size: 14px;
		color: #505050;
	}
</style>
