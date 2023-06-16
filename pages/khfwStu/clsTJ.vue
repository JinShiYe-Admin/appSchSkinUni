<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<uni-row>
				<uni-col :span="24" style="">
					<view style="color: #00CFBD;text-align: left;height: 30px;font-size: 13px;margin: 10px 0 0 20px;"
						@click="showTimePick()">
						{{timePickerDate.join(' ~ ')}}
						<uni-icons type="arrowdown" size="15" color='#00CFBD'></uni-icons>
					</view>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="margin:65px 0 15px 15px;font-size: 20px;font-weight: 900;">{{personInfo.cls_name}} {{personInfo.stu_name}}</view>
		<uni-row style="">
			<uni-col :span="12">
				<view class="rowStyle" style="float: left;margin-left: 70px;">
					<view class="card-line">{{stu_sub_num}}</view>
					<view class="rowStr">报名课时</view>
				</view>
			</uni-col>
			<uni-col :span="12">
				<view class="rowStyle" style="float: right;margin-right: 60px;">
					<view class="card-line">{{stu_sign_num}}</view>
					<view class="rowStr">已上课时</view>
				</view>
			</uni-col>
		</uni-row>
		<view style="font-size: 12px;margin: 15px;">说明：正常上课情况不做记录，只记录异常情况，其中考勤情况为请假和缺勤的不计入已上课时量中。</view>
		<view style="margin: 10px;">
			<zb-table v-if="columns.length>0" :show-header="true" :columns="columns" :stripe="true" :fit="true" :data="dataSource"></zb-table>
		</view>
		<view class="content">
			<term-picker :visable.sync="pickerVisable" :defaultDate="defaultDate" :timeLimit='true'
				@confirm="confirm"></term-picker>
		</view>
		<view style="height: 50px;background: #f2f2f2;"></view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				columns: [],
				dataSource:[],
				pickerVisable: false,
				defaultDate: [],
				timePickerDate: [],
				defTime: this.moment().format('YYYY-MM-DD'),
				stu_sub_num:0,
				stu_sign_num:0,
			}
		},
		components: {
			mynavBar
		},
		methods: {
			showTimePick() {
				this.pickerVisable = true;
			},
			// 点击确定按钮，返回当前选择的值
			confirm(date) {
				this.timePickerDate = date;
				this.getList0();
			},
			getList0() { //学生课时统计详情
				let comData = {
					stu_code: this.personInfo.stu_code,
					start_date:this.timePickerDate[0],
					end_date:this.timePickerDate[1],
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassStat/stuStatDetail', comData, (data0, data) => {
					this.hideLoading();
					this.stu_sub_num = data.data.stu_sub_num;
					this.stu_sign_num = data.data.stu_sign_num;
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
						label: '教师',
						name: 'tec_name',
						align:'center',
						fixed:false
					})
					tempCol.push({
						label: '考勤情况',
						name: 'sign_status_cn',
						align:'center',
						fixed:false
					})
					tempCol.push({
						label: '记录人',
						name: 'recorder',
						align:'center',
						fixed:false
					})
					this.columns = tempCol;
					for (var i = 0; i < data.data.list.length; i++) {
						var tempM = data.data.list[i];
						tempM.address = tempM.addr_list.length>0?tempM.addr_list[0].address+' ':'';
						tempM.tec_name = tempM.tec_list[0].tec_name;
						tempM.sub_date = tempM.sub_date.split(' ')[0];
					}
					this.dataSource = data.data.list;
				})
			}
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			console.log('itemData:'+JSON.stringify(itemData))
			itemData.index = 100
			this.navItem = itemData;
			this.index_code = itemData.access.split("#")[1];
			
			let end_month = this.moment().format('YYYY-MM-DD')
			let start_month = this.moment().subtract(1, 'M').format('YYYY-MM-DD');
			this.defaultDate.push(start_month);
			this.defaultDate.push(end_month);
			this.timePickerDate.push(start_month);
			this.timePickerDate.push(end_month);
			this.getList0();
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
	}
</script>

<style>
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}
	
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
