<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="上报记录" :textClick="textClick"></mynavBar>
		<view style="font-size: 16px;text-align: center;margin-top: 20px;">{{curDate}}健康上报</view>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">个人健康信息</view>
		</view>
		<view class="line"></view>
		<view class="viewText">*学生：</view>
		<view style="background: #e5e5e5;margin: 2px 20px;padding: 4px;text-align: center;font-size: 13px;">{{personInfo.grd_name}} {{personInfo.cls_name}} {{personInfo.stu_name}}
		</view>
		<view class="viewText">*本人当天健康码截图</view>
		<view class="uni-flex uni-row form-view choose-file">
			<g-upload ref='gUpload0' :mode="imgList0" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile0'
				@imgDelete='imgDelete0' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount">
			</g-upload>
		</view>
		<view class="viewText">*本人当天行程码截图</view>
		<view class="uni-flex uni-row form-view choose-file">
			<g-upload ref='gUpload1' :mode="imgList1" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile1'
				@imgDelete='imgDelete1' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount">
			</g-upload>
		</view>
		<view class="viewText">*本人是否有发热/咳嗽/流涕/咽疼等症状？</view>
		<radio-group @change="radioChange" style="margin-top: 5px;">
			<label class="radio pageRadio">
				<radio value="0" :checked="0 == selfRadio" color="#00baad" style="transform:scale(0.7)"/>没有
			</label>
			<label class="radio pageRadio">
				<radio value="1" :checked="1 == selfRadio" color="#00baad" style="transform:scale(0.7)"/>有
			</label>
		</radio-group>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">同住人健康信息</view>
		</view>
		<view class="line"></view>
		<view class="viewText">*同住人中是否有新冠疫情感染者？</view>
		<radio-group @change="radioChange" style="margin-top: 5px;">
			<label class="radio pageRadio">
				<radio value="0" :checked="0 == otherRadio0" color="#00baad" style="transform:scale(0.7)"/>没有
			</label>
			<label class="radio pageRadio">
				<radio value="1" :checked="1 == otherRadio0" color="#00baad" style="transform:scale(0.7)"/>有
			</label>
		</radio-group>
		<view class="viewText">*14天内是否有同住人到过中高风险地区？</view>
		<radio-group @change="radioChange" style="margin-top: 5px;">
			<label class="radio pageRadio">
				<radio value="0" :checked="0 == otherRadio1" color="#00baad" style="transform:scale(0.7)"/>没有
			</label>
			<label class="radio pageRadio">
				<radio value="1" :checked="1 == otherRadio1" color="#00baad" style="transform:scale(0.7)"/>有
			</label>
		</radio-group>
		<view class="viewText">*同住人是否有发热/咳嗽/流涕/咽疼等症状？</view>
		<radio-group @change="radioChange" style="margin-top: 5px;">
			<label class="radio pageRadio">
				<radio value="0" :checked="0 == otherRadio2" color="#00baad" style="transform:scale(0.7)"/>没有
			</label>
			<label class="radio pageRadio">
				<radio value="1" :checked="1 == otherRadio2" color="#00baad" style="transform:scale(0.7)"/>有
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
			<g-upload ref='gUpload2' :mode="imgList2" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile2'
				@imgDelete='imgDelete2' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount">
			</g-upload>
		</view>
		<view style="padding:15px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">承诺签字</view>
		</view>
		<view class="line"></view>
		<view class="viewText">*本人同意授权以上信息给学校并确认信息无误。</view>
		<u-tabbar-my v-if='navItem.index<5' :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
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
				curDate:'',
				// 附件上传相关👇
				control: true, //是否显示上传 + 按钮 一般用于显示
				deleteBtn: true, //是否显示删除 按钮 一般用于显示
				maxCount: 1, //单次选择最大数量,初始值应该是:maxCount=showMaxCount-imgList.length 该值是可变值，需要根据已选择或服务器回传的图片数量做计算，得到下次进入图片选择控件时允许选择图片的最大数 
				showMaxCount: 1, //单次上传最大数量
				columnNum: 3, //每行显示的图片数量
				imgNames0: [], //服务器回传的图片名称
				imgNames1: [], //服务器回传的图片名称
				imgNames2: [], //服务器回传的图片名称
				imgList0: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgList1: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgList2: [], //选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				imgFiles0: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				imgFiles1: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				imgFiles2: [], //选择的文件对象，用于上传时获取文件名  不需要改动
				selfRadio:0,
				otherRadio0:0,
				otherRadio1:0,
				otherRadio2:0,
				content: '',
			}
		},
		components: {
			mynavBar,gUpload
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
			this.index_code=this.navItem.access.split("#")[1]
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
			textClick(){
				util.openwithData('/pages/stuHealthMsg/stuHealthMsgNotesIndex',{index_code:_this.index_code});
			},
			//附件上传相关👇
			chooseFile0(list, v, f) {
				this.imgList0 = list
				this.imgFiles0 = this.imgFiles0.concat(f)
				this.maxCount = this.showMaxCount - list.length
			},
			chooseFile1(list, v, f) {
				this.imgList1 = list
				this.imgFiles1 = this.imgFiles1.concat(f)
				this.maxCount = this.showMaxCount - list.length
			},
			chooseFile2(list, v, f) {
				this.imgList2 = list
				this.imgFiles2 = this.imgFiles2.concat(f)
				this.maxCount = this.showMaxCount - list.length
			},
			imgDelete0(list, eq, fileeq) {
				this.imgList0 = list
				this.imgFiles0.splice(fileeq, 1); //删除临时路径
				this.imgNames0.splice(eq, 1); //删除文件名
				this.maxCount = this.showMaxCount - list.length
			},
			imgDelete1(list, eq, fileeq) {
				this.imgList1 = list
				this.imgFiles1.splice(fileeq, 1); //删除临时路径
				this.imgNames1.splice(eq, 1); //删除文件名
				this.maxCount = this.showMaxCount - list.length
			},
			imgDelete2(list, eq, fileeq) {
				this.imgList2 = list
				this.imgFiles2.splice(fileeq, 1); //删除临时路径
				this.imgNames2.splice(eq, 1); //删除文件名
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
	.pageRadio{
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
</style>
