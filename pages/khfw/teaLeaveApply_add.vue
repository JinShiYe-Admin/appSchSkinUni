<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="保存并发送" :textClick="textClick">
		</mynavBar>
		<uni-card isShadow style="margin: 10px;">
			<view class="typeCss"><uni-icons type="star-filled" color='#d9001b' size="10"></uni-icons>请假类别：</view>
			<radio-group @change="radioChange">
				<label class="uni-list-cell">
					<view style="text-align: left;">
						<radio value="1" color='#2c96bd' :checked="1 == currentRadio" />
					</view>
					<view>因公（工伤，派遣）</view>
				</label>
				<label class="uni-list-cell">
					<view>
						<radio value="0" color='#2c96bd' :checked="0 == currentRadio" />
					</view>
					<view>因私（事假、病假、婚假、丧假、产假）</view>
				</label>
			</radio-group>
			<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
					size="10"></uni-icons>请假时间：</view>
			<view @click="showPop()" class="show-time"><uni-icons type="calendar" color='gainsboro'></uni-icons>{{defaultData.startTime.length>0?defaultData.startTime+' ~ '+defaultData.endTime:'请选择开始时间和结束时间'}}</view>
			<view class="typeCss" style="margin-top: 20px;"><uni-icons type="star-filled" color='#d9001b'
					size="10"></uni-icons>请假事由：</view>
			<textarea style="margin-top: 10px;" maxlength="300" v-model="content" class="rightView" placeholder="请输入"></textarea>
			<!-- <view class="typeCss" style="margin-top: 20px;">上传材料：</view> -->
			<view class="uni-flex uni-row form-view choose-file">
				<view style="font-size: 14px;margin: -10px 0 10px -10px;">上传材料：<span class="file-des">
						{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}
					</span>
				</view>
				<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn'
					@chooseFile='chooseFile' @imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum"
					:showMaxCount="showMaxCount">
				</g-upload>
			</view>
		</uni-card>
		<view style="height: 10px;background: #f2f2f2;"></view>
		<lingfeng-timepicker ref="timePop" type="datetime-range" :defaultData="defaultData" :minDate="minDate" :maxDate="maxDate"
			@change="timeChange"></lingfeng-timepicker>
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
				currentRadio: 1,
				defaultData: {startTime:'',endTime:''},
				minDate: {
					year: this.moment().subtract(1, 'y').format('YYYY'),month: 1,date: 1
				},
				maxDate: {
					year: this.moment().add(1, 'y').format('YYYY'),month: 12,date: 31
				},
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
			}
		},
		components: {
			mynavBar,gUpload
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '添加请假申请';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '添加请假申请'
			});

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
				if (this.defaultData.startTime.length==0) {
					this.showToast('请选择请假时间');
					return;
				} else if (this.content.length==0) {
					this.showToast('请填写请假事由')
					return;
				}
				this.submitBtn();
			},
			radioChange: function(evt) {
				console.log('evt.detail.value:' + evt.detail.value)
				this.currentRadio = evt.detail.value;
			},
			showPop() {
				this.$refs.timePop.show();
			},
			timeChange(val) {
				console.log(val);
				if (val[1]>val[0]) {
					this.defaultData.startTime = val[0];
					this.defaultData.endTime = val[1];
					this.$refs.timePop.close();
				} else{
					this.showToast('请选择正确的开始时间和结束时间')
				}
				
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
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PB_NAME, this.QN_KHFW, (encName,
					encAddrStr) => {
					this.hideLoading();
					console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					console.log("names: " + JSON.stringify(encName));
					this.submitData(encName, encAddrStr);
				});
			},
			//附件上传相关👆
			submitData(encNameStr, encAddrStr){
				let imgArray = [];
				if (encNameStr.length > 0) {
					for (var i = 0; i < encNameStr.length; i++) {
						imgArray.push({
							// name: encNameStr[i],
							image_url: encAddrStr[i],
						})
					}
				}
				let comData = {
					type:this.currentRadio,
					start_time:this.defaultData.startTime,
					end_time:this.defaultData.endTime,
					explanation:this.content,
					dpt_code:this.personInfo.dpt_code,
					dpt_name:this.personInfo.dpt_name,
					resource_list:imgArray,
					vacation_day:1,
					index_code: this.navItem.index_code,
				}
				// 2.1.添加请假申请
				this.post(this.globaData.INTERFACE_KHFW + 'vacationApplication/add', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast(data.msg);
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshteaLeaveApply');
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
	
	.show-time{
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
</style>