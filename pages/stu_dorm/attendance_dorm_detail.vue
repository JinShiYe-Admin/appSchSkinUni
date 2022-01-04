<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick" :text='text' :textClick="textClick"></mynavBar>
		<view v-if="editStatus===0">
			<view class="uni-flex uni-row form-view">
				<view class="form-left">年级</view>
				<view class="form-right">{{tabBarItem.grd_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">班级</view>
				<view class="form-right">{{tabBarItem.cls_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">学生</view>
				<view class="form-right">{{tabBarItem.stu_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">楼房</view>
				<view class="form-right">{{tabBarItem.dorm_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">楼层</view>
				<view class="form-right">{{tabBarItem.floor_num}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">房间号</view>
				<view class="form-right">{{tabBarItem.room_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">床位号</view>
				<view class="form-right">{{tabBarItem.bed_num}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">宿舍考勤</view>
				<view class="form-right">{{tabBarItem.item_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">午/晚休</view>
				<view class="form-right">{{tabBarItem.rest_code_text}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">说明</view>
				<view class="form-right">{{tabBarItem.remark?tabBarItem.remark:'暂无'}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">记录人</view>
				<view class="form-right">{{tabBarItem.create_user_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">时间</view>
				<view class="form-right">{{tabBarItem.attendance_date}}</view>
			</view>
		</view>
		<view v-else-if="editStatus===1">  
			<view class="tabs-fixed">
				<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#00cfbd" @clickItem="onClickItem" />
			</view>
			<view class="content">
				<view v-if="current === 0">
					6566小伙子
				</view>
				<view v-if="current === 1">
					888小伙子
				</view>
			</view>
		</view>
		<view style="height: 30px;">
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="确定要删除该条记录吗？" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				items: ['按宿舍登记', '按班级登记'],
				current: 0,
				
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				
				stuList:[],//学生数组
				stuIndex:-1,
				icon:'',
				text:'',
				textClick:this.textClickEvent,
				editStatus:0,//0 展示  1编辑
				time:'',//表单内容
				comment:'',//表单内容
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD'),
				
				canSub:true,
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='宿舍考勤详情'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			
			if(itemData.delete==1){
				this.icon='trash'
			}
			
			if(itemData.edit==1){
				this.text='编辑'
			}
			console.log("itemData: " + JSON.stringify(itemData));
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			 
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
				if(this.current===0){
					 console.log('666 小伙子');
				}else if(this.current===1){
					  console.log('777 小伙子');
				}
			},
			textClickEvent(){
				console.log('修改');
				this.editStatus=1
				this.icon=''
				this.text=['取消','保存'],
				this.textClick=[this.cancel,this.save]
			},
			save(){
				if(this.canSub){
					// this.canSub=false
					// this.showLoading()
					let comData={
						grd_code:this.tabBarItem.grd_code,
						cls_code:this.tabBarItem.cls_code,
						attendance_time:this.time,
						stu_ids:this.stuList[this.stuIndex].value,
						item_code:this.attendanceList[this.attendanceIndex].value,
						class_node:this.jcList[this.jcIndex].value,
						sub_code:this.kmList[this.kmIndex].value,
						comment:this.comment,
						id:this.tabBarItem.id,
						index_code:this.index_code,
					}
					console.log("comData: " + JSON.stringify(comData));
					// this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/editSaveData',comData,(response0,response)=>{
					// 	if (response.code == 0) {
					// 		 this.hideLoading()
					// 		 this.showToast(response.msg);
					// 		 const eventChannel = this.getOpenerEventChannel()
					// 		 eventChannel.emit('refreshKetang', {data: 1});
					// 		 uni.navigateBack();
					// 	} else {
					// 		this.canSub=true
					// 		this.hideLoading()
					// 		this.showToast(response.msg);
					// 	}
					// },()=>{
					// 	this.canSub=true
					// })
				}
			},
			cancel(){
				this.text='编辑'
				this.icon='trash'
				this.textClick=this.textClickEvent
				this.editStatus=0
			},
			iconClick(){
				this.$refs.alertDialog.open()
			},
			dialogConfirm(){
				this.showLoading()
				let url=this.globaData.INTERFACE_DORM + 'dormAttendance/delete'
				let comData={
					id: this.tabBarItem.id,
					index_code:this.index_code,
				}
				this.post(url,comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.showToast('操作成功')
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('refreshList', {data: 1});
					uni.navigateBack();
					this.hideLoading()
				})
			},
		}
	}
</script>

<style>
	.line{
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.double-line{
		height: 5px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.form-view{
		padding: 8px 15px;
	}
	.form-left{
		font-size: 14px;
		width: 200rpx;
	}
	.form-right{
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
		text-align: left;
	}
	
	.form-left-approve{
		font-size: 13px;
		-webkit-flex: 1;
		color: #787878;
		flex: 1;
	}
	.form-right-approve{
		width: 20px;
		text-align: right;
	}
	.form-left-approve-content{
		font-size: 12px;
		color: #787878;
		word-break: break-all;
		margin-top: -10px;
	}
	.leaveType {
		color: #00CFBD;
		padding: 3px;
		font-size: 13px;
		border-radius: 2px;
		border: 1px solid #00CFBD;
	}
	
	.leaveType-cr {
		color: #FF5733;
		padding: 3px;
		font-size: 13px;
		border-radius: 2px;
		border: 1px solid #FF5733;
	}
	
	.line-green{
		background-color: #00CFBD;
		margin-bottom: 0.3125rem;
		height: 1px;
	}
	
	.title-text{
		font-size: 14px;
	}
	
	textarea{
		-webkit-flex: 1;
		flex: 1;
		font-size: 13px;
		border: 1px solid rgba(0,207,189,0.3);
		min-height: 80px;
		padding: 5px;
	}
	
	
	.mui-btn,.mui-btn1{
		font-size: 15px;
		flex: 1;
		-webkit-flex:1;
	}
	.mui-btn{
		margin: 5px 10px 25px 0;
	}
	
	.mui-btn1{
		background-color: #00CFBD;
		margin: 5px 0 25px 10px;
	}
	.encName {
		margin-left: 15px;
		margin-right: 15px;
		margin-bottom: 10px;
		font-size: 14px;
		color: #333;
	}
	
	.content{
		margin: 44px 0 2px;
	}
</style>
