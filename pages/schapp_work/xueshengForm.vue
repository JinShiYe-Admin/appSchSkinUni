<template>
	<view>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view style="display: flex;">
				<picker style="flex: 1;"  @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
					<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
						{{grdArray[grdIndex].text}}
						<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</picker>
				<view class="mini-date" style="flex: 1;">
					<dy-Date :childValue='begintime' timeType="day" v-on:getData='beginTimeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
					<view style="font-size: 13px;color: #C6CAD1;"> ~ </view>
				</view>
				<view class="mini-date" style="flex: 1;">
					<dy-Date :childValue='endtime' timeType="day" v-on:getData='endTimeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
					<uni-icons style="padding-right: 3px;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
				</view>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 40px;">
			<uni-list :border="false">
				<uni-list-item :border="true">
					<view slot="body" class="slot-box slot-text">
						<uni-row>
							<uni-col :span="24"><view class="title-text-total">{{listTotal.row_name}}</view></uni-col>
							<template v-for="(item,index) in listTotal.kqxxList">
								<uni-col :key="index" :span="8"><view class="detail-text">{{item.name}}:{{item.value}} 次</view></uni-col>
							</template>
						</uni-row>
					</view>
				</uni-list-item>
			</uni-list>
			<view v-if="listTotal.kqxxList" class="double-line"></view>
			<uni-list :border="false">
				<uni-list-item  :key="index" v-for="(model,index) in pagedata" :border="true">
					<view slot="body" class="slot-box slot-text">
						<uni-row>
							<uni-col :span="24"><view class="title-text">{{model.grd_name}}&ensp;{{model.cls_name}}&ensp;{{model.stu_name}}{{model.sno!=null&&model.sno.length>0?'（'+model.sno+'）':''}}</view></uni-col>
							<template v-for="(item,index2) in model.kqxxList">
								<uni-col :key="index2"  :span="8"><view class="detail-text">{{item.name}}:{{item.value}} 次</view></uni-col>
							</template>
						</uni-row>
					</view>
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
				pagedata:[],
				listTotal:{},//统计数据
				//顶部筛选框相关内容
				grdIndex:0,
				begintime:this.moment().format('YYYY-MM-DD'),
				endtime:this.moment().format('YYYY-MM-DD'),
				grdArray: [{text:'',value:'-1'}],
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD')
			}
		},
		methods: {
			grdClick:function(e){
				if(this.grdIndex!==e.detail.value){
					 this.grdIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			beginTimeSelect(e){
				if(this.endtime){
					if(this.moment(this.endtime).diff(e,'days')>=0){
						this.begintime=e
						this.showLoading()
						this.pageobj0.loadFlag=0
						this.pageobj0.canload=true
						this.pageobj0.page_number=1
						this.getList0();
					}else{
						this.showToast('开始时间不能晚于结束时间')
						this.begintime=this.endtime
					}
				}else{
					this.begintime=e
				}
			},
			endTimeSelect(e){
				if(this.begintime){
					if(this.moment(e).diff(this.begintime,'days')>=0){
						this.endtime=e
						this.showLoading()
						this.pageobj0.loadFlag=0
						this.pageobj0.canload=true
						this.pageobj0.page_number=1
						this.getList0();
					}else{
						this.showToast('结束时间不能早于开始时间')
						this.endtime=this.begintime
					}
				}else{
					this.endtime=e
				}
			},
			getGrd(){//获取年级
				let comData={
					op_code:'index',
					get_grd:true,
					all_grd: true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray=[];
					grds.map(function(currentValue) {
						let name=currentValue.name.indexOf('全部')==-1?currentValue.name:'全部年级';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						grdArray.push(obj)
					})
					if(grdArray.length>0 ){
						this.grdArray=grdArray;
						this.getList0()
					}else{ 
						this.grdArray=[];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getList0(){//获取页面数据
				let comData={
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: '0',
					begintime: this.begintime,
					endtime:this.endtime,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'AttendanceReport/statisticsStudentAttendance',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if(this.pageobj0.loadFlag===0){
						this.addKqName(response.qaArray,response.staticArray,list=>{
							this.pagedata=[].concat(list);
						})
						if(response.total.row_name){
							this.addKqName(response.qaArray,[response.total],list=>{
								if(list.length>0){
									this.listTotal=list[0];
								}
							})
						}
					}else{
						//合并数组
						this.addKqName(response.qaArray,response.staticArray,list=>{
							this.pagedata= this.pagedata.concat(list);
						})
						if(response.total.row_name){
							this.addKqName(response.qaArray,[response.total],list=>{
								if(list.length>0){
									this.listTotal=list[0];
								}
							})
						}
					}
					if(this.pageobj0.page_number>=response.total_page){
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload=false
					}else{
						this.pageobj0.status = 'more';
					}
				})
			},
			addKqName(qaList,list,callback){
				list.map(function(currValue){
					let _list=[]
					qaList.map(function(currValue2){
						let kqValue=currValue2.value;
						if(""+currValue[kqValue]){
							let obj={}
							obj.name=currValue2.text;
							obj.value=currValue[kqValue];
							_list.push(obj)
						}
					})
					currValue.kqxxList=_list;
				})
				console.log("list: " + JSON.stringify(list));
				callback(list)
			}
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getGrd()
			},100)
			uni.setNavigationBarTitle({title:itemData.text});
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj0.loadFlag=0
			this.pageobj0.canload=true
			this.pageobj0.page_number=1
			this.getList0()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.pageobj0.canload){
				this.pageobj0.loadFlag=1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number=this.pageobj0.page_number+1
				this.getList0()
			}
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
	 
	 .title-text-total{
		 display: flex;
		 align-items: center;
	 	width: 80vw;
		font-size: 16px;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 .title-text{
		 display: flex;
		 align-items: center;
	 	width: 80vw;
		color: #5C5C5C;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
	 	color: #939393;
	 	font-size: 13px;
	 	margin: 3px 0;
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
	 .double-line{
	 	height: 5px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
</style>
