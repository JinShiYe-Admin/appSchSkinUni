<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view v-if="tabBarItem.childList.length>0" style="padding-top: 10px;">
			<uni-grid v-if="updataNoReadeCut" :column="4" :showBorder='false' :square="false" :highlight="false">
				<uni-grid-item v-for="(chilItem, chilIndex) in tabBarItem.childList" :index="chilIndex"
					:key="chilIndex">
					<uni-badge v-if="chilItem.noReadCut>0" :text='chilItem.noReadCut' type='error' size="small" style="margin-left: 50px;z-index: 99;"></uni-badge>
					<view v-show="chilItem.noReadCut==0" style="height: 20px;"></view>
					<view class="grid-item-box" @click="clickItem(chilItem)">
						<image :src="chilItem.icon" class="moreImg" mode="aspectFill" />
						<text style="margin-top: 10px;font-size: 13px;color: #878787;" class="text">{{ chilItem.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
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
				updataNoReadeCut:true
			}
		},
		components: {
			mynavBar
		},
		methods: {
			clickItem:function(chilItem){
				util.openwithData(chilItem.pagePath,chilItem,{
					oaRefreshUnread(){
						console.log('refreshrefreshrefreshrefreshrefreshrefreshrefreshrefreshrefreshrefresh');
						// 获取未读数
						_this.getUnReadCntFun();
					}
				});
			},
			// 获取未读数
			getUnReadCntFun() {
				for (var a = 0; a < this.tabBarItem.childList.length; a++) {
					var tempM0 = this.tabBarItem.childList[a];
					if (tempM0.redspot_url != null && tempM0.redspot_url.length > 0) {
						// 获取未读数
						util.getUnReadCut(tempM0.access, tempM0.redspot_url, (data) => {
							console.log('datadata:'+JSON.stringify(data));
							// console.log('index:'+index);
							for (var b = 0; b < this.tabBarItem.childList.length; b++) {
								var tempM1 = this.tabBarItem.childList[b];
								if (tempM1.access == data[0].access) {
									this.$set(this.tabBarItem.childList[b],'noReadCut',data[0].dotnum);
									console.log('this.tabBarItem:'+JSON.stringify(this.tabBarItem));
									this.updataNoReadeCut = false;
									this.updataNoReadeCut = true;
								}
							}
						},a);
						// getUnReadCut(tempM0.access, tempM0.redspot_url, function(data) {
						// 	console.log('getUnReadCut:' + JSON.stringify(data));
						// 	if (data.code == 0) {
						// 		var tempNoRead = 0;
						// 		for (var b = 0; b < this.childList.length; b++) {
						// 			var tempM1 = this.childList[b];
						// 			if (tempM1.access == data.data.list[0].access) {
						// 				tempM1.NoReadCnt = data.data.list[0].dotnum;
						// 			}
						// 			tempNoRead = tempNoRead + tempM1.NoReadCnt;
						// 		}
						// 		console.log('tempNoRead:' + tempNoRead);
								
						// 		var badgeNum = store.get(window.storageKeyName.BADGENUMBER) * 1 -this.noReadCut + tempNoRead;
						// 		console.log('badgeNum:' + badgeNum);
						// 		this.noReadCut = badgeNum;
						// 		mui.fire(plus.webview.currentWebview().opener(), 'showNoReadCnt', {
						// 			showNoReadCnt: badgeNum,
						// 			url: this.pageUrl
						// 		});
						// 		store.set(window.storageKeyName.BADGENUMBER, badgeNum);
						// 		//设置app角标,flag=0直接设置角标数字，flag=1角标减1,falg=2角标加1
						// 		utils.setBadgeNumber(0, badgeNum);
						// 	}
						// });
					}
				}
			}
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
			for (var i = 0; i < this.tabBarItem.childList.length; i++) {
				var tempM = this.tabBarItem.childList[i];
				tempM.noReadCut = 0;
			}
			console.log('this.tabBarItem:'+JSON.stringify(this.tabBarItem));
			// 获取未读数
			this.getUnReadCntFun();
		}
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
		margin-top: -20px;
	}
	
	::v-deep .uni-badge {
		line-height: 16px;
		/* #ifdef APP-PLUS */
		padding-top: 0px;
		/* #endif */
	}
	
	::v-deep .uni-badge--x {
		/* margin-top: 15px;
		margin-left: 15px; */
		/* padding-top: -70px; */
	}
</style>