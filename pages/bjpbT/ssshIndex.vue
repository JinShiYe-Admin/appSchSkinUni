<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="flexCenter semView">
			<view @click="clickSem(0)" :class="btnFlag==0?'sh0Btn':'sh1Btn'">未审核</view>
			<view @click="clickSem(1)" :class="btnFlag==0?'sh1Btn':'sh0Btn'">已审核</view>
		</view>
		<view class="pbList" v-for="model in 3" @click="gotoDetail(model)">
			<view class="clsView flexBetween">
				<view class="clsStr">2203班、2204班、2205班</view>
				<view class="clsStr">110室</view>
			</view>
			<view v-if="btnFlag==1" class="shenSS">审</view>
			<view :class="btnFlag==0?'':'cellList'">
				<view class="flexStart pbCell" v-for="item in 4">
					<view class="ellipsis-2 pbCont">洗过的鞋子没有晾晒</view>
					<view class="pbCount">-3</view>
				</view>
			</view>
			<view class="stuView flexStart">
				<uni-icons class="stuIcon" type="person" size="15"></uni-icons>
				<view class="stuStr">{{tempName.length==0?'-':tempName}}</view>
			</view>
			<view class="timeView flexEnd">
				<view class="personStr">哈哈哈</view>
				<uni-icons class="timeIcon" type="calendar" size="15" color="#555"></uni-icons>
				<view class="timeStr">2023-02-22 09:12</view>
			</view>
		</view>
		<view style="height: 10px;"></view>
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
				btnFlag:0,
				tempName:'111、222、333'
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
			// this.navItem.text = '在线缴费';
			this.index_code = this.navItem.access.split("#")[1];
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			clickSem(flag){
				this.btnFlag = flag
			},
			gotoDetail(model){
				let model0 = {
					flag:this.btnFlag
				}
				util.openwithData('/pages/bjpbT/ssshDetail', model0);
			}
		}
	}
</script>

<style>
	.semView{
		margin: 20px;
		font-size: 13px;
		text-align: center;
		
		.sh0Btn{
			width: 100px;
			color: #00b6ab;
			padding-bottom: 5px;
			border-bottom: 1px solid #00b6ab;
		}
		
		.sh1Btn{
			width: 100px;
			color: #7f7f7f;
			padding-bottom: 5px;
			border-bottom: 1px solid #7f7f7f;
		}
	}
	.pbList{
		background: white;
		margin: 10px;
		border-radius: 10px;
		
		.clsView{
			margin: 10px 15px;
			
			.clsStr{
				margin-top: 10px;
				font-size: 12px;
				color: #000;
			}
		}
		
		.shenSS{
			z-index: 200;
			width: 60px;
			height: 60px;
			border: 2px dashed #ec808d;
			color: #ec808d;
			font-size: 18px;
			border-radius: 50%;
			text-align: center;
			line-height: 60px;
			font-weight: 700;
			position: relative;
			left: calc(100% - 100px);
			top: 0px;
		}
		
		.cellList{
			margin-top: -75px;
		}
		
		.pbCell{
			background: white;
			margin: 10px;
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
				font-size: 24px;
				color: #d9001b;
				font-weight: bold;
			}
		}
		
		.stuView{
			margin: 5px 15px;
			
			.stuIcon{
				
			}
			.stuStr{
				font-size: 12px;
			}
		}
		
		.timeView{
			margin: 5px 15px;
			
			.personStr{
				font-size: 12px;
				color: #555555;
			}
			
			.timeIcon{
				padding-top: 1px;
				margin: 0 5px 0 10px;
			}
			.timeStr{
				font-size: 12px;
				margin-bottom: 10px;
				color: #555555;
			}
		}
	}
</style>
