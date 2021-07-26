<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		
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
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				items: ['待审批', '已审批', '已发起','抄送本人'],
				current: 0,
				index_code:'',
				personInfo: {},
				add:false,//add按钮权限
				tabBarItem: {},
				
				
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
		components: {
			mynavBar
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
			getList0(){
				let comData={
					keyword: this.pageobj1.keyword,
					page_number: this.pageobj1.page_number,
					page_size: 20,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'notice/page',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if(this.pageobj1.loadFlag===0){
						this.pagedata1=[].concat(response.list)
					}else{
						this.pagedata1=this.pagedata1.concat(response.list)
					}
					if(this.pageobj1.page_number>=response.total_page){
						this.pageobj1.status = 'noMore';
						this.pageobj1.canload=false
					}else{
						this.pageobj1.status = 'more';
					}
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
				})
			},
			getList1(){
				let comData={
					keyword: this.pageobj1.keyword,
					page_number: this.pageobj1.page_number,
					page_size: 20,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'notice/page',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if(this.pageobj1.loadFlag===0){
						this.pagedata1=[].concat(response.list)
					}else{
						this.pagedata1=this.pagedata1.concat(response.list)
					}
					if(this.pageobj1.page_number>=response.total_page){
						this.pageobj1.status = 'noMore';
						this.pageobj1.canload=false
					}else{
						this.pageobj1.status = 'more';
					}
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
				})
			},
			getList2(){
				let comData={
					keyword: this.pageobj1.keyword,
					page_number: this.pageobj1.page_number,
					page_size: 20,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'notice/page',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if(this.pageobj1.loadFlag===0){
						this.pagedata1=[].concat(response.list)
					}else{
						this.pagedata1=this.pagedata1.concat(response.list)
					}
					if(this.pageobj1.page_number>=response.total_page){
						this.pageobj1.status = 'noMore';
						this.pageobj1.canload=false
					}else{
						this.pageobj1.status = 'more';
					}
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
				})
			},
			getList3(){
				let comData={
					keyword: this.pageobj1.keyword,
					page_number: this.pageobj1.page_number,
					page_size: 20,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_UNVEDUSUBAPI+'notice/page',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					if(this.pageobj1.loadFlag===0){
						this.pagedata1=[].concat(response.list)
					}else{
						this.pagedata1=this.pagedata1.concat(response.list)
					}
					if(this.pageobj1.page_number>=response.total_page){
						this.pageobj1.status = 'noMore';
						this.pageobj1.canload=false
					}else{
						this.pageobj1.status = 'more';
					}
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
				})
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
			itemData.index=100
			itemData.title=itemData.name
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getPermissionByPosition('add',this.index_code,result=>{
					 this.add=result[0]
				 })
				 this.getList0()
			},500)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			if(this.current===0){
				this.pageobj0.loadFlag=0
				this.pageobj0.canload=true
				this.pageobj0.page_number=1
				this.getList0()
			}else if(this.current===1){
				this.pageobj1.loadFlag=0
				this.pageobj1.canload=true
				this.pageobj1.page_number=1
				this.getList1()
			}else if(this.current===2){
				this.pageobj2.loadFlag=0
				this.pageobj2.canload=true
				this.pageobj2.page_number=1
				this.getList2()
			}else if(this.current===3){
				this.pageobj3.loadFlag=0
				this.pageobj3.canload=true
				this.pageobj3.page_number=1
				this.getList3()
			}
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.current===0){
				if(this.pageobj0.canload){
					this.pageobj0.loadFlag=1
					this.pageobj0.status = 'loading';
					this.pageobj0.page_number=this.pageobj0.page_number+1
					this.getList0()
				}
			}else if(this.current===1){
				if(this.pageobj1.canload){
					this.pageobj1.loadFlag=1
					this.pageobj1.status = 'loading';
					this.pageobj1.page_number=this.pageobj1.page_number+1
					this.getList1()
				}
			}else if(this.current===2){
				if(this.pageobj2.canload){
					this.pageobj2.loadFlag=1
					this.pageobj2.status = 'loading';
					this.pageobj2.page_number=this.pageobj2.page_number+1
					this.getList2()
				}
			}else if(this.current===3){
				if(this.pageobj3.canload){
					this.pageobj3.loadFlag=1
					this.pageobj3.status = 'loading';
					this.pageobj3.page_number=this.pageobj3.page_number+1
					this.getList3()
				}
			}
		},
		
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
