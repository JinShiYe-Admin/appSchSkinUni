<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="rightName" :textClick="textClick">
		</mynavBar>
		<view v-if="detailModel.InfoUploadCloseStatus == 1&&detailModel.InfoUploadStatus==1">
			<input maxlength="10" type="text" v-model="tag"
				style="float: right;border: 1px solid gainsboro;margin: 5px 10px 0 0;font-size: 14px;width: 150px;height: 35px;padding-left: 5px;"
				placeholder="请输入我的标签" />
		</view>
		<view v-if="navItem.flag==1||detailModel.InfoUploadCloseStatus == 2||detailModel.InfoUploadStatus==2">
			<button @click="saveTag()" type="default" class="down-btn mini-btn"
				style="float: right;margin-right: 10px;margin-top: 10px;background: #00CFBD;border-color: #00CFBD;color: white;"
				size="mini">保存</button>
			<input maxlength="10" type="text" v-model="tag"
				style="float: right;border: 1px solid gainsboro;margin-bottom: 0px;margin-top: 5px;margin-right: -10px;font-size: 14px;width: 150px;height: 35px;"
				placeholder="请输入我的标签" />
		</view>
		<view style="font-size: 14px;color: #666;float: right;margin-top: 15px;">我的标签：</view>
		<br /><br />
		<view align="center" class="titleCSS" style="font-size: 18px;color: #000;margin-top: 10px;padding: 0 10px;">
			{{detailModel.InfoCollectTitle}}
		</view>
		<view align="center" class="name-timeCSS" style="font-size: 13px;color: #999;">{{detailModel.SendManName}} |
			截止时间：{{detailModel.SendTime}}</view>
		<view v-html="detailModel.InfoCollectContent" class="contentCSS" style="font-size: 14px;color: #666;"></view>
		<view v-for="(extraFile,index) in detailModel.InfoCollectEncAddrShow" :key='index'>
			<view class="encName">附件:
				<a class="" style="font-size: 13px;color: #3c9bfe;margin-left: 10px;"
					@click="checkEnc(extraFile)">附件{{index+1}}</a>
			</view>
		</view>
		<view v-if="navItem.flag == 0||detailModel.InfoCollectStatus !=4">
			<view v-if="detailModel.InfoUploadCloseStatus == 1">
				<view class="" style="height: 10px;background-color: #f2f2f2;"></view>
				<view v-if="detailModel.InfoUploadContent.length > 0"
					style="color: black;font-size: 15px;margin:10px 0 0 15px;">重新提交</view>
				<view v-else-if="detailModel.InfoUploadContent == 0"
					style="color: black;font-size: 15px;margin:10px 0 0 15px;">提交</view>
				<textarea maxlength="50" v-model="content"
					style="border: 1px solid gainsboro;margin: 5px 10px 0 10px;padding: 5px;font-size: 15px;"
					placeholder="请输入要提交的备注" rows="3"></textarea>
				<button @click="replyContent()" class="mini-btn" type="default"
					style="float: right;margin-right: 15px;margin-top: 10px;background: #00CFBD;border-color: #00CFBD;color: white;"
					size="mini">确定</button>
			</view>
			<view v-else-if="detailModel.InfoUploadCloseStatus == 2">
				<view class="" style="height: 10px;background-color: #f2f2f2;"></view>
				<view class="contentCSS" style="font-size: 14px;color: #666;">提交备注：{{detailModel.InfoUploadContent}}
				</view>
				<view v-for="(extraFile,index) in detailModel.UploadEncAddrShow" :key='index'>
					<view class="encName" v-show="extraFile">附件:
						<a class="" style="font-size: 13px;color: #3c9bfe;"
							v-on:click="checkEnc(extraFile)">附件{{index+1}}</a>
					</view>
				</view>
			</view>
		</view>
		<view
			v-if="detailModel.UploadEncAddrShow&&detailModel.UploadEncAddrShow.length>0&&detailModel.InfoUploadCloseStatus == 1"
			style="margin-top: 15px;">
			<view v-for="(extraFile,index) in detailModel.UploadEncAddrShow" :key='index'>
				<view class="encName" v-show="extraFile">附件:
					<a class="" style="font-size: 13px;color: #3c9bfe;margin-left: 10px;"
						@click="checkEnc(extraFile)">附件{{index+1}}</a>
					<a @click="deleteUploadEnc(detailModel.UploadEncAddr[index])"
						style="color: white;background: red;padding: 5px 10px;border-radius: 5px;margin-left: 10px;"
						size="mini">删除</a>
				</view>
			</view>
		</view>
		<view v-if="navItem.flag == 0&&detailModel.InfoUploadCloseStatus == 1&&detailModel.UploadEncAddrShow.length==0"
			class="uni-flex uni-row form-view choose-file">
			<view class="choose-file-text">附件<view class="file-des">
					{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}
				</view>
			</view>
			<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile'
				@imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount">
			</g-upload>
		</view>
		<view v-if="detailModel.noUploadList&&detailModel.noUploadList.length>0">
			<view class="" style="height: 10px;background-color: #f2f2f2;"></view>
			<view class="titleCSS" style="font-size: 14px;color: #333;margin: 10px 0 10px 10px;">未提交列表</view>
			<uni-list>
				<uni-list-item v-for="(replyModel,index) in detailModel.noUploadList" :key='index' direction='column'>
					<view slot="body">
						<view style="float: left;height: 40px;">
							<image class="peopleImg"
								:src="replyModel.ReceiveManPic?replyModel.ReceiveManPic:'http://www.108800.com/user.jpg'">
							</image>
						</view>
						<view class="rightView">
							<a class="biaoti0 title">{{replyModel.ReceiveManName}}</a>
							<!-- :class="replyModel.InfoUploadCloseStatus==1?closeBtn:openBtn" -->
							<button v-if="detailModel.InfoCollectStatus !=4" @click="openCloseUpload(replyModel)"
								type="default" class="down-btn mini-btn"
								style="float: right;margin-right: 10px;margin-top: 10px;color: white;"
								:style="replyModel.InfoUploadCloseStatus==1?'background: orangered;border-color: orangered;':'background: #00CFBD;border-color: #00CFBD;'"
								size="mini">{{replyModel.InfoUploadCloseStatusName}}</button>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<view v-if="detailModel.uploadedList&&detailModel.uploadedList.length>0">
			<view class="" style="height: 10px;background-color: #f2f2f2;"></view>
			<view class="titleCSS" style="font-size: 14px;color: #333;margin-top: 10px;margin-left: 10px;">已提交列表</view>
			<uni-list>
				<uni-list-item v-for="(replyModel,index) in detailModel.uploadedList" :key='index' direction='column'>
					<view slot="body">
						<view style="float: left;height: 40px;">
							<image class="peopleImg"
								:src="replyModel.ReceiveManPic?replyModel.ReceiveManPic:'http://www.108800.com/user.jpg'">
							</image>
						</view>
						<view class="rightView">
							<uni-row class="nameTime">
								<uni-col :span="10">
									{{replyModel.ReceiveManName}}
								</uni-col>
								<uni-col :span="14">
									{{replyModel.UploadTime}}
								</uni-col>
							</uni-row>
							<a class="biaoti0 title">{{replyModel.UploadContent}}</a>
							<view v-if="replyModel.UploadEncAddrShow&&replyModel.UploadEncAddrShow.length>0"
								style="margin-top: 15px;margin-left: -15px;">
								<view v-for="(extraFile,indexEnc) in replyModel.UploadEncAddrShow" :key='indexEnc'>
									<view class="encName" v-show="extraFile">附件:
										<a class="" style="font-size: 13px;color: #3c9bfe;margin-left: 10px;"
											@click="checkEnc(extraFile)">附件{{index+1}}</a>
									</view>
								</view>
							</view>
							<view>
								<button v-if="detailModel.InfoCollectStatus !=4" @click="openCloseUpload(replyModel)"
									type="default" class="down-btn mini-btn"
									style="float: right;margin-right: 10px;margin-top: 10px;color: white;"
									:style="replyModel.InfoUploadCloseStatus==1?'background: orangered;border-color: orangered;':'background: #00CFBD;border-color: #00CFBD;'"
									size="mini">{{replyModel.InfoUploadCloseStatusName}}</button>
								<button v-if="detailModel.InfoCollectStatus !=4&&replyModel.InfoUploadCloseStatus!=2"
									@click="backUpload(replyModel)" type="default" class="down-btn mini-btn"
									style="float: right;margin-top: 10px;background: orangered;border-color: orangered;color: white;margin-right: 10px;"
									size="mini">退回</button>
							</view>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<uni-popup ref="chexiaoguanbiPopup" type="dialog">
			<uni-popup-dialog :title="'确定'+rightName+'吗？'" :duration="2000" :before-close="true" @close="closechexiao"
				@confirm="confirmchexiao"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="openClosePopup" type="dialog">
			<uni-popup-dialog :title="openCloseModel.tempStr" :duration="2000" :before-close="true" @close="close"
				@confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="backupPopup" type="dialog">
			<uni-popup-dialog title="确认要退回吗" :duration="2000" :before-close="true" @close="closeBackup"
				@confirm="confirmBackup"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	// 七牛上传相关
	import gUpload from "@/components/g-upload/g-upload.vue"
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				rightFlag: 0, //右上角是否显示，0不显示，1撤销，2关闭
				rightName: '', //右上角显示名称
				tag: '', //我的标签
				detailModel: {
					uploadedList: [],
					noUploadList: [],
					InfoUploadContent: ''
				},
				canSub: true, //
				content: '',
				openCloseModel: {},
				backupModel: {},
				// 附件上传相关👇
				control: true, //是否显示上传 + 按钮 一般用于显示
				deleteBtn: true, //是否显示删除 按钮 一般用于显示
				maxCount: 1, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount: 1, //单次上传最大数量
				columnNum: 3, //每行显示的图片数量
				imgNames: [], //服务器回传的图片名称
				imgList: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				wxTips: '',
				deleteImg: [], //需要删除的附件
			}
		},
		components: {
			mynavBar,
			gUpload
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.index = 100;
			this.navItem.text = '资料收集详情';
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '资料收集详情'
			});
			//#ifdef H5
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

		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			deleteUploadEnc(url) {
				this.deleteImg.push(url);
				this.detailModel.UploadEncAddrShow = [];
			},
			//附件上传相关👇
			chooseFile(list, v, f) {
				// console.log("上传图片_list：", list)
				// console.log("上传图片_v：", v);
				//  console.log("上传图片_f：", f);
				this.imgList = list
				this.imgFiles = this.imgFiles.concat(f)
				this.maxCount = this.showMaxCount - list.length
			},
			imgDelete(list, eq, fileeq) {
				// console.log("删除图片_list：", list)
				// console.log("删除图片_eq：", eq)
				// console.log("删除图片_fileeq：", fileeq)
				this.imgList = list
				this.imgFiles.splice(fileeq, 1); //删除临时路径
				this.imgNames.splice(eq, 1); //删除文件名
				this.maxCount = this.showMaxCount - list.length
				// console.log("删除图片_fileeq：", this.imgFiles)
			},
			upLoadImg() {
				this.showLoading('正在上传文件...');
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PV_NAME, this.QN_OA_ZLSJ, (encName,
					encAddrStr) => {
					this.hideLoading();
					console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					console.log("names: " + JSON.stringify(encName));
					this.submitData(encName, encAddrStr);
				});
			},
			//附件上传相关👆
			submitData(encNameStr, encAddrStr) {
				console.log('encNameStr:' + JSON.stringify(encNameStr));
				console.log('encAddrStr:' + JSON.stringify(encAddrStr));
				this.showLoading()
				let encNameTemp, encAddrTemp;
				if (encNameStr.length > 0) {
					encNameTemp = encNameStr.join('|');
					encAddrTemp = encAddrStr.join('|');
				} else {
					encNameTemp = this.detailModel.UploadEncName.join('|');
					encAddrTemp = this.detailModel.UploadEncAddr.join('|');
				}
				var tempData1 = {
					infoCollectId: this.navItem.InfoCollectId, //信息收集ID
					receiveManId: this.personInfo.user_code, //上交人ID
					content: this.content, //备注
					encName: encNameTemp, //附件名称
					encAddr: encAddrTemp, //附件地址
					index_code: this.navItem.access.split('#')[1],
					op_code: 'index'
				}
				console.log('tempData1:' + JSON.stringify(tempData1));
				//28.回复通知公告
				this.post(this.globaData.INTERFACE_OA + 'infoCollect/doSetInfoCollectUpload', tempData1, (data0, data) => {
					this.canSub = true;
					this.hideLoading();
					if (data.code == 0) {
						if (this.deleteImg.length > 0) {
							cloudFileUtil.qiniuDelete(this.deleteImg, (data) => {
								console.log('七牛:' + JSON.stringify(data));
							});
						}
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
			textClick() {
				
			},
			checkEnc: function(tempUrl) {
				console.log('tempUrl:' + tempUrl);
				util.openFile(tempUrl);
			},
			saveTag: function() {
				console.log('saveTag');
				if (this.tag != this.detailModel.Tag) {
					var comData = {
						infoCollectId: this.detailModel.InfoCollectId, //信息收集ID
						tag: this.tag, //标签
						index_code: this.navItem.access.split('#')[1],
						op_code: 'index'
					}
					var url = '';
					if (this.navItem.flag == 1) { //我发送的
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
						index_code: this.navItem.access.split('#')[1],
						op_code: 'index'
					}
					//68.修改接收的信息收集标签
					this.post(this.globaData.INTERFACE_OA + 'infoCollect/doSetReceiveInfoCollectTag', comData, (data0,
						data) => {
						if (data.code == 0 && data.data.Result == 1) {
							this.detailModel.Tag = this.tag;
						}
					});
				}
				if (this.content.trim().length == 0) {
					this.showToast("请输入备注");
					return;
				}
				if (this.content.length > 50) {
					this.showToast("备注不能超过50字");
					return;
				}
				if (this.imgList.length == 0 && this.detailModel.UploadEncAddrShow.length == 0) {
					this.showToast("请先选择附件");
					return;
				}
				if (this.canSub) {
					this.canSub = false;
					this.showLoading();
					this.upLoadImg();
				}
			},
			openCloseUpload: function(model) {
				var tempStr = '确认要打开上交吗？';
				if (model.InfoUploadCloseStatus == 1) {
					tempStr = '确认要关闭上交吗？';
				}
				model.tempStr = tempStr;
				this.openCloseModel = model;
				this.$refs.openClosePopup.open();
			},
			close() {
				this.$refs.openClosePopup.close();
			},
			confirm(value) {
				this.$refs.openClosePopup.close();
				var tempFlag = 1;
				if (this.openCloseModel.InfoUploadCloseStatus == 1) {
					tempFlag = 2;
				}
				var comData0 = {
					infoCollectId: this.detailModel.InfoCollectId, //信息收集ID
					receiveManId: this.openCloseModel.ReceiveManId, //上交人ID
					operType: tempFlag, //操作，1 打开2 被关闭
					index_code: this.navItem.access.split('#')[1],
					op_code: 'index'
				};
				this.showLoading();
				//66.打开/关闭某人信息收集
				this.post(this.globaData.INTERFACE_OA + 'infoCollect/doSetInfoCollectUploadOper', comData0, (data0,
					data) => {
						this.hideLoading();
						if (data.code == 0) {
							this.showToast("成功");
							this.getNoticeByReceiveId_sendId_Detail();
						}
					});
			},
			closechexiao() {
				this.$refs.chexiaoguanbiPopup.close();
			},
			confirmchexiao(value) {
				this.$refs.chexiaoguanbiPopup.close();
				if (this.rightFlag == 1) {
					var comData0 = {
						infoCollectId: this.detailModel.InfoCollectId, //信息收集ID
						index_code: this.navItem.access.split('#')[1],
						op_code: 'index',
					};
					this.showLoading();
					//
					this.post(this.globaData.INTERFACE_OA + 'infoCollect/doSetInfoCollectUndo', comData0, (data0,
					data) => {
						this.hideLoading();
						if (data.code == 0) {
							this.showToast("成功");
							this.getNoticeByReceiveId_sendId_Detail();
						}
					});
				} else {
					var comData0 = {
						infoCollectId: this.detailModel.InfoCollectId, //信息收集ID
						isClose: '2', //关闭状态,1 打开2 关闭
						index_code: this.navItem.access.split('#')[1],
						op_code: 'index',
					};
					this.showLoading();
					//
					this.post(this.globaData.INTERFACE_OA + 'infoCollect/doSetInfoCollectClose', comData0, (data0,
					data) => {
						this.hideLoading();
						if (data.code == 0) {
							this.showToast("成功");
							this.getNoticeByReceiveId_sendId_Detail();
						}
					});
				}
			},
			closeBackup() {
				this.$refs.backupPopup.close();
			},
			confirmBackup(value) {
				this.$refs.backupPopup.close();
				var comData0 = {
					infoCollectId: this.detailModel.InfoCollectId, //信息收集ID
					receiveManId: this.backupModel.ReceiveManId, //上交人ID
					index_code: this.navItem.access.split('#')[1],
					op_code: 'index'
				};
				this.showLoading();
				//65.退回信息上交
				this.post(this.globaData.INTERFACE_OA + 'infoCollect/doSetInfoUploadBack', comData0, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast("成功");
						this.getNoticeByReceiveId_sendId_Detail();
					}
				});
			},
			backUpload: function(model) {
				this.$refs.backupPopup.open();
				this.backupModel = model;
			},
			//获取详情
			getNoticeByReceiveId_sendId_Detail() {
				this.showLoading();
				var comData0 = {};
				var url;
				if (this.navItem.flag == 0) { //72.通过信息收集接收表ID获取信息收集
					comData0 = {
						infoUploadId: this.navItem.InfoCollectManId, //信息收集接收表ID
						index_code: this.navItem.access.split('#')[1],
						op_code: 'index'
					}
					url = this.globaData.INTERFACE_OA + 'infoCollect/getInfoCollectByReceiveId';
				} else { //71.通过信息收集ID获取信息收集
					comData0 = {
						infoCollectId: this.navItem.InfoCollectId, //信息收集ID
						index_code: this.navItem.access.split('#')[1],
						op_code: 'index'
					}
					url = this.globaData.INTERFACE_OA + 'infoCollect/getInfoCollectById';
				}
				// 获取收到的协同事务列表（接收人为单人）
				this.post(url, comData0, (data0, data) => {
					this.hideLoading();
					console.log('data:' + JSON.stringify(data));
					this.deleteImg = [];
					if (data.code == 0) {
						if (data.data.InfoCollectEncName) {
							data.data.InfoCollectEncName = data.data.InfoCollectEncName.split("|");
							data.data.InfoCollectEncAddr = data.data.InfoCollectEncAddr.split("|");
							data.data.InfoCollectEncAddrShow = data.data.InfoCollectEncAddr;
						}
						if (data.data.UploadEncName) {
							data.data.UploadEncName = data.data.UploadEncName.split("|");
							data.data.UploadEncAddr = data.data.UploadEncAddr.split("|");
							data.data.UploadEncAddrShow = data.data.UploadEncAddr;
						} else {
							data.data.UploadEncName = [];
							data.data.UploadEncAddr = [];
							data.data.UploadEncAddrShow = [];
						}
						//如果是接收的，判断是否右上角有功能
						if (this.navItem.flag == 1) {
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
									tempM.UploadEncAddrShow = tempM.UploadEncAddr;
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
						if (this.detailModel.InfoCollectEncAddrShow) {
							var getDownToken = {
								appId: this.globaData.QN_APPID, //int 必填 项目id
								appKey: this.globaData.QN_APPKEY,
								urls: this.detailModel.InfoCollectEncAddrShow //array 必填 需要获取下载token文件的路径
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
								this.detailModel.InfoCollectEncAddrShow = [].concat(tempArr);
								console.log('this.detailModel00:' + JSON.stringify(this.detailModel));
							});
						}
						if (this.detailModel.UploadEncAddrShow && this.detailModel.UploadEncAddrShow.length > 0) {
							var getDownToken = {
								appId: this.globaData.QN_APPID, //int 必填 项目id
								appKey: this.globaData.QN_APPKEY,
								urls: this.detailModel.UploadEncAddrShow //array 必填 需要获取下载token文件的路径
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
								this.detailModel.UploadEncAddrShow = [].concat(tempArr);
								console.log('this.detailModel11:' + JSON.stringify(this.detailModel));
							});
						}
						if (this.navItem.flag == 1) {
							for (var i = 0; i < this.detailModel.uploadedList.length; i++) {
								var tempM = this.detailModel.uploadedList[i];
								if (tempM.UploadEncAddrShow) {
									var getDownToken = {
										appId: this.globaData.QN_APPID, //int 必填 项目id
										appKey: this.globaData.QN_APPKEY,
										urls: tempM.UploadEncAddrShow //array 必填 需要获取下载token文件的路径
									}
									var getDownTokenUrl = this.QNGETDOWNTOKENFILE;
									this.showLoading();
									cloudFileUtil.getQNDownToken(getDownTokenUrl, getDownToken, (data, index) => {
										this.hideLoading();
										console.log('七牛下载token ' + JSON.stringify(data));
										var tempArr = [];
										for (var a = 0; a < data.Data.length; a++) {
											var tempM = data.Data[a];
											tempArr.push(tempM.Value);
										}
										this.$set(this.detailModel.uploadedList[index],
											'UploadEncAddrShow', tempArr);
									}, i);
								}
							}
						}
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
		word-break: break-all;
	}

	.titleCSS {
		font-size: 18px;
		color: #000;
	}

	.title {
		height: 100%;
		float: left;
		font-size: 13px;
		word-break: break-all;
		color: #000000;
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

	.nameTime {
		font-size: 13px;
		color: gray;
	}
</style>
