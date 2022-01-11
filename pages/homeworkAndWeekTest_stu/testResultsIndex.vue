<template>
	<view>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view style="display: flex;">
				<picker style="flex: 1;"  @change="yearClick" :value="yearIndex" :range="yearArray" range-key="year_name">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="yearIndex>=0?yearArray[yearIndex].year_name:'请选择'" ></uni-easyinput-select>
				</picker>
				<picker style="flex: 1;"  @change="semClick" :value="semIndex" :range="semArray" range-key="term_name">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="semIndex>=0?semArray[semIndex].term_name:'请选择'" ></uni-easyinput-select>
				</picker>
				<picker style="flex: 1;" @change="subClick" :value="subIndex" :range="subArray" range-key="sub_name">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="subArray[subIndex].sub_name" ></uni-easyinput-select>
				</picker>
			</view>
			<view class="select-line"></view>
			<view class="stat">
				<view>作业总次数：{{stat.allcount}}</view>
				<view>已交：{{stat.count}}</view>
				<view>未交：{{stat.miss_count}}</view>
			</view>
		</view>
		 <view style="padding: 0 15px;margin-top: 66px;">
			 <uni-list :border="false">
			 	<uni-list-item :showArrow="item.state=='已交'" clickable @click="toDetails(item)" :key="index" v-for="(item,index) in pagedata" :border="true">
			 		<text slot="body" class="slot-box slot-text" @click.stop="toDetails(item)">
						<view style="display: flex;align-items: center;width: 81vw;">
							<view class="left-title" :class="item.type=='2'?'left-title-zy':item.type=='3'?'left-title-zc':''">{{item.type=='2'?'作业':item.type=='3'?'周测':''}}</view>
							<view style="display: flex;flex-direction: column;margin-left: 8px;flex: 1;">
								<view class="title-text">{{item.name}}</view>
								<view class="detail-text">{{item.create_time}}</view>
							</view>
							<view v-if="item.score !=null" style="width:75px;text-align: right;"><text style="color: #ff6b4b;font-size: 17px;font-weight: 600;margin-right: 3px;">{{item.score}}</text>分</view>
						</view>
			 		</text>
			 	</uni-list-item>
			 </uni-list>
			 <uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
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
				stat:{},//统计数据
				pagedata:[],
				yearIndex:-1,
				semIndex:-1,
				subIndex:0,
				yearArray:[{year_code:'',year_name:''}],//学年列表
				semArray:[{term_code:'',term_name:''}],//学期列表
				subArray:[{sub_code:'',sub_name:''}],//科目列表
			}
		},
		methods: {
			getYear(){//获取学年
				const params = {
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'year',params,response=>{
					 console.log("response: " + JSON.stringify(response));
					 this.yearArray=response.list
				})
			},
			getSemester(){//获取学期
				const params = {
					page_number: -1,
					page_size: 1,
					index_code: this.index_code, 
				}
				this.post(this.globaData.INTERFACE_BASESUB+'SysTermP',params,response=>{
					 console.log("response: " + JSON.stringify(response));
					 this.semArray=response.list
				})
			},
			getSubList(){//获取科目
				return new Promise((resolve,reject)=>{
					const params = {
						index_code: this.index_code, 
					}
					this.post(this.globaData.INTERFACE_HR_SUB+'sub',params,response=>{
						 console.log("response: " + JSON.stringify(response));
						 this.subList=response.list
						 if(response.list.length>0){
							 this.subArray=response.list
							resolve()
						 }else{
							this.showToast('获取科目列表为空') 
						 }
					})
					
				})
			},
			getTurnSituation(){//获取统计数据
				 const params = {
					grd_code:this.personInfo.grd_code,
					cls_code:this.personInfo.cls_code,
					stu_code:this.personInfo.stu_code,
					stu_name:this.personInfo.stu_name,
					sub_code:this.subList[0].sub_code,
				 	index_code: this.index_code, 
				 }
				 if(this.yearIndex>=0){
				 	params.year_code=this.yearArray[this.yearIndex].year_code
				 }
				 if(this.semIndex>=0){
				 	params.term_code=this.semArray[this.semIndex].term_code
				 }
				 this.post(this.globaData.INTERFACE_MARKINGPAPERS+'stuAnalysis/turnSituation',params,response=>{
				 	 console.log("response: " + JSON.stringify(response));
					 this.stat={allcount:parseInt(response.miss_count)+parseInt(response.count),miss_count:response.miss_count,count:response.count}
				 })
			},
			getList(){//获取年级
				const params = {
					page_number:this.pageobj0.page_number,
					page_size:this.pageSize,
					grd_code:this.personInfo.grd_code,
					cls_code:this.personInfo.cls_code,
					stu_code:this.personInfo.stu_code,
					stu_name:this.personInfo.stu_name,
					sub_code:this.subList[0].sub_code,
					index_code: this.index_code,
				}
				if(this.yearIndex>=0){
					params.year_code=this.yearArray[this.yearIndex].year_code
				}
				if(this.semIndex>=0){
					params.term_code=this.semArray[this.semIndex].term_code
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS+'stuAnalysis/page',params,response=>{
					console.log("response: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
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
				console.log("item: " + JSON.stringify(item));
				if(item.state=='已交'){
					item.index_code=this.index_code
					util.openwithData('/pages/homeworkAndWeekTest_stu/testResultsDetail',item,{})
				}
			},
			yearClick(){
				if(this.yearIndex!==e.detail.value){
					 this.yearIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList();
				}
			},
			semClick(){
				if(this.semIndex!==e.detail.value){
					 this.semIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList();
				}
			},
			subClick(){
				if(this.subIndex!==e.detail.value){
					 this.subIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList();
				}
			}
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.access.split('#')[1]
			this.personInfo = util.getPersonal();
			this.itemData=itemData
			setTimeout(async ()=>{
				 this.showLoading()
				 this.getYear()
				 this.getSemester()
				 await this.getSubList()
				 this.getTurnSituation()
				 this.getList()
			},100)
			uni.setNavigationBarTitle({title:itemData.text});
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
		onPullDownRefresh() {
			this.pageobj0.loadFlag=0
			this.pageobj0.canload=true
			this.pageobj0.page_number=1
			this.getList()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.pageobj0.canload){
				this.pageobj0.loadFlag=1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number=this.pageobj0.page_number+1
				this.getList()
			}
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
		word-break: break-all;
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
		height: 1px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}
	.left-title{
		width: 45px;
		height: 45px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		font-weight: 600;
	}
	.left-title-zy{
		border: 1px solid #5bd58c;
		color: #5bd58c;
	}
	.left-title-zc{
		border: 1px solid #4acec5;
		color: #4acec5;
	}
	
	.stat{
		display: flex;
		font-size: 13px;
		color: #808080;
		padding: 5px 15px;
		justify-content: space-around;
		background-color: #f5f3f3;
	}
</style>
