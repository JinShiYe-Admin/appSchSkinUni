<template>
	<view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">访客姓名</view>
			<view class="form-right">{{tabBarItem.visitors}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">随行人数</view>
			<view class="form-right">{{tabBarItem.follow_num}}人</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">被访学生</view>
			<view class="form-right">{{tabBarItem.stu_name}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">被访班级</view>
			<view class="form-right">{{tabBarItem.cls_name}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">被访宿舍</view>
			<view class="form-right">{{tabBarItem.room_name}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">访问事由</view>
			<view class="form-right">{{tabBarItem.visit_reason}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">进入时间</view>
			<view class="form-right">{{tabBarItem.visit_date}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">是否离开</view>
			<view class="form-right">{{tabBarItem.leave_code_text}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">离开时间</view>
			<view class="form-right">{{tabBarItem.leave_date}}</view>
		</view>
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
			itemData.index=100
			itemData.text='访客记录详情'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			console.log("itemData: " + JSON.stringify(itemData));
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
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
</style>
