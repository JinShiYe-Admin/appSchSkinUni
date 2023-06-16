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
			<textarea style="margin-top: 10px;" maxlength="100" v-model="content" class="rightView"
				placeholder="请输入"></textarea>
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
				this.submitBtn();
			},
			clickType(flag) {
				this.hmwkType = flag;
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
				let comData = {
					type: this.hmwkType,
					sub_code: this.subList[this.subIndex].sub_code,
					sub_name: this.subList[this.subIndex].sub_name,
					content: this.content,
					deadline: this.endTime,
					create_user_code: this.personInfo.user_code,
					create_user_name: this.personInfo.user_name,
					files: imgArray,
					clss: tempCls,
					index_code: this.navItem.index_code,
				}
				// 5.2.添加作业
				this.post(this.globaData.INTERFACE_HMWK + 'stuWork/add', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast(data.msg);
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshaddList');
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
</style>