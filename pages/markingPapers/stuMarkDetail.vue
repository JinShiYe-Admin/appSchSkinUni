<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="showLook" :textClick="textClick">
		</mynavBar>
		<view>
			<p style="margin: 5px 0px 0px 20px;color: #505050;font-size: 14px;font-weight: bold;">考生信息</p>
			<view style="height: 0.5px;background-color: #00cfbd;margin: 5px 28px 0px 15px;"></view>
			<uni-grid :column="2" :showBorder='false' :square="false" :highlight="false">
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">姓名：{{stuDetailModel.stu_name}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">考号：{{stuDetailModel.sno}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">班级：{{stuDetailModel.cls_name}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">科目：{{stuDetailModel.sub_name}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">总分：{{stuDetailModel.total_score}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">客观题得分：{{stuDetailModel.object_score}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">主观题得分：{{stuDetailModel.subject_score}}</p>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-item-box">
						<p class="leaveSum">考试日期：{{stuDetailModel.exam_date}}</p>
					</view>
				</uni-grid-item>
			</uni-grid>
			<view style="height: 10px;background-color: #e5e5e5;margin: 5px 0px 0px 0px;"></view>
			<p style="margin: 5px 0px 0px 20px;color: #505050;font-size: 14px;font-weight: bold;">得分详情</p>
			<view style="height: 0.5px;background-color: #00cfbd;margin: 5px 28px 0px 15px;"></view>
			<view style="margin: 10px 20px 0px 20px;"></view>
			<uni-row style="margin: 5px 10px 0 10px;background-color: #00aba1;border-radius: 10px;height: 40px;">
				<uni-col style="" :span="4">
					<p class="scoreDetail">题号</p>
				</uni-col>
				<uni-col style="" :span="6">
					<p class="scoreDetail">标准答案</p>
				</uni-col>
				<uni-col style="" :span="4">
					<p class="scoreDetail">满分</p>
				</uni-col>
				<uni-col style="" :span="6">
					<p class="scoreDetail">学生答案</p>
				</uni-col>
				<uni-col style="" :span="4">
					<p class="scoreDetail">得分</p>
				</uni-col>
			</uni-row>
			<uni-row v-for="(model,index) in stuResultList" :key="index" style="margin: 5px 10px 0 10px;">
				<uni-col :span="4" style="height: 30px;">
					<view class="stuScoreDetail">{{model.question_number}}</view>
				</uni-col>
				<uni-col :span="6">
					<view v-if="model.answer_list" style="background-color: #c6c6c6;" class="stuScoreDetail">
						{{model.answer_list.join(',')}}
					</view>
					<view v-else="" style="background-color: #c6c6c6;" class="stuScoreDetail">无</view>
				</uni-col>
				<uni-col :span="4">
					<view class="stuScoreDetail">{{model.complete_score}}</view>
				</uni-col>
				<uni-col :span="6">
					<view v-if="model.stu_answer_list&&model.stu_answer_list.length>0"
						style="background-color: #c6c6c6;" class="stuScoreDetail">
						{{model.stu_answer_list.join(',')}}
					</view>
					<view v-else="" style="background-color: #c6c6c6;" class="stuScoreDetail">无</view>
				</uni-col>
				<uni-col :span="4">
					<view class="stuScoreDetail">{{model.stu_score}}</view>
				</uni-col>
			</uni-row>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				showLook: '',
				stuDetailModel: {}, //学生考试详情
				stuResultList: [], //学生答题详情列表
				result_file_list: [],
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
			this.navItem.text = '成绩详情';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '成绩详情'
			});
			//#ifdef H5
			document.title = ""
			//#endif
			this.stuDetailModel = this.navItem;
			//1.10.根据id获取学生考试详情
			this.getPageDataArray();
			//1.11.获取学生每题答题详情
			this.getResultDetail();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			textClick() {
				console.log('textClicktextClick');
				let tempArray = [];
				for (var i = 0; i < _this.result_file_list.length; i++) {
					let tempM = _this.result_file_list[i];
					tempArray.push(tempM.merge_file_path);
				}
				uni.previewImage({
					urls: tempArray,
				});
			},
			getPageDataArray() {
				let comData = {
					index_code: this.navItem.access.split('#')[1],
					id: this.navItem.id, //
				}
				// this.showLoading();
				//1.10.根据id获取学生考试详情
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'taskResult/getById', comData, (data0, data) => {
					// this.hideLoading();
					if (data.code == 0) {
						this.result_file_list = data.data.result_file_list;
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
					index_code: this.navItem.access.split('#')[1],
					result_id: this.navItem.id, //
				}
				// this.showLoading();
				//1.11.获取学生每题答题详情
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'taskResultDetail', comData, (data0, data) => {
					// this.hideLoading();
					if (data.code == 0) {
						this.stuResultList = [].concat(data.data.list);
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
		background-color: #e5e5e5;
		border-radius: 5px;
		margin-left: 2px;
		margin-right: 2px;
	}
</style>
