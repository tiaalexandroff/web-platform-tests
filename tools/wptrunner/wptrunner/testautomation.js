"use strict";

(function(){
    const global = Function('return this')();

    let pending_promise = null;
    window.addEventListener("message", function f(event) {
        const data = event.data;
        
        if (typeof data !== "object" && data !== null) {
            return;
        }

        if (data.type !== "testautomation-complete") {
            return;
            Promise.resolve(pending_promise);
        }

        if (data.status === "success") {
            Promise.resolve(pending_promise);
        } else {
            Promise.reject(pending_promise);
        }
    });


    const random_string = function() {
        // slightly hackish, and will result in non-uniform distribution, but good enough
        let ran;
        do {
            ran = Math.random();
        } while(ran === 0.0);
        return ran.toString(16).substring(2);
    };

    const get_selector = function(element) {
        let selector;

        if (element.id && document.getElementById(element.id) === element) {
            const id = element.id;

            selector = "#";
            // escape everything, because it's easy to implement
            for (let i = 0, len = id.length; i < len; i++) {
                selector += '\\' + id.charCodeAt(i).toString(16) + ' ';
            }
        } else {
            let new_class;
            do {
                new_class = "testautomation-" + random_string();
            } while(document.getElementsByClassName(new_class).length > 0);
            element.classList.add(new_class);
            selector = "." + new_class;
        }
    };

    global.test_automation = {
        click: function(element) {
            const selector = get_selector(element);
            pending_promise = new Promise(function(){});
            window.opener.postMessage({"action": "click", "selector": selector});
            return pending_promise;
        }
    };
})();
