<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="发布" :textClick="textClick">
		</mynavBar>
		<view style="margin: 10px;">
			<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
					size="10"></uni-icons>作业类型：</view>
			<view class="uni-flex uni-row">
				<view class="flex-item" @click="clickType(2)"
					:style="{color:hmwkType==2?'white':'',background:hmwkType==2?'#2c96bd':''}">线下作业</view>
				<view class="flex-item" @click="clickType(1)"
					:style="{color:hmwkType==1?'white':'',background:hmwkType==1?'#2c96bd':''}">线上作业</view>
			</view>
			<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
					size="10"></uni-icons>科目：</view>
			<view style="margin: 5px 20px 0 20px;">
				<span v-for="(item,index) in subList" :key="index">
					<uni-tag :inverted="true" :text="item.sub_name"
						custom-style="margin: 5px 5px 5px 0;border-radius: 5px;background: #f2f2f2;color: #333;"
						:style="{color:subIndex==index?'white':'',background:subIndex==index?'#2c96bd':''}"
						@click="clickSub(index)" />
				</span>
			</view>
			<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
					size="10"></uni-icons>作业内容：</view>
			<textarea style="margin-top: 10px;" maxlength="260" v-model="content" class="rightView"
				placeholder="请输入作业内容,最多260字"></textarea>
			<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
					size="10"></uni-icons>作业对象：</view>
			<view style="margin: 5px 20px 0 20px;">
				<span v-for="(item,index) in clsList" :key="index">
					<uni-tag :inverted="true" :text="item.cls_name"
						custom-style="margin: 5px 5px 5px 0;border-radius: 5px;background: #f2f2f2;color: #333;"
						:style="{color:item.selectFlag==1?'white':'',background:item.selectFlag==1?'#2c96bd':''}"
						@click="clickCls(item)" />
				</span>
			</view>
			<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
					size="10"></uni-icons>截止时间：</view>
			<view style="margin: 10px 15px;">
				<uni-datetime-picker type="datetime" v-model="endTime" :start="startTime" :clear-icon="false" />
			</view>
			<view class="uni-flex uni-row form-view choose-file">
				<view style="font-size: 14px;margin: -10px 0 10px -10px;">附件：<span class="file-des">
						{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}
					</span>
				</view>
				<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn'
					@chooseFile='chooseFile' @imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum"
					:showMaxCount="showMaxCount">
				</g-upload>
			</view>
			<view v-if="SHOW" class="typeCss" style=""><uni-icons type="star-filled" color='#d9001b'
					size="10"></uni-icons>同步发送短信：</view>
			<view v-if="SHOW" class="uni-flex uni-row">
				<view class="flex-item" @click="clickMsgType(true)"
					:style="{color:SMS==true?'white':'',background:SMS==true?'#2c96bd':''}">是</view>
				<view class="flex-item" @click="clickMsgType(false)"
					:style="{color:SMS==false?'white':'',background:SMS==false?'#2c96bd':''}">否</view>
			</view>
			<view v-if="SHOW && SMS">
				<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
						size="10"></uni-icons>是否在短信中添加签名：</view>
				<view class="uni-flex uni-row">
					<view class="flex-item" @click="clickSignType(true)"
						:style="{color:SIGN==true?'white':'',background:SIGN==true?'#2c96bd':''}">是</view>
					<view class="flex-item" @click="clickSignType(false)"
						:style="{color:SIGN==false?'white':'',background:SIGN==false?'#2c96bd':''}">否</view>
				</view>
				<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
						size="10"></uni-icons>是否延时发送短信：</view>
				<view class="uni-flex uni-row">
					<view class="flex-item" @click="clickTimeType(0)"
						:style="{color:is_delay==0?'white':'',background:is_delay==0?'#2c96bd':''}">否</view>
				</view>
				<view class="uni-flex uni-row">
					<view class="flex-item" @click="clickTimeType(1)"
						:style="{color:is_delay==1?'white':'',background:is_delay==1?'#2c96bd':''}">是</view>
					<view v-show="delayIcon">
					<picker mode="multiSelector" class="delayTime" ref="picker" @change="valueChange" :value="multiIndex" :range="multiArray">
						<view class="uni-input">延时：{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}</view>
					</picker></view>
				</view>
				<view style="margin: 10px 10px 5px 15px;font-size: 10px;color: red;">延时发送定义：例如当前时间为12时30分，设置延时“1天1小时30分后发送”，则信息会在第2天14时进行发送。</view>
			</view>
		</view>
		<view style="height: 10px;"></view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	// 七牛上传相关
	import gUpload from "@/components/g-upload/g-upload.vue"
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let _this;
	const leftArray=[],centerArray=[],rightArray=[];
	for (var i = 0; i < 32; i++) {
		leftArray.push(i+'天')
	}
	for (var i = 0; i < 24; i++) {
		centerArray.push(i+'小时')
	}
	for (var i = 1; i < 60; i++) {
		rightArray.push(i+'分钟')
	}
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				hmwkType: 2,
				subList: [],
				subIndex: 0,
				clsList: [],
				startTime: '',
				endTime: '',
				content: '',
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
				SHOW: false, //是否显示发送短信
				SMS: false, //是否向家长发送短信
				SIGN:false,//是否签名
				CONFIG: {}, //短信配置 对象
				WORDS: [], //拒绝关键字 对象
				delayIcon:false,
				is_delay:0,
				// delay_time_str:'立即发送',
				multiArray: [//多列选择器内容
					leftArray,
					centerArray,
					rightArray
				],
				multiIndex: [0, 0, 4],//多列选择器初始值
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
			this.navItem.text = '作业布置';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '作业布置'
			});
			this.startTime = this.moment().format('YYYY-MM-DD HH:mm:ss');
			this.endTime = this.moment().add(1, 'h').format('YYYY-MM-DD HH:mm:ss');
			this.getSubCls();
			this.getSmsConfig();
			//#ifdef H5
			document.title = "";
			//#endif
			//
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			valueChange(e){
				this.multiIndex= e.detail.value
				let day=parseInt(this.multiArray[0][this.multiIndex[0]])?this.multiArray[0][this.multiIndex[0]]+'，':''
				let hour=parseInt(this.multiArray[1][this.multiIndex[1]])?this.multiArray[1][this.multiIndex[1]]+'，':''
				let minute=this.multiArray[2][this.multiIndex[2]]
				// this.delay_time_str=day+hour+minute+' 后发送'
				// this.$refs.popup.close()
				// this.$forceUpdate()
			},
			getSmsConfig() { //获取短信配置
				let comData = {
					msg_type: this.MSG_SMS.HOMEWORK.MSG_TYPE,
					sch_code: this.personInfo.unit_code,
					index_code: this.navItem.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'smsConf/getConf', comData, response => {
					console.log("responseaaa: " + JSON.stringify(response));
					if (response && response.user_types) {
						let config_types = response.user_types.split(",");
						let local_types = this.MSG_SMS.HOMEWORK.USER_TYPE.split(",");
						let send = false;
						config_types.map(citem => {
							local_types.map(litem => {
								if (citem == litem) {
									send = true
								}
							})
						})
						this.SHOW = send
						this.CONFIG = response
						if (send) {
							this.SMS = true
							// this.SMSText='点击上方图标可设置短信发送时间'
							// this.icon='compose'
						}
						console.log('111111111')
						this.getSmsWords();
						console.log('1111111112')
					} else {
						this.SHOW = false
					}
					this.hideLoading()
				})
			},
			getSmsWords() { //获取拒绝词
				let comData = {
					page_size: 100000,
					page_number: 1,
					status: 1,
					keyword: '',
					type: 2, //1敏感词 2拒绝词
					index_code: this.navItem.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'smsWords/page', comData, response => {
					console.log("responseaaa: " + JSON.stringify(response));
					this.WORDS = response.list
					this.hideLoading()
				})
			},
			textClick() {
				if (this.content.length == 0) {
					this.showToast('请输入作业内容');
					return;
				}
				var tempFlag = 0;
				for (var i = 0; i < this.clsList.length; i++) {
					if (this.clsList[i].selectFlag == 1) {
						tempFlag++;
					}
				}
				if (tempFlag == 0) {
					this.showToast('请选择作业对象');
					return;
				}
				var tempT0 = this.moment().format('YYYY-MM-DD HH:mm');
				var tempF0 = this.moment(this.endTime).diff(tempT0, 'minutes');
				if (tempF0 <= 0) {
					this.showToast('请重新选择时间');
					return;
				}
				// let comm=_this.content
				// let comment=comm.replace(/\s+/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, '')
				let comment = _this.content
				if (_this.SMS) {
					let showToast = false
					let words = []
					for (let i = 0; i < _this.WORDS.length; i++) {
						let word = _this.WORDS[i].word
						if (comment.indexOf(word) !== -1) {
							showToast = true
							words.push(word)
						}
					}
					if (showToast) {
						_this.showToast('含有禁止使用的关键词	‘' + words.join("/") + '’	请编辑后再尝试发送')
						_this.hideLoading()
						// _this.canSub=true
						return 0
					}
				}
				_this.submitBtn();
			},
			clickType(flag) {
				this.hmwkType = flag;
			},
			clickMsgType(flag) {
				this.SMS = flag;
			},
			clickSignType(flag) {
				this.SIGN = flag;
			},
			clickTimeType(flag) {
				this.is_delay = flag;
				if (flag == 0) {
					this.delayIcon = false;
				} else{
					this.delayIcon = true;
				}
			},
			clickSub(index) {
				this.subIndex = index;
				this.clsList = JSON.parse(JSON.stringify(this.subList[this.subIndex].child));
			},
			clickCls(model) {
				model.selectFlag = !model.selectFlag;
			},
			getSubCls() {
				var comData = {
					user_code: this.personInfo.user_code, //
					with_master: false,
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				//1.14.班级任教列表
				this.post(this.globaData.INTERFACE_HR_SUB + 'clsTec', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempSubList = [];
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM0 = data.data.list[i];
							tempSubList.push({
								sub_code: tempM0.sub_code,
								sub_name: tempM0.sub_name,
								child: []
							});
						}
						tempSubList = util.ArrayUnique(tempSubList, 'sub_code');
						for (var i = 0; i < tempSubList.length; i++) {
							var tempM0 = tempSubList[i];
							for (var a = 0; a < data.data.list.length; a++) {
								var tempM1 = data.data.list[a];
								if (tempM0.sub_code == tempM1.sub_code) {
									tempM0.child.push({
										grd_name: tempM1.grd_name,
										grd_code: tempM1.grd_code,
										cls_name: tempM1.cls_name,
										cls_code: tempM1.cls_code,
										selectFlag: 0
									})
								}
							}
						}
						this.subList = tempSubList;
						this.clsList = JSON.parse(JSON.stringify(this.subList[this.subIndex].child));
					}
				});
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
			submitBtn() {
				// console.log('this.clsList:'+JSON.stringify(this.clsList));
				// return;
				this.showLoading();
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PB_NAME, this.QN_HOMEWORKTEC, (encName,
					encAddrStr) => {
					this.hideLoading();
					console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					console.log("names: " + JSON.stringify(encName));
					this.submitData(encName, encAddrStr);
				});
			},
			//附件上传相关👆
			submitData(encNameStr, encAddrStr) {
				let imgArray = [];
				if (encNameStr.length > 0) {
					for (var i = 0; i < encNameStr.length; i++) {
						imgArray.push({
							name: encNameStr[i],
							url: encAddrStr[i],
						})
					}
				}
				var tempCls = [];
				for (var i = 0; i < this.clsList.length; i++) {
					var tempC = this.clsList[i];
					if (tempC.selectFlag == 1) {
						tempCls.push(tempC);
					}
				}
				var comment = this.content
				if(this.SIGN){
					comment+='[发送人：'+ this.personInfo.user_name+']'
				}
				let comData = {
					type: this.hmwkType,
					sub_code: this.subList[this.subIndex].sub_code,
					sub_name: this.subList[this.subIndex].sub_name,
					content: comment,
					deadline: this.endTime,
					create_user_code: this.personInfo.user_code,
					create_user_name: this.personInfo.user_name,
					send_sms: this.SMS,
					files: imgArray,
					clss: tempCls,
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				// 5.2.添加作业
				this.post(this.globaData.INTERFACE_HMWK + 'stuWork/add', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.getSMSid(comment)
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getSMSid(comment){
				this.showLoading()
				let delayTime=this.moment().format('YYYY-MM-DD HH:mm:ss')
				let day=parseInt(this.multiArray[0][this.multiIndex[0]])
				let hour=parseInt(this.multiArray[1][this.multiIndex[1]])
				let minute=parseInt(this.multiArray[2][this.multiIndex[2]])
				if(this.is_delay){
					delayTime=this.moment().add(day, 'days').add(hour, 'hours').add(minute, 'minutes').format('YYYY-MM-DD HH:mm:ss');
				}
				let touser = []
				for (var i = 0; i < this.clsList.length; i++) {
					var tempC = this.clsList[i];
					if (tempC.selectFlag == 1) {
						let obj = {
							col_code: '',
							col_name: '',
							maj_code: '',
							maj_name: '',
							grd_code: tempC.grd_code,
							grd_name: tempC.grd_name,
							cls_code: tempC.cls_code,
							cls_name: tempC.cls_name,
							user_codes: '',
							user_names: '',
						}
						touser.push(obj)
					}
				}
				let comData={
					unit_name:this.personInfo.unit_name,
					send_unit_code:this.personInfo.unit_code,
					send_user:this.personInfo.user_code,
					send_user_tname:this.personInfo.user_name,
					msg_content:comment,
					msg_type:this.MSG_SMS.HOMEWORK.MSG_TYPE,
					send_soure:"schapp#[APP]",
					tousers:touser,
					hr_smsid:0,//固定值
					sms_msgtype_code:this.MSG_SMS.HOMEWORK.SMS_TYPE,
					is_delay:this.is_delay,
					delay_time:delayTime,
					servied:JSON.stringify(this.CONFIG)==='{}'?'100':this.CONFIG.serviced,
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_SCHHOME+'api/appsms/appsmsa',comData,(response0,response)=>{
					console.log("response: " + JSON.stringify(response));
					this.hideLoading();
				     if (response.code == 0) {
						 if (this.SMS) {
						 	this.sendSMS(response0,comment,delayTime)
						 } else {
						 	this.showToast(data.msg);
						 	const eventChannel = this.getOpenerEventChannel()
						 	eventChannel.emit('refreshaddList');
						 	uni.navigateBack();
						 }
				     }
				});
			},
			sendSMS(id, comment,delayTime) { //发送短信
				let touser = []
				for (var i = 0; i < this.clsList.length; i++) {
					var tempC = this.clsList[i];
					if (tempC.selectFlag == 1) {
						let obj = {
							gen_type: this.MSG_SMS.HOMEWORK.USER_TYPE,
							dpt_code: '',
							dpt_name: '',
							grd_code: tempC.grd_code,
							grd_name: tempC.grd_name,
							cls_code: tempC.cls_code,
							cls_name: tempC.cls_name,
							stu_code: '',
							stu_name: '',
							gen_code: '',
							gen_name: '',
						}
						touser.push(obj)
					}
				}
				let comData = {
					send_unit_code: this.personInfo.unit_code,
					send_user: this.personInfo.user_code,
					send_user_tname: this.personInfo.user_name,
					send_soure: 'schapp#[APP]',
					send_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
					is_delay:this.is_delay,
					delay_time:delayTime,
					msg_content: comment,
					msg_type: this.MSG_SMS.HOMEWORK.MSG_TYPE,
					serviced: this.CONFIG.serviced,
					is_short: 2,
					sms_msgtype_code: this.MSG_SMS.HOMEWORK.SMS_TYPE,
					sch_code: this.personInfo.unit_code,
					sch_name: this.personInfo.unit_name,
					list: touser,
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'smsRecord/save', comData, response => {
					this.hideLoading();
					this.refreshID(id, response.id);
				})
			},
			refreshID(id, hr_id) { //互动信息更新对应人事信息ID  （接口这样写的）
				let comData = {
					hr_smsid: hr_id,
					sms_id: id,
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_SCHHOME + 'api/appsms/appsmsridhrid', comData, (response0,
				response) => {
					this.hideLoading();
					// this.showToast(response.msg);
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('refreshaddList');
					uni.navigateBack();
				})
			},
		}
	}
</script>

<style>
	.typeCss {
		font-size: 14px;
		color: #333333;
	}

	.uni-list-cell {
		justify-content: flex-start;
		font-size: 13px;
		margin-top: 10px;
		margin-left: 15px;
	}

	.uni-list-cell::after {
		height: 0px !important;
	}

	::v-deep uni-radio .uni-radio-input {
		width: 15px !important;
		height: 15px !important;
	}

	.show-time {
		border: 1px solid gainsboro;
		padding: 8px;
		margin: 10px 20px 0 15px;
		border-radius: 3px;
		font-size: 13px;
	}

	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		padding-left: 5px;
		height: 80px;
		padding-top: 5px;
		margin: 0 15px 0 15px;
		width: auto;
	}

	.flex-item {
		width: 100px;
		height: 26px;
		text-align: center;
		background: #f2f2f2;
		font-size: 14px;
		color: #333;
		margin: 10px 0 0 20px;
		border-radius: 5px;
		padding-top: 6px;
	}

	::v-deep .uni-tag {
		color: #333;
		background-color: #f2f2f2;
	}
	
	.delayTime{
		border: 1px solid darkgray;
		border-radius: 3px;
		margin: 5px 0 0 10px;
	}
</style>