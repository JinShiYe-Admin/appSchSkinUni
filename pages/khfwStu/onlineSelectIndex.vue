<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<uni-card isShadow v-for="(item,index) in pagedata" :key="index" @click="clickItem(item)">
			<view class="itemStatus" :style="{color:item.status==0?'#333':'',background:item.status==0?'#d7d7d7':item.status==2?'#70b603':''}">{{item.status==0?'未开始':item.status==2?'已截止':'选课中'}}</view>
			<view class="cardTitle">{{item.name}}</view>
			<view class="selectTime">选课开始时间：{{item.start_time}}</view>
			<view class="selectTime">选课结束时间：{{item.end_time}}</view>
		</uni-card>
		<view style="height: 50px;background: #f2f2f2;"></view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
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
				pageSize: 15,
				pagedata: [],
				flagRef: 0, //0刷新1加载更多
				pageIndex: 1,
				total_page: 0, //总页数
				loadMoreText: "加载中...",
				showLoadMore: false,
				index_code: '',
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.index_code = this.navItem.access.split("#")[1];
			this.getList0();
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
			clickItem(model) {
				model.index_code = this.index_code;
				util.openwithData('/pages/khfwStu/onlineSelectDetail', model);
			},
			getList0() {
				let comData = {
					page_size: 10,
					page_number: this.pageIndex,
					index_code: this.index_code,
				}
				// 分页查询
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassOnline/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
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
	.itemStatus {
		font-size: 12px;
		color: #fff;
		background: #f59a23;
		width: 40px;
		padding: 5px 10px;
		border-radius: 8px;
		text-align: center;
	}

	.cardTitle {
		font-size: 16px;
		font-weight: 700;
		width: calc(100% - 60px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: -23px 0 0 65px;
	}

	.selectTime {
		font-size: 14px;
		margin: 20px 0 0 60px;
	}
</style>