<template>
	<view>
		<view style="padding: 8px 12px;">
			<uni-datetime-picker v-model="range" type="daterange" rangeSeparator="至" :clear-icon="false" :end="today"/>
		</view>
		<view class="uni-flex uni-row" style="justify-content: space-around;padding: 24px 24px 32px;">
			<view class="stat-info">
				<view>{{statData.full_attend}}</view>
				<view>应出勤天数</view>
			</view>
			<view class="stat-info">
				<view>{{statData.attend}}</view>
				<view>实际出勤天数</view>
			</view>
		</view>
		<view style="padding: 0 20px;">
			<uni-row class="stat-item">
				<uni-col :span="6">
					<text class="stat-item-title">请假</text>
					<text class="stat-item-unit">（小时）</text>
				</uni-col>
				<uni-col :span="14">
					<view class="stat-item-bar" :style="`width:${statData.leaves>10?'100%':statData.leaves/10*100+'%'};`"></view>
				</uni-col>
				<uni-col :span="4" class="stat-item-num">{{statData.leaves}}</uni-col>
			</uni-row>
			<uni-row class="stat-item">
				<uni-col :span="6">
					<text class="stat-item-title">旷工</text>
					<text class="stat-item-unit">（天）</text>
				</uni-col>
				<uni-col :span="14">
					<view class="stat-item-bar" :style="`width:${statData.abs>10?'100%':statData.abs/10*100+'%'};`"></view>
				</uni-col>
				<uni-col :span="4" class="stat-item-num">{{statData.abs}}</uni-col>
			</uni-row>
			<uni-row class="stat-item">
				<uni-col :span="6">
					<text class="stat-item-title">缺卡</text>
					<text class="stat-item-unit">（次）</text>
				</uni-col>
				<uni-col :span="14">
					<view class="stat-item-bar" :style="`width:${statData.lacks>10?'100%':statData.lacks/10*100+'%'};`"></view>
				</uni-col>
				<uni-col :span="4" class="stat-item-num">{{statData.lacks}}</uni-col>
			</uni-row>
			<uni-row class="stat-item">
				<uni-col :span="6">
					<text class="stat-item-title">迟到</text>
					<text class="stat-item-unit">（次）</text>
				</uni-col>
				<uni-col :span="14">
					<view class="stat-item-bar" :style="`width:${statData.lates>10?'100%':statData.lates/10*100+'%'};`"></view>
				</uni-col>
				<uni-col :span="4" class="stat-item-num">{{statData.lates}}</uni-col>
			</uni-row>
			<uni-row class="stat-item">
				<uni-col :span="6">
					<text class="stat-item-title">早退</text>
					<text class="stat-item-unit">（次）</text>
				</uni-col>
				<uni-col :span="14">
					<view class="stat-item-bar" :style="`width:${statData.earlys>10?'100%':statData.earlys/10*100+'%'};`"></view>
				</uni-col>
				<uni-col :span="4" class="stat-item-num">{{statData.earlys}}</uni-col>
			</uni-row>
			<uni-row class="stat-item">
				<uni-col :span="6">
					<text class="stat-item-title">出差</text>
					<text class="stat-item-unit">（天）</text>
				</uni-col>
				<uni-col :span="14">
					<view class="stat-item-bar" :style="`width:${statData.bizs>10?'100%':statData.bizs/10*100+'%'};`"></view>
				</uni-col>
				<uni-col :span="4" class="stat-item-num">{{statData.bizs}}</uni-col>
			</uni-row>
			<uni-row class="stat-item">
				<uni-col :span="6">
					<text class="stat-item-title">外出</text>
					<text class="stat-item-unit">（小时）</text>
				</uni-col>
				<uni-col :span="14">
					<view class="stat-item-bar" :style="`width:${statData.outs>10?'100%':statData.outs/10*100+'%'};`"></view>
				</uni-col>
				<uni-col :span="4" class="stat-item-num">{{statData.outs}}</uni-col>
			</uni-row>
			<uni-row class="stat-item">
				<uni-col :span="6">
					<text class="stat-item-title">加班</text>
					<text class="stat-item-unit">（小时）</text>
				</uni-col>
				<uni-col :span="14">
					<view class="stat-item-bar" :style="`width:${statData.ots>10?'100%':statData.ots/10*100+'%'};`"></view>
				</uni-col>
				<uni-col :span="4" class="stat-item-num">{{statData.ots}}</uni-col>
			</uni-row>
			<uni-row class="stat-item">
				<uni-col :span="6">
					<text class="stat-item-title">补卡</text>
					<text class="stat-item-unit">（次）</text>
				</uni-col>
				<uni-col :span="14">
					<view class="stat-item-bar" :style="`width:${bkNum>10?'100%':bkNum/10*100+'%'};`"></view>
				</uni-col>
				<uni-col :span="4" class="stat-item-num">{{bkNum}}</uni-col>
			</uni-row>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment';
	let _this;
	const statDataDefault = {
			full_attend: 0,//应出勤天数
			attend: 0,//实际出勤天数
			lacks: 0,//缺卡次数
			bizs: 0,//出差天数
			ots: 0,//加班小时
			outs: 0,//外出小时
			lates: 0,//迟到次数
			abs: 0,//旷工天数
			leaves: 0,//请假小时
			earlys: 0,//早退次数
		}
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				today: moment().format('YYYY-MM-DD'),
				range: [moment().subtract(1, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
				statData: {...statDataDefault},
				bkNum: 0,
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
			
			this.getData();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		watch: {
			range(new_range, old) {
				this.getData()
			}
		},
		methods: {
			getData() {
				this.showLoading();
				if(this.range.length>1) {
					this.post(this.globaData.INTERFACE_TECKQ+'kqStat/kqStat', {
						user_code: this.personInfo.user_code,
						index_code: this.navItem.access.split("#")[1],
						start_days: this.range[0],
						end_days: this.range[1]
					}, (data, res) => {
						this.hideLoading();
						if(data&&data.list&&data.list.length){
							const reduceList = data.list.reduce((total,curr) => ({
								full_attend: Number(total.full_attend) + Number(curr.full_attend)*100,
								attend: Number(total.attend) + Number(curr.attend)*100,
								lacks: Number(total.lacks) + Number(curr.lacks)*100,
								bizs: Number(total.bizs) + Number(curr.bizs)*100,
								ots: Number(total.ots) + Number(curr.ots)*100,
								outs: Number(total.outs) + Number(curr.outs)*100,
								lates: Number(total.lates) + Number(curr.lates)*100,
								abs: Number(total.abs) + Number(curr.abs)*100,
								leaves: Number(total.leaves) + Number(curr.leaves)*100,
								earlys: Number(total.earlys) + Number(curr.earlys)*100,
							}), {...statDataDefault})
							for (let key in reduceList) {
								this.statData[key] = reduceList[key]/100
							}
						}else{
							this.statData = {...statDataDefault}
						}
					})
				// 获取补卡次数
				this.post(this.globaData.INTERFACE_TECKQ+'kqApply/page', {
					user_code: this.personInfo.user_code,
					index_code: this.navItem.access.split("#")[1],
					begin_date: this.range[0],
					end_date: this.range[1],
					type: "补卡",
					status: 2,
				}, (data, res) => {
					this.bkNum = data&&data.list?data.list.length:0
				})
				}else{
					uni.showToast({
						title: '请选择时间范围'
					});
				}
			}
		}
	}
</script>

<style lang="scss">
.stat-info {
	text-align: center;
	& > uni-view:first-child {
		font-size: 24px;
		font-weight: bold;
		border-bottom: 2px solid #00cfbd;
		width: 84px;
		line-height: 33px;
		& + uni-view {
			font-size: 14px;
			margin-top: 6px;
		}
	}
}
.stat-item {
	padding: 10px 0 10px 10px;
	background-color: #ededed;
	border-radius: 8px;
	margin-bottom: 12px;
	line-height: 14px;
	.stat-item-title {
		font-size: 14px;
		font-weight: bold;
	}
	.stat-item-unit {
		font-size: 12px;
		color: #7f7f7f;
	}
	.stat-item-bar {
		height: 14px;
		border-radius: 5px;
		background-color: rgba(44, 150, 189, 1);
	}
	.stat-item-num {
		font-size: 14px;
		text-align: center;
	}
}
</style>
