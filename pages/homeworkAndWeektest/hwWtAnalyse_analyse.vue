<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="margin-top: 10px;text-align: center;">题号：{{navItem.question_number}}</view>
		<view class="content" style="margin-top: 10px;padding-bottom:35px ;">
			<uni-card isShadow :isFull="true">
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
			this.index_code = navItem.access;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.getQueDetail();
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
			getQueDetail() {
				const params = {
					id: this.navItem.id,
					question_number: this.navItem.question_number,
					index_code: this.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'homeWorkQuery/queAnalysisDetail', params, response => {
					this.hideLoading();
					if (response) {
						if (response.question) {
							this.question = {
								question_id: response.question.id ? response.question.id : '',
								content: response.question.content ? response.question.content : '',
								option: response.question.option ? JSON.parse(response.question.option) : '',
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
