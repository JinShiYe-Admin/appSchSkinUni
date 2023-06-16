<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="height: 150px;background: #00CFBD;">
			<image class="perImg" :src="stu_img"></image>
			<view style="text-align: right;margin-right: 40px;color: white;margin-top: -80px;font-size: 13px;">积分：{{totalScore}}
			</view>
			<view style="text-align: center;color: white;font-size: 14px;margin-top: 65px;">{{stu_msg}}</view>
		</view>
		<view>
			<my-segmented-control ref='segmCon' :current="semFlag" :values="semList" @clickItem="clickSeg"
				styleType="text" activeColor="#00CFBD" style="background: white;"></my-segmented-control>
		</view>
		<view class="content" style="">
			<view v-show="semFlag == 0">
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='学业成就'></fileDivider>
					<view v-if="sem0Data.subList.length==0" style="text-align: center;font-size: 13px;">暂无</view>
					<uni-row v-else style="margin-top: 5px;">
						<uni-col :span="12" v-for="(item,index) in sem0Data.subList" :key="index" style="height: 60px;">
								<view style="">
									<view>
										<image class="subImg" src="/static/images/mixedAbl/sub.png"></image>
									</view>
									<view style="color: white;font-size: 13px;margin: -26px 0 0 11px;position: relative;">{{item.sub_name.slice(0,1)}}</view>
								</view>
								<view style="margin: -25px 0 0 45px;font-size: 12px;">{{item.sub_name}}学霸
									<span style="margin: 0 3px 0 3px;"> x </span>
									<span class="countCss">{{item.c}}</span>
								</view>
						</uni-col>
					</uni-row>
				</uni-card>
				<!-- <uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='体育成就'></fileDivider>
					<uni-row style="margin-top: 5px;">
						<uni-col :span="12">
							<view class="rowStyle">请假事由 x <span class="countCss">1</span></view>
						</uni-col>
					</uni-row>
				</uni-card> -->
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='获奖情况'></fileDivider>
					<view v-if="sem0Data.stuHonorList.length==0" style="text-align: center;font-size: 13px;">暂无</view>
					<uni-list v-else>
						<uni-list-item direction='column' v-for="(item,index) in sem0Data.stuHonorList" :key="index">
							<view slot="body">
								<view class="indexCss">{{++index}}</view>
								<view class="titleList">{{item.honor_name}}</view>
								<view style="font-size: 12px;">{{item.honor_level_name}}</view>
								<view style="font-size: 12px;float: right;margin-top: -18px;">{{item.honor_time.split(' ')[0]}}</view>
							</view>
						</uni-list-item>
					</uni-list>
				</uni-card>
				<view class="uni-loadmore" v-if="sem0Data.showLoadMore">{{sem0Data.loadMoreText}}</view>
			</view>
			<view v-show="semFlag == 1">
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='评价统计'></fileDivider>
					<uni-row style="">
						<uni-col :span="8">
							<view class="rowStyleSem1" style="">
								<view class="card-line" style="color: #000000;">{{sem1Data.sumModel.c}}</view>
								<view class="rowStr">评价次数</view>
							</view>
						</uni-col>
						<uni-col :span="8">
							<view class="rowStyleSem1" style="">
								<view class="card-line">{{sem1Data.sumModel.c1}}</view>
								<view class="rowStr">表扬次数</view>
							</view>
						</uni-col>
						<uni-col :span="8">
							<view class="rowStyleSem1" style="">
								<view class="card-line" style="color: #07bdb2;">{{sem1Data.sumModel.c2}}</view>
								<view class="rowStr">批评次数</view>
							</view>
						</uni-col>
						<uni-col :span="8">
							<view class="rowStyleSem1" style="">
								<view class="card-line" style="color: #000000;">{{sem1Data.sumModel.o}}<span style="font-size: 12px;color: #000000;">/{{sem1Data.sumModel.cls_stuc}}</span></view>
								<view class="rowStr">评价次数排名</view>
							</view>
						</uni-col>
						<uni-col :span="8">
							<view class="rowStyleSem1" style="">
								<view class="card-line">{{sem1Data.sumModel.o1}}<span style="font-size: 12px;color: #000000;">/{{sem1Data.sumModel.cls_stuc}}</span></view>
								<view class="rowStr">表扬次数排名</view>
							</view>
						</uni-col>
						<uni-col :span="8">
							<view class="rowStyleSem1" style="">
								<view class="card-line" style="color: #07bdb2;">{{sem1Data.sumModel.o2}}<span style="font-size: 12px;color: #000000;">/{{sem1Data.sumModel.cls_stuc}}</span></view>
								<view class="rowStr">批评次数排名</view>
							</view>
						</uni-col>
					</uni-row>
				</uni-card>
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='表扬分布图'></fileDivider>
					<view class="charts-box" style="margin-left: 10px;min-height: 60px;">
						<qiun-data-charts type="bar"
							:opts="{padding:[20,0,10,0],legend:{show:false,borderWidth:10},extra:{bar:{bar:'stack'},line:{type:'curve'}},dataLabel:false,dataPointShape:false,xAxis:{disabled:true}}"
							:chartData="sem1Data.chartSxlBiaoy" />
					</view>
				</uni-card>
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='批评分布图'></fileDivider>
					<view class="charts-box" style="margin-left: 10px;min-height: 60px;">
						<qiun-data-charts type="bar"
							:opts="{padding:[20,0,10,0],legend:{show:false,borderWidth:10},extra:{bar:{bar:'stack'},line:{type:'curve'}},dataLabel:false,dataPointShape:false,xAxis:{disabled:true}}"
							:chartData="sem1Data.chartSxlPip" />
					</view>
				</uni-card>
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='教师评价'></fileDivider>
					<view v-if="sem1Data.commentList.length==0" style="text-align: center;font-size: 13px;">暂无</view>
					<uni-list v-else>
						<uni-list-item direction='column' v-for="(item,index) in sem1Data.commentList" :key="index">
							<view slot="body">
								<view style="height: 10px;"></view>
								<span class="subTea">{{item.sub_code>0?item.sub_name:''}}
									{{item.create_user_name}}</span>
								<view v-if="item.type>0" style="text-align: right;margin-top: -30px;">
									<view style="margin-top: 10px;margin-right: 30px;">
										<image class="biaoyImg"
											:src="item.type==1?'/static/images/mixedAbl/biaoyang1.jpg':'/static/images/mixedAbl/piping1.jpg'">
										</image>
									</view>
									<view style="margin-top: -25px;">
										<span style="margin: 0 3px 0 3px;"> x </span>
										<span class="countCss">{{item.v}}</span>
									</view>
								</view>
								<view style="font-size: 14px;font-weight: 700;word-break: break-all;margin: 10px 0;">
									{{item.comment}}
								</view>
								<view v-if="item.imgList.length>0">
									<g-upload ref='gUpload' :mode="item.imgList" :control='false' :deleteBtn='false' :columnNum="item.imgList.length==4||item.imgList.length==4?'4':'3'"></g-upload>
								</view>
								<view style="font-size: 12px;margin-top: 0px;">{{item.create_time}}</view>
							</view>
						</uni-list-item>
					</uni-list>
				</uni-card>
				<view class="uni-loadmore" v-if="sem1Data.showLoadMore">{{sem1Data.loadMoreText}}</view>
			</view>
			<view v-show="semFlag == 2">
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='年级排名趋势'></fileDivider>
					<view class="charts-box" style="">
						<qiun-data-charts type="line"
							:opts="{padding:[20,0,10,0],legend:{show:false,borderWidth:10},extra:{column:{categoryGap:1},line:{type:'curve'}},dataLabel:false,dataPointShape:false,xAxis:{disabled:true},yAxis:{data:[{min:sem2Data.chartGrdMax,max:0}]}}"
							:chartData="sem2Data.chartSxlGrd" />
					</view>
				</uni-card>
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='总分趋势'></fileDivider>
					<view class="charts-box" style="">
						<qiun-data-charts type="line"
							:opts="{padding:[20,0,10,0],legend:{show:false,borderWidth:10},extra:{column:{categoryGap:1},line:{type:'curve'}},dataLabel:false,dataPointShape:false,xAxis:{disabled:true}}"
							:chartData="sem2Data.chartSxlSumScore" />
					</view>
				</uni-card>
				<uni-card isShadow style="margin: 10px 5px 0;" v-for="(item,index) in sem2Data.chartSxlSubList" :key="index">
					<fileDivider :titleStr='item.sub_name'></fileDivider>
					<view class="charts-box" style="">
						<qiun-data-charts type="line"
							:opts="{padding:[20,0,10,0],legend:{show:false,borderWidth:10},extra:{column:{categoryGap:1},line:{type:'curve'}},dataLabel:false,dataPointShape:false,xAxis:{disabled:true}}"
							:chartData="item.sub_charSxl" />
					</view>
				</uni-card>
			</view>
			<view v-show="semFlag == 3">
				<uni-card isShadow style="margin: 10px 5px 0;">
					<fileDivider titleStr='考勤统计'></fileDivider>
					<view class="charts-box" style="">
						<qiun-data-charts type="column"
							:opts="{padding:[20,0,10,0],legend:{show:false,borderWidth:10},extra:{column:{categoryGap:1},line:{type:'curve'}},dataLabel:false,dataPointShape:false,xAxis:{disabled:true}}"
							:chartData="sem3Data.chartSxlKQ" />
					</view>
				</uni-card>
			</view>
			<view v-show="semFlag == 4"></view>
		</view>
		<view style="height: 50px;background: #f2f2f2;"></view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import fileDivider from "@/components/fileDivider/fileDivider";
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				semFlag: 0, //点击的seg索引
				stu_code:'',
				cls_code:'',
				stu_msg:'',
				stu_img:'',
				index_code:'',
				semList: [{
					name: '荣誉'
				}, {
					name: '评价'
				}, {
					name: '学业'
				}, {
					name: '德育'
				}, 
				// {
				// 	name: '体质'
				// },
				],
				totalScore:0,
				sem0Data: {
					subList:[],
					stuHonorList: [], //学生获奖列表
					flagRef: 0, //0刷新1加载更多
					pageIndex: 1,
					total_page: 0, //总页数
					loadMoreText: "加载中...",
					showLoadMore: false,
				},
				sem1Data: {
					sumModel: {}, //评价统计
					chartSxlBiaoy:{},
					chartSxlPip:{},
					commentList: [], //教师评价列表
					flagRef: 0, //0刷新1加载更多
					pageIndex: 1,
					total_page: 0, //总页数
					loadMoreText: "加载中...",
					showLoadMore: false,
				},
				sem2Data: {
					chartSxlGrd: {},
					chartGrdMax:0,
					chartSxlSumScore: {},
					chartSxlSubList: [],
				},
				sem3Data: {
					chartSxlKQ: {},
				}


			}
		},
		components: {
			mynavBar,
			fileDivider
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			
			if (this.navItem.flag&&this.navItem.flag == 1) {
				this.stu_code = this.navItem.stu_code;
				this.cls_code = this.navItem.cls_code;
				this.stu_msg = this.navItem.stu_msg;
				this.stu_img = 'https://www.108800.com/user.jpg';
				this.index_code = this.navItem.index_code;
				this.navItem.text = '成长档案';
				var comData5 = {
					user_type_code:'YHLX0005',
					user_code: this.stu_code,
					index_code: this.index_code,
				}
				//1.42.根据用户类型及代码查询教师/学生信息
				this.post(this.globaData.INTERFACE_HR_SUB +'user/getUserInfoByTypeAndCode', comData5, (data0, data) => {
					if (data.code == 0) {
						if (data.data.img_url) {
							this.stu_img = data.data.img_url;
						}
					}
				});
			} else{
				this.stu_code = this.personInfo.stu_code;
				this.cls_code = this.personInfo.cls_code;
				this.stu_img = this.personInfo.stu_img;
				this.stu_msg = this.personInfo.grd_name+' '+this.personInfo.cls_name+' '+this.personInfo.stu_name;
				this.index_code = this.navItem.access.split("#")[1];
			}
			this.getCountByStu();
			this.getStuTotalScore();
			this.getSemFlag0HonorPage();
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			//#ifdef H5
			document.title = "";
			//#endif
			//
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			clickSeg: function(e) {
				this.semFlag = e.currentIndex;
				if (this.semFlag == 1) {
					if (this.sem1Data.sumModel.stu_code == null) {
						this.getSemFlag1StuComment();
					}
					if (this.sem1Data.commentList.length == 0) {
						this.getSemFlag1CommentPage();
					}
				} else if (this.semFlag == 0) {
					if (this.sem0Data.stuHonorList.length == 0) {
						this.getSemFlag0HonorPage();
					}
				} else if (this.semFlag == 2) {
					if (this.sem2Data.chartGrdMax == 0) {
						this.getStuScore();
					}
				} else if (this.semFlag == 3) {
					if (!this.sem3Data.chartSxlKQ.categories) {
						this.getKaoqing();
					}
				} else if (this.semFlag == 4) {

				}
			},
			getStuTotalScore(){
				let comData = {
					stu_code: this.stu_code,
					index_code: this.index_code,
				}
				// 1.5.学生评价统计
				this.post(this.globaData.INTERFACE_ZHSZM + 'stuScore/getStuTotalScore', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.totalScore = data.data.total_score?data.data.total_score:0;
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getSemFlag0HonorPage() {
				let comData = {
					page_size: 10,
					page_number: this.sem0Data.pageIndex,
					stu_code: this.stu_code,
					index_code: this.index_code,
				}
				// 1.4.学生获得评语分页
				this.post(this.globaData.INTERFACE_ZHSZM + 'stuHonor/pageByStuCode', comData, (data0, data) => {
					this.hideLoading();
					uni.stopPullDownRefresh();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							if (tempM.honor_level == 1) {
								tempM.honor_level_name = '个人';
							} else if (tempM.honor_level == 5) {
								tempM.honor_level_name = '班级';
							} else if (tempM.honor_level == 9) {
								tempM.honor_level_name = '校级';
							} else if (tempM.honor_level == 13) {
								tempM.honor_level_name = '城区级';
							} else if (tempM.honor_level == 17) {
								tempM.honor_level_name = '市级';
							} else if (tempM.honor_level == 19) {
								tempM.honor_level_name = '省级';
							}
						}
						this.sem0Data.pageIndex++;
						this.sem0Data.total_page = data.data.total_page;
						if (this.sem0Data.flagRef == 0) {
							if (data.data.list.length == 0) {
								// this.showToast('暂无数据');
							}
							this.sem0Data.stuHonorList = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.sem0Data.stuHonorList = this.sem0Data.stuHonorList.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getCountByStu(){
				let comData = {
					stu_code: this.stu_code,
					index_code: this.index_code,
				}
				// 3.1.获取学生学业   成就统计
				this.post(this.globaData.INTERFACE_ZHSZM + 'stuExam/getCountByStu', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.sem0Data.subList = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//学业
			getStuScore() {
				var comData = {
					index_code: this.index_code,
					stu_code: this.stu_code
				}
				this.showLoading();
				// 12、学生成绩趋势
				this.post(this.globaData.INTERFACE_EXAMINATION + 'stuScoreTrend', comData, (data0, data) => {
					this.hideLoading();
					uni.stopPullDownRefresh();
					if (data.code == 0) {
						this.sem2Data.chartSxlSubList = [];
						var tempArr0 = [];
						var tempArr1 = [];
						var tempArr2 = [];
						if (data.data.full_list) {
							for (var a = 0; a < data.data.full_list.length; a++) {
								var tempM = data.data.full_list[a];
								tempArr0.push(tempM.name);
								tempArr1.push(tempM.grd_order);
								tempArr2.push(parseFloat(tempM.sub_score));
								this.sem2Data.chartGrdMax=tempM.grd_order>this.sem2Data.chartGrdMax?tempM.grd_order:this.sem2Data.chartGrdMax;
							}
						}
						// console.log('this.sem2Data.chartGrdMax:'+this.sem2Data.chartGrdMax)
						this.sem2Data.chartSxlGrd = {
							categories: tempArr0,
							series: [{
								name: "",
								data: tempArr1
							}]
						}
						this.sem2Data.chartSxlSumScore = {
							categories: tempArr0,
							series: [{
								name: "",
								data: tempArr2
							}]
						}
						if (data.data.single_list) {
							for (var a = 0; a < data.data.single_list.length; a++) {
								var tempM = data.data.single_list[a];
								var tempSubModel = {
									sub_name:tempM.sub_name,
									sub_charSxl:{}
								}
								var tempA0 = [];var tempA1 = [];
								for (var i = 0; i < tempM.list.length; i++) {
									tempA0.push(tempM.list[i].name);
									tempA1.push(parseFloat(tempM.list[i].sub_score));
								}
								tempSubModel.sub_charSxl = {
									categories: tempA0,
									series: [{
										name: "",
										data: tempA1
									}]
								}
								this.sem2Data.chartSxlSubList.push(tempSubModel);
							}
							// console.log('this.sem2Data.chartSxlSubList:'+JSON.stringify(this.sem2Data.chartSxlSubList))
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 获取考勤统计
			getKaoqing() {
				var comData = {
					index_code: this.index_code,
					// begintime: start_month, //
					// endtime: end_month,
					stu_code: this.stu_code
				}
				this.showLoading();
				// 116.考勤报表-单个学生考核
				this.post(this.globaData.INTERFACE_WORK + 'AttendanceReport/statisticsAttendance4Student', comData, (data0,
					data) => {
					this.hideLoading();
					uni.stopPullDownRefresh();
					if (data.code == 0) {
						var tempArr0 = [];
						var tempArr1 = [];
						if (data.data.static) {
							for (var a = 0; a < data.data.qaArray.length; a++) {
								var tempM = data.data.qaArray[a];
								tempArr0.push(tempM.text + '（次）');
								tempArr1.push(data.data.static[tempM.value]);
							}
						}

						this.sem3Data.chartSxlKQ = {
							categories: tempArr0,
							series: [{
								name: "",
								data: tempArr1
							}]
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 获取评价统计
			getSemFlag1StuComment() {
				let comData = {
					cls_code: this.cls_code,
					stu_code: this.stu_code,
					index_code: this.index_code,
				}
				// 1.5.学生评价统计
				this.post(this.globaData.INTERFACE_ZHSZM + 'stuComment/getStuComment', comData, (data0, data) => {
					this.hideLoading();
					uni.stopPullDownRefresh();
					if (data.code == 0) {
						this.sem1Data.sumModel = data.data;
						// 
						var tempArr0 = [];
						var tempArr1 = [];
						var tempArr2 = [];
						if (data.data.sub_comment_num_list) {
							for (var a = 0; a < data.data.sub_comment_num_list.length; a++) {
								var tempM = data.data.sub_comment_num_list[a];
								tempArr0.push(tempM.sub_name);
								tempArr1.push(tempM.c1);
								tempArr2.push(tempM.c2);
							}
						}
						
						this.sem1Data.chartSxlBiaoy = {
							categories: tempArr0,
							series: [{
								name: "",
								data: tempArr1
							}]
						}
						this.sem1Data.chartSxlPip = {
							categories: tempArr0,
							series: [{
								name: "",
								data: tempArr2
							}]
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			// 获取教师评价列表
			getSemFlag1CommentPage() {
				let comData = {
					page_size: 10,
					page_number: this.sem1Data.pageIndex,
					stu_code: this.stu_code,
					index_code: this.index_code,
				}
				// 1.4.学生获得评语分页
				this.post(this.globaData.INTERFACE_ZHSZM + 'stuComment/pageByStuCode', comData, (data0, data) => {
					this.hideLoading();
					uni.stopPullDownRefresh();
					if (data.code == 0) {
						this.sem1Data.pageIndex++;
						this.sem1Data.total_page = data.data.total_page;
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM0 = data.data.list[i];
							let tempImgArr = [];
							for (var a = 0; a < tempM0.files.length; a++) {
								tempImgArr.push(tempM0.files[a].url);
							}
							tempM0.imgList = tempImgArr;
						}
						if (this.sem1Data.flagRef == 0) {
							if (data.data.list.length == 0) {
								// this.showToast('暂无数据');
							}
							this.sem1Data.commentList = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.sem1Data.commentList = this.sem1Data.commentList.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			}
		},
		onReachBottom() {
			if (this.semFlag == 0) {
				if (this.sem0Data.total_page < this.sem0Data.pageIndex) {
					this.sem0Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.sem0Data.flagRef = 1;
				this.sem0Data.showLoadMore = true;
				setTimeout(() => {
					this.getSemFlag0HonorPage();
				}, 300);
			} else if (this.semFlag == 1) {
				if (this.sem1Data.total_page < this.sem1Data.pageIndex) {
					this.sem1Data.loadMoreText = "没有更多数据了!"
					return;
				}
				this.sem1Data.flagRef = 1;
				this.sem1Data.showLoadMore = true;
				setTimeout(() => {
					this.getSemFlag1StuComment();
					this.getSemFlag1CommentPage();
				}, 300);
			}
		},
		onPullDownRefresh() {
			if (this.semFlag == 0) {
				this.sem0Data.loadMoreText = "加载中..."
				this.sem0Data.flagRef = 0;
				this.sem0Data.pageIndex = 1;
				this.getSemFlag0HonorPage();
			} else if (this.semFlag == 1) {
				this.sem1Data.loadMoreText = "加载中..."
				this.sem1Data.flagRef = 0;
				this.sem1Data.pageIndex = 1;
				this.getSemFlag1StuComment();
				this.getSemFlag1CommentPage();
			} else if (this.semFlag == 2) {
				this.getStuScore();
			} else if (this.semFlag == 3) {
				this.getKaoqing();
			} else if (this.semFlag == 4) {

			}
		},
	}
</script>

<style>
	.card-line1 {
		text-align: center;
		font-size: 16px;
		color: #7f7f7f;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid #aaaaaa;
		width: 100px;
		margin-left: calc((100% - 200px)/2);
	}

	.card-line2 {
		text-align: center;
		font-size: 16px;
		color: #7f7f7f;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid #aaaaaa;
		width: 100px;
		margin-right: calc((100% - 200px)/2);
		float: right;
		margin-top: -24px;
	}

	.semFlagSelect {
		color: #008080;
		border-bottom: 2px solid #008080;
	}

	.rowStyle {
		font-size: 12px;
		height: 50px;
	}

	.perImg {
		width: 80px;
		height: 80px;
		margin-left: calc((100% - 80px)/2);
		margin-top: 30px;
		border-radius: 50%;
	}

	::v-deep .segmented-control {
		height: 45px;
	}

	.segmented-control {
		margin: 0px;
	}

	::v-deep .uni-badge--x {
		margin-left: -5px;
	}

	.countCss {
		font-size: 14px;
		color: #d9001b;
		font-weight: 700;
		margin-left: 5px;
	}

	.titleList {
		margin: -20px -10px 10px 30px;
		font-size: 14px;
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.indexCss {
		margin-top: 5px;
		border-radius: 50%;
		height: 20px;
		width: 20px;
		text-align: center;
		background: #f59a23;
		color: white;
		font-size: 13px;
	}

	.rowStyleSem1 {
		width: 90px;
		height: 90px;
		border-radius: 5px;
		background: #f2f2f2;
		float: left;
		margin-bottom: 15px;
		margin-left: calc((100% - 90px)/2);
	}

	.card-line {
		text-align: center;
		font-size: 25px;
		color: #d9001b;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid green;
		width: 70px;
		margin-left: calc((100% - 70px)/2);
	}

	.rowStr {
		font-size: 12px;
		text-align: center;
		margin-top: 7px;
	}

	.subTea {
		font-size: 14px;
		background: #d5f0e9;
		border-radius: 18px;
		padding: 4px 20px;
		color: #000000;
		margin-top: 15px;
	}

	.biaoyImg {
		width: 20px;
		height: 20px;
	}
	
	.subImg {
		width: 36px;
		height: 42px;
	}

	::v-deep .uni-grid-item--border {
		border-bottom: 0px !important;
		border-right: 0px !important;
	}

	::v-deep .uni-grid-item--border-top {
		border-top: 0px !important;
	}

	::v-deep .uni-grid--border {
		border-left: 0px !important;
	}

	.gridBox {
		height: 40px;
		background-color: #f2f2f2;
		text-align: center;
		padding: 5px 5px 0px;
		margin: 5px;
		border-radius: 3px;
		color: #333333;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.charts-box{
		min-height: 80px;
	}
</style>