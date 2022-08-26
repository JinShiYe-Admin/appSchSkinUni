<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="上报记录" :textClick="textClick">
		</mynavBar>
		<view style="font-size: 16px;text-align: center;margin-top: 20px;">{{curDate}}健康上报</view>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">个人健康信息</view>
		</view>
		<view class="line"></view>
		<view class="viewText">*学生：</view>
		<view style="background: #e5e5e5;margin: 2px 20px;padding: 4px;text-align: center;font-size: 13px;">
			{{personInfo.grd_name}} {{personInfo.cls_name}} {{personInfo.stu_name}}
		</view>
		<view class="viewText">*本人当天健康码截图(请勿上传下载的健康码)</view>
		<view class="uni-flex uni-row form-view choose-file">
			<g-upload ref='gUpload0' :mode="imgList0" :control='control' :deleteBtn='deleteBtn'
				@chooseFile='chooseFile0' @imgDelete='imgDelete0' :maxCount="maxCount0" :columnNum="columnNum0"
				:showMaxCount="showMaxCount0">
			</g-upload>
			<view class="shibieView">
				<p v-if="healthColor.length==0" style='margin-top: 30px;color: red;'>请添加健康码</p>
				<p v-if="healthColor.length>0" style='margin-top: 10px;font-size: 16px;' :style="{color:healthColorStr}">{{healthColorChar}}</p>
				<p v-if="healthColor.length>0" style='margin-top: 10px;' :style="{color:healthColorStr}">{{healthResult}}</p>
				<p v-if="healthColor.length>0" style='margin-top: 10px;' :style="{color:healthColorStr}">{{healthTime}}</p>
			</view>
		</view>
		<view class="viewText">*本人当天行程码截图</view>
		<view class="uni-flex uni-row form-view choose-file">
			<g-upload1 ref='gUpload1' :mode="imgList1" :control='control' :deleteBtn='deleteBtn'
				@chooseFile='chooseFile1' @imgDelete='imgDelete1' :maxCount="maxCount1" :columnNum="columnNum1"
				:showMaxCount="showMaxCount1">
			</g-upload1>
			<view class="shibieView">
				<p v-if="itineraryColor.length==0" style='margin-top: 30px;color: red;'>请添加行程码</p>
				<p v-if="itineraryColor.length>0" style='margin-top: 7px;font-size: 16px;padding: 10px;' :style="{color:itineraryColorStr}">{{itineraryColorChar}}</p>
				<p v-if="itineraryColor.length>0" style='margin-top: 5px;font-size: 14px;padding: 10px;' :style="{color:itineraryColorStr}">{{itineraryCity}}</p>
			</view>
		</view>
		<view class="viewText">*本人是否有发热/咳嗽/流涕/咽疼等症状？</view>
		<radio-group @change="radioChange0" style="margin-top: 5px;">
			<label class="radio pageRadio">
				<radio value="false" :checked="false == selfRadio" color="#00baad" style="transform:scale(0.7)" />没有
			</label>
			<label class="radio pageRadio">
				<radio value="true" :checked="true == selfRadio" color="#00baad" style="transform:scale(0.7)" />有
			</label>
		</radio-group>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">同住人健康信息</view>
		</view>
		<view class="line"></view>
		<view class="viewText">*同住人中是否有新冠疫情感染者？</view>
		<radio-group @change="radioChange1" style="margin-top: 5px;">
			<label class="radio pageRadio">
				<radio value="false" :checked="false == otherRadio0" color="#00baad" style="transform:scale(0.7)" />没有
			</label>
			<label class="radio pageRadio">
				<radio value="true" :checked="true == otherRadio0" color="#00baad" style="transform:scale(0.7)" />有
			</label>
		</radio-group>
		<view class="viewText">*14天内是否有同住人到过中高风险地区？</view>
		<radio-group @change="radioChange2" style="margin-top: 5px;">
			<label class="radio pageRadio">
				<radio value="false" :checked="false == otherRadio1" color="#00baad" style="transform:scale(0.7)" />没有
			</label>
			<label class="radio pageRadio">
				<radio value="true" :checked="true == otherRadio1" color="#00baad" style="transform:scale(0.7)" />有
			</label>
		</radio-group>
		<view class="viewText">*同住人是否有发热/咳嗽/流涕/咽疼等症状？</view>
		<radio-group @change="radioChange3" style="margin-top: 5px;">
			<label class="radio pageRadio">
				<radio value="false" :checked="false == otherRadio2" color="#00baad" style="transform:scale(0.7)" />没有
			</label>
			<label class="radio pageRadio">
				<radio value="true" :checked="true == otherRadio2" color="#00baad" style="transform:scale(0.7)" />有
			</label>
		</radio-group>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">特殊情况</view>
		</view>
		<view class="line"></view>
		<view class="viewText">如有特殊情况请填写并上传相关截图，若无特殊情况则不填写。</view>
		<textarea maxlength="100" v-model="content" class="rightView"
			style="height: 80px;margin-top: 10px;padding-top: 5px;margin-bottom: 10px;" placeholder="限100字内"></textarea>
		<view class="uni-flex uni-row form-view choose-file">
			<g-upload2 ref='gUpload2' :mode="imgList2" :control='control' :deleteBtn='deleteBtn'
				@chooseFile='chooseFile2' @imgDelete='imgDelete2' :maxCount="maxCount2" :columnNum="columnNum2"
				:showMaxCount="showMaxCount2">
			</g-upload2>
		</view>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">承诺签字</view>
		</view>
		<view class="line"></view>
		<view class="viewText">*本人同意授权以上信息给学校并确认信息无误。</view>
		<view style="border: 1rpx dashed #555555;margin: 10px 20px;">
			<Signature ref="sig" v-model="signContent"></Signature>
		</view>
		<view class="uploadView" @click="submit()">上报</view>
		<u-tabbar-my v-if='navItem.index<5' :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import Signature from '@/components/sin-signature/sin-signature.vue'
	// 七牛上传相关
	import gUpload from "@/components/g-upload/g-upload.vue"
	import gUpload1 from "@/components/g-upload/g-upload1.vue"
	import gUpload2 from "@/components/g-upload/g-upload2.vue"
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				curDate: '',
				// 附件上传相关👇
				control: true, //是否显示上传 + 按钮 一般用于显示
				deleteBtn: true, //是否显示删除 按钮 一般用于显示
				maxCount0: 1, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount0: 1, //单次上传最大数量
				columnNum0: 3, //每行显示的图片数量
				maxCount1: 1, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数
				showMaxCount1: 1, //单次上传最大数量
				columnNum1: 3, //每行显示的图片数量
				maxCount2: 1, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数
				showMaxCount2: 1, //单次上传最大数量
				columnNum2: 3, //每行显示的图片数量
				imgNames0: [], //服务器回传的图片名称
				imgNames1: [], //服务器回传的图片名称
				imgNames2: [], //服务器回传的图片名称
				imgList0: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgList1: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgList2: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles0: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				imgFiles1: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				imgFiles2: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				selfRadio: false,
				otherRadio0: false,
				otherRadio1: false,
				otherRadio2: false,
				content: '',
				signContent: '',
				healthTime: '',
				healthColor: '',
				healthColorStr: '',
				healthColorChar:'',
				healthResult: '',
				healthImgUrl: '',
				itineraryTime: '',
				itineraryColor: '',
				itineraryColorStr: '',
				itineraryColorChar:'',
				itineraryCity:'',
				itineraryImgUrl: '',
				noteImgUrl:'',
				noteImgName:''
			}
		},
		components: {
			mynavBar,
			gUpload,gUpload1,gUpload2,
			Signature
		},
		onLoad(options) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			});
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			this.navItem = util.getTabbarMenu();
			this.index_code = this.navItem.access.split("#")[1]
			var tempDate = new Date();
			// var preDate = new Date(tempDate.getTime() - 24 * 60 * 60 * 1000); //前一天
			this.curDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();

			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			radioChange0() {
				this.selfRadio = !this.selfRadio;
			},
			radioChange1() {
				this.otherRadio0 = !this.otherRadio0;
			},
			radioChange2() {
				this.otherRadio1 = !this.otherRadio1;
			},
			radioChange3() {
				this.otherRadio2 = !this.otherRadio2;
			},
			textClick() {
				util.openwithData('/pages/stuHealthMsg/stuHealthMsgNotesIndex', {
					index_code: _this.index_code
				});
			},
			submit() {
				if (this.healthColor.length == 0) {
					this.showToast('请先选择正确的健康码');
				}else if(this.itineraryColor.length == 0){
					this.showToast('请先选择正确的行程码');
				}else if(this.signContent.length==0){
					this.showToast('请签名');
				}else{
					var fileName = 'note' + new Date().getTime() + '.png';
					var tempData = this.signContent.replace('data:image/svg+xml;base64,', '');
					console.log('tempDatatempDatatempDatatempData');
					cloudFileUtil.uploadBase64Imge(1, fileName, tempData,this.QN_PB_NAME, this.QN_JKSB_NOTE, function(domain) {
						console.log("domain: " + JSON.stringify(domain));
						var tempArray = []
						if(_this.noteImgUrl.length>0){
							var tempM = {
								name:_this.noteImgName,
								url:_this.noteImgUrl
							}
							tempArray.push(tempM);
						}
						var comData = {
							index_code: _this.index_code,
							sch_code: _this.personInfo.sch_code,
							sch_name: _this.personInfo.sch_name,
							grd_code: _this.personInfo.grd_code,
							grd_name: _this.personInfo.grd_name,
							cls_code: _this.personInfo.cls_code,
							cls_name: _this.personInfo.cls_name,
							stu_code: _this.personInfo.stu_code,
							stu_name: _this.personInfo.stu_name,
							date:_this.curDate,
							health_code_img_url:_this.healthImgUrl,
							health_code_color:_this.healthColor,
							health_code_time:_this.healthTime,
							nucleic:_this.healthResult,
							itinerary_card_img_url:_this.itineraryImgUrl,
							itinerary_card_color:_this.itineraryColor,
							itinerary_card_time:_this.itineraryTime,
							itinerary_card_via_city:_this.itineraryCity,
							is_unusual:_this.selfRadio,
							roomy_is_infect:_this.otherRadio0,
							roomy_is_14_high_risk:_this.otherRadio1,
							roomy_is_unusual:_this.otherRadio2,
							note:_this.content,
							note_img_list:tempArray,
							sign_img:domain
						}
						_this.showLoading();
						// 2.2.保存
						_this.post(_this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/save', comData, (data0,
							data) => {
							_this.hideLoading();
							if (data.code == 0) {
								_this.showToast(data.msg);
							} else {
								_this.showToast(data.msg);
							}
						});
					}, function() {
						_this.hideLoading();
					})
				}
			},
			// 2.3.获取健康码信息
			getHealthCodeInfo() {
				var comData = {
					index_code: _this.index_code,
					url: this.healthImgUrl //
				}
				this.showLoading();
				// 2.3.获取健康码信息
				this.post(this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/getHealthCodeInfo', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.healthTime = data.data.health_code_time;
						this.healthColor = data.data.health_code_color;
						this.healthResult = data.data.nucleic;
						if (data.data.health_code_color == 'g') {
							this.healthColorStr = '#5ba669';
							this.healthColorChar = '绿码';
						} else if (data.data.health_code_color == 'y') {
							this.healthColorStr = '#f2b71f';
							this.healthColorChar = '黄码';
						} else if (data.data.health_code_color == 'r') {
							this.healthColorStr = '#e61a23';
							this.healthColorChar = '红码';
						}
					} else {
						this.healthImgUrl = '';
						this.showToast(data.msg);
					}
				});
			},
			// 2.4.获取行程卡信息
			getItineraryCardInfo() {
				var comData = {
					index_code: _this.index_code,
					url: this.itineraryImgUrl //
				}
				this.showLoading();
				// 2.4.获取行程卡信息
				this.post(this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/getItineraryCardInfo', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.itineraryTime = data.data.itinerary_card_time;
						this.itineraryColor = data.data.itinerary_card_color;
						this.itineraryCity = data.data.itinerary_card_via_city;
						if (data.data.itinerary_card_color == 'g') {
							this.itineraryColorStr = '#5ba669';
							this.itineraryColorChar = '绿色';
						} else if (data.data.itinerary_card_color == 'y') {
							this.itineraryColorStr = '#f2b71f';
							this.itineraryColorChar = '黄色';
						} else if (data.data.itinerary_card_color == 'r') {
							this.itineraryColorStr = '#e61a23';
							this.itineraryColorChar = '红色';
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			imageUrl2Base64(url) {
				return new Promise((resolve, reject) => {
					if (url) {
						console.log('11111111')
						let image = new Image();
						//解决跨域报错，必须写在赋值给image.src的前面，否则偶尔报错，也可以这样写image.setAttribute('crossOrigin', 'anonymous');
						image.crossOrigin = 'anonymous';
						image.src = url;
						//等待图片加载完成，转换图片为base64，异步
						image.onload = function() {
							console.log('222222222')
							let canvas = document.createElement('canvas');
							canvas.width = image.width;
							canvas.height = image.height;
							console.log('image.width:'+image.width+','+image.height)
							let ctx = canvas.getContext('2d');
							ctx.drawImage(image, 0, 0, image.width, image.height);
							let base64 = canvas.toDataURL('image/png');
							resolve(base64);
						}
					}
				});
			},
			// uploadImg(tempUrl,flag){
			// 	var comData = {
			// 		index_code: _this.index_code,
			// 		file: tempUrl //
			// 	}
			// 	this.showLoading();
			// 	// 2.2.文件上传接口
			// 	this.post(this.globaData.INTERFACE_HEALTH_DATA + 'admin/asset/upload', comData, (data0,
			// 		data) => {
			// 		this.hideLoading();
			// 		if (data.code == 0) {
						
			// 		} else {
			// 			this.showToast(data.msg);
			// 		}
			// 	});
			// },
			//附件上传相关👇
			chooseFile0(list, v, f) {
				this.imgList0 = list
				this.imgFiles0 = this.imgFiles0.concat(f)
				this.maxCount0 = this.showMaxCount0 - list.length
				console.log("list: " + JSON.stringify(list));
				console.log("v: " + JSON.stringify(v));
				console.log("f: " + JSON.stringify(f));
				cloudFileUtil.uploadFiles(this, '1', this.imgList0, this.QN_PB_NAME, this.QN_JKSB_JKM, (encName,
					encAddrStr) => {
					this.hideLoading();
					console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					console.log("names: " + JSON.stringify(encName));
					this.healthImgUrl = encAddrStr[0];
					this.getHealthCodeInfo();
				});
				// this.uploadImg(list[0],0);
				// this.imageUrl2Base64(list[0]).then((base64) => {
				// 	this.getHealthCodeInfo(base64);
				// });
			},
			chooseFile1(list, v, f) {
				this.imgList1 = list
				this.imgFiles1 = this.imgFiles1.concat(f)
				this.maxCount1 = this.showMaxCount1 - list.length
				cloudFileUtil.uploadFiles(this, '1', this.imgList1, this.QN_PB_NAME, this.QN_JKSB_XXM, (encName,
					encAddrStr) => {
					this.hideLoading();
					this.itineraryImgUrl = encAddrStr[0];
					this.getItineraryCardInfo();
				});
				// this.uploadImg(list[0],1);
				// this.imageUrl2Base64(list[0]).then((base64) => {
				// 	this.getItineraryCardInfo(base64);
				// });
			},
			chooseFile2(list, v, f) {
				this.imgList2 = list
				this.imgFiles2 = this.imgFiles2.concat(f)
				this.maxCount2 = this.showMaxCount2 - list.length
				cloudFileUtil.uploadFiles(this, '1', this.imgList2, this.QN_PB_NAME, this.QN_JKSB_NOTE, (encName,
					encAddrStr) => {
					this.hideLoading();
					console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					console.log("names: " + JSON.stringify(encName));
					this.noteImgUrl = encAddrStr[0];
					this.noteImgName = encName[0];
				});
			},
			imgDelete0(list, eq, fileeq) {
				this.imgList0 = list
				this.imgFiles0.splice(fileeq, 1); //删除临时路径
				this.imgNames0.splice(eq, 1); //删除文件名
				this.maxCount0 = this.showMaxCount0 - list.length
				this.healthImgUrl = '';
				this.healthColor = '';
				cloudFileUtil.qiniuDelete(this.imgList0, (data) => {
					console.log('七牛:' + JSON.stringify(data));
				});
			},
			imgDelete1(list, eq, fileeq) {
				this.imgList1 = list
				this.imgFiles1.splice(fileeq, 1); //删除临时路径
				this.imgNames1.splice(eq, 1); //删除文件名
				this.maxCount1 = this.showMaxCount1 - list.length
				this.itineraryImgUrl = '';
				this.itineraryColor = '';
				cloudFileUtil.qiniuDelete(this.imgList1, (data) => {
					console.log('七牛:' + JSON.stringify(data));
				});
			},
			imgDelete2(list, eq, fileeq) {
				this.imgList2 = list
				this.imgFiles2.splice(fileeq, 1); //删除临时路径
				this.imgNames2.splice(eq, 1); //删除文件名
				this.maxCount2 = this.showMaxCount2 - list.length
				this.noteImgUrl = '';
				this.noteImgName = '';
			},
			//附件上传相关👆
		}
	}
</script>

<style>
	.line {
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px;
	}

	.viewText {
		font-size: 13px;
		color: gray;
		margin-left: 20px;
		margin-top: 10px;
	}

	.pageRadio {
		margin-left: 40px;
		font-size: 14px;
	}

	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		width: calc(100% - 50px);
		height: 35px;
		padding: 3px;
		margin-left: 20px;
	}

	.uploadView {
		width: 70px;
		background: #00baad;
		color: white;
		padding: 5px;
		text-align: center;
		margin-top: 30px;
		margin-bottom: 30px;
		margin-left: calc((100% - 70px)/2);
	}

	.shibieView {
		background: #e5e5e5;
		text-align: center;
		font-size: 13px;
		width: 160px;
		height: 100px;
		margin-top: -100px;
		margin-left: 150px;
	}
</style>
