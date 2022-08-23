<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="button"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<view class="content" style="margin-top: 60px;">
			<view v-if="semFlag == 0">
				<my-swiperPage :allValue="semFlag0Data.subList" :showBackColor="true" @swiperPagechange='changeSwiper'></my-swiperPage>
				<m-steps v-for="(item, index) in semFlag0Data.sem0List" :item='item' :key="index" :index='index' >
					<view slot="dateTop" style="width: 100px;text-align: center;font-size: 12px;color: #808080;">
						{{item.exam_date.split(' ')[0]}}
					</view>
					<view slot="content" class="viewNode" style="min-height: 50px;" @click='clickSingleScore(item)'>
						<view v-if="item.type == 1" class="">
							<template v-if="item.exam_type == 1">
								<view class="examType" style="background: #f88c54;">期中</view>
							</template>
							<template v-else-if="item.exam_type == 2">
								<view class="examType" style="background: orange;">月考</view>
							</template>
							<template v-else-if="item.exam_type == 3">
								<view class="examType" style="background: #f56c6c;">期末</view>
							</template>
							<template v-else-if="item.exam_type == 4">
								<view class="examType" style="background: #80b9ec;">周测</view>
							</template>
							<p class='contentName'>{{item.name}}</p>
						</view>
						<view v-else-if="item.type == 2" class="">
							<view class="examType" style="background: #67d293;">作业</view>
							<p class='contentName'>{{item.name}}</p>
						</view>
					</view>
				</m-steps>
				<view class="uni-loadmore" v-if="semFlag0Data.showLoadMore">{{semFlag0Data.loadMoreText}}</view>
			</view>
			<view v-else-if="semFlag == 1">
				<m-steps v-for="(item, index) in semFlag1Data.sem1List" :item='item' :key="index" :index='index'>
					<view slot="dateTop" style="width: 100px;text-align: center;font-size: 12px;color: #808080;">
						{{item.exam_date.split(' ')[0]}}
					</view>
					<view slot="content" class="viewNode" style="min-height: 50px;" @click='clickSumScore(item)'>
						<view v-if="item.type == 1" class="">
							<template v-if="item.exam_type == 1">
								<view class="examType" style="background: #f88c54;">期中</view>
							</template>
							<template v-else-if="item.exam_type == 2">
								<view class="examType" style="background: orange;">月考</view>
							</template>
							<template v-else-if="item.exam_type == 3">
								<view class="examType" style="background: #f56c6c;">期末</view>
							</template>
							<template v-else-if="item.exam_type == 4">
								<view class="examType" style="background: #80b9ec;">周测</view>
							</template>
							<p class='contentName'>{{item.name}}</p>
						</view>
						<view v-else-if="item.type == 2" class="">
							<view class="examType" style="background: #67d293;">作业</view>
							<p class='contentName'>{{item.name}}</p>
						</view>
					</view>
				</m-steps>
				<view class="uni-loadmore" v-if="semFlag1Data.showLoadMore">{{semFlag1Data.loadMoreText}}</view>
			</view>
			<view v-else-if="semFlag == 2">
				<my-swiperPage :allValue="semFlag2Data.subList" :showBackColor="true" @swiperPagechange='changeSwiper'></my-swiperPage>
				<h4 class="spaceLine">本科知识点概况</h4>
				<view class="charts-box">
				  <qiun-data-charts type="arcbar" :opts="semFlag2Data.zhishidianShow" :chartData="semFlag2Data.zhishidianDFL"/>
				</view>
				<view style="text-align: center;">
					<view class="leaveSum">各知识点平均得分率</view>
				</view>
				<uni-grid :column="2" :showBorder='false' :square="false" :highlight="false">
					<uni-grid-item>
						<view class="grid-item-box">
							<p class="leaveSum">本科目知识点总数：{{semFlag2Data.knowData.total_point}}个</p>
						</view>
					</uni-grid-item>
					<uni-grid-item>
						<view class="grid-item-box">
							<p class="leaveSum">已考察知识点数量：{{semFlag2Data.knowData.survey_point}}个</p>
						</view>
					</uni-grid-item>
				</uni-grid>
				<view style="text-align: center;margin-top: 10px;">
					<span @click="clickKnowPointDetail"
						style="background: #00CFBD;padding: 5px 25px;font-size: 14px;color:#fff;border-radius: 30px;">查看知识点详情</span>
				</view>
				<h4 class="spaceLine" style="background-color: #F86A6A;color: #fff;margin-top: 20px;">得分率最低的十个知识点</h4>
				<uni-list>
					<uni-list-item :border="false" v-for="(model,index) in semFlag2Data.knowData.low_score_list"
						:key='index' direction='column' clickable @click="toDetailPageKnowPointLow(model,index)">
						<view slot="body">
							<uni-row style="">
								<uni-col style="" :span="2">
									<view
										style="text-align: center;padding: 1px;margin-top: 0px;background-color:#F86A6A;border-radius: 50%;width: 20px;height: 20px;color: #fff;font-size: 14px;">
										{{index+1}}</view>
								</uni-col>
								<uni-col style="" :span="20">
									<view style="font-size: 13px;margin-top: 3px;">{{model.book_catalog_name}}</view>
								</uni-col>
								<uni-col style="" :span="2">
									<image style="width: 15px;height: 15px;margin-top: 5px; "
										src="/static/images/student_performance/search.png"></image>
								</uni-col>
							</uni-row>
						</view>
					</uni-list-item>
				</uni-list>
				<h4 class="spaceLine" style="background-color: #499DF8;color: #fff;">得分率最高的十个知识点</h4>
				<uni-list>
					<uni-list-item :border="false" v-for="(model,index) in semFlag2Data.knowData.high_score_list"
						:key='index' direction='column' clickable @click="toDetailPageKnowPointHeight(model,index)">
						<view slot="body">
							<uni-row style="">
								<uni-col style="" :span="2">
									<view
										style="text-align: center;padding: 1px;margin-top: 0px;background-color:#499DF8;border-radius: 50%;width: 20px;height: 20px;color: #fff;font-size: 14px;">
										{{index+1}}</view>
								</uni-col>
								<uni-col style="" :span="20">
									<view style="font-size: 13px;margin-top: 3px;">{{model.book_catalog_name}}</view>
								</uni-col>
								<uni-col style="" :span="2">
									<image style="width: 15px;height: 15px;margin-top: 5px; "
										src="/static/images/student_performance/search.png"></image>
								</uni-col>
							</uni-row>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
			<view v-else-if="semFlag == 3">
				<my-swiperPage :allValue="semFlag3Data.subList" :showBackColor="true" @swiperPagechange='changeSwiper'></my-swiperPage>
				<view class="mui-row">
					<h4 class="spaceLine">错题数量及趋势</h4>
					<view style="text-align: right;font-size: 13px;margin-top: 10px;margin-right: 15px;">
						错题总数：{{semFlag3Data.wrongData.total_num}}道
					</view>
					<view class="charts-box" style="margin-top: -20px;">
					  <qiun-data-charts type="pie" :chartData="semFlag3Data.sumCountQs"/>
					</view>
					<view style="text-align: center;margin-top: 20px;">
						<span @click="clickWrongBookDetail"
							style="background: #00CFBD;padding: 10px 50px;font-size: 14px;color:#fff;border-radius: 30px;margin-bottom: 15px !important;">查看错题</span>
					</view>
				</view>
				<view class="line"></view>
				<h4 style="margin-top: 15px;font-size: 14px;font-weight: normal;margin-left: 10px;">历次考试错题数量趋势如下：</h4>
				<view class="charts-box" style="margin-top: 10px;">
					<qiun-data-charts type="demotype" :chartData="semFlag3Data.kaoshiQs" background="none" />
				</view>
				<view class="line" style="margin-top: 10px;"></view>
				<h4 style="margin-top: 20px;font-size: 14px;font-weight: normal;margin-left: 10px;">历次作业错题数量趋势如下：</h4>
				<view class="charts-box" style="margin-top: 10px;">
					<qiun-data-charts type="demotype" :chartData="semFlag3Data.zuoyeQs" background="none" />
				</view>
				<h4 class="spaceLine" style="background-color: #F86A6A;color: #fff;margin-top: 5px;">知识点错题榜</h4>
				<h4 style="margin-top: 20px;font-size: 14px;font-weight: normal;margin-left: 15px;">错题数量最多的十个知识点如下：</h4>
				<uni-list :border="false">
					<uni-list-item :border="false" v-for="(model,index) in semFlag3Data.wrongData.error_point_list"
						:key='index' direction='column' clickable @click="toDetailPageKnowPointWrong(model,index)">
						<view slot="body">
							<uni-row style="">
								<uni-col style="" :span="2">
									<view
										style="text-align: center;padding: 1px;margin-top: 0px;background-color:#F86A6A;border-radius: 50%;width: 20px;height: 20px;color: #fff;font-size: 14px;">
										{{index+1}}</view>
								</uni-col>
								<uni-col style="" :span="20">
									<view style="font-size: 13px;margin-top: 3px;">{{model.name}}</view>
								</uni-col>
								<uni-col style="" :span="2">
									<image style="width: 15px;height: 15px;margin-top: 5px; "
										src="/static/images/student_performance/search.png"></image>
								</uni-col>
							</uni-row>
						</view>
					</uni-list-item>
				</uni-list>
				<h4 class="spaceLine" style="background-color: #F5A35A;color: #fff;">考试/作业错题榜</h4>
				<h4 style="margin-top: 20px;font-size: 14px;font-weight: normal;margin-left: 15px;">错题数量最多的十次考试/作业：</h4>
				<uni-list :border="false">
					<uni-list-item :border="false" v-for="(model,index) in semFlag3Data.wrongData.error_task_list"
						:key='index' direction='column' clickable @click="toDetailPageHomeWorkWrong(model,index)">
						<view slot="body">
							<uni-row style="">
								<uni-col style="" :span="2">
									<view
										style="text-align: center;padding: 1px;margin-top: 3px;background-color:#F86A6A;border-radius: 50%;width: 20px;height: 20px;color: #fff;font-size: 14px;">
										{{index+1}}</view>
								</uni-col>
								<uni-col style="" :span="20">
									<view style="font-size: 13px;margin-top: 3px;">{{model.paper_name}}</view>
								</uni-col>
								<uni-col style="" :span="2">
									<image style="width: 15px;height: 15px;margin-top: 5px; "
										src="/static/images/student_performance/search.png"></image>
								</uni-col>
							</uni-row>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
		</view>
		<u-tabbar-my v-if='navItem.index<5' :list="tabbar"></u-tabbar-my>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import mSteps from '@/components/m-steps/m-steps.vue'
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				navItem: {},
				pageSize: 10,
				semValuesArray: ['单科成绩', '全科成绩', '知识点分析', '错题本'],
				dateEndTime: '',
				semFlag: 0, //点击的seg索引
				semFlag0Data: { //单科成绩
					subList: [], //科目列表
					nowSubject: {}, //当前科目信息
					pageIndex: 1,
					total_page: 0,
					flagRef: 0, //是刷新0，还是加载更多1
					loadMoreText: "加载中...",
					showLoadMore: false,
					sem0List: [] //单科成绩列表
				},
				semFlag1Data: { //全科成绩
					pageIndex: 1,
					total_page: 0,
					flagRef: 0, //是刷新0，还是加载更多1
					loadMoreText: "加载中...",
					showLoadMore: false,
					sem1List: [] //单科成绩列表
				},
				semFlag2Data: { //知识点分析
					subList: [], //科目列表
					nowSubject: {}, //当前科目信息
					zhishidianShow:{},
					zhishidianDFL:{},
					knowData: {
						total_point: '', //本科目知识点总数
						// kc:'',//已考察知识点数量
						// low_score_list:[],//得分率最低的十个知识点
						// heightList:[]//得分率最高的十个知识点
					}
				},
				semFlag3Data: { //错题本
					subList: [], //科目列表
					nowSubject: {}, //当前科目信息
					sumCountQs:{},
					kaoshiQs:{},
					zuoyeQs:{},
					wrongData: {
						zs: '',
						knowWrongList: [], //知识点错题榜
						homeWorkWrongList: [], //考试/作业错题榜
					}
				}
			}
		},
		components: {
			mynavBar,
			mSteps
		},
		onLoad() {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			});
			
			// 获取未读推送消息数的监听
			uni.$on('setPushCount', function(data) {
				_this.tabbar = util.getMenu();
				for (var i = 0; i < _this.tabbar.length; i++) {
					let tempM = _this.tabbar[i];
					if(tempM.access == _this.navItem.access){
						_this.navItem = tempM;
					}
				}
			});
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			console.log('personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getTabbarMenu();
			console.log('this.navItem:' + JSON.stringify(this.navItem));

			// 获取科目列表
			this.getSubList(0, subArray => {
				for (var i = 0; i < subArray.length; i++) {
					var tempM = subArray[i];
					tempM.text = tempM.sub_name;
				}
				this.semFlag0Data.subList = [].concat(subArray);
				if (subArray.length > 0) {
					this.semFlag0Data.nowSubject = subArray[0];
				}
				// 获取单科成绩列表
				this.getSingleSubScore();
			});
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
		},
		onReachBottom() {
			if (this.semFlag == 0) {
				this.semFlag0Data.flagRef = 1;
				if (this.semFlag0Data.total_page < this.semFlag0Data.pageIndex) {
					this.semFlag0Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.semFlag0Data.showLoadMore = true;
				setTimeout(() => {
					this.getSingleSubScore();
				}, 300);
			} else if (this.semFlag == 1) {
				this.semFlag1Data.flagRef = 1;
				if (this.semFlag1Data.total_page < this.semFlag1Data.pageIndex) {
					this.semFlag1Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.semFlag1Data.showLoadMore = true;
				setTimeout(() => {
					this.getSumSubScore();
				}, 300);
			}
		},
		onPullDownRefresh() {
			if (this.semFlag == 0) {
				this.semFlag0Data.loadMoreText = "加载中..."
				this.semFlag0Data.flagRef = 0;
				this.semFlag0Data.pageIndex = 1;
				this.getSingleSubScore();
			} else if (this.semFlag == 1) {
				this.semFlag1Data.loadMoreText = "加载中..."
				this.semFlag1Data.flagRef = 0;
				this.semFlag1Data.pageIndex = 1;
				this.getSumSubScore();
			} else {
				uni.stopPullDownRefresh();
			}
		},
		methods: {
			changeSwiper(e) {
				console.log('changeSwiperchangeSwiper:' + e.index);
				if (this.semFlag == 0) {
					var tempSub = this.semFlag0Data.subList[e.index];
					this.semFlag0Data.nowSubject = tempSub;
					this.semFlag0Data.flagRef = 0; //0刷新1加载更多
					this.semFlag0Data.pageIndex = 1; //
					// 获取单科成绩列表
					this.getSingleSubScore();
				} else if (this.semFlag == 2) {
					var tempSub = this.semFlag2Data.subList[e.index];
					this.semFlag2Data.nowSubject = tempSub;
					// 获取知识点
					this.getKnowPoint();
				} else if (this.semFlag == 3) {
					var tempSub = this.semFlag3Data.subList[e.index];
					this.semFlag3Data.nowSubject = tempSub;
					// 获取错题本
					this.getWrongBook();
				}
			},
			// 获取科目列表
			getSubList(flag, callback) {
				var comData = {
					user_code: this.personInfo.user_code,
					index_code: this.navItem.access.split('#')[1],
				}
				var tempUrl = 'singleSub/subList';
				if (flag == 2) {
					tempUrl = 'point/pointSub';
				} else if (flag == 3) {
					tempUrl = 'errorBook/errorSub';
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + tempUrl, comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						callback(data.data.list);
					} else {
						this.showToast(data.msg);
					}
				});
			},
			clickSingleScore: function(model) {
				model.access = this.navItem.access.split('#')[1];
				console.log('clickSingleScore:'+JSON.stringify(model));
				util.openwithData("/pages/student_performance/singleScore", model);
			},
			clickSumScore: function(model) {
				model.access = this.navItem.access.split('#')[1];
				util.openwithData("/pages/student_performance/sumScore", model);
			},
			clickKnowPointDetail: function(model) { //查看各知识点详情
				model.access = this.navItem.access.split('#')[1];
				model.per_name = this.semFlag2Data.knowData.per_name;
				model.per_code = this.semFlag2Data.knowData.per_code;
				model.nowSubject = this.semFlag2Data.nowSubject;
				model.headTitle = '知识点详情';
				console.log('查看各知识点详情', JSON.stringify(model))
				util.openwithData("/pages/student_performance/zhishidianfenxi_xiangqing", model);
			},
			toDetailPageKnowPointLow: function(tempM, index) { //得分率最低的十个知识点
				var model = {};
				// model.name = tempM.book_catalog_name;
				// model.score_rate = tempM.score_rate;
				// model.id = tempM.book_catalog_id;
				model.flag = 1;
				model.access = this.navItem.access.split('#')[1];
				model.type = 'low';
				model.headTitle = '得分率最低的十个知识点';
				model.bookList = this.semFlag2Data.knowData.low_score_list;
				model.bookIndex = index;
				console.log('得分率最低的十个知识点')
				util.openwithData("/pages/student_performance/zhishidianfenxi", model);
			},
			toDetailPageKnowPointHeight: function(tempM, index) { //得分率最高的十个知识点
				var model = {};
				// model.name = tempM.book_catalog_name;
				// model.score_rate = tempM.score_rate;
				// model.id = tempM.book_catalog_id;
				model.flag = 1;
				model.access = this.navItem.access.split('#')[1];
				model.type = 'height';
				model.headTitle = '得分率最高的十个知识点';
				model.bookList = this.semFlag2Data.knowData.high_score_list;
				model.bookIndex = index;
				console.log('得分率最高的十个知识点')
				util.openwithData("/pages/student_performance/zhishidianfenxi", model);
			},
			clickWrongBookDetail: function(model) { //查看错题详情
				model.access = this.navItem.access.split('#')[1];
				model.per_name = this.semFlag3Data.wrongData.per_name;
				model.per_code = this.semFlag3Data.wrongData.per_code;
				model.nowSubject = this.semFlag3Data.nowSubject;
				model.headTitle = '查看错题';
				console.log('查看查看错题详情', JSON.stringify(model))
				util.openwithData("/pages/student_performance/cuoti_xiangqing", model);
			},
			toDetailPageKnowPointWrong: function(tempM, index) { //知识点错题榜
				console.log('tempM:' + JSON.stringify(tempM));
				var model = {};
				// model.name = tempM.name;
				// model.id = tempM.book_catalog_id;
				model.flag = 2;
				model.access = this.navItem.access.split('#')[1];
				model.headTitle = '知识点错题榜';
				model.bookList = this.semFlag3Data.wrongData.error_point_list;
				model.bookIndex = index;
				console.log('知识点错题榜')
				util.openwithData("/pages/student_performance/zhishidianfenxi", model);
			},
			toDetailPageHomeWorkWrong: function(tempM, index) { //考试/作业错题榜
				console.log('tempM:' + JSON.stringify(tempM));
				var model = {};
				// model.name = tempM.paper_name;
				// model.id = tempM.paper_id;
				model.flag = 3;
				model.access = this.navItem.access.split('#')[1];
				model.headTitle = '考试/作业错题榜';
				model.bookList = this.semFlag3Data.wrongData.error_task_list;
				model.bookIndex = index;
				console.log('考试/作业错题榜')
				util.openwithData("/pages/student_performance/zhishidianfenxi", model);
			},
			clickSeg: function(e) {
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					console.log('this.semFlag:' + e.currentIndex);
					if (this.semFlag == 0) {
						if (this.semFlag0Data.subList.length == 0) {
							// 获取科目列表
							this.getSubList(0, subArray => {
								for (var i = 0; i < subArray.length; i++) {
									var tempM = subArray[i];
									tempM.text = tempM.sub_name;
								}
								this.semFlag0Data.subList = [].concat(subArray);
								if (subArray.length > 0) {
									this.semFlag0Data.nowSubject = subArray[0];
								}
								// 获取单科成绩列表
								this.getSingleSubScore();
							});
						}
					} else if (this.semFlag == 1) {
						if (this.semFlag1Data.sem1List.length == 0) {
							// 获取全科成绩列表
							this.getSumSubScore();
						}
					} else if (this.semFlag == 2) {
						if (this.semFlag2Data.knowData.total_point == '') {
							// 获取科目列表
							this.getSubList(this.semFlag, subArray => {
								for (var i = 0; i < subArray.length; i++) {
									var tempM = subArray[i];
									tempM.text = tempM.sub_name;
								}
								this.semFlag2Data.subList = [].concat(subArray);
								if (subArray.length > 0) {
									this.semFlag2Data.nowSubject = subArray[0];
								}
								// 获取知识点分析
								this.getKnowPoint();
							});
						}
					} else if (this.semFlag == 3) {
						if (this.semFlag3Data.wrongData.zs == '') {
							// 获取科目列表
							this.getSubList(this.semFlag, subArray => {
								for (var i = 0; i < subArray.length; i++) {
									var tempM = subArray[i];
									tempM.text = tempM.sub_name;
								}
								this.semFlag3Data.subList = [].concat(subArray);
								if (subArray.length > 0) {
									this.semFlag3Data.nowSubject = subArray[0];
								}
								// 获取知识点分析
								this.getWrongBook();
							});
						}
					}
				}
			},
			//获取单科成绩
			getSingleSubScore() {
				let comData = {
					user_code: this.personInfo.user_code,
					sub_code: this.semFlag0Data.nowSubject.sub_code,
					page_number: this.semFlag0Data.pageIndex,
					page_size: this.pageSize,
					index_code: this.navItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'singleSub/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag0Data.pageIndex++;
						this.semFlag0Data.total_page = data.data.total_page;
						if (this.semFlag0Data.flagRef == 0) {
							if (data.data.list.length == 0) {
								this.showToast('暂无数据');
							}
							this.semFlag0Data.sem0List = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.semFlag0Data.sem0List = this.semFlag0Data.sem0List.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//获取全科成绩
			getSumSubScore() {
				let comData = {
					user_code: this.personInfo.user_code,
					page_number: this.semFlag1Data.pageIndex,
					page_size: this.pageSize,
					index_code: this.navItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'fullSub/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag1Data.pageIndex++;
						this.semFlag1Data.total_page = data.data.total_page;
						if (this.semFlag1Data.flagRef == 0) {
							if (data.data.list.length == 0) {
								this.showToast('暂无数据');
							}
							this.semFlag1Data.sem1List = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.semFlag1Data.sem1List = this.semFlag1Data.sem1List.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//获取知识点
			getKnowPoint() {
				let comData = {
					user_code: this.personInfo.user_code,
					sub_code: this.semFlag2Data.nowSubject.sub_code,
					index_code: this.navItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'point/subOverview', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag2Data.knowData = data.data;
						this.semFlag2Data.zhishidianDFL = {"series":[{"name":"得分率","data":this.semFlag2Data.knowData.average_score_rate,"color":"#00CFBD"}]};
						this.semFlag2Data.zhishidianShow = {title:{name:(this.semFlag2Data.knowData.average_score_rate*100).toFixed(1)+'%',fontSize:35,color:'#00CFBD'},subtitle:{name:'得分率',color:'#666666',fontSize:15}}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 获取错题本
			getWrongBook() {
				let comData = {
					user_code: this.personInfo.user_code,
					sub_code: this.semFlag3Data.nowSubject.sub_code,
					index_code: this.navItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'errorBook/queryTrends', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag3Data.wrongData = data.data;
						// 
						let datas = [{
							name: "作业错题",
							value: data.data.homework_num
						}, {
							name: "考试错题",
							value: data.data.task_num
						}]
						this.semFlag3Data.sumCountQs = {"series":[{"data":datas}]}
						// 考试趋势
						var kaosArr0 = [];
						var kaosArr1 = [];
						for (var i = 0; i < data.data.task_trends.length; i++) {
							var tempM = data.data.task_trends[i];
							kaosArr0.push('');
							kaosArr1.push(tempM.wrong_num);
						}
						this.semFlag3Data.kaoshiQs = {
							categories: kaosArr0,
							series: [{
								name: "考试错题数量趋势",
								data: kaosArr1
							}]
						}
						// 作业趋势
						var zuoyArr0 = [];
						var zuoyArr1 = [];
						for (var i = 0; i < data.data.homework_trends.length; i++) {
							var tempM = data.data.homework_trends[i];
							zuoyArr0.push('');
							zuoyArr1.push(tempM.wrong_num);
						}
						this.semFlag3Data.zuoyeQs = {
							categories: zuoyArr0,
							series: [{
								name: "作业错题数量趋势",
								data: zuoyArr1
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
	.viewFlag {
		height: 30px !important;
		width: 70px;
		text-align: center;
		padding-top: 5px;
		background: #3aca3a;
		border-radius: 5px;
		color: white;
		font-size: 15px;
	}

	.viewNode {
		font-size: 14px;
		color: #333;
	}

	.leaveDetail {
		font-size: 12px;
		color: #505050;
	}

	/* 间隔 */
	.spaceLine {
		text-align: center;
		padding-top: 10px;
		padding-bottom: 10px;
		background: #d7f3ef;
		font-size: 14px;
		color: #505050;
	}

	.spaceLineName {
		padding-top: 5px;
		padding-left: 20px;
		font-size: 16px;
		color: #000000;
	}

	/* 考试类型对应的图片 */
	.examType {
		color: white;
		float: left;
		width: 40px;
		height: 40px;
		font-size: 14px;
		text-align: center;
		line-height: 40px;
		vertical-align: middle;
		border-radius: 5px;
		margin-top: 0px !important;
		margin-right: 10px !important;
	}

	.contentName {
		font-size: 12px;
	}

	.leaveSum {
		margin-top: 10px;
		margin-left: 20px;
		margin-bottom: 0px;
		font-size: 12px;
		color: #505050;
	}
	
	.charts-box {
		width: 100%;
		height: 330px;
	}
	
	.line {
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #77DDA0;
		margin-top: 30px;
	}
</style>
