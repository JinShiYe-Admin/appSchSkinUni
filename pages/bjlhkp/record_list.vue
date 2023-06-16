<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick">
		</mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<uni-row>
				<uni-col :span="12">
					<uni-datetime-picker style="margin-top: 5px;" type="date" :clear-icon="false" :border="false"
						:value="defTime" @change="changeDate" />
					<uni-easyinput-select style="float: left;margin-top: -35px;width: 40px;margin-left: 130px;"
						:inputBorder="false" suffixIcon="arrowdown" disabled></uni-easyinput-select>
				</uni-col>
				<uni-col :span="12">
					<!-- <view v-if="navItem.fir_id<4"> -->
					<!-- <view @click="clsClick()" style="margin-right: 10px;">
							<uni-easyinput-select @click="clsClick()" :inputBorder="false" suffixIcon="arrowdown" disabled :value="grdClsStr">
							</uni-easyinput-select>
						</view> -->
					<view @click="clsClick()"
						style="font-size: 14px;color: #7f7f7f;text-align: center;padding: 12px 0;">
						{{grdClsStr}}
						<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom"
							color='#7f7f7f' size="14"></uni-icons>
					</view>

					<!-- </view> -->
					<!-- <view v-else>
						<view @click="dormClick()" style="margin-right: 10px;">
							<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled :value="dormStr">
							</uni-easyinput-select>
						</view>
					</view> -->
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<uni-card isShadow @click="toDetails(item)" v-for="(item, index) in pagedata" :key="index">
				<uni-row>
					<uni-col :span="16">
						<view style='font-weight: 600;margin-bottom: 5px;font-size: 14px;color: #000000;'>
							{{item.sec_name}}</view>
					</uni-col>
					<uni-col :span="8">
						<view class="title-text" style="text-align: right;">{{item.dorm_room}}</view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="20">
						<view class="title-text">{{item.item_name}}</view>
					</uni-col>
					<uni-col :span="4">
						<view style="font-weight: 900;color: #d9001b;font-size: 26px;text-align: right;">
							{{parseInt(item.score)}}</view>
					</uni-col>
				</uni-row>
				<view class="title-text" style='color: #7f7f7f;font-size: 14px;'>
					<uni-icons type="person" size="16"></uni-icons>{{item.stuList.length>0?item.stuList:'--'}}
				</view>
			</uni-card>
			<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
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
		<!-- <uni-popup ref="dormPopup" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择宿舍</view>
			<view style="margin-left: 10px;font-size: 14px;color: 7f7f7f;">楼房：</view>
			<view style="margin: 0 10px;">
				<uni-grid :column="3">
					<uni-grid-item v-for="(item, index) in dormArray" :key="index"
						style="height: 50px;">
						<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='dormSelect(item, index)'
							:style="index==dormIndexTemp?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view style="margin-left: 10px;font-size: 14px;color: 7f7f7f;">楼层：</view>
			<view style="margin: 0 10px;">
				<uni-grid :column="4">
					<uni-grid-item v-for="(item, index) in floorArrayTemp" :key="index"
						style="height: 40px;">
						<view class="grid-item-box gridBox" @click='floorSelect(item, index)'
							:style="index==floorIndexTemp?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view style="margin-left: 10px;font-size: 14px;color: 7f7f7f;">宿舍：</view>
			<view style="margin: 0 10px;">
				<uni-grid :column="4">
					<uni-grid-item v-for="(item, index) in roomArrayTemp" :key="index"
						style="height: 40px;">
						<view class="grid-item-box gridBox" @click='roomSelect(item, index)'
							:style="index==roomIndexTemp?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view style="height: 50px;margin-top: 10px;">
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #049f95;border-color: #049f95;color: #ffffff;"
					@click="dormPopSure(1)">确定</button>
				<button class="mini-btn" style="margin-left: 50px;" type="default" size="mini"
					@click="dormPopSure(0)">取消</button>
			</view>
			<view style="height: 5px;"></view>
		</uni-popup> -->
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

				// dormIndex: 0,
				// dormIndexTemp: 0,
				// dormArray: [{
				// 	text: '',
				// 	value: ''
				// }],
				// floorIndex: 0,
				// floorArray: [{
				// 	text: '',
				// 	value: ''
				// }],
				// floorIndexTemp: 0,
				// floorArrayTemp: [{
				// 	text: '',
				// 	value: ''
				// }],
				// roomIndex: 0,
				// roomArray: [{
				// 	text: '',
				// 	value: ''
				// }],
				// roomIndexTemp: 0,
				// roomArrayTemp: [{
				// 	text: '',
				// 	value: ''
				// }],
				// dormStr: '',
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
				defTime: this.moment().format('YYYY-MM-DD'),
			}
		},
		components: {
			mynavBar
		},
		methods: {
			changeDate(e) {
				if (this.defTime != e) {
					this.defTime = e;
					this.showLoading()
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getList0();
				}
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
				this.grdIndexTemp = this.grdIndex;
				this.clsIndexTemp = this.clsIndex;
				this.clsArrayTemp = JSON.parse(JSON.stringify(this.clsArray));
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
			// dormSelect(item, index) {
			// 	if (this.dormIndexTemp != index) {
			// 		this.dormIndexTemp = index;
			// 		this.floorIndexTemp = 0;
			// 		this.floorArrayTemp = this.dormArray[this.dormIndexTemp].floor_array;
			// 		this.getQueryRoom();
			// 	}
			// },
			// floorSelect(item, index) {
			// 	if (this.floorIndexTemp != index) {
			// 		this.floorIndexTemp = index;
			// 		this.getQueryRoom();
			// 	}
			// },
			// dormSelect(item, index) {
			// 	if (this.clsIndexTemp != index) {
			// 		this.clsIndexTemp = index;
			// 	}
			// },
			// dormClick(){
			// 	this.$refs.dormPopup.open()
			// },
			// dormPopSure(flag) {
			// 	this.$refs.dormPopup.close();
			// 	// if (flag == 0) {
			// 	// 	this.grdIndexTemp = this.grdIndex;
			// 	// 	this.clsArrayTemp = this.clsArray;
			// 	// 	this.clsIndexTemp = this.clsIndex;
			// 	// } else {
			// 	// 	this.grdIndex = this.grdIndexTemp;
			// 	// 	this.clsArray = this.clsArrayTemp;
			// 	// 	this.clsIndex = this.clsIndexTemp;
			// 	// 	this.showLoading()
			// 	// 	this.pageobj0.loadFlag = 0
			// 	// 	this.pageobj0.canload = true
			// 	// 	this.pageobj0.page_number = 1
			// 	// 	this.getList0();
			// 	// 	this.grdClsStr = this.grdArray[this.grdIndex].text + this.clsArray[this.clsIndex].text;
			// 	// }
			// },
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
					let grdArray = [];
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
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'cls', comData, response => {
					this.hideLoading()
					let clss = response.list;
					let clsArray = [];
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
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			iconClick() {
				if (this.navItem.fir_id < 4) {
					util.openwithData('/pages/bjlhkp/record_add1', {
						index_code: _this.index_code,
						fir_id: this.navItem.fir_id
					}, {
						refreshRecordList(data) { //子页面调用父页面需要的方法
							_this.showLoading()
							_this.pageobj0.loadFlag = 0
							_this.pageobj0.canload = true
							_this.pageobj0.page_number = 1
							_this.getList0()
						}
					})
				} else {
					util.openwithData('/pages/bjlhkp/record_add2', {
						index_code: _this.index_code,
						fir_id: this.navItem.fir_id
					}, {
						refreshRecordList(data) { //子页面调用父页面需要的方法
							_this.showLoading()
							_this.pageobj0.loadFlag = 0
							_this.pageobj0.canload = true
							_this.pageobj0.page_number = 1
							_this.getList0()
						}
					})
				}
			},
			getQueryDorm() {
				//7.基本信息-获取楼房信息
				let comData = {
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM1 + 'dorm/queryDorm', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						if (data.data.list && data.data.list.length > 0) {
							this.dormArray = data.data.list;
							this.dormArrayTemp = data.data.list;
							this.floorArray = this.dormArray[this.dormIndex].floor_array;
							this.floorArrayTemp = this.dormArray[this.dormIndex].floor_array;
							this.getQueryRoom();
						} else {
							this.dormArray = [];
							this.floorArray = [];
							this.dormArrayTemp = [];
							this.floorArrayTemp = [];
							this.showToast('没有楼房信息');
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getQueryRoom() {
				//8.基本信息-获取房间信息
				let comData = {
					dorm_name: this.dormArray[this.dormIndex].value,
					floor_num: this.floorArray[this.floorIndex].value,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM1 + 'dorm/queryRoom', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						if (data.data.list && data.data.list.length > 0) {
							this.roomArray = data.data.list;
							this.roomArrayTemp = data.data.list;
							this.dormStr = this.dormArray[this.dormIndex].text + this.floorArray[this.floorIndex]
								.text + '层' + this.roomArray[this.roomIndex].text;
						} else {
							this.roomArray = [];
							this.roomArrayTemp = [];
							this.showToast('没有房间信息');
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getList0() { //获取页面数据
				let comData = {
					user_code: this.personInfo.user_code,
					kp_date: this.defTime,
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					fir_id: this.navItem.fir_id,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'score/page', comData, response => {
					setTimeout(function() {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if (response != null && response.list.length > 0) {
						response.list.map(item => {
							var stuList = [];
							var bedList = [];
							item.stu_list.map(titem => {
								stuList.push(titem.stu_name);
								if (titem.dorm_bed) {
									bedList.push(titem.dorm_bed);
								}
							})
							item.stuList = stuList.join(',');
							item.bedList = bedList.join(',');
						})
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
				// util.openwithData('/pages/bjlhkp/record_detail', item, {})
				item.fir_id = this.navItem.fir_id;
				util.openwithData('/pages/bjlhkp/record_detail', item);
			}
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index = 100
			this.navItem = itemData;
			this.index_code = itemData.access.split("#")[1]
			setTimeout(() => {
				// this.showLoading()
				// this.getPermissionByPosition('add', this.index_code, result => {
				// 	if (result[0]) {
				this.icon = 'plusempty'
				// }
				// 	this.hideLoading();
				// })
				// if (this.navItem.fir_id<4) {
				this.getGrd();
				// } else{
				// 	this.getQueryDorm();
				// }
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
</style>
