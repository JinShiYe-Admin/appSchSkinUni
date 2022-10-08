<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text='rightText' :textClick="textClick">
		</mynavBar>
		<uni-swipe-action>
			<uni-swipe-action-item v-for="(item,index) in pageArray" :disabled="deleteFlag" :right-options="options" @click="onClick(index)">
				<uni-list-item showArrow clickable :border="true">
					<view slot="body" class="slot-box slot-text" @click.stop="clickItem(item)">
						<uni-row>
							<uni-col :span="24" style="display: flex;align-items: center;">
								<uni-col :span="4">
									<view class="leftView" :style="{background:item.backColor}">
										{{item.evaluation_type_txt}}
									</view>
								</uni-col>
								<uni-col :span="20">
									<view class="biaoti">{{item.title}}</view>
								</uni-col>
							</uni-col>
						</uni-row>
					</view>
				</uni-list-item>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="确定要删除该量化考评吗？" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
		<!-- index界面保留，index1界面屏蔽 -->
		<!-- <u-tabbar-my v-if='navItem.index<5' :list="tabbar"></u-tabbar-my> -->
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
				rightText: '',
				deleteFlag: true,
				navItem: {},
				pageArray: [],
				pageIndex: 1,
				total_page: 0,
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				delIndex:0,
			}
		},
		components: {
			mynavBar,
		},
		onLoad(option) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			});
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			// index1界面用这个
			this.navItem = util.getPageData(option);
			// index界面用这个
			// this.navItem = util.getTabbarMenu();
			this.index_code = this.navItem.access.split("#")[1];
			setTimeout(() => {
				this.showLoading()
				this.getPermissionByPosition('add,delete', this.navItem.access.split('#')[1], result => {
					if (result[0]) {
						this.rightText = '生成报告';
					}
					if (result[1]) {
						this.deleteFlag = false;
					}
				})
			}, 100);
			// 28.量化考评-列表
			this.getPageList();
			//#ifdef H5
			document.title = ""
			//#endif

		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onReachBottom() {
			this.flagRef = 1;
			console.log('this.total_page:'+this.total_page);
			console.log('this.pageIndex:'+this.pageIndex);
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
			onClick(index) {
				this.delIndex = index;
				//点击选项按钮时触发事件	
				//e = {content,index} ，content（点击内容）、index（下标）、position (位置信息)
				_this.$refs.alertDialog.open();
			},
			dialogConfirm() {
				var comData = {
					index_code: _this.index_code,
					id: _this.pageArray[_this.delIndex].id, //
				}
				this.showLoading();
				// 39.量化考评-删除
				this.post(this.globaData.INTERFACE_LHKP + 'Evaluation/delete', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.loadMoreText = "加载中..."
						this.flagRef = 0;
						this.pageIndex = 1;
						this.getPageList();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			textClick() {
				util.openwithData("/pages/evaluationRecord/add", _this.navItem, {
					refreshEvaluationIndex() { //子页面调用父页面需要的方法
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.getPageList();
					}
				});
			},
			clickItem(model) {
				model.index_code = _this.index_code;
				util.openwithData('/pages/evaluationRecord/evaluationDetail', model);
			},
			// 28.量化考评-列表
			getPageList() {
				var comData = {
					index_code: _this.index_code,
					page_number: this.pageIndex, //当前页数
					page_size: '20', //每页记录数
					cls_code: '-1',
					grd_code: '-1',
				}
				this.showLoading();
				// 28.量化考评-列表
				this.post(this.globaData.INTERFACE_LHKP + 'Evaluation/list', comData, (data0,
					data) => {
					this.hideLoading();
					this.pageIndex++;
					this.total_page = data.data.total_page;
					for (var i = 0; i < data.data.list.length; i++) {
						var tempM = data.data.list[i];
						if (tempM.evaluation_type == 'termEvaluation') {
							tempM.backColor = '#5ebfef';
						} else if (tempM.evaluation_type == 'monthEvaluation') {
							tempM.backColor = '#9999de';
						} else if (tempM.evaluation_type == 'weekEvaluation') {
							tempM.backColor = '#fd9827';
						}
					}
					if (this.flagRef == 0) {
						if (data.data.list.length == 0) {
							this.showToast('暂无数据');
						}
						this.pageArray = [].concat(data.data.list);
						uni.stopPullDownRefresh();
					} else {
						this.pageArray = this.pageArray.concat(data.data.list);
					}
				});
			},
		}
	}
</script>

<style>
	.leftView {
		width: 40px;
		height: 40px;
		line-height: 40px;
		border-radius: 5px;
		text-align: center;
		font-size: 14px;
		float: left;
		color: white;
		vertical-align: middle;
	}

	.biaoti {
		color: #444444;
		font-size: 15px;
		font-weight: 400;
		white-space: normal;
		word-break: break-all;
	}
</style>
