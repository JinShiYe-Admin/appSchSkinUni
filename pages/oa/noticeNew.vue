<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="确定" :textClick="textClick">
		</mynavBar>
		<view class="titleTemp">标题</view>
		<input maxlength="30" type="text" v-model="title" class="rightView" style="margin-top: 10px;"
			placeholder="请输入标题" />
		<br>
		<view class="titleTemp">内容</view>
		<textarea maxlength="220" v-model="content" class="rightView" @input="inputContent"
			style="height: 80px;margin-top: 10px;padding-top: 5px;margin-bottom: 10px;" placeholder="请输入内容"></textarea>

		<view class="uni-flex uni-row form-view choose-file">
			<view class="choose-file-text">附件<view class="file-des">
					{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}
				</view>
			</view>
			<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile'
				@imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount">
			</g-upload>
		</view>
		<label v-if="smsShow" @click="selectSms()"
			style="float: right;margin-right: 10px;font-size: 14px;margin-bottom: 10px;">
			<checkbox color="#00CFBD" :checked="smsSend" />发送短信
		</label>
		<label v-if="smsShow&&smsSend" @click="selectSign()"
			style="float: right;margin-right: 10px;font-size: 14px;margin-bottom: 10px;margin-right: 20px;">
			<checkbox color="#00CFBD" :checked="addSign" />添加签名
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
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				showSelectPeople: '',
				title: '',
				content: '',
				selectPeople: [],
				idsArray:[],
				smsConfig: {}, //短信配置
				smsWords: [], //拒绝关键字
				smsShow: false, //是否显示发送短信按钮
				smsSend: false, //是否发送短信
				addSign: false, //是否添加签名
				// 附件上传相关👇
				control: true, //是否显示上传 + 按钮 一般用于显示
				deleteBtn: true, //是否显示删除 按钮 一般用于显示
				maxCount: 9, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount: 9, //单次上传最大数量
				columnNum: 3, //每行显示的图片数量
				imgNames: [], //服务器回传的图片名称
				imgList: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				wxTips: '',
				uid_stat:1,
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
			this.navItem.text = '新建通知';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '新建通知'
			});
			//#ifdef H5
			document.title = "";
			this.wxTips = ',微信端不支持多选'; //如果是H5，需要提示该内容
			//#endif
			//
			this.getSmsConfig();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			inputContent(e){
				if (e.detail.value.length>=220) {
					this.showToast("内容输入已达到最大");
				}
			},
			selectSms() {
				this.smsSend = !this.smsSend;
			},
			selectSign() {
				this.addSign = !this.addSign;
			},
			getSmsConfig() { //获取短信配置
				let comData = {
					msg_type: this.OA_MSG_SMS.NOTICE.MSG_TYPE,
					sch_code: this.personInfo.unit_code,
					index_code: this.navItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'smsConf/getConf', comData, response => {
					this.hideLoading();
					console.log("responseaaa: " + JSON.stringify(response));
					if (response) {
						let config_types = response.user_types.split(",");
						let local_types = this.OA_MSG_SMS.NOTICE.USER_TYPE.split(",");
						let send = false;
						config_types.map(citem => {
							local_types.map(litem => {
								if (citem == litem) {
									send = true;
								}
							})
						})
						this.smsShow = send;
						this.smsConfig = response;
						this.uid_stat = response.uid_stat;
						this.getSmsWords();
					} else {
						this.smsShow = false
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
					index_code: this.navItem.access.split('#')[1],
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
				this.showLoading();
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PB_NAME, this.QN_OA_TONGZ, (encName,
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
				let encNameTemp = '';
				let encAddrTemp = '';
				if (encNameStr.length > 0) {
					encNameTemp = encNameStr.join('|');
					encAddrTemp = encAddrStr.join('|');
				}
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
				var tempSms = 0;
				if (this.smsSend) {
					tempSms = 1;
				} else {
					tempSms = 0;
				}
				// if(this.addSign&&this.smsSend){
				// 	this.content+='['+ this.personInfo.user_name+']'
				// }
				console.log('this.content:' + this.content);
				this.showLoading();
				var tempData = {
					schoolId: this.personInfo.unit_code, //学校ID
					noticeTitle: this.title, //标题
					// noticeContent: this.content.replace(/\n/g, '<br>'), //内容
					noticeContent: this.content, //内容
					noticeEncName: encNameTemp, //附件名称
					noticeEncAddr: encAddrTemp, //附件地址
					smsSync: tempSms, //是否短信同步
					sendManId: this.personInfo.user_code, //发布人ID
					sendManCode: this.personInfo.login_name, //发布人账号
					sendManName: this.personInfo.user_name, //发布人姓名
					sendManPic: this.personInfo.img_url, //发布人头像
					receiveManIds: ids, //接收人人ID
					receiveManCodes: codes, //接收人账号
					receiveManPics: pics, //接收人头像
					receiveManNames: names, //接收人姓名
					index_code: this.navItem.access.split('#')[1],
					op_code: 'add'
				}
				console.log('tempData:' + JSON.stringify(tempData));
				//28.回复通知公告
				this.post(this.globaData.INTERFACE_OA + 'notice/addNotice', tempData, (data0, data) => {
					// this.canSub = true;
					this.hideLoading();
					if (data.code == 0) {
						if (this.smsSend) {
							let selectData = this.selectPeople;
							let touser = [];
							for (var i = 0; i < selectData.length; i++) {
								let obj = {
									gen_type: this.OA_MSG_SMS.NOTICE.USER_TYPE,
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
							if(this.addSign&&this.smsSend){
								tempContent+='['+ this.personInfo.user_name+']'
							}
							// tempContent = tempContent.replace(/\n/g, '');
							tempContent = tempContent.replace(' ', '');
							var comData = {
								send_unit_code: this.personInfo.unit_code,
								send_user: this.personInfo.user_code,
								send_user_tname: this.personInfo.user_name,
								send_soure: 'schapp#[APP]',
								send_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
								is_delay: 0,
								delay_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
								msg_content: tempContent,
								msg_type: this.OA_MSG_SMS.NOTICE.MSG_TYPE,
								serviced: this.smsConfig.serviced,
								is_short: 0,
								sms_msgtype_code: this.OA_MSG_SMS.SMS_TYPE,
								sch_code: this.personInfo.unit_code,
								sch_name: this.personInfo.unit_name,
								list: touser,
								index_code: this.navItem.access.split('#')[1],
							}
							this.post(this.globaData.INTERFACE_HR_SUB + 'smsRecord/save', comData, (data0,
								datas) => {
								if (datas.code == 0) {
									// callback({hr_id:datas.data.id})
									var dosetData = {
										noticeId: data.data.Result, //通知ID
										msgType: this.OA_MSG_SMS.NOTICE.MSG_TYPE, //信息类型
										smsMsgtypeCode: this.OA_MSG_SMS.SMS_TYPE, //信息类型代码
										servied: this.smsConfig.serviced, //订购状态
										hrSmsid: datas.data.id, //人事短信接口码
										isCheck: '1', //是否已审核
										checkTime: '', //审核时间
										checkUser: '', //审核人代码
										checkUserTname: '', //审核人姓名
										checkUserUnit: '', //审核人单位
										index_code: this.navItem.access.split('#')[1],
									}
									this.post(this.globaData.INTERFACE_OA + 'notice/doSetSms4Notice',
										dosetData, (data0, doData) => {
											this.hideLoading();
											const eventChannel = this.getOpenerEventChannel()
											eventChannel.emit('refreshOaIndex');
											uni.navigateBack();
										});
								} else {
									this.hideLoading();
									this.showToast(datas.msg);
								}
							});
						} else {
							const eventChannel = this.getOpenerEventChannel()
							eventChannel.emit('refreshOaIndex');
							uni.navigateBack();
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			textClick() {
				if (_this.title.trim().length == 0 || _this.content.trim().length == 0) {
					_this.showToast("请填写具体内容后再发布");
					// sendFlag = 0;
					return;
				}
				if (_this.title.length > 30) {
					_this.showToast("标题不能超过30字");
					// sendFlag = 0;
					return;
				}
				if (_this.content.length > 220) {
					_this.showToast("内容不能超过220字");
					// sendFlag = 0;
					return;
				}
				//先判断有没有勾选短信按钮，如果勾选，判断内容是否有敏感词
				if (_this.smsSend) {
					let showToast = false;
					let words = [];
					// let tempTitle = _this.title.replace(/\n/g, '');
					let tempTitle = _this.title;
					tempTitle = tempTitle.replace(' ', '');
					for (var i = 0; i < _this.smsWords.length; i++) {
						let word = _this.smsWords[i].word;
						if (tempTitle.indexOf(word) !== -1) {
							showToast = true;
							words.push(word);
						}
					}
					// let comment = _this.content.replace(/\n/g, '');
					let comment = _this.content;
					comment = comment.replace(' ', '');
					for (var i = 0; i < _this.smsWords.length; i++) {
						let word = _this.smsWords[i].word;
						if (comment.indexOf(word) !== -1) {
							showToast = true;
							words.push(word);
						}
					}
					if (showToast) {
						_this.showToast('含有禁止使用的关键词	‘' + words.join("/") + '’	请编辑后再尝试发送')
						_this.hideLoading();
						sendFlag = 0;
						return 0
					}
				}
				if (_this.selectPeople.length == 0) {
					_this.showToast("请选择接收人");
					// sendFlag = 0;
					return;
				}
				_this.upLoadImg();
			},
			selectPeopleFun() {
				var data = {
					flag: 1, //1 事务
					needOrder: 0,
					access: this.navItem.access,
					selectPeople: this.selectPeople,
					idsArray:this.idsArray,
					uid_stat:this.uid_stat
				}
				if (this.smsConfig.serviced) {
					data.serviced = this.smsConfig.serviced;
				} else {
					data.serviced = 99;
				}
				util.openwithData("/pages/oa/selectPeople1", data, {
					refreshSetPeople(data) { //子页面调用父页面需要的方法
						_this.selectPeople = data.data;
						_this.idsArray = data.idsArray;
						var tempPeople = [];
						for (var i = 0; i < _this.selectPeople.length; i++) {
							var tempModel = _this.selectPeople[i];
							tempPeople.push(tempModel.user_name);
						}
						_this.showSelectPeople = tempPeople.join(',');
						console.log('this.showSelectPeople:' + _this.showSelectPeople);
					}
				});
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
