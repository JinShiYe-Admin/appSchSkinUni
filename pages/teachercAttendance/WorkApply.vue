<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick"></mynavBar>
		<uni-card class="apply-list-card" isShadow  @click="gotoDetail(item)" v-for="(item,index) in pageData" :key="index">
			<uni-row>
				<uni-col :span="12">
					<text style="margin-right: 12px;">{{timeStr(item.duration)}}</text>
					<text>{{item.peoples}} 人</text>
				</uni-col>
				<uni-col :span="12" style="text-align: right;">{{item.passs}}/{{item.examines}}</uni-col>
			</uni-row>
			<view class="result-box">
				<view :style="{color:item.status<2?'#aaaaaa':item.status>2?'#d9001b':'#70b603'}">
					{{item.status<2?'--':item.status>2?'不同意':'同意'}}
				</view>
				<view>审批意见</view>
			</view>
			<uni-row class="row-box">
				<uni-col :span="6">加班时间：</uni-col>
				<uni-col :span="18">
					{{`${moment(item.begin_date).format('YYYY-MM-DD HH:mm')} 至 ${moment(item.end_date).format('YYYY-MM-DD HH:mm')}`}}
				</uni-col>
				
				<uni-col :span="6">加班人员：</uni-col>
				<uni-col :span="18">{{item.user_names}}</uni-col>
				
				<uni-col :span="6">加班原因：</uni-col>
				<uni-col :span="18">{{item.note}}</uni-col>
				
				<uni-col :span="6">申请时间：</uni-col>
				<uni-col :span="18">{{item.create_time}}</uni-col>
			</uni-row>
		</uni-card>
		<view class="uni-loadmore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment';
	import timeStrByMinutes from './common/timeStrByMinutes.js';
	let _this;
	const type = "加班";
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				icon: '',
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
			const itemData = util.getPageData(option);
			itemData.index = 100;
			this.navItem = itemData;
			
			this.getPermissionByPosition('add',this.navItem.access.split("#")[1],result=>{
				if(result[0])
					this.$nextTick(() => {
						 this.icon='plusempty'
					})
			})
			
			this.getPageList()

			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			timeStr: timeStrByMinutes,
			iconClick(){
				util.openwithData('/pages/teachercAttendance/ApplyAdd', {
					index_code: this.navItem.access.split("#")[1],
					type: 3,
				}, {
					refreshPage(data) { //子页面调用父页面需要的方法
						_this.pageNumber = 1;
						_this.getPageList();
					}
				})
			},
			gotoDetail(item) {
				util.openwithData('/pages/teachercAttendance/ApplyDetail', {
					index_code: this.navItem.access.split("#")[1],
					type: 3,
					id: item.id,
					allow_del: item.allow_del,
				}, {
					refreshPage(data) { //子页面调用父页面需要的方法
						_this.pageNumber = 1;
						_this.getPageList();
					}
				})
			},
			getPageList() {
				this.showLoading();
				this.post(this.globaData.INTERFACE_TECKQ+'kqApply/page', {
					user_code: this.personInfo.user_code,
					index_code: this.navItem.access.split("#")[1],
					type,
					page_number: this.pageNumber,
					page_size: this.pageSize
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
				})
			},
		},
		onReachBottom() {
			// 加载更多
			if(this.pageNumber<this.totalPage) {
				this.pageNumber = this.pageNumber + 1;
				this.getPageList();
			}
		},
		onPullDownRefresh() {
			// 刷新
			this.pageNumber = 1;
			this.getPageList();
		}
	}
</script>

<style lang="scss">
	@import "style/cardStyle.scss";
</style>
