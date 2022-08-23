<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="确定" :textClick="textClick" :icon="icon" :iconClick="iconClick"></mynavBar>
		<uni-notice-bar :single="true" :text="SMSText"/>
		<view class="uni-flex uni-row form-view">
			<textarea placeholder="请输入通知内容,最多300字" v-model="comment" maxlength="300" style="flex: 1;"></textarea>
		</view>
		<template v-if="SHOW">
			<view class="line"></view>
			<view class="uni-flex uni-row form-view" style="padding:0 10px;">
				<view class="form-left" style="width: 300rpx;">同步发送短信</view>
				<switch class="form-right" :checked="SMS" @change="changeAutoplay" color="#00CFBD"/>
			</view>
			<view v-if="SMS" class="uni-flex uni-row form-view" style="padding:0 10px;margin-top: 10px;">
				<view class="form-left" style="width: 300rpx;">添加签名</view>
				<switch class="form-right" :checked="SIGN" @change="changeSign" color="#00CFBD"/>
			</view>
			<view v-if="SMS" class="form-right" style="padding-right:15px;margin-top: 10px;">{{delay_time_str}}</view>
		</template>
		<view class="uni-flex uni-row form-view" style="padding:0 10px;margin-top: 10px;">
			<view class="form-left" style="font-size: 14px;height: 30px;">接收人</view>
			<view class="form-right" style="margin-right: 10px;" @click="selectPeople">
				<uni-icons type="personadd-filled" color="#00CFBD" size="21"></uni-icons>
			</view>
		</view>
		<view class="line-green"></view>
		<view class="uni-flex uni-row form-view"  style="padding:5px 10px 0;">
			<view style="font-size: 13px;color: #787878;">{{(selectDatas.map(item=>item.name)).join('，')}}</view>
		</view>
		<!-- #ifdef H5 -->
			<uni-popup ref="popup" background-color="#fff" style="margin-top: 44px;">
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
			<uni-popup ref="popup" background-color="#fff" style="margin-top: 70px !important;">
		<!-- #endif -->
			<view class="popup-content">
				<view class="text" @click="checkNow">
				 <text>即时发送</text>
				 <uni-icons v-show="nowIcon" type="circle-filled" color="#00CFBD" size="17"></uni-icons>
				</view>
				<view class="line2"></view>
				<view class="text"  @click="checkDelay">
					<text>延时发送</text>
					<picker v-show="delayIcon" mode="multiSelector" ref="picker" @change="valueChange" :value="multiIndex" :range="multiArray">
						<view class="uni-input">{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}<uni-icons style="margin-left: 5px;" type="compose" color="#00CFBD" size="16"></uni-icons></view>
					</picker>
					<uni-icons v-show="delayIcon" type="circle-filled" color="#00CFBD" size="17"></uni-icons>
				</view>
			</view>
		</uni-popup>
	</view>
