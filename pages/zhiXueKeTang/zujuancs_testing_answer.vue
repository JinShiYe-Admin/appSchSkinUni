<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :text="navRight" :textClick="()=>{}"></mynavBar>
		<view style="display: flex;height: 40px;align-items: center;padding:0 10px;justify-content: space-between;">
			<view style="font-size: 14px;color: #000000;">{{tabBarItem.questionData.report.name}}</view>
			<view style="font-size: 12px;color: #666666;">{{progress}}</view>
		</view>
		<view class="line"></view>
		<view @touchstart="touchStart" @touchend="touchEnd">
			<view class="question-box" v-if="questions[index]">
				<view class="question option-box" style="font-size: 13px;">{{ (index+1)+".(单选题) " }}<span style="font-size: 13px;" v-html="questions[index].content"></span></view>
				<view>
					<view class="option-item" v-for="(item, k) in transOptions" :key="k" >
						<span class="option-label" :class="answerJudge(k)">{{k}}</span>
						<span style='margin-left: 5px;font-size: 13px;word-break: break-all;' v-html="item"></span>
					</view>
				</view>
			</view>
		</view>
		<view class="line"></view>
		<view style="display: flex;padding:0 15px;">
			<view style="display: flex;">
				<text style="font-size: 12px;">正确答案：</text>
				<text style="font-size: 12px;color: #00CFBD;margin-left: 3px;">{{getAnswerName(questions[index].answer)}}</text>
			</view>
			<view style="display: flex;margin-left: 10px;">
				<text style="font-size: 12px;">你选的：</text>
				<text style="font-size: 12px;color: #f76260;margin-left: 3px;">{{getAnswerName(questions[index].stu_answer)}}</text>
			</view>
		</view>
		<view style="display: flex;padding:10px 15px;">
			<view style="font-size: 13px;" v-html="questions[index].solve"></view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				navRight:'',
				touchStartX: 0, // 触屏起始点x  
				index:0,
				questions:[],
				transOptions:[],
				progress:'',
			}
		},
		components: {
			mynavBar
		},
		methods: {
			 touchStart(e) {
			 	// console.log("触摸开始")
			 	this.touchStartX = e.touches[0].clientX;
			 },
			 touchEnd(e) {
			 	// console.log("触摸结束")
			 	let deltaX = e.changedTouches[0].clientX - this.touchStartX;
			 	if (Math.abs(deltaX) > 50) {
			 		if (deltaX >= 0) {
			 			this.changeIndex(-1);
			 		} else {
			 			this.changeIndex(1);
			 		}
			 	}
			 },
			 //切换题目
			 changeIndex(d) {
			 	 let des = this.index+d;
			 	 if(des>=this.questions.length || des<0){
			 	 	return false;
			 	 }else{
			 	 	this.index = des;
					this.gprogress()
					this.transOption()
			 	 	//滚动到顶
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 0
					});
			 	 }
			 },
			 //解析题目选项
			 transOption() {
			 	var cur_qes = this.questions[this.index];
			 	if(cur_qes&&cur_qes.option) {
			 		var op = JSON.parse(cur_qes.option);
			 		var new_op = {}
			 		op.forEach(function(v){
			 			new_op[v.substr(0,1)] = v.split(/^[a-zA-Z]\W/, 2).pop();
			 		});
					this.transOptions=new_op
			 		// return new_op;
			 	}else{
			 		// return [];
					this.transOptions=[]
			 	}
			 },
			 getAnswerName(answer) {
			 	var asr = "";
			 	if(answer){
			 		var an1 = answer.match(/[a-zA-Z]/);
			 		if(an1){
			 			asr = an1[0];
			 		}
			 	}
			 	return asr;
			 },
			 // 判断答案是正确、错误或没选
			 answerJudge(key) {
			 	let answer = this.questions[this.index].answer;
			 	let stu_answer = this.questions[this.index].stu_answer;
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
			 //答题进度
			 gprogress() {
			 	let tt = this.questions.length;
			 	if(tt) {
			 		let cur = this.index+1;
			 		if(this.index+1<10) {
			 			let o = 0;
			 			while(o<Math.floor(tt/10)) {
			 				cur = "0"+cur;
			 				o++;
			 			}
			 		}
					this.progress=cur+"/"+tt
			 	}else{
			 		this.progress="0/0"
			 	}
			 },
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			console.log("itemData: " + JSON.stringify(itemData));
			itemData.index=100
			itemData.text=itemData.questionData.titleName
			this.tabBarItem = itemData;
			this.questions=itemData.questionData.detail_info
			this.navRight=[{value:'用时：'+itemData.questionData.report.used_time,style:{fontSize:12,color:'#FFFFFF'}}]
			this.index=itemData.currentQuestionIndex
			let that = this
			setTimeout(()=>{
				that.transOption()
				that.gprogress()
			}, 100);
			
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>
	.select-line{
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
	 
	 .content{
	 	margin: 2px 0;
	 }
	 .slot-text {
	 	flex: 1;
	 	font-size: 14px;
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .title-text{
		 display: flex;
		 align-items: center;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
		 flex: 1;
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
	 }
	  .option-label {
	  	color: #00CFBD;
	  	border: 1px solid #00CFBD;
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
	  	background-color: #00CFBD;
	  	border-color: #00CFBD;
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
	  
	  .image{
	  	margin: 5px 10px;
	  	width: 100%;
	  }
	  
	  
	  .answer-detail {
	  	color: #222222;
	  	line-height: 1.6;
	  	word-break: break-word;
	  	font-size: 13px;
	  }
</style>
