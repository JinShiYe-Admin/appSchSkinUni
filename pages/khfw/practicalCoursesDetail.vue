<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<view style="background: white;" v-if="pageData.week_name">
			<view style="margin: 0px 15px 0 15px;font-size: 16px;font-weight: 700;text-align: center;padding-top: 20px;">{{pageData.sub_date.split(' ')[0]}} {{pageData.week_name}} {{pageData.time_name}} {{pageData.sub_name}} 实际课程情况</view>
			<view style="text-align: right;font-size: 12px;margin-right: 10px;">学生人数：{{pageData.stu_count}}</view>
		</view>
		<view style="background: white;margin-top: 8px;" v-if="pageData.week_name">
			<view style="font-size: 12px;padding: 15px 0 15px 10px;">教师签到：{{signTime}}</view>
			<view style="text-align: right;font-size: 12px;margin-right: 10px;margin-top: -30px;padding-bottom: 15px;">已到人数：{{pageData.arr_count}}</view>
		</view>
		<uni-card v-if="pageData.week_name" isShadow v-for="(item,index) in pageData.unusual_list" :key="index">
			<uni-row
				style="margin: 0 10px;text-align: center;color: #000000;padding-bottom: 5px;font-size: 14px;">
				<uni-col :span="8">
					<view class="rowStyle" style="">{{item.grd_name}}</view>
				</uni-col>
				<uni-col :span="8">
					<view class="rowStyle" style="">{{item.cls_name}}</view>
				</uni-col>
				<uni-col :span="8">
					<view class="rowStyle" style="">{{item.stu_name}}</view>
				</uni-col>
			</uni-row>
			<view class="cardLine"></view>
			<uni-row style="font-size: 12px;margin-top: 5px;">
				<uni-col :span="6">
					<view class="rowStyle" style="">日期：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.sub_date.split(' ')[0]}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle" style="">星期：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.week_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle" style="">上课时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.time_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle" style="">上课地点：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.address}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle" style="">课程：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.sub_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle" style="">老师：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.tec_name}}</view>
				</uni-col>
			</uni-row>
			<view class="itemStatus" :style="{color:item.sign_status==5?'#d9001b':'',border:item.sign_status==5?'2px solid #d9001b':''}">{{item.sign_status_cn}}</view>
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
				pageData:{},
				signTime:'--'
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
			this.navItem.text = '实际课程情况';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '实际课程情况'
			});
			this.getList0();
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
			getList0(){
				let comData = {
					id:this.navItem.id,
					index_code: this.navItem.index_code,
				}
				// 实际课程详情
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassStat/scheduleDetail', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.tec_list.length; i++) {
							var tempM = data.data.tec_list[i];
							if (tempM.sign_time) {
								this.signTime = tempM.sign_time;
							}
						}
						this.pageData = data.data;
					} else {
						this.showToast(data.msg);
					}
				});
			},
		}
	}
</script>

<style>
	.cardLine{
		height: 1px;
		width: calc((100% + 100px));
		background: #d7d7d7;
		margin-left: -50px;
	}
	
	.itemStatus{
		font-size: 18px;
		color: #f59a23;
		border: 2px solid #f59a23;
		width: 38px;
		padding: 5px 10px;
		border-radius: 8px;
		float: right;
		margin-top: -70px;
		transform: rotate(315deg) ;
		font-family: 700;
	}
</style>