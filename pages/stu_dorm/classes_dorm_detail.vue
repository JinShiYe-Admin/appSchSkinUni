<template>
	<view>
		<view style="padding: 0 15px;">
			<uni-row>
				<uni-col :span="12">
					<view class="detail-text" style="margin-top: 5px;">班级:{{itemData.grd_name}} {{itemData.cls_name}}</view>
				</uni-col>
				<uni-col :span="12">
					<view class="detail-text" style="margin-top: 5px;">居住性别:{{itemData.stu_sex_text}}</view>
				</uni-col>
			</uni-row>
		</view>
		<template v-for="item in pageArray">
			<view :key='item.floor+Math.random()'  class="double-line" style="margin-top: 5px;"></view>
			<view :key='item.floor+Math.random()'  style="padding: 0 15px;">
				<view class="title-text" style="margin-top: 5px;">{{item.floor}}</view>
				<view class="line" style="margin-top: 5px;"></view>
				<uni-list :border="false">
					<uni-list-item showArrow clickable @click="toDetails(item,model)" :key="index" v-for="(model,index) in item.list" :border="true">
						<text slot="body" class="slot-box slot-text" @click.stop="toDetails(item,model)">
							<uni-row>
								<uni-col :span="12"><view class="detail-text">房间号:{{model.room_name}}</view></uni-col>
								<uni-col :span="12"><view class="detail-text">床位数:{{model.bed_nums}}</view></uni-col>
								<uni-col :span="24"><view class="detail-text">已住数:{{model.stu_nums}}</view></uni-col>
							</uni-row>
						</text>
					</uni-list-item>
				</uni-list>
			</view>
		</template>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				itemData: {},
				pageArray:[],
			}
		},
		methods: {
			getPage(){
				const params = {
					page_size:999,
					page_number:1,
					grd_code:this.itemData.grd_code,
					cls_code:this.itemData.cls_code,
					stu_sex:this.itemData.stu_sex,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'classDorm/pageClsDetail',params,response2=>{
					console.log("response2: " + JSON.stringify(response2));
					this.hideLoading()
					this.pageArray=[].concat(response2.list);
					if (response2.list.length == 0) {
						this.showToast('暂无数据');
					}
				})
			},
			toDetails(model,item){
				item.index_code=this.index_code
				item.grd_code=this.itemData.grd_code;
				item.cls_code=this.itemData.cls_code;
				item.grd_name=this.itemData.grd_name;
				item.cls_name=this.itemData.cls_name;
				item.stu_sex_text=this.itemData.stu_sex_text; 
				item.floor = model.floor;
				util.openwithData('/pages/stu_dorm/classes_dorm_stay',item,{})
			}
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.index_code
			this.itemData=itemData
			console.log(itemData);
			setTimeout(()=>{
				 this.showLoading()
				 this.getPage()
			},100)
			uni.setNavigationBarTitle({title:'班级宿舍详情'});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
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
		padding: 0 !important;
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
