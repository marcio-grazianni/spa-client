import {render} from 'react-dom'
import React from 'react'
import TestimonialPage from './profile-page/profile-page'

var myNode = document.getElementById('react');
while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
}
render(<TestimonialPage/>, document.getElementById('react'));
