<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<uni-row>
				<uni-col :span="8">
					<picker class="flex-box" @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="grdArray[grdIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="clsArray[clsIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="kmClick" :value="kmIndex" :range="kmArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="kmArray[kmIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
			</uni-row>
			<view class="line-green" style="margin-left: -3px;"></view>
		</view>
		<view>
			<view style="margin-top: 40px;">
				<uni-list :border="false">
					<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata1" :border="true">
						<text slot="body" class="slot-box slot-text" @click="toDetails(item)">
							<uni-row>
								<uni-col :span="24" style="display: flex;align-items: center;">
									<uni-col :span="4"><view class="ant-avatar ant-avatar-lg" style="float: left;background-color: rgb(255, 191, 0);vertical-align: middle;">{{item.exam_type_name}}</view></uni-col>
									<uni-col :span="20"><view class="biaoti">{{item.name}}</view></uni-col>
								</uni-col>
								<uni-col :span="24" style="display: flex;align-items: center;">
									<uni-col :span="6"><view style="text-align: center;"><view class="detail-text">{{item.stu_count}}</view><view class="detail-text-ms">参考人数</view></view></uni-col>
									<uni-col :span="5"><view style="text-align: center;"><view class="detail-text">{{item.avg_score}}</view><view class="detail-text-ms">总均分</view></view></uni-col>
									<uni-col :span="5"><view style="text-align: center;"><view class="detail-text">{{item.level_radio}}%</view><view class="detail-text-ms">优秀率</view></view></uni-col>
									<uni-col :span="7" :offset="1">
										<view style="text-align: left;">
											<view v-if="selectType !='qk'" class="detail-text-ms">试题难度：{{item.dif}}</view>
											<view v-if="item.special_stu_radio!=null" class="detail-text-ms">特优占比：{{item.special_stu_radio}}</view>
											<view class="detail-text-ms">进步人数：{{item.up_num}}</view>
											<view class="detail-text-ms">退步人数：{{item.down_num}}</view>
										</view>
									</uni-col>
								</uni-col>
							</uni-row>
						</text>
					</uni-list-item>
				</uni-list>
				<uni-load-more :status="pageobj1.status" :icon-size="17" :content-text="pageobj1.contentText" />
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				
				pageobj1:{
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
				selectType:'qk',//查询类型 qk 全科考情 dk 单科考情 第一次进入页面默认为qk
				pagedata1:[],
				//顶部筛选框相关内容
				grdIndex:0,
				clsIndex:0,
				kmIndex:0,
				grdArray: [{text:'',value:''}],
				clsArray: [{text:'',value:''}],
				kmArray: [{text:'',value:'-1'}],
			}
		},
		methods: {
			grdClick:function(e){//切换年级班级，仅仅是为了获取科目，与页面数据无关
				if(this.grdIndex!==e.detail.value){
					 this.grdIndex=e.detail.value
					 this.clsIndex=0
					 this.kmIndex=0
					 this.showLoading()
					 this.pageobj1.loadFlag=0
					 this.pageobj1.canload=true
					 this.pageobj1.page_number=1
					 this.getCls();
				}
			},
			clsClick:function(e){//切换年级班级，仅仅是为了获取科目，与页面数据无关
				if(this.clsIndex!==e.detail.value){
					 this.clsIndex=e.detail.value
					 this.kmIndex=0
					 this.showLoading()
					 this.pageobj1.loadFlag=0
					 this.pageobj1.canload=true
					 this.pageobj1.page_number=1
					 this.getKm();
				}
			},
			kmClick:function(e){
				if(this.kmIndex!==e.detail.value){
					if(e.detail.value===0){
						this.selectType='qk'
					}else{
						this.selectType='dk'
					}
					 this.kmIndex=e.detail.value
					 this.showLoading()
					 this.pageobj1.loadFlag=0
					 this.pageobj1.canload=true
					 this.pageobj1.page_number=1
					 this.getList1();
				}
			},
			getGrd(){//获取年级
				let comData={
					op_code:'index',
					get_grd:true,
					all_grd: false,
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
						this.getCls();
					}else{ 
						this.grdArray=[];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls(){//获取班级
				let comData={
					op_code:'index',
					grd_code:this.grdArray[this.grdIndex].value,
					get_cls:true,
					all_cls:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray=[];
					clss.map(function(currentValue) {
						let obj = {};
						let name=currentValue.name.indexOf('全部')==-1?currentValue.name:'全部班级';
						obj.value = currentValue.value;
						obj.text = name;
						clsArray.push(obj)
					})
					if(clsArray.length>0 ){
						this.clsArray=clsArray;
						this.getKm();
					}else{
						this.clsArray=[];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getKm(){//获取科目
				let comData={
					op_code:'index',
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					get_sub:true,
					all_sub:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let list=[];
					if (response.sub_list&&response.sub_list.length>0) {
						if (response.sub_list[0].value=='-1') {
							this.selectType='qk';
							list=[{"value":"","name":"全科考情","stat":1}].concat(response.sub_list);
						} else{
							this.selectType='dk';
							list=[].concat(response.sub_list);
						}
					}
					let kmList=[]
					list.map(function(currentValue){
						 let obj={};
						 obj.value=currentValue.value;
						 obj.text=currentValue.name;
						 if(currentValue.value!='-1'){
							 kmList.push(obj)
						 }
					})
					this.kmArray=kmList
					this.getList1()
				})
			},
			getList1(){//获取页面数据
				let comData={
					grd_code: this.grdArray[this.grdIndex].value, //科目代码
					cls_code: this.clsArray[this.clsIndex].value, //科目代码
					sub_code: this.kmArray[this.kmIndex].value, //科目代码
					page_number: this.pageobj1.page_number, //当前页数
					page_size: 10, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_EXAMINATION+'page',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if(this.pageobj1.loadFlag===0){
						this.pagedata1=[].concat(response.list)
					}else{
						this.pagedata1=this.pagedata1.concat(response.list)
					}
					if(this.pageobj1.page_number>=response.total_page){
						this.pageobj1.status = 'noMore';
						this.pageobj1.canload=false
					}else{
						this.pageobj1.status = 'more';
					}
				})
			},
			toDetails(item){
				console.log("item: " + JSON.stringify(item));
				item.index_code=this.index_code
				item.selectType=this.selectType
				item.cls_code=this.clsArray[this.clsIndex].value
				item.sub_code=this.kmArray[this.kmIndex].value
				util.openwithData('/pages/examination/formDetail',item)
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.title=itemData.name
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				this.showLoading()
				this.getGrd()
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj1.loadFlag=0
			this.pageobj1.canload=true
			this.pageobj1.page_number=1
			this.getList1()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.pageobj1.canload){
				this.pageobj1.loadFlag=1
				this.pageobj1.status = 'loading';
				this.pageobj1.page_number=this.pageobj1.page_number+1
				this.getList1()
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
	
	.uni-flex{
		border-bottom:1px solid rgba(240,240,240,0.4);
		justify-content: space-evenly;
		margin: 0 -5px 0 -3px;
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
	 
	 .title-text{
	 	width: 80vw;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
	 	color: #6C6C6C;
		font-weight: 600;
	 	font-size: 15px;
	 	margin: 3px 0;
	 }
	 
	 .detail-text-ms{
		 color: #A09FA3;
		 font-size: 13px;
		 margin: 3px 0;
	 }
	 
	 .leaveType {
	 	width: 26px;
	 	color: #2A82E4;
	 	padding:0px 3px;
	 	border-radius: 4px; 
	 	border: 1px solid #2A82E4;
	 }
	 .line-green{
	 	background-color: #00CFBD;
	 	height: 2px;
	 }
	 
	 .uni-list::before {
	     height: 0px;
	 }
	 
	 .ant-avatar{
	 	-webkit-box-sizing: border-box;
	 	    box-sizing: border-box;
	 	    margin: 0;
	 	    padding: 0;
	 	    color: rgba(0, 0, 0, 0.65);
	 	    font-size: 14px;
	 	    font-variant: tabular-nums;
	 	    line-height: 1.5;
	 	    list-style: none;
	 	    -webkit-font-feature-settings: 'tnum';
	 	    font-feature-settings: 'tnum';
	 	    position: relative;
	 	    display: inline-block;
	 	    overflow: hidden;
	 	    color: #fff;
	 	    white-space: nowrap;
	 	    text-align: center;
	 	    vertical-align: middle;
	 	    background: #ccc;
	 	    width: 32px;
	 	    height: 32px;
	 	    line-height: 32px;
	 	    border-radius: 50%;
	 }
	 
	 .ant-avatar-lg {
	     width: 40px;
	     height: 40px;
	     line-height: 40px;
	     border-radius: 50%;
	 }
	 .biaoti {
	 	color: #444444;
	 	font-size: 16px;
		font-weight: 400;
	 	white-space:normal;
		word-break: break-all;
	 }
</style>
