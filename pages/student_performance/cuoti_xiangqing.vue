<template>
	<view>
		<!-- #ifdef H5 -->
		<view class="tabs-fixed">
		<!-- #endif -->
		<!-- #ifdef APP -->
		<view class="tabs-fixed" style="top: 0px;">
		<!-- #endif -->
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="button"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<view class="content" style="margin-top: 60px;">
			<view v-if="semFlag == 0">
				<div>
					<h4 class="examName">{{pointModel.nowPoint.name}}</h4>
					<image src="/static/images/student_performance/change.png" @click="changeKnowPoint(0)"
						style="position: absolute;right: 10px;width: 30px;height: 30px;margin-top: -25px;"></image>
				</div>
				<view style="margin-top: 10px;">
					<view style="height: 22px;width: 2px;background: #00baad;float: left;margin: 10px 5px 0 10px;"></view>
					<view style="text-align: center;color: gray;font-size: 15px;">当前错题数量：<span style="color: red;font-size: 25px;">{{pointModel.questionIdList.length}}</span>题</view>
				</view>
				<br>
				<uni-row style="display: flex;align-items: center;">
				
				</uni-row>
				<view v-for="(item,index) in pointModel.questionDetailList" :key='index'>
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
							<view class="rich" v-if="item.content.length>0" style="font-size: 14px;color: #666;"
								v-html="item.content"></view>
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
							<p v-if="item.stu_answer.length==0&&item.stu_answer_img_url.length==0" class="noData"
								style="margin-top: 15px;color: gray;">暂无数据</p>
							<view v-for="(item1,index) in item.stu_answer" :key='index'>
								<p style="font-size: 14px;color: #666;margin-left: 15px;">{{item1}}</p>
							</view>
							<img v-if="item.stu_answer_img_url.length>0" :src="item.stu_answer_img_url" width="100%"
								@click='clickImg(item.stu_answer_img_url)'>
						</view>
					</view>
					<view style="padding: 0 10px;margin-top: 15px;">
						<view>
							<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
							<view style="font-size: 14px;color: gray;">标准答案</view>
						</view>
						<view style="margin-top: 10px;font-size: 14px;color: gray;margin-bottom: 10px;">
							<p v-html="item.analyse"></p>
						</view>
					</view>
				</view>
			</view>
			<view v-if="semFlag == 1">
				<div>
					<h4 class="examName">{{chapterModel.nowChapter.name}}</h4>
					<image src="/static/images/student_performance/change.png" @click="changeKnowPoint(1)"
						style="position: absolute;right: 10px;width: 30px;height: 30px;margin-top: -25px;"></image>
				</div>
				<view style="margin-top: 10px;">
					<view style="height: 22px;width: 2px;background: #00baad;float: left;margin: 10px 5px 0 10px;"></view>
					<view style="text-align: center;color: gray;font-size: 15px;">当前错题数量：<span style="color: red;font-size: 25px;">{{chapterModel.questionIdList.length}}</span>题</view>
				</view>
				<br>
				<uni-row style="display: flex;align-items: center;">
				
				</uni-row>
				<view v-for="(item,index) in chapterModel.questionDetailList" :key='index'>
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
							<view class="rich" v-if="item.content.length>0" style="font-size: 14px;color: #666;"
								v-html="item.content"></view>
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
							<p v-if="item.stu_answer.length==0&&item.stu_answer_img_url.length==0" class="noData"
								style="margin-top: 15px;color: gray;">暂无数据</p>
							<view v-for="(item1,index) in item.stu_answer" :key='index'>
								<p style="font-size: 14px;color: #666;margin-left: 15px;">{{item1}}</p>
							</view>
							<img v-if="item.stu_answer_img_url.length>0" :src="item.stu_answer_img_url" width="100%"
								@click='clickImg(item.stu_answer_img_url)'>
						</view>
					</view>
					<view style="padding: 0 10px;margin-top: 15px;">
						<view>
							<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
							<view style="font-size: 14px;color: gray;">标准答案</view>
						</view>
						<view style="margin-top: 10px;font-size: 14px;color: gray;margin-bottom: 10px;">
							<p v-html="item.analyse"></p>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				semFlag: 0,
				semValuesArray: ['按知识点查看', '按章节查看'],
				pointModel: {
					pointList: [],
					nowPoint: {},
					questionIdList: [],
					questionDetailList: [],
				},
				chapterModel: {
					chapterList: [],
					nowChapter: {},
					questionIdList: [],
					questionDetailList: [],
				},
			}
		},
		onLoad(option) {
			_this = this;
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
			// 获取知识点目录
			this.getPointList(0, (tempList)=> {
				console.log('tempList:'+JSON.stringify(tempList));
				_this.pointModel.pointList = [].concat(tempList);
				// 找到第一个可用目录
				_this.getFirstPoint(tempList, (model)=> {
					_this.pointModel.nowPoint = model;
					// 获取知识点详情
					_this.getKnowPointDetail();
				});
			});
		},
		methods: {
			changeKnowPoint(tag) {
				this.itemData.flag = 1; //错题
				this.itemData.type = tag;
				util.openwithData("/pages/student_performance/zhishidian_change", this.itemData, {
					changeZSD(data) { //子页面调用父页面需要的方法
						console.log('changeZSDchangeZSD:' + JSON.stringify(data));
						if (data.id != _this.pointModel.nowPoint.id) {
							if (_this.semFlag == 0) {
								_this.pointModel.nowPoint = data;
								// 获取知识点详情
								_this.getKnowPointDetail();
							} else {
								_this.chapterModel.nowChapter = data;
								// 获取列表
								_this.getKnowPointDetail();
							}
						}
					}
				});
			},
			clickSeg: function(e) {
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					if (this.semFlag == 1 && this.chapterModel.chapterList.length == 0) {
						// 获取章节目录
						this.getPointList(1, function(tempList) {
							_this.chapterModel.chapterList = [].concat(tempList);
							// 找到第一个可用目录
							_this.getFirstPoint(tempList, function(model) {
								_this.chapterModel.nowChapter = model;
								// 获取列表
								// getChapterDetail();
								_this.getKnowPointDetail();
							});
						});
					}
				}
			},
			// 找到第一个可用目录
			getFirstPoint(list, callback) {
				for (var i = 0; i < list.length; i++) {
					var model = list[0];
					if (model.children && model.children.length > 0) {
						_this.getFirstPoint(model.children, callback);
						break;
					} else {
						callback(model);
						break;
					}
				}
			},
			clickImg(urlStr) {
				var tempArray = [];
				tempArray.push(urlStr);
				uni.previewImage({
					urls: tempArray,
				});
			},
			// 获取知识点目录
			getPointList(type, callback) {
				let comData = {
					type: type, //0为查知识点目录,1为查章节目录
					sub_code: this.itemData.nowSubject.sub_code, //科目代码
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'errorBook/catalogs', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						callback(data.data.list[0].catalog_list);
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
						if (this.semFlag == 0) {
							this.pointModel.questionDetailList = [].concat(data.data.list);
						} else if (this.semFlag == 1) {
							this.chapterModel.questionDetailList = [].concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 获取知识点详情
			getKnowPointDetail() {
				let book_catalog_id;
				if (this.semFlag == 0) {
					book_catalog_id = this.pointModel.nowPoint.id;
				} else {
					book_catalog_id = this.chapterModel.nowChapter.id;
				}
				let comData = {
					user_code: this.personInfo.user_code,
					book_catalog_id: book_catalog_id, //知识点id
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'errorBook/findListByCatalog', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (this.semFlag == 0) {
							this.pointModel.questionIdList = data.data.question_id_list;
							this.pointModel.questionDetailList = [];
						} else {
							this.chapterModel.questionIdList = data.data.question_id_list;
							this.chapterModel.questionDetailList = [];
						}
						// 获取题目列表
						if (data.data.question_id_list.length > 0) {
							// var tempA = data.data.question_id_list.slice(0, 10);
							var tempA = data.data.question_id_list;
							this.getKnowPointList(tempA);
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

	/* 试卷名称 */
	.examName {
		text-align: center;
		margin-top: 20px;
		margin-left: 20px;
		margin-right: 20px;
	}
	::v-deep img{
		max-width: 100%;
	}
	
	::v-deep p{
		word-break: break-all;
	}
</style>
