<template>
	<view>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			 <uni-row>
				<uni-col :span="8" >
					<picker @change="floorClick" :value="floorIndex" :range="floorArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="floorArray[floorIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
			 </uni-row>
			 <view class="select-line"></view>
		</view>
		 <view class="line-green" style="margin-top: 5px;"></view>
		 <view style="padding:5px 15px;">
		 	 {{pageArray}}
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
				floorIndex:0,
				floorArray: [{text:'全部楼层',value:''}], 
				pageArray:[],
			}
		},
		methods: {
			floorClick(){
				if(this.floorIndex!==e.detail.value){
					 this.floorIndex=e.detail.value
					 this.showLoading()
					 this.getList();
				}
			},
			getFloorList(){
				const params = {
					dorm_name: this.itemData.dorm_name,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dorm/queryFloorByDorm',params,response2=>{
					let floors = response2.list;
					let floorArray = [{text:'全部楼层',value:''}].concat(floors);
					this.floorArray = floorArray;
					this.hideLoading()
				})
			},
			getList(){
				const params = {
					page_number: 1, //当前页数
					page_size: 10000, //每页记录数
					dorm_name:this.itemData.dorm_name,
					floor_num: this.floorArray[this.floorIndex].value,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dorm/dormDetai',params,response2=>{
					console.log("responseaaa: " + JSON.stringify(response2));
					this.hideLoading()
					this.pageArray = [].concat(response2.list);
					if (response2.length == 0) {
						this.showToast('暂无数据');
					}
				})
			},
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.index_code
			this.itemData=itemData
			setTimeout(()=>{
				 this.showLoading()
				 this.getFloorList()
				 this.getList()
			},100)
			uni.setNavigationBarTitle({title:itemData.dorm_name});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>
	::v-deep .uni-list-item__container{
		padding-left: 0 !important;
	}
	.select-line{
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
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
</style>
