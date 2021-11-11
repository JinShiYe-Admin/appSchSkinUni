<template>
	<view>
		<view class="tabs-fixed" style="background-color: #FFFFFF;text-align: center;margin-top: 8px;">
			<text style="font-size: 13px;">学习进度</text>
			<view class="level-content">
				<template v-for="(item,index) in itemData.difficulty.levels">
					<view :key='index+Math.random()' class="level-item">
						<view class="icons-text" :class="{'icons-text-lv':item<=itemData.difficulty.schedule.difficulty_level_id}">LV.{{item}}</view>
						<text style="font-size: 12px;">{{item==1?'基础':item==2?'巩固':item==3?'提升':'基础'}}{{itemData.difficulty.schedule.difficulty_level_id==item?'(当前)':''}}</text>
					</view>
					<view :key='index+Math.random()'  v-if="index<itemData.difficulty.levels.length-1" class="mini-line"></view>
				</template>
			</view>
			<view class="line"></view>
		</view>
		<view style="padding:180px 15px 0;display: flex;flex-direction: column;align-items: center;">
			 <view class="icons-text-large icons-text-start" @click="start">开始做题</view>
			 <view class="icons-text-large icons-text-cancel" @click="cancel">取消做题</view>
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
			}
		},
		methods: {
			start(){
				let comData={
					catalog_id: this.itemData.catalogId,
					user_code:this.personInfo.user_code,
					index_code: this.index_code,
				}
				this.showLoading()
				this.post(this.globaData.INTERFACE_ZXKT+'/test/createPaper',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if(response.questions && response.questions.length>0){
						let item={
							index_code:this.index_code,
							data:response,
							catalogId:this.itemData.catalogId,
							title:this.itemData.name,
						}
						util.openwithData('/pages/zhiXueKeTang/zujuancs_testing',item,{})
					}else{
						this.showToast('暂无题目')
					}
				})
			},
			cancel(){
				uni.navigateBack()
			}
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.index_code
			this.personInfo = util.getPersonal();
			console.log("itemData: " + JSON.stringify(itemData));
			this.itemData=itemData
			uni.setNavigationBarTitle({title:itemData.name});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		 
	}
</script>

<style>
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
	 	display: flex;
	 	align-items: center;
	 	flex-direction: row;
	 	justify-content: space-around;
	 	width: 40px;
	 	margin: 3px 0;
	 	height: 40px;
	 	border-radius: 50%;
	 	padding:0px;
		font-size: 12px;
		background-color: #A6A6A6;
	 	color: #FFFFFF;
	 }
	 .icons-text.icons-text-gray{
	 	background: #CACDD1;
	 	font-size: 12px;
	 }
	 .icons-text.icons-text-lv{
	 	background: #00CFBD;
	 		font-size: 12px;
	 }
	 
	 .icons-text-large{
	 	display: flex;
	 	align-items: center;
	 	flex-direction: row;
	 	justify-content: space-around;
	 	width: 85px;
	 	margin: 3px 0;
	 	height: 85px;
	 	border-radius: 50%;
	 	padding:0px;
		font-size: 12px;
	 	color: #FFFFFF;
	 }
	 
	 .icons-text-large.icons-text-start{
	 	background: #3C9DFB;
	 		font-size: 12px;
	 }
	 .icons-text-large.icons-text-cancel{
	 	background: #EBAF73;
	 		font-size: 12px;
			margin-top: 20px;
	 }
</style>
