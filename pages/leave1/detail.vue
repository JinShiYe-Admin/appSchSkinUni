<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="navRightText" :textClick="textClick">
		</mynavBar>
		<uni-card isShadow style="margin: 10px;">
			<view style="font-size: 16px;font-weight: 900;">申请详情</view>
			<view class="select-line"></view>
			<uni-row style="margin-top: 10px;">
				<uni-col :span="6">
					<view class="rowStyle">请假类别：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.type_code=='absenceLeave'?'事假':'病假'}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">开始时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.start_time}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">结束时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.end_time}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">请假时长：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{parseInt(vacation_app.vacation_day / 24)}}天{{(vacation_app.vacation_day % 24).toFixed(1)}}小时</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">请假事由：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.explanation}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">申请时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{vacation_app.create_time}}</view>
				</uni-col>
				<uni-col v-if="imgList.length>0" :span="6">
					<view class="rowStyle">材料：</view>
				</uni-col>
				<uni-col v-if="imgList.length>0" :span="18">
					<g-upload ref='gUpload' :mode="imgList" :control='false' :deleteBtn='false' columnNum="3"></g-upload>
				</uni-col>
			</uni-row>
			<view style="font-size: 16px;font-weight: 900;margin-top: 20px;">审批情况</view>
			<view class="select-line"></view>
			<view v-if="vacation_app.vacation_type==0" style="text-align: center;margin: 20px 0 10px 0;font-size: 13px;">暂无</view>
			<view v-else>
				<uni-row style="margin-top: 10px;">
					<uni-col :span="6">
						<view class="rowStyle">审批意见：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyle">{{vacation_app.vacation_type=='absenceLeave '?'事假':'病假'}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyle">说明：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyle">{{vacation_app.judge_explannation}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyle">审批人：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyle">{{vacation_app.checker_name}}</view>
					</uni-col>
				</uni-row>
			</view>
		</uni-card>
		<view style="height: 10px;background: #f2f2f2;"></view>
		<uni-popup ref="popupOut" type="dialog">
			<uni-popup-dialog title="确定撤销?" content="您确认要撤销此请假申请吗？" :duration="2000"
				:before-close="true" @close="closeOut()" @confirm="confirmOut()"></uni-popup-dialog>
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
				navRightText:'',
				imgList: [], //材料
				vacation_app: {}, //详情
				examine_list: [], //审批情况
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
			this.navItem.text = '学生请假详情';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '学生请假详情'
			});
			this.getData();
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
			closeOut() {
				this.$refs.popupOut.close();
			},
			confirmOut(value) {
				this.$refs.popupOut.close();
				let comData = {
					id: this.navItem.id,
					index_code: this.navItem.index_code,
				}
				// 学生请假撤销
				this.post(this.globaData.INTERFACE_KHFW + 'stuVacation/delete', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast(data.msg);
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshLeave1Index');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			textClick() {
				this.$refs.popupOut.open();
			},
			getData() {
				let comData = {
					id: this.navItem.id,
					index_code: this.navItem.index_code,
				}
				// 6.3.学生请假详情
				this.post(this.globaData.INTERFACE_KHFW + 'stuVacation/getById', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (data.data.vacation_app.vacation_type==0) {
							this.navRightText = '撤销';
						}
						let tempM = data.data.vacation_app;
						if (tempM.vacation_type == 0) {
							tempM.vacation_type_name = '未审批';
						} else if (tempM.vacation_type == 1) {
							tempM.vacation_type_name = '已通过';
						} else if (tempM.vacation_type == 2) {
							tempM.vacation_type_name = '未通过';
						}
						tempM.start_time = tempM.start_time.slice(0, 16);
						tempM.end_time = tempM.end_time.slice(0, 16);
						tempM.create_time = tempM.create_time.slice(0, 16);
						this.vacation_app = tempM;
						for (var i = 0; i < data.data.resource_list.length; i++) {
							var tempD = data.data.resource_list[i];
							this.imgList.push(tempD.image_url)
						}
						this.examine_list = data.data.examine_list; //审批情况
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.card-line {
		text-align: center;
		font-size: 25px;
		color: red;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 1px solid green;
		width: 100px;
		margin-left: calc((100% - 100px)/2);
	}

	.select-line {
		height: 3px;
		background-color: #aaaaaa;
		/* margin: 0 -15px; */
	}

	.rowStyle {
		font-size: 14px;
		min-height: 30px;
		/* overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; */
		margin-top: 5px;
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
</style>