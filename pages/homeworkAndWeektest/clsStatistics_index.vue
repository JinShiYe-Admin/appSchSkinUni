<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<view style="font-size: 14px;text-align: center;padding-top: 5px;">{{grdArray[grdIndex].name}} {{clsArray[clsIndex].name}} {{subArray[subIndex].name}} 作业统计</view>
			<view style="font-size: 12px;text-align: center;color: gray;">{{yearList[yearIndex].year_name}} {{termList[termIndex].term_name}}</view>
			<uni-icons style="float: right;margin: -30px 10px 0 0;color: #00CFBD;" type="list" size="30"
				@click="clickShowSelect()"></uni-icons>
			<my-segmented-control ref='segmCon' :current="semFlag" :values="itemData.childList" @clickItem="clickSeg"
				styleType="text" activeColor="#00CFBD"></my-segmented-control>
		</view>
		<view class="content" style="margin-top: 80px;">
			<view v-show="semFlag == 0" style="">
				<view class="example-body">
					<uni-card isShadow :isFull="true" style="margin-top: 0px;">
						<text class="content-box-text">
							<uni-row style="background-color: #e5e3e3;height: 40px;margin: 0px -12px 0 -12px;">
								<uni-col style="" :span="7">
									<p class="scoreDetail">作业名称</p>
								</uni-col>
								<uni-col style="" :span="4">
									<p class="scoreDetail">已交人数</p>
								</uni-col>
								<uni-col style="" :span="4">
									<p class="scoreDetail">未交人数</p>
								</uni-col>
								<uni-col style="" :span="3">
									<p class="scoreDetail">最高分</p>
								</uni-col>
								<uni-col style="" :span="3">
									<p class="scoreDetail">最低分</p>
								</uni-col>
								<uni-col style="" :span="3">
									<p class="scoreDetail">平均分</p>
								</uni-col>
							</uni-row>
							<uni-row v-for="(model,index) in semFlag0Data.dataList" :key="index" style="margin: 0px -8px 0 -8px;">
								<uni-col style="" :span="7">
									<p class="stuScoreDetail">{{model.name}}</p>
									<!-- <view style="height: 0.5px;background-color: #00cfbd;margin: 5px -999px 0 10px;"></view> -->
									<view class="card-line" style="margin-left: 10px;"></view>
								</uni-col>
								<uni-col style="" :span="4">
									<p class="stuScoreDetail">{{model.count}}</p>
								</uni-col>
								<uni-col style="" :span="4">
									<p class="stuScoreDetail" v-if='model.miss_count == 0'>{{model.miss_count}}</p>
									<p class="stuScoreDetail" v-if='model.miss_count > 0' style='color: #FAA666;'
										@click='clickMissStu(model.miss_stu_nameStr)'>{{model.miss_count}}</p>
								</uni-col>
								<uni-col style="" :span="3">
									<p class="stuScoreDetail">{{model.max_score}}</p>
								</uni-col>
								<uni-col style="" :span="3">
									<p class="stuScoreDetail">{{model.min_score}}</p>
								</uni-col>
								<uni-col style="" :span="3">
									<p class="stuScoreDetail">{{model.avg_score}}</p>
								</uni-col>
							</uni-row>
							<view class="uni-loadmore" v-if="semFlag0Data.showLoadMore">{{semFlag0Data.loadMoreText}}</view>
						</text>
					</uni-card>
				</view>
			</view>
			<view v-show="semFlag == 1">
				<view class="example-body">
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<text class="content-box-text">
							<view class="card-title">薄弱知识点榜</view>
							<uni-list>
								<uni-list-item :border="false" v-for="(model,index) in semFlag1Data.bad_list"
									:key='index' direction='column' clickable @click="toDetailPageKnowPoint(model,1)">
									<view slot="body">
										<uni-row style="">
											<uni-col style="" :span="2">
												<view
													style="padding: 1px;margin-top: 0px;width: 20px;height: 20px;font-size: 14px;">
													{{index+1}}
												</view>
												<view class="card-line"></view>
											</uni-col>
											<uni-col style="" :span="20">
												<view
													style="font-size: 13px;margin-top: 3px;text-align: center;color: #F86A6A;">
													{{model.knowledge_name}}
												</view>
											</uni-col>
											<uni-col style="" :span="2">
												<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
													size="20"></uni-icons>
											</uni-col>
										</uni-row>
									</view>
								</uni-list-item>
							</uni-list>
							<view v-if="semFlag1Data.bad_list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</text>
					</uni-card>
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<text class="content-box-text">
							<view class="card-title">牢固知识点榜</view>
							<uni-list>
								<uni-list-item :border="false" v-for="(model,index) in semFlag1Data.good_list"
									:key='index' direction='column' clickable @click="toDetailPageKnowPoint(model,1)">
									<view slot="body">
										<uni-row style="">
											<uni-col style="" :span="2">
												<view
													style="padding: 1px;margin-top: 0px;width: 20px;height: 20px;font-size: 14px;">
													{{index+1}}
												</view>
												<view class="card-line"></view>
											</uni-col>
											<uni-col style="" :span="20">
												<view
													style="font-size: 13px;margin-top: 3px;text-align: center;color: #499DF8;">
													{{model.knowledge_name}}
												</view>
											</uni-col>
											<uni-col style="" :span="2">
												<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
													size="20"></uni-icons>
											</uni-col>
										</uni-row>
									</view>
								</uni-list-item>
							</uni-list>
							<view v-if="semFlag1Data.good_list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</text>
					</uni-card>
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<text class="content-box-text">
							<view class="card-title">各知识点详情</view>
							<view class="card-line"></view>
							<uni-row style="font-size: 13px;margin-top: 7px;margin-bottom: 7px;">
								<uni-col style="" :span="10">
									<view>请选择知识点大类</view>
								</uni-col>
								<uni-col style="text-align: right;" :span="14">
									<view style="color: gray;" @click="openLevel">{{semFlag1Data.pickerStr}}
										<uni-icons style="font-size: 14px;" type="arrowdown" size="20"></uni-icons>
									</view>
									<level-linkage v-if="semFlag1Data.treeData.length>0" ref="levelLinkage"
										:pickerValueDefault="semFlag1Data.pickerValueDefault"
										:allData="semFlag1Data.treeData" @onConfirm="onConfirm" themeColor='#007AFF'>
									</level-linkage>
								</uni-col>
							</uni-row>
							<uni-row style="margin: 15px -12px 0 -12px;background-color: #e5e3e3;height: 40px;">
								<uni-col style="" :span="11">
									<p class="scoreDetail">知识点名称</p>
								</uni-col>
								<uni-col style="" :span="5">
									<p class="scoreDetail">考查次数</p>
								</uni-col>
								<uni-col style="" :span="5">
									<p class="scoreDetail">平均得分率</p>
								</uni-col>
								<uni-col style="" :span="3">
									<p class="scoreDetail"> </p>
								</uni-col>
							</uni-row>
							<uni-row v-for="(model,index) in semFlag1Data.catalog_list" :key="index"
								style="margin: 5px -12px 0 -12px;">
								<view @click="toDetailPageKnowPoint(model,1)">
									<uni-col style="" :span="11">
										<p class="stuScoreDetail">{{model.name}}</p>
										<view class="card-line" style="margin-left: 10px;"></view>
									</uni-col>
									<uni-col style="" :span="5">
										<p class="stuScoreDetail">{{model.count?model.count:0}}</p>
									</uni-col>
									<uni-col style="" :span="5">
										<p class="stuScoreDetail">{{model.radio?model.radio:0}}</p>
									</uni-col>
									<uni-col style="" :span="3">
										<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright" size="20">
										</uni-icons>
									</uni-col>
								</view>
							</uni-row>
							<view v-if="semFlag1Data.catalog_list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</text>
					</uni-card>
				</view>
			</view>
			<view v-show="semFlag == 2">
				<view class="example-body">
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<text class="content-box-text">
							<view class="card-title">薄弱知识点榜</view>
							<uni-list>
								<uni-list-item :border="false" v-for="(model,index) in semFlag2Data.bad_list"
									:key='index' direction='column' clickable @click="toDetailPageKnowPoint(model,2)">
									<view slot="body">
										<uni-row style="">
											<uni-col style="" :span="2">
												<view
													style="padding: 1px;margin-top: 0px;width: 20px;height: 20px;font-size: 14px;">
													{{index+1}}
												</view>
												<view class="card-line"></view>
											</uni-col>
											<uni-col style="" :span="20">
												<view
													style="font-size: 13px;margin-top: 3px;text-align: center;color: #F86A6A;">
													{{model.question_type_name}}
												</view>
											</uni-col>
											<uni-col style="" :span="2">
												<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
													size="20"></uni-icons>
											</uni-col>
										</uni-row>
									</view>
								</uni-list-item>
							</uni-list>
							<view v-if="semFlag2Data.bad_list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</text>
					</uni-card>
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<text class="content-box-text">
							<view class="card-title">牢固知识点榜</view>
							<uni-list>
								<uni-list-item :border="false" v-for="(model,index) in semFlag2Data.good_list"
									:key='index' direction='column' clickable @click="toDetailPageKnowPoint(model,2)">
									<view slot="body">
										<uni-row style="">
											<uni-col style="" :span="2">
												<view
													style="padding: 1px;margin-top: 0px;width: 20px;height: 20px;font-size: 14px;">
													{{index+1}}
												</view>
												<view class="card-line"></view>
											</uni-col>
											<uni-col style="" :span="20">
												<view
													style="font-size: 13px;margin-top: 3px;text-align: center;color: #499DF8;">
													{{model.question_type_name}}
												</view>
											</uni-col>
											<uni-col style="" :span="2">
												<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright"
													size="20"></uni-icons>
											</uni-col>
										</uni-row>
									</view>
								</uni-list-item>
							</uni-list>
							<view v-if="semFlag2Data.good_list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</text>
					</uni-card>
					<uni-card isShadow :isFull="true" style="margin-top: 10px;">
						<text class="content-box-text">
							<view class="card-title">各知识点详情</view>
							<view class="card-line"></view>
							<uni-row style="margin: 15px -12px 0 -12px;background-color: #e5e3e3;height: 40px;">
								<uni-col style="" :span="11">
									<p class="scoreDetail">知识点名称</p>
								</uni-col>
								<uni-col style="" :span="5">
									<p class="scoreDetail">考查次数</p>
								</uni-col>
								<uni-col style="" :span="5">
									<p class="scoreDetail">平均得分率</p>
								</uni-col>
								<uni-col style="" :span="3">
									<p class="scoreDetail"> </p>
								</uni-col>
							</uni-row>
							<uni-row v-for="(model,index) in semFlag2Data.list" :key="index"
								style="margin: 5px -12px 0 -12px;">
								<view @click="toDetailPageKnowPoint(model,2)">
									<uni-col style="" :span="11">
										<p class="stuScoreDetail">{{model.question_type_name}}</p>
										<view class="card-line" style="margin-left: 10px;"></view>
									</uni-col>
									<uni-col style="" :span="5">
										<p class="stuScoreDetail">{{model.count?model.count:0}}</p>
									</uni-col>
									<uni-col style="" :span="5">
										<p class="stuScoreDetail">{{model.radio?model.radio:0}}</p>
									</uni-col>
									<uni-col style="" :span="3">
										<uni-icons style="font-size: 14px;margin-left: 10px;" type="arrowright" size="20">
										</uni-icons>
									</uni-col>
								</view>
							</uni-row>
							<view v-if="semFlag2Data.list.length==0"
								style="text-align: center;font-size: 14px;margin-top: 5px;">暂无</view>
						</text>
					</uni-card>
				</view>
			</view>
		</view>
		<uni-popup ref="popupNames" type="center" style="background-color: white;">
			<view
				style="background-color: white;padding: 10px;border-radius: 5px;margin-left: 20px;margin-right: 20px;">
				<view style="margin-top: 20px;text-align: center;">未交人员名单</view>
				<view style="margin-top: 20px;color: gray;font-size: 13px;">{{semFlag0Data.miss_stu_nameStr}}</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupSelect" type="center" style="background-color: white;">
			<scroll-view
				style="background-color: white;padding: 10px;border-radius: 5px 5px 0px 0px;width: 300px;height: 450px;"
				class="popupSelect" scroll-y="true">
				<view class="pupName">学年</view>
				<uni-row>
					<uni-col :span="12" v-for="(model,index) in yearList" :key="index">
						<view :class="index == yearIndexTemp?'popSelect':'popNoSelect'" @click="clickYear(index)">
							{{model.year_name}}
						</view>
					</uni-col>
				</uni-row>
				<view class="pupName">学期</view>
				<uni-row>
					<uni-col :span="12" v-for="(model,index) in termList" :key="index">
						<view :class="index == termIndexTemp?'popSelect':'popNoSelect'" @click="clickTerm(index)">
							{{model.term_name}}
						</view>
					</uni-col>
				</uni-row>
				<view class="pupName">年级</view>
				<uni-row>
					<uni-col :span="12" v-for="(model,index) in grdArray" :key="index">
						<view :class="index == grdIndexTemp?'popSelect':'popNoSelect'" @click="clickGrd(index)">
							{{model.name}}
						</view>
					</uni-col>
				</uni-row>
				<view class="pupName">班级</view>
				<uni-row>
					<uni-col :span="12" v-for="(model,index) in clsArrayTemp" :key="index">
						<view :class="index == clsIndexTemp?'popSelect':'popNoSelect'" @click="clickCls(index)">
							{{model.name}}
						</view>
					</uni-col>
				</uni-row>
				<view class="pupName">科目</view>
				<uni-row>
					<uni-col :span="12" v-for="(model,index) in subArrayTemp" :key="index">
						<view :class="index == subIndexTemp?'popSelect':'popNoSelect'" @click="clickSub(index)">
							{{model.name}}
						</view>
					</uni-col>
				</uni-row>
			</scroll-view>
			<view style="background-color: white;height: 50px;border-radius: 0px 0px 5px 5px;">
				<button class="mini-btn" type="default" size="mini" @click="popSure(0)">取消</button>
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
					@click="popSure(1)">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import levelLinkage from "@/components/three-level-linkage/linkage.nvue"
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				pageSize: 20,
				semFlag: 0, //点击的seg索引
				yearList: [{ //学年列表
					year_code: '',
					year_name: '全部学年'
				}],
				yearIndex: 0,
				yearIndexTemp: 0,
				termList: [{ //学期列表
					term_code: '',
					term_name: '全部学期'
				}],
				termIndex: 0,
				termIndexTemp: 0,
				grdIndex: 0,
				grdIndexTemp: 0,
				clsIndex: 0,
				clsIndexTemp: 0,
				subIndex: 0,
				subIndexTemp: 0,
				grdArray: [{
					name: '',
					value: '-1'
				}],
				clsArray: [{
					name: '',
					value: '-1'
				}],
				clsArrayTemp: [{
					name: '',
					value: '-1'
				}],
				subArray: [{
					name: '',
					value: '-1'
				}],
				subArrayTemp: [{
					name: '',
					value: '-1'
				}],
				semFlag0Data: { //
					miss_stu_nameStr: '', //
					flagRef: 0, //0刷新1加载更多
					pageIndex: 1,
					total_page: 0, //总页数
					loadMoreText: "加载中...",
					showLoadMore: false,
					dataList: []
				},
				semFlag1Data: { //
					bad_list: [],
					good_list: [],
					catalog_list: [],
					pickerValueDefault: [0, 0, -1],
					treeData: [],
					pickerStr: ''
				},
				semFlag2Data: {
					bad_list: [],
					good_list: [],
					list: [],
				}
			}
		},
		components: {
			mynavBar,
			levelLinkage
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			let tempM = util.getPageData(option);
			tempM.index = 100;
			tempM.childList = [{
				name: '上交统计'
			}, {
				name: '班级知识点分析'
			}, {
				name: '班级题型分析'
			}];
			this.itemData = tempM;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//获取学年
			this.getYear();
			//获取学期
			this.getTerm();
			//获取年级
			this.getGrd(1);
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
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
					this.getClsAnalysisList();
				}, 300);
			} else if (this.semFlag == 1) {
				
			} else if (this.semFlag == 2) {
				
			}
		},
		onPullDownRefresh() {
			if (this.semFlag == 0) {
				this.semFlag0Data.loadMoreText = "加载中..."
				this.semFlag0Data.flagRef = 0;
				this.semFlag0Data.pageIndex = 1;
				this.getClsAnalysisList();
			} else if (this.semFlag == 1) {
				this.getKnowledgeAnalysis();
			} else if (this.semFlag == 2) {
				this.getQuestionTypeAnalysis();
			}
		},
		methods: {
			toDetailPageKnowPoint(model,flag){
				model.index_code = this.itemData.access.split('#')[1];
				if(flag == 1){
					model.text = '班级知识点分析';
				}else{
					model.text = '班级题型分析';
				}
				model.cls_code = this.clsArray[this.clsIndex].value;
				model.flag = 0;//0班级，1学生
				console.log('model:'+JSON.stringify(model));
				if(model.count){
					util.openwithData("/pages/homeworkAndWeektest/correct_analyseDetail", model);
				}else{
					this.showToast('暂无记录')
				}
			},
			clickYear(index) {
				this.yearIndexTemp = index;
			},
			clickTerm(index) {
				this.termIndexTemp = index;
			},
			clickGrd(index) {
				this.grdIndexTemp = index;
				this.getCls(0);
			},
			clickCls(index) {
				this.clsIndexTemp = index;
				this.getSub(0);
			},
			clickSub(index) {
				this.subIndexTemp = index;
			},
			popSure(flag) {
				if (flag == 0) {
					this.yearIndexTemp = this.yearIndex;
					this.termIndexTemp = this.termIndex;
					this.grdIndexTemp = this.grdIndex;
					this.clsIndexTemp = this.clsIndex;
					this.subIndexTemp = this.subIndex;
					this.clsArrayTemp = [].concat(this.clsArray);
					this.subArrayTemp = [].concat(this.subArray);
				} else {
					this.yearIndex = this.yearIndexTemp;
					this.termIndex = this.termIndexTemp;
					this.grdIndex = this.grdIndexTemp;
					this.clsIndex = this.clsIndexTemp;
					this.subIndex = this.subIndexTemp;
					this.clsArray = [].concat(this.clsArrayTemp);
					this.subArray = [].concat(this.subArrayTemp);
					this.semFlag0Data.dataList = [];
					this.semFlag0Data.flagRef = 0;
					this.semFlag0Data.pageIndex = 1;
					this.semFlag0Data.total_page = 0;
					this.semFlag1Data.bad_list = [];
					this.semFlag1Data.good_list = [];
					this.semFlag1Data.catalog_list = [];
					this.semFlag1Data.pickerValueDefault = [0, 0, -1];
					this.semFlag1Data.treeData = [];
					this.semFlag1Data.pickerStr = '';
					this.semFlag2Data.bad_list = [];
					this.semFlag2Data.good_list = [];
					this.semFlag2Data.list = [];
					if (this.semFlag == 0) {
						this.getClsAnalysisList();
					} else if (this.semFlag == 1) {
						this.getKnowledgeAnalysis();
					} else if (this.semFlag == 2) {
						this.getQuestionTypeAnalysis();
					}
				}
				this.$refs.popupSelect.close();
			},
			openLevel() {
				this.$refs.levelLinkage.open();
			},
			onConfirm(e) {
				console.log('onConfirm:' + JSON.stringify(e))
				// e 确认后选中的数据
				this.semFlag1Data.pickerStr = e.name;
				this.semFlag1Data.catalog_list = [].concat(this.semFlag1Data.treeData[e.value[0]].children[e.value[1]]
					.children);
			},
			clickMissStu(str) {
				this.semFlag0Data.miss_stu_nameStr = str;
				this.$refs.popupNames.open();
			},
			clickShowSelect() {
				this.$refs.popupSelect.open();
			},
			getYear() { //获取学年
				let comData = {
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'year', comData, response => {
					this.hideLoading()
					if (response.list.length > 0) {
						this.yearList = this.yearList.concat(response.list);
					} else {
						this.showToast('获取不到学年');
					}
				})
			},
			getTerm() { //获取学期
				let comData = {
					page_number: -1,
					page_size: 1,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_BASESUB + 'SysTermP', comData, response => {
					this.hideLoading()
					if (response.list.length > 0) {
						this.termList = this.termList.concat(response.list);
					} else {
						this.showToast('获取不到学期');
					}
				})
			},
			getGrd(flag) { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: false,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					if (response.grd_list.length > 0) {
						for (var i = 0; i < response.grd_list.length; i++) {
							let tempM = response.grd_list[i];
							tempM.value = parseInt(tempM.value);
						}
						response.grd_list.sort(util.compare('value',1));
						this.grdArray = response.grd_list;
						this.getCls(flag);
					} else {
						this.grdArray = [];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls(flag) { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndexTemp].value,
					get_cls: true,
					all_cls: false,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading();
					if (response.cls_list.length > 0) {
						if(flag == 1){
							this.clsArray = response.cls_list;
						}
						this.clsArrayTemp = response.cls_list;
						this.clsIndexTemp = 0;
						this.getSub(flag);
					} else {
						this.clsArray = [];
						this.clsArrayTemp = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getSub(flag) { //获取科目
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndexTemp].value,
					cls_code: this.clsArrayTemp[this.clsIndex].value,
					get_sub: true,
					all_sub: false,
					index_code: this.itemData.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading();
					if (response.sub_list.length > 0) {
						this.subArrayTemp = response.sub_list;
						this.subIndexTemp = 0;
						if(flag == 1){
							this.subArray = response.sub_list;
							this.getClsAnalysisList();
						}
					} else {
						this.subArray = [];
						this.subArrayTemp = [];
						this.showToast('无数据授权 无法获取科目');
					}
				})
			},
			clickSeg: function(e) {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					console.log('this.semFlag:' + e.currentIndex);
					if (this.semFlag == 0) {
						if (this.semFlag0Data.total_page == 0) {
							this.getClsAnalysisList();
						}
					} else if (this.semFlag == 1) {
						if (this.semFlag1Data.bad_list.length == 0) {
							this.getKnowledgeAnalysis();
						}
					} else if (this.semFlag == 2) {
						if (this.semFlag2Data.bad_list.length == 0) {
							this.getQuestionTypeAnalysis();
						}
					}
				}
			},
			//1.206.班级作业上交情况统计分页
			getClsAnalysisList() {
				var comData = {
					year_code: this.yearList[this.yearIndex].year_code,
					term_code: this.termList[this.termIndex].term_code,
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					sub_code: this.subArray[this.subIndex].value,
					page_size: this.pageSize, //每页记录数
					page_number: this.semFlag0Data.pageIndex, //当前页数
					index_code: this.itemData.access.split('#')[1]
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'clsAnalysis/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i];
							tempM.miss_stu_nameStr = tempM.miss_stu_name_list.join(',');
							if (tempM.max_score == null) {
								tempM.max_score = '0';
							}
							if (tempM.avg_score == null) {
								tempM.avg_score = '0';
							}
							if (tempM.min_score == null) {
								tempM.min_score = '0';
							}
						}
						this.semFlag0Data.pageIndex++;
						this.semFlag0Data.total_page = data.data.total_page;
						if (this.semFlag0Data.flagRef == 0) {
							if (data.data.list.length == 0) {
								this.showToast('暂无数据');
							}
							this.semFlag0Data.dataList = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.semFlag0Data.dataList = this.semFlag0Data.dataList.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.208.知识点分析
			getKnowledgeAnalysis() {
				var comData = {
					year_code: this.yearList[this.yearIndex].year_code,
					term_code: this.termList[this.termIndex].term_code,
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					sub_code: this.subArray[this.subIndex].value,
					index_code: this.itemData.access.split('#')[1]
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'clsAnalysis/knowledgeAnalysis', comData, (data0,
					data) => {
					this.hideLoading();
					uni.stopPullDownRefresh();
					if (data.code == 0) {
						this.semFlag1Data.bad_list = [].concat(data.data.bad_list);
						this.semFlag1Data.good_list = [].concat(data.data.good_list);
						if (data.data.book.catalog_list && data.data.book.catalog_list.length > 0) {
							this.semFlag1Data.treeData = [].concat(data.data.book.catalog_list);
							this.semFlag1Data.pickerStr = this.semFlag1Data.treeData[0].name + '-' + this
								.semFlag1Data.treeData[0].children[0].name;
							this.semFlag1Data.catalog_list = [].concat(this.semFlag1Data.treeData[0].children[0]
								.children);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//1.210.题型分析
			getQuestionTypeAnalysis() {
				var comData = {
					year_code: this.yearList[this.yearIndex].year_code,
					term_code: this.termList[this.termIndex].term_code,
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					sub_code: this.subArray[this.subIndex].value,
					index_code: this.itemData.access.split('#')[1]
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'clsAnalysis/questionTypeAnalysis', comData, (data0,
					data) => {
					this.hideLoading();
					uni.stopPullDownRefresh();
					if (data.code == 0) {
						this.semFlag2Data.bad_list = [].concat(data.data.bad_list);
						this.semFlag2Data.good_list = [].concat(data.data.good_list);
						this.semFlag2Data.list = [].concat(data.data.list);
					} else {
						this.showToast(data.msg);
					}
				});
			},
		}
	}
</script>

<style>
	.scoreDetail {
		font-size: 13px;
		text-align: center;
		margin-top: 10px;
	}

	.stuScoreDetail {
		font-size: 13px;
		color: #505050;
		text-align: center;
		min-height: 20px;
		margin-top: 5px;
		/* background-color: #e5e5e5;
		border-radius: 5px;
		margin-left: 2px;
		margin-right: 2px; */
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

	::v-deep .uni-list--border-bottom {
		height: 0px;
	}

	.peopleImg {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 50px);
	}

	.biaoti {
		font-size: 13px;
		width: calc(100% - 50px);
	}

	.biaoti0 {
		font-size: 13px;
		width: calc(100%);
	}

	.title {
		height: 100%;
		float: left;
		font-size: 13px;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #000000;
	}

	.nameTime {
		font-size: 13px;
	}

	.nameContent {
		color: gray;
		font-size: 13px;
	}

	.tempCss {
		font-size: 13px;
		float: left;
		color: gray;
		word-break: break-all;
	}

	.uni-col {
		margin-top: 0px;
	}

	.card-line {
		height: 1px;
		width: 999px;
		background-color: #e5e5e5;
		margin-top: 5px;
		margin-bottom: 0px;
	}

	.msg-content {
		word-break: break-all;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #eef0f2;
		/* height: calc(100% - 300px) !important; */
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #eef0f2;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 1px 0;
		/* padding-bottom: 50px; */
	}

	.content-box-text {
		font-size: 12px;
		line-height: 22px;
	}

	.card-title {
		font-size: 15px;
		margin-bottom: 5px;
		/* text-align: center; */
	}

	/* 识别人数圆圈 */
	.scoreOrderBorder {
		width: 60px;
		height: 60px;
		border: 2px solid;
		border-radius: 50%;
		margin-top: 10px;
		margin-left: 25px;
		text-align: center;
	}

	/* 识别人数 */
	.scoreOrder {
		margin-top: 10px;
		height: 20px;
		line-height: 20px;
		vertical-align: middle;
		font-size: 16px;
		text-align: center;
	}

	.text {
		font-size: 13px;
		height: 35px;
		padding: 5px 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.popNoSelect {
		margin: 5px 5px 0px 5px;
		font-size: 14px;
		text-align: center;
		border-radius: 20px;
		height: 25px;
		padding-top: 7px;
		border: 1px solid #e5e5e5;
		background-color: #e5e5e5;
	}

	.popSelect {
		margin: 5px 5px 0px 5px;
		font-size: 14px;
		text-align: center;
		border-radius: 20px;
		height: 25px;
		padding-top: 7px;
		border: 1px solid #00CFBD;
		background-color: #00CFBD;
		color: white;
	}

	.pupName {
		margin: 5px 0;
		font-size: 14px;
	}

	.mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: 40px;
	}
</style>
