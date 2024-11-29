<template>
	<view style="background: #f2f2f2;height: 100vh;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="rightText" :textClick="textClick"></mynavBar>
		<view class="bigText">记录</view>
		<view class="bigLine"></view>
		<view class="jiluView">
			<view class="jlScore">{{parseInt(pageData.score)}}</view>
			<view class="textType">日期：</view>
			<view class="typeCont">{{pageData.kp_date&&pageData.kp_date.split(' ')[0]}}</view>
			<view class="textType">班级：</view>
			<view class="typeCont">{{pageData.cls_name}}</view>
			<view class="textType">宿舍：</view>
			<view class="typeCont">{{pageData.dorm_room}}</view>
			<view class="textType">评比项：</view>
			<view class="pbList">
				<view class="flexStart pbCell" v-for="item in pageData.item_list">
					<view class="ellipsis-2 pbCont">{{item.item_name}}</view>
					<view class="pbCount">{{parseInt(item.score)}}</view>
				</view>
			</view>
			<view class="textType">学生/床位号：</view>
			<view class="typeCont">{{pageData.stuStr}}</view>
			<view class="textType">说明：</view>
			<view class="typeCont" v-html='pageData.remark'></view>
			<view v-if="pageData.asset_list&&pageData.asset_list.length>0" class="textType">照片：</view>
			<uni-file-picker style="margin-top: 10px;" readonly :value="pageData.asset_list" :imageStyles="imageStyles" file-mediatype="image"></uni-file-picker>
			<view class="nameTime flexEnd">
				<view class="nTime">{{pageData.create_user_name}}</view>
				<view class="nTime">{{pageData.create_time}}</view>
			</view>
		</view>
		<view v-if="pageData.check_status" style="height: 10px;background: #f2f2f2;"></view>
		<view v-if="pageData.check_status" class="bigText">申诉</view>
		<view v-if="pageData.check_status" class="bigLine"></view>
		<view v-if="pageData.check_status" class="jiluView">
			<view class="typeCont">{{pageData.appeal_reason}}</view>
			<view class="nameTime flexEnd">
				<view class="nTime">{{pageData.appeal_user_name}}</view>
				<view class="nTime">{{pageData.appeal_time}}</view>
			</view>
		</view>
		<view v-if="pageData.check_status==null" class="shensuBtn" @click="shensuBtn()">申诉</view>
		<view v-if="pageData.check_status&&pageData.check_status==0" class="shensuBtn CXshensuBtn" @click="CXshensuBtn()">撤销申诉</view>
		<view v-if="pageData.check_status" style="height: 10px;"></view>
		<view v-if="pageData.check_status&&pageData.check_status==1" class="bigText">审核</view>
		<view v-if="pageData.check_status&&pageData.check_status==1" class="bigLine"></view>
		<view v-if="pageData.check_status&&pageData.check_status==1" class="shScore">
			<view class="shText">评比项：</view>
			<view class="shenSS">{{parseInt(pageData.check_score)}}</view>
			<view class="pbList">
				<view class="flexStart pbCell" v-for="(item,index) in pageData.item_list" :key="index">
					<view class="ellipsis-2 pbCont">{{item.item_name}}</view>
					<view class="inputCss">
						<view class="pbCount">{{parseInt(item.check_score)}}</view>
					</view>
				</view>
				<view class="nameTime flexEnd">
					<view class="nTime">{{pageData.appeal_user_name}}</view>
					<view class="nTime">{{pageData.check_time}}</view>
				</view>
			</view>
		</view>
		<view style="height: 20px;"></view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="success" cancelText="取消" confirmText="同意" title="提示" content="您确定要撤销申诉？" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="alertDialog1" type="dialog">
			<uni-popup-dialog type="success" cancelText="取消" confirmText="确定" title="提示" content="您确定要删除当前巡查记录？" @confirm="dialogConfirm1"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" title="申诉" @close="dialogInputClose"
		before-close="true" placeholder="请输入申诉理由" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment/moment.js';
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				pageData:{},
				rightText:'',
				value:'',
				imageStyles: {
					border: {
						radius: '10px'
					}
				},
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			this.navItem.text = '巡查记录详情';
			this.index_code = this.navItem.index_code;
			this.getDzetail()
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			setDefalutData(){
				if ((this.pageData.check_status==null||this.pageData.check_status == 0)&&this.pageData.allowed_delete) {
					this.rightText = '删除'
				}
				this.pageData.stuStr = ''
				let tempArr = []
				for (var i = 0; i < this.pageData.stu_list.length; i++) {
					let tempM = this.pageData.stu_list[i]
					if (tempM.stu_name) {
						if (tempM.dorm_bed_code) {
							tempArr.push(tempM.dorm_bed_code+'.'+tempM.stu_name)
						} else{
							tempArr.push(tempM.stu_name)
						}
					}
				}
				this.pageData.stuStr = tempArr.join('、')
			},
			textClick(){
				this.$refs.alertDialog1.open()
			},
			dialogConfirm1(){
				this.$refs.alertDialog.close()
				// 5.9.申诉
				let comData = {
					id:this.navItem.id,
					user_code:this.personInfo.user_code,//操作人代码
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/delete', comData, (data0, data) => {
					this.hideLoading()
					this.showToast(data.msg);
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshXcjlIndex');
						uni.navigateBack();
					}
				})
			},
			CXshensuBtn(){
				this.$refs.alertDialog.open()
			},
			dialogConfirm(){
				this.$refs.alertDialog.close()
				// 5.9.申诉
				let comData = {
					id:this.navItem.id,
					is_appeal:0,//是否申诉，1申诉，0撤诉
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/appeal', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.getDzetail()
					} else {
						this.showToast(data.msg);
					}
				})
			},
			shensuBtn(){
				this.$refs.inputDialog.open()
			},
			dialogInputClose(){
				this.$refs.inputDialog.close()
			},
			dialogInputConfirm(val) {
				console.log('dialogInputConfirm:'+val)
				val = val.trim();
				if (val.length==0) {
					this.showToast('请输入申诉理由')
				} else if (val.length>100) {
					this.showToast('申诉理由不能超过100个字')
				} else{
					this.$refs.inputDialog.close()
					// 5.9.申诉
					let comData = {
						id:this.navItem.id,
						appeal_reason:val,
						appeal_user_code:this.personInfo.user_code,
						appeal_user_name:this.personInfo.user_name,
						is_appeal:1,//是否申诉，1申诉，0撤诉
						index_code: this.index_code,
					}
					this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/appeal', comData, (data0, data) => {
						this.hideLoading()
						if (data.code == 0) {
							this.getDzetail()
						} else {
							this.showToast(data.msg);
						}
					})
				}
			},
			getDzetail(){
				let comData = {
					id:this.navItem.id,
					page_number: 1, //当前页数
					page_size: '10', //每页记录数
					user_code:this.personInfo.user_code,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/page', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.pageData = data0.list[0];
						this.setDefalutData()
					} else {
						this.showToast(data.msg);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bigText{
		font-size: 16px;
		font-weight: 700;
		text-align: center;
		padding-top: 20px;
		background: white;
		padding-bottom: 10px;
	}
	.bigLine{
		width: 100%;
		height: 3px;
		background: #d7d7d7;
	}
	
	.jiluView{
		padding: 10px;
		background: white;
		
		.jlScore{
			height: 60px;
			width: 90px;
			text-align: center;
			background: #f2f2f2;
			border-radius: 12px;
			line-height: 60px;
			margin-left: calc((100% - 90px)/2);
			font-size: 36px;
			font-weight: bold;
			color: #d9001b;
		}
		
		.textType{
			font-size: 14px;
		}
		.typeCont{
			font-size: 14px;
			background: #f2f2f2;
			border-radius: 6px;
			margin: 5px 0;
			padding: 5px;
			min-height: 20px;
			word-break: break-all;
		}
		.pbList{
			background: white;
			border-radius: 10px;
			margin-bottom: 10px;
			
			.pbCell{
				background: white;
				margin-top: 5px;
				height: 55px;
				
				.pbCont{
					line-height: 24px;
					height: 45px;
					font-size: 14px;
					color: #333;
					background: #f2f2f2;
					padding: 5px 10px;
					border-radius: 5px;
					width: calc(100% - 53px);
				}
				
				.pbCount{
					height: 55px;
					width: 55px;
					background: #f2f2f2;
					border-radius: 5px;
					margin-left: 3px;
					text-align: center;
					line-height: 55px;
					font-size: 16px;
					color: #d9001b;
				}
			}
		}
		
		.nameTime{
			margin-top: 20px;
			font-size: 14px;
			.nTime{
				margin-left: 20px;
			}
		}
	}
	
	.shensuBtn{
		margin: 15px;
		width: calc(100% - 30px);
		height: 40px;
		text-align: center;
		line-height: 40px;
		background:  #169bd5;
		color: white;
		font-size: 13px;
		border-radius: 6px;
	}
	.CXshensuBtn{
		background:  #ec808d;
	}
	.shScore{
		margin: 0 15px;
		
		.shText{
			margin-left: 10px;
			font-size: 14px;
			margin-top: 5px;
		}
		.shenSS{
			z-index: 200;
			width: 80px;
			height: 80px;
			color: #d9001b;
			font-size: 26px;
			text-align: center;
			line-height: 80px;
			font-weight: 700;
			position: relative;
			left: calc(100% - 100px);
			top: -80px;
		}
		.shScore{
			width: 50px;
			font-size: 18px;
			color: #d9001b;
			.pbInput{
				margin-top: -20px;
				width: 50px;
				background: white;
				font-size: 18px;
				color: #d9001b;
			}
		}
		.shMsg{
			font-size: 12px;
			margin-top: 5px;
		}
		.pbList{
			margin-top: -80px;
			width: 100%;
			
			.pbCell{
				margin-top: 3px;
				height: 55px;
				width: 100%;
				
				.pbCont{
					line-height: 24px;
					height: 45px;
					font-size: 14px;
					color: #333;
					background: #f2f2f2;
					padding: 5px 10px;
					border-radius: 5px;
					width: calc(100% - 73px);
				}
				.inputCss{
					height: 55px;
					width: 75px;
					background: #f2f2f2;
					border-radius: 5px;
					margin-left: 3px;
					.pbInput{
						width: 50px;
						margin: 10px;
						background: white;
					}
				}
				
				.pbCount{
					height: 55px;
					width: 75px;
					background: #f2f2f2;
					border-radius: 5px;
					margin-left: 3px;
					text-align: center;
					line-height: 55px;
					font-size: 16px;
					color: #d9001b;
				}
			}
			.nameTime{
				margin-top: 20px;
				font-size: 14px;
				.nTime{
					margin-left: 20px;
				}
			}
		}
	}
</style>
