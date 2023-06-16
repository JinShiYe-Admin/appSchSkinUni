<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="保存" :textClick="textClick">
		</mynavBar>
		<uni-row style="margin-top: 20px;">
			<uni-col :span="8">
				<view class="titleLeft">
					<uni-icons style="" type="star-filled" color='#d9001b' size="14"></uni-icons>年级：
				</view>
			</uni-col>
			<uni-col :span="16">
				<view @click="grdClick()" class="titleRight">
					{{grdStr}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view class="titleLeft">
					<uni-icons style="" type="star-filled" color='#d9001b' size="14"></uni-icons>班级：
				</view>
			</uni-col>
			<uni-col :span="16">
				<view @click="clsClick()" class="titleRight">
					{{clsStr}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view class="titleLeft">
					<uni-icons style="" type="star-filled" color='#d9001b' size="14"></uni-icons>学生：
				</view>
			</uni-col>
			<uni-col :span="16">
				<view @click="stuClick()" class="titleRight">
					{{stuStr.length>0?stuStr:'请选择'}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col v-if="subArray.length>0" :span="8">
				<view class="titleLeft">科目：</view>
			</uni-col>
			<uni-col v-if="subArray.length>0" :span="16">
				<view @click="subClick()" class="titleRight">
					{{subStr.length>0?subStr:'请选择'}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view class="titleLeft" style="border-radius: 5px;">
					<uni-icons style="" type="star-filled" color='#d9001b' size="14"></uni-icons>评语：
				</view>
			</uni-col>
			<uni-col :span="16">
				<span v-for="(name,index) in pingyuTempArr" :key="index">
					<uni-tag :inverted="true" :text="name"
						custom-style="border-color: #d7d7d7; color: #333333;background-color: white;margin: 0 5px 5px 0;"
						@click="clickTag(name)" />
				</span>
				<textarea style="margin-top: 10px;" maxlength="100" v-model="content" class="rightView"
					placeholder="请输入"></textarea>
			</uni-col>
			<uni-col :span="8" style="margin-top: 10px;">
				<view class="titleLeft">表扬：</view>
			</uni-col>
			<uni-col :span="16" style="margin-top: 10px;">
				<view class="titleRight">
					<htz-rate :value="byCount" @change="biaoyChange" disHref="/static/images/mixedAbl/biaoyang0.jpg"
						checkedHref="/static/images/mixedAbl/biaoyang1.jpg"></htz-rate>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view class="titleLeft">批评：</view>
			</uni-col>
			<uni-col :span="16">
				<view class="titleRight">
					<htz-rate :value="ppCount" @change="pipChange" disHref="/static/images/mixedAbl/piping0.jpg"
						checkedHref="/static/images/mixedAbl/piping1.jpg"></htz-rate>
				</view>
			</uni-col>
			<uni-col :span="6">
				<view class="titleLeft" style="">照片：</view>
			</uni-col>
			<uni-col :span="18" style="margin-top: -25px;">
				<view class="uni-flex uni-row form-view choose-file">
					<view style="font-size: 14px;margin-bottom: 10px;">附件<span class="file-des">
							{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}
						</span>
					</view>
					<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn'
						@chooseFile='chooseFile' @imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum"
						:showMaxCount="showMaxCount">
					</g-upload>
				</view>
			</uni-col>
		</uni-row>
		<view style="height: 5px;"></view>
		<uni-popup ref="popup0" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择年级</view>
			<view style="margin: 20px 10px;">
				<uni-grid :column="3">
					<uni-grid-item v-for="(item, index) in grdArray" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='grdSelect(index)'
							:style="index==grdIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</uni-popup>
		<uni-popup ref="popup1" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择班级</view>
			<view style="margin: 20px 10px;">
				<uni-grid :column="4">
					<uni-grid-item v-for="(item, index) in clsArray" :key="index" style="height: 40px;">
						<view class="grid-item-box gridBox" @click='clsSelect(index)'
							:style="index==clsIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</uni-popup>
		<uni-popup ref="popup2" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择学生</view>
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<uni-grid :column="4">
						<uni-grid-item v-for="(item, index) in stuArrayTemp" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='stuSelect(item, index)'
								:style="item.selectFlag==1?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.text}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</scroll-view>
			</view>
			<view style="height: 50px;margin-top: 20px;">
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #049f95;border-color: #049f95;color: #ffffff;"
					@click="popSure(1)">确定</button>
				<button class="mini-btn" style="margin-left: 50px;" type="default" size="mini"
					@click="popSure(0)">取消</button>
			</view>
			<view style="height: 20px;"></view>
		</uni-popup>
		<uni-popup ref="popup3" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择科目</view>
			<view style="margin: 20px 10px;">
				<uni-grid :column="3">
					<uni-grid-item v-for="(item, index) in subArray" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='subSelect(index)'
							:style="index==subIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import htzRate from '@/components/htz-rate/htz-rate.vue'
	// 七牛上传相关
	import gUpload from "@/components/g-upload/g-upload.vue"
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				byCount: 0,
				ppCount: 0,
				navItem: {},
				grdIndex: 0,
				grdArray: [{
					text: '',
					value: ''
				}],
				clsIndex: 0,
				clsArray: [{
					text: '',
					value: ''
				}],
				stuArray: [{
					text: '',
					value: ''
				}],
				stuArrayTemp: [{
					text: '',
					value: ''
				}],
				grdStr: '',
				clsStr: '',
				stuStr: '',
				subIndex: 0,
				subArray: [],
				subStr: '',
				content: '',
				pingyuTempArr: ['作业很棒', '上课认真', '课堂积极回答问题', '勤学好问', '乐于助人', '调皮捣蛋', '不遵守纪律'],
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
			gUpload,
			htzRate
		},
		methods: {
			biaoyChange(val) {
				if (val == this.byCount && this.byCount == 1) {
					this.byCount = 0;
				} else {
					this.byCount = val;
				}
				this.ppCount = 0;
			},
			pipChange(val) {
				if (val == this.ppCount && this.ppCount == 1) {
					this.ppCount = 0;
				} else {
					this.ppCount = val;
				}
				this.byCount = 0;
			},
			clickTag(name) {
				this.content += name;
			},
			textClick() {
				this.submitBtn();
			},
			grdClick() {
				this.$refs.popup0.open();
			},
			grdSelect(index) {
				console.log('this.grdArray:' + JSON.stringify(this.grdArray));
				if (this.grdIndex != index) {
					this.grdIndex = index;
					this.clsIndex = 0;
					this.grdStr = this.grdArray[this.grdIndex].text;
					this.getCls();
				}
				this.$refs.popup0.close();
			},
			clsClick() {
				this.$refs.popup1.open();
			},
			clsSelect(index) {
				if (this.clsIndex != index) {
					this.clsIndex = index;
					this.clsStr = this.clsArray[this.clsIndex].text;
					this.getStu();
					this.getSub();
					this.subIndex = 0;
					this.subArray = [];
					this.subStr = '';
				}
				this.$refs.popup1.close();
			},
			stuClick() {
				this.stuArrayTemp = JSON.parse(JSON.stringify(this.stuArray));
				this.$refs.popup2.open();
			},
			stuSelect(item) {
				if (item.selectFlag == 0) {
					item.selectFlag = 1;
				} else {
					item.selectFlag = 0;
				}

			},
			popSure(flag) {
				if (flag == 0) {
					this.stuArrayTemp = JSON.parse(JSON.stringify(this.stuArray));
				} else {
					this.stuArray = JSON.parse(JSON.stringify(this.stuArrayTemp));
					var tempStu = [];
					for (var i = 0; i < this.stuArray.length; i++) {
						var tempM = this.stuArray[i];
						if (tempM.selectFlag == 1) {
							tempStu.push(tempM.text);
						}
					}
					this.stuStr = tempStu.join(',');
				}
				this.$refs.popup2.close();
			},
			subClick() {
				this.$refs.popup3.open();
			},
			subSelect(index) {
				console.log('this.subArray:' + JSON.stringify(this.subArray));
				if (this.subIndex != index) {
					this.subIndex = index;
					this.subStr = this.subArray[this.subIndex].text;
				}
				this.$refs.popup3.close();
			},
			getSub(){
				var comData = {
					// grd_codes: this.grdArray[this.grdIndex].value,
					cls_codes: this.clsArray[this.clsIndex].value, //
					user_code: this.personInfo.user_code, //
					with_master:false,
					index_code: this.index_code,
				}
				this.showLoading();
				//1.14.班级任教列表
				this.post(this.globaData.INTERFACE_HR_SUB + 'clsTec', comData, (data0,data) => {
					this.hideLoading();
					if (data.code == 0) {
						let subList = data.data.list;
						let subArray = [];
						subList.map(function(currentValue) {
							let name = currentValue.sub_name;
							let obj = {};
							obj.value = currentValue.sub_code;
							obj.text = name;
							subArray.push(obj)
						})
						if (subArray.length > 0) {
							this.subArray = subArray;
							this.subStr = this.subArray[this.subIndex].text;
						} else {
							this.subArray = [];
							// this.showToast('无数据授权 无法获取年级');
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getGrd() { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray = [];
					grds.map(function(currentValue) {
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						grdArray.push(obj)
					})
					if (grdArray.length > 0) {
						this.grdArray = grdArray;
						this.grdStr = this.grdArray[this.grdIndex].text;
						this.getCls();
					} else {
						this.grdArray = [];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls() { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					get_cls: true,
					all_cls: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray = [];
					clss.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
						obj.value = currentValue.value;
						obj.text = name;
						clsArray.push(obj)
					})
					if (clsArray.length > 0) {
						this.clsArray = clsArray;
						this.clsStr = this.clsArray[this.clsIndex].text;
						this.getStu();
						this.getSub();
						this.subIndex = 0;
						this.subArray = [];
						this.subStr = '';
					} else {
						this.clsArray = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getStu() { //获取学生
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					get_stu: true,
					all_cls: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let stu = response.stu_list;
					let stuArray = [];
					stu.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部学生';
						obj.value = currentValue.value;
						obj.text = name;
						obj.selectFlag = 0;
						stuArray.push(obj)
					})
					stuArray = stuArray.sort((a, b) => a.text.localeCompare(b.text))
					this.stuStr = '';
					if (stuArray.length > 0) {
						this.stuArray = JSON.parse(JSON.stringify(stuArray));
						this.stuArrayTemp = JSON.parse(JSON.stringify(stuArray));
					} else {
						this.stuArray = [];
						this.stuArrayTemp = [];
						this.showToast('无数据授权 无法获取学生');
					}
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
			submitBtn() {
				if (this.stuStr.length == 0) {
					this.showToast('请选择学生');
					return;
				}
				if (this.content.length == 0) {
					this.showToast('请输入评语');
					return;
				}
				this.showLoading();
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PB_NAME, this.QN_XSZHSZPJ, (encName,
					encAddrStr) => {
					this.hideLoading();
					// console.log("encAddrStr: " + JSON.stringify(encAddrStr));
					// console.log("names: " + JSON.stringify(encName));
					this.submitData(encName, encAddrStr);
				});
			},
			//附件上传相关👆
			submitData(encNameStr, encAddrStr) {
				// console.log('encNameStr:' + JSON.stringify(encNameStr));
				// console.log('encAddrStr:' + JSON.stringify(encAddrStr));
				let imgArray = [];
				if (encNameStr.length > 0) {
					for (var i = 0; i < encNameStr.length; i++) {
						imgArray.push({
							name: encNameStr[i],
							url: encAddrStr[i],
						})
					}
				}
				// console.log('imgArray:'+JSON.stringify(imgArray));
				var tempStuArray = [];
				for (var i = 0; i < this.stuArray.length; i++) {
					var tempM = this.stuArray[i];
					if (tempM.selectFlag == 1) {
						tempStuArray.push({
							stu_code: tempM.value,
							stu_name: tempM.text,
						})
					}
				};
				var tempFlag = 0;
				var tempC = 0;
				if (this.byCount == 0 && this.ppCount == 0) {
					tempFlag = 0;
					tempC = 0;
				} else if (this.byCount > 0) {
					tempFlag = 1;
					tempC = this.byCount;
				} else {
					tempFlag = 2;
					tempC = this.ppCount;
				}
				// console.log('tempStuArray:'+JSON.stringify(tempStuArray));
				var tempData = {
					grd_code: this.grdArray[this.grdIndex].value, //年级代码
					grd_name: this.grdArray[this.grdIndex].text, //年级名称
					cls_code: this.clsArray[this.clsIndex].value, //班级代码
					cls_name: this.clsArray[this.clsIndex].text, //班级名称
					type: tempFlag, //评语类型 ，1表扬、2批评
					v: tempC, //等级
					comment: this.content, //评语
					stus: tempStuArray, //学生列表
					files: imgArray, //附件列表
					create_user_code: this.personInfo.user_code, //记录人代码
					create_user_name: this.personInfo.user_name, //发记录人姓名
					index_code: this.index_code,
				}
				if (this.subArray.length>0) {
					tempData.sub_code = this.subArray[this.subIndex].value;
					tempData.sub_name = this.subArray[this.subIndex].text;
				}
				console.log('tempData:' + JSON.stringify(tempData));
				this.showLoading();
				//1.2.添加
				this.post(this.globaData.INTERFACE_ZHSZM + 'stuComment/add', tempData, (data0, data) => {
					this.hideLoading();
					this.showToast(data.msg);
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshstuEvaluate');
						uni.navigateBack();
					}
				});
			},
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index = 100;
			itemData.text = '添加';
			this.navItem = itemData;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.index_code = itemData.index_code
			this.getGrd();
			//#ifdef H5
			document.title = ""
			this.wxTips = ',微信端不支持多选'; //如果是H5，需要提示该内容
			//#endif
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
	}
</script>

<style>
	.titleLeft {
		padding-left: 20px;
		text-align: left;
		color: #000000;
		font-size: 14px;
		min-height: 40px;
	}

	.titleRight {
		min-height: 40px;
		color: #7f7f7f;
		font-size: 14px;
		margin-right: 10px;
	}

	::v-deep .uni-date-x {
		padding: 0px !important;
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

	.gridBox {
		height: 40px;
		background-color: #f2f2f2;
		text-align: center;
		padding: 5px 5px 0px;
		margin: 5px;
		border-radius: 3px;
		color: #333333;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.gridBoxSelect {
		background-color: #2c96bd;
		color: #ffffff;
	}

	.mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: calc(100% - 300px);
		font-size: 14px;
		color: #333333;
		background: #d7d7d7;
	}

	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		padding-left: 5px;
		height: 80px;
		padding-top: 5px;
		margin: 0 10px 0 0;
		margin-right: 15px;
		width: auto;
	}

	::v-deep .uni-tag {
		padding: 0px 5px;
	}
</style>