<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">年级</view>
			<picker style="width:100% !important;" mode="selector" @change="grdSelect" :range="grdList" range-key="text">
				<input class="uni-input form-right"  v-model="grdList[grdIndex].text"  placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">班级</view>
			<picker style="width:100% !important;" mode="selector" @change="clsSelect" :value="clsIndex" :range="clsList" range-key="text">
				<input class="uni-input form-right"  v-model="clsList[clsIndex].text" placeholder="请选择" disabled/>
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
			<view class="form-left">谈话日期</view>
			<dy-Date class="uni-input form-right" style="display: flex;align-items: center;padding-right: 0;" :childValue='formData.time'  timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
			<!-- <xp-picker mode="ymd" ref="timePicker" history :animation="false" :year-range='[2020,2030]' @confirm="timeSelect"></xp-picker>
			<input class="uni-input form-right"  v-model="formData.time" placeholder="请选择" disabled @click="timePicker"/> -->
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left form-left-textarea">谈话记录</view>
			<textarea placeholder="请输入" v-model="formData.comment" maxlength="100" ></textarea>
		</view>
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view choose-file">
			<view class="choose-file-text">附件<view class="file-des">{{`(最多可选择${this.showMaxCount}张照片${this.wxTips?this.wxTips:''})`}}</view></view>
			<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile' @imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount"></g-upload>
		</view>
	</view>
</template> 

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	// 七牛上传相关
	 import gUpload from "@/components/g-upload/g-upload.vue"
	 import cloudFileUtil from '../../commom/uploadFiles/CloudFileUtil.js';
	 
	 
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
				grdIndex:0,
				clsIndex:0,
				stuIndex:0,
				grdList: [{text:'请选择',value:''}], //年级数组
				clsList: [{text:'请选择',value:''}], //班级数组
				stuList:[],
				stuNameList: [], //学生数组
				stuIdList: [], //学生数组
				SMS:false,//是否向家长发送短信
				CONFIG:{},//短信配置 对象
				WORDS:[],//拒绝关键字 对象
				SHOW:false,//是否显示发送短信
				
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD'),
				
				// 附件上传相关👇
				control:true,//是否显示上传 + 按钮 一般用于显示
				deleteBtn:true,//是否显示删除 按钮 一般用于显示
				
				maxCount:9,//单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount:9,//单次上传最大数量
				
				columnNum:3,//每行显示的图片数量
				imgNames: [],//服务器回传的图片名称
				imgList: [],//选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles:[],//选择的文件对象，用于上传时获取文件名  不需要改动
				// #ifdef H5
					wxTips:',微信端不支持多选',//如果是H5，需要提示该内容
				// #endif
				// #ifndef H5
					wxTips:'',
				// #endif
			}
		},
		components: {
			mynavBar,
			 gUpload
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='新建主动谈话'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading();
				this.getGrd();
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			getGrd(){
				let comData={
					op_code:'add',
					get_grd:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					let grds = response.grd_list;
					let grdList=[{text:'请选择',value:''}];
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
					let clssList=[{text:'请选择',value:''}];
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
					let stuList=[{text:'请选择',value:''}];
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
			textClick(){//发送请假信息
				if(this.grdList[this.grdIndex].value==''){
					this.showToast('请选择年级')
				}else if(this.clsList[this.clsIndex].value==''){
					this.showToast('请选择班级')
				}else if(this.stuIdList.length==0){
					this.showToast('请选择学生')
				}else if(this.formData.time==''){
					this.showToast('请选择发生日期')
				}else if(this.formData.comment==''){
					this.showToast('请输入谈话记录')
				}else{
					if(this.canSub){
						this.canSub=false
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
			  // console.log("删除图片_fileeq：", this.imgFiles)
			},
			upLoadImg(){
				let _this=this
				let names=[]
				this.showLoading('正在上传文件...')
				cloudFileUtil.uploadFiles(this,'1',this.imgList,this.QN_PB_NAME,this.QN_XSXW_XSTH,(encName,encAddrStr)=>{
					console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					console.log("names: " + JSON.stringify(encName));
					this.submitData(encName,encAddrStr)
				})
			},
			//附件上传相关👆
			submitData(encNameStr,encAddrStr){
				this.showLoading()
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
					chat_detail: this.formData.comment,
					chat_time: this.formData.time,
					asset_ids:asset_ids,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUXWSUB+'Talk/save',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
				     if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
				     	 const eventChannel = this.getOpenerEventChannel()
				     	 eventChannel.emit('refreshTalkBehaviorZd', {data: 1});
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
				if(this.grdIndex!==e.detail.value){
					 this.grdIndex=e.detail.value
					 this.clsIndex=0
					 this.stuList=[] 
					 this.stuNameList= [] 
					 this.stuIdList= [] 
					 this.clsList=[{text:'请选择',value:''}]
					 if(e.detail.value!==0){
						this.getCls(this.grdList[e.detail.value].value)
					 }
				}
			},
			clsSelect(e){
				if(this.clsIndex!==e.detail.value){
					 this.clsIndex=e.detail.value
					 this.stuList=[]
					 this.stuNameList= [] 
					 this.stuIdList= [] 
					 if(e.detail.value!==0){
					 	this.getStu(this.grdList[this.grdIndex].value,this.clsList[e.detail.value].value)
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
			timePicker(){
				this.$refs.timePicker.show()
			},
			timeSelect(e){
				this.formData.time=e.value
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
