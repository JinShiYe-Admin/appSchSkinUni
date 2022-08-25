<template>
	<view>
		<view class="uni-pa-4">
			<uni-datetime-picker
				type="date"
				:value="datetime"
				:end="curDate"
				@change="onDateChange"
			/>
		</view>
		
		<view class="uni-flex uni-pa-4 button-group">
			<button
				class="uni-flex-item"
				:class="status === 'roomy_is_infect' ? 'active' : ''"
				@click="onStatusChange('roomy_is_infect')"
				title="感染"
			>感染</button>
			<button
				class="uni-flex-item"
				:class="status === 'roomy_is_14_high_risk' ? 'active' : ''"
				@click="onStatusChange('roomy_is_14_high_risk')"
				title="到过中高风险地区"
			>到过中高风险地区</button>
			<button
				class="uni-flex-item"
				:class="status === 'roomy_is_unusual' ? 'active' : ''"
				@click="onStatusChange('roomy_is_unusual')"
				title="发热/咳嗽/流涕/咽疼"
			>发热/咳嗽...</button>
		</view>
		
		<view class="uni-pa-4">
			<uni-table class="uni-mb-4" border stripe emptyText="暂无数据">
				<uni-tr>
					<uni-th style="width: 30%" align="center">年级</uni-th>
					<uni-th style="width: 30%" align="center">班级</uni-th>
					<uni-th style="width: 40%" align="center">学生</uni-th>
				</uni-tr>
				
				<uni-tr v-for="(item, index) in items" :item="item" ref="rows">
					<uni-td align="center">{{ item.grd_name }}</uni-td>
					<uni-td align="center">{{ item.cls_name }}</uni-td>
					<uni-td align="center">{{ item.stu_name }}</uni-td>
				</uni-tr>
			</uni-table>
			
			<uni-pagination
				:total="pagination.total"
				:value="pagination.current"
				:pageSize="pagination.pageSize"
				@change="onPageChange"
			/>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				curDate:'',
				datetime: '',
				items: [],
				status: 'roomy_is_infect',
				grd_code: '',
				cls_code: '',
				pagination: {
					current: 1,
					total: 0,
					pageSize: 10,
				}
			}
		},
		computed: {
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			});
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			// index1界面用这个
			this.navItem = util.getPageData(option);
			// index界面用这个
			// this.navItem = util.getTabbarMenu();
			this.index_code = this.navItem.access.split("#")[1];
			this.datetime = this.navItem.datetime;
			this.grd_code = this.navItem.grd_code;
			this.cls_code = this.navItem.cls_code;
			var tempDate = new Date();
			// var preDate = new Date(tempDate.getTime() - 24 * 60 * 60 * 1000); //前一天
			this.curDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
		},
		mounted() {
			this.fetch();
			
			document.title = '同住人异常情况';
			
			uni.setNavigationBarTitle({
				title:'同住人异常情况',
			});
			
			this.$nextTick(() => {
				document.querySelector('table').style.minWidth = '100%';
			});
		},
		methods: {
			fetch() {
				this.showLoading();
				this.post(
					this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/page',
					{
						date: this.datetime,
						sch_code: this.personInfo.sch_code,
						grd_codes: this.grd_code,
						cls_codes: this.cls_code,
						index_code: this.index_code,
						page_number: this.pagination.current,
						page_size: this.pagination.pageSize,
						[this.status]: true,
					},
					(data) => {
						const { list = [], total_row, page_number } = data;
						this.items = list;
						this.pagination.total = total_row;
						
						// 设置表格行点击事件
						this.$nextTick(() => {
							const { rows = [] } = this.$refs;
							rows.forEach((row => {
								row.$el.addEventListener('click', (event) => {
									event.stopPropagation();
									const { item } = row.$attrs
									this.onTableRowTouch(item);
								});
							}));
						});
						
						this.hideLoading();
					}
				);
			},
			onDateChange(date) {
				this.datetime = date;
				this.fetch();
			},
			onStatusChange(status) {
				this.status = status;
				this.fetch();
			},
			onTableRowTouch(item) {
				if (item) {
					util.openwithData('/pages/stuHealthMsg/stuHealthMsgNotesDetail', {
						id: item.id,
						access: this.index_code,
					});
				} else {
					console.error('item not found.');
				}
			},
			onPageChange(event) {
				this.pagination.current = event.current;
				this.fetch();
			}
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uni-scss';
	
	.button-group {
		button {
			background-color: transparent;
			border-radius: 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			flex: none;
			
			&::after {
				border: none;
				border-bottom: 4px solid transparent;
			}
			
			&.active {
				color: $uni-color-primary;
				border-bottom: 4px solid $uni-color-primary;
			}
		}
	}
</style>
