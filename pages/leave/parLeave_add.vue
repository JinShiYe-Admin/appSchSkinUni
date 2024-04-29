<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="提交" :textClick="textClick"></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">开始时间</view>
			<xp-picker mode="ymdhi" ref="beginPicker" history :animation="false" :year-range='[2020,2030]' @confirm="beginTimeSelect"></xp-picker>
			<!-- <input class="uni-input form-right"  v-model="formData.begin_time" placeholder="请选择" disabled @click="beginPicker"/> -->
			<view class="uni-input form-right" @click="beginPicker">{{formData.begin_time.length>0?formData.begin_time:'请选择'}}</view>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">结束时间</view>
			<xp-picker mode="ymdhi" ref="endPicker" history :animation="false" :year-range='[2020,2030]' @confirm="endTimeSelect"></xp-picker>
			<!-- <input class="uni-input form-right"  v-model="formData.end_time" placeholder="请选择" disabled @click="endPicker"/> -->
			<view class="uni-input form-right" @click="endPicker">{{formData.end_time.length>0?formData.end_time:'请选择'}}</view>
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
				<!-- <input class="uni-input form-right"  :value="qjlbIndex>=0?qjlbList[qjlbIndex].text:''"  placeholder="请选择" disabled/> -->
				<view class="uni-input form-right">{{qjlbIndex>=0?qjlbList[qjlbIndex].text:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">出入权限</view>
			<picker style="width:100% !important;" mode="selector" @change="crqxSelect" :value="crqxIndex" :range="crqxList" range-key="text">
				<!-- <input class="uni-input form-right" :value="crqxIndex>=0?crqxList[crqxIndex].text:''" placeholder="请选择" disabled/> -->
				<view class="uni-input form-right">{{crqxIndex>=0?crqxList[crqxIndex].text:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">请假事由</view>
			<textarea placeholder="请输入" v-model="formData.comment" maxlength="100" ></textarea>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">审核人</view>
			<picker style="width:100% !important;" mode="selector" @change="clsTecSelect" :value="clsTecIndex" :range="clsTecList" range-key="text">
				<!-- <input class="uni-input form-right" :value="clsTecIndex>=0?clsTecList[clsTecIndex].text:''" placeholder="请选择" disabled/> -->
				<view class="uni-input form-right">{{clsTecIndex>=0?clsTecList[clsTecIndex].text:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
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
	let _this;
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				navItem: {},
				
				
				canSub:true,
				formData: {
					begin_time:'',//请假开始时间
					end_time:'',//请假结束时间
					diff_times_text:'',//时间差
					diff_times_days:0,//时间差 天
					qjlb:{text:'请选择',value:''},//请假类别选择值
					crqx:{text:'请选择',value:''},//出入权限选择值
					clsTec:{text:'请选择',value:''},
					comment:'',//说明
					copy_list:[],//抄送人选择对象
				}, //表单内容
				qjlbIndex:-1,
				crqxIndex:-1,
				clsTecIndex:-1,
				qjlbList: [{text:'病假',value:'sickLeave'},{text:'事假',value:'absenceLeave'}], //请假类别数组
				crqxList: [{text:'可回宿舍',value:'backDorm'},{text:'可出入校园',value:'outSchool'}], //出入权限数组
				clsTecList:[],//班级任教列表
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
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新建请假申请'
			this.navItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading();
				this.getSmsConfig();
				this.getLeaveFlows()
				this.getClsTec();
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
			getLeaveFlows(){//获取额外审批人
				let comData={
					grd_code:this.personInfo.grd_code,
					cls_code:this.personInfo.cls_code,
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
			getClsTec(){//获取班级任教
				let comData = {
					grd_codes:this.personInfo.grd_code,
					cls_codes:this.personInfo.cls_code,
					uid_stat:1,
					user_stat:1,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'clsTec',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let list =response.list
					if(list.length>0){
						//合并重复人员
						let newList=[]
						list.map(item=>{
							item.value=item.user_code
							item.text=item.user_name
							let push=true
							newList.map(nitem=>{
								if(nitem.value===item.value){//如果新数组中已存在该用户id则不push
									push=false
								}
							})
							if(push){
								newList.push(item)
							}
						})
						this.clsTecList=newList
						let obj={},index=0
						newList.map((item,_index)=>{
							if(item.is_master==1){
								obj=item
								index=_index
							}
						}) 
						if(obj!={}){
							this.formData.clsTec=obj
							this.clsTecIndex=index
						}else{ 
							this.showToast('由于所在班级无班主任，请假申请需要有其他任课老师审核')
						}
					}else{
						this.showToast('班级内没有任教老师信息,你不能继续请假申请')
					}
				})
			},
			textClick(){//发送请假信息
				if(_this.formData.begin_time==''){
					_this.showToast('请选择请假开始时间')
				}else if(_this.formData.end_time==''){
					_this.showToast('请选择请假结束时间')
				}else if(_this.formData.qjlb.value==''){
					_this.showToast('请选择请假类别')
				}else if(_this.formData.crqx.value==''){
					_this.showToast('请选择出入权限')
				}else if(_this.formData.comment==''){
					_this.showToast('请输入请假事由')
				}else{
					if(_this.canSub){
						_this.canSub=false
						_this.showLoading()
						let _approve_list=[{
							approve_user_code:_this.formData.clsTec.value,
							approve_user_name:_this.formData.clsTec.text,
							approve_user_dept_code:'',
							approve_user_dept:'',
						}].concat(_this.approve_list)
						//抄送人
						let _copy_list=[]
						_this.formData.copy_list.map(item=>{
							let copy_obj={
								copy_user_code:item.value,
								copy_user_name:item.text,
							}
							_copy_list.push(copy_obj)
						})
						
						let smsFlag=0;
						let comm=_this.formData.comment
						let comment=comm.replace(/\s+/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
						if(_this.SMS){
							smsFlag=1;
							let showToast=false
							 let words=[]
							 for (var i = 0; i < _this.WORDS.length; i++) {
							 	let word=_this.WORDS[i].word
							 	if(comment.indexOf(word)!==-1){
							 		showToast=true
							 		words.push(word)
							 	}
							 }
							 if(showToast){
							 	_this.showToast('含有禁止使用的关键词	‘'+words.join("/")+'’	请编辑后再尝试发送')
							 	_this.hideLoading()
								_this.canSub=true
							 	return 0
							 }
						}
						
						let comData={
							grd_code:_this.personInfo.grd_code,
							grd_name:_this.personInfo.grd_name,
							cls_code:_this.personInfo.cls_code,
							cls_name:_this.personInfo.cls_name,
							stu_code:_this.personInfo.stu_code,
							stu_name:_this.personInfo.stu_name,
							begin_time:_this.formData.begin_time,
							end_time:_this.formData.end_time,
							apply_time:_this.formData.diff_times_text,
							in_out_permission_code:_this.formData.crqx.value,
							item_code:_this.formData.qjlb.value,
							sms_parent_stu_flag:1,
							comment:comment,
							create_user_code:_this.personInfo.user_code,
							create_user_name:_this.personInfo.user_name,
							approve_list:_approve_list,
							copy_list:_copy_list,
							index_code:_this.index_code,
						}
						_this.post(_this.globaData.STULEAVE_API+'apply/addApply',comData,(response0,response)=>{
						     if (response.code == 0) {
								let that=_this
								that.canSub=true
								that.showToast(response.msg);
								setTimeout(function(){
									const eventChannel = that.getOpenerEventChannel()
									eventChannel.emit('refresh', {data:123});
									uni.navigateBack()
								},1500)
						     } else {
						     	_this.canSub=true
						     	_this.hideLoading()
						     	_this.showToast(response.msg);
						     }
						},()=>{
								_this.canSub=true
						})
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
			clsTecSelect(e){
				if(this.clsTecList.length>0){
					if(this.clsTecIndex!==e.detail.value){
						this.clsTecIndex=e.detail.value
						this.formData.clsTec=this.clsTecList[e.detail.value]
					}
				}
			},
			beginPicker(){
				this.$refs.beginPicker.show()
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
