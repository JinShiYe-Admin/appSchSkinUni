<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick" :text='text' :textClick="textClick"></mynavBar>
		<view v-if="editStatus===0">
			<view class="uni-flex uni-row form-view">
				<view class="form-left">年级</view>
				<view class="form-right">{{detailData.grd_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">班级</view>
				<view class="form-right">{{detailData.class_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">姓名</view>
				<view class="form-right">{{detailData.stu_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">考勤类型</view>
				<view class="form-right">{{detailData.attendance_type_txt}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">考勤情况</view>
				<view class="form-right">{{detailData.item_txt}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">考勤说明</view>
				<view class="form-right"  style="text-align: left;">{{detailData.comment}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">考勤日期</view>
				<view class="form-right">{{detailData.attendance_time}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">星期</view>
				<view class="form-right">{{detailData.day_week}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">节次</view>
				<view class="form-right">{{detailData.class_node}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">科目</view>
				<view class="form-right">{{detailData.sub_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">记录人</view>
				<view class="form-right">{{detailData.create_user_name}}</view>
			</view>
		</view> 
		<view v-else-if="editStatus===1">
			<view class="uni-flex uni-row form-view2">
				<view class="form-left">年级</view>
				<input class="uni-input form-right"  :value="detailData.grd_name" disabled/>
				<!-- <uni-icons size="13" type="arrowdown" color="#808080"></uni-icons> -->
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view2">
				<view class="form-left">班级</view>
				<input class="uni-input form-right"  :value="detailData.class_name" placeholder="请选择" disabled/>
				<!-- <uni-icons size="13" type="arrowdown" color="#808080"></uni-icons> -->
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view2">
				<view class="form-left">姓名</view>
				<picker style="width:100% !important;" mode="selector" @change="stuSelect" :value="stuIndex" :range="stuList" range-key="text">
					<input class="uni-input form-right"  :value="stuIndex>=0?stuList[stuIndex].text:''" placeholder="请选择" disabled/>
				</picker>
				<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view2">
				<view class="form-left">考勤情况</view>
				<picker style="width:100% !important;" mode="selector" @change="attendanceSelect" :value="attendanceIndex" :range="attendanceList" range-key="text">
					<input class="uni-input form-right"  :value="attendanceIndex>=0?attendanceList[attendanceIndex].text:''" placeholder="请选择" disabled/>
				</picker>
				<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view2">
				<view class="form-left">考勤日期</view>
				<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='time'  timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
				<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view2">
				<view class="form-left">节次</view>
				<picker style="width:100% !important;" mode="selector" @change="jcSelect" :value="jcIndex" :range="jcList" range-key="text">
					<input class="uni-input form-right"  :value="jcIndex>=0?jcList[jcIndex].text:''" placeholder="请选择" disabled/>
				</picker>
				<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view2">
				<view class="form-left">科目</view>
				<picker style="width:100% !important;" mode="selector" @change="kmSelect" :value="kmIndex" :range="kmList" range-key="text">
					<input class="uni-input form-right"  :value="kmIndex>=0?kmList[kmIndex].text:''" placeholder="请选择" disabled/>
				</picker>
				<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view2">
				<view class="form-left form-left-textarea">行为说明</view>
				<textarea placeholder="请输入" v-model="comment" maxlength="100" ></textarea>
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
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				detailData:{
					grd_name:"",
					class_name:"",
					stu_name:"",
					attendance_type_txt:"",
					item_code:"",
					comment:'',
					attendance_time:"",
					day_week:"",
					class_node:"",
					sub_name:"",
					create_user_name:"",
					item_txt:"",
					attendance_type:"",
					id:''
				},
				icon:'',
				text:'',
				textClick:this.textClickEvent,
				editStatus:0,//0 展示  1编辑
				
				stuIndex:-1,
				jcIndex:-1,
				kmIndex:-1,
				attendanceIndex:-1,
				stuList:[],//学生数组
				jcList: [], //节次数组
				kmList: [], //科目数组
				attendanceList: [], //考勤情况数组
				// leaveDict:[],
				// attendanceDict:[], 
				time:'',//表单内容
				comment:'',//表单内容
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD'),
				
				canSub:true,
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='课堂点名详情'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			console.log("itemData: " + JSON.stringify(itemData));
			this.detailData={
				grd_name:itemData.grd_name,
				class_name:itemData.class_name,
				stu_name:itemData.stu_name,
				attendance_type_txt:itemData.attendance_type_txt,
				item_code:itemData.item_code,
				comment:itemData.comment,
				attendance_time:itemData.attendance_time,
				day_week:itemData.day_week,
				class_node:itemData.class_node,
				sub_name:itemData.sub_name,
				create_user_name:itemData.create_user_name,
				item_txt:itemData.item_txt,
				attendance_type:itemData.attendance_type,
				id:itemData.id
			}
			this.time=itemData.attendance_time
			this.comment=itemData.comment
			if(itemData.del==1){
				this.icon='trash'
			}
			
			if(itemData.edit==1){
				this.text='编辑'
			}
			//#ifndef APP-PLUS
				document.title=""
			//#endif
			let that =this
			setTimeout(function() {
				that.getStuList();
				// that.getLeaveDict()
				that.getClassAttendanceDict()
				// that.getClassDict()
			}, 100);
		},
		onShow(){
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			iconClick(){
				this.$refs.alertDialog.open()
			},
			textClickEvent(){
				console.log('修改');
				this.editStatus=1
				this.icon=''
				this.text=['取消','保存'],
				this.textClick=[this.cancel,this.save]
				console.log(this.stuList);
				this.stuList.map((stuItem,index)=>{
					if(stuItem.value==this.tabBarItem.stu_code){
						this.stuIndex=index
					}
				})
				// let attendanceList=this.leaveDict.concat(this.attendanceDict)
				// attendanceList.map((item,index)=>{
				// 	if(item.value==this.tabBarItem.item_code){
				// 		this.attendanceIndex=index
				// 	}
				// })
				// this.attendanceList=attendanceList
			},
			save(){
				if(this.canSub){
					this.canSub=false
					this.showLoading()
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
					this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/editSaveData',comData,(response0,response)=>{
						if (response.code == 0) {
							 this.hideLoading()
							 this.showToast(response.msg);
							 const eventChannel = this.getOpenerEventChannel()
							 eventChannel.emit('refreshKetang', {data: 1});
							 uni.navigateBack();
						} else {
							this.canSub=true
							this.hideLoading()
							this.showToast(response.msg);
						}
					},()=>{
						this.canSub=true
					})
				}
			},
			cancel(){
				this.text='编辑'
				this.icon='trash'
				this.textClick=this.textClickEvent
				this.editStatus=0
			},
			dialogConfirm(){
				this.showLoading()
				let url=this.globaData.INTERFACE_WORK + 'StudentAttendance/delete'
				let comData={
					id: this.detailData.id,
					index_code:this.index_code,
				}
				this.post(url,comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.showToast('操作成功')
					this.hideLoading()
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('refreshKetang', {data: 1});
					uni.navigateBack();
				})
			},
			stuSelect(e){
				if(this.stuList.length>0){
					if(this.stuIndex!==e.detail.value){
						 this.stuIndex=e.detail.value
					}
				}
			},
			attendanceSelect(e){
				if(this.attendanceList.length>0){
					if(this.attendanceIndex!==e.detail.value){
						this.attendanceIndex=e.detail.value
					}
				}
			},
			jcSelect(e){
				if(this.jcList.length>0){
					if(this.jcIndex!==e.detail.value){
						this.jcIndex=e.detail.value
					}
				}
			},
			kmSelect(e){
				if(this.kmList.length>0){
					if(this.kmIndex!==e.detail.value){
						this.kmIndex=e.detail.value
					}
				}
			},
			timePicker(){
				this.$refs.timePicker.show()
			},
			timeSelect(e){
				this.time=e
			},
			//获取班级学生
			getStuList(){
				let comData={
					op_code:'index',
					grd_code: this.tabBarItem.grd_code,
					cls_code: this.tabBarItem.cls_code,
					sub_code: this.tabBarItem.sub_code,
					get_stu:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'Common/getEditGrdClsSubStuInfo',comData,response=>{
				    console.log("StudentAttendance/getDict: " + JSON.stringify(response));
					this.stuList=response.stuArray
					this.kmList=response.subArray
					response.stuArray.map((item,index)=>{
						if(item.value==this.tabBarItem.stu_code){
							this.sutIndex=index
						}
					})
					response.subArray.map((item,index)=>{
						if(item.value==this.tabBarItem.sub_code){
							this.kmIndex=index
						}
					})
					this.hideLoading()
				})
			},
			//获取请假常量
			// getLeaveDict(){
			// 	let comData={
			// 		index_code:this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_WORK+'LeaveRecord/getDict',comData,response=>{
			// 		console.log("responseaaaa: " + JSON.stringify(response));
			// 		this.hideLoading()
			// 		this.leaveDict=response.qaArray
			// 	})
			// },
			//获取考勤常量 54
			getClassAttendanceDict(){
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/getDict',comData,response=>{
					this.hideLoading()
					// let qaArray=[]
					// response.list.map(item=>{
					// 	if(item.attendance_type=='inClassAttendance'){
					// 		qaArray.push({text:item.item_code_txt,value:item.item_code})
					// 	}
					// })
					
					// this.attendanceDict=qaArray
					response.qaArray.map((item,index)=>{
						if(item.value==this.tabBarItem.item_code){
							this.attendanceIndex=index
						}
					})
					response.timeArray.map((item,index)=>{
						if(item.value==this.tabBarItem.class_node){
							this.jcIndex=index
						}
					})
					
					// this.attendanceDict=response.qaArray
					this.attendanceList=response.qaArray
					this.jcList=response.timeArray
				})
			},
			//获取节次常量
			// getClassDict(){
			// 	let comData={
			// 		index_code:this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/getDict',comData,response=>{
			// 	    console.log("responsesabaa: " + JSON.stringify(response));
			// 		this.hideLoading()
			// 		this.jcList=response.timeArray
			// 		response.timeArray.map((item,index)=>{
			// 			if(item.value==this.tabBarItem.class_node){
			// 				this.jcIndex=index
			// 			}
			// 		})
			// 	})
			// },
		}
	}
</script>

<style>
	.line{
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	 
	.form-view{
		padding: 8px 15px;
	}
	.form-view2{
		padding: 0px 15px;
	}
	.form-left{
		font-size: 14px;
		width: 200rpx;
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
		-webkit-flex: 1;
		flex: 1;
		font-size: 13px;
		border: 1px solid rgba(229,229,229,0.3);
		min-height: 80px;
		padding: 5px;
	}
	 
</style>
