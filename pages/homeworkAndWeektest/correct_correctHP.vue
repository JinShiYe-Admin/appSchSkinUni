<template>
	<view class="trans">
		<view class="viewLeft">
			<view class="viewHead">
				<uni-icons @click='clickBack()' type="back" size="20" class="uniIcon" style='float: left;'></uni-icons>
				<p style="margin: 12px 0 0 10px;text-align: left;color: white;font-size: 14px;float: left;">
					{{itemData.name}}
				</p>
			</view>
			<view v-if="currentCorrectModel.id">
				<view v-if="groupNumberArray[nowGroupIndex].question_type == 1">
					<scroll-view class="answerImg" scroll-x="true" scroll-y="true" :style="'height:'+viewclass+'px'">
						<!-- <image v-show='currentCorrectModel.stu_answer_img_url.length>0' mode="widthFix"
							:src="currentCorrectModel.stu_answer_img_url"
							:imgSrc='currentCorrectModel.stu_answer_img_url' :change:imgSrc="renderScript.receiveSrc"
							@click="renderScript.usePED" id="renderScript" style="width: 100%;" class="renderScript">
						</image> -->
						<image v-show='currentCorrectModel.stu_answer_img_url.length>0' mode="widthFix"
							:src="currentCorrectModel.stu_answer_img_url"
							:imgSrc='currentCorrectModel.stu_answer_img_url' :change:imgSrc="renderScript.receiveSrc"
							@click="checkEnc(currentCorrectModel.stu_answer_img_url)" id="renderScript" style="width: 100%;" class="renderScript">
						</image>
					</scroll-view>
				</view>
				<view v-if="groupNumberArray[nowGroupIndex].question_type == 2">
					<scroll-view class="answerImg" scroll-x="true" scroll-y="true" :style="'height:'+viewclass+'px'">
						<image v-show='imgSrc.length>0' mode="widthFix" :src="imgSrc" :imgSrc='imgSrc'
							:change:imgSrc="renderScript.receiveSrc" @click="renderScript.usePED" id="renderScript"
							style="width: 100%;" class="renderScript"></image>
					</scroll-view>
				</view>
			</view>
		</view>
		<view class="viewRight">
			<!-- #ifdef H5 -->
			<view class="viewHead" style="background: #00CFBD;">
				<deanPop v-if="groupNumberArray.length>0" ref="groupH5Pop" :btnList='groupNumberArray'
					:viewName='groupNumberArray[nowGroupIndex].label' @select='clickH5Group'></deanPop>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP -->
			<view class="viewHead" style="background: #00CFBD;" @click="useOutClickSide()">
				<feitui-select ref="feituiSelect" size="medium" :value="nowGroupValue" @selectOne="selectOne"
					:options="groupNumberArray">
				</feitui-select>
			</view>
			<!-- #endif -->
			<view style="height: 10px;"></view>
			<view v-if="currentCorrectModel.id">
				<view v-if="groupNumberArray[nowGroupIndex].question_type == 1">
					<view style="font-size: 12px;margin-top: 5px;margin-left: 20px;">学生：{{currentCorrectModel.stu_name}}
					</view>
					<view style="font-size: 12px;margin-top: 5px;margin-bottom: 5px;margin-left: 20px;">
						正确答案：{{currentCorrectModel.question_answerStr}}</view>
					<view style="margin-top: 5px;font-size: 12px;margin-left: 20px;">
						学生答案：
						<span
							style="font-size: 12px;border-bottom: 1px solid #888888;display: inline-block;width: 60px;margin-left: 5px;text-align: center;">{{currentCorrectModel.stu_answerStr}}</span>
					</view>
					<uni-row style="margin: 10px 10px 10px 10px;">
						<uni-col :span="8" v-for="(char,index) in charList" :key="index">
							<view :class="currentCorrectModel.stu_answerStr.indexOf(char)==-1?'popNoSelect':'popSelect'"
								@click="clickChar(char)">
								{{char}}
							</view>
						</uni-col>
						<uni-col :span="8">
							<view class="popNoSelect" @click="clickClearChar()">
								清除
							</view>
						</uni-col>
					</uni-row>
					<view style="background-color: white;height: 50px;width: 160px;">
						<button class="mini-btn" type="default" size="mini"
							style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
							@click="submitBtnAnswer()">确定</button>
					</view>
					<br>
				</view>
				<view v-if="groupNumberArray[nowGroupIndex].question_type == 2">
					<view style="font-size: 12px;margin-top: 5px;margin-left: 20px;">学生：{{currentCorrectModel.stu_name}}
					</view>
					<view style="margin-top: 5px;font-size: 12px;margin-left: 20px;">学生成绩<span
							style='color: #00CFBD;font-size: 12px;margin-top: 5px;margin-left: 10px;'>(满分{{currentCorrectModel.group_score}}分)</span>：
						<span
							style="font-size: 12px;border-bottom: 1px solid #888888;display: inline-block;width: 70px;margin-left: 5px;text-align: center;">{{currentCorrectModel.stu_group_score}}</span>
					</view>
					<uni-row style="margin: 5px 10px 10px 10px;">
						<uni-col :span="8" v-for="(num,index) in numberList" :key="index">
							<view class="popNoSelect" @click="clickNum(index)">
								{{num}}
							</view>
						</uni-col>
						<uni-col :span="8" v-for="(model,index) in numberClear" :key="model">
							<view class="popNoSelect" @click="clickClear(index)">
								{{model}}
							</view>
						</uni-col>
					</uni-row>
					<view style="background-color: white;height: 50px;width: 160px;">
						<button class="mini-btn" type="default" size="mini"
							style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
							@click="submitBtnScore()">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script module="renderScript" lang="renderjs">
	import {
		imageInfo
	} from '@/commom/picture/index.js';
	export default {
		data() {
			return {
				imgSrc: '',
			}
		},
		methods: {
			receiveSrc(newValue, oldValue, ownerVm, vm) {
				this.imgSrc = newValue;
			},
			usePED(e, ownerVm) {
				ownerVm.callMethod('showNavFun', '');
				console.log('usePEDusePED1');
				// let ped = new imageInfo('http://jbsch-pb.zhuxue101.net/test/task_result_detail/843-1410483399553974281.jpg', ()=>{});
				let ped = new imageInfo(this.imgSrc, (data) => {
					// console.log('saveFnsaveFnsaveFn1111:'+data);
					ownerVm.callMethod('saveFn', data);
				});
				console.log("this.ped: ", ped);
			}
		}
	}
