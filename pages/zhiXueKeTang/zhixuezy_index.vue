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
		<view style="padding-top: 40px;">
			<uni-list :border="false">
				<uni-list-item  :key="index" v-for="(item,index) in pagedata" :border="true">
					<text slot="body" class="slot-box slot-text" @click="downloadFile(item,index)">
						<view  style="display: flex;align-items: center;" >
							<template v-if="item.is_pack">
								<image src="../../static/images/zhiXueKeTang/file-icons/ziyuanPack.png" class="resource-img"></image>
							</template>
							<template v-else>
								<image v-if="item.file_ext.indexOf('mp4')!==-1" src="../../static/images/zhiXueKeTang/file-icons/mp4.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('docx')!==-1" src="../../static/images/zhiXueKeTang/file-icons/doc.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('doc')!==-1" src="../../static/images/zhiXueKeTang/file-icons/docx.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('mp3')!==-1" src="../../static/images/zhiXueKeTang/file-icons/mp3.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('asf')!==-1 " src="../../static/images/zhiXueKeTang/file-icons/asf.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('avi')!==-1 " src="../../static/images/zhiXueKeTang/file-icons/avi.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('flv')!==-1 " src="../../static/images/zhiXueKeTang/file-icons/flv.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('gif')!==-1 " src="../../static/images/zhiXueKeTang/file-icons/gif.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('pptx')!==-1 " src="../../static/images/zhiXueKeTang/file-icons/ppt.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('ppt')!==-1" src="../../static/images/zhiXueKeTang/file-icons/pptx.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('xls')!==-1 " src="../../static/images/zhiXueKeTang/file-icons/xls.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('xlsx')!==-1 " src="../../static/images/zhiXueKeTang/file-icons/xlsx.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('mpg')!==-1 " src="../../static/images/zhiXueKeTang/file-icons/mpg.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('swf')!==-1 " src="../../static/images/zhiXueKeTang/file-icons/swf.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('ts')!==-1 " src="../../static/images/zhiXueKeTang/file-icons/ts.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('wav')!==-1" src="../../static/images/zhiXueKeTang/file-icons/wav.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('wma')!==-1" src="../../static/images/zhiXueKeTang/file-icons/wma.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('wmv')!==-1" src="../../static/images/zhiXueKeTang/file-icons/wmv.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('pdf')!==-1" src="../../static/images/zhiXueKeTang/file-icons/pdf.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('exe')!==-1" src="../../static/images/zhiXueKeTang/file-icons/exe.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('jpg')!==-1" src="../../static/images/zhiXueKeTang/file-icons/jpg.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('png')!==-1" src="../../static/images/zhiXueKeTang/file-icons/png.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('rar')!==-1" src="../../static/images/zhiXueKeTang/file-icons/rar.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('zip')!==-1" src="../../static/images/zhiXueKeTang/file-icons/zip.png" class="resource-img"></image>
								<image v-else-if="item.file_ext.indexOf('txt')!==-1" src="../../static/images/zhiXueKeTang/file-icons/txt.png" class="resource-img"></image>
								<image v-else src="../../static/images/zhiXueKeTang/file-icons/other.png" class="resource-img"></image>
							</template>
							<uni-row>
								<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="title-text">{{item.name}}</view></uni-col>
								<uni-col :span="24" style="display: flex;align-items: baseline;"><view class="detail-text">{{item.create_time}}&ensp;|&ensp;{{item.owner_name}}</view></uni-col>
							</uni-row>
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
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
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
				
				scrollInto:'',
				tabIndex: 0,
				resPerModel: {}, //当前学段
				resSubModel: {}, //当前科目
				resMaterModel: {}, //当前教版
				resFascModel: {}, //当前分册
				resCatalogsModel: {}, //当前目录
				resCategoryArray: [], //资源类型列表
				resCategoryModel: {}, //当前资源类型
			}
		},
		components: {
			mynavBar
		},
		methods: {
			downloadFile(item,index){
				console.log("item: " + JSON.stringify(item));
				let deadline = this.getQueryString(item.openFileUrl).e; //得到当前文件过期时间 时间戳
				let timestamp = Math.round(new Date().getTime() / 1000).toString(); //得到当前时间戳
				if (timestamp - deadline > 0) { //过期
					this.showToast('当前文件已过期，请刷新列表重试！')
					return 0;
				}
				if (item.is_pack) { //资源包
					item.index_code=this.index_code
					util.openwithData("/pages/zhiXueKeTang/inside_page", item);
				}else{
					util.openFile(item.openFileUrl);
				}
			},
			tabtap(index){
				if (this.tabIndex === index) {
				   return;
				}
				this.tabIndex = index;
				this.scrollInto = this.resCategoryArray[index].key;
				this.resCategoryArray.map((item,i)=>{
					if (i == index) {
						this.showLoading()
						this.resCategoryModel = item;
						this.pageobj0.loadFlag=0
						this.pageobj0.canload=true
						this.pageobj0.page_number=1
						this.getList0()
					} 
				})
			},
			titleClick(){//切换目录
				let that=this
				util.openwithData('/pages/zhiXueKeTang/catalogPage',{index_code:this.index_code},{
					refreshList(data){//子页面调用父页面需要的方法
						that.showLoading()
						that.pageobj0.loadFlag=0
						that.pageobj0.canload=true
						that.pageobj0.page_number=1
						that.getList0()
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
						// 查询教版
						this.getResMater();
					} else {
						this.showToast('暂无科目');
					}
				})
			},
			getResMater(){//查询教版
				let comData={
					per_code: this.resPerModel.per_code, //学段代码
					sub_code: this.resSubModel.sub_code, //科目代码
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resMater',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						this.resMaterModel = response.list[0];
						// 查询分册
						this.getResFasc();
					} else {
						this.showToast('暂无教版');
					}
				})
			},
			getResFasc(){// 查询分册
				let comData={
					per_code: this.resPerModel.per_code, //学段代码
					sub_code: this.resSubModel.sub_code, //科目代码
					mater_code: this.resMaterModel.mater_code, //教版代码
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resFasc',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						this.resFascModel = response.list[0];
						// 查询目录
						this.getResCatalogs();
					} else {
						this.showToast('暂无分册');
					}
				})
			},
			getResCatalogs(){//查询目录
				let comData = {
					per_code: this.resPerModel.per_code, //学段代码
					sub_code: this.resSubModel.sub_code, //科目代码
					mater_code: this.resMaterModel.mater_code, //教版代码
					fasc_code: this.resFascModel.fasc_code, //分册代码
					index_code: this.index_code
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resCatalogs',comData,response=>{
					console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response) {
						let that =this
						this.getCalalogModel(response.catalog.children, function(tempData) {
							that.resCatalogsModel = tempData;
							that.tabBarItem.text=tempData.name; //给标题赋值
							that.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:14,color:'#FFFFFF'}}
							// 查询资源类型
							that.getResCategory();
						});
					} else {
						this.showToast('暂无目录');
					}
				},response=>{
					let that =this
					that.tabBarItem.text='切换目录'; //给标题赋值
					that.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:14,color:'#FFFFFF'}}
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
				if(id="null"){
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
