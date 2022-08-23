<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<view style="font-size: 14px;text-align: center;padding-top: 5px;">{{navItem.name}}</view>
			<my-segmented-control ref='segmCon' :current="semFlag" :values="navItem.childList" @clickItem="clickSeg"
				styleType="text" activeColor="#00CFBD"></my-segmented-control>
		</view>
		<view class="content" style="margin-top: 65px;">
			<view v-show="semFlag == 0" style="">
				<view class="example-body">
					<uni-card isShadow :isFull="true" style="margin-top: 10px;"
						v-for="(model,index) in semFlag0Data.dataModel.cls_score_list" :key="index">
						<view class="content-box-text">
							<view class="card-title">{{model.cls_name}}</view>
							<view class="card-line" style="margin-left: -10px;"></view>
							<uni-row style="">
								<uni-col style="" :span="12">
									<p class="scoreDetail" style='text-align: left;'>总人数：{{model.stu_count}}</p>
								</uni-col>
								<uni-col style="" :span="12">
									<p class="scoreDetail" style='text-align: left;'>有成绩人数：{{model.score_stu_count}}</p>
								</uni-col>
								<uni-col :span="8">
									<view class="charts-box" style="width: 100px;height: 100px;text-align: center;">
										<qiun-data-charts type="arcbar" :opts="model.avgShow" :animation="false"
											:chartData="model.avgDFL" />
									</view>
								</uni-col>
								<uni-col :span="8">
									<view class="charts-box" style="width: 100px;height: 100px;text-align: center;">
										<qiun-data-charts type="arcbar" :opts="model.maxShow" :animation="false"
											:chartData="model.maxDFL" />
									</view>
								</uni-col>
								<uni-col :span="8">
									<view class="charts-box" style="width: 100px;height: 100px;text-align: center;">
										<qiun-data-charts type="arcbar" :opts="model.minShow" :animation="false"
											:chartData="model.minDFL" />
									</view>
								</uni-col>
							</uni-row>
						</view>
					</uni-card>
					<uni-card isShadow :isFull="true" style="margin-top: 10px;"
						v-if="semFlag0Data.dataModel.cls_list&&semFlag0Data.dataModel.cls_list.length>0">
						<view class="content-box-text">
							<view class="card-line"></view>
							<uni-row style="font-size: 13px;margin-top: 7px;margin-bottom: 7px;">
								<uni-col style="" :span="10">
									<view class="card-title">学生成绩</view>
								</uni-col>
								<uni-col style="text-align: right;" :span="14">
									<picker style="flex: 1;" @change="clickCls" :value="semFlag0Data.clsIndex"
										:range="semFlag0Data.dataModel.cls_list" range-key="cls_name">
										<uni-easyinput-select :inputBorder="false" suffixIcon="arrowdown" disabled
											:value="semFlag0Data.clsIndex>=0?'班级：'+semFlag0Data.dataModel.cls_list[semFlag0Data.clsIndex].cls_name:'请选择'">
										</uni-easyinput-select>
									</picker>
								</uni-col>
							</uni-row>
							<uni-row style="margin: 10px -12px 0 -12px;background-color: #e5e3e3;height: 40px;">
								<uni-col style="" :span="3">
									<p class="scoreDetail">序号</p>
								</uni-col>
								<uni-col style="" :span="7">
									<p class="scoreDetail">班级</p>
								</uni-col>
								<uni-col style="" :span="7">
									<p class="scoreDetail">姓名</p>
								</uni-col>
								<uni-col style="" :span="5">
									<p class="scoreDetail">总分</p>
								</uni-col>
								<uni-col style="" :span="2">
									<p class="scoreDetail"> </p>
								</uni-col>
							</uni-row>
							<uni-row
								v-for="(model,index) in semFlag0Data.dataModel.cls_list[semFlag0Data.clsIndex].stuArray"
								:key="index" style="margin: 5px -12px 0 -12px;">
								<view @click="toHomeWorkQueryDetail(model)">
									<uni-col style="" :span="3">
										<p class="stuScoreDetail">{{index+1}}</p>
										<view class="card-line" style="margin-left: 10px;"></view>
									</uni-col>
									<uni-col style="" :span="7">
										<p class="stuScoreDetail">{{model.cls_name}}</p>
									</uni-col>
									<uni-col style="" :span="7">
										<p class="stuScoreDetail">{{model.stu_name}}</p>
									</uni-col>
									<uni-col style="" :span="5">
										<p class="stuScoreDetail">{{model.total_score}}</p>
									</uni-col>
									<uni-col style="" :span="2">
										<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
											size="20">
										</uni-icons>
									</uni-col>
								</view>
							</uni-row>
							<view v-if="semFlag0Data.dataModel.cls_list[semFlag0Data.clsIndex].stuArray.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</view>
					</uni-card>
				</view>
			</view>
			<view v-if="semFlag == 1">
				<view class="example-body">
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<view class="content-box-text">
							<view class="card-title">作业概况</view>
							<view class="card-line" style="margin-left: -10px;"></view>
							<uni-row style="">
								<uni-col style="" :span="24">
									<view class="card-title" style='text-align: center;margin-top: 5px;'>题型分值占比</view>
								</uni-col>
								<uni-col :span="24">
									<qiun-data-charts style="height: 120px;" type="ring" :animation="false"
										:chartData="semFlag1Data.chartData" background="none" />
								</uni-col>
							</uni-row>
							<view class="card-line" style="margin-left: -10px;"></view>
							<uni-row style="">
								<uni-col style="" :span="24">
									<view class="card-title" style='text-align: center;margin-top: 5px;'>平均分</view>
								</uni-col>
								<uni-col :span="8" v-for="(model,index) in semFlag1Data.generalList" :key="index">
									<view class="charts-box" style="width: 100px;height: 100px;text-align: center;">
										<qiun-data-charts type="arcbar" :opts="model.avgShow" :animation="false"
											:chartData="model.avgDFL" />
									</view>
								</uni-col>
							</uni-row>
							<view v-if="semFlag1Data.generalList.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
							<view class="card-line" style="margin-left: -10px;"></view>
							<uni-row style="">
								<uni-col style="" :span="24">
									<view class="card-title" style='text-align: center;margin-top: 5px;'>得分率</view>
								</uni-col>
								<uni-col :span="8" v-for="(model,index) in semFlag1Data.generalList" :key="index">
									<view class="charts-box" style="width: 100px;height: 100px;text-align: center;">
										<qiun-data-charts type="arcbar" :opts="model.dflShow" :animation="false"
											:chartData="model.dflDFL" />
									</view>
								</uni-col>
							</uni-row>
							<view v-if="semFlag1Data.generalList.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</view>
					</uni-card>
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<view class="content-box-text">
							<view class="card-title">低得分率小题</view>
							<view class="card-line"></view>
							<view style="margin-top: 15px;margin-left: 10px;">
								<p v-if="semFlag1Data.bad_list.length == 0"
									style="margin-left: 20px;font-size: 13px;color: gray;">无</p>
								<uni-grid :column="10" :showBorder='false' :square="false" :highlight="false">
									<uni-grid-item v-for="(item,index) in semFlag1Data.bad_list" :key='index'>
										<p @click="toDetailPageKnowPoint(item)" class="cuotiNum">
											{{item.question_number}}</p>
									</uni-grid-item>
								</uni-grid>
							</view>
						</view>
					</uni-card>
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<view class="content-box-text">
							<view class="card-title">高得分率小题</view>
							<view class="card-line"></view>
							<view style="margin-top: 15px;margin-left: 10px;">
								<p v-if="semFlag1Data.good_list.length == 0"
									style="margin-left: 20px;font-size: 13px;color: gray;">无</p>
								<uni-grid :column="10" :showBorder='false' :square="false" :highlight="false">
									<uni-grid-item v-for="(item,index) in semFlag1Data.good_list" :key='index'>
										<p @click="toDetailPageKnowPoint(item)" class="cuotiNum"
											style='background: #43cf7c;'>{{item.question_number}}</p>
									</uni-grid-item>
								</uni-grid>
							</view>
						</view>
					</uni-card>
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<view class="content-box-text">
							<view class="card-title">各题详情</view>
							<uni-row style="margin: 10px -12px 0 -12px;background-color: #e5e3e3;height: 40px;">
								<uni-col style="" :span="3">
									<p class="scoreDetail">题号</p>
								</uni-col>
								<uni-col style="" :span="7">
									<p class="scoreDetail">满分</p>
								</uni-col>
								<uni-col style="" :span="7">
									<p class="scoreDetail">平均分</p>
								</uni-col>
								<uni-col style="" :span="5">
									<p class="scoreDetail">得分率</p>
								</uni-col>
								<uni-col style="" :span="2">
									<p class="scoreDetail"> </p>
								</uni-col>
							</uni-row>
							<uni-row v-for="(model,index) in semFlag1Data.list" :key="index"
								style="margin: 5px -12px 0 -12px;">
								<view @click="toDetailPageKnowPoint(model)">
									<uni-col style="" :span="3">
										<p class="stuScoreDetail">{{model.question_number}}</p>
										<view class="card-line" style="margin-left: 10px;"></view>
									</uni-col>
									<uni-col style="" :span="7">
										<p class="stuScoreDetail">{{model.question_score}}</p>
									</uni-col>
									<uni-col style="" :span="7">
										<p class="stuScoreDetail">{{model.avg_score}}</p>
									</uni-col>
									<uni-col style="" :span="5">
										<p class="stuScoreDetail">{{model.score_radio}}</p>
									</uni-col>
									<uni-col style="" :span="2">
										<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
											size="20">
										</uni-icons>
									</uni-col>
								</view>
							</uni-row>
							<view v-if="semFlag1Data.list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</view>
					</uni-card>
				</view>
			</view>
			<view v-if="semFlag == 2">
				<view class="example-body">
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<view class="content-box-text">
							<view class="card-title">低得分率知识点</view>
							<uni-list>
								<uni-list-item :border="false" v-for="(model,index) in semFlag2Data.bad_list"
									:key='index' direction='column' clickable @click="toAnalyseDetail(model)">
									<view slot="body">
										<uni-row style="">
											<uni-col style="" :span="2">
												<view
													style="padding: 1px;margin-top: 0px;width: 20px;height: 20px;font-size: 14px;">
													{{index+1}}
												</view>
												<view class="card-line"></view>
											</uni-col>
											<uni-col style="" :span="20">
												<view
													style="font-size: 13px;margin-top: 3px;text-align: center;color: #F86A6A;">
													{{model.knowledge_name}}
												</view>
											</uni-col>
											<uni-col style="" :span="2">
												<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
													size="20"></uni-icons>
											</uni-col>
										</uni-row>
									</view>
								</uni-list-item>
							</uni-list>
							<view v-if="semFlag2Data.bad_list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</view>
					</uni-card>
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<view class="content-box-text">
							<view class="card-title">高得分率知识点</view>
							<uni-list>
								<uni-list-item :border="false" v-for="(model,index) in semFlag2Data.good_list"
									:key='index' direction='column' clickable @click="toAnalyseDetail(model)">
									<view slot="body">
										<uni-row style="">
											<uni-col style="" :span="2">
												<view
													style="padding: 1px;margin-top: 0px;width: 20px;height: 20px;font-size: 14px;">
													{{index+1}}
												</view>
												<view class="card-line"></view>
											</uni-col>
											<uni-col style="" :span="20">
												<view
													style="font-size: 13px;margin-top: 3px;text-align: center;color: #499DF8;">
													{{model.knowledge_name}}
												</view>
											</uni-col>
											<uni-col style="" :span="2">
												<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
													size="20"></uni-icons>
											</uni-col>
										</uni-row>
									</view>
								</uni-list-item>
							</uni-list>
							<view v-if="semFlag2Data.good_list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</view>
					</uni-card>
					<view class="card-title" style="margin-top: 10px;">各知识点详情</view>
					<uni-card isShadow :isFull="true" style="margin-top: 5px;"
						v-for="(model,index) in semFlag2Data.list" :key="index">
						<view class="content-box-text">
							<view class="card-title" style="text-align: center;">{{model.knowledge_name}}</view>
							<view class="card-line"></view>
							<uni-row style="margin: 5px -12px 0 -12px;">
								<view @click="toAnalyseDetail(model)">
									<uni-col style="" :span="8">
										<view class="charts-box"
											style="width: 100px;height: 100px;text-align: center;margin-left: 10px;">
											<qiun-data-charts type="arcbar" :opts="model.dflShow" :animation="false"
												:chartData="model.dflDFL" />
										</view>
									</uni-col>
									<uni-col style="" :span="12">
										<p class="stuScoreDetail" style='text-align: left;'>分值：{{model.knowledge_score}}
										</p>
										<p class="stuScoreDetail" style='text-align: left;'>平均得分：{{model.avg_score}}</p>
										<p class="stuScoreDetail" style='text-align: left;'>最高分：{{model.max_score}}</p>
										<p class="stuScoreDetail" style='text-align: left;'>最低分：{{model.min_score}}</p>
										<p class="stuScoreDetail" style='text-align: left;'>考查题目：{{model.numStr}}</p>
									</uni-col>
									<uni-col style="margin-top: 50px;" :span="2">
										<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
											size="20">
										</uni-icons>
									</uni-col>
								</view>
							</uni-row>
						</view>
					</uni-card>
				</view>
			</view>
			<view v-if="semFlag == 3">
				<view class="example-body">
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<view class="content-box-text">
							<view class="card-title">低得分率题型</view>
							<uni-list>
								<uni-list-item :border="false" v-for="(model,index) in semFlag3Data.bad_list"
									:key='index' direction='column' clickable @click="toAnalyseDetail(model)">
									<view slot="body">
										<uni-row style="">
											<uni-col style="" :span="2">
												<view
													style="padding: 1px;margin-top: 0px;width: 20px;height: 20px;font-size: 14px;">
													{{index+1}}
												</view>
												<view class="card-line"></view>
											</uni-col>
											<uni-col style="" :span="20">
												<view
													style="font-size: 13px;margin-top: 3px;text-align: center;color: #F86A6A;">
													{{model.question_type_name}}
												</view>
											</uni-col>
											<uni-col style="" :span="2">
												<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
													size="20"></uni-icons>
											</uni-col>
										</uni-row>
									</view>
								</uni-list-item>
							</uni-list>
							<view v-if="semFlag3Data.bad_list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</view>
					</uni-card>
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<view class="content-box-text">
							<view class="card-title">高得分率题型</view>
							<uni-list>
								<uni-list-item :border="false" v-for="(model,index) in semFlag3Data.good_list"
									:key='index' direction='column' clickable @click="toAnalyseDetail(model)">
									<view slot="body">
										<uni-row style="">
											<uni-col style="" :span="2">
												<view
													style="padding: 1px;margin-top: 0px;width: 20px;height: 20px;font-size: 14px;">
													{{index+1}}
												</view>
												<view class="card-line"></view>
											</uni-col>
											<uni-col style="" :span="20">
												<view
													style="font-size: 13px;margin-top: 3px;text-align: center;color: #499DF8;">
													{{model.question_type_name}}
												</view>
											</uni-col>
											<uni-col style="" :span="2">
												<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
													size="20"></uni-icons>
											</uni-col>
										</uni-row>
									</view>
								</uni-list-item>
							</uni-list>
							<view v-if="semFlag3Data.good_list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</view>
					</uni-card>
					<view class="card-title" style="margin-top: 10px;">题型详情</view>
					<uni-card isShadow :isFull="true" style="margin-top: 5px;"
						v-for="(model,index) in semFlag3Data.list" :key="index">
						<view class="content-box-text">
							<view class="card-title" style="text-align: center;">{{model.question_type_name}}</view>
							<view class="card-line"></view>
							<uni-row style="margin: 5px -12px 0 -12px;">
								<view @click="toAnalyseDetail(model)">
									<uni-col style="" :span="8">
										<view class="charts-box"
											style="width: 100px;height: 100px;text-align: center;margin-left: 10px;">
											<qiun-data-charts type="arcbar" :opts="model.dflShow" :animation="false"
												:chartData="model.dflDFL" />
										</view>
									</uni-col>
									<uni-col style="" :span="12">
										<p class="stuScoreDetail" style='text-align: left;'>分值：{{model.question_type_score}}
										</p>
										<p class="stuScoreDetail" style='text-align: left;'>平均得分：{{model.avg_score}}</p>
										<p class="stuScoreDetail" style='text-align: left;'>最高分：{{model.max_score}}</p>
										<p class="stuScoreDetail" style='text-align: left;'>最低分：{{model.min_score}}</p>
										<p class="stuScoreDetail" style='text-align: left;'>考查题目：{{model.numStr}}</p>
									</uni-col>
									<uni-col style="margin-top: 50px;" :span="2">
										<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
											size="20">
										</uni-icons>
									</uni-col>
								</view>
							</uni-row>
						</view>
					</uni-card>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import levelLinkage from "@/components/three-level-linkage/linkage.nvue"
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				pageSize: 20,
				semFlag: 0, //点击的seg索引
				semFlag0Data: { //
					dataModel: [],
					clsIndex: 0,
				},
				semFlag1Data: { //
					generalList: [],
					chartData: {},
					bad_list: [],
					good_list: [],
					list: [],
				},
				semFlag2Data: {
					bad_list: [],
					good_list: [],
					list: [],
				},
				semFlag3Data: {
					bad_list: [],
					good_list: [],
					list: [],
				}
			}
		},
		components: {
			mynavBar,
			levelLinkage
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			let tempM = util.getPageData(option);
			tempM.index = 100;
			tempM.text = '作业/周测分析';
			tempM.childList = [{
				name: '作业成绩'
			}, {
				name: '试题分析'
			}, {
				name: '知识点分析'
			}, {
				name: '题型分析'
			}];
			this.navItem = tempM;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
			//1.196.上交情况与作业成绩
			this.homeWorkQueryDetail();
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
			clickCls(e) {
				if (this.semFlag0Data.clsIndex !== e.detail.value) {
					this.semFlag0Data.clsIndex = e.detail.value
				}
			},
			toHomeWorkQueryDetail(model) {
				model.access = this.navItem.access;
				model.create_time = this.navItem.exam_date;
				model.name = this.navItem.name;
				model.text = '成绩详情';
				model.id = model.result_id;
				model.flag = 1; //0班级，1学生
				console.log('model:' + JSON.stringify(model));
				util.openwithData("/pages/homeworkAndWeektest/stuStatistics_stuDetail", model);
			},
			toDetailPageKnowPoint(model) {
				model.access = this.navItem.access.split('#')[1];
				model.id = this.navItem.id;
				model.text = '试题分析';
				console.log('model:' + JSON.stringify(model));
				util.openwithData("/pages/homeworkAndWeektest/hwWtAnalyse_analyse", model);
			},
			toAnalyseDetail(model){
				model.index_code = this.navItem.access.split('#')[1];
				model.text = '知识点分析';
				model.id = this.navItem.id;
				model.paper_question_number = model.question_numbers;
				model.flag = 3;//0班级，1学生
				console.log('model:'+JSON.stringify(model));
				util.openwithData("/pages/homeworkAndWeektest/correct_analyseDetail", model);
			},
			openLevel() {
				this.$refs.levelLinkage.open();
			},
			onConfirm(e) {
				console.log('onConfirm:' + JSON.stringify(e))
				// e 确认后选中的数据
				this.semFlag1Data.pickerStr = e.name;
				this.semFlag1Data.catalog_list = [].concat(this.semFlag1Data.treeData[e.value[0]].children[e.value[1]]
					.children);
			},
			clickSeg: function(e) {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					console.log('this.semFlag:' + e.currentIndex);
					if (this.semFlag == 0) {
						if (!this.semFlag0Data.dataModel.cls_list) {
							this.homeWorkQueryDetail();
						}
					} else if (this.semFlag == 1) {
						if (this.semFlag1Data.bad_list.length == 0) {
							this.getGeneraQueAnalysis();
						}
					} else if (this.semFlag == 2) {
						if (this.semFlag2Data.bad_list.length == 0) {
							this.getHomeWorkQueryKnowledge();
						}
					} else if (this.semFlag == 3) {
						if (this.semFlag3Data.bad_list.length == 0) {
							this.getHomeWorkQueryQuestionType();
						}
					}
				}
			},
			//1.196.上交情况与作业成绩
			homeWorkQueryDetail() {
				var comData = {
					id: this.navItem.id,
					index_code: this.navItem.access.split('#')[1]
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'homeWorkQuery/detail', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.cls_score_list.length; i++) {
							let tempM = data.data.cls_score_list[i];
							var tempDFL = {
								"series": [{
									"name": "最高分",
									"data": parseFloat((tempM.max_score ? tempM.max_score : 0) / 100)
										.toFixed(1),
									"color": "#00CFBD"
								}]
							};
							tempM.maxDFL = JSON.parse(JSON.stringify(tempDFL));

							tempM.minDFL = JSON.parse(JSON.stringify(tempDFL));
							tempM.minDFL.series[0].name = '最低分';
							tempM.minDFL.series[0].data = parseFloat((tempM.min_score ? tempM.min_score : 0) / 100)
								.toFixed(1);

							tempM.avgDFL = JSON.parse(JSON.stringify(tempDFL));
							tempM.avgDFL.series[0].name = '平均分';
							tempM.avgDFL.series[0].data = parseFloat((tempM.avg_score ? tempM.avg_score : 0) / 100)
								.toFixed(1);
							var tempShow = {
								title: {
									name: parseFloat((tempM.max_score ? tempM.max_score : 0)).toFixed(1),
									fontSize: 15,
									color: '#00CFBD'
								},
								subtitle: {
									name: '最高分',
									color: '#666666',
									fontSize: 11
								},
								extra: {
									arcbar: {
										width: '5',
										type: "circle",
										startAngle: 0.5,
										endAngle: 0.5,
									}
								}
							};
							tempM.maxShow = JSON.parse(JSON.stringify(tempShow));

							tempM.minShow = JSON.parse(JSON.stringify(tempShow));
							tempM.minShow.title.name = parseFloat((tempM.min_score ? tempM.min_score : 0)).toFixed(
								1);
							tempM.minShow.subtitle.name = '最低分';

							tempM.avgShow = JSON.parse(JSON.stringify(tempShow));
							tempM.avgShow.title.name = parseFloat((tempM.avg_score ? tempM.avg_score : 0)).toFixed(
								1);
							tempM.avgShow.subtitle.name = '平均分';
						}
						for (var i = 0; i < data.data.cls_list.length; i++) {
							let tempM = data.data.cls_list[i];
							tempM.stuArray = [];
							for (var a = 0; a < data.data.stu_score_list.length; a++) {
								let tempStu = data.data.stu_score_list[a];
								if (tempM.cls_code == '-1') {
									tempM.stuArray.push(tempStu);
								} else if (tempM.cls_code == tempStu.cls_code) {
									tempM.stuArray.push(tempStu);
								}
							}
						}
						this.semFlag0Data.dataModel = data.data;
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.199.作业概况
			getGeneraQueAnalysis() {
				var comData = {
					id: this.navItem.id,
					index_code: this.navItem.access.split('#')[1]
				}
				this.showLoading();
				// 1.199.作业概况
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'homeWorkQuery/getGeneral', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						//解析list 形成图表
						let valueList = [];
						data.data.list.map(function(item) {
							let name = '';
							let obj = {};
							if (item.question_type_name == '合计') {
								obj.data = 0;
								name = '总题量：' + item.count + '题' +
									'\xa0\xa0' + '总分：' + item.score + '分';
							} else {
								obj.data = parseFloat(item.score_radio);
								name = item.question_type_name + '\xa0\xa0' + item.count + '题' +
									'\xa0\xa0' + item.score + '分' + '\xa0\xa0' + item.score_radio + '%';
							}
							obj.name = name;
							valueList.push(obj);

						})
						let tempdata = {
							series: valueList
						}
						this.semFlag1Data.chartData = tempdata;
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							var tempDFL = {
								"series": [{
									"name": tempM.question_type_name,
									"data": parseFloat((tempM.radio ? tempM.radio : 0) / 100).toFixed(
										1),
									"color": "#00CFBD"
								}]
							};
							tempM.dflDFL = JSON.parse(JSON.stringify(tempDFL));

							tempM.avgDFL = JSON.parse(JSON.stringify(tempDFL));
							tempM.avgDFL.series[0].data = parseFloat((tempM.avg ? tempM.avg : 0) / tempM.score)
								.toFixed(1);
							var tempShow = {
								title: {
									name: parseFloat((tempM.radio ? tempM.radio : 0)).toFixed(1),
									fontSize: 15,
									color: '#00CFBD'
								},
								subtitle: {
									name: tempM.question_type_name,
									color: '#666666',
									fontSize: 11
								},
								extra: {
									arcbar: {
										width: '5',
										type: "circle",
										startAngle: 0.5,
										endAngle: 0.5,
									}
								}
							};
							tempM.dflShow = JSON.parse(JSON.stringify(tempShow));

							tempM.avgShow = JSON.parse(JSON.stringify(tempShow));
							tempM.avgShow.title.name = parseFloat((tempM.avg ? tempM.avg : 0)).toFixed(1);
						}
						this.semFlag1Data.generalList = [].concat(data.data.list);
					} else {
						this.showToast(data.msg);
					}
				});

				var comData1 = {
					id: this.navItem.id,
					index_code: this.navItem.access.split('#')[1]
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'homeWorkQuery/queAnalysis', comData1, (data0,
				data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag1Data.bad_list = [].concat(data.data.bad_list);
						this.semFlag1Data.good_list = [].concat(data.data.good_list);
						this.semFlag1Data.list = [].concat(data.data.list);
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.210.题型分析
			getHomeWorkQueryKnowledge() {
				var comData = {
					id: this.navItem.id,
					index_code: this.navItem.access.split('#')[1]
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'homeWorkQuery/knowledge', comData, (data0,
					data) => {
					this.hideLoading();
					uni.stopPullDownRefresh();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							let tempMap = {};
							tempM.question_numbers.split(',').map((num) => {
								let group = num.split('|');
								if (tempMap[group[0]]) {
									tempMap[group[0]].push(group[1]);
								} else {
									tempMap[group[0]] = [group[1]];
								}
							})
							tempM.numStr = '';
							Object.keys(tempMap).map((key) => {
								tempM.numStr = tempM.numStr + this.toChinesNum(key) + '、' + tempMap[key] + '；'
							})
							console.log('tempM.numStr:' + tempM.numStr);
							var tempDFL = {
								"series": [{
									"name": '平均得分率',
									"data": parseFloat((tempM.score_radio ? tempM.score_radio : 0) /
										100).toFixed(
										1),
									"color": "#00CFBD"
								}]
							};
							tempM.dflDFL = JSON.parse(JSON.stringify(tempDFL));
							var tempShow = {
								title: {
									name: parseFloat((tempM.score_radio ? tempM.score_radio : 0)).toFixed(1),
									fontSize: 15,
									color: '#00CFBD'
								},
								subtitle: {
									name: '平均得分率',
									color: '#666666',
									fontSize: 11
								},
								extra: {
									arcbar: {
										width: '5',
										type: "circle",
										startAngle: 0.5,
										endAngle: 0.5,
									}
								}
							};
							tempM.dflShow = JSON.parse(JSON.stringify(tempShow));
						}
						console.log('data.data.list:' + JSON.stringify(data.data.list));
						this.semFlag2Data.bad_list = [].concat(data.data.bad_list);
						this.semFlag2Data.good_list = [].concat(data.data.good_list);
						this.semFlag2Data.list = [].concat(data.data.list);
					} else {
						this.showToast(data.msg);
					}
				});
			},
			toChinesNum(num) {
				let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
				let unit = ["", "十", "百", "千", "万"];
				num = parseInt(num);
				let getWan = (temp) => {
					let strArr = temp.toString().split("").reverse();
					let newNum = "";
					for (var i = 0; i < strArr.length; i++) {
						newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" :
							changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
					}
					return newNum;
				}
				let overWan = Math.floor(num / 10000);
				let noWan = num % 10000;
				if (noWan.toString().length < 4) {
					noWan = "0" + noWan;
				}
				return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
			},
			//1.204.题型分析
			getHomeWorkQueryQuestionType() {
				var comData = {
					id: this.navItem.id,
					index_code: this.navItem.access.split('#')[1]
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'homeWorkQuery/questionType', comData, (data0,
					data) => {
					this.hideLoading();
					uni.stopPullDownRefresh();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							let tempMap = {};
							tempM.question_numbers.split(',').map((num) => {
								let group = num.split('|');
								if (tempMap[group[0]]) {
									tempMap[group[0]].push(group[1]);
								} else {
									tempMap[group[0]] = [group[1]];
								}
							})
							tempM.numStr = '';
							Object.keys(tempMap).map((key) => {
								tempM.numStr = tempM.numStr + this.toChinesNum(key) + '、' + tempMap[key] + '；'
							})
							console.log('tempM.numStr:' + tempM.numStr);
							var tempDFL = {
								"series": [{
									"name": '平均得分率',
									"data": parseFloat((tempM.score_radio ? tempM.score_radio : 0) /
										100).toFixed(
										1),
									"color": "#00CFBD"
								}]
							};
							tempM.dflDFL = JSON.parse(JSON.stringify(tempDFL));
							var tempShow = {
								title: {
									name: parseFloat((tempM.score_radio ? tempM.score_radio : 0)).toFixed(1),
									fontSize: 15,
									color: '#00CFBD'
								},
								subtitle: {
									name: '平均得分率',
									color: '#666666',
									fontSize: 11
								},
								extra: {
									arcbar: {
										width: '5',
										type: "circle",
										startAngle: 0.5,
										endAngle: 0.5,
									}
								}
							};
							tempM.dflShow = JSON.parse(JSON.stringify(tempShow));
						}
						console.log('data.data.list:' + JSON.stringify(data.data.list));
						this.semFlag3Data.bad_list = [].concat(data.data.bad_list);
						this.semFlag3Data.good_list = [].concat(data.data.good_list);
						this.semFlag3Data.list = [].concat(data.data.list);
					} else {
						this.showToast(data.msg);
					}
				});
			},
		}
	}
