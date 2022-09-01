<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<view style="font-size: 16px;text-align: center;margin-top: 20px;">{{curDate}}健康上报</view>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">个人健康信息</view>
		</view>
		<view class="line"></view>
		<view class="viewText">*学生：</view>
		<view style="background: #e5e5e5;margin: 2px 20px;padding: 4px;text-align: center;font-size: 13px;">
			{{grd_name}} {{cls_name}} {{stu_name}}
		</view>
		<view class="viewText">*本人当天健康码截图</view>
		<image mode="scaleToFill" style="margin-top: 20px;" :src="healthImgUrl" @click="checkEnc(healthImgUrl)" class="pageImg"></image>
		<view class="shibieView">
			<p style='padding-top: 10px;font-size: 18px;' :style="{color:healthColorStr}">{{healthColorChar}}</p>
			<p style='margin-top: 10px;' :style="{color:healthColorStr}">{{healthResult}}</p>
			<p style='margin-top: 10px;' :style="{color:healthColorStr}">{{healthTime}}</p>
		</view>
		<view class="viewText" style="margin-top: 30px;">*本人当天行程码截图</view>
		<image mode="scaleToFill" style="margin-top: 20px;" :src="itineraryImgUrl" @click="checkEnc(itineraryImgUrl)" class="pageImg"></image>
		<view class="shibieView">
			<p style='margin-top: 0px;font-size: 14px;padding: 10px;'>七天内途径中高风险地区：</p>
			<p v-if="itineraryRiskyArea==null" style='margin-top: 0px;font-size: 14px;padding: 10px;'>无</p>
			<p v-if="itineraryRiskyArea" style='margin-top: 0px;font-size: 14px;padding: 10px;'>{{itineraryRiskyArea}}</p>
		</view>
		<view class="viewText" style="margin-top: 30px;">*本人是否有发热/咳嗽/流涕/咽疼等症状？</view>
		<radio-group style="margin-top: 5px;">
			<label class="radio pageRadio">
				<radio value="false" disabled :checked="false == selfRadio" color="#00baad" style="transform:scale(0.7)" />没有
			</label>
			<label class="radio pageRadio">
				<radio value="true" disabled :checked="true == selfRadio" color="#00baad" style="transform:scale(0.7)" />有
			</label>
		</radio-group>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">同住人健康信息</view>
		</view>
		<view class="line"></view>
		<view v-if="otherList.length ==0" style="text-align: center;margin-top: 10px;font-size: 14px;color: chocolate;">
			没有同住人</view>
		<view v-for="(item,index) in otherList" :key="index">
			<view class='otherIndex'>同住人{{index+1}}</view>
			<view class="viewText">*同住人{{index+1}}姓名：</view>
			<view style="background: #e5e5e5;margin: 2px 20px;padding: 4px;text-align: center;font-size: 13px;">
				{{item.name}}
			</view>
			<view class="viewText">*同住人{{index+1}}当天健康码截图</view>
			<image mode="scaleToFill" style="margin-top: 20px;" :src="item.healthImgUrl" @click="checkEnc(item.healthImgUrl)" class="pageImg"></image>
			<view class="shibieView">
				<p style='padding-top: 10px;font-size: 18px;' :style="{color:item.healthColorStr}">{{item.healthColorChar}}</p>
				<p style='margin-top: 10px;' :style="{color:item.healthColorStr}">{{item.healthResult}}</p>
				<p style='margin-top: 10px;' :style="{color:item.healthColorStr}">{{item.healthTime}}</p>
			</view>
			<view class="viewText">*同住人{{index+1}}当天行程码截图</view>
			<image mode="scaleToFill" style="margin-top: 20px;" :src="item.itineraryImgUrl" @click="checkEnc(item.itineraryImgUrl)" class="pageImg"></image>
			<view class="shibieView">
				<p style='margin-top: 0px;font-size: 14px;padding: 10px;'>七天内途径中高风险地区：</p>
				<p v-if="item.itineraryRiskyArea==null||item.itineraryRiskyArea.length==0" style='margin-top: 0px;font-size: 14px;padding: 10px;'>无</p>
				<p v-if="item.itineraryRiskyArea" style='margin-top: 0px;font-size: 14px;padding: 10px;'>{{item.itineraryRiskyArea}}</p>
			</view>
			<view class="viewText">*同住人{{index+1}}是否有发热/咳嗽/流涕/咽疼等症状？</view>
			<radio-group style="margin-top: 5px;">
				<label class="radio pageRadio">
					<radio value="false" disabled :checked="false == item.otherRadio" color="#00baad" style="transform:scale(0.7)" />没有
				</label>
				<label class="radio pageRadio">
					<radio value="true" disabled :checked="true == item.otherRadio" color="#00baad" style="transform:scale(0.7)" />有
				</label>
			</radio-group>
		</view>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">特殊情况</view>
		</view>
		<view class="line"></view>
		<view class="viewText">如有特殊情况请填写并上传相关截图，若无特殊情况则不填写。</view>
		<textarea disabled maxlength="100" v-model="content" class="rightView"
			style="height: 80px;margin-top: 10px;padding-top: 5px;margin-bottom: 10px;" placeholder="限100字内"></textarea>
		<image v-if="noteImgUrl.length>0" mode="scaleToFill" :src="noteImgUrl" @click="checkEnc(noteImgUrl)" class="pageImg"></image>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">承诺签字</view>
		</view>
		<view class="line"></view>
		<view class="viewText">*本人同意授权以上信息给学校并确认信息无误。</view>
		<view style="border: 1rpx dashed #555555;margin: 10px 20px;">
			<!-- <Signature ref="sig" v-model="signContent"></Signature> -->
			<image mode="widthFix" :src="signImgUrl" style="width: 100%;" class="signImg"></image>
		</view>
		<view style="height: 20px;"></view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import Signature from '@/components/sin-signature/sin-signature.vue'
	// 七牛上传相关
	import gUpload from "@/components/g-upload/g-upload.vue"
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
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
				
				signImgUrl:'',
				grd_name:'',
				cls_name:'',
				stu_name:'',
				itineraryCity:''
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
			this.personInfo = util.getPersonal();
			this.navItem = util.getPageData(option);
			this.navItem.text = '上报详情';
			this.navItem.index = 100;
			// var tempDate = new Date();
			// var preDate = new Date(tempDate.getTime() - 24 * 60 * 60 * 1000); //前一天
			// this.curDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
			this.getDetailById();

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
			checkEnc: function(tempUrl) {
				console.log('tempUrl:' + tempUrl);
				util.openFile(tempUrl);
			},
			// 2.6.根据id获取上报记录
			getDetailById() {
				var comData = {
					index_code: this.navItem.access,
					id: this.navItem.id //
				}
				this.showLoading();
				// 2.6.根据id获取上报记录
				this.post(this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/getById', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.grd_name = data.data.grd_name;
						this.cls_name = data.data.cls_name;
						this.stu_name = data.data.stu_name;
						this.healthResult = data.data.nucleic;
						this.itineraryCity = data.data.itinerary_card_via_city;
						this.curDate = data.data.date;
						this.content = data.data.note;
						this.itineraryTime = data.data.itinerary_card_time;
						this.healthImgUrl = data.data.health_code_img_url;
						this.signImgUrl = data.data.sign_img;
						this.itineraryRiskyArea = data.data.risky_area;
						if (data.data.note_img_list&&data.data.note_img_list.length>0) {
							this.noteImgUrl = data.data.note_img_list[0].url;
						}
						this.healthTime = data.data.health_code_time;
						this.selfRadio = data.data.is_unusual;
						this.itineraryImgUrl = data.data.itinerary_card_img_url;
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
						for (var i = 0; i < data.data.room_list.length; i++) {
							var tempM = data.data.room_list[i];
							var tempR = {
								name:tempM.name,
								relation:tempM.relation,
								healthImgUrl:tempM.health_code_img_url,
								healthTime:tempM.health_code_time,
								healthResult:tempM.nucleic,
								itineraryImgUrl:tempM.itinerary_card_img_url,
								itineraryRiskyArea:tempM.risky_area,
								otherRadio:tempM.is_unusual,
							}
							if (tempM.health_code_color == 'g') {
								tempR.healthColorStr = '#5ba669';
								tempR.healthColorChar = '绿码';
							} else if (tempM.health_code_color == 'y') {
								tempR.healthColorStr = '#f2b71f';
								tempR.healthColorChar = '黄码';
							} else if (tempM.health_code_color == 'r') {
								tempR.healthColorStr = '#e61a23';
								tempR.healthColorChar = '红码';
							}
							this.otherList.push(tempR);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			}
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
		width: 200px;
		height: 100px;
		margin-top: -100px;
		margin-left: 140px;
	}
	
	.pageImg{
		width: 100px;height: 100px;
		margin: 5px 0 0 20px;
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
</style>
