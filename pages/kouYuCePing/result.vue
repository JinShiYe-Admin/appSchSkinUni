<template>
	<view>
		<uni-list class="result-list" v-for="(item,index) in model" :key="index" v-if="item.list.length">
			<uni-list-item v-for="(v, i) in item.list" :key='i' direction='column' clickable
				:class="{'word-cell': v.category=='read_word'}" @click="toggleOpen(v)">
				<view slot="body" class="slot-box slot-text">
					<view class="rightView">
						<view style="min-height: 40px;margin-top: 10px;"
							:class="{'word-box': v.category=='read_word', 'sentence-box': v.category=='read_sentence'}">
							<h4 v-if="v.category=='read_word'">{{v.words}}
								<span class="symbol" v-if="v.symbol">[{{v.symbol}}]</span>
								<span class="score" v-if="v.total_score!=null">{{setScore(v.total_score)}}</span>
							</h4>
							<h4 v-else>{{v.words}}
								<span class="score" v-if="v.total_score!=null">{{setScore(v.total_score)}}</span>
							</h4>
							<view v-if="v.btnShow">
								<view @click.stop="playAudio(v.audio_url)" class="btn-img img-voice"></view>
								<view @touchstart.stop.prevent="touchStart(v,$event)" @touchend.stop.prevent="touchEnd"
									@touchmove.stop.prevent="touchEnd" class="btn-img img-record">
								</view>
								<view @click.stop="playAudio(v.record_url)" class="btn-img img-play"></view>
							</view>
						</view>
						<view class="result-bar" v-if="v.category=='read_sentence'&&v.total_score!=null">
							<view class="score-item">
								准确度：{{v.accuracy_score}}
							</view>
							<view class="score-item">
								完整度：{{v.integrity_score}}
							</view>
							<view class="score-item">
								流利度：{{v.fluency_score}}
							</view>
						</view>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
	</view>
