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
		
		<view class="uni-pa-4">
			<uni-table border stripe emptyText="暂无数据">
				<uni-tr>
					<uni-th align="center">年级</uni-th>
					<uni-th align="center">班级</uni-th>
					<uni-th align="center">已上报</uni-th>
					<uni-th align="center">未上报</uni-th>
				</uni-tr>
				
				<uni-tr v-for="(item, index) in items" :item="item" ref="rows">
					<uni-td align="center">{{item.grd_name}}</uni-td>
					<uni-td align="center">{{item.cls_name}}</uni-td>
					<uni-td align="center">
						<text class="uni-success">{{item.num_of_reported}}</text>
					</uni-td>
					<uni-td align="center">
						<text class="uni-warning">{{item.num_of_no_reported}}</text>
					</uni-td>
				</uni-tr>
			</uni-table>
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
				grd_code: '',
				cls_code: '',
			}
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
			// 设置日期
			this.datetime = this.navItem.datetime;
			this.grd_code = this.navItem.grd_code;
			this.cls_code = this.navItem.cls_code;
			var tempDate = new Date();
			// var preDate = new Date(tempDate.getTime() - 24 * 60 * 60 * 1000); //前一天
			this.curDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
		},
		watch: {
			datetime() {
				this.fetch();
			}
		},
		mounted() {
			document.title = "上报情况";
			
			uni.setNavigationBarTitle({
				title:'上报情况',
			});
			
			this.$nextTick(() => {
				document.querySelector('table').style.minWidth = '100%';
			});
		},
		methods: {
			fetch() {
				this.showLoading();
				this.post(
					this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/clsStatistics',
					{
						date: this.datetime,
						sch_code: this.personInfo.sch_code,
						grd_codes: this.grd_code,
						cls_codes: this.cls_code,
						index_code: this.index_code
					},
					(data) => {
						const { list = [] } = data;
						this.items = list;
						
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
			},
			onTableRowTouch(item) {
				if (item) {
					util.openwithData('/pages/stuHealthMsgTeacher/reportDetail', {
						...this.navItem,
						cls_code: item.cls_code,
						cls_name: item.cls_name,
						datetime: this.datetime,
					}, {});
				} else {
					console.error('item not found.');
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uni-scss';
</style>
