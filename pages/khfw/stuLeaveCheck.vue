<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="height: 150px;background: #00CFBD;">
			<image class="perImg" :src="personInfo.img_url"></image>
			<view style="text-align: right;margin-right: 40px;color: white;margin-top: -80px;font-size: 13px;">积分：33
			</view>
			<view style="text-align: center;color: white;font-size: 14px;margin-top: 65px;">一年级一班 王某某</view>
		</view>
		<view>
			<my-segmented-control ref='segmCon' :current="semFlag" :values="semList" @clickItem="clickSeg"
				styleType="text" activeColor="#00CFBD" style="background: white;"></my-segmented-control>
		</view>
		<view class="content" style="">
			<view v-show="semFlag == 0">
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='学业成就'></fileDivider>
					<uni-row style="margin-top: 5px;">
						<uni-col :span="12">
							<view class="rowStyle">请假事由 x <span class="countCss">1</span></view>
						</uni-col>
					</uni-row>
				</uni-card>
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='体育成就'></fileDivider>
					<uni-row style="margin-top: 5px;">
						<uni-col :span="12">
							<view class="rowStyle">请假事由 x <span class="countCss">1</span></view>
						</uni-col>
					</uni-row>
				</uni-card>
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='获奖情况'></fileDivider>
					<uni-list>
						<uni-list-item direction='column'>
							<view slot="body">
								<view class="indexCss">1</view>
								<view class="titleList">列表文字列表文字列表文字列表文字列表文字列表文字列表文字列表文字列表文字列表文字</view>
								<view style="font-size: 12px;">校级</view>
								<view style="font-size: 12px;float: right;margin-top: -18px;">2023-05-09</view>
							</view>
						</uni-list-item>
					</uni-list>
				</uni-card>
			</view>
		</view>
		<view style="height: 50px;background: #f2f2f2;"></view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import fileDivider from "@/components/fileDivider/fileDivider";
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				semFlag: 0, //点击的seg索引
				semList: [{
					name: '荣耀'
				}, {
					name: '评价'
				}, {
					name: '学业'
				}, {
					name: '德育'
				}, {
					name: '体质'
				}],
				pagedata: [],
				// flagRef: 0, //0刷新1加载更多
				// pageIndex: 1,
				// total_page: 0, //总页数
				// loadMoreText: "加载中...",
				// showLoadMore: false,
			}
		},
		components: {
			mynavBar,
			fileDivider
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
			// this.getList0();
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
			clickSeg: function(e) {

			},
			gotoDetail(model) {
				util.openwithData('/pages/khfw/teaChangeClassCheckDetail', {
					id: model.id,
					checkFlag: _this.semFlag,
					index_code: _this.navItem.access.split("#")[1],
				}, {
					refreshteaLeaveCheck(data) { //子页面调用父页面需要的方法
						_this.loadMoreText = "加载中..."
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.pagedata = [];
						_this.getList0();
					}
				})
			},
			clickSem(flag) {
				if (flag != this.semFlag) {
					this.semFlag = flag;
					_this.loadMoreText = "加载中..."
					_this.flagRef = 0;
					_this.pageIndex = 1;
					_this.pagedata = [];
					_this.getList0();
				}
			},
			getList0() {
				let comData = {
					is_judge: this.semFlag,
					checker_code: this.personInfo.user_code,
					page_size: 10,
					page_number: this.pageIndex,
					index_code: this.navItem.access.split("#")[1],
				}
				// 4.5.审批列表页
				this.post(this.globaData.INTERFACE_KHFW + 'changeCourse/checkPage', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							if (tempM.application_status == 0) {
								tempM.application_status_name = '未审批';
							} else if (tempM.application_status == 1) {
								tempM.application_status_name = '已通过';
							} else if (tempM.application_status == 2) {
								tempM.application_status_name = '未通过';
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
		}
	}
</script>

<style>
	.card-line1 {
		text-align: center;
		font-size: 16px;
		color: #7f7f7f;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid #aaaaaa;
		width: 100px;
		margin-left: calc((100% - 200px)/2);
	}

	.card-line2 {
		text-align: center;
		font-size: 16px;
		color: #7f7f7f;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid #aaaaaa;
		width: 100px;
		margin-right: calc((100% - 200px)/2);
		float: right;
		margin-top: -24px;
	}

	.semFlagSelect {
		color: #008080;
		border-bottom: 2px solid #008080;
	}

	.subTea {
		font-size: 14px;
		background: #f2efef;
		border-radius: 3px;
		padding: 4px 30px;
		margin-top: -20px;
		float: left;
	}

	.rowStyle {
		font-size: 12px;
		height: 50px;
	}

	.perImg {
		width: 80px;
		height: 80px;
		margin-left: calc((100% - 80px)/2);
		margin-top: 30px;
		border-radius: 50%;
	}

	::v-deep .segmented-control {
		height: 45px;
	}

	.segmented-control {
		margin: 0px;
	}

	::v-deep .uni-badge--x {
		margin-left: -5px;
	}

	.countCss {
		font-size: 14px;
		color: #d9001b;
		font-weight: 700;
		margin-left: 5px;
	}

	.titleList {
		margin: -20px -10px 10px 30px;
		font-size: 14px;
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.indexCss {
		margin-top: 5px;
		border-radius: 50%;
		height: 20px;
		width: 20px;
		text-align: center;
		background: #f59a23;
		color: white;
	}
</style>