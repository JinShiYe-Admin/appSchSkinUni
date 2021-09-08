<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick" :icon="icon" :iconClick="iconClick"></mynavBar>
		<uni-notice-bar :single="true" text="点击上方图标可设置短信发送时间"/>
		<view class="uni-flex uni-row form-view">
			<textarea placeholder="请输入通知内容,最多300字" v-model="formData.comment" maxlength="300" style="flex: 1;"></textarea>
		</view>
		<template v-if="SHOW">
			<view class="line"></view>
			<view class="uni-flex uni-row form-view" style="padding:0 10px;">
				<view class="form-left" style="width: 300rpx;">同步发送短信</view>
				<switch class="form-right" :checked="SMS" @change="changeAutoplay" color="#00CFBD"/>
			</view>
			<view class="uni-flex uni-row form-view" style="padding:0 10px;margin-top: 10px;">
				<view class="form-left" style="width: 300rpx;">添加签名</view>
				<switch class="form-right" :checked="SMS" @change="changeAutoplay" color="#00CFBD"/>
			</view>
			<view class="form-right" style="padding-right:15px;margin-top: 10px;">{{delay_time_str}}</view>
		</template>
		<view class="uni-flex uni-row form-view" style="padding:0 10px;">
			<view class="form-left" style="font-size: 14px;height: 30px;">接收人</view>
		</view>
		<view class="line-green"></view>
		<view class="uni-flex uni-row form-view"  style="padding:5px 10px 0;">
			<view class="form-left" style="font-size: 13px;color: #787878;">全体学生</view>
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
				 <uni-icons v-show="nowIcon" type="checkmarkempty" color="#00CFBD" size="17"></uni-icons>
				</view>
				<view class="line2"></view>
				<view class="text"  @click="checkDelay">
					<text>延时发送</text>
					<picker v-show="delayIcon" mode="multiSelector" ref="picker" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
						<view class="uni-input">{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}<uni-icons style="margin-left: 5px;" type="compose" color="#00CFBD" size="16"></uni-icons></view>
					</picker>
					<uni-icons v-show="delayIcon" type="checkmarkempty" color="#00CFBD" size="17"></uni-icons>
				</view>
			</view>
		</uni-popup>
	</view>
</template> 

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	 
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
				tabBarItem: {},
				icon:'',
				canSub:true,
				nowIcon:true,
				delayIcon:false,
				is_delay:0,
				delay_time_str:'立即发送',
				multiArray: [
					leftArray,
					centerArray,
					rightArray
				],
				multiIndex: [0, 0, 4],
				
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
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新建课堂行为'
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
			
			
			this.icon='settings'
		},
		methods: {
			bindMultiPickerColumnChange(e){
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
				let day=parseInt(this.multiArray[0][this.multiIndex[0]])?this.multiArray[0][this.multiIndex[0]]+'，':''
				let hour=parseInt(this.multiArray[1][this.multiIndex[1]])?this.multiArray[1][this.multiIndex[1]]+'，':''
				let minute=this.multiArray[2][this.multiIndex[2]]
				this.delay_time_str=day+hour+minute+' 后发送'
				this.$forceUpdate()
			},
			iconClick(){
				this.$refs.popup.open('top')
			},
			checkNow(){
				this.nowIcon=true
				this.delayIcon=false
				this.is_delay=0
				this.delay_time_str='立即发送'
			},
			checkDelay(){
				this.nowIcon=false
				this.delayIcon=true
				this.is_delay=1
				this.delay_time_str='5分钟 后发送'
			},
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
					op_code:'index',
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUXWSUB+'StudentBehavior/getDict',comData,response=>{
				    console.log("responsesabaa: " + JSON.stringify(response));
					this.hideLoading()
					this.jcList=[].concat(response.timeArray)
					this.xwxxList =  [].concat(response.qbArray);
				})
			},
			textClick(){//发送请假信息
				let delayTime=this.moment().format('YYYY-MM-DD HH:mm:ss')
				let day=parseInt(this.multiArray[0][this.multiIndex[0]])
				let hour=parseInt(this.multiArray[1][this.multiIndex[1]])
				let minute=parseInt(this.multiArray[2][this.multiIndex[2]])
				if(this.is_delay){
					delayTime=this.moment().add(day, 'days').add(hour, 'hours').add(minute, 'minutes').format('YYYY-MM-DD HH:mm:ss');
				}
				if(this.grdIndex==-1){
					this.showToast('请选择年级')
				}else if(this.clsIndex==-1){
					this.showToast('请选择班级')
				}else if(this.stuIdList.length==0){
					this.showToast('请选择学生')
				}else if(this.xwxxIndex==-1){
					this.showToast('请选择行为细项')
				}else if(this.formData.time==''){
					this.showToast('请选择发生日期')
				}else if(this.jcIndex==-1){
					this.showToast('请选择节次')
				}else if(this.kmIndex==-1){
					this.showToast('请选择科目')
				}else if(this.formData.comment==''){
					this.showToast('请输入行为说明')
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
						this.upLoadImg();
					}
				}
			},
			//附件上传相关👇
			chooseFile(list, v,f) {
			  // console.log("上传图片_list：", list)
			  // console.log("上传图片_v：", v);
			  //  console.log("上传图片_f：", f);
			  this.imgList=list
			  this.imgFiles=this.imgFiles.concat(f)
			  this.maxCount=this.showMaxCount-list.length
			},
			imgDelete(list, eq,fileeq) {
			  // console.log("删除图片_list：", list)
			  // console.log("删除图片_eq：", eq)
			  // console.log("删除图片_fileeq：", fileeq)
			  this.imgList=list
			  this.imgFiles.splice(fileeq, 1); //删除临时路径
			  this.imgNames.splice(eq, 1); //删除文件名
			  this.maxCount=this.showMaxCount-list.length
			  // console.log("删除图片_fileeq：", JSON.stringify(this.imgNames))
			},
			upLoadImg(){
				let names=[]
				this.showLoading('正在上传文件...')
				cloudFileUtil.uploadFiles(this,'1',this.imgList,this.QN_PB_NAME,this.QN_XSXW_KTXW,(encName,encAddrStr)=>{
					// console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					// console.log("names: " + JSON.stringify(encName));
					this.submitData(encName,encAddrStr)
				})
			},
			//附件上传相关👆
			submitData(encNameStr,encAddrStr){
				this.showLoading()
				let smsFlag=0;
				let comm=this.formData.comment
				let comment=comm.replace(/\s+/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
				let asset_ids=[]
				if(encNameStr){
					encNameStr.map(function(item,index){
						let obj={}
						obj.id=''
						obj.url=encAddrStr[index]
						obj.ext=item.split(".")[1]
						obj.name='附件'+(index+1)
						asset_ids.push(obj)
					})
				}
				let comData={
					grd_code: this.grdList[this.grdIndex].value,
					cls_code: this.clsList[this.clsIndex].value,
					stu_ids: this.stuIdList.join(','),
					item_code: this.xwxxList[this.xwxxIndex].value,
					comment: comment,
					behavior_time: this.formData.time,
					class_node: this.jcList[this.jcIndex].value,
					sub_code:this.kmList[this.kmIndex].value,
					asset_ids:asset_ids,
					sms_parent_stu_flag:smsFlag,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUXWSUB+'StudentBehavior/save',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
				     if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
				     	 const eventChannel = this.getOpenerEventChannel()
				     	 eventChannel.emit('refreshClsBehavior', {data: 1});
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
	.line2{
		height: 1px;
		background-color: #e5e5e5;
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
