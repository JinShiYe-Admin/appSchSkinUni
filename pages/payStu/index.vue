<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="">
			<view class="example-body">
				<view v-for="(model,index) in pageArray" :key='index'>
					<uni-card v-if="model.status!=0" isShadow @click="clickItem(model)">
						<view class="title-text">
							<view style="float: left;height: 40px;width: 60px;margin-top: 10px;">
								<view v-if="model.status == 1">
									<view v-if="model.pay_status == 2" class='otherIndex otherIndex1'>已缴费</view>
									<view v-else-if="parseFloat(model.total_price) == 0" class='otherIndex otherIndex2'>免缴</view>
									<view v-else class='otherIndex'>未缴费</view>
								</view>
								<view v-else>
									<view v-if="model.pay_status == 2" class='otherIndex otherIndex1'>已缴费</view>
									<view v-else class='otherIndex otherIndex1'>已停止</view>
								</view>
							</view>
							<view class="rightView">
								<view>{{model.title}}</view>
							</view>
						</view>
						<view style="font-size: 12px;color: #333333;margin-top: 5px;text-align: center;">应缴金额（元）</view>
						<view style="font-size: 36px;color: #333333;margin-top: 5px;text-align: center;">
							{{model.total_price}}</view>
					</uni-card>
				</view>
				<view v-if="pageArray.length==0" style="text-align: center;margin-top: 50px;color: gray;font-size: 13px;">暂无数据</view>
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
				util.openwithData('/pages/payStu/payDetail', model, {
					refreshPayStuIndex(data) { //子页面调用父页面需要的方法
						_this.getPageList();
					}
				});
			},
			getPageList() {
				let comData = {
					index_code: this.index_code,
				}
				if (this.personInfo.type_code == 'YHLX0005') {//学生
					comData.stu_code = this.personInfo.stu_code; //学生代码
					comData.grd_code = this.personInfo.grd_code; //学生年级代码
					comData.cls_code = this.personInfo.cls_code; //学生班级代码
				} else{
					comData.par_code = this.personInfo.user_code; //家长代码
				}
				this.showLoading();
				// 缴费列表
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payDetail/stuPayList', comData, (data0, data) => {
					this.hideLoading();
					this.pageIndex++;
					this.total_page = data.total_page;
					var tempArray = []
					for (var i = 0; i < data.data.list.length; i++) {
						var tempM = data.data.list[i];
						if (tempM.status!=0) {
							tempArray.push(tempM)
						}
					}
					if (this.flagRef == 0) {
						if (tempArray.length == 0) {
							this.showToast('暂无数据');
						}
						this.pageArray = [].concat(tempArray);
						uni.stopPullDownRefresh();
					} else {
						this.pageArray = this.pageArray.concat(tempArray);
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
			this.index_code = this.personInfo.personalCenter5Access;
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
		border: 1px solid #f59a23;
		color: #f59a23;
		border-radius: 5px;
		width: 60px !important;
		padding: 2px 5px;
		font-size: 13px;
	}

	.otherIndex1 {
		border: 1px solid #d7d7d7;
		color: #d7d7d7;
	}
	
	.otherIndex2 {
		border: 1px solid #70b603;
		color: #70b603;
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