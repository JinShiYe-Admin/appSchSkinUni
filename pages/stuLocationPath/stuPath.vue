<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view>
			<view class="stuName">{{btime}}{{stuModel.grd_name}}{{stuModel.cls_name}}{{stuModel.stu_name}}运动轨迹</view>
			<uni-list>
				<uni-list-item v-for="(model,index) in pagedata" :key='index' direction='column'>
					<view slot="body">
						<view class="rightView">
							<view class="title" style="font-size: 15px;">{{model.locationStr}}</view>
							<view class="title" style="color: gray;">{{model.card_stime}} <span v-if='model.card_etime'> ~ {{model.card_etime}}</span></view>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
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
				tabBarItem: {},
				pageSize: 15,
				pagedata: [],
				deviceList: [], //设备位置数组
				index_code: '',
				stuModel: {},
				btime: ''
			}
		},
		components: {
			mynavBar
		},
		methods: {
			getAttendanceList() { //115.出入型设备-刷卡列表
				let comData = {
					begintime: this.btime, //开始时间
					endtime: this.btime, //结束时间
					index_code: this.index_code,
					grd_code: this.stuModel.grd_code,
					cls_code: this.stuModel.cls_code,
					stu_code: this.stuModel.stu_code,
					pageNumber: 1,
					pageSize: 999
				}
				this.post(this.globaData.INTERFACE_WORK + 'AttendanceReport/cardList', comData, (data0, data) => {
					console.log("cardList: " + JSON.stringify(data));
					this.hideLoading();
					if (data.code == 0) {
						// 
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							tempM.card_stime = tempM.card_time;
							tempM.locationStr = tempM.attendance_location;
						}
						this.pagedata = this.pagedata.concat(data.data.list);
						// 
						this.pagedata.sort(util.compare('card_stime', 0));
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getList0() { //获取页面数据
				this.pagedata = [];
				if(this.stuModel.card_no){
					let comData = {
						cardids: this.stuModel.card_no, //用户蓝牙卡ID串
						mtp: 8, //机器类型,8,蓝牙识别
						btime: this.btime,
						page_number: 1, //当前页数
						page_size: 999, //每页记录数
						index_code: this.index_code,
					}
					this.showLoading();
					this.post(this.globaData.INTERFACE_UCARD + 'blemachcardpositiondp', comData, response => {
						console.log("responseaaa: " + JSON.stringify(response));
						this.hideLoading();
						uni.stopPullDownRefresh();
						for (var a = 0; a < response.list.length; a++) {
							let tempM1 = response.list[a];
							for (var b = 0; b < this.deviceList.length; b++) {
								let tempM2 = this.deviceList[b];
								if (tempM1.mach_id == tempM2.mach_id) {
									tempM1.locationStr = tempM2.attendance_location;
								}
							}
							this.pagedata.push(tempM1);
						}
						// 获取出入型设备考勤记录
						this.getAttendanceList();
					})
				}else{
					// 获取出入型设备考勤记录
					this.getAttendanceList();
				}
			}
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			let tempM = util.getPageData(option);
			this.index_code = tempM.index_code;
			tempM.tabBarItem.index = 100;
			this.tabBarItem = tempM.tabBarItem;
			this.deviceList = tempM.deviceList;
			this.stuModel = tempM.stuModel;
			console.log('this.stuModel:' + JSON.stringify(this.stuModel));
			this.btime = tempM.btime;
			//#ifndef APP-PLUS
			document.title = ""
			//#endif

			this.getList0();
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
		onPullDownRefresh() {
			// this.pageobj0.loadFlag=0
			// this.pageobj0.canload=true
			// this.pageobj0.page_number=1
			this.getList0()
			// setTimeout(function () {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
	}
</script>

<style>
	.stuName {
		text-align: center;
		margin-top: 10px;
		margin-bottom: 10px;
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
</style>
