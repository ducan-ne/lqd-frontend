import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './index.css'
import { initializeIcons } from '@uifabric/icons'

initializeIcons()

ReactDOM.render(<App />, document.getElementById('root'))
