<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="确定" :textClick="textClick">
		</mynavBar>
		<view class="titleTemp">金额</view>
		<input type="number" v-model="title" maxlength="8" class="rightView" style="margin-top: 10px;"
			placeholder="请输入金额" />
		<view class="titleTemp">事由</view>
		<textarea maxlength="300" v-model="content" class="rightView"
			style="height: 80px;margin-top: 10px;padding-top: 5px;margin-bottom: 10px;" placeholder="请输入申请事由"></textarea>
		<!-- <view class="line"></view> -->
		<view class="uni-flex uni-row form-view choose-file">
			<view class="choose-file-text">附件<view class="file-des">
					{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}
				</view>
			</view>
			<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile'
				@imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount">
			</g-upload>
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
				maxCount: 5, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount: 5, //单次上传最大数量
				columnNum: 3, //每行显示的图片数量
				imgNames: [], //服务器回传的图片名称
				imgList: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				wxTips: '',
				copyPeoples:[],
				copyPeoplesStr:''
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
			this.navItem.text = '新建费用申请';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '新建费用申请'
			});
			//#ifdef H5
			document.title = "";
			this.wxTips = ',微信端不支持多选'; //如果是H5，需要提示该内容
			//#endif
			//
			// 8.获取全部流程列表
			var tempData = {
				flow_name:'',
				flow_type: 1, //流程类型，0 全部，1 费用申请流程,2 费用报销流程
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
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			selectFlowChange(e) {
				console.log('picker发送选择改变，携带值为', e.target.value);
				this.selectFlowFun(this.selectFlowArray[e.target.value]);
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
			upLoadImg() {
				this.showLoading();
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PB_NAME, this.QN_CWGL_FY, (encName,
					encAddrStr) => {
					this.hideLoading();
					console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					console.log("names: " + JSON.stringify(encName));
					this.submitData(encName, encAddrStr);
				});
			},
			//附件上传相关👆
			submitData(encNameStr, encAddrStr) {
				var enc_list = []; //附件列表
				for (var i = 0; i < encNameStr.length; i++) {
					var tempM = {
						enc_name:encNameStr[i],
						enc_addr:encAddrStr[i]
					}
					enc_list.push(tempM);
				}
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
				console.log('this.content:' + this.content);
				this.showLoading();
				var tempData = {
					apply_fee: parseFloat(this.title).toFixed(1), //申请金额
					apply_reason: this.content.replace(/\n/g, '<br>'), //申请事由
					enc_list: enc_list, //附件
					approve_mans:approve_mans,
					copy_mans:copy_mans,
					apply_man_code: this.personInfo.user_code, //申请人Code
					apply_man_name: this.personInfo.user_name, //申请人姓名
					index_code: this.navItem.index_code,
					// op_code: 'add'

				}
				console.log('tempData:' + JSON.stringify(tempData));
				//10.新增费用申请
				this.post(this.globaData.INTERFACE_COSTMS + 'costApply/addCostApply', tempData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('addRefreshList');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
						this.sendFlag = 0;
					}
				});
			},
			textClick() {
				if (_this.content.length > 300) {
					_this.showToast("内容不能超过300字");
					return;
				}

				if (_this.selectPeople.length == 0) {
					_this.showToast("请选择接收人");
					return;
				}
				if (_this.sendFlag == 0) {
					_this.sendFlag = 1;
					_this.upLoadImg();
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
		color: black;
		margin-left: 10px;
		margin-top: 15px;
		float: left;
		width: 40px;
	}

	.rightView {
		float: left;
		border: 1px solid gainsboro;
		/* margin: 5px 0 0 0px; */
		font-size: 14px;
		width: calc(100% - 70px);
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
</style>
