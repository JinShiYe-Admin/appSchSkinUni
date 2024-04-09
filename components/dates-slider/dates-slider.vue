<template>
	<view>
		<view class="uni-flex uni-row" style="padding: 0.6rem 0.5rem 0.4rem;justify-content: center;text-align: center;align-items: center;">
			<view  class="flex-item" style="width: 3rem;">
				<uni-icons type="left" :size="24" bold @click="changeMonth(-1)"></uni-icons>
			</view>
			<view class="flex-item" style="width: 7rem;font-size: 18px;font-weight: bold;">
				<text>{{moment(yearMonth).format("YYYY年M月")}}</text>
			</view>
			<view class="flex-item" style="width: 3rem;">
				<uni-icons v-if="disabledDates.length===0"  type="right" :size="24" bold @click="changeMonth(1)"></uni-icons>
				<uni-icons v-else type="right" :size="24" bold color="rgba(0,0,0,.3)"></uni-icons>
			</view>
		</view>
		<view>
			<scroll-view :scroll-x="true" :show-scrollbar="false" :scroll-left="datesScrollLeft">
				<view class="uni-row month-dates-wrapper">
					<view  class="date-item" v-for="(date,i) in monthDates" :key="i">
						<button size="mini" :type="date===selectedDate?'primary':'default'" :disabled="disabledDates.indexOf(date)>-1" @click="handleSelect(date)">
							{{moment(date).format("DD")+'\n'+weekDays[moment(date).day()]}}
						</button>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	const curDate = moment().format("YYYY-MM-DD");
	export default {
		name:"dates-slider",
		model: {
			prop: 'selectedDate',
			event: 'change'
		},
		props: {
			// defaultDate: {
			// 	type: moment.MomentInput,
			// 	require: false
			// },
			selectedDate: {
				type: String,
				default: curDate,
				require: true,
			},
			start: {
				type: String,
				require: false
			},
			end: {
				type: String,
				require: false
			}
		},
		data() {
			return {
				yearMonth: curDate, //年、月显示
				monthDates: [],
				weekDays: ['日','一','二','三','四','五','六'],
				datesScrollLeft: 0,
			};
		},
		mounted() {
			if(this.selectedDate) {
				this.yearMonth = moment(this.selectedDate).format("YYYY-MM-DD");
			}
			this.getMonthDates();
		},
		computed: {
			disabledDates() {
				return this.monthDates.filter((date) => (this.end?date>this.end:false)||(this.start?date<this.start:false))
			}
		},
		watch: {
			monthDates(dates) {
				// 设置滚动条位置
				this.$nextTick(() => {
					if(dates.indexOf(this.selectedDate)>-1) {
						const windowInfo = uni.getWindowInfo();
						const curDateNum = moment(this.selectedDate).date();
						setTimeout(() => {
							this.datesScrollLeft = curDateNum*48>windowInfo.windowWidth?(curDateNum*48-windowInfo.windowWidth+48):1;
						}, 50)
					}else{
						this.datesScrollLeft = 0;
					}
				})
			}
		},
		methods:{
			// dateDisabled(date) {
			// 	return (this.end?date>this.end:false)||(this.start?date<this.start:false)
			// },
			changeMonth(num) {
				const cur = moment(this.yearMonth);
				const newMonth = num>0?cur.add(1,'months'):cur.subtract(1,'months');
				this.yearMonth = newMonth.format("YYYY-MM-DD");
				this.getMonthDates()
			},
			getMonthDates() {
				const cur = moment(this.yearMonth);
				const firstDate = cur.startOf('month').format("YYYY-MM-DD");
				const endDate = cur.endOf('month').format("YYYY-MM-DD");
				let dates = [];
				dates.push(firstDate);
				let addNum = 1;
				while (dates[dates.length-1]<endDate){
					dates.push(moment(firstDate).add(addNum, 'days').format('YYYY-MM-DD'));
					addNum++;
				}
				this.monthDates = dates;
				
			},
			handleSelect(date) {
				if(this.selectedDate!==date) {
					this.$emit('change', date)
				}
			}
		}
	}
</script>

<style lang="scss">
	.month-dates-wrapper {
		padding: 0 8px;
		white-space: nowrap;
		.date-item {
			display: inline-block;
			margin-right: 8px;
			uni-button {
				width: 40px;
				height: 40px;
				padding: 4px 12px;
				line-height: 16px;
				white-space: break-spaces;
			}
		}
		uni-button[type=primary] {
			background-color: #2c96bd;
		}
	}
</style>