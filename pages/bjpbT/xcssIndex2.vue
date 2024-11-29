<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="提交" :textClick="textClick"></mynavBar>
		<view class="xcTitle">{{navItem.date}}  {{navItem.from==0?navItem.dormeName+navItem.floorName+'层'+navItem.roomName:navItem.grdName+navItem.clsName}}</view>
		<view class="flexStart pbView">
			<uni-icons class="pbXing" type="star-filled" size="10" color="#d9001b"></uni-icons>
			<view class="pb1">评比项：</view>
			<view class="pb2">（扣分请在数字前面输入“-”号）</view>
		</view>
		<view class="pbList" v-if="navItem.roomArray.length>0">
			<view class="flexStart pbCell" v-for="(item,index) in navItem.roomArray" :key="index">
				<view class="ellipsis-2 pbCont">{{item.name}}</view>
				<view class="pbCount">
					<uni-easyinput @blur="inputBlur($event,index)" class="pbInput" :clearable='false' :value="parseInt(item.score)" placeholder="" type="number" maxlength="4"></uni-easyinput>
				</view>
				<uni-icons class="pbDel" type="trash" size="30" color="#7f7f7f" @click="delectBtn(index)"></uni-icons>
			</view>
		</view>
		<view v-else style="text-align: center;margin: 10px;font-size: 13px;color: gray;">请返回上一步，选择评比项！</view>
		<view class="typeCss">{{navItem.from==0?'床位号：':'学生：'}}</view>
		<view class="seletStu flexStart" @click="seletStu()">
			<view class="showStu ellipsis-1">{{selectStu.length>0?selectStu:'请选择'}}</view>
			<uni-icons class="selectIcon" type="down" size="20" color="#7f7f7f"></uni-icons>
		</view>
		<view class="typeCss">说明：</view>
		<uni-easyinput class="smInput" type="textarea" v-model="smCont" :clearable='false' placeholder="请输入内容" maxlength="100"></uni-easyinput>
		<!-- <view class="typeCss">照片：</view> -->
		<view class="uni-flex uni-row form-view choose-file">
			<view class="choose-file-text">照片<view class="file-des">
					{{`(最多可选择${showMaxCount}张照片${wxTips?wxTips:''})`}}
				</view>
			</view>
			<g-upload ref='gUpload' :mode="imgList" :control='control' :deleteBtn='deleteBtn' @chooseFile='chooseFile'
				@imgDelete='imgDelete' :maxCount="maxCount" :columnNum="columnNum" :showMaxCount="showMaxCount">
			</g-upload>
		</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择{{navItem.from==0?'床位号':'学生'}}</view>
			<view v-if="stuArrayTemp.length>0" style="margin: 15px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
				<uni-grid :column="navItem.from==0?4:3">
					<uni-grid-item v-for="(item, index) in stuArrayTemp" :key="index" style="height: 40px;">
						<view class="grid-item-box gridBox" @click='bedSelect(item, index)'
							:style="item.selectFlag==1?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.stu_name}}
						</view>
					</uni-grid-item>
				</uni-grid>
				</scroll-view>
			</view>
			<view v-else style="text-align: center;margin: 20px;font-size: 13px;color: gray;">暂无数据，请管理员添加！</view>
			<view style="height: 50px;margin: 20px 0;">
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #049f95;border-color: #049f95;color: #ffffff;"
					@click="popSure(1)">确定</button>
				<button class="mini-btn" style="margin-left: 50px;" type="default" size="mini"
					@click="popSure(0)">取消</button>
			</view>
		</uni-popup>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="success" cancelText="取消" confirmText="确定" title="提示" content="您确定要删除这条评比项？" @confirm="dialogConfirm"></uni-popup-dialog>
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
				navItem: {},
				tempIndex:'',
				smCont:'',
				selectStu:'',
				stuArray:[],
				stuArrayTemp:[],
				delectIndex:0,
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
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			this.navItem.text = this.navItem.fromName;
			this.index_code = this.navItem.index_code;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			if (this.navItem.from == 0) {//巡查宿舍
				this.getDormStuList()
			} else{//巡查班级
				this.getStuList()
			}
			//#ifdef H5
			document.title = ""
			this.wxTips = ',微信端不支持多选'; //如果是H5，需要提示该内容
			//#endif
		},
		methods: {
			delectBtn(index){
				this.delectIndex = index
				this.$refs.alertDialog.open()
			},
			dialogConfirm(){
				this.$refs.alertDialog.close()
				this.navItem.roomArray.splice(this.delectIndex, 1)
			},
			inputBlur(e,index){
				for (var i = 0; i < this.navItem.roomArray.length; i++) {
					if (index == i) {
						let tempM = this.navItem.roomArray[i]
						tempM.score = e.detail.value
					}
				}
			},
			seletStu(){
				this.$refs.popup.open()
			},
			bedSelect(item, index){
				if (item.selectFlag == 0) {
					item.selectFlag = 1
				} else{
					item.selectFlag = 0
				}
			},
			popSure(flag) {
				this.$refs.popup.close();
				if (flag == 0) {
					this.stuArrayTemp = JSON.parse(JSON.stringify(this.stuArray))
				} else {
					this.stuArray = JSON.parse(JSON.stringify(this.stuArrayTemp))
				}
				let tempArray = []
				for (var i = 0; i < this.stuArray.length; i++) {
					let tempM = this.stuArray[i]
					if (tempM.selectFlag == 1) {
						if (this.navItem.from == 0) {//巡查宿舍
							tempArray.push(tempM.bed_num+'.'+tempM.stu_name)
						} else{//巡查班级
							tempArray.push(tempM.stu_name)
						}
					}
				}
				this.selectStu = tempArray.join('、')
			},
			getDormStuList() {
				//111.查寝及点名登记-宿舍人员列表
				let comData = {
					dorm_name: this.navItem.dormId,
					floor_num: this.navItem.floorId,
					room_name: this.navItem.roomId,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM1 + 'stuDorm/stuList', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						for (var i = 0; i < data0.list.length; i++) {
							let tempM = data0.list[i]
							tempM.selectFlag = 0
						}
						this.stuArray = data0.list
						this.stuArrayTemp = data0.list
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getStuList() {
				//9.1.学生列表
				let comData = {
					grd_codes: this.navItem.grdCode,
					cls_codes: this.navItem.clsCode,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'stu', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						for (var i = 0; i < data0.list.length; i++) {
							let tempM = data0.list[i]
							tempM.selectFlag = 0
						}
						this.stuArray = data0.list
						this.stuArrayTemp = data0.list
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
			upLoadImg() {
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
				this.showLoading()
				let tempFileList = []
				if (encAddrStr.length > 0) {
					for (var i = 0; i < encAddrStr.length; i++) {
						tempFileList.push({
							name:encNameStr[i],
							url:encAddrStr[i],
						})
					}
				}
				// console.log('this.content:' + this.content);
				this.showLoading();
				var tempContent = this.smCont.replace(/\n/g, '<br>');
				tempContent = tempContent.replace(/ /g, '&nbsp;');
				// tempContent = '<p>' + tempContent + '</p>';
				var tempData = {}
				// console.log('tempData:' + JSON.stringify(tempData));
				// 5.7.添加
				let comData = {
					kp_date: this.navItem.date,
					date: this.navItem.date,
					grd_code:this.navItem.grdCode,
					cls_code:this.navItem.clsCode,
					first_level_id:this.navItem.dormModel.id,
					first_level_name:this.navItem.dormModel.name,
					remark:tempContent,
					asset_list:tempFileList,
					create_user_code:this.personInfo.user_code,
					create_user_name:this.personInfo.user_name,
					index_code: this.index_code,
				}
				// 二级分类
				if (this.navItem.floorFlag == 1) {
					comData.second_level_id = this.navItem.floorModel.id
					comData.second_level_name = this.navItem.floorModel.name
				}
				// 评比项
				comData.item_list = []
				comData.score = 0
				for (var i = 0; i < this.navItem.roomArray.length; i++) {
					let tempM = this.navItem.roomArray[i]
					comData.item_list.push({
						item_id:tempM.id,
						item_name:tempM.name,
						score:tempM.score
					})
					comData.score = comData.score + parseInt(tempM.score)
				}
				if (this.navItem.from == 0) {//宿舍
					comData.dorm_door_code = this.navItem.dormeName
					comData.dorm_door = this.navItem.dormId
					comData.dorm_floor_code = this.navItem.floorName
					comData.dorm_floor = this.navItem.floorId
					comData.dorm_room_code = this.navItem.roomName
					comData.dorm_room = this.navItem.roomId
				} else{
					comData.grd_name = this.navItem.grdName
					comData.grd_code = this.navItem.grdCode
					comData.cls_code = this.navItem.clsCode
					comData.cls_name = this.navItem.clsName
				}
				comData.stu_list = []
				for (var i = 0; i < this.stuArray.length; i++) {
					let tempM = this.stuArray[i]
					if (tempM.selectFlag == 1) {
						comData.stu_list.push({
							grd_code:tempM.grd_code,
							grd_name:tempM.grd_name,
							cls_code:tempM.cls_code,
							cls_name:tempM.cls_name,
							stu_code:tempM.stu_code,
							stu_name:tempM.stu_name,
							dorm_bed_code:tempM.bed_num,
							dorm_bed:tempM.bed_num
						})
					}
				}
				if (comData.stu_list.length==0) {
					for (var i = 0; i < this.stuArray.length; i++) {
						let tempM = this.stuArray[i]
						comData.stu_list.push({
							grd_code:tempM.grd_code,
							grd_name:tempM.grd_name,
							cls_code:tempM.cls_code,
							cls_name:tempM.cls_name,
						})
					}
					if (comData.stu_list.length>0) {
						comData.stu_list = util.ArrayUnique(comData.stu_list, 'cls_code');
					}
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/add', comData, (data0, data) => {
					this.hideLoading()
					this.showToast(data.msg);
					if (data.code == 0) {
						uni.navigateBack({
							delta: 2
						});
					}
				})
			},
			textClick() {
				if (this.navItem.roomArray.length==0) {
					_this.showToast('请返回上一步，选择评比项！')
					return
				}
				if (this.navItem.from == 0&&this.stuArray.length==0) {//宿舍
					_this.showToast('当前宿舍没有安排学生，请联系管理员')
					return
				}
				let tempFlag = 0
				for (var i = 0; i < this.navItem.roomArray.length; i++) {
					let tempM = this.navItem.roomArray[i]
					if (tempM.score.length>0&&parseInt(tempM.score)<=100&&parseInt(tempM.score)>=-100) {
						tempFlag++
					}
				}
				if (tempFlag < this.navItem.roomArray.length) {
					_this.showToast('请输入-100到100之间的评比项分数')
					return
				}
				_this.upLoadImg();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.xcTitle{
		font-weight: 700;
		color: #333333;
		text-align: center;
		font-size: 16px;
		margin: 10px;
	}
	
	.pbView{
		.pbXing{
			margin: 5px 5px 0 10px;
		}
		.pb1{
			font-size: 14px;
			color: #000;
		}
		.pb2{
			margin-top: 2px;
			font-size: 11px;
		}
	}
	
	.pbList{
		margin: 10px;
		
		.pbCell{
			margin-top: 3px;
			height: 55px;
			
			.pbCont{
				line-height: 24px;
				height: 45px;
				font-size: 14px;
				color: #333;
				background: #f2f2f2;
				padding: 5px 10px;
				border-radius: 5px;
				width: calc(100% - 123px);
			}
			
			.pbCount{
				height: 55px;
				width: 70px;
				background: #f2f2f2;
				border-radius: 5px;
				margin-left: 3px;
				.pbInput{
					width: 50px;
					margin: 10px;
					background: white;
				}
			}
			.pbDel{
				height: 55px;
				width: 50px;
				padding-top: 10px;
			}
		}
	}
	.typeCss{
		margin: 10px;
		font-size: 14px;
		color: #000;
	}
	.smInput{
		margin-left: 10px;
		width: calc(100% - 20px);
		margin-bottom: -20px;
	}
	.seletStu{
		margin: 0 10px;
		border: 1px solid #d7d7d7;
		border-radius: 5px;
		
		.showStu{
			font-size: 14px;
			color: #000;
			width: calc(100% - 30px);
			padding: 10px 10px 5px 10px;
			height: 25px;
			line-height: 25px;
		}
		
		.selectIcon{
			width: 30px;
			height: 30px;
			padding-top: 5px;
		}
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
</style>
