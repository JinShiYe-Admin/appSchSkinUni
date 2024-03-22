<template>
	<view style="padding: 20px 15px;">
		<view class="title">
			<view class="title-text">{{navItem.text}}</view>
			<view class="title-info">
				<text>共{{navItem.total}}</text>
				<text>{{navItem.begin_date}} 至 {{navItem.end_date}}</text>
			</view>
		</view>
		
		<uni-table v-if="type===0" emptyText="暂无数据" :loading="loading">
			<uni-tr>
				<uni-th align="center">请假起止时间</uni-th>
				<uni-th align="center">请假时长</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index" @click.native="goDetail(0, item)">
				<uni-td align="center">
					<view>起：{{moment(item.start_time).format('YYYY-MM-DD HH:mm')}}</view>
					<view>止：{{moment(item.end_time).format('YYYY-MM-DD HH:mm')}}</view>
				</uni-td>
				<uni-td align="center">
					{{item.vacation_day}}天
				</uni-td>
			</uni-tr>
		</uni-table>
		
		<uni-table v-if="type===1" emptyText="暂无数据" :loading="loading">
			<uni-tr>
				<uni-th width="45%" align="center">旷工日期</uni-th>
				<uni-th width="30%" align="center">旷工时长</uni-th>
				<uni-th width="25%"></uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index">
				<uni-td align="center">
					{{moment(item.days).format('YYYY-MM-DD')}}
				</uni-td>
				<uni-td align="center">
					{{item.abs}}天
				</uni-td>
				<uni-td align="center">
					<text style="color: #2c96bd;" @click="managePopupOpen=true">处理</text>
				</uni-td>
			</uni-tr>
		</uni-table>
		
		<uni-table v-if="type===2" emptyText="暂无数据" :loading="loading">
			<uni-tr>
				<uni-th width="70%" align="center">缺卡时间</uni-th>
				<uni-th width="30%"></uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index">
				<uni-td align="center">
					{{moment(item.ctime).format('YYYY-MM-DD HH:mm 缺卡')}}
				</uni-td>
				<uni-td align="center">
					<text style="color: #2c96bd;" @click="managePopupOpen=true">处理</text>
				</uni-td>
			</uni-tr>
		</uni-table>
		
		<uni-table v-if="type===3" emptyText="暂无数据" :loading="loading">
			<uni-tr>
				<uni-th width="45%" align="center">考勤/打卡时间</uni-th>
				<uni-th width="30%" align="center">迟到时长</uni-th>
				<uni-th width="25%"></uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index">
				<uni-td align="center">
					<view>考勤：{{moment(item.ctime).format('YYYY-MM-DD HH:mm')}}</view>
					<view>打卡：{{moment(item.attend_time).format('YYYY-MM-DD HH:mm')}}</view>
				</uni-td>
				<uni-td align="center">
					{{timeStrByMinutes(moment(item.attend_time).diff(moment(item.ctime), 'minutes'))}}
				</uni-td>
				<uni-td align="center">
					<text style="color: #2c96bd;" @click="managePopupOpen=true">处理</text>
				</uni-td>
			</uni-tr>
		</uni-table>
		
		<uni-table v-if="type===4" emptyText="暂无数据" :loading="loading">
			<uni-tr>
				<uni-th width="45%" align="center">考勤/打卡时间</uni-th>
				<uni-th width="30%" align="center">早退时长</uni-th>
				<uni-th width="25%"></uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index">
				<uni-td align="center">
					<view>考勤：{{moment(item.ctime).format('YYYY-MM-DD HH:mm')}}</view>
					<view>打卡：{{moment(item.attend_time).format('YYYY-MM-DD HH:mm')}}</view>
				</uni-td>
				<uni-td align="center">
					{{timeStrByMinutes(moment(item.ctime).diff(moment(item.attend_time), 'minutes'))}}
				</uni-td>
				<uni-td align="center">
					<text style="color: #2c96bd;" @click="managePopupOpen=true">处理</text>
				</uni-td>
			</uni-tr>
		</uni-table>
		
		<uni-table v-if="type===5" emptyText="暂无数据" :loading="loading">
			<uni-tr>
				<uni-th align="center">出差起止时间</uni-th>
				<uni-th align="center">出差时长</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index" @click.native="goDetail(5, item)">
				<uni-td align="center">
					<view>起：{{moment(item.begin_date).format('YYYY-MM-DD')}}</view>
					<view>止：{{moment(item.end_date).format('YYYY-MM-DD')}}</view>
				</uni-td>
				<uni-td align="center">
					{{Math.round(item.duration / 1440)}}天
				</uni-td>
			</uni-tr>
		</uni-table>
		
		<uni-table v-if="type===6" emptyText="暂无数据" :loading="loading">
			<uni-tr>
				<uni-th align="center">外出起止时间</uni-th>
				<uni-th align="center">外出时长</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index" @click.native="goDetail(6, item)">
				<uni-td align="center">
					<view>起：{{moment(item.begin_date).format('YYYY-MM-DD HH:mm')}}</view>
					<view>止：{{moment(item.end_date).format('YYYY-MM-DD HH:mm')}}</view>
				</uni-td>
				<uni-td align="center">
					{{timeStrByMinutes(item.duration)}}
				</uni-td>
			</uni-tr>
		</uni-table>
		
		<uni-table v-if="type===7" emptyText="暂无数据" :loading="loading">
			<uni-tr>
				<uni-th align="center">加班起止时间</uni-th>
				<uni-th align="center">加班时长</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index" @click.native="goDetail(7, item)">
				<uni-td align="center">
					<view>起：{{moment(item.begin_date).format('YYYY-MM-DD HH:mm')}}</view>
					<view>止：{{moment(item.end_date).format('YYYY-MM-DD HH:mm')}}</view>
				</uni-td>
				<uni-td align="center">
					{{timeStrByMinutes(item.duration)}}
				</uni-td>
			</uni-tr>
		</uni-table>
		
		<uni-table v-if="type===8" emptyText="暂无数据" :loading="loading">
			<uni-tr>
				<uni-th align="center">补卡时间</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index" @click.native="goDetail(8, item)">
				<uni-td align="center">
					{{moment(item.ctime).format("YYYY-MM-DD HH:mm 缺卡")}}
				</uni-td>
			</uni-tr>
		</uni-table>
		
		<managePopup :open="managePopupOpen" @change="managePopupChange" :index_code="navItem.index_code"></managePopup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment';
	import timeStrByMinutes from './common/timeStrByMinutes.js';
	
	const typeNameList = ['请假','旷工','缺卡','迟到','早退','出差','外出','加班','补卡'];
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				type: -1,
				loading: false,
				tableData: [],
				managePopupOpen: false
			}
		},
		components: {
			mynavBar,
			managePopup: () => import('./components/manage-popup')
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
			timeStrByMinutes,
			managePopupChange(show) {
				this.managePopupOpen = show;
			},
			goDetail(type, item) {
				if(type===0) {
					util.openwithData('/pages/khfw/teaLeaveApply_detail', {
						index_code: this.navItem.index_code,
						id: item.id
					}, {})
				}else if(type===5) {
					util.openwithData('/pages/teachercAttendance/ApplyDetail', {
						index_code: this.navItem.index_code,
						type: 1,
						id: item.id,
						allow_del: false,
					}, {})
				}else if(type===6) {
					util.openwithData('/pages/teachercAttendance/ApplyDetail', {
						index_code: this.navItem.index_code,
						type: 2,
						id: item.id,
						allow_del: false,
					}, {})
				}else if(type===7) {
					util.openwithData('/pages/teachercAttendance/ApplyDetail', {
						index_code: this.navItem.index_code,
						type: 3,
						id: item.id,
						allow_del: false,
					}, {})
				}else if(type===8) {
					util.openwithData('/pages/teachercAttendance/ApplyDetail', {
						index_code: this.navItem.index_code,
						type: 0,
						id: item.id,
						allow_del: false,
					}, {})
				}
			},
			getData() {
				let post_url = "";
				let post_data = {};
				switch (this.type){
					case 0:
						post_url = this.globaData.INTERFACE_KHFW + 'vacationApplication/passList';
						post_data = {
							user_code: this.personInfo.user_code,
						}
						break;
					case 1:
						post_url = this.globaData.INTERFACE_TECKQ+'kqAttend/absList';
						post_data = {
							user_code: this.personInfo.user_code,
						}
						break;
					case 2:
						post_url = this.globaData.INTERFACE_TECKQ+'kqAttend/list';
						post_data = {
							user_code: this.personInfo.user_code,
							status: 0,
						}
						break;
					case 3:
						post_url = this.globaData.INTERFACE_TECKQ+'kqAttend/list';
						post_data = {
							user_code: this.personInfo.user_code,
							status: 2,
						}
						break;
					case 4:
						post_url = this.globaData.INTERFACE_TECKQ+'kqAttend/list';
						post_data = {
							user_code: this.personInfo.user_code,
							status: 3,
						}
						break;
					case 5:
						post_url = this.globaData.INTERFACE_TECKQ+'kqApply/page';
						post_data = {
							type: '出差',
							status: 2,
							page_number: -1,
							ex_user_code: this.personInfo.user_code,
						}
						break;
					case 6:
						post_url = this.globaData.INTERFACE_TECKQ+'kqApply/page';
						post_data = {
							type: '外出',
							status: 2,
							page_number: -1,
							ex_user_code: this.personInfo.user_code,
						}
						break;
					case 7:
						post_url = this.globaData.INTERFACE_TECKQ+'kqApply/page';
						post_data = {
							type: '加班',
							status: 2,
							page_number: -1,
							ex_user_code: this.personInfo.user_code,
						}
						break;
					case 8:
						post_url = this.globaData.INTERFACE_TECKQ+'kqApply/page';
						post_data = {
							type: '补卡',
							status: 2,
							page_number: -1,
							ex_user_code: this.personInfo.user_code,
						}
						break;
					default:
						break;
				}
				this.loading = true;
				this.post(post_url, {
					index_code: this.navItem.index_code,
					begin_date: this.navItem.begin_date,
					end_date: this.navItem.end_date,
					...post_data,
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
	
	table.uni-table {
		min-width: unset;
	}
	.uni-table {
		.uni-table-th, .uni-table-td {
			border: 1px solid #ffffff;
			border-radius: 5px;
			color: #333;
			font-size: 13px;
		}
		.uni-table-th {
			background-color: #d7d7d7;
		}
		.uni-table-td {
			background-color: #f2f2f2;
		}
	}
</style>
