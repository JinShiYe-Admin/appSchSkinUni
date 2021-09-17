<template>
	<view>
		<view style="padding: 0 15px;">
			<uni-row>
				<uni-col :span="24">
					<view class="detail-text" style="margin-top: 5px;">班级:{{itemData.grd_name}} {{itemData.cls_name}}</view>
				</uni-col>
				<uni-col :span="24">
					<view class="detail-text" style="margin-top: 5px;">时间段:{{itemData.begintime}} 至 {{itemData.endtime}}</view>
				</uni-col>
				<uni-col :span="24">
					<view class="detail-text" style="margin-top: 5px;">宿舍总得分:{{itemData.total_score}}</view>
				</uni-col>
			</uni-row>
		</view>
		<view class="double-line"></view>
		<view style="padding:5px 15px 0px;">
			<uni-list :border="false">
				<uni-list-item  :key="index" v-for="(model,index) in pageArray" :border="true">
					<text slot="body" class="slot-box slot-text" >
						<uni-row>
							<uni-col :span="12"><view class="detail-text">房间:{{model.dorm_name}}{{model.floor_num}}层{{model.room_name}}房间</view></uni-col>
							<uni-col :span="12"><view class="detail-text">居住性别:{{model.stu_sex_text}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text">考评得分:{{model.total_score}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text">称号:{{model.grade_name}}</view></uni-col>
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
			}
		},
		methods: {
			getPage(){
				const params = {
					page_number: 1, //当前页数
					page_size: 9999, //每页记录数
					grd_code: this.itemData.grd_code,
					cls_code: this.itemData.cls_code,
					begintime: this.itemData.begintime,
					endtime: this.itemData.endtime,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dormEvaluation/detail',params,response2=>{
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
			uni.setNavigationBarTitle({title:'报表详情'});
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
