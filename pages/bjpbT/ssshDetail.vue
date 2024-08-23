<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="rightText" :textClick="textClick"></mynavBar>
		<view class="bigText">记录</view>
		<view class="bigLine"></view>
		<view class="jiluView">
			<view class="jlScore">-3</view>
			<view v-if="navItem.flag == 1" class="shenSS">审</view>
			<view class="textType" :class="navItem.flag == 0?'':'cellList'">日期：</view>
			<view class="typeCont">2024-05-16</view>
			<view class="textType">班级：</view>
			<view class="typeCont">初一2201班、初二2112班</view>
			<view class="textType">宿舍：</view>
			<view class="typeCont">男生楼1号3层303</view>
			<view class="textType">评比项：</view>
			<view class="pbList">
				<view class="flexStart pbCell" v-for="item in 4">
					<view class="ellipsis-2 pbCont">洗过的鞋子没有晾晒</view>
					<view class="pbCount">-3</view>
				</view>
			</view>
			<view class="textType">学生/床位号：</view>
			<view class="typeCont">3.张三、4.李四、7.王五</view>
			<view class="textType">说明：</view>
			<view class="typeCont">无</view>
			<view class="textType">照片：</view>
			<uni-file-picker style="margin-top: 10px;" readonly :value="fileLists" :imageStyles="imageStyles" file-mediatype="image"></uni-file-picker>
			<view class="nameTime flexEnd">
				<view class="nTime">张三</view>
				<view class="nTime">2024-05-16 08:01</view>
			</view>
		</view>
		<view style="height: 15px;background: #f2f2f2;"></view>
		<view class="bigText">申诉</view>
		<view class="bigLine"></view>
		<view class="jiluView">
			<view class="typeCont">不是我班宿舍，不应记在我班头上。</view>
			<view class="nameTime flexEnd">
				<view class="nTime">张三</view>
				<view class="nTime">2024-05-16 08:01</view>
			</view>
		</view>
		<view style="height: 15px;background: #f2f2f2;"></view>
		<view class="bigText">{{navItem.flag == 0?'我的审核意见':'审核'}}</view>
		<view class="bigLine"></view>
		<view class="flexStart shScore">
			<view class="shText">审核分数：</view>
			<view class="shScore">
				<uni-easyinput v-if="navItem.flag == 0" class="pbInput" v-model="value" type="number"></uni-easyinput>
				<view v-else style="margin-top: -15px;">-5</view>
			</view>
			<view class="shMsg">(审核分值为最终扣分/加分的分值)</view>
		</view>
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
				fileLists: [{
									url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao-small.jpg',
									extname: 'png',
									name: 'shuijiao.png'
								},{
									url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao-small.jpg',
									extname: 'png',
									name: 'shuijiao.png'
								}, {
									url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao-small.jpg',
									extname: 'png',
									name: 'uniapp-logo.png'
								}, {
									url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/shuijiao-small.jpg',
									extname: 'png',
									name: 'shuijiao.png'
								}]
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
			
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			textClick(){
				
			}
		}
	}
</script>

<style>
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
			width: 60px;
			text-align: center;
			background: #f2f2f2;
			border-radius: 12px;
			line-height: 60px;
			margin-left: calc((100% - 60px)/2);
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
			font-size: 18px;
			border-radius: 50%;
			text-align: center;
			line-height: 80px;
			font-weight: 700;
			position: relative;
			left: calc(100% - 140px);
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
					width: calc(100% - 53px);
				}
				
				.pbCount{
					height: 55px;
					width: 55px;
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
	}
</style>
