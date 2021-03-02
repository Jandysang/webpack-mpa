import React from 'react';
import { render } from 'react-dom';
import '../../style/demo2/index.less'
import idx from './index.tsx'

const a = new idx()

var myDivElement = <div className='abc' >Hello React!!! {a.name}</div>;

render(myDivElement, document.getElementById('app'));