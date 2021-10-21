<template>
	<view>
		<view style="text-align: center;margin: 10px;font-size: 14px;">历次练习得分曲线</view>
		<view v-if="chartDefen.series&&chartDefen.series.length>0" class="charts-box">
			<qiun-data-charts type="demotype" :opts="{dataLabel:false}" :chartData="chartDefen" background="none" />
		</view>
		<view style="text-align: center;margin: 10px;font-size: 14px;">薄弱知识点</view>
		<uni-list style="margin-top: -1px;">
			<uni-list-item v-for="(item,index) in failCatalogInfo" :key='index' direction='column'>
				<view slot="body">
					<uni-row style="font-size: 13px;text-align: center;min-height: 35px;padding-top: 10px;">
						<uni-col :span="8" style="text-align: left;">
							{{item.name}}
						</uni-col>
						<uni-col :span="8">
							均分：{{Math.round(item.avg_score)}}
						</uni-col>
						<uni-col :span="8">
							<span style='color: white;background: #00CFBD;padding: 3px 10px;border-radius: 3px;font-size: 12px;' @click="clickItem(item)">练习</span>
						</uni-col>
					</uni-row>
				</view>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				subname: "",
				subScores: [],
				avgScore: "",
				failCatalogInfo: [],
				chartDefen: {}
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.subname+'科目 学情分析'
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			// 
			this.getSubDetail();
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
			// 
			getSubDetail: function() {
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZXKT + "/analysis/subDetail", {
					sub_code: this.itemData.subcode,
					per_code: this.itemData.percode||"",
					index_code: this.itemData.access.split('#')[1],
					user_code: this.personInfo.user_code,
				}, (res0, res) => {
					this.hideLoading();
					if (res.code == 0) {
						this.subScores = res.data.sub_scores;
						this.avgScore = res.data.avg_score;
						this.failCatalogInfo = res.data.fail_catalog_info;
						// 
						var tempNameArray = [];
						var tempM0 = {'name':'平均分','data':[]};
						var tempM1 = {'name':'考试分值','data':[]};
						for (var a = 0; a < res.data.sub_scores.length; a++) {
							var tempM = res.data.sub_scores[a];
							tempNameArray.push('');
							tempM0.data.push(res.data.avg_score);
							tempM1.data.push(tempM);
						}
						this.chartDefen = {
							categories: tempNameArray,
							series: [tempM0,tempM1]
						}
					} else {
						this.showToast(res.msg);
					}
				});
			},
			clickItem(model) {
				console.log('clickItem:' + JSON.stringify(model));
				model.access = this.itemData.access;
				model.catalog_id = model.book_catalog_id;
				model.title = model.name;
				util.openwithData("/pages/zhiXueKeTang/zujuancs_testing", model);
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
</style>
