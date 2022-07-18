<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  function forward() {
          dispatch('click');
  }
  export let due_count = 0;
  $: due_count_plus = due_count + (due_count>=50 ? '+' : '');
</script>

<button type='button' on:click={forward}>
  <div id='review_text'>
          Review
    <svg id='svg_lamp' viewBox='10 30 300 330'>
          <path
             style="fill:none;stroke:#008000;stroke-width:4;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none"
             d="m 168.08981,266.41346 0,-196.733878"
             />
          <path
             style="fill:none;stroke:#008000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
             d="M 113.40393,266.41346 H 222.7757"
             />
          <rect
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1.07730699;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
             width="15.23763"
             height="15.23763"
             x="70.657272"
             y="252.84714"
             rx="0"
             ry="6.2100134"
             transform="matrix(0.49621774,-0.86819811,0.49621774,0.86819811,0,0)"
             />
          <path
             style="fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
             d="m 113.40393,266.41346 54.68588,-15.63159 54.68589,15.63159"
             />
          <circle
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
             cx="247.97658"
             cy="142.35379"
             r="4.0321393" />
          <circle
             r="4.0321393"
             cy="151.99362"
             cx="247.97658"
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
          <circle
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
             cx="247.97658"
             cy="161.63345"
             r="4.0321393" />
          <circle
             r="4.0321393"
             cy="171.27328"
             cx="247.97658"
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
          <circle
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
             cx="247.97658"
             cy="180.91312"
             r="4.0321393" />
          <circle
             r="4.0321393"
             cy="190.55295"
             cx="247.97658"
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
          <path
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1.75496578;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
             r="7.0762668"
             cy="203.25423"
             cx="247.97658" />
          <path
             style="fill:#008000;stroke:#008000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1"
             d="m 39.769243,134.97217 c 4.692467,4.30517 252.308817,3.945 256.641117,0 4.3323,-3.945 -13.34213,-49.792447 -33.81729,-58.573276 -20.47516,-8.780829 -171.052555,-9.140997 -189.006528,0 C 55.632569,85.539891 35.076776,130.667 39.769243,134.97217 Z"
             />
          <rect
             transform="matrix(0.49621774,-0.86819811,0.49621774,0.86819811,0,0)"
             ry="6.2100134"
             rx="0"
             y="267.24478"
             x="56.259636"
             height="15.23763"
             width="15.23763"
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1.07730699;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
          <rect
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1.07730699;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
             width="15.23763"
             height="15.23763"
             x="41.862"
             y="281.64243"
             rx="0"
             ry="6.2100134"
             transform="matrix(0.49621774,-0.86819811,0.49621774,0.86819811,0,0)"
             />
          <rect
             transform="matrix(0.49621774,-0.86819811,0.49621774,0.86819811,0,0)"
             ry="6.2100134"
             rx="0"
             y="296.04007"
             x="27.464363"
             height="15.23763"
             width="15.23763"
             style="opacity:1;fill:#008000;fill-opacity:1;stroke:#008000;stroke-width:1.07730699;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" />
  </svg>
  </div>
  <div id='due_count'>{due_count_plus} cards due</div>
</button>


<style>
  #svg_lamp {
    display: inline;
    height: 2em;
    /*
    border: 1px solid black;
    */
    vertical-align: middle;
  }
  button {
    color: green;
    border: 2px green solid;
    position: relative;
    margin: 6px;
  }
  #review_text {
    font-size: 2em;
    font-family: "Times New Roman", Times, Serif;
    padding: 24px;
  }
  #due_count {
    font-size: 1em;
    position: absolute;
    display: block;
    width: 100%;
    bottom: 6px;
  }
</style>
