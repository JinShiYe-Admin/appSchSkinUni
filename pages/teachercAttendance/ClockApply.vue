<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick"></mynavBar>
		<uni-card class="apply-list-card" isShadow  @click="gotoDetail(item)" v-for="(item,index) in pageData" :key="index">
			<view class="header">{{item.passs}}/{{item.examines}}</view>
			<view class="result-box">
				<view :style="{color:item.status<2?'#aaaaaa':item.status>2?'#d9001b':'#70b603'}">
					{{item.status<2?'--':item.status>2?'不同意':'同意'}}
				</view>
				<view>审批意见</view>
			</view>
			<uni-row class="row-box">
				<uni-col :span="6">
					补卡时间：
				</uni-col>
				<uni-col :span="18">
					{{moment(item.ctime).format("YYYY-MM-DD HH:mm 缺卡")}}
				</uni-col>
				<uni-col :span="6">
					补卡理由：
				</uni-col>
				<uni-col :span="18">
					{{item.note}}
				</uni-col>
			</uni-row>
		</uni-card>
		<view class="uni-loadmore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment';
	let _this;
	const type = "补卡";
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
			iconClick(){
				util.openwithData('/pages/teachercAttendance/applyAdd', {
					index_code: this.navItem.access.split("#")[1],
					type: 0,
				}, {
					refreshPage(data) { //子页面调用父页面需要的方法
						_this.pageNumber = 1;
						_this.getPageList();
					}
				})
			},
			gotoDetail(item) {
				util.openwithData('/pages/teachercAttendance/applyDetail', {
					index_code: this.navItem.access.split("#")[1],
					type: 0,
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
