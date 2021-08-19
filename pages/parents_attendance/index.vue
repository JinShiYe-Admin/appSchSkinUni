<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="text"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<view class="content">
			<view v-if="semFlag == 0">
				<view style="margin-top: 20px;">
					<m-steps v-for="(item, index) in semFlag0Data.attenceList" :item='item' :key="index" :index='index'>
						<view slot="dateTop" style="width: 100px;text-align: center;font-size: 14px;color: #808080;">
							{{item.create_time}}</view>
						<template v-if="item.attendance_type=='inOutCls'">
							<view slot="status" class="viewFlag" style="background-color: #ff9900;">{{item.item_txt}}</view>
							<view slot="content" class="viewNode">{{item.attendance_time}} {{item.day}} {{item.class_node}}
								{{item.sub_name}}</view>
							<view slot="content" class="viewNode">{{item.comment}}</view>
						</template>
						<template v-if="item.attendance_type=='leave'">
							<view slot="status" class="viewFlag" style="background-color: #ff9900;">{{item.item_txt}}</view>
							<view slot="content" class="viewNode">{{item.time_range}}</view>
							<view slot="content" class="viewNode">{{item.comment}}</view>
						</template>
						<template
							v-if="item.attendance_type=='inOutSchoolAttendance' || item.attendance_type=='inOutDormAttendance'">
							<view slot="status" class="viewFlag">{{item.item_txt}}</view>
							<view slot="content" class="viewNode">{{item.card_dir_txt}}</view>
							<image v-if="item.card_url" style="width: 100px;height: 100px;margin-top: 20px;"
								:src="item.card_url"></image>
						</template>
					</m-steps>
				</view>
			</view>
			<view v-if="semFlag == 1">
				<view style="text-align: center;margin-top: 10px;">请假总次数：<span style="color: red;font-size: 20px;">{{semFlag1Data.total_count}}</span></view>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 10px;">各月对比</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 0 15px;width: 60px;"></view>
				<view class="charts-box" style="margin-left: 10px;">
					<qiun-data-charts type="column" :chartData="semFlag1Data.monthCountArray" />
				</view>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 15px;">请假记录</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 0 15px;width: 60px;"></view>
				<uni-list>
				    <uni-list-item showArrow @click="clickLeaveDetail(item)" v-for="(item,index) in semFlag1Data.leaveList" :key='index'>
				        <view slot="body">
							<span class='leaveDetail' style="margin-left: 15px;">{{index+1}}</span>
							<span class='leaveDetail' style="margin-left: 15px;">{{item.item_txt}}</span>
							<span class='leaveDetail' style="margin-left: 15px;">{{item.begintime.split(':')[0]}}:{{item.begintime.split(':')[1]}}~{{item.endtime.split(':')[0]}}:{{item.endtime.split(':')[1]}}</span>
						</view>
				    </uni-list-item>
				</uni-list>
				<view class="uni-loadmore" v-if="semFlag1Data.showLoadMore">{{semFlag1Data.loadMoreText}}</view>
			</view>
			<view v-if="semFlag == 2">
				<!-- <view style="margin: 10px 0 0 20px;color: #00CFBD;">
					<span id='months-a' style="color: #00CFBD;" data-options='{"type":"month","title":"开始时间"}'  @tap="months($event,'months-a')" style="float: left;"></span><span class="mui-icon mui-icon-arrowdown" style="font-size: 15px;margin-left: 3px;"></span>
				</view> -->
				<h4 class="spaceLine">一、出入校</h4>
				<ul class="mui-table-view">
					<li @tap="churuxiao()" class="mui-table-view-cell">
						<a class="mui-navigate-right">
							<span style="margin-left: 40px;">出入校记录</span>
							<span style="margin-left: 40px;">{{semFlag2Data.total_count}}条</span>
						</a>
					</li>
				</ul>
				<h4 class="spaceLine">二、考勤统计</h4>
				<p style="margin: 10px 0 0 20px;font-weight: 900;font-size: 14px;color: #505050;">各月对比</p>
				<view class="charts-box" style="margin-left: 10px;">
					<qiun-data-charts type="column" :chartData="semFlag2Data.monthCountArray" />
				</view>
				<p style="margin: -10px 0 0 20px;font-weight: 900;font-size: 14px;color: #505050;" v-if="semFlag2Data.leaveList.length>0">考勤项目统计</p>
					<!-- <ul class="mui-table-view" style="margin-top: 10px;">
						<li @tap="clickAttenceDetail(item)" v-for="(item,index) in semFlag2Data.leaveList" class="mui-table-view-cell">
							<a class="mui-navigate-right">
								<span>{{index+1}}</span>
								<span style="margin-left: 20px;">{{item.item_txt}}</span>
								<span style="margin-left: 20px;">{{item.num}}次</span>
							</a>
						</li>
					</ul> -->
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
				semFlag: 0, //点击的seg索引
				// loading: true,
				// loading2: true,
				// loading3: true,
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
					startTime: '2021-03',
					endTime: '2021-08',
					total_page: 0, //总页数
					total_count: '', //请假总次数
					monthCountArray:{},
					loadMoreText: "加载中...",
					showLoadMore: false,
					leaveList: []
				},
				semFlag2Data: {
					// refrushFlag: 0, //0刷新1加载更多
					// pageNumber: 1,
					startTime: '2021-03',
					endTime: '2021-08',
					// total_page: 0, //总页数
					total_count: '', //出入量总次数
					monthCountArray:{},
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
			this.getAttendancePage();
		},
		onReachBottom() {
			if(this.semFlag == 0){
				this.semFlag0Data.flagRef = 1;
				if (this.semFlag0Data.total_page < this.semFlag0Data.pageIndex) {
					this.semFlag0Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.semFlag0Data.showLoadMore = true;
				setTimeout(() => {
					this.getAttendancePage();
				}, 300);
			}else if(this.semFlag == 1){
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
			if(this.semFlag == 0){
				this.semFlag0Data.loadMoreText = "加载中..."
				this.semFlag0Data.flagRef = 0;
				this.semFlag0Data.pageIndex = 1;
				this.getAttendancePage();
			}else if(this.semFlag == 1){
				this.semFlag1Data.loadMoreText = "加载中..."
				this.semFlag1Data.flagRef = 0;
				this.semFlag1Data.pageIndex = 1;
				this.getLeaveStatistics();
				this.getLeavePage();
			}
		},
		methods: {
			clickSeg: function(e) {
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					console.log('this.semFlag:' + e.currentIndex);
					if (this.semFlag == 0) {
						if(this.semFlag0Data.attenceList.length==0){
							this.getAttendancePage();
						}
					} else if (this.semFlag == 1) {
						if(this.semFlag1Data.total_count == 0){
							this.getLeaveStatistics();
						}
						if(this.semFlag1Data.leaveList.length == 0){
							this.getLeavePage();
						}
					} else if (this.semFlag == 2) {
						if(this.semFlag2Data.total_count == 0){
							this.getInOutCount();
						}
						
						this.getAttendanceCountByMonth();
						this.getPageAttendanceStatistics();
					}
				}
			},
			clickLeaveDetail: function(model) {
				util.openwithData("/pages/parents_attendance/leaveDetail", model);
			},
			clickAttenceDetail: function(model) {
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
			months: function(e, id) {
				let that = e.target
				var _self = that;
				var optionsJson = that.getAttribute('data-options') || '{}';
				var options = JSON.parse(optionsJson);
				if (id == 'months') {
					options.value = this.semFlag1Data.startTime
				} else if (id == 'months-a') {
					options.value = this.semFlag2Data.startTime
				}
				options.endDate = new Date(currentYear(), currentMonth());
				var id = that.getAttribute('id');
				var picker = new mui.DtPicker(options);
				picker.show(function(rs) {
					let start_monthStr = moment(rs.text).format('YYYY年MM月')
					let end_monthStr = moment(rs.text).add(5, 'M').format('YYYY年MM月');
					let start_month = moment(rs.text).format('YYYY-MM')
					let end_month = moment(rs.text).add(5, 'M').format('YYYY-MM');
					$('#' + id).html(start_monthStr + ' ~ ' + end_monthStr)
					if (id == 'months') {
						this.semFlag1Data.startTime = start_month;
						this.semFlag1Data.endTime = end_month;
						this.semFlag1Data.refrushFlag = 0; //0刷新1加载更多
						this.semFlag1Data.pageNumber = 1;
						this.getLeaveStatistics();
						this.getLeavePage();
					} else if (id == 'months-a') {
						this.semFlag2Data.startTime = start_month;
						this.semFlag2Data.endTime = end_month;
						this.semFlag2Data.refrushFlag = 0; //0刷新1加载更多
						this.semFlag2Data.pageNumber = 1;
						this.getInOutCount();
						this.getAttendanceCountByMonth();
						this.getPageAttendanceStatistics();
					}
					picker.dispose();
					picker = null;
				});
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
							this.semFlag2Data.leaveList = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.semFlag2Data.leaveList = this.semFlag2Data.leaveList.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			currentYear() {
				return moment().format("YYYY")
			},
			currentMonth() {
				return moment().months()
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
	
	.viewNode{
		font-size: 14px;
		color: #333;
	}
	
	.leaveDetail{
		font-size: 12px;
		color: #505050;
	}
	
	.uni-common-mt {
	    margin-top: 0px;
	    background: #F0F0F0;
	    padding-top: 5px;
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
