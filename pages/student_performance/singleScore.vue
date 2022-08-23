<template>
	<view>
		<!-- #ifdef H5 -->
		<view class="tabs-fixed">
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="button"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<!-- #endif -->
		<!-- #ifdef APP -->
		<view class="tabs-fixed" style="top: 0px;">
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="button"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<!-- #endif -->
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
						<uni-grid-item>
							<view class="grid-item-box">
								<p class="leaveSum">年级参考人数：{{semFlag0Data.grd_stuc}}</p>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box">
								<p class="leaveSum">班级参考人数：{{semFlag0Data.cls_stuc}}</p>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
				<h4 class="spaceLine">成绩趋势</h4>
				<p class="spaceLineName">历次考试成绩趋势如下：</p>
				<view class="charts-box" style="margin-top: 10px;">
					<qiun-data-charts :opts="{dataLabel:false}" type="demotype" :chartData="semFlag0Data.chengjiQs"
						background="none" />
				</view>
				<h4 class="spaceLine">排名趋势</h4>
				<p class="spaceLineName">历次考试排名趋势如下：</p>
				<view class="charts-box" style="margin-top: 10px;">
					<qiun-data-charts :opts="{dataLabel:false}" type="demotype" :chartData="semFlag0Data.paimingQs"
						background="none" />
				</view>
			</view>
			<view v-else-if="semFlag == 1">
				<h4 class="spaceLine">答卷图片</h4>
				<view v-for="(tempAns,index) in semFlag1Data.img_url_list" style="text-align: center;margin-top: 20px;"
					:key='index'>
					<image style="width:200px;height: 300px;border:2px solid;" :src='tempAns.merge_file_path'
						@click="clickAnsImg(tempAns.merge_file_path)"></image>
				</view>
			</view>
			<view v-else-if="semFlag == 2">
				<uni-row>
					<uni-col :span="10">
						<p class="scoreDetail" style='text-align: right;'>考试难度：</p>
					</uni-col>
					<uni-col :span="14">
						<uni-rate style="margin-top: 5px;" :max="5" :value="semFlag2Data.diff" />
					</uni-col>
				</uni-row>
				<view style="padding: 10px 15px;">
					<uni-grid :column="4" :square="false" :highlight="false">
						<uni-grid-item>
							<view class="grid-item-box fenxiBox">
								<text class="text">题型</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box fenxiBox">
								<text class="text">数量</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box fenxiBox">
								<text class="text">分值</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box fenxiBox">
								<text class="text">分值占比</text>
							</view>
						</uni-grid-item>
					</uni-grid>
					<uni-grid :column="4" :square="false" :highlight="false"
						v-for="(item, index) in semFlag2Data.que_type_list" :key="index" style="margin-top: -1px;">
						<uni-grid-item>
							<view class="grid-item-box fenxiBox">
								<text class="text">{{item.question_type_name}}</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box fenxiBox">
								<text class="text">{{item.count}}</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box fenxiBox">
								<text class="text">{{item.score}}</text>
							</view>
						</uni-grid-item>
						<uni-grid-item>
							<view class="grid-item-box fenxiBox">
								<text class="text">{{item.score_rate}}</text>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
				<h4 class="spaceLine">试题分析</h4>
				<view>
					<uni-row style="background: #e7e3e3;">
						<uni-col :span="3" style="height: 18px;">
							<p class="scoreDetail">题号</p>
						</uni-col>
						<uni-col :span="3">
							<p class="scoreDetail">分值</p>
						</uni-col>
						<uni-col :span="5">
							<p class="scoreDetail">年级满分人数</p>
						</uni-col>
						<uni-col :span="5">
							<p class="scoreDetail">年级平均分</p>
						</uni-col>
						<uni-col :span="5">
							<p class="scoreDetail">我的得分</p>
						</uni-col>
						<uni-col :span="3">
							<p class="scoreDetail"></p>
						</uni-col>
					</uni-row>
				</view>
				<view>
					<uni-row v-for="(item,index) in semFlag2Data.que_score_list" :key='index'
						style="background: #e1faeb;margin-top: 5px;">
						<view @click="toDetailPageSt(item)">
							<uni-col :span="3" style="height: 18px;">
								<p class="scoreDetail">{{item.question_number}}</p>
							</uni-col>
							<uni-col :span="3">
								<p class="scoreDetail">{{item.question_score}}</p>
							</uni-col>
							<uni-col :span="5">
								<p class="scoreDetail">{{item.full_score_stuc}}</p>
							</uni-col>
							<uni-col :span="5">
								<p class="scoreDetail">{{item.grd_avg_score}}</p>
							</uni-col>
							<uni-col :span="5">
								<p class="scoreDetail">{{item.score}}</p>
							</uni-col>
							<uni-col :span="3">
								<image style="width: 15px;height: 15px;margin-top: 10px;margin-left: 10px;"
									src="/static/images/student_performance//search.png"></image>
							</uni-col>
						</view>
					</uni-row>
				</view>
				<h4 class="spaceLine">知识点分析</h4>
				<view>
					<uni-row v-if="semFlag2Data.knowledge_list.length>0" style="background: #e7e3e3;">
						<uni-col :span="4" style="height: 18px;">
							<p class="scoreDetail">知识点</p>
						</uni-col>
						<uni-col :span="3">
							<p class="scoreDetail">分值</p>
						</uni-col>
						<uni-col :span="5">
							<p class="scoreDetail">考察题目</p>
						</uni-col>
						<uni-col :span="5">
							<p class="scoreDetail">年级均分</p>
						</uni-col>
						<uni-col :span="4">
							<p class="scoreDetail">我的得分</p>
						</uni-col>
						<uni-col :span="3">
							<p class="scoreDetail"></p>
						</uni-col>
					</uni-row>
				</view>
				<view>
					<uni-row v-for="(item,index) in semFlag2Data.knowledge_list" :key='index'
						style="background: #e1faeb;margin-top: 5px;">
						<view @click="toDetailPageZsd(item)">
							<uni-col :span="4" style="height: 18px;">
								<p class="scoreDetail">{{item.knowledge_name}}</p>
							</uni-col>
							<uni-col :span="3">
								<p class="scoreDetail">{{item.total_score}}</p>
							</uni-col>
							<uni-col :span="5">
								<p class="scoreDetail">{{item.question_numbers}}</p>
							</uni-col>
							<uni-col :span="5">
								<p class="scoreDetail">{{item.grd_avg_score}}</p>
							</uni-col>
							<uni-col :span="4">
								<p class="scoreDetail">{{item.score}}</p>
							</uni-col>
							<uni-col :span="3">
								<image style="width: 15px;height: 15px;margin-top: 10px;margin-left: 10px;"
									src="/static/images/student_performance//search.png"></image>
							</uni-col>
						</view>
					</uni-row>
				</view>
				<view v-if="semFlag2Data.knowledge_list.length==0" class="noData">暂无数据</view>
			</view>
			<view v-else-if="semFlag == 3">
				<view>
					<uni-row>
						<uni-col :span="12" style="height: 18px;">
							<p class="leaveSum">本次考试题量：{{semFlag3Data.que_count}}道</p>
						</uni-col>
						<uni-col :span="12">
							<p class="leaveSum">本次考试错题数量：{{semFlag3Data.error_que_count}}道</p>
						</uni-col>
					</uni-row>
				</view>
				<view style="margin: 10px 0 0 15px;font-size: 13px;">
					<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
					<view>高于年级平均分的错题</view>
				</view>
				<view style="margin-top: 15px;margin-left: 10px;">
					<p v-if="semFlag3Data.high_que_list.length == 0"
						style="margin-left: 20px;font-size: 13px;color: gray;">无</p>
					<uni-grid :column="10" :showBorder='false' :square="false" :highlight="false">
						<uni-grid-item v-for="(item,index) in semFlag3Data.high_que_list" :key='index'>
							<view class="grid-item-box">
								<p class="cuotiNum">{{item}}</p>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
				<view style="margin: 10px 0 0 15px;font-size: 13px;">
					<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
					<view>低于年级平均分的错题</view>
				</view>
				<view style="margin: 10px;">
					<p v-if="semFlag3Data.low_que_list.length == 0"
						style="margin-left: 20px;font-size: 13px;color: gray;">无</p>
					<uni-grid :column="10" :showBorder='false' :square="false" :highlight="false">
						<uni-grid-item v-for="(item,index) in semFlag3Data.low_que_list" :key='index'>
							<view class="grid-item-box">
								<p class="cuotiNum">{{item}}</p>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
				<view>
					<h4 style='margin-top: 0px;' class="spaceLine">错题详情</h4>
					<uni-row style="background: #e7e3e3;">
						<uni-col :span="3" style="height: 18px;">
							<p class="scoreDetail">题号</p>
						</uni-col>
						<uni-col :span="3">
							<p class="scoreDetail">分值</p>
						</uni-col>
						<uni-col :span="5">
							<p class="scoreDetail">年级满分人数</p>
						</uni-col>
						<uni-col :span="5">
							<p class="scoreDetail">年级平均分</p>
						</uni-col>
						<uni-col :span="5">
							<p class="scoreDetail">我的得分</p>
						</uni-col>
						<uni-col :span="3">
							<p class="scoreDetail"></p>
						</uni-col>
					</uni-row>
					<uni-row v-for="(item,index) in semFlag3Data.error_que_list" :key='index'
						style="background: #e1faeb;margin-top: 5px;" @click="toDetailPageCT(item)">
						<view @click="toDetailPageCT(item)">
							<uni-col :span="3" style="height: 18px;">
								<p class="scoreDetail">{{item.question_number}}</p>
							</uni-col>
							<uni-col :span="3">
								<p class="scoreDetail">{{item.question_score}}</p>
							</uni-col>
							<uni-col :span="5">
								<p class="scoreDetail">{{item.full_score_stuc}}</p>
							</uni-col>
							<uni-col :span="5">
								<p class="scoreDetail">{{item.grd_avg_score}}</p>
							</uni-col>
							<uni-col :span="5">
								<p class="scoreDetail">{{item.score}}</p>
							</uni-col>
							<uni-col :span="3">
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
				semValuesArray: ['成绩及排名', '我的答卷', '试卷分析', '错题归纳'],
				semFlag: 0, //点击的seg索引
				semFlag0Data: { //成绩及排名
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
					chengjiQs: {}, //成绩趋势
					paimingQs: {}, //排名趋势
					myScoreShow: {}, //
					myScoreQs: {}, //
				},
				semFlag1Data: { //我的答卷
					img_url_list: [],
				},
				semFlag2Data: { //试卷分析
					diff: '', //考试难度,值在0-1之间，0表示难度最大，1表示难度最小
					que_type_list: [], //题型列表
					que_score_list: [], //各题列表
					knowledge_list: [], //知识点列表
				},
				semFlag3Data: { //错题归纳
					name: '',
					high_que_list: [], //高于年级平均分的题号列表
					low_que_list: [], //低于年级平均分的题号列表
					error_que_list: [], //错题列表
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
				title: '单科成绩'
			});
			//#ifdef H5
			document.title = ""
			//#endif
			// 1.3.单科成绩及排名趋势
			this.getSingleScoreOrder();
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
		methods: {
			clickAnsImg(url) {
				console.log('clickAnsImg.url:' + url);
				let tempArray = [];
				tempArray.push(url);
				uni.previewImage({
					urls: tempArray,
				});
			},
			clickSeg: function(e) {
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					console.log('this.semFlag:' + e.currentIndex);
					if (this.semFlag == 0) {
						if (this.semFlag0Data.total_score.length == 0) {
							// 1.3.单科成绩及排名趋势
							this.getSingleScoreOrder();
						}
					} else if (this.semFlag == 1) {
						if (this.semFlag1Data.img_url_list.length == 0) {
							// 1.4.我的答卷
							this.getSingleSubAnswer();
						}
					} else if (this.semFlag == 2) {
						if (this.semFlag2Data.diff == '') {
							// 1.5.单科试卷分析
							this.getExamAnalysis();
						}
					} else if (this.semFlag == 3) {
						if (this.semFlag3Data.name.length == 0) {
							// 1.6.单科错题归纳
							this.getErrorQue();
						}
					}
				}
			},
			toDetailPageSt(line) { //试题分析
				console.log('toDetailPage:' + JSON.stringify(line));
				util.openwithData("/pages/student_performance/shijuan_shiti", [this.semFlag2Data.que_score_list, line, this
					.itemData.id, this.itemData.access, '试卷分析'
				]);
			},
			toDetailPageZsd: function(line) { //知识点分析
				util.openwithData("/pages/student_performance/shijuan_zhishidian", [this.semFlag2Data.knowledge_list,
					line, this.itemData.id, this.itemData.access, this.semFlag2Data.que_score_list
				]);
			},
			toDetailPageCT: function(line) { //错题详情
				util.openwithData("/pages/student_performance/shijuan_shiti", [this.semFlag3Data.error_que_list, line,
					this.itemData.id, this.itemData.access, '错题归纳'
				]);
			},
			//1.3.单科成绩及排名趋势
			getSingleScoreOrder() {
				let comData = {
					user_code: this.personInfo.user_code,
					id: this.itemData.id,
					page_number: 1,
					page_size: 10,
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'singleSub/scoreOrder', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag0Data.pageIndex++;
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
			// 1.4.我的答卷
			getSingleSubAnswer() {
				let comData = {
					user_code: this.personInfo.user_code,
					id: this.itemData.id,
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'singleSub/myAnswerPaper', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag1Data.img_url_list = [].concat(data.data.img_url_list);
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.5.单科试卷分析
			getExamAnalysis() {
				let comData = {
					user_code: this.personInfo.user_code,
					id: this.itemData.id,
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'singleSub/analysis', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag2Data.knowData = data.data;
						this.semFlag2Data.diff = 5 - data.data.diff * 5;
						this.semFlag2Data.que_type_list = [].concat(data.data.que_type_list);
						this.semFlag2Data.que_score_list = [].concat(data.data.que_score_list);
						this.semFlag2Data.knowledge_list = [].concat(data.data.knowledge_list);
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 1.6.单科错题归纳
			getErrorQue() {
				let comData = {
					user_code: this.personInfo.user_code,
					id: this.itemData.id,
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'singleSub/errorQue', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag3Data = data.data;
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
		margin: 10px 0 0 5px;
		height: 25px;
	}

	.scoreDetail {
		font-size: 11px;
		text-align: center;
		padding: 10px 0;
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
</style>
