<template>
	<view>
		<view class="">
			<view style="margin: 0px 0 0 20px;color: #00CFBD;">
				<dy-Date :childValue='startTime' timeType="month" :dateMore="' ~ '+endTime" v-on:getData='getDate'
					minSelect='2020-01' :maxSelect='dateEndTime'></dy-Date>
			</view>
			<view style="padding: 0 15px;margin-top: 10px;text-align: center;font-size: 14px;">
				<span>出入校次数：</span><span style="color: #FF3333;font-size: 18px;">{{total_count}}</span>
			</view>
			<view style="height: 25px;background-color: #F3EDDB;margin-top:15px;padding: 5px 0 0 10px;">
				 <p style="color: #505050;font-size: 12px;">出入校详情</p>
			</view>
		</view>
		<uni-list style="">
			<uni-list-item v-for="(item,index) in pageArray" :key='index' direction='column'>
				<view slot="body">
					<uni-row style="padding: 10px 20px 0;color: #505050;font-size: 14px;">
						<uni-col :span="2">
							{{++index}}
						</uni-col>
						<uni-col :span="12">
							{{item.card_time}}
						</uni-col>
						<uni-col :span="7" class='location'>
							{{item.attendance_location}}
						</uni-col>
						<uni-col :span="3">
							<template v-if="item.card_dir_txt && item.card_dir_txt.indexOf('出')!==-1">
								<view><p style="margin: 0 auto;width: 40px;padding: 2px;background-color: #FF9900;color: #FFFFFF;border-radius: 7px;font-size: 12px;text-align: center;margin-left: 5px;">{{item.card_dir_txt}}</p></view>
							</template>
							<template v-else>
								<view><p style="margin: 0 auto;width: 40px;padding: 2px;background-color: #3ACA3A;color: #FFFFFF;border-radius: 7px;font-size: 12px;text-align: center;margin-left: 5px;">{{item.card_dir_txt}}</p></view>
							</template>
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
			uni.setNavigationBarTitle({
				title: '出入校详情'
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
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
						//#ifndef APP-PLUS
							document.title=""
						//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
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
					page_size: '20', //每页记录数,
					page_number: this.pageIndex, //当前页数
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				//分页查询考勤项目详情
				this.post(this.globaData.PARENTS_ATTENDANCE + 'attendance/pageInOutDetail', comData, (data0,
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
	.location{
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
