<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<uni-card isShadow style="margin: 10px 5px 0;">
			<view>
				<view style="font-size: 14px;font-weight: 900;">{{navItem.cls_name}}
					{{navItem.stu_name}}</view>
				<view class="select-line"></view>
				<view class="stuAnswer">
					答：{{nextData.submit_answer&&nextData.submit_answer.length>0?nextData.submit_answer:'无'}}
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
			<uni-row style="margin-top: 10px;">
				<uni-col :span="24" style="">
					<view class="rowBtn" style="margin-top: 10px;" @click="submitScore()">保存</view>
				</uni-col>
			</uni-row>
		</uni-card>
		<view style="height: 10px;background: #f2f2f2;"></view>
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
				submitImgList:[],//学生作业附件
				evaluate: ['优秀', '良好', '及格', '不及格'],
				selectEva: 99,
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
			this.getStuHmwk();
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
				if (this.score.length == 0 && this.selectEva == 99) {
					this.showToast('请先批改');
					return;
				}
				if (this.score > 1000) {
					this.showToast('分数不能高于1000');
					return;
				}
				let comData = {
					id: this.nextData.id,
					correct_score: this.score,
					correct_evaluate: this.selectEva + 1,
					index_code: this.navItem.index_code,
				}
				console.log('comData:' + JSON.stringify(comData))
				// 6.3.批改
				this.post(this.globaData.INTERFACE_HMWK + 'stuWorkSubmit/correct', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshCorrectShowList');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getStuHmwk() {
				let comData = {
					id: this.navItem.id,
					index_code: this.navItem.index_code,
				}
				// 6.7.根据id获取学生作业信息
				this.post(this.globaData.INTERFACE_HMWK + 'stuWorkSubmit/getById', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.score = '';
						this.selectEva = 99;
						this.beforeFlag = 0;
						this.nextData = data.data;
						if (data.data) {
							this.submitImgList = [];
							for (var i = 0; i < data.data.submit_files.length; i++) {
								this.submitImgList.push(data.data.submit_files[i].url);
							}
							if (data.data.correct_score) {
								this.score = data.data.correct_score;
							}
							if (data.data.correct_evaluate) {
								this.selectEva = data.data.correct_evaluate-1;
							}
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