<template>
	<view>
		<mynavBar ref="mynavBar" :titleClick="titleClick" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<scroll-view class="scroll-view_H" scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
				<view v-for="(item,index) in resCategoryArray" :key="item.key" :id="item.key" :data-current="index" class="scroll-view-item_H" @click="tabtap(index)">
					<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{item.title}}</text>
				</view>
			</scroll-view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 0px;">
			<scroll-view class="select-scroll" scroll-y="true" >
				<!-- <mix-tree :list="leftList" @treeItemClick="treeItemClick" :nodeClick="true"></mix-tree> -->
				<ly-tree :tree-data="resCatalogsArray" node-key="id" @node-click="treeItemClick" :props="{label:'name'}"/>
			</scroll-view>
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
				tabBarItem: {},
				resPerModel: {}, //当前学段
				resSubModel: {}, //当前科目
				resCatalogsArray: [],//目录列表
			}
		},
		components: {
			mynavBar
		},
		methods: {
			treeItemClick(item) {
				console.log(item.isLeaf);
				console.log("item: " + JSON.stringify(item));
				if(item.isLeaf){
					this.clickitem=item
					this.$refs.alertDialog.open()
				}
			},
			titleClick(){//切换目录
				let that=this
				util.openwithData('/pages/zhiXueKeTang/catalogPage',{index_code:this.index_code},{
					refreshCatalog(data){//子页面调用父页面需要的方法
						that.tabBarItem.text=data.data[0].data.name; //给标题赋值
						that.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:14,color:'#FFFFFF'}}
						//当前章节
						that.resCatalogsModel = data.data[0].data;
						//当前学段
						let perModel=data.data[1]
						perModel.per_code=perModel.per_code.split("_")[1]
						that.resPerModel = perModel
						//当前科目
						let subModel=data.data[2]
						subModel.sub_code=subModel.sub_code.split("_")[1]
						that.resSubModel = subModel
						that.showLoading()
						that.pageobj0.loadFlag=0
						that.pageobj0.canload=true
						that.pageobj0.page_number=1
						that.getResCategory()
					}
				})
			},
			getResPer(){// 查询学段
				let comData={
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resPer',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						this.resPerModel = response.list[0];
						// 查询科目
						this.getResSub();
					} else {
						this.showToast('暂无学段');
					}
				})
			},
			getResSub(){
				let comData={
					per_code: this.resPerModel.per_code, //学段代码
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resSub',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						this.resSubModel = response.list[0];
						this.tabBarItem.text=response.list[0].sub_name; //给标题赋值
						this.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:14,color:'#FFFFFF'}}
						// 查询教版
						this.getResCatalogs();
					} else {
						this.showToast('暂无科目');
					}
				})
			},
			getResCatalogs(){//查询目录
				let comData = {
					per_code: this.resPerModel.per_code, //学段代码
					sub_code: this.resSubModel.sub_code, //科目代码
					user_code: this.personInfo.user_code,  
					index_code: this.index_code
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/catalogs',comData,response=>{
					console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response) {
						// let that =this
						this.resCatalogsArray = [].concat(response.catalog.children);
						// this.getCalalogModel(response.catalog.children, function(tempData) {
						// 	that.resCatalogsModel = tempData;
						// 	that.tabBarItem.text=tempData.name; //给标题赋值
						// 	that.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:14,color:'#FFFFFF'}}
						// 	// 查询资源类型
						// 	that.getResCategory();
						// });
					} else {
						this.resCatalogsArray = [].concat([]);
						this.showToast('暂无目录');
					}
				},response=>{
					this.tabBarItem.text='切换目录'; //给标题赋值
					this.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:14,color:'#FFFFFF'}}
					this.resCatalogsArray = [].concat([]);
				});
			},
			getCalalogModel(list, callback) {// 找到第一个可用的目录
				let tempM = list[0];
				if (tempM.children) {
					this.getCalalogModel(tempM.children, callback);
				} else {
					callback(tempM);
				}
			},
			getResCategory(){// 查询资源类型
				let comData={
					per_code: this.resPerModel.per_code, //学段代码
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resCategory',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						for (let i = 0; i < response.list.length; i++) {
							let tempM = response.list[i];
							if (i == 0) {
								tempM.ischeck = 1;
							} else {
								tempM.ischeck = 0;
							}
						}
						for (let i = 0; i < response.list.length; i++) {
							let model = response.list[i];
							model.key='zhi_'+model.key
						}
						this.resCategoryArray = [].concat(response.list);
						this.resCategoryModel = response.list[0];
						// 查询资源列表
						this.getList0();
					} else {
						this.showToast('暂无资源类型');
					}
				})
			},
			getList0(){//查询资源列表
				let category_id=this.resCategoryModel.key
				let id=category_id.split("_")[1]
				if(id=="null"){
					id=null
				}
				let comData = {
					catalog_id: this.resCatalogsModel.id, //目录代码
					category_id: id, //类型代码
					sub_code: this.resSubModel.sub_code, //科目代码
					page_number:  this.pageobj0.page_number, //科目代码
					page_size: this.pageSize, //
					index_code: this.index_code
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/resource/resourcePage',comData,response=>{
					console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					for (let i = 0; i < response.list.length; i++) {
						let model = response.list[i];
						model.create_time = this.modifyTimeFormat(model.create_time);
						if (model.convert_file_url == null || model.convert_file_url.length == 0) {
							model.openFileUrl = model.original_file_url;
						} else {
							model.openFileUrl = model.convert_file_url;
						}
					}
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
				});
			},
			modifyTimeFormat(str){//将时间转换为显示的格式
				let tempStr = '';
				let dt_now = new Date();
				let int_year = dt_now.getYear();
				let dt_item = new Date(str.replace(/-/g, '/'));
				if (int_year == dt_item.getYear()) {
					tempStr = this.format(dt_item, "MM-dd hh:mm")
				} else {
					tempStr = this.format(dt_item, "yyyy-MM-dd hh:mm")
				}
				return tempStr;
			},
			format(dateTime, format){
				let o = {
					"M+": dateTime.getMonth() + 1, //month
					"d+": dateTime.getDate(), //day
					"h+": dateTime.getHours(), //hour
					"m+": dateTime.getMinutes(), //minute
					"s+": dateTime.getSeconds(), //second
					"q+": Math.floor((dateTime.getMonth() + 3) / 3), //quarter
					"S": dateTime.getMilliseconds() //millisecond
				};
				if (/(y+)/.test(format)) {
					format = format.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
				}
				for (let k in o) {
					if (new RegExp("(" + k + ")").test(format)) {
						format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
					}
				}
				return format;
			},
			getQueryString(url){
				try {
					let theRequest = new Object();
					if (url.indexOf("?") != -1) {
						let str = url.split('?')[1];
						let strs = str.split("&");
						for (let i = 0; i < strs.length; i++) {
							theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
						}
					}
					return theRequest;
				} catch (e) {
					console.error('对userbus字段进行学段去重时发生异常,' + e);
					console.error('====================')
					console.error(e.stack);
					console.error('====================')
					return {};
				}
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
				 this.getResPer()
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
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .title-text{
		 display: flex;
		 align-items: center;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
		 flex: 1;
	 	color: #939393;
	 	font-size: 12px;
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
	 
	 .scroll-view_H {
	 	white-space: nowrap;
	 	width: 100%;
	 }
	 .scroll-view-item_H {
	 	display: inline-block;
	 	width: 70px;
	 	height: 40px;
	 	line-height: 40px;
	 	text-align: center;
	 	font-size: 14px;
	 }
	 
	 .uni-tab-item-title {
	     color: #555;
	     font-size: 14px;
	     height: 40px;
	     line-height: 40px;
	     flex-wrap: nowrap;
	     /* #ifndef APP-PLUS */
	     white-space: nowrap;
	     /* #endif */
	 }
	 
	 .uni-tab-item-title-active {
	     color: #00CFBD;
	 }
	 .resource-img{
		 width: 40px;
		 height: 40px;
		 margin-right: 5px;
	 }
</style>
