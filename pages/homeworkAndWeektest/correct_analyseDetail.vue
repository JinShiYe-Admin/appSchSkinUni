<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="text-align: center;margin-top: 10px;">
			<text class="title-text">{{navItem.knowledge_name?navItem.knowledge_name:navItem.question_type_name}}
				相关试题</text>
		</view>
		<view style="padding:8px 15px 0;display: flex;justify-content: space-around;">
			<view class="charts-box">
				<qiun-data-charts type="arcbar" :opts="scoreOpts" :chartData="score" />
			</view>
		</view>
		<view style="background:#d5f8f6;">
			<view style="display: flex;">
				<picker style="flex: 1;" @change="questionClick" :value="questionIndex" :range="questionList"
					range-key="text">
					<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
						{{questionIndex>=0?questionList[questionIndex].text:'请选择'}}
						<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</picker>
			</view>
		</view>
		<view class="content" style="margin-top: 10px;padding-bottom:35px ;">
			<view style="font-size: 13px;text-align: center;color:#505050 ;word-break: break-all;padding: 0 15px;">
				<text>来源：{{question.remark}}</text>
			</view>
			<uni-card v-if="navItem.flag == 0||navItem.flag == 3" isShadow :isFull="true">
				<view class="content-box-text">
					<view class="card-title">答题情况</view>
					<view class="card-line"></view>
					<uni-row style="">
						<uni-col style="" :span="12">
							<p class="scoreDetail">参考人数：{{stu_count}}</p>
						</uni-col>
						<uni-col style="" :span="12">
							<p class="scoreDetail">满分：{{question_score}}</p>
						</uni-col>
						<uni-col style="" :span="12">
							<p class="scoreDetail">平均分：{{avg_score}}</p>
						</uni-col>
						<uni-col style="" :span="12">
							<p class="scoreDetail">得分率：{{score_radio}}%</p>
						</uni-col>
					</uni-row>
					<uni-row style="margin: 15px -15px 0 -15px;background-color: #e5e3e3;height: 40px;">
						<uni-col style="" :span="8">
							<p class="scoreDetail">分数段</p>
						</uni-col>
						<uni-col style="" :span="8">
							<p class="scoreDetail">人数</p>
						</uni-col>
						<uni-col style="" :span="8">
							<p class="scoreDetail">人数占比</p>
						</uni-col>
					</uni-row>
					<uni-row v-for="(model,index) in score_section_list" :key="index"
						style="margin: 5px 0 0 0;text-align: center;">
						<uni-col style="" :span="8">
							<p class="stuScoreDetail">{{model.key}}</p>
							<view class="card-line" style="margin-left: 10px;"></view>
						</uni-col>
						<uni-col style="" :span="8">
							<p class="stuScoreDetail">{{model.num?model.num:0}}</p>
						</uni-col>
						<uni-col style="" :span="8">
							<p class="stuScoreDetail">{{model.radio?model.radio:0}}%</p>
						</uni-col>
					</uni-row>
					<view v-if="score_section_list.length==0"
						style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
				</view>
			</uni-card>
			<uni-card title="原题" isShadow :isFull="true">
				<view class="content-box-text">
					<view v-if="question.content || question.option">
						<view v-if="question.content" v-html="question.content"></view>
						<view v-if="question.option" :key="index" v-for="(item,index) in question.option" v-html="item">
						</view>
					</view>
					<view v-else style="margin-left: 15px;font-size: 13px;">暂无题目</view>
				</view>
			</uni-card>
			<uni-card v-if="navItem.flag == 1" title="学生答案" isShadow :isFull="true">
				<view class="content-box-text">
					<view v-if="question.stu_answer">
						<view v-if="question.stu_answer" v-html="question.stu_answer"></view>
					</view>
					<view v-else style="margin-left: 15px;font-size: 13px;">没有作答</view>
				</view>
			</uni-card>
			<uni-card title="解答" isShadow :isFull="true">
				<view class="content-box-text">
					<view v-if="question.answer || question.analyse || question.solve">
						<view v-if="question.answer" v-html="question.answer"></view>
						<view v-if="question.answer" class="line"></view>
						<view v-if="question.analyse" v-html="question.analyse"></view>
						<view v-if="question.analyse" class="line"></view>
						<view v-if="question.solve" v-html="question.solve"></view>
					</view>
					<view v-else style="margin-left: 15px;font-size: 13px;">暂无答案</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				questionList: [],
				questionIndex: 0,
				question: {},
				scoreOpts: {},
				score: {},
				score_section_list: [],
				question_score: '',
				avg_score: '',
				stu_count: '',
				score_radio: '',
			}
		},
		onLoad(option) {
			_this = this;
			let navItem = util.getPageData(option);
			this.personInfo = util.getPersonal();
			this.navItem = navItem
			this.navItem.index = 100;
			this.index_code = navItem.index_code
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			let questionList = navItem.paper_question_number.split(',')
			let list = []
			questionList.map((item, index) => {
				list.push({
					text: '题目' + (index + 1),
					value: item
				})
			})
			this.questionList = list
			setTimeout(function() {
				_this.showLoading()
				_this.getQueDetail();
			}, 100);
			setTimeout(function() {
				_this.score = {
					series: [{
						name: "平均得分率",
						data: parseFloat(((navItem.radio?navItem.radio:navItem.score_radio) * 1 / 100).toFixed(2)),
						color: "#499df8"
					}]
				}
				_this.scoreOpts = {
					title: {
						name: navItem.radio?navItem.radio:navItem.score_radio + '%',
						fontSize: 24,
						color: '#499df8'
					},
					subtitle: {
						name: '平均得分率',
						color: '#666666',
						fontSize: 13
					}
				}
			}, 500);
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		components: {
			mynavBar
		},
		methods: {
			questionClick(e) {
				if (this.questionIndex !== e.detail.value) {
					this.questionIndex = e.detail.value
					this.showLoading()
					this.getQueDetail();
				}
			},
			getQueDetail() {
				if (this.navItem.flag == 0) {
					let questionObj = this.questionList[this.questionIndex];
					const params = {
						cls_code: this.navItem.cls_code,
						id: questionObj.value.split('|')[0],
						question_number: questionObj.value.split('|')[1],
						index_code: this.index_code,
					}
					this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'clsAnalysis/queDetail', params, response => {
						if (response) {
							if (response.question) {
								this.question = {
									question_id: response.question.id ? response.question.id : '',
									content: response.question.content ? response.question.content : '',
									option: response.question.option ? JSON.parse(response.question.option) :
										'',
									answer: response.question.answer ? '<span>【答案】</span>' + JSON.parse(
										response.question.answer) : '',
									analyse: response.question.analyse ? '<span>【分析】</span>' + response
										.question.analyse : '',
									solve: response.question.solve ? '<span>【解答】</span>' + response.question
										.solve : '',
									remark: response.question.remark ? response.question.remark : '暂无',
								}
							}
							this.score_section_list = response.score_section_list;
							this.question_score = response.question_score;
							this.avg_score = response.avg_score;
							this.stu_count = response.stu_count;
							this.score_radio = response.score_radio;
						} else {
							this.question = {
								question_id: '',
								content: '',
								option: '',
								answer: '',
								analyse: '',
								solve: '',
								remark: '暂无',
							}
						}
					})
				} else if(this.navItem.flag == 1) {
					let questionObj = this.questionList[this.questionIndex];
					const params = {
						cls_code: this.navItem.cls_code,
						stu_code: this.navItem.stu_code,
						id: questionObj.value.split('|')[0],
						question_number: questionObj.value.split('|')[1],
						index_code: this.index_code,
					}
					this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'stuAnalysis/queDetail', params, response => {
						if (response) {
							this.question = {
								question_id: response.question_id ? response.question_id : '',
								content: response.content ? response.content : '',
								option: response.option ? JSON.parse(response.option) : '',
								answer: response.answer ? '<span>【答案】</span>' + JSON.parse(response.answer) :'',
								stu_answer: response.stu_answer ? '<span>【答案】</span>' + response.stu_answer : '',
								analyse: response.analyse ? '<span>【分析】</span>' + response.analyse : '',
								solve: response.solve ? '<span>【解答】</span>' + response.solve : '',
								remark: response.remark ? response.remark : '暂无',
							}
							this.score_section_list = response.score_section_list;
							this.question_score = response.question_score;
							this.avg_score = response.avg_score;
							this.stu_count = response.stu_count;
							this.score_radio = response.score_radio;
						} else {
							this.question = {
								question_id: '',
								content: '',
								option: '',
								answer: '',
								stu_answer:'',
								analyse: '',
								solve: '',
								remark: '暂无',
							}
						}
					})
				}else {
					let questionObj = this.questionList[this.questionIndex];
					const params = {
						id: this.navItem.id,
						question_number: questionObj.value.split('|')[1],
						index_code: this.index_code,
					}
					this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'homeWorkQuery/queAnalysisDetail', params, response => {
						if (response) {
							this.question = {
								question_id: response.question.id ? response.question.id : '',
								content: response.question.content ? response.question.content : '',
								option: response.question.option ? JSON.parse(response.question.option) : '',
								answer: response.question.answer ? '<span>【答案】</span>' + JSON.parse(response.question.answer) :'',
								stu_answer: response.question.stu_answer ? '<span>【答案】</span>' + response.question.stu_answer : '',
								analyse: response.question.analyse ? '<span>【分析】</span>' + response.question.analyse : '',
								solve: response.question.solve ? '<span>【解答】</span>' + response.question.solve : '',
								remark: response.question.remark ? response.question.remark : '暂无',
							}
							this.score_section_list = response.score_section_list;
							this.question_score = response.question_score;
							this.avg_score = response.avg_score;
							this.stu_count = response.stu_count;
							this.score_radio = response.score_radio;
						} else {
							this.question = {
								question_id: '',
								content: '',
								option: '',
								answer: '',
								stu_answer:'',
								analyse: '',
								solve: '',
								remark: '暂无',
							}
						}
					})
				}
			},
		}
	}
