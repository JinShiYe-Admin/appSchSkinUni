<template>
	<view>
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
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				 pagedata:[],
				resPerModel: {}, //当前学段
				resSubModel: {}, //当前科目
				resMaterModel: {}, //当前教版
				resFascModel: {}, //当前分册
				resCatalogsModel: {}, //当前目录
				resCategoryArray: [], //资源类型列表
				resCategoryModel: {}, //当前资源类型
			}
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
			getResPage(){// 查询资源包子列表
				let comData={
					pid: this.tabBarItem.id,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/resource/packageList',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					for (var i = 0; i < response.list.length; i++) {
						var tempM = response.list[i];
						if (tempM.convert_file_url == null || tempM.convert_file_url.length == 0) {
							tempM.openFileUrl = tempM.original_file_url;
						} else {
							tempM.openFileUrl = tempM.convert_file_url;
						}
					}
					this.pagedata = [].concat(response.list);
				})
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
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				 this.showLoading()
				 this.getResPage()
			},100)
			uni.setNavigationBarTitle({title:itemData.name});
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
