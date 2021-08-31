<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :icon='icon' :iconClick="iconClick"></mynavBar>
		123
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
				icon:'plusempty'
			}
		},
		components: {
			mynavBar
		},
		methods: {
			clickItem:function(chilItem){
				util.openwithData(chilItem.pagePath,chilItem)
			},
			iconClick(){
				console.log(2);
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
		},
		onPullDownRefresh() {
			// this.pageobj0.loadFlag=0
			// this.pageobj0.canload=true
			// this.pageobj0.page_number=1
			// this.getList0()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			// if(this.pageobj0.canload){
			// 	this.pageobj0.loadFlag=1
			// 	this.pageobj0.status = 'loading';
			// 	this.pageobj0.page_number=this.pageobj0.page_number+1
			// 	this.getList0()
			// }
		},
	}
</script>

<style>
	.moreImg {
		width: 35px;
		height: 35px;
	}
	
	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}
</style>