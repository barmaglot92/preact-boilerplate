// import * as React from 'react'
import { h, render } from 'preact'
import { appStore } from './stores'
import { action } from 'mobx'
import { Provider } from 'mobx-preact'
// import { render } from 'react-dom'

const stores = { appStore }

render(
  <Provider {...stores}>
    <span>Hello, world!</span>
  </Provider>,
  document.getElementById('root')!
)
