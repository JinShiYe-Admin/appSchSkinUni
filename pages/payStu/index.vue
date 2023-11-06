<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="">
			<view class="example-body">
				<!-- <view v-for="(model,index) in pageArray" :key='index'> -->
				<view @click="clickItem()">
					<uni-card isShadow>
						<view class="title-text">
							<view v-if="flagRef == 0" class='otherIndex'>去缴费</view>
							<view v-else class='otherIndex otherIndex1'>已缴费</view>
							<span style='margin-left: 5px;'>2022-2023学年下学期课后服务缴费</span>
						</view>
						<view style="font-size: 12px;color: #333333;margin-top: 5px;text-align: center;">应缴金额（元）</view>
						<view style="font-size: 36px;color: #333333;margin-top: 5px;text-align: center;">1833.00</view>
					</uni-card>
				</view>
				<view style="height: 5px;"></view>
			</view>
		</view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				pageArray: [],
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
		methods: {
			clickItem(model) {
				// model.index_code = _this.index_code;
				// util.openwithData('/pages/mixedAblStu/add', model, {
				// 	refreshMixedAblStuList(data) { //子页面调用父页面需要的方法
				// 		// _this.showLoading();
				// 		// _this.getList0();
				// 	}
				// });
				util.openwithData("/pages/payStu/payDetail", model);
			},
			getList0() {
				let comData = {
					stu_code: this.personInfo.stu_code, //
					index_code: this.index_code,
				}
				this.showLoading();
				// 列表查询报告填写记录
				this.post(this.globaData.INTERFACE_ZHSZ + 'stu/reportList', comData, (data0, data) => {
					this.hideLoading();
					this.pageIndex++;
					this.total_page = data.total_page;
					if (this.flagRef == 0) {
						if (data.list.length == 0) {
							this.showToast('暂无数据');
						}
						this.pageArray = [].concat(data.list);
						uni.stopPullDownRefresh();
					} else {
						this.pageArray = this.pageArray.concat(data.list);
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
				this.getPageList();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getPageList();
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			this.index_code = this.personInfo.personalCenter5Access;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.getList0();
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
	}
</script>

<style>
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	.card-line {
		height: 1px;
		background-color: #e5e5e5;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.cardPCls {
		width: 40px !important;
		height: 18px;
		background: #04D0BE;
		color: white;
		font-size: 12px;
		text-align: center;
		padding-top: 0px;
		margin-top: 3px;
		float: left;
	}

	.cardConent {
		font-size: 13px;
		word-break: break-all;
		/* overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap; */
		color: #787878;
	}

	.otherIndex {
		text-align: center;
		border: 1px solid #f59a23;
		color: #f59a23;
		border-radius: 5px;
		width: 70px;
		padding: 2px 5px;
		font-size: 13px;
	}
	
	.otherIndex1 {
		border: 1px solid #d7d7d7;
		color: #d7d7d7;
	}

	.title-text {
		display: flex;
		align-items: center;
		/* width: 80vw; */
		font-weight: 900;font-size: 16px;
		/* overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap; */
	}

	.leaveType {
		font-size: 12px;
		width: auto;
		color: #EFAD44;
		padding: 0px 3px;
		border-radius: 4px;
		margin-right: 3px;
		border: 1px solid #EFAD44;
	}
</style>
