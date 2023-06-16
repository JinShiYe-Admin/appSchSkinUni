<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="height: 30px;padding: 15px 0 0 20px;background: white;font-size: 12px;">
			已批：{{nextData.correct_count}}/{{nextData.stu_count}}</view>
		<view style="font-size: 13px;float: right;margin: -30px 20px 0 0;color: rgb(44, 150, 189);" @click="lookHMWK">
			查看题目</view>
		<uni-card isShadow style="margin: 10px 5px 0;">
			<view v-if="nextData.stu_work_submit">
				<view style="font-size: 14px;font-weight: 900;">{{nextData.stu_work_submit.cls_name}}
					{{nextData.stu_work_submit.stu_name}}</view>
				<view class="select-line"></view>
				<view class="stuAnswer">
					答：{{nextData.stu_work_submit.submit_answer.length>0?nextData.stu_work_submit.submit_answer:'无'}}
				</view>
				<g-upload ref='gUpload' :mode="submitImgList" :control='false' :deleteBtn='false' columnNum="3"></g-upload>
				<view style="font-size: 14px;font-weight: 900;">批改</view>
				<view class="select-line"></view>
				<uni-row style="margin-top: 10px;">
					<uni-col :span="4" style="margin-bottom: 15px;">
						<view class="rowStyle" style="margin-top: 10px;">打分：</view>
					</uni-col>
					<uni-col :span="20" style="margin-bottom: 15px;">
						<input maxlength="4" type="number" v-model="score" class="rightView" placeholder="请输入" />
					</uni-col>
					<uni-col :span="4">
						<view class="rowStyle">评价：</view>
					</uni-col>
					<uni-col :span="20">
						<span v-for="(item,index) in evaluate" :key="index">
							<uni-tag :inverted="true" :text="item"
								custom-style="margin: 0px 5px 10px 0;border-radius: 5px;background: #f2f2f2;color: #333;"
								:style="{color:selectEva==index?'white':'',background:selectEva==index?'#2c96bd':''}"
								@click="clickEva(index)" />
						</span>
					</uni-col>
				</uni-row>
			</view>
			<view v-else style="text-align: center;margin-top: 10px;font-size: 13px;">截止当前，上交的作业已批改完！</view>
			<uni-row style="margin-top: 10px;">
				<uni-col :span="12" style="">
					<view class="rowBtn" style="margin-top: 10px;" @click="getBefore()">
						< 上一份</view>
				</uni-col>
				<uni-col :span="12" style="">
					<view class="rowBtn" style="margin-top: 10px;" @click="submitScore()">保存并进入下一份 ></view>
				</uni-col>
			</uni-row>
		</uni-card>
		<view style="height: 10px;background: #f2f2f2;"></view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" style="">
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<uni-row style="margin-top: 10px;">
						<uni-col :span="6">
							<view class="rowStyle">作业类型：</view>
						</uni-col>
						<uni-col :span="18">
							<view class="rowStyle">{{navItem.type==1?'线上作业':'线下作业'}}</view>
						</uni-col>
						<uni-col :span="6">
							<view class="rowStyle">科目：</view>
						</uni-col>
						<uni-col :span="18">
							<view class="rowStyle">{{navItem.sub_name}}</view>
						</uni-col>
						<uni-col :span="6">
							<view class="rowStyle">作业内容：</view>
						</uni-col>
						<uni-col :span="18">
							<view class="rowStyle">{{navItem.content}}</view>
						</uni-col>
						<uni-col :span="6">
							<view class="rowStyle">作业对象：</view>
						</uni-col>
						<uni-col :span="18">
							<view class="rowStyle">{{navItem.clsStr}}</view>
						</uni-col>
						<uni-col :span="6">
							<view class="rowStyle">截止时间</view>
						</uni-col>
						<uni-col :span="18">
							<view class="rowStyle">{{navItem.deadline}}</view>
						</uni-col>
						<uni-col v-if="navItem.files.length>0" :span="6">
							<view class="rowStyle">附件：</view>
						</uni-col>
						<uni-col v-if="navItem.files.length>0" :span="18">
							<g-upload ref='gUpload' :mode="hmwkImgList" :control='false' :deleteBtn='false' columnNum="3"></g-upload>
						</uni-col>
					</uni-row>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				nextData: {},
				score: '',
				hmwkImgList:[],//作业的附件
				submitImgList:[],//学生作业附件
				evaluate: ['优秀', '良好', '及格', '不及格'],
				selectEva: 99,
				showNextBtn:0,
				beforeFlag:0,//当点击上一份，返回null时，禁止继续获取上一份，改值为1，别的情况为0
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '作业批改';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '作业批改'
			});
			for (var i = 0; i < this.navItem.files.length; i++) {
				this.hmwkImgList.push(this.navItem.files[i].url);
			}
			this.getNext();
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
			lookHMWK() {
				this.$refs.popup.open();
			},
			clickEva(index) {
				if (this.selectEva == index) {
					this.selectEva = 99;
				} else {
					this.selectEva = index;
				}
			},
			submitScore() {
				if (this.showNextBtn == 1) {
					this.showToast('截止当前，上交的作业已批改完！');
					return;
				}
				if (this.score.length == 0 && this.selectEva == 99) {
					this.showToast('请先批改');
					return;
				}
				if (this.score > 1000) {
					this.showToast('分数不能高于1000');
					return;
				}
				let comData = {
					id: this.nextData.stu_work_submit.id,
					correct_score: this.score,
					correct_evaluate: this.selectEva + 1,
					index_code: this.navItem.index_code,
				}
				console.log('comData:' + JSON.stringify(comData))
				// 6.3.批改
				this.post(this.globaData.INTERFACE_HMWK + 'stuWorkSubmit/correct', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.getNext();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getBefore() {
				if (this.beforeFlag == 1) {
					this.showToast('已是第1份！');
					return;
				}
				let comData = {
					stu_work_id: this.navItem.id,
					id: this.nextData.stu_work_submit?this.nextData.stu_work_submit.id:'',
					index_code: this.navItem.index_code,
				}
				// 6.5.获取上一份已批改学生作业
				this.post(this.globaData.INTERFACE_HMWK + 'stuWorkSubmit/getBeforeCorrect', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showNextBtn = 0;
						if (data.data.stu_work_submit) {
							this.nextData = data.data;
							this.submitImgList = [];
							for (var i = 0; i < data.data.stu_work_submit.submit_files.length; i++) {
								this.submitImgList.push(data.data.stu_work_submit.submit_files[i].url);
							}
							if (data.data.stu_work_submit.correct_score) {
								this.score = data.data.stu_work_submit.correct_score;
							}
							if (data.data.stu_work_submit.correct_evaluate) {
								this.selectEva = data.data.stu_work_submit.correct_evaluate-1;
							}
							this.beforeFlag = 0;
						}else{
							this.showToast('已是第1份！');
							this.beforeFlag = 1;
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getNext() {
				let comData = {
					stu_work_id: this.navItem.id,
					index_code: this.navItem.index_code,
				}
				// 6.4.获取下一份未批改学生作业
				this.post(this.globaData.INTERFACE_HMWK + 'stuWorkSubmit/getNextCorrect', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.score = '';
						this.selectEva = 99;
						this.beforeFlag = 0;
						this.nextData = data.data;
						if (data.data.stu_work_submit) {
							this.submitImgList = [];
							for (var i = 0; i < data.data.stu_work_submit.submit_files.length; i++) {
								this.submitImgList.push(data.data.stu_work_submit.submit_files[i].url);
							}
							this.showNextBtn = 0;
						} else{
							this.showNextBtn = 1;
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
	.select-line {
		height: 1px;
		background-color: #aaaaaa;
	}

	.stuAnswer {
		font-size: 14px;
		color: #333;
		margin: 10px 0;
		word-break: break-all;
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

	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		padding-left: 5px;
		padding-top: 5px;
		margin: 0px;
		width: auto;
		height: 35px;
	}

	.rowStyle {
		font-size: 14px;
		min-height: 30px;
		margin-top: 5px;
		word-break: break-all;
	}

	::v-deep .uni-tag {
		color: #333;
		background-color: #f2f2f2;
	}

	.rowBtn {
		font-size: 14px;
		background: #169bd5;
		color: white;
		height: 30px;
		width: 150px;
		text-align: center;
		padding-top: 10px;
		border-radius: 8px;
		margin-left: calc((100% - 150px)/2);
	}
</style>