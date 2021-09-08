<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick"></mynavBar>
		<view v-if="detailData.grd_name || detailData.cls_name ||  detailData.stu_name">
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
				<view class="form-left">谈话日期</view>
				<view class="form-right">{{detailData.create_time}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">谈话记录</view>
				<view class="form-right">{{detailData.chat_detail}}</view>
			</view>
			<template v-if="imgList.length>0">
				<view class="double-line"></view>
				<view v-for="(extraFile,index) in imgList" :key='index'>
					<view class="encName">附件:
						<!-- #ifdef APP-PLUS -->
							<a class="" style="font-size: 13px;color: #3c9bfe;margin-left: 10px;" @click="checkEnc(extraFile)">附件{{index+1}}</a>
						<!-- #endif -->
						<!-- #ifdef H5 -->
							<uni-link :href="extraFile" style="margin-left: 10px;" :text="'附件'+(index+1)"></uni-link>
						<!-- #endif -->
					</view>
				</view>
			</template>
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
	// 七牛上传相关
	 import gUpload from "@/components/g-upload/g-upload.vue"
	 import cloudFileUtil from '../../commom/uploadFiles/CloudFileUtil.js';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
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
				// 附件上传相关👇
				control:false,//是否显示上传 + 按钮 一般用于显示
				deleteBtn:false,//是否显示删除 按钮 一般用于显示
				columnNum:3,//每行显示的图片数量
				imgList: [],//选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
			}
		},
		components: {
			mynavBar,
			 gUpload
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			console.log(itemData);
			itemData.index=100
			itemData.text=itemData.title
			this.tabBarItem = itemData;
			this.detailData = itemData;
			this.index_code=itemData.index_code
			console.log("itemData: " + JSON.stringify(itemData));
			let imgList=[]
			itemData.asset_ids.map(item=>{
				imgList.push(item.url)
			})
			if(itemData.canDelete){
				this.icon='trash'
			}
			this.imgList=imgList
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			iconClick(){
				this.$refs.alertDialog.open()
			},
			dialogConfirm(){
				this.showLoading()
				let url=this.globaData.INTERFACE_STUXWSUB + 'Talk/delete'
				let comData={
					id: this.detailData.id,
					index_code:this.index_code,
				}
				this.post(url,comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.showToast('操作成功')
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('refreshTalkBehaviorDetailZd', {data: 1});
					uni.navigateBack();
					this.hideLoading()
				})
			},
			checkEnc: function(tempUrl) {
				console.log('tempUrl:' + tempUrl);
				var urlStr = encodeURI(tempUrl);
				this.showLoading();
				uni.downloadFile({
					url: urlStr,
					success: function(res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							success: function(res) {
								uni.hideLoading();
								console.log('打开文档成功');
							},
							fail() {
								uni.hideLoading();
								uni.showToast({
									title: '当前附件打开失败'
								})
							}
						});
					}
				});
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
	
	.encName {
		margin-left: 15px;
		margin-right: 15px;
		margin-bottom: 10px;
		font-size: 14px;
		color: #333;
	}
</style>
