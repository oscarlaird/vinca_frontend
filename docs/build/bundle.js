
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    let unix_seconds = () => Math.floor(Date.now() / 1000);
    const tz_offset = (new Date().getTimezoneOffset())*60; // number of seconds between here and GMT (getTimezoneOffset returns minutes)
    let local_unix_seconds = () => unix_seconds() - tz_offset;
    let local_unix_day = () => local_unix_seconds() / 86400.0; // 86400 seconds in a day

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const card_to_edit    = writable(null);
    const card_to_preview = writable(null);
    const card_to_review  = writable(null);

    const review_start = writable(null);

    const username = writable(window.localStorage.getItem('username'));

    username.subscribe((val) => {
            if (val === window.localStorage.getItem('username')) {return}
            if (val === 'guest') {
                    // create a cached guest access token
                    const random_id = String(Math.floor(Math.random() * 10000000));
                    window.localStorage.setItem('access_token','guest'+random_id);
            }
            window.localStorage.setItem('username', val); // keep local storage in sync
    });

    const filters = writable({
                                     deleted: false, search: '',
                                     due: null, new: null,
                                     images: null, audio: null,
                                     tag: null, card_type: '',
                                     created_after: null, created_before: null,
                                     due_after: null, due_before:  null,
                            });

    const sort = writable('recent');

    // export error variables so we can show the
    // user if and how the server fails
    let api_url = "https://api.vinca.study/";

    function random_id() {
            // returns a random 15 digit id
            // We don't want to go beyond this because javascript only supports 56bit ints.
            return String(Math.floor(Math.random() * 1000000000000000))
    }

    function default_options() {
      return {
        method: 'POST',
        mode: 'cors',
        headers: {'content-type': 'application/json', 'Authorization': 'Bearer '+window.localStorage.getItem('access_token')}
      }
    }
    // metadata is needed for edits and reviews
    // it specifies the date and the number of seconds that it took to edit or review

    async function get_users_list() {
            var url = new URL(api_url + 'auth/users_list');
            var options = default_options();
            //options.headers = {}
            options.method = 'GET';
            const response = await fetch(url, options);
            return response.json();
    }

    async function get_token(username, password) {
            var url = new URL(api_url + 'auth/token');
            var fd = new FormData();
            fd.append('username', username);
            fd.append('password', password);
            const options = {
              method: 'POST',
              mode: 'cors',
              body: fd,
            };
            var success = null;
            const response = await fetch(url, options)
              .then((r) => {
                      success = r.ok; // record if our token request was sucessful
                      return r; // pass on response to error handler
              })
              .then(handle_error_response)
              .catch(fetch_error_handler);
            if (success) {
                    var token = await response.json();
                    window.localStorage.setItem('access_token', token.access_token);
                    window.localStorage.setItem('username', username);
                    return true
            } else {
                    return false
            }
    }

    async function register_and_get_token(username, password) {
            var url = new URL(api_url + 'auth/register');
            var options = default_options();
            options.body = JSON.stringify( {username: username, password: password} );
            var success = null;
            const response = await fetch(url, options)
              .then((r) => {
                      success = r.ok; // record if our token request was sucessful
                      return r; // pass on response to error handler
              })
              .then(handle_error_response)
              .catch(fetch_error_handler);
            if (success) {
                    var token = await response.json();
                    window.localStorage.setItem('access_token', token.access_token);
                    window.localStorage.setItem('username', username);
                    return true
            } else {
                    return false;
            }
    }


    async function commit_changes(card, seconds = 0) {
      const url = new URL(api_url + 'commit_card');
      const metadata = {seconds: seconds, date: local_unix_day()};
      const payload = {
              card: card,
              metadata: metadata,
      };
      let options = default_options();
      options.body = JSON.stringify( payload );
      fetch(url, options)
        .then(handle_error_response)
        .then(response => {
              const server_card = response.json();
              // update card to match server_card. Especially important is that the id of a new card is updated.
              for (var key in server_card) {
                      card[key] = server_card[key];
              }
        })
        .catch(fetch_error_handler);
    }

    function fetch_error_handler(error) {
            alert('Internet Problem: ' + error.message);
    }
    function handle_error_response(response) {
        if (response.ok) {
                return response // pass on response for processing
        } else {
            throw new Error(response.status + ':  ' + response.statusText)
        }
    }

    async function commit_grade(card_id, grade, seconds) {
        const review_params = {
                card_id: card_id,
                grade: grade,
        };
        const metadata = {seconds: seconds, date: local_unix_day()};
        const payload = {review: review_params, metadata: metadata};
        let options = default_options();
        options.body = JSON.stringify( payload );
        var url = new URL(api_url + 'review');
        fetch(url, options)
          .then(handle_error_response)
          .catch(fetch_error_handler);
    }

    async function upload_media(content, base64=true) {
            let options = default_options();
            options.body = JSON.stringify( {content: content, base64: base64} );
            var url = new URL(api_url + 'upload_media');
            var media_id = null;
            const r = await fetch(url, options)
              .then(handle_error_response)
              .catch(fetch_error_handler);
            const json = await r.json();
            media_id = await json.media_id;
            return media_id
    }

    async function get_next_two_due() {
            var options = default_options();
            const url = new URL(api_url + 'next_two_due');
            const payload = {crit: {sort: get_store_value(sort)}, filters: get_store_value(filters)};
            options.body = JSON.stringify( payload );
            const response = await fetch(url, options);
            return response.json()
    }

    async function get_due_count() {
            var options = default_options();
            const url = new URL(api_url + 'due_count');
            const payload = {filters: get_store_value(filters)};
            options.body = JSON.stringify( payload );
            const response = await fetch(url, options);
            return response.json()
    }

    async function get_created_count() {
            var options = default_options();
            const url = new URL(api_url + 'created_count');
            const payload = {filters: get_store_value(filters)};
            options.body = JSON.stringify( payload );
            const response = await fetch(url, options);
            return response.json()
    }

    async function fetch_cardlist() {
            var options = default_options();
            const url = new URL(api_url + 'cardlist');
            const payload = {crit: {sort: get_store_value(sort)}, filters: get_store_value(filters)};
            options.body = JSON.stringify( payload );
            const response = await fetch(url, options)
                  .then(handle_error_response)
                  .catch(fetch_error_handler);
            if (response && response.ok) {
                    return response.json();
            } else {
                    throw new Error('Could not retrieve cards from the server.')
            }
    }

    async function hypothetical_due_dates(card_id, date) {
            const url = new URL(api_url + 'hypothetical_due_dates');
            url.search = new URLSearchParams({card_id: card_id, date: date});
            var options = default_options();
            options.method = 'GET';
            const response = await fetch(url, options);
            const hypo_due_dates = await response.json();
            return hypo_due_dates;
    }

    async function get_collection_tags() {
            const url = new URL(api_url + 'collection_tags');
            var options = default_options();
            options.method = 'GET';
            const response = await fetch(url, options);
            return response.json();
    }

    async function fetchWithAuthentication(url) {
      new Headers();
      var options = default_options();
      options.method = 'GET';
      const response = await fetch(url, options);
      return response
    }

    async function getProtectedImage( media_id) {
      // Fetch the image.
      const url = (api_url + 'get_media?media_id=' + media_id);
      const response = await fetchWithAuthentication( url );

      // Create an object URL from the data.
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      return objectUrl
      // Update the source of the image.
    }

    async function getOcclusionData( media_id ) {
            // Occlusion cards store their data in plaintext JSON format
            // In a media record referenced by back_image_id
            // We can do this because occlusion cards don't need back images
            
            // Fetch the image.
            const url = (api_url + 'get_occlusion_data?media_id=' + media_id);
            const response = await fetchWithAuthentication( url );
            const json = await response.json();
            return JSON.parse(json)
    }

    async function purge(filters) {
            const url = new URL(api_url + 'purge');
            var options = default_options();
            options.body = JSON.stringify( filters );
            await fetch(url, options);
    }

    const due_count = derived(filters,
                                     async (filters, set) => {set(await get_due_count());} ,
                                     '-' //default
                             );

    const created_count = derived(filters,
                                     async (filters, set) => {set(await get_created_count());},
                                     '-' //default
                             );

    const next_two_due = derived([filters, sort, card_to_review],
                    async (params, set) => { const ntd = await get_next_two_due(); set(ntd); },
                    [null, null]
            );

    function new_card() {
            const current_time = local_unix_day();
            return {id: 0,
                    front_text: '', back_text: '',
                    visibility: 'visible', card_type: 'basic', scheduler: 'basic',
                    tags: '',
                    merit: 6,
                    create_date: current_time, due_date: current_time,
                    last_review_date: current_time, last_edit_date: current_time,
                    review_seconds: 0, edit_seconds: 0, total_seconds: 0,
                    front_image_id: 0, back_image_id: 0, front_audio_id: 0, back_audio_id: 0};
    }

    function dummy_card() {
            return dummy_card ={...new_card(), front_text: 'loading...'};
    }

    /* src/tristate.svelte generated by Svelte v3.48.0 */

    const file$n = "src/tristate.svelte";

    function create_fragment$n(ctx) {
    	let label;
    	let br;
    	let t0;
    	let input;
    	let input_indeterminate_value;
    	let input_checked_value;
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			br = element("br");
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			t2 = text(/*text*/ ctx[1]);
    			add_location(br, file$n, 13, 15, 472);
    			attr_dev(input, "type", "checkbox");
    			input.indeterminate = input_indeterminate_value = /*state*/ ctx[0] === false;
    			input.checked = input_checked_value = /*state*/ ctx[0] != null;
    			add_location(input, file$n, 14, 2, 479);
    			attr_dev(label, "class", "svelte-1skhkuc");
    			set_style(label, "color", /*color*/ ctx[2], false);
    			set_style(label, "display", 'inline', false);
    			add_location(label, file$n, 12, 0, 404);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			append_dev(label, br);
    			append_dev(label, t0);
    			append_dev(label, input);
    			append_dev(label, t1);
    			append_dev(label, t2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*cycle_state*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*state*/ 1 && input_indeterminate_value !== (input_indeterminate_value = /*state*/ ctx[0] === false)) {
    				prop_dev(input, "indeterminate", input_indeterminate_value);
    			}

    			if (!current || dirty & /*state*/ 1 && input_checked_value !== (input_checked_value = /*state*/ ctx[0] != null)) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (!current || dirty & /*text*/ 2) set_data_dev(t2, /*text*/ ctx[1]);

    			if (dirty & /*color*/ 4) {
    				set_style(label, "color", /*color*/ ctx[2], false);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let color;
    	let text;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tristate', slots, ['default']);
    	let { state = null } = $$props;
    	let states = [null, true, false];
    	let state_idx = states.indexOf(state); // initial state idx

    	function cycle_state() {
    		$$invalidate(4, state_idx = (state_idx + 1) % states.length);
    	}

    	const writable_props = ['state'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tristate> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		state,
    		states,
    		state_idx,
    		cycle_state,
    		text,
    		color
    	});

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    		if ('states' in $$props) $$invalidate(7, states = $$props.states);
    		if ('state_idx' in $$props) $$invalidate(4, state_idx = $$props.state_idx);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*state_idx*/ 16) {
    			$$invalidate(0, state = states[state_idx]);
    		}

    		if ($$self.$$.dirty & /*state*/ 1) {
    			$$invalidate(2, color = ({
    				null: 'black',
    				true: 'darkgreen',
    				false: 'red'
    			})[state]);
    		}

    		if ($$self.$$.dirty & /*state*/ 1) {
    			$$invalidate(1, text = ({ null: 'any', true: 'yes', false: 'no' })[state]);
    		}
    	};

    	return [state, text, color, cycle_state, state_idx, $$scope, slots];
    }

    class Tristate extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tristate",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get state() {
    		throw new Error("<Tristate>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Tristate>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/review_button.svelte generated by Svelte v3.48.0 */
    const file$m = "src/review_button.svelte";

    function create_fragment$m(ctx) {
    	let button;
    	let div0;
    	let t0;
    	let svg;
    	let path0;
    	let path1;
    	let rect0;
    	let path2;
    	let circle0;
    	let circle1;
    	let circle2;
    	let circle3;
    	let circle4;
    	let circle5;
    	let path3;
    	let path4;
    	let rect1;
    	let rect2;
    	let rect3;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div0 = element("div");
    			t0 = text("Review\n    ");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			rect0 = svg_element("rect");
    			path2 = svg_element("path");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			circle4 = svg_element("circle");
    			circle5 = svg_element("circle");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			rect1 = svg_element("rect");
    			rect2 = svg_element("rect");
    			rect3 = svg_element("rect");
    			t1 = space();
    			div1 = element("div");
    			t2 = text(/*due_count_plus*/ ctx[0]);
    			t3 = text(" cards due");
    			set_style(path0, "fill", "none");
    			set_style(path0, "stroke", "#008000");
    			set_style(path0, "stroke-width", "4");
    			set_style(path0, "stroke-linecap", "butt");
    			set_style(path0, "stroke-linejoin", "miter");
    			set_style(path0, "stroke-opacity", "1");
    			set_style(path0, "stroke-miterlimit", "4");
    			set_style(path0, "stroke-dasharray", "none");
    			attr_dev(path0, "d", "m 168.08981,266.41346 0,-196.733878");
    			add_location(path0, file$m, 14, 10, 415);
    			set_style(path1, "fill", "none");
    			set_style(path1, "stroke", "#008000");
    			set_style(path1, "stroke-width", "1px");
    			set_style(path1, "stroke-linecap", "butt");
    			set_style(path1, "stroke-linejoin", "miter");
    			set_style(path1, "stroke-opacity", "1");
    			attr_dev(path1, "d", "M 113.40393,266.41346 H 222.7757");
    			add_location(path1, file$m, 18, 10, 662);
    			set_style(rect0, "opacity", "1");
    			set_style(rect0, "fill", "#008000");
    			set_style(rect0, "fill-opacity", "1");
    			set_style(rect0, "stroke", "#008000");
    			set_style(rect0, "stroke-width", "1.07730699");
    			set_style(rect0, "stroke-miterlimit", "4");
    			set_style(rect0, "stroke-dasharray", "none");
    			set_style(rect0, "stroke-dashoffset", "0");
    			set_style(rect0, "stroke-opacity", "1");
    			attr_dev(rect0, "width", "15.23763");
    			attr_dev(rect0, "height", "15.23763");
    			attr_dev(rect0, "x", "70.657272");
    			attr_dev(rect0, "y", "252.84714");
    			attr_dev(rect0, "rx", "0");
    			attr_dev(rect0, "ry", "6.2100134");
    			attr_dev(rect0, "transform", "matrix(0.49621774,-0.86819811,0.49621774,0.86819811,0,0)");
    			add_location(rect0, file$m, 22, 10, 866);
    			set_style(path2, "fill", "#008000");
    			set_style(path2, "fill-opacity", "1");
    			set_style(path2, "stroke", "#008000");
    			set_style(path2, "stroke-width", "1px");
    			set_style(path2, "stroke-linecap", "butt");
    			set_style(path2, "stroke-linejoin", "miter");
    			set_style(path2, "stroke-opacity", "1");
    			attr_dev(path2, "d", "m 113.40393,266.41346 54.68588,-15.63159 54.68589,15.63159");
    			add_location(path2, file$m, 32, 10, 1320);
    			set_style(circle0, "opacity", "1");
    			set_style(circle0, "fill", "#008000");
    			set_style(circle0, "fill-opacity", "1");
    			set_style(circle0, "stroke", "#008000");
    			set_style(circle0, "stroke-width", "1");
    			set_style(circle0, "stroke-miterlimit", "4");
    			set_style(circle0, "stroke-dasharray", "none");
    			set_style(circle0, "stroke-dashoffset", "0");
    			set_style(circle0, "stroke-opacity", "1");
    			attr_dev(circle0, "cx", "247.97658");
    			attr_dev(circle0, "cy", "142.35379");
    			attr_dev(circle0, "r", "4.0321393");
    			add_location(circle0, file$m, 36, 10, 1568);
    			attr_dev(circle1, "r", "4.0321393");
    			attr_dev(circle1, "cy", "151.99362");
    			attr_dev(circle1, "cx", "247.97658");
    			set_style(circle1, "opacity", "1");
    			set_style(circle1, "fill", "#008000");
    			set_style(circle1, "fill-opacity", "1");
    			set_style(circle1, "stroke", "#008000");
    			set_style(circle1, "stroke-width", "1");
    			set_style(circle1, "stroke-miterlimit", "4");
    			set_style(circle1, "stroke-dasharray", "none");
    			set_style(circle1, "stroke-dashoffset", "0");
    			set_style(circle1, "stroke-opacity", "1");
    			add_location(circle1, file$m, 41, 10, 1840);
    			set_style(circle2, "opacity", "1");
    			set_style(circle2, "fill", "#008000");
    			set_style(circle2, "fill-opacity", "1");
    			set_style(circle2, "stroke", "#008000");
    			set_style(circle2, "stroke-width", "1");
    			set_style(circle2, "stroke-miterlimit", "4");
    			set_style(circle2, "stroke-dasharray", "none");
    			set_style(circle2, "stroke-dashoffset", "0");
    			set_style(circle2, "stroke-opacity", "1");
    			attr_dev(circle2, "cx", "247.97658");
    			attr_dev(circle2, "cy", "161.63345");
    			attr_dev(circle2, "r", "4.0321393");
    			add_location(circle2, file$m, 46, 10, 2112);
    			attr_dev(circle3, "r", "4.0321393");
    			attr_dev(circle3, "cy", "171.27328");
    			attr_dev(circle3, "cx", "247.97658");
    			set_style(circle3, "opacity", "1");
    			set_style(circle3, "fill", "#008000");
    			set_style(circle3, "fill-opacity", "1");
    			set_style(circle3, "stroke", "#008000");
    			set_style(circle3, "stroke-width", "1");
    			set_style(circle3, "stroke-miterlimit", "4");
    			set_style(circle3, "stroke-dasharray", "none");
    			set_style(circle3, "stroke-dashoffset", "0");
    			set_style(circle3, "stroke-opacity", "1");
    			add_location(circle3, file$m, 51, 10, 2384);
    			set_style(circle4, "opacity", "1");
    			set_style(circle4, "fill", "#008000");
    			set_style(circle4, "fill-opacity", "1");
    			set_style(circle4, "stroke", "#008000");
    			set_style(circle4, "stroke-width", "1");
    			set_style(circle4, "stroke-miterlimit", "4");
    			set_style(circle4, "stroke-dasharray", "none");
    			set_style(circle4, "stroke-dashoffset", "0");
    			set_style(circle4, "stroke-opacity", "1");
    			attr_dev(circle4, "cx", "247.97658");
    			attr_dev(circle4, "cy", "180.91312");
    			attr_dev(circle4, "r", "4.0321393");
    			add_location(circle4, file$m, 56, 10, 2656);
    			attr_dev(circle5, "r", "4.0321393");
    			attr_dev(circle5, "cy", "190.55295");
    			attr_dev(circle5, "cx", "247.97658");
    			set_style(circle5, "opacity", "1");
    			set_style(circle5, "fill", "#008000");
    			set_style(circle5, "fill-opacity", "1");
    			set_style(circle5, "stroke", "#008000");
    			set_style(circle5, "stroke-width", "1");
    			set_style(circle5, "stroke-miterlimit", "4");
    			set_style(circle5, "stroke-dasharray", "none");
    			set_style(circle5, "stroke-dashoffset", "0");
    			set_style(circle5, "stroke-opacity", "1");
    			add_location(circle5, file$m, 61, 10, 2928);
    			set_style(path3, "opacity", "1");
    			set_style(path3, "fill", "#008000");
    			set_style(path3, "fill-opacity", "1");
    			set_style(path3, "stroke", "#008000");
    			set_style(path3, "stroke-width", "1.75496578");
    			set_style(path3, "stroke-miterlimit", "4");
    			set_style(path3, "stroke-dasharray", "none");
    			set_style(path3, "stroke-dashoffset", "0");
    			set_style(path3, "stroke-opacity", "1");
    			attr_dev(path3, "r", "7.0762668");
    			attr_dev(path3, "cy", "203.25423");
    			attr_dev(path3, "cx", "247.97658");
    			add_location(path3, file$m, 66, 10, 3200);
    			set_style(path4, "fill", "#008000");
    			set_style(path4, "stroke", "#008000");
    			set_style(path4, "stroke-width", "1px");
    			set_style(path4, "stroke-linecap", "butt");
    			set_style(path4, "stroke-linejoin", "miter");
    			set_style(path4, "stroke-opacity", "1");
    			set_style(path4, "fill-opacity", "1");
    			attr_dev(path4, "d", "m 39.769243,134.97217 c 4.692467,4.30517 252.308817,3.945 256.641117,0 4.3323,-3.945 -13.34213,-49.792447 -33.81729,-58.573276 -20.47516,-8.780829 -171.052555,-9.140997 -189.006528,0 C 55.632569,85.539891 35.076776,130.667 39.769243,134.97217 Z");
    			add_location(path4, file$m, 71, 10, 3479);
    			attr_dev(rect1, "transform", "matrix(0.49621774,-0.86819811,0.49621774,0.86819811,0,0)");
    			attr_dev(rect1, "ry", "6.2100134");
    			attr_dev(rect1, "rx", "0");
    			attr_dev(rect1, "y", "267.24478");
    			attr_dev(rect1, "x", "56.259636");
    			attr_dev(rect1, "height", "15.23763");
    			attr_dev(rect1, "width", "15.23763");
    			set_style(rect1, "opacity", "1");
    			set_style(rect1, "fill", "#008000");
    			set_style(rect1, "fill-opacity", "1");
    			set_style(rect1, "stroke", "#008000");
    			set_style(rect1, "stroke-width", "1.07730699");
    			set_style(rect1, "stroke-miterlimit", "4");
    			set_style(rect1, "stroke-dasharray", "none");
    			set_style(rect1, "stroke-dashoffset", "0");
    			set_style(rect1, "stroke-opacity", "1");
    			add_location(rect1, file$m, 75, 10, 3913);
    			set_style(rect2, "opacity", "1");
    			set_style(rect2, "fill", "#008000");
    			set_style(rect2, "fill-opacity", "1");
    			set_style(rect2, "stroke", "#008000");
    			set_style(rect2, "stroke-width", "1.07730699");
    			set_style(rect2, "stroke-miterlimit", "4");
    			set_style(rect2, "stroke-dasharray", "none");
    			set_style(rect2, "stroke-dashoffset", "0");
    			set_style(rect2, "stroke-opacity", "1");
    			attr_dev(rect2, "width", "15.23763");
    			attr_dev(rect2, "height", "15.23763");
    			attr_dev(rect2, "x", "41.862");
    			attr_dev(rect2, "y", "281.64243");
    			attr_dev(rect2, "rx", "0");
    			attr_dev(rect2, "ry", "6.2100134");
    			attr_dev(rect2, "transform", "matrix(0.49621774,-0.86819811,0.49621774,0.86819811,0,0)");
    			add_location(rect2, file$m, 84, 10, 4354);
    			attr_dev(rect3, "transform", "matrix(0.49621774,-0.86819811,0.49621774,0.86819811,0,0)");
    			attr_dev(rect3, "ry", "6.2100134");
    			attr_dev(rect3, "rx", "0");
    			attr_dev(rect3, "y", "296.04007");
    			attr_dev(rect3, "x", "27.464363");
    			attr_dev(rect3, "height", "15.23763");
    			attr_dev(rect3, "width", "15.23763");
    			set_style(rect3, "opacity", "1");
    			set_style(rect3, "fill", "#008000");
    			set_style(rect3, "fill-opacity", "1");
    			set_style(rect3, "stroke", "#008000");
    			set_style(rect3, "stroke-width", "1.07730699");
    			set_style(rect3, "stroke-miterlimit", "4");
    			set_style(rect3, "stroke-dasharray", "none");
    			set_style(rect3, "stroke-dashoffset", "0");
    			set_style(rect3, "stroke-opacity", "1");
    			add_location(rect3, file$m, 94, 10, 4805);
    			attr_dev(svg, "id", "svg_lamp");
    			attr_dev(svg, "viewBox", "10 30 300 330");
    			attr_dev(svg, "class", "svelte-1a4uwcd");
    			add_location(svg, file$m, 13, 4, 361);
    			attr_dev(div0, "id", "review_text");
    			attr_dev(div0, "class", "svelte-1a4uwcd");
    			add_location(div0, file$m, 11, 2, 317);
    			attr_dev(div1, "id", "due_count");
    			attr_dev(div1, "class", "svelte-1a4uwcd");
    			add_location(div1, file$m, 105, 10, 5264);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "svelte-1a4uwcd");
    			add_location(button, file$m, 10, 0, 273);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div0);
    			append_dev(div0, t0);
    			append_dev(div0, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, rect0);
    			append_dev(svg, path2);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    			append_dev(svg, circle3);
    			append_dev(svg, circle4);
    			append_dev(svg, circle5);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, rect1);
    			append_dev(svg, rect2);
    			append_dev(svg, rect3);
    			append_dev(button, t1);
    			append_dev(button, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*forward*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*due_count_plus*/ 1) set_data_dev(t2, /*due_count_plus*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let due_count_plus;
    	let $due_count;
    	validate_store(due_count, 'due_count');
    	component_subscribe($$self, due_count, $$value => $$invalidate(2, $due_count = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Review_button', slots, []);
    	const dispatch = createEventDispatcher();

    	function forward() {
    		dispatch('click');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Review_button> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		due_count,
    		createEventDispatcher,
    		dispatch,
    		forward,
    		due_count_plus,
    		$due_count
    	});

    	$$self.$inject_state = $$props => {
    		if ('due_count_plus' in $$props) $$invalidate(0, due_count_plus = $$props.due_count_plus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$due_count*/ 4) {
    			$$invalidate(0, due_count_plus = $due_count + (due_count >= 50 ? '+' : ''));
    		}
    	};

    	return [due_count_plus, forward, $due_count];
    }

    class Review_button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Review_button",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src/create_button.svelte generated by Svelte v3.48.0 */
    const file$l = "src/create_button.svelte";

    function create_fragment$l(ctx) {
    	let button;
    	let div0;
    	let t0;
    	let svg;
    	let path;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div0 = element("div");
    			t0 = text("Create\n  ");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t1 = space();
    			div1 = element("div");
    			t2 = text(/*$created_count*/ ctx[0]);
    			t3 = text(" created today");
    			attr_dev(path, "id", "path1910");
    			attr_dev(path, "d", "M 20.382927,148.85388 C 15.003029,148.16236 14.991336,148.14842 15.375994,142.88543 C 15.813941,136.89333 17.052355,127.55395 17.666511,125.61171 C 18.305239,123.59175 20.350833,121.89374 24.794224,119.69508 C 26.752539,118.72608 28.354799,117.66442 28.354799,117.33583 C 28.354799,116.98214 27.507949,116.67713 26.279055,116.58822 L 24.203311,116.43803 L 24.203311,113.01916 L 24.203311,109.60029 L 30.064235,109.46249 C 35.570572,109.33302 35.956118,109.25915 36.4369,108.24146 C 36.718361,107.64569 37.625642,105.83953 38.453082,104.22777 C 39.280517,102.61602 40.856261,99.429148 41.954725,97.14583 C 43.053194,94.862511 44.719601,91.675634 45.657847,90.06388 C 46.596097,88.452126 47.519437,86.803742 47.709712,86.400803 C 47.899987,85.997865 48.623069,84.785425 49.316567,83.706488 C 50.706988,81.543285 50.694583,81.563251 54.318904,75.655777 C 58.801182,68.349867 61.534175,64.940177 73.10987,52.212083 C 80.455986,44.134634 86.176135,38.478062 91.115521,34.406551 C 92.9959,32.856567 97.236723,29.059064 100.53957,25.967657 C 103.84242,22.876249 106.65476,20.456928 106.78922,20.591388 C 106.92368,20.725847 106.24607,22.454263 105.28341,24.43231 C 104.32075,26.410352 103.60236,28.469905 103.68698,29.009085 C 103.78676,29.644864 104.83183,28.00443 106.66047,24.341641 C 109.31491,19.024743 109.67775,18.545955 112.85377,16.169199 C 114.70929,14.780629 118.26972,12.575733 120.76584,11.269429 C 125.88481,8.5904968 129.50678,6.4897841 133.20157,4.0568016 C 137.51721,1.2149961 137.67943,1.9571883 134.11919,8.2551567 C 132.98028,10.269849 131.50101,13.127047 130.83191,14.604489 C 130.16282,16.08193 127.89704,20.477622 125.79685,24.372694 C 121.15259,32.986049 119.95628,35.216419 117.28278,40.246029 C 115.15812,44.243115 113.76355,46.079963 112.22319,46.910201 C 111.74425,47.168346 108.33759,48.432601 104.65283,49.719662 C 100.96807,51.006726 97.034091,52.530473 95.91066,53.105771 C 92.287676,54.961056 92.764926,55.946317 96.443754,54.206316 C 99.724572,52.654568 110.8196,49.042286 111.18442,49.407104 C 111.70937,49.932052 107.20784,55.743998 95.204355,70.039059 C 93.399845,72.188064 90.186349,76.034295 88.063254,78.586239 C 84.049635,83.41058 81.681412,85.408476 79.93196,85.44601 C 79.367275,85.458127 78.245909,85.769953 77.440033,86.138962 L 75.974802,86.809876 L 78.294751,86.849545 C 79.570722,86.871362 80.614699,87.07373 80.614699,87.299254 C 80.614699,87.672707 78.036948,89.863915 72.628185,94.088157 C 67.964922,97.730164 59.857116,101.7988 50.931418,104.97597 C 49.514339,105.48039 46.991788,106.61733 45.325752,107.50249 L 42.296592,109.11188 L 45.704417,109.35608 L 49.112236,109.60029 L 49.112236,113.01916 L 49.112236,116.43803 L 47.280697,116.58962 C 45.41941,116.74366 44.875198,117.59154 46.059672,118.49197 C 46.395454,118.74724 47.769108,119.35421 49.112236,119.8408 C 50.628867,120.39025 52.387168,121.5789 53.752134,122.97747 C 55.854359,125.13144 55.987255,125.44191 56.806725,130.11352 C 57.277933,132.79978 57.805563,137.79273 57.979232,141.20897 L 58.294999,147.42031 L 57.022055,147.90428 C 53.410422,149.27742 28.667093,149.9187 20.382927,148.85388 z ");
    			set_style(path, "fill", "purple");
    			add_location(path, file$l, 17, 2, 374);
    			attr_dev(svg, "id", "svg_inkwell");
    			attr_dev(svg, "viewBox", "0 5 150 205");
    			attr_dev(svg, "version", "1.0");
    			attr_dev(svg, "class", "svelte-4e9y69");
    			add_location(svg, file$l, 12, 2, 300);
    			attr_dev(div0, "id", "create_text");
    			attr_dev(div0, "class", "svelte-4e9y69");
    			add_location(div0, file$l, 10, 2, 258);
    			attr_dev(div1, "id", "due_count");
    			attr_dev(div1, "class", "svelte-4e9y69");
    			add_location(div1, file$l, 23, 2, 3556);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "svelte-4e9y69");
    			add_location(button, file$l, 9, 0, 214);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div0);
    			append_dev(div0, t0);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(button, t1);
    			append_dev(button, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*forward*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$created_count*/ 1) set_data_dev(t2, /*$created_count*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let $created_count;
    	validate_store(created_count, 'created_count');
    	component_subscribe($$self, created_count, $$value => $$invalidate(0, $created_count = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Create_button', slots, []);
    	const dispatch = createEventDispatcher();

    	function forward() {
    		dispatch('click');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Create_button> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		created_count,
    		createEventDispatcher,
    		dispatch,
    		forward,
    		$created_count
    	});

    	return [$created_count, forward];
    }

    class Create_button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Create_button",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    const info = writable(null);

    /* src/card.svelte generated by Svelte v3.48.0 */
    const file$k = "src/card.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let html_tag;
    	let t6;
    	let span0;
    	let t7;
    	let t8;
    	let span1;

    	let t9_value = (!/*card*/ ctx[0].front_text
    	? '(blank)'
    	: /*card*/ ctx[0].front_text) + "";

    	let t9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "✕";
    			t1 = text(" \n    ");
    			button1 = element("button");
    			button1.textContent = "👁";
    			t3 = text(" \n    ");
    			button2 = element("button");
    			button2.textContent = "✍";
    			t5 = text(" \n    ");
    			html_tag = new HtmlTag(false);
    			t6 = space();
    			span0 = element("span");
    			t7 = text("due ");
    			t8 = space();
    			span1 = element("span");
    			t9 = text(t9_value);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "button svelte-1h67b8b");
    			set_style(button0, "color", 'darkred', false);
    			add_location(button0, file$k, 75, 4, 3155);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "button svelte-1h67b8b");
    			add_location(button1, file$k, 76, 4, 3262);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "button svelte-1h67b8b");
    			add_location(button2, file$k, 77, 4, 3340);
    			html_tag.a = t6;
    			attr_dev(span0, "class", "front_text svelte-1h67b8b");
    			set_style(span0, "color", "purple");
    			set_style(span0, "display", /*due_alert*/ ctx[2]);
    			set_style(span0, "font-size", '14px', false);
    			add_location(span0, file$k, 79, 4, 3437);
    			attr_dev(span1, "class", "front_text svelte-1h67b8b");
    			set_style(span1, "text-decoration", /*text_decoration*/ ctx[3]);
    			add_location(span1, file$k, 81, 4, 3555);
    			attr_dev(div, "class", "card_container svelte-1h67b8b");
    			add_location(div, file$k, 74, 0, 3122);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(div, t3);
    			append_dev(div, button2);
    			append_dev(div, t5);
    			html_tag.m(/*extra_info*/ ctx[1], div);
    			append_dev(div, t6);
    			append_dev(div, span0);
    			append_dev(span0, t7);
    			append_dev(div, t8);
    			append_dev(div, span1);
    			append_dev(span1, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*toggle_delete*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*preview*/ ctx[5], false, false, false),
    					listen_dev(button2, "click", /*edit*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*extra_info*/ 2) html_tag.p(/*extra_info*/ ctx[1]);

    			if (dirty & /*due_alert*/ 4) {
    				set_style(span0, "display", /*due_alert*/ ctx[2]);
    			}

    			if (dirty & /*card*/ 1 && t9_value !== (t9_value = (!/*card*/ ctx[0].front_text
    			? '(blank)'
    			: /*card*/ ctx[0].front_text) + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*text_decoration*/ 8) {
    				set_style(span1, "text-decoration", /*text_decoration*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let text_decoration;
    	let is_due;
    	let due_alert;
    	let extra_info;
    	let $info;
    	validate_store(info, 'info');
    	component_subscribe($$self, info, $$value => $$invalidate(8, $info = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);

    	async function toggle_delete() {
    		$$invalidate(0, card.visibility = card.visibility === 'visible' ? 'deleted' : 'visible', card);

    		//notify API
    		commit_changes(card);
    	}

    	function preview() {
    		card_to_preview.set(card);
    	}

    	function edit() {
    		card_to_edit.set(card);
    	}

    	let { card } = $$props;
    	let current_time = local_unix_day();

    	function get_extra_info($info) {
    		switch ($info) {
    			case '':
    				return '';
    			case 'create_date':
    				return 'Created <b><mark>' + Math.trunc(current_time - card[$info]) + '</mark></b> days ago';
    			case 'due_date':
    				return 'Due in <b><mark>' + Math.trunc(card[$info] - current_time) + '</mark></b> days';
    			case 'last_review_date':
    				return 'Last reviewed <b><mark>' + Math.trunc(current_time - card[$info]) + '</mark></b> days ago';
    			case 'last_edit_date':
    				return 'Last edited <b><mark>' + Math.trunc(current_time - card[$info]) + '</mark></b> days ago';
    			case 'review_seconds':
    				return 'Spent <b><mark>' + Math.floor(card[$info]) + '</mark></b> seconds reviewing';
    			case 'edit_seconds':
    				return 'Spent <b><mark>' + Math.floor(card[$info]) + '</mark></b> seconds editing';
    			case 'total_seconds':
    				return 'Spent <b><mark>' + Math.floor(card[$info]) + '</mark></b> seconds';
    			case 'card_type':
    				return '<b><mark>' + card[$info] + '</mark></b>';
    			case 'tags':
    				return 'tags: <b><mark>' + card[$info] + '</mark></b>';
    			case 'merit':
    				return '<b><mark>' + card[$info] + '</mark></b>';
    			default:
    				return '';
    		}
    	}

    	const writable_props = ['card'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    	};

    	$$self.$capture_state = () => ({
    		local_unix_day,
    		commit_changes,
    		info,
    		card_to_edit,
    		card_to_preview,
    		toggle_delete,
    		preview,
    		edit,
    		card,
    		current_time,
    		get_extra_info,
    		extra_info,
    		is_due,
    		due_alert,
    		text_decoration,
    		$info
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('current_time' in $$props) $$invalidate(9, current_time = $$props.current_time);
    		if ('extra_info' in $$props) $$invalidate(1, extra_info = $$props.extra_info);
    		if ('is_due' in $$props) $$invalidate(7, is_due = $$props.is_due);
    		if ('due_alert' in $$props) $$invalidate(2, due_alert = $$props.due_alert);
    		if ('text_decoration' in $$props) $$invalidate(3, text_decoration = $$props.text_decoration);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*card*/ 1) {
    			$$invalidate(3, text_decoration = card.visibility === 'deleted' ? 'line-through' : '');
    		}

    		if ($$self.$$.dirty & /*card*/ 1) {
    			$$invalidate(7, is_due = card.due_date < current_time);
    		}

    		if ($$self.$$.dirty & /*is_due, card*/ 129) {
    			$$invalidate(2, due_alert = is_due && card.visibility === 'visible'
    			? 'inline'
    			: 'none');
    		}

    		if ($$self.$$.dirty & /*$info*/ 256) {
    			$$invalidate(1, extra_info = get_extra_info($info));
    		}
    	};

    	return [
    		card,
    		extra_info,
    		due_alert,
    		text_decoration,
    		toggle_delete,
    		preview,
    		edit,
    		is_due,
    		$info
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { card: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*card*/ ctx[0] === undefined && !('card' in props)) {
    			console.warn("<Card> was created without expected prop 'card'");
    		}
    	}

    	get card() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const collection_tags = writable([]);

    async function load_tags() {
      const loaded_tags = await get_collection_tags();
      collection_tags.set(loaded_tags);
    }
    load_tags();

    /* src/info_tooltip.svelte generated by Svelte v3.48.0 */
    const file$j = "src/info_tooltip.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let span0;
    	let t1;
    	let span1;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			span0.textContent = "?";
    			t1 = space();
    			span1 = element("span");
    			attr_dev(span0, "class", "question_mark svelte-1d9etfy");
    			add_location(span0, file$j, 27, 1, 920);
    			attr_dev(span1, "class", "tooltiptext svelte-1d9etfy");
    			add_location(span1, file$j, 28, 8, 965);
    			attr_dev(div, "class", "tooltip svelte-1d9etfy");
    			add_location(div, file$j, 26, 0, 877);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			span1.innerHTML = /*text*/ ctx[0];
    			/*span1_binding*/ ctx[5](span1);
    			/*div_binding*/ ctx[6](div);

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) span1.innerHTML = /*text*/ ctx[0];		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*span1_binding*/ ctx[5](null);
    			/*div_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info_tooltip', slots, []);
    	let { text } = $$props;
    	let tooltip;
    	let tooltiptext;
    	let innerWidth; // width of the whole window

    	onMount(() => {
    		// Do some gymnastics so that if the info icon
    		// is on the edge of the screen the tooltip help
    		// text will still be entirely on the screen
    		// usually it is centered below info icon
    		const rect = tooltip.getBoundingClientRect();

    		const left_margin = rect.left;
    		const right_margin = innerWidth - rect.right;

    		if (left_margin < 120) {
    			$$invalidate(2, tooltiptext.style['margin-left'] = '-' + left_margin + 'px', tooltiptext);
    		} else if (right_margin < 120) {
    			$$invalidate(2, tooltiptext.style['margin-left'] = '-' + (240 - right_margin) + 'px', tooltiptext);
    		} else {
    			$$invalidate(2, tooltiptext.style['margin-left'] = '-120px', tooltiptext);
    		}
    	});

    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info_tooltip> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(3, innerWidth = window.innerWidth);
    	}

    	function span1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tooltiptext = $$value;
    			$$invalidate(2, tooltiptext);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tooltip = $$value;
    			$$invalidate(1, tooltip);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		text,
    		tooltip,
    		tooltiptext,
    		innerWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('tooltip' in $$props) $$invalidate(1, tooltip = $$props.tooltip);
    		if ('tooltiptext' in $$props) $$invalidate(2, tooltiptext = $$props.tooltiptext);
    		if ('innerWidth' in $$props) $$invalidate(3, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		text,
    		tooltip,
    		tooltiptext,
    		innerWidth,
    		onwindowresize,
    		span1_binding,
    		div_binding
    	];
    }

    class Info_tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info_tooltip",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Info_tooltip> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<Info_tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Info_tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/advanced_filters.svelte generated by Svelte v3.48.0 */
    const file$i = "src/advanced_filters.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (39:0) <Tristate bind:state={$filters['due']}>
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("due:");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(39:0) <Tristate bind:state={$filters['due']}>",
    		ctx
    	});

    	return block;
    }

    // (40:0) <Tristate bind:state={$filters['new']}>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("new:");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(40:0) <Tristate bind:state={$filters['new']}>",
    		ctx
    	});

    	return block;
    }

    // (41:0) <Tristate bind:state={$filters['deleted']}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("deleted:");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(41:0) <Tristate bind:state={$filters['deleted']}>",
    		ctx
    	});

    	return block;
    }

    // (42:0) {#if $filters.deleted}
    function create_if_block$8(ctx) {
    	let button;
    	let t;
    	let infotooltip;
    	let current;
    	let mounted;
    	let dispose;

    	infotooltip = new Info_tooltip({
    			props: {
    				text: 'Purged cards will never be seen again.<br><br>(However, vinca never destroys data and it is possible to manually recover purged cards from the database).'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("purge\n                ");
    			create_component(infotooltip.$$.fragment);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "svelte-qm6084");
    			set_style(button, "border-radius", '4px', false);
    			set_style(button, "color", 'red', false);
    			add_location(button, file$i, 42, 8, 1318);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			mount_component(infotooltip, button, null);
    			/*button_binding*/ ctx[9](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*ask_purge*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infotooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infotooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(infotooltip);
    			/*button_binding*/ ctx[9](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(42:0) {#if $filters.deleted}",
    		ctx
    	});

    	return block;
    }

    // (47:0) <Tristate bind:state={$filters['images']}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("images:");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(47:0) <Tristate bind:state={$filters['images']}>",
    		ctx
    	});

    	return block;
    }

    // (48:0) <Tristate bind:state={$filters['audio']}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("audio:");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(48:0) <Tristate bind:state={$filters['audio']}>",
    		ctx
    	});

    	return block;
    }

    // (90:8) {#each $collection_tags as tag}
    function create_each_block$7(ctx) {
    	let option;
    	let t_value = /*tag*/ ctx[17] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*tag*/ ctx[17];
    			option.value = option.__value;
    			add_location(option, file$i, 90, 16, 2869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$collection_tags*/ 16 && t_value !== (t_value = /*tag*/ ctx[17] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$collection_tags*/ 16 && option_value_value !== (option_value_value = /*tag*/ ctx[17])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(90:8) {#each $collection_tags as tag}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div3;
    	let div0;
    	let tristate0;
    	let updating_state;
    	let t0;
    	let tristate1;
    	let updating_state_1;
    	let t1;
    	let tristate2;
    	let updating_state_2;
    	let t2;
    	let t3;
    	let tristate3;
    	let updating_state_3;
    	let t4;
    	let tristate4;
    	let updating_state_4;
    	let t5;
    	let div1;
    	let span0;
    	let t6;
    	let select0;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t10;
    	let span1;
    	let t11;
    	let select1;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let option12;
    	let option13;
    	let t21;
    	let div2;
    	let span2;
    	let t22;
    	let select2;
    	let option14;
    	let option15;
    	let option16;
    	let option17;
    	let option18;
    	let option19;
    	let t29;
    	let span3;
    	let t30;
    	let select3;
    	let option20;
    	let current;
    	let mounted;
    	let dispose;

    	function tristate0_state_binding(value) {
    		/*tristate0_state_binding*/ ctx[6](value);
    	}

    	let tristate0_props = {
    		$$slots: { default: [create_default_slot_4] },
    		$$scope: { ctx }
    	};

    	if (/*$filters*/ ctx[3]['due'] !== void 0) {
    		tristate0_props.state = /*$filters*/ ctx[3]['due'];
    	}

    	tristate0 = new Tristate({ props: tristate0_props, $$inline: true });
    	binding_callbacks.push(() => bind(tristate0, 'state', tristate0_state_binding));

    	function tristate1_state_binding(value) {
    		/*tristate1_state_binding*/ ctx[7](value);
    	}

    	let tristate1_props = {
    		$$slots: { default: [create_default_slot_3] },
    		$$scope: { ctx }
    	};

    	if (/*$filters*/ ctx[3]['new'] !== void 0) {
    		tristate1_props.state = /*$filters*/ ctx[3]['new'];
    	}

    	tristate1 = new Tristate({ props: tristate1_props, $$inline: true });
    	binding_callbacks.push(() => bind(tristate1, 'state', tristate1_state_binding));

    	function tristate2_state_binding(value) {
    		/*tristate2_state_binding*/ ctx[8](value);
    	}

    	let tristate2_props = {
    		$$slots: { default: [create_default_slot_2] },
    		$$scope: { ctx }
    	};

    	if (/*$filters*/ ctx[3]['deleted'] !== void 0) {
    		tristate2_props.state = /*$filters*/ ctx[3]['deleted'];
    	}

    	tristate2 = new Tristate({ props: tristate2_props, $$inline: true });
    	binding_callbacks.push(() => bind(tristate2, 'state', tristate2_state_binding));
    	let if_block = /*$filters*/ ctx[3].deleted && create_if_block$8(ctx);

    	function tristate3_state_binding(value) {
    		/*tristate3_state_binding*/ ctx[10](value);
    	}

    	let tristate3_props = {
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	};

    	if (/*$filters*/ ctx[3]['images'] !== void 0) {
    		tristate3_props.state = /*$filters*/ ctx[3]['images'];
    	}

    	tristate3 = new Tristate({ props: tristate3_props, $$inline: true });
    	binding_callbacks.push(() => bind(tristate3, 'state', tristate3_state_binding));

    	function tristate4_state_binding(value) {
    		/*tristate4_state_binding*/ ctx[11](value);
    	}

    	let tristate4_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*$filters*/ ctx[3]['audio'] !== void 0) {
    		tristate4_props.state = /*$filters*/ ctx[3]['audio'];
    	}

    	tristate4 = new Tristate({ props: tristate4_props, $$inline: true });
    	binding_callbacks.push(() => bind(tristate4, 'state', tristate4_state_binding));
    	let each_value = /*$collection_tags*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			create_component(tristate0.$$.fragment);
    			t0 = space();
    			create_component(tristate1.$$.fragment);
    			t1 = space();
    			create_component(tristate2.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			create_component(tristate3.$$.fragment);
    			t4 = space();
    			create_component(tristate4.$$.fragment);
    			t5 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t6 = text("Type:\n");
    			select0 = element("select");
    			option0 = element("option");
    			option1 = element("option");
    			option1.textContent = "basic";
    			option2 = element("option");
    			option2.textContent = "verses";
    			option3 = element("option");
    			option3.textContent = "occlusion";
    			t10 = space();
    			span1 = element("span");
    			t11 = text("Info: \n");
    			select1 = element("select");
    			option4 = element("option");
    			option5 = element("option");
    			option5.textContent = "created";
    			option6 = element("option");
    			option6.textContent = "due date";
    			option7 = element("option");
    			option7.textContent = "last review";
    			option8 = element("option");
    			option8.textContent = "editing time";
    			option9 = element("option");
    			option9.textContent = "review time";
    			option10 = element("option");
    			option10.textContent = "total time";
    			option11 = element("option");
    			option11.textContent = "card type";
    			option12 = element("option");
    			option12.textContent = "tags";
    			option13 = element("option");
    			option13.textContent = "merit";
    			t21 = space();
    			div2 = element("div");
    			span2 = element("span");
    			t22 = text("Sort: \n");
    			select2 = element("select");
    			option14 = element("option");
    			option14.textContent = "recent";
    			option15 = element("option");
    			option15.textContent = "old";
    			option16 = element("option");
    			option16.textContent = "overdue";
    			option17 = element("option");
    			option17.textContent = "total time";
    			option18 = element("option");
    			option18.textContent = "random";
    			option19 = element("option");
    			option19.textContent = "merit";
    			t29 = space();
    			span3 = element("span");
    			t30 = text("Tag: \n");
    			select3 = element("select");
    			option20 = element("option");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "tristates svelte-qm6084");
    			add_location(div0, file$i, 37, 0, 1087);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$i, 54, 8, 1878);
    			option1.__value = "basic";
    			option1.value = option1.__value;
    			add_location(option1, file$i, 55, 1, 1897);
    			option2.__value = "verses";
    			option2.value = option2.__value;
    			add_location(option2, file$i, 56, 1, 1921);
    			option3.__value = "occlusion";
    			option3.value = option3.__value;
    			add_location(option3, file$i, 57, 1, 1946);
    			attr_dev(select0, "class", "svelte-qm6084");
    			if (/*$filters*/ ctx[3]['card_type'] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[12].call(select0));
    			add_location(select0, file$i, 53, 0, 1826);
    			add_location(span0, file$i, 51, 0, 1813);
    			option4.__value = "";
    			option4.value = option4.__value;
    			add_location(option4, file$i, 62, 8, 2039);
    			option5.__value = "create_date";
    			option5.value = option5.__value;
    			add_location(option5, file$i, 63, 1, 2058);
    			option6.__value = "due_date";
    			option6.value = option6.__value;
    			add_location(option6, file$i, 64, 1, 2104);
    			option7.__value = "last_review_date";
    			option7.value = option7.__value;
    			add_location(option7, file$i, 65, 1, 2148);
    			option8.__value = "edit_seconds";
    			option8.value = option8.__value;
    			add_location(option8, file$i, 66, 1, 2203);
    			option9.__value = "review_seconds";
    			option9.value = option9.__value;
    			add_location(option9, file$i, 67, 1, 2255);
    			option10.__value = "total_seconds";
    			option10.value = option10.__value;
    			add_location(option10, file$i, 68, 1, 2308);
    			option11.__value = "card_type";
    			option11.value = option11.__value;
    			add_location(option11, file$i, 69, 1, 2359);
    			option12.__value = "tags";
    			option12.value = option12.__value;
    			add_location(option12, file$i, 70, 1, 2405);
    			option13.__value = "merit";
    			option13.value = option13.__value;
    			add_location(option13, file$i, 71, 1, 2441);
    			attr_dev(select1, "class", "svelte-qm6084");
    			if (/*info*/ ctx[0] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[13].call(select1));
    			add_location(select1, file$i, 61, 0, 2004);
    			add_location(span1, file$i, 59, 0, 1990);
    			attr_dev(div1, "class", "selectors svelte-qm6084");
    			add_location(div1, file$i, 50, 0, 1789);
    			option14.__value = "recent";
    			option14.value = option14.__value;
    			add_location(option14, file$i, 78, 1, 2569);
    			option15.__value = "old";
    			option15.value = option15.__value;
    			add_location(option15, file$i, 79, 1, 2594);
    			option16.__value = "overdue";
    			option16.value = option16.__value;
    			add_location(option16, file$i, 80, 1, 2616);
    			option17.__value = "total time";
    			option17.value = option17.__value;
    			add_location(option17, file$i, 81, 1, 2642);
    			option18.__value = "random";
    			option18.value = option18.__value;
    			add_location(option18, file$i, 82, 1, 2671);
    			option19.__value = "merit";
    			option19.value = option19.__value;
    			add_location(option19, file$i, 83, 1, 2696);
    			attr_dev(select2, "class", "svelte-qm6084");
    			if (/*$sort*/ ctx[1] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[14].call(select2));
    			add_location(select2, file$i, 77, 0, 2540);
    			add_location(span2, file$i, 75, 0, 2526);
    			option20.__value = "";
    			option20.value = option20.__value;
    			add_location(option20, file$i, 88, 8, 2795);
    			attr_dev(select3, "class", "svelte-qm6084");
    			if (/*$filters*/ ctx[3]['tag'] === void 0) add_render_callback(() => /*select3_change_handler*/ ctx[15].call(select3));
    			add_location(select3, file$i, 87, 0, 2749);
    			add_location(span3, file$i, 85, 0, 2736);
    			attr_dev(div2, "class", "selectors svelte-qm6084");
    			add_location(div2, file$i, 74, 0, 2502);
    			attr_dev(div3, "class", "master svelte-qm6084");
    			add_location(div3, file$i, 36, 0, 1066);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			mount_component(tristate0, div0, null);
    			append_dev(div0, t0);
    			mount_component(tristate1, div0, null);
    			append_dev(div0, t1);
    			mount_component(tristate2, div0, null);
    			append_dev(div0, t2);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div0, t3);
    			mount_component(tristate3, div0, null);
    			append_dev(div0, t4);
    			mount_component(tristate4, div0, null);
    			append_dev(div3, t5);
    			append_dev(div3, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t6);
    			append_dev(span0, select0);
    			append_dev(select0, option0);
    			append_dev(select0, option1);
    			append_dev(select0, option2);
    			append_dev(select0, option3);
    			select_option(select0, /*$filters*/ ctx[3]['card_type']);
    			append_dev(div1, t10);
    			append_dev(div1, span1);
    			append_dev(span1, t11);
    			append_dev(span1, select1);
    			append_dev(select1, option4);
    			append_dev(select1, option5);
    			append_dev(select1, option6);
    			append_dev(select1, option7);
    			append_dev(select1, option8);
    			append_dev(select1, option9);
    			append_dev(select1, option10);
    			append_dev(select1, option11);
    			append_dev(select1, option12);
    			append_dev(select1, option13);
    			select_option(select1, /*info*/ ctx[0]);
    			append_dev(div3, t21);
    			append_dev(div3, div2);
    			append_dev(div2, span2);
    			append_dev(span2, t22);
    			append_dev(span2, select2);
    			append_dev(select2, option14);
    			append_dev(select2, option15);
    			append_dev(select2, option16);
    			append_dev(select2, option17);
    			append_dev(select2, option18);
    			append_dev(select2, option19);
    			select_option(select2, /*$sort*/ ctx[1]);
    			append_dev(div2, t29);
    			append_dev(div2, span3);
    			append_dev(span3, t30);
    			append_dev(span3, select3);
    			append_dev(select3, option20);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select3, null);
    			}

    			select_option(select3, /*$filters*/ ctx[3]['tag']);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[12]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[13]),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[14]),
    					listen_dev(select3, "change", /*select3_change_handler*/ ctx[15])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const tristate0_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				tristate0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state && dirty & /*$filters*/ 8) {
    				updating_state = true;
    				tristate0_changes.state = /*$filters*/ ctx[3]['due'];
    				add_flush_callback(() => updating_state = false);
    			}

    			tristate0.$set(tristate0_changes);
    			const tristate1_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				tristate1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state_1 && dirty & /*$filters*/ 8) {
    				updating_state_1 = true;
    				tristate1_changes.state = /*$filters*/ ctx[3]['new'];
    				add_flush_callback(() => updating_state_1 = false);
    			}

    			tristate1.$set(tristate1_changes);
    			const tristate2_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				tristate2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state_2 && dirty & /*$filters*/ 8) {
    				updating_state_2 = true;
    				tristate2_changes.state = /*$filters*/ ctx[3]['deleted'];
    				add_flush_callback(() => updating_state_2 = false);
    			}

    			tristate2.$set(tristate2_changes);

    			if (/*$filters*/ ctx[3].deleted) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$filters*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, t3);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const tristate3_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				tristate3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state_3 && dirty & /*$filters*/ 8) {
    				updating_state_3 = true;
    				tristate3_changes.state = /*$filters*/ ctx[3]['images'];
    				add_flush_callback(() => updating_state_3 = false);
    			}

    			tristate3.$set(tristate3_changes);
    			const tristate4_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				tristate4_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state_4 && dirty & /*$filters*/ 8) {
    				updating_state_4 = true;
    				tristate4_changes.state = /*$filters*/ ctx[3]['audio'];
    				add_flush_callback(() => updating_state_4 = false);
    			}

    			tristate4.$set(tristate4_changes);

    			if (dirty & /*$filters*/ 8) {
    				select_option(select0, /*$filters*/ ctx[3]['card_type']);
    			}

    			if (dirty & /*info*/ 1) {
    				select_option(select1, /*info*/ ctx[0]);
    			}

    			if (dirty & /*$sort*/ 2) {
    				select_option(select2, /*$sort*/ ctx[1]);
    			}

    			if (dirty & /*$collection_tags*/ 16) {
    				each_value = /*$collection_tags*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$filters*/ 8) {
    				select_option(select3, /*$filters*/ ctx[3]['tag']);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tristate0.$$.fragment, local);
    			transition_in(tristate1.$$.fragment, local);
    			transition_in(tristate2.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(tristate3.$$.fragment, local);
    			transition_in(tristate4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tristate0.$$.fragment, local);
    			transition_out(tristate1.$$.fragment, local);
    			transition_out(tristate2.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(tristate3.$$.fragment, local);
    			transition_out(tristate4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(tristate0);
    			destroy_component(tristate1);
    			destroy_component(tristate2);
    			if (if_block) if_block.d();
    			destroy_component(tristate3);
    			destroy_component(tristate4);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $sort;
    	let $filters;
    	let $global_info;
    	let $collection_tags;
    	validate_store(sort, 'sort');
    	component_subscribe($$self, sort, $$value => $$invalidate(1, $sort = $$value));
    	validate_store(filters, 'filters');
    	component_subscribe($$self, filters, $$value => $$invalidate(3, $filters = $$value));
    	validate_store(info, 'global_info');
    	component_subscribe($$self, info, $$value => $$invalidate(16, $global_info = $$value));
    	validate_store(collection_tags, 'collection_tags');
    	component_subscribe($$self, collection_tags, $$value => $$invalidate(4, $collection_tags = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Advanced_filters', slots, []);
    	let info$1 = $global_info;
    	let purge_button;

    	function ask_purge() {
    		if (confirm('Purge deleted cards?')) {
    			purge($filters);
    			$$invalidate(2, purge_button.style.display = 'none', purge_button);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Advanced_filters> was created with unknown prop '${key}'`);
    	});

    	function tristate0_state_binding(value) {
    		if ($$self.$$.not_equal($filters['due'], value)) {
    			$filters['due'] = value;
    			filters.set($filters);
    		}
    	}

    	function tristate1_state_binding(value) {
    		if ($$self.$$.not_equal($filters['new'], value)) {
    			$filters['new'] = value;
    			filters.set($filters);
    		}
    	}

    	function tristate2_state_binding(value) {
    		if ($$self.$$.not_equal($filters['deleted'], value)) {
    			$filters['deleted'] = value;
    			filters.set($filters);
    		}
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			purge_button = $$value;
    			$$invalidate(2, purge_button);
    		});
    	}

    	function tristate3_state_binding(value) {
    		if ($$self.$$.not_equal($filters['images'], value)) {
    			$filters['images'] = value;
    			filters.set($filters);
    		}
    	}

    	function tristate4_state_binding(value) {
    		if ($$self.$$.not_equal($filters['audio'], value)) {
    			$filters['audio'] = value;
    			filters.set($filters);
    		}
    	}

    	function select0_change_handler() {
    		$filters['card_type'] = select_value(this);
    		filters.set($filters);
    	}

    	function select1_change_handler() {
    		info$1 = select_value(this);
    		($$invalidate(0, info$1), $$invalidate(1, $sort));
    	}

    	function select2_change_handler() {
    		$sort = select_value(this);
    		sort.set($sort);
    	}

    	function select3_change_handler() {
    		$filters['tag'] = select_value(this);
    		filters.set($filters);
    	}

    	$$self.$capture_state = () => ({
    		purge,
    		global_info: info,
    		collection_tags,
    		filters,
    		sort,
    		Tristate,
    		InfoTooltip: Info_tooltip,
    		info: info$1,
    		purge_button,
    		ask_purge,
    		$sort,
    		$filters,
    		$global_info,
    		$collection_tags
    	});

    	$$self.$inject_state = $$props => {
    		if ('info' in $$props) $$invalidate(0, info$1 = $$props.info);
    		if ('purge_button' in $$props) $$invalidate(2, purge_button = $$props.purge_button);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$sort*/ 2) {
    			switch ($sort) {
    				case 'old':
    					$$invalidate(0, info$1 = 'create_date');
    					break;
    				case 'overdue':
    					$$invalidate(0, info$1 = 'due_date');
    					break;
    				case 'total time':
    					$$invalidate(0, info$1 = 'total_seconds');
    					break;
    				case 'merit':
    					$$invalidate(0, info$1 = 'merit');
    					break;
    				default:
    					$$invalidate(0, info$1 = null);
    					break;
    			}
    		}

    		if ($$self.$$.dirty & /*info*/ 1) {
    			info.set(info$1); // update global_info when info (LOCAL) changes
    		}
    	};

    	return [
    		info$1,
    		$sort,
    		purge_button,
    		$filters,
    		$collection_tags,
    		ask_purge,
    		tristate0_state_binding,
    		tristate1_state_binding,
    		tristate2_state_binding,
    		button_binding,
    		tristate3_state_binding,
    		tristate4_state_binding,
    		select0_change_handler,
    		select1_change_handler,
    		select2_change_handler,
    		select3_change_handler
    	];
    }

    class Advanced_filters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Advanced_filters",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/filters.svelte generated by Svelte v3.48.0 */
    const file$h = "src/filters.svelte";

    function create_fragment$h(ctx) {
    	let center;
    	let t0;
    	let input;
    	let t1;
    	let button;
    	let t2;
    	let t3;
    	let b;
    	let t4;
    	let t5;
    	let div;
    	let advancedfilters;
    	let current;
    	let mounted;
    	let dispose;
    	advancedfilters = new Advanced_filters({ $$inline: true });

    	const block = {
    		c: function create() {
    			center = element("center");
    			t0 = text("Search: ");
    			input = element("input");
    			t1 = space();
    			button = element("button");
    			t2 = text(/*more_or_less*/ ctx[1]);
    			t3 = text(" Filters ");
    			b = element("b");
    			t4 = text(/*pointer*/ ctx[2]);
    			t5 = space();
    			div = element("div");
    			create_component(advancedfilters.$$.fragment);
    			attr_dev(input, "type", "search");
    			add_location(input, file$h, 12, 8, 276);
    			add_location(b, file$h, 15, 31, 405);
    			attr_dev(button, "type", "button");
    			add_location(button, file$h, 14, 0, 333);
    			add_location(center, file$h, 10, 0, 258);
    			set_style(div, "display", /*open*/ ctx[0] ? 'block' : 'none', false);
    			add_location(div, file$h, 27, 0, 688);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, t0);
    			append_dev(center, input);
    			set_input_value(input, /*$filters*/ ctx[3]['search']);
    			append_dev(center, t1);
    			append_dev(center, button);
    			append_dev(button, t2);
    			append_dev(button, t3);
    			append_dev(button, b);
    			append_dev(b, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(advancedfilters, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(button, "click", /*toggle*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$filters*/ 8) {
    				set_input_value(input, /*$filters*/ ctx[3]['search']);
    			}

    			if (!current || dirty & /*more_or_less*/ 2) set_data_dev(t2, /*more_or_less*/ ctx[1]);
    			if (!current || dirty & /*pointer*/ 4) set_data_dev(t4, /*pointer*/ ctx[2]);

    			if (dirty & /*open*/ 1) {
    				set_style(div, "display", /*open*/ ctx[0] ? 'block' : 'none', false);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(advancedfilters.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(advancedfilters.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div);
    			destroy_component(advancedfilters);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let pointer;
    	let more_or_less;
    	let $filters;
    	validate_store(filters, 'filters');
    	component_subscribe($$self, filters, $$value => $$invalidate(3, $filters = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filters', slots, []);
    	let open = false;

    	let toggle = () => {
    		$$invalidate(0, open = !open);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filters> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$filters['search'] = this.value;
    		filters.set($filters);
    	}

    	$$self.$capture_state = () => ({
    		filters,
    		AdvancedFilters: Advanced_filters,
    		open,
    		toggle,
    		more_or_less,
    		pointer,
    		$filters
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('toggle' in $$props) $$invalidate(4, toggle = $$props.toggle);
    		if ('more_or_less' in $$props) $$invalidate(1, more_or_less = $$props.more_or_less);
    		if ('pointer' in $$props) $$invalidate(2, pointer = $$props.pointer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			$$invalidate(2, pointer = open ? '-' : '+');
    		}

    		if ($$self.$$.dirty & /*open*/ 1) {
    			$$invalidate(1, more_or_less = open ? 'Less' : 'More');
    		}
    	};

    	return [open, more_or_less, pointer, $filters, toggle, input_input_handler];
    }

    class Filters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filters",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/card_column.svelte generated by Svelte v3.48.0 */
    const file$g = "src/card_column.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (14:0) {#each cards as card}
    function create_each_block$6(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: { card: /*card*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};
    			if (dirty & /*cards*/ 1) card_changes.card = /*card*/ ctx[4];
    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(14:0) {#each cards as card}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let current;
    	let each_value = /*cards*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div, "height", `fit-content`, false);
    			add_location(div, file$g, 12, 0, 226);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			/*div_binding*/ ctx[3](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*cards*/ 1) {
    				each_value = /*cards*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			/*div_binding*/ ctx[3](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card_column', slots, []);
    	let { cards = [] } = $$props;
    	let { height = 0 } = $$props;
    	let col;

    	afterUpdate(() => {
    		$$invalidate(2, height = col.clientHeight);
    	});

    	const writable_props = ['cards', 'height'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card_column> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			col = $$value;
    			$$invalidate(1, col);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('cards' in $$props) $$invalidate(0, cards = $$props.cards);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    	};

    	$$self.$capture_state = () => ({ afterUpdate, Card, cards, height, col });

    	$$self.$inject_state = $$props => {
    		if ('cards' in $$props) $$invalidate(0, cards = $$props.cards);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('col' in $$props) $$invalidate(1, col = $$props.col);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cards, col, height, div_binding];
    }

    class Card_column extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { cards: 0, height: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card_column",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get cards() {
    		throw new Error("<Card_column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cards(value) {
    		throw new Error("<Card_column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Card_column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Card_column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/masonry.svelte generated by Svelte v3.48.0 */
    const file$f = "src/masonry.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[7] = list;
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (31:0) {#each [...Array(cols).keys()] as offset}
    function create_each_block$5(ctx) {
    	let column;
    	let updating_height;
    	let current;

    	function column_height_binding(value) {
    		/*column_height_binding*/ ctx[5](value, /*offset*/ ctx[6]);
    	}

    	let column_props = {
    		cards: /*col_contents*/ ctx[1][/*offset*/ ctx[6]]
    	};

    	if (/*col_heights*/ ctx[2][/*offset*/ ctx[6]] !== void 0) {
    		column_props.height = /*col_heights*/ ctx[2][/*offset*/ ctx[6]];
    	}

    	column = new Card_column({ props: column_props, $$inline: true });
    	binding_callbacks.push(() => bind(column, 'height', column_height_binding));

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const column_changes = {};
    			if (dirty & /*col_contents, cols*/ 3) column_changes.cards = /*col_contents*/ ctx[1][/*offset*/ ctx[6]];

    			if (!updating_height && dirty & /*col_heights, Array, cols*/ 5) {
    				updating_height = true;
    				column_changes.height = /*col_heights*/ ctx[2][/*offset*/ ctx[6]];
    				add_flush_callback(() => updating_height = false);
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(31:0) {#each [...Array(cols).keys()] as offset}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let current;
    	let each_value = [...Array(/*cols*/ ctx[0]).keys()];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "columns svelte-1yx9avh");
    			set_style(div, "grid-template-columns", /*template*/ ctx[3], false);
    			add_location(div, file$f, 25, 0, 706);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*col_contents, Array, cols, col_heights*/ 7) {
    				each_value = [...Array(/*cols*/ ctx[0]).keys()];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Masonry', slots, []);
    	let { cards = [] } = $$props;
    	let { cols } = $$props;
    	let template = Array(cols).fill(Math.floor(100 / cols) + '%').join(' ');
    	let col_contents = [];

    	for (let _ of Array(cols)) {
    		col_contents.push([]);
    	}

    	let col_heights = Array(cols).fill(0);

    	onMount(async () => {
    		let shortest_col;

    		for (let card of cards) {
    			await tick(); //wait for col_heights to update
    			shortest_col = col_heights.indexOf(Math.min(...col_heights));
    			col_contents[shortest_col].push(card);
    			$$invalidate(1, col_contents);
    		}
    	});

    	const writable_props = ['cards', 'cols'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Masonry> was created with unknown prop '${key}'`);
    	});

    	function column_height_binding(value, offset) {
    		if ($$self.$$.not_equal(col_heights[offset], value)) {
    			col_heights[offset] = value;
    			$$invalidate(2, col_heights);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('cards' in $$props) $$invalidate(4, cards = $$props.cards);
    		if ('cols' in $$props) $$invalidate(0, cols = $$props.cols);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		tick,
    		Column: Card_column,
    		cards,
    		cols,
    		template,
    		col_contents,
    		col_heights
    	});

    	$$self.$inject_state = $$props => {
    		if ('cards' in $$props) $$invalidate(4, cards = $$props.cards);
    		if ('cols' in $$props) $$invalidate(0, cols = $$props.cols);
    		if ('template' in $$props) $$invalidate(3, template = $$props.template);
    		if ('col_contents' in $$props) $$invalidate(1, col_contents = $$props.col_contents);
    		if ('col_heights' in $$props) $$invalidate(2, col_heights = $$props.col_heights);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cols, col_contents, col_heights, template, cards, column_height_binding];
    }

    class Masonry extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { cards: 4, cols: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Masonry",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*cols*/ ctx[0] === undefined && !('cols' in props)) {
    			console.warn("<Masonry> was created without expected prop 'cols'");
    		}
    	}

    	get cards() {
    		throw new Error("<Masonry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cards(value) {
    		throw new Error("<Masonry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Masonry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Masonry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/loading.svelte generated by Svelte v3.48.0 */
    const file$e = "src/loading.svelte";

    function create_fragment$e(ctx) {
    	let pre;
    	let t0;
    	let t1_value = /*frames*/ ctx[1][/*idx*/ ctx[0]] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			t0 = text("Loading... ");
    			t1 = text(t1_value);
    			set_style(pre, "font-family", `monospace`, false);
    			set_style(pre, "font-size", `20px`, false);
    			add_location(pre, file$e, 8, 0, 223);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			append_dev(pre, t0);
    			append_dev(pre, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*idx*/ 1 && t1_value !== (t1_value = /*frames*/ ctx[1][/*idx*/ ctx[0]] + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	const frames = ['-', '/', '|', '\\'];
    	let idx = 0;

    	const rotator = setInterval(
    		() => {
    			$$invalidate(0, idx += 1);
    			$$invalidate(0, idx %= frames.length);
    		},
    		90
    	);

    	onDestroy(() => {
    		clearInterval(rotator);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onDestroy, frames, idx, rotator });

    	$$self.$inject_state = $$props => {
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [idx, frames];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/home.svelte generated by Svelte v3.48.0 */
    const file$d = "src/home.svelte";

    // (39:0) {:else}
    function create_else_block$1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let a0;
    	let t4;
    	let a1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Hello, ");
    			t1 = text(/*$username*/ ctx[2]);
    			t2 = space();
    			a0 = element("a");
    			a0.textContent = "sign out";
    			t4 = text(" or\n        ");
    			a1 = element("a");
    			a1.textContent = "switch account";
    			attr_dev(a0, "class", "login_button svelte-4whwfg");
    			add_location(a0, file$d, 40, 8, 1254);
    			attr_dev(a1, "class", "login_button svelte-4whwfg");
    			add_location(a1, file$d, 41, 8, 1343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, a1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler_1*/ ctx[9], false, false, false),
    					listen_dev(a1, "click", /*click_handler_2*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$username*/ 4) set_data_dev(t1, /*$username*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(a1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(39:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (36:0) {#if $username === 'guest'}
    function create_if_block$7(ctx) {
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Welcome, guest\n        ");
    			button = element("button");
    			button.textContent = "login / register";
    			attr_dev(button, "class", "login_button svelte-4whwfg");
    			attr_dev(button, "type", "button");
    			add_location(button, file$d, 37, 8, 1106);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(36:0) {#if $username === 'guest'}",
    		ctx
    	});

    	return block;
    }

    // (65:0) {:catch error}
    function create_catch_block(ctx) {
    	let p;
    	let t_value = /*error*/ ctx[13].message + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "color", "red");
    			add_location(p, file$d, 65, 3, 1871);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(65:0) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (61:0) {:then cards}
    function create_then_block(ctx) {
    	let previous_key = /*cols*/ ctx[1];
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block_2(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cols*/ 2 && safe_not_equal(previous_key, previous_key = /*cols*/ ctx[1])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block_2(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(61:0) {:then cards}",
    		ctx
    	});

    	return block;
    }

    // (62:3) {#key cols}
    function create_key_block_2(ctx) {
    	let masonry;
    	let current;

    	masonry = new Masonry({
    			props: {
    				cards: /*cards*/ ctx[12],
    				cols: /*cols*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(masonry.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(masonry, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const masonry_changes = {};
    			if (dirty & /*cols*/ 2) masonry_changes.cols = /*cols*/ ctx[1];
    			masonry.$set(masonry_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(masonry.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(masonry.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(masonry, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block_2.name,
    		type: "key",
    		source: "(62:3) {#key cols}",
    		ctx
    	});

    	return block;
    }

    // (59:25)     <p><Loading /></p> {:then cards}
    function create_pending_block(ctx) {
    	let p;
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			p = element("p");
    			create_component(loading.$$.fragment);
    			add_location(p, file$d, 59, 3, 1752);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			mount_component(loading, p, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_component(loading);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(59:25)     <p><Loading /></p> {:then cards}",
    		ctx
    	});

    	return block;
    }

    // (58:0) {#key $sort}
    function create_key_block_1(ctx) {
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 12,
    		error: 13,
    		blocks: [,,,]
    	};

    	handle_promise(fetch_cardlist(), info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block_1.name,
    		type: "key",
    		source: "(58:0) {#key $sort}",
    		ctx
    	});

    	return block;
    }

    // (57:0) {#key {...$filters} }
    function create_key_block$1(ctx) {
    	let previous_key = /*$sort*/ ctx[4];
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block_1(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$sort*/ 16 && safe_not_equal(previous_key, previous_key = /*$sort*/ ctx[4])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block_1(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block$1.name,
    		type: "key",
    		source: "(57:0) {#key {...$filters} }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let body;
    	let div1;
    	let t0;
    	let a;
    	let t2;
    	let div0;
    	let reviewbutton;
    	let t3;
    	let createbutton;
    	let t4;
    	let div2;
    	let filters_1;
    	let t5;
    	let previous_key = { .../*$filters*/ ctx[3] };
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[7]);

    	function select_block_type(ctx, dirty) {
    		if (/*$username*/ ctx[2] === 'guest') return create_if_block$7;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	reviewbutton = new Review_button({ $$inline: true });
    	reviewbutton.$on("click", /*review*/ ctx[6]);
    	createbutton = new Create_button({ $$inline: true });
    	createbutton.$on("click", /*create_card*/ ctx[5]);
    	filters_1 = new Filters({ $$inline: true });
    	let key_block = create_key_block$1(ctx);

    	const block = {
    		c: function create() {
    			body = element("body");
    			div1 = element("div");
    			if_block.c();
    			t0 = space();
    			a = element("a");
    			a.textContent = "Links";
    			t2 = space();
    			div0 = element("div");
    			create_component(reviewbutton.$$.fragment);
    			t3 = space();
    			create_component(createbutton.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			create_component(filters_1.$$.fragment);
    			t5 = space();
    			key_block.c();
    			set_style(a, "float", "right");
    			set_style(a, "position", "relative");
    			attr_dev(a, "href", "http://docs.vinca.study/links.html");
    			add_location(a, file$d, 44, 0, 1429);
    			attr_dev(div0, "id", "major_buttons");
    			attr_dev(div0, "class", "svelte-4whwfg");
    			add_location(div0, file$d, 46, 0, 1527);
    			attr_dev(div1, "class", "top svelte-4whwfg");
    			add_location(div1, file$d, 34, 0, 1029);
    			set_style(div2, "margin", `20px`, false);
    			add_location(div2, file$d, 52, 0, 1642);
    			add_location(body, file$d, 32, 0, 1021);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div1);
    			if_block.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, a);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			mount_component(reviewbutton, div0, null);
    			append_dev(div0, t3);
    			mount_component(createbutton, div0, null);
    			append_dev(body, t4);
    			append_dev(body, div2);
    			mount_component(filters_1, div2, null);
    			append_dev(body, t5);
    			key_block.m(body, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, t0);
    				}
    			}

    			if (dirty & /*$filters*/ 8 && safe_not_equal(previous_key, previous_key = { .../*$filters*/ ctx[3] })) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block$1(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(body, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(reviewbutton.$$.fragment, local);
    			transition_in(createbutton.$$.fragment, local);
    			transition_in(filters_1.$$.fragment, local);
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(reviewbutton.$$.fragment, local);
    			transition_out(createbutton.$$.fragment, local);
    			transition_out(filters_1.$$.fragment, local);
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			if_block.d();
    			destroy_component(reviewbutton);
    			destroy_component(createbutton);
    			destroy_component(filters_1);
    			key_block.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let cols;
    	let $next_two_due;
    	let $username;
    	let $filters;
    	let $sort;
    	validate_store(next_two_due, 'next_two_due');
    	component_subscribe($$self, next_two_due, $$value => $$invalidate(11, $next_two_due = $$value));
    	validate_store(username, 'username');
    	component_subscribe($$self, username, $$value => $$invalidate(2, $username = $$value));
    	validate_store(filters, 'filters');
    	component_subscribe($$self, filters, $$value => $$invalidate(3, $filters = $$value));
    	validate_store(sort, 'sort');
    	component_subscribe($$self, sort, $$value => $$invalidate(4, $sort = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let innerWidth;

    	function create_card() {
    		// create a new template card
    		// pass it to the editor
    		let nc = { ...new_card() }; // copy new card template

    		card_to_edit.set(nc);
    	}

    	function review() {
    		card_to_review.set($next_two_due[0]);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(0, innerWidth = window.innerWidth);
    	}

    	const click_handler = () => {
    		username.set('');
    	};

    	const click_handler_1 = () => {
    		username.set('guest');
    	};

    	const click_handler_2 = () => {
    		username.set('');
    	};

    	$$self.$capture_state = () => ({
    		fetch_cardlist,
    		next_two_due,
    		new_card,
    		Tristate,
    		ReviewButton: Review_button,
    		CreateButton: Create_button,
    		Card,
    		Filters,
    		Masonry,
    		Loading,
    		card_to_edit,
    		card_to_review,
    		username,
    		filters,
    		sort,
    		innerWidth,
    		create_card,
    		review,
    		cols,
    		$next_two_due,
    		$username,
    		$filters,
    		$sort
    	});

    	$$self.$inject_state = $$props => {
    		if ('innerWidth' in $$props) $$invalidate(0, innerWidth = $$props.innerWidth);
    		if ('cols' in $$props) $$invalidate(1, cols = $$props.cols);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*innerWidth*/ 1) {
    			// one column for every 450px of window width
    			// At least one column
    			$$invalidate(1, cols = Math.floor(innerWidth / 450) || 1);
    		}
    	};

    	return [
    		innerWidth,
    		cols,
    		$username,
    		$filters,
    		$sort,
    		create_card,
    		review,
    		onwindowresize,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    function get_basic_placeholder() {
            return {front: 'Question', back: 'Answer'}
    }
    function get_verses_placeholder() {
            return {front: "To be or not to be, that is the question:  \n" +
                           "Whether 'tis nobler in the mind to suffer  \n" +
                           "The slings and arrows of outrageous fortune\n" +
                           "Or to take arms against a sea of troubles  \n" +
                           "And by opposing, end them.",
                    back: ''
            }
    }
    function get_occlusion_placeholder() {
            return {front: "- Text entered when the cards are created will be shared between all cards. \n" +
                           "- Afterwards each card's front and back text can be edited individually.",
                    back:  ''}
    }

    function get_placeholder(card_type) {
            return card_type==='basic'  ? get_basic_placeholder()  :
                   card_type==='verses' ? get_verses_placeholder() : get_occlusion_placeholder()

    }

    /* src/text_editor.svelte generated by Svelte v3.48.0 */
    const file$c = "src/text_editor.svelte";

    function create_fragment$c(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "class", "svelte-o80sq3");
    			add_location(textarea, file$c, 8, 0, 170);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*value*/ ctx[0]);
    			/*textarea_binding*/ ctx[4](textarea);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) {
    				set_input_value(textarea, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			/*textarea_binding*/ ctx[4](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text_editor', slots, []);
    	let { value = null } = $$props;
    	let area;
    	let { placeholder } = $$props;
    	const writable_props = ['value', 'placeholder'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Text_editor> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			area = $$value;
    			($$invalidate(1, area), $$invalidate(2, placeholder));
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    	};

    	$$self.$capture_state = () => ({ onMount, value, area, placeholder });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('area' in $$props) $$invalidate(1, area = $$props.area);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*area, placeholder*/ 6) {
    			if (area) {
    				$$invalidate(1, area.placeholder = placeholder, area);
    			}
    		}
    	};

    	return [value, area, placeholder, textarea_input_handler, textarea_binding];
    }

    class Text_editor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { value: 0, placeholder: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text_editor",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*placeholder*/ ctx[2] === undefined && !('placeholder' in props)) {
    			console.warn("<Text_editor> was created without expected prop 'placeholder'");
    		}
    	}

    	get value() {
    		throw new Error("<Text_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Text_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Text_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Text_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/audio_picker.svelte generated by Svelte v3.48.0 */

    const file$b = "src/audio_picker.svelte";

    function create_fragment$b(ctx) {
    	let input;
    	let t0;
    	let button;
    	let t1;
    	let span0;
    	let t3;
    	let br;
    	let t4;
    	let span1;
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			t1 = text(" \n\t♬\n\t \n\t");
    			span0 = element("span");
    			span0.textContent = "↑";
    			t3 = text("\n\t \n\t🕪\n\t");
    			br = element("br");
    			t4 = space();
    			span1 = element("span");
    			t5 = text(/*value*/ ctx[1]);
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", ".mp3,.wav,.ogg");
    			set_style(input, "display", "none");
    			add_location(input, file$b, 5, 0, 72);
    			set_style(span0, "font-size", "32px");
    			add_location(span0, file$b, 11, 1, 250);
    			add_location(br, file$b, 14, 1, 303);
    			set_style(span1, "font-size", "16px");
    			add_location(span1, file$b, 15, 1, 309);
    			attr_dev(button, "class", "svelte-1ur4qxs");
    			add_location(button, file$b, 7, 0, 178);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			/*input_binding*/ ctx[2](input);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, t1);
    			append_dev(button, span0);
    			append_dev(button, t3);
    			append_dev(button, br);
    			append_dev(button, t4);
    			append_dev(button, span1);
    			append_dev(span1, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[3]),
    					listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 2) set_data_dev(t5, /*value*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[2](null);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Audio_picker', slots, []);
    	let real_file_input;
    	let value = 'Choose audio';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Audio_picker> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			real_file_input = $$value;
    			$$invalidate(0, real_file_input);
    		});
    	}

    	function input_change_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	const click_handler = () => {
    		real_file_input.click();
    	};

    	$$self.$capture_state = () => ({ real_file_input, value });

    	$$self.$inject_state = $$props => {
    		if ('real_file_input' in $$props) $$invalidate(0, real_file_input = $$props.real_file_input);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [real_file_input, value, input_binding, input_change_handler, click_handler];
    }

    class Audio_picker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Audio_picker",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/image_picker.svelte generated by Svelte v3.48.0 */
    const file$a = "src/image_picker.svelte";

    function create_fragment$a(ctx) {
    	let input;
    	let t0;
    	let button_1;
    	let t1;
    	let span0;
    	let t3;
    	let br;
    	let t4;
    	let span1;
    	let t5_value = (/*disabled*/ ctx[0] ? 'N/A' : /*name*/ ctx[2]) + "";
    	let t5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			button_1 = element("button");
    			t1 = text(" \n\t🖼\n\t \n\t");
    			span0 = element("span");
    			span0.textContent = "↑";
    			t3 = text("\n\t \n\t📷\n\t");
    			br = element("br");
    			t4 = space();
    			span1 = element("span");
    			t5 = text(t5_value);
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", "image/*");
    			set_style(input, "display", "none");
    			add_location(input, file$a, 30, 0, 1011);
    			set_style(span0, "font-size", "32px");
    			add_location(span0, file$a, 36, 1, 1288);
    			add_location(br, file$a, 39, 1, 1341);
    			set_style(span1, "font-size", "16px");
    			add_location(span1, file$a, 40, 1, 1347);
    			button_1.disabled = /*disabled*/ ctx[0];
    			attr_dev(button_1, "class", "svelte-12cjody");
    			set_style(button_1, "background-color", /*disabled*/ ctx[0] ? 'lightgray' : 'white', false);
    			add_location(button_1, file$a, 32, 0, 1118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			/*input_binding*/ ctx[6](input);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button_1, anchor);
    			append_dev(button_1, t1);
    			append_dev(button_1, span0);
    			append_dev(button_1, t3);
    			append_dev(button_1, br);
    			append_dev(button_1, t4);
    			append_dev(button_1, span1);
    			append_dev(span1, t5);
    			/*button_1_binding*/ ctx[7](button_1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*upload*/ ctx[4], false, false, false),
    					listen_dev(button_1, "click", /*click_handler*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*disabled, name*/ 5 && t5_value !== (t5_value = (/*disabled*/ ctx[0] ? 'N/A' : /*name*/ ctx[2]) + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*disabled*/ 1) {
    				prop_dev(button_1, "disabled", /*disabled*/ ctx[0]);
    			}

    			if (dirty & /*disabled*/ 1) {
    				set_style(button_1, "background-color", /*disabled*/ ctx[0] ? 'lightgray' : 'white', false);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[6](null);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button_1);
    			/*button_1_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image_picker', slots, []);
    	let { image_id } = $$props;
    	let image_url = null;
    	let real_file_input;
    	let { disabled = false } = $$props;
    	let name = 'Choose Image';
    	let button;

    	function upload() {
    		let file = real_file_input.files[0];
    		$$invalidate(2, name = file.name);
    		const reader = new FileReader();
    		reader.readAsDataURL(file);

    		reader.onload = async () => {
    			let media_id = await upload_media(reader.result);
    			$$invalidate(5, image_id = await media_id);
    			image_url = 'url(' + reader.result + ')'; // base64 encoding of selected file with mime-type prefix
    			$$invalidate(3, button.style['background-image'] = image_url, button);
    		};
    	}

    	onMount(async () => {
    		if (image_id != 0) {
    			const image_url = await getProtectedImage(image_id);
    			$$invalidate(3, button.style['background-image'] = 'url(' + image_url + ')', button);
    		}
    	});

    	const writable_props = ['image_id', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image_picker> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			real_file_input = $$value;
    			$$invalidate(1, real_file_input);
    		});
    	}

    	function button_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			button = $$value;
    			$$invalidate(3, button);
    		});
    	}

    	const click_handler = () => {
    		real_file_input.click();
    	};

    	$$self.$$set = $$props => {
    		if ('image_id' in $$props) $$invalidate(5, image_id = $$props.image_id);
    		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		upload_media,
    		getProtectedImage,
    		image_id,
    		image_url,
    		real_file_input,
    		disabled,
    		name,
    		button,
    		upload
    	});

    	$$self.$inject_state = $$props => {
    		if ('image_id' in $$props) $$invalidate(5, image_id = $$props.image_id);
    		if ('image_url' in $$props) image_url = $$props.image_url;
    		if ('real_file_input' in $$props) $$invalidate(1, real_file_input = $$props.real_file_input);
    		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    		if ('button' in $$props) $$invalidate(3, button = $$props.button);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		disabled,
    		real_file_input,
    		name,
    		button,
    		upload,
    		image_id,
    		input_binding,
    		button_1_binding,
    		click_handler
    	];
    }

    class Image_picker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { image_id: 5, disabled: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image_picker",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*image_id*/ ctx[5] === undefined && !('image_id' in props)) {
    			console.warn("<Image_picker> was created without expected prop 'image_id'");
    		}
    	}

    	get image_id() {
    		throw new Error("<Image_picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image_id(value) {
    		throw new Error("<Image_picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Image_picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Image_picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/side_editor.svelte generated by Svelte v3.48.0 */
    const file$9 = "src/side_editor.svelte";

    function create_fragment$9(ctx) {
    	let div1;
    	let editor;
    	let updating_value;
    	let updating_placeholder;
    	let t0;
    	let div0;
    	let audio;
    	let t1;
    	let image;
    	let updating_image_id;
    	let current;

    	function editor_value_binding(value) {
    		/*editor_value_binding*/ ctx[4](value);
    	}

    	function editor_placeholder_binding(value) {
    		/*editor_placeholder_binding*/ ctx[5](value);
    	}

    	let editor_props = {};

    	if (/*text*/ ctx[0] !== void 0) {
    		editor_props.value = /*text*/ ctx[0];
    	}

    	if (/*placeholder*/ ctx[2] !== void 0) {
    		editor_props.placeholder = /*placeholder*/ ctx[2];
    	}

    	editor = new Text_editor({ props: editor_props, $$inline: true });
    	binding_callbacks.push(() => bind(editor, 'value', editor_value_binding));
    	binding_callbacks.push(() => bind(editor, 'placeholder', editor_placeholder_binding));
    	audio = new Audio_picker({ $$inline: true });

    	function image_image_id_binding(value) {
    		/*image_image_id_binding*/ ctx[6](value);
    	}

    	let image_props = {
    		disabled: /*image_picker_disabled*/ ctx[3]
    	};

    	if (/*image_id*/ ctx[1] !== void 0) {
    		image_props.image_id = /*image_id*/ ctx[1];
    	}

    	image = new Image_picker({ props: image_props, $$inline: true });
    	binding_callbacks.push(() => bind(image, 'image_id', image_image_id_binding));

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(editor.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(audio.$$.fragment);
    			t1 = space();
    			create_component(image.$$.fragment);
    			attr_dev(div0, "id", "media");
    			attr_dev(div0, "class", "svelte-uhg411");
    			add_location(div0, file$9, 13, 1, 371);
    			attr_dev(div1, "id", "main");
    			attr_dev(div1, "class", "svelte-uhg411");
    			add_location(div1, file$9, 11, 0, 300);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(editor, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(audio, div0, null);
    			append_dev(div0, t1);
    			mount_component(image, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const editor_changes = {};

    			if (!updating_value && dirty & /*text*/ 1) {
    				updating_value = true;
    				editor_changes.value = /*text*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_placeholder && dirty & /*placeholder*/ 4) {
    				updating_placeholder = true;
    				editor_changes.placeholder = /*placeholder*/ ctx[2];
    				add_flush_callback(() => updating_placeholder = false);
    			}

    			editor.$set(editor_changes);
    			const image_changes = {};
    			if (dirty & /*image_picker_disabled*/ 8) image_changes.disabled = /*image_picker_disabled*/ ctx[3];

    			if (!updating_image_id && dirty & /*image_id*/ 2) {
    				updating_image_id = true;
    				image_changes.image_id = /*image_id*/ ctx[1];
    				add_flush_callback(() => updating_image_id = false);
    			}

    			image.$set(image_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editor.$$.fragment, local);
    			transition_in(audio.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editor.$$.fragment, local);
    			transition_out(audio.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(editor);
    			destroy_component(audio);
    			destroy_component(image);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Side_editor', slots, []);
    	let { text } = $$props;
    	let { image_id } = $$props;
    	let { placeholder } = $$props;
    	let { image_picker_disabled } = $$props;
    	const writable_props = ['text', 'image_id', 'placeholder', 'image_picker_disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Side_editor> was created with unknown prop '${key}'`);
    	});

    	function editor_value_binding(value) {
    		text = value;
    		$$invalidate(0, text);
    	}

    	function editor_placeholder_binding(value) {
    		placeholder = value;
    		$$invalidate(2, placeholder);
    	}

    	function image_image_id_binding(value) {
    		image_id = value;
    		$$invalidate(1, image_id);
    	}

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('image_id' in $$props) $$invalidate(1, image_id = $$props.image_id);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('image_picker_disabled' in $$props) $$invalidate(3, image_picker_disabled = $$props.image_picker_disabled);
    	};

    	$$self.$capture_state = () => ({
    		Editor: Text_editor,
    		Audio: Audio_picker,
    		Image: Image_picker,
    		text,
    		image_id,
    		placeholder,
    		image_picker_disabled
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('image_id' in $$props) $$invalidate(1, image_id = $$props.image_id);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('image_picker_disabled' in $$props) $$invalidate(3, image_picker_disabled = $$props.image_picker_disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		text,
    		image_id,
    		placeholder,
    		image_picker_disabled,
    		editor_value_binding,
    		editor_placeholder_binding,
    		image_image_id_binding
    	];
    }

    class Side_editor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			text: 0,
    			image_id: 1,
    			placeholder: 2,
    			image_picker_disabled: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Side_editor",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Side_editor> was created without expected prop 'text'");
    		}

    		if (/*image_id*/ ctx[1] === undefined && !('image_id' in props)) {
    			console.warn("<Side_editor> was created without expected prop 'image_id'");
    		}

    		if (/*placeholder*/ ctx[2] === undefined && !('placeholder' in props)) {
    			console.warn("<Side_editor> was created without expected prop 'placeholder'");
    		}

    		if (/*image_picker_disabled*/ ctx[3] === undefined && !('image_picker_disabled' in props)) {
    			console.warn("<Side_editor> was created without expected prop 'image_picker_disabled'");
    		}
    	}

    	get text() {
    		throw new Error("<Side_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Side_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image_id() {
    		throw new Error("<Side_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image_id(value) {
    		throw new Error("<Side_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Side_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Side_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image_picker_disabled() {
    		throw new Error("<Side_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image_picker_disabled(value) {
    		throw new Error("<Side_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/tags_editor.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1 } = globals;
    const file$8 = "src/tags_editor.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[11] = list;
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (25:8) {#if tag.includes(search)}
    function create_if_block$6(ctx) {
    	let label;
    	let input;
    	let t0;
    	let t1_value = /*tag*/ ctx[10] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[7].call(input, /*tag*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$8, 26, 16, 973);
    			attr_dev(label, "class", "svelte-f8t21t");
    			add_location(label, file$8, 25, 12, 948);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = /*has_tag_map*/ ctx[1][/*tag*/ ctx[10]];
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*has_tag_map, Object*/ 2) {
    				input.checked = /*has_tag_map*/ ctx[1][/*tag*/ ctx[10]];
    			}

    			if (dirty & /*has_tag_map*/ 2 && t1_value !== (t1_value = /*tag*/ ctx[10] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(25:8) {#if tag.includes(search)}",
    		ctx
    	});

    	return block;
    }

    // (24:0) {#each Object.keys(has_tag_map).reverse() as tag}
    function create_each_block$4(ctx) {
    	let show_if = /*tag*/ ctx[10].includes(/*search*/ ctx[2]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*has_tag_map, search*/ 6) show_if = /*tag*/ ctx[10].includes(/*search*/ ctx[2]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(24:0) {#each Object.keys(has_tag_map).reverse() as tag}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let p;
    	let b;
    	let t0_value = /*card*/ ctx[0].tags + "";
    	let t0;
    	let t1;
    	let button;
    	let t3;
    	let input;
    	let t4;
    	let mounted;
    	let dispose;
    	let each_value = Object.keys(/*has_tag_map*/ ctx[1]).reverse();
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "+ new tag";
    			t3 = text(" \n  ");
    			input = element("input");
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(b, file$8, 19, 20, 664);
    			attr_dev(p, "id", "tags_list");
    			attr_dev(p, "class", "svelte-f8t21t");
    			add_location(p, file$8, 19, 2, 646);
    			attr_dev(button, "type", "button");
    			add_location(button, file$8, 20, 2, 689);
    			attr_dev(input, "type", "search");
    			attr_dev(input, "placeholder", "search");
    			add_location(input, file$8, 21, 2, 785);
    			attr_dev(div, "id", "tags_bar");
    			attr_dev(div, "class", "svelte-f8t21t");
    			add_location(div, file$8, 18, 0, 624);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, b);
    			append_dev(b, t0);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(div, t3);
    			append_dev(div, input);
    			set_input_value(input, /*search*/ ctx[2]);
    			append_dev(div, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*card*/ 1 && t0_value !== (t0_value = /*card*/ ctx[0].tags + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*search*/ 4) {
    				set_input_value(input, /*search*/ ctx[2]);
    			}

    			if (dirty & /*Object, has_tag_map, search*/ 6) {
    				each_value = Object.keys(/*has_tag_map*/ ctx[1]).reverse();
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let tags_list;
    	let $collection_tags;
    	validate_store(collection_tags, 'collection_tags');
    	component_subscribe($$self, collection_tags, $$value => $$invalidate(8, $collection_tags = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tags_editor', slots, []);
    	let { card } = $$props;

    	function new_tag(tag) {
    		collection_tags.update(tags => [tag, ...tags]);
    		$$invalidate(1, has_tag_map[tag] = true, has_tag_map);
    	}

    	let has_tag_map = $collection_tags.reduce(
    		(running_map, tag) => {
    			running_map[tag] = false;
    			return running_map;
    		},
    		new Map()
    	);

    	const tl = card.tags === '' ? [] : card.tags.split(',');

    	for (tag in tl) {
    		has_tag_map[tag] = true;
    	}

    	let search = '';
    	const writable_props = ['card'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tags_editor> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		new_tag(prompt('new tag'));
    	};

    	function input_input_handler() {
    		search = this.value;
    		$$invalidate(2, search);
    	}

    	function input_change_handler(tag) {
    		has_tag_map[tag] = this.checked;
    		$$invalidate(1, has_tag_map);
    	}

    	$$self.$$set = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    	};

    	$$self.$capture_state = () => ({
    		collection_tags,
    		card,
    		new_tag,
    		has_tag_map,
    		tl,
    		search,
    		tags_list,
    		$collection_tags
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('has_tag_map' in $$props) $$invalidate(1, has_tag_map = $$props.has_tag_map);
    		if ('search' in $$props) $$invalidate(2, search = $$props.search);
    		if ('tags_list' in $$props) $$invalidate(4, tags_list = $$props.tags_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*has_tag_map*/ 2) {
    			$$invalidate(4, tags_list = Object.entries(has_tag_map).filter(pair => pair[1]).map(pair => pair[0]));
    		}

    		if ($$self.$$.dirty & /*tags_list*/ 16) {
    			$$invalidate(0, card.tags = tags_list.join(', '), card);
    		}
    	};

    	return [
    		card,
    		has_tag_map,
    		search,
    		new_tag,
    		tags_list,
    		click_handler,
    		input_input_handler,
    		input_change_handler
    	];
    }

    class Tags_editor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { card: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tags_editor",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*card*/ ctx[0] === undefined && !('card' in props)) {
    			console.warn("<Tags_editor> was created without expected prop 'card'");
    		}
    	}

    	get card() {
    		throw new Error("<Tags_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Tags_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/edit_header.svelte generated by Svelte v3.48.0 */
    const file$7 = "src/edit_header.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (19:0) {#each card_types as card_type}
    function create_each_block$3(ctx) {
    	let option;
    	let t_value = /*card_type*/ ctx[8] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*card_type*/ ctx[8];
    			option.value = option.__value;
    			add_location(option, file$7, 19, 2, 776);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(19:0) {#each card_types as card_type}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let center;
    	let infotooltip0;
    	let t0;
    	let select;
    	let t1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let button2;
    	let t7;
    	let infotooltip1;
    	let t8;
    	let input;
    	let current;
    	let mounted;
    	let dispose;

    	infotooltip0 = new Info_tooltip({
    			props: {
    				text: "<b>Basic</b>:  class question and answer card <br><br>\n                <b>Verses</b>: tests you line by line (useful for poetry) <br><br>\n                <b>Occlusion</b>: generate several cards by covering up parts of a map or diagram (useful for geography)"
    			},
    			$$inline: true
    		});

    	let each_value = /*card_types*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	infotooltip1 = new Info_tooltip({
    			props: {
    				text: "Quantify in minutes the worth of remembering this knowledge.<br><br>\n        This lets you see if the time spent studying a card has been worthwhile. <br><br>\n        It also lets you sort your cards to find the best ones."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			center = element("center");
    			create_component(infotooltip0.$$.fragment);
    			t0 = text("\n\nCard type:\n");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "cancel";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "preview";
    			t5 = space();
    			button2 = element("button");
    			button2.textContent = "save";
    			t7 = space();
    			create_component(infotooltip1.$$.fragment);
    			t8 = text("\nMerit:\n");
    			input = element("input");
    			if (/*card*/ ctx[0].card_type === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			set_style(select, "background-color", 'white', false);
    			add_location(select, file$7, 17, 0, 672);
    			attr_dev(button0, "class", "submit_button svelte-1c03v3z");
    			add_location(button0, file$7, 24, 0, 825);
    			attr_dev(button1, "class", "submit_button svelte-1c03v3z");
    			add_location(button1, file$7, 25, 0, 889);
    			attr_dev(button2, "class", "submit_button svelte-1c03v3z");
    			add_location(button2, file$7, 26, 0, 955);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", "60");
    			set_style(input, "width", `50px`, false);
    			add_location(input, file$7, 33, 0, 1272);
    			add_location(center, file$7, 11, 0, 361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			mount_component(infotooltip0, center, null);
    			append_dev(center, t0);
    			append_dev(center, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*card*/ ctx[0].card_type);
    			append_dev(center, t1);
    			append_dev(center, button0);
    			append_dev(center, t3);
    			append_dev(center, button1);
    			append_dev(center, t5);
    			append_dev(center, button2);
    			append_dev(center, t7);
    			mount_component(infotooltip1, center, null);
    			append_dev(center, t8);
    			append_dev(center, input);
    			set_input_value(input, /*card*/ ctx[0].merit);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[5]),
    					listen_dev(button0, "click", /*cancel*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*preview*/ ctx[3], false, false, false),
    					listen_dev(button2, "click", /*save*/ ctx[1], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*card_types*/ 16) {
    				each_value = /*card_types*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*card, card_types*/ 17) {
    				select_option(select, /*card*/ ctx[0].card_type);
    			}

    			if (dirty & /*card, card_types*/ 17 && to_number(input.value) !== /*card*/ ctx[0].merit) {
    				set_input_value(input, /*card*/ ctx[0].merit);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infotooltip0.$$.fragment, local);
    			transition_in(infotooltip1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infotooltip0.$$.fragment, local);
    			transition_out(infotooltip1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			destroy_component(infotooltip0);
    			destroy_each(each_blocks, detaching);
    			destroy_component(infotooltip1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Edit_header', slots, []);
    	let { card } = $$props;
    	const dispatch = createEventDispatcher();

    	let save = () => {
    		dispatch('save');
    	};

    	let cancel = () => {
    		dispatch('cancel');
    	};

    	let preview = () => {
    		dispatch('preview');
    	};

    	const card_types = ['basic', 'verses', 'occlusion'];
    	const writable_props = ['card'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Edit_header> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		card.card_type = select_value(this);
    		$$invalidate(0, card);
    		$$invalidate(4, card_types);
    	}

    	function input_input_handler() {
    		card.merit = to_number(this.value);
    		$$invalidate(0, card);
    		$$invalidate(4, card_types);
    	}

    	$$self.$$set = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		InfoTooltip: Info_tooltip,
    		card,
    		dispatch,
    		save,
    		cancel,
    		preview,
    		card_types
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('save' in $$props) $$invalidate(1, save = $$props.save);
    		if ('cancel' in $$props) $$invalidate(2, cancel = $$props.cancel);
    		if ('preview' in $$props) $$invalidate(3, preview = $$props.preview);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		card,
    		save,
    		cancel,
    		preview,
    		card_types,
    		select_change_handler,
    		input_input_handler
    	];
    }

    class Edit_header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { card: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edit_header",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*card*/ ctx[0] === undefined && !('card' in props)) {
    			console.warn("<Edit_header> was created without expected prop 'card'");
    		}
    	}

    	get card() {
    		throw new Error("<Edit_header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Edit_header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/rectangle.svelte generated by Svelte v3.48.0 */

    const file$6 = "src/rectangle.svelte";

    // (36:0) {#if !self.deleted}
    function create_if_block$5(ctx) {
    	let div;
    	let button0;

    	let t0_value = (/*self*/ ctx[0].width > 45 && /*self*/ ctx[0].height > 20
    	? '✣ Move'
    	: '') + "";

    	let t0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "✗ Del";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "⤡";
    			attr_dev(button0, "id", "moveButton");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "svelte-xqaxsl");
    			add_location(button0, file$6, 39, 5, 1602);
    			attr_dev(button1, "id", "deleteButton");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "svelte-xqaxsl");
    			add_location(button1, file$6, 40, 5, 1745);
    			attr_dev(button2, "id", "resizeButton");
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "svelte-xqaxsl");
    			add_location(button2, file$6, 41, 5, 1820);
    			set_style(div, "position", 'absolute', false);
    			set_style(div, "top", /*self*/ ctx[0].top + 'px', false);
    			set_style(div, "left", /*self*/ ctx[0].left + 'px', false);
    			set_style(div, "width", /*self*/ ctx[0].width + 'px', false);
    			set_style(div, "height", /*self*/ ctx[0].height + 'px', false);
    			add_location(div, file$6, 36, 0, 1432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, t0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(div, t3);
    			append_dev(div, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "mousedown", /*move*/ ctx[2], false, false, false),
    					listen_dev(button0, "click", swallow, false, false, false),
    					listen_dev(button1, "click", /*del*/ ctx[3], false, false, false),
    					listen_dev(button2, "mousedown", /*resize*/ ctx[1], false, false, false),
    					listen_dev(button2, "click", swallow, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*self*/ 1 && t0_value !== (t0_value = (/*self*/ ctx[0].width > 45 && /*self*/ ctx[0].height > 20
    			? '✣ Move'
    			: '') + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*self*/ 1) {
    				set_style(div, "top", /*self*/ ctx[0].top + 'px', false);
    			}

    			if (dirty & /*self*/ 1) {
    				set_style(div, "left", /*self*/ ctx[0].left + 'px', false);
    			}

    			if (dirty & /*self*/ 1) {
    				set_style(div, "width", /*self*/ ctx[0].width + 'px', false);
    			}

    			if (dirty & /*self*/ 1) {
    				set_style(div, "height", /*self*/ ctx[0].height + 'px', false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(36:0) {#if !self.deleted}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let if_block = !/*self*/ ctx[0].deleted && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*self*/ ctx[0].deleted) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function swallow(e) {
    	e.stopPropagation();
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Rectangle', slots, []);

    	let { self = {
    		deleted: false,
    		id: 0,
    		left: 100,
    		top: 100,
    		width: 200,
    		height: 100
    	} } = $$props;

    	let click_pos;
    	let old_self;

    	function resize(e) {
    		click_pos = { x: e.clientX, y: e.clientY };
    		old_self = { ...self };

    		document.onmousemove = e => {
    			$$invalidate(0, self.width = old_self.width + (e.clientX - click_pos.x), self);
    			$$invalidate(0, self.height = old_self.height + (e.clientY - click_pos.y), self);
    		};

    		document.onmouseup = e => {
    			document.onmousemove = null;
    		};
    	}

    	function move(e) {
    		click_pos = { x: e.clientX, y: e.clientY };
    		old_self = { ...self };

    		document.onmousemove = e => {
    			$$invalidate(0, self.left = old_self.left + (e.clientX - click_pos.x), self);
    			$$invalidate(0, self.top = old_self.top + (e.clientY - click_pos.y), self);
    		};

    		document.onmouseup = e => {
    			document.onmousemove = null;
    		};
    	} //pass

    	function del(e) {
    		if (self.id != 0 && !confirm('This will trigger a card to be deleted on save.')) {
    			return;
    		}

    		$$invalidate(0, self.deleted = true, self);
    		swallow(e);
    	}

    	const writable_props = ['self'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Rectangle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('self' in $$props) $$invalidate(0, self = $$props.self);
    	};

    	$$self.$capture_state = () => ({
    		self,
    		click_pos,
    		old_self,
    		resize,
    		move,
    		del,
    		swallow
    	});

    	$$self.$inject_state = $$props => {
    		if ('self' in $$props) $$invalidate(0, self = $$props.self);
    		if ('click_pos' in $$props) click_pos = $$props.click_pos;
    		if ('old_self' in $$props) old_self = $$props.old_self;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [self, resize, move, del];
    }

    class Rectangle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { self: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Rectangle",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get self() {
    		throw new Error("<Rectangle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set self(value) {
    		throw new Error("<Rectangle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/image_occluder.svelte generated by Svelte v3.48.0 */
    const file$5 = "src/image_occluder.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[21] = list;
    	child_ctx[22] = i;
    	return child_ctx;
    }

    // (63:8) {#each data.rectangles as rectangle}
    function create_each_block$2(ctx) {
    	let rectangle;
    	let updating_self;
    	let current;

    	function rectangle_self_binding(value) {
    		/*rectangle_self_binding*/ ctx[12](value, /*rectangle*/ ctx[20], /*each_value*/ ctx[21], /*rectangle_index*/ ctx[22]);
    	}

    	let rectangle_props = {};

    	if (/*rectangle*/ ctx[20] !== void 0) {
    		rectangle_props.self = /*rectangle*/ ctx[20];
    	}

    	rectangle = new Rectangle({ props: rectangle_props, $$inline: true });
    	binding_callbacks.push(() => bind(rectangle, 'self', rectangle_self_binding));

    	const block = {
    		c: function create() {
    			create_component(rectangle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(rectangle, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const rectangle_changes = {};

    			if (!updating_self && dirty & /*data*/ 1) {
    				updating_self = true;
    				rectangle_changes.self = /*rectangle*/ ctx[20];
    				add_flush_callback(() => updating_self = false);
    			}

    			rectangle.$set(rectangle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rectangle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rectangle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(rectangle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(63:8) {#each data.rectangles as rectangle}",
    		ctx
    	});

    	return block;
    }

    // (67:8) {#if !image_id}
    function create_if_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Click to Upload an Image");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(67:8) {#if !image_id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let input0;
    	let t0;
    	let center;
    	let button0;
    	let t2;
    	let label0;
    	let input1;
    	let t3;
    	let t4;
    	let label1;
    	let input2;
    	let t5;
    	let t6;
    	let button2;
    	let t7;
    	let button1;
    	let t9;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*data*/ ctx[0].rectangles;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = !/*image_id*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			center = element("center");
    			button0 = element("button");
    			button0.textContent = "+ new rectangle";
    			t2 = space();
    			label0 = element("label");
    			input1 = element("input");
    			t3 = text(" Hide All");
    			t4 = space();
    			label1 = element("label");
    			input2 = element("input");
    			t5 = text(" Hide One");
    			t6 = space();
    			button2 = element("button");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			button1 = element("button");
    			button1.textContent = "⤡ Resize";
    			t9 = space();
    			if (if_block) if_block.c();
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "accept", "image/*");
    			set_style(input0, "display", "none");
    			add_location(input0, file$5, 53, 0, 1889);
    			attr_dev(button0, "type", "button");
    			add_location(button0, file$5, 55, 8, 2004);
    			attr_dev(input1, "type", "radio");
    			input1.__value = true;
    			input1.value = input1.__value;
    			attr_dev(input1, "name", "hide");
    			/*$$binding_groups*/ ctx[10][0].push(input1);
    			add_location(input1, file$5, 56, 38, 2116);
    			set_style(label0, "display", `inline`, false);
    			add_location(label0, file$5, 56, 8, 2086);
    			attr_dev(input2, "type", "radio");
    			input2.__value = false;
    			input2.value = input2.__value;
    			attr_dev(input2, "name", "hide");
    			/*$$binding_groups*/ ctx[10][0].push(input2);
    			add_location(input2, file$5, 57, 38, 2248);
    			set_style(label1, "display", `inline`, false);
    			add_location(label1, file$5, 57, 8, 2218);
    			add_location(center, file$5, 55, 0, 1996);
    			attr_dev(button1, "class", "imageSizer svelte-o9mhat");
    			add_location(button1, file$5, 65, 8, 2639);
    			attr_dev(button2, "class", "occlusionImage svelte-o9mhat");
    			set_style(button2, "width", /*data*/ ctx[0].box.width + 'px', false);
    			set_style(button2, "height", /*data*/ ctx[0].box.height + 'px', false);
    			add_location(button2, file$5, 61, 0, 2354);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			/*input0_binding*/ ctx[8](input0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, center, anchor);
    			append_dev(center, button0);
    			append_dev(center, t2);
    			append_dev(center, label0);
    			append_dev(label0, input1);
    			input1.checked = input1.__value === /*data*/ ctx[0].hide_all;
    			append_dev(label0, t3);
    			append_dev(center, t4);
    			append_dev(center, label1);
    			append_dev(label1, input2);
    			input2.checked = input2.__value === /*data*/ ctx[0].hide_all;
    			append_dev(label1, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, button2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(button2, null);
    			}

    			append_dev(button2, t7);
    			append_dev(button2, button1);
    			/*button1_binding*/ ctx[13](button1);
    			append_dev(button2, t9);
    			if (if_block) if_block.m(button2, null);
    			/*button2_binding*/ ctx[14](button2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*upload*/ ctx[6], false, false, false),
    					listen_dev(button0, "click", /*new_rectangle*/ ctx[7], false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[9]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[11]),
    					listen_dev(button1, "mousedown", /*resize*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", click_handler, false, false, false),
    					listen_dev(
    						button2,
    						"click",
    						function () {
    							if (is_function(/*real_file_input*/ ctx[3].click())) /*real_file_input*/ ctx[3].click().apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*data*/ 1) {
    				input1.checked = input1.__value === /*data*/ ctx[0].hide_all;
    			}

    			if (dirty & /*data*/ 1) {
    				input2.checked = input2.__value === /*data*/ ctx[0].hide_all;
    			}

    			if (dirty & /*data*/ 1) {
    				each_value = /*data*/ ctx[0].rectangles;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(button2, t7);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!/*image_id*/ ctx[1]) {
    				if (if_block) ; else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(button2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*data*/ 1) {
    				set_style(button2, "width", /*data*/ ctx[0].box.width + 'px', false);
    			}

    			if (dirty & /*data*/ 1) {
    				set_style(button2, "height", /*data*/ ctx[0].box.height + 'px', false);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			/*input0_binding*/ ctx[8](null);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(center);
    			/*$$binding_groups*/ ctx[10][0].splice(/*$$binding_groups*/ ctx[10][0].indexOf(input1), 1);
    			/*$$binding_groups*/ ctx[10][0].splice(/*$$binding_groups*/ ctx[10][0].indexOf(input2), 1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(button2);
    			destroy_each(each_blocks, detaching);
    			/*button1_binding*/ ctx[13](null);
    			if (if_block) if_block.d();
    			/*button2_binding*/ ctx[14](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler = e => {
    	e.stopPropagation();
    };

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image_occluder', slots, []);
    	let { data } = $$props;
    	let occlusionImage;
    	let resize_tracking = false;
    	let { image_id } = $$props;
    	let image_url = null;
    	let real_file_input;
    	let resizer;
    	let click_pos;
    	let old_dimensions;

    	function resize(e) {
    		click_pos = { x: e.clientX, y: e.clientY };

    		old_dimensions = {
    			width: data.box.width,
    			height: data.box.height
    		};

    		document.onmousemove = e => {
    			$$invalidate(0, data.box.width = old_dimensions.width + (e.clientX - click_pos.x), data);
    			$$invalidate(0, data.box.height = old_dimensions.height + (e.clientY - click_pos.y), data);
    		};

    		document.onmouseup = e => {
    			document.onmousemove = null;
    		};
    	}

    	function upload() {
    		let file = real_file_input.files[0];
    		const reader = new FileReader();
    		reader.readAsDataURL(file);

    		reader.onload = async () => {
    			let media_id = await upload_media(reader.result);
    			$$invalidate(1, image_id = await media_id);
    			image_url = 'url(' + reader.result + ')'; // base64 encoding of selected file with mime-type prefix
    			$$invalidate(2, occlusionImage.style['background-image'] = image_url, occlusionImage);
    		};
    	}

    	onMount(async () => {
    		if (image_id != 0) {
    			image_url = await getProtectedImage(image_id);
    			$$invalidate(2, occlusionImage.style['background-image'] = 'url(' + image_url + ')', occlusionImage);
    		}
    	});

    	const default_rectangle = {
    		id: 0,
    		top: 50,
    		left: 50,
    		height: 100,
    		width: 200,
    		deleted: false
    	};

    	function new_rectangle() {
    		//push a rectangle to the shapes list
    		//link it to a real card
    		var new_rect = { ...default_rectangle };

    		data.rectangles.push(new_rect);
    		$$invalidate(0, data);
    	}

    	const writable_props = ['data', 'image_id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image_occluder> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			real_file_input = $$value;
    			$$invalidate(3, real_file_input);
    		});
    	}

    	function input1_change_handler() {
    		data.hide_all = this.__value;
    		$$invalidate(0, data);
    	}

    	function input2_change_handler() {
    		data.hide_all = this.__value;
    		$$invalidate(0, data);
    	}

    	function rectangle_self_binding(value, rectangle, each_value, rectangle_index) {
    		each_value[rectangle_index] = value;
    		$$invalidate(0, data);
    	}

    	function button1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			resizer = $$value;
    			$$invalidate(4, resizer);
    		});
    	}

    	function button2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			occlusionImage = $$value;
    			$$invalidate(2, occlusionImage);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('image_id' in $$props) $$invalidate(1, image_id = $$props.image_id);
    	};

    	$$self.$capture_state = () => ({
    		upload_media,
    		getProtectedImage,
    		onMount,
    		Rectangle,
    		data,
    		occlusionImage,
    		resize_tracking,
    		image_id,
    		image_url,
    		real_file_input,
    		resizer,
    		click_pos,
    		old_dimensions,
    		resize,
    		upload,
    		default_rectangle,
    		new_rectangle
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('occlusionImage' in $$props) $$invalidate(2, occlusionImage = $$props.occlusionImage);
    		if ('resize_tracking' in $$props) resize_tracking = $$props.resize_tracking;
    		if ('image_id' in $$props) $$invalidate(1, image_id = $$props.image_id);
    		if ('image_url' in $$props) image_url = $$props.image_url;
    		if ('real_file_input' in $$props) $$invalidate(3, real_file_input = $$props.real_file_input);
    		if ('resizer' in $$props) $$invalidate(4, resizer = $$props.resizer);
    		if ('click_pos' in $$props) click_pos = $$props.click_pos;
    		if ('old_dimensions' in $$props) old_dimensions = $$props.old_dimensions;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		data,
    		image_id,
    		occlusionImage,
    		real_file_input,
    		resizer,
    		resize,
    		upload,
    		new_rectangle,
    		input0_binding,
    		input1_change_handler,
    		$$binding_groups,
    		input2_change_handler,
    		rectangle_self_binding,
    		button1_binding,
    		button2_binding
    	];
    }

    class Image_occluder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { data: 0, image_id: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image_occluder",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<Image_occluder> was created without expected prop 'data'");
    		}

    		if (/*image_id*/ ctx[1] === undefined && !('image_id' in props)) {
    			console.warn("<Image_occluder> was created without expected prop 'image_id'");
    		}
    	}

    	get data() {
    		throw new Error("<Image_occluder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Image_occluder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image_id() {
    		throw new Error("<Image_occluder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image_id(value) {
    		throw new Error("<Image_occluder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/edit.svelte generated by Svelte v3.48.0 */
    const file$4 = "src/edit.svelte";

    // (116:0) {#if tmp_card.card_type==='occlusion'}
    function create_if_block_1$2(ctx) {
    	let imageoccluder;
    	let updating_data;
    	let updating_image_id;
    	let t;
    	let hr;
    	let current;

    	function imageoccluder_data_binding(value) {
    		/*imageoccluder_data_binding*/ ctx[7](value);
    	}

    	function imageoccluder_image_id_binding(value) {
    		/*imageoccluder_image_id_binding*/ ctx[8](value);
    	}

    	let imageoccluder_props = {};

    	if (/*occlusion_data*/ ctx[1] !== void 0) {
    		imageoccluder_props.data = /*occlusion_data*/ ctx[1];
    	}

    	if (/*tmp_card*/ ctx[0].front_image_id !== void 0) {
    		imageoccluder_props.image_id = /*tmp_card*/ ctx[0].front_image_id;
    	}

    	imageoccluder = new Image_occluder({
    			props: imageoccluder_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(imageoccluder, 'data', imageoccluder_data_binding));
    	binding_callbacks.push(() => bind(imageoccluder, 'image_id', imageoccluder_image_id_binding));

    	const block = {
    		c: function create() {
    			create_component(imageoccluder.$$.fragment);
    			t = space();
    			hr = element("hr");
    			add_location(hr, file$4, 117, 8, 5296);
    		},
    		m: function mount(target, anchor) {
    			mount_component(imageoccluder, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, hr, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const imageoccluder_changes = {};

    			if (!updating_data && dirty & /*occlusion_data*/ 2) {
    				updating_data = true;
    				imageoccluder_changes.data = /*occlusion_data*/ ctx[1];
    				add_flush_callback(() => updating_data = false);
    			}

    			if (!updating_image_id && dirty & /*tmp_card*/ 1) {
    				updating_image_id = true;
    				imageoccluder_changes.image_id = /*tmp_card*/ ctx[0].front_image_id;
    				add_flush_callback(() => updating_image_id = false);
    			}

    			imageoccluder.$set(imageoccluder_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imageoccluder.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imageoccluder.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(imageoccluder, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(116:0) {#if tmp_card.card_type==='occlusion'}",
    		ctx
    	});

    	return block;
    }

    // (125:0) {#if tmp_card.card_type!='verses'}
    function create_if_block$3(ctx) {
    	let sideeditor;
    	let updating_text;
    	let updating_image_id;
    	let t;
    	let hr;
    	let current;

    	function sideeditor_text_binding_1(value) {
    		/*sideeditor_text_binding_1*/ ctx[11](value);
    	}

    	function sideeditor_image_id_binding_1(value) {
    		/*sideeditor_image_id_binding_1*/ ctx[12](value);
    	}

    	let sideeditor_props = {
    		image_picker_disabled: /*tmp_card*/ ctx[0].card_type === 'occlusion',
    		placeholder: /*placeholder*/ ctx[2].back
    	};

    	if (/*tmp_card*/ ctx[0].back_text !== void 0) {
    		sideeditor_props.text = /*tmp_card*/ ctx[0].back_text;
    	}

    	if (/*tmp_card*/ ctx[0].back_image_id !== void 0) {
    		sideeditor_props.image_id = /*tmp_card*/ ctx[0].back_image_id;
    	}

    	sideeditor = new Side_editor({ props: sideeditor_props, $$inline: true });
    	binding_callbacks.push(() => bind(sideeditor, 'text', sideeditor_text_binding_1));
    	binding_callbacks.push(() => bind(sideeditor, 'image_id', sideeditor_image_id_binding_1));

    	const block = {
    		c: function create() {
    			create_component(sideeditor.$$.fragment);
    			t = space();
    			hr = element("hr");
    			add_location(hr, file$4, 126, 0, 5721);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sideeditor, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, hr, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sideeditor_changes = {};
    			if (dirty & /*tmp_card*/ 1) sideeditor_changes.image_picker_disabled = /*tmp_card*/ ctx[0].card_type === 'occlusion';
    			if (dirty & /*placeholder*/ 4) sideeditor_changes.placeholder = /*placeholder*/ ctx[2].back;

    			if (!updating_text && dirty & /*tmp_card*/ 1) {
    				updating_text = true;
    				sideeditor_changes.text = /*tmp_card*/ ctx[0].back_text;
    				add_flush_callback(() => updating_text = false);
    			}

    			if (!updating_image_id && dirty & /*tmp_card*/ 1) {
    				updating_image_id = true;
    				sideeditor_changes.image_id = /*tmp_card*/ ctx[0].back_image_id;
    				add_flush_callback(() => updating_image_id = false);
    			}

    			sideeditor.$set(sideeditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sideeditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sideeditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sideeditor, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(125:0) {#if tmp_card.card_type!='verses'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let body;
    	let editheader;
    	let updating_card;
    	let t0;
    	let hr0;
    	let t1;
    	let t2;
    	let sideeditor;
    	let updating_text;
    	let updating_image_id;
    	let t3;
    	let hr1;
    	let t4;
    	let t5;
    	let tagseditor;
    	let updating_card_1;
    	let current;

    	function editheader_card_binding(value) {
    		/*editheader_card_binding*/ ctx[6](value);
    	}

    	let editheader_props = {};

    	if (/*tmp_card*/ ctx[0] !== void 0) {
    		editheader_props.card = /*tmp_card*/ ctx[0];
    	}

    	editheader = new Edit_header({ props: editheader_props, $$inline: true });
    	binding_callbacks.push(() => bind(editheader, 'card', editheader_card_binding));
    	editheader.$on("preview", /*preview*/ ctx[3]);
    	editheader.$on("cancel", /*cancel*/ ctx[4]);
    	editheader.$on("save", /*save*/ ctx[5]);
    	let if_block0 = /*tmp_card*/ ctx[0].card_type === 'occlusion' && create_if_block_1$2(ctx);

    	function sideeditor_text_binding(value) {
    		/*sideeditor_text_binding*/ ctx[9](value);
    	}

    	function sideeditor_image_id_binding(value) {
    		/*sideeditor_image_id_binding*/ ctx[10](value);
    	}

    	let sideeditor_props = {
    		image_picker_disabled: /*tmp_card*/ ctx[0].card_type === 'occlusion',
    		placeholder: /*placeholder*/ ctx[2].front
    	};

    	if (/*tmp_card*/ ctx[0].front_text !== void 0) {
    		sideeditor_props.text = /*tmp_card*/ ctx[0].front_text;
    	}

    	if (/*tmp_card*/ ctx[0].front_image_id !== void 0) {
    		sideeditor_props.image_id = /*tmp_card*/ ctx[0].front_image_id;
    	}

    	sideeditor = new Side_editor({ props: sideeditor_props, $$inline: true });
    	binding_callbacks.push(() => bind(sideeditor, 'text', sideeditor_text_binding));
    	binding_callbacks.push(() => bind(sideeditor, 'image_id', sideeditor_image_id_binding));
    	let if_block1 = /*tmp_card*/ ctx[0].card_type != 'verses' && create_if_block$3(ctx);

    	function tagseditor_card_binding(value) {
    		/*tagseditor_card_binding*/ ctx[13](value);
    	}

    	let tagseditor_props = {};

    	if (/*tmp_card*/ ctx[0] !== void 0) {
    		tagseditor_props.card = /*tmp_card*/ ctx[0];
    	}

    	tagseditor = new Tags_editor({ props: tagseditor_props, $$inline: true });
    	binding_callbacks.push(() => bind(tagseditor, 'card', tagseditor_card_binding));

    	const block = {
    		c: function create() {
    			body = element("body");
    			create_component(editheader.$$.fragment);
    			t0 = space();
    			hr0 = element("hr");
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			create_component(sideeditor.$$.fragment);
    			t3 = space();
    			hr1 = element("hr");
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			create_component(tagseditor.$$.fragment);
    			add_location(hr0, file$4, 113, 0, 5150);
    			add_location(hr1, file$4, 121, 0, 5495);
    			add_location(body, file$4, 110, 0, 5040);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			mount_component(editheader, body, null);
    			append_dev(body, t0);
    			append_dev(body, hr0);
    			append_dev(body, t1);
    			if (if_block0) if_block0.m(body, null);
    			append_dev(body, t2);
    			mount_component(sideeditor, body, null);
    			append_dev(body, t3);
    			append_dev(body, hr1);
    			append_dev(body, t4);
    			if (if_block1) if_block1.m(body, null);
    			append_dev(body, t5);
    			mount_component(tagseditor, body, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const editheader_changes = {};

    			if (!updating_card && dirty & /*tmp_card*/ 1) {
    				updating_card = true;
    				editheader_changes.card = /*tmp_card*/ ctx[0];
    				add_flush_callback(() => updating_card = false);
    			}

    			editheader.$set(editheader_changes);

    			if (/*tmp_card*/ ctx[0].card_type === 'occlusion') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*tmp_card*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(body, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const sideeditor_changes = {};
    			if (dirty & /*tmp_card*/ 1) sideeditor_changes.image_picker_disabled = /*tmp_card*/ ctx[0].card_type === 'occlusion';
    			if (dirty & /*placeholder*/ 4) sideeditor_changes.placeholder = /*placeholder*/ ctx[2].front;

    			if (!updating_text && dirty & /*tmp_card*/ 1) {
    				updating_text = true;
    				sideeditor_changes.text = /*tmp_card*/ ctx[0].front_text;
    				add_flush_callback(() => updating_text = false);
    			}

    			if (!updating_image_id && dirty & /*tmp_card*/ 1) {
    				updating_image_id = true;
    				sideeditor_changes.image_id = /*tmp_card*/ ctx[0].front_image_id;
    				add_flush_callback(() => updating_image_id = false);
    			}

    			sideeditor.$set(sideeditor_changes);

    			if (/*tmp_card*/ ctx[0].card_type != 'verses') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*tmp_card*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(body, t5);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const tagseditor_changes = {};

    			if (!updating_card_1 && dirty & /*tmp_card*/ 1) {
    				updating_card_1 = true;
    				tagseditor_changes.card = /*tmp_card*/ ctx[0];
    				add_flush_callback(() => updating_card_1 = false);
    			}

    			tagseditor.$set(tagseditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editheader.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(sideeditor.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(tagseditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editheader.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(sideeditor.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(tagseditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			destroy_component(editheader);
    			if (if_block0) if_block0.d();
    			destroy_component(sideeditor);
    			if (if_block1) if_block1.d();
    			destroy_component(tagseditor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let placeholder;
    	let $review_start;
    	let $card_to_edit;
    	validate_store(review_start, 'review_start');
    	component_subscribe($$self, review_start, $$value => $$invalidate(15, $review_start = $$value));
    	validate_store(card_to_edit, 'card_to_edit');
    	component_subscribe($$self, card_to_edit, $$value => $$invalidate(16, $card_to_edit = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Edit', slots, []);
    	let card = { ...$card_to_edit }; // copy into card
    	let tmp_card = { ...$card_to_edit }; // copy into tmp card
    	const start_time = unix_seconds();

    	let occlusion_data = {
    		box: { width: 500, height: 500 },
    		hide_all: true,
    		rectangles: []
    	};

    	onMount(async () => {
    		if (card.id != 0 && card.card_type === 'occlusion') {
    			$$invalidate(1, occlusion_data = await getOcclusionData(card.back_image_id));
    		}
    	});

    	function preview() {
    		card_to_preview.set(null);
    	}

    	function cancel() {
    		// if it was a new card (designated by id=0) we want to permanently delete it
    		if (card.id === 0) {
    			card.visibility = 'purged';
    		}

    		card_to_edit.set(null);
    	}

    	async function save() {
    		const end_time = unix_seconds();
    		var elapsed = end_time - start_time;

    		// increment review_start time by the seconds we spend editing the card
    		// this will make the reviewing_time be less so that we don't
    		// double count the time as both editing and reviewing
    		review_start.set($review_start + elapsed);

    		// copy over values from the tmp card
    		for (var key in tmp_card) {
    			card[key] = tmp_card[key];
    		}

    		if (card.card_type === 'occlusion') {
    			// If it took 30 seconds to make 6 Img Occlusion cards I want
    			// to report this as 5 seconds per card so that I do not overcount
    			elapsed = elapsed / occlusion_data.rectangles.length;

    			//const siblings = // fetch_cardlist back_image_id===card.back_image_id (old)
    			// replace siblings with already cards
    			// cards.push (siblings where not already in cards)
    			// occl_cards = siblings.
    			for (let rect of occlusion_data.rectangles) {
    				if (rect.deleted && rect.id != 0) {
    					// delete existing occlusion cards
    					// update the database via api
    					commit_changes({ id: rect.id, visibility: 'purged' });

    					// update cards locally
    					const cached_card = cards.find(elem => elem.id === rect.id);

    					cached_card.visibility = 'purged';
    				}

    				if (rect.id === 0 && !rect.deleted) {
    					// create new occlusion cards
    					let new_card = { ...card }; // copy existing occlusion card

    					new_card.id = random_id();
    					rect.id = new_card.id; // NB: We are building up occlusion data
    					cards.push(new_card);

    					// send it to the db
    					commit_changes(new_card, elapsed);
    				}
    			} // update occlusion data for all occl cards via api
    			// update occlusion data locally in cached cards

    			// We just assigned each rectangle to a real card we just created
    			// Now we save the image_occlusion_data in JSON to database media table
    			const media_id = await upload_media(JSON.stringify(occlusion_data), false);

    			// now go back and set back_image_id to media_id for all cards
    			for (let rect of occlusion_data.rectangles) {
    				// update the database
    				commit_changes({ id: rect.id, back_image_id: media_id });

    				// locally update cached cards
    				const cached_card = cards.find(elem => elem.id === rect.id);

    				cached_card.back_image_id = media_id;
    			}

    			// finally if our original card was one of these we should push it
    			quit();
    		} else if (card.card_type === 'basic' || card.card_type === 'verses') {
    			// API call to save edits to the server
    			if (card.id === 0) {
    				card.id = random_id();
    			}

    			commit_changes(card, elapsed);
    			quit();
    		}
    	}

    	function quit() {
    		card_to_edit.set(null);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Edit> was created with unknown prop '${key}'`);
    	});

    	function editheader_card_binding(value) {
    		tmp_card = value;
    		$$invalidate(0, tmp_card);
    	}

    	function imageoccluder_data_binding(value) {
    		occlusion_data = value;
    		$$invalidate(1, occlusion_data);
    	}

    	function imageoccluder_image_id_binding(value) {
    		if ($$self.$$.not_equal(tmp_card.front_image_id, value)) {
    			tmp_card.front_image_id = value;
    			$$invalidate(0, tmp_card);
    		}
    	}

    	function sideeditor_text_binding(value) {
    		if ($$self.$$.not_equal(tmp_card.front_text, value)) {
    			tmp_card.front_text = value;
    			$$invalidate(0, tmp_card);
    		}
    	}

    	function sideeditor_image_id_binding(value) {
    		if ($$self.$$.not_equal(tmp_card.front_image_id, value)) {
    			tmp_card.front_image_id = value;
    			$$invalidate(0, tmp_card);
    		}
    	}

    	function sideeditor_text_binding_1(value) {
    		if ($$self.$$.not_equal(tmp_card.back_text, value)) {
    			tmp_card.back_text = value;
    			$$invalidate(0, tmp_card);
    		}
    	}

    	function sideeditor_image_id_binding_1(value) {
    		if ($$self.$$.not_equal(tmp_card.back_image_id, value)) {
    			tmp_card.back_image_id = value;
    			$$invalidate(0, tmp_card);
    		}
    	}

    	function tagseditor_card_binding(value) {
    		tmp_card = value;
    		$$invalidate(0, tmp_card);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		get_placeholder,
    		local_unix_day,
    		unix_seconds,
    		getOcclusionData,
    		random_id,
    		upload_media,
    		commit_changes,
    		SideEditor: Side_editor,
    		TagsEditor: Tags_editor,
    		EditHeader: Edit_header,
    		ImageOccluder: Image_occluder,
    		card_to_edit,
    		card_to_preview,
    		review_start,
    		card,
    		tmp_card,
    		start_time,
    		occlusion_data,
    		preview,
    		cancel,
    		save,
    		quit,
    		placeholder,
    		$review_start,
    		$card_to_edit
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) card = $$props.card;
    		if ('tmp_card' in $$props) $$invalidate(0, tmp_card = $$props.tmp_card);
    		if ('occlusion_data' in $$props) $$invalidate(1, occlusion_data = $$props.occlusion_data);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*tmp_card*/ 1) {
    			$$invalidate(2, placeholder = get_placeholder(tmp_card.card_type));
    		}
    	};

    	return [
    		tmp_card,
    		occlusion_data,
    		placeholder,
    		preview,
    		cancel,
    		save,
    		editheader_card_binding,
    		imageoccluder_data_binding,
    		imageoccluder_image_id_binding,
    		sideeditor_text_binding,
    		sideeditor_image_id_binding,
    		sideeditor_text_binding_1,
    		sideeditor_image_id_binding_1,
    		tagseditor_card_binding
    	];
    }

    class Edit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edit",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/occlusion_reviewer.svelte generated by Svelte v3.48.0 */
    const file$3 = "src/occlusion_reviewer.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (29:0) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(29:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:0) {#if occlusion_data}
    function create_if_block$2(ctx) {
    	let div;
    	let each_value = /*occlusion_data*/ ctx[2].rectangles;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "occludedImage");
    			attr_dev(div, "class", "svelte-1i7whgz");
    			set_style(div, "width", /*occlusion_data*/ ctx[2].box.width + 'px', false);
    			set_style(div, "height", /*occlusion_data*/ ctx[2].box.height + 'px', false);
    			add_location(div, file$3, 15, 0, 542);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			/*div_binding*/ ctx[4](div);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*occlusion_data, card, flipped*/ 7) {
    				each_value = /*occlusion_data*/ ctx[2].rectangles;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*occlusion_data*/ 4) {
    				set_style(div, "width", /*occlusion_data*/ ctx[2].box.width + 'px', false);
    			}

    			if (dirty & /*occlusion_data*/ 4) {
    				set_style(div, "height", /*occlusion_data*/ ctx[2].box.height + 'px', false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			/*div_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(15:0) {#if occlusion_data}",
    		ctx
    	});

    	return block;
    }

    // (18:10) {#if !rect.deleted}
    function create_if_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_style(div, "position", "absolute");
    			set_style(div, "top", /*rect*/ ctx[5].top + "px");
    			set_style(div, "left", /*rect*/ ctx[5].left + "px");
    			set_style(div, "width", /*rect*/ ctx[5].width + "px");
    			set_style(div, "height", /*rect*/ ctx[5].height + "px");

    			set_style(div, "background-color", /*card*/ ctx[0].id === /*rect*/ ctx[5].id
    			? 'transparent'
    			: !/*occlusion_data*/ ctx[2].hide_all
    				? 'rgba(70,70,70,0.2)'
    				: 'rgba(70,70,70,1)');

    			set_style(div, "border", "5px solid " + (!(/*card*/ ctx[0].id === /*rect*/ ctx[5].id)
    			? 'black'
    			: /*flipped*/ ctx[1] ? 'green' : 'red'));

    			add_location(div, file$3, 18, 12, 769);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*occlusion_data*/ 4) {
    				set_style(div, "top", /*rect*/ ctx[5].top + "px");
    			}

    			if (dirty & /*occlusion_data*/ 4) {
    				set_style(div, "left", /*rect*/ ctx[5].left + "px");
    			}

    			if (dirty & /*occlusion_data*/ 4) {
    				set_style(div, "width", /*rect*/ ctx[5].width + "px");
    			}

    			if (dirty & /*occlusion_data*/ 4) {
    				set_style(div, "height", /*rect*/ ctx[5].height + "px");
    			}

    			if (dirty & /*card, occlusion_data*/ 5) {
    				set_style(div, "background-color", /*card*/ ctx[0].id === /*rect*/ ctx[5].id
    				? 'transparent'
    				: !/*occlusion_data*/ ctx[2].hide_all
    					? 'rgba(70,70,70,0.2)'
    					: 'rgba(70,70,70,1)');
    			}

    			if (dirty & /*card, occlusion_data, flipped*/ 7) {
    				set_style(div, "border", "5px solid " + (!(/*card*/ ctx[0].id === /*rect*/ ctx[5].id)
    				? 'black'
    				: /*flipped*/ ctx[1] ? 'green' : 'red'));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(18:10) {#if !rect.deleted}",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#each occlusion_data.rectangles as rect}
    function create_each_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = !/*rect*/ ctx[5].deleted && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*rect*/ ctx[5].deleted) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(17:2) {#each occlusion_data.rectangles as rect}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*occlusion_data*/ ctx[2]) return create_if_block$2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Occlusion_reviewer', slots, []);
    	let { card } = $$props;
    	let { flipped } = $$props;
    	let occlusion_data;
    	let occludedImage;

    	onMount(async () => {
    		$$invalidate(2, occlusion_data = await getOcclusionData(card.back_image_id));
    		const image_url = await getProtectedImage(card.front_image_id);
    		$$invalidate(3, occludedImage.style['background-image'] = 'url(' + image_url + ')', occludedImage);
    	});

    	const writable_props = ['card', 'flipped'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Occlusion_reviewer> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			occludedImage = $$value;
    			$$invalidate(3, occludedImage);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('flipped' in $$props) $$invalidate(1, flipped = $$props.flipped);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getProtectedImage,
    		getOcclusionData,
    		card,
    		flipped,
    		occlusion_data,
    		occludedImage
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('flipped' in $$props) $$invalidate(1, flipped = $$props.flipped);
    		if ('occlusion_data' in $$props) $$invalidate(2, occlusion_data = $$props.occlusion_data);
    		if ('occludedImage' in $$props) $$invalidate(3, occludedImage = $$props.occludedImage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [card, flipped, occlusion_data, occludedImage, div_binding];
    }

    class Occlusion_reviewer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { card: 0, flipped: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Occlusion_reviewer",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*card*/ ctx[0] === undefined && !('card' in props)) {
    			console.warn("<Occlusion_reviewer> was created without expected prop 'card'");
    		}

    		if (/*flipped*/ ctx[1] === undefined && !('flipped' in props)) {
    			console.warn("<Occlusion_reviewer> was created without expected prop 'flipped'");
    		}
    	}

    	get card() {
    		throw new Error("<Occlusion_reviewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Occlusion_reviewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flipped() {
    		throw new Error("<Occlusion_reviewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flipped(value) {
    		throw new Error("<Occlusion_reviewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/review.svelte generated by Svelte v3.48.0 */

    const file$2 = "src/review.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i][0];
    	child_ctx[30] = list[i][1];
    	return child_ctx;
    }

    // (107:0) {#if flipped && !preview}
    function create_if_block_7(ctx) {
    	let div0;
    	let button0;
    	let u0;
    	let t1;
    	let t2;
    	let button1;
    	let t3;
    	let html_tag;
    	let raw_value = (/*preview*/ ctx[6] ? '<u>b</u>ack' : '<u>q</u>uit') + "";
    	let t4;
    	let button2;
    	let t5;
    	let u1;
    	let t7;
    	let t8;
    	let div1;
    	let mounted;
    	let dispose;
    	let if_block = /*hypo_due_dates*/ ctx[5] && create_if_block_8(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button0 = element("button");
    			u0 = element("u");
    			u0.textContent = "e";
    			t1 = text("dit");
    			t2 = space();
    			button1 = element("button");
    			t3 = text("⏎ ");
    			html_tag = new HtmlTag(false);
    			t4 = space();
    			button2 = element("button");
    			t5 = text("✕ ");
    			u1 = element("u");
    			u1.textContent = "d";
    			t7 = text("elete");
    			t8 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			add_location(u0, file$2, 108, 54, 3844);
    			attr_dev(button0, "class", "manage_button svelte-1196xzv");
    			add_location(button0, file$2, 108, 8, 3798);
    			html_tag.a = null;
    			attr_dev(button1, "class", "manage_button svelte-1196xzv");
    			add_location(button1, file$2, 109, 8, 3873);
    			add_location(u1, file$2, 110, 63, 4041);
    			attr_dev(button2, "class", "manage_button svelte-1196xzv");
    			add_location(button2, file$2, 110, 8, 3986);
    			attr_dev(div0, "id", "manage_buttons_bar");
    			attr_dev(div0, "class", "svelte-1196xzv");
    			add_location(div0, file$2, 107, 8, 3760);
    			attr_dev(div1, "id", "grade_buttons_bar");
    			attr_dev(div1, "class", "svelte-1196xzv");
    			add_location(div1, file$2, 112, 8, 4087);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button0);
    			append_dev(button0, u0);
    			append_dev(button0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, button1);
    			append_dev(button1, t3);
    			html_tag.m(raw_value, button1);
    			append_dev(div0, t4);
    			append_dev(div0, button2);
    			append_dev(button2, t5);
    			append_dev(button2, u1);
    			append_dev(button2, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*edit*/ ctx[11], false, false, false),
    					listen_dev(button1, "click", /*quit*/ ctx[10], false, false, false),
    					listen_dev(button2, "click", /*delete_card*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hypo_due_dates*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_8(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(107:0) {#if flipped && !preview}",
    		ctx
    	});

    	return block;
    }

    // (114:16) {#if hypo_due_dates}
    function create_if_block_8(ctx) {
    	let each_1_anchor;
    	let each_value_1 = [['again', 1], ['hard', 2], ['good', 3], ['easy', 4]];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < 4; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*grade, hypo_due_dates, current_time*/ 4256) {
    				each_value_1 = [['again', 1], ['hard', 2], ['good', 3], ['easy', 4]];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < 4; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < 4; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(114:16) {#if hypo_due_dates}",
    		ctx
    	});

    	return block;
    }

    // (115:16) {#each [['again',1], ['hard',2], ['good',3], ['easy',4]] as [grade_val, num]}
    function create_each_block_1(ctx) {
    	let button;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let br;
    	let t4;
    	let span;
    	let t5;
    	let t6_value = Math.floor(/*hypo_due_dates*/ ctx[5][/*grade_val*/ ctx[29]]) - Math.floor(/*current_time*/ ctx[7]) + "";
    	let t6;
    	let t7;
    	let t8;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[16](/*grade_val*/ ctx[29]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(/*grade_val*/ ctx[29]);
    			t1 = text(" (");
    			t2 = text(/*num*/ ctx[30]);
    			t3 = text(")");
    			br = element("br");
    			t4 = space();
    			span = element("span");
    			t5 = text("+");
    			t6 = text(t6_value);
    			t7 = text(" days");
    			t8 = space();
    			add_location(br, file$2, 116, 51, 4402);
    			set_style(span, "font-size", "12px");
    			add_location(span, file$2, 117, 32, 4439);
    			attr_dev(button, "class", "grade_button svelte-1196xzv");
    			add_location(button, file$2, 115, 24, 4271);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(button, t3);
    			append_dev(button, br);
    			append_dev(button, t4);
    			append_dev(button, span);
    			append_dev(span, t5);
    			append_dev(span, t6);
    			append_dev(span, t7);
    			append_dev(button, t8);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", stop_propagation(click_handler), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*hypo_due_dates*/ 32 && t6_value !== (t6_value = Math.floor(/*hypo_due_dates*/ ctx[5][/*grade_val*/ ctx[29]]) - Math.floor(/*current_time*/ ctx[7]) + "")) set_data_dev(t6, t6_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(115:16) {#each [['again',1], ['hard',2], ['good',3], ['easy',4]] as [grade_val, num]}",
    		ctx
    	});

    	return block;
    }

    // (128:36) 
    function create_if_block_6(ctx) {
    	let each_1_anchor;
    	let each_value = /*verses_lines*/ ctx[8].slice(0, /*verses_line_no*/ ctx[4]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*verses_lines, verses_line_no*/ 272) {
    				each_value = /*verses_lines*/ ctx[8].slice(0, /*verses_line_no*/ ctx[4]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(128:36) ",
    		ctx
    	});

    	return block;
    }

    // (126:0) {#if card.card_type==='basic' || preview}
    function create_if_block_5(ctx) {
    	let html_tag;
    	let raw_value = /*card*/ ctx[0].front_text.replace(/\n/g, '<br>') + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*card*/ 1 && raw_value !== (raw_value = /*card*/ ctx[0].front_text.replace(/\n/g, '<br>') + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(126:0) {#if card.card_type==='basic' || preview}",
    		ctx
    	});

    	return block;
    }

    // (129:2) {#each verses_lines.slice(0,verses_line_no) as line}
    function create_each_block(ctx) {
    	let t_value = /*line*/ ctx[26] + "";
    	let t;
    	let br;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    			br = element("br");
    			add_location(br, file$2, 129, 16, 4848);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*verses_line_no*/ 16 && t_value !== (t_value = /*line*/ ctx[26] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(129:2) {#each verses_lines.slice(0,verses_line_no) as line}",
    		ctx
    	});

    	return block;
    }

    // (135:0) {#if !flipped}
    function create_if_block_4(ctx) {
    	let button;

    	let t0_value = (/*card*/ ctx[0].card_type === 'verses'
    	? 'Next Line'
    	: 'Flip') + "";

    	let t0;
    	let br;
    	let t1;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			br = element("br");
    			t1 = space();
    			span = element("span");
    			span.textContent = "(click anywhere)";
    			add_location(br, file$2, 136, 66, 5021);
    			set_style(span, "font-size", "14px");
    			add_location(span, file$2, 137, 16, 5042);
    			attr_dev(button, "id", "flipper");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "svelte-1196xzv");
    			add_location(button, file$2, 135, 8, 4902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, br);
    			append_dev(button, t1);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*flip*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*card*/ 1 && t0_value !== (t0_value = (/*card*/ ctx[0].card_type === 'verses'
    			? 'Next Line'
    			: 'Flip') + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(135:0) {#if !flipped}",
    		ctx
    	});

    	return block;
    }

    // (142:0) {#if card.card_type!='verses' && flipped}
    function create_if_block_3(ctx) {
    	let div;
    	let br;
    	let t;
    	let html_tag;
    	let raw_value = /*card*/ ctx[0].back_text.replace('\n', '<br>') + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			br = element("br");
    			t = space();
    			html_tag = new HtmlTag(false);
    			add_location(br, file$2, 143, 16, 5207);
    			html_tag.a = null;
    			attr_dev(div, "id", "backside");
    			add_location(div, file$2, 142, 8, 5171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, br);
    			append_dev(div, t);
    			html_tag.m(raw_value, div);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*card*/ 1 && raw_value !== (raw_value = /*card*/ ctx[0].back_text.replace('\n', '<br>') + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(142:0) {#if card.card_type!='verses' && flipped}",
    		ctx
    	});

    	return block;
    }

    // (152:0) {#if card.back_image_id!=0 && flipped && !card.card_type==='occlusion'}
    function create_if_block_2(ctx) {
    	let center;
    	let img;

    	const block = {
    		c: function create() {
    			center = element("center");
    			img = element("img");
    			attr_dev(img, "alt", "back");
    			attr_dev(img, "class", "svelte-1196xzv");
    			add_location(img, file$2, 152, 16, 5400);
    			add_location(center, file$2, 152, 8, 5392);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, img);
    			/*img_binding*/ ctx[17](img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			/*img_binding*/ ctx[17](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(152:0) {#if card.back_image_id!=0 && flipped && !card.card_type==='occlusion'}",
    		ctx
    	});

    	return block;
    }

    // (155:0) {#if card.front_image_id!=0 && (card.back_image_id===0 || preview || !flipped) && !card.card_type==='occlusion'}
    function create_if_block_1(ctx) {
    	let center;
    	let img;

    	const block = {
    		c: function create() {
    			center = element("center");
    			img = element("img");
    			attr_dev(img, "alt", "front");
    			attr_dev(img, "class", "svelte-1196xzv");
    			add_location(img, file$2, 155, 16, 5584);
    			add_location(center, file$2, 155, 8, 5576);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, img);
    			/*img_binding_1*/ ctx[18](img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			/*img_binding_1*/ ctx[18](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(155:0) {#if card.front_image_id!=0 && (card.back_image_id===0 || preview || !flipped) && !card.card_type==='occlusion'}",
    		ctx
    	});

    	return block;
    }

    // (160:0) {#if card.card_type==='occlusion' && card.front_image_id}
    function create_if_block$1(ctx) {
    	let occlusionreviewer;
    	let updating_card;
    	let updating_flipped;
    	let current;

    	function occlusionreviewer_card_binding(value) {
    		/*occlusionreviewer_card_binding*/ ctx[19](value);
    	}

    	function occlusionreviewer_flipped_binding(value) {
    		/*occlusionreviewer_flipped_binding*/ ctx[20](value);
    	}

    	let occlusionreviewer_props = {};

    	if (/*card*/ ctx[0] !== void 0) {
    		occlusionreviewer_props.card = /*card*/ ctx[0];
    	}

    	if (/*flipped*/ ctx[3] !== void 0) {
    		occlusionreviewer_props.flipped = /*flipped*/ ctx[3];
    	}

    	occlusionreviewer = new Occlusion_reviewer({
    			props: occlusionreviewer_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(occlusionreviewer, 'card', occlusionreviewer_card_binding));
    	binding_callbacks.push(() => bind(occlusionreviewer, 'flipped', occlusionreviewer_flipped_binding));

    	const block = {
    		c: function create() {
    			create_component(occlusionreviewer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(occlusionreviewer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const occlusionreviewer_changes = {};

    			if (!updating_card && dirty[0] & /*card*/ 1) {
    				updating_card = true;
    				occlusionreviewer_changes.card = /*card*/ ctx[0];
    				add_flush_callback(() => updating_card = false);
    			}

    			if (!updating_flipped && dirty[0] & /*flipped*/ 8) {
    				updating_flipped = true;
    				occlusionreviewer_changes.flipped = /*flipped*/ ctx[3];
    				add_flush_callback(() => updating_flipped = false);
    			}

    			occlusionreviewer.$set(occlusionreviewer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(occlusionreviewer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(occlusionreviewer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(occlusionreviewer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(160:0) {#if card.card_type==='occlusion' && card.front_image_id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let body;
    	let div;
    	let t0;
    	let t1;
    	let br0;
    	let br1;
    	let t2;
    	let t3;
    	let t4;
    	let t5_value = /*card*/ ctx[0].tags + "";
    	let t5;
    	let t6;
    	let hr;
    	let t7;
    	let t8;
    	let t9;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*flipped*/ ctx[3] && !/*preview*/ ctx[6] && create_if_block_7(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*card*/ ctx[0].card_type === 'basic' || /*preview*/ ctx[6]) return create_if_block_5;
    		if (/*card*/ ctx[0].card_type === 'verses') return create_if_block_6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);
    	let if_block2 = !/*flipped*/ ctx[3] && create_if_block_4(ctx);
    	let if_block3 = /*card*/ ctx[0].card_type != 'verses' && /*flipped*/ ctx[3] && create_if_block_3(ctx);
    	let if_block4 = /*card*/ ctx[0].back_image_id != 0 && /*flipped*/ ctx[3] && !/*card*/ ctx[0].card_type === 'occlusion' && create_if_block_2(ctx);
    	let if_block5 = /*card*/ ctx[0].front_image_id != 0 && (/*card*/ ctx[0].back_image_id === 0 || /*preview*/ ctx[6] || !/*flipped*/ ctx[3]) && !/*card*/ ctx[0].card_type === 'occlusion' && create_if_block_1(ctx);
    	let if_block6 = /*card*/ ctx[0].card_type === 'occlusion' && /*card*/ ctx[0].front_image_id && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			body = element("body");
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = space();
    			hr = element("hr");
    			t7 = space();
    			if (if_block4) if_block4.c();
    			t8 = space();
    			if (if_block5) if_block5.c();
    			t9 = space();
    			if (if_block6) if_block6.c();
    			attr_dev(div, "id", "buttons_bar");
    			attr_dev(div, "class", "svelte-1196xzv");
    			add_location(div, file$2, 105, 0, 3703);
    			add_location(br0, file$2, 133, 0, 4870);
    			add_location(br1, file$2, 133, 4, 4874);
    			add_location(hr, file$2, 149, 0, 5306);
    			attr_dev(body, "class", "svelte-1196xzv");
    			add_location(body, file$2, 103, 0, 3669);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(body, t0);
    			if (if_block1) if_block1.m(body, null);
    			append_dev(body, t1);
    			append_dev(body, br0);
    			append_dev(body, br1);
    			append_dev(body, t2);
    			if (if_block2) if_block2.m(body, null);
    			append_dev(body, t3);
    			if (if_block3) if_block3.m(body, null);
    			append_dev(body, t4);
    			append_dev(body, t5);
    			append_dev(body, t6);
    			append_dev(body, hr);
    			append_dev(body, t7);
    			if (if_block4) if_block4.m(body, null);
    			append_dev(body, t8);
    			if (if_block5) if_block5.m(body, null);
    			append_dev(body, t9);
    			if (if_block6) if_block6.m(body, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handleKeydown*/ ctx[15], false, false, false),
    					listen_dev(body, "click", /*default_action*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*flipped*/ ctx[3] && !/*preview*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(div, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(body, t1);
    				}
    			}

    			if (!/*flipped*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_4(ctx);
    					if_block2.c();
    					if_block2.m(body, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*card*/ ctx[0].card_type != 'verses' && /*flipped*/ ctx[3]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_3(ctx);
    					if_block3.c();
    					if_block3.m(body, t4);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if ((!current || dirty[0] & /*card*/ 1) && t5_value !== (t5_value = /*card*/ ctx[0].tags + "")) set_data_dev(t5, t5_value);

    			if (/*card*/ ctx[0].back_image_id != 0 && /*flipped*/ ctx[3] && !/*card*/ ctx[0].card_type === 'occlusion') {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_2(ctx);
    					if_block4.c();
    					if_block4.m(body, t8);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*card*/ ctx[0].front_image_id != 0 && (/*card*/ ctx[0].back_image_id === 0 || /*preview*/ ctx[6] || !/*flipped*/ ctx[3]) && !/*card*/ ctx[0].card_type === 'occlusion') {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_1(ctx);
    					if_block5.c();
    					if_block5.m(body, t9);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*card*/ ctx[0].card_type === 'occlusion' && /*card*/ ctx[0].front_image_id) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);

    					if (dirty[0] & /*card*/ 1) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block$1(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(body, null);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block6);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block6);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			if (if_block0) if_block0.d();

    			if (if_block1) {
    				if_block1.d();
    			}

    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $next_two_due;
    	let $review_start;
    	let $card_to_preview;
    	let $card_to_review;
    	validate_store(next_two_due, 'next_two_due');
    	component_subscribe($$self, next_two_due, $$value => $$invalidate(22, $next_two_due = $$value));
    	validate_store(review_start, 'review_start');
    	component_subscribe($$self, review_start, $$value => $$invalidate(23, $review_start = $$value));
    	validate_store(card_to_preview, 'card_to_preview');
    	component_subscribe($$self, card_to_preview, $$value => $$invalidate(24, $card_to_preview = $$value));
    	validate_store(card_to_review, 'card_to_review');
    	component_subscribe($$self, card_to_review, $$value => $$invalidate(25, $card_to_review = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Review', slots, []);
    	let card = $card_to_preview || $card_to_review;
    	let preview = $card_to_preview != null;
    	let current_time = local_unix_day();
    	let review_stop;
    	let back_img;
    	let front_img;
    	let flipped = preview; //we are done clicking and should see the grading buttons
    	let verses_line_no = 1;
    	let verses_lines = card.front_text.split('\n');
    	let hypo_due_dates = { again: 0, hard: 10, good: 15, easy: 25 };

    	onMount(async () => {
    		$$invalidate(5, hypo_due_dates = await hypothetical_due_dates(card.id, current_time));
    		review_start.set(unix_seconds());

    		if (card.front_image_id != 0) {
    			const image_url = await getProtectedImage(card.front_image_id);
    			$$invalidate(2, front_img.src = image_url, front_img);
    		}

    		if (card.back_image_id != 0 && card.card_type != 'occlusion') {
    			$$invalidate(1, back_img.src = await getProtectedImage(card.back_image_id), back_img);
    		}
    	});

    	function delete_card() {
    		$$invalidate(0, card.visibility = 'deleted', card);
    		commit_changes(card);
    		quit();
    	}

    	function quit() {
    		if ($card_to_preview) {
    			card_to_preview.set(null);
    		} else {
    			card_to_review.set(null);
    		}
    	}

    	function edit() {
    		card_to_edit.set(card);
    	}

    	async function grade(grade) {
    		// postpone the card while we figure out what the
    		// real due date is. This lets the reviewer continue
    		// to the next card while we figure it out.
    		$$invalidate(0, card.due_date = current_time + 1, card);

    		review_stop = unix_seconds();
    		var elapsed = review_stop - $review_start;
    		await commit_grade(card.id, grade, elapsed);
    		$$invalidate(0, card.due_date = hypo_due_dates[grade], card);
    		await commit_changes(card);

    		// TODO set the due_date equal to the hypothetical and push to the server
    		card_to_review.set($next_two_due[1]);
    	}

    	function flip() {
    		if (card.card_type === 'basic' || card.card_type === 'occlusion') {
    			$$invalidate(3, flipped = true);
    		} else if (card.card_type === 'verses') {
    			$$invalidate(4, verses_line_no++, verses_line_no);
    			$$invalidate(3, flipped = verses_line_no === verses_lines.length);
    		}
    	}

    	function default_action() {
    		if (!flipped) {
    			flip();
    		} //grade('good');
    	}

    	function handleKeydown(event) {
    		//let char = (typeof event !== 'undefined') ? String.fromCharCode(event.keyCode) : event.which
    		const char = event.key;

    		if (char === 'e') {
    			edit();
    		} else if (char === 'b' || char == 'q') {
    			quit();
    		} else if (char === 'd') {
    			delete_card();
    		} else if (char === ' ') {
    			default_action();
    		} else if (char === '1') {
    			grade('again');
    		} else if (char === '2') {
    			grade('hard');
    		} else if (char === '3') {
    			grade('good');
    		} else if (char === '4') {
    			grade('easy');
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Review> was created with unknown prop '${key}'`);
    	});

    	const click_handler = grade_val => grade(grade_val);

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			back_img = $$value;
    			$$invalidate(1, back_img);
    		});
    	}

    	function img_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			front_img = $$value;
    			$$invalidate(2, front_img);
    		});
    	}

    	function occlusionreviewer_card_binding(value) {
    		card = value;
    		$$invalidate(0, card);
    	}

    	function occlusionreviewer_flipped_binding(value) {
    		flipped = value;
    		$$invalidate(3, flipped);
    	}

    	$$self.$capture_state = () => ({
    		OcclusionReviewer: Occlusion_reviewer,
    		onMount,
    		unix_seconds,
    		local_unix_day,
    		dummy_card,
    		next_two_due,
    		hypothetical_due_dates,
    		commit_grade,
    		commit_changes,
    		getProtectedImage,
    		card_to_edit,
    		card_to_review,
    		card_to_preview,
    		review_start,
    		card,
    		preview,
    		current_time,
    		review_stop,
    		back_img,
    		front_img,
    		flipped,
    		verses_line_no,
    		verses_lines,
    		hypo_due_dates,
    		delete_card,
    		quit,
    		edit,
    		grade,
    		flip,
    		default_action,
    		handleKeydown,
    		$next_two_due,
    		$review_start,
    		$card_to_preview,
    		$card_to_review
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('preview' in $$props) $$invalidate(6, preview = $$props.preview);
    		if ('current_time' in $$props) $$invalidate(7, current_time = $$props.current_time);
    		if ('review_stop' in $$props) review_stop = $$props.review_stop;
    		if ('back_img' in $$props) $$invalidate(1, back_img = $$props.back_img);
    		if ('front_img' in $$props) $$invalidate(2, front_img = $$props.front_img);
    		if ('flipped' in $$props) $$invalidate(3, flipped = $$props.flipped);
    		if ('verses_line_no' in $$props) $$invalidate(4, verses_line_no = $$props.verses_line_no);
    		if ('verses_lines' in $$props) $$invalidate(8, verses_lines = $$props.verses_lines);
    		if ('hypo_due_dates' in $$props) $$invalidate(5, hypo_due_dates = $$props.hypo_due_dates);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		card,
    		back_img,
    		front_img,
    		flipped,
    		verses_line_no,
    		hypo_due_dates,
    		preview,
    		current_time,
    		verses_lines,
    		delete_card,
    		quit,
    		edit,
    		grade,
    		flip,
    		default_action,
    		handleKeydown,
    		click_handler,
    		img_binding,
    		img_binding_1,
    		occlusionreviewer_card_binding,
    		occlusionreviewer_flipped_binding
    	];
    }

    class Review extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Review",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/login.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/login.svelte";

    // (62:0) {#if register_or_login==='login' && failed_login}
    function create_if_block(ctx) {
    	let center;

    	const block = {
    		c: function create() {
    			center = element("center");
    			center.textContent = "Incorrect Password";
    			set_style(center, "color", "darkred");
    			add_location(center, file$1, 62, 8, 2472);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(62:0) {#if register_or_login==='login' && failed_login}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let body;
    	let t0;
    	let t1;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let t4;
    	let div;
    	let label0;
    	let input2;
    	let t5;
    	let t6;
    	let label1;
    	let input3;
    	let t7;
    	let t8;
    	let input4;
    	let input4_disabled_value;
    	let t9;
    	let br;
    	let center;
    	let button;
    	let mounted;
    	let dispose;
    	let if_block = /*register_or_login*/ ctx[2] === 'login' && /*failed_login*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			body = element("body");
    			t0 = text(/*warning*/ ctx[7]);
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			div = element("div");
    			label0 = element("label");
    			input2 = element("input");
    			t5 = text(" LOGIN");
    			t6 = space();
    			label1 = element("label");
    			input3 = element("input");
    			t7 = text(" REGISTER");
    			t8 = space();
    			input4 = element("input");
    			t9 = space();
    			br = element("br");
    			center = element("center");
    			button = element("button");
    			button.textContent = "continue as guest";
    			attr_dev(input0, "class", "entry svelte-1dlq1ng");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Username");
    			add_location(input0, file$1, 58, 0, 2168);
    			attr_dev(input1, "class", "entry svelte-1dlq1ng");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "placeholder", "Password");
    			add_location(input1, file$1, 59, 0, 2278);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "rol");
    			input2.__value = "login";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[20][0].push(input2);
    			add_location(input2, file$1, 66, 8, 2568);
    			attr_dev(label0, "class", "svelte-1dlq1ng");
    			add_location(label0, file$1, 66, 1, 2561);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "rol");
    			input3.__value = "register";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[20][0].push(input3);
    			add_location(input3, file$1, 67, 8, 2667);
    			attr_dev(label1, "class", "svelte-1dlq1ng");
    			add_location(label1, file$1, 67, 1, 2660);
    			attr_dev(input4, "type", "submit");
    			input4.value = /*register_or_login*/ ctx[2];
    			input4.disabled = input4_disabled_value = !/*submit_possible*/ ctx[8];
    			set_style(input4, "border", /*submit_possible*/ ctx[8] ? '1px solid black' : '', false);
    			add_location(input4, file$1, 68, 8, 2772);
    			attr_dev(div, "id", "bottom_row");
    			attr_dev(div, "class", "svelte-1dlq1ng");
    			add_location(div, file$1, 65, 0, 2538);
    			add_location(br, file$1, 70, 0, 2955);
    			attr_dev(button, "type", "button");
    			add_location(button, file$1, 70, 12, 2967);
    			add_location(center, file$1, 70, 4, 2959);
    			attr_dev(body, "class", "svelte-1dlq1ng");
    			add_location(body, file$1, 56, 0, 2151);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, t0);
    			append_dev(body, t1);
    			append_dev(body, input0);
    			/*input0_binding*/ ctx[15](input0);
    			set_input_value(input0, /*typed_username*/ ctx[0]);
    			append_dev(body, t2);
    			append_dev(body, input1);
    			/*input1_binding*/ ctx[17](input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(body, t3);
    			if (if_block) if_block.m(body, null);
    			append_dev(body, t4);
    			append_dev(body, div);
    			append_dev(div, label0);
    			append_dev(label0, input2);
    			input2.checked = input2.__value === /*register_or_login*/ ctx[2];
    			append_dev(label0, t5);
    			append_dev(div, t6);
    			append_dev(div, label1);
    			append_dev(label1, input3);
    			input3.checked = input3.__value === /*register_or_login*/ ctx[2];
    			append_dev(label1, t7);
    			append_dev(div, t8);
    			append_dev(div, input4);
    			/*input4_binding*/ ctx[22](input4);
    			append_dev(body, t9);
    			append_dev(body, br);
    			append_dev(body, center);
    			append_dev(center, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[16]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[18]),
    					listen_dev(input1, "keydown", /*handleKeydown*/ ctx[10], false, false, false),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[19]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[21]),
    					listen_dev(input4, "click", /*submit*/ ctx[9], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*warning*/ 128) set_data_dev(t0, /*warning*/ ctx[7]);

    			if (dirty & /*typed_username*/ 1 && input0.value !== /*typed_username*/ ctx[0]) {
    				set_input_value(input0, /*typed_username*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			if (/*register_or_login*/ ctx[2] === 'login' && /*failed_login*/ ctx[3]) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(body, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*register_or_login*/ 4) {
    				input2.checked = input2.__value === /*register_or_login*/ ctx[2];
    			}

    			if (dirty & /*register_or_login*/ 4) {
    				input3.checked = input3.__value === /*register_or_login*/ ctx[2];
    			}

    			if (dirty & /*register_or_login*/ 4) {
    				prop_dev(input4, "value", /*register_or_login*/ ctx[2]);
    			}

    			if (dirty & /*submit_possible*/ 256 && input4_disabled_value !== (input4_disabled_value = !/*submit_possible*/ ctx[8])) {
    				prop_dev(input4, "disabled", input4_disabled_value);
    			}

    			if (dirty & /*submit_possible*/ 256) {
    				set_style(input4, "border", /*submit_possible*/ ctx[8] ? '1px solid black' : '', false);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			/*input0_binding*/ ctx[15](null);
    			/*input1_binding*/ ctx[17](null);
    			if (if_block) if_block.d();
    			/*$$binding_groups*/ ctx[20][0].splice(/*$$binding_groups*/ ctx[20][0].indexOf(input2), 1);
    			/*$$binding_groups*/ ctx[20][0].splice(/*$$binding_groups*/ ctx[20][0].indexOf(input3), 1);
    			/*input4_binding*/ ctx[22](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let user_exists;
    	let login_possible;
    	let register_possible;
    	let submit_possible;
    	let warning;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let users = [];
    	let typed_username = '';
    	let password = '';
    	let register_or_login = 'login';
    	let failed_login = false;
    	let password_box;
    	let username_box;

    	onMount(async () => {
    		$$invalidate(11, users = await get_users_list());
    		username_box.focus();
    	});

    	async function login() {
    		const success = await get_token(typed_username, password);

    		if (success) {
    			username.set(typed_username);
    		} else {
    			$$invalidate(3, failed_login = true);
    			$$invalidate(1, password = '');
    			password_box.focus();
    		}
    	}

    	async function register() {
    		const success = await register_and_get_token(typed_username, password);

    		if (success) {
    			username.set(typed_username);
    		} else {
    			alert('registration failed');
    		}
    	}

    	function submit() {
    		if (register_or_login === 'login') {
    			login();
    		} else {
    			register();
    		}
    	}

    	let submit_button;

    	function handleKeydown(event) {
    		if (event.key !== 'Enter') return;
    		event.preventDefault();
    		submit_button.click();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			username_box = $$value;
    			$$invalidate(5, username_box);
    		});
    	}

    	function input0_input_handler() {
    		typed_username = this.value;
    		$$invalidate(0, typed_username);
    	}

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			password_box = $$value;
    			$$invalidate(4, password_box);
    		});
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	function input2_change_handler() {
    		register_or_login = this.__value;
    		$$invalidate(2, register_or_login);
    	}

    	function input3_change_handler() {
    		register_or_login = this.__value;
    		$$invalidate(2, register_or_login);
    	}

    	function input4_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			submit_button = $$value;
    			$$invalidate(6, submit_button);
    		});
    	}

    	const click_handler = () => {
    		username.set('guest');
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		get_users_list,
    		get_token,
    		register_and_get_token,
    		username,
    		users,
    		typed_username,
    		password,
    		register_or_login,
    		failed_login,
    		password_box,
    		username_box,
    		login,
    		register,
    		submit,
    		submit_button,
    		handleKeydown,
    		user_exists,
    		warning,
    		register_possible,
    		login_possible,
    		submit_possible
    	});

    	$$self.$inject_state = $$props => {
    		if ('users' in $$props) $$invalidate(11, users = $$props.users);
    		if ('typed_username' in $$props) $$invalidate(0, typed_username = $$props.typed_username);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('register_or_login' in $$props) $$invalidate(2, register_or_login = $$props.register_or_login);
    		if ('failed_login' in $$props) $$invalidate(3, failed_login = $$props.failed_login);
    		if ('password_box' in $$props) $$invalidate(4, password_box = $$props.password_box);
    		if ('username_box' in $$props) $$invalidate(5, username_box = $$props.username_box);
    		if ('submit_button' in $$props) $$invalidate(6, submit_button = $$props.submit_button);
    		if ('user_exists' in $$props) $$invalidate(12, user_exists = $$props.user_exists);
    		if ('warning' in $$props) $$invalidate(7, warning = $$props.warning);
    		if ('register_possible' in $$props) $$invalidate(13, register_possible = $$props.register_possible);
    		if ('login_possible' in $$props) $$invalidate(14, login_possible = $$props.login_possible);
    		if ('submit_possible' in $$props) $$invalidate(8, submit_possible = $$props.submit_possible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*users, typed_username*/ 2049) {
    			$$invalidate(12, user_exists = users.includes(typed_username));
    		}

    		if ($$self.$$.dirty & /*user_exists, password*/ 4098) {
    			$$invalidate(14, login_possible = user_exists && password.length > 2);
    		}

    		if ($$self.$$.dirty & /*user_exists, typed_username, password*/ 4099) {
    			$$invalidate(13, register_possible = !user_exists && typed_username.length > 2 && password.length > 2);
    		}

    		if ($$self.$$.dirty & /*register_or_login, login_possible, register_possible*/ 24580) {
    			$$invalidate(8, submit_possible = register_or_login === 'login' && login_possible || register_or_login === 'register' && register_possible);
    		}

    		if ($$self.$$.dirty & /*register_or_login, user_exists, typed_username*/ 4101) {
    			$$invalidate(7, warning = ("user does not exist!").repeat(register_or_login === 'login' && !user_exists && typed_username.length > 2) + ("username is already taken!").repeat(register_or_login === 'register' && user_exists && typed_username.length > 2));
    		}
    	};

    	return [
    		typed_username,
    		password,
    		register_or_login,
    		failed_login,
    		password_box,
    		username_box,
    		submit_button,
    		warning,
    		submit_possible,
    		submit,
    		handleKeydown,
    		users,
    		user_exists,
    		register_possible,
    		login_possible,
    		input0_binding,
    		input0_input_handler,
    		input1_binding,
    		input1_input_handler,
    		input2_change_handler,
    		$$binding_groups,
    		input3_change_handler,
    		input4_binding,
    		click_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */

    const file = "src/App.svelte";

    // (15:0) {#key [$card_to_review, $username]}
    function create_key_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[2];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(15:0) {#key [$card_to_review, $username]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let body;
    	let previous_key = [/*$card_to_review*/ ctx[0], /*$username*/ ctx[1]];
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			body = element("body");
    			key_block.c();
    			attr_dev(body, "class", "svelte-suk1zo");
    			add_location(body, file, 13, 0, 492);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			key_block.m(body, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$card_to_review, $username*/ 3 && safe_not_equal(previous_key, previous_key = [/*$card_to_review*/ ctx[0], /*$username*/ ctx[1]])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(body, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let component;
    	let $card_to_review;
    	let $card_to_edit;
    	let $card_to_preview;
    	let $username;
    	validate_store(card_to_review, 'card_to_review');
    	component_subscribe($$self, card_to_review, $$value => $$invalidate(0, $card_to_review = $$value));
    	validate_store(card_to_edit, 'card_to_edit');
    	component_subscribe($$self, card_to_edit, $$value => $$invalidate(3, $card_to_edit = $$value));
    	validate_store(card_to_preview, 'card_to_preview');
    	component_subscribe($$self, card_to_preview, $$value => $$invalidate(4, $card_to_preview = $$value));
    	validate_store(username, 'username');
    	component_subscribe($$self, username, $$value => $$invalidate(1, $username = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	if (!$username) {
    		username.set('guest');
    	} // Logs in as guest if we aren't logged in

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Home,
    		Edit,
    		Review,
    		Login,
    		username,
    		card_to_edit,
    		card_to_preview,
    		card_to_review,
    		component,
    		$card_to_review,
    		$card_to_edit,
    		$card_to_preview,
    		$username
    	});

    	$$self.$inject_state = $$props => {
    		if ('component' in $$props) $$invalidate(2, component = $$props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$username, $card_to_preview, $card_to_edit, $card_to_review*/ 27) {
    			$$invalidate(2, component = !$username
    			? Login
    			: $card_to_preview
    				? Review
    				: $card_to_edit ? Edit : $card_to_review ? Review : Home);
    		}
    	};

    	return [$card_to_review, $username, component, $card_to_edit, $card_to_preview];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
