<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view v-if="navItem.childList.length>0" style="padding-top: 10px;">
			<uni-grid v-if="updataNoReadeCut" :column="4" :showBorder='false' :square="false" :highlight="false">
				<uni-grid-item v-for="(chilItem, chilIndex) in navItem.childList" :index="chilIndex"
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
		<u-tabbar-my v-if='navItem.index<5' :list="tabbar"></u-tabbar-my>
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
				navItem: {},
				updataNoReadeCut:true
			}
		},
		components: {
			mynavBar
		},
		methods: {
			clickItem:function(chilItem){
				chilItem.index = 100;
				var tempPath = ''
				if (chilItem.pagePath1) {
					tempPath = chilItem.pagePath1;
				} else{
					tempPath = chilItem.pagePath;
				}
				util.openwithData(tempPath,chilItem);
			}
		},
		onLoad() {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			});
			
			this.tabbar = util.getMenu();
			// console.log('this.tabbar:'+JSON.stringify(this.tabbar));
			this.personInfo = util.getPersonal();
			this.navItem = util.getTabbarMenu();
			console.log('this.navItem:'+JSON.stringify(this.navItem));
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