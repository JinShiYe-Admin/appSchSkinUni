<template>
	<view>
		<my-swiperPage :allValue="zsdList" :showBackColor="true" @swiperPagechange='changeSwiper'></my-swiperPage>
		<p style='margin-left: 10px;color: gray;font-size: 14px;'>当前知识点得分信息：</p>
		<uni-row style="margin: 10px 20px;">
			<uni-col style="height: 30px;" :span="24">
				<view style="font-size: 13px;color: gray;">考察本知识点的题目：{{zsdItem.question_numbers}}</view>
			</uni-col>
			<uni-col style="height: 30px;" :span="12">
				<view style="font-size: 13px;color: gray;">本知识点分值：{{zsdItem.total_score}}分</view>
			</uni-col>
			<uni-col style="height: 30px;" :span="12">
				<view style="font-size: 13px;color: gray;">我的得分：{{zsdItem.score}}分</view>
			</uni-col>
			<uni-col style="height: 30px;" :span="12">
				<view style="font-size: 13px;color: gray;">年级满分人数：{{zsdItem.full_score_stuc}}人</view>
			</uni-col>
			<uni-col style="height: 30px;" :span="12">
				<view style="font-size: 13px;color: gray;">年级均分：{{zsdItem.grd_avg_score}}分</view>
			</uni-col>
		</uni-row>
		<view class="mui-row" v-for="(currentModel,index) in currentList" :key='index'>
			<h5 style="text-align: center;padding-top: 10px;padding-bottom: 10px;background: #7FFFD4;color: gray;">
				题号：{{currentModel.question_number}}</h5>
			<view class="mui-row" style="padding: 0 10px;">
				<view style="margin-top: 15px;">
					<p style='margin-left: 10px;color: gray;font-size: 14px;'>当前题目的得分信息：</p>
					<uni-row style="margin: 10px 20px;">
						<uni-col style="height: 30px;" :span="12">
							<view style="font-size: 13px;color: gray;">分值：{{currentModel.detailModel.question_score}}分
							</view>
						</uni-col>
						<uni-col style="height: 30px;" :span="12">
							<view style="font-size: 13px;color: gray;">我的得分：{{currentModel.detailModel.score}}分</view>
						</uni-col>
						<uni-col style="height: 30px;" :span="12">
							<view style="font-size: 13px;color: gray;">
								年级满分人数：{{currentModel.detailModel.full_score_stuc}}人</view>
						</uni-col>
						<uni-col style="height: 30px;" :span="12">
							<view style="font-size: 13px;color: gray;">年级均分：{{currentModel.detailModel.grd_avg_score}}分
							</view>
						</uni-col>
					</uni-row>
				</view>
				<view style="margin-bottom: 10px;">
					<h5
						style="text-align: center;padding-top: 10px;padding-bottom: 10px;background: #7FFFD4;width: 80px;color: gray;margin-bottom: 10px;">
						题目：</h5>
					<p v-if="currentModel.content.length==0&&currentModel.option.length==0" class="noData">暂无数据</p>
					<p v-if="currentModel.content.length>0" style="font-size: 14px;color: #666;"
						v-html='currentModel.content'></p>
					<view v-for="(item,index) in currentModel.option" :key='index'>
						<p style="font-size: 14px;color: #666;margin-left: 15px;margin-top: 5px;" v-html="item"></p>
					</view>
				</view>
				<view>
					<h5
						style="text-align: center;padding-top: 10px;padding-bottom: 10px;background: #7FFFD4;width: 80px;color: gray;">
						我的答案：</h5>
					<p v-if="currentModel.stu_answer.length==0&&currentModel.stu_answer_img_url.length==0"
						class="noData" style="margin-top: 15px;">暂无数据</p>
					<view v-for="(item,index) in currentModel.stu_answer" :key='index'>
						<p style="font-size: 14px;color: #666;margin-left: 15px;margin: 5px 10px;">{{item}}</p>
					</view>
					<img v-if="currentModel.stu_answer_img_url.length>0" style='margin-top: 5px;margin-bottom: 5px;'
						:src="currentModel.stu_answer_img_url" width="100%"
						@click='clickImg(currentModel.stu_answer_img_url)'>
				</view>
				<view>
					<h5
						style="text-align: center;padding-top: 10px;padding-bottom: 10px;background: #7FFFD4;width: 80px;color: gray;">
						标准答案：</h5>
					<p v-if="currentModel.answer.length==0" class="noData">暂无数据</p>
					<view v-for="(item1,indexAn) in currentModel.answer" :key='indexAn'>
						<view v-for="(item2,indexAn2) in item1" :key='indexAn2'>
							<p style="font-size: 14px;color: #666;margin-left: 15px;" v-html="item2"></p>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				examId: 0, //试卷id
				access: '',
				zsdList: [],
				zsdItem: {},
				stList: [],
				currentList: []
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			let curPage = util.getPageData(option);
			curPage.text = '知识点详情';
			for (var i = 0; i < curPage[0].length; i++) {
				var tempM = curPage[0][i];
				tempM.text = tempM.knowledge_name;
			}
			this.zsdList = curPage[0]
			this.zsdItem = curPage[1]
			this.examId = curPage[2]
			this.access = curPage[3]
			this.stList = curPage[4]
			console.log('curPage:' + JSON.stringify(curPage));
			uni.setNavigationBarTitle({
				title: curPage.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
			// 
			this.getQueDetail();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			clickImg(urlStr) {
				var tempArray = [];
				tempArray.push(urlStr);
				uni.previewImage({
					urls: tempArray,
				});
			},
			changeSwiper(e) {
				console.log('changeSwiperchangeSwiper:' + e.index);
				this.zsdItem = this.zsdList[e.index]
				this.currentList = [];
				// 
				this.getQueDetail();
			},
			getQueDetail() {
				let comData = {
					user_code: this.personInfo.stu_code,
					id: this.examId, //试卷id
					que_numbers: this.zsdItem.question_numbers, //题号
					index_code: this.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'singleSub/queDetail', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var a = 0; a < data.data.list.length; a++) {
							var tempD = data.data.list[a];
							for (var b = 0; b < this.stList.length; b++) {
								var tempA = this.stList[b];
								if (tempD.question_number == tempA.question_number) {
									tempD.detailModel = tempA;
								}
							}
							if (tempD.content) {
								tempD.content = tempD.content;
							} else {
								tempD.content = '';
							}
							if (tempD.answer) {
								tempD.answer = tempD.answer;
							} else {
								tempD.answer = [];
							}
							if (tempD.stu_answer_img_url) {
								tempD.stu_answer_img_url = tempD.stu_answer_img_url;
							} else {
								tempD.stu_answer_img_url = [];
							}
							if (tempD.option) {
								tempD.option = tempD.option;
							} else {
								tempD.option = [];
							}
							if (tempD.stu_answer) {
								tempD.stu_answer = tempD.stu_answer;
							} else {
								tempD.stu_answer = [];
							}
						}
						this.currentList = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	/* ::v-deep img{
		max-width: 100%;
		max-height: 100%;
	} */

	::v-deep p {
		word-break: break-all;
	}
</style>
