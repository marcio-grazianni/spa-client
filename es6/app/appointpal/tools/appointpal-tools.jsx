import React, {Component} from 'react'
import {branch} from 'baobab-react/higher-order'
import {Header} from './header'
import {CreditCard} from './credit-card'
import {Invoice} from './invoice'
import {Notes} from './notes'
import {Review} from './review'
import {PatientIntake} from './intake'

@branch({
})
class AppointpalTools extends Component {
  _renderAppointpalTools() {
   return (
      <div className='right tools'>
          <Header />
          <div className='messaging-tools'>
              <ul className='tools-list'>
                  <CreditCard />
                  <Invoice />
                  <PatientIntake />
                  <Review />
                  <Notes />
               </ul>
          </div>
      </div>
    );
  }
  render() {
    return (
      ::this._renderAppointpalTools()
    );
  }
}

export { AppointpalTools };