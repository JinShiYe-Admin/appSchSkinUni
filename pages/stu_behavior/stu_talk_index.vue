<template>
	<view>
		<mynavBar v-if="add" ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="+代学生请假" :textClick="textClick"></mynavBar>
		<mynavBar v-else ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' ></mynavBar>
		<view class="tabs-fixed">
			123
		</view>
		<view v-for="item in 155">
			<template >{{item}}</template>
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
				add:false,//add按钮权限
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
			}
		},
		components: {
			mynavBar
		},
		methods: {
			textClick(){
				let that=this
				// util.openwithData('/pages/leave/teaLeaveAsk_add',{index_code:this.index_code},{
				// 	refresh(data){//子页面调用父页面需要的方法
				// 		that.showLoading()
				// 		that.pageobj0.loadFlag=0
				// 		that.pageobj0.canload=true
				// 		that.pageobj0.page_number=1
				// 		// that.getList0()
				// 	}
				// })
			},
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
					 this.add=result[0]
					 this.hideLoading();
				 })
				 // this.getList0()
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj0.loadFlag=0
			this.pageobj0.canload=true
			this.pageobj0.page_number=1
			// this.getList0()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.pageobj0.canload){
				this.pageobj0.loadFlag=1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number=this.pageobj0.page_number+1
				// this.getList0()
			}
		},
	}
</script>

<style>

</style>
