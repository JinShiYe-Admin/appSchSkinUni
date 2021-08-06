<template>
	<view>
		<uniNavBar v-if="showNav" :title='itemData.name' left-icon="back" backgroundColor='#00CFBD' fixed='true' statusBar='true' color='white' @clickLeft='clickLeft()'></uniNavBar>
		<p v-if="currentInfoData.count_info" style="margin-top: 10px;text-align: center;color: black;font-size: 14px;">
			该题组已阅{{currentInfoData.count_info.view_count}}份，当前第{{currentInfoData.count_info.count}}份，任务量{{currentInfoData.count_info.group_count}}份
		</p>
		<popover v-if="groupNumberArray.length>0" ref="popover" :viewName="groupNumberArray[nowGroupIndex]"
			:btnList="groupNumberArray" direction="left" modalLeftPos="20px" modalTopPos="50px" modalWidth='150px'
			@select="selectPopover"></popover>
		<view v-if="currentInfoData.eqs" style="margin-left: 20px;margin-top: 10px;" v-for="eqsModel in currentInfoData.eqs" :key="eqsModel.id">
			<span
				style="color: #00CFBD;border: 1px solid #00CFBD;border-radius: 3px;font-size: 13px;">第{{eqsModel.question_number}}题得分</span>
			<view v-if="eqsModel.step_score_list">
				<view style="margin-top: 5px;">
					<view style="margin-top: 5px;" v-for="(stepModel,index) in eqsModel.step_score_list" :key="stepModel.id">
						<span style="color: white;">({{index+1}})</span>
						<uni-easyinput type="number" @blur="inputChange(stepModel)" placeholder="请输入分数"
							style="width: 150px;font-size: 13px;" v-model="stepModel.stu_score">></uni-easyinput>
						<button class="mui-btn" @tap='clickScore(stepModel)'
							style="font-size: 13px;color: #00CFBD;width: 60px;height: 35px;margin-top: -35px;margin-left: 146px;">/{{stepModel.score}}</button>
					</view>
				</view>
			</view>
			<view v-else>
				<view style="margin-top: 5px;">
					<uni-easyinput type="number" @blur="inputChange(eqsModel)" placeholder="请输入分数"
						style="width: 150px;font-size: 13px;" v-model="eqsModel.stu_score">></uni-easyinput>
					<button class="mui-btn" @tap='clickScore(eqsModel)'
						style="font-size: 13px;color: #00CFBD;width: 60px;height: 35px;margin-top: -35px;margin-left: 146px;">/{{eqsModel.score}}</button>
				</view>
			</view>
		</view>
		<view v-if="currentInfoData.evaluation" @tap='clickSubmit'
			style="width: 80px;margin: 10px 0 10px 40px;background-color: #00CFBD;border-color: #00CFBD;height: 30px;color: white;text-align: center;padding-top: 5px;border-radius: 5px;">
			提交
		</view>
		<p style="color: #d43030;margin-left: 20px;margin-bottom: 0px;">如需添加批阅，请点击图片</p>
		<img :src=imgSrc style="margin: 10px 20px 0px 20px;width: 85%;" @tap="test.usePED">
	</view>
</template>
<script module="test" lang="renderjs">	import {imageInfo} from '@/commom/picture/index.js';	export default {		methods: {			usePED() {
				this.showNav = false;				console.log('usePEDusePED1');				let ped = new imageInfo('http://jbsch-pb.zhuxue101.net/test/task_result_detail/843-1410483399553974281.jpg', ()=>{});				console.log("this.ped: ",ped);			},		}	}</script>

<script>
	import util from '@/commom/util.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import {imageInfo} from '@/commom/picture/index.js';
	import popover from '@/components/dean-popover/dean-popover';
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
				typeFlag: 0, //0未选择对错标识，1对，2错，3半对
				typeArray: [], //点的标识数组
				ped : null,
				showNav:true,
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
			//1.4.阅卷任务题组列表
			this.getGroupNumberData();
			// 点击微信下方的返回按钮，如果是在图片编辑状态，隐藏
			window.addEventListener('popstate', function() {
				this.showNav = true;
				// 隐藏
			});
		},
		components: {
			popover,
			uniNavBar
		},
		methods: {
			clickLeft: function() {
				console.log('clickLeft');
				uni.navigateBack();
			},
			usePED() {
				this.showNav = false;
				console.log('usePEDusePED');
				this.ped = new imageInfo(this.imgSrc, this.saveFn);
			},
			saveFn(data) {
				console.log('saveFnsaveFnsaveFn');
				this.showNav = true;
				if(data.length>0){
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
						symbols: this.typeArray, //标记坐标信息
						task_id: this.currentInfoData.evaluation.task_id, //任务id
					};
					let comData = {
						index_code: this.itemData.access.split('#')[1],
						task_id: this.itemData.id, //任务id
						user_code: this.personInfo.user_code, //用户代码
						evaluation: tempMMM,
						eqs: tempA, //题组下题目
					}
					console.log('this.imgSrcFlag:'+this.imgSrcFlag);
					if (this.imgSrcFlag == 0) {
						this.showLoading();
						//1.6.保存批改
						this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'evaluation/save', comData, (data0,
							data) => {
							this.hideLoading();
							if (data.code == 0) {
								this.typeFlag = 0;
								this.typeArray = [];
								//1.5.阅卷任务题组的批改情况
								this.getCurrentInfoData();
							} else {
								this.showToast(data.msg);
							}
						});
					} else {
						// 先将涂鸦后的图片，上传七牛
						this.showLoading();
						var fileName = 'markingPapers' + new Date().getTime();
						var tempData = this.imgSrc.replace('data:image/png;base64,','');
						console.log('tempDatatempDatatempDatatempData');
						cloudFileUtil.uploadIDCardHeadImge(1, fileName, tempData, function(domain) {
							console.log("domain: " + JSON.stringify(domain));
							tempMMM.painting_img = domain;
							comData.evaluation = tempMMM;
							console.log('comData:::'+JSON.stringify(comData));
							//1.6.保存批改
							this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'evaluation/save', comData, (data0,data) => {
									this.hideLoading();
									if (data.code == 0) {
										this.typeFlag = 0;
										this.typeArray = [];
										//1.5.阅卷任务题组的批改情况
										this.getCurrentInfoData();
									} else {
										this.showToast(data.msg);
									}
								});
						}, function() {
							this.hideLoading();
						})
					}
				} else {
					this.showToast('请输入正确的分数');
				}
			},
			selectPopover(index) {
				if (this.nowGroupIndex != index) {
					this.nowGroupIndex = index;
					this.currentInfoData = {};
					this.typeFlag = 0;
					this.typeArray = [];
					//1.5.阅卷任务题组的批改情况
					this.getCurrentInfoData();
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
								if (tempE.stu_score) {

								} else {
									tempE.stu_score = '';
								}
								if (tempE.step_score_list) {
									for (var a = 0; a < tempE.step_score_list.length; a++) {
										var tempS = tempE.step_score_list[a];
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

</style>
