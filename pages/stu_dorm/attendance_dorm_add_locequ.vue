<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<uni-notice-bar :single="true" text="第二步:请选择考勤设备!" />
		<view>
			<uni-section v-if="location_type_2.length>0" title="宿舍" type="line"></uni-section>
			<view style="display: flex;flex-direction: row;flex-wrap: wrap;padding:0 15px;justify-content: space-between;">
				<view @click="setChecked(item)" :key="item.id" v-for="item in location_type_2" class="detail-text" :class="{'checked':item.checked}">{{item.attendance_location}}</view>
			</view>
		</view>
		<!-- <view class="line"></view> -->
		<view v-if="showNextButton">
			<button type="primary"  class="button-next" @click="nextStep">下一步</button>
		</view>
	</view>
</template> 

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	 
	 
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				
				location_type_2:[],
				checked_equ:new Map(),//选中的定位型设备
				showNextButton:false,
				beginTime:'',//考勤开始时间
				endTime:'',//考勤结束时间
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='宿舍点名登记'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			console.log("this.tabBarItem: " + JSON.stringify(this.tabBarItem));
			let that =this
			 itemData.locList.map(item=>{
				 item.checked=false
				 if(item.location_type==2){
				 	that.location_type_2.push(item)
				 }
			 })
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			setChecked(item){
				this.setAllChecked(this.tabBarItem.locList,item)
				if(item.checked){
					this.checked_equ.set(item.mach_id,item)
				}else{
					this.checked_equ.delete(item.mach_id)
				}
				if(this.checked_equ.size>0){
					this.showNextButton=true
				}else{
					this.showNextButton=false
				}
				this.$forceUpdate();
			},
			setAllChecked(list,item){
				list.map(litem=>{
					if(litem.mach_id==item.mach_id){
						litem.checked=!litem.checked
					}
				})
			},
			async nextStep(){
				 this.showLoading();
				 let leaveLocRecordList=[];
				 leaveLocRecordList=await this.getLeaveLocRecordList();
				 let stuList =this.tabBarItem.stuList
				 stuList.map(stuItem=>{
					 leaveLocRecordList.map(rItem=>{
						 if(stuItem.card_id==rItem.card_id){
							 if(stuItem.item_code){}else{
							 	stuItem.equType='定位型设备考勤数据'
							 	stuItem.item_txt='检测识别'
							 	stuItem.item_code='**'
							 }
						 }
					 })
				 })
				 util.openwithData('/pages/stu_dorm/attendance_dorm_add_stu',{
					build:this.tabBarItem.build,
					floor:this.tabBarItem.floor,
					dorm:this.tabBarItem.dorm,
					qa:this.tabBarItem.qa,
				 	time:this.tabBarItem.time,
					beginTime:this.beginTime,
					endTime:this.endTime,
				 	stuList:stuList,
					attendanceList:this.tabBarItem.attendanceList,
					historyData:this.tabBarItem.historyData,
				 	index_code:this.index_code,
				 })
			},
			//获取定位型设备考勤数据 2.15
			getLeaveLocRecordList(){
				let mach_ids=[]
				for (let obj of this.checked_equ) {
					 mach_ids.push(obj[1].mach_id)
				}
				return new Promise((res,rej)=>{
					let endTime=new this.moment().format('HH:mm:ss')
					let beginTime=new this.moment(this.tabBarItem.time+' '+endTime).subtract(this.globaData.INTERFACE_DORM_ATTENDANCE_ADVANCETIME,'minutes').format('HH:mm:ss');
					this.beginTime=beginTime
					this.endTime=endTime
					let comData={
						mids:mach_ids.join(','),
						mtp:8,
						page_size:9999999,
						page_number:1,
						btime:this.tabBarItem.time+' '+beginTime,
						etime:this.tabBarItem.time+' '+endTime,
						index_code: this.index_code,
					} 
					this.post(this.globaData.INTERFACE_UCARD+'blemachtimecardp',comData,response=>{
						console.log("获取定位型设备考勤数据: " + JSON.stringify(response));
						this.hideLoading()
						if(response!==null){
							res(response.list)
						}else{
							res([])
						}
					})
				})
			},
		},
	}
</script>

<style>
	::v-deep .uni-section{
		margin-top: 0;
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
	.form-view{
		padding: 0px 15px;
	}
	.form-left{
		font-size: 14px;
		width: 200rpx;
		color: #3F3F3F;
	}
	.form-left-textarea{
		margin-top: 5px;
		align-self: flex-start;
	}
	.form-right{
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
		text-align: right;
	}
	::v-deep .form-right .placeholder{
		color: grey;
		font-size: 14px;
		padding-right: 10px;
	}
	.uni-flex{
		align-items: center;
	}
	
	textarea{
		font-size: 13px;
		height: 80px;
		padding: 5px;
	}
	
	.form-left-approve{
		margin: 5px 0;
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
	}
	
	.button-next{
		background-color: #00CFBD !important;
		width: 35%;
		font-size: 14px;
		margin-top: 40px;
		animation: 1s opacity2 0s;
		-webkit-animation: 1s opacity2 0s;
		-moz-animation: 1s opacity2 0s;
	}
	
	@keyframes opacity2{
		0%{opacity:0}
		50%{opacity:.8;}
		100%{opacity:1;}
	}
	@-webkit-keyframes opacity2{
		0%{opacity:0}
		50%{opacity:.8;}
		100%{opacity:1;}
	}
	@-moz-keyframes opacity2{
		0%{opacity:0}
		50%{opacity:.8;}
		100%{opacity:1;}
	}
	
	.title-text{
		display: flex;
		align-items: center;
		width: 80vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.detail-text{
		min-height: 35px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: calc(50% - 5px);
		text-align: center;
		background: #dbdbdb;
		border: 1px solid #c2c2c2;
		color: #747474;
		font-size: 14px;
		margin: 3px 0;
		word-break: break-all;
	}
	.checked{
		background-color: #00CFBD;
		color: #feffff;
		border-color:#00CFBD;
	}
</style>
