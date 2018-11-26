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


        // 动态创建audio (src, 'play', true)
        jdMusic.create = function(audioArr) {
            if (document.getElementsByClassName("audioClass").length) {
                return;
            }
            window.audioArr = audioArr;
            window.playIndex;
            let autoplaySelf = 0;
            if (this.wvt == 'unknown') {
                this.wvt = chkWebviewType();
            }
            if (this.wvt == 'unknown' || this.wvt == 'ios8') return; // ios8 不做音频需求 

            for (var y = 0; y < audioArr.length; y++) {
                if (audioArr[y]["autoplay"]) {
                    autoplaySelf++;
                    if (autoplaySelf > 1) {
                        audioArr[y]["autoplay"] = false;
                    }
                }
            }

            for (var i = 0; i < audioArr.length; i++) {
                if (!audioArr[i]["src"]) {
                    return
                } else if (typeof audioArr[i]["isloop"] == "undefined") {
                    audioArr[i]["isloop"] = false;
                } else if (typeof audioArr[i]["autoplay"] == "undefined") {
                    audioArr[i]["autoplay"] = "";
                } else if (!audioArr[i]["id"]) {
                    audioArr[i]["id"] = ("audioId" + i);
                }
            }
            for (var q = 0; q < audioArr.length; q++) {
                var temp = document.createElement('audio');
                temp.setAttribute('id', audioArr[q]["id"]);
                temp.setAttribute('class', ("audioClass" + " " +
                    audioArr[q]["class"]));
                temp.setAttribute('src', audioArr[q]["src"]);
                if (audioArr[q]["isloop"]) {
                    temp.setAttribute('loop', "loop")
                }
                document.querySelector('body').appendChild(temp);
                if (audioArr[q]["autoplay"]) {
                    this.play(q)
                }
            }

            console.log(audioArr)

        }

        // 音频播放
        jdMusic.play = function(index) {
            if (this.wvt == 'unknown') {
                this.wvt = chkWebviewType();
            }
            if (this.wvt == 'ios8') return; // ios8 不做音频需求 

            audioDOM = document.querySelector("#" + audioArr[index]["id"]);
            this.pause();
            document.querySelector("#" + audioArr[index]["id"]).play();
            playIndex = index;

            // 先判断要通知给原生的state，保证站外也能用state判断
            if (this.soundRouter.routerParam.state == 'play') return;
            this.soundRouter.routerParam.state = 'play';

            toOriginalChk(this.wvt, this.soundRouter)
        }

        // 音频暂停
        jdMusic.pause = function() {
            if (this.wvt == 'unknown') {
                this.wvt = chkWebviewType();
            }
            if (this.wvt == 'ios8') return; // ios8 不做音频需求 

            if (typeof playIndex != "undefined") {
                audioDOM = document.querySelector("#" + audioArr[playIndex]["id"]).pause()
            }

            // 先判断要通知给原生的state，保证站外也能用state判断
            if (this.soundRouter.routerParam.state == 'pause') return;
            this.soundRouter.routerParam.state = 'pause';

            toOriginalChk(this.wvt, this.soundRouter)
        }

        return jdMusic;
    }));
