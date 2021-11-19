<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="提交" :textClick="textClick"></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">年级</view>
			<picker style="width:100% !important;" mode="selector" @change="grdSelect" :range="grdList" range-key="text">
				<input class="uni-input form-right" :value="grdIndex>=0?grdList[grdIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">班级</view>
			<picker style="width:100% !important;" mode="selector" @change="clsSelect" :value="clsIndex" :range="clsList" range-key="text">
				<input class="uni-input form-right"  :value="clsIndex>=0?clsList[clsIndex].text:''"   placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">学生</view>
			<picker style="width:100% !important;" mode="selector" @change="stuSelect" :value="stuIndex" :range="stuList" range-key="text">
				<input class="uni-input form-right"  :value="stuIndex>=0?stuList[stuIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">开始时间</view>
			<xp-picker mode="ymdhi" ref="beginPicker" history :animation="false" :year-range='[2020,2030]' @confirm="beginTimeSelect"></xp-picker>
			<input class="uni-input form-right"  v-model="formData.begin_time" placeholder="请选择" disabled @click="beginPicker"/>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">结束时间</view>
			<xp-picker mode="ymdhi" ref="endPicker" history :animation="false" :year-range='[2020,2030]' @confirm="endTimeSelect"></xp-picker>
			<input class="uni-input form-right"  v-model="formData.end_time" placeholder="请选择" disabled @click="endPicker"/>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">请假时长</view>
			<input class="uni-input form-right"  v-model="formData.diff_times_text"  disabled/>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">请假类别</view>
			<picker style="width:100% !important;" mode="selector" @change="qjlbSelect" :value="qjlbIndex" :range="qjlbList" range-key="text">
				<input class="uni-input form-right"  :value="qjlbIndex>=0?qjlbList[qjlbIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">出入权限</view>
			<picker style="width:100% !important;" mode="selector" @change="crqxSelect" :value="crqxIndex" :range="crqxList" range-key="text">
				<input class="uni-input form-right" :value="crqxIndex>=0?crqxList[crqxIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">请假事由</view>
			<textarea placeholder="请输入" v-model="formData.comment" maxlength="100" ></textarea>
		</view>
		<template v-if="SHOW">
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left" style="width: 300rpx;">是否向家长发送短信</view>
				<switch class="form-right" :checked="SMS" @change="changeAutoplay" color="#00CFBD"/>
			</view>
		</template>
		<template v-if="approve_list.length>0">
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left" style="width: 100%;margin: 5px 0;display: flex;align-items: center;"><view style="width: 80px;">额外审核人</view><view style="font-size: 12px;color: #787878;">(请假天数超过限制，需要额外审核人审核)</view></view>
			</view>
			<view class="line-green"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left-approve">
					<template v-for="(item,index) in approve_list"><template v-if="index < approve_list.length-1">{{item.approve_user_name}} => </template><template v-else>{{item.approve_user_name}}</template></template>
				</view>
			</view>
		</template>
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view" style="justify-content: space-between;height: 40px;">
			<view class="form-left" style="height: 26px;">抄送人</view>
			<uni-icons size="24" type="personadd-filled" color="#00CFBD" @click="addPeople"></uni-icons>
		</view>
		<view class="line-green"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left-approve">
				<template v-for="(item,index) in formData.copy_list"><template v-if="index < formData.copy_list.length-1">{{item.text}},</template><template v-else>{{item.text}}</template></template>
			</view>
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
				
				
				canSub:true,
				formData: {
					grd:{text:'请选择',value:''},//年级选择值
					cls:{text:'请选择',value:''},//班级选择值
					stu:{text:'请选择',value:''},//学生选择值
					begin_time:'',//请假开始时间
					end_time:'',//请假结束时间
					diff_times_text:'',//时间差
					diff_times_days:0,//时间差 天
					qjlb:{text:'请选择',value:''},//请假类别选择值
					crqx:{text:'请选择',value:''},//出入权限选择值
					comment:'',//说明
					copy_list:[],//抄送人选择对象
				}, //表单内容
				grdIndex:-1,
				clsIndex:-1,
				stuIndex:-1,
				qjlbIndex:-1,
				crqxIndex:-1,
				grdList: [], //年级数组
				clsList: [], //班级数组
				stuList: [], //学生数组
				qjlbList: [{text:'病假',value:'sickLeave'},{text:'事假',value:'absenceLeave'}], //请假类别数组
				crqxList: [{text:'可回宿舍',value:'backDorm'},{text:'可出入校园',value:'outSchool'}], //出入权限数组
				approve_rules:[],//额外的审批人规则列表
				approve_list:[],//额外的审批人列表 
				SMS:false,//是否向家长发送短信
				CONFIG:{},//短信配置 对象
				WORDS:[],//拒绝关键字 对象
				SHOW:false,//是否显示发送短信
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新建请假申请'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading();
				this.getSmsConfig();
				this.getGrd();
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			getSmsConfig(){//获取短信配置
				let comData={
					msg_type: this.STUKQ_MSG_SMS.ASKLEAVE_JIAOSHIDAI.MSG_TYPE,
					sch_code: this.personInfo.unit_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'smsConf/getConf',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if (response && response.user_types) {
						let config_types=response.user_types.split(",");
						let local_types=this.STUKQ_MSG_SMS.ASKLEAVE_JIAOSHIDAI.USER_TYPE.split(",");
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
			getLeaveFlows(grd_id,cls_id){//获取额外审批人
				let comData={
					grd_code:grd_id,
					cls_code:cls_id,
					page_number:1,
					page_size:9999,
					index_code:this.index_code,
				}
				this.post(this.globaData.STULEAVE_API+'workflow/qryFlows',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.approve_rules=response.list
					this.hideLoading()
				})
			},
			textClick(){//发送请假信息
				if(this.formData.grd.value==''){
					this.showToast('请选择年级')
				}else if(this.formData.cls.value==''){
					this.showToast('请选择班级')
				}else if(this.formData.stu.value==''){
					this.showToast('请选择请假学生')
				}else if(this.formData.begin_time==''){
					this.showToast('请选择请假开始时间')
				}else if(this.formData.end_time==''){
					this.showToast('请选择请假结束时间')
				}else if(this.formData.qjlb.value==''){
					this.showToast('请选择请假类别')
				}else if(this.formData.crqx.value==''){
					this.showToast('请选择出入权限')
				}else if(this.formData.comment==''){
					this.showToast('请输入请假事由')
				}else{
					if(this.canSub){
						this.canSub=false
						this.showLoading()
						let _approve_list=[{
							approve_user_code:this.personInfo.user_code,
							approve_user_name:this.personInfo.user_name,
							approve_user_dept_code:this.personInfo.dpt_code,
							approve_user_dept:this.personInfo.dpt_name,
						}].concat(this.approve_list)
						//抄送人
						let _copy_list=[]
						this.formData.copy_list.map(item=>{
							let copy_obj={
								copy_user_code:item.value,
								copy_user_name:item.text,
							}
							_copy_list.push(copy_obj)
						})
						
						let smsFlag=0;
						let comm=this.formData.comment
						let comment=comm.replace(/\s+/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
						if(this.SMS){
							smsFlag=1;
							let showToast=false
							 let words=[]
							 for (var i = 0; i < this.WORDS.length; i++) {
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
							grd_code:this.formData.grd.value,
							grd_name:this.formData.grd.text,
							cls_code:this.formData.cls.value,
							cls_name:this.formData.cls.text,
							stu_code:this.formData.stu.value,
							stu_name:this.formData.stu.text,
							begin_time:this.formData.begin_time,
							end_time:this.formData.end_time,
							apply_time:this.formData.diff_times_text,
							in_out_permission_code:this.formData.crqx.value,
							item_code:this.formData.qjlb.value,
							sms_parent_stu_flag:smsFlag,
							comment:comment,
							create_user_code:this.personInfo.user_code,
							create_user_name:this.personInfo.user_name,
							approve_list:_approve_list,
							copy_list:_copy_list,
							index_code:this.index_code,
						}
						this.post(this.globaData.STULEAVE_API+'apply/addApply',comData,(response0,response)=>{
							console.log("response: " + JSON.stringify(response));
						     if (response.code == 0) {
								 let that=this
						     	this.approveLeave(response.data.id,function(){
						     		that.canSub=true
						     		that.showToast(response.msg);
						     		setTimeout(function(){
										const eventChannel = that.getOpenerEventChannel()
										eventChannel.emit('refresh', {data:123});
						     			uni.navigateBack()
						     		},1500)
						     	})
						     } else {
						     	this.canSub=true
						     	this.hideLoading()
						     	this.showToast(response.msg);
						     }
						},()=>{
								this.canSub=true
						})
					}
				}
			},
			approveLeave(_id,callback){//审核发送的请假
				let comData={
					id:_id,
					approve_content:'同意',
					status:1,
					index_code:this.index_code,
				}
				this.post(this.globaData.STULEAVE_API+'apply/setApproveByApply',comData,(response0,response)=>{
				   if (response.code == 0) {
						callback();
				   } else {
						this.canSub=true
						this.hideLoading()
						this.showToast(response.msg);
				   }
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
						 this.formData.grd=this.grdList[e.detail.value]
						 this.formData.cls={text:'请选择',value:''}
						 this.formData.stu={text:'请选择',value:''}
						 this.formData.begin_time=''
						 this.formData.end_time=''
						 this.formData.diff_times_text=''
						 this.formData.diff_times_days=0
							this.getCls(this.grdList[e.detail.value].value)
					}
				}
			},
			clsSelect(e){
				if(this.clsList.length>0){
					if(this.clsIndex!==e.detail.value){
						 this.clsIndex=e.detail.value
						 this.stuIndex=-1
						 this.formData.cls=this.clsList[e.detail.value]
						 this.stuList=[]
						 this.formData.stu={text:'请选择',value:''}
						 this.formData.begin_time=''
						 this.formData.end_time=''
						 this.formData.diff_times_text=''
						 this.formData.diff_times_days=0
						 this.approve_rules=[]
						 this.approve_list=[]
						this.getStu(this.grdList[this.grdIndex].value,this.clsList[e.detail.value].value)
						this.getLeaveFlows(this.grdList[this.grdIndex].value,this.clsList[e.detail.value].value);
					}
				}
			},
			stuSelect(e){
				if(this.stuList.length>0){
					if(this.stuIndex!==e.detail.value){
						this.stuIndex=e.detail.value
						this.formData.stu =this.stuList[e.detail.value]
						this.formData.copy_list=[]
					}
				}
			},
			qjlbSelect(e){
				if(this.qjlbList.length>0){
					if(this.qjlbIndex!==e.detail.value){
						this.qjlbIndex=e.detail.value
						this.formData.qjlb=this.qjlbList[e.detail.value]
					}
				}
			},
			crqxSelect(e){
				if(this.crqxList.length>0){
					if(this.crqxIndex!==e.detail.value){
						this.crqxIndex=e.detail.value
						this.formData.crqx=this.crqxList[e.detail.value]
					}
				}
			},
			changeAutoplay(){
				this.SMS = !this.SMS
			},
			beginPicker(){
				if(this.formData.cls.value){
					this.$refs.beginPicker.show()
				}else{
					this.showToast("当前业务需要先选择“年级”和“班级”")
				}
			},
			endPicker(){
				if(this.formData.begin_time){
					this.$refs.endPicker.show()
				}else{
					this.showToast("请先选择开始时间")
				}
			},
			beginTimeSelect(e){
				this.formData.begin_time=e.value
				this.formData.end_time=''
				this.formData.diff_times_text=''
				this.formData.diff_times_days=0
			},
			endTimeSelect(e){
				let _begin_time=this.formData.begin_time;
				let difftimesFromMinute=this.moment(e.value).diff(this.moment(_begin_time),'minutes')
				let difftimesFromHours=this.moment(e.value).diff(this.moment(_begin_time),'hours')
				let difftimesFromDays=this.moment(e.value).diff(this.moment(_begin_time),'days')
				let difftimesFromMonths=this.moment(e.value).diff(this.moment(_begin_time),'months')
				console.log("difftimesFromMinute: ",difftimesFromMinute);
				if(difftimesFromMinute<10){
					this.showToast('结束时间应晚于开始时间10分钟以上')
				}else if(difftimesFromMinute>=10 && difftimesFromMinute<=1051200){//2年
					this.formData.diff_times_text=''
					this.formData.diff_times_days=0
					if(difftimesFromHours){
						if(difftimesFromDays){
							if(difftimesFromMonths){
								let days=this.moment(e.value).subtract(difftimesFromMonths,'months').diff(this.moment(_begin_time),'days')
								let hours=this.moment(e.value).subtract(difftimesFromMonths,'months').subtract(days,'days').diff(this.moment(_begin_time),'hours')
								let minutes=this.moment(e.value).subtract(difftimesFromMonths,'months').subtract(days,'days').subtract(hours,'hours').diff(this.moment(_begin_time),'minutes')
								this.formData.diff_times_text=difftimesFromMonths+'个月 '+days+'天 '+hours+'小时 '+minutes+'分钟'
								this.formData.diff_times_days=this.moment(e.value).diff(this.moment(_begin_time),'days')
							}else{ 
								let hours=this.moment(e.value).subtract(difftimesFromDays,'days').diff(this.moment(_begin_time),'hours')
								let minutes=this.moment(e.value).subtract(difftimesFromDays,'days').subtract(hours,'hours').diff(this.moment(_begin_time),'minutes')
								this.formData.diff_times_text=difftimesFromDays+'天 '+hours+'小时 '+minutes+'分钟'
								this.formData.diff_times_days=difftimesFromDays
							}
						}else{
							let minutes=this.moment(e.value).subtract(difftimesFromHours,'hours').diff(this.moment(_begin_time),'minutes')
							this.formData.diff_times_text=difftimesFromHours+'小时 '+minutes+'分钟'
						}
					}else{
						this.formData.diff_times_text=difftimesFromMinute+'分钟'
					}
					this.formData.end_time=e.value
				}else{
					this.showToast('请假时间最多不能超过 24 个月')
				}
			},
			addPeople(){
				let that=this
				util.openwithData('/pages/leave/peopleSelect',{index_code:this.index_code,selectPeoples:this.formData.copy_list},{
					setPeople(data){
						that.formData.copy_list=data.data
					}
				})
			},
		},
		watch:{
			formData:{
				 handler(val, oldVal){
					 let approve_list=[];
					 let approve_obj={};
					 let max=0
					 this.approve_rules.map(item=>{
					 	if(val.diff_times_days>=item.max_day && item.max_day>max){
					 		max=item.max_day
					 		approve_obj=item
					 	}
					 })
					 if(approve_obj.approve_list){
					 	approve_obj.approve_list.map(pitem=>{
					 		let approve_obj={
					 			approve_user_code:pitem.approve_user_code,
					 			approve_user_name:pitem.approve_user_name,
					 			approve_user_dept_code:pitem.approve_user_dept_code,
					 			approve_user_dept:pitem.approve_user_dept,
					 		 }
					 		approve_list.push(approve_obj)
					 	})
					 }
					 this.approve_list=approve_list
					 
				 },
				 deep:true //true 深度监听
			}
		}
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
