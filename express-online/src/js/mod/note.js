import { Toast } from "./toast";

function Note(opts) {

}

Note.prototype = {
  colors: [

  ],
  defaultOpts: {
    id: '',
    $ct: $("#content").length>0?$('#content'):$('body'),
    context: 'input here'
  },
  initOpts: function(opts) {
    this.opts = $.extend({},this.defaultOpts,opts||{});
    if(this.opts.id){
      this.id = this.opts.id;
    }
  },
  createNote: function() {
    var tpl = '<div class="note">'
    + '<div class="note-head"><span class="username"></span><span class="delete">&times;</span></div>'
    + '<div class="note-ct" contenteditable="true"></div>'
    +'</div>';
    this.$note = $(tpl);
    this.$note.find('.note-ct').text(this.opts.context);
    this.$note.find('.username').text(this.opts.username);
    this.opts.$ct.append(this.$note);
    if(!this.id) this.$note.css('bottom','10px');
  },
  setStyle: function() {
    var color = this.colors[Math.floor(Math.random()*6)];
    this.$note.find('.note-head').css('background-color',color[0]);
    this.$note.find('.note-ct').css('background-color',color[1]);
  },
  setLayout:function(){
    var self = this;
    if(self.clk){
      clearTimeout(self.clk);
    }
    self.clk = setTimeout(function(){
      Event.fire('waterfall');
    },100);
  },
  bindEvent:function() {
    var self = this,
        $note = this.$note,
        $noteHead = $note.find('.note-head'),
        $noteCt = $note.find('.note-ct'),
        $delete = $note.find('.delete');
    $delete.on('click',function(){
      self.delete();
    })
    $noteCt.on('focus',function(){
      if($noteCt.html()=='input here') $noteCt.html('');
      $noteCt.data('before',$noteCt.html());
    }).on('blur paste',function(){
      if( $noteCt.data('before') != $noteCt.html()) {
        $noteCt.data('before',$noteCt.html());
        self.setLayout();
        if(self.id){
          self.edit($noteCt.html())
        }else{
          self.add($noteCt.html())
        }
      }
    });
    //设置笔记移动
    $noteHead.on('mousedown',function(e){
      var evtX = e.pageX - $note.offset().left,
          evtY = e.pageY - $note.offset().top;
      $note.addClass('draggable').data('evtPos',{x:evtX,y:evtY});
    }).on('mouseup',function(){
        $note.removeClass('draggable').removeData('pos');
    });
    $('body').on('mousemove',function(e){
      $('.draggable').length && $('.draggable').offset({
        top: e.pageY-$('.draggable').data('evtPos').y,
        left: e.pageX-$('.draggable').data('evtPos').x  
      });
    });
  },
  edit:function (msg) {
    var self = this;
    $.post('/api/notes/edit',{
      id: this.id,
      note: msg
    }).done(function(ret){
      if(ret.status === 0){
        Toast('update success');
      }else{
        Toast('ret.errorMsg');
      }
    })
  },
  add: function (msg){
    console.log('addd...');
    var self = this;
    $.post('/api/notes/add',{note: msg})
      .done(function(ret){
        if(ret.status === 0){
          Toast('add success');
        }else{
          self.$note.remove();
          Event.fire('waterfall')
          Toast(ret.errorMsg);
        }
      });
  },
  delete: function(){
    var self = this;
    $.post('/api/notes/delete',{id: this.id})
      .done(function(ret){
        if(ret.status === 0){
          Toast('delete success');
          self.$note.remove();
          Event.fire('waterfall')
        }else{
          Toast(ret.errorMsg)
        }
      });
  }
};
