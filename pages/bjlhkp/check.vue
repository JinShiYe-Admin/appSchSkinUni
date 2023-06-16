<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view v-if="colList.length>0" class="uni-flex uni-column" style="margin-top: 10px;">
			<view v-for="(item,index) in colList" :key="index" class="columnList" @click="clickItem(item)">{{item.name}}
			<p class="kpType">审</p>
			</view>
		</view>
		<view v-else style="margin-top: 30px;text-align: center;">未授权，请联系管理员！</view>
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
				colList:[],
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
			this.getCheckFir();
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
			clickItem(model) {
				model.access = this.navItem.access;
				model.title = model.name;
				model.text = model.name;
				console.log('clickItem:'+JSON.stringify(model))
				util.openwithData("/pages/bjlhkp/check_list", model);
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
			},
			getCheckFir() {
				//7.8.获取授权审核的一级分类
				let comData = {
					user_code: this.personInfo.user_code,
					index_code: this.navItem.access.split("#")[1],
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'score/getCheckFir', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.colList = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				})
			},
		}
	}
</script>

<style>
	.columnList {
		background-color: #c19b62;
		margin: 5px 15px;
		padding-top: 23px;
		text-align: center;
		color: white;
		font-size: 18px;
		height: 50px;
		border-radius: 8px;
	}
	
	.kpType {
		width: 20px !important;
		height: 20px !important;
		border-radius: 5px;
		border: 1px solid #AA505B;
		color: #AA505B;
		float: right;;
		margin: 25px 5px 0 0;
		font-size: 14px;
	}
</style>
