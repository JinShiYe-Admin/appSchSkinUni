<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' :text="rightName" :textClick="textClick">
		</mynavBar>
		<view v-if="detailModel.ApproveStatus==2">
			<input maxlength="10" type="text" v-model="tag"
				style="float: right;border: 1px solid gainsboro;margin: 5px 10px 0 0;font-size: 14px;width: 150px;height: 35px;padding-left: 5px;"
				placeholder="请输入我的标签" />
		</view>
		<view
			v-if="detailModel.ApproveStatus!=2">
			<button @click="saveTag()" type="default" class="down-btn mini-btn"
				style="float: right;margin-right: 10px;margin-top: 10px;background: #00CFBD;border-color: #00CFBD;color: white;"
				size="mini">保存</button>
			<input maxlength="10" type="text" v-model="tag"
				style="float: right;border: 1px solid gainsboro;margin-bottom: 0px;margin-top: 5px;margin-right: -10px;font-size: 14px;width: 150px;height: 35px;"
				placeholder="请输入我的标签" />
		</view>
		<view style="font-size: 14px;color: #666;float: right;margin-top: 15px;">我的标签：</view>
		<br /><br />
		<view align="center" class="titleCSS" style="font-size: 18px;color: #000;margin-top: 10px;">
			{{detailModel.ApplyTitle}}
		</view>
		<view align="center" class="name-timeCSS" style="font-size: 13px;color: #999;">{{detailModel.ApplyManName}} |
			{{detailModel.CreateTime}}
		</view>
		<view v-html="detailModel.ApplyContent" class="contentCSS" style="font-size: 14px;color: #666;"></view>
		<view v-for="(extraFile,index) in detailModel.ApplyEncAddrShow" :key='index'>
			<view class="encName">附件:
				<!-- #ifdef APP-PLUS -->
				<a class="" style="font-size: 13px;color: #3c9bfe;margin-left: 10px;"
					@click="checkEnc(extraFile)">附件{{index+1}}</a>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<uni-link :href="extraFile" style="margin-left: 10px;" :text="'附件'+(index+1)"></uni-link>
				<!-- #endif -->
			</view>
		</view>
		<view v-if="detailModel.ApproveStatus == 2">
			<view class="" style="height: 10px;background-color: #f2f2f2;margin-bottom: 5px;"></view>
			<view style="color: black;size: 15px;margin-left: 15px;">批复</view>
			<!-- <view v-else-if="detailModel.DoneStatus == 2" style="color: black;size: 15px;margin-left: 15px;">
				回复</view> -->
			<!-- <button @click="replyContent(2)" type="button" style="float: right;margin-right: 15px;background: #00CFBD;border-color: #00CFBD;color: white;margin-top: 0px;margin-bottom: 10px;">退回工作流</button> -->
			<button @click="replyContent(2)" class="mini-btn" type="default"
				style="float: right;margin-right: 15px;margin-top: 10px;background: #00CFBD;border-color: #00CFBD;color: white;"
				size="mini">退回工作流</button>
			<textarea maxlength="50" v-model="content"
				style="border: 1px solid gainsboro;margin: 5px 10px 0 10px;padding: 5px;font-size: 15px;"
				placeholder="请输入要批复的内容" rows="3"></textarea>
			<button @click="replyContent(1)" class="mini-btn" type="default"
				style="float: right;margin-right: 15px;margin-top: 10px;background: #00CFBD;border-color: #00CFBD;color: white;"
				size="mini">确定</button>
		</view>
		<view v-show="detailModel.ApproveList&&detailModel.ApproveList.length>0"
			style="itemData.flag == 0 && detailModel.NoticeStatus == 1?'margin-top: 0px;':'margin-top: 50px;'">
			<view class="" style="height: 10px;background-color: #f2f2f2;margin: 10px 0;"></view>
			<view class="titleCSS" style="font-size: 14px;color: #333;margin: 10px 0 10px 10px;">回复列表</view>
			<uni-list>
				<uni-list-item v-for="(replyModel,index) in detailModel.ApproveList" :key='index' direction='column'>
					<view slot="body">
						<view style="float: left;height: 40px;">
							<image class="peopleImg"
								:src="replyModel.ApproveManPic?replyModel.ApproveManPic:'http://www.108800.com/user.jpg'">
							</image>
						</view>
						<view class="rightView">
							<uni-row class="nameTime">
								<uni-col :span="10">
									{{replyModel.ApproveManName}}
								</uni-col>
								<uni-col :span="14">
									{{replyModel.ApproveTime}}
								</uni-col>
							</uni-row>
							<a class="biaoti0 title">{{replyModel.ApproveContent}}</a>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog :title="`确定${this.rightName}吗?`" :duration="2000" :before-close="true" @close="close"
				@confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				rightName: '', //右上角显示名称
				tag: '', //我的标签
				detailModel: {
					uploadedList: [],
					noUploadList: [],
					NoticeContent: ''
				},
				canSub: true, //
				content: '',
				smsConfig: {}, //短信配置
				smsFlag: false, //批复时是否发送短信
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.index = 100;
			this.itemData.text = '工作流详情';
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: '工作流详情'
			});
			//#ifndef APP-PLUS
			document.title = "";
			this.wxTips = ',微信端不支持多选'; //如果是H5，需要提示该内容
			var isPageHide = false;
			window.addEventListener('pageshow', function() {
				if (isPageHide) {
					window.location.reload();
				}
			});
			window.addEventListener('pagehide', function() {
				isPageHide = true;
			});
			//#endif
			//获取详情
			this.getNoticeByReceiveId_sendId_Detail();
			// 如果是接收的，需要发送短信
			if (this.itemData.flag == 0 && this.itemData.SmsSync == 1) {
				this.getSmsConfig();
			}
		},
		methods: {
			getSmsConfig() { //获取短信配置
				let comData = {
					msg_type: this.OA_MSG_SMS.WORKFLOW.MSG_TYPE,
					sch_code: this.personInfo.unit_code,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'smsConf/getConf', comData, response => {
					this.hideLoading();
					console.log("responseaaa: " + JSON.stringify(response));
					if (response) {
						this.smsConfig = response;
						this.smsFlag = true;
					}
				});
			},
			submitData() {
				this.showLoading()
				var tempData1 = {
					noticeId: this.detailModel.NoticeId, //通知ID
					receiveManId: this.personInfo.user_code, //阅读人ID
					replyContent: this.content, //回复内容
					index_code: this.itemData.access.split('#')[1],
					op_code: 'index'
				}
				console.log('tempData1:' + JSON.stringify(tempData1));
				//28.回复通知公告
				this.post(this.globaData.INTERFACE_OA + 'cooperateNotice/doAddNoticeReply', tempData1, (data0, data) => {
					this.canSub = true;
					this.hideLoading();
					if (data.code == 0) {
						this.content = '';
						this.imgNames = [];
						this.imgList = [];
						this.imgFiles = [];
						this.showToast('成功');
						this.getNoticeByReceiveId_sendId_Detail();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			close() {
				this.$refs.popup.close();
			},
			confirm(value) {
				this.$refs.popup.close();
				var comData0 = {
					applyId: this.detailModel.ApplyId,
					index_code: this.itemData.access.split('#')[1],
					op_code: 'index'
				};
				this.showLoading();
				//发送网络请求，data为网络返回值
				this.post(this.globaData.INTERFACE_OA + 'approve/doSetAffairApplyUndo', comData0, (data0, data) => {
					this.hideLoading();
					if (data.code == 0 && data.data.Result == 1) {
						this.showToast("成功");
						this.rightName = '';
					}
				});
			},
			textClick() {
				console.log('textClick');
				this.$refs.popup.open();
			},
			checkEnc: function(tempUrl) {
				console.log('tempUrl:' + tempUrl);
				var urlStr = encodeURI(tempUrl);
				this.showLoading();
				uni.downloadFile({
					url: urlStr,
					success: function(res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							success: function(res) {
								uni.hideLoading();
								console.log('打开文档成功');
							},
							fail() {
								uni.hideLoading();
								uni.showToast({
									title: '当前附件打开失败'
								})
							}
						});
					}
				});
			},
			saveTag: function() {
				console.log('saveTag');
				if (this.tag != this.detailModel.Tag) {
					//19.修改发送的申请标签
					var comData = {
						applyId: this.detailModel.ApplyId, //申请ID
						tag: this.tag, //标签
						index_code: this.itemData.access.split('#')[1],
						op_code: 'index'
					}
					var url = '';
					if (this.itemData.flag == 1) { //我发送的
						url = this.globaData.INTERFACE_OA + 'approve/doSetSendApplyTag';
					} else { //接收的
						comData.receiveManId = this.personInfo.user_code; //阅读人ID
						url = this.globaData.INTERFACE_OA + 'approve/doSetReceiveApplyTag';
					}
					//
					this.post(url, comData, (data0, data) => {
						console.log('修改信息收集标签:' + JSON.stringify(data));
						if (data.code == 0 && data.data.Result == 1) {
							this.showToast("保存成功");
							this.detailModel.Tag = this.tag;
						} else {
							this.showToast(data.msg);
						}
					});
				} else {
					this.showToast('请勿重复保存标签');
				}
			},
			replyContent: function(flag) {
				if (this.content.trim().length == 0) {
					this.showToast("请输入批复内容");
					return;
				}
				if (this.content.length > 50) {
					this.showToast("备注不能超过50字");
					return;
				}
				if (this.canSub) {
					this.canSub = false;
					this.showLoading();
					//18.审批事务及文件申请
					var comData = {
						approveId: this.itemData.access.ApproveId, //审批ID
						approveContent: this.content, //回复内容
						approveResult: flag, //审批结果,1 同意2 退回
						index_code: this.itemData.access.access.split('#')[1],
						op_code: 'index'
					}
					//18.审批事务及文件申请
					this.post(this.globaData.INTERFACE_OA + 'approve/doSetAffairApprove', comData, (data0,
						data) => {
						if (data.code == 0) {
							if (flag == 1 && this.smsFlag) {
								// 110.获取下一级审批人
								var tempData2 = {
									approveId: this.itemData.ApproveId, //审批ID
									index_code: this.itemData.access.split('#')[1],
								}
								this.post(this.globaData.INTERFACE_OA + 'approve/getNextAffairApproveMan',
									tempData2, (data0, manData) => {
										this.hideLoading();
										if (manData.code == 0) {
											if (manData.data.list && manData.data.list.length > 0) {
												// let selectData=message.selectPeople;
												let touser = [];
												// for (var i = 0; i < selectData.length; i++) {
												let obj = {
													gen_type: this.OA_MSG_SMS.WORKFLOW.USER_TYPE,
													dpt_code: manData.data.list[0].ManDeptId,
													dpt_name: manData.data.list[0].ManDept,
													grd_code: '',
													grd_name: '',
													cls_code: '',
													cls_name: '',
													stu_code: '',
													stu_name: '',
													gen_code: manData.data.list[0].ManId,
													gen_name: manData.data.list[0].ManName,
												}
												touser.push(obj);
												// }
												var tempContent = '';
												if (this.smsConfig.content_type == 't') {
													tempContent = this.detailModel.ApplyTitle;
												} else if (this.smsConfig.content_type == 'c') {
													tempContent = this.detailModel.ApplyContent;
												} else if (this.smsConfig.content_type == 'tc') {
													tempContent = '【' + this.detailModel.ApplyTitle + '】' +
														this.detailModel.ApplyContent;
												}
												tempContent = tempContent.replace(/\n/g, '');
												tempContent = tempContent.replace(' ', '');
												var comData = {
													send_unit_code: this.personInfo.unit_code,
													send_user: this.detailModel.ApplyManId,
													send_user_tname: this.detailModel.ApplyManName,
													send_soure: 'schapp#[APP]',
													send_time: this.moment().format(
														'YYYY-MM-DD HH:mm:ss'),
													is_delay: 0,
													delay_time: this.moment().format(
														'YYYY-MM-DD HH:mm:ss'),
													msg_content: tempContent,
													msg_type: this.OA_MSG_SMS.WORKFLOW.MSG_TYPE,
													serviced: this.smsConfig.serviced,
													is_short: 0,
													sms_msgtype_code: this.OA_MSG_SMS.SMS_TYPE,
													sch_code: this.personInfo.unit_code,
													sch_name: this.personInfo.unit_name,
													list: touser,
													index_code: this.itemData.access.split('#')[1],
												}
												this.post(this.globaData.INTERFACE_HR_SUB +
													'smsRecord/save', comData, (data0,
														datas) => {
														if (datas.code == 0) {
															// callback({hr_id:datas.data.id})
															var dosetData = {
																applyId: data.data.Result, //工作流ID
																msgType: this.OA_MSG_SMS.WORKFLOW
																	.MSG_TYPE, //信息类型
																smsMsgtypeCode: this.OA_MSG_SMS
																	.SMS_TYPE, //信息类型代码
																servied: this.smsConfig
																.serviced, //订购状态
																hrSmsid: datas.data.id, //人事短信接口码
																isCheck: '1', //是否已审核
																checkTime: '', //审核时间
																checkUser: '', //审核人代码
																checkUserTname: '', //审核人姓名
																checkUserUnit: '', //审核人单位
																index_code: this.itemData.access
																	.split('#')[1],
															}
															this.post(this.globaData.INTERFACE_OA +
																'approve/doSetSms4AffairApply',
																dosetData, (data0, doData) => {
																	this.hideLoading();
																	const eventChannel = this
																		.getOpenerEventChannel()
																	eventChannel.emit(
																		'refreshWorkflowIndex');
																	uni.navigateBack();
																});
														} else {
															this.hideLoading();
															this.showToast(datas.msg);
														}
													});
											}
										} else {
											this.showToast(data.msg);
										}
									});
							} else {
								this.content = '';
								this.showToast('成功');
								getNoticeByReceiveId_sendId_Detail(curPage.flag);
							}
						} else {
							this.showToast(data.msg);
						}
					});
				}
			},
			//获取详情
			getNoticeByReceiveId_sendId_Detail() {
				this.showLoading();
				var comData0 = {};
				var url;
				if (this.itemData.flag == 0) { //24.通过审批ID获取事务及文件申请及审批
					comData0 = {
						approveId: this.itemData.ApproveId, //审批ID
						index_code: this.itemData.access.split('#')[1],
						op_code: 'index'
					}
					url = this.globaData.INTERFACE_OA + 'approve/getAffairApproveById';
				} else { //23.通过申请ID获取事务及文件申请
					comData0 = {
						applyId: this.itemData.ApplyId, //申请ID
						index_code: this.itemData.access.split('#')[1],
						op_code: 'index'
					}
					url = this.globaData.INTERFACE_OA + 'approve/getAffairApplyById';
				}
				// 获取收到的协同事务列表（接收人为单人）
				this.post(url, comData0, (data0, data) => {
					this.hideLoading();
					console.log('data:' + JSON.stringify(data));
					if (data.code == 0) {
						if (data.data.ApplyEncName) {
							data.data.ApplyEncName = data.data.ApplyEncName.split("|");
							data.data.ApplyEncAddr = data.data.ApplyEncAddr.split("|");
							data.data.ApplyEncAddrShow = data.data.ApplyEncAddr;
						}
						//如果是接收的，判断是否右上角有功能
						if (this.itemData.flag == 1) {
							// 进程处于“新建”且 状态处于“发出”时 显示撤销按钮
							if (data.data.Progress == 1 && data.data.Status == 1) {
								this.rightName = '撤销';
							}
						}
						this.tag = data.data.Tag;
						this.detailModel = data.data;
						if (this.detailModel.ApplyEncAddrShow) {
							var getDownToken = {
								appId: this.globaData.QN_APPID, //int 必填 项目id
								appKey: this.globaData.QN_APPKEY,
								urls: this.detailModel.ApplyEncAddrShow //array 必填 需要获取下载token文件的路径
							}
							var getDownTokenUrl = this.QNGETDOWNTOKENFILE;
							this.showLoading();
							cloudFileUtil.getQNDownToken(getDownTokenUrl, getDownToken, (data) => {
								this.hideLoading();
								console.log('七牛下载token ' + JSON.stringify(data));
								var tempArr = [];
								for (var i = 0; i < data.Data.length; i++) {
									var tempM = data.Data[i];
									tempArr.push(tempM.Value);
								}
								this.detailModel.ApplyEncAddrShow = [].concat(tempArr);
								console.log('this.detailModel11:' + JSON.stringify(this.detailModel));
							});
						}
						console.log('this.detailModel:' + JSON.stringify(this.detailModel));
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.contentCSS {
		margin: 5px 15px 5px 15px;
		font-size: 14px;
		color: #666;
		word-break: break-all;
	}

	.titleCSS {
		font-size: 18px;
		color: #000;
	}

	.name-timeCSS {
		margin-top: 5px;
		font-size: 12px;
		color: #999;
	}

	.encName {
		margin-left: 15px;
		margin-right: 15px;
		margin-bottom: 10px;
		font-size: 14px;
		color: #333;
	}

	.prev-btn,
	.down-btn {
		margin-left: 20px;
	}

	uni-textarea {
		width: auto;
		height: 80px;
	}

	.uni-input-placeholder {
		padding-left: 5px;
	}

	.uni-input-input {
		padding-left: 5px;
	}

	.peopleImg {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 50px);
	}

	.biaoti {
		font-size: 13px;
		width: calc(100% - 50px);
	}

	.biaoti0 {
		font-size: 13px;
		width: calc(100%);
	}

	.title {
		height: 100%;
		float: left;
		font-size: 13px;
		word-break: break-all;
		color: #000000;
	}

	.nameTime {
		font-size: 13px;
		color: gray;
	}
</style>
