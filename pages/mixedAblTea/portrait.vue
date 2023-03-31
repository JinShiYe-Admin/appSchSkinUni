<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<uni-row>
				<uni-col :span="8">
					<picker class="flex-box" @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
						<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
							{{grdArray[grdIndex].text}}
							<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
						</view>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
						<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
							{{clsArray[clsIndex].text}}
							<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
						</view>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="stuClick" :value="stuIndex" :range="stuArray" range-key="text">
						<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
							{{stuArray[stuIndex].text}}
							<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
						</view>
					</picker>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<view v-for="item in listArray">
				<view v-if="item.mod_type == '2'&&item.mod_code == '1002'">
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
								:opts="{padding:[20,0,10,0],legend:{show:false,borderWidth:10},extra:{column:{categoryGap:1}},dataLabel:false,dataPointShape:false,xAxis:{disabled:true}}"
								:chartData="chartSxl1004" />
						</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1005'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<view class="charts-box" style="margin-left: 10px;">
							<qiun-data-charts type="column"
								:opts="{padding:[20,0,10,0],legend:{show:false,borderWidth:10},extra:{column:{categoryGap:1}},dataLabel:false,dataPointShape:false,xAxis:{disabled:true}}"
								:chartData="chartSxl1005" />
						</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1006'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<view class="" style="">
							<qiun-data-charts type="column"
								:opts="{padding:[20,0,10,0],legend:{show:false,borderWidth:10},extra:{column:{categoryGap:1}},dataLabel:false,dataPointShape:false,xAxis:{disabled:true}}"
								:chartData="chartSxl1006" />
						</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1007'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<!-- 需在appSchSkinUni/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js中，添加自定义yAxisDemo0 -->
						<view class="charts-box">
							<qiun-data-charts type="line"
								:opts="{legend:{lineHeight:25,float:'left'},dataLabel:false,dataPointShape:false,extra:{line:{type:'curve',tooltip:{}}},xAxis:{rotateLabel:true,disabled:true},yAxis:{data:[{format:'yAxisDemo0',min:0,max:3}],splitNumber:3}}"
								:chartData="chartSxl1007" />
							<!-- <qiun-data-charts type="line" :tooltipShow="false" @getIndex="showMyTooltip1007"
								:opts="optsTooltip1007" :chartData="chartSxl1007" /> -->
						</view>
					</uni-card>
				</view>
				
				<view v-if="item.mod_code == '1008'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<!-- 需在appSchSkinUni/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js中，添加自定义yAxisDemo0 -->
						<view class="charts-box">
							<qiun-data-charts type="line"
								:opts="{legend:{lineHeight:25,float:'left'},dataLabel:false,dataPointShape:false,extra:{line:{type:'curve'},tooltip:{}},xAxis:{labelCount:10,rotateLabel:true,disabled:true},yAxis:{data:[{format:'yAxisDemo0',min:0,max:3}],splitNumber:3}}"
								:chartData="chartSxl1008" />
							<!-- <qiun-data-charts type="line" :tooltipShow="false" @getIndex="showMyTooltip1007"
								:opts="optsTooltip1007" :chartData="chartSxl1008" /> -->
							<!-- 此处改变的是 seriesTemplate 模板中的默认配置，不必每个series都传smooth:true，将会覆盖:chartData.series 实现更低的代码量 -->
							<!-- <qiun-data-charts type="line" :opts="{extra:{line:{type:'curve'}}}" :eopts="{seriesTemplate:{smooth:true}}" :chartData="chartSxl1008" :echartsH5="true" :echartsApp="true"/> -->
						</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1009'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-top: 5px;'>{{item.mod_name}}</view>
						<!-- 需在appSchSkinUni/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js中，添加自定义yAxisDemo0 -->
						<view class="charts-box">
							<qiun-data-charts type="line"
								:opts="{legend:{lineHeight:25,float:'left'},dataLabel:false,dataPointShape:false,extra:{line:{type:'curve'}},xAxis:{labelCount:10,rotateLabel:true,disabled:true},yAxis:{data:[{format:'yAxisDemo0',min:0,max:3}],splitNumber:3}}"
								:chartData="chartSxl1009" />
							<!-- <qiun-data-charts type="line" :opts="{extra:{line:{type:'curve'}}}" :eopts="{seriesTemplate:{smooth:true}}" :chartData="chartSxl1009" :echartsH5="true" :echartsApp="true"/> -->
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
	import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/config-ucharts.js';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				pagedata: [],
				//顶部筛选框相关内容
				grdIndex: 0,
				clsIndex: 0,
				stuIndex: 0,
				grdArray: [{
					text: '',
					value: ''
				}],
				clsArray: [{
					text: '',
					value: ''
				}],
				stuArray: [{
					text: '',
					value: ''
				}],
				listArray: '',
				chartsDataLine1: {"categories":["2016","2017","2018","2019","2020","2021"],"series":[{"name":"成交量A","data":[35,8,25,37,4,20]},{"name":"成交量B","data":[70,40,65,100,44,68]},{"name":"成交量C","data":[100,80,95,150,112,132]}]},
				chartSxl1004: {},
				chartSxl1005: {},
				chartSxl1006: {},
				chartSxl1007: {},
				chartSxl1008: {},
				chartSxl1009: {},
				optsTooltip1007: {
					dataLabel: false,
					dataPointShape: false,
					extra: {
						line: {
							type: 'curve'
						}
					},
					xAxis: {
						rotateLabel: true,
					},
					yAxis: {
						data: [{
							format: 'yAxisDemo0',
							min: 0,
							max: 3
						}],
						splitNumber: 3
					}
				},
				optsTooltip1008: {},
				optsTooltip1009: {},
			}
		},
		components: {
			mynavBar
		},
		methods: {
			grdClick: function(e) {
				if (this.grdIndex !== e.detail.value) {
					this.grdIndex = e.detail.value
					this.clsIndex = 0
					this.stuIndex = 0
					this.showLoading()
					this.getCls();
				}
			},
			clsClick: function(e) {
				if (this.clsIndex !== e.detail.value) {
					this.clsIndex = e.detail.value
					this.stuIndex = 0
					this.showLoading()
					this.getStu();
				}
			},
			stuClick: function(e) {
				if (this.stuIndex !== e.detail.value) {
					this.stuIndex = e.detail.value
					this.showLoading()
					this.getList0();
				}
			},
			getGrd() { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: false,
					index_code: this.index_code,
				}
				this.showLoading();
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
				this.showLoading();
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
						this.getStu();
					} else {
						this.clsArray = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getStu() { //获取学生
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					get_stu: true,
					all_stu: false,
					index_code: this.navItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading();
					let stu = response.stu_list;
					let stuArray = [];
					stu.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部学生';
						obj.value = currentValue.value;
						obj.text = name;
						stuArray.push(obj)
					})
					if (stuArray.length > 0) {
						this.stuArray = stuArray;
						this.getList0();
					} else {
						this.stuArray = [];
						this.showToast('无数据授权 无法获取学生');
					}
				})
			},
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
					return null;
				}
			},
			setValue(val) {
				if (val == 3) {
					return 'A';
				} else if (val == 2) {
					return "B";
				} else if (val == 1) {
					return 'C';
				} else if (val == 0) {
					return 'D';
				}
			},
			showMyTooltip1007(e) {
				console.log("获取点击索引事件", e);
				//拿到canvasId后即e.id，可以通过uCharts.instance[e.id]代表当前的图表实例（除APP端，APP不可在组件外调用uCharts的实例）
				console.log("获取uCharts实例", uCharts.instance[e.id]);
				//uCharts.option[e.id]代表当前的图表的opts（除APP端，APP不可在组件外调用uCharts的实例）
				console.log("uCharts的option", uCharts.option[e.id]);
				//从option（opts）中获取数据
				let categories = uCharts.option[e.id].categories;
				let series = uCharts.option[e.id].series;
				//e.currentIndex是点击的的点位索引值
				let index = e.currentIndex
				.index; //注意v2.1.2版本后，e.currentIndex是对象，而e.currentIndex.index是索引值，如果是时间轴图表，index在多个series的情况下会是数组
				//自行通过uCharts的实例调用showToolTip方法（APP端不能实现，无法通过renderjs获取到uCharts实例）
				// #ifndef APP-PLUS
				//如果需要tooltip换行显示，也可以参照本示例，关闭组件本身的tooltip功能，即:tooltipShow="false"，然后在@getIndex事件中，通过uCharts.instance[e.id].showToolTip()方法来自定义。
				let textList = [{
					text: categories[index] + "2022-2023学年上学期高一全部班级学生...",
					color: null
				}];
				for (let i = 0; i < series.length; i++) {
					textList.push({
						text: series[i].name + "：" + this.setValue(series[i].data[index]),
						color: series[i].color
					})
				}
				//changedTouches是点击的坐标值
				uCharts.instance[e.id].showToolTip({
					changedTouches: [e.event]
				}, {
					index: index,
					textList: textList
				});
				// #endif
			},
			getList0() { //获取页面数据
				let comData = {
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					stu_code: this.stuArray[this.stuIndex].value,
					index_code: this.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZHSZ + 'stu/diagram', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (data.data.mod_list) {
							for (var i = 0; i < data.data.mod_list.length; i++) {
								var tempM = data.data.mod_list[i];
								if (tempM.mod_type == '2'&&tempM.mod_code == '1002') {
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
										// tempArr99.push(tempL.name);
										tempArr0.push(this.setCharValue(tempL.maths));
										tempArr1.push(this.setCharValue(tempL.ch_skill));
										tempArr2.push(this.setCharValue(tempL.political));
										tempArr3.push(this.setCharValue(tempL.chinese));
										tempArr4.push(this.setCharValue(tempL.music));
										tempArr5.push(this.setCharValue(tempL.geography));
										tempArr6.push(this.setCharValue(tempL.physics));
										tempArr7.push(this.setCharValue(tempL.english));
										tempArr8.push(this.setCharValue(tempL.p_skill));
										tempArr9.push(this.setCharValue(tempL.chemistry));
										tempArr10.push(this.setCharValue(tempL.art));
										tempArr11.push(this.setCharValue(tempL.biology));
										tempArr12.push(this.setCharValue(tempL.biol_skill));
										tempArr13.push(this.setCharValue(tempL.history));
										tempArr14.push(this.setCharValue(tempL.pe));
										tempArr15.push(this.setCharValue(tempL.location));
									}
									var tempSum = [{
										name: "数学",
										data: tempArr0,
										format: 'seriesDemo0'
									}, {
										name: "化学技能",
										data: tempArr1,
										format: 'seriesDemo0'
									}, {
										name: "政治",
										data: tempArr2,
										format: 'seriesDemo0'
									}, {
										name: "语文",
										data: tempArr3,
										format: 'seriesDemo0'
									}, {
										name: "音乐",
										data: tempArr4,
										format: 'seriesDemo0'
									}, {
										name: "地理",
										data: tempArr5,
										format: 'seriesDemo0'
									}, {
										name: "物理",
										data: tempArr6,
										format: 'seriesDemo0'
									}, {
										name: "英语",
										data: tempArr7,
										format: 'seriesDemo0'
									}, {
										name: "物理技能",
										data: tempArr8,
										format: 'seriesDemo0'
									}, {
										name: "化学",
										data: tempArr9,
										format: 'seriesDemo0'
									}, {
										name: "美术",
										data: tempArr10,
										format: 'seriesDemo0'
									}, {
										name: "生物",
										data: tempArr11,
										format: 'seriesDemo0'
									}, {
										name: "生物技能",
										data: tempArr12,
										format: 'seriesDemo0'
									}, {
										name: "历史",
										data: tempArr13,
										format: 'seriesDemo0'
									}, {
										name: "体育",
										data: tempArr14,
										format: 'seriesDemo0'
									}, {
										name: "当地课程",
										data: tempArr15,
										format: 'seriesDemo0'
									}];
									this.chartSxl1007 = {
										categories: tempArr99,
										series: tempSum
									}
								} else if (tempM.mod_code == '1008') {
									var tempArr99 = [];
									var tempArr0 = [];
									var tempArr1 = [];
									var tempArr2 = [];
									var tempArr3 = [];
									var tempArr4 = [];
									for (var a = 0; a < tempM.mod_data.list.length; a++) {
										var tempL = tempM.mod_data.list[a];
										tempArr99.push('');
										// tempArr99.push(tempL.name);
										tempArr0.push(this.setCharValue(tempL.practice));
										tempArr1.push(this.setCharValue(tempL.learning));
										tempArr2.push(this.setCharValue(tempL.moral));
										tempArr3.push(this.setCharValue(tempL.appreciation));
										tempArr4.push(this.setCharValue(tempL.quality));
									}
									console.log('tempArr0:' + JSON.stringify(tempArr0));
									var tempSum = [{
										name: "社会实践",
										data: tempArr0,
										format: 'seriesDemo0'
									}, {
										name: "学业水平",
										data: tempArr1,
										format: 'seriesDemo0'
									}, {
										name: "思想品德",
										data: tempArr2,
										format: 'seriesDemo0'
									}, {
										name: "艺术素养",
										data: tempArr3,
										format: 'seriesDemo0'
									}, {
										name: "身心健康",
										data: tempArr4,
										format: 'seriesDemo0'
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
										// tempArr99.push(tempL.name);
										tempArr0.push(this.setCharValue(tempL.prac_lv));
										tempArr1.push(this.setCharValue(tempL.labour_lv));
										tempArr2.push(this.setCharValue(tempL.study_lv));
										tempArr3.push(this.setCharValue(tempL.computer_lv));
									}
									var tempSum = [{
										name: "实践等级",
										data: tempArr0,
										format: 'seriesDemo0'
									}, {
										name: "劳动等级",
										data: tempArr1,
										format: 'seriesDemo0'
									}, {
										name: "学习等级",
										data: tempArr2,
										format: 'seriesDemo0'
									}, {
										name: "信息技术等级",
										data: tempArr3,
										format: 'seriesDemo0'
									}];
									this.chartSxl1009 = {
										categories: tempArr99,
										series: tempSum
									}
								} else if (tempM.mod_code == '1004') {
									var comData = {
										index_code: this.index_code,
										stu_code: this.stuArray[this.stuIndex].value,
									}
									this.showLoading();
									// 
									this.post(this.globaData.INTERFACE_STUSCORE + 'fullSub/stuGrdOrder', comData, (
										data0, data) => {
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
								} else if (tempM.mod_code == '1005') {
									// 
									let end_month = this.moment().format('YYYY-MM-DD')
									let start_month = this.moment().subtract(6, 'M').format('YYYY-MM-DD');
									var comData = {
										index_code: this.index_code,
										begintime: start_month, //
										endtime: end_month,
										stu_code: this.stuArray[this.stuIndex].value,
									}
									this.showLoading();
									// 116.考勤报表-单个学生考核
									this.post(this.globaData.INTERFACE_WORK +
										'AttendanceReport/statisticsAttendance4Student', comData, (data0,
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
														name: "",
														data: tempArr1
													}]
												}
											} else {
												this.showToast(data.msg);
											}
										});
								} else if (tempM.mod_code == '1006') {
									// 
									let end_month = this.moment().format('YYYY-MM-DD')
									let start_month = this.moment().subtract(6, 'M').format('YYYY-MM-DD');
									var comData = {
										index_code: this.index_code,
										begintime: start_month, //
										endtime: end_month,
										grd_code: this.grdArray[this.grdIndex].value,
										cls_code: this.clsArray[this.clsIndex].value,
										stu_code: this.stuArray[this.stuIndex].value,
									}
									this.showLoading();
									// 19.学生行为报表-学生报表
									this.post(this.globaData.INTERFACE_STUXWSUB + 'Report/statisticsStudentBehavior',
										comData, (data0,
											data) => {
											this.hideLoading();
											if (data.code == 0) {
												var tempArr0 = [];
												var tempArr1 = [];
												for (var a = 0; a < data.data.qbArray.length; a++) {
													var tempM = data.data.qbArray[a];
													tempArr0.push(tempM.text);
													if (data.data.staticArray.length == 0) {
														tempArr1.push(0);
													} else {
														if (data.data.staticArray[0][tempM.value]) {
															tempArr1.push(data.data.staticArray[0][tempM.value]);
														} else {
															tempArr1.push(0);
														}
													}
												}
												this.chartSxl1006 = {
													categories: tempArr0,
													series: [{
														name: "",
														data: tempArr1,
													}]
												}
											} else {
												this.showToast(data.msg);
											}
										});
								}
							}
							this.listArray = data.data.mod_list;
						} else{
							this.showToast('暂无数据');
						}
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
			this.getGrd();
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

	.charts-box {
	  width: 100%;
	  height: 300px;
	}
</style>
