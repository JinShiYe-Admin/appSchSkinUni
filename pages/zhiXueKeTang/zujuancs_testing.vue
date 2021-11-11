<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :text="navRight" :textClick="()=>{}"></mynavBar>
		<view style="display: flex;height: 40px;align-items: center;padding:0 10px;justify-content: space-between;">
			<view style="font-size: 14px;color: #000000;">{{tabBarItem.data.paper_name}}</view>
			<view style="font-size: 12px;color: #666666;">{{progress}}</view>
		</view>
		<view class="line"></view>
		<view @touchstart="touchStart" @touchend="touchEnd">
			<view class="question-box" v-if="questions[index]">
				<view class="question option-box" style="font-size: 13px;">{{ (index+1)+".(单选题) " }}<span style="font-size: 13px;" v-html="questions[index].content"></span></view>
				<view>
					<view class="option-item" v-for="(item, k) in transOptions" :key="k" @click="selectOption(k)">
						<span class="option-label" :class="{selected: questions[index].stu_answer==k}">{{k}}</span>
						<span style='margin-left: 5px;font-size: 13px;word-break: break-all;' v-html="item"></span>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="确定要退出练习吗？" content="退出后不保存本次练习记录" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
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
				navRight:'00:00',
				touchStartX: 0, // 触屏起始点x  
				questions:[],
				index:0,
				time:0,
				transOptions:[],
				progress:'',
				isSelecting:false,
				timer:'',
				isAnswered:false,
				canClick:true,//防止快速点击
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
			 	 if(des>=this.questions.length){
			 	 	//停止计时
			 	 	clearInterval(this.timer);
			 	 	//测试数据
			 	 	let _this = this;
			 	 	let answerArray = [];
			 	 	this.questions.forEach(function(v, i){
			 	 		answerArray.push({
			 	 			index: i,
			 	 			question_id: v.question_id,
			 	 			stu_answer: v.stu_answer||[]
			 	 		});
			 	 	});
					console.log("answerArray: " + JSON.stringify(answerArray));
			 	 	//进入提交页
					let item={
						catalogId:this.tabBarItem.catalogId,
						name: this.tabBarItem.data.paper_name,
						titleName:this.tabBarItem.text,
						usedTime: this.navRight,
						index_code:this.index_code,
						answerArray:answerArray,
						diskey:this.tabBarItem.data.diskey,
					}
					let that = this
			 	 	util.openwithData('/pages/zhiXueKeTang/zujuancs_submit',item,{
						refreshQuestion(data){//子页面调用父页面需要的方法
							console.log("data: " + JSON.stringify(data));
							that.index = data.data.index||0;
							that.startTimer();
							that.gprogress()
							that.transOption()
							//滚动到顶
							uni.pageScrollTo({
								scrollTop: 0,
								duration: 0
							});
						}
					})
			 	 }else if(des<0){
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
			 //退出弹窗确认事件
			 dialogConfirm(){
				 this.isAnswered=false
				 //停止计时
				 clearInterval(this.timer);
				// #ifdef H5
					const pages = getCurrentPages()
					if (pages.length > 1) {
						uni.navigateBack({delta:1})
						return;
					}
					//使用vue-router返回上一级
					let a = this.$router.go(-1)
					return;
				// #endif
				// #ifdef APP-PLUS
					uni.navigateBack({delta:1})
				// #endif
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
			 //右上角计时器
			 timeStr() {
			 	let m = Math.floor(this.time/60);
			 	let s = this.time-m*60;
			 	m = m>=10 ? m : "0"+m;
			 	s = s>=10 ? s : "0"+s;
			 	return m+":"+s;
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
			  // 排除题目异常
			 clearError(questions){
				 let isWrongOpt=false;
				 let newQ=[]
				 for(let i=0;i<questions.length;i++) {
				 	let ques = questions[i];
				 	try{
				 		var ques_ops = JSON.parse(ques.option);
				 		ques_ops = ques_ops.map(function(v){
				 			if(v.indexOf("<span>")==0) { //提取<span>开头的
				 				return v.slice(6,-7);
				 			}else{
				 				return v;
				 			}
				 		});
				 		ques_ops.forEach(function(v,i){
				 			if(!/^[a-zA-Z]/.test(v)){ //开头不是字符
				 				isWrongOpt = true;
				 			}
				 		});
				 	}catch(e){
				 		isWrongOpt = true;
				 	}
				 	if(isWrongOpt) {
				 		console.log("异常题："+JSON.stringify(ques));
				 		break;
				 	}else{
				 		ques.option = JSON.stringify(ques_ops);
						newQ.push(ques)
				 	}
				 }
				 if(isWrongOpt){
					 this.dialogConfirm()
				 	 this.showToast("题目异常，请重新做题或换个知识点");
				 }else{
					 this.questions=newQ
				 }
			 },
			 //选择
			 selectOption(k) {
				 if(this.canClick){
					 this.canClick=false
					 console.log("k: " + JSON.stringify(k));
					 this.isSelecting = true;
					 this.isAnswered=true
					 let cur = this.questions[this.index];
					 let _this = this;
					 if(cur.stu_answer) {
					 	cur.stu_answer = [k];
					 }else{
					 	this.$set(cur, "stu_answer", [k]);
					 }
					 if(!_this.isAnswered) {
					 	_this.isAnswered=true;
					 }
					 setTimeout(function(){
						_this.canClick=true
					 	_this.isSelecting = false;
					 	_this.changeIndex(1);
						this.canClick=true
					 }, 500);
				 }
			 },
			 startTimer(){
				 let that = this
				 this.timer=setInterval(value=>{
				 	that.time++
				 	that.navRight=that.timeStr()
				 },1000)
			 }
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			console.log("itemData: " + JSON.stringify(itemData));
			itemData.index=100
			itemData.text=itemData.title
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			let that = this
			setTimeout(()=>{
				that.clearError(itemData.data.questions)
				that.transOption()
				that.gprogress()
				that.startTimer()
			}, 100);
			
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onBackPress(options){
			if(this.isAnswered){
				this.$refs.alertDialog.open()
				return true;  
			}
			//停止计时
			clearInterval(this.timer);
			return false
		}
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
