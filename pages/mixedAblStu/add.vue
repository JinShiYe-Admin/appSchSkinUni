<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="">
			<view class="example-body">
				<view style="font-weight: 900;font-size: 18px;text-align: center;margin: 10px 20px;">{{pageData.name}}
				</view>
				<view class="modDetail">{{pageData.remark}}</view>
				<view v-for="(item,index) in pageData.mod_list" :key="index">
					<view v-if="item.mod_code == '1005'">
						<view style="font-weight: 900;font-size: 16px;margin: 15px 0 5px 15px;">
							{{++index}}.{{item.mod_name}}
						</view>
						<textarea maxlength="500" v-model="item.mod_data.award" class="rightView" style=""
							placeholder="请输入,限500字"></textarea>
					</view>
					<view v-if="item.mod_code == '1006'">
						<view style="font-weight: 900;font-size: 16px;margin: 15px 0 5px 15px;">
							{{++index}}.{{item.mod_name}}
						</view>
						<textarea maxlength="1000" v-model="item.mod_data.self_eval" class="rightView" style=""
							placeholder="请输入,限1000字"></textarea>
						<view v-if="item.mod_data.self_eval_sign" class="modDetail">现有签名：</view>
						<image v-if="item.mod_data.self_eval_sign" class="signImg" :src="item.mod_data.self_eval_sign"></image>
						<view v-if="item.mod_data.self_eval_sign" class="modDetail">若想重新签名，请点击：</view>
						<view v-else class="modDetail">请点击签名：</view>
						<view style="border: 1rpx dashed #555555;margin: 10px 20px;">
							<Signature ref="sig0" v-model="signSelf"></Signature>
						</view>
					</view>
					<view v-if="item.mod_code == '1004'">
						<view style="font-weight: 900;font-size: 16px;margin: 15px 0 5px 15px;">
							{{++index}}.{{item.mod_name}}
						</view>
						<textarea maxlength="300" v-model="item.mod_data.hobbies" class="rightView" style=""
							placeholder="请输入,限300字"></textarea>
					</view>
					<view v-if="item.mod_code == '1007'">
						<view style="font-weight: 900;font-size: 16px;margin: 15px 0 5px 15px;">
							{{++index}}.{{item.mod_name}}
						</view>
						<textarea maxlength="500" v-model="item.mod_data.fam_eval" class="rightView" style=""
							placeholder="请输入,限500字"></textarea>
						<view v-if="item.mod_data.fam_eval_sign" class="modDetail">现有签名：</view>
						<image v-if="item.mod_data.fam_eval_sign" class="signImg" :src="item.mod_data.fam_eval_sign"></image>
						<view v-if="item.mod_data.fam_eval_sign" class="modDetail">若想重新签名，请点击：</view>
						<view v-else class="modDetail">请点击签名：</view>
						<view style="border: 1rpx dashed #555555;margin: 10px 20px;">
							<Signature ref="sig1" v-model="signHome"></Signature>
						</view>
					</view>
					<view v-if="item.mod_code == '1009'">
						<view style="font-weight: 900;font-size: 16px;margin: 15px 0 5px 15px;">
							{{++index}}.{{item.mod_name}}
						</view>
						<view class="modDetail">参加各类学生组织、公益、服务活动的项目和内容：</view>
						<textarea maxlength="100" v-model="item.mod_data.content" class="rightView" style=""
							placeholder="请输入,限100字"></textarea>
						<view class="modDetail">时间和地点：</view>
						<textarea maxlength="100" v-model="item.mod_data.time_place" class="rightView" style=""
							placeholder="请输入,限100字"></textarea>
						<view class="modDetail">累计时长：</view>
						<input maxlength="2" type="number" v-model="item.mod_data.hours" class="rightView1"
							style="width: 100px;" placeholder="请输入时长" />
						<view style="margin-top: -30px;margin-left: 130px;font-size: 14px;">小时</view>
						<view class="modDetail" style="margin-top: 30px;">证明人：</view>
						<input maxlength="10" type="text" v-model="item.mod_data.certifier" class="rightView1"
							placeholder="请输入,限10字" />
					</view>
					<view v-if="item.mod_code == '1010'">
						<view style="font-weight: 900;font-size: 16px;margin: 15px 0 5px 15px;">
							{{++index}}.{{item.mod_name}}
						</view>
						<view class="modDetail" style="margin-top: 5px;">音乐、美术、舞蹈、戏剧（戏曲）、影视、书法、其它（选取最突出的项目填写）；</view>
						<view class="modDetail" style="margin-top: 5px;">兴趣特长、参加的活动、成果（包括作品或取得奖励）；</view>
						<textarea maxlength="500" v-model="item.mod_data.achievement" class="rightView" style=""
							placeholder="请输入,限500字"></textarea>
					</view>
					<view v-if="item.mod_code == '1011'">
						<view style="font-weight: 900;font-size: 16px;margin: 15px 0 5px 15px;">
							{{++index}}.{{item.mod_name}}
						</view>
						<view class="modDetail">各级运动会参与情况：</view>
						<textarea maxlength="500" v-model="item.mod_data.attendance" class="rightView" style=""
							placeholder="请输入,限500字"></textarea>
						<view class="modDetail">掌握较好的或感兴趣的体育项目：</view>
						<textarea maxlength="500" v-model="item.mod_data.interest" class="rightView" style=""
							placeholder="请输入,限500字"></textarea>
					</view>
					<view v-if="item.mod_code == '1012'">
						<view style="font-weight: 900;font-size: 16px;margin: 15px 0 5px 15px;">
							{{++index}}.{{item.mod_name}}
						</view>
						<textarea maxlength="500" v-model="item.mod_data.other" class="rightView" style=""
							placeholder="请输入,限500字"></textarea>
					</view>
				</view>
				<view style="text-align: center;margin-top: 10px;">
					<button style="width: 150px;border: 1px solid #00baad;color: #00baad;" type="default" size="mini"
						@click="gotoSubmit()">提交</button>
				</view>
				<view class="modDetail">注：可重复提交，请确保最后一次提交的信息准确无误！</view>
				<view style="height: 10px;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import Signature from '@/components/sin-signature/sin-signature.vue'
	// 七牛上传相关
	// import gUpload from "@/components/g-upload/g-upload.vue"
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				pageData: {},
				signSelf: '',
				signHome: ''
			}
		},
		components: {
			mynavBar,
			Signature
		},
		methods: {
			gotoSubmit() {
				// console.log('gotoSubmit:' + JSON.stringify(this.pageData.mod_list));
				// console.log('this.signSelf:' + this.signSelf);
				// console.log('this.signHome:' + this.signHome);
				let comData = {
					index_code: this.navItem.index_code,
					mixed_abl_id: this.pageData.mixed_abl_id, //综合素质评价id
					mixed_abl_stu_id: this.pageData.mixed_abl_stu_id, //综合素质学生信息id
				}
				var tempFlag = 0;
				for (var i = 0; i < this.pageData.mod_list.length; i++) {
					var tempM = this.pageData.mod_list[i];
					if (tempM.mod_code == '1005') {
						if (tempM.mod_data.award == null || tempM.mod_data.award.length == 0) {
							this.showToast('请输入' + tempM.mod_name);
							tempFlag++;
							break;
						} else {
							comData.award_id = tempM.mod_data.award_id;
							comData.award = tempM.mod_data.award;
						}
					} else if (tempM.mod_code == '1006') {
						if (tempM.mod_data.self_eval == null || tempM.mod_data.self_eval.length == 0) {
							this.showToast('请输入' + tempM.mod_name);
							tempFlag++;
							break;
						} else if ((tempM.mod_data.self_eval_sign == null || tempM.mod_data.self_eval_sign.length == 0) &&
							this.signSelf.length == 0) {
							this.showToast('请添加' + tempM.mod_name + '对应签名');
							tempFlag++;
							break;
						} else {
							comData.self_eval = tempM.mod_data.self_eval;
							comData.self_eval_sign = tempM.mod_data.self_eval_sign;
							comData.self_eval_id = tempM.mod_data.self_eval_id;
						}
					} else if (tempM.mod_code == '1004') {
						if (tempM.mod_data.hobbies == null || tempM.mod_data.hobbies.length == 0) {
							this.showToast('请输入' + tempM.mod_name);
							tempFlag++;
							break;
						} else {
							comData.hobbies_id = tempM.mod_data.hobbies_id;
							comData.hobbies = tempM.mod_data.hobbies;
						}
					} else if (tempM.mod_code == '1007') {
						if (tempM.mod_data.fam_eval == null || tempM.mod_data.fam_eval.length == 0) {
							this.showToast('请输入' + tempM.mod_name);
							tempFlag++;
							break;
						} else if ((tempM.mod_data.fam_eval_sign == null || tempM.mod_data.fam_eval_sign.length == 0) &&
							this
							.signHome.length == 0) {
							this.showToast('请添加' + tempM.mod_name + '对应签名');
							tempFlag++;
							break;
						} else {
							comData.fam_eval_id = tempM.mod_data.fam_eval_id;
							comData.fam_eval = tempM.mod_data.fam_eval;
							comData.fam_eval_sign = tempM.mod_data.fam_eval_sign;
						}
					} else if (tempM.mod_code == '1009') {
						if (tempM.mod_data.content == null || tempM.mod_data.content.length == 0) {
							this.showToast('请输入' + tempM.mod_name + '内容');
							tempFlag++;
							break;
						} else if (tempM.mod_data.time_place == null || tempM.mod_data.time_place.length == 0) {
							this.showToast('请输入' + tempM.mod_name + '时间地点');
							tempFlag++;
							break;
						} else if (tempM.mod_data.hours == null || tempM.mod_data.hours.length == 0) {
							this.showToast('请输入' + tempM.mod_name + '累计时长');
							tempFlag++;
							break;
						} else if (tempM.mod_data.certifier == null || tempM.mod_data.certifier.length == 0) {
							this.showToast('请输入' + tempM.mod_name + '证明人');
							tempFlag++;
							break;
						} else {
							comData.certifier = tempM.mod_data.certifier;
							comData.content = tempM.mod_data.content;
							comData.time_place = tempM.mod_data.time_place;
							comData.moral_id = tempM.mod_data.moral_id;
							comData.hours = tempM.mod_data.hours;
						}
					} else if (tempM.mod_code == '1010') {
						if (tempM.mod_data.achievement == null || tempM.mod_data.achievement.length == 0) {
							this.showToast('请输入' + tempM.mod_name);
							tempFlag++;
							break;
						} else {
							comData.achievement = tempM.mod_data.achievement;
							comData.appreciation_id = tempM.mod_data.appreciation_id;
						}
					} else if (tempM.mod_code == '1011') {
						if (tempM.mod_data.interest == null || tempM.mod_data.interest.length == 0) {
							this.showToast('请输入' + tempM.mod_name + '各级运动会参与情况');
							tempFlag++;
							break;
						} else if (tempM.mod_data.attendance == null || tempM.mod_data.attendance.length == 0) {
							this.showToast('请输入' + tempM.mod_name + '掌握较好或感兴趣的体育项目');
							tempFlag++;
							break;
						} else {
							comData.interest = tempM.mod_data.interest;
							comData.quality_id = tempM.mod_data.quality_id;
							comData.attendance = tempM.mod_data.attendance;
						}
					} else if (tempM.mod_code == '1012') {
						if (tempM.mod_data.other == null || tempM.mod_data.other.length == 0) {
							this.showToast('请输入' + tempM.mod_name);
							tempFlag++;
							break;
						} else {
							comData.other = tempM.mod_data.other;
							comData.other_id = tempM.mod_data.other_id;
						}
					}
				}
				if (tempFlag == 0) {
					// console.log('comData:' + JSON.stringify(comData));
					if (this.signSelf.length > 0) {
						// console.log('AAA111111');
						var fileName = 'self' + new Date().getTime() + '.png';
						var tempData = this.signSelf.replace('data:image/svg+xml;base64,', '');
						_this.showLoading();
						cloudFileUtil.uploadBase64Imge(1, fileName, tempData, this.QN_PB_NAME, this.QN_XSZHSZ, function(
							domain) {
							_this.hideLoading();
							comData.self_eval_sign = domain;
							// console.log("domain00: " + JSON.stringify(domain));
							// console.log('this.signSelf:' + _this.signSelf);
							// console.log('this.signHome:' + _this.signHome);
							if (_this.signHome.length > 0) {
								// console.log('AAA11111122');
								var fileName = 'home' + new Date().getTime() + '.png';
								var tempData = _this.signHome.replace('data:image/svg+xml;base64,', '');
								_this.showLoading();
								cloudFileUtil.uploadBase64Imge(1, fileName, tempData, _this.QN_PB_NAME, _this.QN_XSZHSZ,function(domain) {
									_this.hideLoading();
									comData.fam_eval_sign = domain;
									// console.log("domain1100: " + JSON.stringify(domain));
									// 1.5.保存报告填写记录
									_this.post(_this.globaData.INTERFACE_ZHSZ + 'stu/saveReport', comData, (data0, data) => {
										_this.hideLoading();
										if (data.code == 0) {
											_this.showToast(data.msg);
											uni.navigateBack();
										} else {
											_this.showToast(data.msg);
										}
									});
								});
							} else {
								// console.log('AAA11111133');
								_this.showLoading();
								// 1.5.保存报告填写记录
								_this.post(_this.globaData.INTERFACE_ZHSZ + 'stu/saveReport', comData, (data0, data) => {
									_this.hideLoading();
									if (data.code == 0) {
										_this.showToast(data.msg);
										uni.navigateBack();
									} else {
										_this.showToast(data.msg);
									}
								});
							}
						});
					} else if (_this.signHome.length > 0) {
						// console.log('AAA2222222');
						var fileName = 'home' + new Date().getTime() + '.png';
						var tempData = _this.signHome.replace('data:image/svg+xml;base64,', '');
						_this.showLoading();
						cloudFileUtil.uploadBase64Imge(1, fileName, tempData, _this.QN_PB_NAME, _this.QN_XSZHSZ, function(domain) {
							_this.hideLoading();
							comData.fam_eval_sign = domain;
							// console.log("domain11: " + JSON.stringify(domain));
							// 1.5.保存报告填写记录
							_this.post(_this.globaData.INTERFACE_ZHSZ + 'stu/saveReport', comData, (data0, data) => {
								_this.hideLoading();
								if (data.code == 0) {
									_this.showToast(data.msg);
									uni.navigateBack();
								} else {
									_this.showToast(data.msg);
								}
							});
						});
					} else {
						// console.log('AAA3333333');
						// 1.5.保存报告填写记录
						this.post(this.globaData.INTERFACE_ZHSZ + 'stu/saveReport', comData, (data0, data) => {
							this.hideLoading();
							if (data.code == 0) {
								this.showToast(data.msg);
								uni.navigateBack();
							} else {
								this.showToast(data.msg);
							}
						});
					}
				}
			},
			getReportEval() {
				let comData = {
					mixed_abl_stu_id: this.navItem.mixed_abl_stu_id,
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				// 列表查询报告填写记录
				this.post(this.globaData.INTERFACE_ZHSZ + 'stu/reportEval', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pageData = data.data;
					} else {
						this.showToast(data.msg);
					}
				});
			},
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			this.navItem.text = '报告填写';
			// this.index_code=this.navItem.access.split("#")[1]
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.getReportEval();
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
	}
</script>

<style>
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	.card-line {
		height: 1px;
		background-color: #e5e5e5;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.cardPCls {
		width: 40px !important;
		height: 18px;
		background: #04D0BE;
		color: white;
		font-size: 12px;
		text-align: center;
		padding-top: 0px;
		margin-top: 3px;
		float: left;
	}

	.cardConent {
		font-size: 13px;
		word-break: break-all;
		/* overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap; */
		color: #787878;
	}

	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		width: calc(100% - 40px);
		margin-left: 15px;
		height: 80px;
		padding: 5px 0 10px 10px;
	}

	.rightView1 {
		border: 1px solid gainsboro;
		font-size: 14px;
		width: calc(100% - 40px);
		margin-left: 15px;
		padding: 8px 0 8px 10px;
	}

	.modDetail {
		font-size: 14px;
		margin: 20px 20px 2px;
	}
	
	.signImg{
		border: 1px solid gainsboro;
		font-size: 14px;
		width: 150px;
		height: 70px;
		border-radius: 5px;
		margin-top: -25px;
		margin-left: 90px;
	}
</style>
