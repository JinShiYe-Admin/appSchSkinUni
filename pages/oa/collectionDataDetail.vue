<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' :text="rightName" :textClick="textClick">
		</mynavBar>
		<view v-if="detailModel.InfoUploadCloseStatus == 1&&detailModel.InfoUploadStatus==1">
			<input maxlength="10" type="text" v-model="tag"
				style="float: right;border: 1px solid gainsboro;margin: 5px 10px 0 0;font-size: 14px;width: 150px;height: 35px;padding-left: 5px;"
				placeholder="请输入我的标签" />
		</view>
		<view v-if="itemData.flag==1||detailModel.InfoUploadCloseStatus == 2||detailModel.InfoUploadStatus==2">
			<button v-on:click.stop="saveTag()" type="button" class="down-btn"
				style="float: right;margin-right: 10px;margin-top: 7px;background: #00CFBD;border-color: #00CFBD;color: white;">保存</button>
			<input maxlength="10" type="text" v-model="tag"
				style="float: right;border: 1px solid gainsboro;margin-bottom: 0px;margin-top: 5px;margin-right: -10px;font-size: 14px;width: 150px;height: 35px;"
				placeholder="请输入我的标签" />
		</view>
		<view style="font-size: 14px;color: #666;float: right;margin-top: 15px;">我的标签：</view>
		<br /><br />
		<view align="center" class="titleCSS" style="font-size: 18px;color: #000;margin-top: 10px;">
			{{detailModel.InfoCollectTitle}}</view>
		<view align="center" class="name-timeCSS" style="font-size: 13px;color: #999;">{{detailModel.SendManName}} |
			截止时间：{{detailModel.SendTime}}</view>
		<view v-html="detailModel.InfoCollectContent" class="contentCSS" style="font-size: 14px;color: #666;"></view>
		<view v-for="(extraFile,index) in detailModel.InfoCollectEncName" :key='index'>
			<view class="encName" v-show="extraFile">附件:
				<a class="" style="font-size: 13px;color: #3c9bfe;"
					v-on:click="checkEnc(detailModel.InfoCollectEncAddr[index])">附件{{index+1}}</a>
			</view>
		</view>
		<view v-if="itemData.flag == 0||detailModel.InfoCollectStatus !=4">
			<view v-if="detailModel.InfoUploadCloseStatus == 1">
				<view class="" style="height: 10px;background-color: #f2f2f2;"></view>
				<view v-if="detailModel.InfoUploadContent.length > 0"
					style="color: black;font-size: 15px;margin:10px 0 0 15px;">重新提交</view>
				<view v-else-if="detailModel.InfoUploadContent == 0"
					style="color: black;font-size: 15px;margin:10px 0 0 15px;">提交</view>
				<!-- <view style="padding-top: 5px;height: 170px;"> -->
				<textarea maxlength="50" v-model="content"
					style="border: 1px solid gainsboro;margin: 5px 10px 0 10px;padding: 5px;font-size: 15px;" placeholder="请输入要提交的备注" rows="4"></textarea>
				<button @click="replyContent()" class="mini-btn" type="default" style="float: right;margin-right: 15px;margin-top: 10px;background: #00CFBD;border-color: #00CFBD;color: white;" size="mini">确定</button>
				<!-- </view> -->
			</view>
			<view v-else-if="detailModel.InfoUploadCloseStatus == 2">
				<view class="" style="height: 10px;background-color: #f2f2f2;"></view>
				<view class="contentCSS" style="font-size: 14px;color: #666;">提交备注：{{detailModel.InfoUploadContent}}
				</view>
				<view v-for="(extraFile,index) in detailModel.UploadEncName" :key='index'>
					<view class="encName" v-show="extraFile">附件:
						<a class="" style="font-size: 13px;color: #3c9bfe;"
							v-on:click="checkEnc(detailModel.UploadEncAddr[index])">附件{{index+1}}</a>
					</view>
				</view>
			</view>
		</view>
		<!-- <view id="MultiMedia" v-show="detailModel.InfoUploadCloseStatus == 1" :class="itemData.flag==0?classA:classB">
		</view> -->
		<view v-if="detailModel.noUploadList&&detailModel.noUploadList.length>0">
			<view class="" style="height: 10px;background-color: #f2f2f2;"></view>
			<view class="titleCSS" style="font-size: 14px;color: #333;margin-top: 10px;margin-left: 10px;">未提交列表</view>
			<ul class="mui-table-view">
				<li class="mui-table-view-cell" v-for="(replyModel,index) in detailModel.noUploadList" :key='index'>
					<view>
						<img class="mui-media-object mui-pull-left peopleImg" :src=replyModel.ReceiveManPic>
						<a class="" style="font-size: 14px;color: #666;">
							{{replyModel.ReceiveManName}}
						</a>
						<button v-if="detailModel.InfoCollectStatus !=4" @click="openCloseUpload(replyModel)"
							type="button" :class="replyModel.InfoUploadCloseStatus==1?closeBtn:openBtn"
							class="mui-btn">{{replyModel.InfoUploadCloseStatusName}}</button>
					</view>
				</li>
			</ul>
		</view>
		<view v-if="detailModel.uploadedList&&detailModel.uploadedList.length>0">
			<view class="" style="height: 10px;background-color: #f2f2f2;"></view>
			<view class="titleCSS" style="font-size: 14px;color: #333;margin-top: 10px;margin-left: 10px;">已提交列表</view>
			<ul class="mui-table-view">
				<li class="mui-table-view-cell" v-for="(replyModel,index) in detailModel.uploadedList" :key='index'>
					<view>
						<img class="mui-media-object mui-pull-left peopleImg" :src=replyModel.ReceiveManPic>
						<a class="" style="font-size: 14px;color: #666;">
							{{replyModel.ReceiveManName}}
							<a style="font-size: 14px;color: #666;float: right;">{{replyModel.UploadTime}}</a>
							<view class="chat_content_left">
								<p style="color: #666;font-size: 13px; white-space:pre-wrap;">
									{{replyModel.UploadContent}}</p>
							</view>
							<view v-for="(extraFile,indexEnc) in replyModel.UploadEncName" :key='indexEnc'>
								<view style="font-size: 13px;color: #333;margin-top: 7px;" v-show="extraFile">附件:
									<a class="" style="font-size: 13px;color: #3c9bfe;"
										v-on:click="checkEnc(replyModel.UploadEncAddr[indexEnc])">附件{{index+1}}</a>
								</view>
							</view>
							<button v-if="detailModel.InfoCollectStatus !=4" @click="openCloseUpload(replyModel)"
								type="button" :class="replyModel.InfoUploadCloseStatus==1?closeBtn:openBtn"
								class="mui-btn">{{replyModel.InfoUploadCloseStatusName}}</button>
							<button v-if="detailModel.InfoCollectStatus !=4&&replyModel.InfoUploadCloseStatus!=2"
								@click="backUpload(replyModel)" type="button"
								style="float: right;margin-top: 3px;background: orangered;border-color: orangered;color: white;margin-right: 10px;"
								class="mui-btn">退回</button>
						</a>
					</view>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				rightFlag: 0, //右上角是否显示，0不显示，1撤销，2关闭
				rightName: '', //右上角显示名称
				tag: '', //我的标签
				detailModel: {
					uploadedList: [],
					noUploadList: [],
					InfoUploadContent: ''
				},
				content: ''
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
			this.itemData.text = '资料收集详情';
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: '资料收集详情'
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//获取详情
			this.getNoticeByReceiveId_sendId_Detail();
		},
		methods: {
			textClick() {
				console.log('textClicktextClick');
			},
			checkEnc: function(tempUrl) {
				var getDownToken = {
					appId: this.globaData.QN_APPID, //int 必填 项目id
					appKey: this.globaData.QN_APPKEY,
					urls: [tempUrl] //array 必填 需要获取下载token文件的路径
				}
				var getDownTokenUrl = this.globaData.QNGETDOWNTOKENFILE;
				// CloudFileUtil.getQNDownToken(getDownTokenUrl, getDownToken, function(data) {
				// 	console.log('七牛下载token ' + JSON.stringify(data));
				// 	var urlStr = encodeURI(data.Data[0].Value)
				// 	plus.runtime.openURL(urlStr);
				// }, function(xhr, type, errorThrown) {
				// 	this.showToast('获取文件失败 ' + type);
				// });
			},
			saveTag: function() {
				console.log('saveTag');
				if (this.tag != this.detailModel.Tag) {
					var comData = {
						infoCollectId: this.detailModel.InfoCollectId, //信息收集ID
						tag: this.tag, //标签
						index_code: this.itemData.access.split('#')[1],
						op_code: 'index'
					}
					var url = '';
					if (this.itemData.flag == 1) { //我发送的
						url = this.globaData.INTERFACE_OA + 'infoCollect/doSetSendInfoCollectTag';
					} else { //接收的
						comData.receiveManId = this.personInfo.user_code; //阅读人ID
						url = this.globaData.INTERFACE_OA + 'infoCollect/doSetReceiveInfoCollectTag';
					}
					//67.修改发送的信息收集标签
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
			replyContent: function() {
				if (this.tag != this.detailModel.Tag) {
					//68.修改接收的信息收集标签
					var comData = {
						infoCollectId: this.detailModel.InfoCollectId, //通知ID
						receiveManId: this.personInfo.user_code, //阅读人ID
						tag: this.tag, //标签
						index_code: this.itemData.access.split('#')[1],
						op_code: 'index'
					}
					//68.修改接收的信息收集标签
					this.post(this.globaData.INTERFACE_OA + 'infoCollect/doSetReceiveInfoCollectTag', comData, (data0,
						data) => {
						console.log('68.修改接收的信息收集标签:' + JSON.stringify(data));
						if (data.code == 0 && data.data.Result == 1) {
							this.detailModel.Tag = this.tag;
						}
					});
				}
				if (this.content.trim().length == 0) {
					this.showToast("请输入备注", "cancel");
					return;
				}
				if (this.content.length > 50) {
					this.showToast("备注不能超过50字", "cancel");
					return;
				}
				if (multiMedia.data.PictureArray.length == 0) {
					this.showToast("请先选择附件", "cancel");
					return;
				}
				var fj = [];
				for (var i = 0; i < multiMedia.data.PictureArray.length; i++) {
					if (multiMedia.data.PictureArray[i].path.indexOf('http://') != -1 || multiMedia.data.PictureArray[
							i].path.indexOf('https://') != -1) {
						continue
					}
					fj.push('1');
				}
				if (fj.length == 0) {
					var tempUrl = multiMedia.data.PictureArray[0].path.split("?")[0];
					var oriName = tempUrl.substring(tempUrl.lastIndexOf("/") + 1);
					console.log('tempUrl:' + tempUrl);
					console.log('oriName:' + oriName);
					addNotice('3', tempUrl, '', 0, oriName);
				} else {
					//上传文件
					// qn_upload.uploadFile(wd, function(wd, type, encAddrStr, encImgrStr, encLen, encNameStr) {
					// 	addNotice(type, encAddrStr, encImgrStr, encLen, encNameStr);
					// });
				}
			},
			openCloseUpload: function(model) {
				var tempStr = '确认要打开上交吗？';
				if (model.InfoUploadCloseStatus == 1) {
					tempStr = '确认要关闭上交吗？';
				}
				var btnArray = ['否', '是'];
				mui.confirm(tempStr, '确认', btnArray, function(e) {
					if (e.index == 1) {
						this.showLoading();
						var tempFlag = 1;
						if (model.InfoUploadCloseStatus == 1) {
							tempFlag = 2;
						}
						//66.打开/关闭某人信息收集
						var tempData1 = {
							infoCollectId: this.detailModel.InfoCollectId, //信息收集ID
							receiveManId: model.ReceiveManId, //上交人ID
							operType: tempFlag, //操作，1 打开2 被关闭
							index_code: this.itemData.access.split('#')[1],
							op_code: 'index'
						}
						//66.打开/关闭某人信息收集
						this.post(this.globaData.INTERFACE_OA + 'infoCollect/doSetInfoCollectUploadOper',
							tempData1, (data0, data) => {
								this.hideLoading();
								if (data.code == 0) {
									this.showToast('成功');
									this.getNoticeByReceiveId_sendId_Detail();
								} else {
									this.showToast(data.msg);
								}
							});
					}
				})
			},
			backUpload: function(model) {
				var btnArray = ['否', '是'];
				mui.confirm('确认要退回吗？', '确认', btnArray, function(e) {
					if (e.index == 1) {
						this.showLoading();
						//65.退回信息上交
						var tempData1 = {
							infoCollectId: this.detailModel.InfoCollectId, //信息收集ID
							receiveManId: model.ReceiveManId, //上交人ID
							index_code: this.itemData.access.split('#')[1],
							op_code: 'index'
						}
						//65.退回信息上交
						this.post(this.globaData.INTERFACE_OA + 'infoCollect/doSetInfoUploadBack', tempData1, (
							data0, data) => {
							this.hideLoading();
							if (data.code == 0) {
								this.showToast('成功');
								this.getNoticeByReceiveId_sendId_Detail();
							} else {
								this.showToast(data.msg);
							}
						});
					}
				})
			},
			addNotice(encType, encAddr, encImg, encLen, encName) {
				if (this.content.trim().length == 0) {
					this.showToast("请输入备注", "cancel");
					return;
				}
				if (this.content.length > 50) {
					this.showToast("备注不能超过50字", "cancel");
					return;
				}
				// //28.回复通知公告
				var tempData1 = {
					infoCollectId: this.itemData.InfoCollectId, //信息收集ID
					receiveManId: this.personInfo.user_code, //上交人ID
					content: this.content, //备注
					encName: encName, //附件名称
					encAddr: encAddr, //附件地址
					index_code: this.itemData.access.split('#')[1],
					op_code: 'index'
				}
				//28.回复通知公告
				this.post(this.globaData.INTERFACE_OA + 'infoCollect/doSetInfoCollectUpload', tempData1, (data0, data) => {
					encNameList = [];
					this.hideLoading();
					if (data.code == 0) {
						this.content = '';
						// multiMedia.imageRefresh();
						this.showToast('成功');
						this.getNoticeByReceiveId_sendId_Detail();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//获取详情
			getNoticeByReceiveId_sendId_Detail() {
				this.showLoading();
				var comData0 = {};
				var url;
				if (this.itemData.flag == 0) { //72.通过信息收集接收表ID获取信息收集
					comData0 = {
						infoUploadId: this.itemData.InfoCollectManId, //信息收集接收表ID
						index_code: this.itemData.access.split('#')[1],
						op_code: 'index'
					}
					url = this.globaData.INTERFACE_OA + 'infoCollect/getInfoCollectByReceiveId';
				} else { //71.通过信息收集ID获取信息收集
					comData0 = {
						infoCollectId: this.itemData.InfoCollectId, //信息收集ID
						index_code: this.itemData.access.split('#')[1],
						op_code: 'index'
					}
					url = this.globaData.INTERFACE_OA + 'infoCollect/getInfoCollectById';
				}
				// 获取收到的协同事务列表（接收人为单人）
				this.post(url, comData0, (data0, data) => {
					this.hideLoading();
					console.log('data:' + JSON.stringify(data));
					if (data.code == 0) {
						if (data.data.InfoCollectEncName) {
							data.data.InfoCollectEncName = data.data.InfoCollectEncName.split("|");
							data.data.InfoCollectEncAddr = data.data.InfoCollectEncAddr.split("|");
						}
						if (data.data.UploadEncName) {
							data.data.UploadEncName = data.data.UploadEncName.split("|");
							data.data.UploadEncAddr = data.data.UploadEncAddr.split("|");
							if (data.data.UploadEncAddr.length > 0) {
								// multiMedia.addImages(data.data.UploadEncAddr);
								// multiMedia.options.imageId = data.data.UploadEncAddr.length + 1;
								var getDownToken = {
									appId: this.globaData.QN_APPID, //int 必填 项目id
									appKey: this.globaData.QN_APPKEY,
									urls: data.data.UploadEncAddr //array 必填 需要获取下载token文件的路径
								}
								// var getDownTokenUrl = this.globaData.QNGETDOWNTOKENFILE;
								// CloudFileUtil.getQNDownToken(getDownTokenUrl, getDownToken, function(data) {
								// 	console.log('七牛下载token ' + JSON.stringify(data));
								// 	// var urlStr = encodeURI(data.Data[0].Value)
								// 	// plus.runtime.openURL(urlStr);
								// 	var tepArr = [];
								// 	tepArr.push(data.Data[0].Value);
								// 	multiMedia.addImages(tepArr);
								// 	multiMedia.options.imageId = data.Data.length + 1;
								// }, function(xhr, type, errorThrown) {
								// 	this.showToast('获取文件失败 ' + type);
								// });
							}
						}
						//如果是接收的，判断是否右上角有功能
						if (this.itemData.flag == 1) {
							for (var i = 0; i < data.data.noUploadList.length; i++) {
								var tempM = data.data.noUploadList[i];
								if (tempM.InfoUploadCloseStatus == 1) {
									tempM.InfoUploadCloseStatusName = '关闭上交';
								} else {
									tempM.InfoUploadCloseStatusName = '打开上交';
								}
							}
							for (var i = 0; i < data.data.uploadedList.length; i++) {
								var tempM = data.data.uploadedList[i];
								if (tempM.UploadEncName) {
									tempM.UploadEncName = tempM.UploadEncName.split("|");
									tempM.UploadEncAddr = tempM.UploadEncAddr.split("|");
								}
								if (tempM.InfoUploadCloseStatus == 1) {
									tempM.InfoUploadCloseStatusName = '关闭上交';
								} else {
									tempM.InfoUploadCloseStatusName = '打开上交';
								}
							}
							console.log('11111');
							// 进程处于“新建”且 状态处于“发出”时 显示撤销按钮
							if (data.data.InfoCollectProgress == 1 && data.data.InfoCollectStatus == 1) {
								console.log('222222');
								this.rightFlag = 1;
								this.rightName = '撤销';
							} else if ((data.data.InfoCollectStatus == 1 || data.data.InfoCollectStatus == 3) &&
								data.data.InfoCollectProgress != 1) { // 状态处于发出或部分关闭 且 进程为收集中 或完毕 即 不是新建 显示关闭按钮
								console.log('333333');
								this.rightFlag = 2;
								this.rightName = '关闭';
							}
						}
						this.tag = data.data.Tag;
						this.detailModel = data.data;
						console.log('this.detailModel:' + JSON.stringify(this.detailModel));
						//将之前提交的资料，塞入默认数据
						this.content = data.data.InfoUploadContent;
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
		font-size: 14px;
		color: #333;
	}
	
	.prev-btn,
	.down-btn {
		margin-left: 20px;
	}

	uni-textarea {
		width: auto;
	}
</style>
