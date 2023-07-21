<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="content" style="margin-top: 20px;">
			<view>
				<m-steps v-for="(item, index) in attenceList" :item='item' :key="index" :index='index'>
					<view slot="dateTop" style="width: 100px;text-align: center;font-size: 14px;color: #808080;">
						{{item.create_time}}
					</view>
					<!-- <template v-if="item.attendance_type=='dormAttendance'"> -->
						<view slot="status" class="viewFlag" style="background-color: #ff9900;">{{item.item_name}}</view>
						<view slot="content" class="viewNode">{{item.attendance_time}}</view>
						<view slot="content" class="viewNode">{{item.comment}}</view>
					<!-- </template>
					<template v-if="item.attendance_type=='dormBehavior'">
						<view slot="status" class="viewFlag" style="background-color: #ff9900;">{{item.item_txt}}
						</view>
						<view slot="content" class="viewNode">{{item.time_range}}</view>
						<view slot="content" class="viewNode">{{item.comment}}</view>
					</template> -->
				</m-steps>
			</view>
		</view>
		<!-- index界面保留，index1界面屏蔽 -->
		<!-- <u-tabbar-my v-if='navItem.index<5' :list="tabbar"></u-tabbar-my> -->
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import mSteps from '@/components/m-steps/m-steps.vue'
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				navItem: {},
				pageSize: 10,
				pageIndex: 1,
				total_page: 0,
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
				attenceList: [] //考勤记录列表
			}
		},
		components: {
			mynavBar,
			mSteps
		},
		onLoad(option) {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			});
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			console.log('personInfo:' + JSON.stringify(this.personInfo));
			// index1界面用这个
			this.navItem = util.getPageData(option);
			// index界面用这个
			// this.navItem = util.getTabbarMenu();
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			//获取考勤记录
			this.getAttendancePage();;
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.getAttendancePage();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getAttendancePage();
		},
		methods: {
			//获取考勤记录
			getAttendancePage() {
				let user_code=this.personInfo.user_code;
				if(this.personInfo.type_code=='YHLX0004'){
					user_code=this.personInfo.stu_code;
				}
				let comData = {
					stu_code:user_code,
					page_size: this.pageSize,
					page_number: this.pageIndex,
					index_code: this.navItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_DORM + 'dormAttendance/pageWithSs', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pageIndex++;
						this.total_page = data.data.total_page;
						if (this.flagRef == 0) {
							if(data.data.list.length==0){
								this.showToast('暂无数据');
							}
							this.attenceList = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.attenceList = this.attenceList.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
		}
	}
</script>

<style>
	.viewFlag {
		height: 30px !important;
		width: 70px;
		text-align: center;
		padding-top: 5px;
		background: #3aca3a;
		border-radius: 5px;
		color: white;
		font-size: 15px;
	}

	.viewNode {
		font-size: 14px;
		color: #333;
	}

	.leaveDetail {
		font-size: 12px;
		color: #505050;
	}

	/* 间隔 */
	.spaceLine {
		padding-left: 15px;
		text-align: left;
		padding-top: 15px;
		padding-bottom: 15px;
		background: #f8efef;
		font-size: 14px;
		color: #505050;
	}
</style>
