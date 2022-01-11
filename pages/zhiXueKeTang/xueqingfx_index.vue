<template>
	<view>
		<mynavBar :navItem='itemData' :personInfo='personInfo' :text="navRight" :textClick="textClick">
		</mynavBar>
		<view>
			<uni-popup ref="popup" background-color="#fff">
				<view class="popup-content" :class="{ 'popup-height': 'top' }">
					<view class="popup-content-view" v-for="(tempPer, index) in per.list" :key='index'>
						<label class="perList" @click="selectItem(tempPer)" :style="{background:(tempPer.per_code==per.selected.per_code?'#00CFBD':'#ECECEC'),color:(tempPer.per_code==per.selected.per_code?'white':'')}">{{tempPer.per_name}}</label>
					</view>
				</view>
			</uni-popup>
		</view>
		<view style="text-align: center;margin: 10px;font-size: 14px;">{{user_name}}学情分析报告<span v-if="pername">（{{pername}}）</span></view>
		<view style="height: 1px;background: #DDDDDD;margin: 0 10px;"></view>
		<view style="margin: 10px 0 5px 10px;font-size: 13px;" v-cloak>学科均衡:</view>
		<view class="charts-box">
		  <qiun-data-charts type="radar" :opts="{legend:{position: 'bottom'},extra:{radar:{gridType:'circle',max:100}}}" :chartData="xuekejunhengData"/>
		</view>
		<uni-list>
			<uni-list-item direction='column'>
				<view slot="body">
					<view class="rightView">
						<uni-row style="font-size: 13px;text-align: center;min-height: 35px;padding-top: 10px;">
							<uni-col :span="9">
								科目
							</uni-col>
							<uni-col :span="6">
								学习次数
							</uni-col>
							<uni-col :span="7">
								平均分/满分
							</uni-col>
							<uni-col :span="2">
								
							</uni-col>
						</uni-row>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<uni-list style="margin-top: -1px;">
			<uni-list-item v-for="(item,index) in pageArray" :key='index' direction='column' showArrow clickable
				@click="clickItem(item)">
				<view slot="body">
					<uni-row style="font-size: 13px;text-align: center;min-height: 35px;padding-top: 10px;">
						<uni-col :span="10">
							<span class="label" v-if="item.remark==1">优势</span>
							<span class="label bad" v-if="item.remark==-1">劣势</span>
							{{item.subname}}
						</uni-col>
						<uni-col :span="7">
							{{item.count}}
						</uni-col>
						<uni-col :span="7">
							{{item.avg_score}}分/100分
						</uni-col>
					</uni-row>
				</view>
			</uni-list-item>
		</uni-list>
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
				user_name: "",
				pername: "",
				per: {
					selected: {},
					list: []
				},
				xuekejunhengData:{}
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			this.itemData = util.getPageData(option);
			this.itemData.index = 100
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			// 获取学段
			this.getPer();
		},
		onShow(){
					//#ifndef APP-PLUS
						document.title=""
					//#endif
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
					per_code: this.per.selected.per_code,
				}, (res0, res) => {
					this.hideLoading();
					if (res.code == 0) {
						var firstPer = res.data.list[0];
						this.per = {
							selected: firstPer,
							list: res.data.list,
						}
						this.navRight = firstPer.per_name + '↓';
						this.getAnalysisData();
					} else {
						this.showToast(res.msg);
					}
				});
			},
			//获取分析数据
			selectItem(tempPer) {
				this.$refs.popup.close();
				if(tempPer.per_code!=this.per.selected.per_code){
					this.per.selected = tempPer;
					this.navRight = tempPer.per_name + '↓';
					this.getAnalysisData();
				}
			},
			getAnalysisData: function() {
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZXKT + "/analysis", {
					per_code: this.per.selected.per_code,
					index_code: this.itemData.access.split('#')[1],
					user_code: this.personInfo.user_code,
				}, (res0, res) => {
					this.hideLoading();
					if (res.code == 0) {
						this.pageArray = res.data.analysis;
						this.pername = this.perSeleted?this.perSeleted.pername:"";
						var tempArray0 = [];
						var tempArray1 = [];
						for (var i = 0; i < res.data.analysis.length; i++) {
							var tempM = res.data.analysis[i];
							tempArray0.push(tempM.subname);
							tempArray1.push(tempM.avg_score);
						}
						this.xuekejunhengData = {"categories":tempArray0,"series":[{"name":"科目","data":tempArray1}]};
					} else {
						this.showToast(res.msg);
					}
				});
			},
			clickItem(model) {
				console.log('clickItem:' + JSON.stringify(model));
				model.access = this.itemData.access;
				model.percode = this.per.selected.per_code;
				util.openwithData("/pages/zhiXueKeTang/xueqingfx_detail", model);
			}
		}
	}
</script>

<style>
	.label {
		border: 2px solid #25AE38;
		color: #25AE38;
		border-radius: 5px;
		font-size: 5px !important;
		padding: 0px 5px;
		margin-right: 5px;
	}
	.bad {
		color: #DB4848;
		border-color: #DB4848;
	}
	
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
