<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view v-if="navItem.childList&&navItem.childList.length>0" style="padding-top: 10px;">
			<uni-grid :column="4" :showBorder='false' :square="false" :highlight="false">
				<uni-grid-item v-for="(chilItem, chiilIndex) in navItem.childList" :index="chiilIndex"
					:key="chiilIndex">
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
				navItem: {}
			}
		},
		components: {
			mynavBar
		},
		methods: {
			clickItem(model){
				console.log('clickItem:'+JSON.stringify(model));
				util.openwithData(model.pagePath,model);
			}
		},
		onLoad() {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			});
			
			// 获取未读推送消息数的监听
			uni.$on('setPushCount', function(data) {
				_this.tabbar = util.getMenu();
				for (var i = 0; i < _this.tabbar.length; i++) {
					let tempM = _this.tabbar[i];
					if(tempM.access == _this.navItem.access){
						_this.navItem = tempM;
					}
				}
			});
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			console.log('personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getTabbarMenu();
			console.log('this.navItem:' + JSON.stringify(this.navItem));
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
	}
</style>
