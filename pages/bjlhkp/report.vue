<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick">
		</mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<uni-row>
				<uni-col :span="14" style="">
					<view style="color: #00CFBD;text-align: left;height: 30px;font-size: 13px;margin: 10px 0 0 20px;"
						@click="showTimePick()">
						{{timePickerDate.join(' ~ ')}}
						<uni-icons type="arrowdown" size="15" color='#00CFBD'></uni-icons>
					</view>
				</uni-col>
				<uni-col :span="10">
					<view @click="clsClick()" style="font-size: 13px;padding-top: 10px;">
						{{grdClsStr}}
						<uni-icons style="float: right;margin-right: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<uni-list :border="false">
				<uni-list-item showArrow v-for="(model,index) in pagedata" :key='index' direction='column' clickable
					@click="clickItem(model)" :border="true">
					<view slot="body" class="slot-box slot-text">
						<view style="float: left;">
							<p v-if="model.kp_type == 1" class="kpType">日评</p>
							<p v-else-if="model.kp_type == 2" style="background: #bfbe01;" class="kpType">周评</p>
							<p v-else-if="model.kp_type == 3" style="background: #f59b23;" class="kpType">月评</p>
							<p v-else-if="model.kp_type == 4" style="background: #b6741b;" class="kpType">期中评</p>
							<p v-else-if="model.kp_type == 5" style="background: #d9001c;" class="kpType">期末评</p>
						</view>
						<view class="rightView">
							<view class="title" style="font-size: 14px;color: #000000;">{{model.name}}</view>
							<uni-row class="">
								<uni-col :span="12">
									<view style="font-size: 12px;color: #7f7f7f;">年级：{{model.grd_name}}</view>
								</uni-col>
								<uni-col :span="12">
									<view style="font-size: 12px;color: #7f7f7f;">班级：{{model.cls_name}}</view>
								</uni-col>
							</uni-row>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
			<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
		</view>
		<view class="content">
			<term-picker :visable.sync="pickerVisable" :defaultDate="defaultDate" :timeLimit='true' @confirm="confirm">
			</term-picker>
		</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择年级和班级</view>
			<scroll-view scroll-y="true" style="max-height: 500px;">
				<view style="margin-left: 10px;font-size: 14px;color: 7f7f7f;">年级：</view>
				<view style="margin: 20px 10px;">
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
				<view style="margin: 20px 10px;">
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
			</scroll-view>
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
				index_code: '',
				personInfo: {},
				icon: '',
				navItem: {},

				//顶部筛选框相关内容
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
				pageSize: 15,
				pageobj0: {
					loadFlag: 0, //0 刷新 1加载更多
					page_number: 1, //页码
					status: 'more', //加载更多的状态
					contentText: {
						contentdown: '', //上滑加载更多
						contentrefresh: '加载中',
						contentnomore: '' //没有更多
					},
					canload: true, //是否加载更多
				},
				pagedata: [],
				pickerVisable: false,
				defaultDate: [],
				timePickerDate: [],
				defTime: this.moment().format('YYYY-MM-DD'),
			}
		},
		components: {
			mynavBar
		},
		methods: {
			clickItem(model) {
				model.index_code = this.index_code;
				util.openwithData("/pages/bjlhkp/report_detail", model);
			},
			showTimePick() {
				this.pickerVisable = true;
			},
			// 点击确定按钮，返回当前选择的值
			confirm(date) {
				this.timePickerDate = date;
				console.log(date) // ['2021-06-01', '2021-07-01']
				this.showLoading()
				this.pageobj0.loadFlag = 0
				this.pageobj0.canload = true
				this.pageobj0.page_number = 1
				this.getList0();
			},
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
				this.$refs.popup.open()
			},
			popSure(flag) {
				this.$refs.popup.close();
				if (flag == 0) {
					this.grdIndexTemp = this.grdIndex;
					this.clsArrayTemp = JSON.parse(JSON.stringify(this.clsArray));
					this.clsIndexTemp = this.clsIndex;
				} else {
					this.grdIndex = this.grdIndexTemp;
					this.clsArray = JSON.parse(JSON.stringify(this.clsArrayTemp));
					this.clsIndex = this.clsIndexTemp;
					this.showLoading()
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getList0();
					this.grdClsStr = this.grdArray[this.grdIndex].text + this.clsArray[this.clsIndex].text;
				}
			},
			// getGrd() { //获取年级
			// 	let comData = {
			// 		op_code: 'index',
			// 		get_grd: true,
			// 		all_grd: false,
			// 		index_code: this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
			// 		this.hideLoading()
			// 		let grds = response.grd_list;
			// 		let grdArray = [];
			// 		grds.map(function(currentValue) {
			// 			let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
			// 			let obj = {};
			// 			obj.value = currentValue.value;
			// 			obj.text = name;
			// 			grdArray.push(obj)
			// 		})
			// 		if (grdArray.length > 0) {
			// 			this.grdArray = grdArray;
			// 			this.getCls(0);
			// 		} else {
			// 			this.grdArray = [];
			// 			this.showToast('无数据授权 无法获取年级');
			// 		}
			// 	})
			// },
			// getCls(flag) { //获取班级
			// 	let comData = {
			// 		op_code: 'index',
			// 		grd_code: this.grdArray[this.grdIndexTemp].value,
			// 		get_cls: true,
			// 		all_cls: false,
			// 		index_code: this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
			// 		this.hideLoading()
			// 		let clss = response.cls_list;
			// 		let clsArray = [];
			// 		clss.map(function(currentValue) {
			// 			let obj = {};
			// 			let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
			// 			obj.value = currentValue.value;
			// 			obj.text = name;
			// 			clsArray.push(obj)
			// 		})
			// 		if (clsArray.length > 0) {
			// 			this.clsArrayTemp = clsArray;
			// 			this.clsIndexTemp = 0;
			// 			if (flag == 0) {
			// 				this.clsArray = clsArray;
			// 				this.grdClsStr = this.grdArray[this.grdIndex].text + this.clsArray[this.clsIndex].text;
			// 				this.getList0();
			// 			}
			// 		} else {
			// 			this.clsArray = [];
			// 			this.clsArrayTemp = [];
			// 			this.showToast('无数据授权 无法获取班级');
			// 		}
			// 	})
			// },
			getGrd() { //获取年级
				let comData = {
					is_finish: '0',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'grd', comData, response => {
					this.hideLoading()
					let grds = response.list;
					let grdArray = [{value:'',text:'全部年级'}];
					grds.map(function(currentValue) {
						let obj = {};
						obj.value = currentValue.grd_code;
						obj.text = currentValue.grd_name;
						grdArray.push(obj)
					})
					if (grdArray.length > 0) {
						this.grdArray = grdArray;
						this.getCls(0);
					} else {
						this.grdArray = [];
						this.showToast(data.msg);
					}
				})
			},
			getCls(flag) { //获取班级
				let comData = {
					grd_codes: this.grdArray[this.grdIndexTemp].value,
					is_finish: '0',
					all_cls: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'cls', comData, response => {
					this.hideLoading()
					let clss = response.list;
					let clsArray = [{value:'',text:'全部班级'}];
					clss.map(function(currentValue) {
						let obj = {};
						obj.value = currentValue.cls_code;
						obj.text = currentValue.cls_name;
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
						this.showToast(data.msg);
					}
				})
			},
			iconClick() {
					util.openwithData('/pages/bjlhkp/report_add', {
						index_code: _this.index_code,
					}, {
						refreshRecordList(data) { //子页面调用父页面需要的方法
							_this.showLoading()
							_this.pageobj0.loadFlag = 0
							_this.pageobj0.canload = true
							_this.pageobj0.page_number = 1
							_this.getList0()
						}
					})
			},
			getList0() { //获取页面数据
				let comData = {
					user_code: this.personInfo.user_code,
					create_time_s: this.timePickerDate[0],
					create_time_e:this.timePickerDate[1],
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				if (comData.grd_code == '') {
					comData.grd_code = '-1';
				}
				if (comData.cls_code == '') {
					comData.cls_code = '-1';
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'report/page', comData, response => {
					setTimeout(function() {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if (response != null && response.list.length > 0) {
						// response.list.map(item => {
						// 	var stuList = [];
						// 	var bedList = [];
						// 	item.stu_list.map(titem => {
						// 		stuList.push(titem.stu_name);
						// 		if (titem.dorm_bed) {
						// 			bedList.push(titem.dorm_bed);
						// 		}
						// 	})
						// 	item.stuList = stuList.join(',');
						// 	item.bedList = bedList.join(',');
						// })
						if (this.pageobj0.loadFlag === 0) {
							this.pagedata = [].concat(response.list)
						} else {
							this.pagedata = this.pagedata.concat(response.list)
						}
						if (this.pageobj0.page_number >= response.total_page) {
							this.pageobj0.status = 'noMore';
							this.pageobj0.canload = false
						} else {
							this.pageobj0.status = 'more';
						}
					} else {
						this.pagedata = []
						this.showToast('暂无数据')
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload = false
					}
				})
			},
			toDetails(item) {
				// item.index_code = this.index_code
				util.openwithData('/pages/bjlhkp/record_detail', item);
			}
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index = 100;
			this.navItem = itemData;
			this.index_code = itemData.access.split("#")[1]
			let end_month = this.moment().format('YYYY-MM-DD')
			let start_month = this.moment().subtract(1, 'M').format('YYYY-MM-DD');
			this.defaultDate.push(start_month);
			this.defaultDate.push(end_month);
			this.timePickerDate.push(start_month);
			this.timePickerDate.push(end_month);
			setTimeout(() => {
				// this.showLoading()
				// this.getPermissionByPosition('add', this.index_code, result => {
				// 	if (result[0]) {
						this.icon = 'plusempty'
				// 	}
				// 	this.hideLoading();
				// })
				this.getGrd();
			}, 100)
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj0.loadFlag = 0
			this.pageobj0.canload = true
			this.pageobj0.page_number = 1
			this.getList0()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if (this.pageobj0.canload) {
				this.pageobj0.loadFlag = 1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number = this.pageobj0.page_number + 1
				this.getList0()
			}
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
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	.title-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 5px;
		font-size: 14px;
		color: #7f7f7f;
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
	
	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 65px);
	}
	
	.kpType {
		width: 50px !important;
		height: 50px !important;
		border-radius: 50%;
		background: #71b603;
		color: #FFFFFF;
		margin-left: 5px;
		margin-top: 5px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		word-break: break-all;
	}
</style>
