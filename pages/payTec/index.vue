<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="">
			<view class="example-body">
				<view v-for="(model,index) in pageArray" :key='index'>
					<uni-card isShadow @click="clickItem(model)">
						<view class="title-text">
							<view style="float: left;height: 40px;width: 60px;margin-top: 10px;">
								<view v-if="model.status == 0">
									<view class='otherIndex'>未开始</view>
								</view>
								<view v-else-if="model.status == 1">
									<view class='otherIndex otherIndex1'>缴费中</view>
								</view>
								<view v-else>
									<view class='otherIndex otherIndex2'>已停止</view>
								</view>
							</view>
							<view class="rightView">
								<view>{{model.title}}</view>
							</view>
						</view>
					</uni-card>
				</view>
				<view style="height: 5px;"></view>
			</view>
		</view>
		<!-- <view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view> -->
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
				model.index_code = this.index_code;
				util.openwithData('/pages/payTec/payStat', model, {
					refreshPayStuIndex(data) { //子页面调用父页面需要的方法
						_this.getPageList();
					}
				});
			},
			getPageList() {
				let comData = {
					index_code: this.index_code,
				}
				this.showLoading();
				// 2.7. 教师缴费列表
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payDetail/tecTaskList', comData, (data0, data) => {
					this.hideLoading();
					this.pageIndex++;
					this.total_page = data.total_page;
					if (this.flagRef == 0) {
						if (data.data.list.length == 0) {
							this.showToast('暂无数据');
						}
						this.pageArray = [].concat(data.data.list);
						uni.stopPullDownRefresh();
					} else {
						this.pageArray = this.pageArray.concat(data.data.list);
					}
				});
			},
		},
		// onReachBottom() {
		// 	this.flagRef = 1;
		// 	if (this.total_page < this.pageIndex) {
		// 		this.loadMoreText = "没有更多数据了!"
		// 		return;
		// 	}
		// 	this.showLoadMore = true;
		// 	setTimeout(() => {
		// 		this.getPageList();
		// 	}, 300);
		// },
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
			this.navItem.text = '在线缴费';
			this.index_code = this.navItem.access.split("#")[1];
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.getPageList();
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
	.otherIndex {
		text-align: center;
		border: 1px solid #d7d7d7;
		color: #d7d7d7;
		border-radius: 5px;
		width: 60px !important;
		padding: 2px 5px;
		font-size: 13px;
	}

	.otherIndex1 {
		border: 1px solid #70b603;
		color: #70b603;
	}
	
	.otherIndex2 {
		border: 1px solid #f59a23;
		color: #f59a23;
	}
	
	.rightView {
		margin-left: 20px;
		float: left;
		width: calc(100% - 70px);
	}

	.title-text {
		display: flex;
		align-items: center;
		/* width: calc(100% - 70px); */
		font-weight: 900;
		font-size: 16px;
		/* overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap; */
	}
</style>