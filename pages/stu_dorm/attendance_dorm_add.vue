<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<uni-notice-bar :single="true" text="第一步:请选择宿舍信息!" />
		<view class="uni-flex uni-row form-view">
			<view class="form-left">楼房</view>
			<picker style="width:100% !important;" mode="selector" @change="buildSelect" :value="buildIndex" :range="buildList" range-key="text">
				<input class="uni-input form-right"  :value="buildIndex>=0?buildList[buildIndex].text:''"  placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">楼层</view>
			<picker style="width:100% !important;" mode="selector" @change="floorSelect" :value="floorIndex" :range="floorList" range-key="text">
				<input class="uni-input form-right"  :value="floorIndex>=0?floorList[floorIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">房间</view>
			<picker style="width:100% !important;" mode="selector" @change="dormSelect" :value="dormIndex" :range="dormList" range-key="text">
				<input class="uni-input form-right"  :value="dormIndex>=0?dormList[dormIndex].text:''"  placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">日期</view>
			<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='time'  timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">午/晚休</view>
			<picker style="width:100% !important;" mode="selector" @change="qaSelect" :value="qaIndex" :range="qaArray" range-key="text">
				<input class="uni-input form-right"  :value="qaIndex>=0?qaArray[qaIndex].text:''" placeholder="请选择" disabled/>
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
				tabBarItem: {},
				
				
				time:'',//发生日期
				buildIndex:-1,
				floorIndex:-1,
				dormIndex:-1,
				qaIndex:-1,
				build_floor_list: [], //楼房和楼层总数组
				buildList: [], 
				floorList: [], 
				dormList: [], 
				qaArray:[],//午晚休数组
				stuList:[],//选择的宿舍 床位对应的学生
				grds:[],//选择的宿舍 床位对应的学生所在的年级数组
				cls:[],//选择的宿舍 床位对应的学生所在的班级数组
				attendanceList:[],//考勤项目数组
				locList:[],//宿舍的定位型设备数组
				cardIdList:[],//卡ID数组
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD'),
				showNextButton:false,
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
			itemData.text='宿舍点名登记'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			let that =this
			setTimeout(function() {
				that.showLoading();
				that.getBuildingList();
				that.getDict();
			}, 100);
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
			dialogConfirm(e){
				this.$refs.alertDialog.close()
				this.getCardId()
			},
			getBuildingList(){//获取宿舍楼号和楼层数组
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dorm/queryDorm',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let list =response.list
					if(list.length>0){
						 this.build_floor_list=list
						 let buildingList=[]
						 list.map(function(item){
							 let obj={}
							 obj.text=item.text,
							 obj.value=item.value,
							 buildingList.push(obj)
						 })
						 this.buildList=buildingList;
					}else{
						 this.showToast('无法获取楼号数据');
					}
				})
			},
			getFloorList(building){//根据宿舍楼号获取楼层
				let list=this.build_floor_list
				let floorList=[]
				list.map(function(item){
				  if(building==item.value){
					  let array=item.floor_array
					  array.map(function(item){
						  if((item.text+'').indexOf('层')==-1){
							  item.text=item.text+'层'
						  }
					  })
					  floorList=array
				  }
				})
				this.floorList=floorList
				this.hideLoading()
			},
			getDormList(building,floor){//根据宿舍楼号、楼层获取宿舍
				let comData={
					dorm_name:building,
					floor_num:floor,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dorm/queryRoom',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.dormList=response.list
				})
			},
			getDict(){//获取考勤项目常量
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dormAttendance/getDict',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.attendanceList=response.item_array
					// this.attendanceList=[{text:'晚休缺勤',value:'晚休缺勤'}]
					let rest_array=response.rest_array
					let rest=[]
					rest_array.map(function(item){
						 let obj={}
						 obj.text=item.label
						 obj.value=item.v
						 rest.push(obj)
					})
					this.qaArray=rest;
				})
			},
			buildSelect(e){
				if(this.buildList.length>0){
					if(this.buildIndex!==e.detail.value){
						 this.buildIndex=e.detail.value
						 this.floorIndex=-1
						 this.dormIndex=-1
						 this.dormList=[]
						this.getFloorList(this.buildList[e.detail.value].value)
						this.showNext();
					}
				}
			},
			floorSelect(e){
				if(this.floorList.length>0){
					if(this.floorIndex!==e.detail.value){
						 this.floorIndex=e.detail.value
						 this.dormIndex=-1
						 this.dormList=[]
						this.getDormList(this.buildList[this.buildIndex].value,this.floorList[e.detail.value].value)
						this.showNext();
					}
				}
			},
			dormSelect(e){
				if(this.dormList.length>0){
					if(this.dormIndex!==e.detail.value){
						 this.dormIndex=e.detail.value
						 this.showNext();
					}
				}
			},
			qaSelect(e){
				if(this.qaArray.length>0){
					if(this.qaIndex!==e.detail.value){
						this.qaIndex=e.detail.value
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
				if(this.buildIndex==-1){
					show=false
				}
				if(this.floorIndex==-1){
					show=false
				}
				if(this.dormIndex==-1){
					show=false
				}
				if(this.qaIndex==-1){
					show=false
				}
				this.showNextButton=show
			},
			/**
			    如果日期不是当前日期：查询是否存在考勤记录
			  									—→获取床位对应的学生
												—→获取学生对应的卡ID
			  									—→获取选择日期对应的学生请假数据
			  									—→跳过第二步，直接跳转第三步填写考勤信息
				如果日期是当前日期：  查询是否存在考勤记录
												—→获取床位对应的学生
												—→获取学生对应的卡ID
												—→获取选择日期对应的学生请假数据
												—→获取定位型设备列表
												—→跳转到第二步，获取定位型设备的识别数据
												—→跳转到第三步，填写考勤信息
			 */
			nextStep(){
				this.showLoading('正在加载数据...')
				this.getStuList()
			},
			//获取床位对应的学生
			getStuList(){
				const params = {
					page_number: 1, //当前页数
					page_size: 9999, //每页记录数
					dorm_name:this.buildList[this.buildIndex].value,
					floor_num:this.floorList[this.floorIndex].value,
					room_name:this.dormList[this.dormIndex].value,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'stuDorm/pageRoomDetail',params,response2=>{
					console.log("response2: " + JSON.stringify(response2));
					this.hideLoading()
					if (response2.list.length == 0) {
						this.showToast('宿舍暂无学生！');
					}else{
						this.stuList=response2.list
						let grdCodes=new Map(),clsCodes=new Map(),grds=[],cls=[]
						response2.list.forEach(item=>{
							grdCodes.set(item['grd_code'],'')
							clsCodes.set(item['cls_code'],'')
						})
						grdCodes.forEach((value,key)=>{grds.push(key)})
						clsCodes.forEach((value,key)=>{cls.push(key)})
						this.getCardId()
						this.grds=grds
						this.cls=cls
						this.getStudentAttendance();
					}
				})
			},
			//获取这几个学生是否有对应的宿舍考勤记录 72
			getStudentAttendance(){
				let comData={
					begintime:this.time,
					endtime:this.time,
					stu_code:'-1',
					cls_code:'-1',
					grd_code:'-1',
					page_number: 1, //当前页数
					page_size: 9999999, //每页记录数
					dorm_name:this.buildList[this.buildIndex].value,
					floor_num:this.floorList[this.floorIndex].value,
					room_name:this.dormList[this.dormIndex].value,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM.substring(0,this.globaData.INTERFACE_DORM.length-4)+'dormAttendance/page',comData,response=>{
				    console.log("dormAttendance/page: " + JSON.stringify(response));
					if(response.list.length===0){
						this.getCardId()
					}else{
						this.historyData=true
						this.$refs.alertDialog.open()
					}
				})
			},
			//获取学生对应的卡ID
			getCardId(grds,cls){
				let comData={
					grd_codes:this.grds.join(','),
					cls_codes:this.cls.join(','),
					mtp:8,
					page_size:1,
					page_number:-1,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'stu',comData,response=>{
					console.log("responseaaa: " + JSON.stringify(response));
					let stu = response.list;
					let stuList=this.stuList
					let cardIdList=[]
					stu.map(stuItem=>{
						stuList.map(item=>{
							if(stuItem.grd_code==item.grd_code  && stuItem.cls_code==item.cls_code && stuItem.stu_code==item.stu_code){
								item.card_id=stuItem.card_no?stuItem.card_no:''
								if(stuItem.card_no){
									cardIdList.push(stuItem.card_no)
								}
							}
						})
					})
					this.cardIdList=cardIdList
					this.getLeaveRecordList()
				})
			},
			//获取选择日期对应的学生请假数据50
			getLeaveRecordList(){
					let comData={
						grd_code: -1,
						cls_code: -1,
						query_time:this.time,
						item_code:"",
						page_number: 1, //当前页数
						page_size:9999999, //每页记录数
						index_code: this.index_code,
					} 
					this.post(this.globaData.INTERFACE_WORK+'LeaveRecord/list',comData,response=>{
						console.log("获取选择日期对应的学生请假数据: " + JSON.stringify(response));
						let stuList=this.stuList
						stuList.map(item=>{
							response.list.map(litem=>{
								if(litem.grd_code==item.grd_code  && litem.cls_code==item.cls_code && litem.stu_code==item.stu_code){
									item.equType='请假记录数据'
									item.item_txt=litem.item_txt
									item.item_code=litem.item_code
								}
							})
						})
						this.getLeaveLocList()
					})
			},
			//获取定位型设备列表108
			getLeaveLocList(){
				let comData={
					mach_type:8,
					index_code: this.index_code,
				} 
				this.post(this.globaData.INTERFACE_WORK+'LocationAttendance/list',comData,response=>{
					console.log("获取定位型设备列表: " + JSON.stringify(response));
					let locList=[]
					response.list.map(item=>{
						if(item.location_type==2){
							locList.push(item)
						}
					})
					this.locList = locList
					this.toPage();
				})
			},
			//跳转页面
			toPage(){
				let today=false
				if(this.time == this.moment().format('YYYY-MM-DD')){
					today=true
				}
				let cardIdList=this.cardIdList
				let locList=this.locList
				this.hideLoading()
				if(this.attendanceList.length===0){
					this.showToast('获取考勤常量为空，不能继续添加考勤！')
					return 0
				}
				if(today && cardIdList.length>0 && locList.length>0){//跳转到定位型设备选择列表
					this.toTwoStep()
				}else{
					if(!today){
						this.showToast('日期非当日，跳过第二步')
					}else if(locList.length==0){
						this.showToast('暂无定位型设备，跳过第二步')
					}else if(cardIdList.length==0){
						this.showToast('暂无学生卡数据，跳过第二步')
					}
					this.toThreeStep()
				}
			},
			toTwoStep(){
				util.openwithData('/pages/stu_dorm/attendance_dorm_add_locequ',{
					build:this.buildList[this.buildIndex],
					floor:this.floorList[this.floorIndex],
					dorm:this.dormList[this.dormIndex],
					qa:this.qaArray[this.qaIndex],
					time:this.time,
					stuList:this.stuList,
					locList:this.locList,
					attendanceList:this.attendanceList,
					historyData:this.historyData,
					index_code:this.index_code,
				})
			},
			toThreeStep(){
				let endTime=new this.moment().format('HH:mm:ss')
				let beginTime=new this.moment(this.tabBarItem.time+' '+endTime).subtract(this.globaData.INTERFACE_DORM_ATTENDANCE_ADVANCETIME,'minutes').format('HH:mm:ss');
				util.openwithData('/pages/stu_dorm/attendance_dorm_add_stu',{//跳转到考勤表单填写页面
					build:this.buildList[this.buildIndex],
					floor:this.floorList[this.floorIndex],
					dorm:this.dormList[this.dormIndex],
					qa:this.qaArray[this.qaIndex],
					time:this.time,
					stuList:this.stuList,
					locList:this.locList,
					historyData:this.historyData,
					attendanceList:this.attendanceList,
					beginTime:beginTime,
					endTime:endTime,
					index_code:this.index_code,
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
