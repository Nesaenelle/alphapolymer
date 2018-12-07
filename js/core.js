(function() {
    function ELEM(params) {
        this.el = params.el || null;
    };

    ELEM.prototype.addEvent = function(type, fn) {
        this.el.addEventListener(type, fn, false);
        return this;
    };

    ELEM.prototype.removeEvent = function(type, fn) {
        this.el.removeEventListener(type, fn, false);
        return this;
    };

    ELEM.prototype.addClass = function(className) {
        this.el.classList.add(className);
        return this;
    };

    ELEM.prototype.removeClass = function(className) {
        this.el.classList.remove(className);
        return this;
    };

    ELEM.prototype.toggleClass = function(className) {
        if (this.el.classList.contains(className)) {
            this.el.classList.remove(className);
        } else {
            this.el.classList.add(className);
        }
        return this;
    };


    ELEM.prototype.find = function(selector) {
        var el = this.el.querySelector(selector);
        return el ? new ELEM({ el: el }) : null;
    };

    ELEM.prototype.findAll = function(selector) {
        var self = this;
        var els = this.el.querySelectorAll(selector);
        els = Array.prototype.slice.call(els);
        return els.map(function(el) {
            return new ELEM({ el: el });
        });
    };
    ELEM.prototype.getAttr = function(name) {
        return this.el.getAttribute(name);
    };
    ELEM.prototype.setAttr = function(name, value) {
        return this.el.setAttribute(name, value);
    };
    ELEM.prototype.hide = function(name) {
        return this.el.style.display = 'none';
    };

    ELEM.prototype.show = function(name) {
        return this.el.style.display = 'block';
    };

    ELEM.prototype.style = function(name, val) {
        this.el.style[name] = val;
    };

    function SELECTOR() {

    };

    SELECTOR.prototype.initElem = function(el) {
        return new ELEM({ el: el });
    };

    SELECTOR.prototype.find = function(selector, context) {
        var el;
        if (selector instanceof HTMLElement) {
            el = selector;
        } else {
            el = context ? context.querySelector(selector) : document.querySelector(selector);
        }

        return this.initElem(el);
    };

    SELECTOR.prototype.findAll = function(selector, context) {
        var self = this;
        var els = context ? context.querySelectorAll(selector) : document.querySelectorAll(selector);
        els = Array.prototype.slice.call(els);
        return els.map(function(o) {
            return self.initElem(o)
        });
    };

    SELECTOR.prototype.exists = function(selector, context) {
        return this.find(selector, context).el ? true : false;
    }


    window.NES_API = new API_CONSTRUCTOR();

    function API_CONSTRUCTOR() {
        this.promises = {};
        this.collection = [];
        this.SELECTOR = new SELECTOR();
        this.FORM = Form;
    };

    API_CONSTRUCTOR.prototype.add = function(name, params) {
        if (!name || typeof name !== 'string') {
            throw new Error('API ERROR');
        }

        for (var method in params) {
            if (method !== 'constructor') {
                params.constructor.prototype[method] = params[method];
            }
        }

        this.collection.push({ name: name, params: params });
        this.promises[name] = new Promise(function(resolve, reject) {
            resolve();
        });
    };

    API_CONSTRUCTOR.prototype.on = function(name) {
        return this.promises[name];
    };

    API_CONSTRUCTOR.prototype.init = function(name) {
        var self = this;
        this.collection.forEach(function(o) {
            self[o.name] = new o.params.constructor();
        });
    };











    function Form(form) {
        var self = this;
        this.controls = [];
        this.form = form;
        this.subscriptions = [];

        [].forEach.call(form.querySelectorAll('input'), function(input) {
            self.controls.push(new Input(input, self));
        });

        [].forEach.call(form.querySelectorAll('textarea'), function(input) {
            self.controls.push(new Input(input, self));
        });

        form.onsubmit = function(e) {
            e.preventDefault();
            //console.log("here is XXXX");
            var focusState = false;

            self.controls.forEach(function(ctrl) {
                if (!focusState) {
                    ctrl.input.focus();
                    if (!ctrl.validate()) {
                        focusState = true;
                    }
                }
            });

            var errors = self.controls.reduce(function(a, b) {
                b = b.valid ? 0 : 1;
                return a + b;
            }, 0);

            //console.log(errors);

            if (errors === 0) {
                self.subscriptions.forEach(function(fn) {
                    //console.log(self);
                    fn.call(self, self.getValue())
                });
                self.controls.forEach(function(ctrl) {
                    ctrl.input.value = '';
                    ctrl.clear();
                })
            }
        };
    };

    Form.prototype.validate = function() {
        this.controls.forEach(function(ctrl) {
            ctrl.validate()
        });
    };

    Form.prototype.onSubmit = function(fn) {
        this.subscriptions.push(fn);
    };

    Form.prototype.getValue = function(fn) {
        var obj = {};

        this.controls.forEach(function(ctrl) {
            obj[ctrl.name] = ctrl.value;
        });

        return obj;
    };


    function Input(input, parent) {
        var self = this;
        this.parent = parent;
        this.msg = document.createElement('div');
        this.errorMsgText = input.getAttribute('data-error-msg') || 'Field is invalid';
        this.pattern = getPattern(input.getAttribute('data-pattern'));
        this.input = input;
        this.valid = false;
        this.value = input.value;
        this.name = input.getAttribute('name');
        input.oninput = function() {
            self.value = this.type === 'checkbox' ? this.checked : this.value;
            self.validate();
        };
    }

    Input.prototype.validate = function() {
        if (this.input.getAttribute('data-pass-confirm')) {
            if (this.input.value === this.parent.form.querySelector('[data-pattern="password"]').value) {
                this.removeError();
            } else {
                this.addError();
            }
        } else {
            if (this.pattern.test(this.input.value) || this.input.checked) {
                this.removeError();
            } else {
                this.addError();
            }
        }

        // this.removeError();
        return this.valid;
    };

    Input.prototype.addError = function() {
        this.input.classList.add('invalid');
        this.input.classList.remove('valid');
        this.msg.className = 'input-error-text';
        this.msg.innerHTML = this.errorMsgText;
        // this.input.appendChild(this.msg);
        insertAfter(this.msg, this.input);
        this.valid = false;
    };

    Input.prototype.removeError = function() {
        this.input.classList.add('valid');
        this.input.classList.remove('invalid');
        // this.msg.className = 'input-msg valid';
        // this.msg.innerHTML = 'This is correct email';
        if(this.msg.parentNode) {
            this.input.parentNode.removeChild(this.msg);
        }
        this.valid = true;
    };

    Input.prototype.clear = function() {
        this.input.classList.remove('valid');
        this.input.classList.remove('invalid');
        // this.input.removeChild(this.msg);
        if (this.input.checked) {
            this.input.checked = false;
        }
        this.valid = false;
    };

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function getPattern(o) {
        var pattern;
        switch (o) {
            case 'email':
                pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                break;

            case 'login':
                pattern = /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.-]{0,19}$/;
                break;

            case 'password':
                pattern = /^(?=.*[a-zA-Z0-9])(?=.*).{7,40}$/;
                break;

            case 'checkbox':
                pattern = /^on$/;
                break;
            case 'number':
                pattern = /^[0-9.,]+$/;
                break;

            default:
                pattern = /^[\W\w]+$/;
                break;
        }

        return pattern;
    }


}());