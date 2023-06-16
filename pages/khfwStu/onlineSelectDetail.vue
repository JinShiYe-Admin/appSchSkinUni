<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="rightText" :textClick="textClick">
		</mynavBar>
		<view style="text-align: center;font-size: 16px;font-weight: 700;margin: 20px;">{{navItem.name}}</view>
		<view style="font-size: 14px;margin-left: 15px;">
			{{navItem.status==0?'暂未开始选课':navItem.status==1?'请选择您的课后服务课程':'已选课程'}}</view>
		<view class="cardLine"></view>
		<view v-if="navItem.status==1&&navItem.remark"
			style="float: right;margin: -20px 15px 0 0;font-size: 14px;color: rgb(44, 150, 189);" @click="showPop()">选课须知</view>
		<!-- <uni-card isShadow style="margin: 20px 5px 5px;"> -->
		<view style="margin: 15px;">
			<uni-row style="margin: 0 -10px;">
				<uni-col :span="3">
					<view class="rowStyle" style="border:1px solid transparent"></view>
				</uni-col>
				<uni-col :span="3" v-for="(item,index) in tempArr1" :key="index">
					<view class="rowStyle">{{item}}</view>
				</uni-col>
				<view style="margin-top: 10px;">
					<view v-for="(item0,index0) in pageData" :key="index0">
						<uni-col :span="3">
							<view class="rowClass" style="background: #e1d3be;"
								:style="{height:(172*item0.child.length-2)+'px'}">
								<view class="rowStyle" style="padding-top: 10px;">
									{{item0.name}}
								</view>
								<view class="rowStyle">{{item0.start_time}}</view>
								<view class="rowStyle">-</view>
								<view class="rowStyle">{{item0.end_time}}</view>
							</view>
						</uni-col>
						<view v-for="(item1,index1) in item0.child" :key="index1">
							<view v-for="(item2,index2) in item1.child" :key="index2">
								<uni-col :span="3" v-if="item2.setValue == 1">
									<view class="rowClass"
										:style="{background:item2.sel_sign == 1?'#2c96bd':'#f2f2f2',color:item2.sel_sign == 1?'white':''}"
										@click="clickSign(item2)">
										<view class="rowStyle" style="font-weight: 900;padding-top: 10px;">
											{{item2.sub_name}}</view>
										<view class="rowStyle" style="transform: scale(0.9);margin-top: 5px;">
											{{item2.tec_list.length>0?item2.tec_list[0].tec_name:''}}
										</view>
										<view class="rowStyle" style="transform: scale(0.9);margin-top: 5px;">
											{{item2.addr_list.length>0?item2.addr_list[0].address:''}}
										</view>
										<view class="rowStyle" style="padding-top: 10px;">
											{{item2.stu_count}}/{{item2.limit_num}}</view>
									</view>
								</uni-col>
								<uni-col :span="3" v-else>
									<view class="rowClass" style="background: #f2f2f2;"></view>
								</uni-col>
							</view>
						</view>
					</view>
				</view>
			</uni-row>
		</view>
		<!-- </uni-card> -->
		<uni-popup ref="popup" type="center" background-color="#fff" style="min-width: 300px;">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">选课须知</view>
			<view style="margin: 15px 10px;">
				{{navItem.remark}}
			</view>
			<view class="popClose" @click="closePop()">关闭</view>
			<view style="height: 10px;"></view>
		</uni-popup>
		<view style="height: 1px;background: white;"></view>
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
				navItem: {},
				rightText: '',
				tempArr1: ['一', '二', '三', '四', '五', '六', '日'],
				pageData: [],
			}
		},
		components: {
			mynavBar
		},
		methods: {
			unique (arr) {
			  return Array.from(new Set(arr))
			},
			textClick() {
				var tempArr = [];
				for (var i = 0; i < this.pageData.length; i++) {
					var tempM0 = this.pageData[i];
					for (var a = 0; a < tempM0.child.length; a++) {
						var tempM1 = tempM0.child[a];
						for (var b = 0; b < tempM1.child.length; b++) {
							var tempM2 = tempM1.child[b];
							if (tempM2.sel_sign&&tempM2.sel_sign==1) {
								tempArr.push(tempM2.after_class_sub_id);
							}
						}
					}
				}
				if (tempArr.length == 0) {
					this.showToast('请先选择课程');
					return;
				}
				tempArr = this.unique(tempArr);
				let comData = {
					id: this.navItem.id,
					grd_code: this.personInfo.grd_code,
					grd_name: this.personInfo.grd_name,
					cls_code: this.personInfo.cls_code,
					cls_name: this.personInfo.cls_name,
					stu_code: this.personInfo.stu_code,
					stu_name: this.personInfo.stu_name,
					// sno: this.personInfo.grd_code,
					after_class_sub_ids: tempArr.join(','),
					index_code: this.index_code,
				}
				this.hideLoading();
				// 在线选课保存
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassOnline/saveSubStu', comData, (data0, data) => {
					this.hideLoading();
					this.showToast(data.msg);
					if (data.code == 0) {
						uni.navigateBack();
					}
				});
			},
			showPop(){
				this.$refs.popup.open();
			},
			closePop(){
				this.$refs.popup.close();
			},
			clickSign(model){
				// 选课中，非教师安排
				if (this.navItem.status == 1&&model.data_type!='1') {
					// console.log('this.pageData:'+JSON.stringify(this.pageData));
					// 判断选中还是取消
					if (model.sel_sign == 0) {//选中
						// 判断是否和别的已选课程，有课时冲突
						var tempFlag = 0;
						for (var i = 0; i < this.pageData.length; i++) {
							var tempM0 = this.pageData[i];
							for (var a = 0; a < tempM0.child.length; a++) {
								var tempM1 = tempM0.child[a];
								for (var b = 0; b < tempM1.child.length; b++) {
									var tempM2 = tempM1.child[b];
									if (model.after_class_sub_id==tempM2.after_class_sub_id) {
										// console.log('tempM2:'+JSON.stringify(tempM2));
										for (var c = 0; c < tempM0.child.length; c++) {
											var tempM3 = tempM0.child[c].child[b];
											if (tempM3.sel_sign == 1) {
												// console.log('tempM3:'+JSON.stringify(tempM3));
												tempFlag++;
												this.showToast('所选课程与'+tempM3.sub_name+'时间冲突，不能选择，请先取消选择'+tempM3.sub_name);
												return;
											}
										}
									}
								}
							}
						}
						// console.log('00000000:'+tempFlag);
						// 没有数据冲突，则将课程、地点、老师一致的选中
						for (var i = 0; i < this.pageData.length; i++) {
							var tempM0 = this.pageData[i];
							for (var a = 0; a < tempM0.child.length; a++) {
								var tempM1 = tempM0.child[a];
								for (var b = 0; b < tempM1.child.length; b++) {
									var tempM2 = tempM1.child[b];
									if (model.after_class_sub_id==tempM2.after_class_sub_id&&JSON.stringify(model.tec_list)==JSON.stringify(tempM2.tec_list)&&JSON.stringify(model.addr_list)==JSON.stringify(tempM2.addr_list)) {
										tempM2.sel_sign = 1;
									}
								}
							}
						}
					} else{//取消
						for (var i = 0; i < this.pageData.length; i++) {
							var tempM0 = this.pageData[i];
							for (var a = 0; a < tempM0.child.length; a++) {
								var tempM1 = tempM0.child[a];
								for (var b = 0; b < tempM1.child.length; b++) {
									var tempM2 = tempM1.child[b];
									if (model.after_class_sub_id==tempM2.after_class_sub_id&&JSON.stringify(model.tec_list)==JSON.stringify(tempM2.tec_list)&&JSON.stringify(model.addr_list)==JSON.stringify(tempM2.addr_list)) {
										tempM2.sel_sign = 0;
									}
								}
							}
						}
					}
				} else if(this.navItem.status == 1&&model.data_type=='1'){
					this.showToast('预选课程，如需取消，请联系学校！');
				}
			},
			getStuSchedule() {
				let comData = {
					id: this.navItem.id,
					grd_code: this.personInfo.grd_code,
					stu_code: this.personInfo.stu_code,
					index_code: this.index_code,
				}
				this.hideLoading();
				// 在线选课课程表
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassOnline/stuSchedule', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.selectModel = {};
						if (data.data.list.length == 0) {
							this.showToast('暂无数据');
							this.pageData = [];
							return;
						}
						var tempArr0 = [];
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM0 = data.data.list[i];
							tempArr0.push({
								time_name: tempM0.time_name,
								name: tempM0.name,
								start_time: tempM0.start_time.slice(0, 5),
								end_time: tempM0.end_time.slice(0, 5),
								child: []
							});
						}
						tempArr0 = util.ArrayUnique(tempArr0, 'time_name');
						tempArr0.sort(util.compare('start_time', 1));
						// 将课程按照周一到周日，形成数组
						var tempArr1 = JSON.parse(JSON.stringify(tempArr0));
						for (var i = 0; i < tempArr1.length; i++) {
							var tempM = tempArr1[i];
							for (var a = 1; a < 8; a++) {
								tempM.child.push({
									week_code: a == 7 ? 0 : a,
									child: []
								})
							}
						}
						for (var i = 0; i < tempArr1.length; i++) {
							var tempM0 = tempArr1[i];
							for (var a = 0; a < tempM0.child.length; a++) {
								var tempM1 = tempM0.child[a];
								for (var b = 0; b < data.data.list.length; b++) {
									var tempM2 = data.data.list[b];
									if (tempM0.time_name == tempM2.time_name && tempM2.week_code == tempM1
										.week_code) {
										tempM2.setValue = 1;
										tempM2.selectFlag = 0; //是否点击选中
										tempM1.child.push(tempM2);
									}
								}
							}
						}
						for (var i = 0; i < tempArr0.length; i++) {
							var tempM00 = tempArr0[i];
							var tempIndex = 0;
							for (var m = 0; m < tempArr1[i].child.length; m++) {
								var tempM11 = tempArr1[i].child[m];
								tempIndex = tempM11.child.length > tempIndex ? tempM11.child.length : tempIndex;
							}
							// console.log('tempIndex:' + tempIndex)
							for (var m = 0; m < tempIndex; m++) {
								tempM00.child.push({
									child: []
								})
							}
							// console.log('tempM00:' + JSON.stringify(tempM00));
							for (var a = 0; a < tempM00.child.length; a++) {
								var tempM01 = tempM00.child[a];
								for (var n = 0; n < 7; n++) {
									var tempQ = tempArr1[i].child[n];
									if (tempQ.child[a] && tempQ.child[a].time_name == tempM00.time_name) {
										tempM01.child.push(tempQ.child[a]);
									} else {
										tempM01.child.push({
											week_code: a, //设置星期几
											setValue: 0 //判断当前model是否有数据 ，0无，1有
										});
									}
								}
							}
						}
						// console.log('tempArr03:' + JSON.stringify(tempArr0));
						this.pageData = tempArr0;
					} else {
						this.showToast(data.msg);
					}
				});
			}
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			const itemData = util.getPageData(options);
			this.navItem = itemData;
			this.navItem.text = '在线选课';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			this.index_code = itemData.index_code;
			if (this.navItem.status == 1) {
				this.rightText = '提交';
				if (this.navItem.remark) {
					setTimeout(() => {
						this.$refs.popup.open();
					}, 500)
				}
			}
			this.getStuSchedule();
			//#ifdef H5
			document.title = ""
			//#endif
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
	.cardLine {
		height: 1px;
		background: #d7d7d7;
		margin-left: -50px;
	}

	.rowStyle {
		font-size: 12px !important;
		text-align: center;
		word-break: break-all;
	}

	.rowClass {
		color: #333333;
		font-size: 10px !important;
		text-align: center;
		height: 170px;
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

	::v-deep .uni-popup .uni-popup__wrapper {
		min-width: 300px;
		min-height: 100px;
		border-radius: 5px;
	}

	.popClose {
		width: 100px;
		height: 30px;
		background: rgb(215, 215, 215);
		text-align: center;
		padding-top: 10px;
		border-radius: 5px;
		margin-left: calc((100% - 100px)/2);
	}
</style>