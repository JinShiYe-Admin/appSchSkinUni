<template>
	<view class="tabs">
		<scroll-view id="tab-bar" class="scroll-h tabs-fixed" :scroll-x="true" :show-scrollbar="false"
			:scroll-into-view="scrollInto">
			<view v-for="(tab,index) in classList" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index"
				@click="ontabtap">
				<text class="uni-tab-item-title"
					:class="classIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.cls_name}}</text>
			</view>
		</scroll-view>
		<view class="">
			<p style="margin: 50px 0px 0px 20px;color: #505050;font-size: 14px;font-weight: bold;">
				成绩统计</p>
			<view style="height: 0.5px;background-color: #00cfbd;margin: 5px 28px 0px 15px;"></view>
			<uni-grid :column="2" :showBorder='false' :square="false" :highlight="false">
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">总人数：{{nowClass.stu_count}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">平均分：{{nowClass.avg_score}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">有成绩人数：{{nowClass.res_count}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">无成绩人数：{{nowClass.miss_stu_count}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">最高分：{{nowClass.max_score}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">最低分：{{nowClass.min_score}}</p>
					</view>
				</uni-grid-item>
			</uni-grid>
			<view style="height: 10px;background-color: #e5e5e5;margin: 5px 0px 0px 0px;"></view>
			<p style="margin: 5px 0px 0px 20px;color: #505050;font-size: 14px;font-weight: bold;">
				学生得分详情</p>
			<view style="height: 0.5px;background-color: #00cfbd;margin: 5px 28px 0px 15px;"></view>
			<uni-list>
				<uni-list-item showArrow clickable :key="index" v-for="(model,index) in nowScoreList" style="font-size: 14px;" @click="clickLi(model)">
					<view slot="body" class="">
						<uni-row>
							<view style="margin-left: 0px;">
								<span
									style="color: #505050;font-size: 14px;font-weight: bold;margin-left: 15px;">{{model.stu_name}}</span>
								<span style="color: #505050;font-size: 14px;margin-left: 30px;">{{model.sex}}</span>
								<span style="color: #505050;font-size: 14px;margin-left: 30px;">考号：{{model.sno}}</span>
							</view>
							<view style="margin-top: 5px;margin-left: 5px;">
								<span style="float: left;">
									<view
										style="width: 60px;height: 50px;border:1px solid #00aba1;text-align: center;vertical-align: middle;display: table-cell;color: #00aba1;font-size: 14px;">
										{{model.total_score}}
									</view>
									<view
										style="width: 62px;height: 20px;color: white;background-color: #00aba1;font-size: 12px;text-align: center;">
										总分</view>
								</span>
								<span style="float: left;margin-left: 10px;">
									<view
										style="width: 60px;height: 50px;border:1px solid #00aba1;text-align: center;vertical-align: middle;display: table-cell;color: #00aba1;font-size: 14px;">
										{{model.object_score}}
									</view>
									<view
										style="width: 62px;height: 20px;color: white;background-color: #00aba1;font-size: 12px;text-align: center;">
										客观题</view>
								</span>
								<span style="float: left;margin-left: 10px;">
									<view
										style="width: 60px;height: 50px;border:1px solid #00aba1;text-align: center;vertical-align: middle;display: table-cell;color: #00aba1;font-size: 14px;">
										{{model.subject_score}}
									</view>
									<view
										style="width: 62px;height: 20px;color: white;background-color: #00aba1;font-size: 12px;text-align: center;">
										主观题</view>
								</span>
								<span style="float: left;margin-left: 10px;">
									<view
										style="width: 60px;height: 50px;border:1px solid #00aba1;text-align: center;vertical-align: middle;display: table-cell;color: #00aba1;font-size: 14px;">
										{{model.cls_order}}
									</view>
									<view
										style="width: 62px;height: 20px;color: white;background-color: #00aba1;font-size: 12px;text-align: center;">
										班级排名</view>
								</span>
							</view>
						</uni-row>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				classIndex: 0, //选择班级的索引
				nowClass: {}, //当前选择的班级成绩统计
				classList: [], //班级列表
				nowScoreList: {}, //当前选择的班级学生得分列表
				scoreList: [], //学生得分列表
				scrollInto: '',
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: '成绩查看'
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//1.8.阅卷成绩统计
			this.getPageList();
		},
		onShow(){
					//#ifndef APP-PLUS
						document.title=""
					//#endif
				},
		methods: {
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				// this.switchTab(index);
				if (this.classIndex === index) {
					return;
				}
				this.classIndex = index;
				this.nowClass = this.classList[index];
				// 获取当前班级对应的学生得分列表
				this.getNowStuScore();
			},
			clickSlider: function(index) {
				// mui('#scroll2').scroll().scrollTo(0, 0);
				// console.log('clickSlider:' + index);
				this.classIndex = index;
				this.nowClass = this.classList[index];
				// 获取当前班级对应的学生得分列表
				this.getNowStuScore();
			},
			clickLi: function(model) {
				console.log('clickLi.model:' + JSON.stringify(model));
				model.access = this.itemData.access;
				model.sub_name = this.itemData.sub_name;
				model.exam_date = this.itemData.exam_date;
				util.openwithData("/pages/markingPapers/stuMarkDetail", model);
			},
			getPageList() {
				let comData = {
					index_code: this.itemData.access.split('#')[1],
					task_id: this.itemData.id, //任务id
				}
				this.showLoading();
				//1.8.阅卷成绩统计
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'taskResult/clsAnalysis', comData, data => {
					this.hideLoading();
					this.classList = [].concat(data.list);
					if (data.list && data.list.length > 0) {
						this.classIndex = 0;
						this.nowClass = this.classList[0];
					}
					//1.9.学生得分列表
					this.getScoreList();
				});
			},
			getScoreList() {
				let comData = {
					index_code: this.itemData.access.split('#')[1],
					task_id: this.itemData.id, //任务id
				}
				this.showLoading();
				//1.9.学生得分列表
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'taskResult/scoreList', comData, data => {
					this.hideLoading();
					this.scoreList = [].concat(data.list);
					// 获取当前班级对应的学生得分列表
					this.getNowStuScore();
				});
			},
			getNowStuScore() {
				var tempCls = this.classList[this.classIndex];
				this.nowScoreList = [];
				for (var a = 0; a < this.scoreList.length; a++) {
					var tempScore = this.scoreList[a];
					if (tempCls.cls_code == tempScore.cls_code) {
						this.nowScoreList.push(tempScore);
					}
				}
				console.log('this.nowScoreList:' + JSON.stringify(this.nowScoreList));
			}
		}
	}
</script>

<style>
	.tabs {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: white;
	}

	.scroll-h {
		width: 375px;
		width: 100%;
		height: 40px;
		background-color: #F0F0F0;
		flex-direction: row;
		white-space: nowrap;

	}

	.uni-tab-item {
		display: inline-block;
		flex-wrap: nowrap;
		padding-left: 17px;
		padding-right: 17px;
	}

	.uni-tab-item-title {
		color: #555;
		font-size: 15px;
		height: 40px;
		line-height: 40px;
		flex-wrap: nowrap;
		white-space: nowrap;
	}

	.uni-tab-item-title-active {
		color: #00CFBD;
	}

	.leaveSum {
		margin-top: 10px;
		margin-left: 20px;
		margin-bottom: 0px;
		font-size: 14px;
		color: #505050;
	}
	.uni-list::before {
	    height: 0px !important;
	}
	.uni-list--border-top {
	    height: 0px !important;
	}
</style>
