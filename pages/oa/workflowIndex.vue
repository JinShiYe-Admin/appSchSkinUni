<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' :icon="rightIcon" :iconClick="iconClick">
		</mynavBar>
		<view class="tabs-fixed">
			<my-segmented-control ref='segmCon' :current="semFlag" :values="itemData.childList" @clickItem="clickSeg" styleType="text"
				activeColor="#00CFBD"></my-segmented-control>
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
								<a class="tempCss">[{{model.DoneStatusName}}]</a><a
									class="biaoti title">{{model.ApplyTitle}}</a>
								<uni-row class="nameTime">
									<uni-col :span="12">
										{{model.ApplyManName}}
									</uni-col>
									<uni-col :span="12">
										{{model.CreateTime}}
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
								<a class="biaoti0 title">{{model.ApplyTitle}}</a>
								<uni-row class="nameTime">
									<uni-col :span="12">
										{{model.ApplyManName}}
									</uni-col>
									<uni-col :span="12">
										{{model.CreateTime}}
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
								<a class="biaoti0 title">{{model.ApplyTitle}}</a>
								<uni-row class="nameTime">
									<uni-col :span="12">
										{{model.ApplyManName}}
									</uni-col>
									<uni-col :span="12">
										{{model.CreateTime}}
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
								<a class="biaoti title">{{model.ApplyTitle}}</a>
								<uni-row class="nameTime">
									<uni-col :span="12">
										{{model.ApplyManName}}
									</uni-col>
									<uni-col :span="12">
										{{model.CreateTime}}
									</uni-col>
								</uni-row>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
				<view class="uni-loadmore" v-if="semFlag3Data.showLoadMore">{{semFlag3Data.loadMoreText}}</view>
			</view>
			<view v-show="semFlag == 4">
				<uni-list>
					<uni-list-item showArrow v-for="(model,index) in semFlag4Data.dataList" :key='index'
						direction='column' clickable @click="clickItem(model)">
						<view slot="body">
							<view style="float: left;height: 40px;">
								<image class="peopleImg"
									:src="model.SendManPic?model.SendManPic:'http://www.108800.com/user.jpg'"></image>
							</view>
							<view class="rightView">
								<a class="tempCss">[{{model.NoticeStatusName}}]</a><a
									class="biaoti title">{{model.ApplyTitle}}</a>
								<uni-row class="nameTime">
									<uni-col :span="12">
										{{model.ApplyManName}}
									</uni-col>
									<uni-col :span="12">
										{{model.CreateTime}}
									</uni-col>
								</uni-row>
							</view>
						</view>
					</uni-list-item>
				</uni-list>
				<view class="uni-loadmore" v-if="semFlag4Data.showLoadMore">{{semFlag4Data.loadMoreText}}</view>
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
				itemData: {},
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
				},
				semFlag4Data: {
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
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.index = 100;
			for (var i = 0; i < this.itemData.childList.length; i++) {
				var tempM = this.itemData.childList[i];
				tempM.noReadCut = 0;
			}
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//获取考勤记录
			this.getPageList();
			// 获取未读数
			this.getUnReadCntFun();
			// 获取权限
			this.getPermissionByPosition('add', this.itemData.access.split('#')[1], result => {
				console.log('result:' + JSON.stringify(result));
				if (result[0]) {
					this.rightIcon = 'plusempty';
				}
			})
			
			uni.$on('clickLeft',(data) =>{
				let eventChannel = this.getOpenerEventChannel();
				eventChannel.emit('oaRefreshUnread', {});
			})
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
			}else if (this.semFlag == 4) {
				this.semFlag4Data.flagRef = 1;
				if (this.semFlag4Data.total_page < this.semFlag4Data.pageIndex) {
					this.semFlag4Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.semFlag4Data.showLoadMore = true;
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
			}else if (this.semFlag == 3) {
				this.semFlag4Data.loadMoreText = "加载中..."
				this.semFlag4Data.flagRef = 0;
				this.semFlag4Data.pageIndex = 1;
				this.getPageList();
			}
		},
		methods: {
			// 获取未读数
			getUnReadCntFun() {
				for (var a = 0; a < this.itemData.childList.length; a++) {
					var tempM0 = this.itemData.childList[a];
					if (tempM0.redspot_url != null && tempM0.redspot_url.length > 0) {
						// 获取未读数
						util.getUnReadCut(tempM0.access, tempM0.redspot_url, data => {
							for (var b = 0; b < this.itemData.childList.length; b++) {
								var tempM1 = this.itemData.childList[b];
								if (tempM1.access == data[0].access) {
									tempM1.noReadCut = data[0].dotnum;
									this.$refs.segmCon.upLoadUnReadCut(b,tempM1);
								}
							}
						});
					}
				}
			},
			iconClick() {
				console.log('iconClick');
				util.openwithData("/pages/oa/workflowNew", this.itemData,{
					refreshWorkflowIndex() { //子页面调用父页面需要的方法
						if (_this.semFlag == 4) {
							_this.semFlag4Data.flagRef = 0;
							_this.semFlag4Data.pageIndex = 1;
							_this.getPageList();
						}
					}
				});
			},
			clickItem: function(model) {
				console.log('clickItem.model:' + JSON.stringify(model));
				if (this.semFlag == 4) {
					model.flag = 1;
				} else {
					model.flag = 0;
				}
				model.access = this.itemData.access;
				util.openwithData("/pages/oa/workflowDetail", model);
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
					}else if (this.semFlag == 4) {
						if (this.semFlag4Data.total_page == 0) {
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
					applyMan: '', //发布人姓名
					progress: '0', //进程,0 全部1 新建2 阅读中3 阅毕
					beginTime: '20170101', //查询开始时间
					endTime: '30180127', //查询结束时间
					page_size: this.pageSize, //每页记录数
					index_code: this.itemData.access.split('#')[1],
					op_code: 'index'
				}
				if (this.semFlag == 4) {
					comData.applyManId = this.personInfo.user_code; //发送人ID
					comData.status = '0'; //状态,0 全部1 发出2 撤回3 被退
					comData.page_number = this.semFlag4Data.pageIndex; //当前页数
					url = this.globaData.INTERFACE_OA + 'approve/getAffairApply';
				} else {
					comData.approveManId = this.personInfo.user_code; //接收人ID
					url = this.globaData.INTERFACE_OA + 'approve/getAffairApprove';
				}
				if (this.semFlag == 0) {
					comData.status = '0'; //状态,0 全部1 预览2 待批3 已批
					comData.page_number = this.semFlag0Data.pageIndex; //当前页数
				} else if (this.semFlag == 1) {
					comData.status = '1'; //状态,0 全部1 预览2 待批3 已批
					comData.page_number = this.semFlag1Data.pageIndex; //当前页数
				} else if (this.semFlag == 2) {
					comData.status = '2'; //状态,0 全部1 预览2 待批3 已批
					comData.page_number = this.semFlag2Data.pageIndex; //当前页数
				}else if (this.semFlag == 3) {
					comData.status = '3'; //状态,0 全部1 预览2 待批3 已批
					comData.page_number = this.semFlag3Data.pageIndex; //当前页数
				}
				
				// if (datasource.sliderFlag == 0) {
				// 	comData0.status = '0'; //状态,0 全部1 预览2 待批3 已批
				// 	comData0.page_number = datasource.receive0.pageIndex; //当前页数
				// } else if (datasource.sliderFlag == 1) {
				// 	comData0.status = '2'; //状态,0 全部1 预览2 待批3 已批
				// 	comData0.page_number = datasource.receive1.pageIndex; //当前页数
				// } else if (datasource.sliderFlag == 2) {
				// 	comData0.status = '3'; //状态,0 全部1 预览2 待批3 已批
				// 	comData0.page_number = datasource.receive2.pageIndex; //当前页数
				// } else if (datasource.sliderFlag == 3) {
				// 	comData0.status = '1'; //状态,0 全部1 预览2 待批3 已批
				// 	comData0.page_number = datasource.receive3.pageIndex; //当前页数
				// }
				this.showLoading();
				this.post(url, comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (this.semFlag == 0) {
							// for (var i = 0; i < data.data.list.length; i++) {
							// 	var tempM = data.data.list[i];
							// 	if (tempM.NoticeStatus == 1) {
							// 		tempM.DoneStatusName = '已读';
							// 	} else {
							// 		tempM.DoneStatusName = '未读';
							// 	}
							// }
							for (var i = 0; i < data.data.list.length; i++) {
								var tempM = data.data.list[i];
								console.log('tempM.ApproveStatus:' + tempM.ApproveStatus);
								if (tempM.ApproveStatus == 1) {
									tempM.DoneStatusName = '预览';
								}
								if (tempM.ApproveStatus == 2) {
									tempM.DoneStatusName = '待批';
								} else if (tempM.ApproveStatus == 3) {
									tempM.DoneStatusName = '已批';
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
						} else if (this.semFlag == 4) {
							for (var i = 0; i < data.data.list.length; i++) {
								var tempM = data.data.list[i];
								if (tempM.ApplyStatus == 1) {
									tempM.NoticeStatusName = '发出';
								} else if (tempM.ApplyStatus == 2) {
									tempM.NoticeStatusName = '撤销';
								} else if (tempM.ApplyStatus == 3) {
									tempM.NoticeStatusName = '被退';
								}
							}
							this.semFlag4Data.pageIndex++;
							this.semFlag4Data.total_page = data.data.total_page;
							if (this.semFlag4Data.flagRef == 0) {
								if (data.data.list.length == 0) {
									this.showToast('暂无数据');
								}
								this.semFlag4Data.dataList = [].concat(data.data.list);
								uni.stopPullDownRefresh();
							} else {
								this.semFlag4Data.dataList = this.semFlag4Data.dataList.concat(data.data.list);
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
