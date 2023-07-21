<template>
	<view>
		<div>
			<h4 class="examName">{{nowPoint.name}}</h4>
			<image src="/static/images/student_performance/change.png" @click="changeKnowPoint"
				style="position: absolute;right: 10px;width: 30px;height: 30px;margin-top: -25px;"></image>
		</div>
		<view>
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;margin-left: 10px;">
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
					<p class="rich" v-if="item.content.length>0" style="font-size: 14px;color: #666;"
						v-html="item.content"></p>
					<view v-for="(item,indexOp) in item.option" :key='indexOp'>
						<p style="font-size: 14px;color: #666;margin-left: 15px;margin-top: 5px;" v-html='item'></p>
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
</template>

<script>
	import util from '@/commom/util.js';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				zhishidianDFL: {},
				zhishidianShow: {},
				catalogList: [],
				pointList: [],
				nowPoint: {},
				pointInfo: {},
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
			//#ifdef H5
			document.title = ""
			//#endif
			// 

			// 获取知识点目录
			this.getPointList(function(tempList) {
				_this.catalogList = [].concat(tempList);
				// 找到第一个可用目录
				_this.getFirstPoint(tempList, function(model) {
					console.log('model:' + JSON.stringify(model));
					_this.nowPoint = model;
					// 获取知识点详情
					_this.getKnowPointDetail();
				});
			});
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			changeKnowPoint() {
				this.itemData.flag = 0; //知识点
				util.openwithData("/pages/student_performance/zhishidian_change", this.itemData, {
					changeZSD(data) { //子页面调用父页面需要的方法
						console.log('changeZSDchangeZSD:' + JSON.stringify(data));
						if (data.id != _this.nowPoint.id) {
							_this.nowPoint = data;
							// 获取知识点详情
							_this.getKnowPointDetail();
						}
					}
				});
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
			getPointList(callback) {
				let comData = {
					per_code: this.itemData.per_code, //学段代码
					sub_code: this.itemData.nowSubject.sub_code, //科目代码
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'point/catalogs', comData, (data0, data) => {
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
					user_code: this.personInfo.stu_code,
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
			},
			// 获取知识点详情
			getKnowPointDetail() {
				let comData = {
					user_code: this.personInfo.stu_code,
					book_catalog_id: this.nowPoint.id, //知识点id
					index_code: this.itemData.access,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'point/pointInfo', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pointInfo = data.data;
						// option.series[0].data = [data.data.score_rate];
						// chart.setOption(option);
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
						this.pointList = [];
						// 获取题目列表
						if (data.data.question_id_list.length > 0) {
							var tempA = data.data.question_id_list.slice(0, 10);
							this.getKnowPointList(tempA);
						} else {
							this.showToast('当前知识点没有题目');
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

	::v-deep img {
		max-width: 100%;
	}

	::v-deep p {
		word-break: break-all;
	}
</style>
