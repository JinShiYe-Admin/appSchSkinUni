<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="navRightText"
			:textClick="textClick">
		</mynavBar>
		<uni-card isShadow style="margin: 20px 5px 0;">
			<view style="font-size: 16px;font-weight: 900;">作业内容</view>
			<view class="select-line"></view>
			<uni-row style="margin-top: 10px;">
				<uni-col :span="6">
					<view class="rowStyle">科目：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{navItem.sub_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">作业内容：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{navItem.content}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">截止时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{navItem.deadline}}</view>
				</uni-col>
				<uni-col v-if="navItem.files.length>0" :span="6">
					<view class="rowStyle">附件：</view>
				</uni-col>
				<uni-col v-if="navItem.files.length>0" :span="18">
					<g-upload ref='gUpload' :mode="hmwkImgList" :control='false' :deleteBtn='false' columnNum="3"></g-upload>
				</uni-col>
			</uni-row>
			<view v-if="navItem.type == 1">
				<view style="font-size: 16px;font-weight: 900;margin-top: 20px;">答题</view>
				<view class="select-line"></view>
				<view v-if="subFlag == 0&&navItem.correct_status==0">
					<textarea style="margin-top: 10px;" maxlength="300" v-model="content" class="rightView"
						placeholder="请输入"></textarea>
					<view class="uni-flex uni-row form-view choose-file">
						<view style="font-size: 14px;margin: -10px 0 10px -10px;">上传作业：<span class="file-des">
								{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}
							</span>
						</view>
						<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn'
							@chooseFile='chooseFile' @imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum"
							:showMaxCount="showMaxCount" uploadIndex='1'>
						</g-upload>
					</view>
				</view>
				<view v-if="subFlag == 1">
					<view v-if="navItem.submit_status == 0" style="text-align: center;margin: 10px 0;font-size: 13px;">
						无
					</view>
					<view v-else>
						<view class="rowStyle">答：{{navItem.submit_answer.length>0?navItem.submit_answer:'无'}}</view>
						<g-upload ref='gUpload' :mode="submitImgList" :control='false' :deleteBtn='false' columnNum="3"></g-upload>
					</view>
					<view style="font-size: 16px;font-weight: 900;margin-top: 20px;">批改情况</view>
					<view class="select-line"></view>
					<view v-if="navItem.correct_status == 0" style="text-align: center;margin: 10px 0;font-size: 13px;">
						无
					</view>
					<view v-else>
						<view style="text-align: center;color: #d9001b;font-size: 32px;margin-top: 20px;">
							{{navItem.correct_score}} {{navItem.correct_evaluate_name}}</view>
						<view style="text-align: center;color: #000;font-size: 14px;margin: 20px 0;">
							{{navItem.create_user_name}} {{navItem.correct_time}}</view>
					</view>
				</view>
			</view>
		</uni-card>
		<view style="height: 10px;background: #f2f2f2;"></view>
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
				navRightText: '',
				content: '',
				hmwkImgList:[],//作业的附件
				submitImgList:[],//学生作业附件
				subFlag: 0, //是否超过截止时间，没有0，超过1
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
			this.navItem.text = '我的作业';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '我的作业'
			});
			for (var i = 0; i < this.navItem.files.length; i++) {
				this.hmwkImgList.push(this.navItem.files[i].url);
			}
			for (var i = 0; i < this.navItem.submit_files.length; i++) {
				this.submitImgList.push(this.navItem.submit_files[i].url);
			}
			var tempT0 = this.moment().format('YYYY-MM-DD HH:mm');
			var tempF0 = this.moment(this.navItem.deadline).diff(tempT0, 'minutes');
			if (tempF0 > 0 && this.navItem.type == 1 && this.navItem.correct_status == 0) {
				this.navRightText = '提交';
				if (this.navItem.submit_answer) {
					this.content = this.navItem.submit_answer;
				}
				if (this.navItem.submit_files) {
					for (var i = 0; i < this.navItem.submit_files.length; i++) {
						// var tempM = this.navItem.submit_files[i];
						// this.imgList.push(tempM.url);
						this.imgList.push(this.navItem.submit_files[i].url);
					}
					this.maxCount = this.showMaxCount - this.imgList.length;
				}
			}
			if (tempF0 <= 0 || this.navItem.correct_status == 1) {
				this.subFlag = 1;
			}
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
			textClick() {
				if (this.content.length == 0 && this.imgList.length == 0) {
					this.showToast('请先答题');
					return;
				}
				this.submitBtn();
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
				this.showLoading();
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PB_NAME, this.QN_HOMEWORKSTU, (encName,
					encAddrStr) => {
					this.hideLoading();
					// console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					// console.log("names: " + JSON.stringify(encName));
					this.submitData(encName, encAddrStr);
				});
			},
			//附件上传相关👆
			submitData(encNameStr, encAddrStr) {
				let imgArray = [];
				if (encAddrStr.length > 0) {
					for (var i = 0; i < encAddrStr.length; i++) {
						imgArray.push({
							name: encNameStr[i],
							url: encAddrStr[i],
						})
					}
				}
				let comData = {
					id: this.navItem.id,
					submit_answer: this.content,
					submit_files: imgArray,
					index_code: this.navItem.index_code,
				}
				// 6.2.提交
				this.post(this.globaData.INTERFACE_HMWK + 'stuWorkSubmit/submit', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast(data.msg);
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshStuIndex');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.card-line {
		text-align: center;
		font-size: 25px;
		color: red;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 1px solid green;
		width: 100px;
		margin-left: calc((100% - 100px)/2);
	}

	.select-line {
		height: 1px;
		background-color: #aaaaaa;
		/* margin: 0 -15px; */
	}

	.rowStyle {
		font-size: 14px;
		min-height: 30px;
		/* overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; */
		margin-top: 5px;
		word-break: break-all;
	}

	::v-deep .uni-grid-item--border {
		border-bottom: 0px !important;
		border-right: 0px !important;
	}

	::v-deep .uni-grid-item--border-top {
		border-top: 0px !important;
	}

	::v-deep .uni-grid--border {
		border-left: 0px !important;
	}

	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		width: calc(100% - 40px);
		margin-left: 15px;
		height: 80px;
		padding: 5px 0 10px 10px;
	}
</style>