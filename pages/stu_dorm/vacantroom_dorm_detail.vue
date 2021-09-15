<template>
	<view>
		<view style="padding: 0 15px;">
			<uni-row>
				<uni-col :span="12">
					<view class="detail-text" style="margin-top: 5px;">{{itemData.dorm_name}} {{itemData.floor_num}}层{{itemData.room_name}}</view>
				</uni-col>
				<uni-col :span="12">
					<view class="detail-text" style="margin-top: 5px;">居住性别:{{itemData.stu_sex_text}}</view>
				</uni-col>
			</uni-row>
		</view>
		<view class="double-line"></view>
		<view style="padding:5px 15px 0px;">
			<view class="title-text" style="margin-top: 5px;">空余房间</view>
			<view class="line" style="margin-top: 5px;"></view>
			<uni-list :border="false">
				<uni-list-item  :key="index" v-for="(model,index) in pageArray" :border="true">
					<text slot="body" class="slot-box slot-text" @click="toDetails(model)">
						<uni-row>
							<uni-col :span="24"><view class="detail-text">房间:{{model.room_name}}</view></uni-col>
							<uni-col :span="24"><view class="detail-text">床位数:{{model.spare_bed_nums}}</view></uni-col>
						</uni-row>
					</text>
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
				grdClsFlag:0,//0不显示，1具体年级全部班级，2具体年级具体班级
			}
		},
		methods: {
			getPage(){
				const params = {
					page_number: 1, //当前页数
					page_size: 9999, //每页记录数
					dorm_name:this.itemData.dorm_name,
					stu_sex:this.itemData.stu_sex,
					floor_num:this.itemData.floor_num,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'classDorm/pageSpareRoomDetail',params,response2=>{
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
			uni.setNavigationBarTitle({title:'空房查询详情'});
			//#ifndef APP-PLUS
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
