<template>
	<view>
		<mynavBar :navItem='itemData' :personInfo='personInfo' :text="navRight" :textClick="textClick"></mynavBar>
		<view>
			<uni-popup ref="popup" background-color="#fff">
				<view class="popup-content" :class="{ 'popup-height': 'top' }">
					<view class="popup-content-view" :key="tempPer.per_code+Math.random()" v-for="(tempPer, index) in per.list">
						<label class="perList" @click="selectItem(tempPer)" :style="{background:(tempPer.per_code==per.selected.per_code?'#00CFBD':'#ECECEC'),color:(tempPer.per_code==per.selected.per_code?'white':'')}">{{tempPer.per_name}}</label>
					</view>
				</view>
			</uni-popup>
		</view>
		<template v-if="pageArray.length>0">
			<uni-list>
				<uni-list-item v-for="(model,index) in pageArray" :key='index+"_"+Math.random()' direction='column' showArrow clickable
					@click="clickItem(model)">
					<view slot="body" style="min-height: 40px;">
						<view style="float: left;">
							<view style="font-size: 14px;color: gray;margin-top: 10px;">{{model.sub_name}}</view>
						</view>
						<view class="rightView">
							<view style="text-align: right;font-size: 13px;color: gray;margin-top: 10px;">已做{{model.count}}套题
							</view>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</template>
		<template v-else>
			<view class="title-text" style="text-align: center;margin-top: 15px;">
				暂无练习
			</view>
		</template>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				navRight: '',
				type: 'center',
				pageArray: [],
				per: {
					selected: {},
					list: []
				},
				showItem: false
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			this.itemData = util.getPageData(option);
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			// 获取学段
			this.getPer();
		},
		components: {
			mynavBar
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			if(this.per.selected.per_code){
				this.getList();
			}
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
		methods: {
			textClick() {
				console.log('textClick');
				this.type = 'top';
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open('top');
			},
			// 获取学段
			getPer: function() {
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZXKT + "/pub/resPer", {
					index_code: this.itemData.access.split('#')[1],
					user_code: this.personInfo.user_code,
				}, (res0, res) => {
					this.hideLoading();
					if (res.code == 0) {
						var firstPer = res.data.list[0];
						this.per = {
							selected: firstPer,
							list: res.data.list,
						}
						this.navRight = firstPer.per_name + '↓';
						this.showLoading();
						this.getList();
					} else {
						this.showToast(res.msg);
					}
				});
			},
			//选择选项
			selectItem(tempPer) {
				this.$refs.popup.close();
				if(tempPer.per_code!=this.per.selected.per_code){
					this.per.selected = tempPer;
					this.navRight = tempPer.per_name + '↓';
					this.showLoading();
					this.getList();
				}
			},
			getList: function() {
				this.post(this.globaData.INTERFACE_ZXKT + "/history", {
					per_code: this.per.selected.per_code,
					index_code: this.itemData.access.split('#')[1],
					user_code: this.personInfo.user_code,
				}, (res0, res) => {
					this.hideLoading();
					if (res.code == 0) {
						this.pageArray = res.data.sub_count;
					} else {
						this.showToast(res.msg);
					}
				});
			},
			clickItem(model) {
				model.percode=this.per.selected.per_code
				model.index_code=this.index_code
				util.openwithData("/pages/zhiXueKeTang/lishics_detail", model);
			}
		}
	}
</script>

<style>
	.popup-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		/* align-items: center; */
		/* justify-content: center; */
			/* #ifdef APP-PLUS */
				padding: 80px 0px 10px 0px;
			/* #endif */
			/* #ifdef H5 */
				padding: 50px 0px 10px 0px;
			/* #endif */
		/* height: 50px; */
		background-color: #fff;
			justify-content: flex-start;
			flex-wrap: wrap;
	}
	
	.popup-content-view{
			height: 48px;
			padding: 0 8px;
			display: flex;
			align-items: center;
	}
	
	.perList {
		border: 1px solid white;
		padding: 5px 20px;
		border-radius: 5px;
		font-size: 13px;
			height: 26px;
			display: flex;
			align-items: center;
	}
</style>
