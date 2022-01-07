<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo'>
		</mynavBar>
		<view class="tabs-fixed">
			<my-segmented-control ref='segmCon' :current="semFlag" :values="itemData.childList" @clickItem="clickSeg"
				styleType="text" activeColor="#00CFBD"></my-segmented-control>
		</view>
		<view class="content" style="margin-top: 40px;">
			<view v-show="semFlag == 0">
				<view class="example-body">
					<view v-for="(model,index) in semFlag0Data.dataList" :key='index'>
						<uni-card isShadow>
							<text class="content-box-text">
								<view class="card-title">{{model.name}}</view>
								<view class="card-line"></view>
								<uni-row class="nameTime">
									<uni-col :span="16" style="font-size: 14px;">
										<view class="nameTime">科目：<span class='nameContent'>{{model.sub_name}}</span>
										</view>
										<view class="nameTime">截止时间：<span class='nameContent'>{{model.deadline}}</span>
										</view>
										<view class="nameTime">年级：<span class='nameContent'>{{model.grd_name}}</span>
										</view>
										<view class="nameTime">班级：<span class='nameContent'>{{model.cls_names}}</span>
										</view>
										<view class="nameTime">学生人数：<span class='nameContent'>{{model.stu_count}}</span>
										</view>
									</uni-col>
									<uni-col :span="8" style="text-align: right;">
										<view class="scoreOrderBorder" style="color: #00CFBD;">
											<view class="scoreOrder" style="color: #00CFBD;">{{model.submit_num}}</view>
											<view class="scoreOrder"
												style="margin-top: 0px;color: gray;font-size: 10px;">已识别</view>
										</view>
										<view class="scoreOrderBorder" style="color: #FAA666;">
											<view class="scoreOrder" style="color: #FAA666;">{{model.no_submit_num}}
											</view>
											<view class="scoreOrder"
												style="margin-top: 0px;color: gray;font-size: 10px;">未识别</view>
										</view>
									</uni-col>
								</uni-row>
								<uni-row style='margin-top: 10px;'>
									<uni-col :span="11" style="text-align: center;">
										<button class="mini-btn" type="default" size="mini">开始修改</button>
									</uni-col>
									<uni-col :span="11" style="text-align: center;">
										<button class="mini-btn" type="default" size="mini">取消本次任务</button>
									</uni-col>
								</uni-row>
							</text>
						</uni-card>
					</view>
				</view>
				<view class="uni-loadmore" v-if="semFlag0Data.showLoadMore">{{semFlag0Data.loadMoreText}}</view>
			</view>
			<view v-show="semFlag == 1">
				<view class="example-body">
					<view v-for="(model,index) in semFlag1Data.dataList" :key='index'>
						<uni-card isShadow>
							<text class="content-box-text">
								<view class="card-title">{{model.name}}</view>
								<view class="card-line"></view>
								<uni-row class="nameTime">
									<uni-col :span="16" style="font-size: 14px;">
										<view class="nameTime">科目：<span class='nameContent'>{{model.sub_name}}</span>
										</view>
										<view class="nameTime">截止时间：<span class='nameContent'>{{model.deadline}}</span>
										</view>
										<view class="nameTime">年级：<span class='nameContent'>{{model.grd_name}}</span>
										</view>
										<view class="nameTime">班级：<span class='nameContent'>{{model.cls_names}}</span>
										</view>
									</uni-col>
									<uni-col :span="8">
										<view class="charts-box" style="width: 100px;height: 100px;text-align: center;">
											<qiun-data-charts type="arcbar" :opts="model.zhishidianShow" :animation="false"
												:chartData="model.zhishidianDFL" />
										</view>
									</uni-col>
								</uni-row>
							</text>
						</uni-card>
					</view>
				</view>
				<view class="uni-loadmore" v-if="semFlag1Data.showLoadMore">{{semFlag1Data.loadMoreText}}</view>
			</view>
			<view v-show="semFlag == 2">
				<view class="example-body">
					<view v-for="(model,index) in semFlag2Data.dataList" :key='index'>
						<uni-card isShadow>
							<text class="content-box-text">
								<view class="card-title">{{model.name}}</view>
								<view class="card-line"></view>
								<uni-row class="nameTime">
									<uni-col :span="24" style="font-size: 14px;">
										<view class="nameTime">科目：<span class='nameContent'>{{model.sub_name}}</span>
										</view>
										<view class="nameTime">截止时间：<span class='nameContent'>{{model.deadline}}</span>
										</view>
										<view class="nameTime">年级：<span class='nameContent'>{{model.grd_name}}</span>
										</view>
										<view class="nameTime">班级：<span class='nameContent'>{{model.cls_names}}</span>
										</view>
									</uni-col>
								</uni-row>
							</text>
						</uni-card>
					</view>
				</view>
				<view class="uni-loadmore" v-if="semFlag2Data.showLoadMore">{{semFlag2Data.loadMoreText}}</view>
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
				pageSize: 10,
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
			let tempM = util.getPageData(option);
			tempM.index = 100;
			tempM.childList = [{
				name: '识别统计'
			}, {
				name: '待批改'
			}, {
				name: '已批改'
			}];
			this.itemData = tempM;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//获取考勤记录
			this.getPageList();
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifndef APP-PLUS
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
			}
		},
		methods: {
			clickItem: function(model) {
				console.log('clickItem.model:' + JSON.stringify(model));
				if (this.semFlag == 2) {
					model.flag = 1;
				} else {
					model.flag = 0;
				}
				model.access = this.itemData.access;
				util.openwithData("/pages/oa/collectionDataDetail", model);
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
					}
				}
			},
			//获取考勤记录
			getPageList() {
				var url = this.globaData.INTERFACE_MARKINGPAPERS + 'teachAssistTask/page';
				var comData = {
					user_code: this.personInfo.user_code, //用户代码
					page_size: this.pageSize, //每页记录数
					index_code: this.itemData.access.split('#')[1]
				}
				if (this.semFlag == 0) {
					comData.status = '0'; //状态,0未启动 1未改 2批改中 3已改，多个使用,分隔
					comData.page_number = this.semFlag0Data.pageIndex; //当前页数
				} else if (this.semFlag == 1) {
					comData.status = '1,2'; //状态,0未启动 1未改 2批改中 3已改，多个使用,分隔
					comData.page_number = this.semFlag1Data.pageIndex; //当前页数
				} else if (this.semFlag == 2) {
					comData.status = '3'; //状态,0未启动 1未改 2批改中 3已改，多个使用,分隔
					comData.page_number = this.semFlag2Data.pageIndex; //当前页数
				}
				this.showLoading();
				this.post(url, comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempArray = [];
							let tempM = data.data.list[i];
							for (var a = 0; a < tempM.clss.length; a++) {
								tempArray.push(tempM.clss[a].cls_name);
							}
							tempM.cls_names = tempArray.join(',');
						}
						if (this.semFlag == 0) {
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
							for (var i = 0; i < data.data.list.length; i++) {
								let tempM = data.data.list[i];
								tempM.zhishidianDFL = {
									"series": [{
										"name": "批改进度",
										"data": tempM.schedule,
										"color": "#00CFBD"
									}]
								};
								tempM.zhishidianShow = {
									animation: false,
									// errorReload: false,
									duration:0,
									title: {
										// name: parseFloat(tempM.schedule).toFixed(1) + '%',
										name: tempM.schedule + '%',
										fontSize: 15,
										color: '#00CFBD'
									},
									subtitle: {
										name: '批改进度',
										color: '#666666',
										fontSize: 11
									},
									extra: {
										arcbar: {
											width: '5',
											type: "circle",
										}
									}
								}
							}
							
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
		font-size: 13px;
	}

	.nameContent {
		color: gray;
		font-size: 13px;
	}

	.tempCss {
		font-size: 13px;
		float: left;
		color: gray;
		word-break: break-all;
	}

	.uni-col {
		margin-top: 0px;
	}

	.card-line {
		height: 1px;
		background-color: #e5e5e5;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.msg-content {
		word-break: break-all;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #eef0f2;
		/* height: calc(100% - 300px) !important; */
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #eef0f2;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 1px 0;
		/* padding-bottom: 50px; */
	}

	.content-box-text {
		font-size: 12px;
		line-height: 22px;
	}

	.card-title {
		font-size: 15px;
		text-align: center;
	}

	/* 识别人数圆圈 */
	.scoreOrderBorder {
		width: 60px;
		height: 60px;
		border: 2px solid;
		border-radius: 50%;
		margin-top: 10px;
		margin-left: 25px;
		text-align: center;
	}

	/* 识别人数 */
	.scoreOrder {
		margin-top: 10px;
		height: 20px;
		line-height: 20px;
		vertical-align: middle;
		font-size: 16px;
		text-align: center;
	}
</style>
