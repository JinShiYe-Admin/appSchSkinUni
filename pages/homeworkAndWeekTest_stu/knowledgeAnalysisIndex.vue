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
		</view>
		 <view style="padding:38px 0 15px;">
			 <uni-card title="薄弱知识点榜" isShadow>
				<view class="content-box-text">
					<uni-list v-if="bad_list.length>0" :border="false">
						<uni-list-item showArrow clickable @click="toDetails(item)" :key="index" v-for="(item,index) in bad_list" :border="true">
							<text slot="body" class="slot-box slot-text" @click.stop="toDetails(item)">
								<view style="display: flex;align-items: center;width: 81vw;">
									<view class="left-title">{{index+1}}</view>
									<view style="display: flex;flex-direction: column;margin-left: 8px;flex: 1;">
										<view class="detail-text-good">{{item.knowledge_name}}</view>
									</view>
								</view>
							</text>
						</uni-list-item>
					</uni-list>
					<view style="margin-left: 15px;font-size: 13px;" v-else>暂无数据</view>
				</view>
			 </uni-card>
			 <uni-card title="牢固知识点榜" isShadow>
				<view class="content-box-text">
					<uni-list v-if="good_list.length>0" :border="false">
						<uni-list-item showArrow clickable @click="toDetails(item)" :key="index" v-for="(item,index) in good_list" :border="true">
							<view slot="body" class="slot-box slot-text" @click.stop="toDetails(item)">
								<view style="display: flex;align-items: center;width: 81vw;">
									<view class="left-title">{{index+1}}</view>
									<view style="display: flex;flex-direction: column;margin-left: 8px;flex: 1;">
										<view class="detail-text-bad">{{item.knowledge_name}}</view>
									</view>
								</view>
							</view>
						</uni-list-item>
					</uni-list>
					<view style="margin-left: 15px;font-size: 13px;" v-else>暂无数据</view>
				</view>
			 </uni-card>
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
				good_list:[],
				bad_list:[],
				yearIndex:0,
				semIndex:0,
				subIndex:0,
				yearArray:[{year_code:'',year_name:'全部学年'}],//学年列表
				semArray:[{term_code:'',term_name:'全部学期'}],//学期列表
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
					 this.yearArray=[{year_code:'',year_name:'全部学年'}].concat(response.list)
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
					 this.semArray=[{term_code:'',term_name:'全部学期'}].concat(response.list)
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
			getTurnSituation(){//获取知识点分析数据
				 const params = {
					grd_code:this.personInfo.grd_code,
					cls_code:this.personInfo.cls_code,
					stu_code:this.personInfo.stu_code,
					sub_code:this.subList[this.subIndex].sub_code,
				 	index_code: this.index_code, 
				 }
				 if(this.yearIndex>0){
				 	params.year_code=this.yearArray[this.yearIndex].year_code
				 }
				 if(this.semIndex>0){
				 	params.term_code=this.semArray[this.semIndex].term_code
				 }
				 this.post(this.globaData.INTERFACE_MARKINGPAPERS+'stuAnalysis/knowledgeAnalysis',params,response=>{
				 	 console.log("response: " + JSON.stringify(response));
					 this.good_list=response.good_list
					 this.bad_list=response.bad_list
				 })
			},
			toDetails(item){
				console.log("item: " + JSON.stringify(item));
				if(item.paper_question_number.split(',').length>0){
					item.index_code=this.index_code
					item.text=this.itemData.text
					util.openwithData('/pages/homeworkAndWeekTest_stu/knowledgeAnalysisDetail',item,{})
				}else{
					this.showToast('暂无相关试题！')
				}
			},
			yearClick(e){
				if(this.yearIndex!==e.detail.value){
					 this.yearIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getTurnSituation()
				}
			},
			semClick(e){
				if(this.semIndex!==e.detail.value){
					 this.semIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getTurnSituation()
				}
			},
			subClick(e){
				if(this.subIndex!==e.detail.value){
					 this.subIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getTurnSituation()
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
			},100)
			uni.setNavigationBarTitle({title:itemData.text});
			//#ifdef H5
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
				//#ifdef H5
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
		padding:3px 5px !important;
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
	 
	 .title-text{
		display: flex;
		align-items: center;
		color: #5C5C5C;
		font-size: 14px;
	 	word-break: break-all;
	 }
	 .title-text{
		font-weight: 600;
	 }
	 .detail-text-good{
	 	color: #ff8d64;
	 	font-size: 13px;
	 	margin: 3px 0;
		word-break: break-all;
		line-height: 2;
		text-align: center;
	 }
	 .detail-text-bad{
	 	color: #00baad;
	 	font-size: 13px;
	 	margin: 3px 0;
		word-break: break-all;
		line-height: 2;
		text-align: center;
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
		width: 25px;
		height: 25px;
		font-size: 13px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	
	
	::v-deep .uni-card__header-title-text{
		font-size: 14px;
	}
	.content-box-text{
		font-size: 14px;
	}
	::v-deep .uni-card__content--pd{
		padding: 3px;
	}
</style>
