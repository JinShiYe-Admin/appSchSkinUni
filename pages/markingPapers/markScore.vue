<template>
	<view>

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
		methods: {
			clickSlider: function(index) {
				mui('#scroll2').scroll().scrollTo(0, 0);
				console.log('clickSlider:' + index);
				this.classIndex = index;
				this.nowClass = this.classList[index];
				// 获取当前班级对应的学生得分列表
				getNowStuScore();
			},
			clickLi: function(model) {
				console.log('clickLi.model:' + JSON.stringify(model));
				model.access = this.itemData.access;
				model.sub_name = this.itemData.sub_name;
				model.exam_date = this.itemData.exam_date;
				utils.mOpenWithData("../../html/markingPapers/stuMarkDetail.html", model);
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
				console.log('this.nowScoreList:'+JSON.stringify(this.nowScoreList));
			}
		}
	}
</script>

<style>

</style>
