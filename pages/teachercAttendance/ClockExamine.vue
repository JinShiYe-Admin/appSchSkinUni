<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="tab-title">
			<view :class="[isJudge==='0'?'semFlagSelect':'']" @click="changeIsJudge('0')">未审批</view>
			<view :class="[isJudge==='1'?'semFlagSelect':'']" @click="changeIsJudge('1')">已审批</view>
		</view>
		<uni-card isShadow style="margin: 20px 5px 0;" @click="gotoDetail(item)" v-for="(item,index) in pageData" :key="index">
			<view class="uni-flex uni-row examine-card-head">
				<view>
					<text style="margin-right: 7px;">{{item.dpt_name}}</text>
					<text style="word-break: keep-all;">{{item.create_user_name}}</text>
				</view>
				<view>
					<text v-if="item.check_status>1" :style="{color: '#70b603'}">已审批</text>
					<text v-else style="color: #b8741a;">未审批</text>
				</view>
			</view>
			<uni-row class="examine-card-row">
				<uni-col :span="6">补卡时间：</uni-col>
				<uni-col :span="18">{{item.ctime}}</uni-col>
				
				<uni-col :span="6">补卡理由：</uni-col>
				<uni-col :span="18">{{item.note}}</uni-col>
				
				<uni-col :span="6">申请时间：</uni-col>
				<uni-col :span="18">{{item.create_time}}</uni-col>
			</uni-row>
		</uni-card>
		<view style="height: 50px;background: #f2f2f2;"></view>
		<view class="uni-loadmore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	const type = "补卡";
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				isJudge: "0",
				pageData: [],
				pageNumber: 1,
				pageSize: 10,
				totalPage: 1,
				loadMoreText: "",
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
			
			this.getList();
			
			//#ifdef H5
			document.title = "";
			//#endif
			//
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			gotoDetail(item){
				util.openwithData('/pages/teachercAttendance/applyDetail', {
					index_code: this.navItem.access.split("#")[1],
					type: 0,
					id: item.id,
					is_check: item.check_status<2,
					examine_rec_id: item.examine_rec_id,
				}, {
					refreshPage(data) { //子页面调用父页面需要的方法
						_this.pageNumber = 1;
						_this.getList();
					}
				})
			},
			changeIsJudge(flag){
				if (flag !== this.semFlag) {
					this.isJudge = flag;
					this.pageNumber = 1;
					this.getList();
				}
			},
			getList(){
				this.showLoading();
				this.post(this.globaData.INTERFACE_TECKQ+'kqApply/checkPage', {
					index_code: this.navItem.access.split("#")[1],
					checker_code: this.personInfo.user_code,
					type,
					page_number: this.pageNumber,
					page_size: this.pageSize,
					is_judge: this.isJudge
				}, (data, res) => {
					this.hideLoading();
					if(data&&data.list) {
						if(this.pageNumber===1) {
							this.pageData = data.list;
							uni.stopPullDownRefresh();
							if(!data.list.length) this.showToast('暂无数据');
						}else{
							this.pageData = this.pageData.concat(data.list);
						}
						this.totalPage = data.total_page;
						if(this.pageNumber<this.totalPage) {
							this.loadMoreText = ""
						}else{
							this.loadMoreText = "没有更多数据了!"
						}
					} else {
						this.showToast(res.msg);
					}
				});
			},
		},
		onReachBottom() {
			// 加载更多
			if(this.pageNumber<this.totalPage) {
				this.pageNumber = this.pageNumber + 1;
				this.getList();
			}
		},
		onPullDownRefresh() {
			// 刷新
			this.pageNumber = 1;
			this.getList();
		},
	}
</script>

<style lang="scss">
	@import "style/examineList.scss";
</style>
