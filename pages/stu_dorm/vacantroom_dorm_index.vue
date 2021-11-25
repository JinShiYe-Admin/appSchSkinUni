<template>
	<view>
		<view class="tabs-fixed">
			<uni-row>
				<uni-col :span="12">
					<picker class="flex-box" @change="dormClick" :value="dormIndex" :range="dormArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="dormArray[dormIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="12">
					<picker class="flex-box" @change="floorClick" :value="floorIndex" :range="floorArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="floorArray[floorIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding:44px 15px 0px;">
			<view v-if="total" class="title-text" style="margin-top: 5px;">{{total.dorm_name}}</view>
			<uni-row v-if="total">
				<uni-col :span='12'><view class="detail-text" style="margin-top: 5px;">空余房间数:{{total.spare_room_nums}}</view></uni-col>
				<uni-col :span='12'><view class="detail-text" style="margin-top: 5px;">空余床位数:{{total.spare_bed_nums}}</view></uni-col>
			</uni-row>
			<view v-if="total" class="double-line" style="margin: 0 -15px;"></view>
			<uni-list :border="false">
				<uni-list-item showArrow clickable @click="toDetails(item)" :key="index" v-for="(item,index) in pagedata" :border="true">
					<text slot="body" class="slot-box slot-text" @click.stop="toDetails(item)">
						<uni-row>
							<uni-col :span="12"><view class="detail-text">楼房:{{item.dorm_name}} {{item.floor_num}}层</view></uni-col>
							<uni-col :span="12"><view class="detail-text">居住性别:{{item.stu_sex_text}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text">空余房间数:{{item.spare_room_nums}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text">空余床位数:{{item.spare_bed_nums}}</view></uni-col>
						</uni-row>
					</text>
				</uni-list-item>
			</uni-list>
			<view v-if="!total">
				<view class="detail-text" style="text-align: center;">暂无数据</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				itemData: {},
				total:'',
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
				pagedata:[],
				//顶部筛选框相关内容
				dormIndex:0,
				floorIndex:0,
				dormArray: [{text:'',value:''}],
				floorArray: [{text:'全部楼层',value:''}],
			}
		},
		methods: {
			dormClick:function(e){
				if(this.grdIndex!==e.detail.value){
					 this.dormIndex=e.detail.value
					 this.floorIndex=0
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getFloor();
				}
			},
			floorClick:function(e){
				if(this.floorIndex!==e.detail.value){
					 this.floorIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			getDorm(){//宿舍
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dorm/queryDorm',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let list =response.list
					if(list.length>0){
						 this.build_floor_list=list
						 let buildingList=[]
						 list.map(function(item){
							 let obj={}
							 obj.text=item.text,
							 obj.value=item.value,
							 buildingList.push(obj)
						 })
						 this.dormArray=buildingList;
						 this.getFloor()
					}else{
						 this.showToast('无法获取楼号数据');
					}
				})
			},
			getFloor(){//获取楼层
				let list=this.build_floor_list
				let floorList=[]
				let building=this.dormArray[this.dormIndex].value
				list.map(function(item){
					  if(building==item.value){
						  let array=item.floor_array
						  array.map(function(item){
							  if((item.text+'').indexOf('层')==-1){
								  item.text=item.text+'层'
							  }
						  })
						  floorList=[{text:'全部楼层',value:''}].concat(array)
					  }
				})
				this.floorArray=floorList
				this.getList0()
			},
			getList0(){//获取页面数据
				let comData={
					dorm_name: this.dormArray[this.dormIndex].value,
					floor_num: this.floorArray[this.floorIndex].value,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'classDorm/pageSpareRoom',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					this.total=response.total
					if(this.pageobj0.loadFlag===0){
						this.pagedata=[].concat(response.list)
					}else{
						this.pagedata=this.pagedata.concat(response.list)
					}
					if(this.pageobj0.page_number>=response.total_page){
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload=false
					}else{
						this.pageobj0.status = 'more';
					}
				})
			},
			toDetails(item){
				item.index_code=this.index_code
				console.log("item: " + JSON.stringify(item));
				util.openwithData('/pages/stu_dorm/vacantroom_dorm_detail',item,{})
			}
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.access.split('#')[1]
			this.itemData=itemData
			setTimeout(()=>{
				 this.showLoading()
				 this.getDorm()
			},100)
			uni.setNavigationBarTitle({title:itemData.text});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj0.loadFlag=0
			this.pageobj0.canload=true
			this.pageobj0.page_number=1
			this.getList0()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.pageobj0.canload){
				this.pageobj0.loadFlag=1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number=this.pageobj0.page_number+1
				this.getList0()
			}
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
		},
	}
</script>

<style>
	::v-deep .uni-list-item__container{
		padding-left: 0 !important;
	}
	.center{
		text-align: center;
	}
	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
	}
	
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .title-text,.title-text2{
		display: flex;
		align-items: center;
		color: #5C5C5C;
		font-size: 14px;
	 	word-break: break-all;
	 }
	 .title-text{
		font-weight: 600;
	 }
	 .detail-text{
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
		line-height: 2;
	 }
	 .line-green{
	 	background-color: #00CFBD;
	 	margin-bottom: 0.3125rem;
	 	height: 1px;
	 }
	 .double-line{
	 	height: 5px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	}
	.select-line{
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}
</style>
