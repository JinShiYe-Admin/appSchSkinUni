<template>
	<view>
		<view class="uni-pa-4">
			<uni-datetime-picker
				type="date"
				:value="navItem.datetime"
				:end="curDate"
				@change="onDateChange"
			/>
		</view>
		
		<view class="uni-flex uni-pa-4 button-group">
			<button class="uni-flex-item" :class="isReport ? 'active' : ''" @click="changeReport(true)">已上报</button>
			<button class="uni-flex-item" :class="isReport ? '' : 'active'" @click="changeReport(false)">未上报</button>
		</view>
		
		<view class="uni-flex uni-pa-4" v-if="reportItems.length > 0">
			<uni-grid :column="3" :showBorder="false" :highlight="true" @change="onTouchGrid">
				<uni-grid-item class="grid-item-box" v-for="(item, index) in reportItems" :index="index" :key="index">
					<text class="grid-item-text" :class="item.id ? 'grid-item-text-success' : ''">{{ item.stu_name }}</text>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view class="uni-pa-4" v-else>
			<p v-if="!loading" class="uni-center uni-text-gray">暂无数据</p>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	// import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				curDate:'',
				items: [],
				isReport: true,
				loading: true,
			}
		},
		components: {
			// mynavBar
		},
		computed: {
			reportItems() {
				return this.items
					.filter((e => this.isReport ? e.id : e.id === null))
					.sort((a, b) => a.stu_name.localeCompare(b.stu_name));
			}
		},
		watch: {
			'navItem.datetime': function () {
				this.fetch();
			}
		},
		onLoad(option) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			// uni.$on('updateHeadImg', function(data) {
			// 	_this.$refs.mynavBar.upLoadImg();
			// });
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			// index1界面用这个
			this.navItem = util.getPageData(option);
			this.index_code = this.navItem.access.split("#")[1];
			var tempDate = new Date();
			// var preDate = new Date(tempDate.getTime() - 24 * 60 * 60 * 1000); //前一天
			this.curDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
			uni.setNavigationBarTitle({
				title: this.navItem.cls_name + ' 上报情况',
			});
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		mounted() {
			
			
		},
		methods: {
			fetch() {
				this.loading = true;
				this.showLoading();
				this.post(
					this.globaData.INTERFACE_HEALTH_DATA + 'healthReport/clsStatisticsDetail',
					{
						date: this.navItem.datetime,
						cls_code: this.navItem.cls_code,
						index_code: this.index_code
					},
					(data) => {
						const { list = [] } = data;
						this.items = list;
						this.isReport = true;
						this.hideLoading();
						this.loading = false;
					}
				);
			},
			changeReport(status) {
				this.isReport = status;
			},
			onDateChange(date) {
				this.navItem.datetime = date;
			},
			onTouchGrid(event) {
				const { index } = event.detail
				const id = this.reportItems[index].id;
				if (id) {
					util.openwithData('/pages/stuHealthMsg/stuHealthMsgNotesDetail', {
						id: id,
						access: this.index_code,
					});
				} else {
					console.error('id is null.');
				}
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
			
			&::after {
				border: none;
				border-bottom: 4px solid transparent;
			}
			
			&.active {
				color: $app-color-primary;
				border-bottom: 4px solid $app-color-primary;
			}
		}
	}
	
	.grid-item-box {
		height: auto !important;
		padding: 8px;
		text-align: center;
		box-sizing: border-box;
	}
	
	.grid-item-text {
		padding: 8px 4px;
		background-color: rgba(#000, 0.05);
		border-radius: 4px;
		&-success {
			background-color: rgba($uni-success, 0.2);
		}
	}
</style>
