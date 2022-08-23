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
				<uni-col :span="12">
					<view class="detail-text" style="margin-top: 5px;">床位数:{{itemData.bed_nums}}</view>
				</uni-col>
				<uni-col :span="12">
					<view class="detail-text" style="margin-top: 5px;">已住人数:{{itemData.stu_nums}}</view>
				</uni-col>
			</uni-row>
		</view>
		<view class="double-line"></view>
		<view style="padding:5px 15px 0px;">
			<uni-list :border="false">
				<uni-list-item :key="index" v-for="(model,index) in pageArray" :border="true">
					<view slot="body" class="slot-box slot-text">
						<uni-row>
							<uni-col :span="24"><view class="detail-text">姓名:{{model.grd_name}} {{model.cls_name}} {{model.stu_name}}</view></uni-col>
							<uni-col :span="24"><view class="detail-text">床位号:{{model.bed_num}}</view></uni-col>
						</uni-row>
					</view>
				</uni-list-item>
			</uni-list>
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
					dorm_name:this.itemData.dorm_name,
					floor_num:this.itemData.floor_num,
					room_name:this.itemData.room_name,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'classDorm/pageRoomDetail',params,response2=>{
					console.log("response2: " + JSON.stringify(response2));
					this.hideLoading()
					this.pageArray=[].concat(response2.list);
					if (response2.list.length == 0) {
						this.showToast('暂无数据');
					}
				})
			},
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.index_code
			this.itemData=itemData
			console.log(JSON.stringify(itemData));
			setTimeout(()=>{
				 this.showLoading()
				 this.getPage()
			},100)
			uni.setNavigationBarTitle({title:'班级宿舍入住情况'});
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			//#ifdef H5
				document.title=""
			//#endif
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
