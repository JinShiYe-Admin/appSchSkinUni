<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<uni-notice-bar :single="true" text="第一步:请选择考勤信息!" />
		<view class="uni-flex uni-row form-view">
			<view class="form-left">年级</view>
			<picker style="width:100% !important;height: 100%;" mode="selector" @change="grdSelect" :range="grdList" range-key="text">
				<view class="uni-input form-right">{{grdIndex>=0?grdList[grdIndex].text:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">班级</view>
			<picker style="width:100% !important;" mode="selector" @change="clsSelect" :value="clsIndex" :range="clsList" range-key="text">
				<view class="uni-input form-right">{{clsIndex>=0?clsList[clsIndex].text:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">日期</view>
			<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='time'  timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
			<!-- <xp-picker mode="ymd" ref="timePicker" history :animation="false" :year-range='[2020,2030]' @confirm="timeSelect"></xp-picker>
			<input class="uni-input form-right"  v-model="time" placeholder="请选择" disabled @click="timePicker"/> -->
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">节次</view>
			<picker style="width:100% !important;" mode="selector" @change="jcSelect" :value="jcIndex" :range="jcList" range-key="text">
				<view class="uni-input form-right">{{jcIndex>=0?jcList[jcIndex].text:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">科目</view>
			<picker style="width:100% !important;" mode="selector" @change="kmSelect" :value="kmIndex" :range="kmList" range-key="text">
				<view class="uni-input form-right">{{kmIndex>=0?kmList[kmIndex].text:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view v-if="showNextButton">
			<button type="primary"  class="button-next" @click="nextStep">下一步</button>
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="已存在考勤记录,是否继续" closeText='取消' confirmText="继续" @confirm="dialogConfirm"></uni-popup-dialog>
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
				navItem: {},
				
				time:'',//发生日期
				grdIndex:-1,
				clsIndex:-1,
				jcIndex:-1,
				kmIndex:-1,
				grdList: [], //年级数组
				clsList: [], //班级数组
				stuList:[],//学生数组
				jcList: [], //节次数组
				kmList: [], //科目数组
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD'),
				showNextButton:false,
				attendanceDict:[], 
				historyData:false,//是否存在历史考勤数据
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='课堂点名登记'
			this.navItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading();
				this.getGrd();
				this.getClassAttendanceDict();
			},100)
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
		methods: {
			dialogConfirm(e){  
				this.$refs.alertDialog.close()
				this.getRecord()
			},
			//1.4.学校年级
			getGrd(){
				// let comData={
				// 	is_finish:0,
				// 	index_code:this.index_code,
				// }
				// this.post(this.globaData.INTERFACE_HR_SUB+'grd',comData,response=>{
				//     // console.log("responseaaa: " + JSON.stringify(response));
				// 	let grds = response.list;
				// 	let grdList=[];
				// 	grds.map(function(currentValue) {
				// 		let obj = {};
				// 		obj.value = currentValue.grd_code;
				// 		obj.text = currentValue.grd_name;
				// 		grdList.push(obj)
				// 	})
				// 	if(grdList.length>0 ){
				// 		this.grdList=grdList;
				// 	}else{
				// 		this.showToast('获取年级为空');
				// 	}
				// })
				let comData={
					op_code:'index',
					get_grd:true,
					all_grd: false,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray=[];
					grds.map(function(currentValue) {
						let name=currentValue.name.indexOf('全部')==-1?currentValue.name:'全部年级';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						grdArray.push(obj)
					})
					if(grdArray.length>0 ){
						this.grdList=grdArray;
					}else{ 
						this.grdList=[];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls(grd_id){//获取班级
				let comData={
					op_code:'index',
					grd_code:grd_id,
					get_cls:true,
					all_cls:false,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray=[];
					clss.map(function(currentValue) {
						let obj = {};
						let name=currentValue.name.indexOf('全部')==-1?currentValue.name:'全部班级';
						obj.value = currentValue.value;
						obj.text = name;
						clsArray.push(obj)
					})
					if(clsArray.length>0 ){
						this.clsList=clsArray;
					}else{
						this.clsList=[];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getKm(grd_id,cls_id){//获取科目
				let comData={
					op_code:'index',
					grd_code: grd_id,
					cls_code: cls_id,
					get_sub:true,
					all_sub:false,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let sub = response.sub_list;
					let subList=[];
					sub.map(function(currentValue) {
						let name=currentValue.name.indexOf('全部')==-1?currentValue.name:'全部科目';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						subList.push(obj)
					})
					if(subList.length>0){
						this.kmList=[{text: "请选择",value: "-1"}].concat(subList);
					}else{
						 this.showToast('无数据授权 无法获取科目');
					}
				})
			},
			//1.6.学校班级
			// getCls(grd_id){
			// 	let comData={
			// 		grd_codes:grd_id,
			// 		is_finish:0,
			// 		index_code:this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_HR_SUB+'cls',comData,response=>{
			// 	    // console.log("responseaaa: " + JSON.stringify(response));
			// 		let clss = response.list;
			// 		let clssList=[];
			// 		clss.map(function(currentValue) {
			// 			let obj = {};
			// 			obj.value = currentValue.cls_code;
			// 			obj.text = currentValue.cls_name;
			// 			clssList.push(obj)
			// 		})
			// 		if(clssList.length>0 ){
			// 			this.clsList=clssList;
			// 		}else{
			// 			this.showToast('获取班级为空');
			// 		}
					
			// 	})
			// },
			// //1.11.学校科目
			// getKm(grd_id,cls_id){//获取科目
			// 	let comData={
			// 		index_code:this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_HR_SUB+'sub',comData,response=>{
			// 	    // console.log("responseaaa: " + JSON.stringify(response));
			// 		let sub = response.list;
			// 		let subList = [];
			// 		sub.map(function(currentValue) {
			// 			let obj = {};
			// 			obj.value = currentValue.sub_code;
			// 			obj.text = currentValue.sub_name;
			// 			subList.push(obj)
			// 		})
			// 		if (subList.length > 0) {
			// 			this.kmList = [].concat(subList);
			// 		} else {
			// 			this.kmList=[];
			// 			this.showToast('获取科目为空');
			// 		}
			// 	})
			// },
			grdSelect(e){
				if(this.grdList.length>0){
					if(this.grdIndex!==e.detail.value){
						 this.grdIndex=e.detail.value
						 this.clsIndex=-1
						 this.stuList=[]
						 this.kmIndex=-1
						 this.clsList=[]
						 this.kmList=[]
						this.getCls(this.grdList[e.detail.value].value)
						this.showNext();
					}
				}
			},
			clsSelect(e){
				if(this.clsList.length>0){
					if(this.clsIndex!==e.detail.value){
						 this.clsIndex=e.detail.value
						 this.stuList=[]
						 this.kmIndex=-1
						 this.kmList=[]
						this.getKm(this.grdList[this.grdIndex].value,this.clsList[e.detail.value].value);
						this.showNext();
					}
				}
			},
			jcSelect(e){
				if(this.jcList.length>0){
					if(this.jcIndex!==e.detail.value){
						this.jcIndex=e.detail.value
						this.showNext();
					}
				}
			},
			kmSelect(e){
				if(this.kmList.length>0){
					if(this.kmIndex!==e.detail.value){
						this.kmIndex=e.detail.value
						this.showNext();
					}
				}
			},
			timePicker(){
				this.$refs.timePicker.show()
			},
			timeSelect(e){
				this.time=e
				this.showNext();
			},
			showNext(){
				let show =true
				if(this.grdIndex==-1){
					show=false
				}
				if(this.clsIndex==-1){
					show=false
				}
				if(this.jcIndex==-1){
					show=false
				}
				// if(this.kmIndex==-1){
				// 	show=false
				// }
				if(this.time==''){
					show=false
				}
				this.showNextButton=show
			},
			/**
			    如果日期不是当前日期：查询是否存在考勤记录 (只要数据>0 证明存在考勤记录，需要做提示)
			  									—→获取班级学生
			  									—→获取选择日期对应的学生请假数据
												—→获取出入型设备的识别数据
												—→跳过第二步，直接跳转第三步填写考勤信息
				如果日期是当前日期：  查询是否存在考勤记录
												—→获取班级学生
												—→获取选择日期对应的学生请假数据
												—→获取出入型设备的识别数据
												—→获取定位型设备列表
												—→获取定位型设备的识别数据
												—→跳转到第二步，获取定位型设备的识别数据
												—→跳转到第三步，填写考勤信息
			 */
			nextStep(){
				this.showLoading('正在加载数据...')
				this.getStuList(()=>{
					 this.getStudentAttendance(this.getRecord);//获取几个数据，与学生数据绑定
				});
			},
			async getRecord(){
				let leaveRecordList=[],equRecordList=[],locList=[],cardIdList=[];
				leaveRecordList=await this.getLeaveRecordList();//获取选择日期对应的学生请假数据
				equRecordList=await this.getLeaveEquRecordList();//获取出入型设备的识别数据 
				let today=false
				if(this.time == this.moment().format('YYYY-MM-DD')){
					locList=await this.getLeaveLocList();//获取定位型设备列表
					today=true
				}
				let stuList =this.stuList
				stuList.map(stuItem=>{
					//合并学生与卡ID数据
					// cardIdList.map(cardIdItem=>{
					// 	if(stuItem.value==cardIdItem.uid){
					// 		stuItem.card_id=cardIdItem.card_id
					// 	}
					// })
					if(stuItem.card_id){
						cardIdList.push(stuItem)
					}
					//合并请假数据
					leaveRecordList.map(leaveRecItem=>{
						if(stuItem.value==leaveRecItem.stu_code){
							stuItem.equType='请假记录数据'
							stuItem.item_txt=leaveRecItem.item_txt
							stuItem.item_code=leaveRecItem.item_code
						}
					})
					//合并出入型设备考勤数据
					equRecordList.map(equRecItem=>{
						if(stuItem.value==equRecItem.stu_code){
							if(stuItem.item_code){}else{
								stuItem.equType='出入型设备考勤数据'
								stuItem.item_txt='检测识别'
								stuItem.item_code='**'
							}
						}
					})
				})
				// console.log("stuList: " + JSON.stringify(stuList));
				if(this.attendanceDict.length===0){
					this.showToast('获取考勤常量为空，不能继续添加考勤！')
					return 0
				}
				if(today && locList.length>0 && cardIdList.length>0){//跳转到定位型设备选择列表
					util.openwithData('/pages/schapp_work/ketangAddLocEqu',{
						grd:this.grdList[this.grdIndex],
						cls:this.clsList[this.clsIndex],
						jc:this.jcList[this.jcIndex],
						km:this.kmIndex>=0?this.kmList[this.kmIndex]:'',
						time:this.time,
						attendanceDict:this.attendanceDict,
						locList:locList,
						stuList:stuList,
						historyData:this.historyData,
						index_code:this.index_code,
					})
				}else{//跳转到考勤表单填写页面
					if(!today){
						this.showToast('日期非当日，跳过第二步')
					}else if(locList.length==0){
						this.showToast('暂无定位型设备，跳过第二步')
					}else if(cardIdList.length==0){
						this.showToast('暂无学生卡数据，跳过第二步')
					}
					util.openwithData('/pages/schapp_work/ketangAddStu',{
						grd:this.grdList[this.grdIndex],
						cls:this.clsList[this.clsIndex],
						jc:this.jcList[this.jcIndex],
						km:this.kmIndex>=0?this.kmList[this.kmIndex]:'',
						time:this.time,
						attendanceDict:this.attendanceDict,
						stuList:stuList,
						historyData:this.historyData,
						index_code:this.index_code,
					})
				}
			},
			//获取班级学生 1.8.学校班级学生
			getStuList(callback){
				let comData={
					grd_codes:this.grdList[this.grdIndex].value,
					cls_codes:this.clsList[this.clsIndex].value,
					mtp:8,
					page_size:1,
					page_number:-1,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'stu',comData,response=>{
				    // console.log("responseaaa: " + JSON.stringify(response));
					let stu = response.list;
					let stuList=[]
					stu.map(stuItem=>{
						stuList.push({
							name:stuItem.stu_name,
							sno:stuItem.sno,
							value:stuItem.stu_code,
							card_id:stuItem.card_no?stuItem.card_no:''
						})
					})
					if(stuList.length>0 ){
						this.stuList=stuList;
						if(callback)callback();
					}else{
						this.showToast('获取学生为空');
					}
					
				})
			},
			//查询是否存在考勤记录55
			getStudentAttendance(callback){
				let comData={
					grd_code: this.grdList[this.grdIndex].value,
					cls_code: this.clsList[this.clsIndex].value,
					sub_code: '-1',
					class_node:this.jcList[this.jcIndex].value,
					query_time: this.time,
					page_number: 1, //当前页数
					page_size: 9999999, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/list',comData,response=>{
				    // console.log("StudentAttendance/list: " + JSON.stringify(response));
					if(response.list.length===0){
						if(callback)callback();
					}else{
						this.historyData=true
						this.$refs.alertDialog.open()
					}
				})
			},
			//获取选择日期对应的学生请假数据50
			getLeaveRecordList(){
				return new Promise((res,rej)=>{
					let comData={
						grd_code: this.grdList[this.grdIndex].value,
						cls_code: this.clsList[this.clsIndex].value,
						// query_time:this.time,
						begintime:this.time+' '+this.jcList[this.jcIndex].begintime,
						endtime:this.time+' '+this.jcList[this.jcIndex].endtime,
						item_code:"",
						page_number: 1, //当前页数
						page_size:9999999, //每页记录数
						index_code: this.index_code,
					} 
					this.post(this.globaData.INTERFACE_WORK+'LeaveRecord/list',comData,response=>{
						// console.log("获取选择日期对应的学生请假数据: " + JSON.stringify(response));
						
						res(response.list)
					})
				})
			},
			//获取出入型设备的识别数据114
			getLeaveEquRecordList(){
				return new Promise((res,rej)=>{
					let comData={
						grd_code: this.grdList[this.grdIndex].value,
						cls_code: this.clsList[this.clsIndex].value,
						begintime:this.time,
						endtime:this.time,
						page_number: 1, //当前页数
						page_size:9999999, //每页记录数
						class_node:this.jcList[this.jcIndex].value,
						index_code: this.index_code,
					} 
					this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/cardList',comData,response=>{
						// console.log("获取出入型设备的识别数据: " + JSON.stringify(response));
						
						res(response.list)
					})
				})
			},
			//获取定位型设备列表108
			getLeaveLocList(){
				return new Promise((res,rej)=>{
					let comData={
						location_type:-1,
						mach_type:8,
						pageNumber:1,
						pageSize:9999999,
						index_code: this.index_code,
					} 
					this.post(this.globaData.INTERFACE_WORK+'LocationAttendance/list',comData,response=>{
						// console.log("获取定位型设备列表: " + JSON.stringify(response));
						
						res(response.list)
					})
				})
			},
			//获取考勤 节次 常量 54
			getClassAttendanceDict(){
				return new Promise((res,rej)=>{
					let comData={
						index_code:this.index_code,
					}
					this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/getDict',comData,response=>{
						this.attendanceDict=response.qaArray
						this.jcList=response.timeArray
						this.getClassDict();
					})
				})
			},
			//获取节次常量
			getClassDict(){
					let comData={
						index_code:this.index_code,
					}
					this.post(this.globaData.INTERFACE_WORK+'ClasstimeSchedule/list',comData,response=>{
					    // console.log("responsesabaa: " + JSON.stringify(response));
						
						let classDict=response.timeArray
						let jcList=[]
						classDict.map(item=>{
							if(item.attendance_type=='inClassAttendance'){
								let beginTime='',endTime='';
								if(item.attendance_begintime){
									beginTime=item.attendance_begintime.split(":")[0]+':'+item.attendance_begintime.split(":")[1]
								}
								if(item.attendance_endtime){
									endTime=item.attendance_endtime.split(":")[0]+':'+item.attendance_endtime.split(":")[1]
								}
								this.jcList.map(jcItem=>{
									if(jcItem.value==item.class_node){
										jcItem.text=item.class_node+'（'+beginTime+'-'+endTime+'）'
										jcItem.value=item.class_node
										jcItem.begintime=item.attendance_begintime
										jcItem.endtime=item.attendance_endtime
									}
								})
								// jcList.push({
								// 	text:item.class_node+'（'+beginTime+'-'+endTime+'）',
								// 	value:item.class_node,
								// 	begintime:item.attendance_begintime,
								// 	endtime:item.attendance_endtime
								// })
							}
						})
						// this.jcList=jcList
					})
			}
		},
	}
</script>

<style>
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
</style>
