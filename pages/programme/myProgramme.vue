<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='itemData' :personInfo='personInfo' :icon="rightIcon" :iconClick="iconClick">
		</mynavBar>
		<uni-list>
			<uni-list-item v-for="(model,index) in dataList" :key='index' direction='column'>
				<view slot="body">
					<view class="">
						<a class="tempCss">时间：</a>
						<a class="biaoti">{{model.note_date}} {{model.begin_time}}~{{model.end_time}}</a>
					</view>
					<view class="">
						<a class="tempCss">地点：</a>
						<a class="biaoti">{{model.note_addr}}</a>
					</view>
					<view class="">
						<a class="tempCss">内容：</a>
						<a class="biaoti">{{model.note_note}}</a>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				rightIcon: '', //add按钮权限
				pageSize: 20,
				flagRef: 0, //0刷新1加载更多
				pageIndex: 1,
				total_page: 0, //总页数
				loadMoreText: "加载中...",
				showLoadMore: false,
				dataList: []
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.index = 100;
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//4.获取某人日程列表
			this.getPageList();
			// 获取权限
			this.getPermissionByPosition('add', this.itemData.access.split('#')[1], result => {
				console.log('result:' + JSON.stringify(result));
				if (result[0]) {
					this.rightIcon = 'plusempty';
				}
			})
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
				this.getPageList();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getPageList();
		},
		methods: {
			iconClick() {
				console.log('iconClick');
				let model = {};
				let index_code = this.itemData.access.split('#')[1]
				model.index_code = index_code;
				model.text = '新增日程';
				util.openwithData("/pages/programme/add_programme", model,{
					refreshMyProgrammeList() { //子页面调用父页面需要的方法
							_this.flagRef = 0;
							_this.pageIndex = 1;
							_this.getPageList();
					}
				});
			},
			//4.获取某人日程列表
			getPageList() {
				var comData = {
					user_code: this.personInfo.user_code, //用户Code
					note_addr: '', //日程地点
					begin_time: '20170101', //查询开始时间
					end_time: '30180127', //查询结束时间
					page_number: this.pageIndex, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.itemData.access.split('#')[1],
					op_code: 'index'
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_PROGRAMME + 'note/getNotes', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pageIndex++;
						this.total_page = data.data.total_page;
						if (this.flagRef == 0) {
							if (data.data.list.length == 0) {
								this.showToast('暂无数据');
							}
							this.dataList = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.dataList = this.dataList.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.tempCss{
		font-size: 14px;
		color: #000000;
	}
	
	.biaoti{
		font-size: 14px;
		color: gray;
		word-break: break-all;
	}
</style>
