<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' icon="settings" :iconClick="icoClick">
		</mynavBar>
		<uni-drawer ref="showRight" mode="right" :mask-click="false" :width='280'>
			<scroll-view style="height: 100%;" scroll-y="true">
				<view>
					<view class="button-sp-area" style="padding-top: 30px;">
						<button class="mini-btn" type="default" size="mini"
							@click="showGrd()">{{grdTempValue.text}}</button>
						<button class="mini-btn" type="default" size="mini"
							@click="showCls()">{{clsTempValue.text}}</button>
					</view>
					<view style="color: #333;margin: 15px 0 0 15px;">考试统计范围</view>
				</view>
				<view>
					<uni-data-checkbox style="margin-left: 20px;" mode="list" icon="left" :multiple="true"
						v-model="selectParperTempIdList" :localdata="fullPaperTempList" selectedColor='#00CFBD'
						@change="change" min="1" max="10"></uni-data-checkbox>
				</view>
				<view class="button-sp-area" style="padding-top: 10px;padding-bottom: 10px;">
					<button class="mini-btn" type="default" size="mini" @click="sure(0)">取消</button>
					<button class="mini-btn" type="default" size="mini"
						style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
						@click="sure(1)">确定</button>
				</view>
			</scroll-view>
		</uni-drawer>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="button"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<uni-popup ref="popup" type="center" style="background-color: white;">
			<view>
				就开始购房款水电费会计师对话框
			</view>
			<view style="background-color: white;padding: 10px;border-radius: 5px;">
				<view v-for="(showModel,index) in showMoreList" :key='index'
					style="border: 1px solid #66c1bb;margin-top: 10px;">
					<view
						style="height: 20px;background-color: #66c1bb;margin: 0px 0 0 0;font-size: 13px;color: white;padding-left: 10px;">
						{{showModel.title}}
					</view>
					<uni-row>
						<uni-col :span="6" style="height: 18px;">
							<p class="scoreDetail">分数</p>
						</uni-col>
						<uni-col :span="6">
							<p class="scoreDetail" style="background-color: white;">{{showModel.score}}</p>
						</uni-col>
						<uni-col :span="6">
							<p class="scoreDetail">排名</p>
						</uni-col>
						<uni-col :span="6">
							<p class="scoreDetail" style="background-color: white;">{{showModel.order}}</p>
						</uni-col>
					</uni-row>
				</view>
				<view style="text-align: center;font-size: 13px;color: gray;">以上排名均为年级排名</view>
			</view>
		</uni-popup>
		<view class="content">
			<view v-if="semFlag == 0">
				<view v-for="(model,index) in sem0Data.scoreList" :key='index' style="margin: 10px 15px 0px 15px;">
					<view style="font-size: 15px;font-weight: bold;margin-top: 5px;">{{model.cls_name}}
						{{model.stu_name}}
					</view>
					<view v-for="(showModel,index) in model.childrenShow" :key='index'
						style="border: 1px solid #66c1bb;margin-top: 10px;">
						<view
							style="height: 20px;background-color: #66c1bb;margin: 0px 0 0 0;font-size: 13px;color: white;padding-left: 10px;">
							{{showModel.title}}
						</view>
						<uni-row>
							<uni-col :span="6" style="height: 18px;">
								<p class="scoreDetail">分数</p>
							</uni-col>
							<uni-col :span="6">
								<p class="scoreDetail" style="background-color: white;">
									{{showModel.score}}
								</p>
							</uni-col>
							<uni-col :span="6">
								<p class="scoreDetail">排名</p>
							</uni-col>
							<uni-col :span="6">
								<p class="scoreDetail" style="background-color: white;">
									{{showModel.order}}
								</p>
							</uni-col>
						</uni-row>
					</view>
					<p v-if="model.childrenMore.length>0" @click='lookMore(model.childrenMore)'
						style="color: #00cfbd;text-align: center;font-size: 14px;margin-top: 5px;">查看更多</p>
					<view style="height: 10px;background-color: #e5e5e5;margin: 5px -20px 0px -20px;"></view>
				</view>
			</view>
			<view v-if="semFlag == 1">
				<view style="text-align: center;margin-top: 10px;font-size: 15px;" class="mui-control-item"
					@tap="sem1ShowSub()"><span>{{sem1Data.subValue.text}}</span><span
						class="mui-icon mui-icon-arrowdown"></span></view>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 10px;">平均分变化趋势</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 0 15px;width: 105px;"></view>
				<view class="charts-box">
					<qiun-data-charts type="column" :chartData="chartData" />
				</view>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 10px;">各指标变化趋势</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 10px 15px;width: 105px;"></view>
				<view class="charts-box">
					<qiun-data-charts type="demotype" :chartData="chartData3" background="none" />
				</view>
			</view>
			<view v-if="semFlag == 2">
				选项卡3的内容
			</view>
			<view v-if="semFlag == 3">
				选项卡4的内容
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				semValuesArray: ['历次成绩', '一分两率', '分数段', '上线率'],
				semFlag: 0, //点击的seg索引
				sem0Data: { //历次成绩
					scoreList: [], //历次成绩列表
				},
				sem1Data: { //一分两率
					subList: [],
					subValue: {},
					scoreList: []
				},
				sem2Data: {
					subList: [],
					subValue: {},
					scoreList: []
				},
				sem3Data: {
					scoreList: []
				},
				showMoreList: [],
				grdList: [], //年级数组
				clsList: [], //班级数组
				clsTempList: [], //班级数组
				grdValue: {}, //年级选择值
				clsValue: {}, //班级选择值
				grdTempValue: {}, //年级选择值，在侧滑弹出选择后，如果取消，则给选择框重新赋值
				clsTempValue: {}, //班级选择值，在侧滑弹出选择后，如果取消，则给选择框重新赋值
				fullPaperList: [], //考试范围列表
				fullPaperTempList: [], //考试范围列表
				selectParperIdList: [], //所选择的考试id数组
				selectParperTempIdList: [], //所选择的考试id数组
				chartData: {
					categories: ["", "", "", "", "", ""],
					series: [{
						name: "",
						data: [150, 36, 31, 33, 13, 34]
					}]
				},
				chartData2: {
					series: [{
						"name": "一班",
						"data": 50
					}, {
						"name": "二班",
						"data": 30
					}, {
						"name": "三班",
						"data": 20
					}, {
						"name": "四班",
						"data": 18
					}, {
						"name": "五班",
						"data": 8
					}]
				},
				chartData3: {
					categories: ["2012", "2013", "2014", "2015", "2016", "2017"],
					series: [{
						"name": "成交量A",
						"data": [35, 8, 25, 37, 4, 20]
					}, {
						"name": "成交量B",
						"data": [70, 40, 65, 100, 44, 68]
					}, {
						"name": "成交量C",
						"data": [100, 80, 95, 150, 112, 132]
					}]
				}
			}
		},
		components: {
			mynavBar,
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.index = 100;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			// 获取数据范围授权：年级
			this.getGrdList();
		},
		methods: {
			change(e) {
				console.log('e:', e);
				console.log('e111:', e.detail.value);
				console.log('e222:', JSON.stringify(e.detail.value));
				console.log('e333:', JSON.stringify(this.selectParperIdList));
				console.log('e444:', JSON.stringify(this.selectParperTempIdList));
			},
			icoClick() {
				console.log('icoClickicoClickicoClickicoClick');
				this.$refs.showRight.open();
			},
			showGrd: function() {
				var userPicker = new $M.PopPicker();
				userPicker.setData(this.grdList);
				setTimeout(function() {
					userPicker.pickers[0].setSelectedValue(this.grdTempValue.value);
				}, 100);
				userPicker.show(function(items) {
					console.log(JSON.stringify(items[0]))
					if (JSON.stringify(items[0]) == '{}') {
						this.showToast('未选择年级')
					} else {
						this.grdTempValue = items[0]
						// this.showLoading();
						// pageIndex = 1;
						// flagRef = 0;
						// this.pageArray = [];
						this.getClsList(items[0].value)
						userPicker.dispose();
						userPicker = null;
					}
				});
			},
			showCls: function() {
				var userPicker = new $M.PopPicker();
				userPicker.setData(this.clsTempList);
				setTimeout(function() {
					userPicker.pickers[0].setSelectedValue(this.clsTempValue.value);
				}, 100);
				userPicker.show(function(items) {
					// console.log(JSON.stringify(items[0]))
					if (JSON.stringify(items[0]) == '{}') {
						this.showToast('未选择班级')
					} else {
						this.clsTempValue = items[0]
						//1.17.考情分析-班级成绩趋势-考试范围
						this.getFullPaperList(1);
						userPicker.dispose();
						userPicker = null;
					}
				});
			},
			selectPaper: function(model) {
				var tempSelectCount = 0;
				for (var a = 0; a < this.fullPaperTempList.length; a++) {
					var tempM = this.fullPaperTempList[a];
					if (tempM.selectFlag == true) {
						tempSelectCount++;
					}
				}
				if (tempSelectCount > 10) {
					this.showToast('最多只能选择10个考试范围');
					model.selectFlag = false;
				}
			},
			sure: function(flag) {
				console.log('suresuresuresuresuresure');
				this.$refs.showRight.close();
				if (flag == 0) { //取消
					this.grdTempValue = this.grdValue;
					this.clsTempValue = this.clsValue;
					this.clsTempList = [].concat(this.clsList);
					this.fullPaperTempList = [].concat(this.fullPaperList);
					this.selectParperTempIdList = [].concat(this.selectParperIdList);
				} else { //确定
					if (this.selectParperTempIdList.length == 0) {
						this.showToast('请选择考试范围');
						return;
					}
					// 如果年级、班级、考试范围数组，是否发生变化
					var tempFlag = 0;
					if (this.grdValue.value != this.grdTempValue.value) {
						tempFlag++;
					}
					if (this.clsValue.value != this.clsTempValue.value) {
						tempFlag++;
					}
					if (this.selectParperIdList.join(',') != this.selectParperTempIdList.join(',')) {
						tempFlag++;
					}
					if (tempFlag == 0) {

					} else {
						this.grdValue = this.grdTempValue;
						this.clsValue = this.clsTempValue;
						this.clsList = [].concat(this.clsTempList);
						this.fullPaperList = [].concat(this.fullPaperTempList);
						this.selectParperIdList = [].concat(this.selectParperTempIdList);
						// 清掉界面所有数据
						this.sem0Data.scoreList = [];
						this.sem1Data.subList = [];
						this.sem1Data.subValue = [];
						this.sem1Data.scoreList = [];
						this.sem2Data.subList = [];
						this.sem2Data.subValue = [];
						this.sem2Data.scoreList = [];
						this.sem3Data.scoreList = [];
						// 获取现在索引页数据
						this.clickSureGetPageData(this.semFlag);
					}
				}
			},
			clickSureGetPageData(flag) {
				if (this.grdList.length == 0) {
					// 获取数据范围授权：年级
					this.getGrdList();
					return;
				}
				if (flag == 0 && this.sem0Data.scoreList.length == 0) {
					//1.25.考情分析-班级成绩趋势-历次成绩
					// this.getScoreList();
				} else if (flag == 1) {
					if (this.sem1Data.subList.length == 0) {
						// 获取数据范围授权：科目
						this.getSubList();
					} else if (this.sem1Data.scoreList.length == 0) {
						//1.26.考情分析-班级成绩趋势-一分两率趋势
						this.getTwoRateList();
					}
				} else if (flag == 2) {
					if (this.sem2Data.subList.length == 0) {
						// 获取数据范围授权：科目
						this.getSubList();
					} else if (this.sem2Data.scoreList.length == 0) {
						//1.27.考情分析-班级成绩趋势-分数段趋势
						this.getScoreSectionList();
					}
				} else if (flag == 3 && this.sem3Data.scoreList.length == 0) {
					//1.28.考情分析-班级成绩趋势-上线率趋势
					this.getPassRateList();
				}
			},
			clickSeg: function(e) {
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					this.clickSureGetPageData(this.semFlag);
				}
			},
			lookMore: function(array) {
				this.showMoreList = [].concat(array);
				this.$refs.popup.open();
			},
			sem1ShowSub: function() {
				var userPicker = new $M.PopPicker();
				userPicker.setData(this.sem1Data.subList);
				setTimeout(function() {
					userPicker.pickers[0].setSelectedValue(this.sem1Data.subValue.value);
				}, 100);
				userPicker.show(function(items) {
					// console.log(JSON.stringify(items[0]))
					if (JSON.stringify(items[0]) == '{}') {
						this.showToast('未选择科目')
					} else {
						this.sem1Data.subValue = items[0]
						//1.26.考情分析-班级成绩趋势-一分两率趋势
						this.getTwoRateList();
						userPicker.dispose();
						userPicker = null;
					}
				});
			},
			sem2ShowSub: function() {
				var userPicker = new $M.PopPicker();
				userPicker.setData(this.sem2Data.subList);
				setTimeout(function() {
					userPicker.pickers[0].setSelectedValue(this.sem2Data.subValue.value);
				}, 100);
				userPicker.show(function(items) {
					// console.log(JSON.stringify(items[0]))
					if (JSON.stringify(items[0]) == '{}') {
						this.showToast('未选择科目')
					} else {
						this.sem2Data.subValue = items[0]
						//1.27.考情分析-班级成绩趋势-分数段趋势
						this.getScoreSectionList();
						userPicker.dispose();
						userPicker = null;
					}
				});
			},
			// 获取数据范围授权：年级
			getGrdList() {
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: false,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, (data0, data) => {
					if (data.code == 0) {
						let grds = data.data.grd_list;
						let grdList = [];
						grds.map(function(currentValue) {
							let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
							let obj = {};
							obj.value = currentValue.value;
							obj.text = name;
							grdList.push(obj)
						})
						if (grdList.length > 0) {
							this.grdList = grdList;
							this.grdValue = grdList[0];
							this.grdTempValue = grdList[0];
							let grd_code = grds[0].value;
							//获取数据范围授权：班级
							this.getClsList(grd_code, 0)
						} else {
							this.hideLoading();
							this.showToast('无数据授权 无法获取年级');
						}
					} else {
						this.hideLoading();
						this.showToast(data.msg);
					}
				});
			},
			//获取数据范围授权：班级，flag默认获取0，主动获取1
			getClsList(grd_code, flag) {
				const params = {
					op_code: 'index',
					grd_code: grd_code ? grd_code : '-1',
					get_cls: true,
					all_cls: true,
					index_code: this.itemData.access.split('#')[1],
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', params, (data0, data) => {
					if (data.code == 0) {
						let clss = data.data.cls_list;
						let clsList = [];
						clss.map(function(currentValue) {
							let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
							let obj = {};
							obj.value = currentValue.value;
							obj.text = name;
							clsList.push(obj)
						})

						if (clsList.length > 0) {
							this.clsTempList = clsList;
							this.clsTempValue = clsList[0];
							if (flag == 0) {
								this.clsList = clsList;
								this.clsValue = clsList[0];
								//1.25.考情分析-班级成绩趋势-历次成绩
								// getScoreList();
							} else {

							}
							//1.17.考情分析-班级成绩趋势-考试范围
							this.getFullPaperList(flag);
						} else {
							this.hideLoading();
							this.showToast('无数据授权 无法获取班级');
						}
					} else {
						this.hideLoading();
						this.showToast(data.msg);
					}
				});
			},
			// 获取数据范围授权：科目
			getSubList() {
				let comData = {
					op_code: 'index',
					all_sub: true,
					get_sub: true,
					grd_code: this.grdTempValue.value,
					cls_code: this.clsTempValue.value,
					index_code: this.itemData.access.split('#')[1],
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, (data0, data) => {
					if (data.code == 0) {
						let subs = data.data.sub_list;
						let subList = [];
						subs.map(function(currentValue) {
							let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部科目';
							let obj = {};
							obj.value = currentValue.value;
							obj.text = name;
							subList.push(obj)
						})
						if (subList.length > 0) {
							this.sem1Data.subList = [].concat(subList);
							this.sem1Data.subValue = subList[0];
							this.sem2Data.subList = [].concat(subList);
							this.sem2Data.subValue = subList[0];
							if (this.semFlag == 1) {
								//1.26.考情分析-班级成绩趋势-一分两率趋势
								this.getTwoRateList();
							} else if (this.semFlag == 2) {
								//1.27.考情分析-班级成绩趋势-分数段趋势
								this.getScoreSectionList();
							}
						} else {
							this.hideLoading();
							this.showToast('无数据授权 无法获取科目');
						}
					} else {
						this.hideLoading();
						this.showToast(data.msg);
					}
				});
			},
			//1.17.考情分析-班级成绩趋势-考试范围
			getFullPaperList(flag) {
				let comData = {
					grd_code: this.grdTempValue.value,
					cls_code: this.clsTempValue.value,
					index_code: this.itemData.access.split('#')[1],
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'paper/getFullPaperList', comData, (data0, data) => {
					this.hideLoading();
					console.log('getFullPaperList:' + JSON.stringify(data));
					if (data.code == 0) {
						var tempIds = [];
						data.data.list.reverse();
						for (var a = 0; a < data.data.list.length; a++) {
							var tempM = data.data.list[a];
							tempM.value = tempM.id;
							tempM.text = tempM.name;
							if (flag == 0 && tempIds.length < 10) {
								tempIds.push(tempM.id);
								// tempM.selectFlag = true;
							} else {
								// tempM.selectFlag = false;
							}
						}
						this.fullPaperTempList = [].concat(data.data.list);
						if (flag == 0) {
							this.fullPaperList = [].concat(data.data.list);
							this.selectParperIdList = [].concat(tempIds);
							this.selectParperTempIdList = [].concat(tempIds);
							//1.25.考情分析-班级成绩趋势-历次成绩
							this.getScoreList();
						} else {

						}
						if (data.data.list.length == 0) {
							this.showToast('可选考试范围为空');
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.25.考情分析-班级成绩趋势-历次成绩
			getScoreList() {
				let comData = {
					grd_code: this.grdValue.value,
					cls_codes: this.clsValue.value,
					paper_ids: this.selectParperIdList.join(','),
					sub_code: '',
					index_code: this.itemData.access.split('#')[1],
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'clsTrend/scoreList', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var a = 0; a < data.data.list.length; a++) {
							var tempM = data.data.list[a];
							tempM.childrenShow = [];
							tempM.childrenMore = [];
							for (var b = 0; b < data.data.head.length; b++) {
								var tempHead = data.data.head[b];
								if (tempHead.children) {
									var tempChildren = {
										title: tempHead.title
									}
									for (var c = 0; c < tempHead.children.length; c++) {
										var tempKey = tempHead.children[c].key;
										if (tempKey.indexOf("score") != -1) {
											if (tempM[tempKey]) {
												tempChildren.score = tempM[tempKey];
											} else {
												tempChildren.score = '0';
											}
										}
										if (tempKey.indexOf("grd_order") != -1) {
											tempChildren.order = tempM[tempKey];
											if (tempM[tempKey]) {
												tempChildren.order = tempM[tempKey];
											} else {
												tempChildren.order = '无';
											}
										}
									}
									if (tempM.childrenShow.length < 2) {
										tempM.childrenShow.push(tempChildren);
									} else {
										tempM.childrenMore.push(tempChildren);
									}
								}
							}
						}
						this.sem0Data.scoreList = [].concat(data.data.list);
						// console.log('this.sem0Data.scoreList:' + JSON.stringify(this.sem0Data.scoreList));
						if (this.sem0Data.scoreList.length == 0) {
							this.showToast('暂无数据');
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.26.考情分析-班级成绩趋势-一分两率趋势
			getTwoRateList() {
				let comData = {
					grd_code: this.grdValue.value,
					cls_codes: this.clsValue.value,
					paper_ids: this.selectParperIdList.join(','),
					sub_code: this.sem1Data.subValue.value,
					index_code: this.itemData.access.split('#')[1],
				}
				if (comData.sub_code == '-1') {
					comData.sub_code = '';
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'clsTrend/twoRateList', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempAvgArray = [];
						for (var a = 0; a < data.data.list.length; a++) {
							var tempM = data.data.list[a];
							tempAvgArray.push(tempM.avg);
						}
						// var pjfChart = echarts.init($('#pjfChart')[0]);
						// pjfChart.setOption({
						// 	xAxis: {
						// 		type: 'category',
						// 		data: []
						// 	},
						// 	yAxis: {
						// 		type: 'value'
						// 	},
						// 	// legend: {
						// 	// 	data: ['平均分']
						// 	// },
						// 	series: [{
						// 		label: {
						// 			show: true,
						// 			position: 'top'
						// 		},
						// 		name: '平均分',
						// 		data: tempAvgArray,
						// 		type: 'bar',
						// 	}]
						// });

						// var tempNameArray = [];
						// var tempSecArray = [];
						// for (var a = 0; a < data.data.tag_list.length; a++) {
						// 	var tempM = data.data.tag_list[a];
						// 	tempNameArray.push(tempM.name);
						// 	var tempSecModel = {
						// 		label: {
						// 			show: true,
						// 			position: 'top'
						// 		},
						// 		name: tempM.name,
						// 		data: [],
						// 		type: 'line',
						// 	}
						// 	var childrenNum = [];
						// 	for (var b = 0; b < data.data.list.length; b++) {
						// 		var tempList = data.data.list[b];
						// 		childrenNum.push(tempList['num' + tempM.key]);
						// 	}
						// 	tempSecModel.data = [].concat(childrenNum);
						// 	tempSecArray.push(tempSecModel);
						// }
						// var qushiChart = echarts.init($('#qushiChart')[0]);
						// qushiChart.setOption({
						// 	xAxis: {
						// 		type: 'category',
						// 		data: []
						// 	},
						// 	yAxis: {
						// 		type: 'value'
						// 	},
						// 	legend: {
						// 		data: tempNameArray
						// 	},
						// 	series: tempSecArray
						// });
						// if (data.data.list.length == 0) {
						// 	this.showToast('暂无数据');
						// }
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.27.考情分析-班级成绩趋势-分数段趋势
			getScoreSectionList() {
				let comData = {
					grd_code: this.grdValue.value,
					cls_codes: this.clsValue.value,
					paper_ids: this.selectParperIdList.join(','),
					sub_code: this.sem2Data.subValue.value,
					index_code: this.itemData.access.split('#')[1],
				}
				if (comData.sub_code == '-1') {
					comData.sub_code = '';
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'clsTrend/scoreSectionList', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempNameArray = [];
						var tempSecArray = [];
						for (var a = 0; a < data.data.tag_list.length; a++) {
							var tempM = data.data.tag_list[a];
							tempNameArray.push(tempM.name);
							var tempSecModel = {
								label: {
									show: true,
									position: 'top'
								},
								name: tempM.name,
								data: [],
								type: 'line',
							}
							var childrenNum = [];
							// var childrenRadio = [];
							for (var b = 0; b < data.data.list.length; b++) {
								var tempList = data.data.list[b];
								childrenNum.push(tempList['num' + tempM.key]);
								// childrenRadio.push(tempList['radio'+tempM.key]);
							}
							tempSecModel.data = [].concat(childrenNum);
							tempSecArray.push(tempSecModel);
						}
						var fenshuduanChart = echarts.init($('#fenshuduanChart')[0]);
						fenshuduanChart.setOption({
							xAxis: {
								type: 'category',
								data: []
							},
							yAxis: {
								type: 'value'
							},
							legend: {
								data: tempNameArray
							},
							series: tempSecArray
						});
						this.sem2Data.scoreList = [].concat(tempSecArray);
						// console.log('this.sem2Data.scoreList:' + JSON.stringify(this.sem2Data.scoreList));
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.28.考情分析-班级成绩趋势-上线率趋势
			getPassRateList() {
				let comData = {
					grd_code: this.grdValue.value,
					cls_codes: this.clsValue.value,
					paper_ids: this.selectParperIdList.join(','),
					sub_code: '',
					index_code: this.itemData.access.split('#')[1],
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'clsTrend/passRateList', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempNameArray = [];
						var tempSecArray = [];
						for (var a = 0; a < data.data.tag_list.length; a++) {
							var tempM = data.data.tag_list[a];
							tempNameArray.push(tempM.name);
							var tempSecModel = {
								label: {
									show: true,
									position: 'top'
								},
								name: tempM.name,
								data: [],
								type: 'line',
							}
							var childrenNum = [];
							for (var b = 0; b < data.data.list.length; b++) {
								var tempList = data.data.list[b];
								childrenNum.push(tempList['num' + tempM.key]);
							}
							tempSecModel.data = [].concat(childrenNum);
							tempSecArray.push(tempSecModel);
						}
						var shangxianlvChart = echarts.init($('#shangxianlvChart')[0]);
						shangxianlvChart.setOption({
							xAxis: {
								type: 'category',
								data: []
							},
							yAxis: {
								type: 'value'
							},
							legend: {
								data: tempNameArray
							},
							series: tempSecArray
						});
						this.sem3Data.scoreList = [].concat(tempSecArray);
						// console.log('this.sem3Data.scoreList:' + JSON.stringify(this.sem3Data.scoreList));
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: 26px;
	}

	.uni-common-mt {
		margin-top: 10px;
	}

	.uni-padding-wrap {
		padding: 0 5px;
	}

	.scoreDetail {
		font-size: 13px;
		color: #000;
		text-align: center;
		margin-top: 0px;
		background-color: #e5e5e5;
	}

	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>
