<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="确定" :textClick="textClick">
		</mynavBar>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">报销类型</view>
			<picker style="width:100% !important;" mode="selector" @change="selectAccountType" :value="selectAccountTypeIndex" :range="selectAccountTypeArray" range-key="type_name">
				<!-- <input class="uni-input form-right"  :value="selectAccountTypeIndex>=0?selectAccountTypeArray[selectAccountTypeIndex].type_name:''"  placeholder="请选择" disabled/> -->
				<view class="uni-input form-right">{{selectAccountTypeIndex>=0?selectAccountTypeArray[selectAccountTypeIndex].type_name:'请选择'}}</view>
			</picker>
			<uni-icons size="13" type="arrowdown" color="#808080"></uni-icons>
		</view>
		<view class="line"></view>
		<view class="titleTemp">事由</view>
		<textarea maxlength="50" v-model="content" class="rightView"
			style="height: 80px;margin-top: 10px;padding-top: 5px;margin-bottom: 10px;" placeholder="请输入申请事由"></textarea>
		<br>
		<view class="double-line" style="margin-top: 90px;"></view>
		<uni-list style="margin-top: -5px;">
			<uni-list-item direction='column' >
				<view slot="body">
					<uni-row>
						<uni-col :span="20">
							<view>
								报销明细<span style='color: #787878;font-size: 12px;'>（当前报销报销总额：<span style='color: red;'>{{accountEff}}</span>元）</span>
							</view>
						</uni-col>
						<uni-col :span="4" style="text-align: right;">
							<uni-icons @click='addAccount()' style="color: #00CFBD;" type="plus-filled" size="25"></uni-icons>
						</uni-col>
					</uni-row>
				</view>
			</uni-list-item>
		</uni-list>
		<view v-if="accountList.length==0" style="font-size: 13px;color: #939393;margin: 5px 0 0 10px;">请添加报销明细</view>
		<view v-else-if="accountList.length>0" v-for="(accountModel,index) in accountList" :key='index'>
			<uni-card isShadow>
				<view class="content-box-text" @click.stop="editAccount(accountModel,index)">
					<uni-row style=''>
						<uni-col :span="10" style="font-size: 13px;">
							￥{{accountModel.eff}}
						</uni-col>
						<uni-col :span="10" style="text-align: center;color: #00CFBD;font-size: 13px;">
							{{accountModel.time}}
						</uni-col>
						<uni-col :span="4" style="text-align: right;">
							<view @click.stop='delAccount(index)'>
								<uni-icons style="color: #939393;" type="closeempty" size="25"></uni-icons>
							</view>
						</uni-col>
						<uni-col :span="24" style="font-size: 13px;margin-top: 3px;">
							{{accountModel.content}}
						</uni-col>
						<uni-col :span="24" style="">
							<view v-for="(imgModel,imgIndex) in accountModel.imgList" :key='imgIndex' style="margin-top: 5px;">
								<image class="peopleImg" style="float: left;margin-left: 5px;" :src=imgModel>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</uni-card>
		</view>
		<view class="double-line"></view>
		<uni-list style="margin-top: -5px;">
			<uni-list-item direction='column' >
				<view slot="body">
					<uni-row>
						<uni-col :span="12">
							<view @click="selectPeopleFun(0)">
								添加审批人
								<uni-icons style="margin-left: 5px;color: #00CFBD;" type="personadd" size="20"></uni-icons>
							</view>
						</uni-col>
						<uni-col :span="12" style="">
							<picker @change="selectFlowChange" value="0" :range="selectFlowArray" range-key="flow_name"
								style="height: 0px;">
								<view class="uni-input" style="padding: 0px;font-size: 16px;border-left: 1px solid #AAAAAA;padding-left: 15px;">添加审批流程
								<uni-icons style="margin-left: 5px;color: #00CFBD;" type="folder-add" size="20"></uni-icons></view>
							</picker>
						</uni-col>
					</uni-row>
				</view>
			</uni-list-item>
		</uni-list>
		<view style="margin: 10px;color: black;">
			<view v-if="selectPeople.length==0" style="font-size: 13px;color: #939393;">请添加审批人或者审批流程</view>
			<view v-else-if="selectPeople.length>0" v-for="(selectModel,index) in selectPeople" :key='index'>
				<view class="mui-input-row" style="height: 40px;">
					<p v-if="selectModel.flowFlag == 0" style="margin-left: 10px;float: left;margin-top: 5px;">
						{{selectModel.user_name}}
					</p>
					<p v-else-if="selectModel.flowFlag == 1" style="margin-left: 10px;float: left;margin-top: 5px;">
						{{selectModel.flow_name}}</p>
					<button @click="removeSelectModel(index)" type="warn" size="mini"
						style="margin-left: 20px;">删除</button>
				</view>
			</view>
		</view>
		<view class="double-line"></view>
		<uni-list style="margin-top: -5px;">
			<uni-list-item direction='column' >
				<view slot="body">
					<uni-row>
						<uni-col :span="12">
							<view @click="selectPeopleFun(1)">
								选择抄送人
								<uni-icons style="margin-left: 5px;color: #00CFBD;" type="staff" size="23"></uni-icons>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</uni-list-item>
		</uni-list>
		<view style="margin: 10px;color: gray;word-break:break-all;word-wrap:break-word;font-size: 13px;">
			{{'已选('+copyPeoples.length+'人）:'}} {{copyPeoplesStr}}
		</view>
		<uni-popup ref="popupSelect" type="center" style="background-color: white;">
			<scroll-view
				style="background-color: white;padding: 10px;border-radius: 5px 5px 0px 0px;width: 300px;height: 350px;"
				class="popupSelect" scroll-y="true">
				<view style="text-align: center;padding-top: 10px;" v-if="accountFlag ==1">编辑报销明细</view>
				<view style="text-align: center;padding-top: 10px;" v-else>添加报销明细</view>
				<uni-row style="margin-bottom: 5px;">
					<uni-col class="addEditLeft" :span="5">
						金额：
					</uni-col>
					<uni-col class="" :span="19">
						<view class="pickBorder" style="margin-top: 10px;width: 185px;height: 40px;">
							<input v-model="accountModel.eff" maxlength="8" class="rightInput" type="number" placeholder="请输入报销金额" />
						</view>
					</uni-col>
					<uni-col class="addEditLeft" :span="5">
						日期：
					</uni-col>
					<uni-col class="rowClo" :span="19">
						<view class="mini-date pickBorder"
							style="margin-top: -5px;width: 185px;height: 40px;text-align: left;">
							<dy-Date :childValue='endtime' timeType="day" v-on:getData='timeSelect'
								:minSelect='startDate' :maxSelect='endDate'></dy-Date>
							<uni-icons style="padding-right: 13px;" size="13" type="arrowdown" color="#C2C7D6">
							</uni-icons>
						</view>
					</uni-col>
					<uni-col class="addEditLeft" :span="5">
						内容：
					</uni-col>
					<uni-col class="" :span="19">
						<view class="pickBorder" style="margin-top: 10px;width: 185px;height: 40px;">
							<input v-model="accountModel.content" maxlength="30" class="rightInput" type="text" placeholder="请输入报销内容" />
						</view>
					</uni-col>
				</uni-row>
				<view class="uni-flex uni-row form-view choose-file">
					<view class="choose-file-text">附件<view class="file-des">
							{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}
						</view>
					</view>
					<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile'
						@imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount">
					</g-upload>
				</view>
			</scroll-view>
			<view style="background-color: white;height: 60px;border-radius: 0px 0px 5px 5px;">
				<view style="height: 10px;"></view>
				<button class="mini-btn" type="default" size="mini" @click="popSure(0)">取消</button>
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
					@click="popSure(1)">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	// 七牛上传相关
	import gUpload from "@/components/g-upload/g-upload.vue"
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				showSelectPeople: '',
				sendFlag:0,
				title: '',
				content: '',
				selectPeople: [],
				selectFlowArray: [], //可用流程列表
				// 附件上传相关👇
				control: true, //是否显示上传 + 按钮 一般用于显示
				deleteBtn: true, //是否显示删除 按钮 一般用于显示
				maxCount: 3, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount: 3, //单次上传最大数量
				columnNum: 3, //每行显示的图片数量
				imgNames: [], //服务器回传的图片名称
				imgList: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				wxTips: '',
				copyPeoples:[],
				copyPeoplesStr:'',
				selectAccountTypeArray:[],
				selectAccountTypeIndex:-1,
				accountEff:0,//费用总金额
				accountList:[],//报销明细
				accountModel:{
					content:'',
					time:'',
					eff:'',
					imgList:[]
				},//弹出框中报销model
				accountFlag:0,//0添加，1编辑
				accountEditIndex:0,//编辑明细的索引
				endtime: this.moment().format('YYYY-MM-DD'),
				startDate: '2020-01-01',
				endDate: this.moment().format('YYYY-MM-DD'),
			}
		},
		components: {
			mynavBar,
			gUpload
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '新建报销申请';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '新建报销申请'
			});
			//#ifdef H5
			document.title = "";
			this.wxTips = ',微信端不支持多选'; //如果是H5，需要提示该内容
			//#endif
			//
			// 8.获取全部流程列表
			var tempData = {
				flow_name:'',
				flow_type: 2, //流程类型，0 全部，1 报销申请流程,2 报销报销流程
				flow_status:1,//流程状态，0 全部，1 有效,2 无效
				page_number:1,
				page_size:0,
				index_code: this.navItem.index_code,
			}
			this.post(this.globaData.INTERFACE_COSTMS + 'flow/getWorkFlow', tempData, (data0, data) => {
				this.hideLoading();
				if (data.code == 0) {
					for (var i = 0; i < data.data.list.length; i++) {
						var tempM = data.data.list[i];
						tempM.list = []; //流程里面的人员
						tempM.flowFlag = 1; //1流程，0人员
					}
					this.selectFlowArray = [].concat(data.data.list);
				} else {
					this.showToast(data.msg);
				}
			});
			// 获取报销类型
			var tempData1 = {
				type_name:'',
				page_number:1,
				page_size:0,
				index_code: this.navItem.index_code,
			}
			this.post(this.globaData.INTERFACE_COSTMS + 'accountType/getAccountTypes', tempData1, (data0, data) => {
				this.hideLoading();
				if (data.code == 0) {
					this.selectAccountTypeArray = [].concat(data.data.list);
				} else {
					this.showToast(data.msg);
				}
			});
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			editAccount(model,index){
				console.log('editAccount:'+JSON.stringify(model));
				this.accountModel = model;
				this.accountModel.eff = parseFloat(parseFloat(this.accountModel.eff).toFixed(1));
				this.endtime = this.accountModel.time;
				this.imgList = this.accountModel.imgList;
				this.maxCount = this.showMaxCount - this.accountModel.imgList.length;
				this.accountFlag = 1;
				this.accountEditIndex = index;
				this.$refs.popupSelect.open();
				this.sumAccountEff();
			},
			sumAccountEff(){
				this.accountEff = 0;
				for (var i = 0; i < this.accountList.length; i++) {
					var tempM = this.accountList[i];
					this.accountEff = this.accountEff + tempM.eff;
				}
			},
			delAccount(index){
				console.log('delAccount:'+index);
				this.accountList.splice(index,1);
			},
			popSure(flag) {
				if (flag == 0) {
					this.$refs.popupSelect.close();
				} else {
					if(this.accountModel.eff.length == 0){
						this.showToast("请输入报销金额");
					}else if(this.accountModel.content.length == 0){
						this.showToast("请输入报销内容");
					}else{
						this.$refs.popupSelect.close();
						if(this.imgList.length>0){
							this.accountModel.imgList = this.imgList;
						}
						this.accountModel.eff = parseFloat(parseFloat(this.accountModel.eff).toFixed(1)) ;
						this.accountModel.time = this.endtime;
						if(this.accountFlag==0){
							this.accountList.push(JSON.parse(JSON.stringify(this.accountModel)));
						}else{
							this.accountList.splice(this.accountEditIndex,1,JSON.parse(JSON.stringify(this.accountModel)));
						}
						this.sumAccountEff();
						console.log('this.accountList:'+JSON.stringify(this.accountList));
					}
				}
			},
			timeSelect(e) {
				console.log(e);
				this.endtime = e;
			},
			addAccount(){
				if(this.accountList.length==5){
					this.showToast("最多只能添加5条明细");
					return;
				}
				this.accountModel = {
					content:'',
					time:'',
					eff:'',
					imgList:[]
				}
				this.maxCount = this.showMaxCount;
				this.imgNames = [];
				this.imgList = [];
				this.imgFiles = [];
				this.accountFlag = 0;
				this.$refs.popupSelect.open();
			},
			selectAccountType(e){
				if(this.selectAccountTypeArray.length>0){
					if(this.selectAccountTypeIndex!==e.detail.value){
						 this.selectAccountTypeIndex=e.detail.value;
					}
				}
			},
			selectFlowChange(e) {
				if(this.selectFlowArray.length>0){
					console.log('picker发送选择改变，携带值为', e.target.value);
					this.selectFlowFun(this.selectFlowArray[e.target.value]);
				}else{
					this.showToast("暂无审批流程");
				}
			},
			//附件上传相关👇
			chooseFile(list, v, f) {
				this.imgList = list
				this.imgFiles = this.imgFiles.concat(f)
				this.maxCount = this.showMaxCount - list.length
			},
			imgDelete(list, eq, fileeq) {
				this.imgList = list
				this.imgFiles.splice(fileeq, 1); //删除临时路径
				this.imgNames.splice(eq, 1); //删除文件名
				this.maxCount = this.showMaxCount - list.length
			},
			upLoadImg(flag) {//flag为accountList中的索引
				if (this.accountList.length>flag) {
					if (this.accountList[flag].imgList.length>0) {
						this.showLoading();
						cloudFileUtil.uploadFiles(this, '1', this.accountList[flag].imgList, this.QN_PB_NAME, this.QN_CWGL_BX, (encName,
							encAddrStr) => {
							this.hideLoading();
							this.accountList[flag].encName = encName;
							this.accountList[flag].encAddrStr = encAddrStr;
							this.upLoadImg(flag+1);
						});
					}else{
						this.upLoadImg(flag+1);
					}
				}else{
					this.submitData();
				}
				
			},
			//附件上传相关👆
			submitData() {
				var approve_mans = []; //审批人列表
				var copy_mans = []; //抄送人列表
				console.log('this.selectPeople:'+JSON.stringify(this.selectPeople));
				for (var i = 0; i < this.selectPeople.length; i++) {
					var model = this.selectPeople[i];
					if (model.flowFlag == 0) {
						var tempM = {
							approve_man_code:model.user_code,
							approve_man_name:model.user_name
						}
						approve_mans.push(tempM);
					} else {
						for (var a = 0; a < model.list.length; a++) {
							var tempP = model.list[a];
							var tempM = {
								approve_man_code:tempP.man_code,
								approve_man_name:tempP.man_name
							}
							approve_mans.push(tempM);
						}
					}
				}
				for (var i = 0; i < this.copyPeoples.length; i++) {
					var model = this.copyPeoples[i];
					var tempM = {
						copy_man_code:model.user_code,
						copy_man_name:model.user_name
					}
					copy_mans.push(tempM);
				}
				if (approve_mans.length == 0) {
					this.showToast("请添加审批人或者审批流程");
					this.sendFlag = 0;
					return;
				}
				console.log('this.accountList:' + JSON.stringify(this.accountList));
				var tempAccountArr = [];
				for (var i = 0; i < this.accountList.length; i++) {
					var tempM0 = this.accountList[i];
					var tempM1 = {
						account_note:tempM0.content,
						account_time:tempM0.time.replace(/\-/g,''),
						account_fee:tempM0.eff,
						enc_list:[]
					}
					if(tempM0.encName){
						for (var a = 0; a < tempM0.encName.length; a++) {
							var tempImg = {
								enc_name:tempM0.encName[a],
								enc_addr:tempM0.encAddrStr[a],
							}
							tempM1.enc_list.push(tempImg);
						}
					}
					tempAccountArr.push(tempM1);
				}
				this.showLoading();
				var tempData = {
					account_reason: this.content.replace(/\n/g, '<br>'), //申请事由
					account_sum:this.accountEff,
					account_items: tempAccountArr, //
					approve_mans:approve_mans,
					copy_mans:copy_mans,
					account_type:this.selectAccountTypeArray[this.selectAccountTypeIndex].id,
					apply_man_code: this.personInfo.user_code, //申请人Code
					apply_man_name: this.personInfo.user_name, //申请人姓名
					index_code: this.navItem.index_code,
				}
				console.log('tempData:' + JSON.stringify(tempData));
				// 17.新增报销申请
				this.post(this.globaData.INTERFACE_COSTMS + 'accountApply/addAccountApply', tempData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('accountMineAddRefreshList');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
						this.sendFlag = 0;
					}
				});
			},
			textClick() {
				if(_this.selectAccountTypeIndex==-1){
					_this.showToast('请选择报销类型');
					return;
				}
				if (_this.content.length == 0) {
					_this.showToast("请输入申请事由");
					return;
				}
				if (_this.content.length > 50) {
					_this.showToast("申请事由不能超过50字");
					return;
				}
				if(_this.accountList.length == 0){
					_this.showToast('请添加报销明细');
					return;
				}
				if (_this.selectPeople.length == 0) {
					_this.showToast("请选择接收人");
					return;
				}
				if (_this.sendFlag == 0) {
					_this.sendFlag = 1;
					_this.upLoadImg(0);
				}
			},
			selectPeopleFun(flag) {
				console.log('selectPeopleFunselectPeopleFunselectPeopleFun');
				var data = {
					// needOrder: 1, //需要按照选择人的顺便给值，无全选、反选
					access: 'schapp#'+this.navItem.index_code,
				}
				if(flag == 0){
					data.needOrder = 1;
					data.selectPeople = [];
				}else{
					data.needOrder = 9;
					data.selectPeople = this.copyPeoples;
				}
				util.openwithData("/pages/oa/selectPeople", data, {
					refreshSetPeople(data) { //子页面调用父页面需要的方法
						if(flag == 0){
							for (var i = 0; i < data.data.length; i++) {
								var tempModel = data.data[i];
								tempModel.flowFlag = 0; //1流程，0人员
							}
							_this.selectPeople = _this.selectPeople.concat(data.data);
						}else{
							_this.copyPeoples = data.data;
							var tempM = [];
							for (var i = 0; i < data.data.length; i++) {
								var tempModel = data.data[i];
								tempM.push(tempModel.user_name);
							}
							_this.copyPeoplesStr = tempM.join(',');
						}
					}
				});
			},
			selectFlowFun: function(model) {
				console.log('selectFlowFun:' + JSON.stringify(model));
				this.selectPeople.push(model);
				if (model.list.length == 0) {
					//9.通过ID获取流程审批人
					var tempData = {
						id: model.id, //流程ID
						index_code: this.navItem.index_code,
					}
					this.showLoading();
					this.post(this.globaData.INTERFACE_COSTMS + 'flow/getWorkFlowListById', tempData, (data0, data) => {
						this.hideLoading();
						if (data.code == 0) {
							for (var i = 0; i < this.selectFlowArray.length; i++) {
								var tempM = this.selectFlowArray[i];
								if (tempM.id == model.id) {
									tempM.list = [].concat(data.data.list);
								}
							}
						} else {
							this.showToast(data.msg);
						}
					});
				}
			},
			removeSelectModel: function(index) {
				this.selectPeople.splice(index, 1);
			}
		}
	}
