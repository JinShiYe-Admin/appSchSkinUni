<template>
	<view>
		<view style="padding:10px 15px 10px;">
			<view style="display: flex;align-items: center;">
				<view class="icons-text" :class="tabBarItem.msg_type=='1-1'?'icons-text-school':
				tabBarItem.msg_type=='1-2'?'icons-text-grade':
				tabBarItem.msg_type=='1-3'?'icons-text-class':
				tabBarItem.msg_type=='1-4'?'icons-text-homework':
				tabBarItem.msg_type=='1-5'?'icons-text-performance':
				tabBarItem.msg_type=='1-6'?'icons-text-score':''">
					<template v-if="tabBarItem.msg_type=='1-1'">校</template>
					<template v-if="tabBarItem.msg_type=='1-2'">年</template>
					<template v-if="tabBarItem.msg_type=='1-3'">班</template>
					<template v-if="tabBarItem.msg_type=='1-4'">作业</template>
					<template v-if="tabBarItem.msg_type=='1-5'">个性</template>
					<template v-if="tabBarItem.msg_type=='1-6'">成绩</template>
				</view>
				<view class="title-text">{{tabBarItem.send_user_tname}}</view>
				<view class="detail-text">{{tabBarItem.send_time}}</view>
			</view>
		</view>
		<view class="double-line"></view>
		<view class="detail-text" style="text-align: left;padding:5px 15px 0px;color: #000000;">
			<template v-if="tabBarItem.msg_type=='1-6'">
				<uni-list :border="false">
					<uni-list-item :key="index" v-for="(item,index) in tabBarItem.scoreList" :border="true">
						<text slot="body" class="slot-box slot-text">
							<view style="display: flex;">
								 <view style="width: 80px;font-size: 13px;">{{item.text}}</view>
								 <view style="flex:1;text-align: right;font-size: 13px;">{{item.value?item.value:0}}</view>
							</view>
						</text>
					</uni-list-item>
				</uni-list>
			</template>
			<template v-else>
				{{tabBarItem.msg_content}}
			</template>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
			}
		},
		methods: {
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.index_code
			if(itemData.msg_type=='1-1'){
				uni.setNavigationBarTitle({title:'学校通知'});
			}else if(itemData.msg_type=='1-2'){
				uni.setNavigationBarTitle({title:'年级详情'});
			}else if(itemData.msg_type=='1-3'){
				uni.setNavigationBarTitle({title:'班级详情'});
			}else if(itemData.msg_type=='1-4'){
				uni.setNavigationBarTitle({title:'班级作业'});
			}else if(itemData.msg_type=='1-5'){
				uni.setNavigationBarTitle({title:'个性表现'});
			}else if(itemData.msg_type=='1-6'){
				uni.setNavigationBarTitle({title:'成绩通知'});
				//需要根据字符串分割成成绩数据，很恶心
				let content = itemData.msg_content
				try{
					if(content.split('>').length>1){
						let listStr = content.split('>')[1]
						let list =listStr.split(']')
						let scores=[]
						list.map((item,index)=>{
							let score={
								text:item.split('[').length>1?item.split('[')[0]:'',
								value:item.split('[').length>1?item.split('[')[1]:item.split('[')[0]
							}
							scores.push(score)
						})
						itemData.scoreList=scores
					}else{
						console.log('数据异常：'+content);
						itemData.scoreList=[{text:content,value:' '}]
					}
				}catch(e){
					console.log(e);
					console.log('数据异常：'+content);
					itemData.scoreList=[{text:content,value:' '}]
				}
			}
			this.tabBarItem=itemData
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
	 	flex-direction: row;
	 	align-items: center;
	 }
	 
	 .content{
	 	margin: 2px 0;
	 }
	 .slot-text {
	 	font-size: 14px;
	 	margin-right: 10px;
		flex: 1;
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .title-text{
		align-items: center;
	 	width: 120px;
		padding-left: 5px;
	 	overflow: hidden;
		font-size: 14px;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
		word-break: break-all;
		text-align: right;
		flex: 1;
	 }
	 
	 .leaveType {
		 font-size:12px ;
	 	width: 48px;
	 	color: #EFAD44;
	 	padding:0px 3px;
	 	border-radius: 4px;
		margin-right: 3px;
	 	border: 1px solid #EFAD44;
	 }
	 
	 .uni-input-input{
		 font-size: 13px;
	 }
	 
	 .icons-text{
		 display: flex;
		 align-items: center;
		 flex-direction: row;
		 justify-content: space-around;
	 	width: 35px;
	 	height: 35px;
	 	border-radius: 50%;
	 	padding:0px;
		font-weight: 800 !important;
		color: #FFFFFF;
		
	 }
	 
	 .icons-text.icons-text-school{
	 	background: #57D2C9;
		font-size: 15px;
	 }
	 
	 .icons-text.icons-text-grade{
	 	background:#FF9079;
		font-size: 15px;
	 }
	 
	 .icons-text.icons-text-class{
	 	background:#73ADED;
		font-size: 15px;
	 }
	 
	 .icons-text.icons-text-homework{
	 	background: #FFD757;
		font-size: 12px;
	 }
	 
	 .icons-text.icons-text-performance{
	 	background: #C879D6;
		font-size: 12px;
	 }
	 .icons-text.icons-text-score{
	 	background: #2F4553;
	 		font-size: 12px;
	 }
	  
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 .line-green{
	 	background-color: #00CFBD;
	 	margin-bottom: 0.3125rem;
	 	height: 1px;
	 }
	 .double-line{
	 	height: 5px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	}
	.form-left{
		font-size: 14px;
		width: 200rpx;
		color: #3F3F3F;
	}
</style>
