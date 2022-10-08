<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view v-if="pageModel.title" style="margin: 10px 20px;">
			<view style="font-size: 18px;text-align: center;font-weight: 900;">{{pageModel.title}}</view>
			<view style="font-size: 14px;margin-top: 5px;">量化时段：{{pageModel.begintime}} ~ {{pageModel.endtime}}</view>
			<view style="font-size: 16px;font-weight: 900;margin-top: 10px;">量化得分</view>
			<view class="line"></view>
			<view style="font-size: 40px;font-weight: 600;margin-top: 10px;color: #bd3124;text-align: center;">
				{{pageModel.total_score}}<span style='font-size: 20px;color: #101010;'>/{{pageModel.grade}}</span>
			</view>
			<view style="font-size: 16px;font-weight: 900;margin-top: 10px;">量化得分趋势</view>
			<view class="line"></view>
			<view style="height: 10px;"></view>
			<view class="charts-box">
				<qiun-data-charts :opts="{dataLabel:false,dataPointShape:false,xAxis:{labelCount:10,rotateLabel:true,rotateAngle:60},yAxis:{data:[{tofix:1}]}}" type="demotype" :chartData="chartSxl" background="none" />
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
						<p class="scoreDetail"><span style='color: #bd3124;font-size: 16px;'>{{model.amount}}</span>{{model.scoreUnitTxt}}</p>
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
							<p class="scoreDetail"><span style='color: #bd3124;font-size: 16px;'>{{model.amount}}</span>{{model.scoreUnitTxt}}</p>
						</uni-col>
					</view>
				</uni-row>
			</view>
			
			<view style="font-size: 16px;font-weight: 900;margin-top: 10px;">量化详情</view>
			<view class="line"></view>
			<view style="font-size: 14px;">考勤</view>
			<view v-if="pageModel.tempAtt==0"
				style="font-size: 14px;text-align: center;">无</view>
			<view>
				<view v-for="(model,index) in pageModel.detail_array" :key="index" style="margin-top: 10px;">
					<view v-if="model.attendance_json.id">
						<uni-card isShadow :isFull="true" style="">
							<view class="content-box-text">
								<uni-row style="margin: 0px -10px 0 -10px;">
									<uni-col :span="9">
										<p class="scoreDetail">{{model.attendance_json.date}}</p>
									</uni-col>
									<uni-col :span="5">
										<p class="scoreDetail">星期{{model.attendance_json.dayOfWeek}}</p>
									</uni-col>
									<uni-col :span="5">
										<p class="scoreDetail">{{model.attendance_json.section}}</p>
									</uni-col>
									<uni-col :span="5">
										<p class="scoreDetail">{{model.attendance_json.sub_txt}}</p>
									</uni-col>
									<uni-col :span="12">
										<p class="scoreDetail" style='font-size: 18px;font-weight: 700;'>{{model.attendance_json.item_txt}}</p>
									</uni-col>
									<uni-col :span="12">
										<p class="scoreDetail" style='font-size: 17px;color: #bd3124;'>{{model.attendance_json.score}}</p>
									</uni-col>
								</uni-row>
								<view style="font-size: 14px;margin-top: 5px;word-break: break-all;">{{model.attendance_json.comment}}</view>
							</view>
						</uni-card>
					</view>
				</view>
			</view>
			
			<view style="font-size: 14px;margin-top: 20px;">行为</view>
			<view v-if="pageModel.tempBeh==0"
				style="font-size: 14px;text-align: center;">无</view>
			<view>
				<view v-for="(model,index) in pageModel.detail_array" :key="index" style="margin-top: 10px;">
					<view v-if="model.behavior_json.id">
						<uni-card isShadow :isFull="true" style="">
							<view class="content-box-text">
								<uni-row style="margin: 0px -10px 0 -10px;">
									<uni-col :span="9">
										<p class="scoreDetail">{{model.behavior_json.date}}</p>
									</uni-col>
									<uni-col :span="5">
										<p class="scoreDetail">星期{{model.behavior_json.dayOfWeek}}</p>
									</uni-col>
									<uni-col :span="5">
										<p class="scoreDetail">{{model.behavior_json.section}}</p>
									</uni-col>
									<uni-col :span="5">
										<p class="scoreDetail">{{model.behavior_json.sub_txt}}</p>
									</uni-col>
									<uni-col :span="12">
										<p class="scoreDetail" style='font-size: 18px;font-weight: 700;'>{{model.behavior_json.item_txt}}</p>
									</uni-col>
									<uni-col :span="12">
										<p class="scoreDetail" style='font-size: 17px;color: #bd3124;'>{{model.behavior_json.score}}</p>
									</uni-col>
								</uni-row>
								<view style="font-size: 14px;margin-top: 5px;word-break: break-all;">{{model.behavior_json.comment}}</view>
							</view>
						</uni-card>
					</view>
				</view>
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
				chartSxl:{},
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
			// 33.量化考评-查看学生考评详情
			this.getStudentReport();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			// 33.量化考评-查看学生考评详情
			getStudentReport() {
				var comData = {
					index_code: this.navItem.index_code,
					student_evaluation_id: this.navItem.evaluation_id, //
					id:this.navItem.id
				}
				this.showLoading();
				// 
				this.post(this.globaData.INTERFACE_LHKP + 'Evaluation/studentReport', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						data.data.tempAtt = 0;
						data.data.tempBeh = 0;
						for (var a = 0; a < data.data.detail_array.length; a++) {
							var tempM = data.data.detail_array[a];
							if (tempM.attendance_json.id&&tempM.attendance_json.id.length>0) {
								data.data.tempAtt++;
							}
							if (tempM.behavior_json.id&&tempM.behavior_json.id.length>0) {
								data.data.tempBeh++;
							}
						}
						console.log('data.data:'+JSON.stringify(data.data))
						this.pageModel = data.data;
						var tempArr0 = [];
						var tempArr1 = [];
						for (var a = 0; a < data.data.eval_score_array.length; a++) {
							var tempM = data.data.eval_score_array[a];
							tempArr0.push(tempM.date);
							tempArr1.push(tempM.score);
						}
						// 
						this.chartSxl = {
							categories: tempArr0,
							series: [{
								name: "得分",
								data: tempArr1
							}]
						}
					} else {
						this.showToast(data.msg);
					}
				});
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
