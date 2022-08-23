<template>
	<view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">入库单号</view>
			<view class="form-right">{{tabBarItem.inCode}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">入库人姓名</view>
			<view class="form-right">{{tabBarItem.inManName}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">采购人姓名</view>
			<view class="form-right">{{tabBarItem.purchasingManName}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">供应商</view>
			<view class="form-right">{{tabBarItem.supplierName}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">备注</view>
			<view class="form-right">{{tabBarItem.note}}</view>
		</view>
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">入库物品明细</view>
		</view>
		<view class="line"></view>
		<uni-list :border="false">
			<uni-list-item :key="index" v-for="(model,index) in tabBarItem.items" :border="true">
				<view slot="body" class="slot-box slot-text">
					<uni-row>
						<uni-col :span="24"><view class="title-text">{{model.itemName}} ({{model.itemCode}})</view></uni-col>
						<uni-col :span="12"><view class="detail-text">型号:{{model.itemModel}}</view></uni-col>
						<uni-col :span="12"><view class="detail-text">品牌:{{model.itemBrand}}</view></uni-col>
						<uni-col :span="12"><view class="detail-text">数量:{{model.inNum}}</view></uni-col>
						<uni-col :span="12"><view class="detail-text">单价:{{model.inPrice}}</view></uni-col>
					</uni-row>
				</view>
			</uni-list-item>
		</uni-list>
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
			}
		},
		components: {
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
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			uni.setNavigationBarTitle({title:'入库单详情'});
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
		methods: {
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
