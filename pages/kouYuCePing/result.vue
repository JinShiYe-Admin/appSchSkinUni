<template>
	<view>
		<uni-list :border="false" class="result-list mui-table-view" v-for="(item,index) in model" :key="index" v-if="item.list.length">
			<uni-list-item  v-for="(v, i) in item.list" :key='i' :class="{'word-cell': v.category=='read_word'}"
				@tap.stop="toggleOpen(index,i)">
				<view :class="{'word-box': v.category=='read_word', 'sentence-box': v.category=='read_sentence'}">
					<h4 v-if="v.category=='read_word'">{{v.words}}
						<span class="symbol" v-if="v.symbol">[{{v.symbol}}]</span>
						<span class="score" v-if="v.total_score!=null">{{setScore(v.total_score)}}</span>
					</h4>
					<h4 v-else>{{v.words}}
						<span class="score" v-if="v.total_score!=null">{{setScore(v.total_score)}}</span>
					</h4>
					<view class="btns" v-if="openLi.index==index&&openLi.i==i">
						<a class="btn-voice" @touchstart.stop="playAudio(v.audio_url, $event)">
							<svg class="icon" aria-hidden="true">
							  <use xlink:href="#icon-icon-voice"></use>
							</svg>
							<span class="icon active img-icon"></span>
						</a>
						<a class="btn-record" @touchstart.stop="record(v, $event)" @touchmove.stop="touchMove($event)" @touchend.stop="stopRecord($event)">
							<svg class="icon" aria-hidden="true">
							  <use xlink:href="#icon-icon-record"></use>
							</svg>
							<view class="btn-record-bg">
								<view class="btn-record-bg-active"></view>
							</view>
						</a>
						<a class="btn-play" @touchstart.stop="playAudio(v.record_url, $event)">
							<svg class="icon" aria-hidden="true">
							  <use xlink:href="#icon-icon-play"></use>
							</svg>
							<svg class="icon active" aria-hidden="true">
							  <use xlink:href="#icon-icon-pause"></use>
							</svg>
						</a>
					</view>
				</view>
				<view class="result-bar" v-if="v.category=='read_sentence'&&v.total_score!=null">
					<view class="score-item">
						准确度：{{v.accuracy_score}}
					</view>
					<view class="score-item">
						完整度：{{v.integrity_score}}
					</view>
					<view class="score-item">
						流利度：{{v.fluency_score}}
					</view>
				</view>
			</uni-list-item>
		</uni-list>
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
				perTitle:'',
				
				model: [],
				isRecording: false,
				valid_touch: false,
				openLi: {index: -1, i: -1},
				key: "",
				isPlaying: false
			}
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title:this.itemData.title
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			this.perTitle = this.getBookNames()||"暂无教材";
			//获取内容
			this.post(this.globaData.INTERFACE_KYCP + '/orals', {
				category: this.itemData.cate, bookCatalogId: this.itemData.catalog_id,index_code:this.itemData.access.split('#')[1]
			}, (res0,res)=> {
				if(res.code==0) {
					this.key = res.data.key;
					this.model.push({
						list: res.data.list
					});
				}else{
					this.showToast(res.msg);
				}
			});
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题			// #ifdef H5				uni.pageScrollTo({					scrollTop: this.scrollLength,					duration: 0				});			// #endif		},		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替			// #ifdef H5				this.scrollLength=e.scrollTop			// #endif		},
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
			//分数格式
			setScore(score){
				return Math.round(score*20);
			},
			toggleOpen: function(index, i) {
				if(this.semFlag2Data.openLi.index == index && this.semFlag2Data.openLi.i == i) {
					this.semFlag2Data.openLi.index = -1;
					this.semFlag2Data.openLi.i = -1;
				} else {
					this.semFlag2Data.openLi.index = index;
					this.semFlag2Data.openLi.i = i;
				}
			},
			//获取教材名
			getBookNames() {
				var orals_menu = util.getStore("orals_menu");
				return orals_menu.name || "";
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
