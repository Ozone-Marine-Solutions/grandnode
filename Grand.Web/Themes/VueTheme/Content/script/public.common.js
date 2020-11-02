﻿function deletecartitem(href) {
    axios({
        method: "post",
        url: href
    }).then(function (response) {
        var flyoutcart = response.data.flyoutshoppingcart;
        new Vue({
            el: '.flyout-cart',
            data: {
                template: null
            },
            render: function (createElement) {
                if (!this.template) {
                    
                } else {
                    return this.template();
                }
            },
            mounted() {
                var self = this;
                self.template = Vue.compile(flyoutcart).render;
            }
        });
    }).catch(function (error) {
        alert(error);
    });
    return false;
}

function changeState() {
    function load_js_footer() {
        var boody = document.getElementsByTagName('body')[0];
        var oldscript = document.querySelector('#opc-shipping .script-footer').innerHTML;
        var newscript = document.createElement('script');
        newscript.innerHTML = oldscript;
        boody.appendChild(newscript);
    }
    load_js_footer();
}

function displayPopupPrivacyPreference(html) {
    new Vue({
        el: '#ModalPrivacyPreference',
        data: {
            template: null,
        },
        render: function (createElement) {
            if (!this.template) {
                return createElement('b-overlay', {
                    attrs: { show: 'true' }
                });
            } else {
                return this.template();
            }
        },
        methods: {
            showModal() {
                this.$refs['ModalPrivacyPreference'].show()
            }
        },
        mounted() {
            var self = this;
            self.template = Vue.compile(html).render;
        },
        updated: function () {
            this.showModal();
        }
    });
}

function displayPopupAddToCart(html) {
        new Vue({
            el: '#ModalAddToCart',
            data: {
                template: null,
            },
            render: function (createElement) {
                if (!this.template) {
                    return createElement('b-overlay', {
                        attrs: { show: 'true' }
                    });
                } else {
                    return this.template();
                }
            },
            methods: {
                showModal() {
                    this.$refs['ModalAddToCart'].show()
                }
            },
            mounted() {
                var self = this;
                self.template = Vue.compile(html).render;
            },
            updated: function () {
                this.showModal();
            }
        });
}

function displayPopupQuickView(html) {
    document.querySelector('.modal-place').innerHTML = html;
    new Vue({
        el: '#ModalQuickView',
        data: {
            template: null,
            hover: false,
            active: false
        },
        render: function (createElement) {
            if (!this.template) {
                return createElement('b-overlay', {
                    attrs: { show: 'true' }
                });
            } else {
                return this.template();
            }
        },
        methods: {
            showModal() {
                this.$refs['ModalQuickView'].show()
            },
            onShown() {
                runScripts(document.querySelector('.script-tag'))
            },
            productImage: function (event) {
                var Imagesrc = event.target.parentElement.getAttribute('data-href');
                var Image = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(".img-second")[0];
                Image.setAttribute('src', Imagesrc);
            },
            showModalBackInStock() {
                this.$refs['back-in-stock'].show()
            },
        },
        mounted() {
            var self = this;
            self.template = Vue.compile(html).render;
        },
        updated: function () {
            this.showModal();
        }
    });
}


function displayBarNotification(message, messagetype, timeout) {
    if (messagetype == 'error') {
        toastHTML = '<b-toast id="grandToast" auto-hide-delay=' + timeout +' variant="danger" title=' + messagetype +'>'+ message +'</b-toast>'
    } else {
        toastHTML = '<b-toast id="grandToast" auto-hide-delay=' + timeout +' variant="info" title=' + messagetype+'>' + message + '</b-toast>'
    }
    document.querySelector('.modal-place').innerHTML = toastHTML;
    new Vue({
        el: ".modal-place",
        methods: {
            toast() {
                this.$bvToast.show('grandToast')
            }
        },
        mounted: function () {
            this.toast();
        }
    });
}

// CSRF (XSRF) security
function addAntiForgeryToken(data) {
    //if the object is undefined, create a new one.
    if (!data) {
        data = {};
    }
    //add token
    var tokenInput = document.querySelector('input[name=__RequestVerificationToken]');
    if (tokenInput) {
        data.__RequestVerificationToken = tokenInput.value;
    }
    return data;
};

