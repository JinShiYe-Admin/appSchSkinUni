<template>
	<view>
		<view style="border-bottom: 10px solid #f2f2f2;height: 88px;">
			<view class="uni-flex uni-row" style="padding: 0.6rem 0.5rem 0.4rem;justify-content: center;text-align: center;align-items: center;">
				<view  class="flex-item" style="width: 3rem;">
					<uni-icons type="left" :size="24" bold @click="changeYear(-1)"></uni-icons>
				</view>
				<view class="flex-item" style="width: 7rem;font-size: 18px;font-weight: bold;">
					<text>{{year}}年</text>
				</view>
				<view  class="flex-item" style="width: 3rem;">
					<uni-icons v-if="year<curYear" type="right" :size="24" bold @click="changeYear(1)"></uni-icons>
					<uni-icons v-else type="right" :size="24" bold color="rgba(0,0,0,.3)"></uni-icons>
				</view>
			</view>
			<scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-left="datesScrollLeft">
				<view class="uni-row month-dates-wrapper">
					<view class="month-item" v-for="(month,i) in monthList" :key="i">
						<button size="mini" :type="selectedYear===year&&month===seletedMonth?'primary':'default'" :disabled="year===curYear&&month>curMonth"  @click="selectMonth(month)">
							{{month}}<br/>月
						</button>
					</view>
				</view>
			</scroll-view>
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
				全勤人数：{{report.attend_count}}
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
	const thisYear = moment().year();
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
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				monthList: [1,2,3,4,5,6,7,8,9,10,11,12],
				curYear: thisYear,
				curMonth: moment().month()+1,
				year: thisYear,
				selectedYear: thisYear,
				seletedMonth: 1,
				datesScrollLeft: 0,
				report: defaultReport
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
			
			this.selectMonth(moment().month()+1);
			this.changeYear(0);
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
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
						name: "全勤率",
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
		methods: {
			changeYear(num) {
				this.year = this.year+num;
				// 设置滚动条位置
				this.$nextTick(() => {
					if(this.selectedYear===this.year) {
						const windowInfo = uni.getWindowInfo();
						this.datesScrollLeft = this.seletedMonth*48>windowInfo.windowWidth?(this.seletedMonth*48-windowInfo.windowWidth+48):0.1;
					}else{
						this.datesScrollLeft = 0;
					}
				})
			},
			selectMonth(month) {
				if(this.selectedYear === this.year && this.seletedMonth === month) return;
				this.selectedYear = this.year;
				this.seletedMonth = month;
				this.getData(this.year+'-'+(month>10?month:'0'+month))
			},
			goDetail(type, kq_status) {
				util.openwithData('/pages/teachercAttendance/MonthlyReportDetail', {
					index_code: this.navItem.access.split("#")[1],
					days: `${this.selectedYear}年${this.seletedMonth}月`,
					month: this.selectedYear+'-'+(this.seletedMonth>10?this.seletedMonth:'0'+this.seletedMonth),
					type,
					kq_status
				}, {
					refreshPage(data) { //子页面调用父页面需要的方法
			
					}
				})
			},
			getData(month) {
				this.showLoading();
				this.post(this.globaData.INTERFACE_TECKQ+'kqStat/monthReport', {
					user_code: this.personInfo.user_code,
					month,
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
	.month-dates-wrapper {
		padding: 0 8px;
		white-space: nowrap;
		.month-item {
			display: inline-block;
			margin-right: 8px;
			uni-button {
				width: 40px;
				height: 40px;
				padding: 4px 12px;
				line-height: 16px;
			}
		}
		uni-button[type=primary] {
			background-color: #2c96bd;
		}
	}
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
