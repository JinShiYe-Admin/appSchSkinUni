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
			<button class="uni-flex-item" :class="codeColor === 'r' ? 'active' : ''" @click="onColorChange('r')">红码</button>
			<button class="uni-flex-item" :class="codeColor === 'y' ? 'active' : ''" @click="onColorChange('y')">黄码</button>
		</view>
		
		<view class="uni-pa-4">
			<!-- <uni-table class="uni-mb-4" border stripe emptyText="暂无数据">
				<uni-tr>
					<uni-th style="width: 20%" align="center">年级</uni-th>
					<uni-th style="width: 20%" align="center">班级</uni-th>
					<uni-th style="width: 40%" align="center">学生</uni-th>
					<uni-th style="width: 20%" align="center">健康码</uni-th>
				</uni-tr>
				
				<uni-tr v-for="(item, index) in items" :item="item" ref="rows">
					<uni-td align="center">{{ item.grd_name }}</uni-td>
					<uni-td align="center">{{ item.cls_name }}</uni-td>
					<uni-td align="center">{{ item.stu_name }}</uni-td>
					<uni-td align="center" v-if="item.health_code_color === 'r'">
						<text class="uni-error">红码</text>
					</uni-td>
					<uni-td align="center" v-if="item.health_code_color === 'y'">
						<text class="uni-warning">黄码</text>
					</uni-td>
				</uni-tr>
			</uni-table>
			
			<uni-page
				:total="page.total"
				:value="page.current"
				:pageSize="page.pageSize"
				@change="onPageChange"
			/> -->
			
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
			</uni-list>
			
			<uni-load-more :status="page.more" :content-text="page.contentText"></uni-load-more>
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
				codeColor: 'r',
				grd_code: '',
				cls_code: '',
				page:{
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
				},
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
			this.navItem = util.getPageData(option);
			this.index_code = this.navItem.access.split("#")[1];
			this.datetime = this.navItem.datetime;
			this.grd_code = this.navItem.grd_code;
			this.cls_code = this.navItem.cls_code;
			var tempDate = new Date();
			this.curDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
			uni.setNavigationBarTitle({
				title:'健康码异常学生',
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
						health_code_color: this.codeColor,
					},
					(data) => {
						setTimeout(() => {
							uni.stopPullDownRefresh();
						}, 1000);
						
						if (data !== null) {
							this.page.total = data.total_page;
							if (this.page.loadFlag === 0){
								this.items = [].concat(data.list);
							} else {
								this.items = this.items.concat(data.list);
							}
							if (this.page.current >= data.total_page) {
								this.page.status = 'noMore';
								this.page.canload = false;
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
			onColorChange(color) {
				this.page.loadFlag = 0;
				this.page.canload = true;
				this.page.page_number = 1;
				this.codeColor = color;
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
