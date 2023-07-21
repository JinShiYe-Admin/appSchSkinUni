<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view @click="clsClick()" style="font-size: 13px;padding-top: 10px;padding-left: 25px;width: 150px;">
			{{grdClsStr}}
			<uni-icons style="float: right;margin-right: 20px;margin-top: 3px;" type="bottom"
				color='#7f7f7f' size="14"></uni-icons>
		</view>
		<view style="">
			<view style="margin: 10px;height: 450px;">
				<zb-table v-if="columns.length>0" @rowClick="rowClick" :show-header="true" :columns="columns"
					:stripe="true" :fit="true" :data="dataSource"></zb-table>
			</view>
			<!-- <view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view> -->
		</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择年级和班级</view>
			<view style="margin-left: 10px;font-size: 14px;color: 7f7f7f;">年级：</view>
			<view style="margin: 15px 10px;">
				<uni-grid :column="3">
					<uni-grid-item v-for="(item, index) in grdArray" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='grdSelect(item, index)'
							:style="index==grdIndexTemp?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view style="margin-left: 10px;font-size: 14px;color: 7f7f7f;">班级：</view>
			<view style="margin: 15px 10px;">
				<uni-grid :column="4">
					<uni-grid-item v-for="(item, index) in clsArrayTemp" :key="index" style="height: 40px;">
						<view class="grid-item-box gridBox" @click='clsSelect(item, index)'
							:style="index==clsIndexTemp?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view style="height: 50px;margin: 20px 0;">
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #049f95;border-color: #049f95;color: #ffffff;"
					@click="popSure(1)">确定</button>
				<button class="mini-btn" style="margin-left: 50px;" type="default" size="mini"
					@click="popSure(0)">取消</button>
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
				index_code: '',
				personInfo: {},
				navItem: {},
				grdIndex: 0,
				grdIndexTemp: 0,
				grdArray: [{
					text: '',
					value: ''
				}],
				clsIndex: 0,
				clsArray: [{
					text: '',
					value: ''
				}],
				clsIndexTemp: 0,
				clsArrayTemp: [{
					text: '',
					value: ''
				}],
				grdClsStr: '',
				columns: [],
				dataSource: [],
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
			this.navItem.text = '成长档案';
			this.navItem.index = 100;
			this.index_code = this.navItem.access.split("#")[1];
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '成长档案'
			});
			this.getGrd();
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
			grdSelect(item, index) {
				if (this.grdIndexTemp != index) {
					this.grdIndexTemp = index;
					this.getCls(1);
				}
			},
			clsSelect(item, index) {
				if (this.clsIndexTemp != index) {
					this.clsIndexTemp = index;
				}
			},
			clsClick() {
				this.grdIndexTemp = this.grdIndex;
				this.clsIndexTemp = this.clsIndex;
				this.clsArrayTemp = JSON.parse(JSON.stringify(this.clsArray));
				this.$refs.popup.open()
			},
			popSure(flag) {
				if (flag == 0) {
					this.$refs.popup.close();
					this.grdIndexTemp = this.grdIndex;
					this.clsArrayTemp = JSON.parse(JSON.stringify(this.clsArray));
					this.clsIndexTemp = this.clsIndex;
				} else {
					if (this.clsArrayTemp.length==0) {
						this.showToast('无对应班级');
						return;
					}
					this.$refs.popup.close();
					this.grdIndex = this.grdIndexTemp;
					this.clsArray = JSON.parse(JSON.stringify(this.clsArrayTemp));
					this.clsIndex = this.clsIndexTemp;
					this.showLoading()
					// this.loadMoreText = "加载中..."
					// this.flagRef = 0;
					// this.pageIndex = 1;
					this.getList0();
					this.grdClsStr = this.grdArray[this.grdIndex].text + this.clsArray[this.clsIndex].text;
				}
			},
			getGrd() { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray = [];
					grds.map(function(currentValue) {
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						grdArray.push(obj)
					})
					if (grdArray.length > 0) {
						this.grdArray = grdArray;
						this.getCls(0);
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
					all_cls: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray = [];
					clss.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
						obj.value = currentValue.value;
						obj.text = name;
						clsArray.push(obj)
					})
					if (clsArray.length > 0) {
						this.clsArrayTemp = JSON.parse(JSON.stringify(clsArray));
						this.clsIndexTemp = 0;
						if (flag == 0) {
							this.clsArray = JSON.parse(JSON.stringify(clsArray));
							this.grdClsStr = this.grdArray[this.grdIndex].text + this.clsArray[this.clsIndex].text;
							this.getList0();
						}
					} else {
						this.clsArray = [];
						this.clsArrayTemp = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			rowClick(row, index) {
				// console.log('rowClick:'+JSON.stringify(row))
				row.flag = 1;
				row.stu_msg = this.grdArray[this.grdIndex].text +' '+ this.clsArray[this.clsIndex].text+' '+row.stu_name;
				row.cls_code = this.clsArray[this.clsIndex].value;
				row.index_code = this.index_code;
				util.openwithData('/pages/mixedAblStu/growthPortfolio', row);
			},
			getList0() {
				let comData = {
					cls_code: this.clsArray[this.clsIndex].value,
					index_code: this.index_code,
				}
				// 4.2.学生积分统计列表
				this.post(this.globaData.INTERFACE_ZHSZM + 'stuScore/stuScoreStatistics', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.navItem.stu_count = data.data.stu_count;
						this.navItem.correct_count = data.data.correct_count;
						this.navItem.submit_count = data.data.submit_count;
						var tempCol = [];
						var tempDs = [];
						tempCol.push({
							label: '姓名',
							name: 'stu_name',
							align: 'center',
							fixed: true
						})
						tempCol.push({
							label: '积分',
							name: 'total_score',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '成就',
							name: 'exam_count',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '表扬',
							name: 'comment1_count',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '批评',
							name: 'comment2_count',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '获奖',
							name: 'honor_count',
							align: 'center',
							fixed: false
						})
						this.columns = tempCol;
						this.dataSource = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				});
			},
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
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	::v-deep .uni-date-x {
		padding: 0px !important;
	}

	::v-deep .uni-grid-item--border {
		border-bottom: 0px !important;
		border-right: 0px !important;
	}

	::v-deep .uni-grid-item--border-top {
		border-top: 0px !important;
	}

	::v-deep .uni-grid--border {
		border-left: 0px !important;
	}

	.gridBox {
		height: 40px;
		background-color: #f2f2f2;
		text-align: center;
		padding: 5px 5px 0px;
		margin: 5px;
		border-radius: 3px;
		color: #333333;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.gridBoxSelect {
		background-color: #2c96bd;
		color: #ffffff;
	}

	.mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: calc(100% - 300px);
		font-size: 14px;
		color: #333333;
		background: #d7d7d7;
	}
</style>