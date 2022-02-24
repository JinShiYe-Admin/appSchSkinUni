<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<view style="font-size: 14px;text-align: center;padding-top: 10px;">{{yearList[yearIndex].year_name}}
				{{termList[termIndex].term_name}} {{grdArray[grdIndex].name}} {{clsArray[clsIndex].name}}
				{{subArray[subIndex].name}}
			</view>
			<uni-icons style="float: right;margin: -25px 10px 5px 0;color: #00CFBD;" type="list" size="30"
				@click="clickShowSelect()"></uni-icons>
		</view>
		<view class="content" style="margin-top: 80px;">
			<m-steps v-for="(item, index) in dataList" :item='item' :key="index" :index='index'>
				<view slot="dateTop" style="width: 100px;text-align: center;font-size: 12px;color: #808080;">
					{{item.exam_date}}
				</view>
				<view slot="content" class="viewNode" style="min-height: 50px;">
					<uni-card isShadow :isFull="true" style="">
						<text class="content-box-text">
							<view class="card-title">{{item.name}}</view>
							<view class="card-line" style="margin-left: -10px;"></view>
							<view style="font-size: 13px;margin-top: 5px;">科目：{{item.sub_name}}</view>
							<view style="font-size: 13px;margin-top: 5px;">年级：{{item.grd_name}}</view>
							<view style="font-size: 13px;margin-top: 5px;">班级：{{item.clssStr}}</view>
							<view style="text-align: center;margin-top: 5px;">
								<button style="width: 100px;" type="default" size="mini"
									@click="gotoDetail(item)">查看分析</button>
							</view>
						</text>
					</uni-card>
				</view>
			</m-steps>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
		<uni-popup ref="popupSelect" type="center" style="background-color: white;">
			<scroll-view
				style="background-color: white;padding: 10px;border-radius: 5px 5px 0px 0px;width: 300px;height: 450px;"
				class="popupSelect" scroll-y="true">
				<view class="pupName">学年</view>
				<uni-row>
					<uni-col :span="12" v-for="(model,index) in yearList" :key="index">
						<view :class="index == yearIndexTemp?'popSelect':'popNoSelect'" @click="clickYear(index)">
							{{model.year_name}}
						</view>
					</uni-col>
				</uni-row>
				<view class="pupName">学期</view>
				<uni-row>
					<uni-col :span="12" v-for="(model,index) in termList" :key="index">
						<view :class="index == termIndexTemp?'popSelect':'popNoSelect'" @click="clickTerm(index)">
							{{model.term_name}}
						</view>
					</uni-col>
				</uni-row>
				<view class="pupName">年级</view>
				<uni-row>
					<uni-col :span="12" v-for="(model,index) in grdArray" :key="index">
						<view :class="index == grdIndexTemp?'popSelect':'popNoSelect'" @click="clickGrd(index)">
							{{model.name}}
						</view>
					</uni-col>
				</uni-row>
				<view class="pupName">班级</view>
				<uni-row>
					<uni-col :span="12" v-for="(model,index) in clsArrayTemp" :key="index">
						<view :class="index == clsIndexTemp?'popSelect':'popNoSelect'" @click="clickCls(index)">
							{{model.name}}
						</view>
					</uni-col>
				</uni-row>
				<view class="pupName">科目</view>
				<uni-row>
					<uni-col :span="12" v-for="(model,index) in subArrayTemp" :key="index">
						<view :class="index == subIndexTemp?'popSelect':'popNoSelect'" @click="clickSub(index)">
							{{model.name}}
						</view>
					</uni-col>
				</uni-row>
			</scroll-view>
			<view style="background-color: white;height: 50px;border-radius: 0px 0px 5px 5px;">
				<button class="mini-btn" type="default" size="mini" @click="popSure(0)">取消</button>
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
					@click="popSure(1)">确定</button>
			</view>
		</uni-popup>
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
				pageSize: 20,
				pageIndex: 1,
				total_page: 0,
				flagRef: 0, //0刷新1加载更多
				loadMoreText: "加载中...",
				showLoadMore: false,
				dataList: [],
				yearList: [{ //学年列表
					year_code: '',
					year_name: '全部学年'
				}],
				yearIndex: 0,
				yearIndexTemp: 0,
				termList: [{ //学期列表
					term_code: '',
					term_name: '全部学期'
				}],
				termIndex: 0,
				termIndexTemp: 0,
				grdIndex: 0,
				grdIndexTemp: 0,
				clsIndex: 0,
				clsIndexTemp: 0,
				subIndex: 0,
				subIndexTemp: 0,
				grdArray: [{
					name: '',
					value: '-1'
				}],
				clsArray: [{
					name: '',
					value: '-1'
				}],
				clsArrayTemp: [{
					name: '',
					value: '-1'
				}],
				subArray: [{
					name: '',
					value: '-1'
				}],
				subArrayTemp: [{
					name: '',
					value: '-1'
				}],
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
			this.itemData = tempM;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//获取学年
			this.getYear();
			//获取学期
			this.getTerm();
			//获取年级
			this.getGrd(1);
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
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.homeWorkQueryList();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.homeWorkQueryList();
		},
		methods: {
			gotoDetail(model) {
				model.access = this.itemData.access;
				model.year_code = this.yearList[this.yearIndex].year_code;
				model.term_code = this.termList[this.termIndex].term_code;
				model.grd_code = this.grdArray[this.grdIndex].value;
				model.cls_code = this.clsArray[this.clsIndex].value;
				model.sub_code = this.subArray[this.subIndex].value;
				console.log('model:' + JSON.stringify(model));
				util.openwithData("/pages/homeworkAndWeektest/hwWtAnalyse_detail", model);
			},
			clickYear(index) {
				this.yearIndexTemp = index;
			},
			clickTerm(index) {
				this.termIndexTemp = index;
			},
			clickGrd(index) {
				this.grdIndexTemp = index;
				this.getCls(0);
			},
			clickCls(index) {
				this.clsIndexTemp = index;
				this.getSub(0);
			},
			clickSub(index) {
				this.subIndexTemp = index;
			},
			popSure(flag) {
				if (flag == 0) {
					this.yearIndexTemp = this.yearIndex;
					this.termIndexTemp = this.termIndex;
					this.grdIndexTemp = this.grdIndex;
					this.clsIndexTemp = this.clsIndex;
					this.subIndexTemp = this.subIndex;
					this.clsArrayTemp = [].concat(this.clsArray);
					this.subArrayTemp = [].concat(this.subArray);
				} else {
					this.yearIndex = this.yearIndexTemp;
					this.termIndex = this.termIndexTemp;
					this.grdIndex = this.grdIndexTemp;
					this.clsIndex = this.clsIndexTemp;
					this.subIndex = this.subIndexTemp;
					this.clsArray = [].concat(this.clsArrayTemp);
					this.subArray = [].concat(this.subArrayTemp);
					this.dataList = [];
					this.flagRef = 0;
					this.pageIndex = 1;
					this.total_page = 0;
					this.homeWorkQueryList();
				}
				this.$refs.popupSelect.close();
			},
			clickShowSelect() {
				this.$refs.popupSelect.open();
			},
			getYear() { //获取学年
				let comData = {
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'year', comData, response => {
					this.hideLoading()
					if (response.list.length > 0) {
						this.yearList = this.yearList.concat(response.list);
					} else {
						this.showToast('获取不到学年');
					}
				})
			},
			getTerm() { //获取学期
				let comData = {
					page_number: -1,
					page_size: 1,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_BASESUB + 'SysTermP', comData, response => {
					this.hideLoading()
					if (response.list.length > 0) {
						this.termList = this.termList.concat(response.list);
					} else {
						this.showToast('获取不到学期');
					}
				})
			},
			getGrd(flag) { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: true,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					if (response.grd_list.length > 0) {
						for (var i = 0; i < response.grd_list.length; i++) {
							let tempM = response.grd_list[i];
							tempM.value = parseInt(tempM.value);
						}
						response.grd_list.sort(util.compare('value', 1));
						this.grdArray = response.grd_list;
						this.getCls(flag);
					} else {
						this.grdArray = [];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls(flag) { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndexTemp].value,
					get_cls: true,
					all_cls: true,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading();
					if (response.cls_list.length > 0) {
						if (flag == 1) {
							this.clsArray = response.cls_list;
						}
						this.clsArrayTemp = response.cls_list;
						this.clsIndexTemp = 0;
						this.getSub(flag);
					} else {
						this.clsArray = [];
						this.clsArrayTemp = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getSub(flag) { //获取科目
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndexTemp].value,
					cls_code: this.clsArrayTemp[this.clsIndex].value,
					get_sub: true,
					all_sub: true,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading();
					if (response.sub_list.length > 0) {
						this.subArrayTemp = response.sub_list;
						this.subIndexTemp = 0;
						if (flag == 1) {
							this.subArray = response.sub_list;
							this.homeWorkQueryList();
						}
					} else {
						this.subArray = [];
						this.subArrayTemp = [];
						this.showToast('无数据授权 无法获取科目');
					}
				})
			},
			//
			homeWorkQueryList() {
				var comData = {
					year_code: this.yearList[this.yearIndex].year_code,
					term_code: this.termList[this.termIndex].term_code,
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					sub_code: this.subArray[this.subIndex].value,
					page_size: this.pageSize, //每页记录数
					page_number: this.pageIndex, //当前页数
					index_code: this.itemData.access.split('#')[1]
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'homeWorkQuery/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							var tempArr = [];
							for (var a = 0; a < tempM.clss.length; a++) {
								var tempCls = tempM.clss[a];
								tempArr.push(tempCls.cls_name);
							}
							tempM.clssStr = tempArr.join(',');
						}
						this.pageIndex++;
						this.total_page = data.data.total_page;
						if (this.flagRef == 0) {
							if (data.data.list.length == 0) {
								this.showToast('暂无数据');
							}
							this.dataList = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.dataList = this.dataList.concat(data.data.list);
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
	.scoreDetail {
		font-size: 13px;
		text-align: center;
		margin-top: 10px;
	}

	.stuScoreDetail {
		font-size: 13px;
		color: #505050;
		text-align: center;
		min-height: 20px;
		margin-top: 5px;
		/* background-color: #e5e5e5;
		border-radius: 5px;
		margin-left: 2px;
		margin-right: 2px; */
	}

	/* 间隔 */
	.spaceLine {
		text-align: center;
		padding-top: 10px;
		padding-bottom: 10px;
		background: #d7f3ef;
		font-size: 14px;
		color: #505050;
	}

	::v-deep .uni-list--border-bottom {
		height: 0px;
	}

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
		width: 999px;
		background-color: #e5e5e5;
		margin-top: 5px;
		margin-bottom: 0px;
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
		margin-bottom: 5px;
		text-align: center;
		font-weight: bold;
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

	.text {
		font-size: 13px;
		height: 35px;
		padding: 5px 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.popNoSelect {
		margin: 5px 5px 0px 5px;
		font-size: 14px;
		text-align: center;
		border-radius: 20px;
		height: 25px;
		padding-top: 7px;
		border: 1px solid #e5e5e5;
		background-color: #e5e5e5;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.popSelect {
		margin: 5px 5px 0px 5px;
		font-size: 14px;
		text-align: center;
		border-radius: 20px;
		height: 25px;
		padding-top: 7px;
		border: 1px solid #00CFBD;
		background-color: #00CFBD;
		color: white;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.pupName {
		margin: 5px 0;
		font-size: 14px;
	}

	.mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: 40px;
	}
</style>
