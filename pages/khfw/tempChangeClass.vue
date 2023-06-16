<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' icon="plusempty" :iconClick="iconClick">
		</mynavBar>
		<uni-card isShadow style="margin: 20px 5px 0;" v-for="(item,index) in pagedata" :key="index">
			<view style="font-size: 14px;font-weight: 700;">{{item.name}}</view>
			<view v-for="(model,ind) in item.time_list" :key="ind" style="font-size: 14px;margin-top: 8px;">
				<view style="border: 1px solid #333333;border-radius: 50%;height: 20px;width: 20px;text-align: center;">
					{{++ind}}</view>
				<view style="margin: -20px 0 0 30px;">{{model.start_time.split(' ')[0]}}课程 {{model.type_name}}
					{{model.type==1?model.end_time.split(' ')[0]:''}}</view>
			</view>
			<view style="text-align: right;font-size: 12px;color: #797979;margin-top: 10px;">{{item.create_time}}</view>
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
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
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
			iconClick() {
				util.openwithData('/pages/khfw/tempChangeClassAdd', {
					index_code: _this.navItem.access.split("#")[1],
				}, {
					refreshtempChangeClass(data) { //子页面调用父页面需要的方法
						_this.loadMoreText = "加载中..."
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.getList0();
					}
				})
			},
			getList0() {
				let comData = {
					page_size: 10,
					page_number: this.pageIndex,
					index_code: this.navItem.access.split("#")[1],
				}
				this.showLoading();
				// 5.1.临时调课列表
				this.post(this.globaData.INTERFACE_KHFW + 'tempChangeCourse/page', comData, (data0, data) => {
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
	.card-line {
		text-align: center;
		font-size: 24px;
		color: #d9001b;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid #aaaaaa;
		width: 100px;
		margin-left: calc((100% - 100px)/2);
	}

	.rowStyle {
		font-size: 14px;
		height: 30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>