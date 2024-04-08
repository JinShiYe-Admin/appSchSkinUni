<template>
	<view style="padding: 20px 15px;">
		<uni-title type="h2" align="center" :title="reportDate+'考勤月报'"></uni-title>
		<view class="title">
			<view class="title-text">{{navItem.text}}</view>
			<view class="title-info">
				<text>共{{tableData.length}}人</text>
			</view>
		</view>
		<uni-table emptyText="暂无数据" :loading="loading">
			<uni-tr>
				<uni-th width="35%" align="center">考勤组</uni-th>
				<uni-th width="35%" align="center">教师</uni-th>
				<uni-th width="30%" align="center">时长/次数</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index">
				<uni-td align="center">
					{{item.kq_group_name}}
				</uni-td>
				<uni-td align="center">
					{{item.user_name}}
				</uni-td>
				<uni-td align="center">
					{{item.kq_value}}
				</uni-td>
			</uni-tr>
		</uni-table>
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
				return this.navItem.days?this.navItem.days:""
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
				this.post(this.globaData.INTERFACE_TECKQ+'kqStat/monthReportDetail', {
					index_code: this.navItem.index_code,
					kq_group_id: "-1",
					month: this.navItem.month,
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
	@import url('style/statTable.scss');
</style>