</template>
<script>
	import util from '../../commom/util.js';
	import Recorder from 'js-audio-recorder';
	// 七牛上传相关
	import cloudFileUtil from '@/commom/uploadFiles/CloudFileUtil.js';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				pageArray: [],
				pageIndex: 1,
				total_page: 0,
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
				perTitle: '',
				imageURL: '/static/images/kouYuCePing/btn_voice.png',

				model: [],
				isRecording: false,
				valid_touch: false,
				// openLi: {
				// 	index: -1,
				// 	i: -1
				// },
				key: "",
				isPlaying: false,
				audioContext: '',
				recorderManager: '',
				audioUrl: '', //音频url
				touchData: {}, //滑动事件数据

				uploadFlag: false, //是否上传
				uploadModel: {},
			}
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.title
			});

			//ndata为base64格式地址
			let ndata =
				'data:image/png;base64,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';
			let arr = ndata.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			let bdata = new Blob([u8arr], {
				type: mime
			})
			console.log(bdata);
			let files = new window.File([bdata], '111.mp3');
			console.log(files);
			uni.uploadFile({
				url: this.globaData.INTERFACE_KYCP + "/pub/upload",
				method: 'POST',
				file: files,
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				success: (uploadFileRes) => {
					console.log('successsuccess');
				},
				fail: (e) => {
					console.log('fail:' + JSON.stringify(e));
				}
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			this.perTitle = this.getBookNames() || "暂无教材";
			this.audioContext = uni.createInnerAudioContext();
			//#ifdef APP-PLUS
			this.recorderManager = uni.getRecorderManager();
			//#endif
			//#ifdef H5
			this.recorderManager = new Recorder();
			//#endif
			//获取内容
			this.post(this.globaData.INTERFACE_KYCP + '/orals', {
				category: this.itemData.cate,
				bookCatalogId: this.itemData.catalog_id,
				index_code: this.itemData.access.split('#')[1]
			}, (res0, res) => {
				if (res.code == 0) {
					for (var i = 0; i < res.data.list.length; i++) {
						var tempM = res.data.list[i];
						tempM.btnShow = false;
					}
					this.key = res.data.key;
					this.model.push({
						list: res.data.list
					});
				} else {
					this.showToast(res.msg);
				}
			});
			this.audioContext.onStop(() => {
				console.log('停止播放');
				this.audioUrl = '';
			});
			this.audioContext.onEnded(() => {
				console.log('停止播放11');
				this.audioUrl = '';
			});
			// #ifdef APP-PLUS
			this.recorderManager.onStop(function(res) {
				console.log('recorder stop' + JSON.stringify(res));
				if (_this.uploadFlag) {
					this.uploadFlag = false;
					_this.showLoading('上传中...');
					uni.uploadFile({
						url: _this.globaData.INTERFACE_KYCP + "/pub/upload",
						filePath: res.tempFilePath,
						name: 'file',
						success: (uploadFileRes) => {
							_this.hideLoading();
							console.log('uploadFileRes:' + JSON.stringify(uploadFileRes));
							if (uploadFileRes.statusCode == 200) {
								var tempM = JSON.parse(uploadFileRes.data);
								_this.uploadModel.words = _this.uploadModel.words ? _this.uploadModel
									.words.trim() : _this.uploadModel.words;
								_this.uploadModel.key = _this.key;
								_this.showLoading('正在评分');
								_this.post(_this.globaData.INTERFACE_KYCP + '/orals/record', {
									data: _this.uploadModel,
									file_url: tempM.data.url,
									index_code: _this.itemData.access.split('#')[1],
									user_code: _this.personInfo.user_code
								}, (res0, res) => {
									_this.hideLoading();
									console.log('resres:' + JSON.stringify(res));
									if (res.code == 0) {
										_this.uploadModel.key = res.data.key;
										_this.uploadModel.total_score = res.data.total_score;
										_this.uploadModel.record_url = res.data.record_url;
										if (_this.uploadModel.category == "read_sentence") {
											_this.uploadModel.accuracy_score = res.data
												.accuracy_score;
											_this.uploadModel.fluency_score = res.data
												.fluency_score;
											_this.uploadModel.integrity_score = res.data
												.integrity_score;
										}
										_this.post(_this.globaData.INTERFACE_KYCP +
											'/orals/save', {
												data: [_this.uploadModel],
												index_code: _this.itemData.access.split(
													'#')[1],
												user_code: _this.personInfo.user_code
											}, (res0, res) => {
												_this.hideLoading();
												console.log('resresresresres:' + JSON
													.stringify(res));
											})
									} else {
										_this.showToast('评分失败，请重试');
									}
								})
							} else {
								uni.showToast('文件上传失败，请稍后再试 ');
							}
						},
						fail: (e) => {
							console.log(e);
						}
					});
				}
			});
			// #endif
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.getPageList();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getPageList();
		},
		methods: {
			touchStart(model, e) {
				this.touchData.clientX = e.changedTouches[0].clientX;
				this.touchData.clientY = e.changedTouches[0].clientY;
				this.uploadModel = model;
				// #ifdef H5
				console.log('aaaaaaazzzzzzz');
				// this.recorderManager.start();
				this.recorderManager.start().then(() => {
					console.log('kaishi luyin');
					// 开始录音
				}, (error) => {
					// 出错了
					console.log(`${error.name} : ${error.message}`);
				});
				// #endif
				// #ifndef H5
				this.recorderManager.start({
					format: 'wav',
					duration: '10000'
				});
				// #endif
			},
			touchEnd(e) {
				let subX = e.changedTouches[0].clientX - this.touchData.clientX;
				let subY = e.changedTouches[0].clientY - this.touchData.clientY;
				subX = Math.abs(subX);
				subY = Math.abs(subY);
				if (subX > 30 || subY > 30) {

				} else {
					this.uploadFlag = true;
					// #ifdef H5
					console.log('aaaaaaazzzzzzz111');
					this.recorderManager.stop();
					this.recorderManager.play();
					let tempAu = this.recorderManager.getWAVBlob();
					console.log(typeof temp);
					console.log('tempAu:' + JSON.stringify(tempAu));
					uni.request({
						url: this.globaData.INTERFACE_KYCP + "/pub/upload",
						method: 'POST',
						data: tempAu,
						success: (uploadFileRes) => {
							console.log('successsuccess');
						},
						fail: (e) => {
							console.log('fail:' + e);
						}
					});
					// uni.uploadFile({
					// 	url: _this.globaData.INTERFACE_KYCP + "/pub/upload",
					// 	file:this.recorderManager.getWAVBlob(),
					// 	success: (uploadFileRes) => {
					// 		_this.hideLoading();
					// 		console.log('uploadFileRes:' + JSON.stringify(uploadFileRes));
					// 		if (uploadFileRes.statusCode == 200) {
					// 			var tempM = JSON.parse(uploadFileRes.data);
					// 			_this.uploadModel.words = _this.uploadModel.words ? _this.uploadModel.words.trim() : _this.uploadModel.words;
					// 			_this.uploadModel.key = _this.key;
					// 			_this.showLoading('正在评分');
					// 			_this.post(_this.globaData.INTERFACE_KYCP + '/orals/record', {
					// 				data: _this.uploadModel,
					// 				file_url: tempM.data.url,
					// 				index_code: _this.itemData.access.split('#')[1],
					// 				user_code: _this.personInfo.user_code
					// 			}, (res0, res) => {
					// 				_this.hideLoading();
					// 				console.log('resres:' + JSON.stringify(res));
					// 				if (res.code == 0) {
					// 					_this.uploadModel.key = res.data.key;
					// 					_this.uploadModel.total_score = res.data.total_score;
					// 					_this.uploadModel.record_url = res.data.record_url;
					// 					if(_this.uploadModel.category=="read_sentence") {
					// 						_this.uploadModel.accuracy_score = res.data.accuracy_score;
					// 						_this.uploadModel.fluency_score = res.data.fluency_score;
					// 						_this.uploadModel.integrity_score = res.data.integrity_score;
					// 					}
					// 					_this.post(_this.globaData.INTERFACE_KYCP + '/orals/save', {
					// 						data:[_this.uploadModel],
					// 						index_code: _this.itemData.access.split('#')[1],
					// 						user_code: _this.personInfo.user_code
					// 					}, (res0,res)=> {
					// 						_this.hideLoading();
					// 						console.log('resresresresres:'+JSON.stringify(res));
					// 					})
					// 				} else {
					// 					_this.showToast('评分失败，请重试');
					// 				}
					// 			})
					// 		} else {
					// 			uni.showToast('文件上传失败，请稍后再试 ');
					// 		}
					// 	},
					// 	fail: (e) => {
					// 		console.log(e);
					// 	}
					// });
					// #endif
					// #ifndef H5
					this.recorderManager.stop();
					// #endif
				}
			},
			playAudio(url) {
				if (url && url.length > 0) {
					if (this.audioUrl == url) {
						if (this.audioContext.paused) {
							this.audioPlay();
						} else {
							this.audioContext.stop();
						}
					} else {
						this.audioUrl = url;
						this.audioPlay();
					}
				} else {
					this.showToast('没有录音');
				}
			},
			audioPlay() {
				var getDownToken = {
					appId: this.globaData.QN_APPID, //int 必填 项目id
					appKey: this.globaData.QN_APPKEY,
					urls: [this.audioUrl] //array 必填 需要获取下载token文件的路径
				}
				var getDownTokenUrl = this.QNGETDOWNTOKENFILE;
				this.showLoading();
				cloudFileUtil.getQNDownToken(getDownTokenUrl, getDownToken, (data) => {
					this.hideLoading();
					this.audioContext.src = data.Data[0].Value;
					this.audioContext.play();
				});
			},
			//分数格式
			setScore(score) {
				return Math.round(score * 20);
			},
			toggleOpen: function(model) {
				model.btnShow = !model.btnShow;
			},
			//获取教材名
			getBookNames() {
				var orals_menu = util.getStore("orals_menu");
				return orals_menu.name || "";
			},
			getPageList() {
				var catalog = util.getStore('orals_catalog') || [];
				var catalog_id = [];
				if (this.pageIndex == 1) {
					//可选目录节点
					catalog.forEach(function(v) {
						catalog_id.push(v.id);
					});
				}
				var comData = {
					page: true,
					p: this.pageIndex,
					s: '20',
					bookCatalogId: catalog_id.join(),
					category: this.itemData.category,
					index_code: this.itemData.access.split('#')[1],
					user_code: this.personInfo.user_code
				}
				this.showLoading();
				//
				this.post(this.globaData.INTERFACE_KYCP + '/orals/history', comData, (data) => {
					this.hideLoading();
					this.pageIndex++;
					this.total_page = data.total_page;
					if (this.flagRef == 0) {
						if (data.list.length == 0) {
							this.showToast('暂无数据');
						}
						this.pageArray = [];
						uni.stopPullDownRefresh();
					}
					data.list.forEach(function(v) {
						var book_catalog = _this.filterArray(catalog, 'id', v.book_catalog_id)[0];
						if (v.category == _this.itemData.category && book_catalog) {
							v['book_catalog_pname'] = book_catalog.pname;
							_this.pageArray.push(v);
						}
					});
				});
			},
			// 根据某属性的值找数组对象
			filterArray(arr, key, val) {
				var r = arr.filter(function(item) {
					return item[key] == val;
				});
				return r;
			},
		}
	}
