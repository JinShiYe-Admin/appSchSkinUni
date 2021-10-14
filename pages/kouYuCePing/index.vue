<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :text="navText" :textClick="textClick()"></mynavBar>
		<view class="tabs-fixed">
			<uni-segmented-control :current="semFlag" :values="semValuesArray" @clickItem="clickSeg" styleType="text"
				activeColor="#00CFBD"></uni-segmented-control>
		</view>
		<view class="content" style="margin-top: 60px;">
			<view style="text-align: center;font-size: 13px;color: gray;">{{bookItems||"暂无教材"}}<uni-icons type="settings" size="20" color="#00CFBD" style="margin-left: 10px;padding-top: 5px;" @click="bookSelect()"></uni-icons></view>
			<view v-if="semFlag == 0">
				<uni-row style="margin-top: 5px;">
					<uni-col :span="3" @click="changeMenu(-1)">
						<uni-icons type="arrowleft" size="20" color="gray" style="float: right;"></uni-icons>
					</uni-col>
					<uni-col :span="18">
						<view @click="showMenu()" style="text-align: center;" v-html="contentTitle"></view>
					</uni-col>
					<uni-col :span="3" @click="changeMenu(1)">
						<uni-icons type="arrowright" size="20" color="gray" style="float: left;"></uni-icons>
					</uni-col>
				</uni-row>
				<view class="progress-box">
					<span>{{(index+1)+"/"+list.length}}</span>
				</view>
				<view v-if="list.length" class="test-pannel" :class="{sentence: !isWord}">
					{{list[index].words}}
					<p class="read" v-if="isWord" v-show="isTested&&list[index].symbol">[{{list[index].symbol}}]</p>
					<p class="translation" v-else v-show="isTested&&list[index].translations">{{list[index].translations}}</p>
				</view>
				<!-- <view v-else-if="state>2" class="test-pannel" style="font-size: 12px;color: #999999;">暂无内容</view>
				<view v-else class="test-pannel"></view> -->
							
				<!-- <view class="action-box">
					<view class="overflow-cover"></view>
					<view class="score-box">
						<span class="score" v-if="isTested">{{setScore(list[index].total_score)}}</span>
					</view>
					<view class="btns-box">
						<a class="btn-voice" :class="{active: playingAudio}" @tap="playAudio(list[index]?list[index].audio_url:'', 'audio')">
							<svg class="icon" aria-hidden="true">
								<use xlink:href="#icon-icon-voice"></use>
							</svg>
							<span class="icon active img-icon"></span>
						</a>
						<a class="btn-record" :class="{active: isRecording}" @touchstart.stop="record($event)" @touchmove.stop="touchMove($event)" @touchend.stop="stopRecord">
							<svg class="icon" aria-hidden="true">
								<use xlink:href="#icon-icon-record"></use>
							</svg>
							<view class="btn-record-bg">
								<view class="btn-record-bg-active"></view>
							</view>
						</a>
						<a class="btn-play" :class="{active: playingRecord}" @tap="playAudio(list[index]?list[index].record_url:'', 'record')">
							<svg class="icon" aria-hidden="true">
								<use xlink:href="#icon-icon-play"></use>
							</svg>
							<svg class="icon active" aria-hidden="true">
								<use xlink:href="#icon-icon-pause"></use>
							</svg>
						</a>
					</view>
							
					<view class="skip-box">
						<a :class="{disabled: index==0}" @tap="changeIndex(-1)">上一个</a>
						<a v-show="index<list.length-1" @tap="changeIndex(1)">下一个</a>
						<a v-show="index==list.length-1" class="btn-submit" @tap="submit">提交</a>
					</view>
				</view> -->
			</view>
			<view v-if="semFlag == 1">
			</view>
			<view v-if="semFlag == 2">
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				tabbar: [],
				tabBarItem: {},
				navText:'',
				isGetLast:false,//判断登录者是否有上一次记录
				catalogId: 0,
				list: [],
				index: 0,
				// category: activeTab,
				// isRecording: false,
				// playingAudio: true,
				// playingRecord: false,
				menu: [],
				// valid_touch: false,
				// state: 1, // 1-unload; 2-loading; 3-loaded; 4-start; 5-submit
				bookItems: "",
				contentTitle: "...",
				isContentTitle: true,
				semValuesArray: ['单词测评', '句子测评', '错题本'],
				semFlag: 0, //点击的seg索引
				semFlag0Data: { //单词测评
					
				},
				semFlag1Data: { //句子测评
					
				},
				semFlag2Data: { //错题本
					
				}
			}
		},
		components: {
			mynavBar
		},
		onLoad() {
			_this = this;
			// 添加监听，如果修改了头像，将左上角和个人中心的也对应修改
			uni.$on('updateHeadImg', function(data) {
				_this.$refs.mynavBar.upLoadImg();
			})
			this.tabbar = util.getMenu();
			this.personInfo = util.getPersonal();
			console.log('personInfo:' + JSON.stringify(this.personInfo));
			this.tabBarItem = util.getTabbarMenu();
			console.log('this.tabBarItem:' + JSON.stringify(this.tabBarItem));
			
			var orals_auth = util.getStore('orals_auth');
			if(orals_auth && orals_auth.user_code==this.personInfo.user_code) {
				this.isGetLast = true;
			}
			util.setStore("orals_auth", this.personInfo);
			this.navText = '测评记录';
			// 获取科目列表
			this.getInitData();
			// this.getContent();
			// util.setStore("orals_catalog_id", String(v));
		},
		methods: {
			textClick(){
				
			},
			getInitData() {
				var book_items = util.getStore('kycp_book_items');
				//保存了上一次记录时
				if(this.isGetLast && book_items) {
					var book_codes = this.getBookCodes(book_items);
					this.getBook(book_codes);
				}else{
					this.getBook({})
				}
			},
			// 获取教材信息
			getBook(defaultCodes) {
				this.showLoading();
				var auto_book = {};
				// 获取学段
				this.post(this.globaData.INTERFACE_KYCP + '/pub/resPer', {
					index_code:this.tabBarItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				}, (res0,res) => {
					console.log('resPer:'+JSON.stringify(res));
					if(res.state=="ok") {
						auto_book.per = {
							list: res.data,
							selected: defaultCodes.percode || (res.data[0]?res.data[0].percode:"")
						}
						
						// 获取科目
						this.post(this.globaData.INTERFACE_KYCP + '/pub/resSub', {
							percode: auto_book.per.selected,
							index_code:this.tabBarItem.access.split('#')[1],
							user_code: this.personInfo.user_code
						}, (res0,res)=> {
							if(res.state=="ok") {
								auto_book.sub = {
									list: res.data,
									selected: defaultCodes.subcode || (res.data[0]?res.data[0].subcode:"")
								}
								
								// 获取教版
								this.post(this.globaData.INTERFACE_KYCP + '/pub/resMater', {
									percode: auto_book.per.selected,
									subcode: auto_book.sub.selected,
									index_code:this.tabBarItem.access.split('#')[1],
									user_code: this.personInfo.user_code
								}, (res0,res)=> {
									if(res.state=="ok") {
										auto_book.mater = {
											list: res.data,
											selected: defaultCodes.matercode || (res.data[0]?res.data[0].matercode:"")
										}
										
										// 获取分册
										this.post(this.globaData.INTERFACE_KYCP + '/pub/resFasc', {
											percode: auto_book.per.selected,
											subcode: auto_book.sub.selected,
											matercode: auto_book.mater.selected,
											index_code:this.tabBarItem.access.split('#')[1],
											user_code: this.personInfo.user_code
										}, (res0,res)=> {
											if(res.state=="ok") {
												auto_book.fasc = {
													list: res.data,
													selected: defaultCodes.fasccode || (res.data[0]?res.data[0].fasccode:"")
												}
												
												// 保存目录
												util.setStore('kycp_book_items', auto_book);
												//获取目录
												this.getCatalog(this.bookCheck(auto_book));
												
												this.hideLoading();
											}else{
												this.hideLoading();
												if(res.code!=404) this.showToast(res.msg);
											}
										})
									}else{
										this.hideLoading();
										if(res.code!=404) this.showToast(res.msg);
									}
								})
							}else{
								this.hideLoading();
								if(res.code!=404) this.showToast(res.msg);
							}
						})
					}else{
						this.hideLoading();
						if(res.code!=404) this.showToast(res.msg);
					}
				})
			},
			// 检查确保教材的selected是否都在list中
			bookCheck(book) {
				for(var key  in book) {
					var selected="";
					for(var i=0; i<book[key].list.length; i++) {
						if(book[key].list[i][key+"code"]==book[key].selected) {
							selected = book[key].list[i][key+"code"];
							break;
						}
					}
					if(!selected) book[key].selected = book[key].list[0]?book[key].list[0][key+"code"]:"";
				}
				return book;
			},
			//获取目录
			getCatalog(auto_book) {
				var data = this.getBookCodes(auto_book);
				if(Object.keys(data).length<4) {
					this.showLoading('教材信息不完整');
					return;
				}
				this.post(this.globaData.INTERFACE_KYCP + '/pub/catalog', {
					...data,
					index_code:this.tabBarItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				},(res0,res)=> {
					if(res.state=="ok") {
						//保存目录
						util.setStore("orals_menu", res.data.catalog);
						
						//保存分册目录
						var catalog = this.getFinalCatalog(res.data.catalog.children);
						util.setStore("orals_catalog", catalog);
						
						this.setBaseData(); //设置数据
						this.getContent("category");
					}else{
						if(res.code!=404) this.showToast(res.msg);
					}
				})
			},
			// 获取教材code
			getBookCodes(book) {
				var codes = {};
				for(var key  in book) {
					if(key=="per"||key=="sub"||key=="mater"||key=="fasc") {
						if(book[key].selected) codes[key+"code"] = book[key].selected;
					}
				}
				return codes;
			},
			//获取最末端目录
			getFinalCatalog(list){
				var catalog = []; 
				this.readTree(list, function(node){
			        if(!node.children) {
			            catalog.push(node);
			        }
			   	});
			   	catalog.forEach(function(v, i){
					_this.readTree(list, function(node){
						if(node.id==v.pid){
							catalog[i]["pname"] = node.name;
						}
					});
				});
				return catalog;
			},
			// 遍历树形菜单，并回调
			readTree(tree, callback) {
			    for (var i = 0; i < tree.length; i++) {
			        callback(tree[i]);
			        if(tree[i].children) {
			            this.readTree(tree[i].children, callback);
			        }
			    }
			},
			//设置基础数据
			setBaseData() {
				//教材名
				this.bookItems = this.getBookNames();
				//设置目录列表
				this.menu = util.getStore("orals_catalog") || [];
				//设置节点
				var catalogId = util.getStore('orals_catalog_id');
				var isCatalogId = this.menu.some(function(v, i) {
					return v.id == catalogId;
				});
				if(catalogId && isCatalogId) {
					this.catalogId = catalogId;
				} else {
					this.getAutoNode();
				}
			},
			//获取默认节点
			getAutoNode() {
				var auto_node = this.menu[0];
				if(auto_node) {
					this.catalogId = auto_node.id;
				}else{
					this.catalogId = 0;
				}
			},
			//获取教材名
			getBookNames() {
				var orals_menu = util.getStore("orals_menu");
				return orals_menu.name||"";
			},
			//选择教材
			// bookSelect() {
			// 	if(this.state == 4 && (activeTab == "word" || activeTab == "sentence")) {
			// 		this.layerBeforeLeave("您还没有提交，确定要离开吗？", ["确定", "取消"], goBook);
			// 	} else {
			// 		this.endPlayAudio();
			// 		this.goBook();
			// 	}
			// },
			//显示目录
			// showMenu() {
			// 	this.isShowMenu = true;
			// 	var menu_list = [];
			// 	this.menu.forEach(function(v) {
			// 		var cur_list = this.filterArray(menu_list, "id", v.pid)[0];
			// 		if(cur_list) {
			// 			cur_list.list.push(v);
			// 		} else {
			// 			menu_list.push({
			// 				id: v.pid,
			// 				name: v.pname,
			// 				list: [v]
			// 			});
			// 		}
			// 	});
			// 	this.menu_list = menu_list;
			// 	this.catalogId = this.catalogId;
			// },
			//切换目录
			// changeMenu(d) {
			// 	var catalog = this.menu;
			// 	var c_index;
			// 	catalog.forEach(function(v, i) {
			// 		if(v.id == this.catalogId) c_index = i;
			// 	});
			// 	var new_index = c_index+d;
			// 	if(new_index<0) {
			// 		this.showToast("当前已是第一单元", {type: 'view'});
			// 	}else if(new_index>=catalog.length) {
			// 		this.showToast("已到达最后一个单元！", {type: 'view'});
			// 	}else {
			// 		if(this.state==4){
			// 			this.layerBeforeLeave("您还没有提交，离开将不保存成绩！", ["残忍离开", "我再想想"], function(){
			// 				this.catalogId = catalog[c_index+d].id;
			// 			});
			// 		}else{
			// 			this.catalogId = catalog[c_index+d].id;
			// 		}
			// 	}
			// },
			// hideMenu() {
			// 	this.isShowMenu = false;
			// },
			// selectMenu(id) {
			// 	var _this = this;
			// 	if(this.state == 4) {
			// 		this.layerBeforeLeave("您还没有提交，离开将不保存成绩！", ["残忍离开", "我再想想"], function() {
			// 			_this.isShowMenu = false;
			// 			_this.catalogId = id;
			// 			this.catalogId = id;
			// 		});
			// 	} else {
			// 		_this.isShowMenu = false;
			// 		_this.catalogId = id;
			// 		this.catalogId = id;
			// 	}
			// },
			//获取目录名
			getCatalogName(id) {
				var catalog = util.getStore('orals_catalog');
				var cur_node = this.filterArray(catalog, 'id', id)[0];
				var final_name = "";
				if(cur_node) {
					final_name = cur_node.pid?((cur_node.pname||"")+"&nbsp;&nbsp;"+cur_node.name):cur_node.name;
				}
				return final_name;
			},
			// 根据某属性的值找数组对象
			filterArray(arr, key, val) {  
			    var r = arr.filter(function(item){
			            return item[key] == val;
			        });
			    return r;
			},
			//获取评测内容
			getContent(change_data) {
				this.showLoading();
				// !audioEle.ended && audioEle.pause();
				// var _this = this;
				// if(!_this.catalogId) {
				// 	_this.list = [];
				// 	_this.index = 0;
				// 	_this.state = 3;
				// 	this.contentTitle = "...";
				// 	this.hideLoading();
				// 	return false;
				// }
				// if(change_data != "category") {
					this.contentTitle = this.getCatalogName(_this.catalogId);
					console.log('this.contentTitle:'+this.contentTitle);
				// }
				var data = {
					category: _this.category == "word" ? "read_word" : "read_sentence",
					bookCatalogId: _this.catalogId
				}
				_this.state = 2;
				this.post(this.globaData.INTERFACE_KYCP + '/orals', {
					...data,
					index_code:this.tabBarItem.access.split('#')[1],
					user_code: this.personInfo.user_code
				}, (res0,res)=> {
					if(res.state=="ok") {
						// this.endPlayAudio();
						//添加单词句子列表
						res.data.list.forEach(function(v) {
							//成绩清零
							v.total_score = null;
							v.record_url = null;
							v.key = res.data.key;
						});
						_this.list = res.data.list;
						_this.index = 0;
						_this.state = 3;
						this.hideLoading();
					}else{
						_this.state = 3;
						this.hideLoading();
						if(res.code!=404) this.showToast(res.msg);
					}
				})
			},
			//切换单词句子
			changeIndex(d) {
				if(this.isRecording) {
					return false;
				}
				var f_index = this.index + d;
				if(f_index >= 0 && f_index < this.list.length) {
					this.index = f_index;
					this.endPlayAudio();
				}
			},
			//播放音频
			playAudio(url, type) {
				if(!url) {
					this.showToast(type == "record" ? "您还没录音" : "没有音频", {
						duration: 'short',
						type: 'view'
					});
					return;
				}
			
				if((this.playingAudio || this.playingRecord) && currentAudioUrl==url) {
					this.endPlayAudio();
					return;
				}
				
				if(type == "audio") {
					this.playingAudio = true;
				} else if(type == "record") {
					this.playingRecord = true;
				}
				
				currentAudioUrl = url;
				if(mui.os.android) {
					audioPlayCounter = 0;
					audioEle.src = url;
					audioEle.play();
				}else{
					this.audioPlayer(url, function() {
						this.endPlayAudio();
					});
				}
			},
			//点击录音
			record(event) {
				if(!this.list[this.index]) {
					this.showToast("没有测评内容", {
						duration: 'short',
						type: 'view'
					});
					return;
				}
				if(!this.isRecording) {
					var _this = this;
					// 检查权限
					this.checkPermissionRECORD(function () {
						_this.isRecording = true;
						_this.startRecord();
						recorderTimer = setTimeout(function() {
							_this.isRecording && _this.stopRecord();
						}, _this.list[_this.index].time_len * 1000 || 5000);
						this.touchStart(event.targetTouches[0]);
					});
				}
			},
			//开始录音
			startRecord() {
				var _this = this;
				var record = this.list[this.index];
				gentry && this.gentry();
				recorder = this.setRecorder(_this.valid_touch, function(p) {
					var ps = p.split("/")
					files.push({
						name: ps.pop(),
						path: p
					});
					_this.uploadRecord(record);
				});
			},
			touchMove(event) {
				var _this = this;
				_this.isRecording && this.touchEnd(event.targetTouches[0], function() {
					_this.stopRecord();
				});
			},
			//停止录音
			stopRecord(event) {
				if(this.isRecording) {
					recorder && recorder.stop();
					this.isRecording = false;
					clearTimeout(recorderTimer);
				}
			},
			//上传录音
			uploadRecord: function(record) {
				if(files.length <= 0) {
					return;
				}
				var _this = this;
				// this.uploadRecordFile(record, files, {index_code:this.tabBarItem.access.split('#')[1],}, (res0,res)=> {
				// 	_this.state = 4;
				// 	var cur_li = _this.list[_this.index];
				// 	cur_li.total_score = res.data.total_score;
				// 	cur_li.record_url = res.data.record_url;
				// 	if(cur_li.category == "read_sentence") {
				// 		cur_li.accuracy_score = res.data.accuracy_score;
				// 		cur_li.fluency_score = res.data.fluency_score;
				// 		cur_li.integrity_score = res.data.integrity_score;
				// 	}
				// });
			},
			//提交
			submit: function() {
				this.endPlayAudio();
				this.showLoading("正在提交");
				this.post(this.globaData.INTERFACE_KYCP + '/orals/save', {
					data: _this.list,
					index_code:this.tabBarItem.access.split('#')[1],
					user_code: userInfo.user_code
				}, (res0,res)=> {
					if(res.state=="ok") {
						_this.state = 5;
						//打开结果页
						this.goResult({
							title: this.contentTitle,
							cate: _this.list[0].category,
							catalog_id: _this.catalogId
						});
						resultVue.page = 1;
						resultVue.isReload = true;
						plus.nativeUI.closeWaiting();
					}else{
						plus.nativeUI.closeWaiting();
						if(res.code!=404) this.showToast(res.msg);
					}
				})
			},
			clickSeg: function(e) {
				if (this.semFlag != e.currentIndex) {
					this.semFlag = e.currentIndex;
					console.log('this.semFlag:' + e.currentIndex);
					if (this.semFlag == 0) {
						if (this.semFlag0Data.subList.length == 0) {
							// 获取科目列表
							this.getSubList(0, subArray => {
								for (var i = 0; i < subArray.length; i++) {
									var tempM = subArray[i];
									tempM.text = tempM.sub_name;
								}
								this.semFlag0Data.subList = [].concat(subArray);
								if (subArray.length > 0) {
									this.semFlag0Data.nowSubject = subArray[0];
								}
								// 获取单科成绩列表
								this.getSingleSubScore();
							});
						}
					} else if (this.semFlag == 1) {
						if (this.semFlag1Data.sem1List.length == 0) {
							// 获取全科成绩列表
							this.getSumSubScore();
						}
					} else if (this.semFlag == 2) {
						if (this.semFlag2Data.knowData.total_point == '') {
							// 获取科目列表
							this.getSubList(this.semFlag, subArray => {
								for (var i = 0; i < subArray.length; i++) {
									var tempM = subArray[i];
									tempM.text = tempM.sub_name;
								}
								this.semFlag2Data.subList = [].concat(subArray);
								if (subArray.length > 0) {
									this.semFlag2Data.nowSubject = subArray[0];
								}
								// 获取知识点分析
								this.getKnowPoint();
							});
						}
					}
				}
			},
			//获取单科成绩
			getSingleSubScore() {
				let comData = {
					user_code: this.personInfo.user_code,
					sub_code: this.semFlag0Data.nowSubject.sub_code,
					page_number: this.semFlag0Data.pageIndex,
					page_size: this.pageSize,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'singleSub/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag0Data.pageIndex++;
						this.semFlag0Data.total_page = data.data.total_page;
						if (this.semFlag0Data.flagRef == 0) {
							if (data.data.list.length == 0) {
								this.showToast('暂无数据');
							}
							this.semFlag0Data.sem0List = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.semFlag0Data.sem0List = this.semFlag0Data.sem0List.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//获取全科成绩
			getSumSubScore() {
				let comData = {
					user_code: this.personInfo.user_code,
					page_number: this.semFlag1Data.pageIndex,
					page_size: this.pageSize,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'fullSub/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag1Data.pageIndex++;
						this.semFlag1Data.total_page = data.data.total_page;
						if (this.semFlag1Data.flagRef == 0) {
							if (data.data.list.length == 0) {
								this.showToast('暂无数据');
							}
							this.semFlag1Data.sem1List = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.semFlag1Data.sem1List = this.semFlag1Data.sem1List.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			//获取知识点
			getKnowPoint() {
				let comData = {
					user_code: this.personInfo.user_code,
					sub_code: this.semFlag2Data.nowSubject.sub_code,
					index_code: this.tabBarItem.access.split('#')[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_STUSCORE + 'point/subOverview', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.semFlag2Data.knowData = data.data;
						this.semFlag2Data.zhishidianDFL = {"series":[{"name":"得分率","data":this.semFlag2Data.knowData.average_score_rate,"color":"#00CFBD"}]};
						this.semFlag2Data.zhishidianShow = {title:{name:this.semFlag2Data.knowData.average_score_rate*100+'%',fontSize:35,color:'#00CFBD'},subtitle:{name:'得分率',color:'#666666',fontSize:15}}
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.progress-box {
		text-align: center;
		padding-top: 15px;
	}
	.progress-box > span {
		background-color: #EBEBEB;
		display: inline-block;
		width: 80px;
		border-radius: 10px;
		font-size: 13px;
	    line-height: 1.6;
	}
</style>
