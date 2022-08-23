<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view v-if="navItem.childList.length>0">
			<uni-section v-if="baseinfo_icons.length>0" title="基本信息" type="line"></uni-section>
			<uni-grid :column="4" :showBorder='false' :square="false" :highlight="false">
				<uni-grid-item v-for="(chilItem, chiilIndex) in baseinfo_icons" :index="chiilIndex" :key="chiilIndex">
					<view class="grid-item-box" @click="clickItem(chilItem)">
						<image :src="chilItem.icon" class="moreImg" mode="scaleToFill" />
						<text style="margin-top: 10px;font-size: 13px;color: #878787;" class="text">{{ chilItem.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
			<uni-section v-if="select_icons.length>0" title="住宿分配与查询" type="line"></uni-section>
			<uni-grid :column="4" :showBorder='false' :square="false" :highlight="false">
				<uni-grid-item v-for="(chilItem, chiilIndex) in select_icons" :index="chiilIndex" :key="chiilIndex">
					<view class="grid-item-box" @click="clickItem(chilItem)">
						<image :src="chilItem.icon" class="moreImg" mode="scaleToFill" />
						<text style="margin-top: 10px;font-size: 13px;color: #878787;" class="text">{{ chilItem.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
			<uni-section v-if="daily_icons.length>0" title="日常记录" type="line"></uni-section>
			<uni-grid :column="4" :showBorder='false' :square="false" :highlight="false">
				<uni-grid-item v-for="(chilItem, chiilIndex) in daily_icons" :index="chiilIndex" :key="chiilIndex">
					<view class="grid-item-box" @click="clickItem(chilItem)">
						<image :src="chilItem.icon" class="moreImg" mode="scaleToFill" />
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
				baseinfo_icons:[],
				select_icons:[],
				daily_icons:[]
			}
		},
		components: {
			mynavBar
		},
		methods: {
			clickItem:function(chilItem){
				util.openwithData(chilItem.pagePath,chilItem)
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
			this.navItem = util.getTabbarMenu();
			let list=this.navItem.childList
			let that =this
			setTimeout(function() {
				let list=that.navItem.childList
				list.map(function(item){
					if('schapp_Dorm_Info'==item.url){
						that.baseinfo_icons.push(item)
					}
					if('schapp_Dorm_Classes'==item.url||
						'schapp_Dorm_Select'==item.url||
						'schapp_Dorm_EmptyBed'==item.url||
						'schapp_Dorm_EmptyRoom'==item.url
						){
						that.select_icons.push(item)
					}
					if('schapp_Dorm_Calle'==item.url||
						'schapp_Dorm_Attendance'==item.url||
						'schapp_Dorm_Action'==item.url||
						'schapp_Dorm_Health'==item.url||
						'schapp_Dorm_Evaluation'==item.url
					){
						that.daily_icons.push(item)
					}
				})
			}, 100);
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
	::v-deep .uni-section{
		height: 35px;
		margin-top: 5px;
		background-color: #FFFFFF !important;
	}
</style>