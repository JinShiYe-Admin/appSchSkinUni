<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view style="display: flex;">
				<picker style="flex: 1;" @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
					<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
						:value="grdArray[grdIndex].text"></uni-easyinput-select>
				</picker>
				<picker style="flex: 1;" @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
					<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
						:value="clsArray[clsIndex].text"></uni-easyinput-select>
				</picker>
				<picker style="flex: 1;" @change="stuClick" :value="stuIndex" :range="stuArray" range-key="text">
					<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
						:value="stuArray[stuIndex].text"></uni-easyinput-select>
				</picker>
				<view class="mini-date" style="flex: 1;">
					<dy-Date :childValue='endDate' timeType="day" v-on:getData='timeSelect' :minSelect='startDate'
						:maxSelect='endDate'></dy-Date>
					<uni-icons style="padding-right: 3px;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
				</view>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<view style="color: #939393;text-align: center;margin-top: 40px;" v-if="pagedata.length==0">暂无数据</view>
			<uni-list v-if='selectFlag == 1'>
				<uni-list-item v-for="(model,index) in pagedata" :key='index' direction='column'>
					<view slot="body">
						<view class="rightView">
							<view class="title" style="font-size: 15px;">{{model.locationStr}}</view>
							<view class="title" style="color: gray;">{{model.card_stime}}<span v-if='model.card_etime'> ~ {{model.card_etime}}</span></view>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
			<uni-list v-else-if='selectFlag == 0'>
				<uni-list-item showArrow v-for="(model,index) in pagedata" :key='index' direction='column' clickable
					@click="clickItem(model)">
					<view slot="body">
						<view class="rightView">
							<uni-row class="">
								<uni-col :span="12" class='title' style="font-size: 15px;">
									{{model.stu_name}}
								</uni-col>
								<uni-col :span="12" class='nameTime' style='text-align: right;'>
									{{model.endTime}}
								</uni-col>
							</uni-row>
							<view class="nameTime" :style="model.deviceFlag==0?'color:#FAA666;':''">
								{{model.locationStr}}
							</view>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
			<!-- <uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" /> -->
		</view>
		<u-tabbar-my v-if='tabBarItem.index<5' :list="tabbar"></u-tabbar-my>
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
				tabBarItem: {},
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
				selectFlag: 0, //0按照班级查，1按照具体人查
				pagedata: [],
				deviceList: [], //设备位置数组
				//顶部筛选框相关内容
				grdIndex: 0,
				clsIndex: 0,
				stuIndex: 0,
				grdArray: [{
					text: '',
					value: '-1'
				}],
				clsArray: [{
					text: '',
					value: '-1'
				}],
				stuArray: [{
					text: '',
					value: '-1'
				}],
				time: this.moment().format('YYYY-MM-DD'),
				startDate: this.moment().subtract(14, 'days').format('YYYY-MM-DD'),
				endDate: this.moment().format('YYYY-MM-DD')
			}
		},
		components: {
			mynavBar
		},
		methods: {
			clickItem: function(item) {
				if (item.deviceFlag == 0) {
					this.showToast('获取不到当前学生位置');
				} else {
					let model = {
						tabBarItem: this.tabBarItem,
						stuModel: item,
						deviceList: this.deviceList,
						btime: this.time,
						index_code: this.index_code
					}
					util.openwithData('/pages/stuLocationPath/stuPath', model);
				}
			},
			grdClick: function(e) {
				if (this.grdIndex !== e.detail.value) {
					this.grdIndex = e.detail.value
					this.clsIndex = 0
					this.clsArray = [];
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getCls();
				}
			},
			clsClick: function(e) {
				if (this.clsIndex !== e.detail.value) {
					this.clsIndex = e.detail.value;
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getStu();
				}
			},
			stuClick: function(e) {
				if (this.stuIndex !== e.detail.value) {
					this.stuIndex = e.detail.value;
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getList0();
				}
			},
			timeSelect(e) {
				this.time = e;
				this.pageobj0.loadFlag = 0
				this.pageobj0.canload = true
				this.pageobj0.page_number = 1
				this.getList0();
			},
			getDeviceList() { //108.定位监测设备列表
				let comData = {
					mach_type: -1, //设备类型,-1全部
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK + 'LocationAttendance/list', comData, data => {
					console.log("dataAAA: " + JSON.stringify(data));
					this.hideLoading();
					this.deviceList = [].concat(data.list);
				})
			},
			getAttendanceList() { //115.出入型设备-刷卡列表
				let stuCode = '';
				if(this.stuIndex == 0){
					stuCode = '';
				}else{
					stuCode = this.stuArray[this.stuIndex].stu_code;
				}
				let comData = {
					begintime: this.time, //开始时间
					endtime: this.time, //结束时间
					index_code: this.index_code,
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					stu_code: stuCode,
					pageNumber:1,
					pageSize:999
				}
				this.post(this.globaData.INTERFACE_WORK + 'AttendanceReport/cardList', comData, (data0,data) => {
					console.log("cardList: " + JSON.stringify(data));
					this.hideLoading();
					if(data.code == 0){
						if(stuCode.length==0){
							let tempA = util.ArrayUnique(data.data.list,'stu_code');
							for (var i = 0; i < this.pagedata.length; i++) {
								let tempM = this.pagedata[i];
								for (var a = 0; a < tempA.length; a++) {
									let tempStu = tempA[a];
									// code一样
									if(tempM.stu_code == tempStu.stu_code){
										if(tempM.deviceFlag == 0){//之前没有写入过数据，直接赋值
											tempM.deviceFlag = 1;
											tempM.endTime = tempStu.card_time;
											tempM.locationStr = tempStu.attendance_location;
										}else{
											if(tempStu.card_time>tempM.endTime){//现在的时间，大于之前的，覆盖
												tempM.endTime = tempStu.card_time;
												tempM.locationStr = tempStu.attendance_location;
											}
										}
									}
								}
							}
						}else{
							// card_stime
							for (var i = 0; i < data.data.list.length; i++) {
								let tempM = data.data.list[i];
								tempM.card_stime = tempM.card_time;
								tempM.locationStr = tempM.attendance_location;
							}
							this.pagedata = this.pagedata.concat(data.data.list);
							console.log('this.pagedataAA:'+JSON.stringify(this.pagedata));
							// this.pagedata
							this.pagedata.sort(util.compare('card_stime',0));
						}
					}else{
						this.showToast(data.msg);
					}
				})
			},
			getGrd() { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					console.log("responseaaa: " + JSON.stringify(response));
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
						this.getCls();
					} else {
						this.grdArray = [];
						this.pagedata = [];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls() { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					get_cls: true,
					all_cls: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					console.log("responseaaa: " + JSON.stringify(response));
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
						this.clsArray = clsArray;
						this.getStu()
					} else {
						this.clsArray = [];
						this.pagedata = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getStu() { //获取班级学生
				let comData = {
					grd_codes: this.grdArray[this.grdIndex].value,
					cls_codes: this.clsArray[this.clsIndex].value,
					page_size: 1,
					page_number: -1,
					mtp: 8,
					order: 'stu_name',
					sort: 'ASC',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'stu', comData, response => {
					console.log("responseaaa--stu: " + JSON.stringify(response));
					this.hideLoading();
					this.pagedata = [];
					let stuArray = [];
					if (response.list.length > 0) {
						let obj = {};
						obj.value = '-1';
						obj.text = '全部学生';
						stuArray.push(obj);
					} else {
						let obj = {};
						obj.value = '-1';
						obj.text = '暂无学生';
						stuArray.push(obj);
					}
					for (var i = 0; i < response.list.length; i++) {
						let tempM = response.list[i];
						tempM.value = tempM.stu_code;
						tempM.text = tempM.stu_name;
						tempM.locationStr = '检测不到位置';
						stuArray.push(tempM);
					}
					if (stuArray.length > 1) {
						this.stuArray = stuArray;
						this.getList0()
					} else {
						this.stuArray = stuArray;
						// this.showToast('暂无学生');
					}
				})
			},
			getList0() { //获取页面数据
				this.pagedata = [];
				let tempId = [];
				if (this.stuIndex == 0) {
					this.selectFlag = 0;
					for (var i = 0; i < this.stuArray.length; i++) {
						let tempM = this.stuArray[i];
						if (tempM.card_no) {
							tempId.push(tempM.card_no);
						}
					}
					if (tempId.length == 0) {
						return;
					}
					let comData = {
						cardids: tempId.join(','), //用户蓝牙卡ID串
						mtp: 8, //机器类型,8,蓝牙识别
						btime: this.time,
						page_number: 1, //当前页数
						page_size: 999, //每页记录数
						index_code: this.index_code,
					}
					this.showLoading();
					this.post(this.globaData.INTERFACE_UCARD + 'blemachcardpositionfp', comData, response => {
						console.log("responseaaa: " + JSON.stringify(response));
						this.hideLoading();
						uni.stopPullDownRefresh();
						let tempArray = [];
						for (var i = 0; i < this.stuArray.length; i++) {
							let tempM0 = this.stuArray[i];
							tempM0.endTime = '';
							tempM0.deviceFlag = 0;
							if (response) {
								for (var a = 0; a < response.list.length; a++) {
									let tempM1 = response.list[a];
									if (tempM0.card_no == tempM1.card_id) {
										for (var b = 0; b < this.deviceList.length; b++) {
											let tempM2 = this.deviceList[b];
											if (tempM1.mach_id == tempM2.mach_id) {
												tempM0.locationStr = tempM2.attendance_location;
												tempM0.endTime = tempM1.card_etime;
												tempM0.deviceFlag = 1;
											}
										}
									}
								}
							}
							if (tempM0.value != '-1') {
								tempArray.push(tempM0);
							}
						}
						this.pagedata = this.pagedata.concat(tempArray);
						// 获取出入型设备考勤记录
						this.getAttendanceList();
					})
				} else {
					this.selectFlag = 1;
					let tempStu = this.stuArray[this.stuIndex];
					console.log('tempStu:' + JSON.stringify(tempStu));
					if (tempStu.card_no == null) {
						return;
					}
					let comData = {
						cardids: tempStu.card_no, //用户蓝牙卡ID串
						mtp: 8, //机器类型,8,蓝牙识别
						btime: this.time,
						page_number: 1, //当前页数
						page_size: 999, //每页记录数
						index_code: this.index_code,
					}
					this.showLoading();
					this.post(this.globaData.INTERFACE_UCARD + 'blemachcardpositiondp', comData, response => {
						console.log("responseaaa: " + JSON.stringify(response));
						uni.stopPullDownRefresh();
						this.hideLoading();
						let tempArray = [];
						for (var a = 0; a < response.list.length; a++) {
							let tempM1 = response.list[a];
							for (var b = 0; b < this.deviceList.length; b++) {
								let tempM2 = this.deviceList[b];
								if (tempM1.mach_id == tempM2.mach_id) {
									tempM1.locationStr = tempM2.attendance_location;
								}
							}
							tempArray.push(tempM1);
						}
						this.pagedata = this.pagedata.concat(tempArray);
						// 获取出入型设备考勤记录
						this.getAttendanceList();
					})
				}
			}
		},
		onLoad() {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			});
			
			// 获取未读推送消息数的监听
			uni.$on('setPushCount', function(data) {
				_this.tabbar = util.getMenu();
				for (var i = 0; i < _this.tabbar.length; i++) {
					let tempM = _this.tabbar[i];
					if(tempM.access == _this.tabBarItem.access){
						_this.tabBarItem = tempM;
					}
				}
			});
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			this.tabBarItem = util.getTabbarMenu();
			this.index_code = this.tabBarItem.access.split("#")[1];
			// 108.定位监测设备列表
			this.getDeviceList();
			// 
			this.getGrd();
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
		},
		onPullDownRefresh() {
			// this.pageobj0.loadFlag=0
			// this.pageobj0.canload=true
			// this.pageobj0.page_number=1
			this.getList0()
			// setTimeout(function () {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		// onReachBottom() {
		// 	if(this.pageobj0.canload){
		// 		this.pageobj0.loadFlag=1
		// 		this.pageobj0.status = 'loading';
		// 		this.pageobj0.page_number=this.pageobj0.page_number+1
		// 		this.getList0()
		// 	}
		// },
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
	}
