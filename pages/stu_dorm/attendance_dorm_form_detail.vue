<template>
	<view>
		<view style="padding: 0 15px;">
			<uni-row>
				<uni-col :span="24">
					<view class="detail-text" style="margin-top: 5px;">班级:{{itemData.grd_name}} {{itemData.cls_name}}</view>
				</uni-col>
				<uni-col :span="24">
					<view class="detail-text" style="margin-top: 5px;">时间段:{{itemData.begintime}} ~ {{itemData.endtime}}</view>
				</uni-col>
			</uni-row>
		</view>
		<view class="double-line"></view>
		<view style="padding:5px 15px 0px;">
			<uni-list :border="false">
				<uni-list-item :key="index" v-for="(item,index) in pageArray" :border="false">
					<view slot="body" class="slot-box slot-text">
						<view class="title-text" style="margin-top: 5px;">{{item.name}}({{item.list.length}}次)</view>
						<view class="line" style="margin-top: 5px;"></view>
						<uni-row :key="index2" v-for="(model,index2) in item.list">
							<uni-col :span="24"><view class="detail-text">姓名:{{model.stu_name}}</view></uni-col>
							<uni-col :span="24"><view class="detail-text">床位:{{model.dorm_name}}{{model.floor_num}}层{{model.room_name}}房间{{model.bed_num}}床位</view></uni-col>
							<uni-col :span="24"><view class="detail-text">说明:{{model.remark}}</view></uni-col>
							<uni-col :span="24"><view class="detail-text">日期:{{model.attendance_date}}</view></uni-col>
							<uni-col :span="24" v-if="index2 <item.list.length-1"><view class="line" style="margin-top: 5px;" ></view></uni-col>
						</uni-row>
					</view>
				</uni-list-item>
			</uni-list>
			<view style="height: 20px;"></view>
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
					begintime: this.itemData.begintime,
					endtime: this.itemData.endtime,
					index_code: this.index_code,
					
				}
				this.post(this.globaData.INTERFACE_DORM+'dormAttendance/statisticsDetail',params,response2=>{
					console.log("response2: " + JSON.stringify(response2));
					this.hideLoading()
					let list =this.pageArray
					for (var i = 0; i < response2.list.length; i++) {
						var tempD = response2.list[i];
						var tempS = tempD.key.split('_')[1];
						for (var a = 0; a < list.length; a++) {
							var tempH = list[a];
							if (tempS == tempH.name) {
								tempH.list = [].concat(tempD.list);
							}
						}
					}
					this.pageArray=[].concat(list)
					if (this.pageArray.length == 0) {
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
			let list=[]
			for (var i = 0; i < itemData.subList.length; i++) {
				var tempA = itemData.subList[i];
				tempA.list = [];
				list.push(tempA);
			}
			this.pageArray=list
			console.log(JSON.stringify(list));
			setTimeout(()=>{
				 this.showLoading()
				 this.getPage()
			},100)
			uni.setNavigationBarTitle({title:'报表详情'});
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
		word-break: break-all;
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
