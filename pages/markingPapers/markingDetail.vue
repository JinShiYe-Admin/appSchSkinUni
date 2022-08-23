<template>
	<view>
		<uniNavBar v-if="showNav" :title='itemData.name' left-icon="back" backgroundColor='#00CFBD' fixed='true'
			statusBar='true' color='white' @clickLeft='clickLeft()'></uniNavBar>
		<p v-if="currentInfoData.count_info" style="margin-top: 10px;text-align: center;color: black;font-size: 14px;">
			该题组已阅{{currentInfoData.count_info.view_count}}份，当前第{{currentInfoData.count_info.count}}份，任务量{{currentInfoData.count_info.group_count}}份
		</p>
		<picker @change="bindPickerChange" :value="nowGroupIndex" :range="groupNumberArray"
			style="margin: 10px 150px 0 20px;">
			<view class="uni-input">{{groupNumberArray[nowGroupIndex]}}
				<uni-icons type="forward" size="15" class="uniIcon"></uni-icons>
			</view>
		</picker>
		<view v-if="currentInfoData.evaluation" @tap='clickSubmit'
			style="width: 80px;margin: -35px 20px 10px 0;background-color: #00CFBD;border-color: #00CFBD;height: 30px;color: white;text-align: center;padding-top: 5px;border-radius: 5px;float: right;">
			提交
		</view>
		<p style="color: #d43030;margin: 10px 0 5px 20px;">如需添加批阅，请点击图片</p>
		<image v-show='imgSrc.length>0' mode="widthFix" :src="imgSrc" :imgSrc='imgSrc'
			:change:imgSrc="renderScript.receiveSrc" style="margin: 10px 20px 0px 20px;width: 85%;max-height: 280px;"
			@click="renderScript.usePED" id="renderScript" class="renderScript"></image>
		<view v-if="currentInfoData.eqs" style="margin-left: 20px;margin-top: 20px;"
			v-for="eqsModel in currentInfoData.eqs" :key="eqsModel.id">
			<view v-if="eqsModel.step_score_list">
				<view style="margin-top: 5px;">
					<span
						style="color: #00CFBD;border: 1px solid #00CFBD;border-radius: 3px;font-size: 13px;">第{{eqsModel.question_number}}题得分</span>
					<uni-row style="margin-top: 10px;">
						<uni-col :span="8" v-for="(stepModel,index) in eqsModel.step_score_list" :key="index">
							<view style="margin-top: 5px;font-size: 13px;" @click="clickShowSelect(stepModel)">({{stepModel.sub_question_number}}).
							<span style="font-size: 13px;border-bottom: 1px solid #888888;display: inline-block;width: 70px;margin-left: 5px;text-align: center;">{{stepModel.stu_score}}</span>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</view>
			<view v-else>
				<view style="margin-top: 5px;font-size: 13px;" @click="clickShowSelect(eqsModel)">{{eqsModel.question_number}}.
				<span style="font-size: 13px;border-bottom: 1px solid #888888;display: inline-block;width: 80px;margin-left: 5px;text-align: center;">{{eqsModel.stu_score}}</span>
				</view>
			</view>
		</view>
		<br>
		<uni-popup ref="popupSelect" type="bottom" style="background-color: white;">
			<scroll-view
				style="background-color: white;border-radius: 5px 5px 0px 0px;width: 86%;margin-left: 7%;"
				class="popupSelect" scroll-y="true">
				<view class="pupName" style="margin: 5px 0 0 10px;">{{popModel.questionNum}}<span style='color: #00CFBD;font-size: 13px;margin-top: 5px;margin-left: 10px;'>(满分{{popModel.score}}分)</span>：{{popScore}}</view>
				<uni-row style="margin: 5px 10px 10px 10px;">
					<uni-col :span="4" v-for="(num,index) in numberList" :key="index">
						<view class="popNoSelect" @click="clickNum(index)">
							{{num}}
						</view>
					</uni-col>
					<uni-col :span="4" v-for="(model,index) in numberClear" :key="model">
						<view class="popNoSelect" @click="clickClear(index)">
							{{model}}
						</view>
					</uni-col>
				</uni-row>
			</scroll-view>
			<view style="background-color: white;height: 50px;border-radius: 0px 0px 5px 5px;width: 86%;margin-left: 7%;margin-bottom: 20px;">
				<button class="mini-btn" type="default" size="mini" @click="popSure(0)">取消</button>
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #00cfbd;border-color: #00cfbd;color: white;"
					@click="popSure(1)">确定</button>
			</view>
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
				groupNumberArray: [],
				nowGroupIndex: '',
				currentInfoData: {},
				imgPed: null, //
				imgSrc: '', //试卷图片
				imgSrcFlag: 0, //判断是否进行涂鸦
				ped: null,
				showNav: true,
				popModel:{},
				numberList:[],
				numberClear:[0.5,'清除','零分','满分'],
				popScore:'0',
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
			//#ifdef H5
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
			//#ifdef H5
			document.title = ""
			//#endif
		},
		components: {
			uniNavBar
		},
		methods: {
			clickNum(index){
				if(this.popScore == 0){
					this.popScore = index.toString();
				}else{
					// var tempScore = this.popScore+index;
					var tempArr = this.popScore.split('.');
					console.log('tempArr:'+tempArr.length);
					var tempScore;
					if(tempArr.length == 1){
						tempScore = this.popScore+index;
					}else{
						// tempScore = parseFloat(this.popScore)-0.5;
						tempScore = tempArr[0]+index+'.5';
					}
					if(parseFloat(tempScore)>parseFloat(this.popModel.score)){
						this.popScore = index.toString();
					}else{
						this.popScore = parseFloat(tempScore).toString();
					}
				}
			},
			clickClear(index){
				if(index == 0){
					console.log('this.popScore:'+this.popScore);
					var tempArr = this.popScore.split('.');
					console.log('tempArr:'+tempArr.length);
					var tempScore;
					if(tempArr.length == 1){
						tempScore = parseFloat(this.popScore)+0.5;
					}else{
						tempScore = parseFloat(this.popScore)-0.5;
					}
					if(parseFloat(tempScore)>parseFloat(this.popModel.score)){
						this.popScore = 0.5.toString();
					}else{
						this.popScore = tempScore.toString();
					}
				}else if(index == 1){
					this.popScore = '0';
				}else if(index == 2){
					this.popScore = '0';
				}else if(index == 3){
					var tempArr = this.popModel.score.toString().split('.');
					if(tempArr.length == 1){
						this.popScore = this.popModel.score.toString();
					}else{
						if(tempArr[1] != 0){
							this.popScore = this.popModel.score.toString();
						}else{
							this.popScore = tempArr[0].toString();
						}
					}
				}
			},
			popSure(flag) {
				if(flag == 1){
					this.popModel.stu_score = this.popScore;
				}
				this.$refs.popupSelect.close();
			},
			clickShowSelect(model) {
				this.popModel = model;
				this.popScore = model.stu_score.toString();
				if(this.popScore.length == 0){
					this.popScore = '0';
				}
				console.log('clickShowSelect:'+JSON.stringify(model));
				this.numberList = [];
				var tempNum = model.score;
				if(model.score>9){
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
							if (parseFloat(tempS.stu_score).toFixed(1) >= 0 && parseFloat(tempS
									.stu_score).toFixed(1) <= parseFloat(tempS.score).toFixed(
									1)) {
								tempScore = parseFloat(tempScore) + parseFloat(tempS.stu_score);
							} else {
								tempFlag++;
							}
						}
						tempE.stu_score = tempScore;
					}
					if (parseFloat(tempE.stu_score).toFixed(1) >= 0 && parseFloat(tempE
							.stu_score).toFixed(1) <= parseFloat(tempE.score)) {
						tempEqs.evaluation_id = tempE.evaluation_id;
						tempEqs.id = tempE.id;
						tempEqs.question_number = tempE.question_number;
						tempEqs.score = tempE.score;
						if (tempE.step_score_list) {
							tempEqs.step_score_list = [].concat(tempE.step_score_list);
							var tempScore = 0;
							for (var a = 0; a < tempE.step_score_list.length; a++) {
								var tempS = tempE.step_score_list[a];
								tempScore = tempScore + parseFloat(tempS.stu_score).toFixed(1);
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
					this.hideLoading();
					console.log('getGroupNumber:' + JSON.stringify(data));
					if (data.code == 0) {
						if (data.data.list && data.data.list.length > 0) {
							let tempArr = [];
							for (var i = 0; i < data.data.list.length; i++) {
								let temp = data.data.list[i];
								temp = '题组' + data.data.list[i];
								tempArr.push(temp);
							}
							this.nowGroupIndex = 0;
							this.groupNumberArray = [].concat(tempArr);
							//1.5.阅卷任务题组的批改情况
							this.getCurrentInfoData();
						} else {
							this.showToast('当前试卷没有可阅题组');
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getCurrentInfoData() {
				var comData = {
					index_code: this.itemData.access.split('#')[1],
					task_id: this.itemData.id, //任务id
					user_code: this.personInfo.user_code, //用户代码
					group_number: this.groupNumberArray[this.nowGroupIndex].replace('题组', ''), //题组号码
				}
				this.showLoading();
				//1.5.阅卷任务题组的批改情况
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'evaluation/currentInfo', comData, (data0, data) => {
					console.log('currentInfo:' + JSON.stringify(data));
					this.hideLoading();
					if (data.code == 0) {
						if (data.data.evaluation) {
							for (var i = 0; i < data.data.eqs.length; i++) {
								var tempE = data.data.eqs[i];
								tempE.questionNum = '第'+tempE.question_number+'题';
								if (tempE.stu_score) {

								} else {
									tempE.stu_score = '';
								}
								if (tempE.step_score_list) {
									for (var a = 0; a < tempE.step_score_list.length; a++) {
										var tempS = tempE.step_score_list[a];
										tempS.questionNum = '第'+tempE.question_number+'题-'+'('+tempS.sub_question_number+')';
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
		width: 100px;
		height: 35px;
		padding-top: 3px !important;
		margin-left: 40px;
	}
</style>
