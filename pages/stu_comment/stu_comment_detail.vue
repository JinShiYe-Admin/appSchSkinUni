<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick"></mynavBar>
		<view v-if="detailData.grd_name || detailData.class_name ||  detailData.stu_name">
			<view class="uni-flex uni-row form-view">
				<view class="form-left">年级</view>
				<view class="form-right">{{detailData.grd_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">班级</view>
				<view class="form-right">{{detailData.class_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">姓名</view>
				<view class="form-right">{{detailData.stu_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">年份</view>
				<view class="form-right">{{detailData.year}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">学期</view>
				<view class="form-right">{{detailData.term_name}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">评价类型</view>
				<view class="form-right">{{detailData.remark_type_txt}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">评语</view>
				<view class="form-right">{{detailData.remark}}</view>
			</view>
		</view> 
		<view style="height: 30px;">
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="确定要删除该条记录吗？" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				navItem: {},
				detailData:{
					cls_name:"",
					item_code:"",
					grd_name:"",
					create_user_name:"",
					end_time:"",
					in_out_permission_code:"",
					begin_time:"",
					apply_time:"",
					sms_parent_stu_flag:0,
					create_user_code:"",
					stu_code:"",
					approve_list:[],
					copy_list:[],
					stu_name:"",
					comment:"",
					id:0,
					grd_code:"",
					cls_code:"",
					status:1,
					approve_comment:'',//审核意见
				},
				icon:'',
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text=itemData.title
			this.navItem = itemData;
			this.detailData = itemData;
			this.index_code=itemData.index_code
			console.log("itemData: " + JSON.stringify(itemData));
			if(itemData.del==1){
				this.icon='trash'
			}
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
			iconClick(){
				_this.$refs.alertDialog.open()
			},
			dialogConfirm(){
				this.showLoading()
				let url=this.globaData.INTERFACE_STUPYSUB + 'Comment/delete'
				let comData={
					id: this.detailData.id,
					index_code:this.index_code,
				}
				this.post(url,comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					const eventChannel = this.getOpenerEventChannel()
					this.showToast('操作成功')
					eventChannel.emit('refreshDetail', {data: 1});
					uni.navigateBack();
					this.hideLoading()
				})
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
</style>
