<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="navText" :textClick="textClick"></mynavBar>
		<view v-if="detailData.id" style="margin-top: 5px;">
			<view class="uni-flex uni-row form-view">
				<view class="form-left" style="width: 190px;">单号：{{detailData.apply_code}}</view>
				<view class="form-right">
					<p class='cardPCls' style='margin-left: 5px;'>{{detailData.apply_percent}}</p>
					<p class='cardPCls' style='margin-left: 5px;'>{{detailData.progressStr}}</p>
					<p class='cardPCls' style=''>{{detailData.statusStr}}</p>
				</view>
			</view>
			<view class="line"></view>
			<view v-if="navItem.flag == 1" class="uni-flex uni-row form-view">
				<view class="form-left">申请人</view>
				<view class="form-right">{{detailData.apply_man_name}}</view>
			</view>
			<view v-if="navItem.flag == 1" class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">申请时间</view>
				<view class="form-right">{{detailData.apply_time}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">报销类型</view>
				<view class="form-right">{{detailData.account_type}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">报销总额</view>
				<view class="form-right">￥{{detailData.account_sum}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">申请事由</view>
				<view class="form-right"  style="text-align: left;">{{detailData.account_reason}}</view>
			</view>
			<view class="line"></view>
			<view class="double-line" style="margin-top: -5px;"></view>
			<view style="margin: 5px 0 5px 15px;font-size: 15px;font-weight: bold;">费用明细</view>
			<uni-list>
				<uni-list-item v-for="(model,index) in detailData.account_items" :key='index'
					direction='column'>
					<view slot="body">
						<view style="float: left;height: 40px;">
							<image class="peopleImg" @click="clickImg(model.enc_list)"
								:src="(model.enc_list&&model.enc_list.length>0)?model.enc_list[0].enc_addr:'http://www.108800.com/user.jpg'"></image>
							<view v-if="model.enc_list.length==0" class="box" style="margin-top: -45px;"><text class="box-text">暂无</text></view>
							<view v-else-if="model.enc_list.length>0" class="box" style="margin-top: -45px;"><text class="box-text">{{model.enc_list.length}}+</text></view>
						</view>
						<view class="rightView">
							<uni-row class="nameTime">
								<uni-col :span="12">
									￥{{model.account_fee}}
								</uni-col>
								<uni-col :span="12">
									{{model.account_time}}
								</uni-col>
							</uni-row>
							<a class="biaoti0">{{model.account_note}}</a>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
			<view class="double-line" style="margin-top: 0px;"></view>
			<view style="margin: 5px 0 5px 15px;font-size: 15px;font-weight: bold;">顺序审批人</view>
			<uni-list>
				<uni-list-item v-for="(model,index) in detailData.approve_list" :key='index'>
					<view slot="body" style="width: 100%;">
					<uni-row class="approvePerCls">
						<uni-col :span="10">
							{{model.approve_man_name}}
						</uni-col>
						<uni-col :span="10">
							{{model.approve_time}}
						</uni-col>
						<uni-col :span="4">
							<p v-if='model.status == 1' class='cardPCls' style='color: #3DA7FF;border: 0.5px solid #3DA7FF;'>{{model.statusStr}}</p>
							<p v-if='model.status == 2' class='cardPCls' style='color: #EBAF73;border: 0.5px solid #EBAF73;'>{{model.statusStr}}</p>
							<p v-if='model.status == 3' class='cardPCls' style=''>{{model.statusStr}}</p>
						</uni-col>
						<uni-col :span="24">
							{{model.approve_content}}
						</uni-col>
					</uni-row>
					</view>
				</uni-list-item>
			</uni-list>
			<view class="double-line" style="margin-top: 0px;"></view>
			<view style="margin: 5px 0 5px 15px;font-size: 15px;font-weight: bold;">抄送人</view>
			<view class="line"></view>
			<view class="approvePerCls" style="margin: 0 15px;" v-if="detailData.copy_mansArray.length>0">{{detailData.copy_mansArray.join(',')}}</view>
			<view class="approvePerCls" style="margin-left: 15px;" v-if="detailData.copy_mansArray.length==0">无</view>
		</view> 
		<view style="height: 30px;">
		</view>
		<uni-popup ref="popupDel" type="dialog">
			<uni-popup-dialog title="确定?" content="您确定要撤销吗？" :duration="2000" :before-close="true" @close="closeDel"
				@confirm="confirmDel"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	// 七牛上传相关
	 import gUpload from "@/components/g-upload/g-upload.vue";
	 import cloudFileUtil from '../../commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				navItem: {},
				detailData:{},
				navText:'',
				isDel:0,//是否撤销
				imgList: [],//选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
			}
		},
		components: {
			mynavBar,gUpload
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='报销申请单详情'
			this.navItem = itemData;
			this.index_code=itemData.index_code
			console.log("itemData: " + JSON.stringify(itemData));
			//#ifdef H5
				document.title=""
			//#endif
			// 21.通过ID获取报销申请
			this.getDetail();
			uni.$on('clickLeft',(data) =>{
				if(_this.isDel == 1){
					let eventChannel = this.getOpenerEventChannel();
					eventChannel.emit('refreshList', {});
				}
			})
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
		methods: {
			clickImg(list){
				if(list.length==0){
					return;
				}
				let newList = []
				list.map(item => {
					newList.push(item.enc_addr);
				})
				uni.previewImage({
					current: newList[0],
					urls: newList
				})
			},
			textClick(){
				_this.$refs.popupDel.open()
			},
			closeDel() {
				this.$refs.popupDel.close();
			},
			confirmDel(value) {
				this.$refs.popupDel.close();
				let comData = {
					index_code: this.index_code,
					id: this.navItem.id, //任务id
				}
				this.showLoading();
				//18.撤销报销申请
				this.post(this.globaData.INTERFACE_COSTMS + 'accountApply/doSetAccountApplyUndo', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.isDel = 1;
						// 21.通过ID获取报销申请
						this.getDetail();
					}
					this.showToast(data.msg);
				});
			},
			checkEnc: function(tempUrl) {
				console.log('tempUrl:'+tempUrl);
				util.openFile(tempUrl);
			},
			getDetail(){
				let comData = {
					index_code: this.index_code,
					id: this.navItem.id, //任务id
				}
				this.showLoading();
				//21.通过ID获取报销申请
				this.post(this.globaData.INTERFACE_COSTMS + 'accountApply/getAccountApplyById', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if(data.data.status == 1){
							data.data.statusStr = '发出';
						}else if(data.data.status == 2){
							data.data.statusStr = '撤销';
						}else if(data.data.status == 3){
							data.data.statusStr = '被退';
						}
						if(data.data.progress == 1){
							data.data.progressStr = '新建';
						}else if(data.data.progress == 2){
							data.data.progressStr = '审批中';
						}else if(data.data.progress == 3){
							data.data.progressStr = '审毕';
						}
						for (let i = 0; i < data.data.approve_list.length; i++) {
							var model = data.data.approve_list[i];
							if(model.status == 1){
								model.statusStr = '预览';
							}else if(model.status == 2){
								model.statusStr = '待批';
							}else if(model.status == 3){
								model.statusStr = '已批';
							}
						}
						data.data.copy_mansArray = [];
						for (let i = 0; i < data.data.copy_mans.length; i++) {
							var model = data.data.copy_mans[i];
							data.data.copy_mansArray.push(model.copy_man_name);
						}
						if(this.navItem.flag == 0&&data.data.status == 1&&data.data.progress == 1){
							this.navText = '撤销'
						}else{
							this.navText = ''
						}
						this.detailData = data.data;
					}
				});
			}
		}
	}
