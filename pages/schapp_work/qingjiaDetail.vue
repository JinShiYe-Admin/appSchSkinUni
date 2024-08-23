<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick" :text='text' @textClickRight="textClickRight"></mynavBar>
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
				<view class="form-right">{{detailData.stu_name}}{{'('+detailData.sno+')'}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">考勤项目</view>
				<view class="form-right">{{detailData.item_txt}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">说明</view>
				<view class="form-right" style="text-align: left;">{{detailData.comment}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">出入权限</view>
				<view class="form-right">{{detailData.in_out_permission_txt}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">开始时间</view>
				<view class="form-right">{{detailData.begintime}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">结束时间</view>
				<view class="form-right">{{detailData.endtime}}</view>
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
				<view class="uni-input form-right">{{detailData.grd_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view2">
				<view class="form-left">班级</view>
				<view class="uni-input form-right">{{detailData.class_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">姓名</view>
				<picker style="width:100% !important;" mode="selector" @change="stuSelect" :value="stuIndex" :range="stuList" range-key="showText">
					<view class="uni-input form-right">{{stuIndex>=0?stuList[stuIndex].showText:'请选择'}}</view>
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
	let _this;
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				navItem: {},
				detailData:{
					grd_name:"",
					class_name:"",
					stu_name:"",
					attendance_type_txt:"",
					item_code:"",
					comment:'',
					item_txt:"",
					begintime:"",
					endtime:"",
					in_out_permission_code:"",
					in_out_permission_txt:"",
					sno:'',
					create_user_name:''
				},
				icon:'',
				text:'',
				// textClick:this.textClickEvent,
				editStatus:0,//0 展示  1编辑
				
				begintime:'',
				endtime:'',
				stuList:[],//学生数
				stuIndex:-1,
				kqlxIndex:-1,
				crqxIndex:-1,
				kqlxList: [], //考勤类型数组
				crqxList: [], //出入权限数组
				SMS:false,//是否向家长发送短信
				CONFIG:{},//短信配置 对象
				WORDS:[],//拒绝关键字 对象
				SHOW:false,//是否显示发送短信
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
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='请假记录详情'
			this.navItem = itemData;
			this.index_code=itemData.index_code
			console.log("itemData: " + JSON.stringify(itemData));
			this.detailData={
				grd_name:itemData.grd_name,
				class_name:itemData.class_name,
				stu_name:itemData.stu_name,
				item_code:itemData.item_code,
				comment:itemData.comment,
				in_out_permission_code:itemData.in_out_permission_code,
				in_out_permission_txt:itemData.in_out_permission_txt,
				item_txt:itemData.item_txt,
				begintime:itemData.begintime,
				endtime:itemData.endtime,
				sno:itemData.sno,
				create_user_name:itemData.create_user_name,
			}
			this.comment=itemData.comment
			this.begintime=itemData.begintime
			this.endtime=itemData.endtime
			if(itemData.del==1){
				this.icon='trash'
			}
			
			if(itemData.edit==1){
				this.text=['编辑']
			}
			//#ifdef H5
				document.title=""
			//#endif
			let that =this
			setTimeout(function() {
				that.getSmsConfig();
				that.getStu(itemData.grd_code,itemData.cls_code)
				that.getCl()
			}, 100);
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
		methods: {
			iconClick(){
				_this.$refs.alertDialog.open()
			},
			textClickRight(data) {
				// console.log('textClickRight')
				if (_this.text.length==1) {
					// console.log('修改');
					_this.editStatus=1
					_this.icon=''
					_this.text=['取消','保存'],
					// _this.textClick=[_this.cancel,_this.save]
					// console.log(_this.stuList);
					_this.stuList.map((stuItem,index)=>{
						if(stuItem.value==_this.navItem.stu_code){
							_this.stuIndex=index
						}
					})
					_this.kqlxList.map((item,index)=>{
						if(item.value==_this.navItem.item_code){
							_this.kqlxIndex=index
						}
					})
					_this.crqxList.map((item,index)=>{
						if(item.value==_this.navItem.in_out_permission_code){
							_this.crqxIndex=index
						}
					})
				} else{
					if (data == 0) {
						_this.cancel();
					} else if (data == 1) {
						_this.textClick();
					}
				}
			},
			getSmsConfig(){//获取短信配置
				let comData={
					msg_type: this.STUKQ_MSG_SMS.ASKLEAVE.MSG_TYPE,
					sch_code: this.personInfo.unit_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'smsConf/getConf',comData,response=>{
				    //console.log("responseaaa: " + JSON.stringify(response));
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
				    //console.log("responseaaa: " + JSON.stringify(response));
					this.WORDS=response.list
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
				    //console.log("responseaaa: " + JSON.stringify(response));
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
				    //console.log("responseaaaa: " + JSON.stringify(response));
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
				if(_this.stuIndex==-1){
					_this.showToast('请选择学生')
				}else if(_this.kqlxIndex==-1){
					_this.showToast('请选择考勤类型')
				}else if(_this.crqxIndex==-1){
					_this.showToast('请选择出入权限')
				}else if(_this.begintime==''){
					_this.showToast('请选择开始时间')
				}else if(_this.endtime==''){
					_this.showToast('请选择结束时间')
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
					grd_code: this.navItem.grd_code,
					cls_code: this.navItem.cls_code,
					stu_code: this.stuList[this.stuIndex].value,
					item_code: this.kqlxList[this.kqlxIndex].value,
					in_out_permission_code: this.crqxList[this.crqxIndex].value,
					comment: comment,
					begintime: this.begintime,
					endtime: this.endtime,
					sms_parent_stu_flag:smsFlag,
					index_code:this.index_code,
					id:this.navItem.id,
				}
				this.post(this.globaData.INTERFACE_WORK+'LeaveRecord/editSave',comData,(response0,response)=>{
					//console.log("response: " + JSON.stringify(response));
				     if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
				     	 const eventChannel = this.getOpenerEventChannel()
				     	 eventChannel.emit('refreshQingjiaIndex', {data: 1});
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
					//console.log(this.moment(this.endtime).diff(e.value,'minutes'));
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
			cancel(){
				this.text=['编辑']
				this.icon='trash'
				this.editStatus=0
			},
			dialogConfirm(){
				this.showLoading()
				let url=this.globaData.INTERFACE_WORK + 'LeaveRecord/delete'
				let comData={
					id: this.navItem.id,
					index_code:this.index_code,
				}
				this.post(url,comData,response=>{
					this.showToast('操作成功')
					this.hideLoading()
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('refreshQingjiaIndex', {data: 1});
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
