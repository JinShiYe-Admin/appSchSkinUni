<template>
	<view>
		<view style="text-align: center;font-size: 13px;color: gray;height: 40px;margin-top: 10px;">{{perTitle}}
			<uni-icons type="settings" size="20" color="#00CFBD" style="margin-left: 10px;padding-top: 5px;"
				@click="bookSelect()"></uni-icons>
		</view>
		<view style="height: 4px;background: #DDDDDD;width: 100%;"></view>
		<uni-list>
			<uni-list-item showArrow v-for="(v, i) in pageArray" :key='i' direction='column' clickable @click="clickItem(v)">
				<view slot="body" class="slot-box slot-text">
					<view class="rightView">
						<uni-row class="nameTime">
							<uni-col :span="12" class="title">
								{{v.book_catalog_name}}
							</uni-col>
							<uni-col :span="12" style="text-align: right;" class="progress">
								<span class="cur">{{v.complete_number}}</span><span style='font-size: 14px;'>/{{v.total_number}}</span>
							</uni-col>
							<uni-col :span="12" class="sec-title">
								{{v.book_catalog_pname}}
							</uni-col>
							<uni-col :span="12" style="text-align: right;" class="time">
								{{v.create_time}}
							</uni-col>
						</uni-row>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	let _this;
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
				perTitle:''
			}
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title:'测评记录'
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			this.perTitle = this.getBookNames()||"暂无教材";
			//
			this.getPageList();
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题			// #ifdef H5				uni.pageScrollTo({					scrollTop: this.scrollLength,					duration: 0				});			// #endif
						//#ifndef APP-PLUS
							document.title=""
						//#endif
		},		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替			// #ifdef H5				this.scrollLength=e.scrollTop			// #endif		},
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
			//选择教材
			bookSelect() {
				util.openwithData("/pages/kouYuCePing/book", this.itemData,{
					refreshBook() { //子页面调用父页面需要的方法
						_this.pageIndex = 1;
						_this.perTitle = _this.getBookNames()||"暂无教材";
						_this.getPageList();
						const eventChannel = _this.getOpenerEventChannel();
						eventChannel.emit('refreshBook');
					}
				});
			},
			//获取教材名
			getBookNames() {
				var orals_menu = util.getStore("orals_menu");
				return orals_menu.name || "";
			},
			clickItem(model) {
				console.log('clickItem');
				model.access = this.itemData.access;
				model.title= model.book_catalog_name;
				model.cate= model.category;
				model.catalog_id= model.book_catalog_id;
				console.log('clickItem:' + JSON.stringify(model));
				util.openwithData("/pages/kouYuCePing/result", model);
			},
			getPageList() {
				var catalog = util.getStore('orals_catalog')||[];
				var catalog_id = [];
				if(this.pageIndex==1) {
					//可选目录节点
					catalog.forEach(function(v){
						catalog_id.push(v.id);
					});
				}
				var comData = {
					page:true,
					p: this.pageIndex,
					s: '20',
					bookCatalogId: catalog_id.join(),
					category: this.itemData.category,
					index_code:this.itemData.access.split('#')[1],
					user_code: this.personInfo.user_code
				}
				this.showLoading();
				//
				this.post(this.globaData.INTERFACE_KYCP + '/orals/history', comData, (data) => {
					this.hideLoading();
					this.pageIndex++;
					this.total_page = data.total_page;
					if (this.flagRef == 0) {
						if(data.list.length==0){
							this.showToast('暂无数据');
						}
						this.pageArray = [];
						uni.stopPullDownRefresh();
					}
					data.list.forEach(function(v){
						var book_catalog = _this.filterArray(catalog, 'id', v.book_catalog_id)[0];
						if(v.category==_this.itemData.category&&book_catalog) {
							v['book_catalog_pname'] = book_catalog.pname;
							_this.pageArray.push(v);
						}
					});
				});
			},
			// 根据某属性的值找数组对象
			filterArray(arr, key, val) {
				var r = arr.filter(function(item) {
					return item[key] == val;
				});
				return r;
			},
		}
	}
</script>

<style>
	.title {
		font-size: 114%;
		color: #333333;
		font-weight: normal;
		margin-top: 0;
		line-height: 1.4;
		padding-right: 0.08rem;
	}
	
	.progress {
		color: #333333;
	}
	.cur {
		font-size: 143%;
	}
	.time {
		font-size: 86%;
		color: #999999;
	}
	.sec-title {
		color: #666666;
		font-size: 92%;
		word-break:break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