</script>

<style>
	.line{
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.double-line{
		height: 5px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	.form-view{
		padding: 8px 15px;
	}
	.form-left{
		font-size: 14px;
		width: 200rpx;
	}
	.form-right{
		font-size: 13px;
		-webkit-flex: 1;
		flex: 1;
		word-break: break-all;
		color: #787878;
		text-align: right;
	}
	
	.form-left-approve{
		font-size: 13px;
		-webkit-flex: 1;
		color: #787878;
		flex: 1;
	}
	.form-right-approve{
		width: 20px;
		text-align: right;
	}
	.form-left-approve-content{
		font-size: 12px;
		color: #787878;
		word-break: break-all;
		margin-top: -10px;
	}
	.leaveType {
		color: #00CFBD;
		padding: 3px;
		font-size: 13px;
		border-radius: 2px;
		border: 1px solid #00CFBD;
	}
	
	.leaveType-cr {
		color: #FF5733;
		padding: 3px;
		font-size: 13px;
		border-radius: 2px;
		border: 1px solid #FF5733;
	}
	
	.line-green{
		background-color: #00CFBD;
		margin-bottom: 0.3125rem;
		height: 1px;
	}
	
	.title-text{
		font-size: 14px;
	}
	
	textarea{
		-webkit-flex: 1;
		flex: 1;
		font-size: 13px;
		border: 1px solid rgba(0,207,189,0.3);
		min-height: 80px;
		padding: 5px;
	}
	
	
	.mui-btn,.mui-btn1{
		font-size: 15px;
		flex: 1;
		-webkit-flex:1;
	}
	.mui-btn{
		margin: 5px 10px 25px 0;
	}
	
	.mui-btn1{
		background-color: #00CFBD;
		margin: 5px 0 25px 10px;
	}
	
	.encName {
		margin: 10px 15px;
		/* margin-left: 15px;
		margin-right: 15px;
		margin-bottom: 10px; */
		font-size: 14px;
		color: #333;
	}
	
	.cardPCls{
		width: 35px !important;
		height: 18px;
		color: #04D0BE;
		font-size: 11px;
		text-align: center;
		padding-top: 0px;
		margin-top: 3px;
		border: 0.5px solid #04D0BE;
		float: right;
		border-radius: 2px;
	}
	
	.approvePerCls{
		font-size: 12px;
		color: #909399;
	}
	
	.peopleImg {
		width: 40px;
		height: 40px;
		border-radius: 5px;
	}
	
	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 50px);
	}
	
	.biaoti0 {
		font-size: 13px;
		width: calc(100%);
	}
	
	/* .title {
		height: 100%;
		float: left;
		font-size: 13px;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #000000;
	} */
	.nameTime {
		font-size: 12px;
		color: gray;
	}
	.box {
			width: 40px;
			height: 40px;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			background-color: #000000;
			color: #fff;
			font-size: 12px;
			/* background: rgba(0,0,0,0.9); */
		}
	
		.box-text {
			text-align: center;
			color: #fff;
			font-size: 12px;
		}
		
		image{
			opacity: 0.6;
		}
</style>
