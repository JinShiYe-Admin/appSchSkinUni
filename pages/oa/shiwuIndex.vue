<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="rightIcon" :iconClick="iconClick">
		</mynavBar>
		<view class="tabs-fixed">
			<my-segmented-control ref='segmCon' :current="semFlag" :values="navItem.childList" @clickItem="clickSeg"
				styleType="text" activeColor="#00CFBD"></my-segmented-control>
		</view>
		<view class="content" style="margin-top: 40px;">
			<view v-show="semFlag == 0">
				<uni-list>
					<uni-list-item showArrow v-for="(model,index) in semFlag0Data.dataList" :key='index'
						direction='column' clickable @click="clickItem(model)">
						<view slot="body">
							<view style="float: left;height: 40px;">
								<image class="peopleImg"
									:src="model.SendManPic?model.SendManPic:'http://www.108800.com/user.jpg'"></image>
							</view>
							<view class="rightView">
								<a class="biaoti0 title">{{model.NoticeTitle}}</a>
								<uni-row class="nameTime">
									<uni-col :span="12">
										<view style="font-size: 12px;">{{model.SendManName}}</view>
									</uni-col>
									<uni-col :span="12">
										<view style="font-size: 12px;">{{model.SendTime}}</view>
									</uni-col>
								</uni-row>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
				<view class="uni-loadmore" v-if="semFlag0Data.showLoadMore">{{semFlag0Data.loadMoreText}}</view>
			</view>
			<view v-show="semFlag == 1">
				<uni-list>
					<uni-list-item showArrow v-for="(model,index) in semFlag1Data.dataList" :key='index'
						direction='column' clickable @click="clickItem(model)">
						<view slot="body">
							<view style="float: left;height: 40px;">
								<image class="peopleImg"
									:src="model.SendManPic?model.SendManPic:'http://www.108800.com/user.jpg'"></image>
							</view>
							<view class="rightView">
								<a class="biaoti0 title">{{model.NoticeTitle}}</a>
								<uni-row class="nameTime">
									<uni-col :span="12">
										<view style="font-size: 12px;">{{model.SendManName}}</view>
									</uni-col>
									<uni-col :span="12">
										<view style="font-size: 12px;">{{model.SendTime}}</view>
									</uni-col>
								</uni-row>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
				<view class="uni-loadmore" v-if="semFlag1Data.showLoadMore">{{semFlag1Data.loadMoreText}}</view>
			</view>
			<view v-show="semFlag == 2">
				<uni-list>
					<uni-list-item showArrow v-for="(model,index) in semFlag2Data.dataList" :key='index'
						direction='column' clickable @click="clickItem(model)">
						<view slot="body">
							<view style="float: left;height: 40px;">
								<image class="peopleImg"
									:src="model.SendManPic?model.SendManPic:'http://www.108800.com/user.jpg'"></image>
							</view>
							<view class="rightView">
								<a class="biaoti0 title">{{model.NoticeTitle}}</a>
								<uni-row class="nameTime">
									<uni-col :span="12">
										<view style="font-size: 12px;">{{model.SendManName}}</view>
									</uni-col>
									<uni-col :span="12">
										<view style="font-size: 12px;">{{model.SendTime}}</view>
									</uni-col>
								</uni-row>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
				<view class="uni-loadmore" v-if="semFlag2Data.showLoadMore">{{semFlag2Data.loadMoreText}}</view>
			</view>
			<view v-show="semFlag == 3">
				<uni-list>
					<uni-list-item showArrow v-for="(model,index) in semFlag3Data.dataList" :key='index'
						direction='column' clickable @click="clickItem(model)">
						<view slot="body">
							<view style="float: left;height: 40px;">
								<image class="peopleImg"
									:src="model.SendManPic?model.SendManPic:'http://www.108800.com/user.jpg'"></image>
							</view>
							<view class="rightView">
								<a class="tempCss">[{{model.NoticeStatusName}}]</a><a
									class="biaoti title">{{model.NoticeTitle}}</a>
								<uni-row class="nameTime">
									<uni-col :span="12">
										<view style="font-size: 12px;">{{model.SendManName}}</view>
									</uni-col>
									<uni-col :span="12">
										<view style="font-size: 12px;">{{model.SendTime}}</view>
									</uni-col>
								</uni-row>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
				<view class="uni-loadmore" v-if="semFlag3Data.showLoadMore">{{semFlag3Data.loadMoreText}}</view>
			</view>
		</view>
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
				pageSize: 20,
				semFlag: 0, //点击的seg索引
				semFlag0Data: { //考勤记录
					flagRef: 0, //0刷新1加载更多
					pageIndex: 1,
					total_page: 0, //总页数
					loadMoreText: "加载中...",
					showLoadMore: false,
					dataList: []
				},
				semFlag1Data: { //请假统计
					flagRef: 0, //0刷新1加载更多
					pageIndex: 1,
					total_page: 0, //总页数
					loadMoreText: "加载中...",
					showLoadMore: false,
					dataList: []
				},
				semFlag2Data: {
					flagRef: 0, //0刷新1加载更多
					pageIndex: 1,
					total_page: 0, //总页数
					loadMoreText: "加载中...",
					showLoadMore: false,
					dataList: []
				},
				semFlag3Data: {
					flagRef: 0, //0刷新1加载更多
					pageIndex: 1,
					total_page: 0, //总页数
					loadMoreText: "加载中...",
					showLoadMore: false,
					dataList: []
				}
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			// console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.index = 100;
			for (var i = 0; i < this.navItem.childList.length; i++) {
				var tempM = this.navItem.childList[i];
				tempM.noReadCut = 0;
			}
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
			//获取考勤记录
			this.getPageList();
			// 获取未读数
			this.getUnReadCntFun();
			// 获取权限
			this.getPermissionByPosition('add', this.navItem.access.split('#')[1], result => {
				console.log('result:' + JSON.stringify(result));
				if (result[0]) {
					this.rightIcon = 'plusempty';
				}
			})

			uni.$on('clickLeft', (data) => {
				_this.getUnReadCntFun();
				let eventChannel = this.getOpenerEventChannel();
				eventChannel.emit('oaRefreshUnread', {});
			})
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
			if (this.semFlag == 0) {
				this.semFlag0Data.flagRef = 1;
				if (this.semFlag0Data.total_page < this.semFlag0Data.pageIndex) {
					this.semFlag0Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.semFlag0Data.showLoadMore = true;
				setTimeout(() => {
					this.getPageList();
				}, 300);
			} else if (this.semFlag == 1) {
				this.semFlag1Data.flagRef = 1;
				if (this.semFlag1Data.total_page < this.semFlag1Data.pageIndex) {
					this.semFlag1Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.semFlag1Data.showLoadMore = true;
				setTimeout(() => {
					this.getPageList();
				}, 300);
			} else if (this.semFlag == 2) {
				this.semFlag2Data.flagRef = 1;
				if (this.semFlag2Data.total_page < this.semFlag2Data.pageIndex) {
					this.semFlag2Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.semFlag2Data.showLoadMore = true;
				setTimeout(() => {
					this.getPageList();
				}, 300);
			} else if (this.semFlag == 3) {
				this.semFlag3Data.flagRef = 1;
				if (this.semFlag3Data.total_page < this.semFlag3Data.pageIndex) {
					this.semFlag3Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.semFlag3Data.showLoadMore = true;
				setTimeout(() => {
					this.getPageList();
				}, 300);
			}
		},
		onPullDownRefresh() {
			if (this.semFlag == 0) {
				this.semFlag0Data.loadMoreText = "加载中..."
				this.semFlag0Data.flagRef = 0;
				this.semFlag0Data.pageIndex = 1;
				this.getPageList();
			} else if (this.semFlag == 1) {
				this.semFlag1Data.loadMoreText = "加载中..."
				this.semFlag1Data.flagRef = 0;
				this.semFlag1Data.pageIndex = 1;
				this.getPageList();
			} else if (this.semFlag == 2) {
				this.semFlag2Data.loadMoreText = "加载中..."
				this.semFlag2Data.flagRef = 0;
				this.semFlag2Data.pageIndex = 1;
				this.getPageList();
			} else if (this.semFlag == 3) {
				this.semFlag3Data.loadMoreText = "加载中..."
				this.semFlag3Data.flagRef = 0;
				this.semFlag3Data.pageIndex = 1;
				this.getPageList();
			}
		},
		methods: {
			// 获取未读数
			getUnReadCntFun() {
				for (var a = 0; a < this.navItem.childList.length; a++) {
					var tempM0 = this.navItem.childList[a];
					if (tempM0.redspot_url != null && tempM0.redspot_url.length > 0) {
						// 获取未读数
						util.getUnReadCut(tempM0.access, tempM0.redspot_url, data => {
							for (var b = 0; b < this.navItem.childList.length; b++) {
								var tempM1 = this.navItem.childList[b];
								if (tempM1.access == data[0].access) {
									tempM1.noReadCut = data[0].dotnum;
									_this.$refs.segmCon.upLoadUnReadCut(b, tempM1);
								}
							}
						});
					}
				}
			},
			iconClick() {
				console.log('iconClick');
				util.openwithData("/pages/oa/shiwuNew", _this.navItem, {
					refreshShiWuIndex() { //子页面调用父页面需要的方法
						if (_this.semFlag == 3) {
							_this.semFlag3Data.flagRef = 0;
							_this.semFlag3Data.pageIndex = 1;
							_this.getPageList();
						}
					}
				});
			},
			clickItem: function(model) {
				console.log('clickItem.model:' + JSON.stringify(model));
				if (this.semFlag == 3) {
					model.flag = 1;
					model.access = this.navItem.access;
					if (model.NoticeStatus == 1) {
						util.openwithData("/pages/oa/shiwuDetailAddUser", model);
					} else if (model.NoticeStatus == 2 || model.NoticeStatus == 3) {
						util.openwithData("/pages/oa/shiwuDetail", model);
					}
				} else {
					model.flag = 0;
					model.access = this.navItem.access;
					util.openwithData("/pages/oa/shiwuDetail", model);
				}
			},
			clickSeg: function(e) {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					console.log('this.semFlag:' + e.currentIndex);
					if (this.semFlag == 0) {
						if (this.semFlag0Data.total_page == 0) {
							this.getPageList();
						}
					} else if (this.semFlag == 1) {
						if (this.semFlag1Data.total_page == 0) {
							this.getPageList();
						}
					} else if (this.semFlag == 2) {
						if (this.semFlag2Data.total_page == 0) {
							this.getPageList();
						}
					} else if (this.semFlag == 3) {
						if (this.semFlag3Data.total_page == 0) {
							this.getPageList();
						}
					}
				}
			},
			//获取考勤记录
			getPageList() {
				var url = '';
				var comData = {
					schoolId: this.personInfo.unit_code, //学校ID
					title: '', //标题
					tag: '', //标签
					haveNew: '0', //是否有新提示,0全部1有新提示的
					sendMan: '', //发布人姓名
					progress: '0', //进程,0 全部1 新建2 阅读中3 阅毕
					beginTime: '20170101', //查询开始时间
					endTime: '30180127', //查询结束时间
					page_size: this.pageSize, //每页记录数
					index_code: this.navItem.access.split('#')[1],
					op_code: 'index',
				}
				if (this.semFlag == 3) {
					comData.sendManId = this.personInfo.user_code; //发送人ID
					comData.status = '0'; //0 全部1 发出2 撤回
					comData.page_number = this.semFlag3Data.pageIndex; //当前页数
					url = this.globaData.INTERFACE_OA + 'cooperateNotice/getSendNotice';
				} else {
					comData.receiveManId = this.personInfo.user_code; //接收人ID
					url = this.globaData.INTERFACE_OA + 'cooperateNotice/getReceiveNotice';
				}
				if (this.semFlag == 0) {
					comData.status = '2'; //状态,1未结束 2未处理 3已结束
					comData.page_number = this.semFlag0Data.pageIndex; //当前页数
				} else if (this.semFlag == 1) {
					comData.status = '1'; //状态,1未结束 2未处理 3已结束
					comData.page_number = this.semFlag1Data.pageIndex; //当前页数
				} else if (this.semFlag == 2) {
					comData.status = '3'; //状态,1未结束 2未处理 3已结束
					comData.page_number = this.semFlag2Data.pageIndex; //当前页数
				}
				this.showLoading();
				this.post(url, comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (this.semFlag == 0) {
							for (var i = 0; i < data.data.list.length; i++) {
								var tempM = data.data.list[i];
								if (tempM.NoticeStatus == 1) {
									tempM.DoneStatusName = '已读';
								} else {
									tempM.DoneStatusName = '未读';
								}
							}
							this.semFlag0Data.pageIndex++;
							this.semFlag0Data.total_page = data.data.total_page;
							if (this.semFlag0Data.flagRef == 0) {
								if (data.data.list.length == 0) {
									this.showToast('暂无数据');
								}
								this.semFlag0Data.dataList = [].concat(data.data.list);
								uni.stopPullDownRefresh();
							} else {
								this.semFlag0Data.dataList = this.semFlag0Data.dataList.concat(data.data.list);
							}
						} else if (this.semFlag == 1) {
							this.semFlag1Data.pageIndex++;
							this.semFlag1Data.total_page = data.data.total_page;
							if (this.semFlag1Data.flagRef == 0) {
								if (data.data.list.length == 0) {
									this.showToast('暂无数据');
								}
								this.semFlag1Data.dataList = [].concat(data.data.list);
								uni.stopPullDownRefresh();
							} else {
								this.semFlag1Data.dataList = this.semFlag1Data.dataList.concat(data.data.list);
							}
						} else if (this.semFlag == 2) {
							this.semFlag2Data.pageIndex++;
							this.semFlag2Data.total_page = data.data.total_page;
							if (this.semFlag2Data.flagRef == 0) {
								if (data.data.list.length == 0) {
									this.showToast('暂无数据');
								}
								this.semFlag2Data.dataList = [].concat(data.data.list);
								uni.stopPullDownRefresh();
							} else {
								this.semFlag2Data.dataList = this.semFlag2Data.dataList.concat(data.data.list);
							}
						} else if (this.semFlag == 3) {
							for (var i = 0; i < data.data.list.length; i++) {
								var tempM = data.data.list[i];
								if (tempM.NoticeStatus == 1) {
									tempM.NoticeStatusName = '发出';
								} else if (tempM.NoticeStatus == 2) {
									tempM.NoticeStatusName = '撤回';
								} else if (tempM.NoticeStatus == 3) {
									tempM.NoticeStatusName = '结束';
								}
							}
							this.semFlag3Data.pageIndex++;
							this.semFlag3Data.total_page = data.data.total_page;
							if (this.semFlag3Data.flagRef == 0) {
								if (data.data.list.length == 0) {
									this.showToast('暂无数据');
								}
								this.semFlag3Data.dataList = [].concat(data.data.list);
								uni.stopPullDownRefresh();
							} else {
								this.semFlag3Data.dataList = this.semFlag3Data.dataList.concat(data.data.list);
							}
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
	.peopleImg {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 50px);
	}

	.biaoti {
		font-size: 13px;
		width: calc(100% - 50px);
	}

	.biaoti0 {
		font-size: 13px;
		width: calc(100%);
	}

	.title {
		height: 100%;
		float: left;
		font-size: 13px;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #000000;
	}

	.nameTime {
		font-size: 12px;
		color: gray;
	}

	.tempCss {
		font-size: 13px;
		float: left;
		color: gray;
	}

	.uni-col {
		margin-top: 0px;
	}
</style>
