<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#00cfbd" @clickItem="onClickItem" />
		</view>
		<view class="content">
			<view v-if="current === 0">
				0
			</view>
			<view v-if="current === 1">
				1
			</view>
			<view v-if="current === 2">
				2
			</view>
			<view v-if="current === 3">
				3
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				items: ['待审批', '已审批', '已发起','抄送本人'],
				current: 0,
				index_code:'',
				personInfo: {},
				
				
				pageobj0:{
					keyword:'',
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
				pageobj1:{
					keyword:'',
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
				pageobj2:{
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
				pageobj3:{
					keyword:'',
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
				pagedata0:[],
				pagedata1:[],
				pagedata2:[],
				pagedata3:[],
			}
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
				if(this.current===0){
					if(this.pagedata0.length===0){
					 	// this.showLoading()
					 	// this.pageobj1.loadFlag=0
					 	// this.pageobj1.canload=true
					 	// this.pageobj1.page_number=1
					 	// this.getList1()
					}
				}else if(this.current===1){
					if(this.pagedata1.length===0){
						// this.showLoading()
						// this.pageobj1.loadFlag=0
						// this.pageobj1.canload=true
						// this.pageobj1.page_number=1
						// this.getList1()
					}
				}else if(this.current===2){
					if(this.pagedata2.length===0){
						// this.showLoading()
						// this.pageobj2.loadFlag=0
						// this.pageobj2.canload=true
						// this.pageobj2.page_number=1
						// this.getList2()
					}
				}else if(this.current===3){
					if(this.pagedata3.length===0){
						// this.showLoading()
						// this.pageobj2.loadFlag=0
						// this.pageobj2.canload=true
						// this.pageobj2.page_number=1
						// this.getList2()
					}
				}
			},
			
		},
		onNavigationBarButtonTap(e) {
			uni.showToast({
				title: e.index === 0 ? "你点了分享按钮" : "你点了收藏按钮",
				icon: "none"
			})
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			uni.setNavigationBarTitle({title: itemData.name})
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 
			},500)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		}
	}
</script>

<style>
	.uni-common-mt {
	    margin-top: 10px;
	}
	.uni-padding-wrap {
		padding: 0 5px;
	}
</style>
