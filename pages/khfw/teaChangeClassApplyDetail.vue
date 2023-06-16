<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="navRightText"
			:textClick="textClick">
		</mynavBar>
		<uni-card isShadow style="margin: 10px;">
			<uni-row style="margin-top: 10px;">
				<uni-col :span="6">
					<view class="rowStyle">调课事由：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{change_course.explanation}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">申请时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{change_course.create_time}}</view>
				</uni-col>
			</uni-row>
		</uni-card>
		<view style="font-size: 16px;font-weight: 900;margin: 20px 20px 0 20px;">调课、代课、停课安排</view>
		<view class="select-line"></view>
		<uni-card isShadow style="margin: 10px;" v-for="(item,index) in content_list" :key="index">
			<view class="subTea">安排{{index+1}}：</view>
			<view style="height: 1px;background: #d7d7d7;margin-top: 5px;"></view>
			<view class="cardTitle">原课程安排</view>
			<uni-row style="margin-top: 10px;">
				<uni-col :span="6">
					<view class="rowStyleP">日期：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyleP">{{item.old_date.split(' ')[0]}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyleP">星期：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyleP">{{item.old_week_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyleP">上课时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyleP">{{item.old_lesson_time}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyleP">上课地点：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyleP">{{item.old_place}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyleP">课程：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyleP">{{item.old_lesson_name}}</view>
				</uni-col>
			</uni-row>
			<view class="cardTitle">调、代、停课安排</view>
			<view v-if="item.type == 1">
				<uni-row style="margin-top: 10px;">
					<uni-col :span="6">
						<view class="rowStyleP">日期：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.new_date.split(' ')[0]}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyleP">星期：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.new_week_name}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyleP">上课时间：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.new_lesson_time}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyleP">上课地点：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.new_place}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyleP">课程：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.new_lesson_name}}</view>
					</uni-col>
					<uni-col :span="6">
						<view class="rowStyleP">代课人：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.substitute_name}}</view>
					</uni-col>
				</uni-row>
				<view class="itemStatus">调课</view>
			</view>
			<view v-if="item.type == 2">
				<uni-row style="margin-top: 10px;">
					<uni-col :span="6">
						<view class="rowStyleP">代课人：</view>
					</uni-col>
					<uni-col :span="18">
						<view class="rowStyleP">{{item.substitute_name}}</view>
					</uni-col>
				</uni-row>
				<view class="itemStatus" style="margin: 0px 0 10px 0;">代课</view>
			</view>
			<view v-if="item.type == 0">
				<view class="rowStyleP">无</view>
				<view class="itemStatus" style="margin: 0px 0 10px 0;">停课</view>
			</view>
		</uni-card>
		<view style="font-size: 16px;font-weight: 900;margin: 20px 20px 0 20px;">审批情况</view>
		<view style="float: right;margin-top: -20px;font-size: 12px;margin-right: 20px;">
			进度：{{change_course.examine_pass}}/{{change_course.examine_times}}</view>
		<view class="select-line"></view>
		<uni-card isShadow style="margin: 10px;">
			<view v-for="(item,index) in examine_list" :key="index">
				<view style="font-size: 14px;margin-top: 20px;">{{item.checker_name}}<span style="margin-left: 30px;"
						:style="{color:item.examine_pass?'#70b603':'red'}">{{item.examine_pass?'同意':'拒绝'}}</span>
				</view>
				<view style="float: right;margin-top: -20px;font-size: 12px;">{{item.create_time}}</view>
				<view style="font-size: 12px;margin-top: 10px;word-break: break-all;">{{item.explanation}}</view>
				<view style="height: 1px;background: #d7d7d7;margin-top: 10px;"></view>
			</view>
			<view v-if="examine_list.length==0" style="font-size: 13px;">无</view>
		</uni-card>
		<view style="height: 10px;background: #f2f2f2;"></view>
		<uni-popup ref="popupOut" type="dialog">
			<uni-popup-dialog title="确定撤销?" content="您确认要撤销此请假申请吗？" :duration="2000" :before-close="true"
				@close="closeOut()" @confirm="confirmOut()"></uni-popup-dialog>
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
				navRightText: '',
				content_list: [], //
				change_course: {}, //调课信息
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
			this.navItem.text = '教师调课申请详情';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '教师调课申请详情'
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
				// 4.2.撤销调课申请
				this.post(this.globaData.INTERFACE_KHFW + 'changeCourse/delete', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast(data.msg);
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshteaChangeClassApply');
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
				// 4.4.调课申请详情
				this.post(this.globaData.INTERFACE_KHFW + 'changeCourse/getById', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (data.data.examine_list.length == 0) {
							this.navRightText = '撤销';
						}
						// let tempM = data.data.vacation_app;
						// if (tempM.vacation_type == 0) {
						// 	tempM.vacation_type_name = '未审批';
						// } else if (tempM.vacation_type == 1) {
						// 	tempM.vacation_type_name = '已通过';
						// } else if (tempM.vacation_type == 2) {
						// 	tempM.vacation_type_name = '未通过';
						// }
						// if (tempM.type == 1) {
						// 	tempM.type_name = '因公';
						// } else if (tempM.type == 0) {
						// 	tempM.type_name = '因私';
						// }
						// tempM.start_time = tempM.start_time.slice(0, 16);
						// tempM.end_time = tempM.end_time.slice(0, 16);
						// tempM.create_time = tempM.create_time.slice(0, 16);
						this.change_course = data.data.change_course;
						this.content_list = data.data.content_list; //
						this.examine_list = data.data.examine_list; //审批情况
						// content_list: [], //
						// change_course: {}, //调课信息
						// examine_list: [], //审批情况
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
		margin: 0 15px;
	}

	.rowStyle {
		font-size: 14px;
		min-height: 30px;
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
	
	.rowStyleP {
		font-size: 13px;
		min-height: 20px;
		margin-top: 2px;
	}
	
	.cardTitle {
		text-align: center;
		font-size: 14px;
		background: #eae9e9;
		padding: 3px 0;
		margin-top: 5px;
	}
	
	.itemStatus {
		font-size: 18px;
		color: #f59a23;
		border: 2px solid #f59a23;
		width: 38px;
		padding: 0px 10px;
		border-radius: 8px;
		float: right;
		margin-top: -70px;
		transform: rotate(315deg);
		font-family: 700;
	}
</style>