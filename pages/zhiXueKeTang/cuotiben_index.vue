<template>
	<view>
		<mynavBar :navItem='itemData' :personInfo='personInfo' :text="navRight" :textClick="textClick">
		</mynavBar>
		<view>
			<uni-popup ref="popup" background-color="#fff">
				<view class="popup-content" :class="{ 'popup-height': 'top' }">
					<view v-for="(tempPer, index) in per.list" :key='index'>
						<label class="perList" @click="selectItem(tempPer)" :style="{background:(tempPer.per_code==per.selected.per_code?'#00CFBD':'#ECECEC'),color:(tempPer.per_code==per.selected.per_code?'white':'')}">{{tempPer.per_name}}</label>
					</view>
				</view>
			</uni-popup>
		</view>
		<template v-if="pageArray.length>0">
			<uni-list>
				<uni-list-item v-for="(model,index) in pageArray" :key='index' direction='column' showArrow clickable
					@click="clickItem(model)">
					<view slot="body" style="min-height: 40px;">
						<view style="float: left;">
							<view style="font-size: 14px;color: gray;margin-top: 10px;">{{model.sub_name}}</view>
						</view>
						<view class="rightView">
							<view style="text-align: right;font-size: 13px;color: gray;margin-top: 10px;">{{model.count}}道错题
							</view>
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</template>
		<template v-else>
			<view class="title-text" style="text-align: center;margin-top: 15px;">
				暂无错题
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
				perSeleted: {},
				pageArray: [],
				per: {
					selected: {},
					list: []
				},
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
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
					this.getList();
				}
			},
			getList: function() {
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZXKT + "/mistake", {
					per_code: this.per.selected.per_code,
					index_code: this.itemData.access.split('#')[1],
					user_code: this.personInfo.user_code,
				}, (res0, res) => {
					this.hideLoading();
					if (res.code == 0) {
						this.pageArray = res.data.sub_mis_take_count;
					} else {
						this.showToast(res.msg);
					}
				});
			},
			clickItem(model) {
				console.log('clickItem:' + JSON.stringify(model));
				model.access = this.itemData.access;
				model.selectPer = this.per.selected;
				util.openwithData("/pages/zhiXueKeTang/cuotiben_detail", model);
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
		padding: 60px 0px 20px 0px;
		/* height: 50px; */
		background-color: #fff;
	}

	.perList {
		margin-left: 20px;
		border: 1px solid white;
		padding: 5px 20px;
		border-radius: 5px;
		font-size: 13px;
	}
</style>
