<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="navRightText" :textClick="textClick">
		</mynavBar>
		<uni-card isShadow style="margin: 10px;">
			<view style="font-size: 16px;font-weight: 900;">申请详情</view>
			<view class="select-line"></view>
			<uni-row style="margin-top: 10px;">
				<uni-col :span="6">
					<view class="rowStyle">补卡时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{moment(detail.ctime).format('YYYY-MM-DD HH:mm')}} {{attendStatusList[detail.attend_status]}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">补卡理由：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{detail.note}}</view>
				</uni-col>
				<uni-col :span="6"><view class="rowStyle">申请时间：</view></uni-col>
				<uni-col :span="18"><view class="rowStyle">{{detail.create_time}}</view></uni-col>
				<uni-col :span="6">
					<view class="rowStyle">照片：</view>
				</uni-col>
				<uni-col :span="18">
					<uni-grid v-if="detail.files && detail.files.length" :column="3" style="padding-right: 10px;">
						<uni-grid-item v-for="(item,index) in detail.files" :key="index">
							<image @click='checkEnc(index)' style="height: 70px;width: 70px;" :src="item.url" mode="">
							</image>
						</uni-grid-item>
					</uni-grid>
				</uni-col>
			</uni-row>
			
			<view style="font-size: 16px;font-weight: 900;margin-top: 20px;">审批情况</view>
			<view style="float: right;margin-top: -20px;font-size: 12px;">进度：{{detail.passs}}/{{detail.examines}}</view>
			<view class="select-line"></view>
			<view v-if="detail.examine_recs">
				<view v-for="(item,index) in detail.examine_recs" :key="index">
					<view class="uni-flex uni-row" style="margin-top: 20px;justify-content: space-between;flex-wrap: wrap;align-items: center;">
						<view style="font-size: 14px;">
							{{item.user_name}}
							<text style="font-size: 14px;margin-left: 30px;" :style="{color:item.status<2?'#aaaaaa':item.status>2?'#d9001b':'#70b603'}">
								{{item.status<2?'--':item.status>2?'不同意':'同意'}}
							</text>
						</view>
						<view style="font-size: 12px;">{{item.examine_time}}</view>
					</view>
					<view style="font-size: 12px;margin-top: 10px;word-break: break-all;">{{item.note}}</view>
					<view style="height: 1px;background: #d7d7d7;margin-top: 10px;"></view>
				</view>
			</view>
			
			<view v-if='navItem.is_check'>
				<view style="font-size: 16px;font-weight: 900;margin-top: 20px;">请审批</view>
				<view class="select-line"></view>
				<view style="font-size: 14px;margin-top: 10px;">我的审批意见：</view>
				<uni-data-checkbox class="check-btn-list" mode="tag" selectedColor="#169bd5"
					v-model="pass" :localdata="[{text:'同意',value:1},{text:'不同意',value:0}]"></uni-data-checkbox>
				<view style="font-size: 14px;">说明：</view>
				<textarea style="margin-top: 10px;" maxlength="300" v-model="note" class="rightView" placeholder="请输入"></textarea>
			</view>
		</uni-card>
		
		<view style="height: 10px;background: #f2f2f2;"></view>
		
		<uni-popup ref="popupOut" type="dialog">
			<uni-popup-dialog 
				:content="navItem.is_check?'您确定要提交此审批吗？':'您确认要撤销此申请吗？'" 
				:duration="2000"
				:before-close="true" 
				@close="closeOut()" 
				@confirm="confirmOut()">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment';
	let _this;
	const typeList = ['补卡','出差','外出','加班'];
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				navRightText:'',
				type: -1,
				detail: {},
				attendStatusList: ['缺卡', '', '迟到', '早退'],
				pass: 1,
				note: ''
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			this.navItem = util.getPageData(option);
			this.navItem.index = 100;
			this.type = this.navItem.type;
			this.navItem.text = `${typeList[this.type]}详情`;
			uni.setNavigationBarTitle({
				title: `${typeList[this.type]}详情`
			});
			
			if(this.navItem.is_check) {
				this.navRightText = '确定';
			}else{
				if (this.navItem.allow_del) {
					this.navRightText = '撤销';
				}
			}
			
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
				if(this.navItem.is_check) {
					// 提交审批
					this.showLoading();
					this.post(this.globaData.INTERFACE_TECKQ+'kqApply/check', {
						index_code: this.navItem.index_code,
						checker_code: this.personInfo.user_code,
						examine_rec_id: this.navItem.examine_rec_id,
						note: this.note,
						pass: this.pass,
					}, (data, res) => {
						this.hideLoading();
						this.showToast(res.msg);
						if (res.state === 'ok') {
							const eventChannel = this.getOpenerEventChannel();
							eventChannel.emit('refreshPage');
							uni.navigateBack();
						} 
					})
				}else if(this.navItem.allow_del) {
					// 撤销申请
					this.showLoading();
					this.post(this.globaData.INTERFACE_TECKQ+'kqApply/delete', {
						id: this.navItem.id,
						index_code: this.navItem.index_code,
					}, (data, res) => {
						this.hideLoading();
						this.showToast(res.msg);
						if (res.state === 'ok') {
							const eventChannel = this.getOpenerEventChannel();
							eventChannel.emit('refreshPage');
							uni.navigateBack();
						} 
					});
				}
			},
			textClick() {
				this.$refs.popupOut.open();
			},
			checkEnc: function(index) {
				uni.previewImage({
					current: index,
					urls: this.detail.files.map(v => v.url)
				})
			},
			getData() {
				this.showLoading();
				this.post(this.globaData.INTERFACE_TECKQ+'kqApply/detail', {
					id: this.navItem.id,
					index_code: this.navItem.index_code,
				}, (data, res) => {
					this.hideLoading();
					if (data) {
						this.detail = data;
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
	
	.check-btn-list {
		padding: 20px;
	}
	::v-deep.check-btn-list .checklist-group {
		justify-content: center;
	}
	::v-deep.check-btn-list .checklist-group .checklist-box.is--tag {
		width: 120px;
		padding: 12px;
		box-sizing: border-box;
		text-align: center;
		margin: 0;
	}
	::v-deep.check-btn-list .checklist-group .checklist-box.is--tag+.checklist-box {
		margin-left: 42px;
	}
	::v-deep.check-btn-list .checklist-group .checklist-box .checklist-content {
		justify-content: center;
	}
	
	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		padding-left: 5px;
		height: 80px;
		padding-top: 5px;
		margin: 0 15px 0 15px;
		width: auto;
	}
</style>