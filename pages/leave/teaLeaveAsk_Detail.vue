<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view v-if="detailData.grd_name || detailData.cls_name ||  detailData.stu_name">
			<view class="uni-flex uni-row form-view">
				<view class="form-left">请假申请人</view>
				<view class="form-right">{{detailData.grd_name}} {{detailData.cls_name}} {{detailData.stu_name}}{{detailData.sno!=null&&detailData.sno.length>0?'（'+detailData.sno+'）':''}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">请假时间</view>
				<view class="form-right">共计: {{detailData.apply_time}}</view>
			</view>
			<view class="uni-flex uni-row form-view">
				<view class="form-right">{{detailData.begin_time}} 至 {{detailData.end_time}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">请假事由</view>
				<view class="form-right">{{detailData.comment}}</view>
			</view>
			<view class="line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-right">
					<span class="leaveType" style="margin:0 0 0 15px;">{{detailData.item_code=='sickLeave'?'病假':detailData.item_code=='absenceLeave'?'事假':''}}</span>
					<span class="leaveType-cr" style="margin:0 0 0 15px;">{{detailData.in_out_permission_code=='outSchool'?'可以出校':detailData.in_out_permission_code=='backDorm'?'可回宿舍':''}}</span>
				</view>
			</view>
			<view class="double-line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">审批人</view>
			</view>
			<view class="line-green"></view>
			<view :key="index" v-for="(item,index) in detailData.approve_list">
				<view class="uni-flex uni-row form-view" >
					<view class="form-left-approve">{{item.approve_user_name}}</view>
					<view class="form-right-approve">
						<view v-if="item.lstatus==0">
							<image src="../../static/images/leave/pass.png" style="width: 15px;height: 15px;">
						</view>
						<view v-else-if="item.lstatus==1"> 
							<image src="../../static/images/leave/req.png" style="width: 15px;height: 15px;">
						</view>
						<view v-else-if="item.lstatus==2"> 
							<image src="../../static/images/leave/ref.png" style="width: 15px;height: 15px;">
						</view>
					</view>
				</view>
				<view v-if="item.approve_content" class="uni-flex uni-row form-view">
					<view class="form-left-approve-content">{{item.approve_content}}</view>
				</view>
				<view v-if="index<detailData.approve_list.length-1" class="line"></view>
			</view>
			<view class="double-line"></view>
			<view class="uni-flex uni-row form-view">
				<view class="form-left">抄送人</view>
			</view>
			<view class="line-green"></view>
			<view class="uni-flex uni-row form-view"> 
				<view class="form-left-approve">
					<template v-for="(item,index) in detailData.copy_list"><template v-if="index < detailData.copy_list.length-1">{{item.copy_user_name}},</template><template v-else>{{item.copy_user_name}}</template></template>
					<template v-if="detailData.copy_list.length===0">无</template>
				</view>
			</view>
			<view v-if="type==0">
				<view class="double-line"></view>
				<view class="uni-flex uni-row form-view"> 
					<textarea value="" maxlength="40" style="height: 60px;" placeholder="批复内容（选填）" />
				</view>
				<view class="uni-flex uni-row form-view">
					<button @tap="showDialog" type="warn" class="mui-btn">
						拒 绝
					</button>
					<button @tap="showDialog1" type="primary" class="mui-btn1">
						通 过
					</button>
				</view>
			</view>
		</view>
		<view v-else-if="type==1 || type==2 || type==3" style="height: 30px;">
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="确定要拒绝此条请假记录吗" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="alertDialog1" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="确定要通过此条请假记录吗" @confirm="dialogConfirm1"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				type:0,//0 待审批 1 已审批 2 已发起 3 抄送本人
				index_code:'',
				personInfo: {},
				navItem: {},
				canSub:true,
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
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData[1].index=100
			itemData[1].text='请假详情'
			this.type = itemData[0];
			this.navItem = itemData[1];
			this.index_code=itemData[1].index_code
			setTimeout(()=>{
				this.showLoading()
				this.getLeaveDetail()
			},100)
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
			getLeaveDetail(){
				let url=this.globaData.STULEAVE_API + 'apply/getApplyById'
				if(this.type==0 || this.type==1){
					url=this.globaData.STULEAVE_API + 'apply/getApproveById'
				}
				let comData={
					id:this.navItem.id,
					index_code:this.index_code,
				}
				this.post(url,comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let leave=response
					let approveList=leave.approve_list
					if(approveList){
						approveList.map((item,index)=>{
							//lstatus 0 通过 1 待定 2 拒绝
							if(leave.status==1){//请假审核状态为已通过
								item.lstatus=0
							}else if(leave.status==0){//请假审核状态为待审批
								if(item.status==2){//抄送人审核状态为已批
									item.lstatus=0
								}else{
									item.lstatus=1
								}
							}else if(leave.status==2){//请假审核状态为已拒绝
								//找到最后一个已批审核人的下标
								let num=0;
								if(leave.status==2){
									approveList.map((item,index)=>{
										if(item.status==2){
											num=index
										}
									})
								}
								if(item.status==2){//抄送人审核状态为已批
									item.lstatus=0
									if(num===index){
										item.lstatus=2
									}
								}else{
									item.lstatus=1
								}
							}
						})
					}
					this.detailData=leave
				})
			},
			submit(status){
				if(this.canSub){
					this.canSub=false
					this.showLoading()
					let comment=this.detailData.approve_comment?this.detailData.approve_comment.replace(/\s+/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/\r/g, ''):''
					if(!comment){
						if(status==1){ 
							comment="同意"
						}else{
							comment="不同意"
						}
					}
					let comData = {
						id:this.detailData.id,
						approve_content:comment,
						status:status,
						index_code:this.index_code
					}
					let that=this
					this.post(this.globaData.STULEAVE_API+'apply/setApprove',comData,response=>{
						this.canSub=true
						this.hideLoading()
						this.showToast('操作成功');
						const eventChannel = that.getOpenerEventChannel()
						eventChannel.emit('refreshApprove', {data:123});
						setTimeout(function(){
							
							uni.navigateBack()
						},1500)
					});
				}
			},
			showDialog(){
				this.$refs.alertDialog.open()
			},
			showDialog1(){
				this.$refs.alertDialog1.open()
			},
			dialogConfirm(){
				this.submit(0)
			},
			dialogConfirm1(){
				this.submit(1)
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
		background-color: #00CFBD !important;
		margin: 5px 0 25px 10px;
	}
</style>
