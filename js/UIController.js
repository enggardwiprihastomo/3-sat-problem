var UIController = (function(){
    var DOM = {
        BtnCheck: document.querySelector(".btn-check"),
        BtnClose: document.querySelector(".close"),
        Result: document.querySelector(".result"),
        BtnAnd: document.querySelector(".btn-and"),
        BtnOr: document.querySelector(".btn-or"),
        InputFormula: document.querySelector(".input-formula"),
        MessageSection: document.querySelector(".messagesection"),
        Radios: document.getElementsByName("mode"),
        FormulaFile: document.querySelector(".Formula3SAT")
    };

    var lastFocused;
    DOM.InputFormula.addEventListener("focus", function(){
        lastFocused = document.activeElement;
    });

    var deleteMessage = function(){
        setTimeout(function(){
            if(document.querySelector(".message")){
                document.querySelector(".message").parentElement.removeChild(document.querySelector(".message"));
            }
        }, 5000)
    }

    return {
        DOM: DOM,
        Message: function(message, status){
            var Id = Math.floor(Math.random() * 100);
            DOM.MessageSection.insertAdjacentHTML('beforeend', "<div class='message' id='message-" + Id + "'>" + message + "</div>");
            if(status == "error"){
                document.querySelector("#message-" + Id).style.backgroundColor = "#E66460";
            }
            deleteMessage();
        },
        SlideDown: function(){
            var InitHeight = DOM.Result.clientHeight;
            var Slide_Down = setInterval(function(){
                if(DOM.Result.clientHeight > (InitHeight * 0.8)){
                    DOM.Result.style.height = (DOM.Result.clientHeight - 2) + "px";
                }
                else if(DOM.Result.clientHeight > (InitHeight * 0.6)){
                    DOM.Result.style.height = (DOM.Result.clientHeight - 4) + "px";
                }
                else if(DOM.Result.clientHeight > (InitHeight * 0.4)){
                    DOM.Result.style.height = (DOM.Result.clientHeight - 6) + "px";
                }
                else if(DOM.Result.clientHeight > (InitHeight * 0.25)){
                    DOM.Result.style.height = (DOM.Result.clientHeight - 8) + "px";
                }
                else{
                    clearInterval(Slide_Down);
                    DOM.Result.style.display = "none";
                }
            } , 1);
        },
        InsertText: function(text) {
            var input = lastFocused;
            var scrollPos = input.scrollTop;
            var pos = 0;
            var browser = ((input.selectionStart || input.selectionStart == "0") ? "ff" : (document.selection ? "ie" : false ) );
            if (browser == "ie") { 
              input.focus();
              var range = document.selection.createRange();
              range.moveStart ("character", -input.value.length);
              pos = range.text.length;
            }
            else if (browser == "ff") {
                pos = input.selectionStart;
            };
            var front = (input.value).substring(0, pos);  
            var back = (input.value).substring(pos, input.value.length); 
            input.value = front+text+back;
            pos = pos + text.length;
            if (browser == "ie") { 
              input.focus();
              var range = document.selection.createRange();
              range.moveStart ("character", -input.value.length);
              range.moveStart ("character", pos);
              range.moveEnd ("character", 0);
              range.select();
            }
            else if (browser == "ff") {
              input.selectionStart = pos;
              input.selectionEnd = pos;
              input.focus();
            }
            input.scrollTop = scrollPos;
          },
          DisplayText: function(text, id){
            if(id == "complexity"){
                document.getElementById(id).innerHTML = text + "<sup style='font-size: 12px'>n</sup>";
            }
            else{
                document.getElementById(id).innerHTML = text;
            }
          }
    }
})();