</template> 

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	const leftArray=[],centerArray=[],rightArray=[];
	for (var i = 0; i < 32; i++) {
		leftArray.push(i+'天')
	}
	for (var i = 0; i < 24; i++) {
		centerArray.push(i+'小时')
	}
	for (var i = 1; i < 60; i++) {
		rightArray.push(i+'分钟')
	}
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				navItem: {},
				icon:'',
				canSub:true,
				nowIcon:true,
				delayIcon:false,
				is_delay:0,
				delay_time_str:'立即发送',
				multiArray: [//多列选择器内容
					leftArray,
					centerArray,
					rightArray
				],
				SMSText:'未成功获取短信发生配置，当前仅可发送家校互动信息',
				multiIndex: [0, 0, 4],//多列选择器初始值
				comment:'',//内容
				SHOW:false,//是否显示发送短信
				SMS:false,//是否向家长发送短信
				SIGN:false,//是否签名
				CONFIG:{},//短信配置 对象
				WORDS:[],//拒绝关键字 对象
				
				selectDatas:[],
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
			itemData.text='新建年级通知'
			this.navItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading();
				this.getSmsConfig();
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
			selectPeople(){//选择接收人
				let data={
					index_code:this.index_code,
					selectDatas:this.selectDatas,
					dataFlag:1,
					serviced:JSON.stringify(this.CONFIG)==='{}'?'1':this.CONFIG.serviced,
				}
				let that =this
				util.openwithData('/pages/schhome/selectGrdClsStu',data,{
					refreshSetPeople(data){//子页面调用父页面需要的方法
					console.log("data: " + JSON.stringify(data));
						that.selectDatas=data.data
					}
				})
			},
			valueChange(e){
				this.multiIndex= e.detail.value
				let day=parseInt(this.multiArray[0][this.multiIndex[0]])?this.multiArray[0][this.multiIndex[0]]+'，':''
				let hour=parseInt(this.multiArray[1][this.multiIndex[1]])?this.multiArray[1][this.multiIndex[1]]+'，':''
				let minute=this.multiArray[2][this.multiIndex[2]]
				this.delay_time_str=day+hour+minute+' 后发送'
				this.$refs.popup.close()
				this.$forceUpdate()
			},
			iconClick(){
				_this.$refs.popup.open('top')
			},
			checkNow(){//popup 发送时间
				this.nowIcon=true
				this.delayIcon=false
				this.is_delay=0
				this.delay_time_str='立即发送'
				this.$refs.popup.close()
			},
			checkDelay(){//popup 发送时间
				this.nowIcon=false
				this.delayIcon=true
				this.is_delay=1
				this.delay_time_str='5分钟 后发送'
			},
			getSmsConfig(){//获取短信配置
				let comData={
					msg_type: this.MSG_SMS.GRADE.MSG_TYPE,
					sch_code: this.personInfo.unit_code,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'smsConf/getConf',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if (response && response.user_types) {
						let config_types=response.user_types.split(",");
						let local_types=this.MSG_SMS.GRADE.USER_TYPE.split(",");
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
						if(send){
							this.SMS=true
							this.SMSText='点击上方图标可设置短信发送时间'
							this.icon='compose'
						}
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
			textClick(){//发送请假信息
				if(_this.comment==''){
					_this.showToast('请输入通知内容')
				}else if(_this.selectDatas.length===0){
					_this.showToast('请选择接收人')
				}else{
					if(_this.canSub){
						_this.canSub=false
						let comm=_this.comment
						let comment=comm.replace(/\s+/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
						if(_this.SMS){
							let showToast=false
							 let words=[]
							 for (let i = 0; i < _this.WORDS.length; i++) {
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
						_this.submitData();
					}
				}
			},
			submitData(){
				this.showLoading()
				let smsFlag=0;
				let comm=this.comment
				let comment=comm.replace(/\s+/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
				if(this.SIGN){
					comment+='[发送人：'+ this.personInfo.user_name+']'
				}
				let delayTime=this.moment().format('YYYY-MM-DD HH:mm:ss')
				let day=parseInt(this.multiArray[0][this.multiIndex[0]])
				let hour=parseInt(this.multiArray[1][this.multiIndex[1]])
				let minute=parseInt(this.multiArray[2][this.multiIndex[2]])
				if(this.is_delay){
					delayTime=this.moment().add(day, 'days').add(hour, 'hours').add(minute, 'minutes').format('YYYY-MM-DD HH:mm:ss');
				}
				let selectData=this.selectDatas
				let touser=[]
				for (var i = 0; i < selectData.length; i++) {
					let obj={
						col_code:"",
						col_name:"",
						maj_code:"",
						maj_name:"",
						grd_code:selectData[i].value,
						grd_name:selectData[i].name,
						cls_code:"",
						cls_name:"",
						user_codes:"",
						user_names:"",
					}
					touser.push(obj)
				}
				let comData={
					unit_name:this.personInfo.unit_name,
					send_unit_code:this.personInfo.unit_code,
					send_user:this.personInfo.user_code,
					send_user_tname:this.personInfo.user_name,
					msg_content:comment,
					msg_type:this.MSG_SMS.GRADE.MSG_TYPE,
					send_soure:"schapp#[APP]",
					tousers:touser,
					hr_smsid:0,//固定值
					sms_msgtype_code:this.MSG_SMS.GRADE.SMS_TYPE,
					is_delay:this.is_delay,
					delay_time:delayTime,
					servied:JSON.stringify(this.CONFIG)==='{}'?'100':this.CONFIG.serviced,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_SCHHOME+'api/appsms/appsmsa',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
				     if (response.code == 0) {
						 if(this.SMS){
							 this.sendSMS(response0,delayTime,comment)
						 }else{
							 this.hideLoading()
							 this.showToast(response.msg);
							 const eventChannel = this.getOpenerEventChannel()
							 eventChannel.emit('refreshList', {data: 1});
							 uni.navigateBack();
						 }
				     } else {
				     	this.canSub=true
				     	this.hideLoading()
				     	this.showToast(response.msg);
				     }
				},()=>{
						this.canSub=true
				})
			},
			sendSMS(id,delayTime,comment){//发送短信
				let selectData=this.selectDatas
				let touser=[]
				for (var i = 0; i < selectData.length; i++) {
					let obj={
						gen_type:this.MSG_SMS.GRADE.USER_TYPE,
						dpt_code:'',
						dpt_name:'',
						grd_code:selectData[i].value,
						grd_name:selectData[i].name,
						cls_code:'',
						cls_name:'',
						stu_code:'',
						stu_name:'',
						gen_code:'',
						gen_name:'',
					}
					touser.push(obj)
				}
				let comData = {
					send_unit_code:this.personInfo.unit_code,
					send_user:this.personInfo.user_code,
					send_user_tname:this.personInfo.user_name,
					send_soure:'schapp#[APP]',
					send_time:this.moment().format('YYYY-MM-DD HH:mm:ss'),
					is_delay:this.is_delay,
					delay_time:delayTime,
					msg_content:comment,
					msg_type:this.MSG_SMS.GRADE.MSG_TYPE,
					serviced:this.CONFIG.serviced,
					is_short:2,
					sms_msgtype_code:this.MSG_SMS.GRADE.SMS_TYPE,
					sch_code:this.personInfo.unit_code,
					sch_name:this.personInfo.unit_name,
					list:touser,
					index_code:this.index_code
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'smsRecord/save',comData,response=>{
					this.refreshID(id,response.id);
				})
			},
			refreshID(id,hr_id){//互动信息更新对应人事信息ID  （接口这样写的）
				let comData = {
					hr_smsid:hr_id,
					sms_id:id,
					index_code:this.index_code
				}
				this.post(this.globaData.INTERFACE_SCHHOME+'api/appsms/appsmsridhrid',comData,(response0,response)=>{
					this.hideLoading()
					this.showToast(response.msg);
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('refreshList', {data: 1});
					uni.navigateBack();
				})
			},
			changeAutoplay(){
				this.SMS = !this.SMS
				this.icon=''
				if(this.SMS){
					this.icon='compose'
				}
			},
			changeSign(){
				this.SIGN = !this.SIGN
			}
		},
	}
</script>

<style>
	.line2{
		height: 1px;
		background-color: #e5e5e5;
	}
	.form-view{
		padding: 5px 5px 0;
	}
	.form-left{
		font-size: 13px;
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
	::v-deep .uni-noticebar__content-text--single{
		font-size: 12px !important;
	}
	.text{
		font-size: 13px;
		height: 35px;
		padding:5px 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