</script>

<style>
	.selectBtn {
		width: 83% !important;
		margin-top: 5px;
		margin-left: 5px;
	}

	.titleTemp {
		margin-left: 15px;
		margin-top: 15px;
		float: left;
		width: 40px;
		font-size: 14px;
		color: #3F3F3F;
	}

	.rightView {
		float: left;
		border: 1px solid gainsboro;
		/* margin: 5px 0 0 0px; */
		font-size: 14px;
		width: calc(100% - 80px);
		height: 35px;
		padding-left: 5px;
	}

	.gotoPeopleView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 50px);
	}

	.uni-checkbox-input:hover {
		border-color: #00CFBD !important;
	}
	
	.line{
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
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
	
	.rowClo {
		text-align: center;
		margin-top: 15px;
		font-size: 12px;
		color: #505050;
	}
	
	.addEditLeft {
		text-align: right;
		margin-top: 20px;
		font-size: 12px;
		color: #505050;
	}
	
	.pickBorder {
		border: 1px solid #e5e5e5;
		width: 160px;
		border-radius: 5px;
	}
	
	::v-deep .mini-date .uni-input {
		text-align: left !important;
		margin-left: 10px;
		font-size: 14px !important;
		color: #000000 !important;
	}
	
	.mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: 40px;
	}
	
	.rightInput {
		margin-top: 10px;
		margin-left: 10px;
		font-size: 14px;
	}
	.peopleImg {
		width: 50px;
		height: 50px;
		border-radius: 5px;
	}
</style>
