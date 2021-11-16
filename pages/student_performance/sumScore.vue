<template>
	<view>
		<!-- #ifdef H5 -->
		<view class="tabs-fixed">
		<!-- #endif -->
		<!-- #ifdef APP -->
		<view class="tabs-fixed" style="top: 0px;">
		<!-- #endif -->
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="button"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<view class="content" style="margin-top: 60px;">
			<h4 class="examName">{{itemData.name}}</h4>
			<view v-if="semFlag == 0">
				<view>
					<uni-row>
						<uni-col :span="8" style="height: 18px;">
							<view class="scoreOrderBorder">
								<view class="scoreOrder">{{semFlag0Data.grd_order}}</view>
							</view>
							<view class="scoreOrderName">年级排名</view>
						</uni-col>
						<uni-col :span="8">
							<view class="charts-box">
								<qiun-data-charts style="margin-top: -60px;" type="arcbar"
									:opts="semFlag0Data.myScoreShow" :chartData="semFlag0Data.myScoreQs" />
							</view>
							<view class="scoreOrderName" style="margin-top: -80px;text-align: center;">我的成绩</view>
						</uni-col>
						<uni-col :span="8">
							<view class="scoreOrderBorder">
								<view class="scoreOrder">{{semFlag0Data.cls_order}}</view>
							</view>
							<view class="scoreOrderName">班级排名</view>
						</uni-col>
					</uni-row>
				</view>
				<view>
					<uni-grid :column="2" :showBorder='false' :square="false" :highlight="false">
						<uni-grid-item>
							<view class="grid-item-box">
								<p class="leaveSum">年级最高分：{{semFlag0Data.grd_max_score}}</p>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box">
								<p class="leaveSum">年级均分：{{semFlag0Data.grd_avg_score}}</p>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box">
								<p class="leaveSum">班级最高分：{{semFlag0Data.cls_max_score}}</p>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box">
								<p class="leaveSum">班级均分：{{semFlag0Data.cls_avg_score}}</p>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
				<view style="padding: 10px;">
					<uni-grid :column="2" :square="false" :highlight="false">
						<uni-grid-item v-for="(item, index) in semFlag0Data.child_paper_list" :key="index" style="margin-top: -1px;">
							<view class="grid-item-box fenxiBox">
								<text class="text"><span style="color: #333333;">{{item.sub_name}}：</span><span
										style="color: red;">{{item.stu_score}}
									</span><span>/{{item.score}}</span></text>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
				<h4 class="spaceLine">总分趋势</h4>
				<p class="spaceLineName">历次考试成绩趋势如下：</p>
				<view class="charts-box" style="margin-top: 10px;">
					<qiun-data-charts :opts="{dataLabel:false}" type="demotype" :chartData="semFlag0Data.chengjiQs" background="none" />
				</view>
				<h4 class="spaceLine">排名趋势</h4>
				<p class="spaceLineName">历次考试排名趋势如下：</p>
				<view class="charts-box" style="margin-top: 10px;">
					<qiun-data-charts :opts="{dataLabel:false}" type="demotype" :chartData="semFlag0Data.paimingQs" background="none" />
				</view>
			</view>
			<view v-if="semFlag == 1">
				<view style="margin-top: 20px;">
					<span class="goodBadSub" style="background:  #f86a6a;">优势学科</span>
					<span v-if="semFlag1Data.pros_sub_names ==null" style="margin-left: 10px;font-size: 13px;">暂无</span>
					<span style="margin-left: 10px;font-size: 13px;">{{semFlag1Data.pros_sub_names}}</span>
				</view>
				<view style="margin-top: 20px;">
					<span class="goodBadSub" style="background: #43cf7c;">劣势学科</span>
					<span v-if="semFlag1Data.cons_sub_names ==null" style="margin-left: 10px;font-size: 13px;">暂无</span>
					<span style="margin-left: 10px;font-size: 13px;">{{semFlag1Data.cons_sub_names}}</span>
				</view>
				<view class="charts-box">
					<!-- <qiun-data-charts type="radar" :opts="{legend:{position: 'bottom'},extra:{radar:{border:true}}}"
						:chartData="semFlag1Data.radarChartDetail" /> -->
					<qiun-data-charts type="radar" :opts="{legend:{position: 'bottom'},extra:{radar:{gridType:'circle'}}}" :chartData="semFlag1Data.radarChartDetail"/>
				</view>
				<view style="margin-left: 20px;margin-top: 10px;font-size: 14px;">各科标准分：</view>
				<view style="padding: 10px;">
					<uni-grid :column="2" :square="false" :highlight="false" style="">
						<uni-grid-item v-for="(item, index) in semFlag1Data.list" :key="index" style="margin-top: -1px;">
							<view class="grid-item-box fenxiBox">
								<text class="text"><span
										style="color: #333333;">{{item.sub_name}}：</span><span>{{item.standard_score}}</span></text>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
				<div style="margin-left: 20px;font-size: 13px;padding-bottom: 20px;">注：优劣学科将各科分值转化为标准分后再进行比较。</div>
			</view>
			<view v-if="semFlag == 2">
				<button
					style="float: right;margin-right: 20px;background: #43cf7c;border-color: #43cf7c;color: white;margin-top: 10px;"
					class="mini-btn" @click="yaoqing()" size="mini">邀请</button>
				<!-- <button style="float: right;margin-right: 20px;background: #5da4ef;border-color: #5da4ef;color: white;margin-top: 10px;" class="mini-btn" @click="tiaozhanzhe()" size="mini">挑战者<span
						v-if="semFlag2Data.challenge_list.length>0" class="mui-badge"
						style="background: red;color: white;">{{semFlag2Data.challenge_list.length}}</span></button> -->
				<button
					style="float: right;margin-right: 20px;background: #5da4ef;border-color: #5da4ef;color: white;margin-top: 10px;"
					class="mini-btn" @click="tiaozhanzhe()" size="mini">挑战者<uni-badge
						v-if="semFlag2Data.challenge_list.length>0" :text='semFlag2Data.challenge_list.length'
						type='error' style="" size="small"></uni-badge></button>
				<br>
				<h4 class="spaceLine" style='margin-top: 30px;'>PK榜</h4>
				<view>
					<uni-row style="background: #e7e3e3;">
						<uni-col :span="2" style="height: 18px;">
							<p class="scoreDetail">次序</p>
						</uni-col>
						<uni-col :span="4">
							<p class="scoreDetail">对手</p>
						</uni-col>
						<uni-col :span="4">
							<p class="scoreDetail">总分</p>
						</uni-col>
						<uni-col :span="9">
							<p class="scoreDetail">各科</p>
						</uni-col>
						<uni-col :span="4">
							<p class="scoreDetail"> </p>
						</uni-col>
					</uni-row>
				</view>
				<view>
					<uni-row v-for="(item,index) in semFlag2Data.pk_list" :key='index' style="background: #e1faeb;margin-top: 5px;">
						<view @click="toDetailPage(item)">
						<uni-col :span="2" style="height: 18px;">
							<p class="scoreDetail">{{index+1}}</p>
						</uni-col>
						<uni-col :span="4">
							<p class="scoreDetail">{{item.pk_user_name}}</p>
						</uni-col>
						<uni-col :span="4">
							<view v-if="item.my_score==item.pk_user_score" style="color: #FDD60C;font-size: 20px;font-weight: 900;text-align: center;margin-top: 5px;">平</view>
							<view v-if="item.my_score>item.pk_user_score" style="color: #008080;font-size: 20px;font-weight: 900;text-align: center;margin-top: 5px;">胜</view>
							<view v-if="item.my_score<item.pk_user_score" style="color: red;font-size: 20px;font-weight: 900;text-align: center;margin-top: 5px;">败</view>
						</uni-col>
						<uni-col :span="9">
							<view style="text-align: center;margin-top: 5px;">
								<span style="color: red;font-size: 20px;font-weight: 900;">{{item.pkb}}胜</span>
								<span style="color: #008080;font-size: 20px;font-weight: 900;">{{item.pkc}}败</span>
								<span style="color: #FDD60C;font-size: 20px;font-weight: 900;">{{item.pka}}平</span>
							</view>
						</uni-col>
						<uni-col :span="4">
							<image style="width: 15px;height: 15px;margin-top: 10px;margin-left: 10px;"
								src="/static/images/student_performance//search.png"></image>
						</uni-col>
						</view>
					</uni-row>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import mSteps from '@/components/m-steps/m-steps.vue'
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				pageSize: 10,
				semValuesArray: ['总分及排名', '优劣学科', '成绩pk'],
				semFlag: 0, //点击的seg索引
				semFlag0Data: { //总分及排名
					total_score: '', //考试满分
					score: '', //用户得分
					grd_order: '', //年级排名
					cls_order: '', //班级排名
					grd_stuc: '', //年级人数
					cls_stuc: '', //班级人数
					grd_max_score: '', //年级最高分
					cls_max_score: '', //班级最高分
					grd_avg_score: '', //年级平均分
					cls_avg_score: '', //班级平均分
					child_paper_list: [], //各科成绩列表
					chengjiQs: {}, //成绩趋势
					paimingQs: {}, //排名趋势
				},
				semFlag1Data: { //优劣学科
					pros_sub_names: '', //
					cons_sub_names: '', //
					list: [], //
					radarChartDetail: {},
				},
				semFlag2Data: { //成绩pk
					name: '',
					challenge_list: [],
					pk_list: []
				}
			}
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: '全科成绩'
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			// 1.9.全科总分及排名趋势
			this.getSumScoreOrder();
		},
		methods: {
			clickSeg: function(e) {
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					console.log('this.semFlag:' + e.currentIndex);
					if (this.semFlag == 0 && this.semFlag0Data.total_score.length == 0) {
						// 1.9.全科总分及排名趋势
						this.getSumScoreOrder();
					} else if (this.semFlag == 1 && this.semFlag1Data.pros_sub_names == '') {
						// 1.10.全科优劣学科
						this.getFullSubAnalysis();
					} else if (this.semFlag == 2 && this.semFlag2Data.name == '') {
						// 1.11.全科成绩pk
						this.getFullSubPK();
					}
				}
			},
			toDetailPage: function(model) {
				model.name = this.semFlag2Data.name;
				util.openwithData("/pages/student_performance/pk_xiangqing", model);
			},
			tiaozhanzhe: function() {
				if (this.semFlag2Data.challenge_list.length == 0) {
					this.showToast('暂时没有挑战者');
				} else {
					var tempM = {
						access: this.itemData.access,
						list: this.semFlag2Data.challenge_list
					}
					util.openwithData("/pages/student_performance/tiaozhanzhe", tempM, {
						getFullSubPK() { //子页面调用父页面需要的方法
							_this.getFullSubPK();
						}
					});
				}
			},
			yaoqing: function() {
				util.openwithData("/pages/student_performance/yaoqing", this.itemData, {
					getFullSubPK() { //子页面调用父页面需要的方法
						_this.getFullSubPK();
					}
				});
			},
			// 1.9.全科总分及排名趋势
			getSumScoreOrder() {
				let comData = {
					user_code: this.personInfo.user_code,
					id: this.itemData.id,
					index_code: this.itemData.access
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'fullSub/scoreOrder', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag0Data.name = data.data.name; //考试名称
						this.semFlag0Data.total_score = data.data.total_score; //考试满分
						this.semFlag0Data.score = data.data.score; //用户得分
						this.semFlag0Data.grd_order = data.data.grd_order; //年级排名
						this.semFlag0Data.cls_order = data.data.cls_order; //班级排名
						this.semFlag0Data.grd_stuc = data.data.grd_stuc; //年级人数
						this.semFlag0Data.cls_stuc = data.data.cls_stuc; //班级人数
						this.semFlag0Data.grd_max_score = data.data.grd_max_score; //年级最高分
						this.semFlag0Data.cls_max_score = data.data.cls_max_score; //班级最高分
						this.semFlag0Data.grd_avg_score = data.data.grd_avg_score; //年级平均分
						this.semFlag0Data.cls_avg_score = data.data.cls_avg_score; //班级平均分
						// this.semFlag0Data.pieChatDetail.graphic[1].style.text = data.data.score; //用户得分
						// this.semFlag0Data.pieChatDetail.graphic[3].style.text = '满分：' + data.data.total_score; //考试满分
						this.semFlag0Data.child_paper_list = data.data.child_paper_list;
						this.semFlag0Data.myScoreQs = {
							"series": [{
								"name": "满分",
								"data": data.data.score / data.data.total_score,
								"color": "#00CFBD"
							}]
						};
						this.semFlag0Data.myScoreShow = {
							title: {
								name: data.data.score + '分',
								fontSize: 25,
								color: 'red'
							},
							subtitle: {
								name: '满分:' + data.data.total_score,
								color: '#666666',
								fontSize: 13
							}
						}
						// 趋势
						var tempArr0 = []; //考试名称
						var tempArr1 = []; //用户得分
						var tempArr2 = []; //年级排名
						var tempArr3 = []; //班级排名
						var tempArr4 = []; //年级平均分
						var tempArr5 = []; //班级平均分
						for (var a = 0; a < data.data.order_list.length; a++) {
							var tempM = data.data.order_list[a];
							tempArr0.push('');
							tempArr1.push(tempM.score);
							tempArr2.push(tempM.grd_order);
							tempArr3.push(tempM.cls_order);
							tempArr4.push(tempM.grd_avg_score);
							tempArr5.push(tempM.cls_avg_score);
						}
						// 成绩趋势
						this.semFlag0Data.chengjiQs = {
							categories: tempArr0,
							series: [{
								name: "我的成绩",
								data: tempArr1
							}, {
								name: "班级平均分",
								data: tempArr5
							}, {
								name: "年级平均分",
								data: tempArr4
							}]
						}
						// 排名趋势
						this.semFlag0Data.paimingQs = {
							categories: tempArr0,
							series: [{
								name: "班级排名",
								data: tempArr3
							}, {
								name: "年级排名",
								data: tempArr2
							}]
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 1.10.全科优劣学科
			getFullSubAnalysis() {
				let comData = {
					user_code: this.personInfo.user_code,
					id: this.itemData.id,
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'fullSub/subAnalyse', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag1Data.pros_sub_names = data.data.pros_sub_names;
						this.semFlag1Data.cons_sub_names = data.data.cons_sub_names;
						this.semFlag1Data.list = data.data.list;
						// {"categories":["维度1","维度2","维度3","维度4","维度5","维度6"],"series":[{"name":"成交量1","data":[90,110,165,195,187,172]},{"name":"成交量2","data":[190,210,105,35,27,102]}]}
						// 趋势
						var tempArray0 = [];
						var tempArray1 = [];
						var tempArray2 = [];
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							tempArray0.push(tempM.sub_name);
							tempArray1.push(tempM.standard_score);
							tempArray2.push(tempM.avg);
						}
						this.semFlag1Data.radarChartDetail = {"categories":tempArray0,"series":[{"name":"分数","data":tempArray1},{"name":"平均分","data":tempArray2}]};
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 1.11.全科成绩pk
			getFullSubPK() {
				let comData = {
					user_code: this.personInfo.user_code,
					id: this.itemData.id,
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'fullSub/pk', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag2Data.name = data.data.name;
						this.semFlag2Data.challenge_list = [].concat(data.data.challenge_list);
						for (var a = 0; a < data.data.pk_list.length; a++) {
							var tempM = data.data.pk_list[a];
							tempM.pka = 0; //平
							tempM.pkb = 0; //胜
							tempM.pkc = 0; //败
							for (var b = 0; b < tempM.sub_score_list.length; b++) {
								var tempN = tempM.sub_score_list[b];
								if (tempN.my_score == tempN.pk_user_score) {
									tempM.pka++;
								} else if (tempN.my_score > tempN.pk_user_score) {
									tempM.pkb++;
								} else if (tempN.my_score < tempN.pk_user_score) {
									tempM.pkc++;
								}
							}
						}
						this.semFlag2Data.pk_list = [].concat(data.data.pk_list);
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	/* 试卷名称 */
	.examName {
		text-align: center;
		margin-top: 20px;
		margin-left: 20px;
		margin-right: 20px;
	}

	.leaveSum {
		margin-top: 10px;
		margin-left: 20px;
		margin-bottom: 0px;
		font-size: 12px;
		color: #505050;
	}

	/* 间隔 */
	.spaceLine {
		margin-top: 15px;
		margin-bottom: 10px;
		text-align: center;
		padding-top: 10px;
		padding-bottom: 10px;
		background: #d7f3ef;
		font-size: 14px;
		color: #505050;
	}

	.spaceLineName {
		padding-top: 5px;
		padding-left: 20px;
		font-size: 14px;
		color: #000000;
	}

	/* 班级、年级排名边框 */
	.scoreOrderBorder {
		width: 60px;
		height: 60px;
		border: 1px solid;
		border-radius: 50%;
		color: #00CFBD;
		margin-top: 40px;
		margin-left: 25px;
		text-align: center;
	}

	/* 班级、年级排名 */
	.scoreOrder {
		color: red;
		height: 60px;
		line-height: 60px;
		vertical-align: middle;
		font-size: 16px;
		text-align: center;
	}

	/* 班级、年级排名名字 */
	.scoreOrderName {
		font-size: 12px !important;
		width: 60px !important;
		margin-top: 5px;
		margin-left: 30px;
	}

	.fenxiBox {
		font-size: 13px;
		margin: 10px 5px 0 5px;
		min-height: 40px;
	}

	.scoreDetail {
		font-size: 11px;
		text-align: center;
		padding: 10px 0px;
		word-break: break-all;
	}

	/* 暂无数据 */
	.noData {
		margin-left: 20px;
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.cuotiNum {
		width: 30px !important;
		height: 30px !important;
		border-radius: 50%;
		background: #FF8D1A;
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

	/* 优劣势学科 */
	.goodBadSub {
		margin-left: 20px;
		color: white;
		padding: 3px 10px 3px 10px;
		border-radius: 10px;
		font-size: 13px;
	}

	::v-deep .uni-badge {
		line-height: 16px;
	}
</style>