</script>

<style>
	/* 间隔 */
	.spaceLine {
		margin-top: 0px;
		margin-bottom: 10px;
		text-align: center;
		padding-top: 10px;
		padding-bottom: 10px;
		background: #d7f3ef;
		font-size: 14px;
		color: #505050;
	}

	/* 试卷名称 */
	.examName {
		text-align: center;
		margin-top: 20px;
		margin-left: 20px;
		margin-right: 20px;
	}

	::v-deep img {
		max-width: 100%;
	}

	::v-deep p {
		word-break: break-all;
	}

	.charts-box {
		width: 45%;
		height: 150px;
	}

	::v-deep .uni-easyinput__content {
		background: #d5f8f6 !important;
	}

	::v-deep .uni-card {
		margin: 10px 0;
	}

	.content-box-text {
		font-size: 13px;
		word-break: break-all;
	}

	::v-deep .uni-card__header-title-text {
		font-size: 14px;
	}

	.card-title {
		font-size: 15px;
		margin-bottom: 5px;
		/* text-align: center; */
	}

	.card-line {
		height: 1px;
		width: 999px;
		background-color: #e5e5e5;
		margin-top: 5px;
		margin-bottom: 0px;
	}

	.scoreDetail {
		font-size: 13px;
		text-align: center;
		margin-top: 10px;
	}
</style>
