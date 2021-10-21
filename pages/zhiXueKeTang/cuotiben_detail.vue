<template>
	<view>
		<view class="question-header" v-if="questions[index]">
			<span class="p-title mui-ellipsis">知识点：{{questions[index].book_catalog_name}}</span>
			<span class="progress">{{(index+1)}}/{{total}}</span>
		</view>
		<view style="height: 1px;background: #DDDDDD;width: 100%;"></view>
		<view @touchstart="touchStart" @touchend="touchEnd">
			<view class="question-box" v-if="questions[index]">
				<view class="question option-box">{{ (index+1)+".(单选题) " }}<span v-html="questions[index].content"></span></view>
				<view>
					<view class="option-item" v-for="(item, k) in transOption" :key="k">
						<span class="option-label" :class="answerJudge(k)">{{k}}</span>
						<span style='margin-left: 5px;' v-html="item"></span>
					</view>
				</view>
			</view>
			<view style="height: 1px;background: #DDDDDD;width: 100%;margin-bottom: 15px;"></view>
			<view class="answer-box" v-if="questions[index]">
				<view class="answer-key">
					正确答案：<span style="color: #2CA97F; margin-right: 10px;">
						{{getAnswerName(questions[index].answer)}}</span>
					你选的：<span style="color: #FF7C6F;"> {{getAnswerName(questions[index].stu_answer)}}</span>
				</view>
				<view class="answer-detail">
					答案解析：<br />
					<view v-html="questions[index].solve"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				index: 0,
				questions: [],
				transOption: [],
				page_number: 1,
				last_page: false,
				total: 0,
				diskey: "",
				touchStartX: 0, // 触屏起始点x  
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.sub_name
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			// 获取题目
			this.getQuestions();
		},
		methods: {
			touchStart(e) {
				console.log("触摸开始")
				this.touchStartX = e.touches[0].clientX;
			},
			touchEnd(e) {
				console.log("触摸结束")
				let deltaX = e.changedTouches[0].clientX - this.touchStartX;
				if (Math.abs(deltaX) > 50) {
					if (deltaX >= 0) {
						console.log("左滑")
						this.changeIndex(-1);
					} else {
						console.log("右滑")
						this.changeIndex(1);
					}
				}
			},
			getQuestions: function(callback) {
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZXKT + "/mistake/mistakeDetail", {
					per_code: this.itemData.selectPer.per_code,
					sub_code: this.itemData.sub_code,
					page_size: 20,
					page_number: this.page_number,
					index_code: this.itemData.access.split('#')[1],
					user_code: this.personInfo.user_code,
				}, (res0, res) => {
					this.hideLoading();
					if (res.code == 0) {
						this.questions = this.questions.concat(res.data.page.list);
						this.page_number = res.data.page.page_number;
						this.last_page = res.data.page.last_page;
						this.total = res.data.page.total_row;
						this.setTransOption();
						callback && callback();
					} else {
						this.showToast(res.msg);
					}
				});
			},
			//选项
			setTransOption() {
				var cur_qes = this.questions[this.index];
				if (cur_qes && cur_qes.option) {
					var op = JSON.parse(cur_qes.option);
					var new_op = {}
					op.forEach(function(v) {
						new_op[v.substr(0, 1)] = v.split(/^[a-zA-Z]\W/, 2).pop();
					});
					this.transOption = new_op;
				} else {
					this.transOption = [];
				}
			},
			//切换题目
			changeIndex: function(d) {
				var des = this.index + d;
				if (des >= this.questions.length) {
					if (!this.last_page) {
						this.page_number = this.page_number + 1;
						this.getQuestions(function() {
							this.index = des;
						});
					}
				} else if (des < 0) {
					return;
				} else {
					this.index = des;
					//滚动到顶
					// mui('.mui-scroll-wrapper').scroll().scrollTo(0,0);
				}
			},
			// 判断答案是正确、错误或没选
			answerJudge: function(key) {
				var answer = this.questions[this.index].answer;
				var stu_answer = this.questions[this.index].stu_answer;
				if (!answer || !stu_answer) return "";
				if (answer.indexOf(key) != -1 && stu_answer.indexOf(key) != -1) {
					return "selected";
				} else if (stu_answer.indexOf(key) != -1) {
					return "err";
				} else if (answer.indexOf(key) != -1) {
					return "selected";
				} else {
					return "";
				}
			},
			getAnswerName: function(answer) {
				var asr = "";
				if (answer) {
					var an1 = answer.match(/[a-zA-Z]/);
					if (an1) {
						asr = an1[0];
					}
				}
				return asr;
			}
		}
	}
</script>

<style>
	.option-label {
		color: #2CA97F;
		border: 1px solid #2CA97F;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		font-size: 12px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
	}
	.option-box{
		margin: 5px 10px 0 10px;
	}
	/* .option-wrap {
		margin-bottom: -0.4rem;
		text-align: center;
	}
	.option-wrap .option-label {
		margin-bottom: 0.4rem;
	} */
	.option-label.selected {
		color: #FFFFFF;
		background-color: #2CA97F;
		border-color: #2CA97F;
	}

	.option-label.err {
		color: #FFFFFF;
		background-color: #FF7C6F;
		border-color: #FF7C6F;
	}

	.question-header {
		display: flex;
		justify-content: space-between;
		padding: 15px 10px;
	}

	.question-header .p-title {
		max-width: 82%;
		font-size: 14px;
		line-height: 1.2;
	}

	.question-header .progress {
		color: #666666;
		font-size: 13px;
	}

	.question-box {
		padding: 0.7rem 0.46rem 0.2rem;
	}

	.tested .question-box {
		padding-top: 0.3rem;
	}

	.tested .question-box:after {
		display: block;
		content: "";
		border-bottom: 1px solid #DDDDDD;
	}

	.question-box {
		font-size: 0.28rem;
		color: #222222;
	}

	.question {
		line-height: 1.8;
		margin-bottom: 0.8rem;
		word-break: break-word;
	}

	.option-item {
		margin-bottom: 20px;
	}

	.answer-box {
		padding: 0 0.2rem;
	}

	.answer-box .answer-key {
		color: #141414;
		font-size: 13px;
		margin-left: 10px;
	}

	.answer-box .answer-detail {
		padding: 20px;
	}
	
	::v-deep img{
		max-width: 100% !important;
	}
	
	.answer-detail {
		color: #222222;
		line-height: 1.6;
		word-break: break-word;
		font-size: 13px;
	}
</style>
