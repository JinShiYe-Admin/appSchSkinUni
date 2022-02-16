<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' :text="showLook"
			:textClick="textClick"></mynavBar>
		<view>
			<!-- <p style="margin: 5px 0px 0px 20px;color: #505050;font-size: 14px;font-weight: bold;">考生信息</p>
			<view style="height: 0.5px;background-color: #00cfbd;margin: 5px 28px 0px 15px;"></view> -->
			<view class="card-title">{{stuDetailModel.name}}</view>
			<view style="text-align: right;margin: 10px 20px 0 0;" class="nameContent">{{stuDetailModel.create_time.split(' ')[0]}}</view>
			<view class="card-line"></view>
			<uni-row class="">
				<uni-col :span="16" style="font-size: 14px;">
					<view class="nameTime">学生：<span class='nameContent'>{{stuDetailModel.stu_name}}</span>
					</view>
					<view class="nameTime">考号：<span class='nameContent'>{{stuDetailModel.sno}}</span>
					</view>
					<view class="nameTime">客观题：<span class='nameContent'>{{stuDetailModel.object_score}}</span>
					</view>
					<view class="nameTime">主观题：<span class='nameContent'>{{stuDetailModel.subject_score}}</span>
					</view>
				</uni-col>
				<uni-col :span="8">
					<view class="charts-box" style="width: 100px;height: 100px;text-align: center;margin-top: 10px;">
						<qiun-data-charts type="arcbar" :opts="zhishidianShow"
							:animation="false" :chartData="zhishidianDFL" />
					</view>
				</uni-col>
			</uni-row>
			<!-- <view style="height: 10px;background-color: #e5e5e5;margin: 10px 0px 0px 0px;"></view> -->
			<view class="card-line" style="margin: 10px 0;"></view>
			<uni-row style="margin: 5px 10px 0 10px;background-color: #00aba1;border-radius: 10px;height: 40px;">
				<uni-col style="" :span="4">
					<p class="scoreDetail">题号</p>
				</uni-col>
				<uni-col style="" :span="8">
					<p class="scoreDetail">题型</p>
				</uni-col>
				<uni-col style="" :span="8">
					<p class="scoreDetail">识别选项</p>
				</uni-col>
				<uni-col style="" :span="4">
					<p class="scoreDetail">得分</p>
				</uni-col>
			</uni-row>
			<uni-row v-for="(model,index) in stuResultList" :key="index" style="margin: 5px 10px 0 10px;">
				<uni-col :span="4" style="height: 30px;">
					<view class="stuScoreDetail">{{model.question_number}}</view>
				</uni-col>
				<uni-col :span="8">
					<view class="stuScoreDetail">{{model.question_title_name}}</view>
				</uni-col>
				<uni-col :span="8">
					<view v-if="model.stu_answer_list&&model.stu_answer_list.length>0" class="stuScoreDetail">
						{{model.stu_answer_list.join(',')}}
					</view>
					<view v-else="" class="stuScoreDetail">--</view>
				</uni-col>
				<uni-col :span="4">
					<view class="stuScoreDetail">{{model.stu_score}}</view>
				</uni-col>
				<view class="card-line" style="margin: 30px 5px 0 5px;"></view>
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
				personInfo: {},
				itemData: {},
				showLook: '',
				stuDetailModel: {}, //学生考试详情
				stuResultList: [], //学生答题详情列表
				result_file_list: [],
				zhishidianShow:{},
				zhishidianDFL:{}
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.text = '成绩详情';
			this.itemData.index = 100;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: '成绩详情'
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			this.stuDetailModel = this.itemData;
			//1.10.根据id获取学生考试详情
			this.getPageDataArray();
			//1.11.获取学生每题答题详情
			this.getResultDetail();
		},
		onShow(){
					//#ifndef APP-PLUS
						document.title=""
					//#endif
				},
		methods: {
			textClick() {
				console.log('textClicktextClick');
				let tempArray = [];
				for (var i = 0; i < this.result_file_list.length; i++) {
					let tempM = this.result_file_list[i];
					tempArray.push(tempM.merge_file_path);
				}
				uni.previewImage({
					urls: tempArray,
				});
			},
			getPageDataArray() {
				let comData = {
					index_code: this.itemData.access.split('#')[1],
					id: this.itemData.id, //
				}
				// this.showLoading();
				//1.10.根据id获取学生考试详情
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'taskResult/getById', comData, (data0, data) => {
					// this.hideLoading();
					if (data.code == 0) {
						this.result_file_list = data.data.result_file_list;
						this.stuDetailModel.object_score = data.data.object_score;
						this.stuDetailModel.subject_score = data.data.subject_score;
						this.stuDetailModel.sno = data.data.sno;
						if (data.data.result_file_list && data.data.result_file_list.length > 0) {
							this.showLook = '查看批阅';
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getResultDetail() {
				let comData = {
					index_code: this.itemData.access.split('#')[1],
					result_id: this.itemData.id, //
				}
				// this.showLoading();
				//1.11.获取学生每题答题详情
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'taskResultDetail', comData, (data0, data) => {
					// this.hideLoading();
					if (data.code == 0) {
						this.stuResultList = [].concat(data.data.list);
						var tempSum = 0;
						var tempStu = 0;
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							tempSum = tempSum + parseFloat(tempM.complete_score);
							tempStu = tempStu + parseFloat(tempM.stu_score);
						}
						this.zhishidianDFL = {
							"series": [{
								"name": "成绩",
								"data": parseFloat(tempStu/tempSum).toFixed(1),
								"color": "#00CFBD"
							}]
						};
						this.zhishidianShow = {
							title: {
								name: parseFloat(tempStu).toFixed(1),
								fontSize: 15,
								color: '#00CFBD'
							},
							subtitle: {
								name: '成绩',
								color: '#666666',
								fontSize: 11
							},
							extra: {
								arcbar: {
									width: '5',
									type: "circle",
									startAngle: 0.5,
									endAngle: 0.5,
								}
							}
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
	.tabs {
		width: 100vw;
		position: fixed;
		background-color: #FFFFFF;
		padding: 3px 3px 0;
		z-index: 10;
		/* #ifndef APP-PLUS */
		top: 44px;
		/* #endif */
		/* #ifdef APP-PLUS */
		right: 3px;
		/* #endif */
	}

	.leaveSum {
		margin-top: 10px;
		margin-left: 20px;
		margin-bottom: 0px;
		font-size: 14px;
		color: #505050;
	}

	.scoreDetail {
		font-size: 14px;
		color: white;
		text-align: center;
		margin-top: 10px;
	}

	.stuScoreDetail {
		font-size: 14px;
		color: #505050;
		text-align: center;
		/* background-color: #e5e5e5;
		border-radius: 5px;
		margin-left: 2px;
		margin-right: 2px; */
	}
	
	.nameTime {
		font-size: 13px;
		margin: 10px 0 0 20px;
	}
	
	.nameContent {
		color: gray;
		font-size: 13px;
	}
	
	.card-line {
		height: 1px;
		background-color: #e5e5e5;
		margin-top: 5px;
		margin-bottom: 5px;
	}
	.card-title {
		font-size: 15px;
		text-align: center;
		margin-top: 8px;
	}
</style>
