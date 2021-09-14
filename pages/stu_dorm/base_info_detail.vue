<template>
	<view>
		<view style="padding:5px 15px 0px;">
			<uni-row>
				<uni-col :span="24"><view class="title-text">{{formData.msg_content}}</view></uni-col>
				<uni-col :span="8"><view class="detail-text" style="margin-top: 5px;">发布人:{{formData.send_user_tname}}</view></uni-col>
				<uni-col :span="16"><view class="detail-text" style="text-align: right;margin-top: 5px;">{{formData.send_time}}</view></uni-col>
			</uni-row>
		</view>
		<view class="double-line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">接收人</view>
		</view>
		 <view class="line-green" style="margin-top: 5px;"></view>
		 <view style="padding:5px 15px;">
		 	<template v-for="grd_child in student">
				 <template v-for="(cls_child,index) in grd_child.children" v-if="cls_child.children.length>0">
					 <uni-row :key="cls_child.cls_code">
						<uni-col :span="24"><view class="detail-text-18">{{cls_child.grd_name}} {{cls_child.cls_name}}</view></uni-col>
						<uni-col :span="24">
							<view class="detail-text">
								<template style="font-size: 14px;" v-for="(stu_child,index) in cls_child.children" v-if="stu_child.stu_name">
									<template v-if="index==cls_child.children.length-1">
										<text :key="stu_child.stu_code" class="text">{{stu_child.stu_name}}</text>
									</template>
									<template v-else>
										<text :key="stu_child.stu_code" class="text">{{stu_child.stu_name}},</text>
									</template>
								</template>
							</view>
							 <view class="line" style="margin:5px -15px 5px;"></view>
						</uni-col>
					 </uni-row>
				 </template>
		 	</template>
		 </view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				itemData: {},
				total:'',//总计
				pageArray: [], //界面总数组
			}
		},
		methods: {
			getStudentFromHR(tousers){//获取年级
				const params = {
					grd_codes:grd_codes.join(","),
					cls_codes:cls_codes.join(","),
					op_code:'index',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'stu',params,response2=>{
					console.log("responseaaa: " + JSON.stringify(response2));
					this.hideLoading()
				})
			},
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.access.split('#')[1]
			this.itemData=itemData
			setTimeout(()=>{
				 // this.showLoading()
				 // this.getList()
			},100)
			uni.setNavigationBarTitle({title:itemData.text});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>
	.text{
		margin: 0 3px 0 0 ;
	}
	.form-view{
		padding: 7px 15px;
	}
	.select-line{
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}
	 .slot-box {
	 	/* #ifndef APP-NVUE */
	 	display: flex;
	 	/* #endif */
	 	flex-direction: row;
	 	align-items: center;
	 }
	 
	 .content{
	 	margin: 2px 0;
	 }
	 .slot-text {
	 	flex: 1;
	 	font-size: 14px;
	 	margin-right: 10px;
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	  
	 .title-text{
		 display: flex;
		 align-items: center;
		color: #5C5C5C;
	 	 word-break: break-all;
	 }
	 
	 .detail-text-18{
	 	color: #939393;
	 	font-size: 14px;
	 	margin: 3px 0;
	 }
	 .detail-text{
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
		line-height: 2;
	 }
	 
	 .leaveType {
		 font-size:12px ;
	 	width: 48px;
	 	color: #EFAD44;
	 	padding:0px 3px;
	 	border-radius: 4px;
		margin-right: 3px;
	 	border: 1px solid #EFAD44;
	 }
	 
	 .uni-input-input{
		 font-size: 13px;
	 }
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 .line-green{
	 	background-color: #00CFBD;
	 	margin-bottom: 0.3125rem;
	 	height: 1px;
	 }
	 .double-line{
	 	height: 5px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
		}
		.form-left{
			font-size: 14px;
			width: 200rpx;
			color: #3F3F3F;
		}
</style>
