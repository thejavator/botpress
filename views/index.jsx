import React from 'react'
import classnames from 'classnames'
import { Collapse, Button } from 'react-bootstrap'
import _ from 'lodash'

import IntentEditor from './intents'

import style from './style.scss'

export default class Module extends React.Component {
  state = {
    showNavIntents: true,
    intents: [],
    currentIntent: null,
    filterValue: '',
    syncNeeded: false
  }

  componentDidMount() {
    this.fetchIntents()

    this.syncInterval = setInterval(this.checkSync, 10000)
    this.checkSync()
  }

  componentWillUnmount() {
    clearInterval(this.syncInterval)
  }

  checkSync = () => {
    return this.props.bp.axios.get('/api/botpress-nlu/sync/check').then(res => {
      if (this.state.syncNeeded !== res.data) {
        console.log(res.data)
        this.setState({ syncNeeded: res.data })
      }
    })
  }

  fetchIntents = () => {
    return this.props.bp.axios.get('/api/botpress-nlu/intents').then(res => {
      const dataToSet = { intents: res.data }

      if (!this.state.currentIntent) {
        dataToSet.currentIntent = _.get(_.first(res.data), 'name')
      }

      this.setState(dataToSet)
    })
  }

  toggleProp = prop => () => {
    this.setState({ [prop]: !this.state[prop] })
  }

  getIntents = () => this.state.intents || []

  getCurrentIntent = () => _.find(this.getIntents(), { name: this.state.currentIntent })

  onFilterChanged = event => this.setState({ filterValue: event.target.value })

  setCurrentIntent = name => {
    if (this.state.currentIntent !== name) {
      if (this.intentEditor && this.intentEditor.onBeforeLeave) {
        if (this.intentEditor.onBeforeLeave() !== true) {
          return
        }
      }

      this.setState({ currentIntent: name })
    }
  }

  createNewIntent = () => {
    const name = prompt('Enter the name of the new intent')

    if (!name || !name.length) {
      return
    }

    if (/[^a-z0-9-_.]/i.test(name)) {
      alert('Invalid name, only alphanumerical characters, underscores and hypens are accepted')
      return this.createNewIntent()
    }

    return this.props.bp.axios
      .post(`/api/botpress-nlu/intents/${name}`, {
        utterances: [],
        entities: []
      })
      .then(this.fetchIntents)
      .then(() => this.setCurrentIntent(name))
  }

  renderCategory() {
    const intents = this.getIntents().filter(i => {
      if (this.state.filterValue.length) {
        return i.name.toLowerCase().includes(this.state.filterValue.toLowerCase())
      }

      return true
    })

    const caret = classnames(style.caret, {
      [style.inverted]: !this.state.showNavIntents
    })

    const getClassName = el =>
      classnames({
        [style.active]: this.getCurrentIntent() === el
      })

    return (
      <div>
        <div>
          <span>Intents ({intents.length})</span>
          <span className={caret} onClick={this.toggleProp('showNavIntents')}>
            <span className="caret" />
          </span>
        </div>
        <Collapse in={this.state.showNavIntents}>
          <ul>
            {intents.map(el => (
              <li className={getClassName(el)} onClick={() => this.setCurrentIntent(el.name)}>
                {el.name}&nbsp;({_.get(el, 'utterances.length') || 0})
              </li>
            ))}
          </ul>
        </Collapse>
      </div>
    )
  }

  render() {
    return (
      <div className={style.workspace}>
        <div>
          <div className={style.main}>
            <nav className={style.navigationBar}>
              <div className={style.filter}>
                <input
                  type="text"
                  value={this.state.filterValue}
                  placeholder="filter..."
                  onChange={this.onFilterChanged}
                />
              </div>
              <div className={style.list}>{this.renderCategory()}</div>

              <div className={style.create}>
                <Button bsStyle="primary" block onClick={this.createNewIntent}>
                  Create new intent
                </Button>
              </div>
              <div className={style.sync}>
                {this.state.syncNeeded && (
                  <div className={style.out}>Model is out of sync. Restart the bot to sync it.</div>
                )}
                {!this.state.syncNeeded && <div className={style.in}>Model is up to date</div>}
              </div>
            </nav>
            <div className={style.childContent}>
              <IntentEditor
                ref={el => (this.intentEditor = el)}
                intent={this.getCurrentIntent()}
                router={this.props.router}
                axios={this.props.bp.axios}
                reloadIntents={this.fetchIntents}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
