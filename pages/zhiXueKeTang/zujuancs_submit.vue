<template>
	<view style="padding:8px 15px 0;">
		<view style="display: flex;">
			<view style="display: flex;align-items: center;width: 85px;">
				<text class="dian"></text>
				<text style="font-size: 13px;">已回答</text>
			</view>
			<view style="display: flex;align-items: center;width: 85px;">
				<text class="diankong"></text>
				<text style="font-size: 13px;">未回答</text>
			</view>
		</view>
		<view style="display: flex;flex-wrap: wrap;margin-top: 15px;">
			<template v-for="item in itemData.answerArray">
				 <view v-if="item.stu_answer.length" class="icons-text icons-text-lv" @click="backQuestion(item)">{{item.index+1}}</view>
				 <view v-else class="icons-text icons-text-weida" @click="backQuestion(item)">{{item.index+1}}</view>
			 </template>
		</view>
		<view style="display: flex;justify-content: space-around;">
			<view style="position: fixed;bottom: 0px;background-color: #FFFFFF;padding-bottom: 10px;width: 100vw;">
				 <button @click="submit" class="mini-btn" style="margin-top: 10px;color: #00CFBD;border-color:#00CFBD ;font-size: 14px;width: 140px;border-radius: 15px;"  type="primary" plain="true">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				itemData:{},
				personInfo: {},
				canSub:true,
			}
		},
		methods: {
			submit(){
				if(this.canSub){
					this.canSub=false
					let answerJson = {};
					this.itemData.answerArray.forEach(function(v){
						answerJson[v.question_id] = v.stu_answer;
					});
					let comData={
						diskey: this.itemData.diskey,
						catalogId: this.itemData.catalogId,
						name: this.itemData.name,
						usedTime: this.itemData.usedTime,
						answerJson: answerJson,
						user_code:this.personInfo.user_code,
						index_code: this.index_code,
					}
					this.showLoading()
					this.post(this.globaData.INTERFACE_ZXKT+'/test/savePaper',comData,response=>{
					    console.log("responseaaa: " + JSON.stringify(response));
						this.hideLoading()
						this.canSub=true
						if(response){
							response.titleName=this.itemData.titleName
							response.catalogId=this.itemData.catalogId
							util.openwithData("/pages/zhiXueKeTang/zujuancs_result", response);
						}
					})
				}
			},
			 backQuestion(question){
				 const eventChannel = this.getOpenerEventChannel()
				 eventChannel.emit('refreshQuestion', {data: question});
				 uni.navigateBack();
			 }
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.index_code
			this.personInfo = util.getPersonal();
			console.log("itemData: " + JSON.stringify(itemData));
			this.itemData=itemData
			uni.setNavigationBarTitle({title:'答题卡'});
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
	.dian{
		width: 5px;
		height: 5px;
		background-color: #00CFBD;
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
		width: 70px;
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
		 margin:10px;
	 	display: flex;
	 	align-items: center;
	 	flex-direction: row;
	 	justify-content: space-around;
	 	width: 35px;
	 	height: 35px;
	 	border-radius: 50%;
	 	padding:0px;
	 	color: #FFFFFF;
	 }
	 .icons-text.icons-text-weida{
	 	background: #FFFFFF;
	 	font-size: 13px;
		border: 1px solid #00CFBD;
		width: 33px;
		height: 33px;
		color: #00CFBD;
	 }
	 .icons-text.icons-text-lv{
	 	background: #00CFBD;
	 		font-size: 13px;
	 }
</style>
