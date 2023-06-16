<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<view style="margin: 10px;">
			<uni-pagination :total="totalDate" :value="returnIndex" show-icon="true"
				@change="change" /></uni-pagination>
			<view style="font-weight: 900;font-size: 16px;text-align: center;margin: -25px 0 10px 0;">
				{{yearMonth}}
			</view>
		</view>
		<view class="uni-flex uni-row">
			<view style="width: 1%;"></view>
			<view class="flex-item" v-for="(item,index) in tempArr0" :key="index" @click="clickDate(item)"
				:style="{color:item.date==selectModel.date?'white':'',background:item.date==selectModel.date?'#2c96bd':''}">
				<view style="margin-top: 10px;">{{item.day}}</view>
				<view>{{item.week}}</view>
			</view>
			<view style="width: 1%;"></view>
		</view>
		<view v-if="pagedata.length==0" style="margin-top: 20px;text-align: center;font-size: 13px;">暂无</view>
		<uni-card v-else isShadow style="margin: 10px 5px;" @click="gotoDetail(item)" v-for="(item,index) in pagedata"
			:key="index">
			<view class="itemSub">{{item.sub_name.slice(0,1)}}</view>
			<view class="itemSub hmwkType">{{item.type==1?'线上作业':'线下作业'}}</view>
			<view class="hmwkName">{{item.content}}</view>
			<view style="font-size: 12px;margin-top: 5px;">截止时间：{{item.deadline}}</view>
			<view v-if="item.type==1">
				<view v-if="item.submit_status == 0" class="itemStatus">未交</view>
				<view v-else-if="item.submit_status == 1&&item.correct_status == 0" class="itemStatus"
					style="color: #70b603;border: 1px solid #70b603;">已交</view>
				<view v-else style="float: right;font-size: 16px;color: #d9001b;margin-top: -55px;text-align: center;font-weight: 700;">
					<view style="margin-top: -10px;">{{item.correct_score}}</view>
					<view style="margin-top: 10px;">{{item.correct_evaluate_name}}</view>
				</view>
			</view>
		</uni-card>

		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		<!-- index界面保留，index1界面屏蔽 -->
		<u-tabbar-my v-if='navItem.index<5' :list="tabbar"></u-tabbar-my>
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
				tabbar: [],
				navItem: {},
				index_code: '',
				yearMonth: '', //年、月显示
				totalDate: 600,
				returnIndex: 1, //
				tempArr0: [],
				tempArr1: ['一', '二', '三', '四', '五', '六', '日'],
				selectModel: {},
				pagedata: [],
				pageSize: 15,
				flagRef: 0, //0刷新1加载更多
				pageIndex: 1,
				total_page: 0, //总页数
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		components: {
			mynavBar,
		},
		methods: {
			gotoDetail(model) {
				model.index_code = _this.navItem.access.split("#")[1];
				util.openwithData('/pages/hmwkStu/detail', model, {
					refreshStuIndex(data) { //子页面调用父页面需要的方法
						_this.loadMoreText = "加载中..."
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.getList0();
					}
				})
			},
			clickDate(model) {
				if (this.selectModel.date != model.date) {
					this.selectModel = model;
					this.loadMoreText = "加载中..."
					this.flagRef = 0;
					this.pageIndex = 1;
					this.getList0();
				}
			},
			setDate() {
				var tempD = this.totalDate / 2 / 10;
				var tempFlag = tempD - this.returnIndex;
				this.yearMonth = this.moment().subtract(7 * tempFlag, 'days').format('YYYY') + '年' + this.moment()
					.subtract(7 * tempFlag, 'days').format('MM') + '月';
				var tempDay = this.moment().subtract(7 * tempFlag, 'days').format('DD');
				// 
				var tempArr = util.getWeekDataList(this.moment().subtract(7 * tempFlag, 'days').format('YYYY-MM-DD'));

				this.tempArr0 = [];
				for (var i = 0; i < tempArr.length; i++) {
					this.tempArr0.push({
						date: tempArr[i],
						day: tempArr[i].split('-')[2],
						week: this.tempArr1[i],
					});
				}
				// console.log('tempArr:'+JSON.stringify(this.tempArr0))
			},
			change(e) {
				this.returnIndex = e.current;
				this.setDate();
			},
			getList0() {
				let comData = {
					stu_code: this.personInfo.stu_code,
					cls_code: this.personInfo.cls_code,
					create_time: this.selectModel.date,
					page_size: 10,
					page_number: this.pageIndex,
					index_code: this.navItem.access.split("#")[1],
				}
				this.showLoading();
				// 6.1.我的作业分页
				this.post(this.globaData.INTERFACE_HMWK + 'stuWorkSubmit/myWorkPage', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							if (tempM.correct_evaluate) {
								if (tempM.correct_evaluate == 1) {
									tempM.correct_evaluate_name = '优秀';
								} else if (tempM.correct_evaluate == 2) {
									tempM.correct_evaluate_name = '良好';
								}  else if (tempM.correct_evaluate == 3) {
									tempM.correct_evaluate_name = '及格';
								}  else if (tempM.correct_evaluate == 4) {
									tempM.correct_evaluate_name = '不及格';
								} 
							}
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
			},
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			// index1界面用这个
			// this.navItem = util.getPageData(option);
			// index界面用这个
			this.navItem = util.getTabbarMenu();
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			this.selectModel = {
				date: this.moment().format('YYYY-MM-DD'),
				day: this.moment().format('YYYY-MM-DD').split('-')[2],
				week: this.moment().format('e'),
			}
			setTimeout(() => {
				this.returnIndex = 30;
				this.setDate();
			}, 500)
			this.getList0();
			//#ifdef H5
			document.title = "";
			//#endif
			//
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
	.rowStyle {
		font-size: 12px !important;
		text-align: center;
		word-break: break-all;
	}

	.rowClass {
		color: #333333;
		font-size: 10px !important;
		text-align: center;
		height: 150px;
		background: #00cfbd;
		border-radius: 5px;
		margin: 2px 1px 0 1px;
		word-break: break-all;
	}

	::v-deep .uni-pagination__num-current {
		color: rgba(0, 0, 0, 0) !important;
		display: none !important;
	}

	::v-deep .uni-pagination__num-current-text {
		color: rgba(0, 0, 0, 0) !important;
		display: none !important;
	}

	.flex-item {
		width: 14%;
		height: 100rpx;
		text-align: center;
		background: #f2f2f2;
		font-size: 12px;
		color: #333;
		margin: 2px;
		border-radius: 5px;
		font-weight: 700;
	}

	.itemSub {
		font-size: 12px;
		background: #00cfbd;
		color: white;
		border-radius: 5px 0 8px 0;
		width: 35px;
		height: 25px;
		margin: -11px 0 0 -11px;
		padding: 7px 0 0 20px;
	}

	.hmwkName {
		font-weight: 700;
		margin-top: 10px;
		font-size: 14px;
		margin-right: 70px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hmwkType {
		width: 70px;
		margin: -33px 0 0 45px;
		background: #f2eade;
		color: #555;
	}

	.itemStatus {
		font-size: 18px;
		color: #f59a23;
		border: 2px solid #f59a23;
		width: 38px;
		padding: 0px 10px;
		border-radius: 8px;
		float: right;
		margin-top: -55px;
		transform: rotate(315deg);
		font-family: 700;
	}
</style>