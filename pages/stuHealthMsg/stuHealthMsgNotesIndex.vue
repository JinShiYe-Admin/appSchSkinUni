<template>
	<view>
		<scroll-view scroll-y="true" v-show="1>100" style="height: 350px;width: 150px;">
			<view>123</view>
		</scroll-view>
		<uni-list :border="false">
			<uni-list-item showArrow direction='column' clickable v-for="(model,index) in pageArray" :key='index'
				@click="clickItem(model)" :border="true" :style="{background:(index%2==0?'#EDFCE9':'white')}">
				<view slot="body" class="slot-box slot-text">
					<view class="rightView">
						<uni-row class="nameTime">
							<uni-col :span="12">
								<view style="font-size: 12px;">{{model.date}}健康上报</view>
							</uni-col>
							<uni-col :span="12">
								<view style="font-size: 12px;text-align: right;">{{model.create_time}}</view>
							</uni-col>
						</uni-row>
					</view>
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
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.text = '上报记录';
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
			//2.5.学生上报记录
			this.getPageList();
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
			clickItem(model) {
				model.access = this.itemData.index_code;
				console.log('clickItem:' + JSON.stringify(model));
				util.openwithData("/pages/stuHealthMsg/stuHealthMsgNotesDetail", model);
			},
			getPageList() {
				var comData = {
					stu_code: this.personInfo.stu_code, //
					page_number: this.pageIndex, //当前页数
					page_size: '20', //每页记录数
					index_code:  this.itemData.index_code
				}
				this.showLoading();
				//2.5.学生上报记录
				this.post(this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/stuReportLog', comData, (data) => {
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
			}
		}
	}
</script>

<style>

	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 0px);
	}

	.title {
		font-size: 13px;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.nameTime {
		margin-top: 5px;
		font-size: 12px;
		color: gray;
	}

	::v-deep .uni-list-item--hover {
		background-color: white;
	}
</style>
