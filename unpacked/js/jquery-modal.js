/*
    A simple jQuery modal (http://github.com/kylefox/jquery-modal)
    Version 0.5.4
*/
(function(a){var b=null;a.modal=function(e,d){a.modal.close();var c,f;this.$body=a("body");this.options=a.extend({},a.modal.defaults,d);this.options.doFade=!isNaN(parseInt(this.options.fadeDuration,10));if(e.is("a")){f=e.attr("href");if(/^#/.test(f)){this.$elm=a(f);if(this.$elm.length!==1){return null}this.open()}else{this.$elm=a("<div>");this.$body.append(this.$elm);c=function(h,g){g.elm.remove()};this.showSpinner();e.trigger(a.modal.AJAX_SEND);a.get(f).done(function(g){if(!b){return}e.trigger(a.modal.AJAX_SUCCESS);b.$elm.empty().append(g).on(a.modal.CLOSE,c);b.hideSpinner();b.open();e.trigger(a.modal.AJAX_COMPLETE)}).fail(function(){e.trigger(a.modal.AJAX_FAIL);b.hideSpinner();e.trigger(a.modal.AJAX_COMPLETE)})}}else{this.$elm=e;this.open()}};a.modal.prototype={constructor:a.modal,open:function(){var c=this;if(this.options.doFade){this.block();setTimeout(function(){c.show()},this.options.fadeDuration*this.options.fadeDelay)}else{this.block();this.show()}if(this.options.escapeClose){a(document).on("keydown.modal",function(d){if(d.which==27){a.modal.close()}})}if(this.options.clickClose){this.blocker.click(a.modal.close)}},close:function(){this.unblock();this.hide();a(document).off("keydown.modal")},block:function(){var c=this.options.doFade?0:this.options.opacity;this.$elm.trigger(a.modal.BEFORE_BLOCK,[this._ctx()]);this.blocker=a('<div class="jquery-modal blocker"></div>').css({top:0,right:0,bottom:0,left:0,width:"100%",height:"100%",position:"fixed",zIndex:this.options.zIndex,background:this.options.overlay,opacity:c});this.$body.append(this.blocker);if(this.options.doFade){this.blocker.animate({opacity:this.options.opacity},this.options.fadeDuration)}this.$elm.trigger(a.modal.BLOCK,[this._ctx()])},unblock:function(){if(this.options.doFade){this.blocker.fadeOut(this.options.fadeDuration,function(){this.remove()})}else{this.blocker.remove()}},show:function(){this.$elm.trigger(a.modal.BEFORE_OPEN,[this._ctx()]);if(this.options.showClose){this.closeButton=a('<a href="#close-modal" rel="modal:close" class="close-modal '+this.options.closeClass+'">'+this.options.closeText+"</a>");this.$elm.append(this.closeButton)}this.$elm.addClass(this.options.modalClass+" current");this.center();if(this.options.doFade){this.$elm.fadeIn(this.options.fadeDuration)}else{this.$elm.show()}this.$elm.trigger(a.modal.OPEN,[this._ctx()])},hide:function(){this.$elm.trigger(a.modal.BEFORE_CLOSE,[this._ctx()]);if(this.closeButton){this.closeButton.remove()}this.$elm.removeClass("current");if(this.options.doFade){this.$elm.fadeOut(this.options.fadeDuration)}else{this.$elm.hide()}this.$elm.trigger(a.modal.CLOSE,[this._ctx()])},showSpinner:function(){if(!this.options.showSpinner){return}this.spinner=this.spinner||a('<div class="'+this.options.modalClass+'-spinner"></div>').append(this.options.spinnerHtml);this.$body.append(this.spinner);this.spinner.show()},hideSpinner:function(){if(this.spinner){this.spinner.remove()}},center:function(){this.$elm.css({position:"fixed",top:"15%",left:"50%",marginTop:-(this.$elm.outerHeight()/2),marginLeft:-(this.$elm.outerWidth()/2),zIndex:this.options.zIndex+1})},_ctx:function(){return{elm:this.$elm,blocker:this.blocker,options:this.options}}};a.modal.prototype.resize=a.modal.prototype.center;a.modal.close=function(d){if(!b){return}if(d){d.preventDefault()}b.close();var c=b.$elm;b=null;return c};a.modal.resize=function(){if(!b){return}b.resize()};a.modal.isActive=function(){return b?true:false};a.modal.defaults={overlay:"#000",opacity:0.75,zIndex:1,escapeClose:true,clickClose:true,closeText:"Close",closeClass:"",modalClass:"modal",spinnerHtml:null,showSpinner:true,showClose:true,fadeDuration:null,fadeDelay:1};a.modal.BEFORE_BLOCK="modal:before-block";a.modal.BLOCK="modal:block";a.modal.BEFORE_OPEN="modal:before-open";a.modal.OPEN="modal:open";a.modal.BEFORE_CLOSE="modal:before-close";a.modal.CLOSE="modal:close";a.modal.AJAX_SEND="modal:ajax:send";a.modal.AJAX_SUCCESS="modal:ajax:success";a.modal.AJAX_FAIL="modal:ajax:fail";a.modal.AJAX_COMPLETE="modal:ajax:complete";a.fn.modal=function(c){if(this.length===1){b=new a.modal(this,c)}return this};a(document).on("click.modal",'a[rel="modal:close"]',a.modal.close);a(document).on("click.modal",'a[rel="modal:open"]',function(c){c.preventDefault();a(this).modal()})})(jQuery);