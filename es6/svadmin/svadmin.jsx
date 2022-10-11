import React, {Component} from 'react'
import {root, branch} from 'baobab-react/higher-order'
import tree from './state'
import {Locations as Router, Location, Link, NotFound} from 'react-router-component'
import {CreateForm} from './creation/create-form'
import {UploadCSV} from './upload-csv/upload-csv'
import {UpdateForm} from './update/update-form'
import {initialLoad} from './actions'

class NotFoundPage extends Component { //Avoid Namespace Collision
 render() {
    return (
      <div>Not Found
      </div>
    );
  }
}

@branch({})
class SVAdminInner extends Component {
  componentDidMount() {
    this.props.dispatch(initialLoad);
  }
  _onBeforeNavigation() {

  }
  render() {
    return(
      <div className='sv-admin'>
        <ul className='sv-admin-nav'>
          <li>
            <Link id='create' href='/svAdmin/new/'>Create</Link>
          </li>
          <li>
            <Link id='upload' href='/svAdmin/new/upload/'>Upload</Link>
          </li>
          <li>
            <Link id='update' href='/svAdmin/new/update/'>Update</Link>
          </li>
        </ul>
        <Router ref="router" onBeforeNavigation={::this._onBeforeNavigation}>
          <Location key='create' path="/svAdmin/new/" handler={CreateForm} />
          <Location key='upload' path="/svAdmin/new/upload/" handler={UploadCSV} />
          <Location key='update' path="/svAdmin/new/update/" handler={UpdateForm} />
          <NotFound key='not-found' handler={NotFoundPage} />
        </Router>
      </div>
    );
  }
}

class SVAdmin extends Component {
  render() {
    return(
      <SVAdminInner />
    );
  }
}

const RootedSVAdmin = root(tree, SVAdmin);

module.exports = RootedSVAdmin;
