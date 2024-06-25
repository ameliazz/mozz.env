import { assert, describe, test } from 'poku'
import Mozz from '../source/main'

const Enhancer = new Mozz()

describe('Testing Mozz enhance')

test(() => {
    assert.equal(
        Enhancer.env.awesomeTestVariable,
        'Hello World!',
        'Get a variable from Mozz environment'
    )
})