</script>

<style>
	.scoreDetail {
		font-size: 13px;
		text-align: center;
		margin-top: 10px;
	}

	.stuScoreDetail {
		font-size: 13px;
		color: #505050;
		text-align: center;
		min-height: 20px;
		margin-top: 5px;
		/* background-color: #e5e5e5;
		border-radius: 5px;
		margin-left: 2px;
		margin-right: 2px; */
	}

	/* 间隔 */
	.spaceLine {
		text-align: center;
		padding-top: 10px;
		padding-bottom: 10px;
		background: #d7f3ef;
		font-size: 14px;
		color: #505050;
	}

	::v-deep .uni-list--border-bottom {
		height: 0px;
	}

	.peopleImg {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 50px);
	}

	.biaoti {
		font-size: 13px;
		width: calc(100% - 50px);
	}

	.biaoti0 {
		font-size: 13px;
		width: calc(100%);
	}

	.title {
		height: 100%;
		float: left;
		font-size: 13px;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #000000;
	}

	.nameTime {
		font-size: 13px;
	}

	.nameContent {
		color: gray;
		font-size: 13px;
	}

	.tempCss {
		font-size: 13px;
		float: left;
		color: gray;
		word-break: break-all;
	}

	.uni-col {
		margin-top: 0px;
	}

	.card-line {
		height: 1px;
		width: 999px;
		background-color: #e5e5e5;
		margin-top: 5px;
		margin-bottom: 0px;
	}

	.msg-content {
		word-break: break-all;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #eef0f2;
		/* height: calc(100% - 300px) !important; */
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #eef0f2;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 1px 0;
		/* padding-bottom: 50px; */
	}

	.content-box-text {
		font-size: 12px;
		line-height: 22px;
	}

	.card-title {
		font-size: 15px;
		margin-bottom: 5px;
		/* text-align: center; */
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
