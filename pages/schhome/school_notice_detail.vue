<template>
	<view>
		<view style="padding:5px 15px 0px;">
			<uni-row>
				<uni-col :span="24"><view class="title-text">{{formData.msg_content}}</view></uni-col>
				<uni-col :span="12"><view class="detail-text" style="margin-top: 5px;">发布人:{{formData.send_user_tname}}</view></uni-col>
				<uni-col :span="12"><view class="detail-text" style="text-align: right;margin-top: 5px;">{{formData.send_time}}</view></uni-col>
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
				formData: {}, //表单内容
				student:[]//年级 班级 学生 数组
			}
		},
		methods: {
			getStudentFromHR(){//获取年级
				let comData={
					op_code:'index',
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'grd',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if(response.list && response.list.length>0){
						let grd_list =response.list
						let grd_codes=[]
						grd_list.map(function(item){
							grd_codes.push(item.grd_code)
						})
						const params = {
							grd_codes:grd_codes.join(","),
							is_finish:0,
							op_code:'index',
							index_code: this.index_code,
						}
						this.post(this.globaData.INTERFACE_HR_SUB+'cls',params,response1=>{
						    console.log("responseaaa: " + JSON.stringify(response1));
							if(response1.list && response1.list.length>0){
								let cls_list =response1.list
								let cls_codes=[]
								grd_list.map(function(grd_item){ 
									let children=[]
									cls_list.map(function(cls_item){
										if(grd_item.grd_code==cls_item.grd_code){
											children.push(cls_item)
										}
									})
									grd_item.children=children
								})
								cls_list.map(function(item){
									cls_codes.push(item.cls_code)
								})
								const params = {
									grd_codes:grd_codes.join(","),
									cls_codes:cls_codes.join(","),
									op_code:'index',
									index_code: this.index_code,
								}
								this.post(this.globaData.INTERFACE_HR_SUB+'stu',params,response2=>{
								    console.log("responseaaa: " + JSON.stringify(response2));
									this.hideLoading()
									if(response2.list && response2.list.length>0){
										let stu_list =response2.list
										grd_list.map(function(grd_item){ 
											let cls_list=grd_item.children
											let grd_code=grd_item.grd_code
											cls_list.map(function(cls_item){
												let cls_code=cls_item.cls_code
												let children=[]
												stu_list.map(function(stu_item){
												 	 if(grd_code== stu_item.grd_code && cls_code==stu_item.cls_code){
														 children.push(stu_item)
													 }
												})
												cls_item.children=children
											})
										})
										this.student=grd_list
										console.log("student: " + JSON.stringify(grd_list));
									}else{
										this.hideLoading()
									}
								})
							}else{
								this.hideLoading()
							}
						})
					}else{
						this.hideLoading()
					}
				})
			},
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.index_code
			this.formData=itemData
			setTimeout(()=>{
				 this.showLoading()
				 this.getStudentFromHR()
			},100)
			uni.setNavigationBarTitle({title:'通知详情'});
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
	}
</script>

<style>
	.text{
		margin: 0 3px 0 0 ;
		word-break: break-all;
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
