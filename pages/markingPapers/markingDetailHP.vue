<template>
	<view class="trans">
		<!-- <uniNavBar v-if="showNav" :title='itemData.name' left-icon="back" backgroundColor='#00CFBD' fixed='true'
			statusBar='true' color='white' @clickLeft='clickLeft()'></uniNavBar> -->
		<view class="viewLeft">
			<view class="viewHead">
				<uni-icons @click='clickBack()' type="back" size="20" class="uniIcon" style='float: left;'></uni-icons>
				<p v-if="currentInfoData.count_info"
					style="margin: 12px 0 0 10px;text-align: left;color: white;font-size: 14px;float: left;">
					该题组已阅{{currentInfoData.count_info.view_count}}份，当前第{{currentInfoData.count_info.count}}份，任务量{{currentInfoData.count_info.group_count}}份
				</p>
				<button class="mini-btn" type="default" size="mini" @click="setError()" style="width: 80px;color: white;background: darkorange;margin-left: 40px;">问题卷</button>
			</view>
			<scroll-view class="answerImg" scroll-x="true" scroll-y="true" :style="'height:'+viewclass+'px'">
				<image v-show='imgSrc.length>0' mode="widthFix" :src="imgSrc" :imgSrc='imgSrc'
					:change:imgSrc="renderScript.receiveSrc" @click="renderScript.usePED" id="renderScript"
					style="width: 100%;" class="renderScript"></image>
			</scroll-view>
		</view>
		<view class="viewRight">
			<!-- #ifdef H5 -->
			<view class="viewHead" style="background: #00CFBD;">
				<deanPop v-if="groupNumberArrayH5.length>0" ref="groupH5Pop" :btnList='groupNumberArrayH5' :viewName='groupNumberArrayH5[nowGroupIndex].label' @select='clickH5Group'></deanPop>
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
			<view v-if="currentInfoData.eqs" style="margin-left: 10px;" v-for="eqsModel in currentInfoData.eqs"
				:key="eqsModel.id">
				<view v-if="eqsModel.step_score_list">
					<view v-for="(stepModel,index) in eqsModel.step_score_list" :key="index">
						<view style="font-size: 12px;height: 25px;" @click="clickShowSelect(stepModel)">
							<span v-show="index==0">{{eqsModel.question_number}}.</span>
							<span v-show="index!=0"
								style='color: white;'>{{eqsModel.question_number}}.</span>({{stepModel.sub_question_number}}):
							<span
								style="font-size: 12px;border-bottom: 1px solid #888888;display: inline-block;width: 70px;margin-left: 5px;text-align: center;">{{stepModel.stu_score}}</span>
						</view>
					</view>
				</view>
				<view v-else>
					<view style="margin-top: 5px;font-size: 13px;" @click="clickShowSelect(eqsModel)">
						{{eqsModel.question_number}}.
						<span
							style="font-size: 13px;border-bottom: 1px solid #888888;display: inline-block;width: 80px;margin-left: 5px;text-align: center;">{{eqsModel.stu_score}}</span>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popupSelect" type="bottom" style="background-color: white;">
			<scroll-view style="background-color: white;border-radius: 5px 5px 0px 0px;width: 160px;"
				:style="'margin-left:'+popupclass+'px'" class="popupSelect">
				<view class="pupName" style="margin: 5px 0 0 10px;font-size: 12px;">{{popModel.questionNum}}<span
						style='color: #00CFBD;font-size: 11px;margin-top: 5px;margin-left: 10px;'>(满分{{popModel.score}}分)</span>：{{popScore}}
				</view>
				<uni-row style="margin: 5px 10px 10px 10px;">
					<uni-col :span="8" v-for="(num,index) in numberList" :key="index">
						<view class="popNoSelect" @click="clickNum(index)">
							{{num}}
						</view>
					</uni-col>
					<uni-col :span="8" v-for="(model,index) in numberClear" :key="model">
						<view class="popNoSelect" style="font-size: 12px;" @click="clickClear(index)">
							{{model}}
						</view>
					</uni-col>
				</uni-row>
			</scroll-view>
			<view style="background-color: white;height: 50px;width: 160px;" :style="'margin-left:'+popupclass+'px'">
				<button class="mini-btn" type="default" size="mini" @click="popSure(0)">取消</button>
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
					@click="popSure(1)">确定</button>
			</view>
		</uni-popup>
		<uni-popup ref="popupError" type="dialog">
			<uni-popup-dialog title="确定?" content="确定设置为问题卷吗？" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
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
				//#ifndef APP-PLUS
				this.$refs.groupH5Pop.activeF();
				//#endif
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
	// import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import {
		imageInfo
	} from '@/commom/picture/index.js';
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	//#ifdef H5
	import swiper from '@/commom/swiper.js'
	//#endif
	import deanPop from '@/components/dean-popover/dean-popover.vue'
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				groupNumberArray: [],
				groupNumberArrayH5: [],
				nowGroupValue: '',
				nowGroupIndex: 0,
				currentInfoData: {},
				viewclass: null,
				popupclass: null,
				imgPed: null, //
				imgSrc: '', //试卷图片
				imgSrcFlag: 0, //判断是否进行涂鸦
				ped: null,
				showNav: true,
				popModel: {},
				numberList: [],
				numberClear: [0.5, '清除', '零分', '满分'],
				popScore: '0',
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
				//1.4.阅卷任务题组列表
				// this.getGroupNumberData();
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
			//1.4.阅卷任务题组列表
			this.getGroupNumberData();
			// 点击微信下方的返回按钮，如果是在图片编辑状态，隐藏
			// window.addEventListener('popstate', function() {
			// 	this.showNav = true;
			// 	// 隐藏
			// });
		},
		onShow() {
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
		},
		onBackPress(options){
			return false;
		},
		components: {
			deanPop
			// uniNavBar
		},
		methods: {
			close() {
				this.$refs.popupError.close();
			},
			confirm(value) {
				this.$refs.popupError.close();
				let comData = {
					index_code: this.itemData.access.split('#')[1],
					id: this.currentInfoData.evaluation.result_id, //题组id
					user_code: this.personInfo.user_code, //用户代码
					user_name: this.personInfo.user_name, //用户
				}
					this.showLoading();
					//设置为问题卷
					this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'taskResult/markError', comData, (data0,
						data) => {
						this.hideLoading();
						if (data.code == 0) {
							this.currentInfoData = {};
							this.imgSrc = '';
							this.imgSrcFlag = 0;
							//1.5.阅卷任务题组的批改情况
							this.getCurrentInfoData();
						} else {
							this.showToast(data.msg);
						}
					});
			},
			setError(){
				this.$refs.popupError.open();
			},
			clickH5Group(e){
				console.log('clickH5Group:'+e);
				if (this.nowGroupIndex != e) {
					this.nowGroupIndex = e;
					this.nowGroupValue = this.groupNumberArrayH5[this.nowGroupIndex].label;
					this.currentInfoData = {};
					this.imgSrc = '';
					this.imgSrcFlag = 0;
					//1.5.阅卷任务题组的批改情况
					this.getCurrentInfoData();
				}
			},
			selectOne(options) {
				if (this.nowGroupValue != options.label) {
					this.nowGroupValue = options.label;
					this.currentInfoData = {};
					this.imgSrc = '';
					this.imgSrcFlag = 0;
					//1.5.阅卷任务题组的批改情况
					this.getCurrentInfoData();
				}
			},
			useOutClickSide() {
				console.log('useOutClickSide');
				//#ifdef APP-PLUS
				this.$refs.feituiSelect.hideOptions && this.$refs.feituiSelect.hideOptions()
				//#endif
			},
			detectOrient() {
				var width = document.documentElement.clientWidth,
					height = document.documentElement.clientHeight,
					$wrapper = document.getElementsByTagName('body')[0],
					style = "";
				if (width >= height) { // 横屏
					style += "width:" + width + "px;"; // 注意旋转后的宽高切换
					style += "height:" + height + "px;";
					style += "-webkit-transform: rotate(0); transform: rotate(0);";
					style += "-webkit-transform-origin: 0 0;";
					style += "transform-origin: 0 0;";
					console.log(1)
				} else { // 竖屏
					style += "width:" + height + "px;";
					style += "height:" + width + "px;";
					style += "-webkit-transform: rotate(90deg); transform: rotate(90deg);";
					// 注意旋转中点的处理
					style += "-webkit-transform-origin: " + width / 2 + "px " + width / 2 + "px;";
					style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
					console.log(2)
				}
				$wrapper.style.cssText = style;
			},
			clickNum(index) {
				if (this.popScore == 0) {
					this.popScore = index.toString();
				} else {
					// var tempScore = this.popScore+index;
					var tempArr = this.popScore.split('.');
					console.log('tempArr:' + tempArr.length);
					var tempScore;
					if (tempArr.length == 1) {
						tempScore = this.popScore + index;
					} else {
						// tempScore = parseFloat(this.popScore)-0.5;
						tempScore = tempArr[0] + index + '.5';
					}
					if (parseFloat(tempScore) > parseFloat(this.popModel.score)) {
						this.popScore = index.toString();
					} else {
						this.popScore = parseFloat(tempScore).toString();
					}
				}
			},
			clickClear(index) {
				if (index == 0) {
					console.log('this.popScore:' + this.popScore);
					var tempArr = this.popScore.split('.');
					console.log('tempArr:' + tempArr.length);
					var tempScore;
					if (tempArr.length == 1) {
						tempScore = parseFloat(this.popScore) + 0.5;
					} else {
						tempScore = parseFloat(this.popScore) - 0.5;
					}
					if (parseFloat(tempScore) > parseFloat(this.popModel.score)) {
						this.popScore = 0.5.toString();
					} else {
						this.popScore = tempScore.toString();
					}
				} else if (index == 1) {
					this.popScore = '0';
				} else if (index == 2) {
					this.popScore = '0';
				} else if (index == 3) {
					var tempArr = this.popModel.score.toString().split('.');
					if (tempArr.length == 1) {
						this.popScore = this.popModel.score.toString();
					} else {
						if (tempArr[1] != 0) {
							this.popScore = this.popModel.score.toString();
						} else {
							this.popScore = tempArr[0].toString();
						}
					}
				}
			},
			popSure(flag) {
				if (flag == 0) {
					this.$refs.popupSelect.close();
				} else if (flag == 1) {
					this.popModel.stu_score = this.popScore;
					for (var i = 0; i < this.currentInfoData.eqs.length; i++) {
						var tempM0 = this.currentInfoData.eqs[i];
						if (tempM0.step_score_list) {
							for (var a = 0; a < tempM0.step_score_list.length; a++) {
								var tempM1 = tempM0.step_score_list[a];
								if (tempM1.stu_score.length == 0) {
									this.clickShowSelect(tempM1);
									return false;
								}
							}
						} else {
							if (tempM0.stu_score.length == 0) {
								this.clickShowSelect(tempM0);
								return false;
							}
						}
					}
					this.$refs.popupSelect.close();
					this.clickSubmit();
				}
			},
			clickShowSelect(model) {
				//#ifndef APP-PLUS
				this.$refs.groupH5Pop.activeF();
				//#endif
				this.popModel = model;
				this.popScore = model.stu_score.toString();
				if (this.popScore.length == 0) {
					this.popScore = '0';
				}
				console.log('clickShowSelect:' + JSON.stringify(model));
				this.numberList = [];
				var tempNum = model.score;
				if (model.score > 9) {
					tempNum = 9;
				}
				for (var i = 0; i <= tempNum; i++) {
					this.numberList.push(i);
				}
				this.$refs.popupSelect.open();
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				if (this.nowGroupIndex != e.target.value) {
					this.nowGroupIndex = e.target.value;
					this.currentInfoData = {};
					this.imgSrc = '';
					this.imgSrcFlag = 0;
					//1.5.阅卷任务题组的批改情况
					this.getCurrentInfoData();
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
				//#ifdef APP-PLUS
				this.$refs.feituiSelect.hideOptions && this.$refs.feituiSelect.hideOptions()
				//#endif
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
			clickScore: function(model) {
				model.stu_score = model.score;
			},
			inputChange: function(model) {
				console.log('inputChange.model:' + JSON.stringify(model));
				model.stu_score = parseFloat(model.stu_score).toFixed(1);
				if (parseFloat(model.stu_score).toFixed(1) >= 0 && parseFloat(model.stu_score)
					.toFixed(1) <= parseFloat(model.score).toFixed(1)) {
					console.log('正常')
				} else {
					this.showToast('请输入正确的分数');
				}
			},
			clickSubmit: function() {
				console.log('clickSubmit:' + JSON.stringify(this.currentInfoData));
				var tempFlag = 0; //判断分数是否输入正确
				var tempA = [];
				for (var i = 0; i < this.currentInfoData.eqs.length; i++) {
					var tempE = this.currentInfoData.eqs[i];
					var tempEqs = {};
					var tempScore = 0; //
					if (tempE.step_score_list) {
						for (var a = 0; a < tempE.step_score_list.length; a++) {
							var tempS = tempE.step_score_list[a];
							if (parseFloat(tempS.stu_score) >= 0 && parseFloat(tempS.stu_score) <= parseFloat(tempS.score)) {
								tempScore = parseFloat(tempScore) + parseFloat(tempS.stu_score);
							} else {
								tempFlag++;
							}
						}
						tempE.stu_score = tempScore;
					}
					if (parseFloat(tempE.stu_score) >= 0 && parseFloat(tempE
							.stu_score) <= parseFloat(tempE.score)) {
						tempEqs.evaluation_id = tempE.evaluation_id;
						tempEqs.id = tempE.id;
						tempEqs.question_number = tempE.question_number;
						tempEqs.score = tempE.score;
						if (tempE.step_score_list) {
							tempEqs.step_score_list = [].concat(tempE.step_score_list);
							var tempScore = 0;
							for (var a = 0; a < tempE.step_score_list.length; a++) {
								var tempS = tempE.step_score_list[a];
								tempScore = tempScore + parseFloat(tempS.stu_score);
							}
							tempEqs.stu_score = tempE.stu_score;
						} else {
							tempEqs.step_score_list = [];
							tempEqs.stu_score = tempE.stu_score;
						}
						tempEqs.task_id = tempE.task_id;
					} else {
						tempFlag++;
					}
					tempA.push(tempEqs);
				}
				if (tempFlag == 0) {
					var tempMMM = {
						id: this.currentInfoData.evaluation.id, //题组id
						symbols: null, //标记坐标信息
						task_id: this.currentInfoData.evaluation.task_id, //任务id
					};
					let comData = {
						index_code: this.itemData.access.split('#')[1],
						task_id: this.itemData.id, //任务id
						user_code: this.personInfo.user_code, //用户代码
						evaluation: tempMMM,
						eqs: tempA, //题组下题目
					}
					console.log('this.imgSrcFlag:' + this.imgSrcFlag);
					if (this.imgSrcFlag == 0) {
						this.showLoading();
						//1.6.保存批改
						this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'evaluation/save', comData, (data0,
							data) => {
							this.hideLoading();
							if (data.code == 0) {
								//1.5.阅卷任务题组的批改情况
								this.getCurrentInfoData();
							} else {
								this.showToast(data.msg);
							}
						});
					} else {
						// 先将涂鸦后的图片，上传七牛
						this.showLoading();
						var fileName = 'markingPapers' + new Date().getTime() + '.png';
						var tempData = this.imgSrc.replace('data:image/png;base64,', '');
						console.log('tempDatatempDatatempDatatempData');
						let that = this
						cloudFileUtil.uploadIDCardHeadImge(1, fileName, tempData, function(domain) {
							console.log("domain: " + JSON.stringify(domain));
							tempMMM.painting_img = domain;
							comData.evaluation = tempMMM;
							console.log('comData:::' + JSON.stringify(comData));
							//1.6.保存批改
							that.post(that.globaData.INTERFACE_MARKINGPAPERS + 'evaluation/save', comData, (
								data0, data) => {
								that.hideLoading();
								if (data.code == 0) {
									//1.5.阅卷任务题组的批改情况
									that.getCurrentInfoData();
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
			getGroupNumberData() { //1.4.阅卷任务题组列表
				var comData = {
					index_code: this.itemData.access.split('#')[1],
					task_id: this.itemData.id, //任务id
					user_code: this.personInfo.user_code, //用户代码
				}
				this.showLoading();
				//1.2.月考分页
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'evaluation/getGroupNumber', comData, (data0, data) => {
					console.log('getGroupNumber:' + JSON.stringify(data));
					if (data.code == 0) {
						if (data.data.list && data.data.list.length > 0) {
							let tempArr = [];
							let tempArrH5 = [];
							for (var i = 0; i < data.data.list.length; i++) {
								let temp = data.data.list[i];
								var tempM = {
									label: '题组' + temp,
									value: temp
								}
								if(i==0){
									this.nowGroupValue = tempM.label;
								}
								// var tempH5 = '题组' + data.data.list[i];
								tempArr.push(tempM);
								tempArrH5.push(tempM);
							}
							this.nowGroupIndex = 0;
							this.groupNumberArray = [].concat(tempArr);
							this.groupNumberArrayH5 = [].concat(tempArr);
							//1.5.阅卷任务题组的批改情况
							this.getCurrentInfoData();
						} else {
							this.showToast('当前试卷没有可阅题组');
							uni.navigateBack();
						}
					} else {
						this.showToast(data.msg);
						uni.navigateBack();
						this.hideLoading();
					}
				});
			},
			getCurrentInfoData() {
				var comData = {
					index_code: this.itemData.access.split('#')[1],
					task_id: this.itemData.id, //任务id
					user_code: this.personInfo.user_code, //用户代码
					group_number: this.nowGroupValue.replace('题组', ''), //题组号码
				}
				this.showLoading();
				//1.5.阅卷任务题组的批改情况
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'evaluation/currentInfo', comData, (data0, data) => {
					if (data.code == 0) {
						if (data.data.evaluation) {
							for (var i = 0; i < data.data.eqs.length; i++) {
								var tempE = data.data.eqs[i];
								tempE.questionNum = tempE.question_number + '.';
								if (tempE.stu_score) {

								} else {
									tempE.stu_score = '';
								}
								if (tempE.step_score_list) {
									for (var a = 0; a < tempE.step_score_list.length; a++) {
										var tempS = tempE.step_score_list[a];
										tempS.questionNum = tempE.question_number + '.' + '(' + tempS
											.sub_question_number + ')';
										if (tempS.stu_score) {

										} else {
											tempS.stu_score = '';
										}
									}
								}
							}
							this.currentInfoData = data.data;
							this.imgSrc = this.currentInfoData.evaluation.stu_answer_img;
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
</script>

<style>
	/* html{
			width: 100vh;
			height: 100vw;
			-webkit-transform: rotate(90deg);
			-webkit-transform-origin: 50vw 50vw;
			transform: rotate(90deg);
			transform-origin: 50vw 50vw;
		} */
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
		margin-top: 5px;
		width: 65px;
		height: 35px;
		padding-top: 3px !important;
		margin-left: 10px;
	}
</style>
