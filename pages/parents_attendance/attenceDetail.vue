<template>
	<view>
		<view class="">
			<view style="margin: 0px 0 0 20px;color: #00CFBD;">
				<dy-Date :childValue='startTime' timeType="month" :dateMore="' ~ '+endTime" v-on:getData='getDate'
					minSelect='2020-01' :maxSelect='dateEndTime'></dy-Date>
			</view>
			<view style="padding: 0 15px;margin-top: 10px;text-align: center;font-size: 14px;">
				<span>{{item_txt}}次数：</span><span style="color: #FF3333;font-size: 18px;">{{total_count}}</span>
			</view>
		</view>
		<uni-list :border="false" style="">
			<uni-list-item :border="false" v-for="(item,index) in pageArray" :key='index' direction='column'>
				<view slot="body">
					<view style="height: 30px;background-color: #F3EDDB;margin-top:10px;">
						<view
							style="margin-left: 5px;text-align: center;background-color: #FF9900;border-radius: 50%;width: 30px;height: 30px;">
							<view
								style="color: #FFFFFF;font-size: 14px;font-weight: 600;display: inline-block;margin-top: 5px;">
								{{++index}}</view>
						</view>
					</view>
					<uni-row style="padding: 10px 20px 0;color: #505050;font-size: 14px;">
						<uni-col :span="8">
							考勤日期
						</uni-col>
						<uni-col :span="16">
							{{item.attendance_time?item.attendance_time:'暂无'}}
						</uni-col>
						<uni-col :span="8">
							星期
						</uni-col>
						<uni-col :span="16">
							{{item.day?item.day:'暂无'}}
						</uni-col>
						<uni-col :span="8">
							节次
						</uni-col>
						<uni-col :span="16">
							{{item.class_node?item.class_node:'暂无'}}
						</uni-col>
						<uni-col :span="8">
							科目
						</uni-col>
						<uni-col :span="16">
							{{item.sub_name?item.sub_name:'暂无'}}
						</uni-col>
						<uni-col :span="8">
							说明
						</uni-col>
						<uni-col :span="16">
							{{item.comment?item.comment:'暂无'}}
						</uni-col>
						<uni-col :span="8">
							记录人
						</uni-col>
						<uni-col :span="16">
							{{item.create_user_name?item.create_user_name:'暂无'}}
						</uni-col>
					</uni-row>
				</view>
			</uni-list-item>
		</uni-list>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				item_txt: '',
				pageArray: [],
				pageIndex: 1,
				total_page: 0,
				total_count: 0,
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
				startTime: '',
				endTime: '',
				dateEndTime: '',
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			this.item_txt = this.itemData.item_txt
			uni.setNavigationBarTitle({
				title: this.itemData.item_txt + '详情'
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			let end_month = this.moment().format('YYYY-MM')
			let start_month = this.moment().subtract(5, 'M').format('YYYY-MM');
			this.startTime = start_month;
			this.endTime = end_month;
			this.dateEndTime = end_month;
			this.getPageList();
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.getPageList();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getPageList();
		},
		methods: {
			getDate(sureDtae) {
				if (sureDtae != this.startTime) {
					let end_month = this.moment(sureDtae).add(5, 'M').format('YYYY-MM');
					this.startTime = sureDtae;
					this.endTime = end_month;
					this.loadMoreText = "加载中..."
					this.flagRef = 0;
					this.pageIndex = 1;
					this.getPageList();
				}
			},
			getPageList() {
				let user_code = this.personInfo.user_code;
				if (this.personInfo.type_code == 'YHLX0004') {
					user_code = this.personInfo.stu_code;
				}
				let comData = {
					stu_code: user_code,
					begintime: this.startTime,
					endtime: this.endTime,
					page_size: '10', //每页记录数,
					page_number: this.pageIndex, //当前页数
					attendance_type: this.itemData.attendance_type,
					item_code: this.itemData.item_code,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				//分页查询考勤项目详情
				this.post(this.globaData.PARENTS_ATTENDANCE + 'attendance/pageAttendanceDetail', comData, (data0,
					data) => {
					if (data.code == 0) {
						this.hideLoading();
						this.pageIndex++;
						this.total_page = data.data.total_page;
						this.total_count = data.data.total_row;
						if (this.flagRef == 0) {
							this.pageArray = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.pageArray = this.pageArray.concat(data.data.list);
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
	::v-deep .uni-list-item__container {
		padding: 0px 0px !important;
		padding-left: 0px !important;
	}

	.uni-col {
		height: 30px;
	}
</style>
