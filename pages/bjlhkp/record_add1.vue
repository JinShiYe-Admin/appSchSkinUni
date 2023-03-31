<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<uni-row style="margin-top: 20px;">
			<uni-col :span="8">
				<view class="titleLeft">
					<uni-icons style="" type="star-filled" color='#d9001b' size="14"></uni-icons>日期：
				</view>
			</uni-col>
			<uni-col :span="16">
				<view class="titleRight" style="margin-top: -10px;">
					<uni-datetime-picker type="date" :clear-icon="false" :border="false" v-model="defTime" />
					<uni-easyinput-select style="float: left;margin-top: -35px;width: 40px;margin-left: 120px;"
						:inputBorder="false" suffixIcon="arrowdown" disabled></uni-easyinput-select>
				</view>
				<view style="height: 10px;"></view>
			</uni-col>
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
				<view class="titleLeft">学生：</view>
			</uni-col>
			<uni-col :span="16">
				<view @click="stuClick()" class="titleRight">
					{{stuStr.length>0?stuStr:'请选择'}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8" style="margin-top: 5px;">
				<view class="titleLeft">
					<uni-icons style="" type="star-filled" color='#d9001b' size="14"></uni-icons>二级分类：
				</view>
			</uni-col>
			<uni-col :span="16" style="margin-top: 5px;">
				<view @click="secClick()" class="titleRight">
					{{secStr}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view class="titleLeft">
					<uni-icons style="" type="star-filled" color='#d9001b' size="14"></uni-icons>项目：
				</view>
			</uni-col>
			<uni-col :span="16">
				<view @click="itemClick()" class="titleRight">
					{{itemStr}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8" style="margin-top: 15px;">
				<view class="titleLeft" style="">
					<uni-icons style="" type="star-filled" color='#d9001b' size="14"></uni-icons>
					扣分/加分：
				</view>
			</uni-col>
			<uni-col :span="16" style="margin-top: 15px;">
				<input maxlength="3" type="number" v-model="score" class="rightView"
					style="height: 35px;margin-top: -10px;font-size: 14px;" placeholder="分数" />
				<view style="height: 10px;font-size: 11px;margin-top: 2px;">(扣分请在数字前输入'-'号,如'扣5分',输入'-5')</view>
			</uni-col>
			<uni-col :span="8" style="margin-top: 15px;">
				<view class="titleLeft" style="">说明：</view>
			</uni-col>
			<uni-col :span="16" style="margin-top: 15px;">
				<textarea maxlength="50" v-model="content" class="rightView" placeholder="请输入"></textarea>
			</uni-col>
			<uni-col :span="6" style="">
				<view class="titleLeft" style="margin-top: 10px;">照片：</view>
			</uni-col>
			<uni-col :span="18" style="margin-top: -15px;">
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
		<view style="height: 50px;margin-top: 10px;">
			<button class="mini-btn submitBtn" type="default" size="mini"
				style="background-color: #049f95;border-color: #049f95;color: #ffffff;" @click="submitBtn()">保存</button>
		</view>
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
			<!-- <view style="height: 5px;"></view> -->
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
			<!-- <view style="height: 5px;"></view> -->
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
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择二级分类</view>
			<view style="margin: 20px 10px;">
				<uni-grid :column="1">
					<uni-grid-item v-for="(item, index) in secArray" :key="index" style="height: 40px;">
						<view class="grid-item-box gridBox" @click='secSelect(index)'
							:style="index==secIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.name}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<!-- <view style="height: 5px;"></view> -->
		</uni-popup>
		<uni-popup ref="popup4" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择项目</view>
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<uni-grid :column="1">
						<uni-grid-item v-for="(item, index) in itemArray" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='itemSelect(index)'
								:style="index==itemIndex?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.name}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</scroll-view>
			</view>
			<!-- <view style="height: 5px;"></view> -->
		</uni-popup>
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
				icon: '',
				navItem: {},
				pagedata: [],
				defTime: this.moment().format('YYYY-MM-DD'),
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
				secIndex: 0,
				secArray: [{
					text: '',
					value: ''
				}],
				itemIndex: 0,
				itemArray: [{
					text: '',
					value: ''
				}],
				grdStr: '',
				clsStr: '',
				stuStr: '',
				secStr: '',
				itemStr: '',
				content: '',
				score: '',
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
		methods: {
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
				}
				this.$refs.popup1.close();
			},
			stuClick() {
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
					this.stuArrayTemp = this.stuArray;
				} else {
					this.stuArray = this.stuArrayTemp;
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
			secClick() {
				this.$refs.popup3.open();
			},
			secSelect(index) {
				if (this.secIndex != index) {
					this.secIndex = index;
					this.itemIndex = 0;
					this.secStr = this.secArray[this.secIndex].name;
					this.getItemList();
				}
				this.$refs.popup3.close();
			},
			itemClick() {
				this.$refs.popup4.open();
			},
			itemSelect(index) {
				if (this.itemIndex != index) {
					this.itemIndex = index;
					this.itemStr = this.itemArray[this.itemIndex].name;
				}
				this.$refs.popup4.close();
			},
			// getGrd() { //获取年级
			// 	let comData = {
			// 		op_code: 'index',
			// 		get_grd: true,
			// 		all_grd: false,
			// 		index_code: this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
			// 		this.hideLoading()
			// 		let grds = response.grd_list;
			// 		let grdArray = [];
			// 		grds.map(function(currentValue) {
			// 			let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
			// 			let obj = {};
			// 			obj.value = currentValue.value;
			// 			obj.text = name;
			// 			grdArray.push(obj)
			// 		})
			// 		if (grdArray.length > 0) {
			// 			this.grdArray = grdArray;
			// 			this.grdStr = this.grdArray[this.grdIndex].text;
			// 			this.getCls();
			// 		} else {
			// 			this.grdArray = [];
			// 			this.showToast('无数据授权 无法获取年级');
			// 		}
			// 	})
			// },
			// getCls() { //获取班级
			// 	let comData = {
			// 		op_code: 'index',
			// 		grd_code: this.grdArray[this.grdIndex].value,
			// 		get_cls: true,
			// 		all_cls: false,
			// 		index_code: this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
			// 		this.hideLoading()
			// 		let clss = response.cls_list;
			// 		let clsArray = [];
			// 		clss.map(function(currentValue) {
			// 			let obj = {};
			// 			let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
			// 			obj.value = currentValue.value;
			// 			obj.text = name;
			// 			clsArray.push(obj)
			// 		})
			// 		if (clsArray.length > 0) {
			// 			this.clsArray = clsArray;
			// 			this.clsStr = this.clsArray[this.clsIndex].text;
			// 			this.getStu();
			// 		} else {
			// 			this.clsArray = [];
			// 			this.showToast('无数据授权 无法获取班级');
			// 		}
			// 	})
			// },
			// getStu() { //获取学生
			// 	let comData = {
			// 		op_code: 'index',
			// 		grd_code: this.grdArray[this.grdIndex].value,
			// 		cls_code: this.clsArray[this.clsIndex].value,
			// 		get_stu: true,
			// 		all_cls: false,
			// 		index_code: this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
			// 		this.hideLoading()
			// 		let stu = response.stu_list;
			// 		let stuArray = [];
			// 		stu.map(function(currentValue) {
			// 			let obj = {};
			// 			let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部学生';
			// 			obj.value = currentValue.value;
			// 			obj.text = name;
			// 			obj.selectFlag = 0;
			// 			stuArray.push(obj)
			// 		})
			// 		stuArray = stuArray.sort((a, b) => a.text.localeCompare(b.text))
			// 		this.stuStr = '';
			// 		if (stuArray.length > 0) {
			// 			this.stuArray = stuArray;
			// 			this.stuArrayTemp = stuArray;
			// 		} else {
			// 			this.stuArray = [];
			// 			this.stuArrayTemp = [];
			// 			this.showToast('无数据授权 无法获取学生');
			// 		}
			// 	})
			// },
			getGrd() { //获取年级
				let comData = {
					is_finish: '0',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'grd', comData, response => {
					this.hideLoading()
					let grds = response.list;
					let grdArray = [];
					grds.map(function(currentValue) {
						let obj = {};
						obj.value = currentValue.grd_code;
						obj.text = currentValue.grd_name;
						grdArray.push(obj)
					})
					if (grdArray.length > 0) {
						this.grdArray = grdArray;
						this.grdStr = this.grdArray[this.grdIndex].text;
						this.getCls();
					} else {
						this.grdArray = [];
						this.showToast(data.msg);
					}
				})
			},
			getCls() { //获取班级
				let comData = {
					grd_codes: this.grdArray[this.grdIndex].value,
					is_finish: '0',
					all_cls: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'cls', comData, response => {
					this.hideLoading()
					let clss = response.list;
					let clsArray = [];
					clss.map(function(currentValue) {
						let obj = {};
						obj.value = currentValue.cls_code;
						obj.text = currentValue.cls_name;
						clsArray.push(obj)
					})
					if (clsArray.length > 0) {
						this.clsArray = clsArray;
						this.clsStr = this.clsArray[this.clsIndex].text;
						this.getStu();
					} else {
						this.clsArray = [];
						this.showToast(data.msg);
					}
				})
			},
			getStu() { //获取学生
				let comData = {
					op_code: 'index',
					grd_codes: this.grdArray[this.grdIndex].value,
					cls_codes: this.clsArray[this.clsIndex].value,
					order: 'stu_name',
					sort: 'ASC',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'stu', comData, response => {
					this.hideLoading()
					let stu = response.list;
					let stuArray = [];
					stu.map(function(currentValue) {
						let obj = {};
						// let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部学生';
						obj.value = currentValue.stu_code;
						obj.text = currentValue.stu_name;
						obj.selectFlag = 0;
						stuArray.push(obj)
					})
					// stuArray = stuArray.sort((a, b) => a.text.localeCompare(b.text))
					this.stuStr = '';
					if (stuArray.length > 0) {
						this.stuArray = stuArray;
						this.stuArrayTemp = stuArray;
					} else {
						this.stuArray = [];
						this.stuArrayTemp = [];
						this.showToast(data.msg);
					}
				})
			},
			getSecList() {
				//二级分类列表
				let comData = {
					fir_id: this.navItem.fir_id,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'sec/list', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						if (data.data.list && data.data.list.length > 0) {
							this.secArray = data.data.list;
							this.secStr = this.secArray[this.secIndex].name;
							this.getItemList();
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getItemList() {
				//2.1.项目列表
				let comData = {
					sec_id: this.secArray[this.secIndex].id,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'item/list', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						if (data.data.list && data.data.list.length > 0) {
							this.itemArray = data.data.list;
							this.itemStr = this.itemArray[this.itemIndex].name;
						}
					} else {
						this.showToast(data.msg);
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
				if (this.score.length == 0) {
					this.showToast('请输入扣分/加分');
					return;
				}
				this.showLoading();
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PB_NAME, this.QN_BJLHKP, (encName,
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
							grd_code: this.grdArray[this.grdIndex].value,
							grd_name: this.grdArray[this.grdIndex].text,
							cls_code: this.clsArray[this.clsIndex].value,
							cls_name: this.clsArray[this.clsIndex].text,
						})
					}
				};
				// console.log('tempStuArray:'+JSON.stringify(tempStuArray));
				this.showLoading();
				var tempData = {
					kp_date: this.defTime, //日期
					grd_code: this.grdArray[this.grdIndex].value, //年级代码
					grd_name: this.grdArray[this.grdIndex].text, //年级名称
					cls_code: this.clsArray[this.clsIndex].value, //班级代码
					cls_name: this.clsArray[this.clsIndex].text, //班级名称
					item_id: this.itemArray[this.itemIndex].id, //项目id
					remark: this.content.replace(/\n/g, '<br>'), //说明
					// dorm_door_code: encNameTemp, //楼房号
					// dorm_doo: encAddrTemp, //楼房
					// dorm_floor_code: tempSms, //楼层号
					// dorm_floo: ,//楼层
					// dorm_room_code: ,//房间号
					// dorm_room: ,//房间
					stu_list: tempStuArray, //学生列表
					asset_list: imgArray, //附件列表
					score: this.score, //扣分/加分
					create_user_code: this.personInfo.user_code, //记录人代码
					create_user_name: this.personInfo.user_name, //发记录人姓名
					index_code: this.index_code,

				}
				console.log('tempData:' + JSON.stringify(tempData));
				//28.回复通知公告
				this.post(this.globaData.INTERFACE_BJLHKP + 'score/add', tempData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshRecordList');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
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
			this.getSecList();
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

	.submitBtn {
		width: calc(100% - 60px);
		margin-left: 30px;
	}
</style>
