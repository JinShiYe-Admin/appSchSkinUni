<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view style="padding: 15px;">
			<uni-row>
				<uni-col :span="12">
					<view  class="action-button" :class="[controlIndex==0?'action-current':'']" @click="controlClick(0)">
						<image src="../../static/images/schapp_examination/pjf.png" style="width: 30px;height: 30px;"></image>
						<view class="distraction-t">平均分:1175</view>
					</view>
				</uni-col>
				<uni-col :span="12">
					<view  class="action-button" :class="[controlIndex==1?'action-current':'']" @click="controlClick(1)">
						<image src="../../static/images/schapp_examination/zfd.png" style="width: 30px;height: 30px;"></image>
						<view class="distraction-t">主分段:[700,750]</view>
					</view>
				</uni-col>
				<uni-col :span="12">
					<view  class="action-button" :class="[controlIndex==2?'action-current':'']" @click="controlClick(2)">
						<image src="../../static/images/schapp_examination/zgf.png" style="width: 30px;height: 30px;"></image>
						<view class="distraction-t">最高分:1200</view>
					</view>
				</uni-col>
				<uni-col :span="12">
					<view  class="action-button" :class="[controlIndex==3?'action-current':'']" @click="controlClick(3)">
						<image src="../../static/images/schapp_examination/sxl.png" style="width: 30px;height: 30px;"></image>
						<view class="distraction-t">985线:0%</view>
					</view>
				</uni-col>
				<uni-col :span="12">
					<view  class="action-button" :class="[controlIndex==4?'action-current':'']" @click="controlClick(4)">
						<image src="../../static/images/schapp_examination/jtb.png" style="width: 30px;height: 30px;"></image>
						<view class="distraction-t">进退比:4:0</view>
					</view>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col>
					<view class="description">
						<view class="des-detail">
							本次考试咋地在的本次考试咋地在的本次考试咋地在的本次考
						</view>
					</view>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col>
					<view class="echarts-div">
						<h4 v-if="controlIndex===0" style="text-align: center;color: #6d6d6d;">—— 各班级均分统计 ——</h4>
						
						
						<qiun-data-charts v-if="controlIndex===0" type="column" :chartData="chartData" @getIndex="getIndexZ"/><!-- 柱状图-->
						<qiun-data-charts v-if="controlIndex===1" type="ring" :chartData="chartData2" background="none" @getIndex="getIndex"/><!-- 饼图-->
						<qiun-data-charts v-if="controlIndex===2" type="demotype" :chartData="chartData3"  background="none" /> <!-- 折线图-->
						
						
						<view v-if="controlIndex===0" class="tl-bottom">点击圆柱查看对应班级学生成绩详情</view>
					</view>
				</uni-col>
			</uni-row>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				
				controlIndex:0,
				chartData: {
					categories: ["2016", "2017", "2018", "2019", "2020", "2021",],
					series: [{name: "平均分",data: [150, 36, 331, 233, 13, 34]}]
				},
				chartData2:{
					series:[{"name":"985线 50.68% 66666人","data":50},{"name":"二班","data":30},{"name":"三班","data":20},{"name":"四班","data":18},{"name":"五班","data":8}]
				},
				chartData3:{
					categories:["2012","2013","2014","2015","2016","2017"],
					series:[{"name":"成交量A","data":[35,8,25,37,4,20]},{"name":"成交量B","data":[70,40,65,100,44,68]},{"name":"成交量C","data":[100,80,95,150,112,132]}]
				}
			}
		},
		methods: {
			controlClick(type){
				if(this.controlIndex!==type){
					this.controlIndex=type
				}
			},
			getIndexZ(e){
			  console.log(e.currentIndex.index);
			},
			getIndex(e){
			  console.log(JSON.stringify(e.opts.series[e.currentIndex]));
			},

		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='详情'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				// this.showLoading()
				// this.getLeaveDetail()
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>
	.action-button{
		margin: 5px;
		height: 45px;
		padding: 5px 0 5px 5px;
		display: flex;
		align-items: center;
		border: 1px solid #D6D9DA;
		border-radius: 15px;
		
	}
	.charts-box {
		width: 100%;
		height: 300px;
	}
	.distraction-t{
		flex: 1;
		text-align: center;
		font-size: 14px;
	}
	.action-current{
		background-color: #D8ECF3;
	}
	
	.description {
		margin: 0.3125rem -15px 0;
		min-height: 3rem;
		border-radius: 1.3375rem;
		background-color: rgba(216, 236, 243, 1);
	}
	
	.des-detail {
		padding: 0.3125rem 0.9375rem;
		font-size: 0.9375rem;
		min-height: 3rem;
		margin: auto;
		width: 80%;
		background-color: #FFFFFF;
		border-bottom: 0.1875rem solid rgba(0, 153, 204, 1);
	}
	.echarts-div {
		box-shadow: 0rem 0rem 0.42rem 0rem rgba(0, 0, 0, 0.5);
		margin: 0.5rem -15px 0;
		padding-top: 0.625rem;
	}
	.tl-bottom{
		font-size: 13px;
		color: #C33531;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
</style>
