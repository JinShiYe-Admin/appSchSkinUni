<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="uni-flex uni-column" style="margin-top: 10px;">
			<view v-for="(item,index) in colList" class="columnList" @click="clickItem(index)">{{item}}</view>
		</view>
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
				navItem: {},
				colList:['室外卫生、升旗晨跑','教学区管理','食堂就餐','男生宿舍','女生宿舍'],
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.index = 100
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			clickItem(index) {
				// model.access = this.navItem.access;
				var tempM = {
					access:this.navItem.access,
					fir_id:index+1,
					title:this.colList[index],
					text:this.colList[index]
				}
				util.openwithData("/pages/bjlhkp/record_list", tempM);
				// if (index == 0) {
				// 	util.openwithData("/pages/bjlhkp/record_list", tempM);
				// } else if (index == 1) {
				// 	util.openwithData("/pages/bjlhkp/gongziDetail", tempM);
				// } else if (index == 2) {
				// 	util.openwithData("/pages/bjlhkp/gongziDetail", tempM);
				// } else if (index == 3) {
				// 	util.openwithData("/pages/bjlhkp/gongziDetail", tempM);
				// } else if (index == 4) {
				// 	util.openwithData("/pages/bjlhkp/gongziDetail", tempM);
				// }
			}
		}
	}
</script>

<style>
	.columnList {
		background-color: #049F95;
		margin: 5px 15px;
		padding-top: 23px;
		text-align: center;
		color: white;
		font-size: 18px;
		height: 50px;
		border-radius: 8px;
	}
</style>
