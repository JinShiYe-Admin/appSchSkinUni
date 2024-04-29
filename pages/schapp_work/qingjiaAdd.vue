<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">年级</view>
			<picker style="width:100% !important;" mode="selector" @change="grdSelect" :value="grdIndex" :range="grdList" range-key="text">
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
			<view class="form-left">姓名</view>
			<picker style="width:100% !important;" mode="selector" @change="stuSelect" :value="stuIndex" :range="stuList" range-key="showText">
				<view class="uni-input form-right">{{stuIndex>=0?stuList[stuIndex].text:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">考勤项目</view>
			<picker style="width:100% !important;" mode="selector" @change="kqlxSelect" :value="kqlxIndex" :range="kqlxList" range-key="text">
				<view class="uni-input form-right">{{kqlxIndex>=0?kqlxList[kqlxIndex].text:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">出入权限</view>
			<picker style="width:100% !important;" mode="selector" @change="crqxSelect" :value="crqxIndex" :range="crqxList" range-key="text">
				<view class="uni-input form-right">{{crqxIndex>=0?crqxList[crqxIndex].text:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">开始时间</view>
			<xp-picker mode="ymdhi" ref="beginTimePicker" history :animation="false" :year-range='[2020,2030]' @confirm="beginTimeSelect"></xp-picker>
			<view class="uni-input form-right" @click="beginTimePicker">{{begintime.length>0?begintime:'请选择'}}</view>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">结束时间</view>
			<xp-picker mode="ymdhi" ref="endTimePicker" history :animation="false" :year-range='[2020,2030]' @confirm="endTimeSelect"></xp-picker>
			<view class="uni-input form-right" @click="endTimePicker">{{endtime.length>0?endtime:'请选择'}}</view>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">说明</view>
			<textarea placeholder="请输入" v-model="comment" maxlength="100" ></textarea>
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
	let _this;
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				navItem: {},
				
				canSub:true,
				begintime:'',
				endtime:'',
				comment:'',//说明
				grdIndex:-1,
				clsIndex:-1,
				stuIndex:-1,
				kqlxIndex:-1,
				crqxIndex:-1,
				grdList: [], //年级数组
				clsList: [], //班级数组
				stuList:[],
				kqlxList: [], //考勤类型数组
				crqxList: [], //出入权限数组
				SMS:false,//是否向家长发送短信
				CONFIG:{},//短信配置 对象
				WORDS:[],//拒绝关键字 对象
				SHOW:false,//是否显示发送短信
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='添加请假记录'
			this.navItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading();
				this.getSmsConfig();
				this.getGrd();
				this.getCl();
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
			getSmsConfig(){//获取短信配置
				let comData={
					msg_type: this.STUKQ_MSG_SMS.ASKLEAVE.MSG_TYPE,
					sch_code: this.personInfo.unit_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'smsConf/getConf',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if (response && response.user_types) {
						let config_types=response.user_types.split(",");
						let local_types=this.STUKQ_MSG_SMS.ASKLEAVE.USER_TYPE.split(",");
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
						obj.showText = currentValue.sno!=null&&currentValue.sno.length>0?currentValue.name+'（'+currentValue.sno+'）':currentValue.name;
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
			getCl(){//获取常量
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'LeaveRecord/getDict',comData,response=>{
				    console.log("responseaaaa: " + JSON.stringify(response));
					this.hideLoading()
					let kqlxList = [].concat(response.qaArray);
					let crqxList=[].concat(response.inOutPermissionArray)
					
					if(kqlxList.length==0 || crqxList.length==0){
						this.showToast('无法获取考勤项目');
					}else{
						this.kqlxList = kqlxList
						this.crqxList = crqxList
					}
				})
			},
			textClick(){//发送请假信息
				if(_this.grdIndex==-1){
					_this.showToast('请选择年级')
				}else if(_this.clsIndex==-1){
					_this.showToast('请选择班级')
				}else if(_this.stuIndex==-1){
					_this.showToast('请选择学生')
				}else if(_this.kqlxIndex==-1){
					_this.showToast('请选择考勤类型')
				}else if(_this.crqxIndex==-1){
					_this.showToast('请选择出入权限')
				}else if(_this.begintime==''){
					_this.showToast('请选择开始时间')
				}else if(_this.endtime==''){
					_this.showToast('请选择结束时间')
				}else if(_this.comment==''){
					_this.showToast('请输入行为说明')
				}else{
					if(_this.canSub){
						_this.canSub=false
						_this.submitData()
					}
				}
			},
			submitData(){
				this.showLoading()
				let smsFlag=0;
				let comm=this.comment
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
					stu_code: this.stuList[this.stuIndex].value,
					item_code: this.kqlxList[this.kqlxIndex].value,
					in_out_permission_code: this.crqxList[this.crqxIndex].value,
					comment: comment,
					begintime: this.begintime,
					endtime: this.endtime,
					sms_parent_stu_flag:smsFlag,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'LeaveRecord/save',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
				     if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
				     	 const eventChannel = this.getOpenerEventChannel()
				     	 eventChannel.emit('refreshQingjia', {data: 1});
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
						 this.stuIndex=-1
						 this.clsList=[]
						 this.stuList=[]
							this.getCls(this.grdList[e.detail.value].value)
					}
				}
			},
			clsSelect(e){
				if(this.clsList.length>0){
					if(this.clsIndex!==e.detail.value){
						 this.clsIndex=e.detail.value
						 this.stuList=[]
						 this.stuIndex=-1
						 this.getStu(this.grdList[this.grdIndex].value,this.clsList[e.detail.value].value)
					}
				}
			},
			stuSelect(e){
				if(this.stuList.length>0){
					if(this.stuIndex!==e.detail.value){
						 this.stuIndex=e.detail.value
					}
				}
				
			},
			kqlxSelect(e){
				if(this.kqlxList.length>0){
					if(this.kqlxIndex!==e.detail.value){
						this.kqlxIndex=e.detail.value
					}
				}
			},
			crqxSelect(e){
				if(this.crqxList.length>0){
					if(this.crqxIndex!==e.detail.value){
						this.crqxIndex=e.detail.value
					}
				}
			},
			changeAutoplay(){
				this.SMS = !this.SMS
			},
			beginTimePicker(){
				this.$refs.beginTimePicker.show()
			},
			beginTimeSelect(e){
				if(this.endtime){
					console.log(this.moment(this.endtime).diff(e.value,'minutes'));
					if(this.moment(this.endtime).diff(e.value,'minutes')>=0){
						this.begintime=e.value
					}else{
						this.showToast('开始时间不能晚于结束时间')
						this.begintime=''
					}
				}else{
					this.begintime=e.value
				}
			},
			endTimePicker(){
				this.$refs.endTimePicker.show()
			},
			endTimeSelect(e){
				if(this.begintime){
					if(this.moment(e.value).diff(this.begintime,'minutes')>=0){
						this.endtime=e.value
					}else{
						this.showToast('结束时间不能早于开始时间')
						this.endtime=''
					}
				}else{
					this.endtime=e.value
				}
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
