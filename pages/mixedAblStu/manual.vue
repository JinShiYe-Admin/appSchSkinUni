<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<uni-row>
				<uni-col :span="24">
					<picker v-if="pjArray.length>0" class="flex-box" @change="pjClick" :value="pjIndex" :range="pjArray" range-key="name">
						<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
							{{pjArray[pjIndex].name}}
							<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
						</view>
					</picker>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<view v-for="(item,index) in listArray" :key="index">
				<view v-if="item.mod_code == '1001'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-bottom: 5px;'>{{item.mod_name}}</view>
						<uni-row>
							<uni-col :span='12' v-for="(model,index1) in item.mod_array" :key="index1">
								<view style='font-size: 14px;margin: 2px 0;'>
									{{model.name}}：<span style='color: #bd3124;font-weight: 600;font-size: 15px;'>{{model.value}}</span>
								</view>
							</uni-col>
						</uni-row>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1002'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-bottom: 5px;'>{{item.mod_name}}</view>
						<uni-row>
							<uni-col :span='12' v-for="(model,index1) in item.mod_array" :key="index1">
								<view style='font-size: 14px;margin: 2px 0;'>
									{{model.name}}：<span style='color: #bd3124;font-weight: 600;font-size: 15px;'>{{model.value}}</span>
								</view>
							</uni-col>
						</uni-row>
						<view v-if="item.mod_data.remark&&item.mod_data.remark.length>0" class='detail-text' style="text-indent:30px;">{{item.mod_data.remark}}</view>
						<view v-else style="text-align: center;" class='detail-text'>暂无</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1003'">
					<uni-card isShadow>
						<view style='font-weight: 600;margin-bottom: 5px;'>{{item.mod_name}}</view>
						<uni-row>
							<uni-col :span='12' v-for="(model,index1) in item.mod_array" :key="index1">
								<view style="margin: 0 5px;">
									<view style="font-size: 14px;text-align: center;">
										<span style='font-size: 25px;font-weight: 600;color: #bd3124;'>{{model.name1}}</span>
										/{{model.name2}}学时
									</view>
									<view style="font-size: 15px;font-weight: 600;text-align: center;height: 35px;">{{model.name0}}</view>
								</view>
							</uni-col>
						</uni-row>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1005'">
					<uni-card isShadow>
						<view style='font-weight: 600;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.award&&item.mod_data.award.length>0" class='detail-text'>{{item.mod_data.award}}</view>
						<view v-else style="text-align: center;" class='detail-text'>暂无</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1006'">
					<uni-card isShadow>
						<view style='font-weight: 600;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.self_eval&&item.mod_data.self_eval.length>0" class='detail-text'>{{item.mod_data.self_eval}}</view>
						<view v-else style="text-align: center;" class='detail-text'>暂无</view>
						<image v-if="item.mod_data.self_eval_sign" class="signImg" :src="item.mod_data.self_eval_sign"></image>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1004'">
					<uni-card isShadow>
						<view style='font-weight: 600;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.hobbies&&item.mod_data.hobbies.length>0" class='detail-text'>{{item.mod_data.hobbies}}</view>
						<view v-else style="text-align: center;" class='detail-text'>暂无</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1007'">
					<uni-card isShadow>
						<view style='font-weight: 600;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.fam_eval&&item.mod_data.fam_eval.length>0" class='detail-text'>{{item.mod_data.fam_eval}}</view>
						<view v-else style="text-align: center;" class='detail-text'>暂无</view>
						<image v-if="item.mod_data.fam_eval_sign" class="signImg" :src="item.mod_data.fam_eval_sign"></image>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1008'">
					<uni-card isShadow>
						<view style='font-weight: 600;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.tch_eval&&item.mod_data.tch_eval.length>0" class='detail-text'>{{item.mod_data.tch_eval}}</view>
						<view v-else style="text-align: center;" class='detail-text'>暂无</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1009'">
					<uni-card isShadow>
						<view style='font-weight: 600;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.content" class="lTitle">参加的项目和内容：</view>
						<view class='detail-text' style="">{{item.mod_data.content}}</view>
						<view v-if="item.mod_data.time_place" class="lTitle">时间和地点：</view>
						<view class='detail-text' style="">{{item.mod_data.time_place}}</view>
						<view v-if="item.mod_data.hours" class="lTitle">累计时长：<span style='color: #939393;'>{{item.mod_data.hours}}小时</span></view>
						<view v-if="item.mod_data.certifier" class="lTitle">证明人：<span style='color: #939393;'>{{item.mod_data.certifier}}</span></view>
						<view v-else style="text-align: center;" class='detail-text'>暂无</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1010'">
					<uni-card isShadow>
						<view style='font-weight: 600;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.achievement&&item.mod_data.achievement.length>0" class='detail-text'>{{item.mod_data.achievement}}</view>
						<view v-else style="text-align: center;" class='detail-text'>暂无</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1011'">
					<uni-card isShadow>
						<view style='font-weight: 600;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.attendance" class="lTitle">各级运动会参与情况：</view>
						<view class='detail-text' style="">{{item.mod_data.attendance}}</view>
						<view v-if="item.mod_data.interest" class="lTitle">掌握较好的或感兴趣的体育项目：</view>
						<view v-else style="text-align: center;" class='detail-text'>暂无</view>
						<view class='detail-text' style="">{{item.mod_data.interest}}</view>
					</uni-card>
				</view>
				<view v-if="item.mod_code == '1012'">
					<uni-card isShadow>
						<view style='font-weight: 600;'>{{item.mod_name}}</view>
						<view v-if="item.mod_data.other&&item.mod_data.other.length>0" class='detail-text'>{{item.mod_data.other}}</view>
						<view v-else style="text-align: center;" class='detail-text'>暂无</view>
					</uni-card>
				</view>
			</view>
			<view style="height: 5px;"></view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				pagedata: [],
				//顶部筛选框相关内容
				pjIndex: 0,
				pjArray: [],
				listArray: '',
			}
		},
		components: {
			mynavBar
		},
		methods: {
			pjClick: function(e) {
				if (this.pjIndex !== e.detail.value) {
					this.pjIndex = e.detail.value;
					this.showLoading()
					this.getList0();
				}
			},
			getPj() {//1.2.列表查询综合素质评价 
				let comData = {
					grd_code: this.personInfo.grd_code,
					cls_code: this.personInfo.cls_code,
					// eval_type:-1,
					// status: 2,
					index_code: this.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZHSZ + 'list', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pjArray = data.data.list;
						if (data.data.list.length ==0) {
						// if (this.pjArray[this.pjIndex].text.length>0) {
							this.showToast('当前学生暂无评价');
						} else{
							this.getList0();
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getList0() { //获取页面数据
				if(this.pjArray[this.pjIndex].name.length==0){
					return;
				}
				let comData = {
					mixed_abl_id: this.pjArray[this.pjIndex].id,
					stu_code: this.personInfo.stu_code,
					index_code: this.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZHSZ + 'stu/manual', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (data.data.mod_list&&data.data.mod_list.length>0) {
							for (var i = 0; i < data.data.mod_list.length; i++) {
								var tempM = data.data.mod_list[i];
								if (tempM.mod_code == '1001') {
									var tempArr = [];
									if (tempM.mod_data.maths) {
										var tempS = {
											name:'数学',
											value:tempM.mod_data.maths
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.ch_skill) {
										console.log('tempM.mod_data.ch_skill:'+tempM.mod_data.ch_skill)
										var tempS = {
											name:'化学技能',
											value:tempM.mod_data.ch_skill
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.political) {
										var tempS = {
											name:'道德与法治',
											value:tempM.mod_data.political
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.chinese) {
										var tempS = {
											name:'语文',
											value:tempM.mod_data.chinese
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.computer) {
										var tempS = {
											name:'信息技术',
											value:tempM.mod_data.computer
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.music) {
										var tempS = {
											name:'音乐',
											value:tempM.mod_data.music
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.geography) {
										var tempS = {
											name:'地理',
											value:tempM.mod_data.geography
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.physics) {
										var tempS = {
											name:'物理',
											value:tempM.mod_data.physics
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.english) {
										var tempS = {
											name:'英语',
											value:tempM.mod_data.english
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.p_skill) {
										var tempS = {
											name:'物理技能',
											value:tempM.mod_data.p_skill
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.chemistry) {
										var tempS = {
											name:'化学',
											value:tempM.mod_data.chemistry
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.art) {
										var tempS = {
											name:'美术',
											value:tempM.mod_data.art
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.biology) {
										var tempS = {
											name:'生物',
											value:tempM.mod_data.biology
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.biol_skill) {
										var tempS = {
											name:'生物技能',
											value:tempM.mod_data.biol_skill
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.history) {
										var tempS = {
											name:'历史',
											value:tempM.mod_data.history
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.pe) {
										var tempS = {
											name:'体育',
											value:tempM.mod_data.pe
										}
										tempArr.push(tempS);
									}
									if (tempM.mod_data.location) {
										var tempS = {
											name:'当地课程',
											value:tempM.mod_data.location
										}
										tempArr.push(tempS);
									}
									tempM.mod_array = tempArr;
								}
								if (tempM.mod_code == '1002') {
									var tempArr = [];
									var tempS = {
										name: '身心健康',
										value: tempM.mod_data.quality && tempM.mod_data.quality.length > 0 ? tempM
											.mod_data.quality : '-'
									}
									tempArr.push(tempS);
									tempS = {
										name: '思想品德',
										value: tempM.mod_data.moral && tempM.mod_data.moral.length > 0 ?
											tempM.mod_data.moral : '-'
									}
									tempArr.push(tempS);
									tempS = {
										name: '艺术素养',
										value: tempM.mod_data.appreciation && tempM.mod_data.appreciation.length >
											0 ? tempM.mod_data.appreciation : '-'
									}
									tempArr.push(tempS);
									tempS = {
										name: '学业水平',
										value: tempM.mod_data.learning && tempM.mod_data.learning.length > 0 ?
											tempM.mod_data.learning : '-'
									}
									tempArr.push(tempS);
									tempS = {
										name: '社会实践',
										value: tempM.mod_data.practice && tempM.mod_data.practice.length > 0 ?
											tempM.mod_data.practice : '-'
									}
									tempArr.push(tempS);
									tempM.mod_array = tempArr;
								}
								if (tempM.mod_code == '1003') {
									var tempArr = [];
									var tempS = {
										name0: '研究性学习',
										name1:tempM.mod_data.study_lv&&tempM.mod_data.study_lv.length>0?tempM.mod_data.study_lv:'-',
										name2:tempM.mod_data.study_hours&&tempM.mod_data.study_hours.length>0?tempM.mod_data.study_hours:'-'
									}
									tempArr.push(tempS);
							
									tempS = {
										name0: '社会实践与社区服务',
										name1:tempM.mod_data.prac_lv&&tempM.mod_data.prac_lv.length>0?tempM.mod_data.prac_lv:'-',
										name2:tempM.mod_data.prac_hours&&tempM.mod_data.prac_hours.length>0?tempM.mod_data.prac_hours:'-'
									}
									tempArr.push(tempS);
							
									tempS = {
										name0: '劳动技术',
										name1:tempM.mod_data.labour_lv&&tempM.mod_data.labour_lv.length>0?tempM.mod_data.labour_lv:'-',
										name2:tempM.mod_data.labour_hours&&tempM.mod_data.labour_hours.length>0?tempM.mod_data.labour_hours:'-'
									}
									tempArr.push(tempS);
									
									tempS = {
										name0:'信息技术',
										name1:tempM.mod_data.computer_lv&&tempM.mod_data.computer_lv.length>0?tempM.mod_data.computer_lv:'-',
										name2:tempM.mod_data.computer_hours&&tempM.mod_data.computer_hours.length>0?tempM.mod_data.computer_hours:'-'
									}
									tempArr.push(tempS);
									tempM.mod_array = tempArr;
								}
							}
							this.listArray = data.data.mod_list;
						} else{
							this.showToast('暂无数据');
						}
						
					} else {
						this.showToast(data.msg);
					}
				})
			}
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			const itemData = util.getPageData(options);
			itemData.index = 100
			this.navItem = itemData;
			this.index_code = itemData.access.split("#")[1];
			this.getPj();
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

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.content {
		margin: 2px 0;
	}

	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
	}

	.line {
		height: 1px;
		background-color: #e5e5e5;
		margin: 5px 0;
	}

	.title-text {
		display: flex;
		align-items: center;
		width: 80vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.lTitle{
		font-weight: 600;margin-bottom: 5px;font-size: 14px;margin-top: 10px;
	}

	.detail-text {
		color: #939393;
		font-size: 13px;
		margin: 3px 0;
		word-break: break-all;
	}

	.leaveType {
		font-size: 12px;
		width: auto;
		color: #EFAD44;
		padding: 0px 3px;
		border-radius: 4px;
		margin-right: 3px;
		border: 1px solid #EFAD44;
	}

	.uni-input-input {
		font-size: 13px;
	}
	
	.signImg{
		border: 1px solid gainsboro;
		font-size: 14px;
		width: 150px;
		height: 70px;
		border-radius: 5px;
		margin-top: 5px;
		margin-left: calc( 100% - 155px) ;
	}
</style>
