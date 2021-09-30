<template>
	<view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">类型</view>
			<view class="form-right">{{tabBarItem.attend_item_name}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">部门</view>
			<view class="form-right">{{tabBarItem.dpt_name}}</view>
		</view>
		<view class="line"></view>
		<view class="uni-flex uni-row form-view">
			<view class="form-left">日期</view>
			<view class="form-right">{{tabBarItem.time}}</view>
		</view>
		<view class="double-line"></view>
		<uni-list :border="false" v-if="pageData.okList&&pageData.okList.length>0">
			<uni-list-item :key="index" v-for="(item,index) in pageData.okList" :border="true">
				<text slot="body" class="slot-box slot-text">
					<uni-row>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text title">正常</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">姓名：</view><view class="detail-text">{{item.user_name}}</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">时间：</view><view class="detail-text">{{item.attend_time}}</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">地点：</view><view class="detail-text">{{item.attend_addr}}</view></uni-col>
						<uni-col :span="24" v-if="item.attend_pic.length>0" style="display: flex;align-items: baseline;"><view class="title-text">附件：</view><view class="detail-text" style="color: #00CFBD;" @click="perviewImg(item.attend_pic)">点击查看打卡图片</view></uni-col>
					</uni-row>
				</text>
			</uni-list-item>
		</uni-list>
		<view class="line" v-if="pageData.lateList&&pageData.lateList.length>0"></view>
		<uni-list :border="false" v-if="pageData.lateList&&pageData.lateList.length>0">
			<uni-list-item :key="index" v-for="(item,index) in pageData.lateList" :border="true">
				<text slot="body" class="slot-box slot-text">
					<uni-row>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text title">迟到</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">姓名：</view><view class="detail-text">{{item.user_name}}</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">时间：</view><view class="detail-text">{{item.attend_time}}</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">地点：</view><view class="detail-text">{{item.attend_addr}}</view></uni-col>
						<uni-col :span="24" v-if="item.attend_pic.length>0" style="display: flex;align-items: baseline;"><view class="title-text">附件：</view><view class="detail-text" style="color: #00CFBD;" @click="perviewImg(item.attend_pic)">点击查看打卡图片</view></uni-col>
					</uni-row>
				</text>
			</uni-list-item>
		</uni-list>
		<view class="line" v-if="pageData.earlyList&&pageData.earlyList.length>0"></view>
		<uni-list :border="false" v-if="pageData.earlyList&&pageData.earlyList.length>0">
			<uni-list-item :key="index" v-for="(item,index) in pageData.earlyList" :border="true">
				<text slot="body" class="slot-box slot-text">
					<uni-row>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text title">早退</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">姓名：</view><view class="detail-text">{{item.user_name}}</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">时间：</view><view class="detail-text">{{item.attend_time}}</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">地点：</view><view class="detail-text">{{item.attend_addr}}</view></uni-col>
						<uni-col :span="24" v-if="item.attend_pic.length>0" style="display: flex;align-items: baseline;"><view class="title-text">附件：</view><view class="detail-text" style="color: #00CFBD;" @click="perviewImg(item.attend_pic)">点击查看打卡图片</view></uni-col>
					</uni-row>
				</text>
			</uni-list-item>
		</uni-list>
		<view class="line" v-if="pageData.outList&&pageData.outList.length>0"></view>
		<uni-list :border="false" v-if="pageData.outList&&pageData.outList.length>0">
			<uni-list-item :key="index" v-for="(item,index) in pageData.outList" :border="true">
				<text slot="body" class="slot-box slot-text">
					<uni-row>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text title">非规定地点打开</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">姓名：</view><view class="detail-text">{{item.user_name}}</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">时间：</view><view class="detail-text">{{item.attend_time}}</view></uni-col>
						<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">地点：</view><view class="detail-text">{{item.attend_addr}}</view></uni-col>
						<uni-col :span="24" v-if="item.attend_pic.length>0" style="display: flex;align-items: baseline;"><view class="title-text">附件：</view><view class="detail-text" style="color: #00CFBD;" @click="perviewImg(item.attend_pic)">点击查看打卡图片</view></uni-col>
					</uni-row>
				</text>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				pageData:{},
				user_codes:[]
			}
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			let that = this
			setTimeout(function() {
				that.showLoading()
				that.getDpt()
			}, 100);
			uni.setNavigationBarTitle({title:'考勤详情'});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		methods: {
			getDpt(){//部门人员
				let comData={
					dpt_codes:this.tabBarItem.dpt_code,
					page_size:10000,
					page_number:-1,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'dptUser',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let list = response.list;
					if(list.length>0 ){
						let codes=[]
						for (var i = 0; i < list.length; i++) {
							codes.push(list[i].user_code);
						}
						this.user_codes=codes.join(",");
						this.getDetail();
					}else{
						this.showToast('部门暂无人员');
					}
				})
			},
			getDetail(){//获取某部门某日考勤明细列表 
				let comData={
					dpt_code: this.tabBarItem.dpt_code,//部门Code
					attend_item: this.tabBarItem.attend_item,//
					user_codes:this.user_codes,
					begin_time: this.moment(this.tabBarItem.time).format("YYYYMMDD"), //查询开始时间
					end_time: this.moment(this.tabBarItem.time).format("YYYYMMDD"), //查询结束时间
					op_code: 'index',
					index_code: this.tabBarItem.index_code,
				}
				this.post(this.globaData.INTERFACE_ATTENDAND+'attendDptQry/getDptDayAttendItem',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.pageData=response
				})
			},
			perviewImg(imgUrl){
				console.log(imgUrl);
				const getDownToken = {
					appId: this.globaData.QN_APPID, //int 必填 项目id
					appKey: this.globaData.QN_APPKEY,
					urls: [imgUrl] //array 必填 需要获取下载token文件的路径
				}
				const getDownTokenUrl = this.QNGETDOWNTOKENFILE;
				this.showLoading();
				cloudFileUtil.getQNDownToken(getDownTokenUrl, getDownToken, (data) => {
					this.hideLoading();
					const tempArr = [];
					for (let i = 0; i < data.Data.length; i++) {
						let tempM = data.Data[i];
						tempArr.push(tempM.Value);
					}
					util.openFile(tempArr[0]);
				});
			},
		}
	}
</script>

<style>
	.title{
		font-size: 15px;
		color: #00CFBD;
		margin-bottom: 6px;
	}
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
		padding: 8px 14px;
	}
	.form-left{
		font-size: 13px;
		width: 80px;
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
	.detail-text{
		color: #939393;
		font-size: 13px;
		margin: 3px 0;
		word-break: break-all;
	}
</style>
