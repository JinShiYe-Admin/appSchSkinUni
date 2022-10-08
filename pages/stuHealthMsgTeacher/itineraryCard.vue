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
			<uni-list :border="false">
				<uni-list-item showArrow clickable :key="index" v-for="(item, index) in items" :border="true" @click="toDetail(item)">
					<view style="width: 100%" slot="body">
						<uni-row>
							<uni-col class="uni-center" :span="7">{{ item.grd_name }}</uni-col>
							<uni-col class="uni-center" :span="7">{{ item.cls_name }}</uni-col>
							<uni-col class="uni-center" :span="10">{{ item.stu_name }}</uni-col>
						</uni-row>
					</view>
				</uni-list-item>
				
				<uni-load-more :status="page.more" :content-text="page.contentText"></uni-load-more>
			</uni-list>
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
				datetime: '',
				items: [],
				grd_code: '',
				cls_code: '',
				page: {
					current: 1,
					total: 0,
					pageSize: 20,
					loadFlag: 0,
					status: 'more',
					canload:true,
					contentText: {
						contentdown: '',
						contentrefresh: '加载中',
						contentnomore: '',
					},
				}
			}
		},
		computed: {
		},
		components: {
			// mynavBar
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
			// index界面用这个
			// this.navItem = util.getTabbarMenu();
			this.index_code = this.navItem.access.split("#")[1];
			this.datetime = this.navItem.datetime;
			this.grd_code = this.navItem.grd_code;
			this.cls_code = this.navItem.cls_code;
			var tempDate = new Date();
			// var preDate = new Date(tempDate.getTime() - 24 * 60 * 60 * 1000); //前一天
			this.curDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
			uni.setNavigationBarTitle({
				title:'行程卡异常学生',
			});
			//#ifdef H5
			document.title = ""
			//#endif
		},
		mounted() {
			this.fetch();
		},
		onPullDownRefresh() {
			this.page.loadFlag = 0;
			this.page.canload = true;
			this.page.page_number = 1;
			this.fetch();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if (this.page.canload) {
				this.page.loadFlag = 1;
				this.page.status = 'loading';
				this.page.current = this.page.current + 1;
				this.fetch()
			} else {
				if (this.page.current >= this.page.total) {
					this.showToast('没有更多数据了!');
					return;
				}
			}
		},
		onPageScroll(e) {
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			
			//#ifdef H5
			document.title = ""
			//#endif
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
						page_number: this.page.current,
						page_size: this.page.pageSize,
						is_risky: '1',
					},
					(data) => {
						setTimeout(() => {
							uni.stopPullDownRefresh();
						}, 1000);
						
						const { list = [] } = data;
						
						if (data !== null) {
							this.page.total = data.total_page;
							if (this.page.loadFlag === 0){
								this.items = [].concat(data.list);
							} else {
								this.items = this.items.concat(data.list);
							}
							if (this.page.current >= data.total_page) {
								this.page.status = 'noMore';
								this.page.canload = false
							} else {
								this.page.status = 'more';
							}
						} else {
							this.items = [];
							this.showToast('暂无数据');
							this.page.status = 'noMore';
							this.page.canload = false;
						}
						
						this.hideLoading();
					}
				);
			},
			onDateChange(date) {
				this.page.loadFlag = 0;
				this.page.canload = true;
				this.page.page_number = 1;
				this.datetime = date;
				this.fetch();
			},
			toDetail(item) {
				if (item) {
					util.openwithData('/pages/stuHealthMsg/stuHealthMsgNotesDetail', {
						id: item.id,
						access: this.index_code,
					});
				} else {
					console.error('item not found.');
				}
			},
			
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
	
	.uni-col {
		padding: 4px 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