function newsletter_subscribe(subscribe) {
    var subscribeProgress = document.getElementById("subscribe-loading-progress");
    subscribeProgress.style.display = "block";
    var postData = {
        subscribe: subscribe,
        email: document.getElementById("newsletter-email").value
    };
    var href = document.getElementById("newsletterbox").getAttribute('data-href');
    axios({
        url: href,
        params: postData,
        method: 'post',
    }).then(function (response) {
        subscribeProgress.style.display = "none";
        document.getElementById("newsletter-result-block").innerHTML = response.data.Result;
        console.log(response);
        if (response.data.Success) {
            document.querySelector('.newsletter-inputs .input-group').style.display = "none";
            document.getElementById('newsletter-result-block').classList.add("d-block").style.bottom = "unset";
            if (data.response.Showcategories) {
                document.getElementById('#nc_modal_form').innerHTML = response.data.ResultCategory;
                window.setTimeout(function () {
                    //document.querySelector('.nc-action-form').magnificPopup('open');
                }, 100);
            }
        } else {
            window.setTimeout(function () {
                document.getElementById('newsletter-result-block').style.display = "none"
            }, 2000);
        }
    }).catch(function (error) {
        subscribeProgress.style.display = "none";
    })
}
window.onload = function () {
    var el = document.getElementById('newsletter-subscribe-button');
    el.onclick = function () {
        var allowToUnsubscribe = document.getElementById("newsletterbox").getAttribute('data-allowtounsubscribe').toLowerCase();
        if (allowToUnsubscribe == 'true') {
            if (document.getElementById('newsletter_subscribe').checked) {
                newsletter_subscribe('true');
            }
            else {
                newsletter_subscribe('false');
            }
        }
        else {
            newsletter_subscribe('true');
        }
    };
    document.getElementById("newsletter-email").addEventListener("keyup", function (event) {
        if (event.keyCode == 13) {
            document.getElementById("newsletter-subscribe-button").click();
        }
    });
}

// runs an array of async functions in sequential order
function seq(arr, callback, index) {
    // first call, without an index
    if (typeof index === 'undefined') {
        index = 0
    }

    arr[index](function () {
        index++
        if (index === arr.length) {
            callback()
        } else {
            seq(arr, callback, index)
        }
    })
}

// trigger DOMContentLoaded
function scriptsDone() {
    var DOMContentLoadedEvent = document.createEvent('Event')
    DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true)
    document.dispatchEvent(DOMContentLoadedEvent)
}

/* script runner
 */

function insertScript($script, callback) {
    var s = document.createElement('script')
    s.type = 'text/javascript'
    if ($script.src) {
        s.onload = callback
        s.onerror = callback
        s.src = $script.src
    } else {
        s.textContent = $script.innerText
    }

    // re-insert the script tag so it executes.
    document.body.appendChild(s)

    // clean-up
    $script.parentNode.removeChild($script)

    // run the callback immediately for inline scripts
    if (!$script.src) {
        callback()
    }
}

// https://html.spec.whatwg.org/multipage/scripting.html
var runScriptTypes = [
    'application/javascript',
    'application/ecmascript',
    'application/x-ecmascript',
    'application/x-javascript',
    'text/ecmascript',
    'text/javascript',
    'text/javascript1.0',
    'text/javascript1.1',
    'text/javascript1.2',
    'text/javascript1.3',
    'text/javascript1.4',
    'text/javascript1.5',
    'text/jscript',
    'text/livescript',
    'text/x-ecmascript',
    'text/x-javascript'
]

function runScripts($container) {
    // get scripts tags from a node
    var $scripts = $container.querySelectorAll('script')
    var runList = []
    var typeAttr

    [].forEach.call($scripts, function ($script) {
        typeAttr = $script.getAttribute('type')

        // only run script tags without the type attribute
        // or with a javascript mime attribute value
        if (!typeAttr || runScriptTypes.indexOf(typeAttr) !== -1) {
            runList.push(function (callback) {
                insertScript($script, callback)
            })
        }
    })

    // insert the script tags sequentially
    // to preserve execution order
    seq(runList, scriptsDone)
}

