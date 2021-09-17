<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
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
			<view class="form-left">床位号</view>
			<input class="uni-input form-right"  v-model="bedNameList.join(',')" placeholder="请选择" disabled @click="selectBed"/>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">宿舍行为</view>
			<picker style="width:100% !important;" mode="selector" @change="attendanceSelect" :value="attendanceIndex" :range="attendanceList" range-key="text">
				<input class="uni-input form-right"  :value="attendanceIndex>=0?attendanceList[attendanceIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">日期</view>
			<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='formData.time'  timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">休息时间</view>
			<picker style="width:100% !important;" mode="selector" @change="restTimeSelect" :value="restTimeIndex" :range="restTimeList" range-key="text">
				<input class="uni-input form-right"  :value="restTimeIndex>=0?restTimeList[restTimeIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">说明</view>
			<textarea placeholder="请输入" v-model="formData.comment" maxlength="100" ></textarea>
		</view>
		<template v-if="SHOW">
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left" style="width: 300rpx;">是否发送短信</view>
				<switch class="form-right" :checked="SMS" @change="changeAutoplay" color="#00CFBD"/>
			</view>
		</template>
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
				
				canSub:true,
				formData: {
					time:'',//发生日期
					comment:'',//说明
				}, //表单内容
				buildIndex:-1,
				floorIndex:-1,
				dormIndex:-1,
				attendanceIndex:-1,
				restTimeIndex:-1,
				
				build_floor_list: [], //楼房和楼层总数组
				buildList: [], 
				floorList: [], 
				dormList: [], 
				bedList:[],
				bedNameList: [],
				bedIdList: [], 
				attendanceList: [], 
				restTimeList: [], 
				SMS:false,//是否向家长发送短信
				CONFIG:{},//短信配置 对象
				WORDS:[],//拒绝关键字 对象
				SHOW:false,//是否显示发送短信
				
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD'),
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新建宿舍行为'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading();
				this.getSmsConfig();
				this.getBuildingList();
				this.getDict();
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			getSmsConfig(){//获取短信配置
				let comData={
					msg_type: this.ACTION_MSG_SMS.CLSBEHAVIOR.MSG_TYPE,
					sch_code: this.personInfo.unit_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'smsConf/getConf',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if (response && response.user_types) {
						let config_types=response.user_types.split(",");
						let local_types=this.ACTION_MSG_SMS.CLSBEHAVIOR.USER_TYPE.split(",");
						let send=false;
						config_types.map(citem=>{
							local_types.map(litem=>{
								if(citem==litem){
									send=true
								}
							})
						})
						this.SHOW=send
						this.CONFIG=response
						this.getSmsWords();
					} else {
						this.SHOW=false
					}
					this.hideLoading()
				})
			},
			getSmsWords(){//获取拒绝词
				let comData={
					page_size: 100000,
					page_number: 1,
					status: 1,
					keyword: '',
					type: 2,//1敏感词 2拒绝词
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'smsWords/page',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.WORDS=response.list
					this.hideLoading()
				})
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
			getDict(){//获取考勤常量
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dormBehavior/getDict',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.attendanceList=response.item_array
					let rest_array=response.rest_array
					let rest=[]
					rest_array.map(function(item){
						 let obj={}
						 obj.text=item.label
						 obj.value=item.v
						 rest.push(obj)
					})
					this.restTimeList=rest;
				})
			},
			textClick(){//发送请假信息
				if(this.buildIndex==-1){
					this.showToast('请选择楼房')
				}else if(this.floorIndex==-1){
					this.showToast('请选择楼层')
				}else if(this.dormIndex==-1){
					this.showToast('请选择房间')
				}else if(this.bedIdList.length==0){
					this.showToast('请选择床位')
				}else if(this.attendanceIndex==-1){
					this.showToast('请选择考勤项目')
				}else if(this.formData.time==''){
					this.showToast('请选择日期')
				}else if(this.restTimeIndex==-1){
					this.showToast('请选择休息时间')
				}else{
					if(this.canSub){
						this.canSub=false
						let comm=this.formData.comment
						let comment=comm.replace(/\s+/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
						if(this.SMS){
							let showToast=false
							 let words=[]
							 for (let i = 0; i < this.WORDS.length; i++) {
							 	let word=this.WORDS[i].word
							 	if(comment.indexOf(word)!==-1){
							 		showToast=true
							 		words.push(word)
							 	}
							 }
							 if(showToast){
							 	this.showToast('含有禁止使用的关键词	‘'+words.join("/")+'’	请编辑后再尝试发送')
							 	this.hideLoading()
								this.canSub=true
							 	return 0
							 }
						}
						this.submitData();
					}
				}
			},
			submitData(){
				this.showLoading()
				let smsFlag=0;
				if(this.SMS){
					smsFlag=1
				}
				let comm=this.formData.comment
				let comment=comm.replace(/\s+/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
				let comData={
					attendance_date:this.formData.time,
					bed_nums:this.bedIdList.join(","),
					dorm_name:this.buildList[this.buildIndex].value,
					floor_num:''+this.floorList[this.floorIndex].value,
					item_name:this.attendanceList[this.attendanceIndex].value,
					register_type:'room',
					remark:comment,
					rest_code:this.restTimeList[this.restTimeIndex].value, 
					room_name:this.dormList[this.dormIndex].value,
					sms_parent_stu_flag:smsFlag,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dormBehavior/add',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
				     if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
				     	 const eventChannel = this.getOpenerEventChannel()
				     	 eventChannel.emit('refreshByAdd', {data: 1});
				     	 uni.navigateBack();
				     } else {
				     	this.canSub=true
				     	this.hideLoading()
				     	this.showToast(response.msg);
				     }
				},()=>{
						this.canSub=true
				})
			},
			buildSelect(e){
				if(this.buildList.length>0){
					if(this.buildIndex!==e.detail.value){
						 this.buildIndex=e.detail.value
						 this.floorIndex=-1
						 this.dormIndex=-1
						 this.dormList=[]
						 this.bedList=[]
						 this.bedNameList= [] 
						 this.bedIdList= [] 
						this.getFloorList(this.buildList[e.detail.value].value)
					}
				}
			},
			floorSelect(e){
				if(this.floorList.length>0){
					if(this.floorIndex!==e.detail.value){
						 this.floorIndex=e.detail.value
						 this.dormIndex=-1
						 this.dormList=[]
						 this.bedList=[]
						 this.bedNameList= [] 
						 this.bedIdList= [] 
						this.getDormList(this.buildList[this.buildIndex].value,this.floorList[e.detail.value].value)
					}
				}
			},
			dormSelect(e){
				if(this.dormList.length>0){
					if(this.dormIndex!==e.detail.value){
						 this.dormIndex=e.detail.value
						 this.bedList=[]
						 this.bedNameList= [] 
						 this.bedIdList= [] 
						 this.bedList=this.dormList[e.detail.value].bed_array
					}
				}
			},
			selectBed(e){
				console.log("this.bedList: " + JSON.stringify(this.bedList));
				if(this.bedList.length==0){
					this.showToast('当前房间暂无床位')
				}else{
					this.bedList.map(item=>{
						item.checked=false
						this.bedIdList.map(items=>{
							if(items==item.value){
								item.checked=true
							}
						})
					})
					let that =this 
					util.openwithData('/pages/stu_dorm/bedSelect',{bedList:this.bedList},{
						refreshSetPeople(data){//子页面调用父页面需要的方法
						console.log("data: " + JSON.stringify(data));
							 let bedNameList= []
							 let bedIdList= []
							 data.data.map(item=>{
								 if(item.checked){
									 bedNameList.push(item.text)
									 bedIdList.push(item.value)
								 }
							 })
							 that.bedNameList=bedNameList
							 that.bedIdList=bedIdList
						}
					})
				}
			},
			attendanceSelect(e){
				if(this.attendanceList.length>0){
					if(this.attendanceIndex!==e.detail.value){
						this.attendanceIndex=e.detail.value
					}
				}
			},
			restTimeSelect(e){
				if(this.restTimeList.length>0){
					if(this.restTimeIndex!==e.detail.value){
						this.restTimeIndex=e.detail.value
					}
				}
			},
			changeAutoplay(){
				this.SMS = !this.SMS
			},
			timePicker(){
				this.$refs.timePicker.show()
			},
			timeSelect(e){
				this.formData.time=e
			},
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
</style>
