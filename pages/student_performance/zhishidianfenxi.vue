<template>
	<view>
		<view v-if="flag==1">
			<my-swiperPage ref='swiperPageIndex' :allValue="knowPoints.bookList" :showIndex="true" @swiperPagechange='changeSwiper'>
			</my-swiperPage>
		</view>
		<view v-if="flag==2">
			<my-swiperPage ref='swiperPageIndex' :allValue="knowPoints.bookList" :showIndex="true" @swiperPagechange='changeSwiper'>
			</my-swiperPage>
		</view>
		<view v-if="flag==3">
			<my-swiperPage ref='swiperPageIndex' :allValue="knowPoints.bookList" :showIndex="true" @swiperPagechange='changeSwiper'>
			</my-swiperPage>
		</view>

		<view v-if="flag==1">
			<view>
				<view
					style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;margin-left: 10px;">
				</view>
				<view style="font-size: 14px;color: gray;">当前知识点信息</view>
			</view>
			<br>
			<uni-row style="display: flex;align-items: center;">
				<uni-col style="display: flex;align-items: center;flex-direction: column;" :span="14">
					<view class="charts-box" style="width: 150px;height: 150px;text-align: center;">
						<qiun-data-charts type="arcbar" :opts="zhishidianShow" :chartData="zhishidianDFL" />
					</view>
				</uni-col>
				<uni-col style="" :span="10">
					<uni-row style="font-size: 13px;color: gray;">
						<uni-col style="height: 25px;" :span="24">
							<view>考查题量：{{pointInfo.question_number}}题</view>
						</uni-col>
						<uni-col style="height: 25px;" :span="24">
							<view>分值：{{pointInfo.question_total_score}}分</view>
						</uni-col>
						<uni-col style="height: 25px;" :span="24">
							<view>年级均分：{{pointInfo.grd_avg_score}}分</view>
						</uni-col>
						<uni-col style="height: 25px;" :span="24">
							<view>我的得分：{{pointInfo.stu_total_score}}分</view>
						</uni-col>
					</uni-row>
				</uni-col>
			</uni-row>
		</view>
		<view v-if="flag==2||flag==3" style="margin-top: 10px;margin-bottom: 20px;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin: 10px 5px 0 10px;"></view>
			<view v-if="pointInfo.question_id_list" style="text-align: center;color: gray;font-size: 15px;">当前错题数量：<span style="color: red;font-size: 25px;">{{pointInfo.question_id_list.length}}</span>题</view>
		</view>
		<view v-for="(item,index) in pointList" :key='index'>
			<h4 class="spaceLine">考题{{index+1}}</h4>
			<view style="padding: 0 10px;margin-top: 15px;">
				<view>
					<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
					<view style="font-size: 14px;color: gray;">当前题目信息</view>
				</view>
				<view style="margin: 10px 0 0 15px;font-size: 14px;">
					<view style="margin-top: 10px;word-break: break-all;color: gray;">试题来源: {{item.task_name}}</view>
					<view style="margin-top: 10px;color: gray;">本题分值: {{item.question_score}}分</view>
					<view style="margin-top: 10px;color: gray;">年级均分: {{item.grd_avg_score}}分</view>
					<view style="margin-top: 10px;color: gray;">我的得分: {{item.stu_score}}分</view>
				</view>
			</view>
			<view style="padding: 0 10px;margin-top: 15px;">
				<view>
					<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
					<view style="font-size: 14px;color: gray;">题目</view>
				</view>
				<view style="margin-top: 10px;font-size: 14px;">
					<p v-if="item.content.length==0&&item.option.length==0" style='color: gray;'>暂无数据</p>
					<p class="rich" v-if="item.content.length>0" style="font-size: 14px;color: #666;" v-html="item.content"></p>
					<view v-for="(item,indexOp) in item.option" :key='indexOp'>
						<p style="font-size: 14px;color: #666;margin-left: 15px;margin-top: 5px;" v-html="item"></p>
					</view>
				</view>
			</view>
			<view style="padding: 0 10px;margin-top: 15px;">
				<view>
					<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
					<view style="font-size: 14px;color: gray;">我的答案</view>
				</view>
				<view style="margin-top: 10px;">
					<p v-if="item.stu_answer.length==0&&item.stu_answer_img_url.length==0" class="noData" style="margin-top: 15px;color: gray;">暂无数据</p>
					<view v-for="(item1,index) in item.stu_answer" :key='index'>
						<p style="font-size: 14px;color: #666;margin-left: 15px;">{{item1}}</p>
					</view>
					<img v-if="item.stu_answer_img_url.length>0" :src="item.stu_answer_img_url" width="100%" @click='clickImg(item.stu_answer_img_url)'>
				</view>
			</view>
			<view style="padding: 0 10px;margin-top: 15px;">
				<view>
					<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
					<view style="font-size: 14px;color: gray;">标准答案</view>
				</view>
				<view style="margin-top: 10px;font-size: 14px;color: gray;margin-bottom: 10px;">
					<p>{{item.task_name}}</p>
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
				type: 0, //类型 得分率最高（少）的十个知识点  height(low)
				flag: 0,
				pointInfo: {},
				pointList: [],
				zhishidianDFL: {},
				zhishidianShow: {},
				knowPoints: {
					bookList: [],
					nowBook: {}
				}
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.text = this.itemData.headTitle;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			// 
			for (var i = 0; i < this.itemData.bookList.length; i++) {
				var tempM = this.itemData.bookList[i];
				if (this.itemData.flag == 1) {
					tempM.text = tempM.book_catalog_name;
				} else if (this.itemData.flag == 2) {
					tempM.text = tempM.name;
				} else if (this.itemData.flag == 3) {
					tempM.text = tempM.paper_name;
				}
			}
			this.knowPoints.bookList = this.itemData.bookList;
			this.knowPoints.nowBook = this.itemData.bookList[this.itemData.bookIndex];
			this.flag = this.itemData.flag;
			this.type = this.itemData.type;
			setTimeout(()=>{
				this.$refs.swiperPageIndex.currentIndex = this.itemData.bookIndex;
			},100)
			
			if (this.flag == 1) {
				// 获取知识点详情
				this.getKnowPointDetail();
			} else if (this.flag == 2) {
				// 1.23.通过知识点找错题列表
				this.getCatalogDetail();
			} else if (this.flag == 3) {
				// 1.24.通过考试找错题列表
				this.getPaperDetail();
			}
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
				var tempSub = this.knowPoints.bookList[e.index];
				this.knowPoints.nowBook = tempSub;
				this.pointInfo = {};
				this.pointList = [];
				console.log('tempSub know-point:' + JSON.stringify(tempSub));
				// 获取知识点
				if (this.flag == 1) {
					// 获取知识点详情
					this.getKnowPointDetail();
				} else if (this.flag == 2) {
					// 1.23.通过知识点找错题列表
					this.getCatalogDetail();
				} else if (this.flag == 3) {
					// 1.24.通过考试找错题列表
					this.getPaperDetail();
				}
			},
			// 获取知识点详情
			getKnowPointDetail() {
				let comData = {
					user_code: this.personInfo.user_code,
					book_catalog_id: this.knowPoints.nowBook.book_catalog_id, //知识点id
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'point/pointInfo', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempAA = parseFloat(data.data.score_rate * 100).toFixed(1) + '%';
						console.log('tempAA:'+tempAA);
						this.pointInfo = data.data;
						if (this.itemData.flag == 1) {
							this.zhishidianDFL = {
								"series": [{
									"name": "本知识点得分率",
									"data": data.data.score_rate,
									"color": "#00CFBD"
								}]
							};
							this.zhishidianShow = {
								title: {
									name: parseFloat(data.data.score_rate * 100).toFixed(1) + '%',
									fontSize: 25,
									color: '#00CFBD'
								},
								subtitle: {
									name: '本知识点得分率',
									color: '#666666',
									fontSize: 13
								}
							}
						}
						// 获取题目列表
						if (data.data.question_id_list.length > 0) {
							var tempA = data.data.question_id_list.slice(0, 10);
							this.getKnowPointList(tempA);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 1.23.通过知识点找错题列表
			getCatalogDetail() {
				let comData = {
					user_code: this.personInfo.user_code,
					book_catalog_id: this.knowPoints.nowBook.book_catalog_id, //知识点id
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'errorBook/findListByCatalog', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pointInfo = data.data;
						// 获取题目列表
						if (data.data.question_id_list.length > 0) {
							var tempA = data.data.question_id_list.slice(0, 10);
							this.getKnowPointList(tempA);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 1.24.通过考试找错题列表
			getPaperDetail() {
				let comData = {
					user_code: this.personInfo.user_code,
					paper_id: this.knowPoints.nowBook.paper_id, //
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'errorBook/findListByPaper', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pointInfo = data.data;
						// 获取题目列表
						if (data.data.question_id_list.length > 0) {
							var tempA = data.data.question_id_list.slice(0, 10);
							this.getKnowPointList(tempA);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 获取题目列表
			getKnowPointList(list) {
				let comData = {
					user_code: this.personInfo.user_code,
					question_id_list: list, //题目id列表
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'point/queDetail', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var a = 0; a < data.data.list.length; a++) {
							var tempD = data.data.list[a];
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
								tempD.stu_answer_img_url = '';
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
						this.pointList = [].concat(data.data.list);
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	/* 间隔 */
	.spaceLine {
		margin-top: 0px;
		margin-bottom: 10px;
		text-align: center;
		padding-top: 10px;
		padding-bottom: 10px;
		background: #d7f3ef;
		font-size: 14px;
		color: #505050;
	}
	::v-deep p{
		word-break: break-all;
	}
</style>