function sendcontactusform(urladd) {
    if (document.querySelector(".product-standard #product-details-form").checkValidity()) {
        if (document.querySelector("textarea[id^='g-recaptcha-response']")) {
            var contactData = {
                AskQuestionEmail: document.querySelector('.product-standard #AskQuestionEmail').value,
                AskQuestionFullName: document.querySelector('.product-standard #AskQuestionFullName').value,
                AskQuestionPhone: document.querySelector('.product-standard #AskQuestionPhone').value,
                AskQuestionMessage: document.querySelector('.product-standard #AskQuestionMessage').value,
                Id: document.querySelector('.product-standard #AskQuestionProductId').value,
                'g-recaptcha-response-value': document.querySelector(".product-standard textarea[id^='g-recaptcha-response']").value
            };
        } else {
            var contactData = {
                AskQuestionEmail: document.querySelector('.product-standard #AskQuestionEmail').value,
                AskQuestionFullName: document.querySelector('.product-standard #AskQuestionFullName').value,
                AskQuestionPhone: document.querySelector('.product-standard #AskQuestionPhone').value,
                AskQuestionMessage: document.querySelector('.product-standard #AskQuestionMessage').value,
                Id: document.querySelector('.product-standard #AskQuestionProductId').value
            };
        }
        addAntiForgeryToken(contactData);
        var bodyFormData = new FormData();
        bodyFormData.append('AskQuestionEmail', document.querySelector('.product-standard #AskQuestionEmail').value);
        bodyFormData.append('AskQuestionFullName', document.querySelector('.product-standard #AskQuestionFullName').value);
        bodyFormData.append('AskQuestionPhone', document.querySelector('.product-standard #AskQuestionPhone').value);
        bodyFormData.append('AskQuestionMessage', document.querySelector('.product-standard #AskQuestionMessage').value);
        bodyFormData.append('Id', document.querySelector('.product-standard #AskQuestionProductId').value);
        bodyFormData.append('__RequestVerificationToken', document.querySelector('.product-standard input[name=__RequestVerificationToken]').value);
        if (document.querySelector(".product-standard textarea[id^='g-recaptcha-response']")) {
            bodyFormData.append('g-recaptcha-response-value', document.querySelector(".product-standard textarea[id^='g-recaptcha-response']").value);
        }
        axios({
            url: urladd,
            data: bodyFormData,
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(function (response) {
            if (response.data.success) {
                document.querySelector('.product-standard #contact-us-product').style.display = "none";
                document.querySelector('.product-standard .product-contact-error').style.display = "none";
                document.querySelector('.product-standard .product-contact-send').innerHTML = response.data.message;
                document.querySelector('.product-standard .product-contact-send').style.display = "block";
            }
            else {
                document.querySelector('.product-standard .product-contact-error').innerHTML = response.data.message;
                document.querySelector('.product-standard .product-contact-error').style.display = "block";
            }
        }).catch(function (error) {
            alert(error);
        });
    }
}

function sendcontactusformQuickview(urladd) {
    if (document.querySelector("#ModalQuickView #product-details-form").checkValidity()) {
        if (document.querySelector("textarea[id^='g-recaptcha-response']")) {
            var contactData = {
                AskQuestionEmail: document.querySelector('#ModalQuickView #AskQuestionEmail').value,
                AskQuestionFullName: document.querySelector('#ModalQuickView #AskQuestionFullName').value,
                AskQuestionPhone: document.querySelector('#ModalQuickView #AskQuestionPhone').value,
                AskQuestionMessage: document.querySelector('#ModalQuickView #AskQuestionMessage').value,
                Id: document.querySelector('#ModalQuickView #AskQuestionProductId').value,
                'g-recaptcha-response-value': document.querySelector("#ModalQuickView textarea[id^='g-recaptcha-response']").value
            };
        } else {
            var contactData = {
                AskQuestionEmail: document.querySelector('#ModalQuickView #AskQuestionEmail').value,
                AskQuestionFullName: document.querySelector('#ModalQuickView #AskQuestionFullName').value,
                AskQuestionPhone: document.querySelector('#ModalQuickView #AskQuestionPhone').value,
                AskQuestionMessage: document.querySelector('#ModalQuickView #AskQuestionMessage').value,
                Id: document.querySelector('#ModalQuickView #AskQuestionProductId').value
            };
        }
        addAntiForgeryToken(contactData);
        var bodyFormData = new FormData();
        bodyFormData.append('AskQuestionEmail', document.querySelector('#ModalQuickView #AskQuestionEmail').value);
        bodyFormData.append('AskQuestionFullName', document.querySelector('#ModalQuickView #AskQuestionFullName').value);
        bodyFormData.append('AskQuestionPhone', document.querySelector('#ModalQuickView #AskQuestionPhone').value);
        bodyFormData.append('AskQuestionMessage', document.querySelector('#ModalQuickView #AskQuestionMessage').value);
        bodyFormData.append('Id', document.querySelector('#ModalQuickView #AskQuestionProductId').value);
        bodyFormData.append('__RequestVerificationToken', document.querySelector('#ModalQuickView input[name=__RequestVerificationToken]').value);
        if (document.querySelector("#ModalQuickView textarea[id^='g-recaptcha-response']")) {
            bodyFormData.append('g-recaptcha-response-value', document.querySelector("#ModalQuickView textarea[id^='g-recaptcha-response']").value);
        }
        axios({
            url: urladd,
            data: bodyFormData,
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(function (response) {
            if (response.data.success) {
                document.querySelector('#ModalQuickView #contact-us-product').style.display = "none";
                document.querySelector('#ModalQuickView .product-contact-error').style.display = "none";
                document.querySelector('#ModalQuickView .product-contact-send').innerHTML = response.data.message;
                document.querySelector('#ModalQuickView .product-contact-send').style.display = "block";
            }
            else {
                document.querySelector('#ModalQuickView .product-contact-error').innerHTML = response.data.message;
                document.querySelector('#ModalQuickView .product-contact-error').style.display = "block";
            }
        }).catch(function (error) {
            alert(error);
        });
    }
}

function GetPrivacyPreference(href) {
    axios({
        url: href,
        method: 'get',
    }).then(function (response) {
        displayPopupPrivacyPreference(response.data.html)
    }).catch(function (error) {
        alert(error);
    });
}
function SavePrivacyPreference(href) {
    var form = document.querySelector('#frmPrivacyPreference');
    var data = new FormData(form);
    axios({
        url: href,
        method: 'post',
        data: data
    }).then(function (response) {
        
    }).catch(function (error) {
        alert(error);
    });
}

function newAddress(isNew) {
    if (isNew) {
        this.resetSelectedAddress();
        document.getElementById('pickup-new-address-form').style.display = "block";
    } else {
        document.getElementById('pickup-new-address-form').style.display = "none";
    }
}

function resetSelectedAddress() {
    var selectElement = document.getElementById('pickup-address-select');
    if (selectElement) {
        selectElement.value = "";
    }
}

function displayPopupNotification(message, messagetype) {
    //types: success, error

    //we do not encode displayed message
    var htmlcode = '';
    if ((typeof message) == 'string') {
        htmlcode = '<b-modal ref="grandModal" id="grandModal" centered hide-footer><b-alert class="mb-0" show>' + message + '</b-alert></b-modal>';
        document.querySelector('.modal-place').innerHTML = htmlcode;
        new Vue({
            el: '#grandModal',
            data: {
                template: null,
                hover: false
            },
            render: function (createElement) {
                if (!this.template) {
                    return createElement('b-overlay', {
                        attrs: { show: 'true' }
                    });
                } else {
                    return this.template();
                }
            },
            methods: {
                showModal() {
                    this.$refs['grandModal'].show()
                },
            },
            mounted() {
                var self = this;
                self.template = Vue.compile(htmlcode).render;
            },
            updated: function () {
                this.showModal();
            }
        });
    } else {
            new Vue({
                el: "#app",
                methods: {
                    toast() {
                        for (var i = 0; i < message.length; i++) {
                            if (messagetype == 'error') {
                                this.$bvToast.toast(message[i], {
                                    title: messagetype,
                                    variant: 'danger',
                                    autoHideDelay: 5000,
                                })
                            } else {
                                this.$bvToast.toast(message[i], {
                                    title: messagetype,
                                    variant: 'info',
                                    autoHideDelay: 5000,
                                })
                            }
                        }
                    }
                },
                mounted: function () {
                    this.toast();
                }
            });

    }
}

/* validation */

function validation() {

    var elements = document.querySelectorAll('.form-control');

    [].forEach.call(elements, function (el) {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type == "attributes") {
                    if (el.getAttribute(mutation.attributeName) == 'true') {
                        if (el.nextSibling.nextElementSibling) {
                            el.nextSibling.nextElementSibling.style.display = "block";
                            if (el.nextSibling.nextSibling.nextElementSibling) {
                                el.nextSibling.nextSibling.nextElementSibling.style.display = "none";
                                el.nextSibling.nextElementSibling.style.display = "block";
                            }
                        }
                    } else {
                        if (el.nextSibling.nextElementSibling) {
                            el.nextSibling.nextElementSibling.style.display = "none";
                            if (el.nextSibling.nextSibling.nextElementSibling) {
                                el.nextSibling.nextSibling.nextElementSibling.style.display = "none";
                            }
                        }
                    }
                }
            });
        });

        observer.observe(el, {
            attributes: true
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    validation();
});