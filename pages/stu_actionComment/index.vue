<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<uni-segmented-control :current="current" :values="items" style-type="text" active-color="#00cfbd" @clickItem="onClickItem" />
		</view>
		<view class="content">
			<view v-if="current === 0">
				<view class="wrap"> 
					<u-time-line>
						<u-time-line-item nodeTop="2">
							<template v-slot:node>
								<view class="u-node" style="background: #19be6b;">
									<u-icon name="pushpin-fill" color="#fff" :size="24"></u-icon>
								</view>
							</template>
							<template v-slot:content>
								<view>
									<view class="u-order-time">2019-05-08 12:12</view>
									<view class="u-order-title">待取件</view>
									<view class="u-order-desc">[自提柜]您的快件已放在楼下侧门，直走前方53.6米，左拐约10步，再右拐直走，见一红灯笼停下，叩门三下，喊“芝麻开门”即可。</view>
								</view>
							</template>
						</u-time-line-item>
						<u-time-line-item nodeTop="2">
							<template v-slot:node>
								<view class="u-node" >
									<u-icon name="account-fill" color="#fff" :size="24"></u-icon>
								</view>
							</template>
							<template v-slot:content>
								<view>
									<view class="u-order-title unacive">派送中</view>
									<view class="u-order-desc">【深圳市】快件已到达目的地，派件员为国产锦衣卫007号，电话：<text class="tel">13833882438</text>，请留意快递信息</view>
									<view class="u-order-time">2019-05-08 06:03</view>
								</view>
							</template>
						</u-time-line-item>
						<u-time-line-item nodeTop="2">
							<template v-slot:node>
								<view class="u-node">
									<u-icon name="car-fill" color="#fff" :size="24"></u-icon>
								</view>
							</template>
							<template v-slot:content>
								<view>
									<view class="u-order-title unacive">运输中</view>
									<view class="u-order-desc">【深圳市】快递已到达 深圳固戍一部</view>
									<view class="u-order-time">2019-05-07 08:05</view>
								</view>
							</template>
						</u-time-line-item>
						<u-time-line-item>
							<template v-slot:content>
								<view>
									<view class="u-order-desc">【深圳市】快件已从深圳运转中心发出，正在发往深圳宝安一部</view>
									<view class="u-order-time">2019-12-06 22:30</view>
								</view>
							</template>
						</u-time-line-item>
						<u-time-line-item>
							<template v-slot:content>
								<view>
									<view class="u-order-desc">【深圳市】快件已到达 深圳运转中心</view>
									<view class="u-order-time">2019-12-04 16:42</view>
								</view>
							</template>
						</u-time-line-item>
						<u-time-line-item>
							<template v-slot:content>
								<view>
									<view class="u-order-desc">【郑州市】快件已从郑州运转中心出发，正在发往深圳运转中心</view>
									<view class="u-order-time">2019-12-02 12:55</view>
								</view>
							</template>
						</u-time-line-item>
						<u-time-line-item>
							<template v-slot:content>
								<view>
									<view class="u-order-desc">【郑州市】快件已到达 郑州运转中心</view>
									<view class="u-order-time">2019-12-02 08:23</view>
								</view>
							</template>
						</u-time-line-item>
						<u-time-line-item nodeTop="0">
							<template v-slot:node>
								<view class="u-node">
									<u-icon name="file-text-fill" color="#fff" :size="24"></u-icon>
								</view>
							</template>
							<template v-slot:content>
								<view>
									<view class="u-order-desc">您购买的商品【尚方宝剑，先斩后奏】，经由北京军区仓库发货，国内快递承运人【中南海保镖】。</view>
									<view class="u-order-time">2019-12-01 07:00</view>
								</view>
							</template>
						</u-time-line-item>
					</u-time-line>
				</view>
				<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
			</view>
			<view v-if="current === 1">
				<!-- <uni-list :border="false">
					<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata1" :border="true">
						<text slot="body" class="slot-box slot-text" @click="toDetails(1,item)">
							<uni-row>
								<uni-col :span="24"><view class="title-text">{{item.comment?item.comment:'暂无内容'}}</view></uni-col>
								<uni-col :span="24"><view class="detail-text">{{item.begin_time}} ~ {{item.end_time}}</view></uni-col>
								<uni-col :span="24"><view class="detail-text">{{item.grd_name}} {{item.cls_name}}&ensp;{{item.stu_name}}</view></uni-col>
								<uni-col :span="20"><view class="detail-text">{{item.apply_time}}</view></uni-col>
								<uni-col :span="4"><view class="detail-text leaveType">{{item.item_code=='sickLeave'?'病假':item.item_code=='absenceLeave'?'事假':''}}</view></uni-col>
							</uni-row>
						</text>
					</uni-list-item>
				</uni-list> -->
				 4678
				<uni-load-more :status="pageobj1.status" :icon-size="17" :content-text="pageobj1.contentText" />
			</view>
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
					if(this.pagedata0.length===0){
					 	// this.showLoading()
					 	// this.pageobj0.loadFlag=0
					 	// this.pageobj0.canload=true
					 	// this.pageobj0.page_number=1
					 	// this.getList0()
					}
				}else if(this.current===1){
					if(this.pagedata1.length===0){
						// this.showLoading()
						// this.pageobj1.loadFlag=0
						// this.pageobj1.canload=true
						// this.pageobj1.page_number=1
						// this.getList1()
					}
				}
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
				 // this.showLoading()
				 // this.getPermissionByPosition('add',this.index_code,result=>{
					//  this.add=result[0]
					//  if(result[0]){
					// 	 this.icon='plusempty'
					//  }
				 // })
				 // this.getGrd()
				 // this.getDictList()
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
	
	.u-order-title {
		color: #333333;
		font-weight: bold;
		font-size: 32rpx;
	}
	
	.u-order-title.unacive {
		color: rgb(150, 150, 150);
	}
	
	.u-order-desc {
		color: rgb(150, 150, 150);
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}
	
	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 26rpx;
	}
	
	.tel {
		color: $u-type-primary;
	}
	
	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
	
	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 10px;
		width: 30px;
		height: 30px;
	}
	.content{
		margin: 44px 0 2px;
	}
	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
	}
	::v-deep  .u-time-axis::before{
		border-left: 1px solid #00CFBD;
	}
	::v-deep .u-dot {
		background: #00CFBD;
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
	
	.detail-text{
		color: #939393;
		font-size: 12px;
		margin: 3px 0;
	}
	
	.leaveType {
		width: 26px;
		color: #2A82E4;
		padding:0px 3px;
		border-radius: 4px;
		border: 1px solid #2A82E4;
	}
	.leaveType0 {
		width: 26px;
		color: #FF8D1A;
		padding:0px 3px;
		border-radius: 4px;
		border: 1px solid #FF8D1A;
	}
	.leaveType1 {
		width: 26px;
		color: #00CFBD;
		padding:0px 3px;
		border-radius: 4px;
		border: 1px solid #00CFBD;
	}
	.leaveType2 {
		width: 26px;
		color: #D4308D;
		padding:0px 3px;
		border-radius: 4px;
		border: 1px solid #D4308D;
	}
	 
</style>