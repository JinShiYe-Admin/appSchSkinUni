<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view v-if="pageModel.title" style="margin: 10px 20px;">
			<view style="font-size: 18px;text-align: center;font-weight: 900;">{{pageModel.title}}</view>
			<view style="font-size: 14px;margin-top: 5px;">量化时段：{{pageModel.begintime}} ~ {{pageModel.endtime}}</view>
			<view style="font-size: 16px;font-weight: 900;margin-top: 10px;">班级行为量化统计</view>
			<view class="line"></view>
			<view style="font-size: 14px;font-weight: 600;margin-top: 10px;">班级量化均分</view>
			<view style="font-size: 40px;font-weight: 600;margin-top: 10px;color: #bd3124;text-align: center;">
				{{pageModel.avg_score}}<span style='font-size: 20px;color: #101010;'>/{{pageModel.avg_grade}}</span>
			</view>
			<view style="font-size: 16px;font-weight: 900;margin-top: 10px;">量化考评得分分析</view>
			<view class="line"></view>
			<view style="font-size: 14px;">扣分项</view>
			<view v-if="pageModel.sub_array&&pageModel.sub_array.length==0" style="font-size: 14px;text-align: center;">
				无</view>
			<view>
				<uni-row v-for="(model,index) in pageModel.sub_array" :key="index" style="margin: 0px -10px 0 -10px;">
					<uni-col :span="12">
						<p class="scoreDetail">{{model.name}}</p>
					</uni-col>
					<uni-col :span="12">
						<p class="scoreDetail"><span
								style='color: #bd3124;font-size: 16px;'>{{model.amount}}</span>{{model.scoreUnitTxt}}
						</p>
					</uni-col>
				</uni-row>
			</view>
			<view style="font-size: 14px;margin-top: 10px;">加分项</view>
			<view v-if="pageModel.plus_array&&pageModel.plus_array.length==0"
				style="font-size: 14px;text-align: center;">无</view>
			<view>
				<uni-row v-for="(model,index) in pageModel.plus_array" :key="index" style="margin: 0px -10px 0 -10px;">
					<view>
						<uni-col :span="12">
							<p class="scoreDetail">{{model.name}}</p>
						</uni-col>
						<uni-col :span="12">
							<p class="scoreDetail"><span
									style='color: #bd3124;font-size: 16px;'>{{model.amount}}</span>{{model.scoreUnitTxt}}
							</p>
						</uni-col>
					</view>
				</uni-row>
			</view>
			<view style="font-size: 16px;font-weight: 900;margin-top: 10px;">重点考勤和行为考评趋势</view>
			<view class="line"></view>
			<view style="height: 10px;"></view>
			<my-swiperPage ref='swiperPageIndex' :allValue="pageModel.mark_item_array" :showIndex="false"
				@swiperPagechange='changeSwiper'>
			</my-swiperPage>
			<view class="charts-box">
				<qiun-data-charts
					:opts="{dataLabel:false,dataPointShape:false,xAxis:{labelCount:10,rotateLabel:true,rotateAngle:60},yAxis:{data:[{tofix:1}]}}"
					type="demotype" :chartData="chartSxl" background="none" />
			</view>
			<view style="height: 10px;"></view>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				pageModel: {},
				// chartData: {},
				chartSxl: {},
				markIndex: 0,
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
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.navItem.text = '量化考评';
			this.navItem.name = '量化考评';
			this.navItem.index = 100;
			//#ifdef H5
			document.title = "";
			//#endif
			// 31.量化考评-查看班级分析
			this.getClassAnalysis();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			changeSwiper(e) {
				console.log('changeSwiperchangeSwiper:' + e.index);
				if (this.markIndex != e.index) {
					this.markIndex = e.index;
					this.setCharSxl();
				}
			},
			// 31.量化考评-查看班级分析
			getClassAnalysis() {
				var comData = {
					index_code: this.navItem.index_code,
					student_evaluation_id: this.navItem.id //
				}
				this.showLoading();
				// 
				this.post(this.globaData.INTERFACE_LHKP + 'Evaluation/classAnalysis', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pageModel = data.data;
						this.markIndex = 0;
						this.setCharSxl();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			setCharSxl() {
				var tempArr0 = [];
				var tempArr1 = [];

				var tempM0 = this.pageModel.mark_item_array[this.markIndex];
				for (var i = 0; i < this.pageModel.mark_data_array.length; i++) {
					var tempM1 = this.pageModel.mark_data_array[i];
					if (tempM0.value == tempM1.text) {
						for (var a = 0; a < tempM1.value.length; a++) {
							var tempM = tempM1.value[a];
							tempArr0.push(tempM.date);
							tempArr1.push(tempM.count);
						}
					}
				}
				if (tempArr0.length == 0) {
					for (var i = 0; i < this.pageModel.mark_empty_data_array.length; i++) {
						var tempM1 = this.pageModel.mark_empty_data_array[i];
						tempArr0.push(tempM1.date);
						tempArr1.push(tempM1.count);
					}
				}

				this.chartSxl = {
					categories: tempArr0,
					series: [{
						name: "次数",
						data: tempArr1
					}]
				}
			}
		}
	}
</script>

<style>
	.line {
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0px;
	}

	.scoreDetail {
		font-size: 14px;
		text-align: center;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>
