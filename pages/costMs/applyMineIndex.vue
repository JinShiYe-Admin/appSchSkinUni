<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick">
		</mynavBar>
		<view class="tabs-fixed">
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="button"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<view class="content" style="margin-top: 60px;">
			<view v-show="semFlag == 0">
				<view class="example-body">
					<view v-for="(model,index) in sem0Data.dataList" :key='index'>
						<uni-card isShadow>
							<view class="content-box-text" @click="clickItem(model,0)">
								<uni-row style=''>
									<uni-col :span="16" style="font-size: 15px;font-weight: bold;">
										{{model.apply_code}}
									</uni-col>
									<uni-col :span="8" style="text-align: right;color: red;font-size: 13px;">
										￥{{model.apply_fee}}
									</uni-col>
								</uni-row>
								<view style="width: 280px;height: 25px;margin-top: 5px;">
									<p class='cardPCls' style=''>进度</p>
									<p class='cardPCls' style='color: #000000;background: #C8C9CC;'>
										{{model.apply_percent}}</p>
									<p class='cardPCls' style='margin-left: 20px;'>状态</p>
									<p class='cardPCls' style='color: #000000;background: #C8C9CC;'>{{model.statusStr}}
									</p>
									<p class='cardPCls' style='margin-left: 20px;'>进程</p>
									<p class='cardPCls' style='color: #000000;background: #C8C9CC;'>
										{{model.progressStr}}</p>
								</view>
								<view class="cardConent" style="margin-top: 5px;">事由：{{model.apply_reason}}</view>
								<view class="card-line"></view>
								<uni-row style=''>
									<uni-col :span="12" class="cardConent">
										{{model.apply_time}}
									</uni-col>
									<uni-col :span="12" style="text-align: right;">
										<button v-if="model.status == 1&&model.progress == 1" class="mini-btn"
											type="default" size="mini" @click.stop="clickSem0Item(model)">撤销</button>
									</uni-col>
								</uni-row>
							</view>
						</uni-card>
					</view>
				</view>
				<view class="uni-loadmore" v-if="sem0Data.showLoadMore">{{sem0Data.loadMoreText}}</view>
			</view>
			<view v-if="semFlag == 1">
				<view class="example-body">
					<view v-for="(model,index) in sem1Data.dataList" :key='index'>
						<uni-card isShadow>
							<view class="content-box-text" @click="clickItem(model,1)">
								<uni-row style=''>
									<uni-col :span="16" style="font-size: 15px;font-weight: bold;">
										{{model.apply_code}}
									</uni-col>
									<uni-col :span="8" style="text-align: right;color: red;font-size: 13px;">
										￥{{model.apply_fee}}
									</uni-col>
								</uni-row>
								<view style="width: 280px;height: 25px;margin-top: 5px;">
									<p class='cardPCls' style=''>进度</p>
									<p class='cardPCls' style='color: #000000;background: #C8C9CC;'>
										{{model.apply_percent}}</p>
									<p class='cardPCls' style='margin-left: 20px;'>状态</p>
									<p class='cardPCls' style='color: #000000;background: #C8C9CC;'>{{model.statusStr}}
									</p>
									<p class='cardPCls' style='margin-left: 20px;'>进程</p>
									<p class='cardPCls' style='color: #000000;background: #C8C9CC;'>
										{{model.progressStr}}</p>
								</view>
								<view class="cardConent" style="margin-top: 5px;">事由：{{model.apply_reason}}</view>
								<view class="card-line"></view>
								<uni-row style=''>
									<uni-col :span="12" class="cardConent">
										{{model.apply_time}}
									</uni-col>
									<uni-col :span="12" style="text-align: right;">

									</uni-col>
								</uni-row>
							</view>
						</uni-card>
					</view>
				</view>
				<view class="uni-loadmore" v-if="sem1Data.showLoadMore">{{sem1Data.loadMoreText}}</view>
			</view>
		</view>
		<uni-popup ref="popupDel" type="dialog">
			<uni-popup-dialog title="确定?" content="您确定要撤销吗？" :duration="2000" :before-close="true" @close="closeDel"
				@confirm="confirmDel"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				semValuesArray: ['我的申请', '抄送查看'],
				semFlag: 0, //点击的seg索引
				icon: '',
				sem0Data: { //
					flagRef: 0, //0刷新1加载更多
					pageIndex: 1,
					total_page: 0, //总页数
					loadMoreText: "加载中...",
					showLoadMore: false,
					dataList: [],
					chexiaoModel: {}
				},
				sem1Data: { //
					flagRef: 0, //0刷新1加载更多
					pageIndex: 1,
					total_page: 0, //总页数
					loadMoreText: "加载中...",
					showLoadMore: false,
					dataList: [],
				},
			}
		},
		components: {
			mynavBar,
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
			//#ifdef H5
			document.title = ""
			//#endif
			setTimeout(() => {
				this.showLoading()
				this.getPermissionByPosition('add', this.navItem.access.split('#')[1], result => {
					if (result[0]) {
						this.icon = 'plusempty'
					}
				})
				//13.获取费用申请列表
				this.getCostApplys();
			}, 100);
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
				this.sem0Data.flagRef = 1;
				if (this.sem0Data.total_page < this.sem0Data.pageIndex) {
					this.sem0Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.sem0Data.showLoadMore = true;
				setTimeout(() => {
					this.getCostApplys();
				}, 300);
			} else if (this.semFlag == 1) {
				this.sem1Data.flagRef = 1;
				if (this.sem1Data.total_page < this.sem1Data.pageIndex) {
					this.sem1Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.sem1Data.showLoadMore = true;
				setTimeout(() => {
					this.getCostApplys();
				}, 300);
			}
		},
		onPullDownRefresh() {
			if (this.semFlag == 0) {
				this.sem0Data.loadMoreText = "加载中..."
				this.sem0Data.flagRef = 0;
				this.sem0Data.pageIndex = 1;
				this.getCostApplys();
			} else if (this.semFlag == 1) {
				this.sem1Data.loadMoreText = "加载中..."
				this.sem1Data.flagRef = 0;
				this.sem1Data.pageIndex = 1;
				this.getCostApplys();
			}
		},
		methods: {
			clickItem(model, flag) {
				model.flag = flag;
				model.index_code = this.navItem.access.split('#')[1];
				util.openwithData('/pages/costMs/applyMineDetail', model, {
					refreshList(data) { //子页面调用父页面需要的方法
						model.status = 2;
						model.statusStr = '撤销';
					}
				});
			},
			iconClick() {
				var model = {
					index_code: _this.navItem.access.split('#')[1],
				}
				util.openwithData('/pages/costMs/applyMineAdd', model, {
					addRefreshList(data) { //子页面调用父页面需要的方法
						if (_this.semFlag == 0) {
							_this.showLoading();
							_this.sem0Data.flagRef = 0;
							_this.sem0Data.loadMoreText = "加载中...";
							_this.sem0Data.pageIndex = 1;
							_this.getCostApplys();
						}
					}
				});
			},
			clickSem0Item(model) {
				console.log('clickSem0Item:' + JSON.stringify(model));
				this.$refs.popupDel.open();
				this.sem0Data.chexiaoModel = model;
			},
			closeDel() {
				this.$refs.popupDel.close();
			},
			confirmDel(value) {
				this.$refs.popupDel.close();
				let comData = {
					index_code: this.navItem.access.split('#')[1],
					id: this.sem0Data.chexiaoModel.id, //任务id
				}
				this.showLoading();
				//11.撤销费用申请
				this.post(this.globaData.INTERFACE_COSTMS + 'costApply/doSetCostApplyUndo', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.sem0Data.loadMoreText = "加载中..."
						this.sem0Data.flagRef = 0;
						this.sem0Data.pageIndex = 1;
						this.getCostApplys();
					}
					this.showToast(data.msg);
				});
			},
			icoClick() {
				this.$refs.popup.close();
				this.$refs.showRight.open();
			},
			clickSeg: function(e) {
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					if (this.semFlag == 0 && this.sem0Data.dataList.length == 0) {
						//13.获取费用申请列表
						this.getCostApplys();
					} else if (this.semFlag == 1 && this.sem1Data.dataList.length == 0) {
						//13.获取费用申请列表
						this.getCostApplys();
					}
				}
			},
			//13.获取费用申请列表
			getCostApplys(flag) {
				let comData = {
					man_code: this.personInfo.user_code, //查看人Code
					apply_code: '',
					apply_reason: '',
					begin_time: '20200101',
					end_time: '20501231',
					page_size: 10,
					index_code: this.navItem.access.split('#')[1],
				}
				if (this.semFlag == 0) {
					comData.man_type = 1; //查看人类型,1 申请人,2 抄送人
					comData.status = 0; //申请状态,0 全部,1 发出,2 撤回,3 被退
					comData.progress = 0; //进程,0 全部,1 新建,2 审批中,3 审毕
					comData.page_number = this.sem0Data.pageIndex; //
				} else {
					comData.man_type = 2; //查看人类型,1 申请人,2 抄送人
					comData.status = 0; //申请状态,0 全部,1 发出,2 撤回,3 被退
					comData.progress = 3; //进程,0 全部,1 新建,2 审批中,3 审毕
					comData.page_number = this.sem1Data.pageIndex; //
				}
				this.post(this.globaData.INTERFACE_COSTMS + 'costApply/getCostApplys', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							if (tempM.status == 1) {
								tempM.statusStr = '发出';
							} else if (tempM.status == 2) {
								tempM.statusStr = '撤销';
							} else if (tempM.status == 3) {
								tempM.statusStr = '被退';
							}
							if (tempM.progress == 1) {
								tempM.progressStr = '新建';
							} else if (tempM.progress == 2) {
								tempM.progressStr = '审批中';
							} else if (tempM.progress == 3) {
								tempM.progressStr = '审毕';
							}
						}
						if (this.semFlag == 0) {
							this.sem0Data.pageIndex++;
							this.sem0Data.total_page = data.data.total_page;
							if (this.sem0Data.flagRef == 0) {
								if (data.data.list.length == 0) {
									this.showToast('暂无数据');
								}
								this.sem0Data.dataList = [].concat(data.data.list);
								uni.stopPullDownRefresh();
							} else {
								this.sem0Data.dataList = this.sem0Data.dataList.concat(data.data.list);
							}
						} else {
							this.sem1Data.pageIndex++;
							this.sem1Data.total_page = data.data.total_page;
							if (this.sem1Data.flagRef == 0) {
								if (data.data.list.length == 0) {
									this.showToast('暂无数据');
								}
								this.sem1Data.dataList = [].concat(data.data.list);
								uni.stopPullDownRefresh();
							} else {
								this.sem1Data.dataList = this.sem1Data.dataList.concat(data.data.list);
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
	.uni-common-mt {
		margin-top: 10px;
	}

	.uni-padding-wrap {
		padding: 0 5px;
	}

	.scoreDetail {
		font-size: 13px;
		color: #000;
		text-align: center;
		margin-top: 0px;
		background-color: #e5e5e5;
	}

	.charts-box {
		width: 100%;
		height: 300px;
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

	/* .mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: 26px;
	} */
	.mini-btn {
		width: 65px;
		height: 30px;
		padding-top: 0px !important;
		color: #04D0BE;
	}
</style>
