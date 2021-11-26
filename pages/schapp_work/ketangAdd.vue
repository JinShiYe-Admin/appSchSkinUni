<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">年级</view>
			<picker style="width:100% !important;" mode="selector" @change="grdSelect" :range="grdList" range-key="text">
				<input class="uni-input form-right"  :value="grdIndex>=0?grdList[grdIndex].text:''"  placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">班级</view>
			<picker style="width:100% !important;" mode="selector" @change="clsSelect" :value="clsIndex" :range="clsList" range-key="text">
				<input class="uni-input form-right"  :value="clsIndex>=0?clsList[clsIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">姓名</view>
			<input class="uni-input form-right"  v-model="stuNameList.join(',')" placeholder="请选择" disabled @click="selectStu"/>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">考勤项目</view>
			<picker style="width:100% !important;" mode="selector" @change="xwxxSelect" :value="xwxxIndex" :range="xwxxList" range-key="text">
				<input class="uni-input form-right"  :value="xwxxIndex>=0?xwxxList[xwxxIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">考勤日期</view>
			<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='formData.time'  timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
			<!-- <xp-picker mode="ymd" ref="timePicker" history :animation="false" :year-range='[2020,2030]' @confirm="timeSelect"></xp-picker>
			<input class="uni-input form-right"  v-model="formData.time" placeholder="请选择" disabled @click="timePicker"/> -->
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">节次</view>
			<picker style="width:100% !important;" mode="selector" @change="jcSelect" :value="jcIndex" :range="jcList" range-key="text">
				<input class="uni-input form-right" :value="jcIndex>=0?jcList[jcIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">科目</view>
			<picker style="width:100% !important;" mode="selector" @change="kmSelect" :value="kmIndex" :range="kmList" range-key="text">
				<input class="uni-input form-right"  :value="kmIndex>=0?kmList[kmIndex].text:''" placeholder="请选择" disabled/>
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
				grdIndex:-1,
				clsIndex:-1,
				xwxxIndex:-1,
				jcIndex:-1,
				kmIndex:-1,
				grdList: [], //年级数组
				clsList: [], //班级数组
				stuList:[],
				stuNameList: [], //学生数组
				stuIdList: [], //学生数组
				xwxxList: [], //请假类别数组
				jcList: [], //出入权限数组
				kmList: [], //出入权限数组
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
			itemData.text='新建课堂考勤'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading();
				this.getSmsConfig();
				this.getGrd();
				this.getJcXwxx();
			},100)
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
			getSmsConfig(){//获取短信配置
				let comData={
					msg_type: this.STUKQ_MSG_SMS.INCLS.MSG_TYPE,
					sch_code: this.personInfo.unit_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'smsConf/getConf',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if (response && response.user_types) {
						let config_types=response.user_types.split(",");
						let local_types=this.STUKQ_MSG_SMS.INCLS.USER_TYPE.split(",");
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
			getGrd(){
				let comData={
					op_code:'add',
					get_grd:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					let grds = response.grd_list;
					let grdList=[];
					grds.map(function(currentValue) {
						let obj = {};
						obj.value = currentValue.value;
						obj.text = currentValue.name;
						grdList.push(obj)
					})
					if(grdList.length>0 ){
						this.grdList=grdList;
					}else{
						this.showToast('获取年级为空');
					}
					this.hideLoading()
				})
			},
			getCls(grd_id){
				let comData={
					op_code:'add',
					grd_code:grd_id,
					get_cls:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					let clss = response.cls_list;
					let clssList=[];
					clss.map(function(currentValue) {
						let obj = {};
						obj.value = currentValue.value;
						obj.text = currentValue.name;
						clssList.push(obj)
					})
					if(clssList.length>0 ){
						this.clsList=clssList;
					}else{
						this.showToast('获取班级为空');
					}
					this.hideLoading()
				})
			},
			getStu(grd_id,cls_id){
				let comData={
					op_code:'add',
					grd_code: grd_id,
					cls_code: cls_id,
					get_stu:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					let stu = response.stu_list;
					let stuList=[];
					stu.map(function(currentValue) {
						let obj = {};
						obj.value = currentValue.value;
						obj.text = currentValue.name;
						stuList.push(obj)
					})
					if(stuList.length>0 ){
						this.stuList=stuList;
					}else{
						this.showToast('获取学生为空');
					}
					this.hideLoading()
				})
			},
			getKm(grd_id,cls_id){//获取科目
				let comData={
					op_code:'index',
					grd_code: this.grdList[this.grdIndex].value,
					cls_code: this.clsList[this.clsIndex].value,
					get_sub: true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let sub = response.sub_list;
					let subList = [];
					sub.map(function(currentValue) {
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部科目';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						subList.push(obj)
					})
					if (subList.length > 0) {
						this.kmList = [].concat(subList);
					} else {
						this.kmList=[];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getJcXwxx(){//获取常量 节次和行为细项
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/getDict',comData,response=>{
				    console.log("responsesabaa: " + JSON.stringify(response));
					this.hideLoading()
					this.jcList=[].concat(response.timeArray)
					this.xwxxList =  [].concat(response.qaArray);
				})
			},
			textClick(){//发送请假信息
				if(this.grdIndex==-1){
					this.showToast('请选择年级')
				}else if(this.clsIndex==-1){
					this.showToast('请选择班级')
				}else if(this.stuIdList.length==0){
					this.showToast('请选择学生')
				}else if(this.xwxxIndex==-1){
					this.showToast('请选择考勤项目')
				}else if(this.formData.time==''){
					this.showToast('请选择发生日期')
				}else if(this.jcIndex==-1){
					this.showToast('请选择节次')
				}else if(this.kmIndex==-1){
					this.showToast('请选择科目')
				}else if(this.formData.comment==''){
					this.showToast('请输入说明')
				}else{
					if(this.canSub){
						this.canSub=false
						this.showLoading()
						this.submitData()
					}
				}
			},
			submitData(encNameStr,encAddrStr){
				this.showLoading()
				let smsFlag=0;
				let comm=this.formData.comment
				let comment=comm.replace(/\s+/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
				if(this.SMS){
					smsFlag=1;
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
				let comData={
					grd_code: this.grdList[this.grdIndex].value,
					cls_code: this.clsList[this.clsIndex].value,
					stu_ids: this.stuIdList.join(','),
					item_code: this.xwxxList[this.xwxxIndex].value,
					comment: comment,
					attendance_time: this.formData.time,
					class_node: this.jcList[this.jcIndex].value,
					sub_code:this.kmList[this.kmIndex].value,
					sms_parent_stu_flag:smsFlag,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/saveData',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
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
			},
			grdSelect(e){
				if(this.grdList.length>0){
					if(this.grdIndex!==e.detail.value){
						 this.grdIndex=e.detail.value
						 this.clsIndex=-1
						 this.stuList=[]
						 this.stuNameList= [] 
						 this.stuIdList= [] 
						 this.kmIndex=-1
						 this.clsList=[]
						 this.kmList=[]
						this.getCls(this.grdList[e.detail.value].value)
					}
				}
			},
			clsSelect(e){
				if(this.clsList.length>0){
					if(this.clsIndex!==e.detail.value){
						 this.clsIndex=e.detail.value
						 this.stuList=[]
						 this.stuNameList= [] 
						 this.stuIdList= [] 
						 this.kmIndex=-1
						 this.kmList=[]
						this.getStu(this.grdList[this.grdIndex].value,this.clsList[e.detail.value].value)
						this.getKm(this.grdList[this.grdIndex].value,this.clsList[e.detail.value].value);
					}
				}
			},
			selectStu(e){
				if(this.stuList.length==0){
					this.showToast('当前班级暂无学生')
				}else{
					this.stuList.map(item=>{
						item.checked=false
						this.stuIdList.map(items=>{
							if(items==item.value){
								item.checked=true
							}
						})
					})
					let that =this 
					util.openwithData('/pages/stu_behavior/studentSelect',{stuList:this.stuList},{
						refreshSetPeople(data){//子页面调用父页面需要的方法
							 let stuNameList= []
							 let stuIdList= []
							 data.data.map(item=>{
								 if(item.checked){
									 stuNameList.push(item.text)
									 stuIdList.push(item.value)
								 }
							 })
							 that.stuNameList=stuNameList
							 that.stuIdList=stuIdList
						}
					})
				}
			},
			xwxxSelect(e){
				if(this.xwxxList.length>0){
					if(this.xwxxIndex!==e.detail.value){
						this.xwxxIndex=e.detail.value
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
