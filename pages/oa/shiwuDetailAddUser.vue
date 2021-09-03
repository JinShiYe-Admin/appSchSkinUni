<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' :icon="rightIcon" :iconClick="iconClick"
			:text="rightName" :textClick="textClick">
		</mynavBar>
		<view v-if="itemData.flag==0&&detailModel.NoticeStatus==1&&detailModel.NoticeProgress!=3">
			<input maxlength="10" type="text" v-model="tag"
				style="float: right;border: 1px solid gainsboro;margin: 5px 10px 0 0;font-size: 14px;width: 150px;height: 35px;padding-left: 5px;"
				placeholder="请输入我的标签" />
		</view>
		<view
			v-if="itemData.flag==1||detailModel.NoticeStatus==2||detailModel.NoticeStatus==3||detailModel.NoticeProgress==3">
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
			{{detailModel.NoticeTitle}}
		</view>
		<view align="center" class="name-timeCSS" style="font-size: 13px;color: #999;">{{detailModel.SendManName}} |
			{{detailModel.SendTime}}
		</view>
		<view v-html="detailModel.NoticeContent" class="contentCSS" style="font-size: 14px;color: #666;"></view>
		<view v-for="(extraFile,index) in detailModel.NoticeEncAddrShow" :key='index'>
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
		<view v-if="itemData.flag==0&&detailModel.NoticeStatus==1">
			<view class="" style="height: 10px;background-color: #f2f2f2;margin-bottom: 5px;"></view>
			<view v-if="detailModel.DoneStatus == 1" style="color: black;size: 15px;margin-left: 15px;">继续回复</view>
			<view v-else-if="detailModel.DoneStatus == 2" style="color: black;size: 15px;margin-left: 15px;">
				回复</view>
			<textarea maxlength="50" v-model="content"
				style="border: 1px solid gainsboro;margin: 5px 10px 0 10px;padding: 5px;font-size: 15px;"
				placeholder="请输入要回复的内容" rows="3"></textarea>
			<button @click="replyContent()" class="mini-btn" type="default"
				style="float: right;margin-right: 15px;margin-top: 10px;background: #00CFBD;border-color: #00CFBD;color: white;"
				size="mini">确定</button>
		</view>
		<view v-if="itemData.flag == 0 && detailModel.NoticeStatus == 1" class="uni-flex uni-row form-view choose-file">
			<view class="choose-file-text">附件<view class="file-des">
					{{`(最多可选择${this.showMaxCount}张照片${this.wxTips?this.wxTips:''})`}}
				</view>
			</view>
			<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile'
				@imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount">
			</g-upload>
		</view>
		<view v-show="detailModel.list&&detailModel.list.length>0"
			style="itemData.flag == 0 && detailModel.NoticeStatus == 1?'margin-top: 0px;':'margin-top: 50px;'">
			<view class="" style="height: 10px;background-color: #f2f2f2;margin: 10px 0;"></view>
			<view class="titleCSS" style="font-size: 14px;color: #333;margin: 10px 0 10px 10px;">回复列表</view>
			<uni-list>
				<uni-list-item v-for="(replyModel,index) in detailModel.list" :key='index' direction='column'>
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
									{{replyModel.ReplyTime}}
								</uni-col>
							</uni-row>
							<a class="biaoti0 title">{{replyModel.ReplyContent}}</a>
							<view v-if="replyModel.EncAddrShow" style="margin-top: 25px;">
								<view v-for="(extraFile,index) in replyModel.EncAddrShow" :key='index'>
									<view class="encName" style="margin-left: 0px;">附件:
										<!-- #ifdef APP-PLUS -->
										<a class="" style="font-size: 13px;color: #3c9bfe;margin-left: 10px;"
											@click="checkEnc(extraFile)">附件{{index+1}}</a>
										<!-- #endif -->
										<!-- #ifdef H5 -->
										<uni-link :href="extraFile" style="margin-left: 10px;" :text="'附件'+(index+1)">
										</uni-link>
										<!-- #endif -->
									</view>
								</view>
							</view>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog :title="`确定${this.rightName}吗?`" :duration="2000" :before-close="true" @close="close"
				@confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="popupPeople" type="dialog">
			<uni-popup-dialog :title="popupAddPeople" :duration="2000" :before-close="true" @close="closePeople"
				@confirm="confirmPeople"></uni-popup-dialog>
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
				itemData: {},
				rightName: '', //右上角显示名称
				rightIcon: '', //右上角添加人员按钮
				tag: '', //我的标签
				detailModel: {
					uploadedList: [],
					noUploadList: [],
					NoticeContent: ''
				},
				canSub: true, //
				content: '',
				selectPeople: [],
				beforeSelectPeople: [],
				popupAddPeople: '',
				receiveManIds: [],
				receiveManCodes: [],
				receiveManNames: [],
				receiveManPics: [],
				// 附件上传相关👇
				control: true, //是否显示上传 + 按钮 一般用于显示
				deleteBtn: true, //是否显示删除 按钮 一般用于显示
				maxCount: 9, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount: 9, //单次上传最大数量
				columnNum: 3, //每行显示的图片数量
				imgNames: [], //服务器回传的图片名称
				imgList: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				wxTips: ''
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
			this.itemData = util.getPageData(option);
			this.itemData.index = 100;
			this.itemData.text = '事务详情';
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: '事务详情'
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
		},
		methods: {
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
				// console.log("删除图片_fileeq：", this.imgFiles)
			},
			upLoadImg() {
				this.showLoading('正在上传文件...');
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PV_NAME, this.QN_OA_SHIW, (encName,
					encAddrStr) => {
					this.hideLoading();
					this.submitData(encName, encAddrStr);
				});
			},
			//附件上传相关👆
			submitData(encNameStr, encAddrStr) {
				this.showLoading()
				let encNameTemp = '';
				let encAddrTemp = '';
				if (encNameStr.length > 0) {
					encNameTemp = encNameStr.join('|');
					encAddrTemp = encAddrStr.join('|');
				} else {
					// encNameTemp = this.detailModel.UploadEncName.join('|');
					// encAddrTemp = this.detailModel.UploadEncAddr.join('|');
				}
				var tempData1 = {
					noticeId: this.detailModel.NoticeId, //通知ID
					receiveManId: this.personInfo.user_code, //阅读人ID
					replyContent: this.content, //回复内容
					encName: encNameTemp, //附件名称
					encAddr: encAddrTemp, //附件地址
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
			iconClick() {
				var data = {
					flag: 1, //1 事务
					needOrder: 0,
					access: this.itemData.access,
					selectPeople: this.selectPeople
				}
				util.openwithData("/pages/oa/selectPeople", data, {
					refreshSetPeople(data) { //子页面调用父页面需要的方法
						let beforeSelectPeople = _this.beforeSelectPeople;
						let selectPeople = data.data;
						_this.selectPeople = selectPeople;
						let repeatUsers = [];
						let afterSelectPeople = [].concat(selectPeople);
						beforeSelectPeople.map(aItem => {
							afterSelectPeople.map((item, index) => {
								if (item.user_code === aItem) {
									repeatUsers.push(item.user_name);
									afterSelectPeople.splice(index, 1);
								}
							})
						});
						_this.receiveManIds = [];
						_this.receiveManCodes = [];
						_this.receiveManNames = [];
						_this.receiveManPics = [];
						afterSelectPeople.map(aItem => {
							_this.receiveManIds.push(aItem.user_code);
							_this.receiveManCodes.push("");
							_this.receiveManNames.push(aItem.user_name);
							_this.receiveManPics.push(aItem.user_img ? aItem.user_img : '');
						})
						// console.log("repeatUsers" + JSON.stringify(repeatUsers))
						// console.log("afterSelectPeople: " + JSON.stringify(afterSelectPeople));
						if (afterSelectPeople.length > 0) {
							if (repeatUsers.length > 0) {
								_this.popupAddPeople = `<view style="text-align: left;color:gray;font-size:14px;">
									<p>以下人员已在在当前事务中，系统为您自动排除:</p>
									<view><p style="font-size:14px;font-weight:600">${repeatUsers.join(',')}</p></view>
									<view><br><p>以下人员将作为新增人员添加到当前事务中:</p></view>
									<view><p style="font-size:14px;font-weight:600;color:#000">${_this.receiveManNames.join(',')}</p></view>
									</view>`
							} else {
								_this.popupAddPeople = `<view style="text-align: left">
									<view><p>以下人员将作为新增人员添加到当前事务中:</p></view>
									<view><p style="font-size:14px;font-weight:600;color:#000">${_this.receiveManNames.join(',')}</p></view>
									</view>`
							}
							_this.$refs.popupPeople.open();
						} else {
							_this.showToast('选择的人员全部在当前事务中，请勿重复添加!');
						}

					}
				});
			},
			closePeople() {
				this.$refs.popupPeople.close();
			},
			confirmPeople(value) {
				console.log('confirmPeople');
				this.$refs.popupPeople.close();
				this.showLoading();
				var comData = {
					noticeId: this.detailModel.NoticeId,
					receiveManIds: this.receiveManIds,
					receiveManCodes: this.receiveManCodes,
					receiveManNames: this.receiveManNames,
					receiveManPics: this.receiveManPics,
					index_code: this.itemData.access.split('#')[1],
				}
				console.log("comData: " + JSON.stringify(comData));
				this.post(this.globaData.INTERFACE_OA + 'cooperateNotice/addNoticeMan', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0 && data.data.Result == 1) {
						this.showToast("成功");
						this.getNoticeByReceiveId_sendId_Detail();
					}
				});
			},
			close() {
				this.$refs.popup.close();
			},
			confirm(value) {
				this.$refs.popup.close();
				var comData0 = {
					noticeId: this.detailModel.NoticeId,
					index_code: this.itemData.access.split('#')[1],
					op_code: 'index'
				};
				var url = '';
				if (this.rightName == '撤销') {
					url = 'cooperateNotice/doSetNoticeUndo';
				} else {
					url = 'cooperateNotice/doSetNoticeClose';
				}
				this.showLoading();
				//发送网络请求，data为网络返回值
				this.post(this.globaData.INTERFACE_OA + url, comData0, (data0, data) => {
					this.hideLoading();
					if (data.code == 0 && data.data.Result == 1) {
						this.showToast("成功");
						this.getNoticeByReceiveId_sendId_Detail();
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
				// if (this.imgList.length == 0 && this.detailModel.UploadEncAddrShow.length == 0) {
				// 	this.showToast("请先选择附件");
				// 	return;
				// }
				if (this.canSub) {
					this.canSub = false;
					this.showLoading();
					this.upLoadImg();
				}
			},
			//获取详情
			getNoticeByReceiveId_sendId_Detail() {
				this.showLoading();
				var comData0 = {};
				var url;
				if (this.itemData.flag == 0) { //60.通过协同事务接收表ID获取协同事务
					comData0 = {
						noticeManId: this.itemData.NoticeManId, //协同事务接收表ID
						index_code: this.itemData.access.split('#')[1],
						op_code: 'index'
					}
					url = this.globaData.INTERFACE_OA + 'cooperateNotice/getNoticeByReceiveId';
				} else { //59.通过协同事务ID获取协同事务
					comData0 = {
						noticeId: this.itemData.NoticeId, //协同事务ID
						index_code: this.itemData.access.split('#')[1],
						op_code: 'index'
					}
					url = this.globaData.INTERFACE_OA + 'cooperateNotice/getNoticeById';
				}
				// 获取收到的协同事务列表（接收人为单人）
				this.post(url, comData0, (data0, data) => {
					this.hideLoading();
					console.log('data:' + JSON.stringify(data));
					if (data.code == 0) {
						if (data.data.NoticeEncName) {
							data.data.NoticeEncName = data.data.NoticeEncName.split("|");
							data.data.NoticeEncAddr = data.data.NoticeEncAddr.split("|");
							data.data.NoticeEncAddrShow = data.data.NoticeEncAddr;
						}
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							if (tempM.EncName) {
								tempM.EncName = tempM.EncName.split("|");
								tempM.EncAddr = tempM.EncAddr.split("|");
								tempM.EncAddrShow = tempM.EncAddr;
							}
						}
						//如果是接收的，判断是否右上角有功能
						if (this.itemData.flag == 1) {
							// 进程处于“新建”且 状态处于“发出”时 显示撤销按钮
							if (data.data.NoticeProgress == 1 && data.data.NoticeStatus == 1) {
								this.rightName = '撤销';
							} else if ((data.data.NoticeProgress == 2 || data.data.NoticeProgress == 3) && data
								.data.NoticeStatus == 1) { // 进程处于 “处理中”或“完毕”  且 状态处于 “发出”  显示结束按钮
								this.rightName = '结束';
							}else{
								this.rightName = '';
							}
						}
						// 
						if (data.data.NoticeStatus == 1) { //状态处于 “发出”  与进程无关 显示新增人员按钮
							this.rightIcon = 'personadd';
						}else{
							this.rightIcon = '';
						}
						let beforeSelectPeople = []
						for (var i = 0; i < data.data.list.length; i++) {
							beforeSelectPeople.push(data.data.list[i].ReceiveManId);
						}
						this.beforeSelectPeople = beforeSelectPeople;
						this.tag = data.data.Tag;
						this.detailModel = data.data;
						if (this.itemData.flag == 0) { //54.阅读收到的协同事务
							//54.阅读收到的协同事务
							var comData1 = {
								noticeId: data.data.NoticeId, //通知ID
								receiveManId: this.personInfo.user_code, //阅读人ID
								index_code: this.itemData.access.split('#')[1],
								op_code: 'index'
							}
							//54.阅读收到的协同事务
							this.post(this.globaData.INTERFACE_OA + 'cooperateNotice/doSetReceiveNoticeRead',
								comData1, (data0, data) => {
									// mui.fire(plus.webview.currentWebview().opener(), 'clearRedPoint', curPage);
								});
						} else { //53.阅读发出的协同事务
							//53.阅读发出的协同事务
							var comData1 = {
								noticeId: data.data.NoticeId, //通知ID
								index_code: this.itemData.access.split('#')[1],
								op_code: 'index'
							}
							//53.阅读发出的协同事务
							this.post(this.globaData.INTERFACE_OA + 'cooperateNotice/doSetSendNoticeRead',
								comData1,
								(data0, data) => {

								});
						}
						if (this.detailModel.NoticeEncAddrShow) {
							var getDownToken = {
								appId: this.globaData.QN_APPID, //int 必填 项目id
								appKey: this.globaData.QN_APPKEY,
								urls: this.detailModel.NoticeEncAddrShow //array 必填 需要获取下载token文件的路径
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
								this.detailModel.NoticeEncAddrShow = [].concat(tempArr);
								console.log('this.detailModel11:' + JSON.stringify(this.detailModel));
							});
						}
						for (var i = 0; i < this.detailModel.list.length; i++) {
							var tempM = this.detailModel.list[i];
							if (tempM.EncAddrShow) {
								var getDownToken = {
									appId: this.globaData.QN_APPID, //int 必填 项目id
									appKey: this.globaData.QN_APPKEY,
									urls: tempM.EncAddrShow //array 必填 需要获取下载token文件的路径
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
									this.$set(this.detailModel.list[index], 'EncAddrShow', tempArr);
								}, i);
							}
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
