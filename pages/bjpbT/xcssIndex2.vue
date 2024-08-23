<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="提交" :textClick="textClick"></mynavBar>
		<view class="xcTitle">{{navItem.date}}  {{navItem.from==0?navItem.dormeName+navItem.floorName+'层'+navItem.roomName:navItem.grdName+navItem.clsName}}</view>
		<view class="flexStart pbView">
			<uni-icons class="pbXing" type="star-filled" size="10" color="#d9001b"></uni-icons>
			<view class="pb1">评比项：</view>
			<view class="pb2">（扣分请在数字前面输入“-”号）</view>
		</view>
		<view class="pbList">
			<view class="flexStart pbCell" v-for="item in navItem.roomArray">
				<view class="ellipsis-2 pbCont">{{item.name}}</view>
				<view class="pbCount">
					<uni-easyinput class="pbInput" :value="parseInt(item.score)" placeholder="" type="number"></uni-easyinput>
				</view>
				<uni-icons class="pbDel" type="trash" size="30" color="#7f7f7f"></uni-icons>
			</view>
		</view>
		<view class="typeCss">{{navItem.from==0?'床位号：':'学生：'}}</view>
		<view class="seletStu flexStart" @click="seletStu()">
			<view class="showStu ellipsis-1">{{selectStu.length>0?selectStu:'请选择'}}</view>
			<uni-icons class="selectIcon" type="down" size="20" color="#7f7f7f"></uni-icons>
		</view>
		<view class="typeCss">说明：</view>
		<uni-easyinput class="smInput" type="textarea" v-model="smCont" placeholder="请输入内容" maxlength="100"></uni-easyinput>
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
			<view style="margin: 15px 10px;">
				<uni-grid :column="navItem.from==0?4:3">
					<uni-grid-item v-for="(item, index) in stuArrayTemp" :key="index" style="height: 40px;">
						<view class="grid-item-box gridBox" @click='bedSelect(item, index)'
							:style="item.selectFlag==1?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.stu_name}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view style="height: 50px;margin: 20px 0;">
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #049f95;border-color: #049f95;color: #ffffff;"
					@click="popSure(1)">确定</button>
				<button class="mini-btn" style="margin-left: 50px;" type="default" size="mini"
					@click="popSure(0)">取消</button>
			</view>
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
				value:'',
				smCont:'',
				selectStu:'',
				stuArray:[],
				stuArrayTemp:[],
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
				// this.getClsList()
			}
			//#ifdef H5
			document.title = ""
			this.wxTips = ',微信端不支持多选'; //如果是H5，需要提示该内容
			//#endif
		},
		methods: {
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
						tempArray.push(tempM.bed_num+'.'+tempM.stu_name)
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
				cloudFileUtil.uploadFiles(this, '1', this.imgList, this.QN_PV_NAME, this.QN_OA_GZL, (encName,
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
				let encNameTemp = '';
				let encAddrTemp = '';
				if (encNameStr.length > 0) {
					encNameTemp = encNameStr.join('|');
					encAddrTemp = encAddrStr.join('|');
				}
				// console.log('this.content:' + this.content);
				this.showLoading();
				var tempContent = this.content.replace(/\n/g, '<br>');
				tempContent = tempContent.replace(/ /g, '&nbsp;');
				tempContent = '<p>' + tempContent + '</p>';
				var tempData = {}
				// console.log('tempData:' + JSON.stringify(tempData));
				//28.回复通知公告
				// this.post(this.globaData.INTERFACE_OA + 'approve/addAffairApply', tempData, (data0, data) => {
					
				// });
			},
			textClick() {
				// if (_this.title.trim().length == 0 || _this.content.trim().length == 0) {
				// 	_this.showToast("请填写具体内容后再发布");
				// 	return;
				// }
				_this.upLoadImg();
			},
		}
	}
</script>

<style>
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
			font-size: 13px;
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
			padding: 10px;
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
