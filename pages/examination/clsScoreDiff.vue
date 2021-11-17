<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' icon="settings" :iconClick="icoClick">
		</mynavBar>
		<uni-drawer ref="showRight" mode="right" :mask-click="true" :width='280' @change='changeDrawer'>
			<scroll-view style="height: 100%;" scroll-y="true">
				<view>
					<view style="height: 30px;width: 100%;margin-top: 10px;">
						<view style="width: 50%;height: 30px;float: left;">
							<picker v-if="grdList.length>0" @change="bindPickerGrd" value="grdTempIndex"
								:range="grdList" range-key="text">
								<view class="uni-input" style="text-align: center;">{{grdList[grdTempIndex].text}}
									<uni-icons type="arrowdown" size="20" style="font-size: 15px;"></uni-icons>
								</view>
							</picker>
						</view>
						<view style="width: 50%;height: 30px;float: left;">
							<picker v-if="clsList.length>0" @change="bindPickerCls" value="clsTempIndex"
								:range="clsList" range-key="text">
								<view class="uni-input" style="text-align: center;">{{clsList[clsTempIndex].text}}
									<uni-icons type="arrowdown" size="20" style="font-size: 15px;"></uni-icons>
								</view>
							</picker>
						</view>
					</view>
					<view style="color: #333;margin: 15px 0 0 15px;">考试统计范围</view>
				</view>
				<view>
					<uni-data-checkbox style="margin-left: 20px;" mode="list" icon="left" :multiple="true"
						v-model="selectParperTempIdList" :localdata="fullPaperTempList" selectedColor='#00CFBD'  min="1" max="10"></uni-data-checkbox>
				</view>
				<view class="button-sp-area" style="padding-top: 10px;padding-bottom: 10px;">
					<button class="mini-btn" type="default" size="mini" @click="sure(0)">取消</button>
					<button class="mini-btn" type="default" size="mini"
						style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
						@click="sure(1)">确定</button>
				</view>
			</scroll-view>
		</uni-drawer>
		<view class="tabs-fixed">
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="button"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<uni-popup ref="popup" type="center" style="background-color: white;">
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
		<view class="content" style="margin-top: 60px;">
			<view v-if="semFlag == 0">
				<view v-for="(model,index) in sem0Data.scoreList" :key='index'>
					<view style="margin: 10px 15px 0px 15px;">
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
					</view>
					<p v-if="model.childrenMore.length>0" @click='lookMore(model.childrenMore)'
						style="color: #00cfbd;text-align: center;font-size: 14px;margin-top: 5px;">查看更多</p>
					<view style="height: 10px;background-color: #e5e5e5;margin-top: 5px;"></view>
				</view>
			</view>
			<view v-if="semFlag == 1">
				<picker v-if="sem1Data.subList.length>0" @change="bindPickerYfll" value="subIndex"
					:range="sem1Data.subList" range-key="text">
					<view class="uni-input" style="text-align: center;">{{sem1Data.subList[sem1Data.subIndex].text}}
						<uni-icons type="arrowdown" size="20" style="font-size: 15px;"></uni-icons>
					</view>
				</picker>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 10px;">平均分变化趋势</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 0 15px;width: 105px;"></view>
				<view v-if="sem1Data.chartPjf.series&&sem1Data.chartPjf.series.length>0" class="charts-box">
					<qiun-data-charts type="column" :chartData="sem1Data.chartPjf" />
				</view>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 10px;">各指标变化趋势</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 10px 15px;width: 105px;"></view>
				<view  v-if="sem1Data.chartQs.series&&sem1Data.chartQs.series.length>0" class="charts-box">
					<qiun-data-charts type="demotype" :chartData="sem1Data.chartQs" background="none" />
				</view>
			</view>
			<view v-if="semFlag == 2">
				<picker v-if="sem2Data.subList.length>0" @change="bindPickerFsd" value="subIndex"
					:range="sem2Data.subList" range-key="text">
					<view class="uni-input" style="text-align: center;">{{sem2Data.subList[sem2Data.subIndex].text}}
						<uni-icons type="arrowdown" size="20" style="font-size: 15px;"></uni-icons>
					</view>
				</picker>
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 10px;">分数段变化趋势(人数)</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 10px 15px;width: 145px;"></view>
				<view v-if="sem2Data.chartFsd.series&&sem2Data.chartFsd.series.length>0" class="charts-box">
					<qiun-data-charts type="demotype" :chartData="sem2Data.chartFsd" background="none" />
				</view>
			</view>
			<view v-if="semFlag == 3">
				<view style="font-size: 15px;font-weight: bold;margin-left: 15px;margin-top: 10px;">上线率变化趋势(人数)</view>
				<view style="height: 2px;background-color: #00cfbd;margin: 2px 0 10px 15px;width: 145px;"></view>
				<view v-if="sem3Data.chartSxl.series&&sem3Data.chartSxl.series.length>0" class="charts-box">
					<qiun-data-charts type="demotype" :chartData="sem3Data.chartSxl" background="none" />
				</view>
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
					subIndex: 0,
					scoreList: [],
					chartPjf: {},
					chartQs: {}
				},
				sem2Data: {
					subList: [],
					subValue: {},
					subIndex:0,
					scoreList: [],
					chartFsd: {}
				},
				sem3Data: {
					scoreList: [],
					chartSxl: {}
				},
				showMoreList: [],
				grdList: [], //年级数组
				clsList: [], //班级数组
				clsTempList: [], //班级数组
				grdIndex: 0, //年级选择值
				clsIndex: 0, //班级选择值
				grdTempIndex: 0, //年级选择值，在侧滑弹出选择后，如果取消，则给选择框重新赋值
				clsTempIndex: 0, //班级选择值，在侧滑弹出选择后，如果取消，则给选择框重新赋值
				fullPaperList: [], //考试范围列表
				fullPaperTempList: [], //考试范围列表
				selectParperIdList: [], //所选择的考试id数组
				selectParperTempIdList: [], //所选择的考试id数组
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
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
		},
		methods: {
			changeDrawer(e) {
				if(e == false){
					this.sure(0);
				}
				console.log('e:', e);
			},
			icoClick() {
				console.log('icoClickicoClickicoClickicoClick');
				this.$refs.showRight.open();
			},
			bindPickerGrd(e){
				this.grdTempIndex = e.target.value;
				this.getClsList(this.grdList[this.grdTempIndex].value);
			},
			bindPickerCls(e){
				this.clsTempIndex = e.target.value;
				//1.17.考情分析-班级成绩趋势-考试范围
				this.getFullPaperList(1);
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
					this.grdTempIndex = this.grdIndex;
					this.clsTempIndex = this.clsIndex;
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
					if (this.grdIndex != this.grdTempIndex) {
						tempFlag++;
					}
					if (this.clsIndex != this.clsTempIndex) {
						tempFlag++;
					}
					if (this.selectParperIdList.join(',') != this.selectParperTempIdList.join(',')) {
						tempFlag++;
					}
					if (tempFlag == 0) {

					} else {
						this.grdIndex = this.grdTempIndex;
						this.clsIndex = this.clsTempIndex;
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
					this.getScoreList();
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
			bindPickerYfll(e) {
				this.sem1Data.subIndex = e.target.value;
				this.sem1Data.subValue = this.sem1Data.subList[this.sem1Data.subIndex];
				//1.26.考情分析-班级成绩趋势-一分两率趋势
				this.getTwoRateList();
			},
			bindPickerFsd(e){
				this.sem2Data.subIndex = e.target.value;
				this.sem2Data.subValue = this.sem2Data.subList[this.sem2Data.subIndex];
				//1.27.考情分析-班级成绩趋势-分数段趋势
				this.getScoreSectionList();
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
							this.grdIndex = 0;
							this.grdTempIndex = 0;
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
							this.clsTempIndex = 0;
							if (flag == 0) {
								this.clsList = clsList;
								this.clsIndex = 0;
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
					grd_code: this.grdList[this.grdTempIndex].value,
					cls_code: this.clsList[this.clsTempIndex].value,
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
					grd_code: this.grdList[this.grdTempIndex].value,
					cls_code: this.clsList[this.clsTempIndex].value,
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
					grd_code: this.grdList[this.grdIndex].value,
					cls_codes: this.clsList[this.clsIndex].value,
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
					grd_code: this.grdList[this.grdIndex].value,
					cls_codes: this.clsList[this.clsIndex].value,
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
						this.sem1Data.scoreList = [].concat(data.data.list);
						var tempAvgArray = [];
						var tempNameArray = [];
						for (var a = 0; a < data.data.list.length; a++) {
							var tempM = data.data.list[a];
							tempAvgArray.push(tempM.avg);
							tempNameArray.push('');
						}
						this.sem1Data.chartPjf = {
							categories: tempNameArray,
							series: [{
								name: "平均分",
								data: tempAvgArray
							}]
						}

						var tempNameArray = [];
						var tempSecArray = [];
						console.log("data.data.tag_list: " + JSON.stringify(data.data.list));
						for (var a = 0; a < data.data.tag_list.length; a++) {
							var tempM = data.data.tag_list[a];
							tempNameArray.push('');
							var tempSecModel = {
								name: tempM.name,
								data: [],
							}
							var childrenNum = [];
							for (var b = 0; b < data.data.list.length; b++) {
								var tempList = data.data.list[b];
								childrenNum.push(tempList['num' + tempM.key]);
							}
							tempSecModel.data = [].concat(childrenNum);
							tempSecArray.push(tempSecModel);
						}
						console.log("tempNameArray: " + JSON.stringify(tempNameArray));
						this.sem1Data.chartQs = {
							categories: tempNameArray,
							series: tempSecArray
						}
						this.sem1Data.chartQs = {
							"categories": ["", "", "", "", "", ""],
							"series": [{
								"name": "优秀率",
								"data": [10, 10, 0, 3, 3, 2]
							}, {
								"name": "良好率",
								"data": [0, 0, 4, 5, 5, 0]
							}, {
								"name": "合格率",
								"data": [0, 0, 1, 2, 2, 0]
							}, {
								"name": "不合格率",
								"data": [0, 0, 1, 0, 0, 0]
							}, {
								"name": "1",
								"data": [0, 0, 0, 0, 0, 0]
							}]
						}
						console.log('this.sem1Data.chartQs:'+JSON.stringify(this.sem1Data.chartQs));
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.27.考情分析-班级成绩趋势-分数段趋势
			getScoreSectionList() {
				let comData = {
					grd_code: this.grdList[this.grdIndex].value,
					cls_codes: this.clsList[this.clsIndex].value,
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
						this.sem2Data.scoreList = [].concat(data.data.list);
						var tempNameArray = [];
						var tempSecArray = [];
						for (var a = 0; a < data.data.tag_list.length; a++) {
							var tempM = data.data.tag_list[a];
							tempNameArray.push('');
							var tempSecModel = {
								name: tempM.name,
								data: [],
							}
							var childrenNum = [];
							for (var b = 0; b < data.data.list.length; b++) {
								var tempList = data.data.list[b];
								childrenNum.push(tempList['num' + tempM.key]);
							}
							tempSecModel.data = [].concat(childrenNum);
							tempSecArray.push(tempSecModel);
						}
						this.sem2Data.chartFsd = {
							categories: tempNameArray,
							series: tempSecArray
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.28.考情分析-班级成绩趋势-上线率趋势
			getPassRateList() {
				let comData = {
					grd_code: this.grdList[this.grdIndex].value,
					cls_codes: this.clsList[this.clsIndex].value,
					paper_ids: this.selectParperIdList.join(','),
					sub_code: '',
					index_code: this.itemData.access.split('#')[1],
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'clsTrend/passRateList', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.sem3Data.scoreList = [].concat(data.data.list);
						var tempNameArray = [];
						var tempSecArray = [];
						for (var a = 0; a < data.data.tag_list.length; a++) {
							var tempM = data.data.tag_list[a];
							tempNameArray.push('');
							var tempSecModel = {
								name: tempM.name,
								data: [],
							}
							var childrenNum = [];
							for (var b = 0; b < data.data.list.length; b++) {
								var tempList = data.data.list[b];
								childrenNum.push(tempList['num' + tempM.key]);
							}
							tempSecModel.data = [].concat(childrenNum);
							tempSecArray.push(tempSecModel);
						}
						this.sem3Data.chartSxl = {
							categories: tempNameArray,
							series: tempSecArray
						}
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
