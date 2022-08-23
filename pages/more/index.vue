<template style="background-color: red;">
	<view class="warp">
		<uniNavBar title='更多' backgroundColor='#00CFBD' fixed='true' statusBar='true' color='white'></uniNavBar>
		<uni-card style="font-weight: 900;" v-for="(item, index) in tabarMore" :index="index" :key="index">
			<view>{{item.text}}</view>
			<view v-if="item.childList.length>0" style="padding-top: 10px;">
				<uni-grid :column="4" :showBorder='false' :square="false" :highlight="false">
					<uni-grid-item v-for="(chilItem, chiilIndex) in item.childList" :index="chiilIndex"
						:key="chiilIndex">
						<uni-badge v-if="chilItem.noReadCut>0" :text='chilItem.noReadCut' type='error' size="small" style="margin-left: 50px;z-index: 999;"></uni-badge>
						<view v-show="chilItem.noReadCut==0" style="height: 20px;"></view>
						
						<!-- #ifdef MP -->
						<view v-if="chilItem.noReadCut==0" class="grid-item-box" @click="clickItem(chilItem)">
							<image :src="chilItem.icon" class="moreImg" mode="aspectFill" />
							<text style="margin-top: 10px;font-size: 13px;color: #878787;"
								class="text">{{ chilItem.text }}</text>
						</view>
						<view v-else-if="chilItem.noReadCut>0" class="grid-item-box" @click="clickItem(chilItem)" style="margin-top: -20px;">
							<image :src="chilItem.icon" class="moreImg" mode="aspectFill" />
							<text style="margin-top: 10px;font-size: 13px;color: #878787;"
								class="text">{{ chilItem.text }}</text>
						</view>
						<!-- #endif -->
						<!-- #ifndef MP -->
						<view class="grid-item-box" @click="clickItem(chilItem)">
							<image :src="chilItem.icon" class="moreImg" mode="aspectFill" />
							<text style="margin-top: 10px;font-size: 13px;color: #878787;"
								class="text">{{ chilItem.text }}</text>
						</view>
						<!-- #endif -->
					</uni-grid-item>
				</uni-grid>
			</view>
			<view v-if="item.childList.length==0">
				<uni-grid :column="4" :showBorder='false' :square="false" :highlight="false">
					<uni-grid-item>
						<view class="grid-item-box" @click="clickItemTab(item)">
							<image :src="item.img_href" class="moreImg" mode="aspectFill" />
							<text style="margin-top: 10px;font-size: 13px;color: #878787;"
								class="text">{{ item.text }}</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</uni-card>
		<u-tabbar-my :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabarMore: [],
			}
		},
		methods: {
			clickItem: function(item) {
				console.log('item:' + JSON.stringify(item));
				item.index = 100;
				util.openwithData(item.pagePath, item,{
					oaRefreshUnread(){
						// 获取未读数
						util.getPushCut();
					}
				});
			},
			clickItemTab: function(item) {
				console.log('item:' + JSON.stringify(item));
				item.index = 100;
				util.openwithData(item.pagePath1, item,{
					oaRefreshUnread(){
						// 获取未读数
						util.getPushCut();
					}
				});
				// item.index = 99;
				// util.setTabbarMenu(item);
				// uni.switchTab({
				// 	url: item.pagePath
				// });
			}
		},
		components: {
			uniNavBar
		},
		onLoad(option) {
			_this = this;
			// 获取未读推送消息数的监听
			uni.$on('setPushCount', function(data) {
				_this.tabbar = util.getMenu();
				_this.tabarMore = util.getMenuMore();
				// for (var i = 0; i < _this.tabbar.length; i++) {
				// 	let tempM = _this.tabbar[i];
				// 	if(tempM.access == _this.tabarMore.access){
				// 		_this.tabarMore = tempM;
				// 	}
				// }
			});
			this.tabbar = util.getMenu();
			this.tabarMore = util.getMenuMore();
			console.log('this.tabarMore:' + JSON.stringify(this.tabarMore));
		}
	}
</script>

<style>
	.moreImg {
		width: 40px;
		height: 40px;
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
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

	page {
		background-color: #f2f2f2;
	}

	.uni-border-bottom ::after {
		border-bottom: 0px solid red !important;
	}
	
	::v-deep .uni-badge {
		line-height: 16px;
		/* #ifdef APP-PLUS */
		padding-top: 0px;
		/* #endif */
		margin-bottom: -20px;
		margin-top: 20px;
		/* #ifdef MP */
		padding: 0px;
		/* #endif */
	}
	
	::v-deep .uni-badge--x {
		/* margin-top: 15px;
		margin-left: 15px; */
		/* padding-top: -70px; */
	}
</style>
