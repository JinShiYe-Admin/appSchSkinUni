<template>
	<view>
		<mynavBar v-if="add" ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' icon="plusempty" :iconClick="iconClick"></mynavBar>
		<mynavBar v-else ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' ></mynavBar>
		<view class="tabs-fixed">
			<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#00cfbd" @clickItem="onClickItem" />
		</view>
		<view class="content">
			<view v-if="current === 0">
				<uni-list :border="false">
					<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata0" :border="true">
						<text slot="body" class="slot-box slot-text" @click="toDetails(0,item)">
							<uni-row>
								<uni-col :span="24"><view class="title-text">{{item.comment?item.comment:'暂无内容'}}</view></uni-col>
								<uni-col :span="24"><view class="detail-text">{{item.begin_time}} ~ {{item.end_time}}</view></uni-col>
								<uni-col :span="24"><view class="detail-text">{{item.grd_name}} {{item.cls_name}}&ensp;{{item.stu_name}}</view></uni-col>
								<uni-col :span="20"><view class="detail-text">{{item.apply_time}}</view></uni-col>
								<uni-col :span="4"><view class="detail-text leaveType">{{item.item_code=='sickLeave'?'病假':item.item_code=='absenceLeave'?'事假':''}}</view></uni-col>
							</uni-row>
						</text>
					</uni-list-item>
				</uni-list>
				<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
			</view>
			<view v-if="current === 1">
				<uni-list :border="false">
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
				</uni-list>
				<uni-load-more :status="pageobj1.status" :icon-size="17" :content-text="pageobj1.contentText" />
			</view>
		</view>
		<u-tabbar-my v-if='tabBarItem.index<5' :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				items: ['已发起', '已通过'],
				current: 0,
				index_code:'',
				personInfo: {},
				add:false,//add按钮权限
				tabBarItem: {},
				pageSize:15,
				tabbar: [],
				
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
			iconClick(){
				let that=this
				util.openwithData('/pages/leave/stuLeave_add',{index_code:this.index_code},{
					refresh(data){//子页面调用父页面需要的方法
						that.showLoading()
						that.pageobj0.loadFlag=0
						that.pageobj0.canload=true
						that.pageobj0.page_number=1
						that.getList0()
					}
				})
			},
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
				let comData={
					page_size: this.pageSize,
					page_number:this.pageobj0.page_number,
					status:'',
					index_code:this.index_code,
				}
				this.post(this.globaData.STULEAVE_API+'apply/qryApply',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
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
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
				})
			},
			getList1(){
				let comData={
					page_size: this.pageSize,
					page_number:this.pageobj1.page_number,
					status:1,
					index_code:this.index_code,
				}
				this.post(this.globaData.STULEAVE_API+'apply/qryApply',comData,response=>{
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
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
				})
			},
			toDetails(type,item){
				item.index_code=this.index_code
				util.openwithData('/pages/leave/stuLeave_Detail',item)
			}
		},
		onLoad() {
			let _this = this;
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
				 this.getPermissionByPosition('add',this.index_code,result=>{
					 this.add=result[0]
				 })
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
	.uni-common-mt {
	    margin-top: 10px;
	}
	.uni-padding-wrap {
		padding: 0 5px;
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
