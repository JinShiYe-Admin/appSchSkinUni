<template>
	<view>
		<view class="tabs-fixed">
			 <view class="search-box">
				 <view class="uni-input-wrapper">
				    <input class="uni-input search-input" placeholder="输入名称或编号进行搜索" v-model="searchValue" @input="inputChange"/>
				 </view>
				 <button class="search-button" @click="search"><uni-icons type="search" color="#FFFFFF" size="17" /></button> 
			 </view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<uni-list :border="false">
				<uni-list-item showArrow clickable @click="toDetails(model)" :key="index" v-for="(model,index) in pagedata" :border="true">
					<text slot="body" class="slot-box slot-text" @click.stop="toDetails(model)">
						<uni-row>
							<uni-col :span="24"><view class="title-text">{{model.itemName}}(编号:{{model.itemCode}})</view></uni-col>
							<uni-col :span="12"><view class="detail-text">型号:{{model.itemType}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text">库存:{{model.okNum}}</view></uni-col>
						</uni-row>
					</text>
				</uni-list-item>
			</uni-list>
			<template v-if="pagedata.length===0">
				<view class="empty-list-trip">暂无数据</view>
			</template>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				searchValue:'',
				pagedata:[],
			}
		},
		methods: {
			toDetails(item){
				 util.openwithData('/pages/schapp_item/item_select_detail',{index_code:this.index_code,item:item},{})
			},
			inputChange(e){
				if(e.target.value==''){
					this.searchValue=''
					this.showLoading()
					this.getList0();
				}
			},
			search(){
				if(this.searchValue==''){
					this.showToast('请先输入搜索内容')
				}else{
					this.showLoading()
					this.getList0();
				}
			}, 
			getList0(){//获取页面数据
				let comData={
					itemCodeName:this.searchValue,
					op_code:'index',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ITEM+'query/getInventory4App',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if(response!=null){
						this.pagedata=[].concat(response.list)
					}else{
						this.pagedata=[]
						this.showToast('暂无数据')
					}
				})
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getList0();
			},100)
			uni.setNavigationBarTitle({title:'库存查询'});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>
	.select-line{
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}
	 .slot-box {
	 	/* #ifndef APP-NVUE */
	 	display: flex;
	 	/* #endif */
	 	flex-direction: row;
	 	align-items: center;
	 }
	 
	 .content{
	 	margin: 2px 0;
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
	 
	 .title-text{
		 display: flex;
		 align-items: center;
	 	width: 80vw;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
		word-break: break-all;
	 }
	 
	 .leaveType {
		 font-size:12px ;
	 	width: 48px;
	 	color: #EFAD44;
	 	padding:0px 3px;
	 	border-radius: 4px;
		margin-right: 3px;
	 	border: 1px solid #EFAD44;
	 }
	 
	 .uni-input-input{
		 font-size: 13px;
	 }
</style>
