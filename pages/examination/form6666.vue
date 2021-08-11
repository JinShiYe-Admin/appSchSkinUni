<!-- 成绩分析 -->
<template>
	<view>
		<scroll-view scroll-y="true" style="height: 1200px;">
			<view class="charts-box">
				<qiun-data-charts type="column" :chartData="chartData" /><!-- 柱状图-->
				<qiun-data-charts type="ring" :chartData="chartData2" background="none"/><!-- 饼图-->
				<qiun-data-charts type="demotype" :chartData="chartData3"  background="none"/> <!-- 折线图-->
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chartData: {
					categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
					series: [{name: "目标值",data: [150, 36, 31, 33, 13, 34]}]
				},
				chartData2:{
					series:[{"name":"一班","data":50},{"name":"二班","data":30},{"name":"三班","data":20},{"name":"四班","data":18},{"name":"五班","data":8}]
				},
				chartData3:{
					categories:["2012","2013","2014","2015","2016","2017"],
					series:[{"name":"成交量A","data":[35,8,25,37,4,20]},{"name":"成交量B","data":[70,40,65,100,44,68]},{"name":"成交量C","data":[100,80,95,150,112,132]}]
				}
			}
		},
		methods: {

		}
	}
</script>

<style>
	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>
