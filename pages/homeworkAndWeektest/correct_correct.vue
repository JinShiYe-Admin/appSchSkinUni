<template>
	<view>
		<uniNavBar v-if="showNav" :title='itemData.name' left-icon="back" backgroundColor='#00CFBD' fixed='true'
			statusBar='true' color='white' @clickLeft='clickLeft()'></uniNavBar>
		<picker v-if="groupNumberArray.length>0" @change="bindPickerChange" :value="nowGroupIndex"
			:range="groupNumberArray" range-key="groupName" style="margin: 10px 0 0 20px;">
			<view class="uni-input">{{groupNumberArray[nowGroupIndex].groupName}}
				<uni-icons type="forward" size="15" class="uniIcon"></uni-icons>
			</view>
		</picker>

		<view v-if="currentCorrectModel.id" style="margin-left: 20px;margin-top: 10px;">
			<view v-if="groupNumberArray[nowGroupIndex].question_type == 1">
				<view style="font-size: 15px;">学生：{{currentCorrectModel.stu_name}}</view>
				<view style="font-size: 15px;margin-top: 5px;margin-bottom: 5px;">
					正确答案：{{currentCorrectModel.question_answerStr}}</view>
				<view>
					<view style='float: left;margin-top: 5px;'>学生答案：</view>
					<uni-easyinput type="text" placeholder="请输入学生答案" style="width: 150px;font-size: 13px;float: left;"
						v-model="currentCorrectModel.stu_answerStr"></uni-easyinput>
				</view>
				<br>
				<view v-if="currentCorrectModel.id" @tap='submitBtnAnswer' class="submitBtn">提交</view>
				<image v-show='currentCorrectModel.stu_answer_img_url.length>0' mode="aspectFit"
					:src="currentCorrectModel.stu_answer_img_url" style="margin: 10px 20px 0px 20px;width: 85%;"
					@click="checkEnc(currentCorrectModel.stu_answer_img_url)">
				</image>
			</view>
			<view v-if="groupNumberArray[nowGroupIndex].question_type == 2">
				<view style="font-size: 15px;">学生：{{currentCorrectModel.stu_name}}</view>
				<view>
					<view style='float: left;margin-top: 5px;'>学生成绩：</view>
					<uni-easyinput type="number" @blur="inputChange(currentCorrectModel)" placeholder="满分"
						style="width: 150px;font-size: 13px;float: left;" v-model="currentCorrectModel.stu_group_score">
					</uni-easyinput>
				</view>
				<br>
				<view style="font-size: 15px;margin-top: 25px;margin-bottom: 5px;">
					<button class="mini-btn" type="default" size="mini"
						@click="clickScore(currentCorrectModel,1)">满分</button>
					<button class="mini-btn" type="default" size="mini" style="margin-left: 20px;"
						@click="clickScore(currentCorrectModel,0)">零分</button>
				</view>
				<view v-if="currentCorrectModel.id" @tap='submitBtnScore' class="submitBtn">提交</view>
				<p style="color: #d43030;margin-left: 20px;margin-bottom: 0px;">如需添加批阅，请点击图片</p>
				<image v-show='imgSrc.length>0' mode="aspectFit" :src="imgSrc" :imgSrc='imgSrc'
					:change:imgSrc="renderScript.receiveSrc" style="margin: 10px 20px 0px 20px;width: 85%;"
					@click="renderScript.usePED" id="renderScript" class="renderScript"></image>
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
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				groupNumberArray: [], //当前题组数组
				nowGroupIndex: '', //当前题组索引
				currentCorrectList: {}, //当前题组对应的学生作业列表
				currentCorrectIndex: 0, //当前题组对应的学生作业索引
				currentCorrectModel: {}, //当前题组对应的学生作业
				imgPed: null, //
				imgSrc: '', //试卷图片
				imgSrcFlag: 0, //判断是否进行涂鸦
				ped: null,
				showNav: true,
			}
		},
		onLoad(option) {
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
		},
		onShow() {
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
		},
		components: {
			uniNavBar
		},
		methods: {
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
					this.getCurrentInfoData();
				}
			},
			clickLeft: function() {
				console.log('clickLeft');
				uni.navigateBack();
			},
			usePED() {
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
				this.currentCorrectModel.stu_answerStr.replace(/\s/g,"");
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
				this.currentCorrectModel.stu_group_score = parseFloat(parseFloat(this.currentCorrectModel.stu_group_score).toFixed(1));
				this.currentCorrectModel.group_score = parseFloat(parseFloat(this.currentCorrectModel.group_score).toFixed(1));
				var tempFlag = 0; //判断分数是否输入正确
				if ((this.currentCorrectModel.stu_group_score >= 0) && (this.currentCorrectModel.stu_group_score <= this.currentCorrectModel.group_score)) {
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
								temp.groupName = '题组' + data.data.list[i].group_number;
								tempArr.push(temp);
							}
							this.nowGroupIndex = 0;
							this.groupNumberArray = [].concat(tempArr);
							//获取学生主观题或客观题数据
							this.getCurrentInfoData();
						} else {
							this.showToast('当前试卷没有可阅题组');
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getCurrentInfoData() { //获取学生主观题或客观题数据
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

							}
							if (data.data.msg) {
								this.showToast(data.data.msg);
							}
						} else {
							this.showToast(data.msg);
						}
					});
				} else { //主观题
					var comData = {
						index_code: this.itemData.access.split('#')[1],
						id: this.itemData.id, //教辅id
						group_number: tempGroup.group_number
					}
					this.showLoading();
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
									if(tempM.is_viewed == false){
										tempArr.push(tempM);
									}
								}
								if(tempArr.length == 0){
									this.showToast('当前题组已全部批改');
									return;
								}
								this.currentCorrectList = tempArr;
								this.currentCorrectIndex = 0;
								this.currentCorrectModel = this.currentCorrectList[this.currentCorrectIndex];
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
	::v-deep .uni-nav-bar-text {
		height: 40px;
	}

	.uni-input {
		background: #00CFBD;
		width: 150px !important;
		border-radius: 4px;
		color: white;
	}

	::v-deep .uniIcon {
		color: white !important;
		padding-left: 90px;
	}

	.submitBtn {
		width: 80px;
		margin: 20px 0 10px 40px;
		background-color: #00CFBD;
		border-color: #00CFBD;
		height: 30px;
		color: white;
		text-align: center;
		padding-top: 5px;
		border-radius: 5px;
	}
</style>
