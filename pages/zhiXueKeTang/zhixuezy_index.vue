<template>
	<view>
		<mynavBar ref="mynavBar" :titleClick="titleClick" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<scroll-view class="scroll-view_H" scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
				<view v-for="(item,index) in tablist" :key="item.key" :id="item.key" :data-current="index" class="scroll-view-item_H" @click="tabtap(index)">
					<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{item.value}}</text>
				</view>
			</scroll-view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 37px;">
			<uni-list :border="false">
				<uni-list-item  :key="index" v-for="(item,index) in 1000" :border="true">
					<text slot="body" class="slot-box slot-text">
						<uni-row>
							<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">时间：</view><view class="detail-text">{{item}}</view></uni-col>
							<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">地点：</view><view class="detail-text">{{item}}</view></uni-col>
							<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">类型：</view><view class="detail-text">{{item}}</view></uni-col>
							<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">结果：</view><view class="detail-text">{{item}}</view></uni-col>
						</uni-row>
					</text>
				</uni-list-item>
			</uni-list>
			<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let tablist1=[]
	for (var i = 0; i < 30; i++) {
		tablist1.push({key:'shuai_'+i,value:i})
	}
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				pageSize:15,
				pageobj0:{
					loadFlag:0,//0 刷新 1加载更多
					page_number:1,//页码
					status:'more',//加载更多的状态
					contentText: {
						contentdown: '',//上滑加载更多
						contentrefresh: '加载中',
						contentnomore: ''//没有更多
					},
					canload:true,//是否加载更多
				},
				pagedata:[],
				tablist:tablist1,
				scrollInto:'',
				 tabIndex: 0,
			}
		},
		components: {
			mynavBar
		},
		methods: {
			tabtap(index){
				this.switchTab(index);
			},
			switchTab(index) {
				// TODO 获取数据
				console.log(index);
			    if (this.tabIndex === index) {
			        return;
			    }
				 this.tabIndex = index;
				 this.scrollInto = this.tablist[index].key;
				 console.log("this.tablist[index].key: " + JSON.stringify(this.tablist[index].key));
			},
			titleClick(){
				console.log('刘帅');
			},
			iconClick(){
				let that=this
				util.openwithData('/pages/teachercAttendance/add_attendance',{index_code:this.index_code},{
					refreshList(data){//子页面调用父页面需要的方法
						that.showLoading()
						that.pageobj0.loadFlag=0
						that.pageobj0.canload=true
						that.pageobj0.page_number=1
						that.getList0()
					}
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
			timeSelect(e){
				this.time=e
				this.showLoading()
				this.pageobj0.loadFlag=0
				this.pageobj0.canload=true
				this.pageobj0.page_number=1
				this.getList0();
			},
			getList0(){//获取页面数据
				let comData={
					user_code: this.personInfo.user_code, //用户Code
					attend_item: 0, //考勤项目,0 为全部
					attend_result: 0, //考勤结果,0 为全部1 正常,2 迟到,3 早退,4 缺勤,5 非规定地址打卡
					begin_time: this.time.replace(/-/g, ''), //查询开始时间
					end_time: this.time.replace(/-/g, ''), //查询结束时间
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ATTENDAND+'attend/getAttends',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					for (var i = 0; i < response.list.length; i++) {
						var tempM = response.list[i];
						if (tempM.attend_result == 1) {
							tempM.attend_resultName = '正常';
						} else if (tempM.attend_result == 2) {
							tempM.attend_resultName = '迟到';
						} else if (tempM.attend_result == 3) {
							tempM.attend_resultName = '早退';
						} else if (tempM.attend_result == 4) {
							tempM.attend_resultName = '缺勤';
						} else if (tempM.attend_result == 5) {
							tempM.attend_resultName = '非规定地址打卡';
						}
					}
					if(this.pageobj0.loadFlag===0){
						this.pagedata=[].concat(response.list)
					}else{
						this.pagedata=this.pagedata.concat(response.list)
					}
					if(this.pageobj0.page_number>=response.total_page){
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload=false
					}else{
						this.pageobj0.status = 'more';
					}
				})
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 // this.showLoading()
			},100)
			let that =this
			setTimeout(function() {
				that.tabBarItem.text="第一课 散步"
				that.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:14,color:'#FFFFFF'}}
			}, 2000);
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj0.loadFlag=0
			this.pageobj0.canload=true
			this.pageobj0.page_number=1
			this.getList0()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.pageobj0.canload){
				this.pageobj0.loadFlag=1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number=this.pageobj0.page_number+1
				this.getList0()
			}
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
		},
	}
</script>

<style>
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
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .title-text{
		 display: flex;
		 align-items: center;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
		 flex: 1;
	 	color: #939393;
	 	font-size: 13px;
	 	margin: 3px 0;
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
	 
	 .scroll-view_H {
	 	white-space: nowrap;
	 	width: 100%;
	 }
	 .scroll-view-item_H {
	 	display: inline-block;
	 	width: 50px;
	 	height: 40px;
	 	line-height: 40px;
	 	text-align: center;
	 	font-size: 15px;
	 }
	 
	 .uni-tab-item-title {
	     color: #555;
	     font-size: 30rpx;
	     height: 80rpx;
	     line-height: 80rpx;
	     flex-wrap: nowrap;
	     /* #ifndef APP-PLUS */
	     white-space: nowrap;
	     /* #endif */
	 }
	 
	 .uni-tab-item-title-active {
	     color: #00CFBD;
	 }
</style>
