<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<view style="margin: 15px 0 15px 15px;font-size: 20px;font-weight: 900;">{{navItem.dpt_name?navItem.dpt_name:'--'}} {{navItem.tec_name}} <span style="font-size: 11px;float: right;margin-right: 15px;margin-top: 5px;">{{navItem.start_date}}至{{navItem.end_date}}</span></view>
		<uni-row style="">
			<uni-col :span="12">
				<view class="rowStyle" style="float: left;margin-left: 70px;">
					<view class="card-line">{{parseInt(navItem.tec_sub_num)}}</view>
					<view class="rowStr">安排课时</view>
				</view>
			</uni-col>
			<uni-col :span="12">
				<view class="rowStyle" style="float: right;margin-right: 60px;">
					<view class="card-line">{{parseInt(navItem.tec_sign_num)}}</view>
					<view class="rowStr">已上课时</view>
				</view>
			</uni-col>
		</uni-row>
		<view style="font-size: 12px;margin: 15px;">说明：已上课时量根据已签到的节次计算，未签到的节次不计已上课时量的统计范围。</view>
		<view style="margin: 10px;height: 400px;">
			<zb-table v-if="columns.length>0" :show-header="true" :columns="columns" :stripe="true" :fit="true" :data="dataSource"></zb-table>
		</view>
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
				columns: [],
				dataSource:[] 
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
			this.navItem.text = '教师课时详情';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.getPageData();
			uni.setNavigationBarTitle({
				title: '教师课时详情'
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
			getPageData() {
				let comData = {
					tec_code:this.navItem.tec_code,
					start_date: this.navItem.start_date,
					end_date: this.navItem.end_date,
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				// 1.3.教师课时统计详情 
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassStat/tecStatDetail', comData, (data0, data) => {
					this.hideLoading();
					var tempCol = [];
					var tempDs = [];
					tempCol.push({
						label: '日期',
						name: 'sub_date',
						align:'center',
						fixed:true
					})
					tempCol.push({
						label: '星期',
						name: 'week_name',
						align:'center',
						fixed:false
					})
					tempCol.push({
						label: '上课时间',
						name: 'time_name',
						align:'center',
						fixed:false
					})
					tempCol.push({
						label: '上课地点',
						name: 'address',
						align:'center',
						fixed:false
					})
					tempCol.push({
						label: '课程',
						name: 'sub_name',
						align:'center',
						fixed:false
					})
					tempCol.push({
						label: '签到时间',
						name: 'sign_time',
						align:'center',
						fixed:false
					})
					tempCol.push({
						label: '签到状态',
						name: 'sign_status_cn',
						align:'center',
						fixed:false
					})
					this.columns = tempCol;
					for (var i = 0; i < data.data.list.length; i++) {
						var tempM = data.data.list[i];
						tempM.sub_date = tempM.sub_date.split(' ')[0];
						tempM.address = tempM.addr_list.length>0?tempM.addr_list[0].address+' ':'';
						tempM.sign_time = tempM.sign_time?tempM.sign_time.split(' ')[0]:'';
					}
					this.dataSource = data.data.list;
				})
			},
		}
	}
</script>

<style>
	.rowStyle{
		width: 90px;
		height: 90px;
		border-radius: 5px;
		background: white;
	}
	
	.card-line {
		text-align: center;
		font-size: 25px;
		color: red;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid green;
		width: 70px;
		margin-left: calc((100% - 70px)/2);
	}
	
	.rowStr{
		font-size: 12px;
		text-align: center;
		margin-top: 7px;
	}
</style>