</script>

<style>
	.moreImg {
		width: 35px;
		height: 35px;
	}

	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}

	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.content {
		margin: 2px 0;
	}

	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
	}

	.line {
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}

	.title-text {
		display: flex;
		align-items: center;
		width: 80vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.detail-text {
		color: #939393;
		font-size: 12px;
		margin: 3px 0;
	}

	.tow-line {
		overflow: hidden;
		width: 85vw;
		text-overflow: ellipsis;
		white-space: nowrap;
		/* 		 text-overflow: -o-ellipsis-lastline;
		 overflow: hidden;
		 text-overflow: ellipsis;
		 display: -webkit-box;
		 -webkit-line-clamp: 2;
		 -webkit-box-orient: vertical; */
	}

	.leaveType {
		font-size: 12px;
		width: 48px;
		color: #EFAD44;
		padding: 0px 3px;
		border-radius: 4px;
		margin-right: 3px;
		border: 1px solid #EFAD44;
	}

	.uni-input-input {
		font-size: 13px;
	}

	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100%);
	}

	.title {
		font-size: 13px;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 5px;
	}

	.nameTime {
		margin-top: 5px;
		font-size: 13px;
		color: gray;
	}

	::v-deep .uni-list--border-top {
		height: 0px;
	}

	::v-deep .uni-list--border-bottom {
		height: 0px;
	}
</style>
