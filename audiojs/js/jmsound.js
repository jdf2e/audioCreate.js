(function(root, factory) {
        if (typeof exports === "object" && exports) {
            module.exports = factory(root); // CommonJS
        } else {
            if (typeof define === "function" && define.amd) {
                define(factory); // AMD
            } else {
                root.jdMusic = factory(root); // <script>
            }
        }
    }
    (typeof window !== 'undefined' ? window : this, function(window) {
        var jdMusic = {
            soundRouter: {
                'routerURL': 'router://JDExclusiveMediaModule/exclusiveMedia',
                'routerParam': { 'state': '' }
            },
            visibleNeedPlay: false,
            wvt: 'unknown'
        }

        function isApp(name, ua) {
            ua = ua || navigator.userAgent;
            if (name === 'wx') return /micromessenger/i.test(ua);
            if (name === 'qq') return /qq\//i.test(ua);
            if (name === 'weibo') return /weibo/i.test(ua);
            if (name === 'jd') return /^jdapp/i.test(ua);
            return false;
        }

        function isIOS(ua) {
            ua = ua || navigator.userAgent;
            return /ip(hone|od)|ipad/i.test(ua);
        }

        function getIOSVersion(ua) {
            ua = ua || navigator.userAgent;
            var match = ua.match(/OS ((\d+_?){2,3})\s/i);
            return match ? match[1].replace(/_/g, '.') : 'unknown';
        }

        function chkWebviewType() {
            if (isApp('jd')) {
                if (!isIOS()) {
                    return 'andriod'
                } else {
                    // 是ios，如果是ios8的话则不做任何操作
                    var tempIosVer = getIOSVersion();
                    if (tempIosVer == 'unknown') {
                        return 'unknown'
                    } else if (tempIosVer >= 8 && tempIosVer < 9) {
                        return 'ios8'
                    } else {
                        var iswk = (-1 != navigator.userAgent.indexOf("supportJDSHWK/1")) || (window._is_jdsh_wkwebview == 1);
                        return iswk ? 'wk' : 'ui'
                    }
                }
            }
            return 'notJdApp'
        }

        function toOriginalChk(wvt, soundRouter) {
            // 判断环境
            if (wvt == 'notJdApp') {
                return;
            } else if (wvt == 'wk') {

                // 通知原生播放状态
                window.webkit.messageHandlers.JDAppUnite.postMessage({
                    'method': 'callRouterModuleWithParams',
                    'params': JSON.stringify(soundRouter)
                });
            } else if (wvt == 'ui') {
                window.JDAppUnite && window.JDAppUnite.callRouterModuleWithParams(JSON.stringify(soundRouter));
            }
        }
        /* end:前置函数*/
        var musicArr = [];
        jdMusic.create = function(arr) {
            musicArr = arr;
            console.log("创建成功!", arr)
            for (var i = 0; i < arr.length; i++) {
                if (!arr[i]["src"]) return;
                arr[i]["isloop"] = arr[i]["isloop"] || true;
                if (this.wvt == 'unknown') {
                    this.wvt = chkWebviewType();
                }
                if (this.wvt == 'unknown' || this.wvt == 'ios8') return; // ios8 不做音频需求 

                var $audio = document.querySelector('#jd_audio_wrapper' + i);

                if (!$audio) {
                    var temp = document.createElement('audio');
                    temp.setAttribute('id', 'jd_audio_wrapper' + i)
                    temp.setAttribute('src', arr[i]["src"])
                        // temp.setAttribute('autoplay', false)
                    if (arr[i]["isloop"]) {
                        temp.setAttribute('loop', 'loop')
                    }
                    document.querySelector('body').appendChild(temp);
                    $audio = document.querySelector('#jd_audio_wrapper' + i);
                }
            }

        }

        // 音频播放
        jdMusic.play = function(index) {
            audioDOM = document.querySelector('#jd_audio_wrapper' + index) || document.querySelector('#jd_audio_wrapper0');
            audioDOMAll = document.querySelector
            if (this.wvt == 'unknown') {
                this.wvt = chkWebviewType();
            }
            if (this.wvt == 'ios8') return; // ios8 不做音频需求 
            console.log(musicArr)
            for (var i = 0; i < musicArr.length; i++) {
                audioDOM = document.querySelector('#jd_audio_wrapper' + i);
                audioDOM.pause()
                if (i == index) {
                    audioDOM.play();
                }
            }

            // 先判断要通知给原生的state，保证站外也能用state判断
            if (this.soundRouter.routerParam.state == 'play') return;
            this.soundRouter.routerParam.state = 'play';

            toOriginalChk(this.wvt, this.soundRouter)
        }

        // 音频暂停
        jdMusic.pause = function(index) {
            if (this.wvt == 'unknown') {
                this.wvt = chkWebviewType();
            }
            if (this.wvt == 'ios8') return; // ios8 不做音频需求 
            for (var i = 0; i < musicArr.length; i++) {
                audioDOM = document.querySelector('#jd_audio_wrapper' + i);
                audioDOM.pause()
            }

            // 先判断要通知给原生的state，保证站外也能用state判断
            if (this.soundRouter.routerParam.state == 'pause') return;
            this.soundRouter.routerParam.state = 'pause';

            toOriginalChk(this.wvt, this.soundRouter)
        }

        return jdMusic;
    }));