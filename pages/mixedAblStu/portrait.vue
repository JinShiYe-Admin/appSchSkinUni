<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="">
			<view v-for="item in listArray">
				<view v-if="item.mod_code == '1002'">
					<uni-card isShadow>
						<uni-row>
							<uni-col :span='8'>
								<view style='text-align: center;'>
									<image style='width: 70px;height: 70px;margin-top: 10px;'
										:src='item.mod_data.img_url'></image>
								</view>
							</uni-col>
							<uni-col :span='16'>
								<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_data.stu_name}}</view>
								<view class='detail-text'>{{item.mod_data.grd_name}}</view>
								<view class='detail-text'>{{item.mod_data.cls_name}}</view>
								<view class='detail-text'>{{item.mod_data.sno}}</view>
							</uni-col>
						</uni-row>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1004'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<view class="charts-box">
							<qiun-data-charts type="line"
								:opts="{dataLabel:false,dataPointShape:false,extra:{line:{type:'curve'}},xAxis:{labelCount:10}}" :chartData="chartSxl1004" />
						</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1005'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<view class="charts-box" style="margin-left: 10px;">
							<qiun-data-charts type="column" :opts="{dataLabel:false,dataPointShape:false,xAxis:{labelCount:10,rotateLabel:true,}}" :chartData="chartSxl1005" />
						</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1006'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<view class="charts-box" style="margin-left: 10px;">
							<qiun-data-charts type="column" :opts="{dataLabel:false,dataPointShape:false,xAxis:{labelCount:10,rotateLabel:true,}}" :chartData="chartSxl1006" />
						</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1007'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<!-- 需在appSchSkinUni/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js中，添加自定义yAxisDemo0 -->
						<view class="charts-box">
							<qiun-data-charts type="line"
								:opts="{dataLabel:false,dataPointShape:false,extra:{line:{type:'curve'}},xAxis:{labelCount:10,rotateLabel:true,},yAxis:{data:[{format:'yAxisDemo0',min:0,max:3}],splitNumber:3}}"
								:chartData="chartSxl1007" />
						</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1008'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<!-- 需在appSchSkinUni/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js中，添加自定义yAxisDemo0 -->
						<view class="charts-box">
							<qiun-data-charts type="line"
								:opts="{dataLabel:false,dataPointShape:false,extra:{line:{type:'curve'}},xAxis:{labelCount:10,rotateLabel:true,},yAxis:{data:[{format:'yAxisDemo0',min:0,max:3}],splitNumber:3}}"
								:chartData="chartSxl1008" />
						</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1009'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<!-- 需在appSchSkinUni/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js中，添加自定义yAxisDemo0 -->
						<view class="charts-box">
							<qiun-data-charts type="line"
								:opts="{dataLabel:false,dataPointShape:false,extra:{line:{type:'curve'}},xAxis:{labelCount:10,rotateLabel:true,},yAxis:{data:[{format:'yAxisDemo0',min:0,max:3}],splitNumber:3}}"
								:chartData="chartSxl1009" />
						</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1010'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.hobbies.length==0" class='detail-text' style="text-align: center;">暂无
						</view>
						<view v-if="item.mod_data.hobbies.length>0" class='detail-text'>{{item.mod_data.hobbies}}</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1011'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.award.length==0" class='detail-text' style="text-align: center;">暂无
						</view>
						<view v-if="item.mod_data.award.length>0" class='detail-text'>{{item.mod_data.award}}</view>
					</uni-card>
				</view>

			</view>
			<view style="height: 5px;"></view>
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
				index_code: '',
				personInfo: {},
				navItem: {},
				pagedata: [],
				listArray: '',
				chartSxl1004: {},
				chartSxl1005:{},
				chartSxl1006:{},
				chartSxl1007: {},
				chartSxl1008:{},
				chartSxl1009:{},
			}
		},
		components: {
			mynavBar
		},
		methods: {
			// setCharValue(val, index, opts){
			// 	if (val == 0) {
			// 		return 'D';
			// 	} else if (val == 1) {
			// 		return 'C';
			// 	}else if (val == 2) {
			// 		return 'B';
			// 	}else if (val == 3) {
			// 		return 'A';
			// 	}else{
			// 		return 'D';
			// 	}
			// },
			setCharValue(val) {
				if (val == 'A') {
					return 3;
				} else if (val == "B") {
					return 2;
				} else if (val == 'C') {
					return 1;
				} else if (val == 'D') {
					return 0;
				} else {
					return 0;
				}
			},
			getList0() { //获取页面数据
				let comData = {
					grd_code: this.personInfo.grd_code,
					cls_code: this.personInfo.cls_code,
					stu_code: this.personInfo.stu_code,
					index_code: this.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZHSZ + 'stu/diagram', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.mod_list.length; i++) {
							var tempM = data.data.mod_list[i];
							if (tempM.mod_code == '1002') {
								if (tempM.mod_data.img_url == null) {
									tempM.mod_data.img_url = 'https://www.108800.com/user.jpg';
								}
							} else if (tempM.mod_code == '1007') {
								var tempArr99 = [];
								var tempArr0 = [];
								var tempArr1 = [];
								var tempArr2 = [];
								var tempArr3 = [];
								var tempArr4 = [];
								var tempArr5 = [];
								var tempArr6 = [];
								var tempArr7 = [];
								var tempArr8 = [];
								var tempArr9 = [];
								var tempArr10 = [];
								var tempArr11 = [];
								var tempArr12 = [];
								var tempArr13 = [];
								var tempArr14 = [];
								var tempArr15 = [];
								for (var a = 0; a < tempM.mod_data.list.length; a++) {
									var tempL = tempM.mod_data.list[a];
									tempArr99.push('');
									// tempArr0.push(this.setCharValue(tempL.maths));
									// tempArr1.push(this.setCharValue(tempL.ch_skill));
									// tempArr2.push(this.setCharValue(tempL.political));
									// tempArr3.push(this.setCharValue(tempL.chinese));
									// tempArr4.push(this.setCharValue(tempL.music));
									// tempArr5.push(this.setCharValue(tempL.geography));
									// tempArr6.push(this.setCharValue(tempL.physics));
									// tempArr7.push(this.setCharValue(tempL.english));
									// tempArr8.push(this.setCharValue(tempL.p_skill));
									// tempArr9.push(this.setCharValue(tempL.chemistry));
									// tempArr10.push(this.setCharValue(tempL.art));
									// tempArr11.push(this.setCharValue(tempL.biology));
									// tempArr12.push(this.setCharValue(tempL.biol_skill));
									// tempArr13.push(this.setCharValue(tempL.history));
									// tempArr14.push(this.setCharValue(tempL.pe));
									// tempArr15.push(this.setCharValue(tempL.location));
									if (tempL.maths) {
										tempArr0.push(this.setCharValue(tempL.maths));
									} else{
										tempArr0.push();
									}
									if (tempL.ch_skill) {
										tempArr1.push(this.setCharValue(tempL.ch_skill));
									} else{
										tempArr1.push();
									}
									if (tempL.political) {
										tempArr2.push(this.setCharValue(tempL.political));
									} else{
										tempArr2.push();
									}
									if (tempL.chinese) {
										tempArr3.push(this.setCharValue(tempL.chinese));
									} else{
										tempArr3.push();
									}
									if (tempL.music) {
										tempArr4.push(this.setCharValue(tempL.music));
									} else{
										tempArr4.push();
									}
									if (tempL.geography) {
										tempArr5.push(this.setCharValue(tempL.geography));
									} else{
										tempArr5.push();
									}
									if (tempL.physics) {
										tempArr6.push(this.setCharValue(tempL.physics));
									} else{
										tempArr6.push();
									}
									if (tempL.english) {
										tempArr7.push(this.setCharValue(tempL.english));
									} else{
										tempArr7.push();
									}
									if (tempL.p_skill) {
										tempArr8.push(this.setCharValue(tempL.p_skill));
									} else{
										tempArr8.push();
									}
									if (tempL.chemistry) {
										tempArr9.push(this.setCharValue(tempL.chemistry));
									} else{
										tempArr9.push();
									}
									if (tempL.art) {
										tempArr10.push(this.setCharValue(tempL.art));
									} else{
										tempArr10.push();
									}
									if (tempL.biology) {
										tempArr11.push(this.setCharValue(tempL.biology));
									} else{
										tempArr11.push();
									}
									if (tempL.biol_skill) {
										tempArr12.push(this.setCharValue(tempL.biol_skill));
									} else{
										tempArr12.push();
									}
									if (tempL.history) {
										tempArr13.push(this.setCharValue(tempL.history));
									} else{
										tempArr13.push();
									}
									if (tempL.pe) {
										tempArr14.push(this.setCharValue(tempL.pe));
									} else{
										tempArr14.push();
									}
									if (tempL.location) {
										tempArr15.push(this.setCharValue(tempL.location));
									} else{
										tempArr15.push();
									}
								}
								var tempSum = [{
									name: "数学",
									data: tempArr0,
									format:'seriesDemo0'
								}, {
									name: "化学技能",
									data: tempArr1,
									format:'seriesDemo0'
								}, {
									name: "政治",
									data: tempArr2,
									format:'seriesDemo0'
								}, {
									name: "语文",
									data: tempArr3,
									format:'seriesDemo0'
								}, {
									name: "音乐",
									data: tempArr4,
									format:'seriesDemo0'
								}, {
									name: "地理",
									data: tempArr5,
									format:'seriesDemo0'
								}, {
									name: "物理",
									data: tempArr6,
									format:'seriesDemo0'
								}, {
									name: "英语",
									data: tempArr7,
									format:'seriesDemo0'
								}, {
									name: "物理技能",
									data: tempArr8,
									format:'seriesDemo0'
								}, {
									name: "化学",
									data: tempArr9,
									format:'seriesDemo0'
								}, {
									name: "美术",
									data: tempArr10,
									format:'seriesDemo0'
								}, {
									name: "生物",
									data: tempArr11,
									format:'seriesDemo0'
								}, {
									name: "生物技能",
									data: tempArr12,
									format:'seriesDemo0'
								}, {
									name: "历史",
									data: tempArr13,
									format:'seriesDemo0'
								}, {
									name: "体育",
									data: tempArr14,
									format:'seriesDemo0'
								}, {
									name: "当地课程",
									data: tempArr15,
									format:'seriesDemo0'
								}];
								this.chartSxl1007 = {
									categories: tempArr99,
									series: tempSum
								}
							}else if (tempM.mod_code == '1008') {
								var tempArr99 = [];
								var tempArr0 = [];
								var tempArr1 = [];
								var tempArr2 = [];
								var tempArr3 = [];
								var tempArr4 = [];
								for (var a = 0; a < tempM.mod_data.list.length; a++) {
									var tempL = tempM.mod_data.list[a];
									tempArr99.push('');
									// tempArr0.push(this.setCharValue(tempL.practice));
									// tempArr1.push(this.setCharValue(tempL.learning));
									// tempArr2.push(this.setCharValue(tempL.moral));
									// tempArr3.push(this.setCharValue(tempL.appreciation));
									// tempArr4.push(this.setCharValue(tempL.quality));
									if (tempL.practice) {
										tempArr0.push(this.setCharValue(tempL.practice));
									} else{
										tempArr0.push();
									}
									if (tempL.learning) {
										tempArr1.push(this.setCharValue(tempL.learning));
									} else{
										tempArr1.push();
									}
									if (tempL.moral) {
										tempArr2.push(this.setCharValue(tempL.moral));
									} else{
										tempArr2.push();
									}
									if (tempL.appreciation) {
										tempArr3.push(this.setCharValue(tempL.appreciation));
									} else{
										tempArr3.push();
									}
									if (tempL.quality) {
										tempArr4.push(this.setCharValue(tempL.quality));
									} else{
										tempArr4.push();
									}
								}
								var tempSum = [{
									name: "社会实践",
									data: tempArr0,
									format:'seriesDemo0'
								}, {
									name: "学业水平",
									data: tempArr1,
									format:'seriesDemo0'
								}, {
									name: "思想品德",
									data: tempArr2,
									format:'seriesDemo0'
								}, {
									name: "艺术素养",
									data: tempArr3,
									format:'seriesDemo0'
								}, {
									name: "身心健康",
									data: tempArr4,
									format:'seriesDemo0'
								}];
								this.chartSxl1008 = {
									categories: tempArr99,
									series: tempSum
								}
							} else if (tempM.mod_code == '1009') {
								var tempArr99 = [];
								var tempArr0 = [];
								var tempArr1 = [];
								var tempArr2 = [];
								var tempArr3 = [];
								for (var a = 0; a < tempM.mod_data.list.length; a++) {
									var tempL = tempM.mod_data.list[a];
									tempArr99.push('');
									// tempArr0.push(this.setCharValue(tempL.prac_lv));
									// tempArr1.push(this.setCharValue(tempL.labour_lv));
									// tempArr2.push(this.setCharValue(tempL.study_lv));
									// tempArr3.push(this.setCharValue(tempL.computer_lv));
									if (tempL.prac_lv) {
										tempArr0.push(this.setCharValue(tempL.prac_lv));
									} else{
										tempArr0.push();
									}
									if (tempL.labour_lv) {
										tempArr1.push(this.setCharValue(tempL.labour_lv));
									} else{
										tempArr1.push();
									}
									if (tempL.study_lv) {
										tempArr2.push(this.setCharValue(tempL.study_lv));
									} else{
										tempArr2.push();
									}
									if (tempL.computer_lv) {
										tempArr3.push(this.setCharValue(tempL.computer_lv));
									} else{
										tempArr3.push();
									}
								}
								var tempSum = [{
									name: "实践等级",
									data: tempArr0,
									format:'seriesDemo0'
								}, {
									name: "劳动等级",
									data: tempArr1,
									format:'seriesDemo0'
								}, {
									name: "学习等级",
									data: tempArr2,
									format:'seriesDemo0'
								}, {
									name: "信息技术等级",
									data: tempArr3,
									format:'seriesDemo0'
								}];
								this.chartSxl1009 = {
									categories: tempArr99,
									series: tempSum
								}
							}else if (tempM.mod_code == '1004') {
								var comData = {
									index_code: this.index_code,
									stu_code: this.personInfo.stu_code
								}
								this.showLoading();
								// 
								this.post(this.globaData.INTERFACE_STUSCORE + 'fullSub/stuGrdOrder', comData, (data0, data) => {
									this.hideLoading();
									if (data.code == 0) {
										var tempArr0 = [];
										var tempArr1 = [];
										for (var a = 0; a < data.data.list.length; a++) {
											var tempM = data.data.list[a];
											tempArr0.push('');
											tempArr1.push(tempM.grd_order);
										}
										this.chartSxl1004 = {
											categories: tempArr0,
											series: [{
												name: "年级总分排名",
												data: tempArr1
											}]
										}
									} else {
										this.showToast(data.msg);
									}
								});
							}else if (tempM.mod_code == '1005') {
								// 
								let end_month = this.moment().format('YYYY-MM-DD')
								let start_month = this.moment().subtract(6, 'M').format('YYYY-MM-DD');
								var comData = {
									index_code: this.index_code,
									begintime: start_month, //
									endtime:end_month,
									stu_code: this.personInfo.stu_code
								}
								this.showLoading();
								// 116.考勤报表-单个学生考核
								this.post(this.globaData.INTERFACE_WORK + 'AttendanceReport/statisticsAttendance4Student', comData, (data0,
									data) => {
									this.hideLoading();
									if (data.code == 0) {
										var tempArr0 = [];
										var tempArr1 = [];
										if (data.data.static) {
											for (var a = 0; a < data.data.qaArray.length; a++) {
												var tempM = data.data.qaArray[a];
												tempArr0.push(tempM.text);
												tempArr1.push(data.data.static[tempM.value]);
											}
										}
										
										this.chartSxl1005 = {
											categories: tempArr0,
											series: [{
												name: "考勤统计（次）",
												data: tempArr1
											}]
										}
									} else {
										this.showToast(data.msg);
									}
								});
							}else if (tempM.mod_code == '1006') {
								// 
								let end_month = this.moment().format('YYYY-MM-DD')
								let start_month = this.moment().subtract(6, 'M').format('YYYY-MM-DD');
								var comData = {
									index_code: this.index_code,
									begintime: start_month, //
									endtime:end_month,
									grd_code: this.personInfo.grd_code,
									cls_code: this.personInfo.cls_code,
									stu_code: this.personInfo.stu_code
								}
								this.showLoading();
								// 19.学生行为报表-学生报表
								this.post(this.globaData.INTERFACE_STUXWSUB + 'Report/statisticsStudentBehavior', comData, (data0,
									data) => {
									this.hideLoading();
									if (data.code == 0) {
										var tempArr0 = [];
										var tempArr1 = [];
										for (var a = 0; a < data.data.qbArray.length; a++) {
											var tempM = data.data.qbArray[a];
											tempArr0.push(tempM.text);
											if (data.data.staticArray[tempM.value]) {
												tempArr1.push(data.data.staticArray[tempM.value]);
											} else{
												tempArr1.push(0);
											}
										}
										this.chartSxl1006 = {
											categories: tempArr0,
											series: [{
												name: "行为统计（次）",
												data: tempArr1
											}]
										}
									} else {
										this.showToast(data.msg);
									}
								});
							}

						}
						this.listArray = data.data.mod_list;
					} else {
						this.showToast(data.msg);
					}
				})
			}
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index = 100
			this.navItem = itemData;
			this.index_code = itemData.access.split("#")[1];
			this.getList0();
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

	.leaveType {
		font-size: 12px;
		width: auto;
		color: #EFAD44;
		padding: 0px 3px;
		border-radius: 4px;
		margin-right: 3px;
		border: 1px solid #EFAD44;
	}

	.uni-input-input {
		font-size: 13px;
	}
</style>
