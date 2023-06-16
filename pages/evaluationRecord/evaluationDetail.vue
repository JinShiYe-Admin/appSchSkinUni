<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view v-if="pageModel.title" style="margin: 10px 20px;">
			<view style="font-size: 18px;text-align: center;font-weight: 900;">{{pageModel.title}}</view>
			<view style="font-size: 14px;margin-top: 5px;">量化时段：{{pageModel.begintime}} ~ {{pageModel.endtime}}</view>
			<view style="font-size: 16px;font-weight: 900;margin-top: 10px;">班级行为量化统计</view>
			<p @click='gotoClsDetail()' class='otherEdit'>班级分析</p>
			<view class="line"></view>
			<view style="font-size: 14px;font-weight: 600;margin-top: 10px;">班级量化均分</view>
			<view style="font-size: 40px;font-weight: 600;margin-top: 10px;color: #bd3124;text-align: center;">{{pageModel.avg_score}}<span style='font-size: 20px;color: #101010;'>/{{pageModel.avg_grade}}</span></view>
			<uni-row style="margin-top: 10px;">
				<uni-col :span="12">
					<p style='font-size: 14px;text-align: center;'>最高：{{pageModel.max_score}}</p>
				</uni-col>
				<uni-col style="" :span="12">
					<p style='font-size: 14px;text-align: center;'>最低：{{pageModel.min_score}}</p>
				</uni-col>
			</uni-row>
			<view style="font-size: 14px;font-weight: 600;margin-top: 10px;">等级信息</view>
			<qiun-data-charts style="height: 200px;" type="ring" :animation="false"
				:chartData="chartData" background="none" />
			
			<view style="font-size: 16px;font-weight: 900;margin-top: 10px;">学生量化成绩</view>
			<view class="line"></view>
			<uni-row style="margin: 0px -10px 0 -10px;">
				<uni-col style="" :span="9">
					<p class="scoreDetail" style='font-size: 15px;font-weight: 600;'>学生</p>
				</uni-col>
				<uni-col style="" :span="6">
					<p class="scoreDetail" style='font-size: 15px;font-weight: 600;'>得分</p>
				</uni-col>
				<uni-col style="" :span="6">
					<p class="scoreDetail" style='font-size: 15px;font-weight: 600;'>等级</p>
				</uni-col>
				<uni-col style="" :span="3">
					<p class="scoreDetail"> </p>
				</uni-col>
			</uni-row>
			<uni-row v-for="(model,index) in pageModel.ser_array" :key="index" style="margin: 0px -10px 0 -10px;" :style="{background:(index%2==0?'#EDFCE9':'white')}">
				<view @click="gotoStuDetail(model)">
					<uni-col style="" :span="9">
						<p class="scoreDetail">{{model.stu_name}}</p>
					</uni-col>
					<uni-col style="" :span="6">
						<p class="scoreDetail">{{model.total_score}}</p>
					</uni-col>
					<uni-col style="" :span="6">
						<p class="scoreDetail">{{model.evaluation_grade}}</p>
					</uni-col>
					<uni-col style="margin-top: 5px;" :span="3">
						<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
							size="20">
						</uni-icons>
					</uni-col>
				</view>
			</uni-row>
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
				pageModel:{},
				chartData:{}
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
			// 29.量化考评-查看班级报表
			this.getClassReport();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			gotoClsDetail(){
				util.openwithData('/pages/evaluationRecord/clsDetail', this.navItem);
			},
			gotoStuDetail(model){
				model.index_code = this.navItem.index_code;
				util.openwithData('/pages/evaluationRecord/stuDetail', model);
			},
			// 29.量化考评-查看班级报表
			getClassReport() {
				var comData = {
					index_code: this.navItem.index_code,
					student_evaluation_id: this.navItem.id //
				}
				this.showLoading();
				// 
				this.post(this.globaData.INTERFACE_LHKP + 'Evaluation/classReport', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pageModel = data.data;
						//解析list 形成图表
						let valueList = [];
						let sum = 0;
						data.data.grade_array.map(function(item) {
							sum = sum + item.value;
						})
						data.data.grade_array.map(function(item) {
							let name = '';
							var tempA = 0;
							if (sum != 0) {
								tempA = parseFloat(parseFloat(item.value/sum).toFixed(4));
							}
							let obj = {
								// data:parseFloat(item.value/sum).toFixed(4),
								data:tempA,
								name:item.name+'人数：'+item.value
							};
							valueList.push(obj);
						})
						let tempdata = {
							series: valueList
						}
						this.chartData = tempdata;
					} else {
						this.showToast(data.msg);
					}
				});
			},
		}
	}
</script>

<style>
	.line {
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0px;
	}
	
	.otherEdit {
		margin-top: -20px;
		text-align: right;
		font-size: 14px;
		color: #00CFBD;
	}
	
	.scoreDetail {
		font-size: 14px;
		text-align: center;
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>
