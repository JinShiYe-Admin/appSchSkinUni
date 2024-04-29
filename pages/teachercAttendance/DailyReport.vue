<template>
	<view>
		<view style="border-bottom: 10px solid #f2f2f2;">
			<dates-slider v-model="selectedDate" :end="endDate" style="height: 88px;"></dates-slider>
		</view>
		<view style="height: 176px;padding: 22px;">
			<qiun-data-charts 
				type="arcbar"
				:opts="chartOpts"
				:chartData="chartData"
			/>
		</view>
		<uni-row style="padding: 0 24px;font-size: 13px;">
			<uni-col :span="12">
				考勤人数：{{report.kq_count}}
			</uni-col>
			<uni-col :span="12" style="text-align: right;">
				出勤人数：{{report.attend_count}}
			</uni-col>
		</uni-row>
		<view style="padding: 12px;">
			<uni-grid :column="4" :showBorder="false"  :square="true" :highlight="false">
				<uni-grid-item @click.native="goDetail(0, '1')">
					<view class="report-item">
						<view>{{report.leaves_count}}</view>
						<view>请假</view>
					</view>
				</uni-grid-item>
				<uni-grid-item @click.native="goDetail(1, '2')">
					<view class="report-item">
						<view>{{report.abs_count}}</view>
						<view>旷工</view>
					</view>
				</uni-grid-item>
				<uni-grid-item @click.native="goDetail(2, '3')">
					<view class="report-item">
						<view>{{report.lacks_count}}</view>
						<view>缺卡</view>
					</view>
				</uni-grid-item>
				<uni-grid-item @click.native="goDetail(3, '4')">
					<view class="report-item">
						<view>{{report.lates_count}}</view>
						<view>迟到</view>
					</view>
				</uni-grid-item>
				<uni-grid-item @click.native="goDetail(4, '5')">
					<view class="report-item">
						<view>{{report.earlys_count}}</view>
						<view>早退</view>
					</view>
				</uni-grid-item>
				<uni-grid-item @click.native="goDetail(5, '6')">
					<view class="report-item">
						<view>{{report.bizs_count}}</view>
						<view>出差</view>
					</view>
				</uni-grid-item>
				<uni-grid-item @click.native="goDetail(6, '7')">
					<view class="report-item">
						<view>{{report.outs_count}}</view>
						<view>外出</view>
					</view>
				</uni-grid-item>
				<uni-grid-item @click.native="goDetail(7, '8')">
					<view class="report-item">
						<view>{{report.ots_count}}</view>
						<view>加班</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment';
	
	let _this;
	const defaultReport = {
		attend_count: 0,//出勤人数
		outs_count: 0, //外出人数
		lates_count: 0, //迟到人数
		attend_rate: 0, //出勤率
		earlys_count: 0, //早退人数
		lacks_count: 0, //缺卡人数
		abs_count: 0, //旷工人数
		kq_count: 0, //考勤人数
		ots_count: 0, //加班人数
		leaves_count: 0, //请假人数
		bizs_count: 0, //出差人数
	}
	const yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD")
	const today = moment().format("YYYY-MM-DD")
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				selectedDate: today,
				endDate: today,
				report: defaultReport
			}
		},
		computed: {
			chartOpts() {
				return {
					// color: ["#2c96bd"],
					padding: 1,
					title: {
						name: String(this.report.attend_rate*100)+"%",
						fontSize: 26,
						color: "#333"
					},
					subtitle: {
						name: "出勤率",
						fontSize: 14,
					},
					extra: {
						arcbar: {
							type: "circle",
							width: 12,
							backgroundColor: "#555555",
							startAngle: 1.5,
							endAngle: 0.25,
							gap: 2,
							lineCap: "butt"
						}
					}
				}
			},
			chartData() {
				return {
					series: [
						{
							// name: "出勤率",
							color: "#2c96bd",
							data: this.report.attend_rate
						}
					]
				}
			}
		},
		watch: {
			selectedDate() {
				this.getData()
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
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			//#ifdef H5
			document.title = "";
			//#endif
			
			this.getData()
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			goDetail(type, kq_status) {
				util.openwithData('/pages/teachercAttendance/DailyReportDetail', {
					index_code: this.navItem.access.split("#")[1],
					days: this.selectedDate,
					type,
					kq_status
				}, {
					refreshPage(data) { //子页面调用父页面需要的方法

					}
				})
			},
			getData() {
				this.showLoading();
				this.post(this.globaData.INTERFACE_TECKQ+'kqStat/dayReport', {
					user_code: this.personInfo.user_code,
					days: this.selectedDate,
					index_code: this.navItem.access.split("#")[1],
				}, (data, res) => {
					if(data&&data.list) {
						this.hideLoading();
						const schGroup = data.list.find(v => v.kq_group_id==='-1')
						if(schGroup) {
							this.report = {
								attend_count: schGroup.attend_count,//出勤人数
								outs_count: schGroup.outs_count, //外出人数
								lates_count: schGroup.lates_count, //迟到人数
								attend_rate: Number(schGroup.attend_rate.substring(0, schGroup.attend_rate.length-1))/100, //出勤率
								earlys_count: schGroup.earlys_count, //早退人数
								lacks_count: schGroup.lacks_count, //缺卡人数
								abs_count: schGroup.abs_count, //旷工人数
								kq_count: schGroup.kq_count, //考勤人数
								ots_count: schGroup.ots_count, //加班人数
								leaves_count: schGroup.leaves_count, //请假人数
								bizs_count: schGroup.bizs_count, //出差人数
							}
						}else{
							this.report = defaultReport;
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.report-item {
		height: 100%;
		text-align: center;
		background-color: #f2f2f2;
		margin: 6px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border-radius: 10%;
		& > uni-view:first-child {
			font-size: 24px;
			color: #333;
			& + uni-view {
				font-size: 12px;
			}
		}
	}
</style>
