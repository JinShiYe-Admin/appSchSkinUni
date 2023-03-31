<template>
	<view>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view style="display: flex;">
				<picker style="flex: 1;"  @change="dptClick" :value="dptIndex" :range="dptArray" range-key="text">
					<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
						{{dptArray[dptIndex].text}}
						<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</picker>
				<view class="mini-date" style="flex: 1;">
					<dy-Date :childValue='endDate' timeType="month" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
					<uni-icons style="padding-right: 3px;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
				</view>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 40px;">
			<uni-list :border="false">
				<uni-list-item  :key="index" v-for="(item,index) in pagedata" :border="true">
					<view slot="body" class="slot-box slot-text">
						<uni-row>
							<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">姓名：</view><view class="detail-text">{{item.user_name}}</view></uni-col>
							<uni-col :span="12" style="display: flex;align-items: baseline;"><view class="title-text">正常：</view><view class="detail-text">{{item.ok_cnt}}次</view></uni-col>
							<uni-col :span="12" style="display: flex;align-items: baseline;"><view class="title-text">迟到：</view><view class="detail-text">{{item.late_cnt}}次</view></uni-col>
							<uni-col :span="12" style="display: flex;align-items: baseline;"><view class="title-text">早退：</view><view class="detail-text">{{item.early_cnt}}次</view></uni-col>
							<uni-col :span="12" style="display: flex;align-items: baseline;"><view class="title-text">非规定地址打卡：</view><view class="detail-text">{{item.out_cnt}}次</view></uni-col>
						</uni-row>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				pagedata:[],
				//顶部筛选框相关内容
				userList: [], 
				user_codes:'',
				dptIndex:0,
				dptArray: [{text:'',value:''}],//部门数组
				time:this.moment().format('YYYY-MM'),
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM')
			}
		},
		methods: {
			dptClick:function(e){
				if(this.dptIndex!==e.detail.value){
					 this.dptIndex=e.detail.value
					 this.showLoading()
					 this.getList0();
				}
			},
			timeSelect(e){
				this.time=e
				this.showLoading()
				this.getList0();
			},
			getDpt(){//部门人员
				let comData={
					dpt_codes:this.dptArray[this.dptIndex].dpt_code,
					page_size:10000,
					page_number:-1,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'dptUser',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let list = response.list;
					if(list.length>0 ){
						let codes=[]
						for (var i = 0; i < list.length; i++) {
							codes.push(list[i].user_code);
						}
						this.user_codes=codes.join(",");
						this.getList0();
					}else{
						this.showToast('部门暂无人员');
					}
				})
			},
			getUserInfo(){//人员 当前登录用户部门及额外角色
				let comData={
					user_code: this.personInfo.user_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'user/userInfo',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let dpts = response.dpt_list;
					if (dpts.length > 0) {
						for (var i = 0; i < dpts.length; i++) {
							var tempDpt = dpts[i];
							tempDpt.text = tempDpt.dpt_name;
							tempDpt.value = tempDpt.dpt_code;
						}
						this.dptArray = dpts;
						this.getDpt()
					}else{
						this.showToast('无数据授权 无法获取部门');
					}
				})
			},
			getList0(){//获取页面数据
				let comData={
					dpt_code: this.dptArray[this.dptIndex].dpt_code, //部门Code
					dpt_name: this.dptArray[this.dptIndex].dpt_name, //部门名称
					user_codes:this.user_codes,//部门人员codes
					begin_time: this.moment(this.time).startOf('month').format("YYYYMMDD"), //查询开始时间
					end_time: this.moment(this.time).endOf('month').format("YYYYMMDD"), //查询结束时间
					op_code: 'index',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ATTENDAND+'attendDptQry/getDptMonthAttends',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.pagedata=[].concat(response.list)
				})
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getUserInfo()
			},100)
			uni.setNavigationBarTitle({title:'考勤报表'});
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){
			//#ifdef H5
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
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .title-text{
		 display: flex;
		 align-items: center;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
		 flex: 1;
	 	color: #939393;
	 	font-size: 13px;
	 	margin: 3px 0;
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
</style>
