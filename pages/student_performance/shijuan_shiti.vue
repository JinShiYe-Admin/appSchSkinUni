<template>
	<view>
		<my-swiperPage ref='swiperPageIndex' :allValue="stList" :showBackColor="true" @swiperPagechange='changeSwiper'></my-swiperPage>
		<!-- <h5 style="text-align: center;padding-top: 10px;padding-bottom: 10px;background: #7FFFD4;color: gray;">题号：{{stItem.question_number}}</h5> -->
		<view class="mui-row" style="padding: 0 10px;">
			<view style="margin-top: 15px;">
					<p style='margin-left: 10px;color: gray;font-size: 14px;'>当前题目的得分信息：</p>
					<uni-row style="margin: 10px 20px;">
						<uni-col style="height: 30px;" :span="12">
							<view style="font-size: 13px;color: gray;">分值：{{stItem.question_score}}分</view>
						</uni-col>
						<uni-col style="height: 30px;" :span="12">
							<view style="font-size: 13px;color: gray;">我的得分：{{stItem.score}}分</view>
						</uni-col>
						<uni-col style="height: 30px;" :span="12">
							<view style="font-size: 13px;color: gray;">年级满分人数：{{stItem.full_score_stuc}}人</view>
						</uni-col>
						<uni-col style="height: 30px;" :span="12">
							<view style="font-size: 13px;color: gray;">年级均分：{{stItem.grd_avg_score}}分</view>
						</uni-col>
					</uni-row>
			</view>
			<view style="margin-bottom: 10px;">
				<h5 style="text-align: center;padding-top: 10px;padding-bottom: 10px;background: #7FFFD4;width: 80px;color: gray;margin-bottom: 10px;">题目：</h5>
				<p v-if="content.length==0" class="noData">暂无数据</p>
				<p v-if="content.length>0" style="font-size: 14px;color: #666;" v-html='content'></p>
				<view v-for="(item,index) in option" :key='index'>
					<p style="font-size: 14px;color: #666;margin-left: 15px;margin-top: 5px;" v-html="item"></p>
				</view>
			</view>
			<view>
				<h5 style="text-align: center;padding-top: 10px;padding-bottom: 10px;background: #7FFFD4;width: 80px;color: gray;">我的答案：</h5>
				<p v-if="stu_answer.length==0&&stu_answer_img_url.length==0" class="noData" style="margin-top: 15px;">暂无数据</p>
				<view v-for="(item,index) in stu_answer" :key='index'>
					<p style="font-size: 14px;color: #666;margin-left: 15px;margin: 5px 10px;">{{item}}</p>
				</view>
				<img v-if="stu_answer_img_url.length>0" style='margin-top: 5px;margin-bottom: 5px;' :src="stu_answer_img_url" width="100%" @click='clickImg(stu_answer_img_url)'>
			</view>
			<view>
				<h5 style="text-align: center;padding-top: 10px;padding-bottom: 10px;background: #7FFFD4;width: 80px;color: gray;">标准答案：</h5>
				<p v-if="answer.length==0" class="noData" style='margin-top: 10px;'>暂无数据</p>
				<view v-for="(item1,indexAn) in answer" :key='indexAn'>
					<view v-for="(item2,indexAn2) in item1" :key='indexAn2'>
						<p style="font-size: 14px;color: #666;margin-left: 15px;" v-html="item2"></p>
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
				currStIndex:0,
				examId: 0, //试卷id
				access:'',
				stList: [],
				stItem: {},
				content:'',//题目
				option:[],//题目
				stu_answer:[],//我的答案
				stu_answer_img_url:'',//我的答案
				answer:[],//标准答案
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			let curPage = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(curPage));
			for (var i = 0; i < curPage[0].length; i++) {
				var tempM = curPage[0][i];
				tempM.text = "题号:"+tempM.question_number;
			}
			this.stList = curPage[0];
			this.stItem = curPage[1];
			this.examId = curPage[2];
			this.access = curPage[3];
			
			uni.setNavigationBarTitle({
				title: curPage[4]
			});
			//#ifndef APP-PLUS
			document.title = ""
			
			//#endif
			// 1.7.单科题目详情
			this.getQueDetail();
			this.stList.map((item, index) => {
				if (item.question_number == this.stItem.question_number) {
					setTimeout(()=>{
						this.$refs.swiperPageIndex.currentIndex = index;
					},100)
				}
			})
		},
		methods: {
			clickImg(urlStr){
				var tempArray = [];
				tempArray.push(urlStr);
				uni.previewImage({
					urls: tempArray,
				});
			},
			changeSwiper(e) {
				console.log('changeSwiperchangeSwiper:' + e.index);
				this.stItem = this.stList[e.index];
				// 1.7.单科题目详情
				this.getQueDetail();
			},
			// 1.7.单科题目详情
			getQueDetail(sutArray) {
				let comData = {
					user_code: this.personInfo.user_code,
					id: this.examId, //试卷id
					que_numbers: this.stItem.question_number, //题号
					index_code: this.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'singleSub/queDetail', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempD = data.data.list[0];
						if(tempD.content){
							this.content = tempD.content;
						}else{
							this.content = '';
						}
						if(tempD.answer){
							this.answer = tempD.answer;
						}else{
							this.answer = [];
						}
						if(tempD.stu_answer_img_url){
							this.stu_answer_img_url = tempD.stu_answer_img_url;
						}else{
							this.stu_answer_img_url = [];
						}
						if(tempD.option){
							this.option = tempD.option;
						}else{
							this.option = [];
						}
						if(tempD.stu_answer){
							this.stu_answer = tempD.stu_answer;
						}else{
							this.stu_answer = [];
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
.noData{
	font-size: 14px;
	color: gray;
}
</style>
