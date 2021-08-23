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
			<view class="form-left">行为细项</view>
			<picker style="width:100% !important;" mode="selector" @change="xwxxSelect" :value="xwxxIndex" :range="xwxxList" range-key="text">
				<input class="uni-input form-right"  v-model="xwxxList[xwxxIndex].text" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">发生日期</view>
			<xp-picker mode="ymd" ref="timePicker" history :animation="false" :year-range='[2020,2030]' @confirm="timeSelect"></xp-picker>
			<input class="uni-input form-right"  v-model="formData.time" placeholder="请选择" disabled @click="timePicker"/>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">节次</view>
			<picker style="width:100% !important;" mode="selector" @change="jcSelect" :value="jcIndex" :range="jcList" range-key="text">
				<input class="uni-input form-right"  v-model="jcList[jcIndex].text" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">科目</view>
			<picker style="width:100% !important;" mode="selector" @change="kmSelect" :value="kmIndex" :range="kmList" range-key="text">
				<input class="uni-input form-right"  v-model="kmList[kmIndex].text" placeholder="请选择" disabled/>
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
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view choose-file">
			<view class="choose-file-text">附件<view class="file-des">{{`(最多可选择${this.showMaxCount}张照片${this.wxTips?this.wxTips:''})`}}</view></view>
			<g-upload ref='gUpload' :mode="imgList" @chooseFile='chooseFile' @imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount"></g-upload>
		</view>
	</view>
</template> 

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	 import gUpload from "@/components/g-upload/g-upload.vue"
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
				xwxxIndex:0,
				jcIndex:0,
				kmIndex:0,
				grdList: [{text:'请选择',value:''}], //年级数组
				clsList: [{text:'请选择',value:''}], //班级数组
				stuList:[],
				stuNameList: [], //学生数组
				stuIdList: [], //学生数组
				xwxxList: [{text:'请选择',value:''}], //请假类别数组
				jcList: [{text:'请选择',value:''}], //出入权限数组
				kmList: [{text:'请选择',value:''}], //出入权限数组
				SMS:false,//是否向家长发送短信
				CONFIG:{},//短信配置 对象
				WORDS:[],//拒绝关键字 对象
				SHOW:false,//是否显示发送短信
				// 附件上传相关
				columnNum:3,//每行显示的图片数量
				imgList: [],//选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				maxCount:9,//单次选择最大数量 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 maxCount=showMaxCount-imgList.length
				showMaxCount:9,//单次上传最大数量
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
					if (response.user_types) {
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
						this.kmList = [{text:'请选择',value:''}].concat(subList);
					} else {
						this.kmList=[];
						mui.toast('无数据授权 无法获取班级');
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
					this.jcList=[{text:'请选择',value:''}].concat(response.timeArray)
					this.xwxxList =  [{text:'请选择',value:''}].concat(response.qbArray);
				})
			},
			textClick(){//发送请假信息
				if(this.grdList[this.grdIndex].value==''){
					this.showToast('请选择年级')
				}else if(this.clsList[this.clsIndex].value==''){
					this.showToast('请选择班级')
				}else if(this.stuList[this.stuIndex].value==''){
					this.showToast('请选择请假学生')
				}else if(this.xwxxList[this.xwxxIndex].value==''){
					this.showToast('请选择行为细项')
				}else if(this.formData.time==''){
					this.showToast('请选择发生日期')
				}else if(this.jcList[this.jcIndex].value==''){
					this.showToast('请选择节次')
				}else if(this.kmList[this.kmIndex].value==''){
					this.showToast('请选择科目')
				}else if(this.formData.comment==''){
					this.showToast('请输入请假事由')
				}else{
					if(this.canSub){
						this.canSub=false
						this.showLoading()
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
							grd_code: this.grdList[this.grdIndex].value,
							cls_code: this.grdList[this.grdIndex].value,
							stu_ids: this.grdList[this.grdIndex].value,
							item_code: data.xw.value,
							comment: comment,
							behavior_time: data.time,
							class_node: data.jc.value,
							sub_code:data.sub.value,
							asset_ids:asset_ids,
							sms_parent_stu_flag:flag,
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
			grdSelect(e){
				if(this.grdIndex!==e.detail.value){
					 this.grdIndex=e.detail.value
					 this.clsIndex=0
					 this.stuIndex=0
					 this.kmIndex=0
					 this.clsList=[{text:'请选择',value:''}]
					 this.stuList=[{text:'请选择',value:''}]
					 this.kmList=[{text:'请选择',value:''}]
					 if(e.detail.value!==0){
						this.getCls(this.grdList[e.detail.value].value)
					 }
				}
			},
			clsSelect(e){
				if(this.clsIndex!==e.detail.value){
					 this.clsIndex=e.detail.value
					 this.stuIndex=0
					 this.kmIndex=0
					 this.stuList=[{text:'请选择',value:''}]
					 this.kmList=[{text:'请选择',value:''}]
					 if(e.detail.value!==0){
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
							 console.log("data: " + JSON.stringify(data));
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
				if(this.xwxxIndex!==e.detail.value){
					this.xwxxIndex=e.detail.value
				}
			},
			jcSelect(e){
				if(this.jcIndex!==e.detail.value){
					this.jcIndex=e.detail.value
				}
			},
			kmSelect(e){
				if(this.kmIndex!==e.detail.value){
					this.kmIndex=e.detail.value
				}
			},
			changeAutoplay(){
				this.SMS = !this.SMS
			},
			timePicker(){
				this.$refs.timePicker.show()
			},
			timeSelect(e){
				this.formData.time=e.value
			},
			chooseFile(list, v) {
			  console.log("上传图片_list：", list)
			  console.log("上传图片_v：", v);
			  this.imgList=list
			  this.maxCount=this.showMaxCount-list.length
			},
			imgDelete(list, eq) {
			  console.log("删除图片_list：", list)
			  console.log("删除图片_eq：", eq)
			  this.imgList=list
			  this.maxCount=this.showMaxCount-list.length
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
