<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' text="确定" :textClick="textClick">
		</mynavBar>
		<view class="titleTemp">标题</view>
		<input maxlength="50" type="text" v-model="title" class="rightView" style="margin-top: 10px;"
			placeholder="请输入标题" />
		<br>
		<view class="titleTemp">内容</view>
		<textarea maxlength="300" v-model="content" class="rightView"
			style="height: 80px;margin-top: 10px;padding-top: 5px;margin-bottom: 10px;" placeholder="请输入内容"></textarea>

		<view class="uni-flex uni-row form-view choose-file">
			<view class="choose-file-text">附件<view class="file-des">
					{{`(最多可选择${this.showMaxCount}张照片${this.wxTips?this.wxTips:''})`}}
				</view>
			</view>
			<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile'
				@imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount">
			</g-upload>
		</view>
		<label @click="selectSms()" style="float: right;margin-right: 10px;font-size: 14px;margin-bottom: 10px;">
			<checkbox color="#00CFBD" :checked="smsSend" />发送短信
		</label>
		<uni-list>
			<uni-list-item showArrow direction='column' clickable @click="selectPeopleFun()">
				<view slot="body">
					<uni-row showArrow>
						<uni-col :span="12">
							接收人
						</uni-col>
						<uni-col :span="12" style="text-align: right;">
							点击选择接收人
						</uni-col>
					</uni-row>
				</view>
			</uni-list-item>
		</uni-list>
		<view style="margin: 10px;color: gray;word-break:break-all;word-wrap:break-word;">
			{{'已选('+selectPeople.length+'人）:'}} {{showSelectPeople}}
		</view>
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
				itemData: {},
				showSelectPeople: '',
				title: '',
				content: '',
				selectPeople: [],
				smsConfig: {}, //短信配置
				smsWords: [], //拒绝关键字
				smsSend: false, //是否发送短信
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
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.text = '新建通知';
			this.itemData.index = 100;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: '新建通知'
			});
			//#ifndef APP-PLUS
			document.title = "";
			this.wxTips = ',微信端不支持多选'; //如果是H5，需要提示该内容
			//#endif
			//
			this.getSmsConfig();

			// SMSUtils.INDEX_CODE=this.itemData.access.split('#')[1];
			// SMSUtils.MSG_TYPE=window.storageKeyName.OA_MSG_SMS.NOTICE.MSG_TYPE;
			// SMSUtils.USER_TYPE=window.storageKeyName.OA_MSG_SMS.NOTICE.USER_TYPE;
			// SMSUtils.SMS_TYPE=window.storageKeyName.OA_MSG_SMS.SMS_TYPE;
			// SMSUtils.PERSONAL=store.get(window.storageKeyName.PERSONALINFO);
			// // 获取短信权限
			// SMSUtils.getConfig((msg)=>{
			// 	if(msg.SMS){
			// 		this.smsConfig=msg.CONFIG;
			// 		SMSUtils.getSmsWords((msg2)=>{
			// 			this.smsWords=msg2.WORDS;
			// 		},2);
			// 		//显示发送短信按钮
			// 		document.getElementById('senMSN').style.display = 'inherit';
			// 	}
			// });
		},
		methods: {
			selectSms() {
				this.smsSend = !this.smsSend;
			},
			getSmsConfig() { //获取短信配置
				let comData = {
					msg_type: this.OA_MSG_SMS.NOTICE.MSG_TYPE,
					sch_code: this.personInfo.unit_code,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'smsConf/getConf', comData, response => {
					this.hideLoading();
					console.log("responseaaa: " + JSON.stringify(response));
					if (response) {
						let config_types = response.user_types.split(",");
						let local_types = this.ACTION_MSG_SMS.CLSBEHAVIOR.USER_TYPE.split(",");
						let send = false;
						config_types.map(citem => {
							local_types.map(litem => {
								if (citem == litem) {
									send = true
								}
							})
						})
						this.smsSend = send
						this.smsConfig = response
						this.getSmsWords();
					} else {
						this.smsSend = false
					}
					this.hideLoading()
				})
			},
			getSmsWords() { //获取拒绝词
				this.showLoading();
				let comData = {
					page_size: 100000,
					page_number: 1,
					status: 1,
					keyword: '',
					type: 2, //1敏感词 2拒绝词
					index_code: this.itemData.access.split('#')[1],
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'smsWords/page', comData, response => {
					console.log("responseaaa: " + JSON.stringify(response));
					this.smsWords = response.list;
					this.hideLoading();
				})
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
				this.showLoading('正在上传文件...');
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PB_NAME, thisQN_OA_TONGZ, (encName,
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
				let encNameTemp = encNameStr.join(',');
				let encAddrTemp = encAddrTemp.join(',');
				var ids = []; //接收人ID
				var codes = []; //接收人账号
				var names = []; //接收人姓名
				var pics = []; //接收人头像
				for (var i = 0; i < this.selectPeople.length; i++) {
					var model = this.selectPeople[i];
					ids.push(model.user_code)
					codes.push('');
					names.push(model.user_name);
					if (model.user_img == '' || model.user_img == null) {
						pics.push('');
					} else {
						var tempUrl = model.user_img;
						tempUrl = tempUrl.replace(/\\/g, '/');
						pics.push(tempUrl);
					}
				}
				if (ids.length == 0) {
					this.showToast("请选择接收人");
					sendFlag = 0;
					return;
				}
				if (this.smsSend) {
					this.smsSend = 1;
				} else {
					this.smsSend = 0;
				}
				console.log('this.content:' + this.content);
				this.showLoading();
				var tempData = {
					schoolId: this.personInfo.unit_code, //学校ID
					noticeTitle: this.title, //标题
					noticeContent: this.content.replace(/\n/g, '<br>'), //内容
					noticeEncName: encNameTemp, //附件名称
					noticeEncAddr: encAddrTemp, //附件地址
					smsSync: this.smsSend, //是否短信同步
					sendManId: this.personInfo.user_code, //发布人ID
					sendManCode: this.personInfo.login_name, //发布人账号
					sendManName: this.personInfo.user_name, //发布人姓名
					sendManPic: this.personInfo.img_url, //发布人头像
					receiveManIds: ids, //接收人人ID
					receiveManCodes: codes, //接收人账号
					receiveManPics: pics, //接收人头像
					receiveManNames: names, //接收人姓名
					index_code: this.itemData.access.split('#')[1],
					op_code: 'add'
				}
				console.log('tempData:' + JSON.stringify(tempData));
				//28.回复通知公告
				this.post(this.globaData.INTERFACE_OA + 'notice/addNotice', tempData, (data0, data) => {
					// this.canSub = true;
					this.hideLoading();
					if (data.code == 0) {
						if (this.smsSend == 1) {
							let selectData = this.selectPeople;
							let touser = [];
							for (var i = 0; i < selectData.length; i++) {
								let obj = {
									gen_type: SMSUtils.USER_TYPE,
									dpt_code: selectData[i].dpt_code,
									dpt_name: selectData[i].dpt_name,
									grd_code: '',
									grd_name: '',
									cls_code: '',
									cls_name: '',
									stu_code: '',
									stu_name: '',
									gen_code: selectData[i].user_code,
									gen_name: selectData[i].user_name,
								}
								touser.push(obj);
							}
							var tempContent = '';
							if (this.smsConfig.content_type == 't') {
								tempContent = this.title;
							} else if (this.smsConfig.content_type == 'c') {
								tempContent = this.content;
							} else if (this.smsConfig.content_type == 'tc') {
								tempContent = '【' + this.title + '】' + this.content;
							}
							tempContent = tempContent.replace(/\n/g, '');
							tempContent = tempContent.replace(' ', '');
							SMSUtils.sendSMS((msg) => {
									// 82.设置通知的短信返回值
									this.showLoading();
									var dosetData = {
										noticeId: data.data.Result, //通知ID
										msgType: SMSUtils.MSG_TYPE, //信息类型
										smsMsgtypeCode: SMSUtils.SMS_TYPE, //信息类型代码
										servied: this.smsConfig.serviced, //订购状态
										hrSmsid: msg.hr_id, //人事短信接口码
										isCheck: '1', //是否已审核
										checkTime: '', //审核时间
										checkUser: '', //审核人代码
										checkUserTname: '', //审核人姓名
										checkUserUnit: '', //审核人单位
										index_code: curPage.access.split('#')[1],
									}
									console.log('dosetData:' + JSON.stringify(dosetData));
									postDataEncry(window.storageKeyName.INTERFACE_OA +
										'notice/doSetSms4Notice', {}, dosetData, 2,
										function(doData) {
											this.hideLoading();
											// setTimeout(function() {
											// 	mui.back();
											// }, 1000);
											// mui.fire(plus.webview.currentWebview().opener(), 'refreshMinePage', {});
										});
								}, 0, moment().format('YYYY-MM-DD HH:mm:ss'), tempContent, this.smsConfig
								.serviced, 0, touser);
						} else {
							// setTimeout(function() {
							// 	mui.back();
							// }, 1000);
							// mui.fire(plus.webview.currentWebview().opener(), 'refreshMinePage', {});
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			textClick() {
				if (this.title.trim().length == 0 || this.content.trim().length == 0) {
					this.showToast("请填写具体内容后再发布");
					// sendFlag = 0;
					return;
				}
				if (this.title.length > 50) {
					this.showToast("标题不能超过50字");
					// sendFlag = 0;
					return;
				}
				if (this.content.length > 300) {
					this.showToast("内容不能超过300字");
					// sendFlag = 0;
					return;
				}
				//先判断有没有勾选短信按钮，如果勾选，判断内容是否有敏感词
				if (this.smsSend) {
					let showToast = false;
					let words = [];
					let tempTitle = this.title.replace(/\n/g, '');
					tempTitle = tempTitle.replace(' ', '');
					for (var i = 0; i < this.smsWords.length; i++) {
						let word = this.smsWords[i].word;
						if (tempTitle.indexOf(word) !== -1) {
							showToast = true;
							words.push(word);
						}
					}
					let comment = this.content.replace(/\n/g, '');
					comment = comment.replace(' ', '');
					for (var i = 0; i < this.smsWords.length; i++) {
						let word = this.smsWords[i].word;
						if (comment.indexOf(word) !== -1) {
							showToast = true;
							words.push(word);
						}
					}
					if (showToast) {
						this.showToast('含有禁止使用的关键词	‘' + words.join("/") + '’	请编辑后再尝试发送')
						this.hideLoading();
						sendFlag = 0;
						return 0
					}
				}

				//判断输入是否符合要求
				if (this.checkInput(this.title)) {
					if (this.checkInput(this.content)) {
						if (this.selectPeople.length == 0) {
							this.showToast("请选择接收人");
							// sendFlag = 0;
							return;
						}
						this.upLoadImg();
					}
				}
			},
			selectPeopleFun() {
				var data = {
					flag: 1, //1 事务
					needOrder: 0,
					access: this.itemData.access,
					selectPeople: this.selectPeople
				}
				if (this.smsConfig.serviced) {
					data.serviced = this.smsConfig.serviced;
				} else {
					data.serviced = 99;
				}
				utils.mOpenWithData("../../html/oa/selectPeople.html", data);
			},
			//判断是否输入了值
			checkInput(text) {
				if (text.trim().length == 0) {
					this.showToast('请输入标题或内容');
					// sendFlag = 0;
					return false;
				}
				if (this.isNull(text)) {
					this.showToast('请输入标题或内容');
					// sendFlag = 0;
					return false;
				}
				return true;
			},
			//判断输入字符串是否为空或者全部都是空格
			isNull(str) {
				if (str == "") return true;
				var regu = "^[ ]+$";
				var re = new RegExp(regu);
				return re.test(str);
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
</style>
