<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' text="点名添加" :textClick="textClick"></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view style="display: flex;">
				<picker style="flex: 1;"  @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="grdArray[grdIndex].text" ></uni-easyinput-select>
				</picker>
				<picker style="flex: 1;"  @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="clsArray[clsIndex].text" ></uni-easyinput-select>
				</picker>
				<view class="mini-date" style="flex: 1;">
					<dy-Date :childValue='endDate' timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
					<uni-icons style="padding-right: 3px;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
				</view>
				<picker style="flex: 1;" @change="kmClick" :value="kmIndex" :range="kmArray" range-key="text">
					<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="kmArray[kmIndex].text" ></uni-easyinput-select>
				</picker>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<uni-list :border="false">
				<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata" :border="true" @click="toDetails(item)">
					<text slot="body" class="slot-box slot-text" @click="toDetails(item)">
						<uni-row>
							<uni-col :span="24"><view class="title-text">{{item.grd_name}} {{item.class_name}}&ensp;{{item.stu_name}}</view></uni-col>
							<uni-col :span="24"><view class="detail-text">星期{{item.day_week}}&ensp;{{item.class_node}}&ensp;{{item.sub_name}}</view></uni-col>
							<uni-col :span="24"><view class="detail-text">考勤项目:{{item.item_txt}}</view></uni-col>
							<uni-col :span="24"><view class="detail-text">说明:{{item.comment}}</view></uni-col>
							<uni-col :span="24"><view class="detail-text">记录人:{{item.create_user_name}}</view></uni-col>
						</uni-row>
					</text>
				</uni-list-item>
			</uni-list>
			<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
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
				icon:'',
				add:false,//add按钮权限
				tabBarItem: {},
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
				//顶部筛选框相关内容
				grdIndex:0,
				clsIndex:0,
				kmIndex:0,
				time:this.moment().format('YYYY-MM-DD'),
				grdArray: [{text:'',value:'-1'}],
				clsArray: [{text:'',value:'-1'}],
				kmArray: [{text:'',value:'-1'}],
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD')
			}
		},
		components: {
			mynavBar
		},
		methods: {
			textClick(){
				let that=this
				if(this.grdArray.length==0){
					this.showToast('无法获取年级数据，不能进行添加操作')
				}else if(this.clsArray.length==0){
					this.showToast('无法获取班级数据，不能进行添加操作')
				}else {
					util.openwithData('/pages/schapp_work/ketangAdd',{index_code:this.index_code})
				}
			},
			grdClick:function(e){
				if(this.grdIndex!==e.detail.value){
					 this.grdIndex=e.detail.value
					 this.clsIndex=0
					 this.kmIndex=0
					 this.clsArray=[{text:'',value:'-1'}]
					 this.kmArray=[{text:'',value:'-1'}]
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getCls();
				}
			},
			clsClick:function(e){
				if(this.clsIndex!==e.detail.value){
					 this.clsIndex=e.detail.value
					 this.kmIndex=0
					 this.kmArray=[{text:'',value:'-1'}]
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getKm()
				}
			},
			kmClick:function(e){
				if(this.kmIndex!==e.detail.value){
					 this.kmIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			timeSelect(e){
				console.log(e);
				this.time=e
				this.showLoading()
				this.pageobj0.loadFlag=0
				this.pageobj0.canload=true
				this.pageobj0.page_number=1
				this.getList0();
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
						this.getKm()
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
					let sub = response.sub_list;
					let subList=[];
					sub.map(function(currentValue) {
						let name=currentValue.name.indexOf('全部')==-1?currentValue.name:'全部科目';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						subList.push(obj)
					})
					if(subList.length>0){
						this.kmArray=subList;
						this.getList0();
					}else{
						 this.showToast('无数据授权 无法获取科目');
					}
				})
			},
			getList0(){//获取页面数据
				let comData={
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					sub_code: this.kmArray[this.kmIndex].value,
					query_time: this.time,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'StudentAttendance/list',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
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
				item.index_code=this.index_code
				let that=this
				util.openwithData('/pages/schapp_work/ketangDetail',item)
			}
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getPermissionByPosition('add',this.index_code,result=>{
					 this.add=result[0]
					 if(result[0]){
						 this.icon='plusempty'
					 }
				 })
				 this.getGrd()
			},100)
			//#ifndef APP-PLUS
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
			
			this.pageobj0.loadFlag=0
			this.pageobj0.canload=true
			this.pageobj0.page_number=1
			this.getList0()
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
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
	 
	 .title-text{
		 display: flex;
		 align-items: center;
	 	width: 80vw;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
	 	color: #939393;
	 	font-size: 13px;
	 	margin: 3px 0;
		word-break: break-all;
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
</style>
