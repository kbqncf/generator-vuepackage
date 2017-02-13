define(function (require, exports, module) {
  var SimpleValidate = function () {
    this.args = {
      allChecked: false,
      obj: '',
      validateRules: {},
      validateMessage: {},
      tipsObj: null,
      isGroupTips: true,
      callback: null
    };
  };
  SimpleValidate.prototype.method = {
    required: function (val) {
      return $.trim(val) != '';
    },
    isPhone: function (val) {
      return /^1[0-9]{10}$/.test(val);
    },
    isNum: function (val) {
      return /^[1-9]\d*$/.test(val);
    },
    strRange: function (val, arr) {
      return val.length >= arr[0] && val.length <= arr[1];
    },
    showMsg: function (msg, insertObj) {
      // insertObj.html(msg).css({'display': 'block', 'min-width': msg.length + 'em'});
      $.alert(msg,'',function () {
        console.log("callback");
      });
    }
  };
  SimpleValidate.prototype.Init = function (op) {
    var self = this;
    self.args = $.extend(self.args, op || {});
    // self.args.obj.on('blur', 'input,textarea,select', function (e) {
    //     e.stopPropagation();
    //     var _$this = $(this);
    //     _$this.removeClass('onWarning onError');
    //     if (self.args.isGroupTips) {
    //         self.args.tipsObj.html('');
    //     } else {
    //         self.args.obj.find('em.tips').hide();
    //     }
    // });
  };
  SimpleValidate.prototype.startValidate = function () {
    var _validateObj = this.args.validateRules;
    for (var inputName in _validateObj) {
      var _$currentObj = this.args.obj.find('[name=' + inputName + ']');
      for (var singleRule in _validateObj[inputName]) {
        if (_validateObj[inputName][singleRule] != true && !$.isArray(_validateObj[inputName][singleRule])) {//如果规则设置为false
          continue;
        }
        //if (!_$currentObj.is(":visible")) {//如果元素被隐藏
        //    continue;
        //}
        if (_$currentObj.css("display") == 'none') {//如果元素被隐藏
          continue;
        }
        if ($.isArray(_validateObj[inputName][singleRule]) ? this.method[singleRule]($.trim(_$currentObj.val()), _validateObj[inputName][singleRule]) : this.method[singleRule]($.trim(_$currentObj.val()))) {
          if (!this.args.isGroupTips) {
            _$currentObj.parent().find('em.tips').hide();
          }
          _$currentObj.removeClass('onWarning onError');
          continue;
        } else {
          if (!this.args.isGroupTips) {
            this.method.showMsg(this.args.validateMessage[inputName][singleRule], _$currentObj.parent().find('em.tips'));
          } else {
            this.method.showMsg(this.args.validateMessage[inputName][singleRule], this.args.tipsObj);
          }
          if (singleRule == 'required') {
            _$currentObj.addClass('onWarning');
          } else {
            _$currentObj.removeClass('onWarning').addClass('onError');
          }
          _$currentObj.focus();
          return false;
        }
      }
    }
    return true;
  };
  module.exports = SimpleValidate;
});