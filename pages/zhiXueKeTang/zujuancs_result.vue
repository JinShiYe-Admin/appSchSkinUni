<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view style="padding:8px 15px 0;">
			<text style="font-size: 14px;">{{tabBarItem.report.name}}</text>
			<view style="display: flex;justify-content: space-between;margin-top: 8px;">
				<text style="font-size: 13px;color: #666666;">{{tabBarItem.report.create_time}}</text>
				<text style="font-size: 12px;color: #666666;">用时:{{tabBarItem.report.used_time}}</text>
			</view>
		</view>
		<view class="line"></view>
		<view style="padding:2px 15px 0;display: flex;">
			 <view style="display: flex;align-items: center;width: 85px;">
			 	<text class="error"></text>
			 	<text style="font-size: 12px;">错误</text>
			 </view>
			 <view style="display: flex;align-items: center;width: 85px;">
			 	<text class="correct"></text>
			 	<text style="font-size: 12px;">正确</text>
			 </view>
			 <view style="display: flex;align-items: center;width: 85px;">
			 	<text class="diankong"></text>
			 	<text style="font-size: 12px;">未回答</text>
			 </view>
			 
			 
		</view>
		<view style="padding:8px 15px 10px;">
			<view style="width: 120px;height: 120px;border: 4px solid #FECE00;background-color: #FFFFFF;margin:0 auto;border-radius: 50%;display: flex;">
				<view style="width:105px;height: 105px;background-color: #FECE00;margin: auto;border-radius: 50%;display: flex;justify-content: space-around;align-items: center;">
					<view style="display: flex;flex-direction: column;">
						<text style="color: #FFFFFF;font-size: 13px;">得分</text>
						<text style="color: #FFFFFF;font-size: 35px;font-weight: 800;">{{this.tabBarItem.report.score}}</text>
						<text style="color: #FFFFFF;font-size: 13px;align-self: flex-end;">分</text>
					</view>
				</view>
			</view>
		</view>
		<view style="padding:8px 15px 10px;display: flex;flex-wrap: wrap;">
			<template v-for="(item,index) in tabBarItem.detail_info">
				<view class="icons-text" :class="anserJudge(item.answer, item.stu_answer)" @click="goQuestion(index)">{{item.number}}</view>
			</template>
		</view>
		<view class="line"></view>
		<view style="padding:8px 15px 10px;display: flex;flex-direction: column;">
			<text style="font-size: 13px;align-self: center;">学习进度</text>
			<view class="level-content" style="margin-bottom: 50px;z-index: 0;">
				<template v-for="(item,index) in tabBarItem.levels">
					<view :key='index+Math.random()' class="level-item">
						<view class="icons-text" :class="{'icons-text-lv': item<=tabBarItem.report.difficulty_level_id}">LV.{{item}}</view>
						<text style="font-size: 12px;">{{item==1?'基础':item==2?'巩固':item==3?'提升':'基础'}}{{tabBarItem.report.difficulty_level_id==item?'(当前)':''}}</text>
					</view>
					<view :key='index+Math.random()'  v-if="index<tabBarItem.levels.length-1" class="mini-line"></view>
				</template>
			</view>
		</view>
		<view style="display: flex;justify-content: space-around;">
			<view style="position: fixed;bottom: 0px;background-color: #FFFFFF;padding-bottom: 10px;width: 100vw;">
				 <button @click="continueLearn" class="mini-btn" style="margin-top: 10px;color: #00CFBD;border-color:#00CFBD ;font-size: 14px;width: 140px;border-radius: 15px;"  type="primary" plain="true">继续学习</button>
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
				index_code:'',
				personInfo: {},
				tabBarItem: {},
			}
		},
		components: {
			mynavBar
		},
		methods: {
			anserJudge(answer, stu_answer){
				if(stu_answer=="[]"){
					return "icons-text-weida";
				}else{
					if(answer.indexOf(stu_answer)!=-1){
						return "icons-text-lv";
					}else{
						return "icons-text-err";
					}
				}
			},
			 goQuestion(questionIndex){
				  util.openwithData('/pages/zhiXueKeTang/zujuancs_testing_answer',{questionData:this.tabBarItem,currentQuestionIndex:questionIndex},{})
			 },
			 continueLearn(){
				 console.log(this.tabBarItem.backSteps);
				 let comData={
				 	catalog_id: this.tabBarItem.catalogId,
				 	user_code:this.personInfo.user_code,
				 	index_code: this.index_code,
				 }
				 this.showLoading()
				 this.post(this.globaData.INTERFACE_ZXKT+'/test/createPaper',comData,response=>{
				     console.log("responseaaa: " + JSON.stringify(response));
				 	this.hideLoading()
				 	if(response.questions && response.questions.length>0){
				 		let item={
				 			isTested: false,
				 			index_code:this.index_code,
				 			data:response,
				 			catalogId:this.tabBarItem.catalogId,
				 			title:this.tabBarItem.titleName
				 		}
				 		util.openwithData('/pages/zhiXueKeTang/zujuancs_testing',item,{})
				 	}else{
				 		this.showToast('暂无题目')
				 	}
				 })
			 }
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.index_code
			this.personInfo = util.getPersonal();
			itemData.index=100
			itemData.text='练习报告'
			this.tabBarItem=itemData
			let that = this
			setTimeout(function() {
				var pages = getCurrentPages();
				pages.map((item,index)=>{
					 console.log(item.route);
					 if(item.route.indexOf('pages/zhiXueKeTang/zujuancs_index')!==-1 
					 || item.route.indexOf('pages/zhiXueKeTang/xueqingfx_detail')!==-1
					 || item.route.indexOf('pages/zhiXueKeTang/lishics_detail')!==-1
					 ){
						 console.log((pages.length-1)-index);
						 itemData.delta=(pages.length-1)-index
						 that.tabBarItem=itemData
					 }
				})
			}, 100);
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>
	.correct{
		width: 5px;
		height: 5px;
		background-color: #00CFBD;
		border-radius: 50%;
		margin-right: 5px;
	}
	.error{
		width: 5px;
		height: 5px;
		background-color: #f76260;
		border-radius: 50%;
		margin-right: 5px;
	}
	.diankong{
		width: 5px;
		height: 5px;
		background-color: #FFFFFF;
		border-radius: 50%;
		margin-right: 5px;
		border: 1px solid #00CFBD;
	}
	.level-content{
		margin-top: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}
	.level-item{
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 5;
		width: 65px;
	}
	.mini-line{
		background-color: #CACDD1;
		width: 45px;
		height: 2px;
		z-index: 4;
		margin: -12px -20px 0;
	}
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
	 	margin-right: 10px;
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	  
	 .title-text{
		 display: flex;
		 align-items: center;
	 	width: 80vw;
		color: #5C5C5C;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
	 }
	 
	 .double-line{
	 	height: 5px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .icons-text{
		 margin: 5px 10px;
	 	display: flex;
	 	align-items: center;
	 	flex-direction: row;
	 	justify-content: space-around;
	 	width: 35px;
	 	height: 35px;
	 	border-radius: 50%;
	 	padding:0px;
		font-size: 12px;
	 	color: #FFFFFF;
		background-color: #A6A6A6;
	 }
	 .icons-text.icons-text-weida{
	 	background: #FFFFFF;
	 	font-size: 12px;
		border: 1px solid #00CFBD;
		width: 33px;
		height: 33px;
		color: #00CFBD;
	 }
	 .icons-text.icons-text-lv{
	 	background: #00CFBD;
	 		font-size: 12px;
	 }
	 .icons-text.icons-text-err{
	 	background: #FF7C6F;
	 		font-size: 12px;
	 }
	 
</style>
