<template>
	<view style="padding: 20px 15px;">
		<uni-title type="h2" align="center" :title="reportDate+'考勤日报'"></uni-title>
		<view class="title">
			<view class="title-text">{{navItem.text}}</view>
			<view class="title-info">
				<text>共{{tableData.length}}人</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment';
	
	const typeNameList = ['请假','旷工','缺卡','迟到','早退','出差','外出','加班'];
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				type: -1,
				loading: false,
				tableData: []
			}
		},
		computed: {
			reportDate() {
				return this.navItem.days?moment(this.navItem.days).format("YYYY年M月DD日"):""
			}
		},
		components: {
			mynavBar,
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			this.navItem = util.getPageData(option);
			this.type = this.navItem.type;
			this.navItem.index = 100;
			this.navItem.text = typeNameList[this.type];
			uni.setNavigationBarTitle({
				title: typeNameList[this.type]
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
		methods: {
			getData() {
				this.loading = true;
				this.post(this.globaData.INTERFACE_TECKQ+'kqStat/dayReportDetail', {
					index_code: this.navItem.index_code,
					kq_group_id: "-1",
					days: this.navItem.days,
					kq_status: this.navItem.kq_status,
				}, (data, res) => {
					this.loading = false;
					if(data&&data.list) {
						this.tableData = data.list;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.title {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		border-bottom: 1px solid #d7d7d7;
		padding: 2px;
		line-height: 25px;
		margin-bottom: 4px;
		.title-text {
			font-weight: bold;
			font-size: 16px;
			margin-right: 12px;
		}
		.title-info {
			display: flex;
			justify-content: space-between;
			font-size: 13px;
			flex-grow: 1;
			:first-child {
				margin-right: 5px;
			}
		}
	}
</style>
