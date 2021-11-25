<template>
	<view>
		<view style="padding: 0 15px;">
			<uni-row>
				<uni-col :span="12">
					<view class="detail-text" style="margin-top: 5px;">楼房:{{itemData.dorm_name}}</view>
				</uni-col>
				<uni-col :span="12">
					<view class="detail-text" style="margin-top: 5px;">居住性别:{{itemData.stu_sex_text}}</view>
				</uni-col>
				<uni-col v-if="grdClsFlag>0" :span="12">
					<view class="detail-text" style="margin-top: 5px;">班级:{{itemData.grd_name}}{{itemData.cls_name}}</view>
				</uni-col>
			</uni-row>
		</view>
		<view class="double-line"></view>
		<view style="padding:5px 15px 0px;">
			<uni-list :border="false">
				<uni-list-item :key="index" v-for="(item,index) in pageArray" :border="true">
					<text slot="body" class="slot-box slot-text">
						<view class="title-text" style="margin-top: 5px;">{{item.floor}}</view>
						<view class="line" style="margin-top: 5px;"></view>
						<uni-row :key="index+Math.random()" v-for="(model,index) in item.list">
							<uni-col :span="24"><view class="detail-text">房间:{{model.room_name}}</view></uni-col>
							<uni-col v-if="grdClsFlag<2" :span="24"><view class="detail-text">分配班级:{{model.cls_name}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text">总床位数:{{model.bed_nums}}</view></uni-col>
							<uni-col :span="12"><view class="detail-text">空余床位数:{{model.spare_bed_nums}}</view></uni-col>
							<uni-col :span="24" v-if="index<item.list.length-1"><view class="line" style="margin-top: 5px;"></view></uni-col>
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
					grd_code:this.itemData.grd_code,
					cls_code:this.itemData.cls_code,
					dorm_name:this.itemData.dorm_name,
					stu_sex:this.itemData.stu_sex,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'stuDorm/pageSpareBedNumsDetail',params,response2=>{
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
			if(itemData.grd_code == '-1'&&itemData.cls_code == '-1'){
				this.grdClsFlag = 0;
			}
			if(itemData.grd_code != '-1'&&itemData.cls_code == '-1'){
				this.grdClsFlag = 1;
			}
			if(itemData.grd_code != '-1'&&itemData.cls_code != '-1'){
				this.grdClsFlag = 2;
			}
			setTimeout(()=>{
				 this.showLoading()
				 this.getPage()
			},100)
			uni.setNavigationBarTitle({title:'空床查询详情'});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
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
