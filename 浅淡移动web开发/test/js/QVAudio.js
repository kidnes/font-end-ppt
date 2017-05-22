var QVlib = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function(input) {
        var bytes = (input.length/4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },

    decode: function(input, arrayBuffer) {
        //get last chars to see if are valid
        var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));      
        var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));      

        var bytes = (input.length/4) * 3;
        if (lkey1 == 64) bytes--; //padding chars, so skip
        if (lkey2 == 64) bytes--; //padding chars, so skip

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i=0; i<bytes; i+=3) {  
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;           
            if (enc3 != 64) uarray[i+1] = chr2;
            if (enc4 != 64) uarray[i+2] = chr3;
        }

        return uarray;  
    }, 
    getScript: function(url, callback, charset){
        var head = document.getElementsByTagName("head")[0] || document.documentElement,
            script = document.createElement("script");
        script.src = url;
        charset && (script.charset = charset);

        script.onload = script.onreadystatechange = function() {
            if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
                callback && callback();
                script.onload = script.onreadystatechange = null;
                if (head && script.parentNode) head.removeChild(script);
            }
        };
        head.appendChild(script);
        return script;
    }
}


var QVAudio = function(config){
    this.config = config;
    this.init();
}
QVAudio.prototype.init = function(){
    var config = this.config;
    this.src = config.src;
    this.base64 = config.base64; 

    if ('AudioContext' in window) {
        this.audioContext = new AudioContext();
    } else if ('webkitAudioContext' in window) {
        this.audioContext = new webkitAudioContext();
    } else {
        this.audio = document.createElement('audio');
        this.audio.preload = 'auto';
        this.audio.src = this.src;
    }

    // base64数据处理
    if(this.audioContext) {
        this._handleBase64();
    }

    this.load();
}
QVAudio.prototype._handleBase64 = function(){
    var self = this;
    window[this.config.callback] = function(data){
        var arrayBuff = QVlib.decodeArrayBuffer(data);
        self.audioContext.decodeAudioData(arrayBuff, function(audioData) {
             self._arrayBuff = audioData;
        });
    }
} 
QVAudio.prototype.load = function(){
    // 如果支持Web Audio，加载base64音频
    if(this.audioContext) {
        QVlib.getScript(this.base64);
    } else if(this.audio) {
        if(!this.audio.load) return
        this.audio.load();
    }
} 
QVAudio.prototype.play = function(){
    if(this.audioContext) {
        this.source = this.audioContext.createBufferSource();
        if(!this._arrayBuff) return;
        this.source.buffer = this._arrayBuff;
        this.source.connect(this.audioContext.destination);

        if ('AudioContext' in window) {
            this.source.start(0);
        } else if ('webkitAudioContext' in window) {
            this.source.noteOn(0);
        }
    } else if(this.audio) {
        this.audio.play();
    }

}

QVAudio.prototype.stop=function(){
    if(this.source&&this.source.buffer) {
        if ('AudioContext' in window) {
            this.source.stop(0);

        } else if ('webkitAudioContext' in window) {
            this.source.noteOff(0);

        }
    } else if(this.audio) {
        this.audio.pause();
    }
}




/*  |xGv00|48bf7395a2bc6d8bf4ce1b0c373d179b */