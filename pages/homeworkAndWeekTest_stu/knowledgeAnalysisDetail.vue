<template>
	<view>
		<view  style="text-align: center;margin-top: 10px;">
			<text class="title-text">{{itemData.knowledge_name}} 相关试题</text>
		</view>
		<view style="padding:8px 15px 0;display: flex;justify-content: space-around;">
			<view class="charts-box">
			  <qiun-data-charts type="arcbar" :opts="scoreOpts" :chartData="score"/>
			</view>
		</view>
		<view style="background:#d5f8f6;">
			<view style="display: flex;">
				<picker style="flex: 1;"  @change="questionClick" :value="questionIndex" :range="questionList" range-key="text">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="questionIndex>=0?questionList[questionIndex].text:'请选择'" ></uni-easyinput-select>
				</picker>
			</view>
		</view>
		<view class="content" style="margin-top: 10px;padding-bottom:35px ;">
			<view style="font-size: 13px;text-align: center;color:#505050 ;">
				<text>来源：{{question.remark}}</text>
			</view>
			<uni-card title="原题" isShadow>
				<text class="content-box-text">
					<view v-if="question.content || question.option">
						<view v-if="question.content" v-html="question.content"></view>
						<view v-if="question.option" v-for="item in question.option" v-html="item"></view>
					</view>
					<view v-else style="margin-left: 15px;font-size: 13px;">暂无题目</view>
				</text>
			</uni-card>
			<uni-card title="学生答案" isShadow>
				<text class="content-box-text">
					<view v-if="question.stu_answer" v-html="question.stu_answer"></view>
					<view v-else style="margin-left: 15px;font-size: 13px;">暂无答案</view>
				</text>
			</uni-card>
			<uni-card title="解答" isShadow>
				<text class="content-box-text">
					<view v-if="question.answer || question.analyse || question.solve">
							<view v-if="question.answer" v-html="question.answer"></view>
							<view v-if="question.answer" class="line"></view>
							<view v-if="question.analyse" v-html="question.analyse"></view>
							<view v-if="question.analyse" class="line"></view>
							<view v-if="question.solve" v-html="question.solve"></view>
					</view>
					<view v-else style="margin-left: 15px;font-size: 13px;">暂无答案</view>
				</text>
			</uni-card>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				questionList:[],
				questionIndex:0,
				question:{},
				scoreOpts:{},
				score:{},
			}
		},
		onLoad(option) {
			_this = this;
			let itemData = util.getPageData(option);
			this.personInfo = util.getPersonal();
			this.itemData = itemData
			this.index_code = itemData.index_code
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			let questionList=itemData.paper_question_number.split(',')
			let list =[]
			questionList.map((item,index)=>{list.push({text:'题目'+(index+1),value:item})})
			this.questionList=list
			let that =this 
			setTimeout(function() {
				that.showLoading()
				that.getQueDetail();
			}, 100);
			setTimeout(function() {
				that.score={series:[{name:"平均得分率",data:(itemData.radio*1/100).toFixed(2),color:"#499df8"}]}
				that.scoreOpts={title:{name:itemData.radio+'%',fontSize:24,color:'#499df8'},subtitle:{name:'平均得分率',color:'#666666',fontSize:13}}
			}, 500);
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
		},
		onShow(){
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			questionClick(e) {
				if(this.questionIndex!==e.detail.value){
					 this.questionIndex=e.detail.value
					 this.showLoading()
					 this.getQueDetail();
				}
			},
			getQueDetail(){
				let questionObj=this.questionList[this.questionIndex];
				const params = {
					cls_code:this.personInfo.cls_code,
					id:questionObj.value.split('|')[0],
					question_number:questionObj.value.split('|')[1],
					stu_code:this.personInfo.stu_code,
					index_code: this.index_code, 
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS+'stuAnalysis/queDetail',params,response=>{
					 this.question={
						 question_id:response.question_id?response.question_id:'',
						 content:response.content?response.content:'',
						 option:response.option?JSON.parse(response.option):'',
						 answer:response.answer?'<span>【答案】</span>'+JSON.parse(response.answer):'',
						 analyse:response.analyse?'<span>【分析】</span>'+response.analyse:'',
						 solve:response.solve?'<span>【解答】</span>'+response.solve:'',
						 remark:response.remark?response.remark:'',
						 stu_answer:response.stu_answer?response.stu_answer:'',
					 }
				})
				// const params = {
				// 	cls_code:'48',
				// 	id:'140',
				// 	question_number:'4',
				// 	stu_code:'1242380061223419904',
				// 	index_code: this.index_code, 
				// }
				// this.post('https://test.108800.com/stuzysubapi/api/admin/stuAnalysis/queDetail',params,response=>{
				// 	 this.question={
				// 		 question_id:response.question_id?response.question_id:'',
				// 		 content:response.content?response.content:'',
				// 		 option:response.option?JSON.parse(response.option):'',
				// 		 answer:response.answer?'<span>【答案】</span>'+JSON.parse(response.answer):'',
				// 		 analyse:response.analyse?'<span>【分析】</span>'+response.analyse:'',
				// 		 solve:response.solve?'<span>【解答】</span>'+response.solve:'',
				// 		 remark:response.remark?response.remark:'',
				// 		 stu_answer:response.stu_answer?response.stu_answer:'',
				// 	 }
				// })
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
	::v-deep img{
		max-width: 100%;
	}
	
	::v-deep p{
		word-break: break-all;
	}
	
	.charts-box {
		width: 45%;
		height: 150px;
	}
	
	::v-deep .uni-easyinput__content{
		background: #d5f8f6 !important;
	}
	
	::v-deep .uni-card{
		margin: 10px;
	}
	.content-box-text{
		font-size: 13px;
	}
	::v-deep .uni-card__header-title-text{
		font-size: 14px;
	}
</style>
