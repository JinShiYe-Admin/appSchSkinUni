<template>
	<view>
		<view class="tabs-fixed">
			 <view class="search-box">
				 <view class="uni-input-wrapper">
				    <input class="uni-input search-input" placeholder="访客姓名/事由/被访学生姓名" v-model="searchValue" @input="inputChange"/>
				 </view>
				 <button class="search-button" @click="search"><uni-icons type="search" color="#FFFFFF" size="17" /></button> 
			 </view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<uni-list :border="false">
				<uni-list-item showArrow :key="index" v-for="(model,index) in pagedata" :border="true">
					<text slot="body" class="slot-box slot-text" @click="toDetails(model)">
						<uni-row>
							<uni-col :span="24"><view class="title-text">访客:{{model.visitors}}</view></uni-col>
							<uni-col :span="15"><view class="detail-text">访问宿舍:{{model.room_name}}</view></uni-col>
							<uni-col :span="9" ><view class="detail-text" style="text-align: right;">同行人数:{{model.follow_num}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text" style="color: #00CFBD;" v-if="model.leave_code=='Y'">已离开</view></uni-col>
							<uni-col :span="12"><view class="detail-text" style="color: red;" v-if="model.leave_code=='N'">未离开</view></uni-col>
							<uni-col :span="12"><view class="detail-text" style="text-align: right;" v-if="model.leave_code=='Y'">{{model.leave_date}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text" style="text-align: right;" v-if="model.leave_code=='N'">{{model.visit_date}}</view></uni-col>
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
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				searchValue:'',
				
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
			}
		},
		methods: {
			inputChange(e){
				if(e.target.value==''){
					this.searchValue=''
					this.showLoading()
					this.pageobj0.loadFlag=0
					this.pageobj0.canload=true
					this.pageobj0.page_number=1
					this.getList0();
				}
			},
			search(){
				if(this.searchValue==''){
					this.showToast('请先输入搜索内容')
				}else{
					this.showLoading()
					this.pageobj0.loadFlag=0
					this.pageobj0.canload=true
					this.pageobj0.page_number=1
					this.getList0();
				}
			},
			getList0(){//获取页面数据
				let comData={
					keyword:this.searchValue,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'visitorRegister/page',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if(response!=null){
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
					}else{
						this.pagedata=[]
						this.showToast('暂无数据')
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload=false
					}
				})
			},
			toDetails(item){
				item.index_code=this.index_code
				util.openwithData('/pages/stu_dorm/calle_dorm_detail',item,{})
			}
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getList0();
			},100)
			uni.setNavigationBarTitle({title:itemData.text});
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
	 	width: 80vw;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
		word-break: break-all;
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
</style>
