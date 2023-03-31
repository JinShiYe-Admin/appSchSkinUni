<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="下一步" :textClick="textClick"></mynavBar>
		<view style="margin-top: 25px;margin-left: 15px;font-size: 12px;color: #333333;">
			<view>未签到：<view style="width: 20px;height: 20px;background: #AAAAAA;margin: -18px 0 0 50px;"></view></view>
			<view style="margin: -18px 0 0 120px;">已签到：<view style="width: 20px;height: 20px;background: #00cfbd;margin: -18px 0 0 50px;"></view></view>
		</view>
		<uni-card isShadow style="margin: 20px 5px 0;">
			<view style="font-weight: 900;font-size: 16px;text-align: center;margin: 15px 0 10px 0;">2023年3月</view>
			<uni-row style="margin: 0 -10px;">
				<uni-col :span="3">
					<view class="rowStyle" style="border:1px solid transparent"></view>
				</uni-col>
				<uni-col :span="3" v-for="item in tempArr0">
					<view class="rowStyle">{{item}}</view>
				</uni-col>
				<uni-col :span="3">
					<view class="rowStyle" style="border:1px solid transparent"></view>
				</uni-col>
				<uni-col :span="3" v-for="item in tempArr1">
					<view class="rowStyle">{{item}}</view>
				</uni-col>
				<view style="margin-top: 10px;">
					<uni-col :span="3" >
						<view class="rowClass" style="background: #e1d3be;">
							<view class="rowStyle">课后第一节</view>
							<view class="rowStyle" style="font-size: 8px !important;">15:10-16:10</view>
						</view>
					</uni-col>
					<uni-col :span="3">
						<view class="rowClass">
							<view class="rowStyle">口风琴社团</view>
							<view class="rowStyle">操场二（1）班</view>
						</view>
					</uni-col>
					<uni-col :span="3">
						<view class="rowClass">
							<view class="rowStyle">口风琴社团</view>
							<view class="rowStyle">操场二（1）班</view>
						</view>
					</uni-col><uni-col :span="3">
						<view class="rowClass">
							<view class="rowStyle">口风琴社团</view>
							<view class="rowStyle">操场二（1）班</view>
						</view>
					</uni-col><uni-col :span="3">
						<view class="rowClass">
							<view class="rowStyle">口风琴社团</view>
							<view class="rowStyle">操场二（1）班</view>
						</view>
					</uni-col><uni-col :span="3">
						<view class="rowClass">
							<view class="rowStyle">口风琴社团</view>
							<view class="rowStyle">操场二（1）班</view>
						</view>
					</uni-col>
					<uni-col :span="3">
						<view class="rowClass">
							<view class="rowStyle">口风琴社团</view>
							<view class="rowStyle">操场二（1）班</view>
						</view>
					</uni-col>
					<uni-col :span="3">
						<view class="rowClass">
							<view class="rowStyle">口风琴社团</view>
							<view class="rowStyle">操场二（1）班</view>
						</view>
					</uni-col>
				</view>
				<!-- <view v-for="(item,index) in tempArr2"> -->
					
				<!-- </view> -->
			</uni-row>
		</uni-card>
		<view style="height: 50px;background: #f2f2f2;"></view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				tempArr0:['1','2','3','4','5','6','7'],
				tempArr1:['一','二','三','四','五','六','日'],
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '点名';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '点名'
			});
			//#ifdef H5
			document.title = "";
			//#endif
			//
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			textClick() {
				util.openwithData('/pages/khfw/rollCall2', {
					// index_code: _this.index_code,
					// fir_id: this.navItem.fir_id
				}, {
					refreshRecordList(data) { //子页面调用父页面需要的方法
						// _this.showLoading()
						// _this.pageobj0.loadFlag = 0
						// _this.pageobj0.canload = true
						// _this.pageobj0.page_number = 1
						// _this.getList0()
					}
				})
			},
		}
	}
</script>

<style>
	.rowStyle{
		font-size: 10px;
		color: #333333;
		text-align: center;
		margin-top: 10px;
		margin: 2px;
	}
	
	.rowClass{
		font-size: 12px;
		margin-top: 5px;
		text-align: center;
		height: 100px;
		background: #00cfbd;
		border-radius: 5px;
		margin: 1px;
		padding-top: 10px;
	}
</style>
