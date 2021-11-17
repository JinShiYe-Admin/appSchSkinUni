<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="确定" :textClick="textClick"></mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">年级</view>
			<picker style="width:100% !important;" mode="selector" @change="grdSelect" :value="grdIndex" :range="grdList" range-key="text">
				<input class="uni-input form-right" :value="grdIndex>=0?grdList[grdIndex].text:''" placeholder="请选择" disabled/>
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
			<picker style="width:100% !important;" mode="selector" @change="stuSelect" :value="stuIndex" :range="stuList" range-key="text">
				<input class="uni-input form-right"  :value="stuIndex>=0?stuList[stuIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">年份</view>
			<picker style="width:100% !important;" mode="selector" @change="yearSelect" :value="yearIndex" :range="yearList" range-key="text">
				<input class="uni-input form-right"  :value="yearIndex>=0?yearList[yearIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">学期</view>
			<picker style="width:100% !important;" mode="selector" @change="termSelect" :value="termIndex" :range="termList" range-key="text">
				<input class="uni-input form-right"  :value="termIndex>=0?termList[termIndex].text:''" placeholder="请选择" disabled/>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">评语类型</view>
			<picker style="width:100% !important;" mode="selector" @change="remarkSelect" :value="remarkIndex" :range="remarkList" range-key="text">
				<input class="uni-input form-right"  :value="remarkIndex>=0?remarkList[remarkIndex].text:''" placeholder="请选择" disabled/>
			</picker>
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
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				text:[],
				textClickS:[],
				canSub:true,
				begintime:'',
				endtime:'',
				comment:'',//说明
				grdIndex:-1,
				clsIndex:-1,
				stuIndex:-1,
				yearIndex:-1,
				termIndex:-1,
				remarkIndex:-1,
				grdList: [], //年级数组
				clsList: [], //班级数组
				stuList:[],// 学生数组
				yearList: [], //年份数组
				termList: [], //学期数组
				remarkList: [], //评语类型数组
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
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='添加评语记录'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading();
				this.getSmsConfig();
				this.getGrd();
				this.getDictList();
			},100)
			let that=this
			//#ifndef APP-PLUS
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
			getDictList(){//获取常量
				let comData={
					op_code: 'index',
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUPYSUB+'Comment/getDict',comData,response=>{
				    console.log("responseaaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.yearArray&& response.yearArray.length == 0) {
						this.showToast('无法获取年份');
					}  else if(response.termArray&& response.termArray.length == 0){
						this.showToast('无法获取学期');
					} else if(response.remarkTypeArray&& response.remarkTypeArray.length == 0){
						this.showToast('无法获取评语类型');
					}else{
						let newList=response.yearArray.sort(util.compare("value",0));
						this.yearList = newList;
						this.termList =  response.termArray;
						this.remarkList = response.remarkTypeArray;
					}
				})
			},
			textClick(){//发送请假信息
				if(this.grdIndex==-1){
					this.showToast('请选择年级')
				}else if(this.clsIndex==-1){
					this.showToast('请选择班级')
				}else if(this.stuIndex==-1){
					this.showToast('请选择学生')
				}else if(this.yearIndex==-1){
					this.showToast('请选择年份')
				}else if(this.termIndex==-1){
					this.showToast('请选择学期')
				}else if(this.remarkIndex==-1){
					this.showToast('请选择评语类型')
				}else if(this.comment==''){
					this.showToast('请输入行为说明')
				}else{
					if(this.canSub){
						this.canSub=false
						this.submitData()
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
					year: this.yearList[this.yearIndex].value,
					term_name: this.termList[this.termIndex].value,
					remark_type: this.remarkList[this.remarkIndex].value,
					remark: comment,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUPYSUB+'Comment/save',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
				     if (response.code == 0) {
						 this.hideLoading()
						 this.showToast(response.msg);
				     	 const eventChannel = this.getOpenerEventChannel()
				     	 eventChannel.emit('refreshList', {data: 1});
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
			yearSelect(e){
				if(this.yearList.length>0){
					if(this.yearIndex!==e.detail.value){
						this.yearIndex=e.detail.value
					}
				}
			},
			termSelect(e){
				if(this.termList.length>0){
					if(this.termIndex!==e.detail.value){
						this.termIndex=e.detail.value
					}
				}
			},
			remarkSelect(e){
				if(this.remarkList.length>0){
					if(this.remarkIndex!==e.detail.value){
						this.remarkIndex=e.detail.value
					}
				}
			},
			changeAutoplay(){
				this.SMS = !this.SMS
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
