<template>
	<view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">出库单号</view>
			<view class="form-right">{{ckdDetail.outCode}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">出库人姓名</view>
			<view class="form-right">{{ckdDetail.outManName}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">领用人姓名</view>
			<view class="form-right">{{ckdDetail.receiveManName}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">放置地点</view>
			<view class="form-right">{{ckdDetail.putArea}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">出库时间</view>
			<view class="form-right">{{ckdDetail.outTime}}</view>
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
						<uni-col :span="24"><view class="detail-text">编号: {{ckdDetail.itemCode}}</view></uni-col>
						<uni-col :span="24"><view class="detail-text">名称: {{ckdDetail.itemName}}</view></uni-col>
						<uni-col :span="24"><view class="detail-text">型号: {{ckdDetail.itemModel}}</view></uni-col>
						<uni-col :span="24"><view class="detail-text">品牌: {{ckdDetail.itemBrand}}</view></uni-col>
						<uni-col :span="24"><view class="detail-text">类型: {{ckdDetail.itemType}}</view></uni-col>
						<uni-col :span="24"><view class="detail-text">属性: {{ckdDetail.itemProp}}</view></uni-col>
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
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				ckdDetail:{},
			}
		},
		components: {
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				 this.showLoading()
				 this.getList0();
			},100)
			uni.setNavigationBarTitle({title:'出库单详情'});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			getList0(){
				let comData={
					handOutId:this.tabBarItem.handOutId,
					op_code:'index',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ITEM+'handOut/getHandOutById',comData,response=>{
					console.log("responseaaa: " + JSON.stringify(response));
					 
					this.hideLoading()
					let note=response.note;
					if(note){
						let newNote=note.replace(/\n/g,'<br>')
						response.note=newNote
						this.ckdDetail=response
					}else{
						response.note='暂无'
						this.ckdDetail=response
					}
				})
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
