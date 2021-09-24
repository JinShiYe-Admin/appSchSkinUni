<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick"></mynavBar>
		 <view class="tabs-fixed">
			<uni-segmented-control :current="current" :values="items" style-type="text" active-color="#00cfbd" @clickItem="onClickItem" />
		 </view>
		<view style="padding-top: 44px;" >
			<view v-if="current === 0">
				<uni-list :border="false">
					<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata0" :border="true">
						<text slot="body" class="slot-box slot-text" @click="toDetail0(item)">
							<uni-row>
								<uni-col :span="24"><view class="title-text">单号:{{item.outCode}}<view v-if="item.isRed==1" class="hcd">红冲单</view></view></uni-col>
									<uni-col :span="12"><view class="detail-text">名称:{{item.itemName}}</view></uni-col>
									<uni-col :span="12"><view class="detail-text">型号:{{item.itemModel}}</view></uni-col>
									<uni-col :span="12"><view class="detail-text">领用人:{{item.receiveManName}}</view></uni-col>
									<uni-col :span="12"><view class="detail-text">数量:{{item.outNum}}</view></uni-col>
							</uni-row>
						</text>
					</uni-list-item>
				</uni-list>
				<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
			</view>
			<view v-if="current === 1">
				<uni-list :border="false">
					<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata1" :border="true">
						<text slot="body" class="slot-box slot-text" @click="toDetail1(item)">
							<uni-row>
								<uni-col :span="24"><view class="title-text">单号:{{item.outCode}}<view v-if="item.isOut==1" class="isout">已出库</view><view v-if="item.isOut==2" class="noout">未出库</view></view></uni-col>
								<uni-col :key="index+Math.random()" :span="12"><view class="detail-text">名称:{{item.itemName}}</view></uni-col>
								<uni-col :key="index+Math.random()" :span="12"><view class="detail-text">型号:{{item.itemModel}}</view></uni-col>
								<uni-col :key="index+Math.random()" :span="12"><view class="detail-text">领用人:{{item.receiveManName}}</view></uni-col>
								<uni-col :key="index+Math.random()" :span="12"><view class="detail-text">数量:{{item.applyNum}}</view></uni-col>
							</uni-row>
						</text>
					</uni-list-item>
				</uni-list>
				<uni-load-more :status="pageobj1.status" :icon-size="17" :content-text="pageobj1.contentText" />
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				icon:'',
				tabBarItem: {},
				
				items: ['手工出库', '领用出库'],
				current: 0,
				add:false,
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
				pageobj1:{
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
				pagedata0:[],
				pagedata1:[], 
			}
		},
		components: {
			mynavBar
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
				if(this.current===0){
					if(this.add){
						this.icon='plusempty'
					}
					if(this.pagedata0.length===0){
					 	this.showLoading()
					 	this.pageobj0.loadFlag=0
					 	this.pageobj0.canload=true
					 	this.pageobj0.page_number=1
					 	this.getList0()
					}
				}else if(this.current===1){
					this.icon=''
					if(this.pagedata1.length===0){
						this.showLoading()
						this.pageobj1.loadFlag=0
						this.pageobj1.canload=true
						this.pageobj1.page_number=1
						this.getList1()
					}
				}
			},
			iconClick(){
				let that=this
				if(this.current===0){
					util.openwithData('/pages/schapp_item/item_out_add',{index_code:this.index_code},{
						refreshByAdd(data){//子页面调用父页面需要的方法
							that.showLoading()
							that.pageobj0.loadFlag=0
							that.pageobj0.canload=true
							that.pageobj0.page_number=1
							that.getList0()
						}
					})
				} 
			},
			getList0(){//获取页面数据
				 let comData={
				 	outCode:'',
				 	receiveManName:'',
				 	outManCode:this.personInfo.user_code,
				 	outManName:'',
				 	beginTime:'19700101',
				 	endTime:'20501231',
				 	page_number: this.pageobj0.page_number, //当前页数
				 	page_size:  this.pageSize, //每页记录数
				 	op_code:'index',
				 	index_code: this.index_code,
				 }
				 this.post(this.globaData.INTERFACE_ITEM+'handOut/getHandOuts',comData,response=>{
				     console.log("responseaaa: " + JSON.stringify(response));
				     setTimeout(function () {
				     	uni.stopPullDownRefresh();
				     }, 1000);
				     this.hideLoading()
				     if(this.pageobj0.loadFlag===0){
				     	this.pagedata0=[].concat(response.list)
				     }else{
				     	this.pagedata0=this.pagedata0.concat(response.list)
				     }
				     if(this.pageobj0.page_number>=response.total_page){
				     	this.pageobj0.status = 'noMore';
				     	this.pageobj0.canload=false
				     }else{
				     	this.pageobj0.status = 'more';
				     }
				 })
			},
			getList1(){//获取页面数据
				let comData={
					outCode:'',
					receiveApplyCode:'',
					receiveManName:'',
					outManCode:this.personInfo.user_code,
					outManName:'',
					isOut:0,
					beginTime:'19700101',
					endTime:'20501231',
					page_number: this.pageobj1.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					op_code:'index',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ITEM+'receiveOut/getReceiveOuts',comData,response=>{
					console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if(this.pageobj1.loadFlag===0){
						this.pagedata1=[].concat(response.list)
					}else{
						this.pagedata1=this.pagedata1.concat(response.list)
					}
					if(this.pageobj1.page_number>=response.total_page){
						this.pageobj1.status = 'noMore';
						this.pageobj1.canload=false
					}else{
						this.pageobj1.status = 'more';
					}
				})
			},
			toDetail0(item){
				item.index_code=this.index_code
				util.openwithData('/pages/schapp_item/item_out_detail',item,{})
			},
			toDetail1(item){
				item.index_code=this.index_code
				let that = this
				util.openwithData('/pages/schapp_item/item_out_lyck_detail',item,{
					refreshByLyck(data){//子页面调用父页面需要的方法
						that.showLoading()
						that.pageobj1.loadFlag=0
						that.pageobj1.canload=true
						that.pageobj1.page_number=1
						that.getList1()
					}
				})
			}
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getPermissionByPosition('add',this.index_code,result=>{
					 if(result[0]){
						 this.icon='plusempty'
						 this.add=true
					 }
					 this.hideLoading();
				 })
				 this.getList0();
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			if(this.current===0){
				this.pageobj0.loadFlag=0
				this.pageobj0.canload=true
				this.pageobj0.page_number=1
				this.getList0()
			}else if(this.current===1){
				this.pageobj1.loadFlag=0
				this.pageobj1.canload=true
				this.pageobj1.page_number=1
				this.getList1()
			} 
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.current===0){
				if(this.pageobj0.canload){
					this.pageobj0.loadFlag=1
					this.pageobj0.status = 'loading';
					this.pageobj0.page_number=this.pageobj0.page_number+1
					this.getList0()
				}
			}else if(this.current===1){
				if(this.pageobj1.canload){
					this.pageobj1.loadFlag=1
					this.pageobj1.status = 'loading';
					this.pageobj1.page_number=this.pageobj1.page_number+1
					this.getList1()
				}
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
	 
	 .isout{
		font-size:12px ;
		width: 35px;
		color: #FFFFFF;
		padding:0px 3px;
		border-radius: 4px;
		margin-left: 3px;
		background-color: #00CFBD;
		border: 1px solid #00CFBD;
	 }
	 
	 .hcd,.noout{
		 font-size:12px ;
		 width: 35px;
		 color: #FFFFFF;
		 padding:0px 3px;
		 border-radius: 4px;
		 margin-left: 3px;
		 background-color: #f74c31;
		 border: 1px solid #f74c31;
	 }
</style>
