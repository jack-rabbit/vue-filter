// https://forum.vuejs.org/t/possible-or-advisable-to-have-dynamic-components-in-vue-router/16116/2

import Glitch from './Glitch'
import Jello from './Jello'
import TonalNoise from './TonalNoise'

// collect comonents in a object since we can't use local registration in a functional component.
const components = {
    Glitch,
    Jello,
    TonalNoise
}

export default {
    functional: true,
    props: ['filter'],
    render(h, ctx) {
        return h(components[ctx.props.filter], ctx.data, ctx.children)
    }
}