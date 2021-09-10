<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<uni-segmented-control :current="current" :values="items" style-type="text" active-color="#00cfbd" @clickItem="onClickItem" />
		</view>
		<view class="content">
			123
		</view>
		<u-tabbar-my v-if='tabBarItem.index<5' :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
				items: ['行为与谈话', '教师评语'],
				current: 0,
				pageSize0:15,
				pageSize1:15,
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
				
				// 附件上传相关👇
				control:false,//是否显示上传 + 按钮 一般用于显示
				deleteBtn:false,//是否显示删除 按钮 一般用于显示
				columnNum:3,//每行显示的图片数量
				imgList: [],//选择的或服务器回传的图片地址，如果是私有空间，需要先获取token再放入，否则会预览失败
				
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
			mynavBar,
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
				if(this.current===0){
					if(this.pagedata0.length===0){
					 	this.showLoading()
					 	this.pageobj0.loadFlag=0
					 	this.pageobj0.canload=true
					 	this.pageobj0.page_number=1
					 	this.getList0()
					}
				}else if(this.current===1){
					if(this.pagedata1.length===0){
						this.showLoading()
						this.pageobj1.loadFlag=0
						this.pageobj1.canload=true
						this.pageobj1.page_number=1
						this.getList1()
					}
				}
			},
			getList0(){
				let user_code=this.personInfo.user_code;
				if(this.personInfo.type_code=='YHLX0004'){
					user_code=this.personInfo.stu_code;
				}
				let comData={
					stu_code:user_code,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize0, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.PARENTS_ATTENDANCE+'behavior/page',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
				    setTimeout(function () {
				    	uni.stopPullDownRefresh();
				    }, 1000);
				    this.hideLoading()
					//png、jpg、gif/bmp/jpeg
					response.list.map(item=>{
						let aimgs=[],bimgs=[];
						item.asset_ids.map(aitem=>{
							if(aitem.ext=='png' ||aitem.ext=='jpg'||aitem.ext=='jpeg'||aitem.ext=='gif'||aitem.ext=='bmp'){
								aimgs.push(aitem.url+ this.previewImg)
							}
						})
						item.aimgs=aimgs;
						item.behavior_asset_ids.map(bitem=>{
							if(bitem.ext=='png' ||bitem.ext=='jpg'||bitem.ext=='jpeg'||bitem.ext=='gif'||bitem.ext=='bmp'){
								bimgs.push(bitem.url+ this.previewImg)
							}
						})
						item.bimgs=bimgs;
					})
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
			getList1(){
				let user_code=this.personInfo.user_code;
				if(this.personInfo.type_code=='YHLX0004'){
					user_code=this.personInfo.stu_code;
				}
				let comData={
					stu_code:user_code,
					page_number: this.pageobj1.page_number, //当前页数
					page_size: this.pageSize1, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.PARENTS_ATTENDANCE+'remark/page',comData,response=>{
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
		},
		onLoad() {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			})
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			this.tabBarItem = util.getTabbarMenu();
			this.index_code=this.tabBarItem.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getList0()
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
	}
</script>

<style>
	.wrap {
		padding: 24rpx 24rpx 24rpx 40rpx;
	}
	
	.wrap {
		padding: 24rpx 24rpx 24rpx 40rpx;
	}
	
	.u-node {
		width: 44rpx;
		height: 44rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #d0d0d0;
	}
	
	.u-order-title.unacive {
		color: rgb(150, 150, 150);
	}
	
	.u-order-desc {
		color: rgb(150, 150, 150);
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}
	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
	}
	.u-order-time {
		color: rgba(144,144,144);
		font-size: 26rpx;
	}
	.u-order-detail{
		color: rgba(144,144,144);
		font-size:26rpx;
		margin-bottom: 5px;
		word-break: break-all;
	}
	.content{
		margin: 44px 0 2px;
	}
	::v-deep  .u-time-axis::before{
		border-left: 1px solid #00CFBD !important;
	}
	::v-deep .u-dot {
		background: #00CFBD !important;
	}
	.u-order-title,.u-order-title1,.u-order-title2 {
		margin: 5px 0;
		font-size: 13px;
		height: 30px !important;
		width: 70px;
		text-align: center;
		background: #ff9900;
		border-radius: 5px;
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	.u-order-title1{
		height:25px !important;
		width: 55px;
	}
	.u-order-title2{
		background: #1AB501;
	}
	.line{
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}
	
	.title-text{
		width: 80vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.u-time-axis-item{
		margin-bottom: 17px;
	}
	.detail-text{
		color: #939393;
		font-size: 12px;
		margin: 3px 0;
	}
	::v-deep .uni-card{
		margin:-10px 0 0 -10px ;
	}
</style>