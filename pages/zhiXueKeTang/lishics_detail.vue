<template>
	<view>
		<uni-list>
			<uni-list-item v-for="(model,index) in pagedata" :key='index' direction='column' showArrow clickable
				@click="clickItem(model)">
				<view slot="body" style="min-height: 40px;">
					<view style="float: left;">
						<view style="font-size: 14px;margin-top: 10px;">{{model.name}}</view>
					</view>
					<view style="float: left;">
						<view style="font-size: 12px;color: gray;margin-top: 12px;">{{model.create_time.substr(0,16)}}</view>
					</view>
					<view class="rightView">
						<view style="text-align: right;font-size: 13px;color: gray;margin-top: 10px;">{{model.score}}分
						</view>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				pageSize:15,
				pageobj0:{
					loadFlag:0,//0 刷新 1加载更多
					page_number:1,//页码
					status:'more',//加载更多的状态
					contentText: {
						contentdown: '',//上滑加载更多
						contentrefresh: '加载中',
						contentnomore: ''//没有更多
					},
					canload:true,//是否加载更多
				},
				index_code:'',
				pagedata: [],
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			let itemData=util.getPageData(option);
			this.itemData = itemData
			this.index_code = itemData.index_code
			uni.setNavigationBarTitle({
				title: itemData.sub_name
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			this.getList();
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
		onReachBottom() {
			if(this.pageobj0.canload){
				this.pageobj0.loadFlag=1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number=this.pageobj0.page_number+1
				this.getList()
			}
		},
		methods: {
			getList: function() {
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZXKT + "/history/reportInfo", {
					sub_code: this.itemData.sub_code,
					per_code: this.itemData.percode,
					page_number: this.pageobj0.page_number,
					page_size: this.pageSize,
					index_code: this.index_code,
					user_code: this.personInfo.user_code,
				}, (res0, res) => {
					this.hideLoading();
					console.log("res: " + JSON.stringify(res));
					if (res.code == 0) {
						this.pagedata=this.pagedata.concat(res.data.report_info.list)
						if(this.pageobj0.page_number>=res.data.report_info.total_page){
							this.pageobj0.status = 'noMore';
							this.pageobj0.canload=false
						}else{
							this.pageobj0.status = 'more';
						}
					} else {
						this.showToast(res.msg);
					}
				});
			},
			clickItem(model) {
				console.log('clickItem:' + JSON.stringify(model));
				this.showLoading();
				this.post(this.globaData.INTERFACE_ZXKT + "/history/reportDetail", {
					report_id: model.id,
					index_code: this.index_code,
					user_code: this.personInfo.user_code,
				}, (res0, res) => {
					this.hideLoading();
					console.log("res: " + JSON.stringify(res));
					if (res.code == 0) {
						res0.titleName=model.name
						res0.catalogId=model.book_catalog_id
						res0.hideButton=true
						util.openwithData("/pages/zhiXueKeTang/zujuancs_result", res0);
					} else {
						this.showToast(res.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.popup-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		/* align-items: center; */
		/* justify-content: center; */
		padding: 60px 0px 20px 0px;
		/* height: 50px; */
		background-color: #fff;
	}

	.perList {
		margin-left: 20px;
		border: 1px solid white;
		padding: 5px 20px;
		border-radius: 5px;
		font-size: 13px;
	}
</style>
