
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

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
            var url = new URL('http://localhost:8000/auth/users_list');
            var options = default_options();
            options.method = 'GET';
            const response = await fetch(url, options);
            return response.json();
    }

    async function get_token(username, password) {
            var url = new URL('http://localhost:8000/auth/token');
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
            var url = new URL('http://localhost:8000/auth/register');
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
      const url = new URL('http://localhost:8000/commit_card');
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
        var url = new URL('http://localhost:8000/review');
        fetch(url, options)
          .then(handle_error_response)
          .catch(fetch_error_handler);
    }

    async function upload_media(content, base64=true) {
            let options = default_options();
            options.body = JSON.stringify( {content: content, base64: base64} );
            var url = new URL('http://localhost:8000/upload_media');
            var media_id = null;
            const r = await fetch(url, options)
              .then(handle_error_response)
              .catch(fetch_error_handler);
            const json = await r.json();
            media_id = await json.media_id;
            return media_id
    }

    async function set_guest_user() {
            if (!window.localStorage.getItem('username')) {
                    window.localStorage.setItem('username','guest');
                    window.localStorage.setItem('access_token','guest123');
            }
    }

    async function fetch_cardlist(filters, sort) {
            var options = default_options();
            const url = new URL('http://localhost:8000/cardlist');
            const payload = {crit: {sort: sort}, filters: filters};
            options.body = JSON.stringify( payload );
            const response = await fetch(url, options)
                  .then(handle_error_response)
                  .catch(fetch_error_handler);
            return response.json();
    }

    async function hypothetical_due_dates(card_id, date) {
            const url = new URL("http://localhost:8000/hypothetical_due_dates");
            url.search = new URLSearchParams({card_id: card_id, date: date});
            var options = default_options();
            options.method = 'GET';
            const response = await fetch(url, options);
            const hypo_due_dates = await response.json();
            return hypo_due_dates;
    }

    async function get_collection_tags() {
            const url = new URL("http://localhost:8000/collection_tags");
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
      const url = ("http://localhost:8000/get_media?media_id=" + media_id);
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
            const url = ("http://localhost:8000/get_occlusion_data?media_id=" + media_id);
            const response = await fetchWithAuthentication( url );
            const json = await response.json();
            return JSON.parse(json)
    }

    async function purge(filters) {
            const url = new URL("http://localhost:8000/purge");
            var options = default_options();
            options.body = JSON.stringify( filters );
            await fetch(url, options);
    }

    function filter_card(filters, card) {
    return ((card.visibility != 'purged') &&
            //(!filters['search']        || card.front_text.includes(filters['search']) || card.back_text.includes(filters['search'])) &&
            (filters['deleted']===null || filters['deleted']===(card.visibility==='deleted')) &&
            // TODO local_unix_day is reevaluated for each card --performance
            (filters['due']===null     || filters['due']    ===(card.due_date < local_unix_day())) &&
            (filters['new']===null     || filters['new']    ===(card.due_date===card.create_date)) &&
            (filters['images']===null  || filters['images'] ===(card.front_image_id!=0 || card.back_image_id!=0)) &&
            (filters['audio']===null   || filters['audio']  ===(card.front_audio_id!=0 || card.back_audio_id!=0)) &&
            (!filters['card_type']     || filters['card_type'] === card.card_type) &&
            (!filters['created_after'] || (new Date(filters['created_after']))/24/60/60/1000 < card.create_date) &&
            (!filters['created_before']|| (new Date(filters['created_before']))/24/60/60/1000 > card.create_date) &&
            (!filters['due_after']     || (new Date(filters['due_after']))/24/60/60/1000 < card.due_date) &&
            (!filters['due_before']    || (new Date(filters['due_before']))/24/60/60/1000 > card.due_date) &&
            (!filters['tag']           || card.tags.includes(filters['tag'])) &&
             true )
    }

    // if we are reviewing find out the next card to study
    function get_next_due_card(filtered_cards) {
            //TODO use the top card in the list
            if (filtered_cards.length===0) { return null }//sort to get soonest due
      filtered_cards.sort((card1,card2) => {return card1.due_date - card2.due_date});
      var soonest_card = filtered_cards[0];
      // return the soonest card if it is due,
      // otherwise return null because no cards are due
     if (soonest_card.due_date < local_unix_day()) {
             return soonest_card
     } else {
             alert('Congratulations Student. There are no more due cards.');
             return null
     }
    }

    /* src/tristate.svelte generated by Svelte v3.48.0 */

    const file$k = "src/tristate.svelte";

    function create_fragment$k(ctx) {
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
    			add_location(br, file$k, 13, 15, 472);
    			attr_dev(input, "type", "checkbox");
    			input.indeterminate = input_indeterminate_value = /*state*/ ctx[0] === false;
    			input.checked = input_checked_value = /*state*/ ctx[0] != null;
    			add_location(input, file$k, 14, 2, 479);
    			attr_dev(label, "class", "svelte-1ad6k3b");
    			set_style(label, "color", /*color*/ ctx[2], false);
    			set_style(label, "display", 'inline', false);
    			add_location(label, file$k, 12, 0, 404);
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tristate",
    			options,
    			id: create_fragment$k.name
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
    const file$j = "src/review_button.svelte";

    function create_fragment$j(ctx) {
    	let button;
    	let div0;
    	let t0;
    	let span;
    	let t2;
    	let div1;
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div0 = element("div");
    			t0 = text("Review ");
    			span = element("span");
    			span.textContent = "🕮";
    			t2 = space();
    			div1 = element("div");
    			t3 = text(/*due_count_plus*/ ctx[0]);
    			t4 = text(" cards due");
    			set_style(span, "font-size", "100%");
    			add_location(span, file$j, 12, 11, 338);
    			attr_dev(div0, "id", "review_text");
    			attr_dev(div0, "class", "svelte-in18e9");
    			add_location(div0, file$j, 11, 2, 304);
    			attr_dev(div1, "id", "due_count");
    			attr_dev(div1, "class", "svelte-in18e9");
    			add_location(div1, file$j, 14, 2, 391);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "svelte-in18e9");
    			add_location(button, file$j, 10, 0, 260);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div0);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(button, t2);
    			append_dev(button, div1);
    			append_dev(div1, t3);
    			append_dev(div1, t4);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*forward*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*due_count_plus*/ 1) set_data_dev(t3, /*due_count_plus*/ ctx[0]);
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
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let due_count_plus;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Review_button', slots, []);
    	const dispatch = createEventDispatcher();

    	function forward() {
    		dispatch('click');
    	}

    	let { due_count = 0 } = $$props;
    	const writable_props = ['due_count'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Review_button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('due_count' in $$props) $$invalidate(2, due_count = $$props.due_count);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		forward,
    		due_count,
    		due_count_plus
    	});

    	$$self.$inject_state = $$props => {
    		if ('due_count' in $$props) $$invalidate(2, due_count = $$props.due_count);
    		if ('due_count_plus' in $$props) $$invalidate(0, due_count_plus = $$props.due_count_plus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*due_count*/ 4) {
    			$$invalidate(0, due_count_plus = due_count + (due_count >= 50 ? '+' : ''));
    		}
    	};

    	return [due_count_plus, forward, due_count];
    }

    class Review_button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { due_count: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Review_button",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get due_count() {
    		throw new Error("<Review_button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set due_count(value) {
    		throw new Error("<Review_button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/create_button.svelte generated by Svelte v3.48.0 */
    const file$i = "src/create_button.svelte";

    function create_fragment$i(ctx) {
    	let button;
    	let div0;
    	let t0;
    	let span;
    	let t2;
    	let div1;
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div0 = element("div");
    			t0 = text("Create ");
    			span = element("span");
    			span.textContent = "✍";
    			t2 = space();
    			div1 = element("div");
    			t3 = text(/*created_count*/ ctx[0]);
    			t4 = text(" created today");
    			set_style(span, "font-size", "100%");
    			add_location(span, file$i, 11, 11, 276);
    			attr_dev(div0, "id", "create_text");
    			attr_dev(div0, "class", "svelte-1sqwcsp");
    			add_location(div0, file$i, 10, 2, 242);
    			attr_dev(div1, "id", "due_count");
    			attr_dev(div1, "class", "svelte-1sqwcsp");
    			add_location(div1, file$i, 13, 2, 328);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "svelte-1sqwcsp");
    			add_location(button, file$i, 9, 0, 198);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div0);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(button, t2);
    			append_dev(button, div1);
    			append_dev(div1, t3);
    			append_dev(div1, t4);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*forward*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*created_count*/ 1) set_data_dev(t3, /*created_count*/ ctx[0]);
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Create_button', slots, []);
    	const dispatch = createEventDispatcher();

    	function forward() {
    		dispatch('click');
    	}

    	let { created_count } = $$props;
    	const writable_props = ['created_count'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Create_button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('created_count' in $$props) $$invalidate(0, created_count = $$props.created_count);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		forward,
    		created_count
    	});

    	$$self.$inject_state = $$props => {
    		if ('created_count' in $$props) $$invalidate(0, created_count = $$props.created_count);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [created_count, forward];
    }

    class Create_button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { created_count: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Create_button",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*created_count*/ ctx[0] === undefined && !('created_count' in props)) {
    			console.warn("<Create_button> was created without expected prop 'created_count'");
    		}
    	}

    	get created_count() {
    		throw new Error("<Create_button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set created_count(value) {
    		throw new Error("<Create_button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/card.svelte generated by Svelte v3.48.0 */
    const file$h = "src/card.svelte";

    function create_fragment$h(ctx) {
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
    			attr_dev(button0, "class", "button svelte-1kgg240");
    			set_style(button0, "color", 'darkred', false);
    			add_location(button0, file$h, 80, 4, 3308);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "button svelte-1kgg240");
    			add_location(button1, file$h, 81, 4, 3415);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "button svelte-1kgg240");
    			add_location(button2, file$h, 82, 4, 3493);
    			html_tag.a = t6;
    			attr_dev(span0, "class", "front_text svelte-1kgg240");
    			set_style(span0, "color", "purple");
    			set_style(span0, "display", /*due_alert*/ ctx[2]);
    			set_style(span0, "font-size", '14px', false);
    			add_location(span0, file$h, 84, 4, 3590);
    			attr_dev(span1, "class", "front_text svelte-1kgg240");
    			set_style(span1, "text-decoration", /*text_decoration*/ ctx[3]);
    			add_location(span1, file$h, 86, 4, 3708);
    			attr_dev(div, "class", "card_container svelte-1kgg240");
    			add_location(div, file$h, 79, 0, 3275);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let text_decoration;
    	let is_due;
    	let due_alert;
    	let extra_info;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);

    	async function toggle_delete() {
    		$$invalidate(0, card.visibility = card.visibility === 'visible' ? 'deleted' : 'visible', card);

    		//notify API
    		commit_changes(card);

    		$$invalidate(7, card_edited_alert = true);
    	}

    	function preview() {
    		$$invalidate(8, state['card_to_preview'] = card, state);
    		$$invalidate(8, state['preview_mode'] = true, state);
    	}

    	function edit() {
    		$$invalidate(8, state['card_to_edit'] = card, state);
    		$$invalidate(8, state['edit_mode'] = true, state);
    	}

    	let { card } = $$props;
    	let { card_edited_alert } = $$props;
    	let { state } = $$props;
    	let { info } = $$props;
    	let current_time = local_unix_day();

    	function get_extra_info(info) {
    		switch (info) {
    			case '':
    				return '';
    			case 'create_date':
    				return 'Created <b><mark>' + Math.trunc(current_time - card[info]) + '</mark></b> days ago';
    			case 'due_date':
    				return 'Due in <b><mark>' + Math.trunc(card[info] - current_time) + '</mark></b> days';
    			case 'last_review_date':
    				return 'Last reviewed <b><mark>' + Math.trunc(current_time - card[info]) + '</mark></b> days ago';
    			case 'last_edit_date':
    				return 'Last edited <b><mark>' + Math.trunc(current_time - card[info]) + '</mark></b> days ago';
    			case 'review_seconds':
    				return 'Spent <b><mark>' + Math.floor(card[info]) + '</mark></b> seconds reviewing';
    			case 'edit_seconds':
    				return 'Spent <b><mark>' + Math.floor(card[info]) + '</mark></b> seconds editing';
    			case 'total_seconds':
    				return 'Spent <b><mark>' + Math.floor(card[info]) + '</mark></b> seconds';
    			case 'card_type':
    				return '<b><mark>' + card[info] + '</mark></b>';
    			case 'tags':
    				return 'tags: <b><mark>' + card[info] + '</mark></b>';
    			case 'merit':
    				return '<b><mark>' + card[info] + '</mark></b>';
    			default:
    				return '';
    		}
    	}

    	let card_container;
    	const writable_props = ['card', 'card_edited_alert', 'state', 'info'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('card_edited_alert' in $$props) $$invalidate(7, card_edited_alert = $$props.card_edited_alert);
    		if ('state' in $$props) $$invalidate(8, state = $$props.state);
    		if ('info' in $$props) $$invalidate(9, info = $$props.info);
    	};

    	$$self.$capture_state = () => ({
    		local_unix_day,
    		commit_changes,
    		toggle_delete,
    		preview,
    		edit,
    		card,
    		card_edited_alert,
    		state,
    		info,
    		current_time,
    		get_extra_info,
    		card_container,
    		extra_info,
    		is_due,
    		due_alert,
    		text_decoration
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('card_edited_alert' in $$props) $$invalidate(7, card_edited_alert = $$props.card_edited_alert);
    		if ('state' in $$props) $$invalidate(8, state = $$props.state);
    		if ('info' in $$props) $$invalidate(9, info = $$props.info);
    		if ('current_time' in $$props) $$invalidate(11, current_time = $$props.current_time);
    		if ('card_container' in $$props) card_container = $$props.card_container;
    		if ('extra_info' in $$props) $$invalidate(1, extra_info = $$props.extra_info);
    		if ('is_due' in $$props) $$invalidate(10, is_due = $$props.is_due);
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
    			$$invalidate(10, is_due = card.due_date < current_time);
    		}

    		if ($$self.$$.dirty & /*is_due, card*/ 1025) {
    			$$invalidate(2, due_alert = is_due && card.visibility === 'visible'
    			? 'inline'
    			: 'none');
    		}

    		if ($$self.$$.dirty & /*info*/ 512) {
    			$$invalidate(1, extra_info = get_extra_info(info));
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
    		card_edited_alert,
    		state,
    		info,
    		is_due
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			card: 0,
    			card_edited_alert: 7,
    			state: 8,
    			info: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*card*/ ctx[0] === undefined && !('card' in props)) {
    			console.warn("<Card> was created without expected prop 'card'");
    		}

    		if (/*card_edited_alert*/ ctx[7] === undefined && !('card_edited_alert' in props)) {
    			console.warn("<Card> was created without expected prop 'card_edited_alert'");
    		}

    		if (/*state*/ ctx[8] === undefined && !('state' in props)) {
    			console.warn("<Card> was created without expected prop 'state'");
    		}

    		if (/*info*/ ctx[9] === undefined && !('info' in props)) {
    			console.warn("<Card> was created without expected prop 'info'");
    		}
    	}

    	get card() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card_edited_alert() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card_edited_alert(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get info() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/info_tooltip.svelte generated by Svelte v3.48.0 */
    const file$g = "src/info_tooltip.svelte";

    function create_fragment$g(ctx) {
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
    			add_location(span0, file$g, 27, 1, 920);
    			attr_dev(span1, "class", "tooltiptext svelte-1d9etfy");
    			add_location(span1, file$g, 28, 8, 965);
    			attr_dev(div, "class", "tooltip svelte-1d9etfy");
    			add_location(div, file$g, 26, 0, 877);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info_tooltip",
    			options,
    			id: create_fragment$g.name
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
    const file$f = "src/advanced_filters.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (41:0) <Tristate bind:state={filters['due']}>
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
    		source: "(41:0) <Tristate bind:state={filters['due']}>",
    		ctx
    	});

    	return block;
    }

    // (42:0) <Tristate bind:state={filters['new']}>
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
    		source: "(42:0) <Tristate bind:state={filters['new']}>",
    		ctx
    	});

    	return block;
    }

    // (43:0) <Tristate bind:state={filters['deleted']}>
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
    		source: "(43:0) <Tristate bind:state={filters['deleted']}>",
    		ctx
    	});

    	return block;
    }

    // (44:0) {#if filters.deleted}
    function create_if_block$9(ctx) {
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
    			attr_dev(button, "class", "svelte-zgasv9");
    			set_style(button, "border-radius", '4px', false);
    			set_style(button, "color", 'red', false);
    			add_location(button, file$f, 44, 8, 1248);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			mount_component(infotooltip, button, null);
    			/*button_binding*/ ctx[11](button);
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
    			/*button_binding*/ ctx[11](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(44:0) {#if filters.deleted}",
    		ctx
    	});

    	return block;
    }

    // (49:0) <Tristate bind:state={filters['images']}>
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
    		source: "(49:0) <Tristate bind:state={filters['images']}>",
    		ctx
    	});

    	return block;
    }

    // (50:0) <Tristate bind:state={filters['audio']}>
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
    		source: "(50:0) <Tristate bind:state={filters['audio']}>",
    		ctx
    	});

    	return block;
    }

    // (92:8) {#each collection_tags as tag}
    function create_each_block$6(ctx) {
    	let option;
    	let t_value = /*tag*/ ctx[18] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*tag*/ ctx[18];
    			option.value = option.__value;
    			add_location(option, file$f, 92, 16, 2804);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*collection_tags*/ 8 && t_value !== (t_value = /*tag*/ ctx[18] + "")) set_data_dev(t, t_value);

    			if (dirty & /*collection_tags*/ 8 && option_value_value !== (option_value_value = /*tag*/ ctx[18])) {
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
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(92:8) {#each collection_tags as tag}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
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
    		/*tristate0_state_binding*/ ctx[8](value);
    	}

    	let tristate0_props = {
    		$$slots: { default: [create_default_slot_4] },
    		$$scope: { ctx }
    	};

    	if (/*filters*/ ctx[1]['due'] !== void 0) {
    		tristate0_props.state = /*filters*/ ctx[1]['due'];
    	}

    	tristate0 = new Tristate({ props: tristate0_props, $$inline: true });
    	binding_callbacks.push(() => bind(tristate0, 'state', tristate0_state_binding));

    	function tristate1_state_binding(value) {
    		/*tristate1_state_binding*/ ctx[9](value);
    	}

    	let tristate1_props = {
    		$$slots: { default: [create_default_slot_3] },
    		$$scope: { ctx }
    	};

    	if (/*filters*/ ctx[1]['new'] !== void 0) {
    		tristate1_props.state = /*filters*/ ctx[1]['new'];
    	}

    	tristate1 = new Tristate({ props: tristate1_props, $$inline: true });
    	binding_callbacks.push(() => bind(tristate1, 'state', tristate1_state_binding));

    	function tristate2_state_binding(value) {
    		/*tristate2_state_binding*/ ctx[10](value);
    	}

    	let tristate2_props = {
    		$$slots: { default: [create_default_slot_2] },
    		$$scope: { ctx }
    	};

    	if (/*filters*/ ctx[1]['deleted'] !== void 0) {
    		tristate2_props.state = /*filters*/ ctx[1]['deleted'];
    	}

    	tristate2 = new Tristate({ props: tristate2_props, $$inline: true });
    	binding_callbacks.push(() => bind(tristate2, 'state', tristate2_state_binding));
    	let if_block = /*filters*/ ctx[1].deleted && create_if_block$9(ctx);

    	function tristate3_state_binding(value) {
    		/*tristate3_state_binding*/ ctx[12](value);
    	}

    	let tristate3_props = {
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	};

    	if (/*filters*/ ctx[1]['images'] !== void 0) {
    		tristate3_props.state = /*filters*/ ctx[1]['images'];
    	}

    	tristate3 = new Tristate({ props: tristate3_props, $$inline: true });
    	binding_callbacks.push(() => bind(tristate3, 'state', tristate3_state_binding));

    	function tristate4_state_binding(value) {
    		/*tristate4_state_binding*/ ctx[13](value);
    	}

    	let tristate4_props = {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*filters*/ ctx[1]['audio'] !== void 0) {
    		tristate4_props.state = /*filters*/ ctx[1]['audio'];
    	}

    	tristate4 = new Tristate({ props: tristate4_props, $$inline: true });
    	binding_callbacks.push(() => bind(tristate4, 'state', tristate4_state_binding));
    	let each_value = /*collection_tags*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
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
    			t6 = text("Card type:\n");
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
    			option19.textContent = "meritorious";
    			t29 = space();
    			span3 = element("span");
    			t30 = text("Tag: \n");
    			select3 = element("select");
    			option20 = element("option");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "tristates svelte-zgasv9");
    			add_location(div0, file$f, 39, 0, 1021);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$f, 56, 8, 1810);
    			option1.__value = "basic";
    			option1.value = option1.__value;
    			add_location(option1, file$f, 57, 1, 1829);
    			option2.__value = "verses";
    			option2.value = option2.__value;
    			add_location(option2, file$f, 58, 1, 1853);
    			option3.__value = "occlusion";
    			option3.value = option3.__value;
    			add_location(option3, file$f, 59, 1, 1878);
    			attr_dev(select0, "class", "svelte-zgasv9");
    			if (/*filters*/ ctx[1]['card_type'] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[14].call(select0));
    			add_location(select0, file$f, 55, 0, 1759);
    			add_location(span0, file$f, 53, 0, 1741);
    			option4.__value = "";
    			option4.value = option4.__value;
    			add_location(option4, file$f, 64, 8, 1971);
    			option5.__value = "create_date";
    			option5.value = option5.__value;
    			add_location(option5, file$f, 65, 1, 1990);
    			option6.__value = "due_date";
    			option6.value = option6.__value;
    			add_location(option6, file$f, 66, 1, 2036);
    			option7.__value = "last_review_date";
    			option7.value = option7.__value;
    			add_location(option7, file$f, 67, 1, 2080);
    			option8.__value = "edit_seconds";
    			option8.value = option8.__value;
    			add_location(option8, file$f, 68, 1, 2135);
    			option9.__value = "review_seconds";
    			option9.value = option9.__value;
    			add_location(option9, file$f, 69, 1, 2187);
    			option10.__value = "total_seconds";
    			option10.value = option10.__value;
    			add_location(option10, file$f, 70, 1, 2240);
    			option11.__value = "card_type";
    			option11.value = option11.__value;
    			add_location(option11, file$f, 71, 1, 2291);
    			option12.__value = "tags";
    			option12.value = option12.__value;
    			add_location(option12, file$f, 72, 1, 2337);
    			option13.__value = "merit";
    			option13.value = option13.__value;
    			add_location(option13, file$f, 73, 1, 2373);
    			attr_dev(select1, "class", "svelte-zgasv9");
    			if (/*info*/ ctx[2] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[15].call(select1));
    			add_location(select1, file$f, 63, 0, 1936);
    			add_location(span1, file$f, 61, 0, 1922);
    			attr_dev(div1, "class", "selectors svelte-zgasv9");
    			add_location(div1, file$f, 52, 0, 1717);
    			option14.__value = "recent";
    			option14.value = option14.__value;
    			add_location(option14, file$f, 80, 1, 2500);
    			option15.__value = "old";
    			option15.value = option15.__value;
    			add_location(option15, file$f, 81, 1, 2525);
    			option16.__value = "overdue";
    			option16.value = option16.__value;
    			add_location(option16, file$f, 82, 1, 2547);
    			option17.__value = "total time";
    			option17.value = option17.__value;
    			add_location(option17, file$f, 83, 1, 2573);
    			option18.__value = "random";
    			option18.value = option18.__value;
    			add_location(option18, file$f, 84, 1, 2602);
    			option19.__value = "meritorious";
    			option19.value = option19.__value;
    			add_location(option19, file$f, 85, 1, 2627);
    			attr_dev(select2, "class", "svelte-zgasv9");
    			if (/*sort*/ ctx[0] === void 0) add_render_callback(() => /*select2_change_handler*/ ctx[16].call(select2));
    			add_location(select2, file$f, 79, 0, 2472);
    			add_location(span2, file$f, 77, 0, 2458);
    			option20.__value = "";
    			option20.value = option20.__value;
    			add_location(option20, file$f, 90, 8, 2731);
    			attr_dev(select3, "class", "svelte-zgasv9");
    			if (/*filters*/ ctx[1]['tag'] === void 0) add_render_callback(() => /*select3_change_handler*/ ctx[17].call(select3));
    			add_location(select3, file$f, 89, 0, 2686);
    			add_location(span3, file$f, 87, 0, 2673);
    			attr_dev(div2, "class", "selectors svelte-zgasv9");
    			add_location(div2, file$f, 76, 0, 2434);
    			attr_dev(div3, "class", "master svelte-zgasv9");
    			add_location(div3, file$f, 38, 0, 1000);
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
    			select_option(select0, /*filters*/ ctx[1]['card_type']);
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
    			select_option(select1, /*info*/ ctx[2]);
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
    			select_option(select2, /*sort*/ ctx[0]);
    			append_dev(div2, t29);
    			append_dev(div2, span3);
    			append_dev(span3, t30);
    			append_dev(span3, select3);
    			append_dev(select3, option20);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select3, null);
    			}

    			select_option(select3, /*filters*/ ctx[1]['tag']);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[14]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[15]),
    					listen_dev(select2, "change", /*select2_change_handler*/ ctx[16]),
    					listen_dev(select3, "change", /*select3_change_handler*/ ctx[17])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const tristate0_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				tristate0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state && dirty & /*filters*/ 2) {
    				updating_state = true;
    				tristate0_changes.state = /*filters*/ ctx[1]['due'];
    				add_flush_callback(() => updating_state = false);
    			}

    			tristate0.$set(tristate0_changes);
    			const tristate1_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				tristate1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state_1 && dirty & /*filters*/ 2) {
    				updating_state_1 = true;
    				tristate1_changes.state = /*filters*/ ctx[1]['new'];
    				add_flush_callback(() => updating_state_1 = false);
    			}

    			tristate1.$set(tristate1_changes);
    			const tristate2_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				tristate2_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state_2 && dirty & /*filters*/ 2) {
    				updating_state_2 = true;
    				tristate2_changes.state = /*filters*/ ctx[1]['deleted'];
    				add_flush_callback(() => updating_state_2 = false);
    			}

    			tristate2.$set(tristate2_changes);

    			if (/*filters*/ ctx[1].deleted) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*filters*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
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

    			if (dirty & /*$$scope*/ 2097152) {
    				tristate3_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state_3 && dirty & /*filters*/ 2) {
    				updating_state_3 = true;
    				tristate3_changes.state = /*filters*/ ctx[1]['images'];
    				add_flush_callback(() => updating_state_3 = false);
    			}

    			tristate3.$set(tristate3_changes);
    			const tristate4_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				tristate4_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_state_4 && dirty & /*filters*/ 2) {
    				updating_state_4 = true;
    				tristate4_changes.state = /*filters*/ ctx[1]['audio'];
    				add_flush_callback(() => updating_state_4 = false);
    			}

    			tristate4.$set(tristate4_changes);

    			if (dirty & /*filters*/ 2) {
    				select_option(select0, /*filters*/ ctx[1]['card_type']);
    			}

    			if (dirty & /*info*/ 4) {
    				select_option(select1, /*info*/ ctx[2]);
    			}

    			if (dirty & /*sort*/ 1) {
    				select_option(select2, /*sort*/ ctx[0]);
    			}

    			if (dirty & /*collection_tags*/ 8) {
    				each_value = /*collection_tags*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*filters*/ 2) {
    				select_option(select3, /*filters*/ ctx[1]['tag']);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Advanced_filters', slots, []);
    	let { filters } = $$props;
    	let { info } = $$props;
    	let { collection_tags } = $$props;
    	let { sort } = $$props;
    	let { card_edited_alert } = $$props;
    	let { filtered_cards } = $$props;
    	let purge_button;

    	function ask_purge() {
    		if (confirm('Purge deleted cards?')) {
    			purge(filters);
    			$$invalidate(4, purge_button.style.display = 'none', purge_button);
    			$$invalidate(6, filtered_cards = []);
    		}
    	}

    	const writable_props = [
    		'filters',
    		'info',
    		'collection_tags',
    		'sort',
    		'card_edited_alert',
    		'filtered_cards'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Advanced_filters> was created with unknown prop '${key}'`);
    	});

    	function tristate0_state_binding(value) {
    		if ($$self.$$.not_equal(filters['due'], value)) {
    			filters['due'] = value;
    			$$invalidate(1, filters);
    		}
    	}

    	function tristate1_state_binding(value) {
    		if ($$self.$$.not_equal(filters['new'], value)) {
    			filters['new'] = value;
    			$$invalidate(1, filters);
    		}
    	}

    	function tristate2_state_binding(value) {
    		if ($$self.$$.not_equal(filters['deleted'], value)) {
    			filters['deleted'] = value;
    			$$invalidate(1, filters);
    		}
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			purge_button = $$value;
    			$$invalidate(4, purge_button);
    		});
    	}

    	function tristate3_state_binding(value) {
    		if ($$self.$$.not_equal(filters['images'], value)) {
    			filters['images'] = value;
    			$$invalidate(1, filters);
    		}
    	}

    	function tristate4_state_binding(value) {
    		if ($$self.$$.not_equal(filters['audio'], value)) {
    			filters['audio'] = value;
    			$$invalidate(1, filters);
    		}
    	}

    	function select0_change_handler() {
    		filters['card_type'] = select_value(this);
    		$$invalidate(1, filters);
    	}

    	function select1_change_handler() {
    		info = select_value(this);
    		($$invalidate(2, info), $$invalidate(0, sort));
    	}

    	function select2_change_handler() {
    		sort = select_value(this);
    		$$invalidate(0, sort);
    	}

    	function select3_change_handler() {
    		filters['tag'] = select_value(this);
    		$$invalidate(1, filters);
    	}

    	$$self.$$set = $$props => {
    		if ('filters' in $$props) $$invalidate(1, filters = $$props.filters);
    		if ('info' in $$props) $$invalidate(2, info = $$props.info);
    		if ('collection_tags' in $$props) $$invalidate(3, collection_tags = $$props.collection_tags);
    		if ('sort' in $$props) $$invalidate(0, sort = $$props.sort);
    		if ('card_edited_alert' in $$props) $$invalidate(7, card_edited_alert = $$props.card_edited_alert);
    		if ('filtered_cards' in $$props) $$invalidate(6, filtered_cards = $$props.filtered_cards);
    	};

    	$$self.$capture_state = () => ({
    		purge,
    		Tristate,
    		InfoTooltip: Info_tooltip,
    		filters,
    		info,
    		collection_tags,
    		sort,
    		card_edited_alert,
    		filtered_cards,
    		purge_button,
    		ask_purge
    	});

    	$$self.$inject_state = $$props => {
    		if ('filters' in $$props) $$invalidate(1, filters = $$props.filters);
    		if ('info' in $$props) $$invalidate(2, info = $$props.info);
    		if ('collection_tags' in $$props) $$invalidate(3, collection_tags = $$props.collection_tags);
    		if ('sort' in $$props) $$invalidate(0, sort = $$props.sort);
    		if ('card_edited_alert' in $$props) $$invalidate(7, card_edited_alert = $$props.card_edited_alert);
    		if ('filtered_cards' in $$props) $$invalidate(6, filtered_cards = $$props.filtered_cards);
    		if ('purge_button' in $$props) $$invalidate(4, purge_button = $$props.purge_button);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sort*/ 1) {
    			switch (sort) {
    				case 'old':
    					$$invalidate(2, info = 'create_date');
    					break;
    				case 'overdue':
    					$$invalidate(2, info = 'due_date');
    					break;
    				case 'total time':
    					$$invalidate(2, info = 'total_seconds');
    					break;
    				case 'meritorious':
    					$$invalidate(2, info = 'merit');
    					break;
    				default:
    					$$invalidate(2, info = null);
    					break;
    			}
    		}
    	};

    	return [
    		sort,
    		filters,
    		info,
    		collection_tags,
    		purge_button,
    		ask_purge,
    		filtered_cards,
    		card_edited_alert,
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

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			filters: 1,
    			info: 2,
    			collection_tags: 3,
    			sort: 0,
    			card_edited_alert: 7,
    			filtered_cards: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Advanced_filters",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*filters*/ ctx[1] === undefined && !('filters' in props)) {
    			console.warn("<Advanced_filters> was created without expected prop 'filters'");
    		}

    		if (/*info*/ ctx[2] === undefined && !('info' in props)) {
    			console.warn("<Advanced_filters> was created without expected prop 'info'");
    		}

    		if (/*collection_tags*/ ctx[3] === undefined && !('collection_tags' in props)) {
    			console.warn("<Advanced_filters> was created without expected prop 'collection_tags'");
    		}

    		if (/*sort*/ ctx[0] === undefined && !('sort' in props)) {
    			console.warn("<Advanced_filters> was created without expected prop 'sort'");
    		}

    		if (/*card_edited_alert*/ ctx[7] === undefined && !('card_edited_alert' in props)) {
    			console.warn("<Advanced_filters> was created without expected prop 'card_edited_alert'");
    		}

    		if (/*filtered_cards*/ ctx[6] === undefined && !('filtered_cards' in props)) {
    			console.warn("<Advanced_filters> was created without expected prop 'filtered_cards'");
    		}
    	}

    	get filters() {
    		throw new Error("<Advanced_filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filters(value) {
    		throw new Error("<Advanced_filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get info() {
    		throw new Error("<Advanced_filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Advanced_filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collection_tags() {
    		throw new Error("<Advanced_filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collection_tags(value) {
    		throw new Error("<Advanced_filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sort() {
    		throw new Error("<Advanced_filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sort(value) {
    		throw new Error("<Advanced_filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card_edited_alert() {
    		throw new Error("<Advanced_filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card_edited_alert(value) {
    		throw new Error("<Advanced_filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filtered_cards() {
    		throw new Error("<Advanced_filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filtered_cards(value) {
    		throw new Error("<Advanced_filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/filters.svelte generated by Svelte v3.48.0 */
    const file$e = "src/filters.svelte";

    function create_fragment$e(ctx) {
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
    	let updating_filtered_cards;
    	let updating_sort;
    	let updating_collection_tags;
    	let updating_info;
    	let updating_filters;
    	let current;
    	let mounted;
    	let dispose;

    	function advancedfilters_filtered_cards_binding(value) {
    		/*advancedfilters_filtered_cards_binding*/ ctx[11](value);
    	}

    	function advancedfilters_sort_binding(value) {
    		/*advancedfilters_sort_binding*/ ctx[12](value);
    	}

    	function advancedfilters_collection_tags_binding(value) {
    		/*advancedfilters_collection_tags_binding*/ ctx[13](value);
    	}

    	function advancedfilters_info_binding(value) {
    		/*advancedfilters_info_binding*/ ctx[14](value);
    	}

    	function advancedfilters_filters_binding(value) {
    		/*advancedfilters_filters_binding*/ ctx[15](value);
    	}

    	let advancedfilters_props = {};

    	if (/*filtered_cards*/ ctx[4] !== void 0) {
    		advancedfilters_props.filtered_cards = /*filtered_cards*/ ctx[4];
    	}

    	if (/*sort*/ ctx[2] !== void 0) {
    		advancedfilters_props.sort = /*sort*/ ctx[2];
    	}

    	if (/*collection_tags*/ ctx[3] !== void 0) {
    		advancedfilters_props.collection_tags = /*collection_tags*/ ctx[3];
    	}

    	if (/*info*/ ctx[1] !== void 0) {
    		advancedfilters_props.info = /*info*/ ctx[1];
    	}

    	if (/*filters*/ ctx[0] !== void 0) {
    		advancedfilters_props.filters = /*filters*/ ctx[0];
    	}

    	advancedfilters = new Advanced_filters({
    			props: advancedfilters_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(advancedfilters, 'filtered_cards', advancedfilters_filtered_cards_binding));
    	binding_callbacks.push(() => bind(advancedfilters, 'sort', advancedfilters_sort_binding));
    	binding_callbacks.push(() => bind(advancedfilters, 'collection_tags', advancedfilters_collection_tags_binding));
    	binding_callbacks.push(() => bind(advancedfilters, 'info', advancedfilters_info_binding));
    	binding_callbacks.push(() => bind(advancedfilters, 'filters', advancedfilters_filters_binding));

    	const block = {
    		c: function create() {
    			center = element("center");
    			t0 = text("Search: ");
    			input = element("input");
    			t1 = space();
    			button = element("button");
    			t2 = text(/*more_or_less*/ ctx[5]);
    			t3 = text(" Filters ");
    			b = element("b");
    			t4 = text(/*pointer*/ ctx[6]);
    			t5 = space();
    			div = element("div");
    			create_component(advancedfilters.$$.fragment);
    			attr_dev(input, "type", "search");
    			add_location(input, file$e, 15, 16, 397);
    			add_location(b, file$e, 17, 31, 522);
    			attr_dev(button, "type", "button");
    			add_location(button, file$e, 16, 0, 450);
    			add_location(center, file$e, 14, 0, 372);
    			set_style(div, "display", /*visibility*/ ctx[7], false);
    			add_location(div, file$e, 21, 0, 560);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, t0);
    			append_dev(center, input);
    			set_input_value(input, /*filters*/ ctx[0]['search']);
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
    					listen_dev(input, "input", /*input_input_handler*/ ctx[10]),
    					listen_dev(button, "click", /*toggle*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*filters*/ 1) {
    				set_input_value(input, /*filters*/ ctx[0]['search']);
    			}

    			if (!current || dirty & /*more_or_less*/ 32) set_data_dev(t2, /*more_or_less*/ ctx[5]);
    			if (!current || dirty & /*pointer*/ 64) set_data_dev(t4, /*pointer*/ ctx[6]);
    			const advancedfilters_changes = {};

    			if (!updating_filtered_cards && dirty & /*filtered_cards*/ 16) {
    				updating_filtered_cards = true;
    				advancedfilters_changes.filtered_cards = /*filtered_cards*/ ctx[4];
    				add_flush_callback(() => updating_filtered_cards = false);
    			}

    			if (!updating_sort && dirty & /*sort*/ 4) {
    				updating_sort = true;
    				advancedfilters_changes.sort = /*sort*/ ctx[2];
    				add_flush_callback(() => updating_sort = false);
    			}

    			if (!updating_collection_tags && dirty & /*collection_tags*/ 8) {
    				updating_collection_tags = true;
    				advancedfilters_changes.collection_tags = /*collection_tags*/ ctx[3];
    				add_flush_callback(() => updating_collection_tags = false);
    			}

    			if (!updating_info && dirty & /*info*/ 2) {
    				updating_info = true;
    				advancedfilters_changes.info = /*info*/ ctx[1];
    				add_flush_callback(() => updating_info = false);
    			}

    			if (!updating_filters && dirty & /*filters*/ 1) {
    				updating_filters = true;
    				advancedfilters_changes.filters = /*filters*/ ctx[0];
    				add_flush_callback(() => updating_filters = false);
    			}

    			advancedfilters.$set(advancedfilters_changes);

    			if (dirty & /*visibility*/ 128) {
    				set_style(div, "display", /*visibility*/ ctx[7], false);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let visibility;
    	let pointer;
    	let more_or_less;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filters', slots, []);
    	let { filters } = $$props;
    	let { info } = $$props;
    	let { sort } = $$props;
    	let { collection_tags } = $$props;
    	let { filtered_cards } = $$props;
    	let open = false;

    	let toggle = () => {
    		$$invalidate(9, open = !open);
    	};

    	const writable_props = ['filters', 'info', 'sort', 'collection_tags', 'filtered_cards'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filters> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		filters['search'] = this.value;
    		$$invalidate(0, filters);
    	}

    	function advancedfilters_filtered_cards_binding(value) {
    		filtered_cards = value;
    		$$invalidate(4, filtered_cards);
    	}

    	function advancedfilters_sort_binding(value) {
    		sort = value;
    		$$invalidate(2, sort);
    	}

    	function advancedfilters_collection_tags_binding(value) {
    		collection_tags = value;
    		$$invalidate(3, collection_tags);
    	}

    	function advancedfilters_info_binding(value) {
    		info = value;
    		$$invalidate(1, info);
    	}

    	function advancedfilters_filters_binding(value) {
    		filters = value;
    		$$invalidate(0, filters);
    	}

    	$$self.$$set = $$props => {
    		if ('filters' in $$props) $$invalidate(0, filters = $$props.filters);
    		if ('info' in $$props) $$invalidate(1, info = $$props.info);
    		if ('sort' in $$props) $$invalidate(2, sort = $$props.sort);
    		if ('collection_tags' in $$props) $$invalidate(3, collection_tags = $$props.collection_tags);
    		if ('filtered_cards' in $$props) $$invalidate(4, filtered_cards = $$props.filtered_cards);
    	};

    	$$self.$capture_state = () => ({
    		filters,
    		info,
    		sort,
    		collection_tags,
    		filtered_cards,
    		AdvancedFilters: Advanced_filters,
    		open,
    		toggle,
    		more_or_less,
    		pointer,
    		visibility
    	});

    	$$self.$inject_state = $$props => {
    		if ('filters' in $$props) $$invalidate(0, filters = $$props.filters);
    		if ('info' in $$props) $$invalidate(1, info = $$props.info);
    		if ('sort' in $$props) $$invalidate(2, sort = $$props.sort);
    		if ('collection_tags' in $$props) $$invalidate(3, collection_tags = $$props.collection_tags);
    		if ('filtered_cards' in $$props) $$invalidate(4, filtered_cards = $$props.filtered_cards);
    		if ('open' in $$props) $$invalidate(9, open = $$props.open);
    		if ('toggle' in $$props) $$invalidate(8, toggle = $$props.toggle);
    		if ('more_or_less' in $$props) $$invalidate(5, more_or_less = $$props.more_or_less);
    		if ('pointer' in $$props) $$invalidate(6, pointer = $$props.pointer);
    		if ('visibility' in $$props) $$invalidate(7, visibility = $$props.visibility);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 512) {
    			$$invalidate(7, visibility = open ? 'block' : 'none');
    		}

    		if ($$self.$$.dirty & /*open*/ 512) {
    			$$invalidate(6, pointer = open ? '-' : '+');
    		}

    		if ($$self.$$.dirty & /*open*/ 512) {
    			$$invalidate(5, more_or_less = open ? 'Less' : 'More');
    		}
    	};

    	return [
    		filters,
    		info,
    		sort,
    		collection_tags,
    		filtered_cards,
    		more_or_less,
    		pointer,
    		visibility,
    		toggle,
    		open,
    		input_input_handler,
    		advancedfilters_filtered_cards_binding,
    		advancedfilters_sort_binding,
    		advancedfilters_collection_tags_binding,
    		advancedfilters_info_binding,
    		advancedfilters_filters_binding
    	];
    }

    class Filters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			filters: 0,
    			info: 1,
    			sort: 2,
    			collection_tags: 3,
    			filtered_cards: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filters",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*filters*/ ctx[0] === undefined && !('filters' in props)) {
    			console.warn("<Filters> was created without expected prop 'filters'");
    		}

    		if (/*info*/ ctx[1] === undefined && !('info' in props)) {
    			console.warn("<Filters> was created without expected prop 'info'");
    		}

    		if (/*sort*/ ctx[2] === undefined && !('sort' in props)) {
    			console.warn("<Filters> was created without expected prop 'sort'");
    		}

    		if (/*collection_tags*/ ctx[3] === undefined && !('collection_tags' in props)) {
    			console.warn("<Filters> was created without expected prop 'collection_tags'");
    		}

    		if (/*filtered_cards*/ ctx[4] === undefined && !('filtered_cards' in props)) {
    			console.warn("<Filters> was created without expected prop 'filtered_cards'");
    		}
    	}

    	get filters() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filters(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get info() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sort() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sort(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collection_tags() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collection_tags(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filtered_cards() {
    		throw new Error("<Filters>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filtered_cards(value) {
    		throw new Error("<Filters>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/home.svelte generated by Svelte v3.48.0 */

    const { window: window_1 } = globals;
    const file$d = "src/home.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	return child_ctx;
    }

    // (46:0) {:else}
    function create_else_block$2(ctx) {
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
    			t1 = text(/*username*/ ctx[0]);
    			t2 = space();
    			a0 = element("a");
    			a0.textContent = "sign out";
    			t4 = text(" or\n        ");
    			a1 = element("a");
    			a1.textContent = "switch account";
    			attr_dev(a0, "class", "login_button svelte-sxvern");
    			add_location(a0, file$d, 47, 8, 1390);
    			attr_dev(a1, "class", "login_button svelte-sxvern");
    			add_location(a1, file$d, 48, 8, 1505);
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
    					listen_dev(a0, "click", /*click_handler_1*/ ctx[17], false, false, false),
    					listen_dev(a1, "click", /*click_handler_2*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*username*/ 1) set_data_dev(t1, /*username*/ ctx[0]);
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(46:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:0) {#if username === 'guest'}
    function create_if_block$8(ctx) {
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Welcome, guest\n        ");
    			button = element("button");
    			button.textContent = "login / register";
    			attr_dev(button, "class", "login_button svelte-sxvern");
    			attr_dev(button, "type", "button");
    			add_location(button, file$d, 44, 8, 1242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[16], false, false, false);
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(43:0) {#if username === 'guest'}",
    		ctx
    	});

    	return block;
    }

    // (71:8) {#each filtered_cards.filter((elem,idx,arr) => idx%cols===offset) as card (card.id)}
    function create_each_block_1$1(key_1, ctx) {
    	let first;
    	let card;
    	let updating_card_edited_alert;
    	let updating_info;
    	let updating_state;
    	let current;

    	function card_card_edited_alert_binding(value) {
    		/*card_card_edited_alert_binding*/ ctx[29](value);
    	}

    	function card_info_binding(value) {
    		/*card_info_binding*/ ctx[30](value);
    	}

    	function card_state_binding(value) {
    		/*card_state_binding*/ ctx[31](value);
    	}

    	let card_props = { card: /*card*/ ctx[38] };

    	if (/*card_edited_alert*/ ctx[7] !== void 0) {
    		card_props.card_edited_alert = /*card_edited_alert*/ ctx[7];
    	}

    	if (/*info*/ ctx[5] !== void 0) {
    		card_props.info = /*info*/ ctx[5];
    	}

    	if (/*state*/ ctx[1] !== void 0) {
    		card_props.state = /*state*/ ctx[1];
    	}

    	card = new Card({ props: card_props, $$inline: true });
    	binding_callbacks.push(() => bind(card, 'card_edited_alert', card_card_edited_alert_binding));
    	binding_callbacks.push(() => bind(card, 'info', card_info_binding));
    	binding_callbacks.push(() => bind(card, 'state', card_state_binding));

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(card.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const card_changes = {};
    			if (dirty[0] & /*filtered_cards, cols*/ 4100) card_changes.card = /*card*/ ctx[38];

    			if (!updating_card_edited_alert && dirty[0] & /*card_edited_alert*/ 128) {
    				updating_card_edited_alert = true;
    				card_changes.card_edited_alert = /*card_edited_alert*/ ctx[7];
    				add_flush_callback(() => updating_card_edited_alert = false);
    			}

    			if (!updating_info && dirty[0] & /*info*/ 32) {
    				updating_info = true;
    				card_changes.info = /*info*/ ctx[5];
    				add_flush_callback(() => updating_info = false);
    			}

    			if (!updating_state && dirty[0] & /*state*/ 2) {
    				updating_state = true;
    				card_changes.state = /*state*/ ctx[1];
    				add_flush_callback(() => updating_state = false);
    			}

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
    			if (detaching) detach_dev(first);
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(71:8) {#each filtered_cards.filter((elem,idx,arr) => idx%cols===offset) as card (card.id)}",
    		ctx
    	});

    	return block;
    }

    // (69:0) {#each [...Array(cols).keys()] as offset}
    function create_each_block$5(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[28](/*offset*/ ctx[35], ...args);
    	}

    	let each_value_1 = /*filtered_cards*/ ctx[2].filter(func);
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*card*/ ctx[38].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "column");
    			add_location(div, file$d, 69, 8, 2110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*filtered_cards, cols, card_edited_alert, info, state*/ 4262) {
    				each_value_1 = /*filtered_cards*/ ctx[2].filter(func);
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, outro_and_destroy_block, create_each_block_1$1, t, get_each_context_1$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(69:0) {#each [...Array(cols).keys()] as offset}",
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
    	let updating_due_count;
    	let t3;
    	let createbutton;
    	let updating_created_count;
    	let t4;
    	let div2;
    	let filters_1;
    	let updating_filtered_cards;
    	let updating_search;
    	let updating_sort;
    	let updating_filters;
    	let updating_info;
    	let updating_collection_tags;
    	let t5;
    	let div3;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[15]);

    	function select_block_type(ctx, dirty) {
    		if (/*username*/ ctx[0] === 'guest') return create_if_block$8;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	function reviewbutton_due_count_binding(value) {
    		/*reviewbutton_due_count_binding*/ ctx[19](value);
    	}

    	let reviewbutton_props = {};

    	if (/*due_count*/ ctx[4] !== void 0) {
    		reviewbutton_props.due_count = /*due_count*/ ctx[4];
    	}

    	reviewbutton = new Review_button({
    			props: reviewbutton_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(reviewbutton, 'due_count', reviewbutton_due_count_binding));
    	reviewbutton.$on("click", /*click_handler_3*/ ctx[20]);

    	function createbutton_created_count_binding(value) {
    		/*createbutton_created_count_binding*/ ctx[21](value);
    	}

    	let createbutton_props = {};

    	if (/*created_count*/ ctx[6] !== void 0) {
    		createbutton_props.created_count = /*created_count*/ ctx[6];
    	}

    	createbutton = new Create_button({
    			props: createbutton_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(createbutton, 'created_count', createbutton_created_count_binding));
    	createbutton.$on("click", /*create_card*/ ctx[13]);

    	function filters_1_filtered_cards_binding(value) {
    		/*filters_1_filtered_cards_binding*/ ctx[22](value);
    	}

    	function filters_1_search_binding(value) {
    		/*filters_1_search_binding*/ ctx[23](value);
    	}

    	function filters_1_sort_binding(value) {
    		/*filters_1_sort_binding*/ ctx[24](value);
    	}

    	function filters_1_filters_binding(value) {
    		/*filters_1_filters_binding*/ ctx[25](value);
    	}

    	function filters_1_info_binding(value) {
    		/*filters_1_info_binding*/ ctx[26](value);
    	}

    	function filters_1_collection_tags_binding(value) {
    		/*filters_1_collection_tags_binding*/ ctx[27](value);
    	}

    	let filters_1_props = {};

    	if (/*filtered_cards*/ ctx[2] !== void 0) {
    		filters_1_props.filtered_cards = /*filtered_cards*/ ctx[2];
    	}

    	if (/*search*/ ctx[10] !== void 0) {
    		filters_1_props.search = /*search*/ ctx[10];
    	}

    	if (/*sort*/ ctx[9] !== void 0) {
    		filters_1_props.sort = /*sort*/ ctx[9];
    	}

    	if (/*filters*/ ctx[3] !== void 0) {
    		filters_1_props.filters = /*filters*/ ctx[3];
    	}

    	if (/*info*/ ctx[5] !== void 0) {
    		filters_1_props.info = /*info*/ ctx[5];
    	}

    	if (/*collection_tags*/ ctx[8] !== void 0) {
    		filters_1_props.collection_tags = /*collection_tags*/ ctx[8];
    	}

    	filters_1 = new Filters({ props: filters_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(filters_1, 'filtered_cards', filters_1_filtered_cards_binding));
    	binding_callbacks.push(() => bind(filters_1, 'search', filters_1_search_binding));
    	binding_callbacks.push(() => bind(filters_1, 'sort', filters_1_sort_binding));
    	binding_callbacks.push(() => bind(filters_1, 'filters', filters_1_filters_binding));
    	binding_callbacks.push(() => bind(filters_1, 'info', filters_1_info_binding));
    	binding_callbacks.push(() => bind(filters_1, 'collection_tags', filters_1_collection_tags_binding));
    	let each_value = [...Array(/*cols*/ ctx[12]).keys()];
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
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(a, "float", "right");
    			set_style(a, "position", "relative");
    			add_location(a, file$d, 51, 0, 1592);
    			attr_dev(div0, "id", "major_buttons");
    			attr_dev(div0, "class", "svelte-sxvern");
    			add_location(div0, file$d, 53, 0, 1648);
    			attr_dev(div1, "class", "top svelte-sxvern");
    			add_location(div1, file$d, 41, 0, 1166);
    			set_style(div2, "margin", `20px`, false);
    			add_location(div2, file$d, 59, 0, 1845);
    			attr_dev(div3, "class", "columns svelte-sxvern");
    			add_location(div3, file$d, 63, 0, 1976);
    			add_location(body, file$d, 38, 0, 1157);
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
    			append_dev(body, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "resize", /*onwindowresize*/ ctx[15]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
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

    			const reviewbutton_changes = {};

    			if (!updating_due_count && dirty[0] & /*due_count*/ 16) {
    				updating_due_count = true;
    				reviewbutton_changes.due_count = /*due_count*/ ctx[4];
    				add_flush_callback(() => updating_due_count = false);
    			}

    			reviewbutton.$set(reviewbutton_changes);
    			const createbutton_changes = {};

    			if (!updating_created_count && dirty[0] & /*created_count*/ 64) {
    				updating_created_count = true;
    				createbutton_changes.created_count = /*created_count*/ ctx[6];
    				add_flush_callback(() => updating_created_count = false);
    			}

    			createbutton.$set(createbutton_changes);
    			const filters_1_changes = {};

    			if (!updating_filtered_cards && dirty[0] & /*filtered_cards*/ 4) {
    				updating_filtered_cards = true;
    				filters_1_changes.filtered_cards = /*filtered_cards*/ ctx[2];
    				add_flush_callback(() => updating_filtered_cards = false);
    			}

    			if (!updating_search && dirty[0] & /*search*/ 1024) {
    				updating_search = true;
    				filters_1_changes.search = /*search*/ ctx[10];
    				add_flush_callback(() => updating_search = false);
    			}

    			if (!updating_sort && dirty[0] & /*sort*/ 512) {
    				updating_sort = true;
    				filters_1_changes.sort = /*sort*/ ctx[9];
    				add_flush_callback(() => updating_sort = false);
    			}

    			if (!updating_filters && dirty[0] & /*filters*/ 8) {
    				updating_filters = true;
    				filters_1_changes.filters = /*filters*/ ctx[3];
    				add_flush_callback(() => updating_filters = false);
    			}

    			if (!updating_info && dirty[0] & /*info*/ 32) {
    				updating_info = true;
    				filters_1_changes.info = /*info*/ ctx[5];
    				add_flush_callback(() => updating_info = false);
    			}

    			if (!updating_collection_tags && dirty[0] & /*collection_tags*/ 256) {
    				updating_collection_tags = true;
    				filters_1_changes.collection_tags = /*collection_tags*/ ctx[8];
    				add_flush_callback(() => updating_collection_tags = false);
    			}

    			filters_1.$set(filters_1_changes);

    			if (dirty[0] & /*filtered_cards, cols, card_edited_alert, info, state*/ 4262) {
    				each_value = [...Array(/*cols*/ ctx[12]).keys()];
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
    						each_blocks[i].m(div3, null);
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
    			transition_in(reviewbutton.$$.fragment, local);
    			transition_in(createbutton.$$.fragment, local);
    			transition_in(filters_1.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(reviewbutton.$$.fragment, local);
    			transition_out(createbutton.$$.fragment, local);
    			transition_out(filters_1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			if_block.d();
    			destroy_component(reviewbutton);
    			destroy_component(createbutton);
    			destroy_component(filters_1);
    			destroy_each(each_blocks, detaching);
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
    	let due_message;
    	let cols;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let due;
    	let new_only;
    	let { username } = $$props;
    	let { state } = $$props;
    	let { filtered_cards } = $$props;
    	let { cached_cards } = $$props;
    	let { filters } = $$props;
    	let { due_count } = $$props;
    	let { info } = $$props;
    	let { created_count } = $$props;
    	let { card_edited_alert } = $$props;
    	let { collection_tags } = $$props;
    	let { sort } = $$props;
    	let { search } = $$props;
    	let innerWidth;

    	function create_card() {
    		// create a new template card
    		// add it to the filtered_cards list
    		// pass it to the editor
    		let nc = { ...new_card() }; // copy new card template

    		$$invalidate(1, state['card_to_edit'] = nc, state);
    		$$invalidate(1, state['edit_mode'] = true, state);
    	}

    	const writable_props = [
    		'username',
    		'state',
    		'filtered_cards',
    		'cached_cards',
    		'filters',
    		'due_count',
    		'info',
    		'created_count',
    		'card_edited_alert',
    		'collection_tags',
    		'sort',
    		'search'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(11, innerWidth = window_1.innerWidth);
    	}

    	const click_handler = () => {
    		$$invalidate(0, username = 'none');
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, username = 'guest');
    		window.localStorage.clear();
    	};

    	const click_handler_2 = () => {
    		$$invalidate(0, username = 'none');
    	};

    	function reviewbutton_due_count_binding(value) {
    		due_count = value;
    		$$invalidate(4, due_count);
    	}

    	const click_handler_3 = () => {
    		$$invalidate(1, state.reviewing = true, state);
    	};

    	function createbutton_created_count_binding(value) {
    		created_count = value;
    		$$invalidate(6, created_count);
    	}

    	function filters_1_filtered_cards_binding(value) {
    		filtered_cards = value;
    		$$invalidate(2, filtered_cards);
    	}

    	function filters_1_search_binding(value) {
    		search = value;
    		$$invalidate(10, search);
    	}

    	function filters_1_sort_binding(value) {
    		sort = value;
    		$$invalidate(9, sort);
    	}

    	function filters_1_filters_binding(value) {
    		filters = value;
    		$$invalidate(3, filters);
    	}

    	function filters_1_info_binding(value) {
    		info = value;
    		$$invalidate(5, info);
    	}

    	function filters_1_collection_tags_binding(value) {
    		collection_tags = value;
    		$$invalidate(8, collection_tags);
    	}

    	const func = (offset, elem, idx, arr) => idx % cols === offset;

    	function card_card_edited_alert_binding(value) {
    		card_edited_alert = value;
    		$$invalidate(7, card_edited_alert);
    	}

    	function card_info_binding(value) {
    		info = value;
    		$$invalidate(5, info);
    	}

    	function card_state_binding(value) {
    		state = value;
    		$$invalidate(1, state);
    	}

    	$$self.$$set = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('filtered_cards' in $$props) $$invalidate(2, filtered_cards = $$props.filtered_cards);
    		if ('cached_cards' in $$props) $$invalidate(14, cached_cards = $$props.cached_cards);
    		if ('filters' in $$props) $$invalidate(3, filters = $$props.filters);
    		if ('due_count' in $$props) $$invalidate(4, due_count = $$props.due_count);
    		if ('info' in $$props) $$invalidate(5, info = $$props.info);
    		if ('created_count' in $$props) $$invalidate(6, created_count = $$props.created_count);
    		if ('card_edited_alert' in $$props) $$invalidate(7, card_edited_alert = $$props.card_edited_alert);
    		if ('collection_tags' in $$props) $$invalidate(8, collection_tags = $$props.collection_tags);
    		if ('sort' in $$props) $$invalidate(9, sort = $$props.sort);
    		if ('search' in $$props) $$invalidate(10, search = $$props.search);
    	};

    	$$self.$capture_state = () => ({
    		new_card,
    		Tristate,
    		ReviewButton: Review_button,
    		CreateButton: Create_button,
    		Card,
    		Filters,
    		due,
    		new_only,
    		username,
    		state,
    		filtered_cards,
    		cached_cards,
    		filters,
    		due_count,
    		info,
    		created_count,
    		card_edited_alert,
    		collection_tags,
    		sort,
    		search,
    		innerWidth,
    		create_card,
    		cols,
    		due_message
    	});

    	$$self.$inject_state = $$props => {
    		if ('due' in $$props) $$invalidate(33, due = $$props.due);
    		if ('new_only' in $$props) new_only = $$props.new_only;
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('filtered_cards' in $$props) $$invalidate(2, filtered_cards = $$props.filtered_cards);
    		if ('cached_cards' in $$props) $$invalidate(14, cached_cards = $$props.cached_cards);
    		if ('filters' in $$props) $$invalidate(3, filters = $$props.filters);
    		if ('due_count' in $$props) $$invalidate(4, due_count = $$props.due_count);
    		if ('info' in $$props) $$invalidate(5, info = $$props.info);
    		if ('created_count' in $$props) $$invalidate(6, created_count = $$props.created_count);
    		if ('card_edited_alert' in $$props) $$invalidate(7, card_edited_alert = $$props.card_edited_alert);
    		if ('collection_tags' in $$props) $$invalidate(8, collection_tags = $$props.collection_tags);
    		if ('sort' in $$props) $$invalidate(9, sort = $$props.sort);
    		if ('search' in $$props) $$invalidate(10, search = $$props.search);
    		if ('innerWidth' in $$props) $$invalidate(11, innerWidth = $$props.innerWidth);
    		if ('cols' in $$props) $$invalidate(12, cols = $$props.cols);
    		if ('due_message' in $$props) due_message = $$props.due_message;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*innerWidth*/ 2048) {
    			// one column for every 450px of window width
    			// At least one column
    			$$invalidate(12, cols = Math.floor(innerWidth / 450) || 1);
    		}
    	};

    	due_message = due === 'any' ? '' : due === 'yes' ? 'due' : 'not due';

    	return [
    		username,
    		state,
    		filtered_cards,
    		filters,
    		due_count,
    		info,
    		created_count,
    		card_edited_alert,
    		collection_tags,
    		sort,
    		search,
    		innerWidth,
    		cols,
    		create_card,
    		cached_cards,
    		onwindowresize,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		reviewbutton_due_count_binding,
    		click_handler_3,
    		createbutton_created_count_binding,
    		filters_1_filtered_cards_binding,
    		filters_1_search_binding,
    		filters_1_sort_binding,
    		filters_1_filters_binding,
    		filters_1_info_binding,
    		filters_1_collection_tags_binding,
    		func,
    		card_card_edited_alert_binding,
    		card_info_binding,
    		card_state_binding
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$d,
    			create_fragment$d,
    			safe_not_equal,
    			{
    				username: 0,
    				state: 1,
    				filtered_cards: 2,
    				cached_cards: 14,
    				filters: 3,
    				due_count: 4,
    				info: 5,
    				created_count: 6,
    				card_edited_alert: 7,
    				collection_tags: 8,
    				sort: 9,
    				search: 10
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*username*/ ctx[0] === undefined && !('username' in props)) {
    			console.warn("<Home> was created without expected prop 'username'");
    		}

    		if (/*state*/ ctx[1] === undefined && !('state' in props)) {
    			console.warn("<Home> was created without expected prop 'state'");
    		}

    		if (/*filtered_cards*/ ctx[2] === undefined && !('filtered_cards' in props)) {
    			console.warn("<Home> was created without expected prop 'filtered_cards'");
    		}

    		if (/*cached_cards*/ ctx[14] === undefined && !('cached_cards' in props)) {
    			console.warn("<Home> was created without expected prop 'cached_cards'");
    		}

    		if (/*filters*/ ctx[3] === undefined && !('filters' in props)) {
    			console.warn("<Home> was created without expected prop 'filters'");
    		}

    		if (/*due_count*/ ctx[4] === undefined && !('due_count' in props)) {
    			console.warn("<Home> was created without expected prop 'due_count'");
    		}

    		if (/*info*/ ctx[5] === undefined && !('info' in props)) {
    			console.warn("<Home> was created without expected prop 'info'");
    		}

    		if (/*created_count*/ ctx[6] === undefined && !('created_count' in props)) {
    			console.warn("<Home> was created without expected prop 'created_count'");
    		}

    		if (/*card_edited_alert*/ ctx[7] === undefined && !('card_edited_alert' in props)) {
    			console.warn("<Home> was created without expected prop 'card_edited_alert'");
    		}

    		if (/*collection_tags*/ ctx[8] === undefined && !('collection_tags' in props)) {
    			console.warn("<Home> was created without expected prop 'collection_tags'");
    		}

    		if (/*sort*/ ctx[9] === undefined && !('sort' in props)) {
    			console.warn("<Home> was created without expected prop 'sort'");
    		}

    		if (/*search*/ ctx[10] === undefined && !('search' in props)) {
    			console.warn("<Home> was created without expected prop 'search'");
    		}
    	}

    	get username() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set username(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filtered_cards() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filtered_cards(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cached_cards() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cached_cards(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filters() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filters(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get due_count() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set due_count(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get info() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get created_count() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set created_count(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card_edited_alert() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card_edited_alert(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collection_tags() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collection_tags(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sort() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sort(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get search() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set search(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
    		/*editor_value_binding*/ ctx[7](value);
    	}

    	function editor_placeholder_binding(value) {
    		/*editor_placeholder_binding*/ ctx[8](value);
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
    		/*image_image_id_binding*/ ctx[9](value);
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
    			add_location(div0, file$9, 15, 1, 417);
    			attr_dev(div1, "id", "main");
    			attr_dev(div1, "class", "svelte-uhg411");
    			add_location(div1, file$9, 13, 0, 346);
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
    	let { audio_id } = $$props;
    	let { audio_file } = $$props;
    	let { image_file } = $$props;
    	let { placeholder } = $$props;
    	let { image_picker_disabled } = $$props;

    	const writable_props = [
    		'text',
    		'image_id',
    		'audio_id',
    		'audio_file',
    		'image_file',
    		'placeholder',
    		'image_picker_disabled'
    	];

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
    		if ('audio_id' in $$props) $$invalidate(4, audio_id = $$props.audio_id);
    		if ('audio_file' in $$props) $$invalidate(5, audio_file = $$props.audio_file);
    		if ('image_file' in $$props) $$invalidate(6, image_file = $$props.image_file);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('image_picker_disabled' in $$props) $$invalidate(3, image_picker_disabled = $$props.image_picker_disabled);
    	};

    	$$self.$capture_state = () => ({
    		Editor: Text_editor,
    		Audio: Audio_picker,
    		Image: Image_picker,
    		text,
    		image_id,
    		audio_id,
    		audio_file,
    		image_file,
    		placeholder,
    		image_picker_disabled
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('image_id' in $$props) $$invalidate(1, image_id = $$props.image_id);
    		if ('audio_id' in $$props) $$invalidate(4, audio_id = $$props.audio_id);
    		if ('audio_file' in $$props) $$invalidate(5, audio_file = $$props.audio_file);
    		if ('image_file' in $$props) $$invalidate(6, image_file = $$props.image_file);
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
    		audio_id,
    		audio_file,
    		image_file,
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
    			audio_id: 4,
    			audio_file: 5,
    			image_file: 6,
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

    		if (/*audio_id*/ ctx[4] === undefined && !('audio_id' in props)) {
    			console.warn("<Side_editor> was created without expected prop 'audio_id'");
    		}

    		if (/*audio_file*/ ctx[5] === undefined && !('audio_file' in props)) {
    			console.warn("<Side_editor> was created without expected prop 'audio_file'");
    		}

    		if (/*image_file*/ ctx[6] === undefined && !('image_file' in props)) {
    			console.warn("<Side_editor> was created without expected prop 'image_file'");
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

    	get audio_id() {
    		throw new Error("<Side_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set audio_id(value) {
    		throw new Error("<Side_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get audio_file() {
    		throw new Error("<Side_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set audio_file(value) {
    		throw new Error("<Side_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image_file() {
    		throw new Error("<Side_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image_file(value) {
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
    function create_if_block$7(ctx) {
    	let label;
    	let input;
    	let t0;
    	let t1_value = /*tag*/ ctx[10] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[8].call(input, /*tag*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$8, 26, 16, 925);
    			attr_dev(label, "class", "svelte-f8t21t");
    			add_location(label, file$8, 25, 12, 900);
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
    		id: create_if_block$7.name,
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
    	let if_block = show_if && create_if_block$7(ctx);

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
    					if_block = create_if_block$7(ctx);
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

    			add_location(b, file$8, 19, 20, 616);
    			attr_dev(p, "id", "tags_list");
    			attr_dev(p, "class", "svelte-f8t21t");
    			add_location(p, file$8, 19, 2, 598);
    			attr_dev(button, "type", "button");
    			add_location(button, file$8, 20, 2, 641);
    			attr_dev(input, "type", "search");
    			attr_dev(input, "placeholder", "search");
    			add_location(input, file$8, 21, 2, 737);
    			attr_dev(div, "id", "tags_bar");
    			attr_dev(div, "class", "svelte-f8t21t");
    			add_location(div, file$8, 18, 0, 576);
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
    					listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7])
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tags_editor', slots, []);
    	let { card } = $$props;
    	let { collection_tags } = $$props;

    	function new_tag(tag) {
    		$$invalidate(4, collection_tags = [tag, ...collection_tags]);
    		$$invalidate(1, has_tag_map[tag] = true, has_tag_map);
    	}

    	let has_tag_map = collection_tags.reduce(
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
    	const writable_props = ['card', 'collection_tags'];

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
    		if ('collection_tags' in $$props) $$invalidate(4, collection_tags = $$props.collection_tags);
    	};

    	$$self.$capture_state = () => ({
    		card,
    		collection_tags,
    		new_tag,
    		has_tag_map,
    		tl,
    		search,
    		tags_list
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('collection_tags' in $$props) $$invalidate(4, collection_tags = $$props.collection_tags);
    		if ('has_tag_map' in $$props) $$invalidate(1, has_tag_map = $$props.has_tag_map);
    		if ('search' in $$props) $$invalidate(2, search = $$props.search);
    		if ('tags_list' in $$props) $$invalidate(5, tags_list = $$props.tags_list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*has_tag_map*/ 2) {
    			$$invalidate(5, tags_list = Object.entries(has_tag_map).filter(pair => pair[1]).map(pair => pair[0]));
    		}

    		if ($$self.$$.dirty & /*tags_list*/ 32) {
    			$$invalidate(0, card.tags = tags_list.join(', '), card);
    		}
    	};

    	return [
    		card,
    		has_tag_map,
    		search,
    		new_tag,
    		collection_tags,
    		tags_list,
    		click_handler,
    		input_input_handler,
    		input_change_handler
    	];
    }

    class Tags_editor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { card: 0, collection_tags: 4 });

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

    		if (/*collection_tags*/ ctx[4] === undefined && !('collection_tags' in props)) {
    			console.warn("<Tags_editor> was created without expected prop 'collection_tags'");
    		}
    	}

    	get card() {
    		throw new Error("<Tags_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Tags_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collection_tags() {
    		throw new Error("<Tags_editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collection_tags(value) {
    		throw new Error("<Tags_editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/edit_header.svelte generated by Svelte v3.48.0 */
    const file$7 = "src/edit_header.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (16:0) {#each card_types as card_type}
    function create_each_block$3(ctx) {
    	let label;
    	let input;
    	let input_checked_value;
    	let t0;
    	let t1_value = /*card_type*/ ctx[9] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "card_type");
    			input.__value = /*card_type*/ ctx[9];
    			input.value = input.__value;
    			input.checked = input_checked_value = /*card*/ ctx[0].card_type === /*card_type*/ ctx[9];
    			attr_dev(input, "class", "svelte-aj94bp");
    			/*$$binding_groups*/ ctx[6][0].push(input);
    			add_location(input, file$7, 17, 2, 725);
    			attr_dev(label, "class", "svelte-aj94bp");
    			add_location(label, file$7, 16, 0, 715);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*card*/ ctx[0].card_type;
    			append_dev(label, t0);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*card*/ 1 && input_checked_value !== (input_checked_value = /*card*/ ctx[0].card_type === /*card_type*/ ctx[9])) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*card*/ 1) {
    				input.checked = input.__value === /*card*/ ctx[0].card_type;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[6][0].splice(/*$$binding_groups*/ ctx[6][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(16:0) {#each card_types as card_type}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let center;
    	let infotooltip0;
    	let t0;
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
    				text: "<b>Basic</b>:  class question and answer card <br><br>\n                <b>Verses</b>: tests you line by line (useful for poetry and oratory) <br><br>\n                <b>Occlusion</b>: generate several cards by covering up parts of a map or diagram (useful for geography or anatomy)"
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
    				text: "Quantify in minutes the worth of remembering this knowledge.<br><br>\n        This is difficult.<br><br>\n        This lets you see if the time spent studying a card has been worthwhile. <br><br>\n        It also lets you sort your cards to find the best ones."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			center = element("center");
    			create_component(infotooltip0.$$.fragment);
    			t0 = space();

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
    			t8 = text("\nMerit\n");
    			input = element("input");
    			attr_dev(button0, "class", "submit_button svelte-aj94bp");
    			add_location(button0, file$7, 23, 0, 879);
    			attr_dev(button1, "class", "submit_button svelte-aj94bp");
    			add_location(button1, file$7, 24, 0, 943);
    			attr_dev(button2, "class", "submit_button svelte-aj94bp");
    			add_location(button2, file$7, 25, 0, 1009);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", "1");
    			attr_dev(input, "max", "60");
    			set_style(input, "width", `50px`, false);
    			add_location(input, file$7, 33, 0, 1360);
    			add_location(center, file$7, 11, 0, 361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			mount_component(infotooltip0, center, null);
    			append_dev(center, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(center, null);
    			}

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
    					listen_dev(button0, "click", /*cancel*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*preview*/ ctx[3], false, false, false),
    					listen_dev(button2, "click", /*save*/ ctx[1], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*card_types, card*/ 17) {
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
    						each_blocks[i].m(center, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*card*/ 1 && to_number(input.value) !== /*card*/ ctx[0].merit) {
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

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		card.card_type = this.__value;
    		$$invalidate(0, card);
    	}

    	function input_input_handler() {
    		card.merit = to_number(this.value);
    		$$invalidate(0, card);
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
    		input_change_handler,
    		$$binding_groups,
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
    function create_if_block$6(ctx) {
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(36:0) {#if !self.deleted}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let if_block = !/*self*/ ctx[0].deleted && create_if_block$6(ctx);

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
    					if_block = create_if_block$6(ctx);
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
    function create_if_block$5(ctx) {
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
    		id: create_if_block$5.name,
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

    	let if_block = !/*image_id*/ ctx[1] && create_if_block$5(ctx);

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
    					if_block = create_if_block$5(ctx);
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

    // (120:0) {#if tmp_card.card_type==='occlusion'}
    function create_if_block_1$3(ctx) {
    	let imageoccluder;
    	let updating_data;
    	let updating_image_id;
    	let t;
    	let hr;
    	let current;

    	function imageoccluder_data_binding(value) {
    		/*imageoccluder_data_binding*/ ctx[12](value);
    	}

    	function imageoccluder_image_id_binding(value) {
    		/*imageoccluder_image_id_binding*/ ctx[13](value);
    	}

    	let imageoccluder_props = {};

    	if (/*occlusion_data*/ ctx[2] !== void 0) {
    		imageoccluder_props.data = /*occlusion_data*/ ctx[2];
    	}

    	if (/*tmp_card*/ ctx[1].front_image_id !== void 0) {
    		imageoccluder_props.image_id = /*tmp_card*/ ctx[1].front_image_id;
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
    			add_location(hr, file$4, 121, 8, 5561);
    		},
    		m: function mount(target, anchor) {
    			mount_component(imageoccluder, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, hr, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const imageoccluder_changes = {};

    			if (!updating_data && dirty & /*occlusion_data*/ 4) {
    				updating_data = true;
    				imageoccluder_changes.data = /*occlusion_data*/ ctx[2];
    				add_flush_callback(() => updating_data = false);
    			}

    			if (!updating_image_id && dirty & /*tmp_card*/ 2) {
    				updating_image_id = true;
    				imageoccluder_changes.image_id = /*tmp_card*/ ctx[1].front_image_id;
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(120:0) {#if tmp_card.card_type==='occlusion'}",
    		ctx
    	});

    	return block;
    }

    // (129:0) {#if tmp_card.card_type!='verses'}
    function create_if_block$4(ctx) {
    	let sideeditor;
    	let updating_text;
    	let updating_image_id;
    	let t;
    	let hr;
    	let current;

    	function sideeditor_text_binding_1(value) {
    		/*sideeditor_text_binding_1*/ ctx[16](value);
    	}

    	function sideeditor_image_id_binding_1(value) {
    		/*sideeditor_image_id_binding_1*/ ctx[17](value);
    	}

    	let sideeditor_props = {
    		image_picker_disabled: /*tmp_card*/ ctx[1].card_type === 'occlusion',
    		placeholder: /*placeholder*/ ctx[3].back
    	};

    	if (/*tmp_card*/ ctx[1].back_text !== void 0) {
    		sideeditor_props.text = /*tmp_card*/ ctx[1].back_text;
    	}

    	if (/*tmp_card*/ ctx[1].back_image_id !== void 0) {
    		sideeditor_props.image_id = /*tmp_card*/ ctx[1].back_image_id;
    	}

    	sideeditor = new Side_editor({ props: sideeditor_props, $$inline: true });
    	binding_callbacks.push(() => bind(sideeditor, 'text', sideeditor_text_binding_1));
    	binding_callbacks.push(() => bind(sideeditor, 'image_id', sideeditor_image_id_binding_1));

    	const block = {
    		c: function create() {
    			create_component(sideeditor.$$.fragment);
    			t = space();
    			hr = element("hr");
    			add_location(hr, file$4, 130, 0, 5986);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sideeditor, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, hr, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sideeditor_changes = {};
    			if (dirty & /*tmp_card*/ 2) sideeditor_changes.image_picker_disabled = /*tmp_card*/ ctx[1].card_type === 'occlusion';
    			if (dirty & /*placeholder*/ 8) sideeditor_changes.placeholder = /*placeholder*/ ctx[3].back;

    			if (!updating_text && dirty & /*tmp_card*/ 2) {
    				updating_text = true;
    				sideeditor_changes.text = /*tmp_card*/ ctx[1].back_text;
    				add_flush_callback(() => updating_text = false);
    			}

    			if (!updating_image_id && dirty & /*tmp_card*/ 2) {
    				updating_image_id = true;
    				sideeditor_changes.image_id = /*tmp_card*/ ctx[1].back_image_id;
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(129:0) {#if tmp_card.card_type!='verses'}",
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
    	let updating_collection_tags;
    	let updating_card_1;
    	let current;

    	function editheader_card_binding(value) {
    		/*editheader_card_binding*/ ctx[11](value);
    	}

    	let editheader_props = {};

    	if (/*tmp_card*/ ctx[1] !== void 0) {
    		editheader_props.card = /*tmp_card*/ ctx[1];
    	}

    	editheader = new Edit_header({ props: editheader_props, $$inline: true });
    	binding_callbacks.push(() => bind(editheader, 'card', editheader_card_binding));
    	editheader.$on("preview", /*preview*/ ctx[4]);
    	editheader.$on("cancel", /*cancel*/ ctx[5]);
    	editheader.$on("save", /*save*/ ctx[6]);
    	let if_block0 = /*tmp_card*/ ctx[1].card_type === 'occlusion' && create_if_block_1$3(ctx);

    	function sideeditor_text_binding(value) {
    		/*sideeditor_text_binding*/ ctx[14](value);
    	}

    	function sideeditor_image_id_binding(value) {
    		/*sideeditor_image_id_binding*/ ctx[15](value);
    	}

    	let sideeditor_props = {
    		image_picker_disabled: /*tmp_card*/ ctx[1].card_type === 'occlusion',
    		placeholder: /*placeholder*/ ctx[3].front
    	};

    	if (/*tmp_card*/ ctx[1].front_text !== void 0) {
    		sideeditor_props.text = /*tmp_card*/ ctx[1].front_text;
    	}

    	if (/*tmp_card*/ ctx[1].front_image_id !== void 0) {
    		sideeditor_props.image_id = /*tmp_card*/ ctx[1].front_image_id;
    	}

    	sideeditor = new Side_editor({ props: sideeditor_props, $$inline: true });
    	binding_callbacks.push(() => bind(sideeditor, 'text', sideeditor_text_binding));
    	binding_callbacks.push(() => bind(sideeditor, 'image_id', sideeditor_image_id_binding));
    	let if_block1 = /*tmp_card*/ ctx[1].card_type != 'verses' && create_if_block$4(ctx);

    	function tagseditor_collection_tags_binding(value) {
    		/*tagseditor_collection_tags_binding*/ ctx[18](value);
    	}

    	function tagseditor_card_binding(value) {
    		/*tagseditor_card_binding*/ ctx[19](value);
    	}

    	let tagseditor_props = {};

    	if (/*collection_tags*/ ctx[0] !== void 0) {
    		tagseditor_props.collection_tags = /*collection_tags*/ ctx[0];
    	}

    	if (/*tmp_card*/ ctx[1] !== void 0) {
    		tagseditor_props.card = /*tmp_card*/ ctx[1];
    	}

    	tagseditor = new Tags_editor({ props: tagseditor_props, $$inline: true });
    	binding_callbacks.push(() => bind(tagseditor, 'collection_tags', tagseditor_collection_tags_binding));
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
    			add_location(hr0, file$4, 117, 0, 5415);
    			add_location(hr1, file$4, 125, 0, 5760);
    			add_location(body, file$4, 114, 0, 5305);
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

    			if (!updating_card && dirty & /*tmp_card*/ 2) {
    				updating_card = true;
    				editheader_changes.card = /*tmp_card*/ ctx[1];
    				add_flush_callback(() => updating_card = false);
    			}

    			editheader.$set(editheader_changes);

    			if (/*tmp_card*/ ctx[1].card_type === 'occlusion') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*tmp_card*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
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
    			if (dirty & /*tmp_card*/ 2) sideeditor_changes.image_picker_disabled = /*tmp_card*/ ctx[1].card_type === 'occlusion';
    			if (dirty & /*placeholder*/ 8) sideeditor_changes.placeholder = /*placeholder*/ ctx[3].front;

    			if (!updating_text && dirty & /*tmp_card*/ 2) {
    				updating_text = true;
    				sideeditor_changes.text = /*tmp_card*/ ctx[1].front_text;
    				add_flush_callback(() => updating_text = false);
    			}

    			if (!updating_image_id && dirty & /*tmp_card*/ 2) {
    				updating_image_id = true;
    				sideeditor_changes.image_id = /*tmp_card*/ ctx[1].front_image_id;
    				add_flush_callback(() => updating_image_id = false);
    			}

    			sideeditor.$set(sideeditor_changes);

    			if (/*tmp_card*/ ctx[1].card_type != 'verses') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*tmp_card*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$4(ctx);
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

    			if (!updating_collection_tags && dirty & /*collection_tags*/ 1) {
    				updating_collection_tags = true;
    				tagseditor_changes.collection_tags = /*collection_tags*/ ctx[0];
    				add_flush_callback(() => updating_collection_tags = false);
    			}

    			if (!updating_card_1 && dirty & /*tmp_card*/ 2) {
    				updating_card_1 = true;
    				tagseditor_changes.card = /*tmp_card*/ ctx[1];
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Edit', slots, []);
    	let { collection_tags } = $$props;
    	let { card } = $$props;
    	let { card_edited_alert } = $$props;
    	let { state } = $$props;
    	let { cached_cards } = $$props;

    	let occlusion_data = {
    		box: { width: 500, height: 500 },
    		hide_all: true,
    		rectangles: []
    	};

    	onMount(async () => {
    		if (card.id != 0 && card.card_type === 'occlusion') {
    			$$invalidate(2, occlusion_data = await getOcclusionData(card.back_image_id));
    		}
    	});

    	let tmp_card = { ...card }; // copy into tmp card
    	const start_time = unix_seconds();

    	function preview() {
    		$$invalidate(9, state.preview_mode = true, state);
    		$$invalidate(9, state.card_to_preview = tmp_card, state);
    	}

    	function cancel() {
    		// if it was a new card (designated by id=0) we want to permanently delete it
    		if (card.id === 0) {
    			$$invalidate(7, card.visibility = 'purged', card);
    		}

    		$$invalidate(9, state['edit_mode'] = false, state);
    	}

    	async function save() {
    		const end_time = unix_seconds();
    		var elapsed = end_time - start_time;

    		// increment review_start time by the seconds we spend editing the card
    		// this will make the reviewing_time be less so that we don't
    		// double count the time as both editing and reviewing
    		$$invalidate(9, state.review_start = state.review_start + elapsed, state);

    		// copy over values from the tmp card
    		for (var key in tmp_card) {
    			$$invalidate(7, card[key] = tmp_card[key], card);
    		}

    		if (card.card_type === 'occlusion') {
    			// If it took 30 seconds to make 6 Img Occlusion cards I want
    			// to report this as 5 seconds per card so that I do not overcount
    			elapsed = elapsed / occlusion_data.rectangles.length;

    			//const siblings = // fetch_cardlist back_image_id===card.back_image_id (old)
    			// replace siblings with already cached_cards
    			// cached_cards.push (siblings where not already in cached_cards)
    			// occl_cards = siblings.
    			for (let rect of occlusion_data.rectangles) {
    				if (rect.deleted && rect.id != 0) {
    					// delete existing occlusion cards
    					// update the database via api
    					commit_changes({ id: rect.id, visibility: 'purged' });

    					// update cached_cards locally
    					const cached_card = cached_cards.find(elem => elem.id === rect.id);

    					cached_card.visibility = 'purged';
    				}

    				if (rect.id === 0 && !rect.deleted) {
    					// create new occlusion cards
    					let new_card = { ...card }; // copy existing occlusion card

    					new_card.id = random_id();
    					rect.id = new_card.id; // NB: We are building up occlusion data
    					cached_cards.push(new_card);

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
    				const cached_card = cached_cards.find(elem => elem.id === rect.id);

    				cached_card.back_image_id = media_id;
    			}

    			// finally if our original card was one of these we should push it
    			quit();
    		} else if (card.card_type === 'basic' || card.card_type === 'verses') {
    			// API call to save edits to the server
    			if (card.id === 0) {
    				$$invalidate(7, card.id = random_id(), card);
    				cached_cards.push(card);
    				$$invalidate(10, cached_cards);
    			}

    			commit_changes(card, elapsed);
    			quit();
    		}
    	}

    	function quit() {
    		$$invalidate(9, state.edit_mode = false, state);
    		$$invalidate(9, state.card_to_edit = null, state);
    		$$invalidate(8, card_edited_alert = true);
    	}

    	const writable_props = ['collection_tags', 'card', 'card_edited_alert', 'state', 'cached_cards'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Edit> was created with unknown prop '${key}'`);
    	});

    	function editheader_card_binding(value) {
    		tmp_card = value;
    		$$invalidate(1, tmp_card);
    	}

    	function imageoccluder_data_binding(value) {
    		occlusion_data = value;
    		$$invalidate(2, occlusion_data);
    	}

    	function imageoccluder_image_id_binding(value) {
    		if ($$self.$$.not_equal(tmp_card.front_image_id, value)) {
    			tmp_card.front_image_id = value;
    			$$invalidate(1, tmp_card);
    		}
    	}

    	function sideeditor_text_binding(value) {
    		if ($$self.$$.not_equal(tmp_card.front_text, value)) {
    			tmp_card.front_text = value;
    			$$invalidate(1, tmp_card);
    		}
    	}

    	function sideeditor_image_id_binding(value) {
    		if ($$self.$$.not_equal(tmp_card.front_image_id, value)) {
    			tmp_card.front_image_id = value;
    			$$invalidate(1, tmp_card);
    		}
    	}

    	function sideeditor_text_binding_1(value) {
    		if ($$self.$$.not_equal(tmp_card.back_text, value)) {
    			tmp_card.back_text = value;
    			$$invalidate(1, tmp_card);
    		}
    	}

    	function sideeditor_image_id_binding_1(value) {
    		if ($$self.$$.not_equal(tmp_card.back_image_id, value)) {
    			tmp_card.back_image_id = value;
    			$$invalidate(1, tmp_card);
    		}
    	}

    	function tagseditor_collection_tags_binding(value) {
    		collection_tags = value;
    		$$invalidate(0, collection_tags);
    	}

    	function tagseditor_card_binding(value) {
    		tmp_card = value;
    		$$invalidate(1, tmp_card);
    	}

    	$$self.$$set = $$props => {
    		if ('collection_tags' in $$props) $$invalidate(0, collection_tags = $$props.collection_tags);
    		if ('card' in $$props) $$invalidate(7, card = $$props.card);
    		if ('card_edited_alert' in $$props) $$invalidate(8, card_edited_alert = $$props.card_edited_alert);
    		if ('state' in $$props) $$invalidate(9, state = $$props.state);
    		if ('cached_cards' in $$props) $$invalidate(10, cached_cards = $$props.cached_cards);
    	};

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
    		collection_tags,
    		card,
    		card_edited_alert,
    		state,
    		cached_cards,
    		occlusion_data,
    		tmp_card,
    		start_time,
    		preview,
    		cancel,
    		save,
    		quit,
    		placeholder
    	});

    	$$self.$inject_state = $$props => {
    		if ('collection_tags' in $$props) $$invalidate(0, collection_tags = $$props.collection_tags);
    		if ('card' in $$props) $$invalidate(7, card = $$props.card);
    		if ('card_edited_alert' in $$props) $$invalidate(8, card_edited_alert = $$props.card_edited_alert);
    		if ('state' in $$props) $$invalidate(9, state = $$props.state);
    		if ('cached_cards' in $$props) $$invalidate(10, cached_cards = $$props.cached_cards);
    		if ('occlusion_data' in $$props) $$invalidate(2, occlusion_data = $$props.occlusion_data);
    		if ('tmp_card' in $$props) $$invalidate(1, tmp_card = $$props.tmp_card);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*tmp_card*/ 2) {
    			$$invalidate(3, placeholder = get_placeholder(tmp_card.card_type));
    		}
    	};

    	return [
    		collection_tags,
    		tmp_card,
    		occlusion_data,
    		placeholder,
    		preview,
    		cancel,
    		save,
    		card,
    		card_edited_alert,
    		state,
    		cached_cards,
    		editheader_card_binding,
    		imageoccluder_data_binding,
    		imageoccluder_image_id_binding,
    		sideeditor_text_binding,
    		sideeditor_image_id_binding,
    		sideeditor_text_binding_1,
    		sideeditor_image_id_binding_1,
    		tagseditor_collection_tags_binding,
    		tagseditor_card_binding
    	];
    }

    class Edit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			collection_tags: 0,
    			card: 7,
    			card_edited_alert: 8,
    			state: 9,
    			cached_cards: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edit",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*collection_tags*/ ctx[0] === undefined && !('collection_tags' in props)) {
    			console.warn("<Edit> was created without expected prop 'collection_tags'");
    		}

    		if (/*card*/ ctx[7] === undefined && !('card' in props)) {
    			console.warn("<Edit> was created without expected prop 'card'");
    		}

    		if (/*card_edited_alert*/ ctx[8] === undefined && !('card_edited_alert' in props)) {
    			console.warn("<Edit> was created without expected prop 'card_edited_alert'");
    		}

    		if (/*state*/ ctx[9] === undefined && !('state' in props)) {
    			console.warn("<Edit> was created without expected prop 'state'");
    		}

    		if (/*cached_cards*/ ctx[10] === undefined && !('cached_cards' in props)) {
    			console.warn("<Edit> was created without expected prop 'cached_cards'");
    		}
    	}

    	get collection_tags() {
    		throw new Error("<Edit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collection_tags(value) {
    		throw new Error("<Edit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card() {
    		throw new Error("<Edit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Edit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card_edited_alert() {
    		throw new Error("<Edit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card_edited_alert(value) {
    		throw new Error("<Edit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Edit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Edit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cached_cards() {
    		throw new Error("<Edit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cached_cards(value) {
    		throw new Error("<Edit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
    function create_else_block$1(ctx) {
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(29:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:0) {#if occlusion_data}
    function create_if_block$3(ctx) {
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(15:0) {#if occlusion_data}",
    		ctx
    	});

    	return block;
    }

    // (18:10) {#if !rect.deleted}
    function create_if_block_1$2(ctx) {
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(18:10) {#if !rect.deleted}",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#each occlusion_data.rectangles as rect}
    function create_each_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = !/*rect*/ ctx[5].deleted && create_if_block_1$2(ctx);

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
    					if_block = create_if_block_1$2(ctx);
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
    		if (/*occlusion_data*/ ctx[2]) return create_if_block$3;
    		return create_else_block$1;
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
    	child_ctx[28] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[31] = list[i][0];
    	child_ctx[32] = list[i][1];
    	return child_ctx;
    }

    // (128:8) {#if hypo_due_dates}
    function create_if_block_5(ctx) {
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
    			if (dirty[0] & /*grade, hypo_due_dates, current_time*/ 67648) {
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
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(128:8) {#if hypo_due_dates}",
    		ctx
    	});

    	return block;
    }

    // (129:1) {#each [['again',1], ['hard',2], ['good',3], ['easy',4]] as [grade_val, num]}
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
    	let t6_value = Math.floor(/*hypo_due_dates*/ ctx[6][/*grade_val*/ ctx[31]]) - Math.floor(/*current_time*/ ctx[11]) + "";
    	let t6;
    	let t7;
    	let t8;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[22](/*grade_val*/ ctx[31]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(/*grade_val*/ ctx[31]);
    			t1 = text(" (");
    			t2 = text(/*num*/ ctx[32]);
    			t3 = text(")");
    			br = element("br");
    			t4 = space();
    			span = element("span");
    			t5 = text("+");
    			t6 = text(t6_value);
    			t7 = text(" days");
    			t8 = space();
    			add_location(br, file$2, 130, 22, 4822);
    			set_style(span, "font-size", "12px");
    			add_location(span, file$2, 131, 24, 4851);
    			attr_dev(button, "class", "grade_button svelte-wypxki");
    			add_location(button, file$2, 129, 16, 4720);
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
    			if (dirty[0] & /*hypo_due_dates*/ 64 && t6_value !== (t6_value = Math.floor(/*hypo_due_dates*/ ctx[6][/*grade_val*/ ctx[31]]) - Math.floor(/*current_time*/ ctx[11]) + "")) set_data_dev(t6, t6_value);
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
    		source: "(129:1) {#each [['again',1], ['hard',2], ['good',3], ['easy',4]] as [grade_val, num]}",
    		ctx
    	});

    	return block;
    }

    // (141:36) 
    function create_if_block_4(ctx) {
    	let each_1_anchor;
    	let each_value = /*verses_lines*/ ctx[12].slice(0, /*verses_line_no*/ ctx[5]);
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
    			if (dirty[0] & /*verses_lines, verses_line_no*/ 4128) {
    				each_value = /*verses_lines*/ ctx[12].slice(0, /*verses_line_no*/ ctx[5]);
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(141:36) ",
    		ctx
    	});

    	return block;
    }

    // (139:0) {#if card.card_type==='basic' || preview}
    function create_if_block_3$1(ctx) {
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
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(139:0) {#if card.card_type==='basic' || preview}",
    		ctx
    	});

    	return block;
    }

    // (142:2) {#each verses_lines.slice(0,verses_line_no) as line}
    function create_each_block(ctx) {
    	let t_value = /*line*/ ctx[28] + "";
    	let t;
    	let br;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    			br = element("br");
    			add_location(br, file$2, 142, 16, 5210);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*verses_line_no*/ 32 && t_value !== (t_value = /*line*/ ctx[28] + "")) set_data_dev(t, t_value);
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
    		source: "(142:2) {#each verses_lines.slice(0,verses_line_no) as line}",
    		ctx
    	});

    	return block;
    }

    // (161:0) {#if card.back_image_id!=0 && flipped && !card.card_type==='occlusion'}
    function create_if_block_2$1(ctx) {
    	let center;
    	let img;

    	const block = {
    		c: function create() {
    			center = element("center");
    			img = element("img");
    			attr_dev(img, "class", "svelte-wypxki");
    			add_location(img, file$2, 161, 16, 5695);
    			add_location(center, file$2, 161, 8, 5687);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, img);
    			/*img_binding*/ ctx[23](img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			/*img_binding*/ ctx[23](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(161:0) {#if card.back_image_id!=0 && flipped && !card.card_type==='occlusion'}",
    		ctx
    	});

    	return block;
    }

    // (164:0) {#if card.front_image_id!=0 && (card.back_image_id===0 || preview || !flipped) && !card.card_type==='occlusion'}
    function create_if_block_1$1(ctx) {
    	let center;
    	let img;

    	const block = {
    		c: function create() {
    			center = element("center");
    			img = element("img");
    			attr_dev(img, "class", "svelte-wypxki");
    			add_location(img, file$2, 164, 16, 5868);
    			add_location(center, file$2, 164, 8, 5860);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, img);
    			/*img_binding_1*/ ctx[24](img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			/*img_binding_1*/ ctx[24](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(164:0) {#if card.front_image_id!=0 && (card.back_image_id===0 || preview || !flipped) && !card.card_type==='occlusion'}",
    		ctx
    	});

    	return block;
    }

    // (169:0) {#if card.card_type==='occlusion' && card.front_image_id}
    function create_if_block$2(ctx) {
    	let occlusionreviewer;
    	let updating_card;
    	let updating_flipped;
    	let current;

    	function occlusionreviewer_card_binding(value) {
    		/*occlusionreviewer_card_binding*/ ctx[25](value);
    	}

    	function occlusionreviewer_flipped_binding(value) {
    		/*occlusionreviewer_flipped_binding*/ ctx[26](value);
    	}

    	let occlusionreviewer_props = {};

    	if (/*card*/ ctx[0] !== void 0) {
    		occlusionreviewer_props.card = /*card*/ ctx[0];
    	}

    	if (/*flipped*/ ctx[2] !== void 0) {
    		occlusionreviewer_props.flipped = /*flipped*/ ctx[2];
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

    			if (!updating_flipped && dirty[0] & /*flipped*/ 4) {
    				updating_flipped = true;
    				occlusionreviewer_changes.flipped = /*flipped*/ ctx[2];
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(169:0) {#if card.card_type==='occlusion' && card.front_image_id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let body;
    	let div2;
    	let div0;
    	let button0;
    	let t0;
    	let u0;
    	let t2;
    	let t3;
    	let button1;
    	let t4;
    	let html_tag;
    	let raw0_value = (/*preview*/ ctx[1] ? '<u>b</u>ack' : '<u>q</u>uit') + "";
    	let t5;
    	let button2;
    	let t6;
    	let u1;
    	let t8;
    	let t9;
    	let div1;
    	let t10;
    	let t11;
    	let br0;
    	let br1;
    	let t12;
    	let button3;

    	let t13_value = (/*card*/ ctx[0].card_type === 'verses'
    	? 'Next Line'
    	: 'Flip') + "";

    	let t13;
    	let br2;
    	let t14;
    	let span;
    	let t16;
    	let div3;
    	let br3;
    	let t17;
    	let html_tag_1;
    	let raw1_value = /*card*/ ctx[0].back_text.replace('\n', '<br>') + "";
    	let t18;
    	let t19_value = /*card*/ ctx[0].tags + "";
    	let t19;
    	let t20;
    	let hr;
    	let t21;
    	let t22;
    	let t23;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*hypo_due_dates*/ ctx[6] && create_if_block_5(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*card*/ ctx[0].card_type === 'basic' || /*preview*/ ctx[1]) return create_if_block_3$1;
    		if (/*card*/ ctx[0].card_type === 'verses') return create_if_block_4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);
    	let if_block2 = /*card*/ ctx[0].back_image_id != 0 && /*flipped*/ ctx[2] && !/*card*/ ctx[0].card_type === 'occlusion' && create_if_block_2$1(ctx);
    	let if_block3 = /*card*/ ctx[0].front_image_id != 0 && (/*card*/ ctx[0].back_image_id === 0 || /*preview*/ ctx[1] || !/*flipped*/ ctx[2]) && !/*card*/ ctx[0].card_type === 'occlusion' && create_if_block_1$1(ctx);
    	let if_block4 = /*card*/ ctx[0].card_type === 'occlusion' && /*card*/ ctx[0].front_image_id && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			body = element("body");
    			div2 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			t0 = text("✍ ");
    			u0 = element("u");
    			u0.textContent = "e";
    			t2 = text("dit");
    			t3 = space();
    			button1 = element("button");
    			t4 = text("⏎ ");
    			html_tag = new HtmlTag(false);
    			t5 = space();
    			button2 = element("button");
    			t6 = text("✕ ");
    			u1 = element("u");
    			u1.textContent = "d";
    			t8 = text("elete");
    			t9 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t10 = space();
    			if (if_block1) if_block1.c();
    			t11 = space();
    			br0 = element("br");
    			br1 = element("br");
    			t12 = space();
    			button3 = element("button");
    			t13 = text(t13_value);
    			br2 = element("br");
    			t14 = space();
    			span = element("span");
    			span.textContent = "(click anywhere)";
    			t16 = space();
    			div3 = element("div");
    			br3 = element("br");
    			t17 = space();
    			html_tag_1 = new HtmlTag(false);
    			t18 = space();
    			t19 = text(t19_value);
    			t20 = space();
    			hr = element("hr");
    			t21 = space();
    			if (if_block2) if_block2.c();
    			t22 = space();
    			if (if_block3) if_block3.c();
    			t23 = space();
    			if (if_block4) if_block4.c();
    			add_location(u0, file$2, 121, 48, 4314);
    			attr_dev(button0, "class", "manage_button svelte-wypxki");
    			add_location(button0, file$2, 121, 0, 4266);
    			html_tag.a = null;
    			attr_dev(button1, "class", "manage_button svelte-wypxki");
    			add_location(button1, file$2, 122, 0, 4335);
    			add_location(u1, file$2, 123, 55, 4495);
    			attr_dev(button2, "class", "manage_button svelte-wypxki");
    			add_location(button2, file$2, 123, 0, 4440);
    			set_style(div0, "display", /*manage_buttons_display*/ ctx[7]);
    			attr_dev(div0, "id", "manage_buttons_bar");
    			attr_dev(div0, "class", "svelte-wypxki");
    			add_location(div0, file$2, 120, 0, 4194);
    			set_style(div1, "display", /*grade_buttons_display*/ ctx[8]);
    			attr_dev(div1, "id", "grade_buttons_bar");
    			attr_dev(div1, "class", "svelte-wypxki");
    			add_location(div1, file$2, 126, 0, 4526);
    			attr_dev(div2, "id", "buttons_bar");
    			attr_dev(div2, "class", "svelte-wypxki");
    			add_location(div2, file$2, 119, 0, 4171);
    			add_location(br0, file$2, 146, 0, 5232);
    			add_location(br1, file$2, 146, 4, 5236);
    			add_location(br2, file$2, 148, 58, 5403);
    			set_style(span, "font-size", "14px");
    			add_location(span, file$2, 149, 1, 5409);
    			attr_dev(button3, "id", "flipper");
    			attr_dev(button3, "type", "button");
    			set_style(button3, "display", /*flipper_button_display*/ ctx[9]);
    			button3.autofocus = true;
    			attr_dev(button3, "class", "svelte-wypxki");
    			add_location(button3, file$2, 147, 0, 5241);
    			add_location(br3, file$2, 153, 1, 5532);
    			html_tag_1.a = null;
    			attr_dev(div3, "id", "backside");
    			set_style(div3, "display", /*display_back_text*/ ctx[10]);
    			add_location(div3, file$2, 152, 0, 5474);
    			add_location(hr, file$2, 158, 0, 5601);
    			attr_dev(body, "class", "svelte-wypxki");
    			add_location(body, file$2, 117, 0, 4137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div2);
    			append_dev(div2, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t0);
    			append_dev(button0, u0);
    			append_dev(button0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(button1, t4);
    			html_tag.m(raw0_value, button1);
    			append_dev(div0, t5);
    			append_dev(div0, button2);
    			append_dev(button2, t6);
    			append_dev(button2, u1);
    			append_dev(button2, t8);
    			append_dev(div2, t9);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(body, t10);
    			if (if_block1) if_block1.m(body, null);
    			append_dev(body, t11);
    			append_dev(body, br0);
    			append_dev(body, br1);
    			append_dev(body, t12);
    			append_dev(body, button3);
    			append_dev(button3, t13);
    			append_dev(button3, br2);
    			append_dev(button3, t14);
    			append_dev(button3, span);
    			append_dev(body, t16);
    			append_dev(body, div3);
    			append_dev(div3, br3);
    			append_dev(div3, t17);
    			html_tag_1.m(raw1_value, div3);
    			append_dev(body, t18);
    			append_dev(body, t19);
    			append_dev(body, t20);
    			append_dev(body, hr);
    			append_dev(body, t21);
    			if (if_block2) if_block2.m(body, null);
    			append_dev(body, t22);
    			if (if_block3) if_block3.m(body, null);
    			append_dev(body, t23);
    			if (if_block4) if_block4.m(body, null);
    			current = true;
    			button3.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handleKeydown*/ ctx[19], false, false, false),
    					listen_dev(button0, "click", /*edit*/ ctx[15], false, false, false),
    					listen_dev(button1, "click", /*quit*/ ctx[14], false, false, false),
    					listen_dev(button2, "click", /*delete_card*/ ctx[13], false, false, false),
    					listen_dev(button3, "click", /*flip*/ ctx[17], false, false, false),
    					listen_dev(body, "click", /*default_action*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*preview*/ 2) && raw0_value !== (raw0_value = (/*preview*/ ctx[1] ? '<u>b</u>ack' : '<u>q</u>uit') + "")) html_tag.p(raw0_value);

    			if (!current || dirty[0] & /*manage_buttons_display*/ 128) {
    				set_style(div0, "display", /*manage_buttons_display*/ ctx[7]);
    			}

    			if (/*hypo_due_dates*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!current || dirty[0] & /*grade_buttons_display*/ 256) {
    				set_style(div1, "display", /*grade_buttons_display*/ ctx[8]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(body, t11);
    				}
    			}

    			if ((!current || dirty[0] & /*card*/ 1) && t13_value !== (t13_value = (/*card*/ ctx[0].card_type === 'verses'
    			? 'Next Line'
    			: 'Flip') + "")) set_data_dev(t13, t13_value);

    			if (!current || dirty[0] & /*flipper_button_display*/ 512) {
    				set_style(button3, "display", /*flipper_button_display*/ ctx[9]);
    			}

    			if ((!current || dirty[0] & /*card*/ 1) && raw1_value !== (raw1_value = /*card*/ ctx[0].back_text.replace('\n', '<br>') + "")) html_tag_1.p(raw1_value);

    			if (!current || dirty[0] & /*display_back_text*/ 1024) {
    				set_style(div3, "display", /*display_back_text*/ ctx[10]);
    			}

    			if ((!current || dirty[0] & /*card*/ 1) && t19_value !== (t19_value = /*card*/ ctx[0].tags + "")) set_data_dev(t19, t19_value);

    			if (/*card*/ ctx[0].back_image_id != 0 && /*flipped*/ ctx[2] && !/*card*/ ctx[0].card_type === 'occlusion') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$1(ctx);
    					if_block2.c();
    					if_block2.m(body, t22);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*card*/ ctx[0].front_image_id != 0 && (/*card*/ ctx[0].back_image_id === 0 || /*preview*/ ctx[1] || !/*flipped*/ ctx[2]) && !/*card*/ ctx[0].card_type === 'occlusion') {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$1(ctx);
    					if_block3.c();
    					if_block3.m(body, t23);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*card*/ ctx[0].card_type === 'occlusion' && /*card*/ ctx[0].front_image_id) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*card*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block$2(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(body, null);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block4);
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
    	let display_back_text;
    	let flipper_button_display;
    	let grade_buttons_display;
    	let manage_buttons_display;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Review', slots, []);
    	let { card } = $$props;
    	let { preview = false } = $$props;
    	let { state } = $$props;
    	let { card_edited_alert } = $$props;
    	let current_time = local_unix_day();
    	let review_stop;
    	let back_img;
    	let front_img;
    	let flipped = preview; //we are done clicking and should see the grading buttons
    	let verses_line_no = 1;
    	let verses_lines = card.front_text.split('\n');
    	let hypo_due_dates = { again: 0, hard: 10, good: 15, easy: 25 };

    	onMount(async () => {
    		$$invalidate(6, hypo_due_dates = await hypothetical_due_dates(card.id, current_time));
    		$$invalidate(20, state.review_start = unix_seconds(), state);

    		if (card.front_image_id != 0) {
    			const image_url = await getProtectedImage(card.front_image_id);
    			$$invalidate(4, front_img.src = image_url, front_img);
    		}

    		if (card.back_image_id != 0 && card.card_type != 'occlusion') {
    			$$invalidate(3, back_img.src = await getProtectedImage(card.back_image_id), back_img);
    		}
    	});

    	function delete_card() {
    		$$invalidate(0, card.visibility = 'deleted', card);
    		commit_changes(card);
    		$$invalidate(21, card_edited_alert = true);
    		quit();
    	}

    	function quit() {
    		if (state.preview_mode) {
    			$$invalidate(20, state.preview_mode = false, state);
    			$$invalidate(20, state.card_to_preview = null, state);
    		} else {
    			$$invalidate(20, state.reviewing = false, state);
    			$$invalidate(20, state.card_to_review = null, state);
    		}
    	}

    	function edit() {
    		$$invalidate(20, state.edit_mode = true, state);
    		$$invalidate(20, state.card_to_edit = card, state);

    		if (state.preview_mode) {
    			quit();
    		}
    	}

    	async function grade(grade) {
    		// postpone the card while we figure out what the
    		// real due date is. This lets the reviewer continue
    		// to the next card while we figure it out.
    		$$invalidate(0, card.due_date = current_time + 1, card);

    		review_stop = unix_seconds();
    		var elapsed = review_stop - state.review_start;
    		await commit_grade(card.id, grade, elapsed);
    		$$invalidate(0, card.due_date = hypo_due_dates[grade], card);
    		await commit_changes(card);

    		// TODO set the due_date equal to the hypothetical and push to the server
    		$$invalidate(20, state.card_to_review = null, state);

    		$$invalidate(2, flipped = false);
    	}

    	function flip() {
    		if (card.card_type === 'basic' || card.card_type === 'occlusion') {
    			$$invalidate(2, flipped = true);
    		} else if (card.card_type === 'verses') {
    			$$invalidate(5, verses_line_no++, verses_line_no);
    			$$invalidate(2, flipped = verses_line_no === verses_lines.length);
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

    	const writable_props = ['card', 'preview', 'state', 'card_edited_alert'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Review> was created with unknown prop '${key}'`);
    	});

    	const click_handler = grade_val => grade(grade_val);

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			back_img = $$value;
    			$$invalidate(3, back_img);
    		});
    	}

    	function img_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			front_img = $$value;
    			$$invalidate(4, front_img);
    		});
    	}

    	function occlusionreviewer_card_binding(value) {
    		card = value;
    		$$invalidate(0, card);
    	}

    	function occlusionreviewer_flipped_binding(value) {
    		flipped = value;
    		$$invalidate(2, flipped);
    	}

    	$$self.$$set = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('preview' in $$props) $$invalidate(1, preview = $$props.preview);
    		if ('state' in $$props) $$invalidate(20, state = $$props.state);
    		if ('card_edited_alert' in $$props) $$invalidate(21, card_edited_alert = $$props.card_edited_alert);
    	};

    	$$self.$capture_state = () => ({
    		OcclusionReviewer: Occlusion_reviewer,
    		onMount,
    		unix_seconds,
    		local_unix_day,
    		dummy_card,
    		hypothetical_due_dates,
    		commit_grade,
    		commit_changes,
    		getProtectedImage,
    		card,
    		preview,
    		state,
    		card_edited_alert,
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
    		manage_buttons_display,
    		grade_buttons_display,
    		flipper_button_display,
    		display_back_text
    	});

    	$$self.$inject_state = $$props => {
    		if ('card' in $$props) $$invalidate(0, card = $$props.card);
    		if ('preview' in $$props) $$invalidate(1, preview = $$props.preview);
    		if ('state' in $$props) $$invalidate(20, state = $$props.state);
    		if ('card_edited_alert' in $$props) $$invalidate(21, card_edited_alert = $$props.card_edited_alert);
    		if ('current_time' in $$props) $$invalidate(11, current_time = $$props.current_time);
    		if ('review_stop' in $$props) review_stop = $$props.review_stop;
    		if ('back_img' in $$props) $$invalidate(3, back_img = $$props.back_img);
    		if ('front_img' in $$props) $$invalidate(4, front_img = $$props.front_img);
    		if ('flipped' in $$props) $$invalidate(2, flipped = $$props.flipped);
    		if ('verses_line_no' in $$props) $$invalidate(5, verses_line_no = $$props.verses_line_no);
    		if ('verses_lines' in $$props) $$invalidate(12, verses_lines = $$props.verses_lines);
    		if ('hypo_due_dates' in $$props) $$invalidate(6, hypo_due_dates = $$props.hypo_due_dates);
    		if ('manage_buttons_display' in $$props) $$invalidate(7, manage_buttons_display = $$props.manage_buttons_display);
    		if ('grade_buttons_display' in $$props) $$invalidate(8, grade_buttons_display = $$props.grade_buttons_display);
    		if ('flipper_button_display' in $$props) $$invalidate(9, flipper_button_display = $$props.flipper_button_display);
    		if ('display_back_text' in $$props) $$invalidate(10, display_back_text = $$props.display_back_text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*card, flipped*/ 5) {
    			$$invalidate(10, display_back_text = card.card_type != 'verses' && flipped ? 'block' : 'none');
    		}

    		if ($$self.$$.dirty[0] & /*flipped*/ 4) {
    			$$invalidate(9, flipper_button_display = flipped ? 'none' : 'block');
    		}

    		if ($$self.$$.dirty[0] & /*flipped, preview*/ 6) {
    			$$invalidate(8, grade_buttons_display = flipped && !preview ? 'grid' : 'none');
    		}

    		if ($$self.$$.dirty[0] & /*flipped*/ 4) {
    			$$invalidate(7, manage_buttons_display = flipped ? 'grid' : 'none');
    		}
    	};

    	return [
    		card,
    		preview,
    		flipped,
    		back_img,
    		front_img,
    		verses_line_no,
    		hypo_due_dates,
    		manage_buttons_display,
    		grade_buttons_display,
    		flipper_button_display,
    		display_back_text,
    		current_time,
    		verses_lines,
    		delete_card,
    		quit,
    		edit,
    		grade,
    		flip,
    		default_action,
    		handleKeydown,
    		state,
    		card_edited_alert,
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

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				card: 0,
    				preview: 1,
    				state: 20,
    				card_edited_alert: 21
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Review",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*card*/ ctx[0] === undefined && !('card' in props)) {
    			console.warn("<Review> was created without expected prop 'card'");
    		}

    		if (/*state*/ ctx[20] === undefined && !('state' in props)) {
    			console.warn("<Review> was created without expected prop 'state'");
    		}

    		if (/*card_edited_alert*/ ctx[21] === undefined && !('card_edited_alert' in props)) {
    			console.warn("<Review> was created without expected prop 'card_edited_alert'");
    		}
    	}

    	get card() {
    		throw new Error("<Review>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Review>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preview() {
    		throw new Error("<Review>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preview(value) {
    		throw new Error("<Review>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Review>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Review>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card_edited_alert() {
    		throw new Error("<Review>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card_edited_alert(value) {
    		throw new Error("<Review>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/login.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/login.svelte";

    // (53:0) {#if register_or_login==='login' && failed_login}
    function create_if_block$1(ctx) {
    	let center;

    	const block = {
    		c: function create() {
    			center = element("center");
    			center.textContent = "Incorrect Password";
    			set_style(center, "color", "darkred");
    			add_location(center, file$1, 52, 49, 2225);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(53:0) {#if register_or_login==='login' && failed_login}",
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
    	let if_block = /*register_or_login*/ ctx[3] === 'login' && /*failed_login*/ ctx[8] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			body = element("body");
    			t0 = text(/*warning*/ ctx[6]);
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
    			add_location(input0, file$1, 50, 0, 1958);
    			attr_dev(input1, "class", "entry svelte-1dlq1ng");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "placeholder", "Password");
    			add_location(input1, file$1, 51, 0, 2068);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "rol");
    			input2.__value = "login";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[19][0].push(input2);
    			add_location(input2, file$1, 55, 8, 2321);
    			attr_dev(label0, "class", "svelte-1dlq1ng");
    			add_location(label0, file$1, 55, 1, 2314);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "rol");
    			input3.__value = "register";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[19][0].push(input3);
    			add_location(input3, file$1, 56, 8, 2420);
    			attr_dev(label1, "class", "svelte-1dlq1ng");
    			add_location(label1, file$1, 56, 1, 2413);
    			attr_dev(input4, "type", "submit");
    			input4.value = /*register_or_login*/ ctx[3];
    			input4.disabled = input4_disabled_value = !/*submit_possible*/ ctx[7];
    			set_style(input4, "border", /*submit_possible*/ ctx[7] ? '1px solid black' : '', false);
    			add_location(input4, file$1, 57, 8, 2525);
    			attr_dev(div, "id", "bottom_row");
    			attr_dev(div, "class", "svelte-1dlq1ng");
    			add_location(div, file$1, 54, 0, 2291);
    			add_location(br, file$1, 59, 0, 2682);
    			attr_dev(button, "type", "button");
    			add_location(button, file$1, 59, 12, 2694);
    			add_location(center, file$1, 59, 4, 2686);
    			attr_dev(body, "class", "svelte-1dlq1ng");
    			add_location(body, file$1, 48, 0, 1941);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, t0);
    			append_dev(body, t1);
    			append_dev(body, input0);
    			/*input0_binding*/ ctx[14](input0);
    			set_input_value(input0, /*typed_username*/ ctx[1]);
    			append_dev(body, t2);
    			append_dev(body, input1);
    			/*input1_binding*/ ctx[16](input1);
    			set_input_value(input1, /*password*/ ctx[2]);
    			append_dev(body, t3);
    			if (if_block) if_block.m(body, null);
    			append_dev(body, t4);
    			append_dev(body, div);
    			append_dev(div, label0);
    			append_dev(label0, input2);
    			input2.checked = input2.__value === /*register_or_login*/ ctx[3];
    			append_dev(label0, t5);
    			append_dev(div, t6);
    			append_dev(div, label1);
    			append_dev(label1, input3);
    			input3.checked = input3.__value === /*register_or_login*/ ctx[3];
    			append_dev(label1, t7);
    			append_dev(div, t8);
    			append_dev(div, input4);
    			append_dev(body, t9);
    			append_dev(body, br);
    			append_dev(body, center);
    			append_dev(center, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[17]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[18]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[20]),
    					listen_dev(input4, "click", /*submit*/ ctx[9], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*warning*/ 64) set_data_dev(t0, /*warning*/ ctx[6]);

    			if (dirty & /*typed_username*/ 2 && input0.value !== /*typed_username*/ ctx[1]) {
    				set_input_value(input0, /*typed_username*/ ctx[1]);
    			}

    			if (dirty & /*password*/ 4 && input1.value !== /*password*/ ctx[2]) {
    				set_input_value(input1, /*password*/ ctx[2]);
    			}

    			if (/*register_or_login*/ ctx[3] === 'login' && /*failed_login*/ ctx[8]) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(body, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*register_or_login*/ 8) {
    				input2.checked = input2.__value === /*register_or_login*/ ctx[3];
    			}

    			if (dirty & /*register_or_login*/ 8) {
    				input3.checked = input3.__value === /*register_or_login*/ ctx[3];
    			}

    			if (dirty & /*register_or_login*/ 8) {
    				prop_dev(input4, "value", /*register_or_login*/ ctx[3]);
    			}

    			if (dirty & /*submit_possible*/ 128 && input4_disabled_value !== (input4_disabled_value = !/*submit_possible*/ ctx[7])) {
    				prop_dev(input4, "disabled", input4_disabled_value);
    			}

    			if (dirty & /*submit_possible*/ 128) {
    				set_style(input4, "border", /*submit_possible*/ ctx[7] ? '1px solid black' : '', false);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			/*input0_binding*/ ctx[14](null);
    			/*input1_binding*/ ctx[16](null);
    			if (if_block) if_block.d();
    			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input2), 1);
    			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input3), 1);
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
    	let { username } = $$props;
    	let users = [];
    	let typed_username = '';
    	let password = '';
    	let register_or_login = 'login';
    	let failed_login = false;
    	let password_box;
    	let username_box;

    	onMount(async () => {
    		$$invalidate(10, users = await get_users_list());
    		username_box.focus();
    	});

    	async function login() {
    		const success = await get_token(typed_username, password);

    		if (success) {
    			$$invalidate(0, username = typed_username);
    		} else {
    			//failed_login = 'incorrect password';
    			$$invalidate(2, password = '');

    			password_box.focus();
    		}
    	}

    	async function register() {
    		const success = await register_and_get_token(typed_username, password);

    		if (success) {
    			$$invalidate(0, username = typed_username);
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

    	const writable_props = ['username'];

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
    		$$invalidate(1, typed_username);
    	}

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			password_box = $$value;
    			$$invalidate(4, password_box);
    		});
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(2, password);
    	}

    	function input2_change_handler() {
    		register_or_login = this.__value;
    		$$invalidate(3, register_or_login);
    	}

    	function input3_change_handler() {
    		register_or_login = this.__value;
    		$$invalidate(3, register_or_login);
    	}

    	const click_handler = () => {
    		$$invalidate(0, username = 'guest');
    	};

    	$$self.$$set = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
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
    		user_exists,
    		warning,
    		register_possible,
    		login_possible,
    		submit_possible
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('users' in $$props) $$invalidate(10, users = $$props.users);
    		if ('typed_username' in $$props) $$invalidate(1, typed_username = $$props.typed_username);
    		if ('password' in $$props) $$invalidate(2, password = $$props.password);
    		if ('register_or_login' in $$props) $$invalidate(3, register_or_login = $$props.register_or_login);
    		if ('failed_login' in $$props) $$invalidate(8, failed_login = $$props.failed_login);
    		if ('password_box' in $$props) $$invalidate(4, password_box = $$props.password_box);
    		if ('username_box' in $$props) $$invalidate(5, username_box = $$props.username_box);
    		if ('user_exists' in $$props) $$invalidate(11, user_exists = $$props.user_exists);
    		if ('warning' in $$props) $$invalidate(6, warning = $$props.warning);
    		if ('register_possible' in $$props) $$invalidate(12, register_possible = $$props.register_possible);
    		if ('login_possible' in $$props) $$invalidate(13, login_possible = $$props.login_possible);
    		if ('submit_possible' in $$props) $$invalidate(7, submit_possible = $$props.submit_possible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*users, typed_username*/ 1026) {
    			$$invalidate(11, user_exists = users.includes(typed_username));
    		}

    		if ($$self.$$.dirty & /*user_exists, password*/ 2052) {
    			$$invalidate(13, login_possible = user_exists && password.length > 2);
    		}

    		if ($$self.$$.dirty & /*user_exists, typed_username, password*/ 2054) {
    			$$invalidate(12, register_possible = !user_exists && typed_username.length > 2 && password.length > 2);
    		}

    		if ($$self.$$.dirty & /*register_or_login, login_possible, register_possible*/ 12296) {
    			$$invalidate(7, submit_possible = register_or_login === 'login' && login_possible || register_or_login === 'register' && register_possible);
    		}

    		if ($$self.$$.dirty & /*register_or_login, user_exists, typed_username*/ 2058) {
    			$$invalidate(6, warning = ("user does not exist!").repeat(register_or_login === 'login' && !user_exists && typed_username.length > 2) + ("username is already taken!").repeat(register_or_login === 'register' && user_exists && typed_username.length > 2));
    		}
    	};

    	return [
    		username,
    		typed_username,
    		password,
    		register_or_login,
    		password_box,
    		username_box,
    		warning,
    		submit_possible,
    		failed_login,
    		submit,
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
    		click_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { username: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*username*/ ctx[0] === undefined && !('username' in props)) {
    			console.warn("<Login> was created without expected prop 'username'");
    		}
    	}

    	get username() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set username(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */
    const file = "src/App.svelte";

    // (106:0) {:else}
    function create_else_block(ctx) {
    	let t0;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let home;
    	let updating_sort;
    	let updating_collection_tags;
    	let updating_card_edited_alert;
    	let updating_due_count;
    	let updating_created_count;
    	let updating_username;
    	let updating_filters;
    	let updating_state;
    	let updating_filtered_cards;
    	let updating_cached_cards;
    	let updating_info;
    	let current;
    	let if_block0 = /*state*/ ctx[4].preview_mode && /*state*/ ctx[4].card_to_preview && create_if_block_3(ctx);
    	let if_block1 = /*state*/ ctx[4].edit_mode && /*state*/ ctx[4].card_to_edit && create_if_block_2(ctx);
    	let if_block2 = /*state*/ ctx[4].reviewing && /*state*/ ctx[4].card_to_review != null && create_if_block_1(ctx);

    	function home_sort_binding(value) {
    		/*home_sort_binding*/ ctx[25](value);
    	}

    	function home_collection_tags_binding(value) {
    		/*home_collection_tags_binding*/ ctx[26](value);
    	}

    	function home_card_edited_alert_binding(value) {
    		/*home_card_edited_alert_binding*/ ctx[27](value);
    	}

    	function home_due_count_binding(value) {
    		/*home_due_count_binding*/ ctx[28](value);
    	}

    	function home_created_count_binding(value) {
    		/*home_created_count_binding*/ ctx[29](value);
    	}

    	function home_username_binding(value) {
    		/*home_username_binding*/ ctx[30](value);
    	}

    	function home_filters_binding(value) {
    		/*home_filters_binding*/ ctx[31](value);
    	}

    	function home_state_binding(value) {
    		/*home_state_binding*/ ctx[32](value);
    	}

    	function home_filtered_cards_binding(value) {
    		/*home_filtered_cards_binding*/ ctx[33](value);
    	}

    	function home_cached_cards_binding(value) {
    		/*home_cached_cards_binding*/ ctx[34](value);
    	}

    	function home_info_binding(value) {
    		/*home_info_binding*/ ctx[35](value);
    	}

    	let home_props = {};

    	if (/*sort*/ ctx[6] !== void 0) {
    		home_props.sort = /*sort*/ ctx[6];
    	}

    	if (/*collection_tags*/ ctx[7] !== void 0) {
    		home_props.collection_tags = /*collection_tags*/ ctx[7];
    	}

    	if (/*card_edited_alert*/ ctx[2] !== void 0) {
    		home_props.card_edited_alert = /*card_edited_alert*/ ctx[2];
    	}

    	if (/*due_count*/ ctx[9] !== void 0) {
    		home_props.due_count = /*due_count*/ ctx[9];
    	}

    	if (/*created_count*/ ctx[10] !== void 0) {
    		home_props.created_count = /*created_count*/ ctx[10];
    	}

    	if (/*username*/ ctx[3] !== void 0) {
    		home_props.username = /*username*/ ctx[3];
    	}

    	if (/*filters*/ ctx[5] !== void 0) {
    		home_props.filters = /*filters*/ ctx[5];
    	}

    	if (/*state*/ ctx[4] !== void 0) {
    		home_props.state = /*state*/ ctx[4];
    	}

    	if (/*filtered_cards*/ ctx[1] !== void 0) {
    		home_props.filtered_cards = /*filtered_cards*/ ctx[1];
    	}

    	if (/*cached_cards*/ ctx[0] !== void 0) {
    		home_props.cached_cards = /*cached_cards*/ ctx[0];
    	}

    	if (/*info*/ ctx[8] !== void 0) {
    		home_props.info = /*info*/ ctx[8];
    	}

    	home = new Home({ props: home_props, $$inline: true });
    	binding_callbacks.push(() => bind(home, 'sort', home_sort_binding));
    	binding_callbacks.push(() => bind(home, 'collection_tags', home_collection_tags_binding));
    	binding_callbacks.push(() => bind(home, 'card_edited_alert', home_card_edited_alert_binding));
    	binding_callbacks.push(() => bind(home, 'due_count', home_due_count_binding));
    	binding_callbacks.push(() => bind(home, 'created_count', home_created_count_binding));
    	binding_callbacks.push(() => bind(home, 'username', home_username_binding));
    	binding_callbacks.push(() => bind(home, 'filters', home_filters_binding));
    	binding_callbacks.push(() => bind(home, 'state', home_state_binding));
    	binding_callbacks.push(() => bind(home, 'filtered_cards', home_filtered_cards_binding));
    	binding_callbacks.push(() => bind(home, 'cached_cards', home_cached_cards_binding));
    	binding_callbacks.push(() => bind(home, 'info', home_info_binding));

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			if (if_block2) if_block2.c();
    			t2 = space();
    			div2 = element("div");
    			create_component(home.$$.fragment);
    			set_style(div0, "display", !/*state*/ ctx[4].preview_mode ? 'block' : 'none', false);
    			add_location(div0, file, 111, 0, 4665);

    			set_style(
    				div1,
    				"display",
    				!/*state*/ ctx[4].preview_mode && !/*state*/ ctx[4].edit_mode
    				? 'block'
    				: 'none',
    				false
    			);

    			add_location(div1, file, 117, 0, 4907);

    			set_style(
    				div2,
    				"display",
    				!/*state*/ ctx[4].preview_mode && !/*state*/ ctx[4].edit_mode && !/*state*/ ctx[4].reviewing
    				? 'block'
    				: 'none',
    				false
    			);

    			add_location(div2, file, 123, 0, 5142);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			if (if_block1) if_block1.m(div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block2) if_block2.m(div1, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(home, div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*state*/ ctx[4].preview_mode && /*state*/ ctx[4].card_to_preview) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[4].edit_mode && /*state*/ ctx[4].card_to_edit) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*state*/ 16) {
    				set_style(div0, "display", !/*state*/ ctx[4].preview_mode ? 'block' : 'none', false);
    			}

    			if (/*state*/ ctx[4].reviewing && /*state*/ ctx[4].card_to_review != null) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*state*/ 16) {
    				set_style(
    					div1,
    					"display",
    					!/*state*/ ctx[4].preview_mode && !/*state*/ ctx[4].edit_mode
    					? 'block'
    					: 'none',
    					false
    				);
    			}

    			const home_changes = {};

    			if (!updating_sort && dirty[0] & /*sort*/ 64) {
    				updating_sort = true;
    				home_changes.sort = /*sort*/ ctx[6];
    				add_flush_callback(() => updating_sort = false);
    			}

    			if (!updating_collection_tags && dirty[0] & /*collection_tags*/ 128) {
    				updating_collection_tags = true;
    				home_changes.collection_tags = /*collection_tags*/ ctx[7];
    				add_flush_callback(() => updating_collection_tags = false);
    			}

    			if (!updating_card_edited_alert && dirty[0] & /*card_edited_alert*/ 4) {
    				updating_card_edited_alert = true;
    				home_changes.card_edited_alert = /*card_edited_alert*/ ctx[2];
    				add_flush_callback(() => updating_card_edited_alert = false);
    			}

    			if (!updating_due_count && dirty[0] & /*due_count*/ 512) {
    				updating_due_count = true;
    				home_changes.due_count = /*due_count*/ ctx[9];
    				add_flush_callback(() => updating_due_count = false);
    			}

    			if (!updating_created_count && dirty[0] & /*created_count*/ 1024) {
    				updating_created_count = true;
    				home_changes.created_count = /*created_count*/ ctx[10];
    				add_flush_callback(() => updating_created_count = false);
    			}

    			if (!updating_username && dirty[0] & /*username*/ 8) {
    				updating_username = true;
    				home_changes.username = /*username*/ ctx[3];
    				add_flush_callback(() => updating_username = false);
    			}

    			if (!updating_filters && dirty[0] & /*filters*/ 32) {
    				updating_filters = true;
    				home_changes.filters = /*filters*/ ctx[5];
    				add_flush_callback(() => updating_filters = false);
    			}

    			if (!updating_state && dirty[0] & /*state*/ 16) {
    				updating_state = true;
    				home_changes.state = /*state*/ ctx[4];
    				add_flush_callback(() => updating_state = false);
    			}

    			if (!updating_filtered_cards && dirty[0] & /*filtered_cards*/ 2) {
    				updating_filtered_cards = true;
    				home_changes.filtered_cards = /*filtered_cards*/ ctx[1];
    				add_flush_callback(() => updating_filtered_cards = false);
    			}

    			if (!updating_cached_cards && dirty[0] & /*cached_cards*/ 1) {
    				updating_cached_cards = true;
    				home_changes.cached_cards = /*cached_cards*/ ctx[0];
    				add_flush_callback(() => updating_cached_cards = false);
    			}

    			if (!updating_info && dirty[0] & /*info*/ 256) {
    				updating_info = true;
    				home_changes.info = /*info*/ ctx[8];
    				add_flush_callback(() => updating_info = false);
    			}

    			home.$set(home_changes);

    			if (dirty[0] & /*state*/ 16) {
    				set_style(
    					div2,
    					"display",
    					!/*state*/ ctx[4].preview_mode && !/*state*/ ctx[4].edit_mode && !/*state*/ ctx[4].reviewing
    					? 'block'
    					: 'none',
    					false
    				);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			destroy_component(home);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(106:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (104:0) {#if username === 'none'}
    function create_if_block(ctx) {
    	let login;
    	let updating_username;
    	let current;

    	function login_username_binding(value) {
    		/*login_username_binding*/ ctx[14](value);
    	}

    	let login_props = {};

    	if (/*username*/ ctx[3] !== void 0) {
    		login_props.username = /*username*/ ctx[3];
    	}

    	login = new Login({ props: login_props, $$inline: true });
    	binding_callbacks.push(() => bind(login, 'username', login_username_binding));

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const login_changes = {};

    			if (!updating_username && dirty[0] & /*username*/ 8) {
    				updating_username = true;
    				login_changes.username = /*username*/ ctx[3];
    				add_flush_callback(() => updating_username = false);
    			}

    			login.$set(login_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(104:0) {#if username === 'none'}",
    		ctx
    	});

    	return block;
    }

    // (108:0) {#if state.preview_mode && state.card_to_preview}
    function create_if_block_3(ctx) {
    	let review;
    	let updating_card;
    	let updating_state;
    	let current;

    	function review_card_binding(value) {
    		/*review_card_binding*/ ctx[15](value);
    	}

    	function review_state_binding(value) {
    		/*review_state_binding*/ ctx[16](value);
    	}

    	let review_props = { preview: "true" };

    	if (/*state*/ ctx[4].card_to_preview !== void 0) {
    		review_props.card = /*state*/ ctx[4].card_to_preview;
    	}

    	if (/*state*/ ctx[4] !== void 0) {
    		review_props.state = /*state*/ ctx[4];
    	}

    	review = new Review({ props: review_props, $$inline: true });
    	binding_callbacks.push(() => bind(review, 'card', review_card_binding));
    	binding_callbacks.push(() => bind(review, 'state', review_state_binding));

    	const block = {
    		c: function create() {
    			create_component(review.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(review, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const review_changes = {};

    			if (!updating_card && dirty[0] & /*state*/ 16) {
    				updating_card = true;
    				review_changes.card = /*state*/ ctx[4].card_to_preview;
    				add_flush_callback(() => updating_card = false);
    			}

    			if (!updating_state && dirty[0] & /*state*/ 16) {
    				updating_state = true;
    				review_changes.state = /*state*/ ctx[4];
    				add_flush_callback(() => updating_state = false);
    			}

    			review.$set(review_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(review.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(review.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(review, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(108:0) {#if state.preview_mode && state.card_to_preview}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {#if state.edit_mode && state.card_to_edit}
    function create_if_block_2(ctx) {
    	let edit;
    	let updating_card;
    	let updating_cached_cards;
    	let updating_card_edited_alert;
    	let updating_collection_tags;
    	let updating_state;
    	let current;

    	function edit_card_binding(value) {
    		/*edit_card_binding*/ ctx[17](value);
    	}

    	function edit_cached_cards_binding(value) {
    		/*edit_cached_cards_binding*/ ctx[18](value);
    	}

    	function edit_card_edited_alert_binding(value) {
    		/*edit_card_edited_alert_binding*/ ctx[19](value);
    	}

    	function edit_collection_tags_binding(value) {
    		/*edit_collection_tags_binding*/ ctx[20](value);
    	}

    	function edit_state_binding(value) {
    		/*edit_state_binding*/ ctx[21](value);
    	}

    	let edit_props = {};

    	if (/*state*/ ctx[4].card_to_edit !== void 0) {
    		edit_props.card = /*state*/ ctx[4].card_to_edit;
    	}

    	if (/*cached_cards*/ ctx[0] !== void 0) {
    		edit_props.cached_cards = /*cached_cards*/ ctx[0];
    	}

    	if (/*card_edited_alert*/ ctx[2] !== void 0) {
    		edit_props.card_edited_alert = /*card_edited_alert*/ ctx[2];
    	}

    	if (/*collection_tags*/ ctx[7] !== void 0) {
    		edit_props.collection_tags = /*collection_tags*/ ctx[7];
    	}

    	if (/*state*/ ctx[4] !== void 0) {
    		edit_props.state = /*state*/ ctx[4];
    	}

    	edit = new Edit({ props: edit_props, $$inline: true });
    	binding_callbacks.push(() => bind(edit, 'card', edit_card_binding));
    	binding_callbacks.push(() => bind(edit, 'cached_cards', edit_cached_cards_binding));
    	binding_callbacks.push(() => bind(edit, 'card_edited_alert', edit_card_edited_alert_binding));
    	binding_callbacks.push(() => bind(edit, 'collection_tags', edit_collection_tags_binding));
    	binding_callbacks.push(() => bind(edit, 'state', edit_state_binding));

    	const block = {
    		c: function create() {
    			create_component(edit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(edit, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const edit_changes = {};

    			if (!updating_card && dirty[0] & /*state*/ 16) {
    				updating_card = true;
    				edit_changes.card = /*state*/ ctx[4].card_to_edit;
    				add_flush_callback(() => updating_card = false);
    			}

    			if (!updating_cached_cards && dirty[0] & /*cached_cards*/ 1) {
    				updating_cached_cards = true;
    				edit_changes.cached_cards = /*cached_cards*/ ctx[0];
    				add_flush_callback(() => updating_cached_cards = false);
    			}

    			if (!updating_card_edited_alert && dirty[0] & /*card_edited_alert*/ 4) {
    				updating_card_edited_alert = true;
    				edit_changes.card_edited_alert = /*card_edited_alert*/ ctx[2];
    				add_flush_callback(() => updating_card_edited_alert = false);
    			}

    			if (!updating_collection_tags && dirty[0] & /*collection_tags*/ 128) {
    				updating_collection_tags = true;
    				edit_changes.collection_tags = /*collection_tags*/ ctx[7];
    				add_flush_callback(() => updating_collection_tags = false);
    			}

    			if (!updating_state && dirty[0] & /*state*/ 16) {
    				updating_state = true;
    				edit_changes.state = /*state*/ ctx[4];
    				add_flush_callback(() => updating_state = false);
    			}

    			edit.$set(edit_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(edit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(edit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(edit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(113:2) {#if state.edit_mode && state.card_to_edit}",
    		ctx
    	});

    	return block;
    }

    // (119:2) {#if state.reviewing && state.card_to_review!=null}
    function create_if_block_1(ctx) {
    	let review;
    	let updating_card_edited_alert;
    	let updating_state;
    	let updating_card;
    	let current;

    	function review_card_edited_alert_binding(value) {
    		/*review_card_edited_alert_binding*/ ctx[22](value);
    	}

    	function review_state_binding_1(value) {
    		/*review_state_binding_1*/ ctx[23](value);
    	}

    	function review_card_binding_1(value) {
    		/*review_card_binding_1*/ ctx[24](value);
    	}

    	let review_props = {};

    	if (/*card_edited_alert*/ ctx[2] !== void 0) {
    		review_props.card_edited_alert = /*card_edited_alert*/ ctx[2];
    	}

    	if (/*state*/ ctx[4] !== void 0) {
    		review_props.state = /*state*/ ctx[4];
    	}

    	if (/*state*/ ctx[4].card_to_review !== void 0) {
    		review_props.card = /*state*/ ctx[4].card_to_review;
    	}

    	review = new Review({ props: review_props, $$inline: true });
    	binding_callbacks.push(() => bind(review, 'card_edited_alert', review_card_edited_alert_binding));
    	binding_callbacks.push(() => bind(review, 'state', review_state_binding_1));
    	binding_callbacks.push(() => bind(review, 'card', review_card_binding_1));

    	const block = {
    		c: function create() {
    			create_component(review.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(review, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const review_changes = {};

    			if (!updating_card_edited_alert && dirty[0] & /*card_edited_alert*/ 4) {
    				updating_card_edited_alert = true;
    				review_changes.card_edited_alert = /*card_edited_alert*/ ctx[2];
    				add_flush_callback(() => updating_card_edited_alert = false);
    			}

    			if (!updating_state && dirty[0] & /*state*/ 16) {
    				updating_state = true;
    				review_changes.state = /*state*/ ctx[4];
    				add_flush_callback(() => updating_state = false);
    			}

    			if (!updating_card && dirty[0] & /*state*/ 16) {
    				updating_card = true;
    				review_changes.card = /*state*/ ctx[4].card_to_review;
    				add_flush_callback(() => updating_card = false);
    			}

    			review.$set(review_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(review.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(review.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(review, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(119:2) {#if state.reviewing && state.card_to_review!=null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let body;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*username*/ ctx[3] === 'none') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			body = element("body");
    			if_block.c();
    			attr_dev(body, "class", "svelte-hdfi12");
    			add_location(body, file, 102, 0, 4456);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			if_blocks[current_block_type_index].m(body, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(body, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			if_blocks[current_block_type_index].d();
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
    	let created_cards;
    	let due_cards;
    	let created_count;
    	let due_count;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let cached_cards = new Array(1).fill(dummy_card);
    	let filtered_cards = cached_cards;
    	let card_edited_alert = false;
    	let defer_load = true;
    	let collection_tags = [];
    	let username;

    	let state = {
    		card_to_edit: null,
    		edit_mode: false,
    		card_to_preview: null,
    		preview_mode: false,
    		card_to_review: null,
    		reviewing: false,
    		review_start: null
    	};

    	let filters = {
    		deleted: false,
    		search: '',
    		due: null,
    		new: null,
    		images: null,
    		audio: null,
    		tag: null,
    		card_type: '',
    		created_after: null,
    		created_before: null,
    		due_after: null,
    		due_before: null
    	};

    	let sort = 'recent';
    	let info = null;
    	let current_time = local_unix_day();
    	let cards_loaded = false;
    	let next_card;

    	async function refresh_cached_cards() {
    		// TODO we should pull cards from the db
    		// which match our criteria up to 300
    		if (!defer_load) {
    			$$invalidate(0, cached_cards = await fetch_cardlist(filters, sort));
    			$$invalidate(7, collection_tags = await get_collection_tags());
    		}
    	}

    	async function refresh_filtered_cards() {
    		if (!defer_load) {
    			$$invalidate(1, filtered_cards = cached_cards); //.filter((card) => filter_card(filters, card));

    			//const f = filtered_cards.sort((c1,c2) => {return c1.edit_seconds - c2.edit_seconds});
    			$$invalidate(2, card_edited_alert = false);

    			switch (sort) {
    				case 'recent':
    					filtered_cards.sort((c1, c2) => Math.max(c2.last_edit_date, c2.last_review_date) - Math.max(c1.last_edit_date, c1.last_review_date));
    					break;
    				case 'old':
    					filtered_cards.sort((c1, c2) => c1.create_date - c2.create_date);
    					break;
    				case 'meritorious':
    					filtered_cards.sort((c1, c2) => c2.merit - c1.merit);
    					break;
    				case 'edited':
    					filtered_cards.sort((c1, c2) => c1.last_edit_date - c2.last_edit_date);
    					break;
    				case 'reviewed':
    					filtered_cards.sort((c1, c2) => c1.last_review_date - c2.last_review_date);
    					break;
    				case 'random':
    					filtered_cards.sort(() => Math.random() - 0.5);
    					break;
    				case 'overdue':
    					filtered_cards.sort((c1, c2) => c1.due_date - c2.due_date);
    					break;
    				case 'total time':
    					filtered_cards.sort((c1, c2) => c2.total_seconds - c1.total_seconds);
    					break;
    			}
    		}
    	}

    	onMount(async () => {
    		set_guest_user();
    		$$invalidate(3, username = window.localStorage.getItem('username'));
    		defer_load = false;
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function login_username_binding(value) {
    		username = value;
    		$$invalidate(3, username);
    	}

    	function review_card_binding(value) {
    		if ($$self.$$.not_equal(state.card_to_preview, value)) {
    			state.card_to_preview = value;
    			(($$invalidate(4, state), $$invalidate(1, filtered_cards)), $$invalidate(11, next_card));
    		}
    	}

    	function review_state_binding(value) {
    		state = value;
    		(($$invalidate(4, state), $$invalidate(1, filtered_cards)), $$invalidate(11, next_card));
    	}

    	function edit_card_binding(value) {
    		if ($$self.$$.not_equal(state.card_to_edit, value)) {
    			state.card_to_edit = value;
    			(($$invalidate(4, state), $$invalidate(1, filtered_cards)), $$invalidate(11, next_card));
    		}
    	}

    	function edit_cached_cards_binding(value) {
    		cached_cards = value;
    		$$invalidate(0, cached_cards);
    	}

    	function edit_card_edited_alert_binding(value) {
    		card_edited_alert = value;
    		$$invalidate(2, card_edited_alert);
    	}

    	function edit_collection_tags_binding(value) {
    		collection_tags = value;
    		$$invalidate(7, collection_tags);
    	}

    	function edit_state_binding(value) {
    		state = value;
    		(($$invalidate(4, state), $$invalidate(1, filtered_cards)), $$invalidate(11, next_card));
    	}

    	function review_card_edited_alert_binding(value) {
    		card_edited_alert = value;
    		$$invalidate(2, card_edited_alert);
    	}

    	function review_state_binding_1(value) {
    		state = value;
    		(($$invalidate(4, state), $$invalidate(1, filtered_cards)), $$invalidate(11, next_card));
    	}

    	function review_card_binding_1(value) {
    		if ($$self.$$.not_equal(state.card_to_review, value)) {
    			state.card_to_review = value;
    			(($$invalidate(4, state), $$invalidate(1, filtered_cards)), $$invalidate(11, next_card));
    		}
    	}

    	function home_sort_binding(value) {
    		sort = value;
    		$$invalidate(6, sort);
    	}

    	function home_collection_tags_binding(value) {
    		collection_tags = value;
    		$$invalidate(7, collection_tags);
    	}

    	function home_card_edited_alert_binding(value) {
    		card_edited_alert = value;
    		$$invalidate(2, card_edited_alert);
    	}

    	function home_due_count_binding(value) {
    		due_count = value;
    		((($$invalidate(9, due_count), $$invalidate(12, due_cards)), $$invalidate(0, cached_cards)), $$invalidate(37, current_time));
    	}

    	function home_created_count_binding(value) {
    		created_count = value;
    		((($$invalidate(10, created_count), $$invalidate(13, created_cards)), $$invalidate(0, cached_cards)), $$invalidate(37, current_time));
    	}

    	function home_username_binding(value) {
    		username = value;
    		$$invalidate(3, username);
    	}

    	function home_filters_binding(value) {
    		filters = value;
    		$$invalidate(5, filters);
    	}

    	function home_state_binding(value) {
    		state = value;
    		(($$invalidate(4, state), $$invalidate(1, filtered_cards)), $$invalidate(11, next_card));
    	}

    	function home_filtered_cards_binding(value) {
    		filtered_cards = value;
    		$$invalidate(1, filtered_cards);
    	}

    	function home_cached_cards_binding(value) {
    		cached_cards = value;
    		$$invalidate(0, cached_cards);
    	}

    	function home_info_binding(value) {
    		info = value;
    		$$invalidate(8, info);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		dummy_card,
    		unix_seconds,
    		local_unix_day,
    		get_collection_tags,
    		set_guest_user,
    		fetch_cardlist,
    		filter_card,
    		get_next_due_card,
    		Home,
    		Edit,
    		Review,
    		Login,
    		cached_cards,
    		filtered_cards,
    		card_edited_alert,
    		defer_load,
    		collection_tags,
    		username,
    		state,
    		filters,
    		sort,
    		info,
    		current_time,
    		cards_loaded,
    		next_card,
    		refresh_cached_cards,
    		refresh_filtered_cards,
    		due_cards,
    		due_count,
    		created_cards,
    		created_count
    	});

    	$$self.$inject_state = $$props => {
    		if ('cached_cards' in $$props) $$invalidate(0, cached_cards = $$props.cached_cards);
    		if ('filtered_cards' in $$props) $$invalidate(1, filtered_cards = $$props.filtered_cards);
    		if ('card_edited_alert' in $$props) $$invalidate(2, card_edited_alert = $$props.card_edited_alert);
    		if ('defer_load' in $$props) defer_load = $$props.defer_load;
    		if ('collection_tags' in $$props) $$invalidate(7, collection_tags = $$props.collection_tags);
    		if ('username' in $$props) $$invalidate(3, username = $$props.username);
    		if ('state' in $$props) $$invalidate(4, state = $$props.state);
    		if ('filters' in $$props) $$invalidate(5, filters = $$props.filters);
    		if ('sort' in $$props) $$invalidate(6, sort = $$props.sort);
    		if ('info' in $$props) $$invalidate(8, info = $$props.info);
    		if ('current_time' in $$props) $$invalidate(37, current_time = $$props.current_time);
    		if ('cards_loaded' in $$props) cards_loaded = $$props.cards_loaded;
    		if ('next_card' in $$props) $$invalidate(11, next_card = $$props.next_card);
    		if ('due_cards' in $$props) $$invalidate(12, due_cards = $$props.due_cards);
    		if ('due_count' in $$props) $$invalidate(9, due_count = $$props.due_count);
    		if ('created_cards' in $$props) $$invalidate(13, created_cards = $$props.created_cards);
    		if ('created_count' in $$props) $$invalidate(10, created_count = $$props.created_count);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*cached_cards*/ 1) {
    			$$invalidate(13, created_cards = cached_cards.filter(card => card.create_date > Math.floor(current_time)));
    		}

    		if ($$self.$$.dirty[0] & /*cached_cards*/ 1) {
    			$$invalidate(12, due_cards = cached_cards.filter(card => card.due_date < current_time));
    		}

    		if ($$self.$$.dirty[0] & /*created_cards*/ 8192) {
    			$$invalidate(10, created_count = created_cards.length);
    		}

    		if ($$self.$$.dirty[0] & /*due_cards*/ 4096) {
    			$$invalidate(9, due_count = due_cards.length);
    		}

    		if ($$self.$$.dirty[0] & /*state, filtered_cards, next_card*/ 2066) {
    			if (state.reviewing && state.card_to_review === null) {
    				$$invalidate(4, state.review_start = unix_seconds(), state);
    				$$invalidate(11, next_card = get_next_due_card(filtered_cards));

    				if (next_card === null) {
    					$$invalidate(4, state.reviewing = false, state);
    				}

    				$$invalidate(4, state.card_to_review = next_card, state); // can be null
    			}
    		}

    		if ($$self.$$.dirty[0] & /*filters, sort*/ 96) {
    			{
    				({ ...filters });
    				refresh_cached_cards();
    			} // TODO should refresh cached cards
    		}

    		if ($$self.$$.dirty[0] & /*username*/ 8) {
    			(refresh_cached_cards());
    		}

    		if ($$self.$$.dirty[0] & /*cached_cards*/ 1) {
    			(refresh_filtered_cards());
    		}

    		if ($$self.$$.dirty[0] & /*card_edited_alert*/ 4) {
    			(refresh_filtered_cards());
    		}
    	};

    	return [
    		cached_cards,
    		filtered_cards,
    		card_edited_alert,
    		username,
    		state,
    		filters,
    		sort,
    		collection_tags,
    		info,
    		due_count,
    		created_count,
    		next_card,
    		due_cards,
    		created_cards,
    		login_username_binding,
    		review_card_binding,
    		review_state_binding,
    		edit_card_binding,
    		edit_cached_cards_binding,
    		edit_card_edited_alert_binding,
    		edit_collection_tags_binding,
    		edit_state_binding,
    		review_card_edited_alert_binding,
    		review_state_binding_1,
    		review_card_binding_1,
    		home_sort_binding,
    		home_collection_tags_binding,
    		home_card_edited_alert_binding,
    		home_due_count_binding,
    		home_created_count_binding,
    		home_username_binding,
    		home_filters_binding,
    		home_state_binding,
    		home_filtered_cards_binding,
    		home_cached_cards_binding,
    		home_info_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

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
