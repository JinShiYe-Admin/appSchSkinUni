<template>
	<view>
		<uni-list>
			<uni-list-item v-for="(item,index) in pageArray" :title="`${item.name}${item.custom_name}`" :ellipsis="2" link @click="clickLi(item)">
				<template slot="header">
					<span v-if="item.status == 1" class="readClass1">未阅</span>
					<span v-else-if="item.status == 2" class="readClass2">阅卷中</span>
					<span v-else-if="item.status == 3" class="readClass3">已阅</span>
				</template>
			</uni-list-item>
		</uni-list>

		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				pageArray: [],
				pageIndex: 1,
				total_page: 0,
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			this.getPageList();
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
			clickLi(model){
				model.access = this.itemData.access;
				console.log('clickLi:'+JSON.stringify(model));
				if (model.status == 3) {
					util.openwithData("/pages/markingPapers/markScore", model);
				} else {
					util.openwithData("/pages/markingPapers/markingDetail", model);
				}
			},
			getPageList() {
				//需要加密的数据
				var comData = {
					page_number: this.pageIndex, //当前页数
					page_size: '10', //每页记录数
					index_code: this.itemData.access.split('#')[1],
					grd_code: '', //年级代码
					status: '1,2,3', //状态,0未启动 1未阅 2阅卷中 3已阅
					start_time: '', //查询开始时间
					end_time: '', //查询结束时间
					keyword: '', //名称关键字
					user_code: this.personInfo.user_code, //用户代码
				}
				this.showLoading();
				//1.2.月考分页
				this.post(this.globaData.INTERFACE_MARKINGPAPERS + 'monthTest/page', comData, (data) => {
					for (var i = 0; i < data.list.length; i++) {
						var tempM = data.list[i];
						if(tempM.custom_name == null){
							tempM.custom_name = '';
						}
					}
					this.hideLoading();
					this.pageIndex++;
					this.total_page = data.total_page;
					if (this.flagRef == 0) {
						this.pageArray = [].concat(data.list);
						uni.stopPullDownRefresh();
					} else {
						this.pageArray = this.pageArray.concat(data.list);
					}
				});
			}
		}
	}
</script>

<style>
	.readClass1 {
		margin-top: 5px;
		width: 40px;
		height: 20px;
		text-align: center;
		margin-right: 10px;
		color: #d43030;
		padding: 3px;
		font-size: 13px;
		border-radius: 2px;
		border: 1px solid #d43030;
	}

	.readClass2 {
		margin-top: 5px;
		width: 40px;
		height: 20px;
		text-align: center;
		margin-right: 10px;
		color: #ff8d1a;
		padding: 3px;
		font-size: 13px;
		border-radius: 2px;
		border: 1px solid #ff8d1a;
	}

	.readClass3 {
		margin-top: 5px;
		width: 40px;
		height: 20px;
		text-align: center;
		margin-right: 10px;
		color: #43cf7c;
		padding: 3px;
		font-size: 13px;
		border-radius: 2px;
		border: 1px solid #43cf7c;
	}
</style>
