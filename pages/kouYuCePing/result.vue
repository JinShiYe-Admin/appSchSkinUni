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
							<view v-if="v.btnShow" style="margin-bottom: 10px;">
								<view @click.stop="playAudioLeftBtn(v,v.audio_url)"
									class="btn-img img-voice  btn-img-cp"
									:class="{active:v.playAudoIS?v.playAudoIS:false}"></view>
								<view @touchstart.stop.prevent="touchStart(v,$event)"
									@touchend.stop.prevent="touchEnd(v,$event,1)"
									@touchmove.stop.prevent="touchEnd(v,$event,0)"
									class="btn-img img-record  btn-img-cp"
									:class="{active:v.recordIS?v.recordIS:false}">
								</view>
								<view @click.stop="playAudioRightBtn(v.record_url)"
									class="btn-img img-play  btn-img-cp"></view>
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
				phoneType:'h5',

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
				playAudoIS: false,
				recordIS: false,
				clickV: null,
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

			//#ifdef H5
			document.title = ""
			//#endif
			this.perTitle = this.getBookNames() || "暂无教材";
			this.audioContext = uni.createInnerAudioContext();
			//#ifdef APP-PLUS
			this.recorderManager = uni.getRecorderManager();
			uni.getSystemInfo({
			    success: function (res) {
					if(res.platform == 'ios'){
						_this.phoneType = 'ios';
					}else{
						_this.phoneType = 'Android';
					}
			    }
			});
			//#endif
			//#ifdef H5
			this.recorderManager = new Recorder({
				sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
				sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
				numChannels: 1,
			});
			//#endif
			//获取内容
			this.post(this.globaData.INTERFACE_KYCP + '/orals', {
				user_code: this.personInfo.user_code,
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
				this.clickV.playAudoIS = false
				this.$forceUpdate();
				this.audioUrl = '';
			});
			this.audioContext.onEnded(() => {
				console.log('停止播放11');
				this.clickV.playAudoIS = false
				this.$forceUpdate();
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
									phone_type:_this.phoneType,
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
			//#ifdef H5
			document.title = ""
			//#endif
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
				model.recordIS = true
				this.$forceUpdate()
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
					duration: '10000',
					sampleRate: 16000,
					numberOfChannels: 1,
					encodeBitRate: 16000
				});
				// #endif
			},
			touchEnd(model, e, flag) {
				if (flag == 1) {
					this.touchUpload(model, e, flag);
				} else {
					let subX = e.changedTouches[0].clientX - this.touchData.clientX;
					let subY = e.changedTouches[0].clientY - this.touchData.clientY;
					subX = Math.abs(subX);
					subY = Math.abs(subY);
					if (subX > 100 || subY > 100) {
						if (model.recordIS) {
							this.touchUpload(model, e, flag);
						}
					}
				}
			},
			touchUpload(model, e, flag) {
				model.recordIS = false
				this.$forceUpdate();
				this.uploadFlag = true;
				// #ifdef H5
				console.log('aaaaaaazzzzzzz111');
				this.recorderManager.stop();
				let tempAu = this.recorderManager.getWAVBlob();
				let files = new window.File([tempAu], '111.wav');
				console.log(files);
				uni.uploadFile({
					url: this.globaData.INTERFACE_KYCP + "/pub/upload",
					method: 'POST',
					file: files,
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
								phone_type:_this.phoneType,
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
						console.log('fail:' + JSON.stringify(e));
					}
				});
				// #endif
				// #ifndef H5
				this.recorderManager.stop();
				// #endif
			},
			playAudioLeftBtn(v, url) {
				v.playAudoIS = true
				this.clickV = v
				this.$forceUpdate();
				this.playAudio(url)
			},
			playAudioRightBtn(url) {
				this.playAudio(url)
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
		display: flex;
		justify-content: space-between;
		padding-top: 10px;
		width: 100%;
	}

	.btn-img {
		width: 30px;
		height: 30px;
		object-fit: cover;
		margin-top: 25px;
		margin-left: 20px;
	}

	.img-voice {
		width: 40px;
		height: 40px;
		background-image: url(~@/static/images/kouYuCePing/btn_voice.png);
		background-size: 100%;
		float: left;
	}

	.img-voice.active {
		width: 40px;
		height: 40px;
		background-image: url(~@/static/images/kouYuCePing/icon-voice.gif);
		background-size: 100%;
		float: left;
	}

	.img-record {
		width: 50px;
		height: 50px;
		background-size: 100%;
		margin-top: 15px;
		background-image: url(~@/static/images/kouYuCePing/btn_record.png);
		float: left;
	}

	.img-record.active {
		width: 50px;
		height: 50px;
		background-size: 100%;
		margin-top: 15px;
		background-image: url(~@/static/images/kouYuCePing/icon-record.gif);
		float: left;
	}

	.img-play {
		width: 40px;
		height: 40px;
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
