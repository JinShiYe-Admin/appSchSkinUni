<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :text="text" :textClick="textClick"></mynavBar>
		<view v-if="tabBarItem.outCode" class="uni-flex uni-row form-view">
			<view class="form-left">出库单号</view>
			<view class="form-right">{{tabBarItem.outCode}}</view>
		</view>
		<view v-if="tabBarItem.outCode" class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">领用单号</view>
			<view class="form-right">{{tabBarItem.receiveApplyCode}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">领用人姓名</view>
			<view class="form-right">{{tabBarItem.receiveManName}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">放置地点</view>
			<view class="form-right">{{tabBarItem.putArea}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">申请数量</view>
			<view class="form-right">{{tabBarItem.applyNum}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">申请时间</view>
			<view class="form-right">{{tabBarItem.applyTime}}</view>
		</view>
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">出库物品明细</view>
		</view>
		<view class="line"></view>
		<uni-list :border="false">
			<uni-list-item :border="true">
				<text slot="body" class="slot-box slot-text">
					<uni-row> 
						<uni-col :span="24"><view class="detail-text">编号: {{tabBarItem.itemCode}}</view></uni-col>
						<uni-col :span="24"><view class="detail-text">名称: {{tabBarItem.itemName}}</view></uni-col>
						<uni-col :span="24"><view class="detail-text">型号: {{tabBarItem.itemModel}}</view></uni-col>
						<uni-col :span="24"><view class="detail-text">品牌: {{tabBarItem.itemBrand}}</view></uni-col>
						<uni-col :span="24"><view class="detail-text">类型: {{tabBarItem.itemType}}</view></uni-col>
						<uni-col :span="24"><view class="detail-text">属性: {{tabBarItem.itemProp}}</view></uni-col>
					</uni-row>
				</text>
			</uni-list-item>
		</uni-list>
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">备注</view>
			<view class="form-right">{{tabBarItem.note}}</view>
		</view>
		<view class="line"></view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="确定要发货？" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				text:'',
				canSub:true,
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			let note=itemData.note;
			if(note){
				let newNote=note.replace(/\n/g,'<br>')
				itemData.note=newNote
			}else{
				itemData.note='暂无'
			}
			itemData.index=100
			itemData.text='领用出库详情'
			this.tabBarItem = itemData;
			console.log("itemData: " + JSON.stringify(itemData));
			if(itemData.isOut==2){//未出库
				this.text='发货'
			}
			this.index_code=itemData.index_code
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			textClick(){
				this.$refs.alertDialog.open()
			},
			dialogConfirm(){
				if(this.canSub){
					this.canSub=false
					this.showLoading()
					let comData={
						receiveOutId:this.tabBarItem.receiveOutId,
						outManCode:this.personInfo.user_code,
						outManName:this.personInfo.user_name,
						outNum:this.tabBarItem.outNum,
						note:'',
						op_code:'index',
						index_code: this.index_code,
					}
					this.post(this.globaData.INTERFACE_ITEM+'receiveOut/addReceiveOut',comData,(response0,response)=>{
						console.log("response: " + JSON.stringify(response));
					     if (response.code == 0) {
							 this.hideLoading()
							 this.showToast(response.msg);
					     	 const eventChannel = this.getOpenerEventChannel()
					     	 eventChannel.emit('refreshByLyck', {data: 1});
					     	 uni.navigateBack();
					     } else {
					     	this.canSub=true
					     	this.hideLoading()
					     	this.showToast(response.msg);
					     }
					},()=>{
							this.canSub=true
					})
				}
			},
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
		text-align: left;
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
		margin-left: 15px;
		margin-right: 15px;
		margin-bottom: 10px;
		font-size: 14px;
		color: #333;
	}
	.detail-text{
		color: #939393;
		font-size: 12px;
		margin: 3px 0;
		word-break: break-all;
	}
</style>
