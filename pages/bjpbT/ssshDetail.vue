<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="rightText" :textClick="textClick"></mynavBar>
		<view class="bigText">记录</view>
		<view class="bigLine"></view>
		<view class="jiluView">
			<view class="jlScore">{{navItem.flag == 0?parseInt(navItem.score):parseInt(navItem.check_score)}}</view>
			<view v-if="navItem.flag == 1" class="shenSS">审</view>
			<view class="textType" :class="navItem.flag == 1?'cellList':''">日期：</view>
			<view class="typeCont">{{navItem.kp_date.split(' ')[0]}}</view>
			<view class="textType">班级：</view>
			<view class="typeCont">{{navItem.cls_name}}</view>
			<view class="textType">宿舍：</view>
			<view class="typeCont">{{navItem.dorm_room}}</view>
			<view class="textType">评比项：</view>
			<view class="pbList">
				<view class="flexStart pbCell" v-for="item in navItem.item_list">
					<view class="ellipsis-2 pbCont">{{item.item_name}}</view>
					<view class="pbCount">{{parseInt(item.score)}}</view>
				</view>
			</view>
			<view class="textType">学生/床位号：</view>
			<view class="typeCont">{{navItem.stuStr}}</view>
			<view class="textType">说明：</view>
			<view class="typeCont" v-html='navItem.remark'></view>
			<view v-if="navItem.asset_list.length>0" class="textType">照片：</view>
			<uni-file-picker style="margin-top: 10px;" readonly :value="navItem.asset_list" :imageStyles="imageStyles" file-mediatype="image"></uni-file-picker>
			<view class="nameTime flexEnd">
				<view class="nTime">{{navItem.create_user_name}}</view>
				<view class="nTime">{{navItem.create_time}}</view>
			</view>
		</view>
		<view style="height: 15px;background: #f2f2f2;"></view>
		<view class="bigText">申诉</view>
		<view class="bigLine"></view>
		<view class="jiluView">
			<view class="typeCont">{{navItem.appeal_reason}}</view>
			<view class="nameTime flexEnd">
				<view class="nTime">{{navItem.appeal_user_name}}</view>
				<view class="nTime">{{navItem.appeal_time}}</view>
			</view>
		</view>
		<view style="height: 15px;background: #f2f2f2;"></view>
		<view class="bigText">{{navItem.flag == 0?'我的审核意见':'我的审核意见'}}</view>
		<view class="bigLine"></view>
		<view class=" shScore">
			<view class="shText">评比项：</view>
			<view class="shenSS">{{tempScore}}</view>
			<!-- <view class="shScore">
				<uni-easyinput v-if="navItem.flag == 0" class="pbInput" v-model="value" type="number"></uni-easyinput>
				<view v-else style="margin-top: -15px;">-5</view>
			</view>
			<view class="shMsg">(审核分值为最终扣分/加分的分值)</view> -->
			<view class="pbList">
				<view class="flexStart pbCell" v-for="(item,index) in navItem.item_list" :key="index">
					<view class="ellipsis-2 pbCont">{{item.item_name}}</view>
					<view class="inputCss">
						<uni-easyinput v-if="navItem.flag == 0" @blur="inputBlur($event,index)" class="pbInput" :clearable='false' :value="parseInt(item.myScore)" placeholder="" type="number" maxlength="4"></uni-easyinput>
						<view v-else class="pbCount">{{parseInt(item.check_score)}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="jiluView">
			<view class="nameTime flexEnd">
				<view class="nTime">{{navItem.check_time}}</view>
			</view>
		</view>
		<view style="height: 5px;"></view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment/moment.js';
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				rightText:'',
				value:'',
				imageStyles: {
					border: {
						radius: '10px'
					}
				},
				tempScore:0
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			this.navItem.text = '申诉审核';
			this.index_code = this.navItem.index_code;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			if (this.navItem.flag == 0) {
				this.rightText = '提交'
			}
			for (var i = 0; i < this.navItem.item_list.length; i++) {
				let tempM = this.navItem.item_list[i]
				tempM.myScore = tempM.score
			}
			this.setSumScore()
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			textClick(){
				let tempFlag = 0
				let tempArray = []
				for (var i = 0; i < this.navItem.item_list.length; i++) {
					let tempM = this.navItem.item_list[i]
					if (tempM.myScore.length>0&&parseInt(tempM.myScore)<=100&&parseInt(tempM.myScore)>=-100) {
						tempFlag++
					}
					tempArray.push({
						item_id:tempM.item_id,
						check_score:tempM.myScore
					})
				}
				if (tempFlag < this.navItem.item_list.length) {
					_this.showToast('请输入-100到100之间的评比项分数')
					return
				}
				// 5.14.审核
				let comData = {
					id:this.navItem.id,
					check_user_code:this.personInfo.user_code,
					check_user_name: this.personInfo.user_name,
					item_list:tempArray,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/check', comData, (data0, data) => {
					this.hideLoading()
					this.showToast(data.msg);
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshSsshIndex');
						uni.navigateBack();
					}
				})
			},
			inputBlur(e,index){
				if (parseInt(e.detail.value)>100||parseInt(e.detail.value)<-100) {
					this.showToast('请输入-100到100之间的评比项分数')
				}
				for (var i = 0; i < this.navItem.item_list.length; i++) {
					if (index == i) {
						let tempM = this.navItem.item_list[i]
						tempM.myScore = e.detail.value
					}
				}
				this.setSumScore()
			},
			setSumScore(){
				let tempScore = 0
				for (var i = 0; i < this.navItem.item_list.length; i++) {
					let tempM = this.navItem.item_list[i]
					if (this.navItem.flag == 0) {
						tempScore = tempScore + parseInt(tempM.myScore)
					} else{
						tempScore = tempScore + parseInt(tempM.check_score)
					}
				}
				this.tempScore = tempScore;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bigText{
		font-size: 16px;
		font-weight: 700;
		text-align: center;
		margin-top: 20px;
	}
	.bigLine{
		width: 100%;
		height: 3px;
		background: #d7d7d7;
		margin-top: 3px;
	}
	
	.jiluView{
		margin: 10px;
		
		.jlScore{
			height: 60px;
			width: 90px;
			text-align: center;
			background: #f2f2f2;
			border-radius: 12px;
			line-height: 60px;
			margin-left: calc((100% - 90px)/2);
			font-size: 36px;
			font-weight: bold;
			color: #d9001b;
		}
		.shenSS{
			z-index: 200;
			width: 80px;
			height: 80px;
			border: 2px dashed #ec808d;
			color: #ec808d;
			font-size: 26px;
			border-radius: 50%;
			text-align: center;
			line-height: 80px;
			font-weight: 700;
			position: relative;
			left: calc(100% - 100px);
			top: -80px;
		}
		.cellList{
			margin-top: -75px;
		}
		.textType{
			font-size: 14px;
		}
		.typeCont{
			font-size: 14px;
			background: #f2f2f2;
			border-radius: 6px;
			margin: 5px 0;
			padding: 5px;
			word-break: break-all;
			min-height: 20px;
		}
		.pbList{
			background: white;
			border-radius: 10px;
			margin-bottom: 10px;
			
			.pbCell{
				background: white;
				margin-top: 5px;
				height: 55px;
				
				.pbCont{
					line-height: 24px;
					height: 45px;
					font-size: 14px;
					color: #333;
					background: #f2f2f2;
					padding: 5px 10px;
					border-radius: 5px;
					width: calc(100% - 73px);
				}
				
				.pbCount{
					height: 55px;
					width: 75px;
					background: #f2f2f2;
					border-radius: 5px;
					margin-left: 3px;
					text-align: center;
					line-height: 55px;
					font-size: 16px;
					color: #d9001b;
				}
			}
		}
		
		.nameTime{
			margin-top: 20px;
			font-size: 14px;
			.nTime{
				margin-left: 20px;
			}
		}
	}
	
	.shScore{
		margin: 15px;
		
		.shText{
			margin-left: 10px;
			font-size: 14px;
			margin-top: 5px;
		}
		.shenSS{
			z-index: 200;
			width: 80px;
			height: 80px;
			color: #d9001b;
			font-size: 26px;
			text-align: center;
			line-height: 80px;
			font-weight: 700;
			position: relative;
			left: calc(100% - 100px);
			top: -80px;
		}
		.shScore{
			width: 50px;
			font-size: 18px;
			color: #d9001b;
			.pbInput{
				margin-top: -20px;
				width: 50px;
				background: white;
				font-size: 18px;
				color: #d9001b;
			}
		}
		.shMsg{
			font-size: 12px;
			margin-top: 5px;
		}
		.pbList{
			margin-top: -80px;
			width: 100%;
			
			.pbCell{
				margin-top: 3px;
				height: 55px;
				width: 100%;
				
				.pbCont{
					line-height: 24px;
					height: 45px;
					font-size: 14px;
					color: #333;
					background: #f2f2f2;
					padding: 5px 10px;
					border-radius: 5px;
					width: calc(100% - 73px);
				}
				.inputCss{
					height: 55px;
					width: 75px;
					background: #f2f2f2;
					border-radius: 5px;
					margin-left: 3px;
					.pbInput{
						width: 50px;
						margin: 10px;
						background: white;
					}
				}
				
				.pbCount{
					height: 55px;
					width: 75px;
					background: #f2f2f2;
					border-radius: 5px;
					margin-left: 3px;
					text-align: center;
					line-height: 55px;
					font-size: 16px;
					color: #d9001b;
				}
			}
		}
	}
</style>