</script>

<style>
	.title {
		font-size: 114%;
		color: #333333;
		font-weight: normal;
		margin-top: 0;
		line-height: 1.4;
		padding-right: 0.08rem;
	}

	.progress {
		color: #333333;
	}

	.cur {
		font-size: 143%;
	}

	.time {
		font-size: 86%;
		color: #999999;
	}

	.progress-box {
		text-align: center;
		padding-top: 15px;
	}

	.progress-box>span {
		background-color: #EBEBEB;
		display: inline-block;
		width: 80px;
		border-radius: 10px;
		font-size: 13px;
		line-height: 1.6;
	}

	.test-pannel {
		height: calc(40% - 35px);
	}

	.list-end {
		text-align: center;
		color: #999999;
		margin-top: 20px;
		font-size: 12px;
	}

	.result-title {
		color: #333333;
		background-color: #EEEEEE;
		margin-top: 15px;
		padding: 10px;
		text-align: center;
		font-size: 16px;
	}

	.result-title .sec-title {
		color: #666666;
		font-size: 15px;
	}

	.result-bar {
		font-size: 12px;
		color: #999999;
		margin-top: 10px;
		display: flex;
		justify-content: space-between;
	}

	.btn-img {
		width: 30px;
		height: 30px;
		object-fit: cover;
		margin-top: 25px;
		margin-left: 20px;
	}

	.img-voice {
		background-image: url(~@/static/images/kouYuCePing/btn_voice.png);
		background-size: 100%;
		float: left;
	}

	.img-record {
		width: 40px;
		height: 40px;
		background-size: 100%;
		margin-top: 15px;
		background-image: url(~@/static/images/kouYuCePing/btn_record.png);
		float: left;
	}

	.img-play {
		background-size: 100%;
		background-image: url(~@/static/images/kouYuCePing/btn_play.png);
		float: left;
	}

	.symbol {
		margin-left: 0.12rem;
		font-size: 14px;
		color: #666666;
	}

	.score {
		/*font-family: "DINPro";*/
		background-color: #FAA666;
		display: inline-block;
		width: 25px;
		height: 25px;
		text-align: center;
		line-height: 25px;
		border-radius: 50%;
		position: absolute;
		color: #FFFFFF;
		font-size: 13px;
		right: 0;
		/* top: 50%; */
		margin-right: 10px;
		margin-top: 0px;
	}
</style>
