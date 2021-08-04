<template>
	<view>
		<p v-if="currentInfoData.count_info" style="margin-top: 10px;text-align: center;color: black;font-size: 14px;">
			该题组已阅{{currentInfoData.count_info.view_count}}份，当前第{{currentInfoData.count_info.count}}份，任务量{{currentInfoData.count_info.group_count}}份
		</p>
		<uni-combox v-if="groupNumberArray.length>0" labelWidth="150px" :candidates="groupNumberArray" placeholder="请选择题组" :value="nowGroupNumber"></uni-combox>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				groupNumberArray:['北京', '南京', '东京', '武汉', '天津', '上海', '海口'],
				nowGroupNumber:'',
				currentInfoData:{},
				imgSrc:'',
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.name
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//1.4.阅卷任务题组列表
			this.getGroupNumberData();
		},
		methods: {
			getGroupNumberData() {//1.4.阅卷任务题组列表
				var comData = {
					index_code: this.itemData.access.split('#')[1],
					task_id: this.itemData.id, //任务id
					user_code: this.personInfo.user_code, //用户代码
				}
				this.showLoading();
				//1.2.月考分页
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'evaluation/getGroupNumber', comData, (data0,data) => {
					this.hideLoading();
					console.log('getGroupNumber:'+JSON.stringify(data));
					if (data.code == 0) {
						if (data.data.list && data.data.list.length > 0) {
							// this.nowGroupNumber = data.data.list[0].toString();
							// this.groupNumberArray = [].concat(data.data.list);
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
					group_number: this.nowGroupNumber, //题组号码
				}
				//1.5.阅卷任务题组的批改情况
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'evaluation/currentInfo', comData, (data0,data) => {
					console.log('currentInfo:'+JSON.stringify(data));
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
