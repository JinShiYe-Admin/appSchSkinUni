<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="rightIcon" :iconClick="iconClick">
		</mynavBar>
		<uni-card isShadow style="margin: 20px 5px 0;" @click="gotoDetail(item)" v-for="(item,index) in pagedata" :key="index">
			<view v-if="item.sub_code>0" class="itemSub">{{item.sub_name.slice(0,1)}}</view>
			<view style="font-size: 12px;" :style="item.sub_code>0?'margin: -23px 0 0 55px;':''">{{item.grd_name}} {{item.cls_name}}</view>
			<!-- <view v-if="item.type>0" style="text-align: right;margin-top: -20px;">
				<image class="biaoyImg"
					:src="item.type==1?'/static/images/mixedAbl/biaoyang1.jpg':'/static/images/mixedAbl/piping1.jpg'">
				</image>
				<span style="margin: 0 3px 0 3px;"> x </span>
				<span class="countCss">{{item.v}}</span>
			</view> -->
			<view v-if="item.type>0" style="text-align: right;margin-top: -30px;">
				<view style="margin-top: 10px;margin-right: 30px;">
					<image class="biaoyImg"
						:src="item.type==1?'/static/images/mixedAbl/biaoyang1.jpg':'/static/images/mixedAbl/piping1.jpg'">
					</image>
				</view>
				<view style="margin-top: -28px;">
					<span style="margin: 0 3px 0 3px;"> x </span>
					<span class="countCss">{{item.v}}</span>
				</view>
			</view>
			<view class="rowStyle" style="font-weight: 700;margin-top: 10px;">{{item.stuStr}}</view>
			<view class="rowStyle" style="font-size: 12px;">{{item.comment}}</view>
			<view style="font-size: 12px;text-align: right;">{{item.create_time}}</view>
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
				rightIcon: '', //add按钮权限
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
			// 获取权限
			this.getPermissionByPosition('add', this.navItem.access.split('#')[1], result => {
				if (result[0]) {
					this.rightIcon = 'plusempty';
				}
			})
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
				util.openwithData('/pages/mixedAblTea/stuEvaluateAdd', {
					index_code: _this.navItem.access.split("#")[1],
				}, {
					refreshstuEvaluate(data) { //子页面调用父页面需要的方法
						_this.loadMoreText = "加载中..."
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.getList0();
					}
				})
			},
			gotoDetail(model) {
				model.index_code = _this.navItem.access.split("#")[1];
				util.openwithData('/pages/mixedAblTea/stuEvaluateDetail', model, {
					refreshstuEvaluate(data) { //子页面调用父页面需要的方法
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
					user_code: this.personInfo.user_code,
					index_code: this.navItem.access.split("#")[1],
				}
				// 1.1.用户创建评价分页
				this.post(this.globaData.INTERFACE_ZHSZM + 'stuComment/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							var tempArr = [];
							for (var a = 0; a < tempM.stus.length; a++) {
								tempArr.push(tempM.stus[a].stu_name);
							}
							tempM.stuStr = tempArr.join('、')
						}
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
			}
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
	.biaoyImg {
		width: 20px;
		height: 20px;
	}

	.rowStyle {
		font-size: 14px;
		height: 25px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.countCss {
		font-size: 18px;
		color: #d9001b;
		font-weight: 700;
		margin-left: 5px;
	}
	
	.itemSub{
		font-size: 12px;
		background: #00cfbd;
		color: white;
		border-radius: 5px 0 8px 0;
		width: 35px;
		height: 25px;
		margin: -11px 0 0 -11px;
		padding: 7px 0 0 20px;
	}
</style>