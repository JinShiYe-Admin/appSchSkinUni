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
			<g-upload ref='gUpload' :mode="imgList0" :control='control' :deleteBtn='deleteBtn' uploadIndex="99"
				@chooseFile='chooseFile0' @imgDelete='imgDelete0' :maxCount="maxCount0" :columnNum="columnNum0"
				:showMaxCount="showMaxCount0">
			</g-upload>
			<view class="shibieView">
				<p v-if="healthColor.length==0" style='margin-top: 30px;color: red;'>请添加健康码</p>
				<p v-if="healthColor.length>0" style='margin-top: 10px;font-size: 18px;'
					:style="{color:healthColorStr}">{{healthColorChar}}</p>
				<p v-if="healthColor.length>0" style='margin-top: 10px;' :style="{color:healthColorStr}">
					{{healthResult}}
				</p>
				<p v-if="healthColor.length>0" style='margin-top: 10px;' :style="{color:healthColorStr}">{{healthTime}}
				</p>
			</view>
		</view>
		<view class="viewText">*本人当天行程码截图</view>
		<view class="uni-flex uni-row form-view choose-file">
			<g-upload ref='gUpload1' :mode="imgList1" :control='control' :deleteBtn='deleteBtn' uploadIndex="98"
				@chooseFile='chooseFile1' @imgDelete='imgDelete1' :maxCount="maxCount1" :columnNum="columnNum1"
				:showMaxCount="showMaxCount1">
			</g-upload>
			<view class="shibieView">
				<p v-if="itineraryImgUrl.length==0" style='margin-top: 30px;color: red;'>请添加行程码</p>
				<p v-if="itineraryImgUrl.length>0" style='margin-top: 7px;font-size: 14px;padding: 10px;'>七天内途径中高风险地区：</p>
				<p v-if="itineraryImgUrl.length>0&&itineraryRiskyArea==null" style='margin-top: 0px;font-size: 14px;padding: 10px;'>无</p>
				<p v-if="itineraryImgUrl.length>0&&itineraryRiskyArea" style='margin-top: 0px;font-size: 14px;padding: 10px;'>{{itineraryRiskyArea}}</p>
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
			<p @click='editOther()' class='otherEdit'>同住人<uni-icons type="compose" color="#00CFBD" size="18">
				</uni-icons>
			</p>
		</view>
		<view class="line"></view>
		<view v-if="otherList.length ==0" style="text-align: center;margin-top: 10px;font-size: 14px;color: chocolate;">
			如有同住人，请添加</view>
		<view v-for="(item,index) in otherList" :key="index">
			<view class='otherIndex'>同住人{{index+1}}</view>
			<view class="viewText">*同住人{{index+1}}姓名：</view>
			<view style="background: #e5e5e5;margin: 2px 20px;padding: 4px;text-align: center;font-size: 13px;">
				{{item.name}}
			</view>
			<view class="viewText">*同住人{{index+1}}当天健康码截图(请勿上传下载的健康码)</view>
			<view class="uni-flex uni-row form-view choose-file">
				<g-upload :mode="item.imgList0" :control='control' :deleteBtn='deleteBtn' :uploadIndex="setIndex(index)"
					@chooseFile='chooseFileOther0' @imgDelete='imgDeleteOther0' :maxCount="item.maxCount0"
					:columnNum="item.columnNum0" :showMaxCount="item.showMaxCount0">
				</g-upload>
				<view class="shibieView">
					<p v-if="item.healthColor.length==0" style='margin-top: 30px;color: red;'>请添加健康码</p>
					<p v-if="item.healthColor.length>0" style='margin-top: 10px;font-size: 18px;'
						:style="{color:item.healthColorStr}">{{item.healthColorChar}}</p>
					<p v-if="item.healthColor.length>0" style='margin-top: 10px;' :style="{color:item.healthColorStr}">
						{{item.healthResult}}
					</p>
					<p v-if="item.healthColor.length>0" style='margin-top: 10px;' :style="{color:item.healthColorStr}">
						{{item.healthTime}}
					</p>
				</view>
			</view>
			<view class="viewText">*同住人{{index+1}}当天行程码截图</view>
			<view class="uni-flex uni-row form-view choose-file">
				<g-upload :mode="item.imgList1" :control='control' :deleteBtn='deleteBtn' :uploadIndex="index"
					@chooseFile='chooseFileOther1' @imgDelete='imgDeleteOther1' :maxCount="item.maxCount1"
					:columnNum="item.columnNum1" :showMaxCount="item.showMaxCount1">
				</g-upload>
				<view class="shibieView">
					<p v-if="item.itineraryImgUrl.length==0" style='margin-top: 30px;color: red;'>请添加行程码</p>
					<p v-if="item.itineraryImgUrl.length>0" style='margin-top: 7px;font-size: 14px;padding: 10px;'>七天内途径中高风险地区：</p>
					<p v-if="item.itineraryImgUrl.length>0&&item.itineraryRiskyArea==null" style='margin-top: 0px;font-size: 14px;padding: 10px;'>无</p>
					<p v-if="item.itineraryImgUrl.length>0&&item.itineraryRiskyArea" style='margin-top: 0px;font-size: 14px;padding: 10px;'>{{item.itineraryRiskyArea}}</p>
				</view>
			</view>
			<view class="viewText">*同住人{{index+1}}是否有发热/咳嗽/流涕/咽疼等症状？</view>
			<radio-group @change="radioChangeOther(index)" style="margin-top: 5px;">
				<label class="radio pageRadio">
					<radio value="false" :checked="false == item.otherRadio" color="#00baad"
						style="transform:scale(0.7)" />没有
				</label>
				<label class="radio pageRadio">
					<radio value="true" :checked="true == item.otherRadio" color="#00baad"
						style="transform:scale(0.7)" />有
				</label>
			</radio-group>
		</view>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">特殊情况</view>
		</view>
		<view class="line"></view>
		<view class="viewText">如有特殊情况请填写并上传相关截图，若无特殊情况则不填写。</view>
		<textarea maxlength="100" v-model="content" class="rightView"
			style="height: 80px;margin-top: 10px;padding-top: 5px;margin-bottom: 10px;" placeholder="限100字内"></textarea>
		<view class="uni-flex uni-row form-view choose-file">
			<g-upload ref='gUpload2' :mode="imgList2" :control='control' :deleteBtn='deleteBtn' uploadIndex="97"
				@chooseFile='chooseFile2' @imgDelete='imgDelete2' :maxCount="maxCount2" :columnNum="columnNum2"
				:showMaxCount="showMaxCount2">
			</g-upload>
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
		<view style="height: 30px;"></view>
		<u-tabbar-my v-if='navItem.index<5' :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import {
		pathToBase64
	} from '../../commom/image-tools.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import Signature from '@/components/sin-signature/sin-signature.vue'
	// 七牛上传相关
	import gUpload from "@/components/g-upload/g-upload.vue"
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				curDate: '',
				baiduAuth: '',
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
				// otherRadio0: false,
				// otherRadio1: false,
				// otherRadio2: false,
				content: '',
				signContent: '',
				healthTime: '',
				healthColor: '',
				healthColorStr: '',
				healthColorChar: '',
				healthResult: '',
				healthImgUrl: '',
				itineraryRiskyArea: '',
				itineraryImgUrl: '',
				noteImgUrl: '',
				noteImgName: '',
				otherList: [], //同住人列表
				tempModel: {
					maxCount0: 1, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数
					showMaxCount0: 1, //单次上传最大数量
					columnNum0: 3, //每行显示的图片数量
					imgNames0: [], //服务器回传的图片名称
					imgList0: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
					imgFiles0: [], //选择的文件对象，用于上传时获取文件名  不需要改动

					maxCount1: 1, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数
					showMaxCount1: 1, //单次上传最大数量
					columnNum1: 3, //每行显示的图片数量
					imgNames1: [], //服务器回传的图片名称
					imgList1: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
					imgFiles1: [], //选择的文件对象，用于上传时获取文件名  不需要改动

					otherRadio: false,
					healthTime: '',
					healthColor: '',
					healthColorStr: '',
					healthColorChar: '',
					healthResult: '',
					healthImgUrl: '',
					itineraryRiskyArea: '',
					itineraryImgUrl: '',
				}
			}
		},
		components: {
			mynavBar,
			gUpload,
			Signature
		},
		onLoad(option) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			});
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			// index1界面用这个
			// this.navItem = util.getPageData(option);
			// index界面用这个
			this.navItem = util.getTabbarMenu();
			this.index_code = this.navItem.access.split("#")[1]
			var tempDate = new Date();
			// var preDate = new Date(tempDate.getTime() - 24 * 60 * 60 * 1000); //前一天
			var tempMoth = tempDate.getMonth() + 1;
			if (tempMoth < 10) {
				tempMoth = '0' + tempMoth;
			}
			var tempDay = tempDate.getDate();
			if (tempDay < 10) {
				tempDay = '0' + tempDay;
			}
			this.curDate = tempDate.getFullYear() + '-' + tempMoth + '-' + tempDay;
			// 2.16.学生同住人列表
			this.getRoomyList();
			//2.2.获取百度接口授权
			this.getBaiduAuth();
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
			setIndex(index) {
				return 'jkm' + index;
			},
			editOther() {
				util.openwithData("/pages/stuHealthMsg/roomyList", _this.navItem, {
					refreshOtherList(data) { //子页面调用父页面需要的方法
						console.log('refreshOtherList:' + JSON.stringify(data));
						var tempArray = [];
						for (var i = 0; i < data.data.length; i++) {
							var tempOther0 = data.data[i];
							var tempFlag = 0;
							for (var a = 0; a < _this.otherList.length; a++) {
								var tempOther1 = _this.otherList[a];
								if (tempOther0.id == tempOther1.id) {
									tempFlag = 1;
									var tempM1 = JSON.parse(JSON.stringify(tempOther1));
									tempM1.name = tempOther0.name;
									tempM1.relation = tempOther0.relation;
									tempArray.push(tempM1);
								}
							}
							if (tempFlag == 0) {
								var tempM1 = JSON.parse(JSON.stringify(_this.tempModel));
								tempM1.name = tempOther0.name;
								tempM1.id = tempOther0.id;
								tempM1.relation = tempOther0.relation;
								tempArray.push(tempM1);
							}
						}
						_this.otherList = [].concat(tempArray);
					}
				});
			},
			radioChange0() {
				this.selfRadio = !this.selfRadio;
			},
			radioChangeOther(index) {
				for (var i = 0; i < this.otherList.length; i++) {
					var tempM = this.otherList[i];
					if (index == i) {
						tempM.otherRadio =  !tempM.otherRadio;
					}
				}
			},
			textClick() {
				util.openwithData('/pages/stuHealthMsg/stuHealthMsgNotesIndex', {
					index_code: _this.index_code
				});
			},
			submit() {
				var tempFlag = 0;
				var relationList = [];
				// console.log('this.otherList:'+JSON.stringify(this.otherList));
				for (var i = 0; i < this.otherList.length; i++) {
					var tempM = this.otherList[i];
					if (tempM.healthColor.length == 0 ) {
						tempFlag = 1;
						this.showToast('请选择同住人'+(i+1)+'正确的健康码');
						break;
						return;
					}
					if (tempM.itineraryImgUrl.length == 0) {
						tempFlag = 1;
						this.showToast('请选择同住人'+(i+1)+'正确的行程码');
						break;
						return;
					}
					var tempR = {
						name:tempM.name,
						relation:tempM.relation,
						health_code_img_url:tempM.healthImgUrl,
						health_code_color:tempM.healthColor,
						health_code_time:tempM.healthTime,
						nucleic:tempM.healthResult,
						itinerary_card_img_url:tempM.itineraryImgUrl,
						risky_area:tempM.itineraryRiskyArea,
						is_unusual:tempM.otherRadio,
					}
					relationList.push(tempR);
				}
				if (this.healthColor.length == 0) {
					this.showToast('请选择本人正确的健康码');
				} else if (this.itineraryImgUrl.length == 0) {
					this.showToast('请选择本人正确的行程码');
				} else if (tempFlag > 0) {
					// this.showToast('请选择同住人正确的健康码或行程码');
				} else if (this.signContent.length == 0) {
					this.showToast('请签名');
				} else {
					var fileName = 'note' + new Date().getTime() + '.png';
					var tempData = this.signContent.replace('data:image/svg+xml;base64,', '');
					console.log('tempDatatempDatatempDatatempData');
					cloudFileUtil.uploadBase64Imge(1, fileName, tempData, this.QN_PB_NAME, this.QN_JKSB_NOTE, function(
						domain) {
						console.log("domain: " + JSON.stringify(domain));
						var tempArray = []
						if (_this.noteImgUrl.length > 0) {
							var tempM = {
								name: _this.noteImgName,
								url: _this.noteImgUrl
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
							date: _this.curDate,
							health_code_img_url: _this.healthImgUrl,
							health_code_color: _this.healthColor,
							health_code_time: _this.healthTime,
							nucleic: _this.healthResult,
							itinerary_card_img_url: _this.itineraryImgUrl,
							risky_area:_this.itineraryRiskyArea,
							is_unusual: _this.selfRadio,
							note: _this.content,
							note_img_list: tempArray,
							sign_img: domain,
							roomy_list:relationList,
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
			//2.2.获取百度接口授权
			getBaiduAuth() {
				var comData = {
					index_code: _this.index_code,
				}
				this.showLoading();
				// 2.2.获取百度接口授权
				this.post(this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/getAuth', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.baiduAuth = data.data.token;
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 2.16.学生同住人列表
			getRoomyList() {
				var comData = {
					index_code: _this.index_code,
					stu_code: this.personInfo.stu_code //
				}
				this.showLoading();
				// 2.16.学生同住人列表
				this.post(this.globaData.INTERFACE_HEALTH_DATA + 'roomy/list', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempArr = [];
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM0 = data.data.list[i];
							var tempM1 = JSON.parse(JSON.stringify(this.tempModel));
							tempM1.name = tempM0.name;
							tempM1.id = tempM0.id;
							tempM1.relation = tempM0.relation;
							tempArr.push(tempM1);
						}
						this.otherList = [].concat(tempArr);
					} else {
						this.showToast(data.msg);
					}
				});
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
						if (data.data.health_code_time) {
							this.healthTime = data.data.health_code_time;
						} else {
							this.healthTime = '';
						}
						if (data.data.health_code_color) {
							this.healthColor = data.data.health_code_color;
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
							this.healthColor = '';
						}
						if (data.data.nucleic) {
							this.healthResult = data.data.nucleic;
						} else {
							this.healthResult = '';
						}
					} else {
						this.healthImgUrl = '';
						this.showToast(data.msg);
					}
				});
			},
			// 2.4.获取行程卡信息
			// getItineraryCardInfo() {
			// 	var comData = {
			// 		index_code: _this.index_code,
			// 		url: this.itineraryImgUrl //
			// 	}
			// 	this.showLoading();
			// 	// 2.4.获取行程卡信息
			// 	this.post(this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/getItineraryCardInfo', comData, (data0,
			// 		data) => {
			// 		this.hideLoading();
			// 		if (data.code == 0) {
			// 			if (data.data.itinerary_card_time) {
			// 				this.itineraryTime = data.data.itinerary_card_time;
			// 			} else {
			// 				this.itineraryTime = '';
			// 			}
			// 			if (data.data.itinerary_card_color) {
			// 				this.itineraryColor = data.data.itinerary_card_color;
			// 				if (data.data.itinerary_card_color == 'g') {
			// 					this.itineraryColorStr = '#5ba669';
			// 					this.itineraryColorChar = '绿色';
			// 				} else if (data.data.itinerary_card_color == 'y') {
			// 					this.itineraryColorStr = '#f2b71f';
			// 					this.itineraryColorChar = '黄色';
			// 				} else if (data.data.itinerary_card_color == 'r') {
			// 					this.itineraryColorStr = '#e61a23';
			// 					this.itineraryColorChar = '红色';
			// 				}
			// 			} else {
			// 				this.itineraryColor = '';
			// 			}
			// 			if (data.data.itinerary_card_via_city) {
			// 				this.itineraryCity = data.data.itinerary_card_via_city;
			// 			} else {
			// 				this.itineraryCity = '';
			// 			}
			// 		} else {
			// 			this.showToast(data.msg);
			// 		}
			// 	});
			// },
			//附件上传相关👇
			chooseFileOther0(list, v, f, index) {
				index = index.replace('jkm', '');
				this.otherList[index].imgList0 = list
				this.otherList[index].imgFiles0 = this.otherList[index].imgFiles0.concat(f)
				this.otherList[index].maxCount0 = this.otherList[index].showMaxCount0 - list.length
				cloudFileUtil.uploadFiles(this, '1', list, this.QN_PB_NAME, this.QN_JKSB_JKM, (encName,
					encAddrStr) => {
					this.hideLoading();
					this.otherList[index].healthImgUrl = encAddrStr[0];
					var comData = {
						index_code: _this.index_code,
						url: _this.otherList[index].healthImgUrl //
					}
					_this.showLoading();
					// 2.3.获取健康码信息
					_this.post(_this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/getHealthCodeInfo', comData, (
						data0,
						data) => {
						_this.hideLoading();
						if (data.code == 0) {
							if (data.data.health_code_time) {
								_this.otherList[index].healthTime = data.data.health_code_time;
							} else {
								_this.otherList[index].healthTime = '';
							}
							if (data.data.health_code_color) {
								_this.otherList[index].healthColor = data.data.health_code_color;
								if (data.data.health_code_color == 'g') {
									_this.otherList[index].healthColorStr = '#5ba669';
									_this.otherList[index].healthColorChar = '绿码';
								} else if (data.data.health_code_color == 'y') {
									_this.otherList[index].healthColorStr = '#f2b71f';
									_this.otherList[index].healthColorChar = '黄码';
								} else if (data.data.health_code_color == 'r') {
									_this.otherList[index].healthColorStr = '#e61a23';
									_this.otherList[index].healthColorChar = '红码';
								}
							} else {
								_this.otherList[index].healthColor = '';
							}
							if (data.data.nucleic) {
								_this.otherList[index].healthResult = data.data.nucleic;
							} else {
								_this.otherList[index].healthResult = '';
							}
						} else {
							_this.otherList[index].healthImgUrl = '';
							_this.showToast(data.msg);
						}
					});
				});
			},
			chooseFileOther1(list, v, f, index) {
				this.otherList[index].imgList1 = list
				this.otherList[index].imgFiles1 = this.otherList[index].imgFiles1.concat(f)
				this.otherList[index].maxCount1 = this.otherList[index].showMaxCount1 - list.length

				pathToBase64(list[0])
					.then(base64 => {
						base64 = base64.replace('data:image/jpeg;base64,', '');
						base64 = base64.replace('data:image/jpg;base64,', '');
						base64 = base64.replace('data:image/png;base64,', '');
						uni.request({
							url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/travel_card' + '?access_token=' +
								_this.baiduAuth,
							method: 'POST',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							data: {
								image: base64
							},
							success: res => { //接口调用成功的回调函数
								if (res.statusCode === 200) {
									console.log('pathToBase64:' + JSON.stringify(res));
									// var tempPhone = res.data.result.手机号[0].word[0];
									var tempPhone = res.data.result['手机号'][0].word[0];
									var tempArea = res.data.result['途经地'][0].word;
									if (tempPhone.length == 11 && tempArea.length > 0) {
										cloudFileUtil.uploadFiles(_this, '1', list, _this.QN_PB_NAME, _this
											.QN_JKSB_JKM, (encName,
												encAddrStr) => {
												_this.hideLoading();
												_this.otherList[index].itineraryImgUrl = encAddrStr[0];
											});

										var comData = {
											index_code: _this.index_code,
											areas: tempArea.join(',') //
										}
										_this.showLoading();
										// 2.6.获取中高风险地区
										_this.post(_this.globaData.INTERFACE_HEALTH_DATA +
											'healthReport/findRiskyArea', comData, (data0,
												data) => {
												_this.hideLoading();
												if (data.code == 0) {
													_this.otherList[index].itineraryRiskyArea = data.data.areas;
												} else {
													_this.showToast(data.msg);
												}
											});
									} else {
										_this.showToast('您上传的行程码未成功识别!');
									}
								} else {
									_this.showToast('您上传的行程码未成功识别!');
								}
							},
							fail: (e) => { //接口调用失败的回调函数  比如跨域了，断网
								console.log("e: " + JSON.stringify(e));
								// _this.showToast('您上传的行程码未成功识别!');
							},
							complete: () => {}
						});
					})
					.catch(error => {
						console.error(error)
					});
			},
			chooseFile0(list, v, f) {
				this.imgList0 = list
				this.imgFiles0 = this.imgFiles0.concat(f)
				this.maxCount0 = this.showMaxCount0 - list.length
				// console.log("list: " + JSON.stringify(list));
				// console.log("v: " + JSON.stringify(v));
				// console.log("f: " + JSON.stringify(f));
				cloudFileUtil.uploadFiles(this, '1', this.imgList0, this.QN_PB_NAME, this.QN_JKSB_JKM, (encName,
					encAddrStr) => {
					this.hideLoading();
					// console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					// console.log("names: " + JSON.stringify(encName));
					this.healthImgUrl = encAddrStr[0];
					this.getHealthCodeInfo();
				});
			},
			chooseFile1(list, v, f) {
				this.imgList1 = list
				this.imgFiles1 = this.imgFiles1.concat(f)
				this.maxCount1 = this.showMaxCount1 - list.length
				pathToBase64(list[0])
					.then(base64 => {
						base64 = base64.replace('data:image/jpeg;base64,', '');
						base64 = base64.replace('data:image/jpg;base64,', '');
						base64 = base64.replace('data:image/png;base64,', '');
						uni.request({
							url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/travel_card' + '?access_token=' +
								this.baiduAuth,
							method: 'POST',
							header: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							data: {
								image: base64
							},
							success: res => { //接口调用成功的回调函数
								if (res.statusCode === 200) {
									console.log('pathToBase64:' + JSON.stringify(res));
									// var tempPhone = res.data.result.手机号[0].word[0];
									var tempPhone = res.data.result['手机号'][0].word[0];
									var tempArea = res.data.result['途经地'][0].word;
									if (tempPhone.length == 11 && tempArea.length > 0) {
										cloudFileUtil.uploadFiles(_this, '1', list, _this.QN_PB_NAME, _this
											.QN_JKSB_JKM, (encName,
												encAddrStr) => {
												_this.hideLoading();
												_this.itineraryImgUrl = encAddrStr[0];
											});

										var comData = {
											index_code: _this.index_code,
											areas: tempArea.join(',') //
										}
										_this.showLoading();
										// 2.6.获取中高风险地区
										_this.post(_this.globaData.INTERFACE_HEALTH_DATA +
											'healthReport/findRiskyArea', comData, (data0,
												data) => {
												_this.hideLoading();
												if (data.code == 0) {
													_this.itineraryRiskyArea = data.data.areas;
												} else {
													_this.showToast(data.msg);
												}
											});
									} else {
										_this.showToast('您上传的行程码未成功识别!');
									}
								} else {
									_this.showToast('您上传的行程码未成功识别!');
								}
							},
							fail: (e) => { //接口调用失败的回调函数  比如跨域了，断网
								console.log("e: " + JSON.stringify(e));
								// _this.showToast('您上传的行程码未成功识别!');
							},
							complete: () => {}
						});
					})
					.catch(error => {
						console.error(error)
					});
			},
			chooseFile2(list, v, f) {
				this.imgList2 = list
				this.imgFiles2 = this.imgFiles2.concat(f)
				this.maxCount2 = this.showMaxCount2 - list.length
				cloudFileUtil.uploadFiles(this, '1', this.imgList2, this.QN_PB_NAME, this.QN_JKSB_NOTE, (encName,
					encAddrStr) => {
					this.hideLoading();
					// console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					// console.log("names: " + JSON.stringify(encName));
					this.noteImgUrl = encAddrStr[0];
					this.noteImgName = encName[0];
				});
			},
			imgDeleteOther0(list, eq, fileeq, index) {
				index = index.replace('jkm', '');
				this.otherList[index].imgList0 = list
				this.otherList[index].imgFiles0.splice(fileeq, 1); //删除临时路径
				this.otherList[index].imgNames0.splice(eq, 1); //删除文件名
				this.otherList[index].maxCount0 = this.otherList[index].showMaxCount0 - list.length
				this.otherList[index].healthImgUrl = '';
				this.otherList[index].healthColor = '';
				// cloudFileUtil.qiniuDelete(this.imgList0, (data) => {
				// 	console.log('七牛:' + JSON.stringify(data));
				// });
			},
			imgDeleteOther1(list, eq, fileeq, index) {
				this.otherList[index].imgList1 = list
				this.otherList[index].imgFiles1.splice(fileeq, 1); //删除临时路径
				this.otherList[index].imgNames1.splice(eq, 1); //删除文件名
				this.otherList[index].maxCount1 = this.otherList[index].showMaxCount1 - list.length
				this.otherList[index].itineraryImgUrl = '';
				// cloudFileUtil.qiniuDelete(this.imgList0, (data) => {
				// 	console.log('七牛:' + JSON.stringify(data));
				// });
			},
			imgDelete0(list, eq, fileeq) {
				this.imgList0 = list
				this.imgFiles0.splice(fileeq, 1); //删除临时路径
				this.imgNames0.splice(eq, 1); //删除文件名
				this.maxCount0 = this.showMaxCount0 - list.length
				this.healthImgUrl = '';
				this.healthColor = '';
				// cloudFileUtil.qiniuDelete(this.imgList0, (data) => {
				// 	console.log('七牛:' + JSON.stringify(data));
				// });
			},
			imgDelete1(list, eq, fileeq) {
				this.imgList1 = list
				this.imgFiles1.splice(fileeq, 1); //删除临时路径
				this.imgNames1.splice(eq, 1); //删除文件名
				this.maxCount1 = this.showMaxCount1 - list.length
				this.itineraryImgUrl = '';
				// cloudFileUtil.qiniuDelete(this.imgList1, (data) => {
				// 	console.log('七牛:' + JSON.stringify(data));
				// });
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
		/* margin-bottom: 30px; */
		margin-left: calc((100% - 70px)/2);
	}

	.shibieView {
		background: #e5e5e5;
		text-align: center;
		font-size: 13px;
		width: 200px;
		height: 100px;
		margin-top: -100px;
		margin-left: 140px;
	}

	.otherIndex {
		text-align: center;
		border: 1px solid #00baad;
		width: 60px;
		margin-left: calc((100% - 60px)/2);
		margin-top: 20px;
		padding: 2px 5px;
		font-size: 14px;
		background: #caf3f0;
	}

	.otherEdit {
		margin-top: -20px;
		text-align: right;
		margin-right: 20px;
		font-size: 14px;
		color: #00CFBD;
	}
</style>