</script>

<script>
	import util from '@/commom/util.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import {
		imageInfo
	} from '@/commom/picture/index.js';
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	import deanPop from '@/components/dean-popover/dean-popover.vue'
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				groupNumberArray: [], //当前题组数组
				groupNumberArray: [],
				nowGroupValue: '',
				nowGroupIndex: 0, //当前题组索引
				currentCorrectList: {}, //当前题组对应的学生作业列表
				currentCorrectIndex: 0, //当前题组对应的学生作业索引
				currentCorrectModel: {}, //当前题组对应的学生作业
				currentCorrectModel: {},
				viewclass: null,
				popupclass: null,
				imgPed: null, //
				imgSrc: '', //试卷图片
				imgSrcFlag: 0, //判断是否进行涂鸦
				ped: null,
				showNav: true,
				numberList: [],
				numberClear: [0.5, '清除', '零分', '满分'],
				charList: ['A', 'B', 'C', 'D', 'E', 'F'],
			}
		},
		onLoad(option) {
			setTimeout(() => {
				// #ifdef APP-PLUS
				plus.screen.lockOrientation('landscape-primary');
				plus.navigator.setFullscreen(true);
				//隐藏状态栏 
				// #endif

				//#ifndef APP-PLUS
				// window.onresize = this.detectOrient();
				// this.detectOrient();
				//#endif
			}, 200);

			setTimeout(() => {
				// #ifdef APP-PLUS
				this.viewclass = uni.getSystemInfoSync().windowHeight - 64;
				this.popupclass = uni.getSystemInfoSync().windowWidth - 160;
				//隐藏状态栏 
				// #endif

				//#ifndef APP-PLUS
				this.viewclass = uni.getSystemInfoSync().windowWidth - 64;
				this.popupclass = uni.getSystemInfoSync().windowHeight - 160;
				//#endif
			}, 500);
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			// uni.setNavigationBarTitle({
			// 	title: this.itemData.name
			// });
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//1.189.获取任务题组及题型信息
			this.getGroupNumberData();
			// 点击微信下方的返回按钮，如果是在图片编辑状态，隐藏
			// window.addEventListener('popstate', function() {
			// 	this.showNav = true;
			// 	// 隐藏
			// });
			// for (var i = 0; i < 26; i++) {
			// 	this.charList.push(String.fromCharCode(65 + i));
			// }
		},
		onShow() {
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
		},
		onBackPress(options) {
			return false;
		},
		components: {
			deanPop
		},
		methods: {
			clickH5Group(e) {
				if (this.nowGroupIndex != e) {
					this.nowGroupIndex = e;
					this.nowGroupValue = this.groupNumberArray[this.nowGroupIndex].label;
					this.imgSrc = '';
					this.imgSrcFlag = 0;
					//1.5.阅卷任务题组的批改情况
					this.getcurrentCorrectModel();
				}
			},
			selectOne(options) {
				if (this.nowGroupValue != options.label) {
					for (var i = 0; i < this.groupNumberArray.length; i++) {
						var tempM = this.groupNumberArray[i];
						if(tempM.group_number == options.group_number){
							this.nowGroupIndex = i;
						}
					}
					this.nowGroupValue = options.label;
					this.currentCorrectModel = {};
					this.imgSrc = '';
					this.imgSrcFlag = 0;
					//1.5.阅卷任务题组的批改情况
					this.getcurrentCorrectModel();
				}
			},
			useOutClickSide() {
				console.log('useOutClickSide');
				this.$refs.feituiSelect.hideOptions && this.$refs.feituiSelect.hideOptions()
			},
			clickClearChar() {
				console.log('clickClearChar');
				this.currentCorrectModel.stu_answerStr = '';
			},
			clickChar(char) {
				if (this.currentCorrectModel.stu_answerStr.indexOf(char) == -1) {
					this.currentCorrectModel.stu_answerStr = this.currentCorrectModel.stu_answerStr + char;
					// 排序
					var tempArr = this.currentCorrectModel.stu_answerStr.split('');
					tempArr.sort();
					this.currentCorrectModel.stu_answerStr = tempArr.join('');
				} else {
					this.currentCorrectModel.stu_answerStr = this.currentCorrectModel.stu_answerStr.replace(char, '');
				}
			},
			clickNum(index) {
				if (this.currentCorrectModel.stu_group_score == 0) {
					this.currentCorrectModel.stu_group_score = index.toString();
				} else {
					// var tempScore = this.currentCorrectModel.stu_group_score+index;
					var tempArr = this.currentCorrectModel.stu_group_score.split('.');
					console.log('tempArr:' + tempArr.length);
					var tempScore;
					if (tempArr.length == 1) {
						tempScore = this.currentCorrectModel.stu_group_score + index;
					} else {
						// tempScore = parseFloat(this.currentCorrectModel.stu_group_score)-0.5;
						tempScore = tempArr[0] + index + '.5';
					}
					if (parseFloat(tempScore) > parseFloat(this.currentCorrectModel.group_score)) {
						this.currentCorrectModel.stu_group_score = index.toString();
					} else {
						this.currentCorrectModel.stu_group_score = parseFloat(tempScore).toString();
					}
				}
			},
			clickClear(index) {
				if (index == 0) {
					console.log('this.currentCorrectModel.stu_group_score:' + this.currentCorrectModel.stu_group_score);
					var tempArr = this.currentCorrectModel.stu_group_score.split('.');
					console.log('tempArr:' + tempArr.length);
					var tempScore;
					if (tempArr.length == 1) {
						tempScore = parseFloat(this.currentCorrectModel.stu_group_score) + 0.5;
					} else {
						tempScore = tempArr[0];
					}
					if (parseFloat(tempScore) > parseFloat(this.currentCorrectModel.group_score)) {
						this.currentCorrectModel.stu_group_score = 0.5.toString();
					} else {
						this.currentCorrectModel.stu_group_score = tempScore.toString();
					}
				} else if (index == 1) {
					this.currentCorrectModel.stu_group_score = '0';
				} else if (index == 2) {
					this.currentCorrectModel.stu_group_score = '0';
				} else if (index == 3) {
					var tempArr = this.currentCorrectModel.group_score.toString().split('.');
					if (tempArr.length == 1) {
						this.currentCorrectModel.stu_group_score = this.currentCorrectModel.group_score.toString();
					} else {
						if (tempArr[1] != 0) {
							this.currentCorrectModel.stu_group_score = this.currentCorrectModel.group_score.toString();
						} else {
							this.currentCorrectModel.stu_group_score = tempArr[0].toString();
						}
					}
				}
			},
			checkEnc: function(tempUrl) {
				console.log('tempUrl:' + tempUrl);
				util.openFile(tempUrl);
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				if (this.nowGroupIndex != e.target.value) {
					this.nowGroupIndex = e.target.value;
					this.currentCorrectList = [];
					this.currentCorrectIndex = 0;
					this.currentCorrectModel = {};
					this.imgSrc = '';
					this.imgSrcFlag = 0;
					//获取学生主观题或客观题数据
					this.getcurrentCorrectModel();
				}
			},
			clickBack: function() {
				uni.navigateBack();
			},
			usePED() {
				//#ifndef APP-PLUS
				this.$refs.groupH5Pop.activeF();
				//#endif
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				this.showNav = false;
				console.log('usePEDusePED');
				this.ped = new imageInfo(this.imgSrc, this.saveFn);
			},
			showNavFun() {
				console.log('showNavFunshowNavFunshowNavFun');
				this.showNav = false;
			},
			saveFn(data) {
				console.log('saveFnsaveFnsaveFn');
				this.showNav = true;
				if (data.length > 0) {
					this.imgSrcFlag = 1;
					this.imgSrc = data;
				}
			},
			clickScore: function(model, flag) {
				console.log('clickScore:' + JSON.stringify(model));
				if (flag == 0) {
					model.stu_group_score = 0.0;
				} else {
					model.stu_group_score = model.group_score;
				}
			},
			inputChange: function(model) {
				console.log('inputChange.model:' + JSON.stringify(model));
				model.stu_group_score = parseFloat(parseFloat(model.stu_group_score).toFixed(1));
				model.group_score = parseFloat(parseFloat(model.group_score).toFixed(1));
				if (model.stu_group_score >= 0 && model.stu_group_score <= model.group_score) {
					console.log('正常')
				} else {
					this.showToast('请输入正确的分数');
				}
			},
			submitBtnAnswer() {
				this.currentCorrectModel.stu_answerStr.replace(/\s/g, "");
				console.log('submitBtnAnswer:' + JSON.stringify(this.currentCorrectModel));
				let tempArr0 = this.currentCorrectModel.stu_answerStr.split('');
				if (this.currentCorrectModel.stu_answerStr.length == 0) {
					// this.showToast('请输入学生答案');
					// return;
				} else {
					var isletter2 = /^[a-zA-Z]+$/.test(this.currentCorrectModel.stu_answerStr);
					if (!isletter2) {
						this.showToast('请输入正确的学生答案');
						return;
					}
				}
				let tempArr1 = [];
				for (var i = 0; i < tempArr0.length; i++) {
					tempArr1.push('"' + tempArr0[i] + '"');
				}
				let tempS = tempArr1.join(',');
				let tempStr1 = '[' + tempS + ']';
				var comData = {
					index_code: this.itemData.access.split('#')[1],
					id: this.currentCorrectModel.id, //记录id
					answer: tempStr1 //答案
				}
				this.showLoading();
				//
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'teachAssistTask/editResultDetailAnswer', comData, (
					data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.currentCorrectIndex++;
						if (this.currentCorrectList.length > this.currentCorrectIndex) {
							this.currentCorrectModel = this.currentCorrectList[this.currentCorrectIndex];
							this.numberList = [];
							var tempNum = this.currentCorrectModel.group_score;
							if (this.currentCorrectModel.group_score > 9) {
								tempNum = 9;
							}
							for (var i = 0; i <= tempNum; i++) {
								this.numberList.push(i);
							}
						} else {
							this.currentCorrectModel = {};
							this.showToast('已提交完当前题组所以答案');
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			submitBtnScore: function() {
				// console.log('clickSubmit:' + JSON.stringify(this.currentCorrectModel));
				this.currentCorrectModel.stu_group_score = parseFloat(parseFloat(this.currentCorrectModel
					.stu_group_score).toFixed(1));
				this.currentCorrectModel.group_score = parseFloat(parseFloat(this.currentCorrectModel.group_score)
					.toFixed(1));
				var tempFlag = 0; //判断分数是否输入正确
				if ((this.currentCorrectModel.stu_group_score >= 0) && (this.currentCorrectModel.stu_group_score <=
						this.currentCorrectModel.group_score)) {
					this.currentCorrectModel.stu_group_score = parseFloat(this.currentCorrectModel.stu_group_score);
				} else {
					tempFlag++;
				}
				if (tempFlag == 0) {
					let comData = {
						index_code: this.itemData.access.split('#')[1],
						id: this.currentCorrectModel.id, //记录id
						user_code: this.personInfo.user_code, //用户代码
						score: this.currentCorrectModel.stu_group_score,
					}
					console.log('this.imgSrcFlag:' + this.imgSrcFlag);
					if (this.imgSrcFlag == 0) {
						this.showLoading();
						//1.193.修改学生题目得分
						this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'teachAssistTask/editEvaluationScore',
							comData, (data0,
								data) => {
								this.hideLoading();
								if (data.code == 0) {
									this.currentCorrectIndex++;
									if (this.currentCorrectList.length > this.currentCorrectIndex) {
										this.currentCorrectModel = this.currentCorrectList[this
											.currentCorrectIndex];
										// this.imgSrc = this.currentCorrectModel.stu_answer_img_url;
										this.imgSrc = this.currentCorrectModel.painting_img ? this
											.currentCorrectModel.painting_img : this.currentCorrectModel
											.stu_answer_img_url;
									} else {
										this.currentCorrectModel = {};
										this.showToast('已提交完当前题组所以答案');
									}
								} else {
									this.showToast(data.msg);
								}
							});
					} else {
						// 先将涂鸦后的图片，上传七牛
						this.showLoading();
						var fileName = 'correct' + new Date().getTime() + '.png';
						var tempData = this.imgSrc.replace('data:image/png;base64,', '');
						console.log('tempDatatempDatatempDatatempData');
						let that = this
						cloudFileUtil.uploadIDCardHeadImge(1, fileName, tempData, function(domain) {
							console.log("domain: " + JSON.stringify(domain));
							comData.painting_img = domain;
							console.log('comData:::' + JSON.stringify(comData));
							//1.193.修改学生题目得分
							that.post(that.globaData.INTERFACE_MARKINGPAPERS +
								'teachAssistTask/editEvaluationScore', comData, (
									data0, data) => {
									that.hideLoading();
									if (data.code == 0) {
										that.currentCorrectIndex++;
										if (that.currentCorrectList.length > that.currentCorrectIndex) {
											that.currentCorrectModel = that.currentCorrectList[that
												.currentCorrectIndex];
											that.imgSrc = that.currentCorrectModel.stu_answer_img_url;
										} else {
											that.currentCorrectModel = {};
											that.showToast('已提交完当前题组所以答案');
										}
									} else {
										that.showToast(data.msg);
									}
								});
						}, function() {
							that.hideLoading();
						})
					}
				} else {
					this.showToast('请输入正确的分数');
				}
			},
			getGroupNumberData() { //1.189.获取任务题组及题型信息
				var comData = {
					index_code: this.itemData.access.split('#')[1],
					id: this.itemData.id, //教辅id
				}
				this.showLoading();
				//
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'teachAssistTask/getGroupList', comData, (data0,
					data) => {
					this.hideLoading();
					console.log('getGroupNumber:' + JSON.stringify(data));
					if (data.code == 0) {
						if (data.data.list && data.data.list.length > 0) {
							let tempArr = [];
							for (var i = 0; i < data.data.list.length; i++) {
								let temp = data.data.list[i];
								var tempM = {
									label: '题组' + temp.group_number,
									group_number: temp.group_number,
									question_type: temp.question_type
								}
								if (i == 0) {
									this.nowGroupValue = tempM.label;
								}
								tempArr.push(tempM);
							}
							this.nowGroupIndex = 0;
							this.groupNumberArray = [].concat(tempArr);
							//获取学生主观题或客观题数据
							this.getcurrentCorrectModel();
						} else {
							this.showToast('当前试卷没有可阅题组');
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getcurrentCorrectModel() { //获取学生主观题或客观题数据
				let tempGroup = this.groupNumberArray[this.nowGroupIndex];
				var comData = {
					index_code: this.itemData.access.split('#')[1],
					id: this.itemData.id, //教辅id
					group_number: tempGroup.group_number
				}
				this.showLoading();
				if (tempGroup.question_type == 1) { //客观题
					//1.190.根据题组获取客观题数据
					this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'teachAssistTask/getObjectGroupList', comData, (
						data0,
						data) => {
						this.hideLoading();
						if (data.code == 0) {
							if (data.data.list && data.data.list.length > 0) {
								for (var i = 0; i < data.data.list.length; i++) {
									let tempM = data.data.list[i];
									tempM.question_answerStr = JSON.parse(tempM.question_answer).join('');
									tempM.stu_answerStr = JSON.parse(tempM.stu_answer).join('');
								}
								this.currentCorrectList = data.data.list;
								this.currentCorrectIndex = 0;
								this.currentCorrectModel = this.currentCorrectList[this.currentCorrectIndex];
								console.log('this.currentCorrectModel:' + JSON.stringify(this
									.currentCorrectModel));
							}
							if (data.data.msg) {
								this.showToast(data.data.msg);
							}
						} else {
							this.showToast(data.msg);
						}
					});
				} else { //主观题
					//1.191.根据题组获取主观题数据
					this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'teachAssistTask/getSubjectGroupList', comData, (
						data0,
						data) => {
						console.log('currentInfo:' + JSON.stringify(data));
						this.hideLoading();
						if (data.code == 0) {
							if (data.data.list && data.data.list.length > 0) {
								let tempArr = [];
								for (var i = 0; i < data.data.list.length; i++) {
									let tempM = data.data.list[i];
									if (tempM.is_viewed == false) {
										tempArr.push(tempM);
									}
								}
								if (tempArr.length == 0) {
									this.showToast('当前题组已全部批改');
									return;
								}
								this.currentCorrectList = tempArr;
								this.currentCorrectIndex = 0;
								this.currentCorrectModel = this.currentCorrectList[this.currentCorrectIndex];
								this.numberList = [];
								var tempNum = this.currentCorrectModel.group_score;
								if (this.currentCorrectModel.group_score > 9) {
									tempNum = 9;
								}
								for (var i = 0; i <= tempNum; i++) {
									this.numberList.push(i);
								}
								this.imgSrc = this.currentCorrectModel.painting_img ? this.currentCorrectModel
									.painting_img : this.currentCorrectModel.stu_answer_img_url;
								// this.imgSrc = this.currentCorrectModel.stu_answer_img_url;
							}
							if (data.data.msg) {
								this.showToast(data.data.msg);
							}
						} else {
							this.showToast(data.msg);
						}
					});
				}
			}
		}
	}
</script>

<style>
	.trans {
		//#ifndef APP-PLUS
		position: absolute;
		top: -100vw;
		width: 100vh;
		height: 100vw;
		background: #F9FBFF;
		transform: rotate(90deg);
		transform-origin: bottom left;
		//#endif
	}

	.viewLeft {
		width: calc(100% - 160px);
		height: 100%;
		float: left;
	}

	.viewRight {
		width: 160px;
		height: 100%;
		float: left;
	}

	.viewHead {
		width: 100%;
		height: 44px;
		background: darkgray;
	}

	.answerImg {
		width: 100%;
	}

	::v-deep .uniIcon {
		color: white !important;
		margin-left: 20px;
		margin-top: 15px;
	}

	::v-deep .uni-nav-bar-text {
		height: 40px;
	}

	.uni-input {
		height: 40px !important;
		background: #00CFBD;
		width: 150px !important;
		border-radius: 4px;
		color: white;
	}

	.popNoSelect {
		margin: 5px 5px 0px 5px;
		font-size: 14px;
		text-align: center;
		border-radius: 10px;
		height: 25px;
		padding-top: 7px;
		border: 1px solid #e5e5e5;
		background-color: #e5e5e5;
		color: black;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mini-btn {
		/* margin-top: 5px; */
		width: 65px;
		height: 30px;
		/* padding-top: 3px !important; */
		margin-left: 50px;
	}

	.submitBtn {
		/* width: 80px;
		margin: 20px 0 10px 40px;
		background-color: #00CFBD;
		border-color: #00CFBD;
		height: 30px;
		color: white;
		text-align: center;
		padding-top: 5px;
		border-radius: 5px; */
		width: 80px;
		margin: -35px 20px 10px 0;
		background-color: #00CFBD;
		border-color: #00CFBD;
		height: 30px;
		color: white;
		text-align: center;
		padding-top: 5px;
		border-radius: 5px;
		float: right;
	}

	.popSelect {
		margin: 5px 5px 0px 5px;
		font-size: 14px;
		text-align: center;
		border-radius: 10px;
		height: 25px;
		padding-top: 7px;
		border: 1px solid #00CFBD;
		background-color: #00CFBD;
		color: white;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
